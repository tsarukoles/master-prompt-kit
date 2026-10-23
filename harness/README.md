# Narrow tool harness

An AI may decide to request an action. A harness must enforce which action is possible. Define one contract per capability: trigger, authorization, exact input shape, allowed target, side effects, verifier, audit result, and failure behavior. Give the tool's service identity only the required permission. A prompt saying “do nothing else” is guidance, not enforcement.

## Fictional example: write one review note

The included [example tool](example.mjs) accepts exactly `{ action, taskId, decision, summary }`. `action` must be `write-review-note`; `decision` is `approved`, `changes-requested`, or `deferred`. A trusted host supplies an existing output root when it registers the tool. The model cannot choose a path, command, URL, or credential. A valid call creates **one** new JSON file under `review-notes/` and reads it back. A duplicate or extra field is rejected. No shell, network, test runner, or service call occurs.

The host must authenticate the caller, decide whether human approval is required, and configure an isolated output root that the model cannot change. This example does not implement those host responsibilities. It also does not protect against a hostile local user concurrently replacing directories; deploy with appropriate filesystem ownership and isolation.

The host must also bind allowed task IDs and decisions to the current authorized task. The example validates the task ID's syntax; it cannot determine which business task the caller owns. Do not expose the function as a general service without that authorization check.

Run the local contract checks with Node 24 or another compatible modern Node version:

```text
node --test harness/example.test.mjs
```

## Adaptation checklist

1. Describe the task in one sentence. List every intended read and write.
2. Choose a typed input schema with no extra fields. Use IDs and allowlisted operations, not free-form paths or shell strings.
3. Bind target, credentials, and permissions in the trusted host, outside model arguments.
4. Validate authorization and environment at execution time. A preview of a write is not the write.
5. Bound time, size, retries, and duplicate effects. Stop on ambiguous targets or partial failure.
6. Verify the effect by reading the authoritative result. Return a structured success or failure and a secret-free audit identifier.
7. Test allowed, denied, malformed, duplicate, wrong-environment, and interrupted paths. Recheck after integrating with an MCP server or assistant hook.

MCP may expose the tool; a hook may inspect attempted calls; an environment guard may reject a wrong target; human review may authorize a consequential call. Each has a distinct scope. The harness and its actual service permissions define the enforceable action boundary.
