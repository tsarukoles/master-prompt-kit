# Git, CI, review, and maintenance

Work from the team's existing branch and review conventions. Inspect the working tree before editing and preserve unrelated changes. Show the proposed diff and intended checks before a commit or publication. Do not turn an open pull request, pending CI check, or generated artifact into a claim of completion.

Separate deterministic checks from optional AI analysis. Type checks, lint, safety checks, and narrowly selected tests can gate a merge when they are stable and meaningful. An AI-generated failure explanation is a draft: it may help a reviewer, but it should not silently change code, post externally, or certify a failure. If a hosted model call has cost, define cadence, spending limit, and an off switch before scheduling it.

## Review path

1. Confirm repository, base, branch, and current revision.
2. Show affected files, data and service effects, plus the exact verification scope.
3. Run relevant checks and report actual outcomes, including skips and unavailable prerequisites.
4. Review the diff and secret scan results. A secret scan cannot prove all history is clean.
5. Publish through the team's required review and CI route. Recheck the reviewed revision before merging.
6. Record the final commit, report links, and any remaining limitations.

For ongoing maintenance, assign owners to target maps, credentials, test data, connector versions, hooks, and documentation. Revisit the adoption plan when the product or team changes. Remove stale rules and duplicate knowledge instead of appending contradictory instructions.
