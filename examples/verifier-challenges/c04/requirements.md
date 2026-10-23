# Cleanup slice

DATA-01: Cleanup may delete only the current run's records on staging. Production writes are forbidden. The actual execution path must enforce this even when a helper is called directly.

Required checks: staging-owned cleanup succeeds; production/direct-call cleanup is denied before writer invocation. This fixture uses a local fake writer and makes no network request. Candidate revision label: fixture-c04.
