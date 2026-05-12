# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Phase 39 decomposed, ready for Step 39.1.
**Current phase:** Phase 39 of 39 — Benchmark Results Visibility And Safe Git Fixtures
**Last completed phase:** Phase 38 — First-Party Newsletter Capture And Admin

## Phase 39: Benchmark Results Visibility And Safe Git Fixtures

**Goal:** Make already-benchmarked skills visible as a durable results matrix and unblock safe integration benchmark setups for git-mutating workflows that can run against disposable test repositories.

**Source:** User request on 2026-05-11 and `docs/benchmark-results-matrix.md`.

**Scope:**
- Promote `docs/benchmark-results-matrix.md` into a generated or validated source of truth for persisted benchmark run data and grades.
- Add a Skills Showcase surface for benchmark results that distinguishes setup coverage from completed benchmark evidence and grades.
- Design permission-gated, disposable GitHub test-repository fixtures for `commit-and-push-by-feature` and `sync`.
- Require explicit user approval before any `gh` operation that creates, mutates, or deletes a live GitHub test repository.
- Treat test-repo cleanup failures as infrastructure-blocked evidence, not skill failures.

**Non-Goals:**
- Do not run live GitHub repository creation without explicit user permission.
- Do not run git-mutating benchmarks against the primary `agentic-skills` repository.
- Do not create, modify, or recommend GitHub Actions.

**Acceptance Criteria:**
- [ ] A clean benchmark-results matrix lists skills with persisted evaluated benchmark data, hard pass rates, quality scores, subjective review grades when present, and raw report paths.
- [ ] Skills Showcase exposes benchmark results or links to the generated matrix without confusing coverage status with completed graded runs.
- [ ] `commit-and-push-by-feature` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [ ] `sync` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [ ] The benchmark coverage registry reflects any newly unblocked setup status only after the safe fixture is implemented and validated.
- [ ] Cleanup and infrastructure-block handling are documented for the disposable repository workflow.
- [ ] No GitHub Actions are created, modified, or recommended.

> Test strategy: tests-after

## Ad-Hoc Benchmark Rerun: benchmark-test-skill Self Benchmark

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Plan:**
- [x] Confirm `benchmark-test-skill` is a known benchmark harness target and record its coverage status.
- [x] Run `pnpm verify --skill benchmark-test-skill` from `tests/` and stop if it fails.
- [x] If verify passes, run `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0`.
- [x] Write and validate `benchmark/test-benchmark-test-skill-2026-05-12.md` with verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Record results here, then commit and push intended benchmark/task changes on `master`.

**Review:** Complete. `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.2s across 1,303 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with one Claude infrastructure-blocked run due to agent runner budget. Evaluated hard assertions passed for both agents: Claude 2/2 evaluated runs, Codex 3/3 evaluated runs. Claude output quality averaged 72.9% with 2 threshold failures and 2 critical failures; Codex output quality averaged 85.7% with 0 threshold failures and 2 critical failures. Report: `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next skill: `$benchmark-agent-review benchmark-test-skill`.

## Ad-Hoc Agent Review: benchmark-test-skill

**Goal:** Review the persisted `$benchmark-test-skill benchmark-test-skill` outputs for subjective operator ergonomics after deterministic hard assertions passed.

**Review:** Complete. Reviewed latest Claude run `tests/benchmarks/runs/benchmark-test-skill-claude-d0075f7e/` and Codex run `tests/benchmarks/runs/benchmark-test-skill-codex-76616c00/`, excluding Claude run #0 because it was infrastructure-blocked by agent runner budget. Median subjective score was 80 with range 70-92. The evaluated outputs are usable-to-good overall: they create the requested report, stay scoped, avoid unsupported external work, and choose the correct runner route. The material weakness is exact evidence fidelity: several reports summarize `layer1 PASS` as generic `PASS` or broad "verify status", leaving the next operator to infer source facts. Review report: `benchmark/review-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$targeted-skill-builder benchmark-test-skill exact benchmark evidence reporting`.

## Ad-Hoc Targeted Skill Update: benchmark-test-skill Exact Evidence Reporting

**Goal:** Tighten the existing `benchmark-test-skill` tier1 benchmark fixture so passing generated reports preserve exact benchmark evidence instead of broad keywords.

**Review:** Complete. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the benchmark prompt and hard assertions require exact report evidence: `layer1 PASS`, `layer2 SKIPPED`, `passRate=1.0` or `100%`, `p50=1200`, `totalCost=0.42`, `run-agent-abc`, source files, and literal report path `benchmark/test-run-2026-05-11.md`. Updated `tests/layer1/bench-setups.test.ts` to assert the prompt contract and reject a thin keyword-only report. Validation passed with `pnpm --dir tests test:layer1 -- bench-setups bench-quality`, `pnpm --dir tests bench:coverage`, `./install.sh`, dependency/version/routing checks, `pnpm --dir tests verify --skill benchmark-test-skill`, Codex smoke `benchmark-test-skill-codex-2527788d` (1/1 hard assertions), and `git diff --check`. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests, data contract, security

**Subagent lanes:** none

### Implementation
- [x] Step 39.1: Validate and promote `docs/benchmark-results-matrix.md` as a generated source of truth.
  - Classification: automated
  - Files: modify `scripts/generate-skills-showcase-data.mjs` (add matrix generation/validation logic), modify `docs/benchmark-results-matrix.md` (regenerate from persisted benchmark reports), modify `scripts/validate-skills-showcase-data.sh` (add matrix freshness check)
  - Parse persisted `benchmark/test-*.md` reports to extract skill name, date, agent, hard pass rate, quality score, subjective review grade (when present), and raw report path.
  - Generate a clean Markdown matrix table in `docs/benchmark-results-matrix.md` from the parsed data, replacing the hand-maintained content with generated output.
  - Add a freshness validation step to `scripts/validate-skills-showcase-data.sh` that fails when the matrix is stale relative to benchmark reports.
- [ ] Step 39.2: Add benchmark results surface to Skills Showcase UI.
  - Classification: automated
  - Files: create `apps/skills-showcase/app/benchmarks/page.tsx` (server page with static HTML structure), create `apps/skills-showcase/src/showcase/benchmarks.tsx` (client component rendering the aggregated benchmark results table), modify `apps/skills-showcase/app/globals.css` (benchmark results page styles), modify `apps/skills-showcase/src/showcase/catalog.tsx` (add link from benchmark-passed tags to `/benchmarks`), regenerate `apps/skills-showcase/public/assets/skills-data.js`

  **Context from Step 39.1:** The catalog already renders benchmark evidence inline via `makeBenchmarkPanel()` in `src/showcase/catalog.tsx` (lines 121-196). Benchmark data is attached to skills in `window.SKILLS_SHOWCASE_DATA.skills[].benchmarkEvidence`. The `BenchmarkEvidence`, `BenchmarkAgent`, `BenchmarkQuality`, `BenchmarkDemo` interfaces are defined in `catalog.tsx` lines 42-84. CSS classes `.benchmark-panel`, `.benchmark-metrics`, `.benchmark-demo` already exist in `globals.css` (lines 902-969).

  **Approach:**
  1. Create `apps/skills-showcase/app/benchmarks/page.tsx` — server-rendered page with heading, intro text, and a `[data-benchmarks-list]` container. Follow the pattern of `app/catalog/page.tsx` (static HTML shell + client component).
  2. Create `apps/skills-showcase/src/showcase/benchmarks.tsx` — client component that:
     - Reads `window.SKILLS_SHOWCASE_DATA.skills` and filters to those with `benchmarkEvidence`.
     - Renders an aggregated table with columns: Skill, Agent(s), Hard Pass Rate, Output Quality, Runs, Report Link.
     - Distinguishes "graded" (has quality scores) from "partially graded" (hard assertions only) with a status badge.
     - Links skill names back to `/catalog` with a search filter, and report paths to GitHub.
     - Reuses the `BenchmarkEvidence` interface from catalog.tsx (extract shared types to a `src/showcase/types.ts` or inline).
  3. Add a "Benchmarks" link to the nav in `app/catalog/page.tsx` or the site layout.
  4. In `catalog.tsx`, make the "benchmark-passed" tag chip link to `/benchmarks`.
  5. Add benchmark page styles to `globals.css` — reuse `.benchmark-panel` green theme for consistency.
  6. Add test coverage in `src/showcase/benchmarks.test.tsx` — verify page renders with test data, shows skill count, renders agent rows.
  7. Regenerate showcase data and run `scripts/validate-skills-showcase-data.sh`.
  8. Run `pnpm --dir apps/skills-showcase build` to verify no build errors.
  9. Start dev server and verify the `/benchmarks` route renders, links work, and the page distinguishes graded from partially-graded skills.

  **Key decisions:**
  - Shared types: extract `BenchmarkEvidence`, `BenchmarkAgent`, `BenchmarkQuality`, `BenchmarkDemo`, `Skill` interfaces to `src/showcase/types.ts` since both catalog and benchmarks need them.
  - The page should note at the top that benchmark results come from persisted run data and the generated matrix, linking to `docs/benchmark-results-matrix.md` on GitHub.
  - Do NOT confuse "benchmark coverage setup" (which 30+ skills have) with "completed graded runs" (which 14 skills have). Only show skills with actual `benchmarkEvidence` data.
- [ ] Step 39.3: Design safe disposable GitHub test-repository fixture infrastructure.
  - Classification: automated
  - Files: create `docs/safe-git-benchmark-fixtures.md` (design doc), create `tests/layer4/helpers/disposable-repo.ts` (fixture helper)
  - Document the permission-gated disposable repository workflow: explicit user approval before `gh repo create`, `gh repo delete`, or any mutation of a live GitHub test repository.
  - Document cleanup handling: cleanup failures are infrastructure-blocked evidence, not skill failures.
  - Implement a reusable fixture helper that creates a temporary GitHub repo via `gh`, clones it locally, and provides cleanup — all gated behind explicit confirmation.
- [ ] Step 39.4: Add `commit-and-push-by-feature` safe fixture plan using the disposable repo infrastructure.
  - Classification: automated
  - Files: create `tests/layer4/setups/git-fixture-commit-and-push.setup.ts` (fixture definition), modify `tests/harness/bench-coverage.ts` (update coverage status from blocked to custom)
  - Define the benchmark setup: create disposable repo, stage mixed changes across multiple files, run `commit-and-push-by-feature`, verify commits are grouped by feature with conventional messages.
  - Update `COVERAGE_OVERRIDES` and `TIER23_GLOBAL_BLOCKED_SKILLS` to reflect newly unblocked status with the safe fixture path.
- [ ] Step 39.5: Add `sync` safe fixture plan using the disposable repo infrastructure.
  - Classification: automated
  - Files: create `tests/layer4/setups/git-fixture-sync.setup.ts` (fixture definition), modify `tests/harness/bench-coverage.ts` (update coverage status from blocked to custom)
  - Define the benchmark setup: create disposable repo with upstream changes, run `sync`, verify pull/rebase behavior and stash handling.
  - Update `COVERAGE_OVERRIDES` and `TIER23_GLOBAL_BLOCKED_SKILLS` to reflect newly unblocked status with the safe fixture path.

### Green
- [ ] Step 39.6: Write regression tests covering acceptance criteria.
  - Classification: automated
  - Files: create or modify `tests/layer1/benchmark-results-matrix.test.ts` (matrix generation/validation tests), modify existing layer1 test files as needed
  - Test matrix generation from fixture benchmark reports.
  - Test freshness validation catches stale matrix.
  - Test that showcase data includes `benchmarkEvidence` for graded skills.
  - Test that coverage registry entries for `commit-and-push-by-feature` and `sync` reflect custom coverage.
- [ ] Step 39.7: Run all tests, verify they pass, and validate the phase.
  - Classification: automated
  - Files: modify `tasks/todo.md` (review section)
  - Run `pnpm --dir tests test` for layer1 regression.
  - Run `scripts/validate-skills-showcase-data.sh` for showcase freshness.
  - Run `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`.
  - Run `git diff --check`.
  - Verify all acceptance criteria.

### Milestone: Phase 39 Benchmark Results Visibility And Safe Git Fixtures
**Acceptance Criteria:**
- [ ] A clean benchmark-results matrix lists skills with persisted evaluated benchmark data, hard pass rates, quality scores, subjective review grades when present, and raw report paths.
- [ ] Skills Showcase exposes benchmark results or links to the generated matrix without confusing coverage status with completed graded runs.
- [ ] `commit-and-push-by-feature` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [ ] `sync` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [ ] The benchmark coverage registry reflects any newly unblocked setup status only after the safe fixture is implemented and validated.
- [ ] Cleanup and infrastructure-block handling are documented for the disposable repository workflow.
- [ ] No GitHub Actions are created, modified, or recommended.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

## Routing

## Review — Step 39.1

- Completed on 2026-05-12.
- `scripts/generate-skills-showcase-data.mjs` now generates `docs/benchmark-results-matrix.md` from persisted benchmark report JSON, curated benchmark reports, and subjective review files.
- `docs/benchmark-results-matrix.md` now lists 14 latest evaluated skill/agent result rows and 5 incomplete persisted reports, with coverage registry status kept separate from benchmarked-result status.
- `scripts/validate-skills-showcase-data.sh` now includes `docs/benchmark-results-matrix.md` in generated asset freshness checks.
- Added `tests/layer1/benchmark-results-matrix.test.ts` to assert the generated matrix includes evaluated results, incomplete persisted reports, and the coverage/results separation.
- Validation:
  - `pnpm --dir tests test:layer1 -- benchmark-results-matrix` — passed, 12 files / 1304 tests.
  - `scripts/validate-skills-showcase-data.sh` — passed after regenerating stale assets.
  - `git diff --check` — passed.
- Skipped tests: no live GitHub fixture validation was relevant to Step 39.1; that is planned for later permission-gated fixture steps.
- Residual risk: subjective review grade extraction currently records the review path in the matrix and notes that a median score is available; a later showcase/results UI step can decide whether to expose the numeric score directly.

- **Next work:** Step 39.2 — add benchmark results surface to Skills Showcase UI
- **Recommended next command:** `$run`
