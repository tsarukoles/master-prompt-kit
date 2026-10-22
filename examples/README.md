# Fictional adoption examples

These examples illustrate the intake and plan. They are not claims about a live product.

## New project: Orchard Notes

A team has a new web app and an empty test repository. The assistant finds a package manifest and a CI skeleton, but no target map or test accounts. It asks for the development URL, allowed writes, account owner, and one high-risk user journey. The first plan adds a short repository guide, a resolver for one approved development target, and one read-only smoke test. It verifies configuration with an isolated test, lists discovered tests, then runs the single approved browser test. Issue tracking and MCP are deferred until needed.

## Existing project: Harbor Orders

A team already has API tests, a nightly CI run, and issue tracker integration. The assistant cites those files and keeps the working runner. It finds that notifications are sent directly after any failed retry and that the environment label is read independently by two scripts. It proposes a read-only inventory first, then a narrow improvement: one canonical target selection and a preview of notification payloads before any external post. The plan names affected files, current behavior, compatibility checks, and rollback. It does not migrate the entire suite or replace the tracker.

In both examples the assistant's first response is a plan, not an installation. The owner decides which step to execute.
