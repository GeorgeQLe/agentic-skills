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
- Step 36.4: Add reusable setup-facing quality helpers and degraded-output fixtures.
  - Classification: automated
  - Files: create `tests/layer4/setup-helpers/quality.ts`, create fixtures under `tests/fixtures/bench-quality/`, modify focused layer1 tests
  - Add helpers for required fact coverage, forbidden fabrication, concrete file/command references, specificity checks, reference-trait checks, and rubric aggregation.
  - Include intentionally vague, generic, and hallucinated outputs that must fail quality thresholds.
  - Implementation plan:
    - Create `tests/layer4/setup-helpers/quality.ts` as the setup-facing wrapper over `tests/harness/bench-quality.ts`, so layer4 setup files do not need to assemble low-level rubric criteria by hand.
    - Move or wrap common helper patterns for required file references, required command references, forbidden fabrication phrases, specificity markers, next-route checks, and reference traits into named helper functions.
    - Keep existing fixtures under `tests/fixtures/bench-quality/` and add any missing fixture variants needed to prove vague, generic, hallucinated, and strong outputs are distinguished.
    - Refactor the `run` quality rubric in `tests/layer4/setups/tier1-workflows.setup.ts` to use the setup helper without changing behavior.
    - Validate with `pnpm --dir tests test:layer1 -- bench-quality bench-setups runner` and `git diff --check`.
- Step 36.5: Add Tier 1 workflow quality rubrics.
  - Classification: automated
  - Files: modify `tests/layer4/setups/tier1-workflows.setup.ts`, modify `tests/layer1/bench-setups.test.ts`
  - Cover `run`, `ship`, `ship-end`, `roadmap`, `plan-phase`, `feature-interview`, `spec-interview`, `investigate`, `session-triage`, `targeted-skill-builder`, and `benchmark-test-skill`.
  - Assert skill-specific quality such as evidence linkage, concrete next action, scope control, validation specificity, root-cause specificity, and no fabricated fixture facts.
- Step 36.6: Add quality rubrics for high-signal global and design-system setups.
  - Classification: automated
  - Files: modify `tests/layer4/setups/design-system.setup.ts`, modify `tests/layer4/setups/design-system-draftstonk.setup.ts`, modify `tests/layer4/setups/tier23-global-workflows.setup.ts`, modify focused layer1 tests
  - Prioritize deterministic signals for planning, debugging, audit, research, and design-token outputs.
  - Record deferred notes for skills whose quality cannot be scored reliably without external state or human judgment.
- Step 36.7: Add pack-skill quality rubrics by family.
  - Classification: automated
  - Files: modify `tests/layer4/setups/packs/pack-workflows.setup.ts`, modify focused layer1 tests
  - Group rubrics by pack family where possible: creator-media, business-ops, game, devtool, monorepo, kanban, project-fleet, remotion.
  - Test that pack outputs include pack/skill context, fixture evidence, practical risks, and non-generic next routes.
- Step 36.8: Update skill workflows and benchmark command docs.
  - Classification: automated
  - Files: modify mirrored skill creation/update workflows, modify `packs/agentic-skills-bench/*/benchmark-test-skill/SKILL.md`, modify `docs/skills-reference.md` if needed
  - Require future benchmark setup work to consider quality rubrics, not only hard assertions.
  - Teach benchmark reports to explain hard pass rate versus quality score without overstating statistical certainty.

### Green
- Step 36.9: Run tests, representative benchmarks, and phase review.
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
