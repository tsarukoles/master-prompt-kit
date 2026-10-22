# Environment selection and action guards

Define the allowed destinations in one canonical resolver. A missing setting may choose a safe development target **only if the project owner approves that default**. Reject empty, misspelled, or unexpected values. If a URL override is permitted, require an exact match to the selected target; avoid echoing an untrusted value into an error. Keep one target per test process so a late environment change cannot split the browser, API client, and guard decisions.

Use two distinct controls when tests can modify data:

- **Eligibility:** a `runIfEnv`-style test gate marks where a test is allowed to run. A skip is visible and is not a pass.
- **Action guard:** check immediately before each data-changing UI, API, database, or service action. Throw if the selected target or permission is not allowed.

Both controls depend on calls in the actual execution path. They cannot stop arbitrary shell commands, a separate client, a hard-coded URL, or code that omits them. Service-side roles and least-privilege credentials provide another boundary. Review imports and setup functions before test discovery: some frameworks load code for disabled profiles while listing tests.

## Project-specific contract to write

| Environment | Canonical target | Read actions | Write actions | Credentials | Cleanup owner |
| --- | --- | --- | --- | --- | --- |
| Example development | Owner supplied | Owner approved | Explicit list | Secret store | Named owner |
| Example production | Owner supplied | Explicit list | Normally none | Separate role | Named owner |

Do not copy the sample rows into code as real settings. Decide what counts as a write: account creation, form submission, issue updates, notifications, and CI dispatch can all have effects outside the test runner. Record the exact target, action, data owner, and expected cleanup in a run plan.

## Verification

Use isolated checks with fake actions to prove invalid targets are rejected, the protected target blocks writes, and approved calls proceed. Then review real call sites for missing guards. A unit check of the helper alone is not evidence that every test uses it.
