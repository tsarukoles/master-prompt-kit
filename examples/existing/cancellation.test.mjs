import test from 'node:test';
import assert from 'node:assert/strict';
import { cancelBooking, faultyCancellation } from './service.mjs';
import { legacyUnauthorizedCheck, completeUnauthorizedCheck } from './legacy-check.mjs';

test('CANCEL-01 owner cancellation changes state', () => {
  const booking = { id: 'synthetic-1', ownerId: 'actor-a', status: 'active' };
  assert.equal(cancelBooking(booking, 'actor-a').status, 200);
  assert.equal(booking.status, 'cancelled');
});

test('CANCEL-02 denied cancellation preserves all booking state', () => {
  completeUnauthorizedCheck(cancelBooking);
});

test('negative control: legacy check falsely passes a mutation that cancels another actor booking', () => {
  assert.doesNotThrow(() => legacyUnauthorizedCheck(faultyCancellation));
  assert.throws(() => completeUnauthorizedCheck(faultyCancellation), /Denied cancellation must not change/);
});
