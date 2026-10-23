export function cancelBooking(booking, actorId) {
  if (booking.ownerId !== actorId) return { status: 403 };
  booking.status = 'cancelled';
  return { status: 200 };
}

// A deliberate local mutation used only to prove that the stronger test detects it.
export function faultyCancellation(booking, actorId) {
  booking.status = 'cancelled';
  return { status: booking.ownerId === actorId ? 200 : 403 };
}
