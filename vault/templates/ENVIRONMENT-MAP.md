---
id: REPLACE-WITH-STABLE-ID
title: Environment map
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

# Environment map

## Target contract

| Target alias | Purpose | Resolver/config source | Approved origin or private reference | Permitted actions | Owner |
| --- | --- | --- | --- | --- | --- |
| UNSET | UNSET | UNSET | UNSET | UNSET | UNSET |

- Default if the target setting is missing: stop and report unknown.
- Identity/scopes reference, without credentials: UNSET
- Allowed test-data namespaces and mutation limits: UNSET
- Action-time guard location and tests: UNSET
- External services that may receive traffic: UNSET
- Cleanup/recovery and escalation contact: UNSET

## Run eligibility versus action permission

List tests eligible for each target and the reason. Separately list what each real service identity can read or change. A skipped test must report skipped; a target name alone does not authorize a write. Before running, match this map to the actual resolver and connection. Never commit live tokens or credential-bearing URLs.
