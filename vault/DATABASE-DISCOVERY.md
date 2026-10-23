# Optional database structure discovery

Use this workflow only when company policy and the database owner permit it. Its output helps QA design fixtures, boundary cases, persistence assertions, cleanup order, and environment compatibility checks. It maps structure; it does not prove application behavior or authorize direct database testing.

## Choose the least intrusive source

Prefer current migration files, schema-as-code, an approved data catalog, or a sanitized export prepared by the database owner. Record what that source can and cannot prove. Migrations can describe intended schema while a deployed environment has drifted. If a live catalog query is justified, approve each environment separately and use the owner-provided metadata identity or broker. Do not discover hostnames or credentials by scanning secret files.

Use [the database map template](templates/DATABASE-MAP.md) as the proposed scan record. Stop before connecting until its policy, owner, environment, allowed schemas, exclusions, approved query revision, time/result limits, storage, and AI processing fields are filled. Authorization to inspect staging does not authorize production, replicas, linked servers, or other databases. Prefer an owner-run export when a suitably narrow identity is unavailable.

## Scan contract

| Item | Required decision |
| --- | --- |
| Purpose | Named QA decisions this inventory should support |
| Scope | Engine/version, target alias, database, exact allowed schemas/objects and excluded objects; verify the actual connection matches |
| Access | Existing metadata permissions approved by the owner; no automatic grants, role changes, elevated retry, or access workaround |
| Query | Review the exact catalog-only statement set for this engine/version; record its revision/hash |
| Limits | Example starting budget: 3 seconds per query, 1 second lock wait, 1,000 metadata records per result, one scan per approved change; owner may choose stricter limits |
| Output | Columns/types, keys, constraints, relevant index structure and declared relationships; no row-value samples or object definition text by default |
| Handling | Private raw location, output cap, classification, retention/deletion date, approved model destination and sanitized-map reviewer |
| Failure | Stop on mismatch, denial, timeout, unexpected output or cap; record partial state; do not broaden scope or retry automatically |

The examples in [PostgreSQL](../adapters/databases/postgresql/README.md) and [SQL Server](../adapters/databases/sqlserver/README.md) intentionally have empty allowed-schema lists. They are reviewed illustrations, **not live-validated adapters**. They do not connect to a database. A DBA must adapt and validate them in an isolated fictional database before company use.

## What to record

Record table/view identity, ordered columns, native type (including length/precision/scale where known), nullable state, primary and unique key column order, foreign key column pairs in order, delete/update actions, validation/enforcement state, check-constraint identity, and relevant index key/include structure. Keep an explicit `unknown` for unavailable information. A denied or filtered object is not an absent object.

Do not include `SELECT *` from business tables, row samples, table exports, record counts, statistics histograms, stored procedure/view/default bodies, or free-text comments by default. Even a check/default expression can contain restricted literals; have the owner provide a sanitized expression separately when a test needs it. Metadata names can disclose internal business information, so metadata is not automatically safe to publish or send to AI.

Normalize snapshots using [NORMALIZED-INVENTORY.md](NORMALIZED-INVENTORY.md). Distinguish a declared relationship from a naming hypothesis. A foreign key describes allowed references; it does not prove actual row counts or that the application enforces every business invariant. Mark inferred cardinality as unknown unless supported by key/nullability/enforcement evidence and reviewed interpretation. Composite key positions must remain paired.

PostgreSQL information-schema visibility is privilege-dependent. In particular, `referential_constraints` can omit relationships for a SELECT-only identity; do not grant writes to fill the map. Native catalogs have different visibility, so owner scope still matters. SQL Server catalog results may also omit objects because of permissions. Compare with an owner-supplied expected inventory when available. Never call a map complete merely because the queries succeeded. [PostgreSQL columns](https://www.postgresql.org/docs/18/infoschema-columns.html), [PostgreSQL relationships](https://www.postgresql.org/docs/18/infoschema-referential-constraints.html), [SQL Server visibility](https://learn.microsoft.com/en-us/sql/relational-databases/security/metadata-visibility-configuration?view=sql-server-ver16).

## Review, store, and use

1. Save the raw result only in the approved private location. Ensure logs and assistant transcripts do not echo restricted metadata.
2. Compare expected versus observed objects, include denied/truncated queries, and state the exact visibility limit. Ask the owner to explain a discrepancy.
3. Generate a sanitized draft map and relationship table. Remove restricted endpoints and preserve a note that they were excluded. Do not invent replacement business facts.
4. Let the database owner review structure and classification, and let QA review links to fixtures, cases, API contracts, and cleanup rules. Promote only the approved map into the project Vault.
5. Link a case to the tables it depends on only when an API contract, query, or owner confirms that dependency. Use the map to propose tests; verify behavior with appropriate assertions and approved data.

## Structural drift

Compare separate, environment-stamped snapshots with the same approved scope and compatible query/version. Match by qualified logical identity, preserve type spelling, and normalize ordering only. Report added/removed objects, type/nullability changes, reordered composite keys, relationship actions, and constraint validation changes. Do not join live data across environments or issue migrations.

If visibility, redaction, query version, or truncation differs, label the comparison `inconclusive` for affected objects. A missing table may be hidden. The owner classifies each real difference as expected deployment lag, intentional environment difference, or defect. QA then selects affected cases and fixture updates. The verifier checks evidence and unresolved unknowns before the map is called current.

## Required adoption probes

Use fictional databases to prove: empty scope returns no objects; one schema excludes another; composite keys pair correctly; limited visibility is reported; a denied catalog query does not escalate; timeout/cap produces partial status; external-schema relations are omitted; restricted expressions remain excluded; two snapshots show a known type change; and unequal visibility yields an inconclusive drift finding. No live company scan was performed for this kit.
