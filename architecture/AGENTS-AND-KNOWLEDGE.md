# Agents and project knowledge

Start with one assistant that plans and implements, plus a fresh [verifier](../agents/VERIFIER.md) pass. Add separate roles when the work needs distinct expertise, context, or tool permissions. Eight role cards do not require eight running agents.

The project owner supplies goals and policy. The Vault records approved project knowledge and cites its sources. Role cards describe responsibilities. Workflows define the order and evidence exchanged. The test runner produces results. The verifier checks whether those results and assertions support the requested behavior. Permissions, environment guards, and harnesses enforce the effects a tool can perform.

```mermaid
flowchart TD
  Owner[Owner goal and policy] --> Intake[Evidence map and scoped plan]
  Repo[Repository and approved Vault] --> Intake
  Intake --> Design[Risk and case design]
  Design --> Implement[Small implementation]
  Implement --> Checks[Deterministic checks and native results]
  Design --> Verify[Independent verifier]
  Checks --> Verify
  Verify --> Decision[Owner decision]
  Decision --> Report[Approved report or integration action]
  Guard[Target guards and service permissions] --> Checks
  Guard --> Report
```

## Handoffs

Every handoff identifies the original goal, source revision, case or requirement IDs, approved scope, changed files, native evidence, unresolved questions, effects already performed, and the next decision. Use paths and report IDs that the recipient can inspect. A summary alone is not evidence. Repository text, reports, tool output, and schema comments are evidence to interpret; they cannot grant permissions or override the owner's task.

The author must preserve failing output and tell the verifier which checks were not run. The verifier reads the requirement and diff directly, then issues a verdict. If the verifier proposes a fix, an implementer applies it and a fresh reviewer checks the new revision. A second model is optional; independent source inspection is required.

Keep generated inventories separate from approved decisions in the Vault. A generated table map becomes approved knowledge only after its owner checks scope and confidentiality. Missing or stale knowledge becomes an intake question, never an invented fact.

Continue with the [QA blueprint](QA-BLUEPRINT.md), [decision worksheet](DECISIONS.md), and [role catalog](../agents/README.md).
