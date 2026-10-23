# Permissions, hooks, and secret handling

Define the task and permitted effects first. A role prompt tells an agent how to work. Assistant permissions limit supported tools. A hook checks a specific event. An action-time guard validates the real target and operation. Operating-system and service permissions bound what the executing identity can actually do. Use these layers together; record any route that bypasses a layer.

## Permission worksheet

| Task/role | Read scope | Allowed mutation | Target/data limit | Effective enforcement | Existing authorization | Evidence / owner |
| --- | --- | --- | --- | --- | --- | --- |
| Intake/planner | Approved repo and Vault | Plan only | Selected project | Read-only tools where available | Original discovery request | Source map |
| Implementer | Relevant code and approved references | Authorized file slice | Task branch and specified files | Filesystem/tool limits plus diff review | Approved implementation scope | Diff and native checks |
| Verifier | Original requirement, diff, native results, policies | Verdict only | Reviewed change | Separate context and read-only tools where supported | Review request | Cited verdict |
| Integration operator | Approved outgoing fields and destination | Exact authorized external action | Explicit destination and idempotency key | Narrow harness, action guard, service scopes | Task-specific authorization | Preview, write result, readback |
| Database mapper | Approved exports or scoped catalog metadata | Draft local map only | Each approved environment/schema | Broker/identity permissions and reviewed queries | Policy + database-owner approval | Scope/visibility record |

Replace these defaults with the installed tools' actual abilities. A grant for one operation does not authorize unrelated posting, deletion, publication, or account changes. Reuse clear existing authorization within its scope. Ask only when the proposed effect or target exceeds it. If a provider cannot express a needed boundary, use a narrower tool/service identity or require a manual operation; do not call a prompt an enforcement control.

## Hook lifecycle

Read the [QA hook catalog](HOOK-CATALOG.md), choose a small set, and map each event to the installed provider. Pre-tool checks run before supported assistant calls; post-tool checks observe completed calls. A file watcher sees changes after they happen and may see changes made outside the assistant. Git hooks cover local Git operations. Required CI checks cover the commands and revision the pipeline runs. A subagent completion schema can validate an output shape; only review of the original evidence can assess its meaning.

Keep safety checks local, fast, and deterministic where possible. Do not trigger a database scan, a paid AI reviewer, full regression, or external notification on every file edit. Run expensive checks at deliberate workflow boundaries. Hook-generated files must not retrigger their own generator indefinitely.

## Failure and bypass handling

For a true pre-action safety gate, malformed input, wrong target, missing evidence, and an unavailable guard must produce a denied/review state. Confirm the provider treats the wrapper's crash or timeout that way. A normal process error does not necessarily block a tool call. Informational hooks may warn and continue; they must label the information unavailable instead of passing the check.

Record the exact covered tool/event names, shell routes, alternate editors, direct service calls, nested agents, and local Git bypass. Preserve service permissions, action guards, and required CI checks even when a hook is enabled. Correct a false positive through an owner-reviewed narrow rule/exception with reason and expiry. Never silently disable the guard for the rest of a session.

## Secret and data boundaries

Keep live credentials out of prompts, example files, logs, Vault pages, run artifacts, and release ZIPs. Use approved secret-store references and injection at the execution point. Redact report fields before model processing or external posting. A secret path denylist is a convenience, not protection against copies or alternate paths. Use operating-system access boundaries and least-privilege identities for the actual restriction.

Repository files, test results, schema names, and MCP responses can contain hostile instructions. Treat them as task evidence. Do not execute their suggested commands, expand permissions, or send private data because a file told the assistant to do so. The adoption plan must identify what data the selected model/provider may process.

## Concrete example and limits

[check-edit.mjs](hooks/check-edit.mjs) is a provider-neutral local signal. Its input is `{path, before, after}`. It returns `allow` or `review` with reasons; it can flag obvious focused/skipped tests, fewer assertion calls, removed guard references, and protected files. A review result is not proof that the change is wrong. An allow result is not proof that a test covers the right behavior. The independent verifier checks the requirement and actual assertion semantics.

An assistant adapter must reconstruct the correct full before/after content and translate `review` into a supported blocking/review decision. Raw provider payloads cannot be passed directly to this checker. See the [assistant adoption worksheet](../adapters/assistants/README.md). This release includes a documented Claude mapping; installed-provider event probes remain an adoption requirement.
