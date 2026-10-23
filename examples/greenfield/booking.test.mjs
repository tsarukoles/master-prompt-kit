import test from 'node:test';
import assert from 'node:assert/strict';
import { reserve } from './booking.mjs';

test('BOOK-01 ordinary reservation returns the exact new state without mutating input', () => {
  const original = Object.freeze({ capacity: 5, booked: 1 });
  assert.deepEqual(reserve(original, 2), { outcome: 'reserved', state: { capacity: 5, booked: 3 } });
  assert.deepEqual(original, { capacity: 5, booked: 1 });
});

test('BOOK-01 capacity boundary permits exactly the remaining seats', () => {
  assert.deepEqual(reserve({ capacity: 5, booked: 3 }, 2), {
    outcome: 'reserved', state: { capacity: 5, booked: 5 }
  });
});

test('BOOK-02 excess request is denied and state remains unchanged', () => {
  const state = Object.freeze({ capacity: 5, booked: 3 });
  assert.deepEqual(reserve(state, 3), { outcome: 'full', state: { capacity: 5, booked: 3 } });
});

test('BOOK-03 invalid requests never consume capacity', () => {
  const state = Object.freeze({ capacity: 5, booked: 1 });
  for (const seats of [0, -1, 1.5, '2', NaN, Infinity, undefined]) {
    assert.deepEqual(reserve(state, seats), { outcome: 'invalid', state: { capacity: 5, booked: 1 } });
  }
});

test('BOOK-04 malformed state is rejected', () => {
  for (const state of [null, {}, { capacity: -1, booked: 0 }, { capacity: 1.5, booked: 0 },
    { capacity: 1, booked: -1 }, { capacity: 1, booked: 2 }]) {
    assert.throws(() => reserve(state, 1), /Invalid booking state/);
  }
});
