import { createHash } from 'node:crypto';
import { lstat, mkdir, open, readFile } from 'node:fs/promises';
import path from 'node:path';

const keys = ['action', 'decision', 'summary', 'taskId'];
const decisions = new Set(['approved', 'changes-requested', 'deferred']);

function validate(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('Request must be an object.');
  }
  const actual = Object.keys(input).sort();
  if (actual.length !== keys.length || actual.some((key, i) => key !== keys[i])) {
    throw new TypeError('Request must contain only action, decision, summary, and taskId.');
  }
  if (input.action !== 'write-review-note') throw new TypeError('Unsupported action.');
  if (typeof input.taskId !== 'string' || !/^[a-z][a-z0-9-]{0,39}$/.test(input.taskId)) {
    throw new TypeError('Invalid taskId.');
  }
  if (!decisions.has(input.decision)) throw new TypeError('Invalid decision.');
  if (typeof input.summary !== 'string' || input.summary.length < 1 || input.summary.length > 500 ||
      /[\u0000-\u001f\u007f]/.test(input.summary)) {
    throw new TypeError('Summary must be 1–500 characters without control characters.');
  }
}

/** The trusted host chooses root; it is not part of the AI tool input. */
export function createReviewNoteTool(root) {
  if (typeof root !== 'string' || !path.isAbsolute(root)) {
    throw new TypeError('Host must supply an absolute output root.');
  }
  return async function writeReviewNote(input) {
    validate(input);
    const rootInfo = await lstat(root);
    if (!rootInfo.isDirectory() || rootInfo.isSymbolicLink()) {
      throw new Error('Output root must be a real directory.');
    }
    const notesDir = path.join(root, 'review-notes');
    try {
      await mkdir(notesDir);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
    const notesInfo = await lstat(notesDir);
    if (!notesInfo.isDirectory() || notesInfo.isSymbolicLink()) {
      throw new Error('Review-note directory must be a real directory.');
    }
    const relativePath = `review-notes/${input.taskId}.json`;
    const target = path.join(notesDir, `${input.taskId}.json`);
    const content = JSON.stringify({
      taskId: input.taskId,
      decision: input.decision,
      summary: input.summary,
    }, null, 2) + '\n';
    const handle = await open(target, 'wx', 0o600);
    try {
      await handle.writeFile(content, 'utf8');
    } finally {
      await handle.close();
    }
    const readback = await readFile(target, 'utf8');
    if (readback !== content) throw new Error('Review-note readback did not match.');
    return {
      status: 'created',
      taskId: input.taskId,
      path: relativePath,
      sha256: createHash('sha256').update(readback).digest('hex'),
    };
  };
}
