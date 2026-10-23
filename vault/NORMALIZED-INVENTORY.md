# Database inventory interchange contract

Keep one snapshot per environment and source revision. This is a document contract, not a database connector. [inventory.example.json](inventory.example.json) is fictional and demonstrates a partial map.

| Record | Required fields |
| --- | --- |
| Snapshot | `schemaVersion`, `snapshotId`, `environment`, `databaseAlias`, `engine`, `engineVersion`, `sourceKind`, `sourceRevision`, `capturedAt`, `queryRevision`, `scope`, `visibility`, `classification`, `ownerReview` |
| Scope | Approved schema names, excluded categories/objects, approval reference, private identity alias, query/result limits; no secrets or connection string |
| Visibility | `status` = `partial`, `unknown`, or `owner-confirmed-within-scope`; expected and observed object counts or null; truncation and denied queries; limitations |
| Object | Environment-local ID, schema, name, kind (`table`, `view`, `materialized-view`, `foreign-table`), source reference, columns, keys, checks, indexes |
| Column | Name, ordinal, native type, nullable (`true`, `false`, or null), optional length/precision/scale and generated/identity flags |
| Key | Constraint name, kind (`primary` or `unique`), ordered column names, validation/enforcement state if known |
| Relationship | Identity, evidence kind (`declared` or `hypothesis`), source and target object IDs, ordered `{from,to}` column pairs, update/delete rule, enabled/validated state, cardinality conclusion and its evidence |
| Check | Name, validation/enforcement state; sanitized expression only with explicit approval; otherwise `expressionIncluded: false` |
| Index | Name/type, ordered key columns, included columns, uniqueness, validity/disabled state; mark expression or partial/filter details omitted where restricted |

Use schema + object name for stable matching within the same logical database. Keep native object IDs as optional source evidence only: IDs can change after recreation. Preserve case and quoting rules. Retain native type information rather than silently treating different engines' types as identical. SQL Server length may be expressed in bytes; do not label it characters without a valid conversion. Unknown and absent are distinct values.

Group composite-key rows by constraint plus source object, then sort by ordinal. An index's included column is not part of its unique key. A nullable reference has different optionality from a mandatory one; filtered indexes, disabled/unvalidated constraints, views and partial access may prevent confident cardinality inference. Store the declared facts and leave the inferred business cardinality unknown when uncertain.

The SQL examples return bounded result sets. If any contains the 1,001st sentinel record, preserve the partial status and stop; do not silently truncate to 1,000 and claim completeness. Record each result set's limit independently. Scope pagination or a larger limit needs an owner-reviewed plan.

Generated snapshot records remain drafts. A source says what was observed; `ownerReview` says what was approved for the stated use. The approved human map belongs in [DATABASE-MAP.md](templates/DATABASE-MAP.md); raw snapshots stay in controlled storage.
