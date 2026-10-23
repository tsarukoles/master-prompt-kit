import test from 'node:test';
import assert from 'node:assert/strict';
import { isEligible } from './product.mjs';
test('DATA-01 production cleanup is not eligible', () => {
  assert.equal(isEligible('production'), false);
});
