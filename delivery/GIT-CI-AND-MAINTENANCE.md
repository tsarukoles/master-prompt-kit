# Git, CI, review, and maintenance

Start from the team's branch and review conventions. Inspect the working tree and preserve unrelated changes. Record the source revision used by each run; a successful run of an older revision does not prove a new diff.

## A practical pipeline

| Stage | Trigger / scope | Output | Gate or information |
| --- | --- | --- | --- |
| Static checks | Pull request; relevant code and config | Type/lint/schema results, secret-scan findings | Gate when deterministic and stable |
| Local behavior checks | Pull request; pure helpers/contracts | Native results including denied safety paths | Gate |
| Test discovery and target checks | After reviewing import effects | Selected test list, environment eligibility inventory | Gate on configuration errors; listing is not a pass |
| API/integration tests | Approved target, identity, isolated data | Assertions, request evidence with redaction, cleanup | Gate only with reliable dependencies |
| UI smoke | Approved browser/target/data matrix | Native traces/reports for critical user journeys | Gate for agreed journeys; report blocked prerequisites |
| Wider suites | Schedule or release branch, within budget | Regression, accessibility, performance or resilience results as relevant | Team decides thresholds and ownership |
| AI failure analysis / verifier | After native evidence exists | Cited findings, uncertainty, proposed next action | Advisory semantic review; cannot silently change code |
| Publication | Trusted workflow after authorized review | Versioned artifacts and delivery readback | Explicit release policy |

Keep a small required set for pull requests. Put slow or expensive checks on an appropriate cadence with an owner. Record retry attempts; a failure followed by a pass is evidence of instability, not an erased failure. Quarantine needs a reason, owner, expiry, and visible skipped coverage.

## Before enabling a pipeline

Resolve the environment and data contract. A CI process may inherit a different target or account than a local run. Use least-privilege credentials per environment. Separate untrusted pull-request execution from privileged publishing and secrets. Treat report artifacts and AI-produced text as untrusted inputs. Avoid shell construction from branch titles, issue text, or report content.

For GitHub, scope `GITHUB_TOKEN` permissions per job and pin reviewed actions. For GitLab, inspect runner isolation, protected variables/environments, and merge-request trust before adapting. The kit includes a functioning **kit validation/release pipeline**, not an application-specific GitHub/GitLab pipeline. The [CI adapter guide](../adapters/ci/README.md) shows how to map the stages to your framework.

## Report and release flow

Preserve native reports, revision, selection, target label, run time, retries, and cleanup. Redact before sharing. Keep public summaries separate from restricted traces and account state. Set an artifact retention period and owner. Publish a reviewed summary through the [integration contract](../integrations/README.md); a dry-run payload is not a delivered notification.

Before merging or releasing, review the latest diff and relevant checks, obtain the required verifier/human decision, then confirm the actual released revision. If a consequential change happens after review, re-evaluate affected checks. A pending check, draft PR, or generated ZIP is not proof of publication.

## Maintenance record

| Item | Owner records | Revisit when |
| --- | --- | --- |
| Targets and credentials | Exact scope, rotation, revocation | Environments/accounts change |
| Tests and fixtures | Risk covered, flake owner, cleanup | Product behavior or data lifecycle changes |
| Agents/hooks/adapters | Installed version, proofs, limits | Assistant/tool upgrades |
| Vault and reports | Source revision, freshness, retention | Code/schema changes or stale evidence |
| Cost and runtime | Budget, cadence, off switch | Slow runs, quota errors, spend increase |

Remove obsolete rules and reconcile contradictory instructions. Upgrade the kit selectively; preserve project decisions in the adoption record.

References: [GitHub token permissions](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token), [GitHub secure workflow use](https://docs.github.com/en/actions/reference/security/secure-use), [GitLab CI/CD documentation](https://docs.gitlab.com/ci/). Verify provider details against the version and account actually used.
