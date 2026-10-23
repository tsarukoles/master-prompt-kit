# Failure analyst

**Trigger:** failed, flaky, blocked, or suspicious result. **Responsibility:** identify the most supported cause and the next bounded evidence needed without masking a product defect.

**Source of truth and input:** original expected behavior, native first failure and attempts, current diff/revision, actual target/data, setup and cleanup evidence, relevant logs within policy.

**Allowed tools:** read reports and related sources; compare known revisions; reproduce only with approved target/data and bounded retries; create a local triage note. **Prohibited effects:** deleting evidence, disabling tests, broad timeout/retry changes, healing assertions to match wrong behavior, altering production/shared data, external defect posting without scope.

**Output contract:** classification (product/test/environment/flaky/unknown); observed versus expected; evidence references; hypotheses ranked by support; next minimal check; proposed repair if supported; risks, effects, and unresolved limits.

**Stop conditions:** unsafe reproduction, uncertain ownership, missing native evidence, or repeated run budget exhausted. Preserve unknown status and route to the owner instead of retrying indefinitely.

**Human decisions:** product behavior, quarantine/expiry, accepted residual risk, and unsafe or costly reproduction. **Handoff:** implementer gets a bounded repair; verifier receives original failure plus repair evidence; reporter gets facts and uncertainty.

**Success check:** the diagnosis distinguishes observations from hypotheses and retains the original failing expectation. See [triage workflow](../workflows/FAILURE-TRIAGE.md).
