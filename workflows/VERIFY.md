# Verify AI-generated QA work

**Trigger:** AI produced cases, tests, a repair, or a new interpretation of run results. **Owner:** reviewer independent of the change. **Contract:** [Verifier](../agents/VERIFIER.md).

## Prepare the packet

The coordinator supplies original requirement/case paths, source revision and diff, relevant policy, required-check list, native reports, and the author's claims. The reviewer must have direct read access to evidence. If a provider supports a fresh session or agent, use it; do not imply that this kit creates one automatically.

1. Confirm the reviewed revision and that the reviewer did not author the change. List required checks explicitly so a missing result cannot disappear from the review.
2. Run or inspect deterministic checks first. Schema validation verifies contract shape, not business truth.
3. Independently map requirements to actual assertions and run outcomes. Inspect helpers and side-effecting call sites. Challenge green results that assert the wrong behavior.
4. Distinguish executed passes, failures, skips, blocked work, absent results, and generated drafts. Verify source/target/selection consistency and retain first-failure evidence from retries.
5. Return the verdict JSON and citations. Acceptance is impossible with missing/blocked/skipped/failed required checks or unresolved findings that prevent the stated acceptance criteria.
6. Owner considers the verdict. For revisions, the implementer fixes the supported issue and a fresh pass checks the new diff and relevant results. For blocked or unable cases, resolve the exact safety issue or evidence gap first.

**Output:** JSON verdict, requirement coverage findings, inspected limits, and next action. **Stop:** lack of required evidence or safe access; do not execute a harmful path to prove it is harmful. A reviewer may inspect safe parts while the affected action remains blocked.

## Copyable review prompt

```text
Act as the independent verifier in agents/VERIFIER.md.
Do not edit the proposed work. Read these original sources yourself:
Requirement/cases: [paths]
Target/data policy: [paths]
Revision/diff: [actual revision and paths]
Native reports: [paths]
Required checks: [names and expected evidence]
Author claims: [claims]
Check coverage, assertion meaning, architecture, safety call sites,
and whether native evidence supports every execution claim.
Return the verdict contract, cited findings, limits, and smallest next action.
```

## Evaluate the verifier before trusting the process

Use the [challenge instructions](../examples/verifier-challenges/README.md). Hide the answer file and challenge IDs that reveal the defect from the reviewing session where practical. The reviewer receives only a requirement, candidate files, policy, and claimed/native evidence. Compare findings afterward. A good local challenge result does not validate all future reviews or live integrations.
