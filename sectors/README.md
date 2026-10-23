# Domain questions

Use these prompts only if the project's domain makes them relevant. They are discovery aids, not compliance advice.

| Domain | Questions to add |
| --- | --- |
| Commerce and payments | Are transactions simulated? Who owns test cards and order cleanup? Are refunds or inventory changes allowed? |
| Health or personal data | Can tests use synthetic records? Which data must never enter prompts, logs, or reports? Who approves retention? |
| Finance | Which actions move value or alter records? What separate approvals, audit trails, and sandbox accounts exist? |
| Internal tools | Which employee roles and permissions must be tested? Can notifications or bulk actions affect real coworkers? |
| Public APIs | What rate limits, quotas, version contracts, and tenant boundaries apply? |

Confirm the applicable policy with the project owner. Keep examples fictional and use the smallest data privileges available.

## Turn a domain risk into a QA decision

| Fictional risk | Useful test/design choice | Boundary to record |
| --- | --- | --- |
| A checkout retry creates two orders | Contract/API check of a stable idempotency key and unchanged stock after a duplicate request | Sandbox payment provider, synthetic order, owned cleanup; no real charge |
| A support role can read another tenant's record | Negative authorization case plus an assertion that no record changed | Synthetic tenants; approved roles; no real customer data in traces |
| A personal record appears in an AI summary | Redaction/retention contract and fake-sensitive fixture tests | Company-approved model destination; verifier examines exact payload |
| A public API quota is exhausted by retries | Bounded retry/backoff and cancellation tests using a fake transport | Limit runtime, concurrency, and external calls; no uncontrolled load |
| A bulk internal notification reaches real staff | Preview/deduplication workflow and test destination bound by host | No arbitrary channel argument; reviewed delivery and authoritative readback |

These are QA design examples. The owner supplies applicable legal/security requirements. Prefer local negative controls and sandbox accounts before any permitted live exercise. Add domain-specific cases to the same case catalog and verifier workflow instead of creating a separate untraceable suite.
