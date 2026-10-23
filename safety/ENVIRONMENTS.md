# Environment selection and action guards

Use one reviewed target map for browser, API, database, and external reporting destinations. Resolve it once when a run begins and pass that immutable value into clients. An environment label alone does not prove the destination. Bind the target to the client and restrict credentials at the service.

## Project contract

| Environment | Canonical destination | Allowed actions | Data owner and cleanup | Service identity |
| --- | --- | --- | --- | --- |
| Development | Owner supplies exact URL/database | Explicit read/create/update/delete list | Isolated synthetic data; named cleanup owner | Development role |
| Staging | Owner supplies exact destination | Approved actions only | Namespace per run; cleanup on failure | Separate staging role |
| Production | Owner supplies exact destination | Read-only smoke by default | No fixture creation by default | Restricted production role |

Require an explicit environment unless the owner deliberately approves a safe default. Reject blank, misspelled, unknown, or conflicting overrides. Credentials, redirects, alternate database connections, and third-party URLs require their own destination checks. Never print connection strings in errors.

## Two controls at different points

1. **Eligibility (`runIfEnv`)** says whether a test is selected for this environment. Outside the allowlist, report a skip with its reason. A skipped test did not pass.
2. **Action guard (`guardAction` / `envGuard`)** checks immediately before a data-changing operation. A rejected write is an error, even if a test forgot its eligibility declaration.

Apply the action guard to setup and cleanup too. A fixture can create data before the test body. Test discovery can load modules and configuration, so inspect import/setup behavior before listing tests. Prefer lazy connections and side-effect-free imports.

## Runnable reference

[environment.mjs](environment.mjs) has fictional `.invalid` destinations. It exposes a resolver, eligibility result, action guard, and runner whose host binds the target. It performs no network or database calls. [Tests](environment.test.mjs) demonstrate invalid settings, mismatched destinations, visible skips, blocked writes, approved fake actions, and a deliberate direct-call bypass showing the library's limit.

```text
node --test safety/environment.test.mjs
```

For your runner, translate `eligible: false` into its documented skip mechanism, wire the target into fixtures, and guard every mutation in the actual client. This is a neutral reference, not a complete runner configuration. A separate HTTP or database client does not inherit its protections. The trusted host owns the executor; only a task-specific harness should expose it to AI.

## Adoption and verification

- Inventory write paths: UI forms, API calls, DB operations, tracker updates, notifications, CI dispatch, setup, and teardown.
- Map each path to its client, target, eligibility, action guard, service permissions, and cleanup.
- Exercise fake clients first. A blocked write must leave a call counter at zero.
- Inspect real call sites, including helpers and imports. A passing helper test does not establish complete coverage.
- Review redirects, retries, proxies, and connection pools for destination drift.
- Have the [verifier](../agents/VERIFIER.md) check the map and actual run evidence before accepting adoption.
