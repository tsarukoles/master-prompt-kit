---
id: REPLACE-WITH-STABLE-ID
title: Test data and accounts
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

# Test data and accounts

## Data ownership

| Fixture/data namespace | Synthetic/shared | Target scope | Owner | Creation path | Cleanup and failure recovery | Retention |
| --- | --- | --- | --- | --- | --- | --- |
| UNSET | UNSET | UNSET | UNSET | UNSET | UNSET | UNSET |

## Identity use

| Identity alias | Role/scopes | Approved targets | Secret-store reference only | Renewal owner | Prohibited effects |
| --- | --- | --- | --- | --- | --- |
| UNSET | UNSET | UNSET | UNSET | UNSET | UNSET |

- Isolation key and collision prevention for parallel/retried runs: UNSET
- How the test proves ownership before update/delete: UNSET
- Cleanup behavior after assertion failure or cancelled run: UNSET
- External emails, payments, webhooks, and notifications disabled or sandboxed by: UNSET
- Allowed evidence fields and redaction policy: UNSET

Keep passwords, tokens, real personal records, and connection strings out. A reference points to an approved secret service; it must not contain the secret. Prefer synthetic data. A database schema map does not grant permission to read or copy business rows.
