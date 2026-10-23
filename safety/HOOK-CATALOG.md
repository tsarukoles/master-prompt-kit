# QA hook selection and validation

A hook earns its place when it saves repeated work or catches a specific error at an available event. Start with fast deterministic checks and use the independent verifier for semantic judgment. The budgets below are suggested limits to adapt and measure, not measured performance claims. Every enabled hook needs a named owner and a test record.

## Recommended first set

For a small framework, begin with a runner preflight/provenance wrapper, required CI checks, and a warning when an AI edit weakens test structure. Add session/Vault context only if repeated confusion justifies it. Add external-write gating only when such integrations exist. Keep a verifier review after generated test intent/code and after self-healing; a permanent background agent is optional.

## Hook catalog

| ID / priority | Trigger and matcher | Input and intended outcome | Failure behavior / effective control | Cost budget |
| --- | --- | --- | --- | --- |
| H01 Context / useful | Session start/resume, scoped to the project | Repo/branch, dirty state, target alias from approved resolver, relevant Vault index and blocked prerequisites; print a short context summary | Warn on unavailable context. No network/DB calls. Informational; no new permission | Under 1 second; no model call |
| H02 Sensitive operation / when needed | Pre-tool event for exact supported read/write/MCP tool names | Canonical path or destination, operation, approved task scope, identity alias; deny secret reads or external effects outside the defined route | Fail closed on unknown scope/payload. Enforced only for mapped calls; service permissions + narrow harness remain authoritative | Under 1 second; no remote call |
| H03 Test edit / recommended signal | Pre-edit for test and guard/config files in approved root | Full normalized before/after diff; flag new focus/skip, removed assertions/guard references, protected target changes | Review/deny only supported pre-edits; malformed or ambiguous edit mapping goes to review. Deterministic signal + verifier | Under 1 second per bounded file |
| H04 Local feedback / useful | Post-edit or file-change event, exact relevant file globs | Changed files; targeted lint/typecheck or generated inventory diff | Warn/check failure after the edit. Never claim prevention. A failing required check must remain failed | Debounced, up to 5 seconds; larger work deferred |
| H05 Run provenance / recommended | Approved runner wrapper before and after a test command | Actual revision/target/data policy/selection before execution; native outcome, skips, retries, artifacts and cleanup after | Block runner on invalid preflight. Preserve native failure if reporter fails; missing provenance is incomplete evidence | Under 1 second preflight; bounded postprocessing |
| H06 Agent handoff / optional | Designer/implementer/verifier completion event or explicit orchestration step | Output contract, cited source/diff/run references, side effects, verdict | Reject incomplete handoff and request correction once; allow truthful blocked/not-run status. Schema checks do not prove quality | Deterministic schema check under 1 second |
| H07 Commit check / recommended | Local pre-commit with exact staged paths | Secrets, formatting, invalid config, accidental focus markers; inspect staged content | Stop commit on deterministic failures; log rule ID. Local bypass remains possible | A few seconds; avoid full regression |
| H08 Shared CI gate / recommended | PR/MR or push pipeline on the actual revision | Typecheck, discovery, guard probes, selected unit/API/UI tests, Vault links/source staleness | Required checks fail on their native failures; blocked prerequisites are not success. Branch/review policy supplies enforcement | Team budget by layer; cancel obsolete runs |
| H09 Completion claim / optional | Explicit PR review or supported stop event | Claimed outcome, diff, check table, unresolved failures, target/data effects, verifier verdict | Request missing evidence; accept honest incomplete handoff. Limit repetitions to prevent stop loops | Deterministic completeness check; AI review once per meaningful diff |

## Bypass, false-positive, and probe record

| ID | Known bypass/limit | False-positive recovery | Required probes |
| --- | --- | --- | --- |
| H01 | Different assistant/session; stale cached target; output ignored | Refresh source and show unknown; fix resolver reference | Fresh + resumed session, dirty repo, unset target, missing Vault, secret-free output |
| H02 | Shell, copied secret, alternate connector, subagent or direct API call | Owner reviews exact task/destination and adjusts scoped rule; keep service deny | Allowed target, denied target, malformed input, timeout/crash, alternate path/tool, revoked permission |
| H03 | Shell edits, manual editor, multi-file patches, semantic weakening without count change | Reviewer examines the diff; document a narrow reviewed exception | Safe edit, new focus/skip, assertion removal, guard removal, malformed payload, protected file, outside root, shell bypass |
| H04 | Watcher absent, events coalesced, edits outside watched path | Run the same check directly; fix scoped mapping | Allowed change, lint failure, outside-assistant edit, repeated event, generator loop, cancelled process |
| H05 | Someone invokes the runner directly; abrupt kill may miss final record | Inspect preserved native artifacts and rerun only the missing approved check | Good target, wrong target, failed/skipped tests, retry, report failure, cleanup failure, cancellation |
| H06 | Agent stops outside orchestration; invented citations still fit schema | Return missing fields and inspect original evidence; no automatic retries without bound | Valid output, missing field, missing artifact, invalid verdict, truthful blocked result, repeated failed handoff |
| H07 | No hooks installed, skip flag or alternate Git client; staged vs working-tree mismatch | Fix the actual staged content or reviewed rule; required CI still runs | Clean staged diff, staged secret fixture, focus marker, working-tree-only fix, bypass followed by CI failure |
| H08 | Misconfigured required check, excluded branch/path, privileged actor bypass | Repair pipeline/policy; never rename a failing check merely to evade it | Actual PR/MR trigger, failing guard/test, unavailable secret, skipped job, fork/low-trust input, correct artifacts |
| H09 | Unsupported stop event, incomplete claims outside the assistant | Supply actual evidence or label unable to verify; allow handoff after bounded attempts | Supported pass, unsupported pass, skipped reported passed, failure disclosed, no-run disclosure, no infinite loop |

## Selection worksheet

Copy one record into the adopting project's decision log for each selected hook:

```text
ID / owner / purpose:
Provider and installed version / operating system:
Exact event and matcher / evidence the event fires:
Trusted policy inputs / untrusted tool payload fields:
Rule and intended decision / actual enforcement layer:
Task authorization this consumes, if any:
Input/output size limit / timeout / cost budget:
Malformed input / timeout / crash behavior:
Known bypass paths and compensating controls:
False-positive correction / exception owner and expiry:
Probe evidence: allowed, denied, malformed, timeout, bypass:
Revalidation trigger and next review date:
```

## Event timing matters

Do not map all rows to a single assistant hook. Session context supplies orientation; pre-tool checks can intervene before a supported action; post-tool/file-change checks inspect completed changes. A runner wrapper can bind the resolved target at the actual execution boundary. Git and CI cover different boundaries. A verifier can run at a controlled workflow step even when the assistant has no subagent completion event.

For a pre-edit check, reconstruct full files or use a verified diff parser. Replacement fragments alone do not reliably show removed assertions or unchanged context. The neutral [edit checker](hooks/check-edit.mjs) deliberately returns a review signal; pair it with assertions executed by the native runner and a verifier who checks intent.

For post-edit inventory generation, write only an owned generated section, ignore the generator's own outputs, debounce events, and retain a reviewable diff. Never auto-approve generated Vault content. For run reporting, preserve native status independently of AI commentary and external delivery status. A failed upload must not transform a failed test into a pass.

## Adoption evidence

Keep the probe results next to the project's selected configuration. A static JSON parse confirms syntax shape only. A script unit test confirms only that script's behavior. Claim an installed hook blocks only after observing the installed provider reject the actual tool event before execution. Repeat probes after provider upgrades or matcher/payload changes. The provider-specific example in this kit is documentation-reviewed and still requires these local probes.
