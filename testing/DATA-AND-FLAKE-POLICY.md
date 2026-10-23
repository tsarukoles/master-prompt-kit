# Test data and flaky test policy

## Own the data lifecycle

Prefer pure values and synthetic factories. For external fixtures, create a unique run namespace, label ownership, record created IDs, and dispose only those IDs. Use separate identities for roles under test; admin setup must not become the identity used for a normal-user assertion. Never broaden cleanup to all matching business records.

Setup must be idempotent where reruns are allowed. Cleanup runs after success, assertion failure, and partial setup. Record cleanup failure and provide an owner runbook; a functional pass does not erase leaked data. Expiry cleanup can recover abandoned runs only when the owner defines namespace, age threshold, and permitted action.

Shared staging records need an owner, concurrency rule, restoration plan, and reason a synthetic alternative is unsuitable. Production reads or writes require target-specific policy and an approved path. An environment variable named staging is insufficient evidence of the actual target.

Keep credentials in an approved secret facility, referenced by name. Reports use synthetic aliases and redacted artifact references. Evidence retention, viewer permissions, and deletion periods belong in project policy.

## Classify before changing tests

| Class | Evidence needed | Next action |
| --- | --- | --- |
| Product defect | Observed result violates approved behavior with valid fixture/target | Preserve failure; report defect; preserve expectation |
| Test defect | Incorrect assertion, setup, selector, wait, or isolation | Focused repair, then verify original intent remains |
| Environment/dependency | Missing service/access, wrong version, unavailable approved target | Mark blocked where appropriate; route to owner |
| Flaky behavior | Same code and comparable target/data sometimes pass and fail | Investigate timing, order, shared state, retries, product races |
| Unknown | Evidence cannot distinguish causes | State unknown; collect next bounded evidence |

One retry can collect evidence when policy allows it. Preserve first failure and every attempt. A later pass is a retried pass with flake evidence, not a clean first-pass success. Do not retry unsafe writes unless the action is idempotent and its result is known.

Quarantine requires owner, reason, issue, expiry, affected risk, and replacement coverage. CI shows quarantined cases separately. Avoid silent skips, unbounded retries, catching errors to pass, or broad timeout increases. Repairs that alter assertions, locators, retries, target behavior, or quarantine require a new independent review.

Track first-pass failure rate, retries, quarantine age, cleanup failures, critical case coverage, and total runtime. Set project-specific budgets; no universal threshold fits every product.
