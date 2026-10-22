import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createReviewNoteTool } from './example.mjs';

const request = { action: 'write-review-note', taskId: 'task-17', decision: 'approved', summary: 'Reviewed the evidence.' };

test('creates exactly one note and verifies its content', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'review-tool-'));
  try {
    const result = await createReviewNoteTool(root)(request);
    assert.equal(result.status, 'created');
    assert.equal(result.path, 'review-notes/task-17.json');
    const stored = JSON.parse(await readFile(path.join(root, result.path), 'utf8'));
    assert.deepEqual(stored, { taskId: 'task-17', decision: 'approved', summary: 'Reviewed the evidence.' });
    assert.deepEqual(await readdir(root), ['review-notes']);
    assert.deepEqual(await readdir(path.join(root, 'review-notes')), ['task-17.json']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('rejects paths, extra actions, and invalid decisions before writing', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'review-tool-'));
  try {
    const tool = createReviewNoteTool(root);
    await assert.rejects(tool({ ...request, path: '../outside.json' }), /only action/);
    await assert.rejects(tool({ ...request, action: 'run-shell' }), /Unsupported action/);
    await assert.rejects(tool({ ...request, decision: 'delete' }), /Invalid decision/);
    await assert.rejects(tool({ ...request, taskId: '../outside' }), /Invalid taskId/);
    assert.deepEqual(await readdir(root), []);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('refuses to overwrite an existing note', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'review-tool-'));
  try {
    const tool = createReviewNoteTool(root);
    await tool(request);
    await assert.rejects(tool(request), { code: 'EEXIST' });
    assert.deepEqual(await readdir(path.join(root, 'review-notes')), ['task-17.json']);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
