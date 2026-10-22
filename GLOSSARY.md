# Glossary

**Action guard:** Code that rejects an operation at the point where it would happen, based on the selected target and permission.

**Agent:** An AI role with a defined task, inputs, tools, output, and handoff. A role description alone does not restrict system access.

**CI:** Automated checks run by a repository service on a commit, pull request, schedule, or manual trigger.

**Harness:** A small tool boundary that validates a request and enforces exactly which operation and target it can affect.

**Hook:** A program invoked by a named event in an assistant, editor, Git, or CI. Its scope is limited to those events and inputs.

**MCP:** A protocol for exposing tools and resources to an AI assistant. A connection inherits the server's real permissions.

**Provenance:** Evidence of where a result came from, such as source revision, environment, test identity, time, and native report.

**runIfEnv-style gate:** A test eligibility rule that skips a test outside its allowed environment. A skip is not a pass.

**Target resolver:** One authoritative function or configuration that chooses and validates the system under test.
