# Assistant adapter adoption

Translate the kit's workflow into the assistant actually installed in the project. Do not install a configuration solely because a file in this kit names an event. Provider and version support must be checked locally.

| Concern | Inspect | Adoption evidence |
| --- | --- | --- |
| Instructions | Repository entry file discovery, precedence, scoped instructions | Fresh session locates the correct task/environment/Vault guidance |
| Roles | Separate context, allowed tools, delegation and return payload | Implementer and verifier receive original sources; verifier cannot mutate |
| Hooks | Event names, matchers, payload, exit/decision format, failure/timeout behavior | Actual allow/deny/malformed/timeout/bypass probes in a scratch project |
| Permissions | Filesystem, shell, MCP and network restrictions | Denied route stays denied through alternate supported tools |
| Data boundary | Model destination, retention and project confidentiality policy | Only approved evidence enters model context |

The [Claude example](CLAUDE-CODE-HOOKS.md) documents one pre-edit mapping. Other providers use this worksheet until their current official documentation and local behavior are verified. This directory does not assert compatible hook syntax for every assistant.

Before adapting the neutral checker, inspect [check-edit.mjs](../../safety/hooks/check-edit.mjs). It accepts full `{path, before, after}` strings and returns `{decision, reasons}`. Its CLI exits 0 for allow and 2 for review/malformed input. A provider wrapper must interpret its own event payload, reconstruct a safe full-file comparison, and translate that outcome into its provider's actual pre-action decision. Do not pipe arbitrary provider JSON directly into it.
