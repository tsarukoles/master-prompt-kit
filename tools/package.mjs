import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ROOT, order, verifySource, versionFrom } from './check.mjs';

const sha256 = data => createHash('sha256').update(data).digest('hex');
const crcTable = Array.from({ length: 256 }, (_, value) => {
  for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
export function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

// ZIP method 0 (stored) needs no dependency or host-specific compression tool.
// Fixed timestamps, permissions, UTF-8 names and sorted entries make it repeatable.
export function storedZip(entries) {
  if (entries.length > 65535) throw new Error('ZIP32 entry limit exceeded');
  const local = [];
  const central = [];
  const names = new Set();
  let offset = 0;
  for (const entry of [...entries].sort((a, b) => order(a.path, b.path))) {
    if (!/^master-prompt-kit\//.test(entry.path) || entry.path.includes('\\') || entry.path.split('/').some(part => part === '..' || !part)) {
      throw new Error(`Unsafe archive path: ${entry.path}`);
    }
    if (names.has(entry.path)) throw new Error(`Duplicate archive path: ${entry.path}`);
    names.add(entry.path);
    const name = Buffer.from(entry.path, 'utf8');
    const data = Buffer.from(entry.data);
    if (name.length > 65535 || data.length > 0xffffffff) throw new Error('ZIP32 size limit exceeded');
    const crc = crc32(data);
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x800, 6);
    header.writeUInt16LE(33, 12); // 1980-01-01, 00:00:00
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(data.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(name.length, 26);
    local.push(header, name, data);
    const directory = Buffer.alloc(46);
    directory.writeUInt32LE(0x02014b50, 0);
    directory.writeUInt16LE(0x0314, 4);
    directory.writeUInt16LE(20, 6);
    directory.writeUInt16LE(0x800, 8);
    directory.writeUInt16LE(33, 14);
    directory.writeUInt32LE(crc, 16);
    directory.writeUInt32LE(data.length, 20);
    directory.writeUInt32LE(data.length, 24);
    directory.writeUInt16LE(name.length, 28);
    directory.writeUInt32LE((0o100644 << 16) >>> 0, 38);
    directory.writeUInt32LE(offset, 42);
    central.push(directory, name);
    offset += header.length + name.length + data.length;
    if (offset > 0xffffffff) throw new Error('ZIP32 size limit exceeded');
  }
  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, directory, end]);
}

export function makePackage(files) {
  const version = versionFrom(files);
  const manifest = {
    format: 1,
    name: 'master-prompt-kit',
    version,
    status: 'expanded-pilot-prerelease',
    encoding: 'UTF-8; line endings normalized to LF',
    note: 'Paths are relative to master-prompt-kit/. This list covers every payload file except this generated MANIFEST.json. The release checksum covers the complete ZIP.',
    files: [...files].sort((a, b) => order(a.path, b.path)).map(file => ({
      path: file.path, bytes: file.data.length, sha256: sha256(file.data),
    })),
  };
  const entries = files.map(file => ({ path: `master-prompt-kit/${file.path}`, data: file.data }));
  entries.push({ path: 'master-prompt-kit/MANIFEST.json', data: Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`) });
  const zip = storedZip(entries);
  const filename = `master-prompt-kit-${version}.zip`;
  return { version, filename, zip, checksum: `${sha256(zip)}  ${filename}\n`, manifest };
}

function writeRegular(target, data) {
  let stat;
  try { stat = fs.lstatSync(target); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (stat && !stat.isFile()) throw new Error(`Output is not a regular file: ${target}`);
  fs.writeFileSync(target, data);
}

export function packageSource(root = ROOT, { requireClean = false } = {}) {
  if (requireClean) {
    const dirty = execFileSync('git', ['status', '--porcelain', '--untracked-files=all'], { cwd: root, encoding: 'utf8' }).trim();
    if (dirty) throw new Error('Release packaging requires a clean checkout, including untracked source files');
  }
  const files = verifySource(root);
  const result = makePackage(files);
  const dist = path.join(root, 'dist');
  if (fs.existsSync(dist) && (!fs.lstatSync(dist).isDirectory() || fs.lstatSync(dist).isSymbolicLink())) {
    throw new Error('dist must be a regular directory inside this repository');
  }
  fs.mkdirSync(dist, { recursive: true });
  writeRegular(path.join(dist, result.filename), result.zip);
  writeRegular(path.join(dist, `SHA256SUMS-master-prompt-kit-${result.version}.txt`), result.checksum);
  return result;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.some(arg => arg !== '--require-clean')) throw new Error('Usage: node tools/package.mjs [--require-clean]');
    const result = packageSource(ROOT, { requireClean: args.includes('--require-clean') });
    console.log(`Packaged ${result.manifest.files.length} source files and MANIFEST.json into dist/${result.filename}`);
    console.log(result.checksum.trim());
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
