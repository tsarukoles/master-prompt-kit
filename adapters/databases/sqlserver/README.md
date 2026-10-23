# SQL Server / MSSQL metadata illustration

Status: catalog-query design reviewed against official SQL Server documentation on 2026-10-22; **not live-validated**. No database connection was made. [metadata.sql](metadata.sql) is an illustration for owner review on the installed engine/version.

## Review and execute only through the approved route

1. Fill the [scan contract](../../../vault/templates/DATABASE-MAP.md). Prefer a sanitized owner export or migration source. Scope each environment/database separately; the script does not enumerate servers, linked servers, or databases.
2. Use an owner-provided metadata identity/broker without user-table data or write privileges. SQL Server has no PostgreSQL-style `BEGIN READ ONLY` here. A transaction rollback or read-intent connection string is not a permission boundary. The owner must enforce actual permissions.
3. Every query uses an empty allowed-schema CTE. Replace it in a reviewed local copy with the identical explicit approved scope; for example, an owner-approved `VALUES` list of schema names. Never replace it with an unrestricted schema query. Both ends of a relationship remain scoped.
   The example permits all included object/column metadata in a selected schema. For narrower policy, the DBA must add reviewed object/column allowlists across all relevant queries before execution; post-collection redaction is insufficient.
4. Set a client command timeout, an overall execution/output budget, and cancellation behavior before sending the query. `LOCK_TIMEOUT` only limits lock waiting, not total query runtime. Close the dedicated connection afterward so session settings are not accidentally reused.
5. Each result set returns at most 1,001 metadata records for a 1,000-record budget. A sentinel, denied query, timeout, or mismatch means partial/incomplete. Stop and review the plan rather than increasing access or scope automatically.
6. Keep raw results private and obtain owner review of the sanitized map. Definitions, row values, and table counts are intentionally excluded.

## Provider interpretation

Catalog visibility is permission-dependent. An owner may provide narrowly scoped metadata rights or a broker/export; never add `VIEW DEFINITION` broadly or grant data reads merely to make the map look complete. Empty metadata is not proof of absence. [Metadata visibility](https://learn.microsoft.com/en-us/sql/relational-databases/security/metadata-visibility-configuration?view=sql-server-ver16).

Column type names join through `user_type_id`; retain type schema and native length/precision/scale. `max_length` is bytes and can use a sentinel for large types, so do not automatically label it character count. [Columns](https://learn.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-columns-transact-sql?view=sql-server-ver16).

Foreign-key column pairs use `constraint_column_id` ordering. Preserve `is_disabled` and `is_not_trusted`; a declared but disabled/untrusted constraint cannot be treated as verified enforcement for existing rows. [FK columns](https://learn.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-foreign-key-columns-transact-sql?view=sql-server-ver15), [FK state](https://learn.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-foreign-keys-transact-sql?view=sql-server-ver16).

Index key order and included columns have different meanings; preserve both. Check names/state are collected while their expressions remain omitted for sensitivity review. Filter expressions, defaults, view/procedure bodies, and statistics are also outside this default scan. [Index columns](https://learn.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-index-columns-transact-sql?view=sql-server-ver16), [checks](https://learn.microsoft.com/en-us/sql/relational-databases/system-catalog-views/sys-check-constraints-transact-sql?view=sql-server-ver16).

## Required fictional validation

Use an isolated fictional database to validate a table/view, native types, composite PK/FK, unique key, included index column, check, disabled/untrusted constraint, restricted object, and out-of-scope endpoint. Probe empty scope, partial visibility, denial, query timeout, cap, and cancelled execution. Compare with an owner-supplied inventory. This release has not run these provider probes and does not claim a production-ready scan.
