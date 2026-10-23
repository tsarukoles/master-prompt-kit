# Project-specific plan format

Return this after read-only discovery. Keep it short enough to review.

## 1. Evidence map

| Area | Confirmed fact and source | Unknown or limit |
| --- | --- | --- |
| Repository and current automation | | |
| Targets and data | | |
| Tests and reports | | |
| AI tools, hooks, permissions, MCP | | |
| CI and integrations | | |

## 2. Decisions needed

Ask only questions that alter the next step. Include a recommended default and the effect of each choice. Never ask for a secret value.

## 3. Gap analysis (existing projects)

For each gap, state current behavior, evidence, risk, proposed change, compatibility, effort, and whether to **keep**, **improve**, **defer**, or **reject** it. Do not equate a missing kit pattern with a defect.

## 4. Staged work

Name the kit modules actually read and the version being adopted. Explain why each selected role, hook, Vault component, connection, and test layer is useful here; mark unnecessary components deferred. A missing pattern is not itself a defect. Keep existing conventions unless the evidence justifies changing them.

| Step | Intended effect | Exact files/systems | Side effects and approval | Verification | Recovery |
| --- | --- | --- | --- | --- | --- |
| First small step | | | | | |

Name any installation, account connection, external write, data change, or test execution explicitly. Separate discovery and configuration from running tests. Include the expected output and what would count as failure or a skip.

## 5. First step proposal

Show the exact change or command before executing it. Stop if the target, approval scope, or repository state differs from the plan. After execution, report actual results with source revision, environment, and remaining limits.

## 6. Independent verification plan

Identify the original acceptance criteria, the reviewer or [verifier role](../agents/VERIFIER.md), the required checks selected before implementation, evidence locations, and the expected handoff. The implementer must not redefine success after seeing a failure. A separate review pass should inspect real assertions and native outcomes, not merely the implementation summary.

## Filled first-step example

A fictional existing API project already has a working runner and nightly reports, but target selection is duplicated in two clients. Keep the runner. Improve only the target resolver and the two client constructors. Run fake-client checks that a production write is rejected before either client is called, then an owner-approved development smoke. The verifier checks both call sites and the original test intent. Defer MCP and new agents until a workflow needs them. Roll back the reviewed diff if the new resolver breaks an existing approved target; never relax the production policy to make the smoke pass.
