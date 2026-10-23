# Map the pipeline to the actual provider

The kit's `.github/workflows/` checks this kit and publishes its assets. Do not paste it into an application and call that application tested. Use the [pipeline stages](../../delivery/GIT-CI-AND-MAINTENANCE.md) to design the application's workflow.

| Decision | GitHub mapping | GitLab mapping | Evidence required |
| --- | --- | --- | --- |
| When checks start | PR/push/schedule/manual events | Pipeline sources and job rules | One permitted trigger and one excluded trigger |
| Target/data scope | Job environment and scoped secrets | Protected environment/variables and runner scope | Actual resolved target with no secret values |
| Required checks | Branch/ruleset required status checks | Merge checks and pipeline success policy | Failed required check prevents acceptance |
| Reports | Artifact upload and retention | Job artifacts and reports/expiry | Native artifact from the reviewed revision |
| Publication | Trusted release job with narrow token | Protected release job and scoped identity | Versioned artifact readback and checksum |
| External reporting | Reviewed integration step | Reviewed integration step | Exactly one delivery, duplicate/timeout behavior |

Start with static checks and local contract tests. Add an application smoke only after the owner supplies an approved target and test identity. Review import/setup effects before discovery. Record runner OS, installed versions, concurrency, timeout, cancellation, cache policy, and cleanup. An interrupted test run must not be reported as a pass.

Before release, test a failing assertion, denied environment, unavailable prerequisite, skipped test, and successful selected run. Confirm artifacts distinguish each. Provider-specific YAML needs its own live proof; this mapping is guidance.

Official references: [GitHub Actions](https://docs.github.com/en/actions), [GitLab CI/CD](https://docs.gitlab.com/ci/).
