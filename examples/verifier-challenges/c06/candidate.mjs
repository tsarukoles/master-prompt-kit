import test from 'node:test';
import assert from 'node:assert/strict';
import { refund } from './product.mjs';
test('REF-01 lower, capped, and exact refund amounts', () => {
  assert.equal(refund(100, 40), 40);
  assert.equal(refund(100, 150), 100);
  assert.equal(refund(100, 100), 100);
  assert.equal(refund(0, 0), 0);
  assert.equal(refund(100, 0), 0);
  assert.equal(refund(0, 100), 0);
});
test('REF-02 invalid amounts', () => {
  for (const [paid, requested] of [[-1, 1], [1, -1], [1.5, 1], [1, 1.5]]) {
    assert.throws(() => refund(paid, requested), /Invalid amount/);
  }
});
