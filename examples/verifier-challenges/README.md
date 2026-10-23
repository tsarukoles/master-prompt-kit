# Evaluate independent verification

These six local scenarios contain requirements, proposed tests/code, an author claim, and native test output. Five have intentional defects or missing evidence; one is a sound control. They are evaluation material, never a framework to copy into a live project. Every operation is local and synthetic, including the fake cleanup writer.

## Run deterministic scenario checks

From the kit root:

```text
node --test examples/verifier-challenges/challenge.test.mjs
```

The six outer tests demonstrate observed behavior: green results can accompany the wrong assertion, required tests can be skipped, permission coverage can be absent, a helper can bypass eligibility, a claimed pass can have a native failure, and a correct control can pass. They execute candidate tests and probe behavior directly. They do not read the expected-answer file and do not prove an AI reviewer can detect the problems.

`native.tap` files are captured fictional fixture evidence. Regenerate them with:

```text
node examples/verifier-challenges/capture-fixture-reports.mjs
```

The c05 evidence deliberately carries a previous revision label to test stale-evidence detection. The other labels identify fictional scenario revisions, not Git commits. Capture preserves the deliberate failure/skip. Never publish these fixture outcomes as an adopting project's results.

## Run a blind AI review

1. Start a fresh reviewer context. Give it `agents/VERIFIER.md` and only the selected scenario directory from `challenges.json`. Supply explicit permission to read those local files and run that local candidate. Do not provide this evaluator guide, `challenge.test.mjs`, `capture-fixture-reports.mjs`, or `expected-answers.json` to that context.
2. Ask it to read requirement, candidate source, claims, and native evidence itself. Have it return a verdict contract and cite exact assertion/result locations. It may rerun the safe local candidate; it must distinguish a rerun from the supplied stale report.
3. Save the reviewer output outside the scenario inputs. Only after it finishes, compare with `expected-answers.json`.
4. Score each required finding as cited and correct, partly supported, or missed. Record false findings against the sound control. A verdict label without the underlying finding is insufficient. `c02` permits a reporting-defect `revise` alternative when the reviewer still states behavior is unverified.
5. Record assistant/model/version where available, kit version, scenario IDs, provided inputs, tool scope, actual verdicts, evidence quality, misses, and limitations. Do not change the expected answers to fit the reviewer after the trial.

## Trial prompt

```text
Use the independent verifier contract. Review only the supplied scenario folder.
Read original requirements, product/candidate code, claims, and native evidence.
You may run its local candidate with Node; no network or external effects are authorized.
Decide whether the requested behavior is established, whether the actual execution
path is safe, and whether the author claims match native evidence and source revision.
Return the verdict JSON with findings, citations, checks, limits, and next action.
```

A passing scenario harness and a successful blind trial are different kinds of evidence. Both are useful; neither validates live permissions, production behavior, or every future review.
