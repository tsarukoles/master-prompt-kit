# Existing project journey

The fictional Harbor Reservations project already has a cancellation service and tests. Its requirement includes both denial and unchanged state. The adoption goal is to close one assertion gap while preserving the function shape and runner.

## 1 Inventory and scope

The planner reads [requirements](requirements.md), [service](service.mjs), and [legacy check](legacy-check.mjs). The architect records **keep** for the local runner and service shape, **improve** for authorization assertions, and **defer** for integrations and UI. A framework rewrite has no evidence-based benefit for this task.

The weak check verifies only status 403. It would pass even if the service changed the protected booking before returning denial. The proposed case adds an unchanged-state assertion against a synthetic booking owned by another actor.

## 2 Implement and challenge

[cancellation.test.mjs](cancellation.test.mjs) verifies owner success, unauthorized denial with unchanged state, and a negative control. The deliberate faulty implementation changes the state before returning 403. The historical assertion passes it; the complete assertion rejects it. This is a concrete green-but-wrong test example.

Run from the kit root:

```text
node --test examples/existing/cancellation.test.mjs
```

The outer negative-control test passes when it proves the stronger assertion throws on the seeded defect. That outer pass does not claim the faulty implementation is correct. All effects are mutations of local synthetic objects.

## 3 Independent review

Give the verifier requirements, diff, three source files, and native results. Required checks are owner behavior, denied unchanged-state behavior, and the negative control. The reviewer should examine the protected state assertion itself and identify the limitation that no API, database, or notification service was checked.

If this were a real repair, preserve the original failing native evidence and review the actual revision. An AI statement that "authorization is fixed" would be too broad without the relevant service/identity coverage.

## 4 Report and hand off

Use actual native outcome counts and revision in the report. State local synthetic target, no external cleanup, and explicit live integration gaps. The owner may accept the assertion improvement after verification. Next work could add approved API persistence/notification evidence; it is a separate scoped slice.

Recovery reverts the focused test/helper change. The service interface, runner, and unrelated test suite remain part of the existing architecture decision.
