import { pathToFileURL } from 'node:url';
/** A small review signal, not a semantic test reviewer or universal file firewall. */
export function assessEdit(input, { protectedPaths = [] } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input) ||
      Object.keys(input).some(k => !['path', 'before', 'after'].includes(k)) ||
      !['path', 'before', 'after'].every(k => typeof input[k] === 'string') || !input.path.trim()) {
    throw new TypeError('Expected exactly path, before, and after strings.');
  }
  if (input.before.length + input.after.length > 500000) throw new Error('Edit exceeds review size limit.');
  const reasons = [];
  const count = (text, pattern) => [...text.matchAll(pattern)].length;
  if (protectedPaths.includes(input.path)) reasons.push('Protected file needs review.');
  if (count(input.after, /\.only\s*\(/g) > count(input.before, /\.only\s*\(/g)) reasons.push('New focused test needs review.');
  if (count(input.after, /\.skip\s*\(/g) > count(input.before, /\.skip\s*\(/g)) reasons.push('New skipped test needs review.');
  if (count(input.after, /\b(?:expect|assert)\s*[.(]/g) < count(input.before, /\b(?:expect|assert)\s*[.(]/g)) reasons.push('Assertion count decreased; inspect behavior.');
  for (const guard of ['runIfEnv', 'guardAction', 'envGuard']) {
    if (input.before.includes(guard) && !input.after.includes(guard)) reasons.push(`Removed ${guard} reference needs review.`);
  }
  return { decision: reasons.length ? 'review' : 'allow', reasons };
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let input = '';
  try {
    for await (const chunk of process.stdin) {
      input += chunk;
      if (input.length > 600000) throw new Error('Input too large.');
    }
    const result = assessEdit(JSON.parse(input));
    process.stdout.write(JSON.stringify(result) + '\n');
    process.exitCode = result.decision === 'allow' ? 0 : 2;
  } catch {
    process.stdout.write(JSON.stringify({ decision: 'review', reasons: ['Malformed or oversized edit input.'] }) + '\n');
    process.exitCode = 2;
  }
}
