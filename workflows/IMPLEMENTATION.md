# Implement one automation slice

**Trigger:** a case or repair has agreed intent and bounded scope. **Owner:** test/framework maintainer. **Inputs:** original requirement, case IDs, architecture, actual repository revision, allowed effects, and required checks.

1. Inspect existing tests, helpers, runner config, scripts, and target/data rules. Capture starting state and preserve unrelated changes.
2. State the smallest file change and test selection. Choose the fastest layer that proves the requirement. Reuse established fixtures and helpers where they preserve intent.
3. Write explicit assertions for observable behavior and forbidden effects. Use deterministic fixtures and meaningful state waits. Keep assertions visible to reviewers.
4. Bind actual target before execution. Put action guards at the real mutating boundary, including setup and cleanup. Importing/discovering tests must not make external changes.
5. Run relevant static and contract checks. Discover tests only after reviewing import/setup behavior. Run the selected approved cases and preserve native output, including failures, skips, attempts, and cleanup status.
6. Use a bounded negative control when it tests a real uncertainty about assertion strength. Do not add test scaffolding solely to echo implementation details.
7. Prepare the verifier packet with original sources, actual revision/diff, required checks, native evidence, observed effects, and honest limitations.
8. Apply supported reviewer corrections and rerun affected checks. A new revision needs a new verification decision; the previous verdict is stale for changed behavior.

**Output:** focused diff, case-to-assertion map, selected test results, effects/cleanup, and verifier packet. **Stop:** product defect, unsafe action, missing data ownership, or scope expansion. Preserve a failing requirement test rather than changing expected behavior to green.

## Prompt to use

```text
Use agents/IMPLEMENTER.md and workflows/IMPLEMENTATION.md.
Implement reviewed cases [IDs] against original requirement [path].
Scope is [files and behavior]; allowed target/data/effects are [scope].
Preserve existing conventions and unrelated changes.
Run [required checks] and record actual outcomes and raw evidence paths.
Return a focused diff explanation and verifier packet. State anything not run.
```
