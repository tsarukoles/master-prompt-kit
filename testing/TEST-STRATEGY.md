# Test strategy and evidence

Start from product risks and observable behavior. Map a requirement or incident to a test case, test code, data/setup, assertion, environment, and report. Use stable case IDs only when the team already has a useful catalog or wants that traceability. A case inventory is not an executed result.

Choose layers by the behavior they reveal: unit checks for pure logic, API tests for service contracts and authorization, UI tests for user journeys, database checks for invariants that cannot be observed through the API, and accessibility or performance checks where risk warrants them. Do not add layers merely to fill a template. Reuse setup helpers carefully; a Page Object should express UI behavior, not hide weak assertions.

For each test, state ownership of accounts and data, setup and cleanup, retry policy, target, and failure evidence. Prefer condition-based waits and meaningful assertions. Preserve a real product failure rather than changing a test until it turns green. Keep test failures, skips, blocked prerequisites, and checks not run separate.

## Evidence chain

Record the source revision, target, test identity, command or selection, start time, actual outcome, native report location, and cleanup result. If a dashboard imports an older report, label it imported and retain its original provenance. A discovered test list proves only discovery. A green helper unit check proves only the helper's behavior, not every call site.

## Verification of a first slice

1. List tests without running bodies, after reviewing import/setup effects.
2. Run the smallest approved target and data scope.
3. Inspect a real assertion and report, including failures and skips.
4. Confirm cleanup and no unexpected external writes.
5. Re-run only the affected checks after a reviewed change. Document unresolved results.
