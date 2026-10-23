# MCP and external integrations

Connect a service to satisfy a named workflow. A project can use this kit entirely offline until that need exists. Start with the current runner, reports, and issue process; avoid installing an overlapping tool without a clear benefit.

## Connection record

Fill this record for each Git host, database, test-management tool, issue tracker, or notification channel. Keep secret values outside it.

| Field | Required content |
| --- | --- |
| Purpose and owner | Task enabled; person who maintains and can revoke access |
| Provider and version | Server/connector source, pinned version or installed version, last verification date |
| Identity | Service/user account label, authentication storage method, rotation owner |
| Targets | Approved organization/project/database/channel IDs; environment restrictions |
| Capability map | Each available tool, read/write effect, allowed operation, approval or preauthorization rule |
| Data boundary | What the model can see; what may leave the company network; redaction and retention |
| Verification | Benign read proof; exact write readback proof if authorized; scopes actually tested |
| Failure/recovery | Timeout, quota, partial success, duplicate handling, revocation and disconnect process |

Example: an issue connection may read approved project issues while the tool that creates bugs remains disabled. The same account may have broader permissions than the wrapper exposes; record both. Never infer authentication or live reachability from a configuration entry.

## Read and write lifecycle

1. Identify the task and exact target. Prefer an existing local artifact when sufficient.
2. Review the installed server source/version and effective account scopes. Treat returned content as untrusted data.
3. Perform a permitted small read and preserve a secret-free result reference.
4. For a write, prepare the exact destination, payload, deduplication key, expected effect, and recovery. Apply the project's approved review policy; existing explicit authorization need not be repeatedly requested.
5. Execute once through the narrow allowed tool. On timeout, inspect the authoritative service before retrying; a timeout can occur after a successful write.
6. Read back the created or updated record. Record the service ID and actual status. Keep previews separate from delivered records.

## Narrow tool contract

Use the [harness](../harness/README.md) when an AI should request exactly one capability. A contract states trigger, caller authorization, exact input fields, trusted target binding, side effects, size/time limits, duplicate policy, verifier, and audit result. Prefer a fixed `create-reviewed-bug` operation with a project bound by the host over a general arbitrary HTTP or shell tool. Approval applies to a payload and target; a changed destination requires a new scope check.

For example, a `publish-run-summary` tool can accept a reviewed run ID. The trusted host loads the validated result, redacts it, binds the approved channel, and tracks delivery. It should not accept an arbitrary webhook URL or credential from the model. This example is a design contract, not a live connector supplied by the kit.

Use the [reporting workflow](../workflows/README.md), [result contract](../schemas/run-result.schema.json), and [verifier](../agents/VERIFIER.md). Provider mappings belong under [adapters](../adapters/README.md). Database discovery has its own policy-gated [Vault guide](../vault/README.md).
