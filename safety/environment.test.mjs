import assert from 'node:assert/strict';
import test from 'node:test';
import { resolveTarget, runIfEnv, guardAction, createGuardedRunner } from './environment.mjs';
test('missing, malformed, or mismatched targets never choose a destination', () => {
  for (const name of [undefined, '', 'dev', 'Production', ' production ', '__proto__']) assert.throws(() => resolveTarget(name));
  assert.throws(() => resolveTarget('development', 'https://example.invalid'));
  assert.throws(() => guardAction({ name: 'development', actions: ['delete'] }, 'delete'));
});
test('eligibility is a visible skip, while the action guard rejects a production write', async () => {
  const target = resolveTarget('production');
  assert.deepEqual(runIfEnv(target, ['development']), { eligible: false, reason: 'Skipped: environment is outside this test scope.' });
  let calls = 0;
  const run = createGuardedRunner(target, async () => ++calls);
  for (const action of ['create', 'update', 'delete']) await assert.rejects(run({ action, payload: {} }));
  assert.equal(calls, 0);
  await run({ action: 'read', payload: {} });
  assert.equal(calls, 1);
});
test('approved writes use the bound target and cannot override it', async () => {
  const target = resolveTarget('development');
  let seen;
  const run = createGuardedRunner(target, async request => { seen = request; return 'done'; });
  assert.equal(await run({ action: 'create', payload: { fixture: 'synthetic' } }), 'done');
  assert.equal(seen.target, target);
  await assert.rejects(run({ action: 'create', url: 'https://other.invalid' }));
  assert.throws(() => { target.name = 'production'; }, TypeError);
});
test('direct calls outside the runner bypass this library: host permissions are still needed', () => {
  let effects = 0;
  const uncontrolledClient = () => ++effects;
  assert.throws(() => guardAction(resolveTarget('production'), 'delete'));
  uncontrolledClient();
  assert.equal(effects, 1);
});
