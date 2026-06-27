# Ship Manifest - Alignment YAML Routing Benchmark

Date: 2026-06-27

## User Goal

Implement the fresh-session YAML routing benchmark plan: add a scenario benchmark target that measures Claude and Codex compliance with compiled alignment/interrogation YAML routing in fresh temp repos.

## Changed Files

- `prompts/exec/skill-prompt-20260627-161737-fresh-session-yaml-routing.md`
- `prompts/investigate/skill-prompt-20260627-011522-interrogation-apply-recommended.md`
- `prompts/ship-end/skill-prompt-20260627-183048-ship-end.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-27-alignment-yaml-routing-benchmark.md`
- `tests/bench.ts`
- `tests/harness/bench-types.ts`
- `tests/harness/bench-runner.ts`
- `tests/harness/bench-setups.ts`
- `tests/layer4/bench.test.ts`
- `tests/layer4/setups/alignment-yaml-routing.setup.ts`
- `tests/layer1/bench-coverage.test.ts`
- `tests/layer1/bench-setups.test.ts`
- `tests/layer1/runner.test.ts`

## Per-File Purpose

- `prompts/exec/...`: Captures the visible `$exec` invocation context for prompt-history compliance.
- `prompts/investigate/...`: Preserves an earlier visible investigation prompt that was left untracked after the related interrogation-page work.
- `prompts/ship-end/...`: Captures the visible `$ship-end` invocation and attached skill context for this closeout.
- `tasks/roadmap.md`: Converts the benchmark plan into a completed historical implementation record without disturbing the current Base Mirror task.
- `tasks/todo.md`: Adds the completed benchmark review under the current task state without taking over the active Base Mirror task.
- `tasks/history.md`: Records the shipped benchmark scenario and validation summary.
- `tasks/ship-manifest-2026-06-27-alignment-yaml-routing-benchmark.md`: Documents this shipping boundary.
- `tests/bench.ts`: Adds `--scenario`, `--list-scenarios`, mutual exclusion with `--skill`, and scenario-specific CLI output.
- `tests/harness/bench-types.ts`: Adds optional run context for setup implementations.
- `tests/harness/bench-runner.ts`: Passes run context to setups and classifies `Connection closed mid-response` as infrastructure.
- `tests/harness/bench-setups.ts`: Registers scenario targets separately from repository skill coverage.
- `tests/layer4/bench.test.ts`: Allows layer4 benchmark execution via `BENCH_SCENARIO`.
- `tests/layer4/setups/alignment-yaml-routing.setup.ts`: Defines the temp repo, routing case matrix, hard assertions, and quality rubric.
- `tests/layer1/bench-coverage.test.ts`: Covers scenario listing, zero-run resolution, skill/scenario separation, and ambiguous CLI rejection.
- `tests/layer1/bench-setups.test.ts`: Covers scenario registry separation and expected routing artifact acceptance.
- `tests/layer1/runner.test.ts`: Covers the new infrastructure classification.

## User-Goal Mapping

- Scenario target and report path: `tests/bench.ts`, `tests/harness/bench-setups.ts`, and existing persistence now produce `tests/benchmarks/runs/alignment-yaml-routing-<agent>-<sessionId>/`.
- Fresh temp repo and routing matrix: `tests/layer4/setups/alignment-yaml-routing.setup.ts`.
- Deterministic artifact and hard assertions: `tests/layer4/setups/alignment-yaml-routing.setup.ts`.
- Quality rubric: `tests/layer4/setups/alignment-yaml-routing.setup.ts`.
- Layer1 non-pollution and listing checks: `tests/layer1/bench-coverage.test.ts` and `tests/layer1/bench-setups.test.ts`.
- Prompt-history cleanup: the three `prompts/**` files satisfy the repository prompt-history convention for visible skill invocations involved in this shipping boundary.

## Tests Run

- `pnpm --dir tests exec vitest run --project layer1 layer1/bench-setups.test.ts layer1/bench-coverage.test.ts layer1/runner.test.ts` (112/112)
- `pnpm --dir tests bench --scenario alignment-yaml-routing --agent codex --runs 1 --chunk-size 1 --pause 0` (latest smoke after evaluator fix: Codex 1/1, 100%)
- `pnpm --dir tests bench --scenario alignment-yaml-routing --agent both --runs 3 --chunk-size 3 --pause 0` (latest full run: Claude 3/3, Codex 3/3, both 100%)
- `node scripts/skill-alignment-routing-audit.mjs --report` (0 findings)
- `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts layer1/interrogation-confidence-gate.test.ts --reporter=dot` (80/80)
- `node scripts/audit-task-docs.mjs` (passed during closeout)
- `git diff --check` (passed during closeout)
- Strict secret-token scan over the changed boundary for private keys, OpenAI-style keys, Slack tokens, GitHub tokens, and AWS access keys (no matches)

## Skipped Tests

- No full repository test suite was run. The change is scoped to the benchmark harness and alignment/interrogation routing checks; focused layer1 tests plus live benchmark execution cover the changed command surface and scenario behavior more directly.
- Skills Showcase generation/build was not run because no `SKILL.md`, `PACK.md`, showcase runtime, or generated public data changed.

## Adversarial Review

Method: changed-file self-review plus targeted live benchmark failure analysis.

Findings fixed:

- The initial quality evaluator parsed the harness wrapper text instead of the JSON artifact. Fixed by extracting JSON from quality output before parsing.
- The no-clear assertion falsely rejected reasons that said stale clear-context noise was ignored. Fixed by detecting only actual ask/recommend/need language.
- A Claude transport failure `Connection closed mid-response` was initially counted as a skill failure. Fixed by classifying it as agent-runner infrastructure and adding regression coverage.
- The setup wrote parent directories via `join(path, "..")`; replaced with `dirname()` for clarity.
- Added a CLI mutual-exclusion test for `--skill` plus `--scenario`.
- Closeout self-review found `ignored_noise: false` cases only required a boolean and the declared reason-basis phrases were not enforced. Fixed the hard assertions to require exact expected `ignored_noise` values and expected reason phrases, then updated the layer1 acceptance artifact to exercise that stricter check.

## Residual Risk

- Live benchmark outcomes still depend on external Claude/Codex runner availability. The harness now distinguishes at least the observed timeout and mid-response closure infrastructure cases from evaluated failures.
- The scenario artifact stores all eight case results in one JSON file under `cases`; this is more useful for matrix grading than one file per single case, but consumers should read the per-case array rather than expecting one top-level case result.

## Rollback Note

Revert this commit to remove the scenario target and restore the skill-only benchmark CLI behavior. Existing benchmark run directories under `tests/benchmarks/runs/**` are ignored evidence and do not need rollback.

## Next Command

`$exec`

## Boundary Notes

Included: all dirty tracked and untracked files observed at closeout, limited to the files listed above. No generated `.claude/skills/**` or `.codex/skills/**` roots were present in the shipping boundary.
