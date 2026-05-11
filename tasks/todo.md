# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Hardening benchmark-test-skill contract lint and routing.
**Last completed phase:** Phase 36 — Benchmark Output Quality Evaluation
**Current phase:** Skill Contract Lint and Benchmark Routing Hardening.

## Current Skill Update: Benchmark Contract Lint and Routing

**Goal:** Harden `$benchmark-test-skill` so future runs consistently resolve the benchmark pack command, preflight target eligibility, preserve both-agent default semantics, and emit the required report and next-route contract.

### Acceptance Criteria

- [ ] Existing skill overlap is checked so the fix updates the benchmark workflow instead of adding a duplicate skill.
- [ ] Mirrored `benchmark-test-skill` contracts explicitly require command resolution, eligibility preflight, report verification, and final next-step routing.
- [ ] Deterministic layer1 contract tests lint the mirrored skill text for the benchmark routing requirements.
- [ ] Benchmark coverage metadata remains valid for the material skill behavior update.
- [ ] Standard skill validation, showcase data refresh, targeted checks, and whitespace validation pass.
- [ ] Results are recorded in this file, then committed and pushed on `master`.

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

- [x] Skills Showcase generated data includes benchmark evidence for both `run` skill rows.
- [x] The catalog can search and display the `run` benchmark pass, quality, cost, latency, and report path without hand-editing generated data.
- [x] Showcase data validation passes after regeneration.
- [x] The focused website update is committed and pushed on `master`.

### Result

Completed on 2026-05-11. `docs(showcase): render benchmark evidence` added benchmark evidence parsing to `scripts/generate-skills-showcase-data.mjs`, rendered benchmark panels in the static catalog, refreshed generated showcase data, and pushed the result to `master`.

## Current Benchmark: ship Codex

**Goal:** Run `$benchmark-test-skill ship --codex` through the repository harness with fresh eligibility, verify, and Codex-only benchmark evidence on 2026-05-11.

### Acceptance Criteria

- [x] `pnpm bench --list-skills` confirms `ship` is known and reports its coverage status.
- [x] `pnpm verify --skill ship` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill ship --agent codex --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-ship-2026-05-11.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in this file.

### Result

Completed on 2026-05-11. `ship` is a known custom benchmark target using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 12.1s across 1,245 tests; layer2 was skipped because no target-specific layer2 tests matched `ship`. Codex benchmark failed 0/3 hard assertions with no infrastructure-blocked runs. Each failed run created the manifest but recommended `$ship` or `$ship --no-deploy` as the next command, which failed the actionable next-route assertion. Output quality averaged 71.4%, below the 78.0% threshold, with evidence-linked and actionable-next-route at 0.0%. See `benchmark/test-ship-2026-05-11.md`.

## Review

- 2026-05-11 — Ran `$benchmark-test-skill ship --codex`. Preflight confirmed custom coverage; verify passed layer1 and skipped layer2; Codex benchmark failed 0/3 with no infra blocks because every run recommended `$ship`/`$ship --no-deploy` instead of an actionable next route. Report written to `benchmark/test-ship-2026-05-11.md`; route to `$session-triage ship benchmark failure`.
- 2026-05-11 — Added the variant-evaluation gate across the UI workflow: `$ux-variation --layout-mode` now routes built variants to `$uat --variant-evaluation` before `$ui-consolidate`; UAT has a variant evaluation mode; Codex now has a `ui-consolidate` skill with an evidence gate; docs, showcase data, and benchmark coverage were updated. Validation passed: `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests bench:coverage`, `pnpm --dir tests test:layer1 -- bench-setups.test.ts`, showcase data generation/validation, and `git diff --check`.
- Phase 36 closed on 2026-05-11 after focused benchmark-quality tests, benchmark coverage validation, `pnpm --dir tests bench --list-skills`, representative one-run Codex benchmarks for `run`, `investigate`, `design-system`, and `run-kanban`, standard skill audits, and `git diff --check`.
- Final validation fixed one false negative in the `investigate` benchmark setup: diagnostic-only output now needs an actionable next-command handoff but does not need to recommend the literal `$run` route.
