# Optional database metadata adapters

Start with the [policy-gated discovery workflow](../../vault/DATABASE-DISCOVERY.md), not a connection command. Prefer migrations or an approved DBA export. A live database scan is optional and requires a separate scope decision for each environment.

| Adapter | Included | Validation state |
| --- | --- | --- |
| [PostgreSQL](postgresql/README.md) | Bounded catalog-query illustration, column/key/FK/check/index mapping | Official PostgreSQL 18 docs reviewed; not executed against a database |
| [SQL Server / MSSQL](sqlserver/README.md) | Bounded catalog-query illustration with permission caveats | Official SQL Server catalog docs reviewed; not executed against a database |

Both SQL files have empty schema scopes and no credentials or connection code. Their defaults return no object inventory. Do not label that empty result a complete map. The adopting database owner must review and validate the exact query on a fictional database and a restricted identity before authorizing company metadata access. Other engines require a reviewed adapter rather than guessed SQL.

The illustrations implement schema-level scope. Use them only when the owner permits the included metadata for every returned object in each listed schema. If policy excludes objects or columns within a schema, the DBA must add explicit object/column allowlists to every affected query and both relationship endpoints, then repeat the probes. Redacting after collection does not authorize collecting forbidden metadata.

The owner-approved broker/client must bind the actual database to the approved environment, constrain identity and scope, apply client query/output limits, stop on denial or truncation, and keep raw results local. Read-only statements still consume resources and may expose sensitive metadata. Neither file is a universal security boundary.

Normalize approved results with [the inventory contract](../../vault/NORMALIZED-INVENTORY.md). Do not mix snapshots from different environments, fetch business rows to enrich a map, or automatically change schema or privileges.
