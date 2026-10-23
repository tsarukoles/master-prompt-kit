# Harbor Reservations requirements

The fictional project already uses `cancelBooking(booking, actorId)` and Node tests. Preserve that function shape and local runner for the proposed repair.

- **CANCEL-01:** the owner can cancel an active booking; response status is 200 and the booking becomes cancelled.
- **CANCEL-02:** another actor receives status 403 and the booking remains active. A denied response alone is insufficient: no state change is permitted.

The local fixture models service state. A real service would need approved API/persistence evidence and notification checks. No live target is in scope.
