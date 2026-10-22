# Agent instructions and project knowledge

## Design

Keep a short repository entry file that says: project purpose, commands that are safe to run, target rules, where detailed guidance lives, and how to report evidence. Put topic details in small files loaded only for relevant tasks. This reduces stale duplicate instructions and makes review easier.

An agent role should define its task, inputs, allowed tools, output, and handoff point. Separate a planner or reviewer from an executor when the work has consequential side effects. A named role in a prompt is a workflow convention; it does not itself restrict tool permissions.

## Knowledge base

Create a map with links to architecture, test data, common failures, decisions, and ownership. Keep generated inventories distinguishable from human decisions. Put the source, revision, and date on evidence that may become stale. Do not copy reports, credentials, or customer data into an always-loaded instruction file.

## Review loop

1. Inspect the relevant source and current result.
2. State a hypothesis and the smallest proposed change.
3. Check that the change preserves intended assertions and guards.
4. Run only the relevant verification and report the actual outcome.
5. Update the handoff or decision record if the behavior changed.

For a failed test, preserve the failure until the cause is understood. Do not make a test pass by removing an assertion, adding an unexplained skip, or changing the target. A reviewer should distinguish an application defect, test defect, environment problem, and missing prerequisite.

## What to verify

- The assistant can locate the right topic guidance from the entry file.
- Instructions agree with the current scripts and installed tool behavior.
- Every role names its allowed side effects and a stopping condition.
- A fresh session can identify the latest meaningful checkpoint without reading private material.
