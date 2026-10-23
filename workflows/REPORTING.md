# Results and external reporting

**Trigger:** a native run completes or the owner requests a status update. **Owner:** QA/reporting owner. **Inputs:** native results and artifacts, original case inventory, actual revision/target, run identity/time, retries, cleanup, and verifier verdict.

## Build the evidence before the narrative

1. Read the native report with an adapter tested against that runner/version. Preserve the raw report in an approved store and retain its provenance.
2. Normalize each test result with run ID, requirement/case/test ID, source revision, actual target, selection, start/end time, outcome, attempts, artifact references, cleanup, and source adapter/version. Use [run-result.schema.json](../schemas/run-result.schema.json). A generated draft has no execution result.
3. Reconcile expected selected cases with observed cases. Report absent cases as not run or missing evidence. A process exit code alone is insufficient to classify each test.
4. Keep `passed`, `failed`, `skipped`, `blocked`, and `not_run` distinct. A retry pass keeps the first failure and retry count. Discovery-only output never becomes a run result.
5. Redact secrets, private row data, tokens, raw user identifiers, and restricted URLs according to company policy. Link to access-controlled artifacts when inline details are unsuitable. AI receives only permitted data.
6. Produce a deterministic count/coverage summary before an AI explanation. The explanation cites evidence and labels hypotheses. An AI must not rewrite the normalized outcomes.
7. Preview the exact destination and payload. Use an existing scoped authorization or obtain the decision required for the external action. Reading a ticket is not authorization to comment on it.
8. Post through the approved adapter with an idempotency key derived from run identity, destination, action type, and payload version. Record receipt/object ID; read back the posted state.
9. If the write outcome is unknown, query by idempotency key or object ID before retrying. If unsupported, stop for reconciliation. Never duplicate a post because a timeout hid the response.

## Example local report

The normalized run contract uses `runId`, `revision`, `environment`, `startedAt`, `endedAt`, `adapter`, `selection`, `tests`, `cleanup`, and `nativeReport`, plus `schemaVersion`. Each test has `testId`, `requirementIds`, `caseIds`, `outcome`, `attempts`, and `evidence`. The human-readable summary below is derived from that record; it must not become a competing source of truth. Attempt details and artifact references remain in native evidence. If an adapter cannot preserve those details, mark its limitation before adopting it.

```text
Scope: BOOK-01 capacity cases, revision <actual revision>, target local synthetic
Run: <native run ID and timestamp>
Results: 3 passed, 0 failed, 1 skipped, 0 blocked, 1 not run
Skipped: concurrency integration — no approved database fixture
Not run: browser smoke — outside this slice
Attempts: all executed cases passed first attempt
Cleanup: no external data created
Verifier: accept for local capacity slice; integration behavior unverified
Evidence: <native report and case mapping>
Decision: accept local slice; retain integration gap for owner planning
```

This is a format example, not an actual run result. Replace every count and placeholder from native evidence.

## Delivery contract

Define destination project/object, allowed operation, audience, fields, idempotency/retry behavior, timeout, redaction, readback, and recovery before enabling automatic posting. Test with a local fake first. A fake proves contract behavior; live identity/scopes and service semantics require a separately approved integration trial.

**Output:** local evidence-backed report; optional authorized external receipt and readback. **Stop:** inconsistent source/target, missing required report, unapproved disclosure, unknown previous write outcome, or unsupported destination. Preserve truthful partial status.
