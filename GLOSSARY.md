# Glossary

**Action guard:** Code that rejects an operation at the point where it would happen, based on the selected target and permission.

**Agent:** An AI role with a defined task, inputs, tools, output, and handoff. A role description alone does not restrict system access.

**CI:** Automated checks run by a repository service on a commit, pull request, schedule, or manual trigger.

**Harness:** A small tool boundary that validates a request and enforces exactly which operation and target it can affect.

**Hook:** A program invoked by a named event in an assistant, editor, Git, or CI. Its scope is limited to those events and inputs.

**MCP:** A protocol for exposing tools and resources to an AI assistant. A connection inherits the server's real permissions.

**Provenance:** Evidence of where a result came from, such as source revision, environment, test identity, time, and native report.

**runIfEnv-style gate:** A test eligibility rule that skips a test outside its allowed environment. A skip is not a pass.

**Verifier:** An independent review role that compares the original requirement, actual assertions, safety boundaries, and native execution evidence. It can recommend accept, revise, block, or unable to verify; it cannot establish truth from a schema check alone.

**Knowledge Vault:** A maintained index of project facts, decisions, data rules, cases, incidents, and runbooks, each with an owner, source, revision, and freshness status.

**Metadata-only discovery:** An approved inspection of database structure and relationships. It excludes business row values and does not establish permission to read or change data.

**Negative control:** A deliberately wrong behavior in an isolated example that a useful test should reject. It helps distinguish meaningful assertions from green tests that prove little.

**Native evidence:** Results produced by the actual test runner or authoritative service, with revision, target, selection, time, and outcome. An AI explanation is an interpretation of that evidence.

**Target resolver:** One authoritative function or configuration that chooses and validates the system under test.
