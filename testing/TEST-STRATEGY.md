# QA strategy and coverage worksheet

Start from product risk and the behavior that would prove it is controlled. Test count and line coverage can reveal gaps; neither proves the right behavior was checked.

## Choose coverage

The IDs and behaviors below are local to this illustrative table. Rebind each row to the target project's original requirements; the same ID in another example or project can mean something different.

| Requirement / risk | Failure to detect | Layer | Cases and assertion | Data / target | Priority / owner |
| --- | --- | --- | --- | --- | --- |
| BOOK-01 capacity | Booking accepted with no seat remaining | Unit plus API transaction | At capacity succeeds; above capacity rejects and creates no booking | Synthetic capacity; local then approved staging | High / bookings owner |
| BOOK-02 authorization | Another user cancels a booking | API | Unauthorized caller denied; booking remains active | Two scoped users; nonproduction | High / identity owner |
| BOOK-03 usability | Keyboard user cannot submit | UI accessibility journey | Fields named, focus reaches action, success announced | Synthetic user; approved browser target | Medium / web owner |
| BOOK-04 retry | Retried request creates two bookings | API integration | Same key returns same booking; stored count unchanged | Unique namespace; nonproduction | High / service owner |

For each actual requirement, consider positive, negative, boundary, permission, lifecycle, duplicate/concurrent, and recovery cases. Select applicable categories and explain omissions. Ask the owner about ambiguous behavior; an AI guess is not an acceptance criterion.

## Select the cheapest layer that proves the behavior

- **Unit:** calculations, validation, parsing, transitions. Use explicit input/output assertions and edge conditions.
- **Contract:** supported request/response shapes and consumer assumptions. Validate required fields, types, and error contracts; avoid freezing incidental fields.
- **API/integration:** authorization, persistence, transactions, dependencies, idempotency. Observe meaningful outcomes and state.
- **UI:** critical navigation, rendering, input, browser behavior, accessibility. Prefer semantic locators and waits on observable state; avoid fixed sleeps.
- **Database:** approved schema and persistence invariants when API evidence is insufficient. Metadata is distinct from row access. Direct database assertions introduce coupling that needs an owner.
- **Manual/exploratory:** new behavior, uncertain risks, usability, and scenarios expensive to automate. Record observations without claiming automated coverage.

Select nonfunctional work explicitly: accessibility for applicable user journeys; performance at agreed workload and budget; resilience for dependency failure and recovery; security for approved authorization and input boundaries. Scans and load tests need their own scope, rate limits, target permission, and owner.

## Assertion review

An assertion should fail when the requirement is violated. A 200 response, visible page, nonempty object, or successful click often proves only that a path executed. Check important values, state transitions, permissions, and forbidden effects. For a rejected operation, verify rejection and unchanged protected state when safely observable.

Run a negative control where practical: substitute a known incorrect calculation or response and show the important assertion fails. Mutation checks support confidence in a specific assertion; they do not establish complete product correctness.

## Traceability and selection

Keep requirement → approved case → test identifier → native result → external record. Stable IDs belong in case metadata and test titles where supported. A generated case is `draft`, never `passed`. A discovered but unselected test is `not_run`; an ineligible selected test is `skipped` with reason; missing access is `blocked`.

Select by changed behavior, dependency impact, risk, and historical defects. Explain exclusions. Use a small mandatory critical set plus affected tests for fast feedback; schedule wider coverage according to runtime and reliability budgets. Revisit the matrix after incidents and requirement changes.

Use the [case template](CASE-TEMPLATE.md), [data and flake policy](DATA-AND-FLAKE-POLICY.md), and [test design workflow](../workflows/TEST-CASE-GENERATION.md).
