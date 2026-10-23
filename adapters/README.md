# Optional provider adapters

The neutral modules define what a process must accomplish. Adapters translate it into the installed provider, runner, and company policy. Never enable an adapter just because its folder exists.

| Area | Supplied in 0.2.0 | Status and adoption requirement |
| --- | --- | --- |
| Assistants | Claude event mapping and setup worksheet | Documentation-reviewed; no live assistant hook installation claimed. Match the installed version and test each event. |
| Databases | PostgreSQL and SQL Server metadata-only query examples and discovery procedure | Documentation-reviewed; no live DB query claimed. Owner approves scope/identity, then trial on fictional schemas and denied/partial roles. |
| Test runner | Neutral Node examples and runner mapping guide | Local examples tested. Actual Playwright or other runner configuration must be adapted and exercised in the target project. |
| CI | This kit's GitHub checks/release workflow and application pipeline mapping | The kit workflow is specific to this source tree. GitLab and application workflows are design guidance until tested there. |
| Trackers/test management/notifications | Provider-neutral connection and write contracts | No live connector bundled or connected. Resolve fields, IDs, identity, idempotency, and readback before writing. |

For each adopted adapter record version, platform, tested event/query/method, allowed and denied probes, evidence, owner, and recheck date. If the provider lacks a required control, report it; prompt wording is not an equivalent permission boundary. Use a local wrapper or service-side restriction where appropriate, or defer the capability.

Read [assistant adapters](assistants/README.md), [database adapters](databases/README.md), [runner mapping](runners/README.md), and [CI mapping](ci/README.md). [VALIDATION.md](../VALIDATION.md) records the release's observed checks.
