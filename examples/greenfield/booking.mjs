export function reserve(state, seats) {
  if (!Number.isInteger(state?.capacity) || state.capacity < 0 ||
      !Number.isInteger(state?.booked) || state.booked < 0 || state.booked > state.capacity) {
    throw new TypeError('Invalid booking state');
  }
  if (!Number.isInteger(seats) || seats <= 0) {
    return { outcome: 'invalid', state: { ...state } };
  }
  if (state.booked + seats > state.capacity) {
    return { outcome: 'full', state: { ...state } };
  }
  return { outcome: 'reserved', state: { ...state, booked: state.booked + seats } };
}
