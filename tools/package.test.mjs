import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { collectSource, checkSource, verifySource } from './check.mjs';
import { crc32, makePackage, storedZip } from './package.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-release-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.writeFileSync(path.join(root, 'package.json'), '{"name":"master-prompt-kit","version":"0.2.0"}\r\n');
  return root;
}

function readStoredZip(data) {
  const files = new Map();
  let offset = 0;
  while (data.readUInt32LE(offset) === 0x04034b50) {
    assert.equal(data.readUInt16LE(offset + 8), 0);
    const size = data.readUInt32LE(offset + 18);
    const nameLength = data.readUInt16LE(offset + 26);
    const extraLength = data.readUInt16LE(offset + 28);
    const name = data.subarray(offset + 30, offset + 30 + nameLength).toString('utf8');
    const start = offset + 30 + nameLength + extraLength;
    const contents = data.subarray(start, start + size);
    assert.equal(crc32(contents), data.readUInt32LE(offset + 14));
    files.set(name, contents);
    offset = start + size;
  }
  const end = data.length - 22;
  assert.equal(data.readUInt32LE(end), 0x06054b50);
  assert.equal(data.readUInt16LE(end + 10), files.size);
  assert.equal(data.readUInt32LE(end + 16), offset);
  return files;
}

test('package is deterministic, extractable and covers every payload with a hash', t => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'README.md'), '# Kit\r\n\r\n[Start](START-HERE.md)\r\n');
  fs.writeFileSync(path.join(root, 'START-HERE.md'), '# Start\r\n');
  const source = collectSource(root);
  assert.deepEqual(checkSource(source), []);
  const first = makePackage(source);
  const second = makePackage([...source].reverse());
  assert.deepEqual(first.zip, second.zip);
  const extracted = readStoredZip(first.zip);
  const manifest = JSON.parse(extracted.get('master-prompt-kit/MANIFEST.json'));
  assert.equal(extracted.size, source.length + 1);
  for (const file of manifest.files) {
    const contents = extracted.get(`master-prompt-kit/${file.path}`);
    assert.equal(contents.length, file.bytes);
    assert.equal(createHash('sha256').update(contents).digest('hex'), file.sha256);
    assert.ok(!contents.includes(13), 'packaged text uses LF on all hosts');
  }
  assert.equal(first.checksum, `${createHash('sha256').update(first.zip).digest('hex')}  master-prompt-kit-0.2.0.zip\n`);
  assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926);
});

test('source scope excludes metadata/builds and rejects unknown roots and credentials', t => {
  const root = fixture(t);
  for (const name of ['.git', 'dist', 'releases', 'node_modules']) {
    fs.mkdirSync(path.join(root, name));
    fs.writeFileSync(path.join(root, name, 'not-for-release.txt'), 'excluded');
  }
  assert.deepEqual(collectSource(root).map(file => file.path), ['package.json']);
  fs.writeFileSync(path.join(root, 'private-notes.md'), 'unreviewed');
  assert.throws(() => collectSource(root), /Unreviewed source root/);
  fs.unlinkSync(path.join(root, 'private-notes.md'));
  fs.mkdirSync(path.join(root, 'vault'));
  fs.writeFileSync(path.join(root, 'vault', '.env'), 'do not read');
  assert.throws(() => collectSource(root), /Sensitive or binary path/);
  fs.unlinkSync(path.join(root, 'vault', '.env'));
  fs.writeFileSync(path.join(root, 'vault', 'notes.md'), '-----BEGIN ' + 'PRIVATE KEY-----');
  assert.throws(() => collectSource(root), /Possible credential/);
});

test('source rejects directory symlinks before traversing them', t => {
  const root = fixture(t);
  const outside = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-outside-test-'));
  t.after(() => fs.rmSync(outside, { recursive: true, force: true }));
  try { fs.symlinkSync(outside, path.join(root, 'vault'), process.platform === 'win32' ? 'junction' : 'dir'); }
  catch (error) {
    if (error.code !== 'EPERM' && error.code !== 'EACCES') throw error;
    t.skip('Host denies creating directory symlinks; this rejection path is unverified on this host');
    return;
  }
  assert.throws(() => collectSource(root), /Symlink/);
});

test('local references detect missing targets and anchors, escaped paths and malformed JSON', t => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'README.md'), '# Kit\n[Missing](gone.md)\n[Bad anchor](START-HERE.md#missing)\n[Escape](../private.md)\n');
  fs.writeFileSync(path.join(root, 'START-HERE.md'), '# Start\n');
  fs.mkdirSync(path.join(root, 'schemas'));
  fs.writeFileSync(path.join(root, 'schemas', 'bad.json'), '{broken');
  const errors = checkSource(collectSource(root));
  for (const phrase of ['missing local target', 'missing Markdown anchor', 'reference escapes kit', 'invalid JSON']) {
    assert.ok(errors.some(error => error.includes(phrase)), phrase);
  }
});

test('archive rejects traversal and duplicate entries', () => {
  assert.throws(() => storedZip([{ path: 'master-prompt-kit/../escape', data: Buffer.alloc(0) }]), /Unsafe archive path/);
  const entry = { path: 'master-prompt-kit/README.md', data: Buffer.alloc(0) };
  assert.throws(() => storedZip([entry, entry]), /Duplicate archive path/);
});

test('an extracted kit verifies its generated manifest and rejects changed payload', t => {
  const original = fixture(t);
  fs.writeFileSync(path.join(original, 'README.md'), '# Kit\n');
  const packaged = makePackage(collectSource(original));
  const extracted = fixture(t);
  for (const [name, contents] of readStoredZip(packaged.zip)) {
    const relative = name.slice('master-prompt-kit/'.length);
    const target = path.join(extracted, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  }
  const verified = verifySource(extracted);
  assert.equal(verified.length, packaged.manifest.files.length);
  assert.ok(!verified.some(file => file.path === 'MANIFEST.json'));
  assert.deepEqual(makePackage(verified).zip, packaged.zip);
  fs.writeFileSync(path.join(extracted, 'README.md'), '# Changed\n');
  assert.throws(() => verifySource(extracted), /MANIFEST.json file\/hash mismatch/);
});
