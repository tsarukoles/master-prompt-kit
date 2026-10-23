import assert from 'node:assert/strict';
import test from 'node:test';
import { validateVerdict, validateRunResult } from './validate.mjs';
const evidence = [{ path: 'native-report.json', locator: 'case-1' }];
const report = () => ({ schemaVersion: '1.0', reviewId: 'review-1', subject: { revision: 'fixture-revision', requirementIds: ['REQ-1'], changeRefs: ['test.mjs'] }, verdict: 'accept', findings: [], checks: [{ name: 'required behavior', required: true, status: 'passed', evidence }], limitations: ['Fictional example only.'], reviewedBy: 'independent-review', independence: { authoredChange: false, context: 'fresh' }, nextAction: 'Owner reviews evidence.' });
test('acceptance requires real evidence, independent review, and required checks', () => {
  assert.deepEqual(validateVerdict(report()), []);
  for (const status of ['skipped', 'not_run', 'blocked', 'failed']) {
    const r = report(); r.checks[0].status = status; assert.ok(validateVerdict(r).length);
  }
  const r = report(); r.checks[0].evidence = []; assert.ok(validateVerdict(r).length);
  r.checks[0].evidence = evidence; r.independence.authoredChange = true; assert.ok(validateVerdict(r).length);
});
test('an unsupported pass or duplicate test identity is rejected', () => {
  const r = { schemaVersion: '1.0', runId: 'run-1', revision: 'fixture', environment: 'local-fake', startedAt: '2026-10-22T12:00:00Z', endedAt: '2026-10-22T12:00:01Z', adapter: {name: 'fictional', version: '1'}, selection: 'case-1', tests: [{ testId: 'case-1', requirementIds: ['REQ-1'], caseIds: ['TC-1'], outcome: 'passed', attempts: 0, evidence: [] }], cleanup: 'not_required', nativeReport: 'local.json' };
  assert.ok(validateRunResult(r).length);
  r.tests[0].attempts = 1; r.tests[0].evidence = ['local.json:case-1']; assert.deepEqual(validateRunResult(r), []);
  r.endedAt = '2026-10-21T12:00:00Z'; assert.ok(validateRunResult(r).length);
  r.endedAt = null; assert.deepEqual(validateRunResult(r), []);
  r.tests.push({ ...r.tests[0] }); assert.ok(validateRunResult(r).length);
});
