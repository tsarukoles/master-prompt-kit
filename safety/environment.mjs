/** Fictional targets only. A trusted project owner must replace this map. No network I/O. */
const targets = Object.freeze({
  development: Object.freeze({ name: 'development', url: 'https://dev.example.invalid', actions: Object.freeze(['read', 'create', 'update', 'delete']) }),
  staging: Object.freeze({ name: 'staging', url: 'https://stage.example.invalid', actions: Object.freeze(['read', 'create', 'update', 'delete']) }),
  production: Object.freeze({ name: 'production', url: 'https://example.invalid', actions: Object.freeze(['read']) }),
});
const issued = new WeakSet();
export function resolveTarget(name, override) {
  if (typeof name !== 'string' || !Object.hasOwn(targets, name)) throw new Error('Choose an explicit known environment.');
  const spec = targets[name];
  if (override !== undefined && override !== spec.url) throw new Error('Target override does not match the selected environment.');
  const target = Object.freeze({ ...spec });
  issued.add(target);
  return target;
}
function checkTarget(target) {
  if (!target || !issued.has(target)) throw new Error('Use the canonical resolver output.');
}
export function runIfEnv(target, allowed) {
  checkTarget(target);
  if (!Array.isArray(allowed) || !allowed.length || allowed.some(x => !Object.hasOwn(targets, x))) throw new Error('Eligibility requires known environments.');
  return allowed.includes(target.name)
    ? { eligible: true, reason: 'Environment is eligible.' }
    : { eligible: false, reason: 'Skipped: environment is outside this test scope.' };
}
export function guardAction(target, action) {
  checkTarget(target);
  if (!['read', 'create', 'update', 'delete'].includes(action)) throw new Error('Unknown action.');
  if (!target.actions.includes(action)) throw new Error('Action is not allowed in the selected environment.');
}
/** Host binds the executor. The request cannot supply another URL or target. */
export function createGuardedRunner(target, execute) {
  checkTarget(target);
  if (typeof execute !== 'function') throw new TypeError('Host must supply an executor.');
  return async ({ action, payload, ...extra }) => {
    if (Object.keys(extra).length) throw new Error('Unexpected request field.');
    guardAction(target, action);
    return execute({ action, payload, target });
  };
}
