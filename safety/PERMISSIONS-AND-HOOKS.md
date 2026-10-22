# Permissions, hooks, and secrets

Use the assistant's native permission controls for tool access. Allow routine read and deterministic checks only after confirming their effects. Ask for review on external writes, publication, account changes, and irreversible actions. Deny access to secret-bearing files and credential stores unless a task has a narrow authorized route. The operating-system or service identity must have only the access needed for that route.

Hooks are event-driven checks, not a universal firewall. Document the exact event, matcher, input payload, exit behavior, and bypass paths for the installed assistant version. A pre-use hook can reject an assistant's edit before it happens. A post-use hook can record or check a change after the fact; it cannot undo the change. A Git hook covers a different event. CI covers only the commands and files it actually checks.

## Hook design worksheet

| Question | Required answer |
| --- | --- |
| What event starts it? | Exact tool, file, Git, or CI event |
| What does it inspect? | Specific inputs and trusted source |
| What does it block or warn about? | Concrete rule and message |
| What happens on malformed input? | Explicit fail-open or fail-closed decision and reason |
| How is a false positive fixed? | Reviewed change to the rule, not silent bypass |
| How is it tested? | Allowed, blocked, malformed, and bypass-path probes |

Simple text scans are useful warnings but are not complete secret detection or semantic code review. A regular expression counting assertions can miss a weakened assertion. Pair hooks with review and meaningful tests. Never put a live secret in a prompt, example, committed environment file, log, or ZIP.
