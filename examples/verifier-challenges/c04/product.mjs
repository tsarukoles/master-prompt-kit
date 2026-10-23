export function isEligible(target) { return target === 'staging'; }
export function cleanup(writer, runId, target = 'production') {
  return writer({ target, action: 'delete', runId });
}
