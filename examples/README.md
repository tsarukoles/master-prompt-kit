# Fictional adoption examples

These examples use local synthetic objects and Node built-ins. They require no account, database, browser, credentials, or network. Run commands from the kit root using its supported Node version.

- [New project](greenfield/README.md): design capacity cases, implement a small domain slice, check state and boundaries, and prepare a verifier packet.
- [Existing project](existing/README.md): retain an established service API, expose a weak authorization test, add a focused assertion, and prove it detects a seeded defect.
- [Verifier challenges](verifier-challenges/README.md): evaluate an independent review against intentionally flawed candidates and a sound control.

Run both worked example suites:

```text
node --test examples/greenfield/booking.test.mjs examples/existing/cancellation.test.mjs
```

Native output reports what actually executed. The prose journeys demonstrate decisions and handoffs; they do not claim a live API, browser, database, external reporter, or hosted CI was tested. Node's [test runner](https://nodejs.org/api/test.html) and [strict assertions](https://nodejs.org/api/assert.html) provide the local execution primitives.
