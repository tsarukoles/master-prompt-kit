-- Documentation-reviewed PostgreSQL 18 illustration. NOT LIVE-VALIDATED.
-- No auto-connection. Owner approval and a scoped metadata identity/broker required.
-- Replace each EMPTY array only in an approved local copy with the SAME allowed schemas.
-- Empty scope returns no objects; it does not prove an empty database.
-- Client must cancel/close on error, apply an overall output/time limit, and keep results private.
-- Each result is capped at 1001; the last record is a truncation sentinel for a 1000-record budget.

BEGIN READ ONLY;
SET LOCAL statement_timeout = '3s';
SET LOCAL lock_timeout = '1s';

-- 1. Scoped objects. No table data or row counts.
WITH approved_schema AS (SELECT unnest(ARRAY[]::text[]) AS schema_name)
SELECT n.nspname AS schema_name, t.relname AS object_name, t.relkind AS object_kind
FROM pg_catalog.pg_class AS t
JOIN pg_catalog.pg_namespace AS n ON n.oid = t.relnamespace
JOIN approved_schema AS scope ON scope.schema_name = n.nspname
WHERE t.relkind IN ('r', 'p', 'v', 'm', 'f')
ORDER BY n.nspname, t.relname
LIMIT 1001;

-- 2. Ordered columns and native types. Defaults and generated expressions deliberately omitted.
WITH approved_schema AS (SELECT unnest(ARRAY[]::text[]) AS schema_name)
SELECT n.nspname AS schema_name, t.relname AS object_name,
       a.attnum AS column_ordinal, a.attname AS column_name,
       pg_catalog.format_type(a.atttypid, a.atttypmod) AS native_type,
       NOT a.attnotnull AS is_nullable, a.attidentity AS identity_kind,
       a.attgenerated AS generated_kind
FROM pg_catalog.pg_class AS t
JOIN pg_catalog.pg_namespace AS n ON n.oid = t.relnamespace
JOIN approved_schema AS scope ON scope.schema_name = n.nspname
JOIN pg_catalog.pg_attribute AS a ON a.attrelid = t.oid
WHERE t.relkind IN ('r', 'p', 'v', 'm', 'f') AND a.attnum > 0 AND NOT a.attisdropped
ORDER BY n.nspname, t.relname, a.attnum
LIMIT 1001;

-- 3. Primary/unique key columns in constraint order.
WITH approved_schema AS (SELECT unnest(ARRAY[]::text[]) AS schema_name)
SELECT n.nspname AS schema_name, t.relname AS object_name,
       c.conname AS constraint_name, c.contype AS constraint_kind,
       k.ordinality AS key_ordinal, a.attname AS column_name,
       c.convalidated AS is_validated, c.conenforced AS is_enforced
FROM pg_catalog.pg_constraint AS c
JOIN pg_catalog.pg_class AS t ON t.oid = c.conrelid
JOIN pg_catalog.pg_namespace AS n ON n.oid = t.relnamespace
JOIN approved_schema AS scope ON scope.schema_name = n.nspname
CROSS JOIN LATERAL unnest(c.conkey) WITH ORDINALITY AS k(attnum, ordinality)
JOIN pg_catalog.pg_attribute AS a ON a.attrelid = t.oid AND a.attnum = k.attnum
WHERE c.contype IN ('p', 'u')
ORDER BY n.nspname, t.relname, c.conname, k.ordinality
LIMIT 1001;

-- 4. Declared relationships. BOTH endpoints must be in the approved scope.
-- Relationships to omitted schemas are excluded, not assumed absent.
WITH approved_schema AS (SELECT unnest(ARRAY[]::text[]) AS schema_name)
SELECT sn.nspname AS from_schema, st.relname AS from_object,
       c.conname AS constraint_name, k.ordinality AS pair_ordinal,
       sa.attname AS from_column, tn.nspname AS to_schema,
       tt.relname AS to_object, ta.attname AS to_column,
       c.confupdtype AS update_action_code, c.confdeltype AS delete_action_code,
       c.confmatchtype AS match_kind, c.convalidated AS is_validated,
       c.conenforced AS is_enforced, c.condeferrable AS is_deferrable
FROM pg_catalog.pg_constraint AS c
JOIN pg_catalog.pg_class AS st ON st.oid = c.conrelid
JOIN pg_catalog.pg_namespace AS sn ON sn.oid = st.relnamespace
JOIN approved_schema AS source_scope ON source_scope.schema_name = sn.nspname
JOIN pg_catalog.pg_class AS tt ON tt.oid = c.confrelid
JOIN pg_catalog.pg_namespace AS tn ON tn.oid = tt.relnamespace
JOIN approved_schema AS target_scope ON target_scope.schema_name = tn.nspname
CROSS JOIN LATERAL unnest(c.conkey, c.confkey) WITH ORDINALITY AS k(from_num, to_num, ordinality)
JOIN pg_catalog.pg_attribute AS sa ON sa.attrelid = st.oid AND sa.attnum = k.from_num
JOIN pg_catalog.pg_attribute AS ta ON ta.attrelid = tt.oid AND ta.attnum = k.to_num
WHERE c.contype = 'f'
ORDER BY sn.nspname, st.relname, c.conname, k.ordinality
LIMIT 1001;

-- 5. Check identities/state; expressions are OMITTED pending separate sanitized export approval.
WITH approved_schema AS (SELECT unnest(ARRAY[]::text[]) AS schema_name)
SELECT n.nspname AS schema_name, t.relname AS object_name, c.conname AS constraint_name,
       c.convalidated AS is_validated, c.conenforced AS is_enforced,
       false AS expression_included
FROM pg_catalog.pg_constraint AS c
JOIN pg_catalog.pg_class AS t ON t.oid = c.conrelid
JOIN pg_catalog.pg_namespace AS n ON n.oid = t.relnamespace
JOIN approved_schema AS scope ON scope.schema_name = n.nspname
WHERE c.contype = 'c'
ORDER BY n.nspname, t.relname, c.conname
LIMIT 1001;

-- 6. Index structure; no expression/predicate text or table statistics.
WITH approved_schema AS (SELECT unnest(ARRAY[]::text[]) AS schema_name)
SELECT n.nspname AS schema_name, t.relname AS object_name, ix.relname AS index_name,
       am.amname AS index_method, k.ordinality AS index_column_ordinal,
       a.attname AS column_name, k.attnum = 0 AS is_expression,
       k.ordinality <= i.indnkeyatts AS is_key_column,
       i.indisunique AS is_unique, i.indisprimary AS is_primary,
       i.indisvalid AS is_valid, i.indpred IS NOT NULL AS has_omitted_predicate
FROM pg_catalog.pg_index AS i
JOIN pg_catalog.pg_class AS t ON t.oid = i.indrelid
JOIN pg_catalog.pg_namespace AS n ON n.oid = t.relnamespace
JOIN approved_schema AS scope ON scope.schema_name = n.nspname
JOIN pg_catalog.pg_class AS ix ON ix.oid = i.indexrelid
JOIN pg_catalog.pg_am AS am ON am.oid = ix.relam
CROSS JOIN LATERAL unnest(i.indkey) WITH ORDINALITY AS k(attnum, ordinality)
LEFT JOIN pg_catalog.pg_attribute AS a ON a.attrelid = t.oid AND a.attnum = k.attnum
ORDER BY n.nspname, t.relname, ix.relname, k.ordinality
LIMIT 1001;

ROLLBACK;
