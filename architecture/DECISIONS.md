# Architecture decision worksheet

Copy one record for each meaningful decision. Complete evidence and trade-offs before selecting an implementation. Proposed values stay labeled proposed until accepted by the owner.

```text
Decision ID and status: proposed | accepted | superseded
Goal and requirement IDs:
Owner and decision date:
Source revision and cited files:
Current behavior and constraint:
Options, including retaining the current design:
Selected option and why:
What we defer and why:
Files, targets and tools affected:
Permissions and data boundary:
Validation and acceptance evidence:
Runtime, maintenance and AI cost budget:
Recovery if the change fails:
Review trigger / expiry:
```

## Filled example

**DEC-004, proposed.** A booking service must reject reservations beyond capacity. Unit tests cover boundary arithmetic; API tests cover identity, persistence, and duplicate requests; one UI smoke covers successful booking. The service owner owns the decision. Requirement is `BOOK-01`; source is `requirements.md`, capacity rule paragraph, revision `local-example`.

Putting every capacity combination through UI is slower and makes failures harder to locate. Testing only the domain function would miss authorization and transaction behavior. The chosen split preserves rule and integration evidence. Browser rendering and concurrency against a real database are deferred until an approved test service exists.

The first change adds three pure-function cases. It has no external target and uses synthetic data. Acceptance requires correct boundary outcomes plus a negative control showing a wrong capacity calculation is detected. Recovery reverts only the new test files. Revisit when transactions or capacity rules change.

## Existing framework adoption

Inventory runner/version, layers, fixtures, helper boundaries, target behavior, secrets, cleanup, pipelines, reporting, failures, and maintainer constraints. Record each as **keep**, **improve**, **add**, **defer**, or **remove with owner approval**. Preserve working conventions unless evidence shows a specific cost or risk.

Choose the smallest useful vertical slice: one requirement, one case, one implementation, native evidence, independent review, and handoff. Do not begin with a wholesale migration or install every agent and hook.
