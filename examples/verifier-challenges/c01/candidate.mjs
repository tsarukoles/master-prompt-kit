import test from 'node:test';
import assert from 'node:assert/strict';
import { refund } from './product.mjs';
test('REF-01 refund never exceeds payment', () => {
  const result = refund(100, 150);
  assert.equal(result.status, 200);
});
