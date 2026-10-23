---
id: REPLACE-WITH-STABLE-ID
title: Approved database map
schema_version: 1
status: draft
owner: UNASSIGNED
reviewer: UNASSIGNED
environment: UNSET
source: UNSET
source_revision: UNSET
updated_at: UNSET
review_due: UNSET
classification: UNCLASSIFIED
model_access: UNDECIDED
generation: human
approval_record: none
---

# Approved database map

## Policy and scan proposal

- QA purpose and company-policy reference: UNSET
- Database owner and approval record: none
- Environment, engine/version, database alias, and actual-target verification: UNSET
- Source priority: migrations / approved export / catalog / live metadata query.
- Exact allowed schemas/objects and exclusions: UNSET
- Identity alias and effective metadata permissions (no credentials): UNSET
- Exact query revision, timeout, lock wait, result cap, frequency: UNSET
- Private raw storage, classification, model access, retention and deletion: UNSET
- Sanitized-map reviewer: UNSET

A scan is blocked until these decisions are recorded. See [database discovery](../DATABASE-DISCOVERY.md) before using a live connection.

## Observed scope

- Source/scan timestamp and revision: UNSET
- Expected inventory from owner: unknown
- Observed objects and independent limit/truncation flags per result set: UNSET
- Denied/hidden/omitted objects, excluded expressions, and visibility limitations: UNSET
- Completeness: unknown / partial / owner-confirmed within stated scope.
- Owner confirmation and remaining unknowns: UNSET

## Structure

| Qualified table/view | Column and native type | Nullability | Keys/constraints | Source reference |
| --- | --- | --- | --- | --- |
| UNSET | UNSET | unknown | UNSET | UNSET |

| Relationship | Ordered from-column → to-column pairs | Declared or hypothesis | Actions / enforcement | Evidence / uncertainty |
| --- | --- | --- | --- | --- |
| UNSET | UNSET | hypothesis | unknown | UNSET |

Include relevant index key/include structure and check identity separately. Keep expressions omitted unless the owner approves a sanitized definition. Do not infer real row counts or actual multiplicity from a foreign key.

## QA use and drift

| Structure | Confirmed API/fixture/case link | Owner | Suggested QA check |
| --- | --- | --- | --- |
| UNSET | UNSET | UNSET | UNSET |

- Environment snapshots compared and compatible scope: UNSET
- Confirmed structural changes versus visibility uncertainty: UNSET
- Impacted fixtures/cases and owner decision: UNSET

No row values, counts, secrets, or raw business records belong in this map.
