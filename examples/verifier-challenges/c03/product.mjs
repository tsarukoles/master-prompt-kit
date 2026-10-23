export function cancel(booking, actor) {
  booking.state = 'cancelled';
  return { status: 200 };
}
