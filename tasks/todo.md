# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Promoting the successful `run` benchmark to the Skills Showcase website.
**Last completed phase:** Phase 36 — Benchmark Output Quality Evaluation
**Current phase:** None planned.

## Current Benchmark: run

**Goal:** Run `$benchmark-test-skill run` through the repository harness with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-11.

### Acceptance Criteria

- [x] `pnpm bench --list-skills` confirms `run` is known and reports its coverage status.
- [x] `pnpm verify --skill run` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill run --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-run-2026-05-11.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in this file, then committed and pushed on `master`.

### Result

Completed on 2026-05-11. `run` is a known custom benchmark target using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.4s across 1,245 tests; layer2 was skipped because no target-specific layer2 tests matched `run`. The both-agent benchmark completed with Claude 3/3 and Codex 3/3 hard assertion pass rates, no infrastructure-blocked runs, and 100.0% average output-quality scores for both agents. See `benchmark/test-run-2026-05-11.md`.

## Current Website Update: run Benchmark Evidence

**Goal:** Promote the successful `$benchmark-test-skill run` result into the generated Skills Showcase website data and catalog UI.

### Acceptance Criteria

- [ ] Skills Showcase generated data includes benchmark evidence for both `run` skill rows.
- [ ] The catalog can search and display the `run` benchmark pass, quality, cost, latency, and report path without hand-editing generated data.
- [ ] Showcase data validation passes after regeneration.
- [ ] The focused website update is committed and pushed on `master`.

## Review

- 2026-05-11 — Added the variant-evaluation gate across the UI workflow: `$ux-variation --layout-mode` now routes built variants to `$uat --variant-evaluation` before `$ui-consolidate`; UAT has a variant evaluation mode; Codex now has a `ui-consolidate` skill with an evidence gate; docs, showcase data, and benchmark coverage were updated. Validation passed: `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests bench:coverage`, `pnpm --dir tests test:layer1 -- bench-setups.test.ts`, showcase data generation/validation, and `git diff --check`.
- Phase 36 closed on 2026-05-11 after focused benchmark-quality tests, benchmark coverage validation, `pnpm --dir tests bench --list-skills`, representative one-run Codex benchmarks for `run`, `investigate`, `design-system`, and `run-kanban`, standard skill audits, and `git diff --check`.
- Final validation fixed one false negative in the `investigate` benchmark setup: diagnostic-only output now needs an actionable next-command handoff but does not need to recommend the literal `$run` route.
