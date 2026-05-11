# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Phase 37 planned; ready for implementation planning.
**Last completed phase:** Phase 36 — Benchmark Output Quality Evaluation

## Priority Task Queue

- [x] `$ship-end --no-deploy` - clean working tree confirmed on 2026-05-11 at 12:38:41 -0400; no uncommitted benchmark/showcase changes remain to ship.
- [ ] `$plan-phase 37` - generate implementation steps for Phase 37 because `tasks/roadmap.md` now includes planned Phase 37 but `tasks/todo.md` has no current Tests First / Implementation / Green breakdown for it.
- [ ] `$reconcile-dev-docs fix tasks` - reconcile stale task status because `tasks/todo.md` still contains a completed spec section with unchecked "Spec artifacts are committed and pushed on `master`" even though commit `cbf1b38` is already on `origin/master`.

## Priority Documentation Todo

- [ ] `/devtool-docs-audit` - update `research/devtool-docs-audit.md` because it was last written 2026-04-30 and 81 skill/pack commits have landed since (benchmark harness, session-triage, live skill tests, skills showcase website, custom benchmark coverage, output-quality evaluation).
- [ ] `/spec-drift fix all` - update `specs/drift-report.md` because it was last refreshed 2026-05-04 and 41 skill/pack commits have landed since, including material contract changes to `ship`, `benchmark-test-skill`, and new skills like `ui-consolidate`.
- [x] `/devtool-user-map` - `research/devtool-user-map.md` exists (2026-04-22); no newer upstream input.
- [x] `/devtool-integration-map` - `research/devtool-integration-map.md` exists (2026-04-22); no newer upstream input.
- [x] `/devtool-dx-journey` - `research/devtool-dx-journey.md` exists (2026-04-22); no newer upstream input.
- [x] `/devtool-adoption` - `research/devtool-adoption.md` exists (2026-04-22); no newer upstream input.
- [x] `/devtool-positioning` - `research/devtool-positioning.md` exists (2026-04-30); no newer upstream input.
- [x] `/devtool-monetization` - `research/devtool-monetization.md` exists (2026-04-30); no newer upstream input.

## Current Benchmark: ship

**Goal:** Run `$benchmark-test-skill ship` through the repository harness with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-11.

### Acceptance Criteria

- [x] `pnpm bench --list-skills` confirms `ship` is known and reports its coverage status.
- [x] `pnpm verify --skill ship` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill ship --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-ship-2026-05-11.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in this file, then committed and pushed on `master`.

### Result

Completed on 2026-05-11. `ship` is a known custom benchmark target using `tests/layer4/setups/tier1-workflows.setup.ts`. Initial triage verified the benchmark setup was using Codex `$run` routing for both runners even though Claude uses slash commands. The setup now asserts `/run` for Claude and `$run` for Codex, and the fixture prompt states the runner-specific convention explicitly. Verify passed with layer1 in 12.0s across 1,254 tests; layer2 was skipped because no target-specific layer2 tests matched `ship`. The final both-agent benchmark completed with no infrastructure-blocked runs and both Claude and Codex passed 3/3 hard assertions with 78.6% output-quality scores. See `benchmark/test-ship-2026-05-11.md`.

## Current Skill Update: Benchmark Contract Lint and Routing

**Goal:** Harden `$benchmark-test-skill` so future runs consistently resolve the benchmark pack command, preflight target eligibility, preserve both-agent default semantics, and emit the required report and next-route contract.

### Acceptance Criteria

- [x] Existing skill overlap is checked so the fix updates the benchmark workflow instead of adding a duplicate skill.
- [x] Mirrored `benchmark-test-skill` contracts explicitly require command resolution, eligibility preflight, report verification, and final next-step routing.
- [x] Deterministic layer1 contract tests lint the mirrored skill text for the benchmark routing requirements.
- [x] Benchmark coverage metadata remains valid for the material skill behavior update.
- [x] Standard skill validation, showcase data refresh, targeted checks, and whitespace validation pass.
- [x] Results are recorded in this file, then committed and pushed on `master`.

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

## Current Skill Update: Ship Benchmark Self-Route Fix

**Goal:** Update the existing `ship` skill contracts so `$ship` completion never routes back to `$ship` as routine next work and instead hands off to the next executable project step.

### Acceptance Criteria

- [x] Existing-skill overlap confirms the fix belongs in `ship`, not a new skill.
- [x] Codex and Claude `ship` contracts forbid routine self-routing after ship completion.
- [x] Deterministic layer1 coverage catches future loss of the self-route guard.
- [x] Standard skill validation, showcase data refresh, targeted checks, and whitespace validation pass.
- [x] Results are recorded in this file, then committed and pushed on `master`.

## Current Spec: First-Party Skills Showcase Newsletter Capture

**Goal:** Specify first-party newsletter capture for the existing Skills Showcase website, including Neon persistence, tRPC contracts, TanStack Query client state, and an admin export page.

### Acceptance Criteria

- [x] Existing showcase website context is identified before choosing the app architecture.
- [x] Assumptions checkpoint and interview decisions are recorded.
- [x] Spec covers architecture, data model, API contracts, admin access, security/privacy, edge cases, tests, and acceptance criteria.
- [x] Interview log records user corrections and the Next.js refactor decision.
- [x] Validation is run and results are recorded.
- [ ] Spec artifacts are committed and pushed on `master`.

## Review

- 2026-05-11 — Used `$spec-interview` for first-party Skills Showcase newsletter capture. Existing site context was confirmed under `docs/skills-showcase/`; the spec now recommends a conservative Next.js refactor because the current site is plain static HTML/CSS/JS and the approved stack is Neon, tRPC, and TanStack Query. Deliverables written to `specs/first-party-skills-showcase-newsletter-capture.md` and `specs/first-party-skills-showcase-newsletter-capture-interview.md`. Validation passed: canonical spec headings present, interview log includes assumptions/questions/coverage/closing summary, and `git diff --check`.
- 2026-05-11 — Used `$session-triage ship benchmark failure` for the failed both-agent `ship` benchmark. Verified the harness convention bug: `ship` expected `$run` for both Claude and Codex even though the mirrored contracts use `/run` for Claude and `$run` for Codex. Added runner-specific hard assertions, allowed both valid route conventions in the quality rubric, made the fixture prompt explicit because the Claude runner only receives the prompt, and linted the `ship` contract route convention. Validation passed: `pnpm --dir tests test:layer1 -- bench-setups.test.ts`, `pnpm --dir tests test:layer1 -- bench-coverage.test.ts`, `pnpm verify --skill ship`, skill audits, showcase data refresh, and final `pnpm bench --skill ship --agent both --runs 3 --chunk-size 3 --pause 0` with Claude 3/3 and Codex 3/3 hard assertion passes, no infrastructure-blocked runs, p50 21.3s/28.1s, and total cost $1.50. Report updated at `benchmark/test-ship-2026-05-11.md`.
- 2026-05-11 — Used `$targeted-skill-builder` for the `ship` Codex benchmark failure. Decision: update the existing mirrored `ship` contracts, not create a new skill. Added a no-self-route rule so completed `$ship`/`/ship` runs hand off to `$run`/`/run` or another concrete next route, with retry exceptions only for incomplete shipping. Added layer1 contract lint coverage. Validation passed: `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests bench:coverage`, `pnpm --dir tests test:layer1 -- bench-coverage.test.ts`, showcase data generation, targeted `rg`, `git diff --check`, and focused `pnpm --dir tests bench --skill ship --agent codex --runs 3 --chunk-size 3 --pause 0` with 3/3 hard assertion passes, 78.6% average quality, no infrastructure-blocked runs, p50 26.1s, total cost $0.75. `scripts/validate-skills-showcase-data.sh` regenerated dirty generated assets as expected before commit; re-run after commit to confirm clean showcase state.
- 2026-05-11 — Used `$targeted-skill-builder` for benchmark contract lint and routing hardening. Decision: update existing `benchmark-test-skill` rather than create a duplicate lint skill. Added mirrored command-resolution guards, report verification, and final-route requirements; added layer1 contract lint coverage in `bench-coverage.test.ts`; refreshed Skills Showcase assets. Validation passed: `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests bench:coverage`, `pnpm --dir tests test:layer1 -- bench-coverage.test.ts`, showcase generation/validation, targeted `rg`, and `git diff --check`.
- 2026-05-11 — Ran `$benchmark-test-skill ship --codex`. Preflight confirmed custom coverage; verify passed layer1 and skipped layer2; Codex benchmark failed 0/3 with no infra blocks because every run recommended `$ship`/`$ship --no-deploy` instead of an actionable next route. Report written to `benchmark/test-ship-2026-05-11.md`; route to `$session-triage ship benchmark failure`.
- 2026-05-11 — Added the variant-evaluation gate across the UI workflow: `$ux-variation --layout-mode` now routes built variants to `$uat --variant-evaluation` before `$ui-consolidate`; UAT has a variant evaluation mode; Codex now has a `ui-consolidate` skill with an evidence gate; docs, showcase data, and benchmark coverage were updated. Validation passed: `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests bench:coverage`, `pnpm --dir tests test:layer1 -- bench-setups.test.ts`, showcase data generation/validation, and `git diff --check`.
- Phase 36 closed on 2026-05-11 after focused benchmark-quality tests, benchmark coverage validation, `pnpm --dir tests bench --list-skills`, representative one-run Codex benchmarks for `run`, `investigate`, `design-system`, and `run-kanban`, standard skill audits, and `git diff --check`.
- Final validation fixed one false negative in the `investigate` benchmark setup: diagnostic-only output now needs an actionable next-command handoff but does not need to recommend the literal `$run` route.
