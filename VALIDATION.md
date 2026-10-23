# Validation status — 0.2.0

This release contains executable local references and documentation-reviewed provider guidance. It is an expanded pilot, not a universal framework installer or proof of a company's permissions.

## Executable scope

The supplied Node checks exercise fictional local behavior: target resolution and write denial, edit review signals, report/verdict consistency, narrow file output, worked QA examples, verifier challenge semantics, source/link validation, archive contents and deterministic packaging. They do not connect to an application, database, tracker, notification service, or assistant runtime. Run `npm run verify` to reproduce them.

On 2026-10-22, the local Windows/Node 24.11.0 run passed **32 tests, with zero failures and zero skips**. Source validation checked 134 files. The executable review found and corrected a focus-marker counting gap and a mismatch between reporting fields and the strict schema before release.

The kit's GitHub workflow checks Linux and Windows with Node 22. The local build host uses Node 24.11.0. Release workflow logs are the authority for whether those remote jobs actually passed on a tagged revision. Node 22+ is the supported baseline; other versions have not been established by this release.

## Independent review

Release preparation includes a separate reviewer of the executable controls and a blind review of the supplied QA challenges. The checks and exercises are limited examples, not a general accuracy claim about AI judgment. Reuse the challenge procedure when changing a verifier prompt, model, or tool permissions. A fresh adoption session must still inspect the real project's requirements and constraints.

A fresh reviewer inspected only the six case directories and the verifier contract, without the answer key or test harness. It identified all five designed problems and accepted the sound local control. Verdicts were `revise`, `revise`, `revise`, `block`, `revise`, `accept`; the skipped-test case's `revise` correctly identified the false pass claim while preserving that behavior remained unverified. This is a six-case demonstration, not a measured general accuracy rate.

## Adoption and package checks

Two additional fictional projects were inspected by a fresh adoption session using START-HERE, without the completed solutions. It produced scoped plans for a new local test suite and an existing runner whose exported assertion helpers were never invoked. Discovery stopped at the plan. After authorization of those local scopes, implementation added 27 passing capacity checks and three passing cancellation checks, with zero failures/skips. The existing service and runner were preserved; the negative control proved that the stronger existing assertion detects unauthorized state mutation. Native output, source hashes and unverified integration boundaries were retained for separate review. Feedback led to a smaller local-only reading route, an optional Vault layout, and clearer example-ID boundaries. These are small local adoption exercises; they do not establish real-company adoption or live service correctness.

The curated archive was extracted with the platform's ZIP utility; all 32 kit tests passed from the extracted folder, and repackaging produced the same ZIP hash. The manifest covers normalized UTF-8/LF payload bytes; the release checksum covers the exact ZIP bytes.

A separate verifier accepted both local adoption slices after inspecting the original requirements, assertions, complete native test selection/results, source hashes and preserved baselines. It confirmed the existing helpers were retained and the negative control failed for the intended unchanged-state assertion. It did not rerun the candidates or certify APIs, databases, notifications, CI, or other untested integrations.

## Provider and field limits

- PostgreSQL and SQL Server examples were compared with official catalog documentation and statically inspected. They have not been executed against a live database. Empty scopes and explicit owner permissions are required before adaptation.
- The Claude hook guide describes event mapping and a wrapper contract. No live hook installation or guarantee that every tool route is intercepted is claimed.
- The edit check intentionally cannot detect every semantic weakening; its tests show an equal-count weak assertion that needs independent review.
- The environment helper cannot guard an unrelated client that bypasses it. Real service permissions, setup/cleanup call sites, and redirect behavior need project-specific verification.
- The review-note harness still relies on a trusted host for authorization and filesystem isolation. Its local tests do not implement those host responsibilities.
- Application CI, live integrations, company data policy, and completed-reference-project field validation remain adoption/release-owner responsibilities.

See the [adapter status](adapters/README.md), [adoption checklist](checklists/ADOPTION.md), and [verifier contract](agents/VERIFIER.md). Preserve failures, skips, and unknowns in any copied evidence.
