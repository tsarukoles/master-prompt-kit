import assert from 'node:assert/strict';

// Historical weak check: it ignores the required unchanged state.
export function legacyUnauthorizedCheck(cancel) {
  const booking = { id: 'synthetic-1', ownerId: 'actor-a', status: 'active' };
  assert.equal(cancel(booking, 'actor-b').status, 403);
}

export function completeUnauthorizedCheck(cancel) {
  const booking = { id: 'synthetic-1', ownerId: 'actor-a', status: 'active' };
  const before = structuredClone(booking);
  assert.equal(cancel(booking, 'actor-b').status, 403);
  assert.deepEqual(booking, before, 'Denied cancellation must not change booking state');
}
