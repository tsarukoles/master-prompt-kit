# Optional provider adapters

An adapter translates the neutral intake and plan into the tools actually installed in the student's project. Inspect local configuration and current vendor documentation before generating provider-specific files. No adapter is automatically enabled by this kit.

| If the project uses… | Inspect before adapting | Typical output |
| --- | --- | --- |
| GitHub or GitLab | Remote, branches, review rules, CI permissions | A project-specific branch and check plan |
| Playwright or another test runner | Version, config loading, reporters, fixtures, retries | A small test slice with honest results |
| Jira, another tracker, or test management | Project identifiers, field schema, account permissions, write approval | Read-only mapping, then an optional reviewed write flow |
| MCP tools | Server source, installed version, scopes, returned data | A connection inventory and least-privilege plan |
| A specific AI assistant | Instruction files, hook events, permission syntax | Tested project-specific configuration |

If a provider cannot implement a proposed hook or permission, state the gap. Do not imitate a control with prompt text and claim equivalent enforcement. Keep the core plan usable without any one provider.
