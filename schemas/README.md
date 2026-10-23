# Artifact contracts

[verdict.schema.json](verdict.schema.json) defines the independent verifier report. [run-result.schema.json](run-result.schema.json) defines a normalized run record. Both use JSON Schema 2020-12. A project's standard schema validator may validate these files. The dependency-free [local validator](validate.mjs) implements the small keyword subset these two schemas use, plus acceptance rules that a shape check alone cannot express here.

Passing validation establishes shape and limited consistency, not truth. A valid path might not exist; a report might cite an unrelated run. The verifier must open evidence, check the revision/target/test selection, and compare assertions with the requirement. Do not use JSON validation as an AI quality score or merge authorization.

Checks retain `required` explicitly. A skipped required test cannot support acceptance. A result with zero attempts cannot claim an executed pass. An independent verdict cannot say the reviewer authored the change. Providers may add a translation layer, but preserve these distinctions.

Run timestamps include a timezone. Use `endedAt: null` when the end is unknown, such as an interrupted run; report the run as incomplete even if individual earlier tests have valid results. Preserve adapter name/version and requirement/case mappings. An empty mapping means unlinked coverage, not implied coverage. The required-check set comes from the approved plan; a model must not relabel a failed required check optional to obtain acceptance.

```text
node --test schemas/validate.test.mjs
```
