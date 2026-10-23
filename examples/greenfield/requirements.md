# Cedar Booking requirements

All entities are fictional and local. The approved first slice is a pure capacity calculation and immutable state update.

- **BOOK-01:** a booking for a positive integer number of seats succeeds when current bookings plus requested seats do not exceed capacity. A request exactly filling capacity succeeds.
- **BOOK-02:** a request exceeding capacity is rejected and leaves booked seats unchanged.
- **BOOK-03:** zero, negative, fractional, or nonnumeric requests are rejected and leave booked seats unchanged.
- **BOOK-04:** malformed state (negative or noninteger capacity/booked seats, or booked greater than capacity) is rejected before calculation.

Authorization, persistence transactions, concurrent callers, and browser behavior are outside this first slice. They remain explicit integration design gaps, not covered claims.
