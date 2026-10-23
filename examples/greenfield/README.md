# New project journey

The fictional Cedar Booking team starts without automation. Its approved first slice is [capacity behavior](requirements.md). All code is local and synthetic.

## 1 Discover and decide

The planner finds no existing runner or shared test data. The owner accepts a pure domain example first. The architect chooses Node built-in tests for this portable demonstration because no browser/service is needed to prove arithmetic and immutable state behavior. A real adopter chooses its existing language/runner after intake.

The decision keeps tests close to the rule, uses no network, and defers API transactions, authorization, concurrent persistence, and UI. Those deferrals remain visible. No MCP connection, database scan, or assistant hook is needed for this slice.

## 2 Design and implement

| Case | Requirement | Assertion | Implementation evidence |
| --- | --- | --- | --- |
| capacity ordinary and boundary | BOOK-01 | Exact booked value, including equality at capacity; original state unchanged | `booking.test.mjs` first two tests |
| over capacity | BOOK-02 | `full` plus unchanged booked value | Third test |
| invalid input | BOOK-03 | `invalid` plus unchanged state for each listed invalid value | Fourth test |
| malformed state | BOOK-04 | Exception before calculating with invalid state | Fifth test |

The implementer adds [booking.mjs](booking.mjs) and [booking.test.mjs](booking.test.mjs). Tests use frozen fixtures and compare exact outcomes/state. No fixtures need external cleanup.

## 3 Execute and verify

Run from the kit root:

```text
node --test examples/greenfield/booking.test.mjs
```

Inspect native output for five executed test groups. Do not copy expected counts into a run report without actually executing. The verifier reads requirements, code, and actual output. It should confirm capacity equality and rejected-state preservation, then disclose that this is domain evidence only.

Use the [verification prompt](../../workflows/VERIFY.md) with these three files and your captured native output. Required checks are the five test groups plus requirement-to-assertion review. Supply the actual repository revision; do not use a fabricated hash.

## 4 Report and hand off

Record actual revision, local synthetic target, selected command, outcome counts, and raw evidence location. Cleanup is `not applicable: no external state`. A suitable owner decision is to accept this local slice if checks and review pass, then plan an approved API/transaction slice. Do not report booking service readiness or successful live integration from this example.

Recovery is to revert only the example change. The next questions are service ownership, identity rules, persistence semantics, target policy, and safe transaction/concurrency fixtures.
