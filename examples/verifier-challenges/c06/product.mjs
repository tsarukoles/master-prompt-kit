export function refund(paid, requested) {
  if (!Number.isInteger(paid) || paid < 0 || !Number.isInteger(requested) || requested < 0) {
    throw new TypeError('Invalid amount');
  }
  return Math.min(paid, requested);
}
