# Contributing

Each addition must solve a named QA workflow and state when to use it, inputs, exact outputs, side effects, checks, and limits. Prefer a worked fictional example to another abstract checklist. Keep neutral guidance independent of providers; record provider/version proof in adapters.

Before a change is released, run `npm run verify` and `npm run package`. Review the resulting manifest and content. An independent reviewer checks requirements, examples, misleading success claims, and company-data exposure. Database and assistant adapters need their own actual target/version trials before being labeled live-validated. Documentation review alone is not that trial.

Preserve stable links or leave a short forwarding page when reorganizing. Record behavior changes in CHANGELOG.md and update lessons outside this repository only after public artifacts are available. Bump the version for any changed student ZIP; do not replace a tagged release asset with different bytes under the same name.
