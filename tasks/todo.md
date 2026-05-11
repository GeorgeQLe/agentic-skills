# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Phase 36 planned; ready for implementation.
**Last completed phase:** Phase 35 — Repository-Wide Custom Benchmark Coverage
**Current phase:** Phase 36 of 36 — Benchmark Output Quality Evaluation

## Phase 36: Benchmark Output Quality Evaluation

**Goal:** Add output-quality evaluation to the benchmark harness so skill benchmarks measure not only contract compliance and artifact shape, but also whether generated outputs are specific, evidence-linked, useful, and free of hallucinated or generic content.

**Source:** User request on 2026-05-11 after reviewing benchmark setup coverage and identifying that current checks are mostly deterministic contract assertions rather than semantic quality evaluation.

**Scope:**
- Extend benchmark result types, reports, and persistence to include optional quality scores alongside existing pass/fail assertions.
- Add reusable quality-evaluation primitives: rubric criteria, weighted scoring, critical-failure handling, fixture fact coverage, reference-trait comparison, and hallucination/overreach checks.
- Define baseline quality rubrics for Tier 1 workflow skills first, then work through Tier 2/Tier 3 global skills and pack skills by priority.
- Keep hard contract assertions as mandatory gates; quality scoring must augment them, not replace them.
- Add evaluator tests using both high-quality and intentionally degraded outputs so the quality layer proves it can reject vague, generic, or fabricated answers.
- Update `$benchmark-test-skill` reporting language to distinguish hard assertion pass rate from output-quality score.
- Update future skill creation/update workflows so new or materially changed benchmark setups include a quality rubric when deterministic quality signals are practical, or record why quality scoring is blocked.

**Non-Goals:**
- Do not make LLM-as-judge mandatory for every skill in the first pass.
- Do not require exact golden-output matching where multiple good answers are valid.
- Do not create, modify, or suggest GitHub Actions.
- Do not remove existing custom setup assertions or blocked coverage semantics.

**Acceptance Criteria:**
- [ ] Benchmark reports include quality score summaries when a setup defines a quality evaluator.
- [ ] The harness supports weighted rubric criteria, critical criteria, evaluator notes, and minimum score thresholds.
- [ ] Quality evaluator tests prove that strong fixture outputs pass and degraded/generic/hallucinated outputs fail.
- [ ] Tier 1 workflow skills have quality rubrics and evaluator coverage.
- [ ] Tier 2/Tier 3 global skills have quality rubrics where deterministic signals are practical, or explicit blocked/deferred quality notes.
- [ ] Pack skills have quality rubrics where deterministic signals are practical, or explicit blocked/deferred quality notes.
- [ ] `$benchmark-test-skill <skill>` reports hard pass rate separately from quality score.
- [ ] Future skill creation/update workflows require benchmark quality-rubric handling where practical.
- [ ] Representative one-run Codex benchmarks produce quality-scored reports for at least `run`, `investigate`, `design-system`, and one pack skill.
- [ ] No GitHub Actions are created, modified, or recommended.

**Parallelization:** serial for harness schema/report changes, then agent-team eligible by setup family or pack once evaluator interfaces are stable.
**Coordination Notes:** Shared harness files and report schemas must land before per-skill rubrics. Per-skill rubric work can split by non-overlapping setup files, but registry/report integration needs one consolidation pass.

> Test strategy: tdd

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** high for harness/report files; medium for setup-only rubric work
**Review gates:** correctness, tests, docs/API conformance

**Subagent lanes:** none

### Tests First
- [x] Step 36.1: Write failing quality-evaluator and report tests for this phase's acceptance criteria.
  - Classification: automated
  - Files: create `tests/layer1/bench-quality.test.ts`, modify `tests/layer1/bench-report.test.ts`, modify `tests/layer1/bench-setups.test.ts`, add fixtures under `tests/fixtures/bench-quality/`
  - Add red tests for weighted rubric aggregation, minimum thresholds, critical criterion failure, evaluator notes, strong fixture output passing, generic/degraded fixture output failing, hallucinated fixture output failing, report summaries separating hard assertion pass rate from quality score, and setup registry behavior for skills with and without evaluators.
  - Tests must prove backward compatibility for setups that only define hard assertions and must keep infrastructure-blocked runs out of quality statistics.
  - Review: Added red tests and fixtures for the intended quality evaluator API, markdown quality summaries, setup evaluator discovery, backward compatibility, and infrastructure-block exclusion. Initial focused validation `pnpm --dir tests test:layer1 -- bench-quality bench-report bench-setups` failed as expected for missing quality primitives/report/setup wiring; after the foundational implementation landed, focused validation `pnpm --dir tests test:layer1 -- bench-quality bench-report bench-setups runner` passed with 10 files and 1241 tests.
  - Ship manifest:
    - User goal: Execute Phase 36 Step 36.1 from `$run` by adding tests-first coverage for benchmark output quality evaluation.
    - Changed files: `tests/layer1/bench-quality.test.ts`, `tests/layer1/bench-report.test.ts`, `tests/layer1/bench-setups.test.ts`, `tests/fixtures/bench-quality/strong-run-output.md`, `tests/fixtures/bench-quality/generic-run-output.md`, `tests/fixtures/bench-quality/hallucinated-run-output.md`, `tests/fixtures/bench-quality/degraded-run-output.md`, `tests/harness/bench-quality.ts`, `tests/harness/bench-types.ts`, `tests/harness/bench-report.ts`, `tests/harness/bench-runner.ts`, `tests/layer1/runner.test.ts`, `tests/layer4/setups/tier1-workflows.setup.ts`, `tasks/todo.md`, `tasks/history.md`.
    - Per-file purpose: New quality test and fixtures define scoring primitives and degraded-output behavior; quality harness/types implement deterministic scoring and result shapes; report tests and report code define quality-summary rendering separate from hard pass rate; runner code persists per-run quality results and reads generated artifact content for evaluation; setup tests and Tier 1 setup code define evaluator discovery, no-evaluator compatibility, the first `run` quality rubric, and the pre-existing run budget expectation; pre-existing runner/setup edits classify agent budget exhaustion as infrastructure-blocked and give the `run` workflow a standard budget; task docs record evidence.
    - User-goal mapping: The tests and implementation map to Phase 36 acceptance coverage for weighted scoring, thresholds, critical failures, evaluator notes, fixture pass/fail behavior, report summaries, setup registry behavior, backward compatibility, blocked-run exclusion, and initial `run` rubric behavior. The budget-exhaustion edits were already present before this `$run`; they are included because repository policy requires not leaving tracked mutations behind, and focused validation covered their assertions.
    - Tests run: `pnpm --dir tests test:layer1 -- bench-quality bench-report bench-setups` exited 1 as expected before implementation; `pnpm --dir tests test:layer1 -- bench-quality bench-report bench-setups runner` passed after implementation with 10 test files and 1241 tests; `pnpm --dir tests bench:coverage` passed with 143 skills; `pnpm bench --skill run --agent claude --runs 3 --chunk-size 3 --pause 0` passed after the budget fix with session `run-claude-8deea9b9`; `pnpm bench --skill run --agent claude --runs 1 --chunk-size 1 --pause 0` passed after quality artifact wiring with session `run-claude-09ebe639`, hard pass rate 100.0%, quality score 100.0%; `git diff --check` passed.
    - Skipped tests: Full representative benchmark matrix is reserved for Step 36.9 after all rubrics land.
    - Adversarial review: Changed-file self-review found that quality evaluation was initially using stdout/stderr instead of generated artifact contents; fixed by reading result files in `bench-runner.ts` and adding a runner regression test for artifact-only quality evidence.
    - Residual risk: Only the `run` setup has a quality rubric so far; Tier 1-wide, Tier 2/Tier 3, and pack rubric coverage remains for later planned steps. A single live Claude `run` benchmark verified report output, but the broader representative benchmark matrix remains for Step 36.9.
    - Rollback note: Revert the Step 36.1/36.2/36.3 foundational benchmark quality commit to remove the quality test contract and implementation.
    - Next command: `$run`

### Implementation
- [x] Step 36.2: Add benchmark quality types and scoring primitives.
  - Classification: automated
  - Files: modify `tests/harness/bench-types.ts`, create `tests/harness/bench-quality.ts`, modify `tests/harness/bench-setups.ts` if setup metadata needs evaluator discovery
  - Define rubric criteria with `id`, `description`, `weight`, optional `critical`, per-criterion score, evaluator notes, minimum score thresholds, and result summaries.
  - Add helper APIs for weighted scoring, critical-failure handling, threshold evaluation, required fact coverage, forbidden fabrication checks, concrete file/command reference checks, specificity checks, and reference-trait comparison.
  - Review: Implemented dependency-free quality rubric types, weighted scoring, threshold and critical-failure handling, result notes, required fact checks, forbidden fabrication checks, required regex checks, specificity checks, and reference-trait scoring in `tests/harness/bench-quality.ts` and `tests/harness/bench-types.ts`.
- [x] Step 36.3: Persist and report quality results.
  - Classification: automated
  - Files: modify `tests/harness/bench-runner.ts`, modify `tests/harness/bench-report.ts`, modify `tests/harness/bench-persistence.ts` if needed, modify `tests/layer1/bench-report.test.ts`
  - Record quality evaluations per run and summarize average score, threshold failures, critical failures, and lowest-scoring criteria in `report.json` and `report.md`.
  - Preserve existing hard assertion pass/fail behavior and label quality scoring as an additional output-quality signal.
  - Keep infrastructure-blocked runs out of evaluated quality statistics.
  - Review: Runner now stores optional `qualityResult` per non-blocked run, report generation summarizes quality only for evaluated runs with quality results, and markdown renders `Output Quality` separately from the hard assertion pass rate. A runner regression test confirms artifact file content is included in the evaluated output.
- [x] Step 36.4: Add reusable setup-facing quality helpers and degraded-output fixtures.
  - Classification: automated
  - Files: create `tests/layer4/setup-helpers/quality.ts`, create fixtures under `tests/fixtures/bench-quality/`, modify focused layer1 tests
  - Add helpers for required fact coverage, forbidden fabrication, concrete file/command references, specificity checks, reference-trait checks, and rubric aggregation.
  - Include intentionally vague, generic, and hallucinated outputs that must fail quality thresholds.
  - Review: Added `tests/layer4/setup-helpers/quality.ts` with setup-facing criterion builders for required facts, concrete file references, concrete command references, specificity, reference traits, next-route checks, and forbidden fabrications. Added focused layer1 coverage proving the helpers distinguish the existing strong and hallucinated benchmark-quality fixtures. Refactored the existing `run` quality rubric to use the helper API without changing its threshold or hard assertion behavior.
  - Ship manifest:
    - User goal: Execute Phase 36 Step 36.4 from `$run` by adding reusable setup-facing quality helpers and degraded-output fixture coverage for benchmark quality rubrics.
    - Changed files: `tests/layer4/setup-helpers/quality.ts`, `tests/layer4/setups/tier1-workflows.setup.ts`, `tests/layer1/bench-quality.test.ts`, `tasks/todo.md`, `tasks/history.md`.
    - Per-file purpose: `quality.ts` exposes named setup-facing quality criterion builders over the lower-level harness scoring primitives; `tier1-workflows.setup.ts` proves the helper can express the existing `run` rubric while keeping the same quality threshold and benchmark setup behavior; `bench-quality.test.ts` covers helper aggregation, concrete file/command checks, route checks, trait checks, and hallucination rejection against existing fixtures; task/history docs record the completed step, validation, and next plan.
    - User-goal mapping: The helper API directly supports the Phase 36 goal of reusable quality-evaluation primitives for future Tier 1, Tier 2/Tier 3, and pack rubrics, while the focused test keeps the intentionally strong/degraded/hallucinated fixture behavior executable.
    - Tests run: `pnpm --dir tests test:layer1 -- bench-quality bench-setups runner` passed with 10 files and 1242 tests; `pnpm --dir tests bench:coverage` passed with 143 skills; `git diff --check` passed.
    - Skipped tests: Full phase validation, benchmark coverage validation, and representative live benchmarks are reserved for Step 36.9 after all planned rubrics and docs land. Skills Showcase refresh was not run because no tracked `SKILL.md` or `PACK.md` changed.
    - Adversarial review: Diff-aware self-review checked that the helper is a thin wrapper over existing scoring primitives, does not alter report schemas or runner persistence, does not add dependencies or package-manager changes, does not broaden the `run` setup prompt/assertions, and does not touch GitHub Actions. One possible behavior drift from splitting `tests/example.test.ts` into a separate criterion was accepted because the file reference remains critical and the minimum threshold is unchanged.
    - Residual risk: The helper API is intentionally narrow and may need additional builders as later skill families expose new deterministic quality signals; Step 36.5 is the first broader consumer and should refine names only if needed by actual Tier 1 rubric patterns.
    - Rollback note: Revert the Step 36.4 commit to remove the setup-facing helper and restore the `run` rubric to direct harness assertions.
    - Next command: `$run`
- [x] Step 36.5: Add Tier 1 workflow quality rubrics.
  - Classification: automated
  - Files: modify `tests/layer4/setups/tier1-workflows.setup.ts`, modify `tests/layer1/bench-setups.test.ts`
  - Cover `run`, `ship`, `ship-end`, `roadmap`, `plan-phase`, `feature-interview`, `spec-interview`, `investigate`, `session-triage`, `targeted-skill-builder`, and `benchmark-test-skill`.
  - Assert skill-specific quality such as evidence linkage, concrete next action, scope control, validation specificity, root-cause specificity, and no fabricated fixture facts.
  - Implementation plan:
    - Use `tests/layer4/setup-helpers/quality.ts` to add `qualityEvaluator` rubrics to each remaining Tier 1 workflow definition in `tests/layer4/setups/tier1-workflows.setup.ts`.
    - Keep each rubric deterministic and fixture-bound: require key fixture facts/files, enforce the expected next route, reject obvious fabricated services/files/GitHub Actions, and add one skill-specific criterion for the workflow's core value (shipping manifest completeness, phase planning specificity, root-cause specificity, benchmark evidence reporting, or correction-to-contract mapping).
    - Extend `tests/layer1/bench-setups.test.ts` so Tier 1 opted-in quality evaluators are discoverable and representative rubric IDs exist for the covered skills.
    - Avoid changing benchmark prompts, hard assertions, budgets, or runner/report schemas unless a failing test proves the current setup cannot support the rubrics.
    - Validate with `pnpm --dir tests test:layer1 -- bench-quality bench-setups runner`, `pnpm --dir tests bench:coverage`, and `git diff --check`.
  - Review: Added deterministic quality evaluators for all Tier 1 workflow benchmark setups: `run`, `ship`, `ship-end`, `roadmap`, `plan-phase`, `feature-interview`, `spec-interview`, `investigate`, `session-triage`, `targeted-skill-builder`, and `benchmark-test-skill`. The remaining rubrics use fixture-bound evidence, file references, route handoffs, validation/evidence specificity, workflow-specific trait checks, and fabricated-content guards without changing prompts, hard assertions, budgets, runner behavior, or report schemas.
  - Ship manifest:
    - User goal: Execute Phase 36 Step 36.5 from `$run` by adding Tier 1 workflow quality rubrics and evaluator discovery coverage.
    - Changed files: `tests/layer4/setups/tier1-workflows.setup.ts`, `tests/layer1/bench-setups.test.ts`, `tasks/todo.md`, `tasks/history.md`.
    - Per-file purpose: `tier1-workflows.setup.ts` adds a shared Tier 1 quality-rubric composer and per-skill deterministic rubrics for the remaining workflow setups; `bench-setups.test.ts` asserts every Tier 1 workflow setup exposes a quality evaluator and representative rubric IDs; task/history docs record completion evidence, manifest, and next-step plan.
    - User-goal mapping: The setup rubrics satisfy the Phase 36 acceptance item requiring Tier 1 workflow quality rubrics and evaluator coverage; the registry test keeps that coverage discoverable and prevents silent removal.
    - Tests run: `pnpm --dir tests test:layer1 -- bench-quality bench-setups runner` passed with 10 files and 1242 tests; `pnpm --dir tests bench:coverage` passed with 143 skills; `git diff --check` passed.
    - Skipped tests: Full phase validation and representative live Codex benchmarks remain reserved for Step 36.9 after Tier 2/Tier 3, pack, and workflow-doc rubric work lands. Skills Showcase refresh was not run because no tracked `SKILL.md` or `PACK.md` changed.
    - Adversarial review: Diff-aware self-review checked that the change composes existing scoring primitives, leaves benchmark prompts and hard assertions unchanged, does not alter runner/report schemas, does not add dependencies or lockfile changes, and does not touch GitHub Actions. No fixes were required after review.
    - Residual risk: The rubrics are deterministic and fixture-bound, so they intentionally catch evidence linkage and specificity rather than broad prose quality. Later Step 36.9 live benchmarks should confirm that real generated Tier 1 outputs meet these stricter rubric expectations without excessive false negatives.
    - Rollback note: Revert the Step 36.5 commit to remove the Tier 1 quality rubrics while preserving the foundational quality harness and `run` rubric from earlier steps.
    - Next command: `$run`
- [ ] Step 36.6: Add quality rubrics for high-signal global and design-system setups.
  - Classification: automated
  - Files: modify `tests/layer4/setups/design-system.setup.ts`, modify `tests/layer4/setups/design-system-draftstonk.setup.ts`, modify `tests/layer4/setups/tier23-global-workflows.setup.ts`, modify focused layer1 tests
  - Prioritize deterministic signals for planning, debugging, audit, research, and design-token outputs.
  - Record deferred notes for skills whose quality cannot be scored reliably without external state or human judgment.
  - Implementation plan:
    - Inspect the existing custom setup definitions in `tests/layer4/setups/design-system.setup.ts`, `tests/layer4/setups/design-system-draftstonk.setup.ts`, and `tests/layer4/setups/tier23-global-workflows.setup.ts` to identify outputs with deterministic fixture facts, expected files, commands, tokens, or next routes.
    - Reuse `tests/layer4/setup-helpers/quality.ts` for deterministic rubrics. Favor required fixture facts, concrete file/command references, validation-specificity patterns, reference traits, next-route checks, and fabricated-content guards over broad subjective prose checks.
    - Add quality evaluators for high-signal design-system, planning, debugging, audit, and research setups where deterministic signals are practical. For any custom global setup that cannot be scored reliably from local fixtures, record an explicit deferred/blocked quality note in the setup metadata or focused test expectation rather than forcing a weak rubric.
    - Extend focused layer1 setup tests so opted-in global/design-system evaluators are discoverable and representative rubric IDs are asserted. Preserve backward compatibility for setups that intentionally remain hard-assertion-only with a documented deferral.
    - Do not change benchmark prompts, hard assertions, budgets, report schemas, or runner behavior unless a failing test proves a setup cannot expose the intended quality rubric otherwise.
    - Validate with `pnpm --dir tests test:layer1 -- bench-quality bench-setups runner`, `pnpm --dir tests bench:coverage`, and `git diff --check`.
- [ ] Step 36.7: Add pack-skill quality rubrics by family.
  - Classification: automated
  - Files: modify `tests/layer4/setups/packs/pack-workflows.setup.ts`, modify focused layer1 tests
  - Group rubrics by pack family where possible: creator-media, business-ops, game, devtool, monorepo, kanban, project-fleet, remotion.
  - Test that pack outputs include pack/skill context, fixture evidence, practical risks, and non-generic next routes.
- [ ] Step 36.8: Update skill workflows and benchmark command docs.
  - Classification: automated
  - Files: modify mirrored skill creation/update workflows, modify `packs/agentic-skills-bench/*/benchmark-test-skill/SKILL.md`, modify `docs/skills-reference.md` if needed
  - Require future benchmark setup work to consider quality rubrics, not only hard assertions.
  - Teach benchmark reports to explain hard pass rate versus quality score without overstating statistical certainty.

### Green
- [ ] Step 36.9: Run tests, representative benchmarks, and phase review.
  - Classification: automated
  - Files: modify `tasks/todo.md`, modify `tasks/history.md`
  - Run focused quality/evaluator tests, setup registry tests, report tests, benchmark coverage validation, `pnpm bench --list-skills`, representative one-run Codex benchmarks with quality scoring, standard skill audits, and `git diff --check`.
  - Representative one-run Codex benchmarks must include at least `run`, `investigate`, `design-system`, and one pack skill.
  - Perform only concrete cleanup found by validation.

### Milestone: Phase 36 Benchmark Output Quality Evaluation
**Acceptance Criteria:**
- [ ] Benchmark reports include quality score summaries when a setup defines a quality evaluator.
- [ ] The harness supports weighted rubric criteria, critical criteria, evaluator notes, and minimum score thresholds.
- [ ] Quality evaluator tests prove that strong fixture outputs pass and degraded/generic/hallucinated outputs fail.
- [ ] Tier 1 workflow skills have quality rubrics and evaluator coverage.
- [ ] Tier 2/Tier 3 global skills have quality rubrics where deterministic signals are practical, or explicit blocked/deferred quality notes.
- [ ] Pack skills have quality rubrics where deterministic signals are practical, or explicit blocked/deferred quality notes.
- [ ] `$benchmark-test-skill <skill>` reports hard pass rate separately from quality score.
- [ ] Future skill creation/update workflows require benchmark quality-rubric handling where practical.
- [ ] Representative one-run Codex benchmarks produce quality-scored reports for at least `run`, `investigate`, `design-system`, and one pack skill.
- [ ] No GitHub Actions are created, modified, or recommended.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

**On Completion** (fill in when phase is done):
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:

## Review

- Planning note: Phase 36 intentionally keeps implementation serial because shared benchmark types, runner behavior, report schema, and setup registry semantics are coupled until the quality evaluator interface lands.
