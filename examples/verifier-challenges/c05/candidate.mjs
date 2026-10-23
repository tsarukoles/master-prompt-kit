import test from 'node:test';
import assert from 'node:assert/strict';
import { total } from './product.mjs';
test('PRICE-01 quantity total', () => {
  assert.equal(total(10, 3), 30);
});
