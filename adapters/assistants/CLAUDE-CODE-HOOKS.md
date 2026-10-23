# Claude Code pre-edit mapping example

Status: documentation-reviewed illustration on 2026-10-22. No Claude installation or real hook event was exercised for this adapter. Installation is a project adoption task; this file is not an enabled configuration.

The current [official hooks reference](https://code.claude.com/docs/en/hooks) documents `PreToolUse` for pre-call checks, `Edit|Write` matching those tool names, and command-hook JSON input. A deny decision uses `hookSpecificOutput.permissionDecision`; `PostToolUse` observes an already completed call. Check the installed version's failure/timeout behavior as well as its normal decision path.

## Illustrative settings fragment

This fragment assumes a project-owned wrapper exists at an absolute path supplied during adoption. Merge the relevant entry into the existing project settings only after validating current configuration and ownership. Preserve existing hooks.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node /ABSOLUTE/REVIEWED/PATH/qa-pre-edit-wrapper.mjs",
            "timeout": 5,
            "onFailure": "block"
          }
        ]
      }
    ]
  }
}
```

The placeholder command is deliberately not runnable. Adapt quoting to the actual operating system and hook shell. Confirm the installed provider supports every field, including `onFailure`, before using it. Keep the same deny behavior for missing script, crash, timeout, or invalid JSON in an observed probe.

## Wrapper contract to implement and test

1. Parse bounded JSON input and require the expected `PreToolUse` event, supported tool name, and explicit `tool_input.file_path` within the approved project root. Canonicalize the path; reject traversal, symlink escape, and protected policy/config paths as defined by the project. Do not log the raw tool input.
2. For `Write`, obtain the prior file from the approved workspace, treating a genuinely new file as empty. Treat `tool_input.content` as the proposed full content.
3. For `Edit`, load the actual prior file. Apply the exact documented old/new replacement semantics, including occurrence and replacement settings. If the adapter cannot reproduce them unambiguously, deny for review. Never treat a replacement fragment as an entire file.
4. Pass the full normalized `{path, before, after}` and project `protectedPaths` into `assessEdit` from [the neutral checker](../../safety/hooks/check-edit.mjs). Preserve the original content hash to detect stale comparison; if a race cannot be closed, record that limitation and rely on the post-edit/CI review too.
5. If it returns `review`, exit successfully with the following supported deny structure. Supply a short sanitized reason. For `allow`, return no overriding permission decision so the normal permission flow remains in control.

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "QA review required: focused test introduced."
  }
}
```

6. Malformed/unsupported input also denies with a clear reason. Never auto-edit or execute the proposed code from the wrapper. Test the actual host response to wrapper failure; successful return with malformed output is not an enforcement strategy.

## Required local validation

Record installed Claude version, OS, shell, settings location, and native event logs using synthetic content. Probe a permitted edit, new `.only`, introduced `.skip`, assertion/guard removal, malformed input, protected path, repeated replacement, multi-match ambiguity, symlink/outside-root path, missing wrapper, and timeout. Confirm denied edits did not occur. Then make an edit through shell/manual editor to document the known bypass and verify the required CI/reviewer route still catches relevant issues.

This matcher does not cover arbitrary shell commands, other edit tools, MCP tools, or every delegated path. Add supported routes only after inspecting their payloads and testing their behavior. Semantic questions such as “does this assertion prove the right behavior?” remain the independent verifier's responsibility.
