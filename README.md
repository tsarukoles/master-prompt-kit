# Master Prompt Kit

A reusable QA architecture and AI workflow library for a new or existing project. Start with an evidence-based analysis, select a useful improvement, implement that scope, and ask an independent verifier to check the result.

**Version 0.2.0 — expanded pilot.** The kit now includes role cards, worked workflows, Vault templates, database discovery guides, hook recommendations, and runnable local examples. See [VALIDATION.md](VALIDATION.md) for exactly what was checked. Database queries, assistant hooks, and CI examples still need validation in the adopting company's tools and permitted environments. Final field validation against the completed reference project remains open.

## Start in five steps

1. Download the curated ZIP and checksum from this repository's **v0.2.0 release**. Verify its SHA-256 before extracting. Keep the kit in a separate reference folder.
2. Open the target project in your coding assistant. Give it access to this kit folder or attach the files named in [START-HERE.md](START-HERE.md).
3. Paste the complete discovery prompt from START-HERE and describe your goal. The first response inspects non-secret files, asks unanswered questions, and proposes a plan. It does not install or run the project.
4. Choose a specific plan step. The assistant adapts the relevant templates to your actual repository, permissions, and tools. Use the [adoption checklist](checklists/ADOPTION.md).
5. Give the original requirement, diff, and actual evidence to the [verifier](agents/VERIFIER.md), ideally in a separate context. Review its findings before accepting the change.

## What this gives you

| Need | Read or use | Concrete output |
| --- | --- | --- |
| Understand an existing project or begin a new one | [Intake](intake/QUESTIONS.md), [plan](intake/PLAN-FORMAT.md) | Evidence map, unanswered decisions, staged adoption plan |
| Choose test layers and framework boundaries | [Architecture](architecture/AGENTS-AND-KNOWLEDGE.md), [test strategy](testing/TEST-STRATEGY.md) | A risk-based design that preserves working conventions |
| Assign AI responsibilities | [Roles](agents/README.md), [verifier](agents/VERIFIER.md) | Task, inputs, permitted tools, output, limits, and handoff |
| Generate cases, implement, review, and report | [Workflows](workflows/README.md) | Repeatable steps with named artifacts and decision points |
| Maintain project knowledge | [Vault](vault/README.md) | Linked templates, ownership, source revision, freshness, and database maps |
| Decide which automatic checks help | [Hook catalog](safety/HOOK-CATALOG.md) | Event, purpose, recommended use, failure behavior, and evidence |
| Control environments and data effects | [Environment guide](safety/ENVIRONMENTS.md) | Resolver, eligibility, action guard, fake-client tests |
| Connect tools and report results | [Integrations](integrations/README.md), [CI and delivery](delivery/GIT-CI-AND-MAINTENANCE.md) | Connection contract, reviewed writes, repeatable checks |
| Enforce one narrow AI tool action | [Harness](harness/README.md) | Local example that creates one review note and verifies it |
| Practice before touching a real system | [Examples](examples/README.md) | New/existing project journeys and verifier challenges |

## Choose only what the project needs

For a new repository, begin with a short project guide, one target contract, a small test slice, and evidence. For existing automation, preserve useful runners, tests, integrations, and review conventions. A missing kit pattern is not automatically a defect. The kit's `starter/` files are templates, not instructions automatically loaded by your assistant. The adoption plan says which files belong in the target project.

For a small local-only project, use START-HERE with the intake files, then [test strategy](testing/TEST-STRATEGY.md), [case template](testing/CASE-TEMPLATE.md), and [verifier](agents/VERIFIER.md). Record scope, requirements, owner, and evidence in one QA note. Briefly mark external systems and unused modules as deferred; open their guides when the project needs them. A full Vault or multiple running agents is optional.

The [adapter status](adapters/README.md) distinguishes local-tested examples from documentation-reviewed guides. Do not infer that a live connection works because a configuration file exists. The [domain guide](sectors/README.md) adds questions for relevant business risks.

## Local example checks

Node.js 22 or later is required for the supplied examples. There are no runtime dependencies or credentials. From this kit folder:

```text
npm run verify
npm run package
```

The checks exercise local fictional code and validate documentation. They do not run your application's tests or scan a database. Packaging writes a reproducible ZIP, per-file manifest, and SHA-256 checksum under `dist/`.

## Maintenance

Keep one authoritative kit version. Record that version and selected modules in the target project's adoption note. When updating, review the [changelog](CHANGELOG.md) and compatibility notes; merge selected changes without overwriting project-specific decisions. Raw reports, credentials, account state, and company schema snapshots do not belong in this public repository.

License: [MIT](LICENSE). Contributions follow [CONTRIBUTING.md](CONTRIBUTING.md).
