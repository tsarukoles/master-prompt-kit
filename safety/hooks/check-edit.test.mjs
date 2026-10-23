import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { assessEdit } from './check-edit.mjs';
test('ordinary edits are allowed and assertion/guard removal needs review', () => {
  assert.equal(assessEdit({ path: 'spec.js', before: 'expect(x).toBe(1)', after: 'expect(x).toBe(2)' }).decision, 'allow');
  assert.equal(assessEdit({ path: 'spec.js', before: 'guardAction(t, "create"); expect(x).toBe(1)', after: 'test.skip("x", () => {})' }).decision, 'review');
  assert.equal(assessEdit({ path: 'config.js', before: '', after: 'a' }, { protectedPaths: ['config.js'] }).decision, 'review');
  assert.equal(assessEdit({ path: 'spec.js', before: 'test.skip("legacy", () => {})', after: 'test.only("new", () => {})' }).decision, 'review');
});
test('CLI rejects malformed input without echoing it', () => {
  const result = spawnSync(process.execPath, ['safety/hooks/check-edit.mjs'], { input: '{private malformed', encoding: 'utf8', timeout: 3000 });
  assert.equal(result.status, 2);
  assert.equal(JSON.parse(result.stdout).decision, 'review');
  assert.ok(!result.stdout.includes('private'));
});
test('equal assertion counts can still hide weak assertions: verifier required', () => {
  assert.equal(assessEdit({ path: 'spec.js', before: 'expect(actual.total).toBe(100)', after: 'expect(true).toBe(true)' }).decision, 'allow');
});
