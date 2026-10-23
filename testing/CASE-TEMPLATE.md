# Test case template

```text
Case ID / version / status: draft | approved | retired
Requirement IDs and exact source references:
Title expressed as observable behavior:
Risk / priority / owner:
Preconditions, identity and permission level:
Allowed target and data ownership:
Inputs, including boundary values:
Steps:
Expected result after each meaningful action:
Forbidden side effects / unchanged state:
Layer and automation decision, with reason:
Setup and cleanup, including failure cleanup:
Test identifier / file, when implemented:
Review decision and date:
Known exclusions / unanswered questions:
```

## Filled example

These IDs and behaviors belong only to this illustration. Use the target project's original requirement IDs and acceptance criteria when adapting it.

**Case:** BOOK-02-C1 v1, draft. **Requirement:** BOOK-02, `requirements.md`, unauthorized cancellation paragraph. **Behavior:** User B cannot cancel User A's active booking. **Risk:** unauthorized data change, high. **Owner:** bookings team.

**Preconditions:** local synthetic repository with one booking owned by A; B has ordinary user permissions. **Action:** B requests cancellation of A's booking. **Expected:** response denies access with the approved code, and A's booking stays active. **Forbidden effect:** no cancellation notification or booking update. **Layer:** API integration for service authorization; domain-level fixture is an initial local demonstration only.

**Data:** namespace unique to run; fixture owns A, B, and booking. **Cleanup:** remove only owned records through approved cleanup. **Automation link:** assigned after review. **Review:** pending owner acceptance of denial code and notification behavior. **Exclusion:** delivery cannot be verified until an approved test notification sink exists.
