import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Regenerates only fictional local evidence. c05 is deliberately failing/stale.
for (const id of ['c01', 'c02', 'c03', 'c04', 'c05', 'c06']) {
  const directory = fileURLToPath(new URL(`./${id}/`, import.meta.url));
  const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', 'candidate.mjs'], {
    cwd: directory, encoding: 'utf8', timeout: 10000, env: { ...process.env, NODE_OPTIONS: '' }
  });
  if (result.error || result.signal) throw result.error ?? new Error(`Failed to capture ${id}`);
  const revision = id === 'c05' ? 'fixture-c05-previous' : `fixture-${id}`;
  // Native failure stacks may contain an absolute workspace path. Keep fixture evidence portable.
  const portable = result.stdout.replaceAll(directory.replaceAll('\\', '\\\\'), './')
    .replaceAll(`file:///${directory.replaceAll('\\', '/')}`, './')
    .replaceAll(directory.replaceAll('\\', '/'), './')
    .replaceAll(directory, './');
  writeFileSync(new URL(`./${id}/native.tap`, import.meta.url),
    `# Fictional fixture evidence. sourceRevision: ${revision}; target: local-synthetic\n${portable}`);
  process.stdout.write(`${id}: native exit ${result.status}\n`);
}
