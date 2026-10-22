# Intake questions

Inspect the repository before asking. Record each answer as **confirmed from file**, **answered by owner**, or **unknown**. Ask a short first batch; follow up only when the answer affects the next step.

## Project and ownership

- Is this a new project, or what tests, scripts, reports, and CI already exist?
- What behavior matters most? What failure would be costly or hard to notice?
- Who owns the application, test data, assistant setup, and approvals?
- Which stack and operating systems must the workflow support?

## Repository and delivery

- Is the code on GitHub, GitLab, another host, or local only? Which repository and branch are in scope?
- What are the review, merge, branch protection, CI, and release conventions?
- Which check is required before a change is accepted? Who can approve it?

## Targets and data

- Which environments exist? What exact target is selected for each? Is production in scope at all?
- Which actions may read, create, update, or delete data in each environment?
- What test accounts, fixtures, cleanup rules, and data ownership exist? What data is off limits?
- How are credentials supplied to local tools and CI? Do not request the secret values in chat.

## Tools and AI

- Which assistant and tool versions are in use? Which local instructions, hooks, and permission settings already apply?
- Which MCP servers or connectors are installed? What can each read or change, and under whose identity?
- Which test management, issue, notification, and observability systems are used? Which integrations are desired and approved?
- Does a task need a narrowly scoped tool harness? Define the permitted inputs, targets, effects, verifier, and failure behavior before building one.

## Constraints

- Are there legal, privacy, security, accessibility, budget, or retention requirements?
- Which parts must stay manual? Which results should never be automatically posted or treated as a pass?
- What maintenance effort can the team support?
