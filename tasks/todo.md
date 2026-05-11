# Active Phase: Repository-Wide Custom Benchmark Coverage

**Project:** Claude Skills / agentic-skills
**Phase:** 35 of 35 active roadmap phases
**Status:** Ready for implementation
**Source:** `tasks/roadmap.md`, `specs/benchmark-custom-coverage.md`, `specs/benchmark-custom-coverage-feature-interview.md`

## Goal

Build custom Codex benchmark test setups for every repository skill and enforce benchmark setup handling for every future skill.

## Scope

- Add a durable benchmark coverage matrix that lists every skill under `global/` and `packs/`.
- Validate that every repository skill appears in the matrix and that custom/blocked statuses are well-formed.
- Update benchmark reporting so `$benchmark-test-skill <skill>` distinguishes custom, generic, and blocked coverage.
- Add reusable custom setup helpers for fixtures, Markdown/frontmatter assertions, routing assertions, budget tiers, and report expectations.
- Implement Codex custom benchmark setups in priority tiers, starting with high-use global execution/planning/debug skills.
- Update future skill creation/update workflows so new skills must add a benchmark setup or record an explicit blocked coverage status.
- Keep generic smoke fallback active until each skill has custom coverage.
- Defer Claude parity until the Codex-first pattern is proven.

## Acceptance Criteria

- [x] A committed coverage matrix lists every repository skill.
- [x] Validation fails when a repository skill is missing from the coverage matrix.
- [x] Validation fails when a `custom` coverage row points to a missing setup.
- [x] Validation fails when a `blocked` row lacks a reason and next command.
- [ ] `$benchmark-test-skill <skill>` reports custom/generic/blocked coverage status.
- [ ] Future skill creation/update workflows require benchmark coverage handling.
- [ ] Tier 1 skills have custom Codex benchmark setups.
- [ ] Tier 2 and Tier 3 skills have custom Codex benchmark setups or explicit blocked statuses.
- [ ] Pack skills are covered by custom Codex benchmark setups or explicit blocked statuses.
- [ ] Generic fallback remains available until all skills have custom coverage.
- [ ] No GitHub Actions are created, modified, or recommended.

> Test strategy: tests-after with focused layer1 validation plus one-run Codex benchmarks for representative setups in each tier.

### Execution Profile
**Parallel mode:** review-only
**Integration owner:** main agent
**Conflict risk:** high
**Review gates:** correctness, tests, docs/API conformance, budget safety, no-GitHub-Actions constraint

**Subagent lanes:**
- Lane: coverage-contract-review
  - Agent: explorer
  - Role: reviewer
  - Mode: review
  - Scope: Review the planned coverage matrix, harness reporting contract, and future skill-creation contract for missing acceptance-criteria coverage after the main implementation lands.
  - Depends on: Step 35.6
  - Deliverable: Review report with blocker/advisory findings and any missing validation commands.

## Implementation

- [x] Step 35.1: Add the committed benchmark coverage matrix and validation CLI.
  - Classification: automated
  - Files: create `tests/harness/bench-coverage.ts`, create `tests/fixtures/bench-coverage/README.md` if fixture notes are needed, modify `tests/package.json`, modify `tests/layer1/bench-setups.test.ts`
  - Define one machine-readable row per repository skill name with `skill`, `source_paths`, `coverage_status`, `setup_path`, `priority_tier`, `agent_scope`, `fixture_type`, `blocked_reason`, `next_command`, and `last_verified`.
  - Add validation that fails when a repository skill is missing from the matrix, a `custom` row points to a missing setup, a `blocked` row lacks `blocked_reason`, or a `blocked` row lacks `next_command`.
  - Keep existing repository skill discovery as the source of truth for completeness checks.
- [x] Step 35.2: Wire coverage status into benchmark setup resolution and CLI reporting.
  - Classification: automated
  - Files: modify `tests/harness/bench-setups.ts`, modify `tests/harness/bench-types.ts`, modify `tests/bench.ts`, modify `tests/layer1/bench-setups.test.ts`
  - Preserve generic fallback for repository skills without custom setups.
  - Make `pnpm bench --list-skills` show enough status information to distinguish `custom`, `generic`, and `blocked` coverage.
  - Make `pnpm bench --skill <skill>` print the resolved coverage status before agent execution and stop clearly for blocked coverage rows.
- [ ] Step 35.3: Add reusable custom setup helpers and fixture conventions.
  - Classification: automated
  - Files: create `tests/layer4/setup-helpers/artifacts.ts`, create `tests/layer4/setup-helpers/markdown.ts`, create `tests/layer4/setup-helpers/routing.ts`, create `tests/layer4/setup-helpers/budgets.ts`, create `tests/layer4/setup-helpers/reports.ts`, modify existing `tests/layer4/setups/design-system.setup.ts`, modify existing `tests/layer4/setups/design-system-draftstonk.setup.ts`, modify `tests/layer1/bench-setups.test.ts`
  - Provide helpers for file existence/content assertions, Markdown heading/frontmatter assertions, next-command/routing assertions, budget tiers, timeout tiers, and benchmark report expectations.
  - Refactor existing custom setups only enough to prove the helpers are usable without changing their benchmark behavior.
  - Implementation plan for next run:
    1. Read the two existing custom setup files and `tests/harness/types.ts` to match helper return shapes.
    2. Add focused helper modules under `tests/layer4/setup-helpers/` for artifact/file assertions, Markdown assertions, routing/next-command assertions, budget/timeout constants, and report-shape expectations.
    3. Refactor `design-system.setup.ts` and `design-system-draftstonk.setup.ts` to consume the helpers without changing prompts, budgets, fixtures, or expected outputs except where helper names improve assertion descriptions.
    4. Extend layer1 setup tests to cover representative helper behavior and confirm the two existing custom setups still resolve as `custom`.
    5. Validate with targeted layer1 tests, `pnpm --dir tests bench:coverage`, full layer1, and `git diff --check`.
- [ ] Step 35.4: Add Tier 1 Codex custom benchmark setups.
  - Classification: automated
  - Files: create or modify setup files under `tests/layer4/setups/` for `run`, `ship`, `ship-end`, `roadmap`, `plan-phase`, `feature-interview`, `spec-interview`, `investigate`, `session-triage`, `targeted-skill-builder`, and `benchmark-test-skill`; modify `tests/harness/bench-setups.ts`; modify `tests/harness/bench-coverage.ts`; modify `tests/layer1/bench-setups.test.ts`
  - Use deterministic temp-project fixtures and assert the observable artifact, routing, or report shape for each skill without requiring real remote pushes, external accounts, or user approval.
  - Set Tier 1 rows to `custom` with `agent_scope: codex` when setup files exist.
- [ ] Step 35.5: Add Tier 2 and Tier 3 custom setups or explicit blocked statuses.
  - Classification: automated
  - Files: create or modify setup files under `tests/layer4/setups/` for Tier 2 and Tier 3 skills where deterministic local coverage is practical; modify `tests/harness/bench-setups.ts`; modify `tests/harness/bench-coverage.ts`; modify `tests/layer1/bench-setups.test.ts`
  - Mark any unsafe or externally blocked setup as `blocked` with a concrete `blocked_reason` and `next_command`.
  - Keep generic fallback available only for rows that are not yet custom and not blocked.
- [ ] Step 35.6: Add pack skill coverage rows and pack-level setup coverage.
  - Classification: automated
  - Files: create or modify setup files under `tests/layer4/setups/packs/`; modify `tests/harness/bench-setups.ts`; modify `tests/harness/bench-coverage.ts`; modify `tests/layer1/bench-setups.test.ts`
  - Cover pack skills with custom Codex setups when deterministic local fixtures exist.
  - Record explicit blocked statuses for pack skills that depend on external credentials, real browser/device state, paid services, or unsafe access patterns.
- [ ] Step 35.7: Update skill creation and update workflows to require benchmark coverage handling.
  - Classification: automated
  - Files: modify `global/codex/create-agentic-skill/SKILL.md`, `global/claude/create-agentic-skill/SKILL.md`, `global/codex/create-local-skill/SKILL.md`, `global/claude/create-local-skill/SKILL.md`, `global/codex/targeted-skill-builder/SKILL.md`, `global/claude/targeted-skill-builder/SKILL.md`, `global/codex/plugin-creator/SKILL.md`, `global/claude/plugin-creator/SKILL.md`, `packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md`, `packs/agentic-skills-bench/claude/benchmark-test-skill/SKILL.md`, `docs/skills-reference.md`
  - Require new or materially updated skills to add a coverage matrix row and either a custom setup or explicit blocked status.
  - Make benchmark-test-skill reports route missing custom coverage to `$targeted-skill-builder <skill> benchmark coverage`.
- [ ] Step 35.8: Run validation and review the phase.
  - Classification: automated
  - Files: modify `tasks/todo.md`, modify `tasks/history.md`
  - Run focused layer1 tests for benchmark coverage, setup registry, report handling, and runner behavior.
  - Run coverage validation, `pnpm bench --list-skills`, and representative one-run Codex benchmarks for `run`, `plan-phase`, `benchmark-test-skill`, and one pack skill that has custom coverage.
  - Run standard skill validation scripts and `git diff --check`.
  - Use the review-only lane findings to fix concrete blockers before final validation.

## Green

- [ ] Step 35.9: Write regression tests and final validation evidence for the coverage contract.
  - Classification: automated
  - Files: modify `tests/layer1/bench-setups.test.ts`, add or modify `tests/layer1/bench-coverage.test.ts`, modify `tasks/todo.md`
  - Cover missing matrix row, missing custom setup path, blocked row without reason, blocked row without next command, custom/generic/blocked reporting, and generic fallback retention.
  - Run all phase validation commands and record exact results in the review section.

## Milestone: Phase 35 Repository-Wide Custom Benchmark Coverage

**Acceptance Criteria:**
- [ ] A committed coverage matrix lists every repository skill.
- [ ] Validation fails when a repository skill is missing from the coverage matrix.
- [ ] Validation fails when a `custom` coverage row points to a missing setup.
- [ ] Validation fails when a `blocked` row lacks a reason and next command.
- [ ] `$benchmark-test-skill <skill>` reports custom/generic/blocked coverage status.
- [ ] Future skill creation/update workflows require benchmark coverage handling.
- [ ] Tier 1 skills have custom Codex benchmark setups.
- [ ] Tier 2 and Tier 3 skills have custom Codex benchmark setups or explicit blocked statuses.
- [ ] Pack skills are covered by custom Codex benchmark setups or explicit blocked statuses.
- [ ] Generic fallback remains available until all skills have custom coverage.
- [ ] No GitHub Actions are created, modified, or recommended.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

## Review

### Step 35.1 Review — Benchmark Coverage Matrix and Validation CLI

- Completed `tests/harness/bench-coverage.ts` with a committed 143-skill coverage matrix, repository skill discovery, per-skill source path projection, and validation for missing rows, missing custom setup paths, and incomplete blocked rows.
- Added `pnpm --dir tests bench:coverage` as the coverage validation CLI.
- Extended layer1 benchmark setup tests to cover the happy path and the required validation failure modes.
- Kept current non-custom skills as `generic` so the existing smoke fallback remains available until later steps migrate rows to `custom` or `blocked`.

**Validation:**
- `pnpm --dir tests bench:coverage` — passed, `Benchmark coverage matrix valid (143 skills).`
- `pnpm --dir tests exec vitest run --project layer1 layer1/bench-setups.test.ts` — passed, 9 tests.
- `pnpm --dir tests test:layer1` — passed, 8 files / 1197 tests.
- `pnpm --dir tests verify --skill design-system --layers 1` — passed, layer1 PASS in 7.1s.
- `git diff --check` — passed.

**Quality Gate Manifest:**
- User goal: execute Step 35.1 for repository-wide custom benchmark coverage.
- Changed files: `tests/harness/bench-coverage.ts`, `tests/layer1/bench-setups.test.ts`, `tests/package.json`, `tasks/todo.md`, `tasks/history.md`.
- Per-file purpose: add the coverage matrix/validator CLI, test the contract, expose the command, and record task/history evidence.
- User-goal mapping: the matrix lists repository skills; validator and tests enforce missing-row, missing-custom-setup, and blocked-row contract failures.
- Tests run: listed above.
- Skipped tests: layer2/layer3/layer4 benchmark execution not run because Step 35.1 only adds the coverage contract and does not alter agent execution or benchmark running behavior.
- Adversarial review: changed-file self-review plus targeted checks for non-repository custom targets, matrix completeness, validation failure modes, and no GitHub Actions changes; removed the dead `design-system-draftstonk` matrix override because it is a benchmark target but not a repository skill.
- Residual risk: the matrix currently stores committed skill names while source paths are projected from live discovery; future steps that need serialized source paths in reports should consume `benchmarkCoverageMatrix()` rather than the raw name list.
- Rollback note: revert the Step 35.1 commit to remove the new validator, package script, and tests.
- Next command: `$run`

### Step 35.2 Review — Coverage-Aware Benchmark Reporting

- Added coverage-aware benchmark target resolution while preserving `resolveBenchSetup()` for existing harness callers.
- Updated `pnpm bench --list-skills` to print `coverage=custom`, `coverage=generic`, or `coverage=blocked`, including setup paths for custom rows and reason/next-command details for blocked rows.
- Updated `pnpm bench --skill <skill>` to print the resolved coverage status before execution and to stop clearly before agent work for blocked coverage rows.
- Added layer1 coverage for custom metadata, generic fallback metadata, blocked target resolution, coverage-row listing, and CLI list output.
- Execution profile note: the phase requested a review-only subagent lane, but active Codex instructions only permit subagents when explicitly requested by the user. I downgraded the gate to local adversarial review plus targeted validation.

**Validation:**
- `pnpm --dir tests exec vitest run --project layer1 layer1/bench-setups.test.ts` — passed, 12 tests.
- `pnpm --dir tests bench:coverage` — passed, `Benchmark coverage matrix valid (143 skills).`
- `pnpm --dir tests bench --list-skills` — passed and printed coverage statuses for all 143 skills.
- `pnpm --dir tests test:layer1` — passed, 8 files / 1200 tests.
- `pnpm --dir tests bench --skill run --agent codex --runs 0 --chunk-size 1 --pause 0` — passed and printed `Benchmark coverage for run: generic` before any agent iterations.
- `git diff --check` — passed.

**Quality Gate Manifest:**
- User goal: execute Step 35.2 for repository-wide custom benchmark coverage.
- Changed files: `tests/harness/bench-types.ts`, `tests/harness/bench-setups.ts`, `tests/bench.ts`, `tests/layer1/bench-setups.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- Per-file purpose: add resolved coverage metadata types, wire matrix rows into setup resolution, expose CLI status/blocked handling, test the reporting contract, and record task/history evidence.
- User-goal mapping: benchmark setup resolution and CLI output now distinguish custom/generic/blocked coverage while preserving generic fallback for runnable repository skills.
- Tests run: listed above.
- Skipped tests: live one-run agent benchmarks were not run because Step 35.2 changes preflight/reporting behavior; the zero-run CLI smoke proves status output without spending agent budget, and later setup steps own representative live benchmark runs.
- Adversarial review: changed-file self-review checked status formatting, blocked rows stopping before agent execution, generic fallback retention, unknown-skill behavior, and no GitHub Actions changes. The review-only subagent lane was not used because this session lacks explicit user authorization for subagents.
- Residual risk: custom rows whose setup file exists but is not registered in `CUSTOM_BENCH_SETUPS` would still need later registry validation; current custom rows are registered and covered by tests.
- Rollback note: revert the Step 35.2 commit to restore plain skill listing and setup-only resolution.
- Next command: `$run`

**On Completion** (fill in when phase is done):
- Deviations from plan: TBD
- Tech debt / follow-ups: TBD
- Ready for next phase: TBD

**Next work:** Step 35.2: Wire coverage status into benchmark setup resolution and CLI reporting.
**Recommended next command:** `$run`
