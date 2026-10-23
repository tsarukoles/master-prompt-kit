import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { refund as uncappedRefund } from './c01/product.mjs';
import { cancel } from './c03/product.mjs';
import { cleanup } from './c04/product.mjs';

function run(id) {
  const file = fileURLToPath(new URL(`./${id}/candidate.mjs`, import.meta.url));
  const childEnv = { ...process.env, NODE_OPTIONS: '' };
  delete childEnv.NODE_TEST_CONTEXT;
  const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', file], {
    encoding: 'utf8', timeout: 10000, env: childEnv
  });
  if (result.error) throw result.error;
  assert.equal(result.signal, null, 'Scenario process must finish, not time out');
  return result;
}

test('c01 exposes a green test while the requirement is violated', () => {
  const result = run('c01');
  assert.equal(result.status, 0);
  assert.match(result.stdout, /# pass 1/);
  assert.equal(uncappedRefund(100, 150).amount, 150);
  assert.throws(() => assert.equal(uncappedRefund(100, 150).amount, 100));
});

test('c02 distinguishes skipped execution from a passing check', () => {
  const result = run('c02');
  assert.equal(result.status, 0);
  assert.match(result.stdout, /# pass 0/);
  assert.match(result.stdout, /# skipped 1/);
});

test('c03 exposes a missing permission case behind a passing owner test', () => {
  const result = run('c03');
  assert.equal(result.status, 0);
  const booking = { owner: 'user-a', state: 'active' };
  assert.equal(cancel(booking, 'user-b').status, 200);
  assert.equal(booking.state, 'cancelled');
});

test('c04 exposes direct cleanup bypass with a local fake writer only', () => {
  const result = run('c04');
  assert.equal(result.status, 0);
  const calls = [];
  cleanup(action => calls.push(action), 'synthetic-run');
  assert.deepEqual(calls, [{ target: 'production', action: 'delete', runId: 'synthetic-run' }]);
});

test('c05 retains a native failure instead of promoting it to pass', () => {
  const result = run('c05');
  assert.notEqual(result.status, 0);
  assert.match(result.stdout, /# fail 1/);
  assert.match(result.stdout, /13/);
  assert.match(result.stdout, /30/);
});

test('c06 provides a sound local control with all selected tests executed', () => {
  const result = run('c06');
  assert.equal(result.status, 0);
  assert.match(result.stdout, /# pass 2/);
  assert.match(result.stdout, /# fail 0/);
  assert.match(result.stdout, /# skipped 0/);
});
