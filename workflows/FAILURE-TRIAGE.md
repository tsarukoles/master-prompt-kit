# Failure triage and controlled repair

**Trigger:** failure, flake, suspicious pass, or blocked check. **Owner:** component/test maintainer. **Inputs:** original expectation, first failure, all attempts, revision, actual target/data, recent changes, and cleanup status.

1. Preserve native evidence and the original expectation. Record the symptom, not an invented cause.
2. Confirm revision, selection, target, account/role, fixture ownership, and dependency state. A wrong target or missing prerequisite may explain the result before any code repair is appropriate.
3. Classify product defect, test defect, environment/dependency, flaky behavior, or unknown using the [policy](../testing/DATA-AND-FLAKE-POLICY.md). List supported hypotheses and the smallest discriminating check.
4. Reproduce only within approved scope and retry budget. Keep all attempts. An unsafe write or ambiguous previous outcome is not safe to retry automatically.
5. For a product defect, preserve the failing assertion and draft a defect record. For a test defect, propose the narrow repair and explain how it preserves intent. For environment issues, route to its owner. Leave unknown causes explicitly unknown.
6. Invoke independent verification for assertion, locator, wait, retry, skip, quarantine, guard, cleanup, or result-interpretation changes. Re-run affected checks at the repaired revision.
7. Update the runbook and case metadata only with confirmed findings. External defect creation or notifications require the exact authorized integration action.

**Output:** expected/actual comparison, evidence, classification confidence, repair or owner action, first/retry results, remaining risk, and cleanup. **Stop:** unsafe scope, exhausted budget, or insufficient evidence.

## Self-healing rules

Automatic repair is suitable only when a bounded proposal can preserve approved intent and be checked. A changed selector may be reasonable when the same semantic control moved; selecting a different control because it is easier to click changes the test. Replacing expected text with observed text may hide a product defect. Increasing timeouts can hide a performance regression.

Permit an assistant to draft a repair, run safe checks, and explain its evidence. Do not let a healing loop silently merge, remove assertions, bypass guards, or quarantine tests. Set a maximum attempt count and stop when no new evidence supports another change.
