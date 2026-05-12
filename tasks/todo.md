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

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests, data contract, security

**Subagent lanes:** none

### Implementation
- [ ] Step 39.1: Validate and promote `docs/benchmark-results-matrix.md` as a generated source of truth.
  - Classification: automated
  - Files: modify `scripts/generate-skills-showcase-data.mjs` (add matrix generation/validation logic), modify `docs/benchmark-results-matrix.md` (regenerate from persisted benchmark reports), modify `scripts/validate-skills-showcase-data.sh` (add matrix freshness check)
  - Parse persisted `benchmark/test-*.md` reports to extract skill name, date, agent, hard pass rate, quality score, subjective review grade (when present), and raw report path.
  - Generate a clean Markdown matrix table in `docs/benchmark-results-matrix.md` from the parsed data, replacing the hand-maintained content with generated output.
  - Add a freshness validation step to `scripts/validate-skills-showcase-data.sh` that fails when the matrix is stale relative to benchmark reports.
- [ ] Step 39.2: Add benchmark results surface to Skills Showcase UI.
  - Classification: automated
  - Files: modify `apps/skills-showcase/app/catalog/page.tsx` or add `apps/skills-showcase/app/benchmarks/page.tsx` (benchmark results display), modify `apps/skills-showcase/src/showcase/catalog.tsx` (add benchmark evidence rendering to skill rows if using catalog), modify `apps/skills-showcase/public/assets/skills-data.js` (regenerated)
  - Render benchmark evidence data already attached to skills in `skills-data.js` (the `benchmarkEvidence` field on 6+ skills).
  - Distinguish "has benchmark coverage setup" from "has completed graded benchmark results" in the UI.
  - Show per-agent pass rates, quality scores, and link to raw report paths.
  - Regenerate showcase data and validate.
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

- **Next work:** Step 39.1 — validate and promote benchmark-results-matrix.md as generated source of truth
- **Recommended next command:** `/run`
