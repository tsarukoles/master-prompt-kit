import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROOT_FILES = new Set([
  '.gitignore', '.gitattributes', 'README.md', 'START-HERE.md', 'LICENSE',
  'CHANGELOG.md', 'GLOSSARY.md', 'VALIDATION.md', 'CONTRIBUTING.md', 'SECURITY.md', 'package.json',
]);
const MODULES = new Set([
  'intake', 'architecture', 'agents', 'workflows', 'vault', 'safety', 'integrations',
  'adapters', 'starter', 'examples', 'harness', 'schemas', 'tools', '.github',
  'testing', 'delivery', 'tooling', 'sectors', 'checklists',
]);
const EXCLUDED_ROOTS = new Set(['.git', 'dist', 'releases', 'node_modules']);
const TEXT_EXTENSION = /\.(?:md|mjs|js|ts|json|yaml|yml|sql|txt|sh|ps1)(?:\.template)?$/i;
const SENSITIVE_PATH = /(?:^|\/)(?:\.env(?:\.[^/]*)?|credentials(?:\.[^/]*)?|id_rsa(?:\.[^/]*)?|[^/]*\.(?:pem|key|pfx|p12|sqlite|db|zip|tgz)|private|customer-data)(?:\/|$)/i;
const SENSITIVE_CONTENT = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{50,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
];
const utf8 = new TextDecoder('utf-8', { fatal: true });
export const order = (a, b) => a < b ? -1 : a > b ? 1 : 0;

// Fixed source roots and text formats avoid accidentally packaging workspaces,
// database snapshots, old archives, runtime output or local credential files.
export function collectSource(root = ROOT) {
  const files = [];
  const walk = (dir, prefix = '') => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => order(a.name, b.name))) {
      if (!prefix && EXCLUDED_ROOTS.has(entry.name)) continue;
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isSymbolicLink()) throw new Error(`Symlink is outside the source contract: ${rel}`);
      if (!prefix && entry.name === 'MANIFEST.json') {
        if (!entry.isFile()) throw new Error('MANIFEST.json must be a regular generated file');
        continue; // Checked against the source below; never copied into another manifest.
      }
      if (SENSITIVE_PATH.test(rel)) throw new Error(`Sensitive or binary path is not allowed: ${rel}`);
      if (!prefix && !ROOT_FILES.has(entry.name) && !MODULES.has(entry.name)) {
        throw new Error(`Unreviewed source root: ${rel}; update the explicit allowlist after review`);
      }
      if (entry.isDirectory()) {
        if (!prefix && !MODULES.has(entry.name)) throw new Error(`Expected a file: ${rel}`);
        if (prefix && entry.name.startsWith('.')) throw new Error(`Unreviewed hidden directory: ${rel}`);
        walk(path.join(dir, entry.name), rel);
        continue;
      }
      if (!entry.isFile()) throw new Error(`Not a regular source file: ${rel}`);
      if (!prefix && !ROOT_FILES.has(entry.name)) throw new Error(`Expected a module directory: ${rel}`);
      const fictionalTap = rel.startsWith('examples/verifier-challenges/') && entry.name.endsWith('.tap');
      if (prefix && !TEXT_EXTENSION.test(entry.name) && entry.name !== '.gitignore' && !fictionalTap) {
        throw new Error(`Unreviewed source format: ${rel}`);
      }
      if (rel.startsWith('.github/') && !/^\.github\/workflows\/(?:ci|release)\.yml$/.test(rel)) {
        throw new Error(`Unreviewed GitHub configuration: ${rel}`);
      }
      const data = fs.readFileSync(path.join(root, rel));
      if (data.length > 1024 * 1024) throw new Error(`Source exceeds 1 MiB: ${rel}`);
      let text;
      try { text = utf8.decode(data).replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n'); }
      catch { throw new Error(`Source is not UTF-8 text: ${rel}`); }
      if (text.includes('\0')) throw new Error(`Binary content is not allowed: ${rel}`);
      if (SENSITIVE_CONTENT.some(pattern => pattern.test(text))) {
        throw new Error(`Possible credential found in ${rel}; inspect locally without printing it`);
      }
      files.push({ path: rel, data: Buffer.from(text, 'utf8') });
    }
  };
  walk(root);
  return files.sort((a, b) => order(a.path, b.path));
}

export function versionFrom(files) {
  const file = files.find(item => item.path === 'package.json');
  if (!file) throw new Error('Missing package.json');
  const pkg = JSON.parse(file.data.toString('utf8'));
  if (pkg.name !== 'master-prompt-kit' || !/^\d+\.\d+\.\d+(?:-[A-Za-z0-9.-]+)?$/.test(pkg.version)) {
    throw new Error('Expected master-prompt-kit with a semantic version');
  }
  return pkg.version;
}

function withoutCode(markdown) {
  return markdown.replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, '').replace(/`[^`\n]+`/g, '');
}

function anchors(markdown) {
  const ids = new Set();
  const counts = new Map();
  const headings = markdown.replace(/^\s*(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\s*\1\s*$/gm, '').replaceAll('`', '');
  for (const match of headings.matchAll(/^#{1,6}\s+(.+?)\s*#*\s*$/gm)) {
    const base = match[1].replace(/<[^>]+>/g, '').toLowerCase()
      .replace(/[^\p{L}\p{N}_\- ]/gu, '').replaceAll(' ', '-');
    const count = counts.get(base) ?? 0;
    ids.add(count ? `${base}-${count}` : base);
    counts.set(base, count + 1);
  }
  for (const match of markdown.matchAll(/\bid=["']([^"']+)["']/g)) ids.add(match[1]);
  return ids;
}

// This checks explicit Markdown links, local module imports and JSON references.
// It deliberately performs no network requests and is not a complete secret scanner.
export function checkSource(files) {
  const issues = [];
  const byPath = new Map(files.map(file => [file.path, file.data.toString('utf8')]));
  const checkTarget = (from, raw, { fragment = true } = {}) => {
    if (/^(?:https?:|mailto:|tel:|urn:)/i.test(raw)) return;
    let target;
    try { target = decodeURIComponent(raw); }
    catch { issues.push(`${from}: invalid URL encoding in ${raw}`); return; }
    const [name, id] = target.split('#', 2);
    if (/^[A-Za-z][A-Za-z0-9+.-]*:|^[/\\]/.test(name)) {
      issues.push(`${from}: unsupported absolute reference ${raw}`); return;
    }
    const local = name ? path.posix.normalize(path.posix.join(path.posix.dirname(from), name.split('?')[0])) : from;
    if (local === '..' || local.startsWith('../')) {
      issues.push(`${from}: reference escapes kit: ${raw}`); return;
    }
    const exists = byPath.has(local) || [...byPath.keys()].some(file => file.startsWith(`${local.replace(/\/$/, '')}/`));
    if (!exists) { issues.push(`${from}: missing local target ${raw}`); return; }
    if (fragment && id && local.endsWith('.md') && byPath.has(local) && !anchors(byPath.get(local)).has(id)) {
      issues.push(`${from}: missing Markdown anchor ${raw}`);
    }
  };
  for (const [rel, content] of byPath) {
    if (rel.endsWith('.json')) {
      try {
        const value = JSON.parse(content);
        const visit = object => {
          if (!object || typeof object !== 'object') return;
          if (typeof object.$ref === 'string') checkTarget(rel, object.$ref, { fragment: false });
          for (const child of Object.values(object)) visit(child);
        };
        visit(value);
      } catch (error) { issues.push(`${rel}: invalid JSON (${error.message})`); }
    }
    if (/\.md(?:\.template)?$/.test(rel)) {
      const prose = withoutCode(content);
      for (const match of prose.matchAll(/!?\[[^\]\n]*\]\(\s*(?:<([^>\n]+)>|([^\s)]+))(?:\s+["'][^\n]*["'])?\s*\)/g)) {
        checkTarget(rel, match[1] ?? match[2]);
      }
      for (const match of prose.matchAll(/^\s*\[[^\]\n]+\]:\s*<?([^\s>]+)>?/gm)) checkTarget(rel, match[1]);
    }
    if (/\.(?:mjs|js|ts)$/.test(rel)) {
      for (const match of content.matchAll(/\b(?:from\s*|import\s*\(?)['"](\.[^'"]+)['"]/g)) {
        checkTarget(rel, match[1], { fragment: false });
      }
    }
  }
  try { versionFrom(files); } catch (error) { issues.push(error.message); }
  return issues;
}

export function verifySource(root = ROOT) {
  const files = collectSource(root);
  const issues = checkSource(files);
  const manifestPath = path.join(root, 'MANIFEST.json');
  if (fs.existsSync(manifestPath)) {
    try { checkManifest(files, fs.readFileSync(manifestPath, 'utf8')); }
    catch (error) { issues.push(error.message); }
  }
  if (issues.length) throw new Error(`Source validation failed:\n${issues.map(issue => `- ${issue}`).join('\n')}`);
  return files;
}

export function checkManifest(files, text) {
  const manifest = JSON.parse(text.replace(/^\uFEFF/, ''));
  if (manifest.format !== 1 || manifest.name !== 'master-prompt-kit' || manifest.version !== versionFrom(files)) {
    throw new Error('MANIFEST.json identity/version does not match this kit');
  }
  const expected = [...files].sort((a, b) => order(a.path, b.path)).map(file => ({
    path: file.path,
    bytes: file.data.length,
    sha256: createHash('sha256').update(file.data).digest('hex'),
  }));
  if (!Array.isArray(manifest.files) || manifest.files.length !== expected.length) {
    throw new Error('MANIFEST.json payload list does not match the collected source');
  }
  for (let index = 0; index < expected.length; index++) {
    const entry = manifest.files[index];
    const actual = expected[index];
    if (!entry || entry.path !== actual.path || entry.bytes !== actual.bytes || entry.sha256 !== actual.sha256) {
      throw new Error(`MANIFEST.json file/hash mismatch at ${actual.path}; this copy differs from the packaged payload`);
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const files = verifySource();
    console.log(`Checked ${files.length} source files: allowed paths/text, local Markdown links, JSON and local module references.`);
    console.log('External URLs, live adapters, company-data classification and AI judgment still require their own review.');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
