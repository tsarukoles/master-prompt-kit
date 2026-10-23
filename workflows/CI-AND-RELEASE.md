# CI checks and release decisions

Use this provider-neutral stage design with the project's existing pipeline. Provider YAML belongs in validated adapters. A repository containing an example pipeline is not evidence that service credentials, branch rules, or deployment approval are configured.

| Stage | Trigger and scope | Expected evidence | Default gate |
| --- | --- | --- | --- |
| Static/configuration | Each change; selected lint/types/configuration/secret checks | Tool version, revision, exit/results | Required for applicable code |
| Unit/contract | Each change; deterministic domain and interface checks | Native test results, coverage gaps | Required |
| Integration | Approved branches or change labels; isolated target/data | Actual target, identities, fixtures, outcomes, cleanup | Required where changed risk needs it |
| UI smoke | Critical changed user journeys; approved browser target | Native steps/assertions, redacted artifacts | Required for affected critical journey |
| Wider regression/nonfunctional | Scheduled or explicit risk trigger | Workload, budget, native results, exclusions | Policy-defined; never silently implied |
| Normalize and archive | After run, including failure when safe | Report provenance, distinct outcomes, protected artifacts | Required evidence integrity |
| AI explanation/verifier | After deterministic evidence; relevant changed intent | Cited verdict and limits | Advisory semantics plus required human review where policy says |
| Release decision | Required stages complete at exact release revision | Gate status, residual risks, owner acceptance | Human/service policy gate |

## Trigger and environment policy

Pull requests run the smallest relevant checks with read-only repository permissions by default. Untrusted contributions must not receive privileged secrets or execute in trusted deployment contexts. Map an explicit branch/event to an approved environment alias, then validate the actual target at execution. A branch name alone cannot grant production write permission.

Keep job identities separate from test user roles. Give each job only the scopes it needs. Store secret references in configuration and actual values in the approved secret facility. Do not print resolved secrets. Use environment protection and service permissions for consequential operations, along with call-site guards.

Required checks must run at the reviewed revision; a green previous commit is stale. Decide whether a skipped required check blocks the release; this kit's default is yes until the owner accepts an explicit policy exception. Mark informational checks clearly so their absence cannot be mistaken for required coverage.

## Reliability and cost

Set job timeout, test-selection budget, maximum parallelism, retry count, artifact retention, and AI token/cost budget. Preserve first failures and distinguish retried passes. Quarantine needs a named owner, issue, expiry, and coverage consequence. Limit AI to redacted relevant evidence; do not upload a whole private report because it is convenient.

Archive native results even when tests fail, when the runner and data policy permit. Missing or malformed reports should fail evidence checks. Retain the reviewed source revision, package/version metadata, approved target, check selection, and artifact references.

## Release and recovery

Before release, reconcile requirements, required checks, independent findings, cleanup, known defects, and deployment scope. The owner accepts residual risk. An AI `accept` verdict cannot merge or deploy by itself. Record the decision and approved rollout/rollback route.

For framework changes, release one slice and observe runtime, first-pass reliability, cleanup, and reporting freshness. Roll back the focused change if it breaks evidence or guard behavior; preserve failing artifacts. Update compatibility notes when a runner, assistant, MCP service, database engine, or CI provider changes.

**Output:** reproducible native evidence, visible missing checks, bounded report, and owner release decision. **Stop:** required failure or unknown status, unsafe target, missing credentials within policy, stale revision, or unreviewed consequential scope.
