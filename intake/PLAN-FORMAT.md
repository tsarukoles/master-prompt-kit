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

| Step | Intended effect | Exact files/systems | Side effects and approval | Verification | Recovery |
| --- | --- | --- | --- | --- | --- |
| First small step | | | | | |

Name any installation, account connection, external write, data change, or test execution explicitly. Separate discovery and configuration from running tests. Include the expected output and what would count as failure or a skip.

## 5. First step proposal

Show the exact change or command before executing it. Stop if the target, approval scope, or repository state differs from the plan. After execution, report actual results with source revision, environment, and remaining limits.
