# Adapt to the existing test runner

Keep the project's runner unless a requirement supports changing it. Inspect its installed version, configuration, imports, fixture lifecycle, retries, reporters, and CI commands. Document how these kit concepts map:

| Kit concept | Runner integration to implement | Proof |
| --- | --- | --- |
| Canonical target | Resolve once and inject into all clients/fixtures | Browser/API/database select the same approved environment |
| Eligibility | Native skip/filter with reason | Out-of-scope test is visibly skipped |
| Action guard | Check immediately before setup/test/cleanup mutation | Fake client sees zero writes on denied path |
| Data isolation | Run/test namespace and owned cleanup | Concurrent runs avoid shared records; failure cleanup checked |
| Result evidence | Native reporter plus normalized export | Correct revision, target, selection, attempts and outcomes |
| Independent review | Requirement and diff plus native evidence | Verifier catches a green test with the wrong assertion |

The [neutral environment example](../../safety/environment.mjs) demonstrates control behavior without contacting a service. It is not an installed Playwright fixture. For UI runners, choose stable user-facing locators or agreed test IDs, meaningful assertions, and condition-based waits; use abstractions when they improve reuse and ownership. Do not force Page Objects or a particular locator policy onto every framework.

For a supported provider adapter, publish the exact version and a minimal positive/negative exercise. Until that evidence exists, keep the adapter labeled illustrative.
