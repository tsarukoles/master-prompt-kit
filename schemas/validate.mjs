import { readFileSync } from 'node:fs';
const verdictSchema = JSON.parse(readFileSync(new URL('./verdict.schema.json', import.meta.url), 'utf8'));
const resultSchema = JSON.parse(readFileSync(new URL('./run-result.schema.json', import.meta.url), 'utf8'));

/** Implements only the documented JSON Schema keywords used in these two files. */
export function validateShape(schema, value, at = '$') {
  const errors = [];
  const fail = text => errors.push(`${at}: ${text}`);
  if (Object.hasOwn(schema, 'const') && value !== schema.const) fail('constant mismatch');
  if (schema.enum && !schema.enum.includes(value)) fail('unknown value');
  const type = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (schema.type && !types.some(t => t === 'integer' ? Number.isInteger(value) : type === t)) { fail('incorrect type'); return errors; }
  if (type === 'object') {
    for (const key of schema.required ?? []) if (!Object.hasOwn(value, key)) fail(`missing ${key}`);
    for (const [key, item] of Object.entries(value)) {
      if (schema.properties?.[key]) errors.push(...validateShape(schema.properties[key], item, `${at}.${key}`));
      else if (schema.additionalProperties === false) fail(`unexpected ${key}`);
    }
  }
  if (type === 'array') {
    if (value.length < (schema.minItems ?? 0)) fail('too few items');
    if (schema.items) value.forEach((item, i) => errors.push(...validateShape(schema.items, item, `${at}[${i}]`)));
  }
  if (type === 'string' && value.trim().length < (schema.minLength ?? 0)) fail('empty or short text');
  if (type === 'number' && value < (schema.minimum ?? -Infinity)) fail('below minimum');
  return errors;
}

export function validateVerdict(report) {
  const errors = validateShape(verdictSchema, report);
  if (errors.length) return errors;
  for (const c of report.checks) if (['passed', 'failed'].includes(c.status) && !c.evidence.length) errors.push(`Check ${c.name} has no evidence.`);
  if (report.verdict === 'accept') {
    if (!report.checks.some(c => c.required)) errors.push('Accept requires at least one required check.');
    if (report.checks.some(c => c.required && c.status !== 'passed')) errors.push('Required checks are incomplete or failed.');
    if (report.findings.some(f => ['critical', 'high'].includes(f.severity))) errors.push('Accept cannot contain unresolved critical/high findings.');
  }
  if (['revise', 'block'].includes(report.verdict) && !report.findings.length) errors.push('Explain revise/block with a finding.');
  if (report.verdict === 'unable_to_verify' && !report.limitations.length) errors.push('Explain missing evidence.');
  return errors;
}

export function validateRunResult(report) {
  const errors = validateShape(resultSchema, report);
  if (errors.length) return errors;
  const ids = new Set();
  for (const t of report.tests) {
    if (ids.has(t.testId)) errors.push('Duplicate test ID.');
    ids.add(t.testId);
    if (['passed', 'failed'].includes(t.outcome) && (!t.attempts || !t.evidence.length)) errors.push('Executed outcome needs an attempt and evidence.');
    if (t.outcome === 'not_run' && t.attempts !== 0) errors.push('Not-run test cannot have attempts.');
  }
  const timestamp = x => typeof x === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(x) && !Number.isNaN(Date.parse(x));
  if (!timestamp(report.startedAt)) errors.push('Invalid start time; use ISO timestamp with timezone.');
  if (report.endedAt !== null && (!timestamp(report.endedAt) || Date.parse(report.endedAt) < Date.parse(report.startedAt))) errors.push('Invalid end time or end precedes start.');
  return errors;
}
