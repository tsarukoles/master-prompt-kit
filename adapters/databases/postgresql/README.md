# PostgreSQL metadata illustration

Status: query design reviewed against official PostgreSQL 18 documentation on 2026-10-22; **not live-validated**. No database connection was made. [metadata.sql](metadata.sql) is a catalog-only illustration for review by a database owner.

## Review and execute only through the approved route

1. Fill the [scan contract](../../../vault/templates/DATABASE-MAP.md) and prefer an approved export if available. Use a scoped metadata broker/identity; do not add business-table SELECT or write privileges merely to improve visibility.
2. Check the actual server version and target alias through the approved client. Review every query for that version. This illustration includes PostgreSQL 18 constraint fields; earlier versions need an explicitly reviewed adaptation.
3. Each query begins with an empty `approved_schema` CTE. Replace only its empty array with the identical, owner-approved schema list in a reviewed local copy. Keep both endpoints in scope for foreign-key queries. Do not add all schemas or remove scope filters to discover more.
   The example permits all included object/column metadata in a selected schema. For narrower policy, the DBA must add reviewed object/column allowlists across all relevant queries before execution; post-collection redaction is insufficient.
4. The script uses a read-only transaction, local statement/lock timeouts, and a 1,001-record sentinel per result. The client must enforce an overall time/output budget and cancel/close on failure. Never leave an idle transaction open. On error roll back/close; do not continue to another environment automatically.
5. Map the six result sets to objects, columns, keys, relationships, check identities, and indexes. Preserve each result set's truncation/denial state. 1,001 returned records means incomplete; it is not permission for an unbounded rescan.
6. Store raw metadata privately, redact/classify it, then obtain owner review of a sanitized map. Query success is not proof of full visibility or business correctness.

## Provider interpretation

The information schema is permission-filtered; its relationship view can omit foreign keys for SELECT-only identities. This illustration uses native catalogs under explicit schema scope instead. Catalog visibility is not identical to table-data privileges; an owner-approved schema list remains essential. Never work around a catalog denial or grant writes to improve metadata coverage. [Columns](https://www.postgresql.org/docs/18/infoschema-columns.html), [relationship visibility](https://www.postgresql.org/docs/18/infoschema-referential-constraints.html).

`pg_constraint` supplies ordered constrained/referenced column arrays and constraint state. Keep composite pairs in order and preserve unvalidated/unenforced flags. Index expressions and predicates, check bodies, defaults, and view definitions are omitted because they can disclose sensitive literals. Ask for a sanitized owner export if those definitions are needed. [Constraint catalog](https://www.postgresql.org/docs/18/catalog-pg-constraint.html).

A read-only transaction is an additional execution setting, not a substitute for a narrow identity or query review. Timeouts limit resource use; they do not prove a consistent whole-database snapshot. A concurrent migration can make the result uncertain; prefer an owner-approved schema version/export if consistency is needed. [Read-only transaction](https://www.postgresql.org/docs/18/sql-set-transaction.html), [client timeout settings](https://www.postgresql.org/docs/18/runtime-config-client.html).

## Required fictional validation

Create fixtures outside company systems using an owner-approved test setup: two schemas, a composite key/FK, a nullable column, unique key, check, index, restricted object, and an out-of-scope reference. Verify all six outputs and pairing; test empty scope, denial, timeout, cap, partial visibility, and an intervening migration. This release has not run these provider probes. It therefore offers reviewed SQL examples, not a functioning production scanner.
