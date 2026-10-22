# Master Prompt Kit

A portable starting point for an AI-assisted test and project workflow. Copy this folder beside a new or existing repository, open the repository in your assistant, and give it [START-HERE.md](START-HERE.md). The assistant should inspect first, ask for missing decisions, and return a reviewable plan before changing the project.

**Pilot release 0.1.0.** This kit is based on a completed course design and reference implementation available in October 2026. The first cohort's six-week repository has not reached its final checkpoint, so that later audit remains open. No example here claims a live connection, universal support, or a guarantee from prompt text.

## Choose your path

1. Read [START-HERE.md](START-HERE.md) and paste its prompt into an AI assistant with access to your project. Keep this kit outside the project's automated load path until you decide what to adopt.
2. The assistant inspects non-secret files and returns an evidence map. It asks the [intake questions](intake/QUESTIONS.md) it cannot answer from the repository.
3. Review the [plan format](intake/PLAN-FORMAT.md). Choose one small first step. The assistant may implement only the scope you approve in your project conversation.
4. Use [the adoption checklist](checklists/ADOPTION.md) to verify the outcome and record unsupported or deferred items.

For a **new repository**, begin with repository instructions, target rules, a single small test flow, and a repeatable local check. For an **existing repository**, inventory current automation and integrations, compare them to these patterns, and propose incremental changes. Preserve functioning conventions unless evidence supports a change.

## Map

| Need | Module |
| --- | --- |
| Discover context and make a plan | [Intake](intake/QUESTIONS.md), [plan format](intake/PLAN-FORMAT.md) |
| Organize assistant instructions and knowledge | [Agent architecture](architecture/AGENTS-AND-KNOWLEDGE.md) |
| Select targets and control side effects | [Environments](safety/ENVIRONMENTS.md), [permissions and hooks](safety/PERMISSIONS-AND-HOOKS.md) |
| Give an AI a narrowly scoped tool | [Harness](harness/README.md) |
| Connect MCP and other services | [Tools and integrations](tooling/MCP-AND-INTEGRATIONS.md) |
| Design useful tests and evidence | [Test strategy](testing/TEST-STRATEGY.md) |
| Review, CI, and maintain the setup | [Delivery](delivery/GIT-CI-AND-MAINTENANCE.md) |
| Adapt to a provider or domain | [Adapters](adapters/README.md), [sectors](sectors/README.md) |
| Compare the two adoption paths | [Fictional examples](examples/README.md) |

The modules are guidance, not files to copy blindly into a product repo. Read the module that applies, then generate project-specific code and instructions from the inspected facts. [Glossary](GLOSSARY.md) explains the terms.

## Boundaries

- No credentials, customer data, private URLs, or personal reports are included.
- The harness example is local and uses a fictional review-note task. It does not connect to a service. Run `node --test harness/example.test.mjs` to check its contract.
- Hooks and assistant permission files differ between products and versions. Verify their actual event names, payloads, exit behavior, and scope against the installed tool before enabling them.
- A test skip, a discovered test, a generated report, and a passing run are different outcomes. Keep their evidence separate.

## Release and maintenance

The source repository is the editable version. A tagged ZIP with a checksum is the stable student download. Keep one authoritative copy of each instruction; update links and examples together. Record which assistant, framework, operating system, and project type were used for each adoption trial. Recheck provider adapters when their tools change.

License: [MIT](LICENSE).

