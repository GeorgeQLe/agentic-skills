# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Phase 36 planned; ready for implementation planning.
**Last completed phase:** Phase 35 — Repository-Wide Custom Benchmark Coverage
**Current phase:** Phase 36 — Benchmark Output Quality Evaluation

## Priority Documentation Todo

- [x] Documentation is current; no missing or stale research, spec, roadmap, or task artifacts found.

## Current State

- Phase 35 is complete and archived at `tasks/phases/phase-35.md`.
- `tasks/roadmap.md` marks Phase 35 acceptance criteria complete.
- Repository benchmark coverage now has custom or explicitly blocked coverage rows for every current repository skill, with future skill creation/update workflows required to handle coverage.
- Phase 36 is now planned in `tasks/roadmap.md` to add rubric-based output-quality evaluation on top of existing benchmark contract assertions.
- Manual launch tasks from Phase 34 remain pending in `tasks/manual-todo.md`; they are non-blocking `after:` tasks, not current phase blockers.

## Next Work

- [ ] Run `$plan-phase 36` to turn the quality-evaluation roadmap into an implementation-ready task plan.

## Current Benchmark: run

**Goal:** Run `$benchmark-test-skill run` through repository benchmark harness with fresh eligibility, verify, and both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `run` is known and reports its coverage status.
- [x] `pnpm verify --skill run` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill run --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-run-2026-05-11.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [ ] Results are recorded in this file, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-11. Preflight listed `run` with custom coverage via `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed layer1 in 8.6s with 1,230 tests; layer2 was skipped because no target-specific layer2 tests matched `run`. Both-agent benchmark completed with no infrastructure-blocked runs. Claude evaluated 1/3 pass, failing `Agent command exited successfully` in runs #0 and #1, with p50 31.1s and $0.75 total estimated cost. Codex evaluated 3/3 pass, with p50 41.7s and $0.75 total estimated cost. Report written to `benchmark/test-run-2026-05-11.md`.

**Recommended Next Step:** `$session-triage run benchmark failure`.

## Current Fix: run benchmark route assertion

**Goal:** Make the `run` custom benchmark route assertion agent-aware so Claude is evaluated against the Claude `/ship` handoff while Codex remains evaluated against the Codex `$run` handoff for the planning fixture.

**Acceptance Criteria:**
- [x] Benchmark assertion context includes the active runner agent.
- [x] The tier1 `run` benchmark setup accepts `/ship` for Claude and `$run` for Codex.
- [x] Focused layer1 tests cover the agent-specific route behavior.
- [x] One-run Claude and Codex benchmarks for `run` pass after the fix.

**Result:** Updated the benchmark harness to pass `{ agent }` into setup assertions and updated the tier1 workflow setup to support per-agent route expectations. Added a focused regression test proving the `run` setup accepts `/ship` for Claude while preserving `$run` for Codex. Validation passed with `pnpm --dir tests test -- layer1/bench-setups.test.ts` (1,230 layer1 tests), `pnpm --dir tests bench:coverage` (143 skills valid), `pnpm bench --skill run --agent claude --runs 1 --chunk-size 1 --pause 0` (100.0%, session `run-claude-715a2214`), and `pnpm bench --skill run --agent codex --runs 1 --chunk-size 1 --pause 0` (100.0%, session `run-codex-9584a113`).

## Recommended Command

`$plan-phase 36`

## Review

- Phase 35 final validation passed with focused layer1 regression tests, full layer1, benchmark coverage validation, benchmark list output, standard skill audits, Skills Showcase generated-data freshness validation, and representative one-run Codex benchmarks for `run`, `plan-phase`, `benchmark-test-skill`, and `youtube-video-audit`.
- See `tasks/phases/phase-35.md` for full evidence, quality-gate manifest, and rollback notes.
- Phase 36 roadmap entry added on 2026-05-11 from user request to work through output-quality tests for benchmarked skills.
