# QA workflows

Each workflow defines a trigger, inputs, sequence, output, and stopping conditions. Adapt names and tools to the adopting project. These are operating instructions; an assistant does not gain a new integration or permission by reading them.

| Work | Entry | Result |
| --- | --- | --- |
| Turn behavior into cases | [Test case generation](TEST-CASE-GENERATION.md) | Reviewed case intent and coverage gaps |
| Build one automation slice | [Implementation](IMPLEMENTATION.md) | Focused diff and native checks |
| Independently assess AI work | [Verification](VERIFY.md) | Cited accept/revise/block/unable verdict |
| Diagnose and repair failures | [Failure triage](FAILURE-TRIAGE.md) | Supported diagnosis and reviewed repair |
| Produce or post result summaries | [Reporting](REPORTING.md) | Honest report, optional confirmed external update |
| Run shared checks and decide release | [CI and release](CI-AND-RELEASE.md) | Required-check evidence and owner decision |

Default route: requirement → draft cases → review → implementation → native checks → independent verifier → owner decision → report. Failure goes to triage and then back through implementation and verification. Database discovery and tool onboarding follow their separate policy and connection contracts before these workflows may use them.
