# Adoption and release checks

## Before implementing in a target project

- [ ] Confirm project identity, owner, repository state, and applicable instructions.
- [ ] Record facts with file paths; ask only consequential unknowns.
- [ ] Separate new-project setup from existing automation comparison.
- [ ] Map targets, allowed data actions, credentials, and cleanup ownership.
- [ ] Inventory installed AI tools, MCP connections, permissions, and hooks.
- [ ] Produce a staged plan with exact effects, verifier, and recovery route.

## After the first change

- [ ] Give the original requirement, approved checks, actual diff and native results to the independent [verifier](../agents/VERIFIER.md).
- [ ] Confirm assertions detect the relevant wrong behavior; use a safe negative control when useful.
- [ ] Confirm hook claims match actual installed event evidence, and database metadata claims state scope and visibility.

- [ ] Verify the intended files and behavior at the actual revision and target.
- [ ] Report passes, failures, skips, blocked work, and checks not run separately.
- [ ] Check that no credential, private data, or raw report entered shared files.
- [ ] Keep existing working automation unless a reviewed improvement replaced it.
- [ ] Record remaining assumptions and who owns the next decision.

## Before releasing this kit to students

- [ ] Run the harness example checks.
- [ ] Trial the entry prompt on a fictional greenfield project and an existing automation project.
- [ ] Verify the assistant asks missing questions, cites evidence, and stops before changes.
- [ ] Search the entire release payload for organization names, private URLs, credentials, and personal data; review matches manually.
- [ ] Verify the ZIP's file list and hash against the tagged source.
- [ ] Put source and release links in the matching course lesson only after the artifact is accessible.
- [ ] Keep the kit's remaining reference-project field validation and any unverified provider adapter visible.
