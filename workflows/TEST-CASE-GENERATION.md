# Generate and review test cases

**Trigger:** an approved requirement, incident, or risk needs new or revised coverage. **Owner:** QA owner with product owner resolving business meaning. **Inputs:** original source, existing cases/tests, architecture decisions, target/data policy. **Roles:** designer, independent verifier, then implementer.

1. Extract each observable behavior and forbidden effect with a source citation. Mark ambiguities and assumptions. Do not adopt current buggy behavior as the requirement.
2. Search the case catalog and actual tests for duplicates and nearby coverage. Record whether a case exists, is automated, and has current run evidence; these are different states.
3. Build the risk matrix. Consider positive, negative, boundary, permission, lifecycle, concurrency/retry, accessibility, and recovery cases where applicable. Give omissions a reason.
4. Draft cases using the [template](../testing/CASE-TEMPLATE.md). State identity, data ownership, steps, meaningful expected outcomes, forbidden effects, layer, setup/cleanup, and automation priority.
5. Independently review the draft against original behavior. Reject tautological expectations, missing unauthorized paths, unsupported assumptions, and cases that cannot be executed safely.
6. Have the relevant owner resolve open semantics and accept case intent. Record stable ID, version, owner, status, and source. Existing approval of explicit criteria can satisfy this gate; do not ask for repetitive confirmation.
7. Hand one reviewed slice to implementation. External test-management posting is a separate authorized action using the reporting/integration workflow.

**Output:** approved cases plus draft/blocked cases, coverage matrix, duplicate decisions, source citations, and implementer scope. **Stop:** only the affected case when behavior, policy, or setup is unresolved. Drafting a case never produces an executed pass.

## Prompt to use

```text
Use agents/TEST-DESIGNER.md and workflows/TEST-CASE-GENERATION.md.
Read [requirement] and existing [case catalog/tests] at [revision].
Draft cases for [behavior] within [target/data scope].
For each case identify the exact observable assertion, forbidden side effects,
source, risk, layer, setup/cleanup, and known exclusions.
Identify duplicates and unresolved business questions. Do not execute or post cases.
Return a traceability table and the completed case templates for independent review.
```

**Example:** a requirement says an invalid discount must be rejected without changing the cart. Separate "error returned" and "cart unchanged" expectations. A case that merely checks the response is nonempty misses both business outcomes.
