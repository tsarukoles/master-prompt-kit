# QA architecture blueprint

Use this as a design menu. Match existing conventions before proposing new folders or a different runner. A small service may need unit tests, a few API checks, and a short runbook. Add UI, database, agents, or external reporting when a product risk justifies them.

## Responsibilities and boundaries

| Component | Responsibility and input | Output and owner | Adopt when / skip when | Prove it works |
| --- | --- | --- | --- | --- |
| Requirement and risk map | Turn approved behavior and incidents into coverage priorities | Case catalog; product owner and QA lead | Always, with detail proportional to risk | Trace a critical requirement to an assertion and result |
| Unit/domain tests | Check business rules with isolated inputs | Fast deterministic failures; service team | Logic exists / skip duplicate tests of third-party internals | Change the rule incorrectly and observe the relevant failure |
| Contract/API tests | Check consumer expectations, authorization, errors, and persistence through supported APIs | Service evidence; service team | Service boundary exists / skip when no API boundary | Wrong identity, schema, or state change fails |
| UI journeys | Check a few critical user journeys, keyboard access, and browser behavior | User-facing evidence; QA team | Browser behavior creates risk / skip duplicate API combinations | Wrong navigation or user-visible state fails |
| Fixtures and data factory | Create scoped synthetic data and dispose only owned records | IDs, ownership, cleanup status; QA owner | Tests need state / skip for pure functions | Parallel tests and failed setup do not cross-contaminate |
| Page/API objects | Centralize stable interactions and transport details | Reusable methods; framework owner | Repetition hides intent / skip abstractions with only one trivial use | Test intent and assertions remain visible at case level |
| Target resolver and action guard | Bind approved alias to actual URL/account/database; reject unsafe actions | Allowed or blocked action; security/platform owner | External target or write exists / local pure functions may omit | Missing target, mismatch, direct calls, and denied writes are blocked |
| Knowledge Vault | Index verified project facts, decisions, and runbooks | Cited current knowledge; named document owners | Facts span files/teams / tiny repo may use a short index | Stale or missing sources surface before implementation |
| Roles and workflows | Assign drafting, execution, independent review, and handoff | Reviewable work with scope; QA lead | AI contributes consequential work / combine drafting roles for small tasks | Verifier catches a green test with wrong assertion |
| Hooks | Give fast feedback at a known event | Signal or supported block; framework owner | Repeated error has a reliable event / skip slow, noisy, duplicate hooks | Allowed, denied, malformed, timeout, and bypass probes |
| MCP and narrow harness | Connect tools and constrain a permitted action | Audited bounded effects; integration owner | Approved external task exists / skip unused integrations | Invalid target, excess scope, retry, duplicate requests fail safely |
| Results and CI | Execute selected checks, preserve provenance, publish approved artifacts | Native results and release decision; delivery owner | Shared change review / local work can use same stages manually | Failure, skip, and absent report cannot become a pass |

## Example layout for an adopting project

```text
project/
  tests/
    unit/                    business rules
    contract/                schemas and consumer expectations
    api/                     authorization, state and error behavior
    ui/                      critical browser journeys
    fixtures/                scoped setup and cleanup
    support/                 resolver, guard, API clients, page objects
  qa/
    cases/                   approved intent and IDs
    vault/                   project-owned knowledge, no credentials
    policies/                targets, actions, data and review rules
    workflows/               chosen local operating instructions
  artifacts/                 ignored native results and redacted summaries
```

This is a proposal for a new repository. In an existing repository, map these responsibilities to its actual files and change only a justified gap. Keep application code and tests in their established places.

## Execution path

1. Select cases from approved requirements and changed risk. Resolve the target explicitly; reject missing or conflicting aliases.
2. Discover tests without external side effects. Eligibility such as `runIfEnv` determines which tests can run and produces an explicit skip reason.
3. At each side-effecting call, check actual target, action, owned data scope, and runtime identity. Eligibility is not permission.
4. Create synthetic fixtures with a unique run namespace. Assert returned results and required state or absence of state change.
5. Preserve native failures and artifact references. Cleanup in a finalizer and report cleanup failure separately from the functional outcome.
6. Normalize results, attach source revision and actual target, and invoke independent verification where AI designed or changed consequential behavior.
7. Preview any tracker/report update, apply its authorized scope through a narrow adapter, and read back the external record.

## Common design mistakes

- A UI journey checks every data combination: move rule combinations to a faster layer, retain the user journey.
- A shared admin fixture hides authorization defects: use explicit roles and test denied actions with state unchanged.
- A helper asserts success on every API call: allow error paths and keep business expectations visible in cases.
- Database assertions bypass the public contract without need: use only when approved persistence evidence is necessary and schema coupling is justified.
- A locator repair changes expected text until a test passes: preserve intent, classify failure, and verify again.
- A report interprets runner exit code zero as all tests passed: read case-level outcomes, including skipped and missing cases.

Use the [strategy worksheet](../testing/TEST-STRATEGY.md) to choose layers and [CI workflow](../workflows/CI-AND-RELEASE.md) to decide shared gates.
