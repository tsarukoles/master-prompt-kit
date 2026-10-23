import test from 'node:test';
import assert from 'node:assert/strict';
import { cancel } from './product.mjs';
test('CAN-01 owner cancellation', () => {
  const booking = { owner: 'user-a', state: 'active' };
  assert.equal(cancel(booking, 'user-a').status, 200);
  assert.equal(booking.state, 'cancelled');
});
