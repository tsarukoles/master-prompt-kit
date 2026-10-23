-- Documentation-reviewed SQL Server illustration. NOT LIVE-VALIDATED.
-- Owner-approved metadata-only identity/broker required. No connection/credential code.
-- Every approved_schema CTE is intentionally EMPTY. Use the SAME explicitly approved list in a local reviewed copy.
-- Client must set command timeout (example 3 seconds), overall output/time cap, and cancellation.
-- LOCK_TIMEOUT bounds waiting for locks only. Close the dedicated connection afterward.
-- 1001 records is a truncation sentinel for a 1000-record budget PER result set.
SET NOCOUNT ON;
SET LOCK_TIMEOUT 1000;

-- 1. Objects, no table contents or row counts.
;WITH approved_schema AS (SELECT CAST(NULL AS sysname) AS schema_name WHERE 1 = 0)
SELECT TOP (1001) s.name AS schema_name, o.name AS object_name, o.type_desc AS object_kind
FROM sys.objects AS o
JOIN sys.schemas AS s ON s.schema_id = o.schema_id
JOIN approved_schema AS scope ON scope.schema_name = s.name
WHERE o.type IN ('U', 'V') AND o.is_ms_shipped = 0
ORDER BY s.name, o.name;

-- 2. Columns/native type attributes. max_length is BYTES, not universally characters.
;WITH approved_schema AS (SELECT CAST(NULL AS sysname) AS schema_name WHERE 1 = 0)
SELECT TOP (1001) s.name AS schema_name, o.name AS object_name,
       c.column_id AS column_ordinal, c.name AS column_name,
       ts.name AS type_schema, t.name AS native_type,
       c.max_length AS max_length_bytes, c.precision AS numeric_precision,
       c.scale AS numeric_scale, c.is_nullable, c.is_identity, c.is_computed
FROM sys.objects AS o
JOIN sys.schemas AS s ON s.schema_id = o.schema_id
JOIN approved_schema AS scope ON scope.schema_name = s.name
JOIN sys.columns AS c ON c.object_id = o.object_id
JOIN sys.types AS t ON t.user_type_id = c.user_type_id
JOIN sys.schemas AS ts ON ts.schema_id = t.schema_id
WHERE o.type IN ('U', 'V') AND o.is_ms_shipped = 0
ORDER BY s.name, o.name, c.column_id;

-- 3. Primary/unique constraint key columns. Included index columns are excluded.
;WITH approved_schema AS (SELECT CAST(NULL AS sysname) AS schema_name WHERE 1 = 0)
SELECT TOP (1001) s.name AS schema_name, o.name AS object_name,
       k.name AS constraint_name, k.type AS constraint_kind,
       ic.key_ordinal, c.name AS column_name, i.is_disabled
FROM sys.key_constraints AS k
JOIN sys.objects AS o ON o.object_id = k.parent_object_id
JOIN sys.schemas AS s ON s.schema_id = o.schema_id
JOIN approved_schema AS scope ON scope.schema_name = s.name
JOIN sys.indexes AS i ON i.object_id = o.object_id AND i.index_id = k.unique_index_id
JOIN sys.index_columns AS ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
JOIN sys.columns AS c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE ic.key_ordinal > 0 AND ic.is_included_column = 0
ORDER BY s.name, o.name, k.name, ic.key_ordinal;

-- 4. Declared relationships. BOTH endpoints are scoped. No cross-database traversal.
;WITH approved_schema AS (SELECT CAST(NULL AS sysname) AS schema_name WHERE 1 = 0)
SELECT TOP (1001) ss.name AS from_schema, so.name AS from_object,
       fk.name AS constraint_name, fc.constraint_column_id AS pair_ordinal,
       sc.name AS from_column, ts.name AS to_schema, target_object.name AS to_object,
       tc.name AS to_column, fk.update_referential_action_desc AS update_rule,
       fk.delete_referential_action_desc AS delete_rule, fk.is_disabled, fk.is_not_trusted
FROM sys.foreign_keys AS fk
JOIN sys.foreign_key_columns AS fc ON fc.constraint_object_id = fk.object_id
JOIN sys.objects AS so ON so.object_id = fk.parent_object_id
JOIN sys.schemas AS ss ON ss.schema_id = so.schema_id
JOIN approved_schema AS source_scope ON source_scope.schema_name = ss.name
JOIN sys.objects AS target_object ON target_object.object_id = fk.referenced_object_id
JOIN sys.schemas AS ts ON ts.schema_id = target_object.schema_id
JOIN approved_schema AS target_scope ON target_scope.schema_name = ts.name
JOIN sys.columns AS sc ON sc.object_id = fc.parent_object_id AND sc.column_id = fc.parent_column_id
JOIN sys.columns AS tc ON tc.object_id = fc.referenced_object_id AND tc.column_id = fc.referenced_column_id
ORDER BY ss.name, so.name, fk.name, fc.constraint_column_id;

-- 5. Check identities/state. Definition text omitted pending separate sanitized-export approval.
;WITH approved_schema AS (SELECT CAST(NULL AS sysname) AS schema_name WHERE 1 = 0)
SELECT TOP (1001) s.name AS schema_name, o.name AS object_name,
       cc.name AS constraint_name, cc.parent_column_id,
       cc.is_disabled, cc.is_not_trusted, CAST(0 AS bit) AS expression_included
FROM sys.check_constraints AS cc
JOIN sys.objects AS o ON o.object_id = cc.parent_object_id
JOIN sys.schemas AS s ON s.schema_id = o.schema_id
JOIN approved_schema AS scope ON scope.schema_name = s.name
ORDER BY s.name, o.name, cc.name;

-- 6. Index key/include structure. No filter body, statistics, or business rows.
;WITH approved_schema AS (SELECT CAST(NULL AS sysname) AS schema_name WHERE 1 = 0)
SELECT TOP (1001) s.name AS schema_name, o.name AS object_name, i.name AS index_name,
       i.type_desc AS index_kind, ic.index_column_id, ic.key_ordinal,
       c.name AS column_name, ic.is_included_column, ic.is_descending_key,
       i.is_unique, i.is_primary_key, i.is_disabled, i.has_filter AS has_omitted_filter
FROM sys.indexes AS i
JOIN sys.objects AS o ON o.object_id = i.object_id
JOIN sys.schemas AS s ON s.schema_id = o.schema_id
JOIN approved_schema AS scope ON scope.schema_name = s.name
JOIN sys.index_columns AS ic ON ic.object_id = i.object_id AND ic.index_id = i.index_id
LEFT JOIN sys.columns AS c ON c.object_id = ic.object_id AND c.column_id = ic.column_id
WHERE i.index_id > 0 AND o.type IN ('U', 'V') AND o.is_ms_shipped = 0
ORDER BY s.name, o.name, i.name, ic.index_column_id;
