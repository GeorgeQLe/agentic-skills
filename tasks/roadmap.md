# Roadmap: Claude Skills

> Generated from: tasks/roadmap.md (existing), specs/board-flag-kanban-search.md, tasks/ideas.md, tasks/history.md
> Date: 2026-03-27 (last updated 2026-05-17)
> Total Phases: 40 (39 complete, 1 planned)

## Summary

Phases 1-11 complete: kanban skill suite, board intelligence, templates, archive automation, expert review fixes, test hardening (83 tests), kanban DX, skill infrastructure, the shared Poketo headless API migration for both Claude and Codex, and the three-mode operating model (`claude-only` / `codex-only` / `hybrid`) with shared approval-packet contract and next-step routing.

Phases 12-31 complete. Phase 14 added the LinkedIn evidence lane to the creator foundation workflow with owner exports, manual snapshots, public unauthenticated captures, redaction gates, shared evidence-schema/dossier routing, and deterministic layer1 contract coverage. Phase 16 hardened mutation-capable skill contracts with final next-step routing language and an audit that catches future omissions. Phase 17 added mixed-monorepo pack routing so one repository can carry devtool, business-app, game, or other domain scopes without forcing one global designation. Phase 18 hardened pack lock recovery after a `pitwall-monorepo` refresh timeout. Phase 19 added a YouTube description and metadata optimization lane to the creator-media pack. Phase 20 added external YouTube video research lanes for comprehension, format/Remotion-style analysis, and competitive learning. Phase 21 hardened default mutation/shipping quality gates from the session workflow audit. Phase 22 added feature-interview as the triage step between brainstorm ideas and full specifications. Phase 23 added targeted-skill-builder for focused skill creation or updates from concrete workflow gaps without defaulting to broad session-history analysis. Phase 24 added install-agentic-skills for refreshing global skill links and routing pack access through the existing project-local workflow. Phase 25 added codebase-status for read-only repo status reports with local history evidence. Phase 26 added the monorepo pack V1. Phase 27 added targeted skill retrospectives to analyze-sessions; Phase 28 split that focused behavior into session-triage. Phase 29 added opt-in live-agent behavior tests. Phase 30 deepened feature-interview into evidence-backed feature intake. Phase 31 hardened parallel agent-team branch/PR isolation.

Phases 32-36 complete. Phase 35 added repository-wide Codex benchmark coverage metadata, custom or explicitly blocked coverage for every current skill, and future skill creation/update workflows require benchmark coverage handling. Phase 36 added rubric-based output-quality evaluation on top of the contract/assertion benchmark checks.

Phase 37 complete: preserved and migrated the static Skills Showcase into a minimal Next.js app at `apps/skills-showcase/` with 6 public routes, generated data pipeline, 54 regression tests, and updated deploy contract. Phase 38 complete: added Neon-backed first-party newsletter capture with tRPC contracts, TanStack Query mutation/admin state, admin export page, 74 regression tests, and privacy posture enforcement. Phase 39 complete: added benchmark results visibility and permission-gated safe Git integration fixtures for benchmarkable git-mutating skills. Phase 40 adds the `/workflows` hybrid replay pilot so benchmark evidence becomes primary step-by-step proof before the pattern is expanded to other showcase surfaces.

Current brand decision: the public site brand is **G Skillpacks** and the production domain is `gskillpacks.com`. Future site work should keep public UI, metadata, docs, and information architecture aligned around skill packs language while reserving `agentic-skills` for the underlying open-source library/repository.

## Current Benchmark: roadmap Fresh Rerun 2026-05-17

**Goal:** Rerun `$benchmark-test-skill roadmap` after the benchmark-results matrix assertion fix and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `roadmap` is known and reports its coverage status.
- [x] `pnpm verify --skill roadmap` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill roadmap --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-roadmap-2026-05-17.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark failure on 2026-05-17. `roadmap` is known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`, and verify passed with layer1 PASS in 3.6s plus layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark ran. Claude session `roadmap-claude-ceadee35` was fully infrastructure-blocked by `agent runner budget exceeded` (3 blocked runs, 0 evaluated, $0.75). Codex session `roadmap-codex-43f41fa9` completed three evaluated runs with 0/3 hard assertion pass rate, 78.6% output quality, p50 latency 44.3s, and $0.75 total estimated cost; every run failed `Output recommends $run`. Report: `benchmark/test-roadmap-2026-05-17.md`. Recommended next skill: `$session-triage roadmap benchmark failure`.

## Current Agent Review: ship Fresh Benchmark 2026-05-16

**Goal:** Review the latest persisted `ship` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from the fresh `ship` benchmark report.
- [x] Retained generated `ship-manifest.md` artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-ship-2026-05-16.md` records scores, findings, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed and validated because curated review evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-16. Reviewed latest `ship` Claude session `920245e6` and Codex session `898663d6`, covering six retained `ship-manifest.md` artifacts and excluding no infrastructure-blocked runs. Deterministic context was clean: both agents passed 3/3 hard assertions with 100.0% output-quality scores. Subjective verdict was excellent overall with median score 91.5 and range 90-96. No material remediation remains; generated Skills Showcase data was refreshed and validated. Report: `benchmark/review-ship-2026-05-16.md`. Recommended next command: `$ship`.

## Current Benchmark: roadmap 2026-05-17

**Goal:** Run `$benchmark-test-skill roadmap` against the current repository harness and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `roadmap` is known and reports its coverage status.
- [x] `pnpm verify --skill roadmap` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill roadmap --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-roadmap-2026-05-17.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Verification-blocked on 2026-05-17. `roadmap` is known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`, but `pnpm verify --skill roadmap` failed at layer1 in 3.9s. The failure is `layer1/benchmark-results-matrix.test.ts` expecting the stale `ship-codex-a2685d9f` raw report row while the current generated matrix points at `ship-codex-898663d6`. The benchmark step was not run. Report: `benchmark/test-roadmap-2026-05-17.md`. Recommended next skill: `$session-triage roadmap benchmark failure`.

## Current Triage: roadmap Benchmark Failure 2026-05-17

**Goal:** Verify why `$benchmark-test-skill roadmap` failed and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Failed benchmark report and verify output are inspected.
- [x] Failing layer1 test, generated matrix, and matrix generator are compared.
- [x] Failure is classified as a `roadmap` skill defect, benchmark harness defect, generated-data defect, or agent noncompliance.
- [x] `benchmark/triage-roadmap-2026-05-17.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-17. The verify failure is real, but the responsible gap is the benchmark harness regression test, not the `roadmap` skill. `tests/layer1/benchmark-results-matrix.test.ts` hard-codes the older `ship-codex-a2685d9f` latest-run path while the generated matrix correctly points at the fresher reviewed `ship-codex-898663d6` run. Report: `benchmark/triage-roadmap-2026-05-17.md`. Recommended next skill: `$targeted-skill-builder benchmark-results-matrix stale latest-run assertion`.

## Current Targeted Update: Benchmark Results Matrix Latest-Run Assertion 2026-05-17

**Goal:** Fix the benchmark-results matrix layer1 test so fresh benchmark runs do not stale the assertion for generated latest-run report paths.

**Acceptance Criteria:**
- [x] Relevant lessons and `roadmap` benchmark triage evidence are reviewed.
- [x] The change is scoped to existing harness test coverage, not a new skill or `roadmap` contract update.
- [x] `tests/layer1/benchmark-results-matrix.test.ts` matches the durable `ship` Codex row shape without pinning a superseded session id.
- [x] Focused layer1 validation and `roadmap` verify pass.
- [x] Generated-data validation and whitespace checks pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-17. Updated `tests/layer1/benchmark-results-matrix.test.ts` so the `ship` Codex row assertion accepts any `ship-codex-*` latest report while preserving the durable metrics, subjective review path, and graded status. Refreshed generated Skills Showcase data after the recent benchmark evidence changes. Validation passed with focused layer1, `roadmap` verify, install/skill audits, benchmark coverage, generated-data validation, and whitespace checks. Recommended next skill: `$benchmark-test-skill roadmap`.

## Current Benchmark: ship Fresh Run 2026-05-16

**Goal:** Run `$benchmark-test-skill ship` against the current repository harness and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `ship` is known and reports its coverage status.
- [x] `pnpm verify --skill ship` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill ship --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-ship-2026-05-16.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated if curated benchmark evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-16. `ship` remained known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 PASS in 4.4s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs: Claude session `920245e6` passed 3/3 hard assertions with 100.0% output quality, and Codex session `898663d6` passed 3/3 hard assertions with 100.0% output quality. Report validation passed, and generated Skills Showcase data was refreshed and validated. Report: `benchmark/test-ship-2026-05-16.md`. Recommended next skill: `$benchmark-agent-review ship`.

## Current Targeted Update: ship Benchmark Goal Field Extraction 2026-05-16

**Goal:** Fix the `ship` benchmark quality rubric so `ship-goal-specificity` accepts valid field-style ship manifest `User goal` entries while still rejecting meta manifest-writing goals.

**Acceptance Criteria:**
- [x] Use the fresh triage report and relevant lessons as scoped evidence.
- [x] Confirm this is an existing benchmark-rubric update, not a mirrored `ship` skill contract change or new skill.
- [x] Broaden `shipGoalSpecificityCriterion` to extract heading-style and field-style `User goal` content.
- [x] Add focused layer1 regression coverage for the failing Claude bullet manifest shape and the existing meta-goal rejection.
- [x] Run required validation, record results, then commit and push intended changes on `master`.

**Result:** Completed on 2026-05-16. Updated the existing `ship` benchmark setup rather than mirrored skill contracts. `ship-goal-specificity` now extracts both heading-style and field-style `User goal` content, and focused layer1 coverage accepts the failing Claude bullet manifest shape while preserving the meta manifest-goal rejection. Verification also exposed a stale benchmark matrix assertion and an over-broad `production deploy` false positive for skipped deploy wording; both were fixed with focused coverage. Validation passed with focused layer1, install, skill audits, benchmark coverage, `ship` verify, Claude smoke `ship-claude-5517074a` with 1/1 hard assertions and 100.0% quality, targeted `rg`, and `git diff --check`. Recommended next command: `$benchmark-test-skill ship`.

## Current Triage: ship Benchmark Failure 2026-05-16

**Goal:** Verify the fresh `ship` benchmark quality failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted Claude run evidence are inspected.
- [x] Mirrored `ship` skill contracts are compared against benchmark setup and quality expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, runner infrastructure issue, or agent noncompliance.
- [x] `benchmark/triage-ship-2026-05-16.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-16. The fresh `ship` quality failure is verified, but the responsible gap is the benchmark harness rather than mirrored `ship` contracts. Claude run `ship-claude-d6121a8f` run 2 emitted a valid bullet-style `User goal` manifest field, while `ship-goal-specificity` only extracts heading-style sections and therefore reported `missing User goal section text`. Report: `benchmark/triage-ship-2026-05-16.md`. Recommended next skill: `$targeted-skill-builder ship benchmark goal field extraction`.

## Current Benchmark: ship Post-Rubric Fix 2026-05-16

**Goal:** Run `$benchmark-test-skill ship` against the current repository harness after the benchmark rubric fixes and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `ship` is known and reports its coverage status.
- [x] `pnpm verify --skill ship` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill ship --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-ship-2026-05-16.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated if curated benchmark evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-16. `ship` remained known with custom benchmark coverage via `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 PASS in 3.8s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs: Claude session `d6121a8f` passed 3/3 hard assertions with 94.7% output quality and 1 critical `ship-goal-specificity` failure; Codex session `a2685d9f` passed 3/3 hard assertions with 100.0% output quality. Report validation passed, and generated Skills Showcase data was refreshed. Report: `benchmark/test-ship-2026-05-16.md`. Recommended next skill: `$session-triage ship benchmark failure`.

## Current UI Pass: Workflows Mobile Playful Lab Responsiveness 2026-05-15

**Goal:** Make the `/workflows` Playful Lab interface work cleanly on mobile while preserving the newer lab-themed surface that will replace the older workflow presentation.

**Acceptance Criteria:**
- [x] Validate whether `/workflows` still renders a legacy workflow block above the Playful Lab demo.
- [x] Keep the fix scoped to the workflows route and Playful Lab/TUI styling unless evidence shows shared CSS is the root cause.
- [x] Mobile widths avoid horizontal page overflow from chips, commands, benchmark/demo pre blocks, controls, or notebook panels.
- [x] The lab layout stacks predictably below tablet widths and remains usable at phone widths.
- [x] Focused tests/build checks pass, and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-15. `/workflows` already renders only the `TuiWorkflow` Playful Lab component; the legacy DOM-driven workflow selector remains only for the home-page preview support path. The mobile pass tightened the Playful Lab/TUI styles for constrained widths, horizontal chip navigation, stacked controls, long commands, benchmark/demo blocks, and notebook width containment. Focused Vitest smoke/workflow coverage, typecheck, production build, `git diff --check`, and Safari mobile-width visual verification passed.

## Current Agent Review: analyze-sessions Quality-Rubric Matching Benchmark 2026-05-15

**Goal:** Review the latest persisted `analyze-sessions` Claude and Codex benchmark outputs for subjective operator quality after the quality-rubric matching rerun.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `benchmark/test-analyze-sessions-2026-05-15.md`.
- [x] Retained generated `session-analysis.md` artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-analyze-sessions-2026-05-15.md` records scores, findings, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed and validated because curated review evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. Reviewed fresh evaluated runs `analyze-sessions-claude-fa3b696a` and `analyze-sessions-codex-e68803b1`, covering all 6 retained `session-analysis.md` artifacts and excluding no infrastructure-blocked runs. Deterministic context was clean: both agents passed 3/3 hard assertions with 92.3% quality. Subjective verdict was excellent overall with median score 91.5 and range 90-94. No material generated-output remediation remains; exact runner-native final routes are now clean. Skills Showcase data was regenerated. Report: `benchmark/review-analyze-sessions-2026-05-15.md`. Recommended next command: `$ship`.

## Current Benchmark: analyze-sessions Quality-Rubric Matching Rerun 2026-05-15

**Goal:** Run `$benchmark-test-skill analyze-sessions` against the current repository harness after the quality-rubric matching fix and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `analyze-sessions` is known and reports its coverage status.
- [x] `pnpm verify --skill analyze-sessions` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill analyze-sessions --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-analyze-sessions-2026-05-15.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated if curated benchmark evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. `analyze-sessions` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 PASS in 4.4s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs: Claude session `fa3b696a` passed 3/3 hard assertions with 92.3% output quality, and Codex session `e68803b1` passed 3/3 hard assertions with 92.3% output quality. Report validation passed, and generated Skills Showcase data was refreshed. Report: `benchmark/test-analyze-sessions-2026-05-15.md`. Recommended next skill: `$benchmark-agent-review analyze-sessions`.

## Current Targeted Update: analyze-sessions Benchmark Final-Route Exactness

**Goal:** Tighten the `analyze-sessions` benchmark setup so runner-native final commands are unambiguous and exact, preventing suffixes like `for Codex` from passing.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark harness coverage, not mirrored `analyze-sessions` skill contracts.
- [x] The benchmark prompt tells runners the literal command must not include runner-label suffixes.
- [x] Hard assertions fail suffixed final commands such as `$targeted-skill-builder run post-doc-edit validation and lessons capture gate for Codex`.
- [x] The deterministic quality route criterion fails the same suffixed final command.
- [x] Required validation passes and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-15. Updated the benchmark harness rather than mirrored `analyze-sessions` skill contracts. Added exact final next-route matching in routing and quality helpers, opted the `analyze-sessions` setup into exact matching, and reworded its prompt so runner labels are explanatory instead of part of the literal command. Focused layer1 proves suffixed Codex commands fail both hard assertions and the quality route criterion. Validation passed with focused layer1, install, skill audits, benchmark coverage, `analyze-sessions` verify, and Codex smoke `analyze-sessions-codex-a042d8d1` with the exact final command assertion passing. Recommended next command: `$benchmark-test-skill analyze-sessions`.

## Current Agent Review: analyze-sessions Fresh Benchmark 2026-05-15

**Goal:** Review the latest persisted `analyze-sessions` Claude and Codex benchmark outputs for subjective operator quality after the fresh deterministic rerun.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `benchmark/test-analyze-sessions-2026-05-15.md`.
- [x] Retained generated `session-analysis.md` artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-analyze-sessions-2026-05-15.md` records scores, findings, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed and validated because curated review evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. Reviewed fresh evaluated runs `analyze-sessions-claude-b5357730` and `analyze-sessions-codex-8f7e860a`, covering all 6 retained `session-analysis.md` artifacts and excluding no infrastructure-blocked runs. Deterministic context was clean: both agents passed 3/3 hard assertions with 92.3% quality. Subjective verdict was good to excellent overall with median score 90.0 and range 88-94. The remaining weakness is final-route exactness: all three Codex artifacts append `for Codex` to the intended command. Skills Showcase data was regenerated and validated. Report: `benchmark/review-analyze-sessions-2026-05-15.md`. Recommended next command: `$targeted-skill-builder analyze-sessions benchmark final-route exactness`.

## Current Benchmark: analyze-sessions Fresh Rerun 2026-05-15

**Goal:** Run `$benchmark-test-skill analyze-sessions` against the current repository harness and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `analyze-sessions` is known and reports its coverage status.
- [x] `pnpm verify --skill analyze-sessions` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill analyze-sessions --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-analyze-sessions-2026-05-15.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated if curated benchmark evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. `analyze-sessions` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 PASS in 4.0s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs: Claude session `b5357730` passed 3/3 hard assertions with 92.3% output quality, and Codex session `8f7e860a` passed 3/3 hard assertions with 92.3% output quality. Report validation passed, and generated Skills Showcase data was refreshed and validated. Report: `benchmark/test-analyze-sessions-2026-05-15.md`. Recommended next skill: `$benchmark-agent-review analyze-sessions`.

## Current Targeted Update: analyze-sessions Remediation-Ready Handoff

**Goal:** Tighten `analyze-sessions` so broad verified workflow gaps route to a remediation-ready `targeted-skill-builder` handoff instead of a generic or dual-mode route.

**Acceptance Criteria:**
- [x] The fix is scoped to mirrored `analyze-sessions` contracts and benchmark coverage, not a new meta-skill.
- [x] Broad verified workflow gaps require one runner-native final `targeted-skill-builder` command with a concrete gap phrase.
- [x] Reports distinguish explicit source evidence from inferred source labels and avoid unsupported runner ownership.
- [x] The handoff names likely owner surface and validation expectation when recommending a skill update.
- [x] Layer1 regression coverage protects the contract and benchmark rubric behavior.
- [x] Required validation passes and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-15. Updated mirrored `analyze-sessions` contracts to version 1.4.0 with remediation-ready targeted-skill-builder handoff guidance: one runner-native final command, concrete gap phrase, likely owner surface, validation expectation, no dual final route, and explicit-vs-inferred attribution. Updated the `analyze-sessions` benchmark fixture and quality rubric to require runner-specific `run post-doc-edit validation and lessons capture gate` routes plus owner/validation/attribution evidence. Added layer1 coverage for contract language, generic-route rejection, and the new quality criterion. Validation passed with install, skill audits, benchmark coverage, focused layer1, `analyze-sessions` verify, both-agent one-run smoke (`analyze-sessions-claude-b957fee9`, `analyze-sessions-codex-59d4510e`, both 1/1 hard assertions and 92.3% quality), showcase generation/validation, targeted `rg`, and `git diff --check`. Recommended next command: `$benchmark-test-skill analyze-sessions`.

## Current Agent Review: analyze-sessions Benchmark 2026-05-15

**Goal:** Review the latest persisted `analyze-sessions` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/analyze-sessions-*`.
- [x] Retained generated `session-analysis.md` artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-analyze-sessions-2026-05-15.md` records scores, findings, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed and validated because curated review evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. Reviewed `analyze-sessions-claude-bc867ac4` and `analyze-sessions-codex-f4218901`, covering 6 retained `session-analysis.md` artifacts and excluding no infrastructure-blocked runs. Deterministic context was clean: Claude passed 3/3 hard assertions with 89.4% quality, and Codex passed 3/3 hard assertions with 90.9% quality. Subjective verdict was good overall with median score 87.5 and range 84-91. The artifacts identify the recurring validation and lessons-capture misses, but several final handoffs are too broad or dual-mode instead of giving one remediation-ready targeted-skill-builder command. Skills Showcase data was regenerated and validated. Report: `benchmark/review-analyze-sessions-2026-05-15.md`. Recommended next command: `$targeted-skill-builder analyze-sessions remediation-ready targeted-skill-builder handoff`.

## Current Benchmark: analyze-sessions Post-Fixture Routing 2026-05-15

**Goal:** Rerun `$benchmark-test-skill analyze-sessions` after the benchmark fixture-routing fix and publish fresh deterministic both-agent evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `analyze-sessions` is known and reports its coverage status.
- [x] `pnpm verify --skill analyze-sessions` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill analyze-sessions --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-analyze-sessions-2026-05-15.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated if curated benchmark evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. `analyze-sessions` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 PASS in 4.0s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs: Claude session `bc867ac4` passed 3/3 hard assertions with 89.4% output quality, and Codex session `f4218901` passed 3/3 hard assertions with 90.9% output quality. Report validation passed, and generated Skills Showcase data was refreshed and validated. Report: `benchmark/test-analyze-sessions-2026-05-15.md`. Recommended next skill: `$benchmark-agent-review analyze-sessions`.

## Current Targeted Update: analyze-sessions Benchmark Fixture Routing

**Goal:** Fix `analyze-sessions` benchmark coverage so fixture scope, route labels, and runner-specific next routes match the mirrored skill contracts.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark harness coverage and route parsing, not mirrored `analyze-sessions` skill contracts.
- [x] Bold Markdown next-route labels accepted by the default shipping contract pass route detection.
- [x] The `analyze-sessions` fixture provides broad repeated-history evidence when expecting `targeted-skill-builder`.
- [x] Claude and Codex expected routes use their native conventions: `/targeted-skill-builder` and `$targeted-skill-builder`.
- [x] Layer1 regression coverage protects the route parser and `analyze-sessions` fixture behavior.
- [x] Required validation passes and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-15. Updated the benchmark harness rather than mirrored `analyze-sessions` contracts. Route detection now accepts bold Markdown next-route labels, and the `analyze-sessions` fixture now uses repeated dated session logs with runner-specific `/targeted-skill-builder` and `$targeted-skill-builder` expectations plus a standard benchmark budget. Added focused layer1 coverage. Validation passed with focused layer1, benchmark coverage, `analyze-sessions` verify, both-agent one-run smoke (`analyze-sessions-claude-59469ff4`, `analyze-sessions-codex-73090527`, both 1/1 hard assertions and no blocked runs), targeted `rg`, and whitespace checks. Recommended next command: `$benchmark-test-skill analyze-sessions`.

## Current Triage: analyze-sessions Benchmark Failure 2026-05-15

**Goal:** Verify the fresh `analyze-sessions` deterministic benchmark failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `analyze-sessions` contracts are compared against benchmark setup and quality expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, runner infrastructure issue, or agent noncompliance.
- [x] `benchmark/triage-analyze-sessions-2026-05-15.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. The fresh benchmark failure is verified, but the responsible gap is benchmark harness coverage rather than mirrored `analyze-sessions` contracts. The fixture is a single concrete incident note while the setup hard-requires `$targeted-skill-builder`; the skill contracts say concrete incidents should route to `session-triage`, and broad verified workflow gaps can route to `targeted-skill-builder`. The setup also needs runner-specific routes and route-helper support for bold next-route labels permitted by the shipping contract. Codex run #1 was a no-artifact agent/runner no-op, but adjacent Codex runs passed. Report: `benchmark/triage-analyze-sessions-2026-05-15.md`. Recommended next skill: `$targeted-skill-builder analyze-sessions benchmark fixture routing`.

## Current Benchmark: analyze-sessions 2026-05-15

**Goal:** Run `$benchmark-test-skill analyze-sessions` with current repository harness eligibility, verify, and both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `analyze-sessions` is known and reports its coverage status.
- [x] `pnpm verify --skill analyze-sessions` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill analyze-sessions --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-analyze-sessions-2026-05-15.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated if curated benchmark evidence changes.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-15. `analyze-sessions` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 PASS in 3.8s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs, but deterministic benchmark results failed: Claude session `6b8dbd1e` passed 0/3 hard assertion runs with 71.2% quality, and Codex session `afaf2f22` passed 2/3 hard assertion runs with 80.3% quality. Report validation passed, and generated Skills Showcase data was refreshed and validated. Report: `benchmark/test-analyze-sessions-2026-05-15.md`. Recommended next skill: `$session-triage analyze-sessions benchmark failure`.

## Current Targeted Update: Codex Interview Question Cadence

**Goal:** Update Codex interview-style skills so they ask one primary question per turn by default, while preserving Claude's grouped AskUserQuestion cadence for Claude skills.

**Acceptance Criteria:**
- [x] Full available Claude/Codex prompt history and rich Codex sessions are scanned for interview-question cadence evidence.
- [x] Codex skills with explicit grouped-question or Claude-only AskUserQuestion language are updated to one-primary-question-per-turn guidance.
- [x] Plan-mode `request_user_input` guidance remains allowed only for one material decision with 2-3 concrete options, not for batching unrelated questions.
- [x] Regression coverage protects the Codex cadence language.
- [x] Verification passes, results are recorded in `tasks/todo.md`, and changes are committed and pushed on `master`.

**Result:** Completed on 2026-05-15. Full history scan found 14,370 compact Claude/Codex messages from 2025-12-10 through 2026-05-15, with 498 interview-related messages and recent direct Codex corrections asking to discuss `$spec-interview` questions one by one. Updated targeted Codex interview-style contracts to use one primary decision question per turn and preserve `request_user_input` only for one Plan-mode decision with concrete options. Added layer1 regression coverage and refreshed Skills Showcase generated data. Validation passed through targeted cadence tests, skill integrity checks, install, routing/frontmatter tests, generated data validation, full layer1, targeted `rg`, and `git diff --check`. Shipped on `master`.

## Current Targeted Update: Skills Showcase Icon Refresh

**Goal:** Replace stale Skills Showcase app icon surfaces with `apps/skills-showcase/new-app-icon.png`.

**Acceptance Criteria:**
- [x] The app framework, source icon dimensions, and existing icon surfaces are audited before replacement.
- [x] Next App Router icon surfaces use the new source asset.
- [x] Conventional public install/touch icon surfaces are present for static and app-install references.
- [x] A conventional `favicon.ico` route is generated from the source asset.
- [x] Verification confirms asset formats, production build icon route output, and generated HTML references.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. Replaced stale Skills Showcase app icons with `apps/skills-showcase/new-app-icon.png`, added conventional public install/touch icon assets, generated a valid RGBA-backed `app/favicon.ico`, and wired explicit metadata plus `public/manifest.webmanifest`. Verification passed with format/dimension checks, app typecheck, production build, built metadata route artifact checks, generated HTML search, manifest JSON parse, and `git diff --check`. Shipped on `master` in commit `e4644e0`.

## Current Analysis: Red/Green Testing Workflow

**Goal:** Use local Claude/Codex session evidence to evaluate whether the repository's red/green testing workflow should be kept, reformed, or replaced.

**Acceptance Criteria:**
- [x] Full available Claude/Codex prompt history and rich Codex sessions are scanned for repository-scoped red/green, benchmark, verify, false-positive, and missed-test signals.
- [x] The report separates missed issues, false positives, legitimate detections, and infrastructure/tooling blockers instead of treating all failures as equal.
- [x] Real examples from history are cited with counts and clear limitations.
- [x] The recommendation explicitly chooses keep, reform, or try something else and explains why.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Report drafted at `tasks/red-green-testing-workflow-report.md`. The scan found 122 repository-relevant testing prompts and 26 red/green evidence reports. Incident-level findings were 8 legitimate detections, 7 false-positive or harness-noise incidents, 5 missed issues/coverage gaps, and 4 infrastructure/tooling blockers. Recommendation: keep red/green as the backbone, but reform benchmark oracle classification, prompt/assertion/rubric alignment, artifact retention, generated-surface freshness checks, and subjective-review-to-coverage-debt routing. Verification passed with cited-file existence checks, report reference checks, and `git diff --check`.

## Current Targeted Update: content-programming Full-Contract Benchmark Coverage

**Goal:** Upgrade `content-programming` benchmark coverage from a generic calendar smoke path to full programming-strategy contract coverage.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark harness coverage, not mirrored `content-programming` skill contracts.
- [x] The benchmark prompt asks for pillars, formats, cadence constraints, portfolio balance, measurement, cleanup/refactor, and next series candidates.
- [x] Hard assertions reject calendar-only output for the full-contract fixture.
- [x] Deterministic quality scoring distinguishes full strategy output from calendar-only output.
- [x] Required validation passes and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-14. Updated `tests/layer4/setups/packs/pack-workflows.setup.ts` so the `content-programming` pack benchmark uses a full programming-strategy fixture with pillars, formats, portfolio balance, measurement, cleanup/refactor, and next series candidates while preserving runner-specific `/series-spec` and `$series-spec` routing. Added layer1 coverage in `tests/layer1/bench-setups.test.ts` proving full-contract prompt requirements, hard assertion rejection of calendar-only output, and quality scoring differences. Validation passed with focused layer1 tests, install, skill integrity/routing checks, benchmark coverage, `content-programming` verify, and both-agent one-run smoke (`content-programming-claude-089cd18e` 1/1 hard assertions and 96.2% quality; `content-programming-codex-1be45ef5` 1/1 hard assertions and 100.0% quality). Recommended next command: `$benchmark-test-skill content-programming`.

## Current Agent Review: content-programming Benchmark 2026-05-14

**Goal:** Review the latest persisted `content-programming` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/content-programming-*`.
- [x] Retained generated `pack-benchmark-output.md` artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-content-programming-2026-05-14.md` records scores, findings, remediation, and next route.
- [x] Generated Skills Showcase data is refreshed and validated because curated review evidence changed.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. Reviewed `content-programming-claude-9f0c62c8` and `content-programming-codex-ff03c35c`, covering 6 evaluated outputs and excluding no infrastructure-blocked runs. Deterministic context was clean: Claude passed 3/3 hard assertions with 96.7% quality, and Codex passed 3/3 hard assertions with 97.5% quality. Full `pack-benchmark-output.md` artifacts were retained for both runners. Subjective verdict was good overall with median score 87.5 and range 84-90. The outputs are useful smoke-test artifacts, but the benchmark prompt only exercises a calendar path and does not prove the full `content-programming` contract for pillars, formats, portfolio balance, measurement, cleanup/refactor, and next series candidates. Skills Showcase data was regenerated and validated. Report: `benchmark/review-content-programming-2026-05-14.md`. Recommended next command: `$targeted-skill-builder content-programming full-contract benchmark coverage`.

## Current Benchmark: content-programming Post-Rubric Fix 2026-05-14

**Goal:** Run `$benchmark-test-skill content-programming` with current repository harness eligibility, verify, and both-agent benchmark evidence after the fixture-evidence rubric fix.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `content-programming` is known and reports its coverage status.
- [x] `pnpm verify --skill content-programming` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill content-programming --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-content-programming-2026-05-14.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Generated Skills Showcase data is refreshed and validated because curated benchmark evidence changed.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. `content-programming` is known with `coverage=custom` using `tests/layer4/setups/packs/pack-workflows.setup.ts`. Verify passed with layer1 PASS in 3.7s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs. Claude session `9f0c62c8` passed hard assertions at 3/3 with output quality 96.7%, p50 latency 25.7s, total cost $0.75, and 0 critical failures. Codex session `ff03c35c` passed hard assertions at 3/3 with output quality 97.5%, p50 latency 49.0s, total cost $0.75, and 0 critical failures. Report validation passed for required benchmark fields. Skills Showcase generated data was refreshed and validated, including the benchmark results matrix. Report: `benchmark/test-content-programming-2026-05-14.md`. Recommended next skill: `$benchmark-agent-review content-programming`.

## Current Targeted Update: content-programming Benchmark Next-Route Coverage

**Goal:** Fix the `content-programming` pack benchmark setup so it tests the actual accepted handoff labels and runner-specific `series-spec` successor instead of generic `$run` routing.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark harness coverage, not mirrored `content-programming` skill contracts.
- [x] Pack workflow prompts require literal accepted next-route labels.
- [x] `content-programming` hard assertions and quality scoring accept Claude `/series-spec` and Codex `$series-spec`.
- [x] Layer1 regression coverage protects the prompt, hard assertion, and quality behavior.
- [x] Required validation passes and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-14. Updated the pack benchmark harness instead of mirrored `content-programming` contracts. Pack prompts now require accepted handoff labels, route quality no longer defaults unknown pack skills to `$run`, and `content-programming` has runner-specific `series-spec` expectations for Claude and Codex. Added layer1 regression coverage for prompt wording, route assertions, and quality scoring. Validation passed with install/skill integrity/routing checks, benchmark coverage, focused layer1, `content-programming` verify, both-agent one-run benchmark smoke, targeted `rg`, and whitespace checks. Recommended next command: `$benchmark-test-skill content-programming`.

## Current Benchmark: content-programming Fresh Rerun 2026-05-14

**Goal:** Run `$benchmark-test-skill content-programming` with current repository harness eligibility, verify, and both-agent benchmark evidence after the benchmark next-route coverage fix.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `content-programming` is known and reports its coverage status.
- [x] `pnpm verify --skill content-programming` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill content-programming --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-content-programming-2026-05-14.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. `content-programming` is known with `coverage=custom` using `tests/layer4/setups/packs/pack-workflows.setup.ts`. Verify passed with layer1 PASS in 3.9s and layer2 SKIP because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs. Claude session `d041146e` passed hard assertions at 3/3 with output quality 89.2%, p50 latency 29.0s, total cost $0.75, and 1 output-quality critical failure. Codex session `f56f9728` passed hard assertions at 3/3 with output quality 98.3%, p50 latency 68.0s, and total cost $0.75. Report validation passed for required benchmark fields. Report: `benchmark/test-content-programming-2026-05-14.md`. Recommended next skill: `$session-triage content-programming benchmark failure`.

## Current Triage: content-programming Benchmark Quality Failure 2026-05-14

**Goal:** Verify the fresh `content-programming` benchmark quality critical failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `content-programming` contracts are compared against benchmark setup and quality expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, runner infrastructure issue, or agent noncompliance.
- [x] `benchmark/triage-content-programming-2026-05-14-quality.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. The fresh quality failure is verified. Both agents passed 3/3 hard assertions and no runs were infrastructure-blocked, but Claude run 002 recorded a critical `pack-fixture-evidence` quality failure. The retained artifact cited `fixtures/local-evidence.md`, `pack-input.md`, the practical build notes audience input, weekly cadence input, and local-only fixture constraints; it failed because the rubric required the exact token `local-fixture`. Responsible gap is benchmark quality-rubric brittleness in `tests/layer4/setups/packs/pack-workflows.setup.ts`, not mirrored `content-programming` contract drift or runner infrastructure. Report: `benchmark/triage-content-programming-2026-05-14-quality.md`. Recommended next skill: `$targeted-skill-builder content-programming benchmark fixture-evidence rubric`.

## Current Targeted Update: content-programming Benchmark Fixture-Evidence Rubric

**Goal:** Fix the pack benchmark quality rubric so valid concrete fixture citations pass without requiring the exact token `local-fixture`.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark harness coverage, not mirrored `content-programming` skill contracts.
- [x] `pack-fixture-evidence` requires concrete fixture paths and input facts.
- [x] Layer1 regression coverage proves concrete fixture references pass and generic evidence prose still fails.
- [x] Required validation passes and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-14. Updated `tests/layer4/setups/packs/pack-workflows.setup.ts` so pack prompts ask for concrete local fixture evidence from `pack-input.md` or `fixtures/local-evidence.md`, and the critical `pack-fixture-evidence` quality criterion requires those fixture paths plus the first two fixture input facts instead of the exact token `local-fixture`. Added layer1 coverage in `tests/layer1/bench-setups.test.ts` proving the `content-programming` concrete fixture citation path passes and generic evidence prose still fails. Validation passed with focused layer1 tests, install, skill integrity/routing checks, benchmark coverage, `content-programming` verify, both-agent one-run smoke (`content-programming-claude-8abf7ae4`, `content-programming-codex-b1c858d6`, both 1/1 hard assertions and 0 quality critical failures), targeted `rg`, and whitespace checks. Recommended next command: `$benchmark-test-skill content-programming`.

## Current Targeted Update: Creator Pack Artifact Handoff And Routing Ergonomics

**Goal:** Tighten creator-media pack skills so approved research writes include a concrete artifact handoff and next routing follows the user’s current content-production intent instead of only the default workflow sequence.

**Acceptance Criteria:**
- [x] Existing creator-media skills are updated rather than adding a duplicate meta-skill.
- [x] Approved synthesized writes require a created/updated file list, verification/readback note, git status or dirty-artifact handoff, and explicit next action.
- [x] Next-skill routing gives priority to immediate user intent such as strategy refresh, recording prep, upload prep, performance review, or owner-analytics/manual blocker work.
- [x] Deterministic layer1 coverage protects the creator-media contract language.
- [x] Generated showcase data is refreshed, validation passes, and results are recorded in `tasks/todo.md`.

**Result:** Completed on 2026-05-14. Added `Approved Artifact Handoff` and `Intent-Aware Routing` contracts across mirrored creator-foundation, youtube-ops, and remotion creator-media skills. Updated creator pack docs and added `tests/layer1/creator-media-handoff-routing.test.ts` to protect the handoff/routing behavior. Refreshed generated Skills Showcase data; no curated website copy changed beyond generated fingerprints/proof data. Validation passed with install, skill integrity, routing, benchmark coverage, focused layer1 tests, showcase generation/validation, targeted `rg`, and whitespace checks. Recommended next command: `$benchmark-test-skill content-programming`.

## Current Benchmark: content-programming 2026-05-14

**Goal:** Run `$benchmark-test-skill content-programming` with current repository harness eligibility, verify, and both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `content-programming` is known and reports its coverage status.
- [x] `pnpm verify --skill content-programming` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill content-programming --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-content-programming-2026-05-14.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. Verify passed with layer1 PASS in 4.5s and layer2 SKIP because no target-specific layer2 tests matched. The benchmark completed with no infrastructure-blocked runs. Claude session `20ea1edd` failed hard assertions at 0/3 because every run missed `Output includes next command handoff`; output quality was 85.8%, p50 latency 29.9s, and total cost $0.75. Codex session `cb044e72` passed hard assertions at 3/3; output quality was 86.7%, p50 latency 51.2s, and total cost $0.75. Report validation passed for required benchmark fields and `git diff --check` passed. Report: `benchmark/test-content-programming-2026-05-14.md`. Recommended next skill: `$session-triage content-programming benchmark failure`.

## Current Triage: content-programming Benchmark Failure 2026-05-14

**Goal:** Verify the fresh `content-programming` benchmark failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `content-programming` contracts are compared against benchmark setup expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, runner infrastructure issue, or runner noncompliance.
- [x] `benchmark/triage-content-programming-2026-05-14.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. The benchmark failure is verified. Claude session `20ea1edd` failed 0/3 only on `Output includes next command handoff`; all content, artifact, pack, skill, and workflow assertions passed. Codex session `cb044e72` passed 3/3. The responsible gap is the benchmark harness: the generic pack prompt asks for "a Next command line" while the hard assertion requires a stricter accepted label, and the quality evaluator defaults the expected pack route to `$run` even though mirrored `content-programming` contracts route to `/series-spec` or `$series-spec` after writing. Report validation passed and `git diff --check` passed. Report: `benchmark/triage-content-programming-2026-05-14.md`. Recommended next skill: `$targeted-skill-builder content-programming benchmark next-route coverage`.

## Current Fix: Showcase Data For `icon-handler` Benchmark Evidence

**Goal:** Ensure the frontend Skills Showcase reflects the latest `icon-handler` benchmark and review evidence.

**Acceptance Criteria:**
- [x] The current generated site payload is checked for `icon-handler` benchmark evidence.
- [x] The generator selects `benchmark/test-icon-handler-2026-05-14.md` instead of the stale 2026-05-13 report.
- [x] The benchmark results matrix references `benchmark/review-icon-handler-2026-05-14.md`.
- [x] Layer1 regression coverage protects title-case agent rows in benchmark reports.
- [x] Generated assets are validated, then committed and pushed on `master`.

**Result:** In progress. The site data already listed `icon-handler`, but its benchmark evidence was stale. Updated `scripts/generate-skills-showcase-data.mjs` to parse benchmark tables by header name, normalize agent labels, and support current benchmark summary/output-quality columns. Regenerated the dual showcase payloads, GitHub proof payloads, and benchmark results matrix. Added layer1 coverage that checks `icon-handler` publishes `benchmark/test-icon-handler-2026-05-14.md` with both agent rows.

## Current Agent Review: icon-handler Benchmark 2026-05-14

**Goal:** Review the latest persisted `icon-handler` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/icon-handler-*`.
- [x] Retained generated `icon-audit.md` artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-icon-handler-2026-05-14.md` records scores, findings, remediation, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Agent review completed on 2026-05-14. Reviewed `icon-handler-claude-bccbdf8a` and `icon-handler-codex-68b180e6`, covering 6 evaluated outputs and excluding no infrastructure-blocked runs. Deterministic benchmark context was clean: Claude passed 3/3 hard assertions with 84.1% quality, and Codex passed 3/3 hard assertions with 84.8% quality. Full `icon-audit.md` artifacts were retained for both runners. Subjective verdict was good overall with median score 89.0 and range 84-93. The main output-quality gap is precision: manifest destination varies across outputs, exact generated icon sizes/formats are not always named, and some outputs omit public install/touch surfaces. Report: `benchmark/review-icon-handler-2026-05-14.md`. Recommended next command: `$targeted-skill-builder icon-handler Next App Router manifest path specificity`.

## Current Targeted Update: icon-handler Benchmark Image-Error Classification

**Goal:** Classify Claude runner image-processing API errors as benchmark infrastructure blocks instead of evaluated `icon-handler` skill failures.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark runner classification and layer1 regression coverage, not mirrored `icon-handler` skill contracts.
- [x] Non-zero runner output containing `Could not process image` is marked infrastructure-blocked with a clear reason.
- [x] Layer1 proves assertions are skipped for this image-processing API error.
- [x] Targeted and required validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-14. Updated `tests/harness/bench-runner.ts` so non-zero runner output containing `Could not process image` is classified as `agent runner image processing error` and therefore infrastructure-blocked. Added `tests/layer1/runner.test.ts` coverage proving assertions are skipped and the run is not marked passed. Validation passed with focused runner tests, install/skill checks, benchmark coverage, `pnpm --dir tests verify --skill icon-handler`, a Claude smoke benchmark `icon-handler-claude-04ff1a83` with 1/1 hard assertions, targeted `rg`, and `git diff --check`. Recommended next command: `$benchmark-test-skill icon-handler`.

## Current Benchmark: icon-handler After Image-Error Classification 2026-05-14

**Goal:** Run `$benchmark-test-skill icon-handler` against the current repository state after image-processing runner errors were reclassified as infrastructure blocks.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `icon-handler` is known and reports its coverage status.
- [x] `pnpm verify --skill icon-handler` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill icon-handler --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-icon-handler-2026-05-14.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-14. `icon-handler` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 in 8.9s across 1,447 tests; layer2 was skipped because no target-specific layer2 tests matched `icon-handler`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 84.1% output quality, p50 latency 37.1s, and $3.00 total cost. Codex passed 3/3 evaluated hard assertions with 84.8% output quality, p50 latency 61.5s, and $3.00 total cost. Report: `benchmark/test-icon-handler-2026-05-14.md`. Recommended next skill: `$benchmark-agent-review icon-handler`.

## Current Triage: icon-handler Benchmark Image Failure 2026-05-14

**Goal:** Verify the latest Claude `icon-handler` benchmark image-processing failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted failed-run evidence are inspected.
- [x] Mirrored `icon-handler` contracts are compared against the Tier 2/3 benchmark setup expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, runner infrastructure issue, or runner noncompliance.
- [x] `benchmark/triage-icon-handler-2026-05-14-image.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Triage completed on 2026-05-14. The latest Claude failure is verified: `icon-handler-claude-86ed23d1` run #2 exited with `API Error: 400 Could not process image` before creating `icon-audit.md`. Codex passed 3/3 hard assertions and adjacent Claude run #0 completed normally, so the mirrored skill contracts and current route-clarified fixture are not the responsible gap. Root cause is benchmark harness classification: this runner/API image-processing failure should be infrastructure-blocked rather than counted as an evaluated skill failure. Report: `benchmark/triage-icon-handler-2026-05-14-image.md`. Recommended next skill: `$targeted-skill-builder icon-handler benchmark image-error classification`.

## Current Benchmark: icon-handler Rerun 2026-05-14

**Goal:** Run `$benchmark-test-skill icon-handler` against the current repository state after the benchmark route-clarity fix.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `icon-handler` is known and reports its coverage status.
- [x] `pnpm verify --skill icon-handler` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill icon-handler --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-icon-handler-2026-05-14.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark rerun completed on 2026-05-14. `icon-handler` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 in 12.3s across 1,446 tests; layer2 was skipped because no target-specific layer2 tests matched `icon-handler`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 2/3 evaluated hard assertions with 62.1% output quality, p50 latency 38.5s, and $3.00 total cost; Claude run #2 hit `API Error: 400 Could not process image` and did not create `icon-audit.md`. Codex passed 3/3 evaluated hard assertions with 84.1% output quality, p50 latency 73.0s, and $3.00 total cost. Report: `benchmark/test-icon-handler-2026-05-14.md`. Recommended next command: `$session-triage icon-handler benchmark failure`.

## Current Investigation: Research Skill Approval Reports

**Goal:** Update research-oriented skills so they can present findings for user approval before writing canonical research files, instead of always writing directly to disk.

**Acceptance Criteria:**
- [x] Research skills with direct-write contracts are identified.
- [x] A consistent report-first approval rule is added where appropriate.
- [x] Existing explicit write/update modes remain available after approval.
- [x] Targeted validation confirms the updated contracts.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Complete. Added a shared `## Report-First Approval Gate` to all 92 exact `type: research` skills across mirrored Claude and Codex packs. Added focused layer1 coverage in `tests/layer1/research-approval-gate.test.ts` to keep future research skills report-first by default. Validation passed with focused approval-gate tests, direct contract scan, skill dependency/version/routing checks, benchmark coverage, Skills Showcase data validation, and whitespace validation. Recommended next command: `$ship`.

## Current Targeted Skill Build: icon-handler

**Goal:** Add a shared Claude/Codex skill for auditing and applying a project-root desired icon across favicon, app icon, Apple touch icon, and manifest surfaces with a hygiene-style audit-first approval gate.

**Acceptance Criteria:**
- [x] Existing overlap is checked; `$hygiene` covers structural audits but not icon conversion/metadata correction.
- [x] Mirrored `global/claude/icon-handler` and `global/codex/icon-handler` skill contracts exist.
- [x] Codex `agents/openai.yaml` manifest exists.
- [x] Benchmark coverage and a deterministic Next App Router icon audit fixture are registered.
- [x] Discovery docs and generated Skills Showcase assets are refreshed.
- [x] Install, skill integrity, coverage, showcase, target verify, targeted `rg`, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Complete. Created mirrored `global/claude/icon-handler` and `global/codex/icon-handler` skill contracts plus the Codex `agents/openai.yaml` manifest. The skill is audit-first by default, requires explicit `fix` approval before modifications, covers Next App Router favicon/app/Apple icon conventions, warns that `favicon.ico` is the conventional browser-probed file rather than `icon.ico`, and requires generated asset plus metadata/build-output verification. Added `icon-handler` to `docs/skills-reference.md`, `tests/harness/bench-coverage.ts`, and the Tier 2/3 global benchmark setup fixture. Refreshed Skills Showcase generated assets. Validation passed with `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests bench:coverage`, focused layer1 benchmark setup/quality files, `pnpm --dir tests verify --skill icon-handler`, showcase generation/validation, targeted `rg`, and `git diff --check`. Recommended next command: `$icon-handler audit <asset>`.

## Current Benchmark: icon-handler 2026-05-13

**Goal:** Run `$benchmark-test-skill icon-handler` with repository harness eligibility, verify, and both-agent benchmark evidence after the runner-specific route convention fix.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `icon-handler` is known and reports its coverage status.
- [x] `pnpm verify --skill icon-handler` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill icon-handler --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-icon-handler-2026-05-13.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-13. `icon-handler` is known with `coverage=custom` using `tests/layer4/setups/tier23-global-workflows.setup.ts`. Verify passed with layer1 in 8.8s across 1,352 tests; layer2 was skipped because no target-specific layer2 tests matched `icon-handler`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 1/3 evaluated hard assertions with 40.2% output quality, p50 latency 21.6s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 84.1% output quality, p50 latency 65.8s, and $0.75 total cost. Report: `benchmark/test-icon-handler-2026-05-13.md`. Committed and pushed on `master`. Recommended next command: `$session-triage icon-handler benchmark failure`.

## Current Triage: icon-handler Benchmark Failure 2026-05-13

**Goal:** Verify the fresh `icon-handler` benchmark failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `icon-handler` contracts are compared against the Tier 2/3 benchmark setup expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, runner infrastructure issue, or runner noncompliance.
- [x] `benchmark/triage-icon-handler-2026-05-13.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Triage completed on 2026-05-13. The benchmark failure is verified. Claude runs #0 and #1 in `icon-handler-claude-7d05699b` exited with `API Error: 400 Could not process image` before creating `icon-audit.md`; Claude run #2 and all Codex runs completed successfully. The responsible gap is the benchmark fixture, not the mirrored `icon-handler` skill contracts: the fixture writes ASCII text to `calc-mascot-icon.png`, which can trigger runner/image transport handling before local file audit. Report: `benchmark/triage-icon-handler-2026-05-13.md`. Recommended next skill: `$targeted-skill-builder icon-handler benchmark valid source asset`.

## Current Benchmark: session-triage Fresh Rerun 2026-05-13 Latest

**Goal:** Run `$benchmark-test-skill session-triage` with current repository harness eligibility, verify, and both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `session-triage` is known and reports its coverage status.
- [x] `pnpm verify --skill session-triage` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-session-triage-2026-05-13.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark rerun completed on 2026-05-13 at 13:06 ET. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 11.8s across 1,350 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 37.1s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 37.4s, and $0.75 total cost. Report validation passed with target, agent rows, pass-rate, latency, cost, consistency, raw session paths, and next-route evidence. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next skill: `$benchmark-agent-review session-triage`.

## Current Agent Review: session-triage Fresh Rerun 2026-05-13 Latest

**Goal:** Review the latest persisted `session-triage` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/session-triage-*`.
- [x] Retained generated triage artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-session-triage-2026-05-13.md` records scores, findings, remediation, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Agent review completed on 2026-05-13. Reviewed `session-triage-claude-69ca7dea` and `session-triage-codex-33b0cc9d`, covering 6 evaluated outputs and excluding no infrastructure-blocked runs. Deterministic benchmark context was clean: both runners passed 3/3 hard assertions with 100.0% output quality. Subjective median score was 89.5 with range 86-94. Codex outputs were excellent and evidence-bound; Claude outputs appeared good from retained summaries, but full generated report text was not persisted for Claude. Report: `benchmark/review-session-triage-2026-05-13.md`. Recommended next command: `$targeted-skill-builder benchmark-agent-review retained artifact evidence`.

## Current Targeted Update: Benchmark Review Retained Artifact Evidence

**Goal:** Persist generated benchmark artifacts in raw run results so `$benchmark-agent-review` can review Claude and Codex outputs with the same fidelity.

**Acceptance Criteria:**
- [x] The fix is scoped to benchmark harness persistence, not the `benchmark-agent-review` skill contract.
- [x] `run-*.json` can include bounded generated artifact content when a benchmark setup declares `qualityOutputPath`.
- [x] Focused layer1 coverage proves generated artifact content is persisted for later review.
- [x] Focused layer1 tests, install, skill dependency/version/routing checks, targeted retained-artifact checks, and whitespace validation pass; benchmark coverage blocker is recorded.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Complete. Updated `tests/harness/bench-types.ts` and `tests/harness/bench-runner.ts` so each benchmark run can persist an optional `artifacts` map with bounded generated artifact content. Setups with `qualityOutputPath` now retain that artifact content in `run-*.json`, which directly addresses the review fidelity gap for Claude outputs that do not echo full file diffs. Updated `tests/layer1/runner.test.ts` with focused coverage for persisted artifact evidence. Validation passed with `pnpm --dir tests test:layer1 -- runner`, `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, targeted `rg` checks, and `git diff --check`. `pnpm --dir tests bench:coverage` is blocked by unrelated untracked `global/claude/icon-handler/` and `global/codex/icon-handler/` skill directories missing benchmark coverage; those files were not part of this retained-artifact fix and were left unmodified. Recommended next command: `$targeted-skill-builder icon-handler benchmark coverage`.

## Current Targeted Update: session-triage Benchmark Artifact Verification

**Goal:** Harden the `session-triage` benchmark fixture so runs verify the required root report exists after writing it.

**Acceptance Criteria:**
- [x] The fix is scoped to the benchmark fixture and layer1 setup tests, not the mirrored `session-triage` skill contracts.
- [x] The fixture prompt requires verifying `session-triage-report.md` exists in the project root after writing and creating it before response if missing.
- [x] Layer1 regression coverage asserts the post-write existence check and preserves the no-skill-change branch.
- [x] Focused layer1, required skill checks, benchmark coverage, target verify, Codex smoke benchmark, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-13. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the `session-triage` fixture now requires a post-write existence check for `session-triage-report.md` and instructs the runner to create it before responding if it is missing. Extended `tests/layer1/bench-setups.test.ts` coverage for the new prompt requirement while preserving the no-skill-change branch. Validation passed with focused layer1, required skill checks, benchmark coverage, install, target verify, Codex smoke `session-triage-codex-9ee8c354` with 1/1 hard assertions and 100.0% quality, and `git diff --check`. Recommended next command: `$benchmark-test-skill session-triage`.

## Current Triage: session-triage Benchmark Failure 2026-05-13 12:07

**Goal:** Verify the fresh `session-triage` benchmark failure from Codex session `d417810e` and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted failed-run evidence are inspected.
- [x] Mirrored `session-triage` contracts are compared against benchmark setup expectations.
- [x] The failure is classified as a skill contract gap, benchmark fixture gap, or runner noncompliance.
- [x] `benchmark/triage-session-triage-2026-05-13.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Triage completed on 2026-05-13. The fresh benchmark failure is verified: Codex session `d417810e` run #1 exited successfully after reading the right evidence but did not create `session-triage-report.md`, causing the hard assertion failure. Claude session `865e8407` passed 3/3 with 100.0% output quality, and adjacent Codex runs #0 and #2 passed, so the issue is not mirrored `session-triage` contract drift. Root cause is Codex runner noncompliance with an adequate fixture instruction, with a narrow benchmark fixture robustness opportunity: require a post-write existence check for `session-triage-report.md`. Report: `benchmark/triage-session-triage-2026-05-13.md`. Recommended next skill: `$targeted-skill-builder session-triage benchmark artifact verification`.

## Current Benchmark: session-triage Fresh Rerun 2026-05-13 12:07

**Goal:** Run `$benchmark-test-skill session-triage` with fresh harness eligibility, verify, and both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `session-triage` is known and reports its coverage status.
- [x] `pnpm verify --skill session-triage` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-session-triage-2026-05-13.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark rerun completed on 2026-05-13 at 12:07 ET. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.9s across 1,350 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 29.7s, and $0.75 total cost. Codex passed 2/3 evaluated hard assertions with 82.5% output quality, p50 latency 278.3s, and $0.75 total cost; Codex run #1 failed `session-triage-report.md created in project root`. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next command: `$session-triage session-triage benchmark failure`.

## Current Fix: session-triage Benchmark Fixture Robustness

**Goal:** Harden the `session-triage` benchmark fixture so runs write the root report before optional exploration and the rubric accepts explicit no-skill-change outputs.

**Acceptance Criteria:**
- [x] The fix is scoped to the benchmark fixture/rubric and layer1 setup tests, not the mirrored `session-triage` skill contracts.
- [x] The fixture prompt requires reading `session-log.md` and `tasks/lessons.md`, writing `session-triage-report.md` in the project root before optional exploration, and preserving the no-skill-change branch for one-off noncompliance with an adequate validation rule.
- [x] Layer1 covers the root artifact requirement, required report sections, no-skill-change branch, and explicit "task checklist, not skill contract" language.
- [x] Focused layer1 setup/quality tests, required skill checks, benchmark coverage, target verify, Codex smoke benchmark, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-13. Updated `tests/layer4/setups/tier1-workflows.setup.ts` and `tests/layer1/bench-setups.test.ts` so the `session-triage` benchmark fixture is more robust and no longer false-fails explicit no-skill-change reports. Validation passed, including Codex smoke `session-triage-codex-48488be1` with 1/1 hard assertions, 100.0% quality, and no blocked runs. Recommended next command: `$benchmark-test-skill session-triage`.

## Current Triage: session-triage Benchmark Failure Current 2026-05-13

**Goal:** Triage the current `session-triage` benchmark failure from `session-triage-codex-fbec4404` and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Current benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `session-triage` contracts are compared against the tier1 benchmark setup expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, or runner noncompliance.
- [x] `benchmark/triage-session-triage-2026-05-13.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Triage completed on 2026-05-13. The current benchmark failure is verified. Codex run #0 exited without creating `session-triage-report.md` in the project root, causing a hard assertion failure; Claude passed hard assertions but had low output-quality scores from over-remediation. The responsible gap is the benchmark fixture prompt and layer1 regression coverage, not the mirrored `session-triage` skill contracts. Report: `benchmark/triage-session-triage-2026-05-13.md`. Recommended next skill: `$targeted-skill-builder session-triage benchmark fixture robustness`.

## Current Benchmark: session-triage Fresh Rerun 2026-05-13 Current

**Goal:** Run `$benchmark-test-skill session-triage` with current repository harness eligibility, verify, and both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `session-triage` is known and reports its coverage status.
- [x] `pnpm verify --skill session-triage` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-session-triage-2026-05-13.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Current benchmark rerun completed on 2026-05-13 at 11:36 ET. Verify passed with layer1 in 8.4s across 1,350 tests and layer2 skipped because no target-specific layer2 tests matched. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 hard assertions with 68.4% output quality, p50 latency 41.1s, and $0.75 total cost. Codex passed 2/3 hard assertions with 73.7% output quality, p50 latency 54.3s, and $0.75 total cost; Codex run #0 failed `session-triage-report.md created in project root`. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next command: `$session-triage session-triage benchmark failure`.

## Current Fix: session-triage Benchmark Over-Remediation Rubric

**Goal:** Tighten the `session-triage` benchmark rubric so reports that identify adequate existing contracts do not get full credit for unconditional `$targeted-skill-builder` remediation.

**Acceptance Criteria:**
- [x] The fix is scoped to the benchmark fixture/rubric and layer1 setup tests, not the `session-triage` skill contract.
- [x] A deterministic quality criterion penalizes unconditional skill-builder routing when a report says the existing contract is adequate or the issue is one-off agent noncompliance.
- [x] Layer1 regression coverage accepts no-skill-change routing and rejects over-remediation routing.
- [x] Focused layer1 setup/quality tests, benchmark coverage, target verify, install/skill contract checks, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-13. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the `session-triage` quality rubric includes a critical `no-over-remediation-route` criterion. It penalizes reports that recommend `$targeted-skill-builder` unconditionally while also framing the incident as one-off agent noncompliance or an adequate existing contract. Updated `tests/layer1/bench-setups.test.ts` to prove `Recommended next skill: none` passes this branch and unconditional `$targeted-skill-builder run` fails it. Validation passed with focused layer1 tests, benchmark coverage, install, skill dependency/version/routing checks, target verify, and whitespace validation. Recommended next command: `$benchmark-test-skill session-triage`.

## Current Agent Review: session-triage Fresh Benchmark 2026-05-13

**Goal:** Review the latest persisted `session-triage` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/session-triage-*`.
- [x] Retained generated triage artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-session-triage-2026-05-13.md` records scores, findings, remediation, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Agent review completed on 2026-05-13. Reviewed `session-triage-claude-4cfa1e99` and `session-triage-codex-f8e827fb`, covering 6 evaluated outputs. Deterministic benchmark context was clean: both runners passed 3/3 hard assertions with 100.0% quality and no infrastructure blocks. Subjective median score was 82.5 with range 80-94. Outputs were generally good, with strong evidence-bounded incident triage, but several over-routed to `$targeted-skill-builder` despite identifying an adequate existing `$run` contract and likely one-off agent noncompliance. Report: `benchmark/review-session-triage-2026-05-13.md`. Recommended next command: `$targeted-skill-builder session-triage benchmark over-remediation rubric`.

## Current Benchmark: session-triage Fresh Rerun 2026-05-13

**Goal:** Run `$benchmark-test-skill session-triage` with fresh repository harness eligibility, verify, and both-agent benchmark evidence after the benchmark fixture routing fix.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `session-triage` is known and reports its coverage status.
- [x] `pnpm verify --skill session-triage` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-session-triage-2026-05-13.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark rerun completed on 2026-05-13. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.8s across 1,350 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 45.9s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 55.5s, and $0.75 total cost. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next skill: `$benchmark-agent-review session-triage`.

## Current Benchmark: session-triage 2026-05-13

**Goal:** Run `$benchmark-test-skill session-triage` with repository harness eligibility, verify, and both-agent benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `session-triage` is known and reports its coverage status.
- [x] `pnpm verify --skill session-triage` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-session-triage-2026-05-13.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-13. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.0s across 1,349 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with one Claude infrastructure-blocked run. Claude passed 0/2 evaluated hard assertions, with 92.9% output quality, p50 latency 42.8s, and $0.75 total cost. Codex passed 2/3 evaluated hard assertions, with 97.6% output quality, p50 latency 55.5s, and $0.75 total cost. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next command: `$session-triage session-triage benchmark failure`.

## Current Triage: session-triage Benchmark Failure 2026-05-13

**Goal:** Verify the fresh `session-triage` benchmark failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] Benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `session-triage` contracts are compared against the tier1 benchmark setup expectations.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, or runner noncompliance.
- [x] `benchmark/triage-session-triage-2026-05-13.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Triage completed on 2026-05-13. The benchmark failure is verified, but the responsible gap is the benchmark setup, not the `session-triage` skill contract. The fixture describes one-off agent noncompliance with an adequate validation contract and existing lesson, while `session-triage` explicitly says not to recommend a skill change in that situation. The fixture still hard-requires `$targeted-skill-builder`; latest Codex evidence passes that assertion, but Claude still fails because the setup expects only the Codex dollar route instead of `/targeted-skill-builder`. Report: `benchmark/triage-session-triage-2026-05-13.md`. Recommended next skill: `$targeted-skill-builder session-triage benchmark fixture routing`.

## Current Targeted Skill Update: session-triage Benchmark Fixture Routing

**Goal:** Align the `session-triage` tier1 benchmark fixture with the skill contract's no-skill-change branch for one-off agent noncompliance.

**Acceptance Criteria:**
- [x] The fix is scoped to the benchmark fixture and layer1 setup tests, not the `session-triage` skill contract.
- [x] The hard-coded `$targeted-skill-builder` route requirement is removed from the current one-off noncompliance fixture.
- [x] Layer1 regression coverage accepts `Recommended next skill: none` and rejects reintroducing the hard-coded route assertion.
- [x] Focused layer1, benchmark coverage, target verify, smoke benchmark, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Targeted fixture update completed on 2026-05-13. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the `session-triage` fixture still requires report evidence, specificity, validation planning, and an explicit next-command handoff, but no longer hard-requires `$targeted-skill-builder` for a one-off noncompliance case where the existing contract is adequate. Added `tests/layer1/bench-setups.test.ts` coverage proving a `Recommended next skill: none` report passes route scoring and that the setup no longer emits `Output recommends $targeted-skill-builder`. Validation passed with focused layer1 tests, benchmark coverage, target verify, Codex smoke `session-triage-codex-14d81596`, and `git diff --check`. Recommended next command: `$benchmark-test-skill session-triage`.

## Current Benchmark Rerun: benchmark-test-skill Self Benchmark Fresh 2026-05-13

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-13.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-13.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark completed on 2026-05-13. `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.5s across 1,312 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 17.8s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 30.5s, and $0.75 total cost. Report: `benchmark/test-benchmark-test-skill-2026-05-13.md`. Recommended next skill: `$benchmark-agent-review benchmark-test-skill`.

## Current Agent Review: benchmark-test-skill Fresh Benchmark 2026-05-13

**Goal:** Review the latest persisted `benchmark-test-skill` Claude and Codex benchmark outputs for subjective operator quality.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/benchmark-test-skill-*`.
- [x] Retained generated report artifacts and benchmark context are inspected for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric separately from deterministic benchmark metrics.
- [x] `benchmark/review-benchmark-test-skill-2026-05-13.md` records scores, findings, remediation, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Agent review completed on 2026-05-13. Reviewed latest persisted runs `benchmark-test-skill-claude-46f32ef6` and `benchmark-test-skill-codex-e4c6aef6`. Both runners had 3/3 hard assertion pass rates and 100.0% deterministic output-quality scores. Subjective agent-review scores were excellent: Claude retained evidence scored 92/100 for each run, with the caveat that full generated report text was not retained; Codex scored 96/100, 96/100, and 95/100 with fully retained generated report diffs. Median subjective score was 93.5 with range 92-96. No target-skill remediation is needed. Report: `benchmark/review-benchmark-test-skill-2026-05-13.md`. Recommended next command: `$ship`.

## Current Benchmark Rerun: benchmark-test-skill Self Benchmark 2026-05-13

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-13.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-13.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark completed on 2026-05-13. `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.2s across 1,312 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude failed 0/3 evaluated hard assertions, all on `Output matches workflow expectation`; its output-quality average was 80.0% with 3 threshold failures and 3 critical failures, driven by `metrics-table-structure`. Codex passed 3/3 evaluated hard assertions with 100.0% output quality. Report: `benchmark/test-benchmark-test-skill-2026-05-13.md`. Recommended next command: `$session-triage benchmark-test-skill benchmark failure`.

## Current Triage: benchmark-test-skill Benchmark Failure 2026-05-13

**Goal:** Verify the fresh `benchmark-test-skill` Claude benchmark failure and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] The 2026-05-13 benchmark report and persisted Claude/Codex run evidence are inspected.
- [x] Mirrored `benchmark-test-skill` contracts and the tier1 benchmark setup expectations are compared.
- [x] The failure is classified as a skill contract gap, benchmark harness gap, or runner noncompliance.
- [x] `benchmark/triage-benchmark-test-skill-2026-05-13.md` records verdict, root cause, responsible gap, validation plan, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Triage completed on 2026-05-13. The benchmark failure is verified and narrow: Claude completed all three runs, created the expected report, included broad required facts and `/ship`, but failed the hard workflow expectation because `p50=1200` and `totalCost=0.42` were not detected as rows inside the `## Benchmark Metrics` table. Codex passed with the intended table shape. The mirrored `benchmark-test-skill` contracts are aligned; the responsible gap is the custom tier1 fixture prompt in `tests/layer4/setups/tier1-workflows.setup.ts`, which should explicitly require separate metric-table rows containing `passRate=1.0` or `100%`, `p50=1200`, `totalCost=0.42`, and `run-agent-abc`. Report: `benchmark/triage-benchmark-test-skill-2026-05-13.md`. Recommended next skill: `$targeted-skill-builder benchmark-test-skill benchmark failure`.

## Current Fix: benchmark-test-skill Fixture Prompt

**Goal:** Make the `benchmark-test-skill` custom benchmark fixture prompt explicit about the metric-table row structure required by its hard assertion and quality rubric.

**Acceptance Criteria:**
- [x] `tests/layer4/setups/tier1-workflows.setup.ts` requires separate `## Benchmark Metrics` rows for pass rate, p50 latency, total cost, and raw session path with the exact evidence tokens.
- [x] Focused layer1 benchmark setup/quality tests pass.
- [x] Required skill-builder validation and one-run Claude benchmark smoke pass or are recorded with a clear infrastructure block.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-13. Updated the `benchmark-test-skill` tier1 fixture prompt to explicitly require `## Benchmark Metrics` table rows for pass rate, p50 latency, total cost, and raw session path with exact evidence tokens. Validation passed: `pnpm --dir tests test:layer1 -- bench-setups bench-quality`, static skill checks, benchmark coverage, install, `pnpm --dir tests verify --skill benchmark-test-skill`, one-run Claude benchmark smoke (`benchmark-test-skill-claude-58480bc9`, 1/1 hard assertions, 100.0% quality, no blocked runs), and `git diff --check`. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Current Benchmark Rerun: benchmark-test-skill Fresh Self Benchmark

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-12.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark completed on 2026-05-12. `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.1s across 1,304 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 92.4% output quality, p50 latency 26.3s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 92.4% output quality, p50 latency 67.5s, and $0.75 total cost. Report: `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next skill: `$benchmark-agent-review benchmark-test-skill`.

## Current Refactor: Benchmark-Backed Skill Demos

**Goal:** Replace or augment curated/demo-only skill examples on the G Skillpacks brand site with evidence-backed benchmark prompts and outputs from persisted benchmark runs.

**Acceptance Criteria:**
- [ ] The showcase data generator derives a compact demo payload from benchmark run artifacts when a skill has persisted benchmark evidence.
- [ ] Demo payloads include the exact benchmark prompt source and representative output excerpt/path without exposing unrelated temp paths or excessive transcript noise.
- [ ] The brand site renders benchmark-backed prompt/output demos for relevant pack/skill pages while preserving existing summary metrics.
- [ ] Layer1 or generator tests cover the new data shape and fallback behavior when raw run artifacts are absent.
- [ ] Showcase data is regenerated and validated.

## Current Fix: benchmark-test-skill Benchmark Failure Rubric Alignment

**Goal:** Align the `benchmark-test-skill` tier1 benchmark quality rubric with the hard structural report assertion after the 2026-05-13 self-benchmark found Claude runs that preserved facts but failed report structure.

**Acceptance Criteria:**
- [x] Existing-skill overlap confirms the fix belongs in the benchmark harness/setup, not a new skill.
- [x] The output-quality rubric fails reports that preserve facts but place benchmark metrics outside the `## Benchmark Metrics` table.
- [x] Layer1 regression coverage rejects malformed metric-table reports while preserving the existing structured passing fixture.
- [x] Targeted and required validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-13. The `benchmark-test-skill` hard assertion and output-quality rubric now agree on the structured metrics-table requirement: pass rate, p50 latency, and total cost must appear as rows inside the `## Benchmark Metrics` table. A new layer1 regression rejects reports that keep the facts but move those metrics into prose. Validation passed with focused layer1 tests, benchmark coverage, install/link checks, verify, and whitespace validation. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Current Benchmark Rerun: session-triage Fresh Rerun 2026-05-13 10:40

**Goal:** Run `$benchmark-test-skill session-triage` with fresh repository harness eligibility, verify, and both-agent benchmark evidence after the latest benchmark fixture routing fix.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `session-triage` is known and reports its coverage status.
- [x] `pnpm verify --skill session-triage` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-session-triage-2026-05-13.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Fresh benchmark rerun completed on 2026-05-13 at 10:40 ET. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.6s across 1,350 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 93.8% output quality, 1 critical quality failure, p50 latency 44.1s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 95.8% output quality, 1 critical quality failure, p50 latency 64.1s, and $0.75 total cost. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next skill: `$benchmark-agent-review session-triage`.

## Current Agent Review: session-triage Fresh Rerun 2026-05-13 10:40

**Goal:** Review the latest persisted `session-triage` Claude and Codex benchmark outputs for subjective operator quality after the fresh 10:40 benchmark rerun.

**Acceptance Criteria:**
- [x] Latest Claude and Codex run directories are resolved from `tests/benchmarks/runs/session-triage-*`.
- [x] Retained generated triage artifacts and benchmark context are extracted for each evaluated run.
- [x] Each evaluated output is graded against the agent-review rubric without merging subjective scores into deterministic benchmark metrics.
- [x] `benchmark/review-session-triage-2026-05-13.md` records source reports, run indexes, scores, findings, remediation, and next route.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Complete. Reviewed `session-triage-claude-e5f0772b` and `session-triage-codex-374ad6f0`, covering 6 evaluated outputs and excluding no infrastructure-blocked runs. Deterministic benchmark context remained clean on hard assertions: both runners passed 3/3. Subjective median score was 78 with range 74-94. The best outputs were evidence-bound and routed to operational validation, but several over-remediated by recommending `$targeted-skill-builder` or `$run` contract edits even after identifying an adequate existing `$run` contract and likely one-off noncompliance. Report: `benchmark/review-session-triage-2026-05-13.md`. Recommended next command: `$targeted-skill-builder session-triage benchmark over-remediation rubric`.

## Current Fix: session-triage Evidence-Gate Over-Remediation Rubric

**Goal:** Tighten the `session-triage` benchmark rubric so reports that identify adequate existing contracts do not get full credit for re-labeling one-off noncompliance as a new `$run` evidence-gate or contract-change task.

**Acceptance Criteria:**
- [x] The fix is scoped to the benchmark fixture/rubric and layer1 setup tests, not the `session-triage` skill contract.
- [x] The `no-over-remediation-route` quality criterion penalizes evidence-gate or contract-change recommendations when the output also says the existing rule is adequate.
- [x] Layer1 regression coverage rejects `$run` evidence-gate over-remediation while preserving accepted operational `$run` routing.
- [x] Targeted and required validation pass, including showcase data refresh/validation.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-13. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so `no-over-remediation-route` fails outputs that call for skill or contract changes, including `$run` evidence-gate changes, after framing the incident as one-off noncompliance or an adequate existing contract. Updated `tests/layer1/bench-setups.test.ts` with regression cases proving evidence-gate over-remediation fails while operational `$run` routing passes. Regenerated Skills Showcase data and benchmark matrix artifacts. Validation passed with focused layer1 setup/quality tests, install/link checks, benchmark coverage, target verify, showcase generation/validation, targeted `rg`, and whitespace validation. Recommended next command: `$benchmark-test-skill session-triage`.

## Current Benchmark Rerun: benchmark-test-skill Self Benchmark

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-12.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark rerun completed on 2026-05-12. `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.2s across 1,303 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with one Claude infrastructure-blocked run due to agent runner budget. Evaluated hard assertions passed for both agents: Claude 2/2 evaluated runs, Codex 3/3 evaluated runs. Claude output quality averaged 72.9% with 2 threshold failures and 2 critical failures; Codex output quality averaged 85.7% with 0 threshold failures and 2 critical failures. Report: `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next skill: `$benchmark-agent-review benchmark-test-skill`.

**Agent Review Result:** Completed on 2026-05-12. Reviewed the latest Claude and Codex persisted outputs, excluding one Claude infrastructure-blocked run. Median subjective score was 80 with range 70-92. The outputs are usable-to-good but need tighter exact evidence reporting: several reports summarize `layer1 PASS` as generic `PASS` or broad "verify status". Report: `benchmark/review-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$targeted-skill-builder benchmark-test-skill exact benchmark evidence reporting`.

**Targeted Fix Result:** Completed on 2026-05-12. The `benchmark-test-skill` tier1 fixture now requires exact report evidence in both the prompt and hard assertions: `layer1 PASS`, `layer2 SKIPPED`, `passRate=1.0` or `100%`, `p50=1200`, `totalCost=0.42`, `run-agent-abc`, source files, and literal report path `benchmark/test-run-2026-05-11.md`. Layer1 regression coverage rejects a broad keyword-only report. Validation passed with focused layer1 tests, coverage, install/dependency/version/routing checks, verify, Codex smoke `benchmark-test-skill-codex-2527788d`, and whitespace validation. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Current Fix: benchmark-test-skill Structured Fixture Report Ergonomics

**Goal:** Tighten the `benchmark-test-skill` tier1 benchmark fixture so generated benchmark reports are exact and easy for the next operator to scan.

**Acceptance Criteria:**
- [x] Existing-skill overlap confirms the fix belongs in the benchmark fixture/setup, not a new skill.
- [x] The fixture prompt requires stable report sections/tables for verification, benchmark metrics, raw evidence, and next route.
- [x] Hard assertions require structured report headings in addition to exact fixture evidence.
- [x] The output-quality rubric rewards report ergonomics and rejects unstructured evidence dumps.
- [x] Focused layer1 tests, benchmark coverage, required skill validation, and whitespace validation pass.

**Result:** Completed on 2026-05-12. The `benchmark-test-skill` tier1 fixture now requires a structured fixture report with verification, benchmark metrics, raw evidence, and next-route sections, plus Markdown tables and exact fixture facts. Layer1 coverage accepts the structured report and rejects exact-but-unstructured evidence dumps. Final Codex smoke `benchmark-test-skill-codex-39561c73` passed 1/1 hard assertions with 100.0% quality. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Current Fix: benchmark-test-skill Neutral Benchmark Fixture

**Goal:** Remove misleading Codex-specific fixture evidence from the `benchmark-test-skill` tier1 benchmark while preserving runner-specific `/ship` and `$ship` route assertions.

**Acceptance Criteria:**
- [x] Existing-skill overlap confirms the fix belongs in the benchmark harness/setup, not a new skill.
- [x] The fixture raw session path is neutral and no longer nudges Claude toward `$ship`.
- [x] The fixture prompt says runner route convention is authoritative regardless of fixture filenames or raw session paths.
- [x] Layer1 coverage guards against reintroducing the misleading `run-codex-abc` fixture.
- [x] Focused layer1 tests, benchmark coverage, verify, smoke benchmarks, and whitespace validation pass.

**Result:** Completed on 2026-05-12. The `benchmark-test-skill` tier1 fixture now uses neutral `run-agent-abc` benchmark evidence, explicitly tells runners that their command convention overrides fixture filenames/raw session text, preserves runner-specific `/ship` and `$ship` assertions, and uses a focused timeout for this slower fixture. Layer1 coverage guards against reintroducing `run-codex-abc`. Validation passed with focused layer1 tests, benchmark coverage, verify, Claude smoke `benchmark-test-skill-claude-a04dd30c` (1/1 hard pass), Codex smoke `benchmark-test-skill-codex-103b0680` (1/1 hard pass), install/link checks, routing checks, and `git diff --check`. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Current Triage: benchmark-test-skill Fresh Benchmark Failure

**Goal:** Triage the fresh `$benchmark-test-skill benchmark-test-skill` benchmark failure after the latest targeted fix.

**Acceptance Criteria:**
- [x] Fresh benchmark report and persisted Claude/Codex run artifacts are inspected.
- [x] Mirrored benchmark-test-skill contracts are compared for drift.
- [x] The tier1 fixture prompt, route assertions, and quality scoring expectations are checked.
- [x] Existing lessons are checked for runner-route and benchmark workflow patterns.
- [x] Triage report records verdict, root cause, responsible gap, validation plan, and next route.

**Result:** Fresh triage completed on 2026-05-12. The failure is verified. The primary durable issue is fixture ambiguity: the tier1 benchmark asks Claude to emit `/ship` but the fixture raw path still says `run-codex-abc`, which caused two Claude runs to infer `$ship`. The secondary Codex failure is an artifact-missing runner/write anomaly in one run, not yet a skill-contract defect. Report: `benchmark/triage-benchmark-test-skill-fresh-2026-05-12.md`. Recommended next command: `$targeted-skill-builder benchmark-test-skill benchmark failure`.

## Current Benchmark Rerun: benchmark-test-skill Fresh Validation

**Goal:** Rerun `$benchmark-test-skill benchmark-test-skill` after the latest targeted fix, using fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-12.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Preflight:** `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`.

**Result:** Fresh benchmark validation completed on 2026-05-12. Verify passed with layer1 in 9.1s across 1,302 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 1/3 hard assertions and failed two runs because the output recommended `/ship`; Claude output quality averaged 80.0%, with 2 threshold failures and 2 critical failures. Codex passed 2/3 hard assertions and failed one run because it created `benchmark/test-run-2026-05-11.md` instead of the expected benchmark-test-skill report path; Codex output quality averaged 85.7%, with 1 threshold failure and 1 critical failure. See `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$session-triage benchmark-test-skill benchmark failure`.

## Previous Benchmark Rerun: benchmark-test-skill

**Goal:** Rerun `$benchmark-test-skill benchmark-test-skill` after the benchmark harness routing fix, using fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-12.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [ ] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Preflight:** `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`.

**Result:** Benchmark rerun completed on 2026-05-12. Verify passed with layer1 in 8.5s across 1,256 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude failed 0/3 hard assertions because all three runs omitted the required next-command handoff, and run #1 also exited with code 143; Claude output quality averaged 89.8%, with no threshold or critical failures. Codex passed 3/3 hard assertions; Codex output quality averaged 85.8%, with 1 threshold failure and 2 critical failures. See `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$session-triage benchmark-test-skill benchmark failure`.

## Current Benchmark: benchmark-test-skill

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` through the repository harness with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-12.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-12. `benchmark-test-skill` is a known custom benchmark target using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.4s across 1,256 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude failed 0/3 hard assertions because every run omitted the required next-command handoff; Claude output quality averaged 63.1%, with 3 threshold failures and 6 critical failures. Codex passed 3/3 hard assertions; Codex output quality averaged 85.8%, with 1 threshold failure and 4 critical failures. See `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$session-triage benchmark-test-skill benchmark failure`.

## Current Triage: benchmark-test-skill Benchmark Failure

**Goal:** Triage the failed `benchmark-test-skill` benchmark and identify the smallest durable fix.

**Acceptance Criteria:**
- [x] The benchmark report and persisted run evidence are inspected.
- [x] Mirrored Claude/Codex `benchmark-test-skill` contracts are compared.
- [x] The tier1 benchmark setup, hard route assertion, and quality scoring path are inspected.
- [x] Existing lessons are checked for relevant routing/rubric patterns.
- [x] The triage report records verdict, root cause, responsible gap, validation plan, and next route.

**Result:** Triage completed on 2026-05-12. The benchmark failure is verified, but the responsible gap is in the benchmark harness/rubric, not the mirrored `benchmark-test-skill` contracts. The hard route assertion recognizes `Next command` but not all contract-valid route shapes, and the quality rubric appears to penalize final runner summaries or generated reports for not repeating fixture file names. See `benchmark/triage-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$targeted-skill-builder benchmark-test-skill benchmark failure`.

## Current Fix: benchmark-test-skill Benchmark Harness Routing

**Goal:** Fix the `benchmark-test-skill` tier1 benchmark harness so contract-valid next-route labels and report evidence formats pass deterministic assertions and quality scoring.

**Acceptance Criteria:**
- [x] Existing-skill overlap confirms the fix belongs in the benchmark harness/setup, not a new skill.
- [x] Route assertions accept `Next command`, `Recommended next command`, `Recommended next skill`, and `Next work` plus `Recommended next command`.
- [x] The `benchmark-test-skill` fixture requires source file names and report path in generated reports.
- [x] The output-quality rubric accepts semantic latency/cost evidence rather than one exact serialized key format.
- [x] Focused layer1 tests, benchmark coverage, verify, and one-run Codex benchmark smoke pass.

**Result:** Completed on 2026-05-12. Updated routing and quality helper coverage plus the `benchmark-test-skill` tier1 fixture. Validation passed with `pnpm --dir tests test:layer1 -- bench-setups bench-quality`, `pnpm --dir tests bench:coverage`, `pnpm --dir tests verify --skill benchmark-test-skill`, and `pnpm --dir tests bench --skill benchmark-test-skill --agent codex --runs 1 --chunk-size 1 --pause 0` (`benchmark-test-skill-codex-8a56e0ed`, 1/1 hard assertions, 100.0% quality, no blocked runs). Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Current Benchmark: spec-interview

**Goal:** Run `$benchmark-test-skill spec-interview` through the repository harness with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `spec-interview` is known and reports its coverage status.
- [x] `pnpm verify --skill spec-interview` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill spec-interview --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-spec-interview-2026-05-12.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-12. `spec-interview` is a known custom benchmark target using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 7.9s across 1,255 tests; layer2 was skipped because no target-specific layer2 tests matched `spec-interview`. Claude had 3/3 infrastructure-blocked runs due to agent runner budget exceeded. Codex completed 3 evaluated runs and failed 0/3 hard assertions because every run omitted the expected `$plan-phase` recommendation. Codex output quality averaged 85.7%, with no threshold failures and 3 critical failures. See `benchmark/test-spec-interview-2026-05-12.md`. Recommended next command: `$session-triage spec-interview benchmark failure`.

## Current Benchmark: ship

**Goal:** Run `$benchmark-test-skill ship` through the repository harness with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-11.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `ship` is known and reports its coverage status.
- [x] `pnpm verify --skill ship` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill ship --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-ship-2026-05-11.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-11. `ship` is a known custom benchmark target using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.2s across 1,253 tests; layer2 was skipped because no target-specific layer2 tests matched `ship`. The both-agent benchmark completed with no infrastructure-blocked runs: Claude failed 0/3 hard assertions because every run omitted the expected actionable `$run` handoff, while Codex passed 3/3. Output-quality scores were 71.4% for Claude and 78.6% for Codex. See `benchmark/test-ship-2026-05-11.md`. Recommended next command: `$session-triage ship benchmark failure`.

## Current Triage: benchmark-agent-review Remediation Handoff

**Goal:** Verify whether `$benchmark-agent-review` has a contract gap that prevents it from giving definitive next steps to remediate issues it identifies.

**Acceptance Criteria:**
- [x] The current `benchmark-agent-review` contract is inspected.
- [x] The latest `ship` review output is compared against the desired remediation handoff behavior.
- [x] Mirrored Claude/Codex skill presence and relevant lessons are checked.
- [x] The triage report names the responsible contract gap, exact recommended wording, validation checks, and next skill route.
- [x] Results are recorded in `tasks/todo.md`; if tracked files change, commit and push on `master`.

**Result:** Triage completed on 2026-05-11 and the targeted skill update was implemented. Mirrored `benchmark-agent-review` now requires remediation-ready mapping from each material finding to owner, exact contract/rubric target, validation check, and route. Mirrored `benchmark-test-skill` now hands off deterministic benchmark reports to `benchmark-agent-review` as a separate subjective review/remediation step when needed. Recommended next command: `$ship`.

## Current Benchmark: run Codex

**Goal:** Run `$benchmark-test-skill run --codex` through the repository harness with fresh verify and Codex-only benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm verify --skill run` is attempted from `tests/`.
- [x] Benchmark execution is skipped if verify fails.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Blocked at verify on 2026-05-11. Layer1 passed in 7.1s with 1,188 tests, but layer2 failed in 286ms because no layer2 test files matched the `run` skill filter. No Codex benchmark was run and no benchmark report was written.

**Triage Result:** Verified benchmark eligibility gap. `run` is a repository skill, but the current benchmark harness only registers `design-system` and `design-system-draftstonk` layer4 setups, so `$benchmark-test-skill run --codex` should fail earlier with an unsupported-target message rather than presenting the failure as a `run` verify problem.

## Current Benchmark: ship Codex

**Goal:** Run `$benchmark-test-skill ship --codex` through the repository harness with fresh eligibility, verify, and Codex-only benchmark evidence on 2026-05-11.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `ship` is known and reports its coverage status.
- [x] `pnpm verify --skill ship` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill ship --agent codex --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-ship-2026-05-11.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`.

**Result:** Benchmark completed on 2026-05-11. `ship` is a known custom benchmark target using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 12.1s across 1,245 tests; layer2 was skipped because no target-specific layer2 tests matched `ship`. Codex benchmark failed 0/3 hard assertions with no infrastructure-blocked runs. Each failed run created the manifest but recommended `$ship` or `$ship --no-deploy` as the next command, which failed the actionable next-route assertion. Output quality averaged 71.4%, below the 78.0% threshold, with evidence-linked and actionable-next-route at 0.0%. See `benchmark/test-ship-2026-05-11.md`. Recommended next command: `$session-triage ship benchmark failure`.

## Current Skill Update: Ship Benchmark Self-Route Fix

**Goal:** Update the existing `ship` skill contracts so `$ship` completion never routes back to `$ship` as routine next work and instead hands off to the next executable project step.

**Acceptance Criteria:**
- [x] Existing-skill overlap confirms the fix belongs in `ship`, not a new skill.
- [x] Codex and Claude `ship` contracts forbid routine self-routing after ship completion.
- [x] Deterministic layer1 coverage catches future loss of the self-route guard.
- [x] Standard skill validation, showcase data refresh, targeted checks, and whitespace validation pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-11. The mirrored `ship` contracts now forbid routine self-routing after successful shipping and route completed ship runs to `$run`/`/run` or another concrete next route, with retry exceptions only for incomplete shipping. Layer1 contract lint coverage was added, and the focused Codex `ship` benchmark passed 3/3 with no infrastructure-blocked runs.

## Current Skill Update: Benchmark Contract Lint and Routing

**Goal:** Harden `$benchmark-test-skill` so future benchmark requests resolve the benchmark pack command, preflight target eligibility, preserve both-agent default routing, and verify report/next-route output before completion.

**Source:** 2026-05-11 targeted-skill-builder request for a "skill contract lint and benchmark routing hardening" workflow, plus lessons on benchmark command ambiguity, pack-local command resolution, rate-limit classification, and next-step routing validation.

**Acceptance Criteria:**
- [x] Existing-skill overlap confirms the benchmark pack skill owns this behavior; no duplicate broad lint skill is added.
- [x] Mirrored Claude/Codex `benchmark-test-skill` contracts explicitly require command resolution, eligibility preflight, report verification, infrastructure-blocked classification, and final next-step routing.
- [x] Deterministic layer1 contract tests lint the mirrored skill text for these requirements.
- [x] Benchmark coverage metadata remains valid for the material skill behavior update.
- [x] Standard skill validation, showcase data refresh, targeted behavior checks, and `git diff --check` pass.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Completed on 2026-05-11. Updated existing `benchmark-test-skill` with mirrored command-resolution guards, report verification, and final-route requirements. Added layer1 contract lint coverage. Validation passed per `tasks/todo.md` Review.

## Current Benchmark: run

**Goal:** Run `$benchmark-test-skill run` through the repository harness with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-11.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `run` is known and reports its coverage status.
- [x] `pnpm verify --skill run` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill run --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-run-2026-05-11.md` records verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Result:** Benchmark completed on 2026-05-11. Claude passed 1/3 with two command-exit failures; Codex passed 3/3. No infrastructure-blocked runs occurred. Route the failure to `$session-triage run benchmark failure`.

## Current Fix: Benchmark Target Eligibility Preflight

**Goal:** Make `$benchmark-test-skill <skill>` fail unsupported benchmark targets before verify with a clear supported-target list.

**Acceptance Criteria:**
- [x] Supported benchmark targets are available from the harness without reading source.
- [x] Unsupported targets such as `run` fail before any agent benchmark work with a clear unsupported-target message.
- [x] Mirrored benchmark-test-skill contracts require the eligibility preflight before verify.
- [x] Supported target verification still works for `design-system`.
- [x] Skills Showcase generated data is refreshed and results are recorded in `tasks/todo.md`.

## Current Fix: Generic Skill Benchmarks

**Goal:** Make `$benchmark-test-skill <skill>` work for every repository skill while preserving richer custom layer4 setups for skills with domain-specific assertions.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` lists repository skills, not only custom layer4 targets.
- [x] Skills with custom setups still use their custom fixtures and assertions.
- [x] Skills without custom setups use a generic smoke benchmark.
- [x] `pnpm verify --skill run` passes with layer2 skipped when no target-specific layer2 test exists.
- [x] `pnpm bench --skill run --agent codex --runs 1 --chunk-size 1 --pause 0` completes through the generic benchmark path.
- [x] Mirrored benchmark-test-skill contracts explain the distinction between generic smoke evidence and deep domain-quality evidence.

## Planned Benchmark Work: Codex Custom Coverage *(superseded by Phase 35)*

> This pre-phase planning section is superseded by Phase 35: Repository-Wide Custom Benchmark Coverage ✓, which delivered all of these goals with full acceptance criteria checked.

**Goal:** Use the current Codex token headroom to move beyond generic smoke benchmarks and build custom Codex benchmark coverage for repository skills.

**Source:** `specs/benchmark-custom-coverage.md`, `specs/benchmark-custom-coverage-feature-interview.md`, and 2026-05-11 user clarification that every current and future skill should have a custom benchmark test setup.

## Current Benchmark: design-system

**Goal:** Run `$benchmark-test-skill design-system` through the repository harness with fresh verify and benchmark evidence.

**Acceptance Criteria:**
- [x] `pnpm verify --skill design-system` passes from `tests/`.
- [x] `pnpm bench --skill design-system --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-design-system-2026-05-10.md` reflects the latest `report.json` metrics, failures, latency, cost, consistency, and raw session path.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

## Current Skill Update: design-system Prose Headings

**Goal:** Tighten the mirrored `design-system` skill contract so generated `DESIGN.md` prose sections use parseable Markdown headings instead of bold paragraph labels.

**Acceptance Criteria:**
- [x] Update both `global/claude/design-system/SKILL.md` and `global/codex/design-system/SKILL.md` with the same Markdown-heading requirement.
- [x] Confirm no existing skill already owns this narrower behavior.
- [x] Refresh Skills Showcase generated data if tracked skill behavior changes.
- [x] Run standard skill validation, targeted heading checks, and whitespace validation.
- [x] Record results in `tasks/todo.md`, then commit and push on `master`.

## Current Fix: Both-Agent Benchmark Semantics

**Goal:** Make `$benchmark-test-skill <skill>` benchmark Claude and Codex by default while classifying runner rate limits as infrastructure-blocked instead of skill failures.

**Acceptance Criteria:**
- [x] `pnpm bench` accepts `--agent claude`, `--agent codex`, and `--agent both`, defaulting to both.
- [x] Claude and Codex benchmark sessions persist under separate raw run directories.
- [x] Rate limit and quota outputs are reported as infrastructure-blocked runs outside the evaluated skill pass rate.
- [x] Targeted report and type validation passes, then changes are committed and pushed on `master`.

## Current Documentation Sweep: Skills Showcase Design System

**Goal:** Capture the implemented Skills Showcase visual system in a root `DESIGN.md` so future site changes preserve the Swiss grid/blueprint motif, token names, accessibility constraints, and component styling rules.

**Acceptance Criteria:**
- [x] Scan the current static site CSS, UI spec, and product spec for concrete design tokens.
- [x] Record extracted token decisions and accessibility findings in `design-system-interview.md`.
- [x] Write `DESIGN.md` in the Google Labs Stitch-style format with machine-readable YAML frontmatter and prose guardrails.
- [x] Verify Markdown/frontmatter structure, contrast findings, and diff scope before shipping.

## Current Product: Skills Showcase Website MVP *(superseded by Phases 32-34)*

> This pre-phase planning section is superseded by Phases 32 (Product Foundation ✓), 33 (Workflow Experience ✓), and 34 (Distribution Launch ✓), which delivered all MVP goals. Manual launch tasks (newsletter provider, Vercel deploy) remain in `tasks/manual-todo.md`.

**Goal:** Build the showcase as a real top-of-funnel product for `agentic-skills`, G's agentic engineering brand, LexCorp distribution, and the Discord/community funnel.

## Current Hotfix: Skills Showcase Hero Overlap

**Goal:** Fix the homepage hero so the headline and supporting text never collide with the right-side workflow blueprint across desktop, tablet, and mobile widths.

**Acceptance Criteria:**
- [x] The reported text/diagram collision is validated against current code and visual behavior.
- [x] The fix is scoped to the responsive hero layout and does not refactor unrelated site sections.
- [x] Static checks and browser visual verification pass after the change.

## Current Analysis: Mobile Ideas Return Assessment

**Goal:** Evaluate the local Claude/Codex effort spent in `/Users/georgele/projects/mobile/dev/mobile-ideas`, estimate return from generated artifacts and project progress, and identify workflow changes that would improve future ROI.

**Acceptance Criteria:**
- [x] Full available Claude/Codex history is parsed for `mobile-ideas` activity.
- [x] Repository artifacts, commits, and planning outputs are inventoried.
- [x] Repeated prompts and multi-step workflow patterns are grouped with counts and examples.
- [x] Recommendations distinguish skills, agents, plugins/integrations, and standing instructions.
- [x] Final report includes highest-impact automations and a concrete next route.

**Result:** See `tasks/mobile-ideas-return-assessment.md`. Recommended next skill: `$project-fleet --plan`.

## Current Change: Remotion Pack Split

**Goal:** Move Remotion-oriented format, script, and build skills out of `creator-media` into a dedicated `remotion` pack.

**Acceptance Criteria:**
- [x] `packs/remotion` exists with mirrored Claude/Codex `youtube-format-research`, `video-script`, and `video-build` skill contracts.
- [x] `creator-media` no longer installs those Remotion production skills by default.
- [x] Creator-media handoffs point to the `remotion` pack when Remotion implementation is the next step.
- [x] Pack docs, skill references, pack normalization, and relevant tests know about `remotion`.
- [x] Focused validation passes.

**Completed:** 2026-05-04. Moved `youtube-format-research`, `video-script`, and `video-build` into the new `remotion` pack; updated creator-media docs and routing to treat them as Remotion-pack handoffs; updated public pack references, pack normalization, and layer2 video test pack names. Focused validation passed with pack list/install checks, skill version/dependency/routing audits, configured layer1 tests, targeted source scans, and `git diff --check`.

## Phase Overview

| Phase | Title | Source Spec(s) | Key Deliverable | Est. Complexity |
|-------|-------|----------------|-----------------|-----------------|
| 1 | Kanban Skill Suite | — | 6 kanban workflow skills | L |
| 2 | Proactive Board Intelligence | — | Board overview, next work suggestion, progress tracking | M |
| 3 | Board Templates | — | `--template standard` flag | S |
| 4 | Archive Automation | — | `archive-card` command + `poketo-kanban --archive` mode | M |
| 5 | Expert Review Fixes | — | 7 security/quality fixes | M |
| 6 | Testing Hardening I | tasks/ideas.md | Edge case + command test expansion (~20 new tests) | M |
| 7 | Testing Hardening II ✓ | tasks/ideas.md | Bootstrap tests, install.sh bats, DB error paths | M |
| 8 | Kanban DX ✓ | specs/board-flag-kanban-search.md, tasks/ideas.md | `--board` flag, dry-run mode, env path unification | M |
| 9 | Skill Infrastructure ✓ | tasks/ideas.md | Skill discovery, dependency graph, versioning | L |
| 10 | Headless API Migration ✓ | — | Shared Poketo app-layer kanban integration for Claude + Codex | L |
| 11 | Three-Mode Operating Model ✓ | tasks/todo.md | `claude-only`/`codex-only`/`hybrid` modes, approval packet, `/delegate`, next-step routing | XL |
| 12 | Creator Platform Evidence Foundation ✓ | specs/creator-platform-evidence-schema.md | Capability matrix + shared evidence schema skills | M |
| 13 | Creator Presence Dossier ✓ | specs/creator-platform-evidence-schema.md | Repo-backed creator career/presence dossier skill | M |
| 14 | LinkedIn Evidence Lane ✓ | specs/creator-platform-evidence-schema.md | LinkedIn export/manual evidence templates and guidance | M |
| 15 | YouTube Video Audit ✓ | user request, YouTube API/docs research | Single-video public-first audit with optional owner analytics | M |
| 16 | Mutation Contract Routing Audit ✓ | user request, tasks/lessons.md | Mutation-capable skills emit next-step routes; audit catches gaps | S |
| 17 | Mixed Monorepo Pack Routing ✓ | user request | `.agents/project.json.project_scopes` schema + pack writer preservation | S |
| 18 | Pack Lock Stale Recovery ✓ | user report | Lock owner metadata and stale-lock cleanup for pack writes | S |
| 19 | YouTube Description Optimizer ✓ | user request | Existing-video description audits, future upload drafts, and reusable metadata templates | S |
| 20 | YouTube External Video Research Skills ✓ | user request | External video context, format/Remotion-style, and competitive research skills | S |
| 21 | Quality Gate Hardening ✓ | tasks/session-workflow-quality-audit.md | Default anti-slop ship manifest, adversarial review, and validation script | M |
| 22 | Feature Interview Routing ✓ | user request, session history | Feature triage skill plus brainstorm/roadmap routing into specs or roadmap | S |
| 23 | Targeted Skill Builder ✓ | user request, tasks/lessons.md | Focused skill creation/update workflow for concrete correction patterns and capability gaps | S |
| 24 | Installer Skill ✓ | user request | Mirrored global installer skill with root install launcher and pack access guidance | S |
| 25 | Codebase Status ✓ | user request, session history | Read-only repo status reports with related conversation-history evidence | S |
| 26 | Monorepo Pack V1 ✓ | specs/monorepo-execution-controller.md | New monorepo pack with detect, run, ship, guard skills + lane-spec artifact | L |
| 27 | Analyze-Sessions Targeted Skill Retrospectives ✓ | user request | Targeted skill-performance retrospectives inside analyze-sessions | S |
| 28 | Session Triage Split ✓ | user request, Phase 27 feedback | Dedicated session-triage skill plus broad-only analyze-sessions | S |
| 29 | Live Skill Harness ✓ | user request | Opt-in live Claude/Codex behavior tests for skills | M |
| 30 | Feature Interview Evidence Intake ✓ | user request, existing feature-interview gap review | Evidence-backed feature intake with technical gotchas, journey placement, doc updates, and user priority decision | S |
| 31 | Parallel Agent Branch/PR Guard ✓ | user correction, existing agent-team workflow contracts | Agent-team lanes use separate GitHub branches and plans include consolidation/PR review | S |
| 32 | Skills Showcase Product Foundation ✓ | specs/skills-showcase-website.md, specs/ui-skills-showcase-website.md | Multi-page static shell, generated skill/GitHub proof data, stale-data validation, and skill-change freshness prompts | L |
| 33 | Skills Showcase Workflow Experience ✓ | specs/skills-showcase-website.md, specs/ui-skills-showcase-website.md | Workflow Lab animations, pack map, generated catalog, and responsive blueprint UI | L |
| 34 | Skills Showcase Distribution Launch ✓ | specs/skills-showcase-website.md, specs/ui-skills-showcase-website.md | Proof telemetry UI, newsletter capture, follow/community funnel, and Vercel launch readiness | M |
| 35 | Repository-Wide Custom Benchmark Coverage ✓ | specs/benchmark-custom-coverage.md | Custom Codex benchmark setups for all skills plus future-skill coverage enforcement | XL |
| 36 | Benchmark Output Quality Evaluation ✓ | user request | Rubric-based output-quality scoring for benchmarked skills | XL |
| 37 | Skills Showcase Next.js Preservation Refactor | specs/first-party-skills-showcase-newsletter-capture.md | Existing showcase routes/design/data ported into a minimal Next.js app | L |
| 38 | First-Party Newsletter Capture And Admin | specs/first-party-skills-showcase-newsletter-capture.md | Neon subscriber persistence, tRPC/TanStack Query capture flow, and admin export page | L |
| 39 | Benchmark Results Visibility And Safe Git Fixtures | docs/benchmark-results-matrix.md, user request | Public benchmark-results matrix plus permission-gated test-repo fixtures for `commit-and-push-by-feature` and `sync` | M |

---

## Phase 35: Repository-Wide Custom Benchmark Coverage ✓

**Goal:** Build custom Codex benchmark test setups for every repository skill and enforce benchmark setup handling for every future skill.

**Source:** `specs/benchmark-custom-coverage.md`, `specs/benchmark-custom-coverage-feature-interview.md`, and user clarification on 2026-05-11.

**Scope:**
- Add a durable benchmark coverage matrix that lists every skill under `global/` and `packs/`.
- Validate that every repository skill appears in the matrix and that custom/blocked statuses are well-formed.
- Update benchmark reporting so `$benchmark-test-skill <skill>` distinguishes custom, generic, and blocked coverage.
- Add reusable custom setup helpers for fixtures, Markdown/frontmatter assertions, routing assertions, budget tiers, and report expectations.
- Implement Codex custom benchmark setups in priority tiers, starting with high-use global execution/planning/debug skills.
- Update future skill creation/update workflows so new skills must add a benchmark setup or record an explicit blocked coverage status.
- Keep generic smoke fallback active until each skill has custom coverage.
- Defer Claude parity until the Codex-first pattern is proven.

**Acceptance Criteria:**
- [x] A committed coverage matrix lists every repository skill.
- [x] Validation fails when a repository skill is missing from the coverage matrix.
- [x] Validation fails when a `custom` coverage row points to a missing setup.
- [x] Validation fails when a `blocked` row lacks a reason and next command.
- [x] `$benchmark-test-skill <skill>` reports custom/generic/blocked coverage status.
- [x] Future skill creation/update workflows require benchmark coverage handling.
- [x] Tier 1 skills have custom Codex benchmark setups.
- [x] Tier 2 and Tier 3 skills have custom Codex benchmark setups or explicit blocked statuses.
- [x] Pack skills are covered by custom Codex benchmark setups or explicit blocked statuses.
- [x] Generic fallback remains available until all skills have custom coverage.
- [x] No GitHub Actions are created, modified, or recommended.

**Parallelization:** serial for registry/harness contract, then agent-team eligible by pack or tier once the coverage matrix and file ownership boundaries are established.
**Coordination Notes:** Initial registry and validation work touches shared harness files and must be serial. Later setup implementation can split by non-overlapping setup files and fixture directories, but shared registry updates must be consolidated carefully.

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

### Implementation
- Step 35.1: Add the committed benchmark coverage matrix and validation CLI.
  - Classification: automated
  - Files: create `tests/harness/bench-coverage.ts`, create `tests/fixtures/bench-coverage/README.md` if fixture notes are needed, modify `tests/package.json`, modify `tests/layer1/bench-setups.test.ts`
  - Define one machine-readable row per repository skill name with `skill`, `source_paths`, `coverage_status`, `setup_path`, `priority_tier`, `agent_scope`, `fixture_type`, `blocked_reason`, `next_command`, and `last_verified`.
  - Add validation that fails when a repository skill is missing from the matrix, a `custom` row points to a missing setup, a `blocked` row lacks `blocked_reason`, or a `blocked` row lacks `next_command`.
  - Keep existing repository skill discovery as the source of truth for completeness checks.
- Step 35.2: Wire coverage status into benchmark setup resolution and CLI reporting.
  - Classification: automated
  - Files: modify `tests/harness/bench-setups.ts`, modify `tests/harness/bench-types.ts`, modify `tests/bench.ts`, modify `tests/layer1/bench-setups.test.ts`
  - Preserve generic fallback for repository skills without custom setups.
  - Make `pnpm bench --list-skills` show enough status information to distinguish `custom`, `generic`, and `blocked` coverage.
  - Make `pnpm bench --skill <skill>` print the resolved coverage status before agent execution and stop clearly for blocked coverage rows.
- Step 35.3: Add reusable custom setup helpers and fixture conventions.
  - Classification: automated
  - Files: create `tests/layer4/setup-helpers/artifacts.ts`, create `tests/layer4/setup-helpers/markdown.ts`, create `tests/layer4/setup-helpers/routing.ts`, create `tests/layer4/setup-helpers/budgets.ts`, create `tests/layer4/setup-helpers/reports.ts`, modify existing `tests/layer4/setups/design-system.setup.ts`, modify existing `tests/layer4/setups/design-system-draftstonk.setup.ts`, modify `tests/layer1/bench-setups.test.ts`
  - Provide helpers for file existence/content assertions, Markdown heading/frontmatter assertions, next-command/routing assertions, budget tiers, timeout tiers, and benchmark report expectations.
  - Refactor existing custom setups only enough to prove the helpers are usable without changing their benchmark behavior.
- Step 35.4: Add Tier 1 Codex custom benchmark setups.
  - Classification: automated
  - Files: create or modify setup files under `tests/layer4/setups/` for `run`, `ship`, `ship-end`, `roadmap`, `plan-phase`, `feature-interview`, `spec-interview`, `investigate`, `session-triage`, `targeted-skill-builder`, and `benchmark-test-skill`; modify `tests/harness/bench-setups.ts`; modify `tests/harness/bench-coverage.ts`; modify `tests/layer1/bench-setups.test.ts`
  - Use deterministic temp-project fixtures and assert the observable artifact, routing, or report shape for each skill without requiring real remote pushes, external accounts, or user approval.
  - Set Tier 1 rows to `custom` with `agent_scope: codex` when setup files exist.
- Step 35.5: Add Tier 2 and Tier 3 custom setups or explicit blocked statuses.
  - Classification: automated
  - Files: create or modify setup files under `tests/layer4/setups/` for Tier 2 and Tier 3 skills where deterministic local coverage is practical; modify `tests/harness/bench-setups.ts`; modify `tests/harness/bench-coverage.ts`; modify `tests/layer1/bench-setups.test.ts`
  - Mark any unsafe or externally blocked setup as `blocked` with a concrete `blocked_reason` and `next_command`.
  - Keep generic fallback available only for rows that are not yet custom and not blocked.
- Step 35.6: Add pack skill coverage rows and pack-level setup coverage.
  - Classification: automated
  - Files: create or modify setup files under `tests/layer4/setups/packs/`; modify `tests/harness/bench-setups.ts`; modify `tests/harness/bench-coverage.ts`; modify `tests/layer1/bench-setups.test.ts`
  - Cover pack skills with custom Codex setups when deterministic local fixtures exist.
  - Record explicit blocked statuses for pack skills that depend on external credentials, real browser/device state, paid services, or unsafe access patterns.
- Step 35.7: Update skill creation and update workflows to require benchmark coverage handling.
  - Classification: automated
  - Files: modify `global/codex/create-agentic-skill/SKILL.md`, `global/claude/create-agentic-skill/SKILL.md`, `global/codex/create-local-skill/SKILL.md`, `global/claude/create-local-skill/SKILL.md`, `global/codex/targeted-skill-builder/SKILL.md`, `global/claude/targeted-skill-builder/SKILL.md`, `global/codex/plugin-creator/SKILL.md`, `global/claude/plugin-creator/SKILL.md`, `packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md`, `packs/agentic-skills-bench/claude/benchmark-test-skill/SKILL.md`, `docs/skills-reference.md`
  - Require new or materially updated skills to add a coverage matrix row and either a custom setup or explicit blocked status.
  - Make benchmark-test-skill reports route missing custom coverage to `$targeted-skill-builder <skill> benchmark coverage`.
- Step 35.8: Run validation and review the phase.
  - Classification: automated
  - Files: modify `tasks/todo.md`, modify `tasks/history.md`
  - Run focused layer1 tests for benchmark coverage, setup registry, report handling, and runner behavior.
  - Run coverage validation, `pnpm bench --list-skills`, and representative one-run Codex benchmarks for `run`, `plan-phase`, `benchmark-test-skill`, and one pack skill that has custom coverage.
  - Run standard skill validation scripts and `git diff --check`.
  - Use the review-only lane findings to fix concrete blockers before final validation.

### Green
- Step 35.9: Write regression tests and final validation evidence for the coverage contract.
  - Classification: automated
  - Files: modify `tests/layer1/bench-setups.test.ts`, add or modify `tests/layer1/bench-coverage.test.ts`, modify `tasks/todo.md`
  - Cover missing matrix row, missing custom setup path, blocked row without reason, blocked row without next command, custom/generic/blocked reporting, and generic fallback retention.
  - Run all phase validation commands and record exact results in the review section.

### Milestone: Phase 35 Repository-Wide Custom Benchmark Coverage
**Acceptance Criteria:**
- [x] A committed coverage matrix lists every repository skill.
- [x] Validation fails when a repository skill is missing from the coverage matrix.
- [x] Validation fails when a `custom` coverage row points to a missing setup.
- [x] Validation fails when a `blocked` row lacks a reason and next command.
- [x] `$benchmark-test-skill <skill>` reports custom/generic/blocked coverage status.
- [x] Future skill creation/update workflows require benchmark coverage handling.
- [x] Tier 1 skills have custom Codex benchmark setups.
- [x] Tier 2 and Tier 3 skills have custom Codex benchmark setups or explicit blocked statuses.
- [x] Pack skills are covered by custom Codex benchmark setups or explicit blocked statuses.
- [x] Generic fallback remains available until all skills have custom coverage.
- [x] No GitHub Actions are created, modified, or recommended.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion** (fill in when phase is done):
- Deviations from plan: Review-only subagent lane was replaced with local adversarial review because active Codex subagent instructions require explicit user authorization for subagents. Validation also refreshed stale generated Skills Showcase proof data found by the freshness check.
- Tech debt / follow-ups: Claude parity remains intentionally deferred. Blocked benchmark rows still need deterministic dry-run fixture design before they can move to custom coverage.
- Ready for next phase: Yes. Phase 35 is complete and archived to `tasks/phases/phase-35.md`.

---

## Phase 36: Benchmark Output Quality Evaluation ✓

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
- [x] Benchmark reports include quality score summaries when a setup defines a quality evaluator.
- [x] The harness supports weighted rubric criteria, critical criteria, evaluator notes, and minimum score thresholds.
- [x] Quality evaluator tests prove that strong fixture outputs pass and degraded/generic/hallucinated outputs fail.
- [x] Tier 1 workflow skills have quality rubrics and evaluator coverage.
- [x] Tier 2/Tier 3 global skills have quality rubrics where deterministic signals are practical, or explicit blocked/deferred quality notes.
- [x] Pack skills have quality rubrics where deterministic signals are practical, or explicit blocked/deferred quality notes.
- [x] `$benchmark-test-skill <skill>` reports hard pass rate separately from quality score.
- [x] Future skill creation/update workflows require benchmark quality-rubric handling where practical.
- [x] Representative one-run Codex benchmarks produce quality-scored reports for at least `run`, `investigate`, `design-system`, and one pack skill.
- [x] No GitHub Actions are created, modified, or recommended.

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
- Step 36.1: Write failing quality-evaluator and report tests for this phase's acceptance criteria.
  - Classification: automated
  - Files: create `tests/layer1/bench-quality.test.ts`, modify `tests/layer1/bench-report.test.ts`, modify `tests/layer1/bench-setups.test.ts`, add fixtures under `tests/fixtures/bench-quality/`
  - Add red tests for weighted rubric aggregation, minimum thresholds, critical criterion failure, evaluator notes, strong fixture output passing, generic/degraded fixture output failing, hallucinated fixture output failing, report summaries separating hard assertion pass rate from quality score, and setup registry behavior for skills with and without evaluators.
  - Tests must prove backward compatibility for setups that only define hard assertions and must keep infrastructure-blocked runs out of quality statistics.

### Implementation
- Step 36.2: Add benchmark quality types and scoring primitives.
  - Classification: automated
  - Files: modify `tests/harness/bench-types.ts`, create `tests/harness/bench-quality.ts`, modify `tests/harness/bench-setups.ts` if setup metadata needs evaluator discovery
  - Define rubric criteria with `id`, `description`, `weight`, optional `critical`, per-criterion score, evaluator notes, minimum score thresholds, and result summaries.
  - Add helper APIs for weighted scoring, critical-failure handling, threshold evaluation, required fact coverage, forbidden fabrication checks, concrete file/command reference checks, specificity checks, and reference-trait comparison.
- Step 36.3: Persist and report quality results.
  - Classification: automated
  - Files: modify `tests/harness/bench-runner.ts`, modify `tests/harness/bench-report.ts`, modify `tests/harness/bench-persistence.ts` if needed, modify `tests/layer1/bench-report.test.ts`
  - Record quality evaluations per run and summarize average score, threshold failures, critical failures, and lowest-scoring criteria in `report.json` and `report.md`.
  - Preserve existing hard assertion pass/fail behavior and label quality scoring as an additional output-quality signal.
  - Keep infrastructure-blocked runs out of evaluated quality statistics.
- Step 36.4: Add reusable setup-facing quality helpers and degraded-output fixtures.
  - Classification: automated
  - Files: create `tests/layer4/setup-helpers/quality.ts`, create fixtures under `tests/fixtures/bench-quality/`, modify focused layer1 tests
  - Add helpers for required fact coverage, forbidden fabrication, concrete file/command references, specificity checks, reference-trait checks, and rubric aggregation.
  - Include intentionally vague, generic, and hallucinated outputs that must fail quality thresholds.
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
- [x] Benchmark reports include quality score summaries when a setup defines a quality evaluator.
- [x] The harness supports weighted rubric criteria, critical criteria, evaluator notes, and minimum score thresholds.
- [x] Quality evaluator tests prove that strong fixture outputs pass and degraded/generic/hallucinated outputs fail.
- [x] Tier 1 workflow skills have quality rubrics and evaluator coverage.
- [x] Tier 2/Tier 3 global skills have quality rubrics where deterministic signals are practical, or explicit blocked/deferred quality notes.
- [x] Pack skills have quality rubrics where deterministic signals are practical, or explicit blocked/deferred quality notes.
- [x] `$benchmark-test-skill <skill>` reports hard pass rate separately from quality score.
- [x] Future skill creation/update workflows require benchmark quality-rubric handling where practical.
- [x] Representative one-run Codex benchmarks produce quality-scored reports for at least `run`, `investigate`, `design-system`, and one pack skill.
- [x] No GitHub Actions are created, modified, or recommended.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion**
- Deviations from plan: Validation exposed one over-specific `investigate` benchmark assertion that required the literal `$run` route even though the fixture asks for a diagnostic report and concrete next command without source edits. The setup now requires an actionable next-command handoff but does not force `$run` for this diagnostic-only fixture.
- Tech debt / follow-ups: None for Phase 36. Representative one-run samples passed with quality scores for `run`, `investigate`, `design-system`, and `run-kanban`; broader multi-run statistical confidence remains outside this phase's scope.
- Ready for next phase: Yes. The current roadmap queue is complete; route next work through discovery.

---

## Phase 37: Skills Showcase Next.js Preservation Refactor ✓

**Goal:** Preserve the existing Skills Showcase website while migrating it from static HTML/CSS/JS under `docs/skills-showcase/` into a minimal Next.js app that can support first-party newsletter capture in the following phase.

**Source:** `specs/first-party-skills-showcase-newsletter-capture.md` and user clarification on 2026-05-11 to split the work into a Next.js refactor phase followed by the Neon capture/admin phase.

**Result:** Completed on 2026-05-12. All 8 steps executed (37.1–37.8). Next.js app at `apps/skills-showcase/` renders 6 public routes with preserved Swiss grid/blueprint visual system, generated data pipeline, and 54 regression tests. Old static site files retired. Deploy contract updated for Next.js. Phase archived to `tasks/phases/phase-37.md`.

---

## Phase 38: First-Party Newsletter Capture And Admin ✓

**Goal:** Add first-party newsletter capture to the app-enabled Skills Showcase using Neon persistence, tRPC contracts, TanStack Query client state, and a protected admin export page.

**Source:** `specs/first-party-skills-showcase-newsletter-capture.md` and `specs/first-party-skills-showcase-newsletter-capture-interview.md`.

**Scope:**
- Add Neon schema and database access for newsletter subscribers.
- Add tRPC contracts for subscribing, admin login/session validation, subscriber listing, and subscriber export.
- Use TanStack Query for public subscribe mutation state and admin list/export state.
- Update `/follow` so the newsletter form submits to first-party capture instead of static/provider-backed capture.
- Add `/admin/newsletter` protected by a Vercel-configured shared admin secret.
- Support subscriber search, copy-all active emails, and CSV download for use in an external newsletter app or email client.
- Preserve privacy posture by storing email, status, source page, consent text version, and timestamps only.

**Non-Goals:**
- Do not implement newsletter sending.
- Do not add a full auth provider or user accounts.
- Do not store raw IP addresses, raw user-agent strings, or visitor-tracking analytics.
- Do not add admin edit/delete/status-management unless a narrow implementation need appears.
- Do not create or modify GitHub Actions.

**Acceptance Criteria:**
- [ ] `/follow` submits valid email addresses through a first-party tRPC mutation.
- [ ] Neon stores subscriber records with `email`, `status`, `source_page`, `consent_text_version`, `created_at`, and `updated_at`.
- [ ] Duplicate signup behavior is idempotent.
- [ ] Invalid emails and database failures produce appropriate public UI states without leaking internals.
- [ ] `/admin/newsletter` requires the configured admin secret.
- [ ] Admin can list, search, copy active emails, and download CSV.
- [ ] Subscriber data is never exposed in generated public assets or committed files.
- [ ] Local app validation, database-contract checks, admin access checks, and whitespace checks pass.
- [ ] No GitHub Actions are created, modified, or recommended.

**Parallelization:** serial
**Coordination Notes:** This phase crosses database schema, API contracts, client mutation state, admin access, and privacy behavior. Keep serial until the app/data contract is stable; review security/privacy before shipping.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** high
**Review gates:** correctness, tests, security, docs/API conformance

**Subagent lanes:** none

### Implementation
- Step 38.1: Add Phase 38 dependencies and configure environment
  - Files: modify `apps/skills-showcase/package.json`, create `apps/skills-showcase/.env.example`, modify `apps/skills-showcase/next.config.mjs`
  - Add `@trpc/server`, `@trpc/client`, `@trpc/react-query` (11.17.0), `@tanstack/react-query` (5.x), `@neondatabase/serverless` (1.x), `zod` (4.x). Update `next.config.mjs` to remove any static export assumption. Create `.env.example` with `DATABASE_URL` and `NEWSLETTER_ADMIN_SECRET` placeholders.
- Step 38.2: Create database schema, connection module, and migration SQL
  - Files: create `apps/skills-showcase/src/db/index.ts`, create `apps/skills-showcase/src/db/schema.ts`, create `apps/skills-showcase/src/db/migrate.sql`
  - Use `@neondatabase/serverless` with `DATABASE_URL` from env. Define `newsletter_subscribers` table with `id` (serial PK), `email` (unique, not null), `status` (default `active`), `source_page`, `consent_text_version`, `created_at`, `updated_at`. Create idempotent migration SQL. Export typed query helpers.
- Step 38.3: Set up tRPC server with newsletter router
  - Files: create `apps/skills-showcase/src/trpc/init.ts`, create `apps/skills-showcase/src/trpc/router.ts`, create `apps/skills-showcase/src/trpc/newsletter.ts`, create `apps/skills-showcase/app/api/trpc/[trpc]/route.ts`
  - Create tRPC context (with admin secret check), base router, and newsletter sub-router. Procedures: `subscribe` (public mutation — validate email with Zod, upsert into Neon, idempotent), `adminLogin` (mutation — verify secret, set session cookie), `adminList` (protected query — list/search subscribers), `adminExport` (protected query — CSV-formatted subscriber dump). Wire to Next.js App Router catch-all API route.
- Step 38.4: Set up tRPC client, TanStack Query provider, and layout integration
  - Files: create `apps/skills-showcase/src/trpc/client.ts`, create `apps/skills-showcase/src/trpc/provider.tsx`, modify `apps/skills-showcase/app/layout.tsx`
  - Create tRPC-React client binding with TanStack Query. Create a `"use client"` provider component wrapping `QueryClientProvider` and `trpc.Provider`. Add to root layout around `{children}`.
- Step 38.5: Refactor newsletter form to use tRPC subscribe mutation
  - Files: modify `apps/skills-showcase/src/showcase/newsletter-form.tsx`, modify `apps/skills-showcase/app/follow/page.tsx`
  - Replace the imperative `fetch` + `data-provider-endpoint` logic with a tRPC `newsletter.subscribe` mutation via TanStack Query. Preserve the state machine (ready, invalid-email, pending, success, error), ARIA attributes, and visual states. Remove the `provider-missing` state since the endpoint is now first-party. Remove the `data-provider-endpoint` attribute and related HTML notes from the follow page. Add `source_page` and `consent_text_version` to the mutation payload.
- Step 38.6: Create admin newsletter page with secret-based auth gate
  - Files: create `apps/skills-showcase/app/admin/newsletter/page.tsx`, create `apps/skills-showcase/src/showcase/admin-newsletter.tsx`
  - Build `/admin/newsletter` with a login gate (prompt for admin secret, call `adminLogin` mutation). After auth: subscriber list table with search input, copy-all-active-emails button, CSV download button. Use tRPC `adminList` and `adminExport` queries. Style consistently with the showcase blueprint system.
- Step 38.7: Update deploy contract, routes, and documentation
  - Files: modify `tasks/deploy.md`, modify `apps/skills-showcase/src/showcase/routes.ts`, modify `apps/skills-showcase/README.md`
  - Update deploy contract: remove "static export" / "no runtime API" / "no database" language, add Neon `DATABASE_URL` and `NEWSLETTER_ADMIN_SECRET` env var requirements, note server-side deployment. Add `/admin/newsletter` to routes.ts. Update README with new local dev setup (env vars, database).

### Green
- Step 38.8: Write regression tests covering newsletter capture and admin behavior
  - Files: create or modify test files under `apps/skills-showcase/src/`
  - Cover: subscribe mutation validation (valid email, invalid email, idempotent duplicate), newsletter form UI states (ready, invalid-email, pending, success, error — no more provider-missing), admin auth gate (reject without secret, accept with correct secret), admin list/search/export rendering, privacy (no subscriber data in generated assets).
- Step 38.9: Run local app validation, database-contract checks, and whitespace checks; fix only concrete issues found by validation
  - Files: modify only files implicated by failing validation
  - Run typecheck, build, tests, showcase data validation, `git diff --check`.

### Milestone: Phase 38 First-Party Newsletter Capture And Admin ✓
**Acceptance Criteria:**
- [x] `/follow` submits valid email addresses through a first-party tRPC mutation.
- [x] Neon stores subscriber records with `email`, `status`, `source_page`, `consent_text_version`, `created_at`, and `updated_at`.
- [x] Duplicate signup behavior is idempotent.
- [x] Invalid emails and database failures produce appropriate public UI states without leaking internals.
- [x] `/admin/newsletter` requires the configured admin secret.
- [x] Admin can list, search, copy active emails, and download CSV.
- [x] Subscriber data is never exposed in generated public assets or committed files.
- [x] Local app validation, database-contract checks, admin access checks, and whitespace checks pass.
- [x] No GitHub Actions are created, modified, or recommended.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion**
- Deviations from plan: DB uses uuid for id instead of serial; 74 tests total. No other deviations.
- Tech debt / follow-ups: Vercel deploy not yet configured (manual). Admin does not support edit/delete/status-management per non-goals.
- Ready for next phase: yes

---

## Phase 39: Benchmark Results Visibility And Safe Git Fixtures ✓

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
- [x] A clean benchmark-results matrix lists skills with persisted evaluated benchmark data, hard pass rates, quality scores, subjective review grades when present, and raw report paths.
- [x] Skills Showcase exposes benchmark results or links to the generated matrix without confusing coverage status with completed graded runs.
- [x] `commit-and-push-by-feature` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [x] `sync` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [x] The benchmark coverage registry reflects any newly unblocked setup status only after the safe fixture is implemented and validated.
- [x] Cleanup and infrastructure-block handling are documented for the disposable repository workflow.
- [x] No GitHub Actions are created, modified, or recommended.

**Parallelization:** serial for live-GitHub fixture design and validation.
**Coordination Notes:** Keep this work serial because it touches benchmark evidence semantics, website presentation, and live external repository safety. Treat any `gh`-backed execution as an explicit operator-approved integration test.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests, data contract, security

**Subagent lanes:** none

### Implementation
- Step 39.1: Validate and promote `docs/benchmark-results-matrix.md` as a generated source of truth.
  - Classification: automated
  - Files: modify `scripts/generate-skills-showcase-data.mjs` (add matrix generation/validation logic), modify `docs/benchmark-results-matrix.md` (regenerate from persisted benchmark reports), modify `scripts/validate-skills-showcase-data.sh` (add matrix freshness check)
  - Parse persisted `benchmark/test-*.md` reports to extract skill name, date, agent, hard pass rate, quality score, subjective review grade (when present), and raw report path.
  - Generate a clean Markdown matrix table in `docs/benchmark-results-matrix.md` from the parsed data, replacing the hand-maintained content with generated output.
  - Add a freshness validation step to `scripts/validate-skills-showcase-data.sh` that fails when the matrix is stale relative to benchmark reports.
- Step 39.2: Add benchmark results surface to Skills Showcase UI.
  - Classification: automated
  - Files: modify `apps/skills-showcase/app/catalog/page.tsx` or add `apps/skills-showcase/app/benchmarks/page.tsx` (benchmark results display), modify `apps/skills-showcase/src/showcase/catalog.tsx` (add benchmark evidence rendering to skill rows if using catalog), modify `apps/skills-showcase/public/assets/skills-data.js` (regenerated)
  - Render benchmark evidence data already attached to skills in `skills-data.js` (the `benchmarkEvidence` field on 6+ skills).
  - Distinguish "has benchmark coverage setup" from "has completed graded benchmark results" in the UI.
  - Show per-agent pass rates, quality scores, and link to raw report paths.
  - Regenerate showcase data and validate.
- Step 39.3: Design safe disposable GitHub test-repository fixture infrastructure.
  - Classification: automated
  - Files: create `docs/safe-git-benchmark-fixtures.md` (design doc), create `tests/layer4/helpers/disposable-repo.ts` (fixture helper)
  - Document the permission-gated disposable repository workflow: explicit user approval before `gh repo create`, `gh repo delete`, or any mutation of a live GitHub test repository.
  - Document cleanup handling: cleanup failures are infrastructure-blocked evidence, not skill failures.
  - Implement a reusable fixture helper that creates a temporary GitHub repo via `gh`, clones it locally, and provides cleanup — all gated behind explicit confirmation.
- Step 39.4: Add `commit-and-push-by-feature` safe fixture plan using the disposable repo infrastructure.
  - Classification: automated
  - Files: create `tests/layer4/setups/git-fixture-commit-and-push.setup.ts` (fixture definition), modify `tests/harness/bench-coverage.ts` (update coverage status from blocked to custom)
  - Define the benchmark setup: create disposable repo, stage mixed changes across multiple files, run `commit-and-push-by-feature`, verify commits are grouped by feature with conventional messages.
  - Update `COVERAGE_OVERRIDES` and `TIER23_GLOBAL_BLOCKED_SKILLS` to reflect newly unblocked status with the safe fixture path.
- Step 39.5: Add `sync` safe fixture plan using the disposable repo infrastructure.
  - Classification: automated
  - Files: create `tests/layer4/setups/git-fixture-sync.setup.ts` (fixture definition), modify `tests/harness/bench-coverage.ts` (update coverage status from blocked to custom)
  - Define the benchmark setup: create disposable repo with upstream changes, run `sync`, verify pull/rebase behavior and stash handling.
  - Update `COVERAGE_OVERRIDES` and `TIER23_GLOBAL_BLOCKED_SKILLS` to reflect newly unblocked status with the safe fixture path.

### Green
- Step 39.6: Write regression tests covering acceptance criteria.
  - Classification: automated
  - Files: create or modify `tests/layer1/benchmark-results-matrix.test.ts` (matrix generation/validation tests), modify existing layer1 test files as needed
  - Test matrix generation from fixture benchmark reports.
  - Test freshness validation catches stale matrix.
  - Test that showcase data includes `benchmarkEvidence` for graded skills.
  - Test that coverage registry entries for `commit-and-push-by-feature` and `sync` reflect custom coverage.
- Step 39.7: Run all tests, verify they pass, and validate the phase.
  - Classification: automated
  - Files: modify `tasks/todo.md` (review section)
  - Run `pnpm --dir tests test` for layer1 regression.
  - Run `scripts/validate-skills-showcase-data.sh` for showcase freshness.
  - Run `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`.
  - Run `git diff --check`.
  - Verify all acceptance criteria.

### Milestone: Phase 39 Benchmark Results Visibility And Safe Git Fixtures
**Acceptance Criteria:**
- [x] A clean benchmark-results matrix lists skills with persisted evaluated benchmark data, hard pass rates, quality scores, subjective review grades when present, and raw report paths.
- [x] Skills Showcase exposes benchmark results or links to the generated matrix without confusing coverage status with completed graded runs.
- [x] `commit-and-push-by-feature` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [x] `sync` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [x] The benchmark coverage registry reflects any newly unblocked setup status only after the safe fixture is implemented and validated.
- [x] Cleanup and infrastructure-block handling are documented for the disposable repository workflow.
- [x] No GitHub Actions are created, modified, or recommended.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

---

## Phase 32: Skills Showcase Product Foundation ✓

**Goal:** Establish the static product foundation for the showcase: multi-page routing, shared blueprint visual system, generated source data, generated GitHub/open-source proof data, and the freshness contract that makes future skill changes update the website when relevant.

**Source:** `specs/skills-showcase-website.md`, `specs/ui-skills-showcase-website.md`, and 2026-05-07 roadmap clarification that the MVP should be a multi-phase product with static routes, GitHub/open-source proof telemetry, newsletter/email capture, and no live LexCorp metrics.

**Scope:**
- Scaffold `docs/skills-showcase/` as a multi-page static website with direct-reloadable routes for home, workflows, packs, catalog, inspect, and follow.
- Add shared HTML/CSS/JS foundations for the Swiss grid and blueprint motif without introducing a runtime framework or root dependency requirement.
- Add generated skill catalog data from every tracked `SKILL.md` under `global/` and `packs/`.
- Add generated GitHub/open-source proof data from public GitHub/local git evidence with deterministic fallback behavior.
- Add validation that fails when generated showcase data is stale after source changes.
- Update skill-changing workflow contracts so agents regenerate the site data and review curated showcase copy/animations when skill behavior changes.

**Acceptance Criteria:**
- [x] Static route entrypoints exist for `/`, `/workflows/`, `/packs/`, `/catalog/`, `/inspect/`, and `/follow/`.
- [x] Shared styles and scripts provide the responsive Swiss grid/blueprint foundation without one-off page styling.
- [x] `scripts/generate-skills-showcase-data.mjs` writes committed generated data covering every tracked source skill.
- [x] `scripts/generate-skills-showcase-github-data.mjs` writes committed proof data or an honest fallback without requiring secrets.
- [x] `scripts/validate-skills-showcase-data.sh` fails when generated showcase data is stale.
- [x] Skill-changing contracts prompt regeneration and curated website review when `SKILL.md` behavior or metadata changes.
- [x] Focused validation passes without adding a database, video, Remotion, runtime API, GitHub Actions, or unnecessary root dependencies.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this phase edits shared static site foundations, generated data contracts, validation scripts, and skill mutation contracts that must agree on one freshness model.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** data contract, static-route behavior, skill-contract consistency, validation freshness

**Subagent lanes:** none

### Implementation
- Step 32.1: Scaffold the multi-page static shell and shared blueprint foundation.
  - Files: add `docs/skills-showcase/index.html`, `docs/skills-showcase/workflows/index.html`, `docs/skills-showcase/packs/index.html`, `docs/skills-showcase/catalog/index.html`, `docs/skills-showcase/inspect/index.html`, `docs/skills-showcase/follow/index.html`, `docs/skills-showcase/styles.css`, `docs/skills-showcase/app.js`
- Step 32.2: Add generated skill catalog data.
  - Files: add `scripts/generate-skills-showcase-data.mjs`, add generated `docs/skills-showcase/assets/skills-data.js`
- Step 32.3: Add generated GitHub/open-source proof data.
  - Files: add `scripts/generate-skills-showcase-github-data.mjs`, add generated `docs/skills-showcase/assets/github-proof-data.js`
- Step 32.4: Add stale-data validation and tests.
  - Files: add `scripts/validate-skills-showcase-data.sh`, add `tests/layer1/skills-showcase-data.test.ts` if script-level coverage is needed
- Step 32.5: Update skill mutation contracts to maintain the website after skill changes.
  - Files: modify `global/codex/create-agentic-skill/SKILL.md`, `global/claude/create-agentic-skill/SKILL.md`, `global/codex/targeted-skill-builder/SKILL.md`, `global/claude/targeted-skill-builder/SKILL.md`, `global/codex/run/SKILL.md`, `global/claude/run/SKILL.md`, `global/codex/ship/SKILL.md`, `global/claude/ship/SKILL.md`, `docs/skills-reference.md`
- Step 32.6: Validate and record the phase.
  - Files: modify `tasks/todo.md`, `tasks/history.md`

### Milestone: Phase 32 Product Foundation
**Acceptance Criteria:**
- [x] Static route entrypoints exist for `/`, `/workflows/`, `/packs/`, `/catalog/`, `/inspect/`, and `/follow/`.
- [x] Shared styles and scripts provide the responsive Swiss grid/blueprint foundation without one-off page styling.
- [x] `scripts/generate-skills-showcase-data.mjs` writes committed generated data covering every tracked source skill.
- [x] `scripts/generate-skills-showcase-github-data.mjs` writes committed proof data or an honest fallback without requiring secrets.
- [x] `scripts/validate-skills-showcase-data.sh` fails when generated showcase data is stale.
- [x] Skill-changing contracts prompt regeneration and curated website review when `SKILL.md` behavior or metadata changes.
- [x] Focused validation passes without adding a database, video, Remotion, runtime API, GitHub Actions, or unnecessary root dependencies.

**On Completion**
- Deviations from plan: Added deterministic generated-data freshness behavior and a dedicated `scripts/validate-skills-showcase-data.sh` gate so generated assets do not drift after shipping commits. Did not add a Vitest fixture for the validator because direct shell stale/fresh validation covered the contract more directly.
- Tech debt / follow-ups: Phase 33 should avoid treating `generatedAt` as a wall-clock timestamp and should run browser responsive/screenshot checks for generated catalog, workflow, pack, and proof UI. Curated website copy review remains operator-driven until Phase 33 structures more of the public-facing data.
- Ready for next phase: yes

## Phase 33: Skills Showcase Workflow Experience ✓

**Goal:** Build the user-facing product experience on top of the foundation: animated workflow explanations, pack map, generated catalog interactions, and accessible responsive page behavior.

**Source:** `specs/skills-showcase-website.md`, `specs/ui-skills-showcase-website.md`.

**Scope:**
- Implement the homepage previews and full workflow, pack, catalog, and inspect route experiences.
- Build browser-native animations for the eight curated workflows: first successful cycle, pack selection, plan -> run -> ship, spec -> roadmap -> implementation, research chains, hybrid handoff, skill authoring, and validation/troubleshooting.
- Implement the pack map, project-type highlighter, generated catalog search/filter/expand controls, and proof receipt links.
- Honor reduced-motion, keyboard, focus, and mobile layout requirements.
- Keep all factual counts and skill claims tied to generated data or clearly marked static receipts.

**Acceptance Criteria:**
- [x] Every curated workflow has selectable text, steps, artifacts, and a non-video browser-native animation or static reduced-motion fallback.
- [x] Pack map distinguishes global core, packs, overlays, and compatibility aliases with usable mobile behavior.
- [x] Catalog search, filtering, result counts, asymmetry labels, and expandable rows work against generated skill data.
- [x] Inspect/proof UI links to public GitHub receipts and validation artifacts.
- [x] Desktop, tablet, and mobile layouts avoid overlap and meet the UI spec's accessibility states.
- [x] Focused frontend and data validation passes.

**Parallelization:** serial
**Coordination Notes:** Keep serial unless Phase 32 later creates stable file boundaries for independent UI lanes. The interaction model, shared CSS, data contracts, and responsive states are coupled enough for one integration owner in V1.

> Test strategy: tests-after

**On Completion**
- Deviations from plan: Kept the implementation static and dependency-free; catalog pack links remain navigable anchors rather than hash-driven filters because generated search/filter/count/expand behavior satisfied the Phase 33 acceptance criteria.
- Tech debt / follow-ups: Phase 34 should add launch/follow conversion behavior, newsletter/provider fallback states, Vercel deployment guidance, and final deployed-route checks. A future catalog improvement can read `#pack-*` hashes into filters.
- Ready for next phase: yes

## Phase 34: Skills Showcase Distribution Launch ✓

**Goal:** Finish the top-of-funnel launch surface: G/LexCorp/community conversion paths, newsletter/email capture, GitHub/open-source proof telemetry presentation, deployment guidance, and final launch validation.

**Source:** `specs/skills-showcase-website.md`, `specs/ui-skills-showcase-website.md`, and the user's 2026-05-07 launch-scope clarification.

**Scope:**
- Build the follow/about route with G, LexCorp, YouTube, X/Twitter, Discord, GitHub, and newsletter/email capture CTAs.
- Integrate provider-backed static newsletter/email capture with provider-missing, pending, success, error, and invalid-email states.
- Present generated GitHub/open-source proof data honestly without implying live LexCorp metrics.
- Add deployment notes for Vercel static hosting and manual launch checks.
- Run final local/browser/static validation and document launch readiness.

**Acceptance Criteria:**
- [x] Follow/about route converts proof interest into G, LexCorp, YouTube, X/Twitter, Discord, GitHub, and newsletter actions.
- [x] Newsletter/email capture works with a configured provider endpoint or clearly degrades to a non-collecting fallback.
- [x] GitHub/open-source proof telemetry is visible and does not claim live LexCorp product metrics.
- [x] Vercel static deployment instructions and manual launch tasks are current.
- [x] Final validation covers generated data freshness, responsive UI, accessibility/reduced-motion behavior, links, and static-route reloads.

**Parallelization:** serial
**Coordination Notes:** Keep serial because final launch readiness crosses copy, proof claims, email capture behavior, deployment instructions, and QA evidence.

**Manual Tasks:**
- Configure the static newsletter/email provider endpoint for the launch form after the source form contract exists.
- Configure the Vercel project to deploy `docs/skills-showcase/` and verify the deployed static routes after local validation passes.

> Test strategy: tests-after

## Phase 31: Parallel Agent Branch/PR Guard ✓

**Goal:** Make the branch policy explicit across parallel agent-team skills: sequential work still lands directly on `main`/`master`, but parallel agent-team write lanes must work on separate GitHub branches and pass a consolidation/PR review gate before final integration.

**Source:** User correction on 2026-05-07 that agent teams working in parallel need branch isolation and that planning must include consolidation/PR review.

**Scope:**
- Update root guidance in `AGENTS.md` and `CLAUDE.md` to add a narrow branch exception for agent-team parallel write lanes.
- Update mirrored `plan-phase` contracts so `agent-team` execution profiles include branch names and an explicit consolidation/PR review step.
- Update `run` and monorepo parallel skills so write lanes create/use separate GitHub branches, return commit/PR evidence, and stop when PR review cannot happen.
- Update monorepo docs and lessons so the branch/PR lifecycle is discoverable and repeatable.

**Acceptance Criteria:**
- [x] Sequential/direct work still defaults to committing and pushing on `main` or `master`.
- [x] Agent-team write lanes require separate GitHub branches with deterministic names.
- [x] Agent-team lane deliverables include branch, commit SHA, validation evidence, and PR URL or an explicit blocker.
- [x] Agent-team planning includes a consolidation/PR review step after parallel lanes and before final validation/shipping.
- [x] Monorepo lane-spec guidance carries the same branch/PR requirements.
- [x] Validation passes with targeted scans, skill metadata/routing checks, tests, and whitespace checks.

**Parallelization:** serial
**Coordination Notes:** Keep this update serial because it edits shared workflow contracts and task docs. Do not create a feature branch for this sequential repository update; the branch exception being added applies to future parallel agent-team lanes.

> Test strategy: none

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** docs/API conformance, workflow-policy consistency

**Subagent lanes:** none

### Implementation
- Step 31.1: Update task planning and lessons for the branch/PR correction.
  - Files: modify `tasks/roadmap.md`, `tasks/todo.md`, `tasks/lessons.md`
- Step 31.2: Update root agent guidance and mirrored planning contracts.
  - Files: modify `AGENTS.md`, `CLAUDE.md`, `global/codex/plan-phase/SKILL.md`, `global/claude/plan-phase/SKILL.md`
- Step 31.3: Update execution and monorepo parallel contracts.
  - Files: modify `global/codex/run/SKILL.md`, `global/claude/run/SKILL.md`, `global/codex/mono-plan/SKILL.md`, `global/claude/mono-plan/SKILL.md`, `packs/monorepo/codex/mono-run/SKILL.md`, `packs/monorepo/claude/mono-run/SKILL.md`, `docs/skills-reference.md`
- Step 31.4: Validate focused behavior and ship.
  - Files: modify `tasks/todo.md`, `tasks/history.md`

### Milestone: Phase 31 Branch/PR Guard
**Acceptance Criteria:**
- [x] Sequential/direct work still defaults to committing and pushing on `main` or `master`.
- [x] Agent-team write lanes require separate GitHub branches with deterministic names.
- [x] Agent-team lane deliverables include branch, commit SHA, validation evidence, and PR URL or an explicit blocker.
- [x] Agent-team planning includes a consolidation/PR review step after parallel lanes and before final validation/shipping.
- [x] Monorepo lane-spec guidance carries the same branch/PR requirements.
- [x] Validation passes with targeted scans, skill metadata/routing checks, tests, and whitespace checks.

**On Completion** (fill in when phase is done):
- Deviations from plan: Updated `provision-agentic-config`, branch-lifecycle, mono-guard, mono-ship, README, and quality docs in addition to the initial file list so generated guidance and downstream validation would not drift.
- Tech debt / follow-ups: none
- Ready for next phase: yes

---

## Phase 30: Feature Interview Evidence Intake ✓

**Goal:** Enhance the existing mirrored `feature-interview` skill so impromptu feature ideas receive a deep evidence pass, technical gotcha analysis, user-story/journey placement, durable documentation updates, and a user-confirmed prioritization decision before they enter the roadmap or active todo queue.

**Source:** User request on 2026-05-06 after evaluating the desired "impromptu feature creation" workflow against the existing `feature-interview`, `spec-interview`, `investigate`, and `roadmap` skill contracts.

**Scope:**
- Preserve `feature-interview` as the existing intake command rather than adding a duplicate feature-creation skill.
- Add an investigate-style evidence pass that validates user claims and feature assumptions against code, docs, task state, research artifacts, and git history where relevant.
- Require a technical gotchas report covering architecture, data model, API/contracts, migrations, security/privacy, performance, observability, tests, rollout, and external dependency risk.
- Require explicit placement in the user story, journey map, or developer workflow; update or queue updates to journey/research docs when the feature changes the known journey.
- Clarify documentation destinations: new spec, existing spec patch, research/journey patch, roadmap/task-only update, interview log only, or no action.
- Add a user-confirmed prioritization gate before updating `tasks/roadmap.md`, `tasks/todo.md`, `tasks/record-todo.md`, or `tasks/manual-todo.md`.
- Mirror the updated behavior for Claude and Codex while preserving command-prefix differences.

**Acceptance Criteria:**
- [x] `global/codex/feature-interview/SKILL.md` requires evidence-backed claim validation and technical gotcha discovery before deep user interrogation.
- [x] `global/claude/feature-interview/SKILL.md` mirrors the same workflow with Claude command prefixes.
- [x] Both skills require a journey/user-story placement decision and document when research or journey artifacts need updates.
- [x] Both skills require user-confirmed prioritization before roadmap or todo mutation.
- [x] Deliverables include a durable leave-behind with evidence, gotchas, journey placement, documentation changes, priority decision, and exact next command.
- [x] Validation passes with mirrored contract scans, dependency/version/routing checks, layer1 tests, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches mirrored global planning contracts and task docs. Do not create a new skill name unless the user explicitly changes the direction.

**Completed:** 2026-05-06. Updated mirrored Claude/Codex `feature-interview` contracts to require an evidence-backed intake pass, claim validation, technical gotcha discovery, journey/workflow placement, documentation destination selection, and user-confirmed prioritization before roadmap or task mutation. Refreshed Codex metadata and discovery descriptions. Validation passed with stale-text scans, dependency/version/routing audits, pack-routing audit, layer1 tests, and `git diff --check`.

---

## Phase 25: Codebase Status ✓

**Goal:** Add a read-only status skill for "what is this repo/app, where did we leave it, and what work is outstanding?" requests.

**Source:** User request to create a skill that explores a codebase, finds conversation history related to the directory/repo, and reports application status and outstanding work; full-history scan found 181 authored roadmap mentions and 111 roadmap/repo status-audit prompts after filtering injected skill/instruction payloads.

**Scope:**
- Add mirrored Claude/Codex `codebase-status` skills.
- Add Codex OpenAI agent metadata.
- Distinguish `codebase-status` from `roadmap`: status synthesis and conversation-history evidence versus task pipeline queue maintenance.
- Update discovery docs and skill catalog mappings.

**Acceptance Criteria:**
- [x] `global/codex/codebase-status/SKILL.md` and `global/claude/codebase-status/SKILL.md` exist with versioned frontmatter.
- [x] Codex has `global/codex/codebase-status/agents/openai.yaml`.
- [x] Skill workflow reads repo orientation, task docs, git evidence, code health signals, and full local Claude/Codex prompt history filtered to the target repo.
- [x] Output requires overview, history signal, recent work, current status, outstanding work, risks/drift, and a concrete next command.
- [x] Discovery docs include `codebase-status`.
- [x] Validation passes with dependency/version/routing audits, targeted text scans, install refresh, and `git diff --check`.

**Completed:** 2026-05-04. Added mirrored Claude/Codex `codebase-status` skills, Codex OpenAI metadata, discovery references, and read-only status-reporting guidance. Evidence came from full authored Claude/Codex history filtering, which showed repeated status/outstanding-work prompts distinct from roadmap queue maintenance. Validation passed with install refresh, dependency/version/routing audits, targeted behavior scans, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches global skill discovery and mirrored skill definitions.

## Phase 24: Installer Skill ✓

**Goal:** Add a skill-creator-style global skill that lets any assistant instance with access to this `agentic-skills` checkout refresh global Claude/Codex skill links and keep pack installation discoverable.

**Source:** User request to create a skill that runs the install script so all local instances can use the skills and access pack installs when needed.

**Scope:**
- Add mirrored Claude/Codex `install-agentic-skills` skills.
- Add a bundled launcher that resolves the repository root from the installed skill symlink and delegates to root `install.sh`.
- Add Codex OpenAI agent metadata.
- Keep pack installation project-local through the existing `$pack` / `/pack` workflow.

**Acceptance Criteria:**
- [x] `global/codex/install-agentic-skills/SKILL.md` and `global/claude/install-agentic-skills/SKILL.md` exist with versioned frontmatter.
- [x] Codex has `global/codex/install-agentic-skills/agents/openai.yaml`.
- [x] The launcher runs the root `install.sh` and supports `--uninstall`.
- [x] The skill explains that domain packs are not globally installed and routes users to `pack` for project-local access.
- [x] Validation passes with install dry checks, skill dependency/version/routing audits, targeted text scans, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches global install/discovery behavior.

**Completed:** 2026-05-04. Added mirrored Claude/Codex `install-agentic-skills` skills, Codex OpenAI metadata, root install launchers, discovery references, and pack-routing guidance. Validation passed with launcher help/install checks, root install refresh, dependency/version/routing audits, targeted behavior scans, Vitest layer1, and `git diff --check`.

---

## Phase 23: Targeted Skill Builder ✓

**Goal:** Add a focused skill-building workflow that turns a concrete correction, bad recommendation pattern, repeated workflow problem, or narrow capability gap into the smallest durable fix: a new skill, an existing-skill update, or a reusable prompt/template.

**Source:** User request after providing the current `analyze-sessions` contract and explicitly rejecting broad session-history analysis as the default path for targeted skill work.

**Scope:**
- Add mirrored Claude/Codex `targeted-skill-builder` skills.
- Keep `tasks/lessons.md` as the first evidence source.
- Require a destination checkpoint: new skill, update existing skill, reusable prompt only, or unsure/recommend.
- Search existing skills for overlap before creating a duplicate.
- Inspect only user-provided files, a named skill, current conversation context, or a tightly scoped history query unless the user explicitly requests full history analysis.
- Default new shared skills to this `agentic-skills` repo, while providing a prompt for the user to run in this repo when an external project session needs an existing shared skill amended.
- Require Codex global skills to include `agents/openai.yaml`.
- Run `./install.sh` after skill mutations so Claude/Codex symlinks are current, and tell the user to start a fresh CLI/session if the new skill is not visible yet.

**Acceptance Criteria:**
- [x] `global/codex/targeted-skill-builder/SKILL.md` and `global/claude/targeted-skill-builder/SKILL.md` exist with versioned frontmatter.
- [x] Codex has `global/codex/targeted-skill-builder/agents/openai.yaml`.
- [x] Skill discovery docs include targeted-skill-builder.
- [x] The workflow explicitly avoids default broad `$analyze-sessions` behavior.
- [x] Validation passes with dependency/version/routing audits, targeted text scans, install refresh, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this adds a global skill pair plus discovery and routing documentation.

**Completed:** 2026-05-04. Added mirrored Claude/Codex `targeted-skill-builder`, Codex OpenAI metadata, discovery references, and validation notes. Validation passed with dependency/version/routing audits, targeted behavior scans, install refresh, and `git diff --check`.

---

## Phase 22: Feature Interview Routing ✓

**Goal:** Add a planning interface between raw brainstorm ideas and full specs so ideas receive human/agent alignment, feature-specific questioning, and a decision on whether to create a new spec, update an existing spec, or route into roadmap/task work.

**Source:** User request after reviewing recent brainstorm runs and session history showing brainstorm's direct handoff to spec-interview.

**Scope:**
- Add mirrored Claude/Codex `feature-interview` skills.
- Update brainstorm so generated ideas route to feature-interview instead of assuming every idea needs a full spec.
- Update roadmap/research routing so unspecced ideas use feature-interview unless full-spec creation is already confirmed.
- Make spec-interview's post-spec route explicitly default to roadmap unless missing journey/UX/UI gates take priority.
- Expose feature-interview in skill discovery and routing documentation.

**Acceptance Criteria:**
- [x] `global/codex/feature-interview/SKILL.md` and `global/claude/feature-interview/SKILL.md` exist with versioned frontmatter.
- [x] Codex has `global/codex/feature-interview/agents/openai.yaml`.
- [x] Brainstorm output prompts use `$feature-interview` / `/feature-interview`.
- [x] Roadmap unspecced-idea handling prefers feature-interview triage and keeps spec-interview for confirmed full-spec work.
- [x] Spec-interview explicitly recommends roadmap after completed/updated specs when no higher-priority design gate is missing.
- [x] Skill discovery docs include feature-interview.
- [x] Validation passes with dependency/version/routing audits, targeted text scans, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches shared planning skill contracts and routing documentation in both Claude and Codex mirrors.

**Completed:** 2026-05-04. Added feature-interview and redirected brainstorm/roadmap/research-routing language so brainstorm ideas no longer assume full spec creation. Validation passed with dependency/version/routing audits, targeted text scans, and `git diff --check`.

---

## Phase 21: Quality Gate Hardening ✓

**Goal:** Make anti-slop quality controls a default part of non-trivial mutation and shipping workflows so code cannot be committed by procedural compliance alone.

**Source Spec:** `tasks/session-workflow-quality-audit.md`

**Scope:**
- Add a shared quality-gate contract for mutation/shipping skills that requires changed files, user-goal mapping, tests run, skipped tests, residual risk, and next command.
- Harden `$run`, `$ship`, `$ship-end`, and `$commit-and-push-by-feature` so non-trivial source mutations require a diff-aware ship manifest and cannot rely on doc-only verification.
- Promote targeted `quality-sweep audit` or equivalent adversarial review into the default pre-ship path for non-trivial code changes.
- Add a lightweight local validation script that can check generated ship manifests or final-response drafts for required quality-gate fields.
- Document how user corrections flow from `tasks/lessons.md` into relevant skill/test updates when a correction exposes a repeatable workflow failure.
- Preserve existing direct-to-primary shipping and next-step routing contracts.

**Acceptance Criteria:**
- [x] A reusable quality-gate contract exists and is referenced by the global mutation/shipping skills.
- [x] `$run`, `$ship`, `$ship-end`, and `$commit-and-push-by-feature` require a ship manifest for non-trivial source changes.
- [x] The ship manifest requires changed files, per-file purpose, user-goal mapping, tests run, skipped tests, residual risk, and next command.
- [x] Non-trivial source changes require targeted `quality-sweep audit`, `expert-review`, or an explicitly justified equivalent adversarial review before commit/push.
- [x] A validation script detects missing required ship-manifest fields and passes on a complete fixture.
- [x] User-correction handling requires updating `tasks/lessons.md` and, when applicable, the relevant skill or validation check.
- [x] Validation passes with targeted contract scans, script fixture checks, skill dependency/version/routing audits, and `git diff --check`.

**Completed:** 2026-05-04. Added the reusable `docs/quality-gate-contract.md`, the dependency-light `scripts/ship-quality-gate.sh` validator with complete and incomplete fixtures, and hardened `$run`, `$ship`, `$ship-end`, and `$commit-and-push-by-feature` so non-trivial source mutations require a diff-aware ship manifest, adversarial review, executable-verification distinction, and correction-enforcement evidence. Validation passed with focused fixture checks, targeted contract scans, skill dependency/version/routing audits, and `git diff --check`.

**Parallelization:** review-only
**Coordination Notes:** Keep implementation serial because the phase touches shared global workflow skills and validation scripts. Use review-only lanes for adversarial contract review after the main edits are drafted.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** review-only
**Integration owner:** main agent
**Conflict risk:** high
**Review gates:** correctness, tests, docs/API conformance, workflow safety

**Subagent lanes:**
- Lane: quality-contract-review
  - Agent: explorer
  - Role: reviewer
  - Mode: review
  - Scope: Review the proposed quality-gate contract and skill-routing changes for loopholes that would still allow source changes to ship without diff-aware evidence.
  - Depends on: Step 21.4
  - Deliverable: Review report listing blockers, recommended wording changes, and validation gaps.

### Implementation
- Step 21.1: Add reusable quality-gate contract documentation.
  - Classification: automated
  - Files: create `docs/quality-gate-contract.md`
  - Define non-trivial mutation, ship manifest fields, skipped-test rationale, residual-risk language, adversarial review expectations, and direct-to-primary compatibility.
  - Include the recommended policy from `tasks/session-workflow-quality-audit.md`: Plan, Implement, Self-review, Quality sweep, Verification, Ship manifest.
- Step 21.2: Add ship-manifest validation script and fixtures.
  - Classification: automated
  - Files: create `scripts/ship-quality-gate.sh`, create `tests/fixtures/ship-quality-gate/complete.md`, create `tests/fixtures/ship-quality-gate/missing-fields.md`
  - Script should fail on missing required fields and pass on a complete manifest fixture.
  - Keep it dependency-light and shell-compatible with existing repository scripts.
- Step 21.3: Harden global execution and shipping skill contracts.
  - Classification: automated
  - Files: modify `global/codex/run/SKILL.md`, modify `global/codex/ship/SKILL.md`, modify `global/codex/ship-end/SKILL.md`, modify `global/codex/commit-and-push-by-feature/SKILL.md`
  - Require ship manifest generation for non-trivial source mutations before commit/push.
  - Require targeted `quality-sweep audit`, `expert-review`, or an explicitly justified equivalent adversarial review for non-trivial code changes.
  - Require final responses to distinguish executable verification from doc-only/task-only checks.
- Step 21.4: Add user-correction enforcement guidance.
  - Classification: automated
  - Files: modify `global/codex/run/SKILL.md`, modify `global/codex/ship/SKILL.md`, modify `global/codex/ship-end/SKILL.md`, modify `global/codex/commit-and-push-by-feature/SKILL.md`, modify `docs/quality-gate-contract.md`
  - Require corrections to update `tasks/lessons.md`.
  - Require a relevant skill or validation script update when the correction exposes a repeatable workflow failure.
  - Require explicit "not applicable" rationale when no skill/test update is made.

### Green
- Step 21.5: Write and run focused validation for the quality gate.
  - Classification: automated
  - Files: modify `tasks/todo.md` review section with exact validation commands and results
  - Run `scripts/ship-quality-gate.sh tests/fixtures/ship-quality-gate/complete.md` and confirm it passes.
  - Run `scripts/ship-quality-gate.sh tests/fixtures/ship-quality-gate/missing-fields.md` and confirm it fails for the expected missing fields.
  - Run targeted `rg` scans confirming `docs/quality-gate-contract.md` references and required manifest fields in all touched global skills.
- Step 21.6: Run repository validation and review gate.
  - Classification: automated
  - Files: no source changes expected beyond review-driven fixes and task review notes
  - Run `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, and `git diff --check`.
  - Apply concrete review findings from the `quality-contract-review` lane before marking the phase complete.

### Milestone: Quality Gate Hardening
**Acceptance Criteria:**
- [x] A reusable quality-gate contract exists and is referenced by the global mutation/shipping skills.
- [x] `$run`, `$ship`, `$ship-end`, and `$commit-and-push-by-feature` require a ship manifest for non-trivial source changes.
- [x] The ship manifest requires changed files, per-file purpose, user-goal mapping, tests run, skipped tests, residual risk, and next command.
- [x] Non-trivial source changes require targeted `quality-sweep audit`, `expert-review`, or an explicitly justified equivalent adversarial review before commit/push.
- [x] A validation script detects missing required ship-manifest fields and passes on a complete fixture.
- [x] User-correction handling requires updating `tasks/lessons.md` and, when applicable, the relevant skill or validation check.
- [x] Validation passes with targeted contract scans, script fixture checks, skill dependency/version/routing audits, and `git diff --check`.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: none recorded.
- Tech debt / follow-ups: none recorded.
- Ready for next phase: yes.

---

## Phase 20: YouTube External Video Research Skills ✓

**Goal:** Add focused external YouTube video research skills for context comprehension, format/Remotion-style analysis, and competitive performance learning.

**Scope:**
- Add mirrored Claude/Codex `youtube-vid-research`, `youtube-format-research`, and `youtube-competitive-research` skills to the creator-media pack.
- Reuse the existing YouTube public-evidence contract: `yt-dlp`, local transcript venv, raw evidence under `research/youtube/data/`, explicit evidence gaps, and no fabricated transcripts/comments/metrics/visual claims.
- Wire creator-media docs and next-skill routing so external reference-video work sits between single-video audit and packaging/strategy work.
- Keep Remotion implementation owned by `video-build`; `youtube-format-research` only emits a format and Remotion handoff spec.

**Acceptance Criteria:**
- [x] Mirrored Claude/Codex `youtube-vid-research` skill contracts exist.
- [x] Mirrored Claude/Codex `youtube-format-research` skill contracts exist.
- [x] Mirrored Claude/Codex `youtube-competitive-research` skill contracts exist.
- [x] The three skills require persisted evidence, explicit evidence coverage, anti-fabrication constraints, output paths, archive-first replacement, and next-skill routing.
- [x] Creator-media docs/reference lists include the three new skills in discovery and default flow.
- [x] Existing creator-media routing orders include the three new external-video research lanes.
- [x] Validation passes with mirrored-contract scans, docs/routing scans, dependency/version/routing audits, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches mirrored creator-media skills, shared pack docs, and routing lists. Do not add dependencies or GitHub Actions.

**Completed:** 2026-05-04. Mirrored Claude/Codex `youtube-vid-research`, `youtube-format-research`, and `youtube-competitive-research` skills were added to the creator-media pack, documentation references now expose external video context, format/Remotion-style analysis, and competitive lessons, and validation passed with mirrored contract scans, docs/routing scans, dependency/version/routing audits, and `git diff --check`.

## Phase 19: YouTube Description Optimizer ✓

**Goal:** Add a focused YouTube description and metadata optimization skill for existing videos, future uploads, and reusable series templates.

**Scope:**
- Add mirrored Claude/Codex `youtube-description-optimizer` skill definitions to the creator-media pack.
- Support audit, draft, and template modes for video metadata, scripts/outlines, channel evidence, and series evidence.
- Cover first-two-lines promise support, search clarity, CTA/link hierarchy, chapters, hashtags, disclosures, pinned-comment fit, and practical rewritten description blocks.
- Wire creator-media docs and routing so description optimization sits between title/thumbnail audit and portfolio decisions.

**Acceptance Criteria:**
- [x] `youtube-description-optimizer` exists for both Claude and Codex.
- [x] The skill supports `audit`, `draft`, and `template` modes with explicit output paths.
- [x] The skill requires evidence coverage and forbids invented links, sponsors, disclosures, chapters, transcript details, comments, and owner-only metrics.
- [x] Creator-media docs/reference lists include `youtube-description-optimizer` in the packaging flow.
- [x] Creator-media next-skill routing includes `youtube-description-optimizer` between title/thumbnail audit and portfolio.
- [x] Validation passes with skill dependency/version checks, next-step routing audit, targeted mirrored-contract scans, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep this serial because it touches mirrored skills, shared creator-media routing, and public pack docs. Preserve any in-progress creator-media video-script/video-build routing work.

**Completed:** 2026-05-03. Mirrored Claude/Codex `youtube-description-optimizer` skills were added to the creator-media pack, documentation references now expose the description/metadata lane between title/thumbnail audit and portfolio, and validation passed with dependency/version checks, next-step routing audit, mirrored contract scan, docs/routing scans, and `git diff --check`.

## Phase 18: Pack Lock Stale Recovery ✓

**Goal:** Make pack lock failures diagnosable and recover automatically when a previous pack process left a stale lock behind.

**Scope:**
- Add owner metadata to `.agents/.pack.lock`.
- Remove stale locks automatically when the recorded owner PID is no longer running.
- Include lock owner details in timeout errors.
- Document the lock behavior in pack docs.

**Acceptance Criteria:**
- [x] `scripts/pack.sh` writes lock owner metadata and removes stale dead-PID locks.
- [x] Timeout errors report lock owner metadata.
- [x] Pack docs describe stale-lock behavior.
- [x] Focused smoke tests cover live-lock waiting and stale-lock recovery.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this is shared pack write coordination.

## Phase 17: Mixed Monorepo Pack Routing ✓

**Goal:** Allow a repository to declare a default project designation plus path-scoped domain designations for mixed monorepos.

**Scope:**
- Document `project_scopes` in the pack skill and public pack docs.
- Keep `enabled_packs` as the repository-wide union of available local packs.
- Preserve existing `project_scopes` and `notes` fields when pack commands rewrite `.agents/project.json`.

**Acceptance Criteria:**
- [x] `global/claude/pack` and `global/codex/pack` describe mixed-monorepo routing.
- [x] `README.md` and `docs/packs.md` show a mixed devtool/business-app example.
- [x] `scripts/pack.sh install`, `remove`, `refresh`, and `set-mode` do not drop existing `project_scopes` or `notes` when `jq` is available.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches shared pack schema and writer behavior.

## Phase 16: Mutation Contract Routing Audit ✓

**Goal:** Ensure every mutation-capable skill contract emits explicit next-step routing in its final response, and add a repeatable audit that fails when future mutation-capable skills omit that routing.

**Scope:**
- Patch mutation-capable skill contracts whose output section or routing section does not require a final next-step handoff.
- Add a script-level audit for mutation-capable `SKILL.md` files missing `Recommended next skill`, `Recommended next command`, or the `Next work`/`Recommended next command` pair.
- Document the audit in task review output and run it with the existing skill dependency/version checks.

**Acceptance Criteria:**
- [x] Mutation-capable skills patched by this phase explicitly require next-step routing in their final response.
- [x] The repository has a repeatable audit command for missing next-step routing in mutation-capable skill contracts.
- [x] The audit passes along with `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches shared skill contract text and validation scripts.

## Phase 11: Three-Mode Operating Model ✓

**Goal:** Evolve `agentic-skills` from parity-mirrored Claude/Codex skills into a plural-by-default operating model with three first-class modes (`claude-only`, `codex-only`, `hybrid`), a shared approval/delegation packet contract, and next-step routing across every planning/execution skill.

**Completed:** 2026-04-19. Shipped across 11 implementation steps + an empirical Verify micro-step. Full per-step detail lives in `tasks/todo.md` § "Phase 11" and `tasks/history.md`. Authoritative operating-model reference: `docs/operating-modes.md`.

### Highlights

- **Mode signal + resolver.** `scripts/agent-mode.sh` resolves the effective mode via precedence `SKILLS_AGENT_MODE` env > `.agents/project.json.agent_mode` > unset. Writer: `scripts/pack.sh set-mode`.
- **Approval packet.** `specs/approved-plan.schema.json` defines the shared cross-CLI contract. `scripts/approved-plan.sh` implements the full lifecycle (`draft → approved → consumed | stale | superseded | uncertain`) with atomic transitions and six freshness checks (`consume` at the Codex boundary via `$run --execute-approved`).
- **In-session delegation.** `/delegate` (Claude) provides the hybrid-only bridge: drafts + approves a packet and invokes `codex exec "<target> --execute-approved"` with explicit pre-start / success / ambiguous safe-fallback branches and a `mark-uncertain` escape hatch. Never blind-retries cross-CLI. `/handoff --target=codex` covers the async case.
- **Next-step routing.** 12 planning/execution skills (6 Claude + 6 Codex) carry a shared "Next-Step Routing" block that emits Next work plus Recommended next command. `hybrid` on Claude recommends `/delegate`; `hybrid` on Codex recommends returning to Claude (Claude orchestrates).
- **Pack emphasis.** `docs/operating-modes.md` § "Pack emphasis" tags every global skill and pack with a primary role (`Claude-orchestration` / `Codex-execution` / `Both`). Codex `$run` uses pack-aware routing to substitute `-kanban` variants when an enabled pack ships them.
- **Degraded-path audit.** 19-row table in `docs/operating-modes.md` § "Degraded-path audit" covers every cross-CLI touchpoint with an explicit fallback or mode constraint.
- **Authoritative reference.** `docs/operating-modes.md` (~280 lines) is the single source of truth: mode-signal resolution, approval packet (fields / lifecycle / safety / freshness), degraded-path audit, pack emphasis, and a migration guide from the parity-mirror model.

### Verify (empirical acceptance)

Completed 2026-04-19. Ran each of the three modes through the mode-resolution + approval-packet machinery; confirmed `claude-only` and `codex-only` never write a packet while `hybrid` drives the full `draft → approved → consumed` lifecycle. Spot-checked `/delegate` mode-mismatch under `claude-only` (contract) and TTL-triggered `approved → stale` transition (live). Evidence: `tasks/verify-phase-11.md`. Two non-blocking gaps logged for a future follow-up (source-state guard parity between `mark-stale` and `mark-uncertain`; hybrid-cycle mirror-commit UX nuance).

**Step 12 (tail, 2026-04-19):** Both Verify gaps closed. `scripts/approved-plan.sh mark-stale` now rejects every non-`approved` source state with a consistent single-line reason (parity with `mark-uncertain`). `docs/operating-modes.md` § "Degraded-path audit" + `global/claude/delegate/SKILL.md` step 2 document the hybrid back-to-back mirror-commit prerequisite. No mechanism redesign, no schema change.

**Step 13 (tail, 2026-04-19):** Both Step 8 `jq`-dependency gaps closed. `global/claude/handoff/SKILL.md` step 5 preamble and `global/codex/run/SKILL.md` step 6c both now declare `jq` a hard dependency and cite the exact `require_jq_write` failure text from `scripts/approved-plan.sh:21`. `docs/operating-modes.md` audit table's two `⚠ gap — follow-up` cells updated to cite the new declarations; § "Gaps surfaced by Step 8" preserved as audit trail with a dated resolution line. Doc-only.

---

## Phase 1: Kanban Skill Suite ✓

**Goal:** Create a parallel set of `-kanban` workflow skills that manage kanban board state alongside their normal operations. Board lists: Backlog → Todo → In Progress → Done → Punt.

### Prerequisites (done)
- `/poketo-kanban` skill — low-level board CRUD
- `/sync-roadmap-kanban` skill — standalone reconciliation with board auto-detection via `tasks/.kanban-board`

### Steps

1. **`brainstorm-kanban`** (Claude + Codex)
   - Full copy of `/brainstorm` with kanban ops added
   - After generating ideas, create one card per idea in the Backlog list
   - Card name: idea title. Card description: idea details, effort estimate, category

2. **`spec-interview-kanban`** (Claude + Codex)
   - Full copy of `/spec-interview` with kanban ops added
   - After validating/speccing an idea, find the matching Backlog card and update it with spec details
   - If no matching card exists, create one in Backlog with the spec summary

3. **`roadmap-kanban`** (Claude + Codex)
   - Full copy of `/roadmap` with kanban ops added
   - After building the phased plan, move specced Backlog cards to the Todo list
   - Create Todo cards for any roadmap phases/steps that don't have cards yet

4. **`run-kanban`** (Claude + Codex)
   - Full copy of `/run` with kanban ops added
   - At session start, move the current step's card from Todo to In Progress
   - Cross-device conflict detection: scan In Progress for cards from other hostnames, warn on overlap
   - After step completion, update the card (mark progress, add notes)

5. **`ship-kanban`** (Claude + Codex)
   - Full copy of `/ship` with kanban ops added
   - After shipping, move the step's card to Done
   - If work is deferred/blocked, move to Punt with a reason in the description
   - When planning next step, ensure the next card is in Todo

6. **`ship-end-kanban`** (Claude + Codex)
   - Full copy of `/ship-end` with kanban ops added
   - After wrapping up, move the session's In Progress card to Done with commit refs

### Milestone
- [x] Full kanban lifecycle works: brainstorm creates Backlog cards → spec-interview specs them → roadmap moves to Todo → run moves to In Progress (with conflict warnings) → ship/ship-end moves to Done or Punt

---

## Phase 2: Proactive Board Intelligence ✓

**Goal:** Agents use board state to make smarter decisions about what to work on.

### Steps

1. **Session start board check**
   - Kanban skills read the board at session start to understand project priorities
   - Surface overdue cards, blocked items, and high-priority backlog

2. **Auto-suggest next work**
   - After `/ship-end-kanban`, read the board and suggest the highest-priority unstarted card
   - Factor in due dates, starred status, and dependency order

3. **Progress tracking**
   - Update card `progress` field as agents complete sub-tasks within a step
   - `/run-kanban` updates progress percentage based on step completion within the phase

### Milestone
- [x] Agent recommends next task based on board state and project priorities

---

## Phase 3: Board Templates ✓

**Goal:** One-command board creation with the standard 5-list layout, reducing setup friction for new projects.

### Steps

1. **Add `--template standard` flag to kanban.mjs**
   - When `create-board` is called with `--template standard`, create board with the 5 lists: Backlog, Todo, In Progress, Done:done, Punt:punt
   - Keep existing `--lists` flag for custom layouts
   - `--template` and `--lists` are mutually exclusive

2. **Update -kanban skills' Board Resolution protocol**
   - When no board exists and user confirms creation, use `--template standard` instead of the long `--lists "Backlog,Todo,In Progress,Done:done,Punt:punt"` string
   - Update all 12 -kanban SKILL.md files (6 Claude + 6 Codex)

### Milestone
- [x] `create-board --template standard` creates a board with all 5 required lists in correct types

---

## Phase 4: Archive Automation ✓

**Goal:** Keep boards clean by archiving old Done/Punt cards automatically.

### Steps

1. **Add `archive-card` command to kanban.mjs**
   - New command: `archive-card --id <card-id>` — moves card to the board's archive
   - Uses the existing `archiveListId` field in the board schema
   - If no archive list exists, create one automatically

2. **Add `--archive` mode to `poketo-kanban` (Claude + Codex)**
   - Archive mode on the `poketo-kanban` skill archives Done/Punt cards older than N days (default 30)
   - Shows which cards will be archived, asks for confirmation before proceeding
   - Supports `--days <N>` to override the default threshold
   - Reports: how many cards archived, from which lists
   - (Originally shipped as a standalone `/kanban-archive` skill; later merged into `poketo-kanban --archive` — see `tasks/history.md`.)

### Milestone
- [x] `poketo-kanban --archive` cleans up Done/Punt cards older than 30 days with user confirmation

---

## Phase 5: Expert Review Fixes (2026-03-26) ✓

**Goal:** Resolve findings from `/expert-review` — credential leak, null dereference bug, stale docs, and missing codex manifest.

### Steps

1. **Remove leaked database credential from tracked file**
2. **Fix null dereference in `cmdArchiveCard`**
3. **Escape LIKE metacharacters in search**
4. **Batch list creation in `cmdCreateBoard`**
5. **Add missing `codex/spec-interview-ideas/agents/openai.yaml`**
6. **Fix stale output paths in `docs/skills-reference.md`**
7. **Add try/catch for malformed config JSON**

### Milestone
- [x] No credentials in tracked files, Neon password rotated
- [x] `cmdArchiveCard` handles orphaned list/board references gracefully
- [x] All codex skills have `agents/openai.yaml`
- [x] `docs/skills-reference.md` output paths match actual skill behavior

---

## Phase 6: Testing Hardening I ✓

**Goal:** Expand kanban.mjs test coverage with edge case and command-level tests to catch regressions like the Phase 5 LIKE injection and null dereference bugs.

**Acceptance Criteria:**
- [x] Edge case tests added: unicode card names, LIKE metacharacter queries (%, _, backslash as todo), moving card to same list, archiving already-archived card
- [x] create-list command has dedicated test coverage
- [x] update-card --progress, --description, --due flags each have at least one test
- [x] search with special characters has regression tests
- [x] All new + existing tests pass (53 passed, 1 todo — target was 40+)

**On Completion:**
- Deviations: `--description ""` no-op (falsy guard), no `--type` flag on create-list, move-card/board omit card `order`
- Tech debt: backslash search escape, empty description clearing, expose card `order` in responses
- Ready for next phase: yes

---

## Phase 7: Testing Hardening II ✓

**Goal:** Cover the remaining untested code paths: bootstrap-session.mjs, install.sh, and database error handling.

**Acceptance Criteria:**
- [x] bootstrap-session.mjs has unit tests (10 tests, temp file fixtures)
- [x] install.sh has vitest test suite covering happy path + error cases (8 tests)
- [x] At least 5 database error path tests (insert failure, FK violation, connection error)
- [x] Backslash LIKE escape bug fixed with regression test
- [x] All tests pass across all suites (77 tests)

**On Completion:**
- Deviations from plan: install.sh tests used vitest instead of bats-core (no new deps needed)
- Tech debt / follow-ups: empty description clearing (`--description ""`), expose card `order` in responses
- Ready for next phase: yes

---

## Phase 8: Kanban DX ✓

**Goal:** Improve kanban CLI ergonomics — scoped search, safer testing, and consistent env resolution.

**Scope**:
- Add `--board` flag to kanban search (spec: `specs/board-flag-kanban-search.md`)
- Dry-run mode for kanban skills (`--dry-run` shows intended ops without executing)
- Unify env path lists in bootstrap-session.mjs and kanban.mjs

**Acceptance Criteria:**
- [x] `search --board <id>` scopes results to specified board(s); repeatable flag works
- [x] Invalid `--board` ID exits with error (not silent empty results)
- [x] `--dry-run` flag on kanban skills shows intended card operations without DB writes
- [x] bootstrap-session.mjs and kanban.mjs share a single env path list
- [x] Existing tests still pass; new tests added (83 total)

**On Completion:**
- Deviations from plan: none
- Tech debt / follow-ups: empty description clearing (`--description ""`), expose card `order` in responses
- Ready for next phase: yes

---

## Phase 9: Skill Infrastructure ✓

**Goal:** Improve skill discoverability, validate cross-references, and track changes.

**Scope**:
- Skill discovery command (`/skills` with search and workflow-stage grouping)
- Skill dependency graph and validation (parse SKILL.md cross-references, detect broken refs)
- Skill versioning and changelog (semver in frontmatter, changelog tracking)

**Acceptance Criteria:**
- [x] `/skills` command lists skills grouped by workflow stage with keyword search
- [x] Dependency graph script detects broken cross-references between skills
- [x] At least one iteration of versioning scheme documented and applied to 3+ skills
- [x] No broken skill cross-references in the repo

**On Completion**:
- Deviations from plan: Versioning applied to all 43 skills (not just 3+). Skipped per-skill changelogs — git history suffices.
- Tech debt / follow-ups: Codex skill versioning deferred.
- Ready for next phase: Yes

---

## Phase 10: Headless API Migration ✓

**Goal:** Replace direct database kanban writes with a shared, authenticated Poketo headless API path so Claude and Codex both use the same app-layer permissions, validation, and audit logging.

**Why this phase exists:**
- Current kanban skills write through `kanban.mjs`, which talks directly to Neon using local DB credentials
- Codex skill variants currently depend on Claude install paths such as `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`
- The canonical Poketo business logic already lives in app-layer tRPC routers and gateway-adjacent adapters, but the headless work-tool surface is only partially wired
- Keeping separate write paths for Claude and Codex will continue to drift on auth, permissions, and board action semantics

### Steps

1. **Establish agent-friendly headless auth**
   - Define the supported auth path for automation agents (API key or equivalent durable headless auth)
   - Ensure local agent workflows do not require raw DB credentials for normal board operations
   - Document the migration and fallback expectations for existing `~/.poketo/config.json` session-based setups

2. **Finish wiring the Poketo Work headless tool layer**
   - Replace stubbed Work primitives/adapters with real tRPC-backed implementations for board/card/list operations
   - Ensure the shared surface exposes the kanban operations the skills need: board discovery, board details, board activity, board creation, list creation/update, card create/update/move/search, archive/restore
   - Reuse the app-layer routers so permission checks and `board_actions` logging come from the canonical Poketo boundary

3. **Expose the shared API/gateway path for agent use**
   - Make the headless Work operations available through the existing gateway/CLI surface used by agents
   - Verify tool discovery and execution work without depending on direct DB access
   - Ensure the response shapes are good enough to support existing kanban skill workflows without fragile parsing

4. **Migrate Claude kanban skills** ✅
   - Update Claude kanban skills to use the shared headless path instead of direct DB writes through `kanban.mjs`
   - Preserve current workflow behavior where possible: board resolution, list validation, conflict checks, progress updates, archive flow
   - Keep `kanban.mjs` only as a temporary fallback/admin tool during rollout

5. **Migrate Codex kanban skills** ✅
   - Remove Codex dependence on Claude-specific install paths
   - Point Codex kanban skills at the same shared headless path Claude uses
   - Update docs and assumptions so Codex is no longer described as operating through the Claude-side kanban script

6. **Deprecate the standalone DB-write path** ✅
   - Mark `kanban.mjs` direct-write mode as fallback-only once both toolchains are migrated
   - Remove it from the default documented workflow after shared headless usage is verified
   - Keep only the minimum rescue/admin functionality if there is still an operational need

### Acceptance Criteria

- [x] Claude and Codex kanban skills use the same app-layer write path for normal board operations
- [x] No kanban skill requires `POKETOWORK_DATABASE_URL` for standard usage
- [x] Codex kanban skills no longer reference `~/.claude/skills/...` paths
- [x] Shared headless operations cover the current kanban workflow needs: board discovery/details/activity, create board/list/card, update card, move card, search, archive/restore
- [x] Board permissions and `board_actions` logging come from the canonical Poketo app layer rather than the standalone script
- [x] `kanban.mjs` is documented as fallback/admin-only or removed from the default workflow

### Notes / Risks

- Auth is the main dependency. If the gateway/API-key flow is not usable for agents, the migration will stall.
- The Work tool layer and gateway surface must be completed before migrating the skill docs, otherwise the skills will lose functionality.
- Claude and Codex should migrate to the same target surface in close succession to avoid long-lived behavioral drift.

---

## Phase 12: Creator Platform Evidence Foundation ✓

**Goal:** Add the shared creator-media foundation for non-YouTube platforms: a platform capability matrix and normalized evidence schema that future platform-specific skills can consume.

**Source Spec:** `specs/creator-platform-evidence-schema.md`

**Scope:**
- Add mirrored Claude/Codex `creator-platform-capability-matrix` skill definitions.
- Add mirrored Claude/Codex `creator-evidence-schema` skill definitions.
- Define output artifacts under `research/creator-platforms/`.
- Document supported baseline collection methods: `export`, `manual_snapshot`, `rss_feed`, `public_page_capture`, `open_source_tool`, and `free_api`.
- Update creator-media pack docs and global skill references so the new foundation appears before platform-specific audits.
- Validate mirrored skill metadata, references, and required output-path language.

**Acceptance Criteria:**
- [x] `creator-platform-capability-matrix` exists for both Claude and Codex.
- [x] `creator-evidence-schema` exists for both Claude and Codex.
- [x] The capability matrix skill records platform evidence sources, fields, missing fields, metric availability, audit depth, operational risk, and recommended next skill.
- [x] The schema skill defines normalized evidence records, metric confidence, evidence confidence, capture method, auth context, raw evidence paths, and privacy notes.
- [x] Pack docs route non-YouTube creator-media work through the foundation before platform-specific skills.
- [x] Validation passes with skill dependency/version checks and targeted reference scans.

**Parallelization:** serial
**Coordination Notes:** This phase changes shared pack contracts and docs, so keep it integrated. Later platform-specific work should depend on this schema instead of creating incompatible evidence fields.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, docs/API conformance

**Subagent lanes:** none

### Implementation
- Step 12.1: Create mirrored `creator-platform-capability-matrix` skill contracts.
  - Files: create `packs/creator-foundation/claude/creator-platform-capability-matrix/SKILL.md`, create `packs/creator-foundation/codex/creator-platform-capability-matrix/SKILL.md`
  - Include platform rows for LinkedIn personal profile, LinkedIn company page, personal website/blog, newsletter, podcast, GitHub, X/Threads/Instagram/TikTok, and Bluesky/Mastodon.
  - Require output at `research/creator-platforms/capability-matrix.md`.
  - Require columns for evidence sources, likely fields, missing fields, metric availability, body/media/transcript availability, peer benchmarking practicality, operational risk, audit depth, and recommended next skill.
  - Classify collection methods as `export`, `manual_snapshot`, `rss_feed`, `public_page_capture`, `open_source_tool`, or `free_api`.
- Step 12.2: Create mirrored `creator-evidence-schema` skill contracts.
  - Files: create `packs/creator-foundation/claude/creator-evidence-schema/SKILL.md`, create `packs/creator-foundation/codex/creator-evidence-schema/SKILL.md`
  - Require output at `research/creator-platforms/evidence-schema.md`.
  - Define raw evidence root `research/creator-platforms/data/<platform>/<slug>/`.
  - Define normalized record fields for `evidence_id`, `platform`, `source_type`, `source_url`, `raw_path`, `captured_at`, `capture_method`, `auth_context`, `terms_risk`, `title`, `body_text_path`, `published_at`, `creator_role`, `media_type`, `topic_tags`, `content_role`, `metrics`, `metric_confidence`, `evidence_confidence`, privacy notes, and review notes.
  - State that optional metrics must not be invented and missing metrics/bodies must be recorded as evidence gaps.
- Step 12.3: Wire the foundation into creator-media pack docs and discovery references.
  - Files: modify `packs/creator-foundation/PACK.md`, modify `packs/creator-media/PACK.md`, modify `README.md`, modify `docs/skills-reference.md`
  - Put `creator-platform-capability-matrix` and `creator-evidence-schema` before platform-specific audits in the creator-media skill list and default flow.
  - Document that YouTube-specific work may still start at `youtube-channel-audit`, while non-YouTube or mixed-platform work starts with the foundation.
- Step 12.4: Align creator-media next-skill routing with the new foundation.
  - Files: modify `packs/creator-foundation/claude/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-foundation/codex/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-foundation/claude/creator-evidence-schema/SKILL.md`, modify `packs/creator-foundation/codex/creator-evidence-schema/SKILL.md`, inspect existing `packs/creator-foundation/{claude,codex}/*/SKILL.md` and `packs/youtube-ops/{claude,codex}/*/SKILL.md`
  - Ensure the new skills emit `Recommended next skill: <command>` in the final response.
  - Route matrix to schema by default; route schema to the future creator presence dossier when present, otherwise to platform-specific audits or `creator-positioning` based on available evidence.
  - Preserve existing YouTube workflow routing unless a non-YouTube evidence foundation is missing.

### Green
- Step 12.5: Write regression validation coverage for Phase 12 acceptance criteria.
  - Files: modify `tasks/todo.md` review section with exact validation commands and results
  - Run targeted scans confirming mirrored new skill files, frontmatter names, output paths, collection method language, normalized schema fields, LinkedIn baseline language, and pack-doc routing.
- Step 12.6: Run repository validation.
  - Files: no source changes expected
  - Run `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, targeted `rg` checks, `git diff --check`, and perform only concrete cleanup found by validation.

### Milestone: Creator Platform Evidence Foundation
**Acceptance Criteria:**
- [x] `creator-platform-capability-matrix` exists for both Claude and Codex.
- [x] `creator-evidence-schema` exists for both Claude and Codex.
- [x] The capability matrix skill records platform evidence sources, fields, missing fields, metric availability, audit depth, operational risk, and recommended next skill.
- [x] The schema skill defines normalized evidence records, metric confidence, evidence confidence, capture method, auth context, raw evidence paths, and privacy notes.
- [x] Pack docs route non-YouTube creator-media work through the foundation before platform-specific skills.
- [x] Validation passes with skill dependency/version checks and targeted reference scans.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: none.
- Tech debt / follow-ups: none.
- Ready for next phase: yes

---

## Phase 13: Creator Presence Dossier ✓

**Goal:** Add a repo-backed Markdown dossier skill that tracks a creator's public professional presence, career arc, platform roles, proof assets, and content opportunities over time.

**Source Spec:** `specs/creator-platform-evidence-schema.md`

**Scope:**
- Add mirrored Claude/Codex `creator-presence-dossier` skill definitions.
- Make the dossier consume `research/creator-platforms/capability-matrix.md`, `research/creator-platforms/evidence-schema.md`, and available creator evidence.
- Define output under `research/creator-presence/<slug>.md`.
- Include sections for identity, career timeline, platform map, core themes, expertise claims, proof assets, signature formats, audience/community signals, product/company links, evidence register, gaps, and next collection tasks.
- Update pack docs and references so the dossier feeds `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review`.

**Acceptance Criteria:**
- [x] `creator-presence-dossier` exists for both Claude and Codex.
- [x] The skill distinguishes public/professional evidence from private repo planning context.
- [x] The skill requires source paths, capture dates, confidence levels, and evidence gaps.
- [x] The dossier contract supports LinkedIn, personal websites, GitHub, podcasts, talks, newsletters, and product docs.
- [x] Follow-up routing recommends the correct creator-media strategy skill from dossier findings.
- [x] Validation passes with skill dependency/version checks and targeted reference scans.

**Parallelization:** serial
**Coordination Notes:** The dossier depends on the Phase 12 matrix/schema contract. Keep implementation serial because it touches pack routing and cross-skill handoffs.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, docs/API conformance

**Subagent lanes:** none

### Implementation
- Step 13.1: Create mirrored `creator-presence-dossier` skill contracts.
  - Classification: automated
  - Files: create `packs/creator-foundation/claude/creator-presence-dossier/SKILL.md`, create `packs/creator-foundation/codex/creator-presence-dossier/SKILL.md`
  - Require output at `research/creator-presence/<slug>.md`.
  - Require reading `research/creator-platforms/capability-matrix.md`, `research/creator-platforms/evidence-schema.md`, and available normalized/raw creator evidence before synthesis.
  - Require public/professional evidence boundaries so private repo planning context is excluded unless explicitly marked as internal notes.
  - Include final-response next-skill routing as `Recommended next skill: <command>`.
- Step 13.2: Define the dossier Markdown contract and evidence register requirements.
  - Classification: automated
  - Files: modify `packs/creator-foundation/claude/creator-presence-dossier/SKILL.md`, modify `packs/creator-foundation/codex/creator-presence-dossier/SKILL.md`
  - Require sections for identity, current public promise, career timeline, platform map, core themes, expertise claims, proof assets, signature formats, audience/community signals, product/company connections, gaps/contradictions/stale positioning, evidence register, next collection tasks, and recommended next skills.
  - Require evidence rows to include source path or URL, capture date, confidence level, public/private boundary, and evidence gaps.
  - Require support for LinkedIn, personal websites/blogs, GitHub, podcasts, talks, newsletters, and product docs when evidence is present.
- Step 13.3: Wire `creator-presence-dossier` into creator-media pack docs and discovery references.
  - Classification: automated
  - Files: modify `packs/creator-foundation/PACK.md`, modify `packs/creator-media/PACK.md`, modify `README.md`, modify `docs/skills-reference.md`
  - Put `creator-presence-dossier` after `creator-evidence-schema` and before platform-specific audits or strategy synthesis in creator-media skill lists and default flows.
  - Document that the dossier feeds `creator-positioning`, `content-programming`, `product-led-media-map`, and `creator-metrics-review`.
- Step 13.4: Align downstream creator-media routing with the dossier.
  - Classification: automated
  - Files: inspect and modify only as needed in `packs/creator-foundation/claude/creator-evidence-schema/SKILL.md`, `packs/creator-foundation/codex/creator-evidence-schema/SKILL.md`, `packs/creator-foundation/claude/creator-positioning/SKILL.md`, `packs/creator-foundation/codex/creator-positioning/SKILL.md`, `packs/creator-foundation/claude/content-programming/SKILL.md`, `packs/creator-foundation/codex/content-programming/SKILL.md`, `packs/creator-foundation/claude/product-led-media-map/SKILL.md`, `packs/creator-foundation/codex/product-led-media-map/SKILL.md`, `packs/creator-foundation/claude/creator-metrics-review/SKILL.md`, `packs/creator-foundation/codex/creator-metrics-review/SKILL.md`
  - Ensure schema routing can recommend the now-present dossier for mixed-platform, LinkedIn-first, career-signal, or owned-presence work.
  - Ensure strategy skills mention the dossier as a preferred creator context source without breaking the existing YouTube evidence flow.

### Green
- Step 13.5: Write regression validation coverage for Phase 13 acceptance criteria.
  - Classification: automated
  - Files: modify `tasks/todo.md` review section with exact validation commands and results
  - Run targeted scans confirming mirrored dossier skill files, frontmatter names, output path, required sections, public/private evidence boundaries, confidence/capture/source fields, supported source types, pack-doc routing, and final-response next-skill language.
- Step 13.6: Run repository validation.
  - Classification: automated
  - Files: no source changes expected
  - Run `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, targeted `rg` checks, `git diff --check`, and perform only concrete cleanup found by validation.

### Milestone: Creator Presence Dossier
**Acceptance Criteria:**
- [x] `creator-presence-dossier` exists for both Claude and Codex.
- [x] The skill distinguishes public/professional evidence from private repo planning context.
- [x] The skill requires source paths, capture dates, confidence levels, and evidence gaps.
- [x] The dossier contract supports LinkedIn, personal websites, GitHub, podcasts, talks, newsletters, and product docs.
- [x] Follow-up routing recommends the correct creator-media strategy skill from dossier findings.
- [x] Validation passes with skill dependency/version checks and targeted reference scans.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: Folded the conditional no-op wording cleanup into the validation gate to avoid a separate plan-mode handoff after clean checks.
- Tech debt / follow-ups: none.
- Ready for next phase: yes

---

## Phase 14: LinkedIn Evidence Lane ✓

**Goal:** Add LinkedIn-first free/manual evidence support that uses owner exports, manual snapshots, and public page captures without paid APIs, logged-in scraping, or access-control bypassing.

**Source Spec:** `specs/creator-platform-evidence-schema.md`

**Scope:**
- Add LinkedIn-specific collection guidance to the creator-media pack.
- Provide templates or skill guidance for owner-provided LinkedIn exports, profile snapshots, article/post snapshots, rich media evidence, recommendations, skills, and career timeline records.
- Define redaction guidance for sensitive export fields such as private contacts, messages, or relationship data.
- Add optional parsing/template support only where it can operate on local user-provided files.
- Route LinkedIn evidence into `creator-evidence-schema` and `creator-presence-dossier`.
- Document analytics as unavailable unless owner-provided; official company/page APIs are a later authorized lane, not a baseline dependency.

**Acceptance Criteria:**
- [x] LinkedIn evidence guidance is present in mirrored creator-media skills or a dedicated mirrored LinkedIn skill, depending on Phase 12/13 implementation shape.
- [x] The LinkedIn lane uses owner exports and manual/public snapshots as the baseline.
- [x] The lane explicitly forbids logged-in scraping, paid API dependency, bot-protection bypass, and private-data collection.
- [x] Redaction and privacy handling are documented before analysis.
- [x] LinkedIn records normalize into the shared evidence schema and dossier.
- [x] Validation passes with targeted checks for LinkedIn baseline, privacy constraints, and no paid/API-first language.

**Completed:** 2026-05-04. Hardened mirrored creator foundation skills for LinkedIn owner exports, manual snapshots, public unauthenticated captures, user-provided files, privacy redaction, unavailable analytics/API fields, forbidden scraping/API/private collection patterns, and dossier evidence classification. Updated creator-foundation, creator-media compatibility, README, and skills reference docs. Added deterministic layer1 coverage in `tests/layer1/creator-media-linkedin.test.ts`. Final validation passed with targeted scans, full layer1 tests, skill dependency/version/routing audits, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** LinkedIn access constraints are the highest-risk part of the expansion. Implement after the shared foundation and dossier exist so LinkedIn remains one evidence lane, not a special-case schema.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** correctness, tests, security, docs/API conformance

**Subagent lanes:** none

### Implementation
- Step 14.1: Harden the LinkedIn baseline in the platform foundation skills.
  - Classification: automated
  - Files: modify `packs/creator-foundation/claude/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-foundation/codex/creator-platform-capability-matrix/SKILL.md`, modify `packs/creator-foundation/claude/creator-evidence-schema/SKILL.md`, modify `packs/creator-foundation/codex/creator-evidence-schema/SKILL.md`
  - Make owner exports, manual snapshots, public unauthenticated page captures, and user-provided files the default LinkedIn collection lane.
  - Treat LinkedIn personal analytics, company/page analytics, and API fields as unavailable unless owner-provided or already authorized.
  - Require redaction/exclusion guidance for private contacts, messages, relationship data, sensitive account data, and unrelated personal information before analysis.
  - Require high-risk LinkedIn surfaces to stop for user-provided evidence instead of attempting logged-in scraping, bot-protection bypass, paywall access, or access-control circumvention.
- Step 14.2: Make the creator presence dossier explicitly consume LinkedIn evidence without leaking private material.
  - Classification: automated
  - Files: modify `packs/creator-foundation/claude/creator-presence-dossier/SKILL.md`, modify `packs/creator-foundation/codex/creator-presence-dossier/SKILL.md`
  - Add LinkedIn evidence-register requirements for profile exports, profile snapshots, posts/shares, articles, rich media, recommendations, skills, positions, education, company pages, and manual/public snapshots when provided.
  - Require the dossier to classify LinkedIn evidence as public, owner-provided, admin-provided, internal notes, or mixed/redaction needed.
  - Route private or mixed LinkedIn material to redaction/exclusion before synthesis.
- Step 14.3: Update creator-media pack and discovery docs for the LinkedIn lane.
  - Classification: automated
  - Files: modify `packs/creator-foundation/PACK.md`, modify `packs/creator-media/PACK.md`, modify `README.md`, modify `docs/skills-reference.md`
  - Document the LinkedIn-first lane as part of the existing matrix/schema/dossier workflow rather than a standalone scraper.
  - State that LinkedIn collection starts from owner exports, manual snapshots, public unauthenticated captures, and user-provided files.
  - State that paid APIs, logged-in scraping, bot-protection bypass, private-data collection, and access-control circumvention are out of scope.
- Step 14.4: Add focused validation coverage for LinkedIn lane contracts.
  - Classification: automated
  - Files: modify `tests/layer1/routing-graph.test.ts` or create `tests/layer1/creator-media-linkedin.test.ts`
  - Add layer1 checks that mirrored Claude/Codex creator-media contracts include LinkedIn baseline language, redaction/privacy language, normalized evidence routing, and forbidden access patterns.
  - Keep checks structural and deterministic; do not require network, LinkedIn credentials, or external exports.

### Green
- Step 14.5: Run focused validation for the LinkedIn evidence lane.
  - Classification: automated
  - Files: modify `tasks/todo.md`
  - Run targeted `rg` checks over creator-foundation pack skills and creator-media compatibility docs for owner export/manual snapshot/public capture baseline, redaction language, normalized schema/dossier routing, and forbidden scraping/API-first language.
  - Run `pnpm --dir tests test`.
  - Run `./scripts/skill-deps.sh --broken`.
  - Run `./scripts/skill-versions.sh --missing`.
  - Run `./scripts/skill-next-step-routing.sh --missing`.
  - Run `git diff --check`.
  - Record exact command results in the `tasks/todo.md` review section and perform only concrete cleanup found by validation.

### Milestone: Phase 14 LinkedIn Evidence Lane
**Acceptance Criteria:**
- [x] LinkedIn evidence guidance is present in mirrored creator-media skills or a dedicated mirrored LinkedIn skill, depending on Phase 12/13 implementation shape.
- [x] The LinkedIn lane uses owner exports and manual/public snapshots as the baseline.
- [x] The lane explicitly forbids logged-in scraping, paid API dependency, bot-protection bypass, and private-data collection.
- [x] Redaction and privacy handling are documented before analysis.
- [x] LinkedIn records normalize into the shared evidence schema and dossier.
- [x] Validation passes with targeted checks for LinkedIn baseline, privacy constraints, and no paid/API-first language.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**On Completion:**
- Deviations from plan: Step 14.4 validation found two documentation wording gaps, which were fixed before the final validation gate.
- Tech debt / follow-ups: none.
- Ready for next phase: no; Phases 15-26 are already complete, so future work should come from discovery or a new roadmap phase.

## Phase 15: YouTube Video Audit ✓

**Goal:** Add an evidence-first single-video YouTube audit skill that analyzes public metadata, transcript/content, packaging, release timing, comments, and optional owner analytics for one video.

**Source Spec:** User request and YouTube API/docs research on 2026-05-03.

**Scope:**
- Add mirrored Claude/Codex `youtube-video-audit` skill definitions to the creator-media pack.
- Default to public evidence through `yt-dlp`, public transcript tooling, and optional YouTube Data API enrichment when `YOUTUBE_API_KEY` is already available.
- Support optional owner-provided analytics exports or OAuth/API output for retention, impressions/CTR, traffic sources, watch time, average view duration, subscriber change, shares, and time-series performance.
- Persist raw evidence under `research/youtube/data/<video-id>/` and write `research/youtube/video-audit-<video-id>-YYYY-MM-DD.md`.
- Wire pack docs and discovery references so single-video work routes to `youtube-video-audit` without replacing channel-level `youtube-channel-audit`.

**Acceptance Criteria:**
- [x] `youtube-video-audit` exists for both Claude and Codex.
- [x] The skill has a public-first evidence path and optional owner-analytics path.
- [x] The skill distinguishes public evidence from owner-provided/private analytics and records evidence gaps.
- [x] The report contract covers release timing, performance snapshot, packaging, hook/content structure, transcript evidence, comments/audience response, and prioritized fixes.
- [x] Creator-media docs/reference lists include `youtube-video-audit` and preserve the existing channel audit flow.
- [x] Validation passes with skill dependency/version checks and targeted routing scans.

**Parallelization:** serial
**Coordination Notes:** Keep this serial because it touches mirrored skills, pack routing, and docs. Do not add dependencies or GitHub Actions.

**Completed:** 2026-05-03. Mirrored Claude/Codex `youtube-video-audit` skills were added to the creator-media pack, documentation references now expose the single-video lane beside channel audits, and validation passed with dependency/version checks, targeted evidence-boundary scans, docs routing scans, and `git diff --check`.

## Phase 26: Monorepo Pack V1 ✓

**Goal:** Create a new `monorepo` pack that makes the skill library monorepo-aware using an augmentation injection pattern. V1 ships four skills (mono-detect, mono-run, mono-ship, mono-guard) targeting pnpm workspaces + Turborepo, with a structured lane-spec artifact for parallel agent-team dispatch.

**Source Spec:** `specs/monorepo-execution-controller.md`

**Scope:**
- Create the `packs/monorepo/` pack structure with mirrored Claude/Codex skills.
- `mono-detect`: Workspace detection via `pnpm-workspace.yaml` and `turbo.json`, package graph output to `.agents/monorepo.json`.
- `mono-run`: Augmented `/run` with lane-spec generation, `/mono-guard` pre-flight, parallel worktree dispatch for package-scoped steps, serial execution for cross-cutting steps, stop-all-lanes failure semantics.
- `mono-ship`: Augmented `/ship` with package-scoped and transitive-dependent test/lint/build validation before shipping.
- `mono-guard`: Pack-local boundary enforcement consuming the lane-spec artifact for pre-flight and post-integration validation.
- Structured lane-spec artifact: `.agents/lane-specs.json` (machine-readable) + `tasks/lane-specs.md` (committed Markdown mirror) with lifecycle `draft → approved → dispatched → integrated | failed`.
- Detection script `scripts/mono-detect.sh` and validation script `scripts/lane-spec-validate.sh`.
- Script-based validation `scripts/monorepo-validate.sh` for contract compliance, lane-spec schema, and detection correctness.
- Test fixtures for monorepo detection and lane-spec validation.
- Pack docs (`PACK.md`), README registration, `docs/skills-reference.md` updates, and `docs/packs.md` updates.

**Acceptance Criteria:**
- [x] `mono-detect` correctly identifies pnpm workspaces and Turborepo, outputs `.agents/monorepo.json` with package list and dependency graph.
- [x] `mono-run` generates lane specs from roadmap execution profiles, runs `/mono-guard` pre-flight, dispatches parallel worktree agents for package-scoped steps, and runs cross-cutting steps serially.
- [x] `mono-run` stops all lanes on any lane failure and preserves worktree state.
- [x] `mono-ship` runs package-scoped and transitive-dependent tests/lint/build before delegating to `/ship`.
- [x] `mono-guard` validates lane-spec disjointness pre-flight and boundary compliance post-integration.
- [x] Lane-spec artifact follows JSON + Markdown mirror pattern with lifecycle tracking.
- [x] Skills defer to `turbo run` when `turbo.json` is present, fall back to `pnpm --filter` otherwise.
- [x] Mirrored Claude/Codex skill contracts exist for all v1 skills.
- [x] Pack structure registered in README, `docs/skills-reference.md`, and `docs/packs.md`.
- [x] Script-based validation passes for contracts, lane-spec schema, detection, and boundary checks.
- [x] All phase tests pass.
- [x] No regressions in previous phase tests.

**Completed:** 2026-05-04. Added the monorepo pack V1 with mirrored Claude/Codex `mono-detect`, `mono-run`, `mono-ship`, and `mono-guard` skills, Codex metadata, detection and lane-spec validation scripts, pack validation script, committed fixtures, and discovery docs. Final focused validation passed with fixture-backed `monorepo-validate.sh`, direct lane-spec positive/negative checks, direct `mono-detect.sh` fixture runs, targeted contract scans, layer1 tests, skill dependency/version/routing audits, `git diff --check`, and the ship quality gate.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this creates a new pack with interdependent skills (detect → guard → run → ship). The lane-spec artifact design must be settled before run/guard can reference it. The pack also touches shared docs (README, skills-reference, packs.md).

**On Completion:**
- Deviations from plan: none.
- Tech debt / follow-ups: Monorepo Pack V2 remains deferred until V1 is validated in real use.
- Ready for next phase: yes.

## Phase 27: Analyze-Sessions Targeted Skill Retrospectives ✓

**Goal:** Extend the existing mirrored `analyze-sessions` skill so it can audit a particular skill's performance in a repository or active agent session, verify a user-identified mistake against session/code evidence, and recommend concrete skill-contract fixes that prevent the mistake from recurring.

**Source:** User request on 2026-05-05 asking for an analyze-sessions workflow that can evaluate a skill from `agentic-skills` or the invoking agent's repo/session directory and produce feedback after agent verification.

**Scope:**
- Preserve the current broad usage-history analysis behavior.
- Add a targeted skill-retrospective mode triggered by a named skill, skill path, repository path, session path, or mistake description.
- Teach the workflow to resolve skill definitions from `agentic-skills`, pack-local/project-local skill locations, and the invoking repo/session metadata.
- Require evidence-backed verification of the mistake before recommending fixes.
- Produce specific `SKILL.md` changes, validation checks, and lesson-capture recommendations without pretending unverifiable claims are proven.
- Mirror the updated contract for Claude and Codex.

**Acceptance Criteria:**
- [x] `global/codex/analyze-sessions/SKILL.md` documents targeted skill-performance retrospectives.
- [x] `global/claude/analyze-sessions/SKILL.md` documents the same targeted retrospective workflow.
- [x] The workflow distinguishes user-identified mistakes from agent-verified mistakes.
- [x] The workflow can scope evidence to the current repo/session directory before broad history scanning.
- [x] The output contract includes root cause, skill-contract fixes, validation checks, and confidence/evidence gaps.
- [x] Validation passes with mirrored contract checks, version checks, targeted text scans, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this updates mirrored global skills and shared task docs. Do not add dependencies or GitHub Actions.

**Completed:** 2026-05-05. Updated mirrored Claude/Codex `analyze-sessions` contracts to add targeted skill retrospectives while preserving broad history analysis. The new mode resolves skills from shared, pack-local, project-local, installed, and session-derived scopes; requires evidence before calling a user-reported mistake agent-verified; and outputs concrete skill fixes plus validation plans. Validation passed with install, targeted mirrored scans, skill dependency/version/routing audits, layer1 tests, and `git diff --check`.

## Phase 28: Session Triage Split ✓

**Goal:** Split the focused one-issue/session investigation behavior out of `analyze-sessions` into a distinct mirrored `session-triage` skill so broad trend analysis and immediate incident triage cannot be confused.

**Source:** User request on 2026-05-05 after Phase 27, noting that singular/plural command names like `analyze-session` and `analyze-sessions` could be mistaken for each other.

**Scope:**
- Restore `analyze-sessions` to broad cross-session trend, pattern, frustration, automation, and skill-performance-over-time analysis.
- Add mirrored Claude/Codex `session-triage` skills for one immediate issue, correction, repo/session incident, or skill failure.
- Route single-session or one-mistake requests from `analyze-sessions` to `session-triage` instead of handling them directly.
- Add Codex `agents/openai.yaml` metadata for `session-triage`.
- Update discovery docs, skill listing guidance, next-step contracts, and `targeted-skill-builder` references.
- Record the naming lesson so future split workflows avoid near-identical singular/plural command pairs.

**Acceptance Criteria:**
- [x] `analyze-sessions` no longer owns targeted skill retrospective or single-incident triage behavior.
- [x] `session-triage` exists for Claude and Codex with verification verdict, timeline, root cause, skill fix, validation plan, confidence, and evidence-gap outputs.
- [x] No `analyze-session` skill or alias is created.
- [x] Discovery docs and `skills` grouping include `session-triage`.
- [x] `targeted-skill-builder` distinguishes `$session-triage` for immediate incidents from `$analyze-sessions` for broad history analysis.
- [x] Validation passes with install, skill dependency/version/routing checks, layer1 tests, targeted scans, and `git diff --check`.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches mirrored global skills and shared docs. Do not add dependencies or GitHub Actions.

**Completed:** 2026-05-05. Split immediate issue/session/correction investigations into mirrored `session-triage` skills, restored `analyze-sessions` to broad cross-session trend analysis, added Codex agent metadata, updated discovery and routing references, and recorded the naming lesson. Validation passed with install, skill dependency/version/routing checks, layer1 tests, targeted `rg`/directory scans, and `git diff --check`.

## Phase 29: Live Skill Harness ✓

**Goal:** Add an opt-in live-agent test harness that invokes Claude and Codex headlessly in controlled temporary repos, validates structured outputs, and catches skill-behavior regressions that structural tests cannot see.

**Source:** User request on 2026-05-06 asking for thorough live skill testing through Claude `-p` and Codex headless execution.

**Scope:**
- Add a layer3 Vitest project for live agent behavior tests.
- Keep live tests opt-in with an environment flag so routine `pnpm test` remains fast and does not spend model budget.
- Add reusable harness helpers for temp git fixtures, JSON schemas, Claude `-p`, and `codex exec`.
- Add session-analysis behavior scenarios covering broad trend routing, single-incident triage, required triage report fields, and the forbidden `analyze-session` alias.
- Add package scripts and docs describing how to run the live tests.

**Acceptance Criteria:**
- [x] `pnpm --dir tests test` still runs only fast layer1 tests by default.
- [x] `pnpm --dir tests test:live` runs the live layer3 suite when `LIVE_AGENT_TESTS=1` is set.
- [x] Live tests can target Claude, Codex, or both through documented environment flags.
- [x] Live tests use temporary repos and do not mutate tracked repo files.
- [x] Session-analysis live tests assert structured outputs for `analyze-sessions` and `session-triage`.
- [x] Validation passes with layer1 tests, skipped live-test dry run, live Claude/Codex runs, and skill contract scripts.

**Parallelization:** serial
**Coordination Notes:** Keep serial because this touches shared test infrastructure and package scripts. Do not add dependencies unless strictly necessary.

**Completed:** 2026-05-06. Added opt-in layer3 live-agent tests with reusable Claude/Codex headless runners, temp repo fixtures, structured JSON schemas, and session-analysis behavior assertions. Added scripts for all live tests and Claude/Codex-only targets, documented usage in README, and kept default tests on layer1 only. Validation passed with layer3 skipped dry run, live Claude and Codex runs, layer1 tests, skill contract scripts, and `git diff --check`. `tsc --noEmit` remains outside the validation gate because the existing tests package lacks Node type definitions.

---

## Phase 40: Workflow Hybrid Replay Pilot

**Goal:** Turn the `/workflows` Playful Lab into a hybrid chat-and-terminal replay pilot where step circles drive a compelling, benchmark-grounded recreation of successful skill runs.

**Source:** `specs/workflow-hybrid-replay-feature-interview.md` and the updated `/workflows` section of `specs/ui-skills-showcase-website.md` from 2026-05-17.

**Scope:**
- Replace the current primary step-card presentation in `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx` with a hybrid replay panel for the `/workflows` route.
- Keep `/workflows` as the pilot surface only; do not update homepage preview, catalog, or benchmark matrix visuals in this phase.
- Model workflow steps as structured replay states instead of expanding the positional `WorkflowStep` tuple.
- Render chat-style user and agent messages with embedded terminal, validation, artifact, and benchmark-proof blocks.
- Promote benchmark evidence from collapsed details into visible receipt blocks when persisted evidence exists.
- Preserve graceful non-benchmarked step states, reduced-motion behavior, keyboard-accessible step controls, and mobile overflow safety.

**Non-Goals:**
- Do not redesign homepage, catalog, packs, follow, inspect, or `/benchmarks` route surfaces.
- Do not change benchmark harness semantics or generate new benchmark reports.
- Do not add runtime dependencies or modify shared lockfiles.
- Do not create, modify, or recommend GitHub Actions.

**Acceptance Criteria:**
- [ ] `/workflows` renders a hybrid replay panel as the primary selected-step surface.
- [ ] Step circles change the active replay state and expose user prompt/command, agent response, artifact/result, and proof content for each step.
- [ ] Benchmarked steps show visible pass-rate, quality, agent/run metadata, and report/run artifact paths without requiring a collapsed details panel.
- [ ] Non-benchmarked steps render curated scenario transcript content and a clear no-receipt state.
- [ ] The implementation uses structured replay data rather than adding more positional fields to `WorkflowStep`.
- [ ] Mobile layouts constrain chat, command, report path, and benchmark output blocks without horizontal page overflow.
- [ ] Focused component/data tests, typecheck, build, and whitespace validation pass.

**Parallelization:** serial
**Coordination Notes:** Keep serial because the work is a visual/data-model pilot in one tightly coupled component family: `TuiWorkflow.tsx`, `workflow-data.ts`, `workflow.css`, shared showcase types, and focused tests. The design needs one integration owner to preserve the pilot's visual coherence.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** medium
**Review gates:** UX, tests, data contract, accessibility

**Subagent lanes:** none

### Implementation
- Step 40.1: Define structured replay data for workflow steps.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/workflow-data.ts`, modify `apps/skills-showcase/src/showcase/types.ts` if shared replay or receipt types are needed
  - Add a replay-oriented data shape with user message, agent message, terminal/proof block, artifact/result block, and optional benchmark receipt state.
  - Keep existing workflow metadata available for notebook context and homepage preview support.
  - Avoid adding more positional tuple fields to `WorkflowStep`.
- Step 40.2: Replace the active step card with the hybrid replay panel.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`
  - Render chat-style user/agent messages as the primary active-step content.
  - Embed terminal/proof and artifact/result blocks inside the replay.
  - Keep step circles, play/pause, previous/next, restart, reduced-motion behavior, and notebook context working.
- Step 40.3: Promote benchmark receipts into the visible replay.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`, modify `apps/skills-showcase/src/showcase/tui/workflow.css`
  - Use existing `workflowBenchmarks` data to show pass rate, quality, agent, run index, report path, and run artifact path when available.
  - Remove or demote the collapsed `View benchmark execution` details panel from the primary benchmarked-step experience.
  - Ensure no-receipt states are explicit for non-benchmarked steps.
- Step 40.4: Style and harden the `/workflows` replay pilot.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/tui/workflow.css`
  - Style chat messages, terminal/proof blocks, artifact/result blocks, and benchmark receipts within the existing playful blueprint theme.
  - Preserve mobile stacking and prevent horizontal overflow from long commands, report paths, and benchmark excerpts.
  - Preserve accessible focus states and readable contrast.

### Green
- Step 40.5: Write focused regression coverage for the replay pilot.
  - Classification: automated
  - Files: modify `apps/skills-showcase/src/showcase/workflows.test.tsx`, modify `tests/layer1/skills-showcase-benchmark-demo.test.ts` if generated data contract assertions need updates
  - Cover replay data presence, active-step rendering, step-circle navigation, benchmark receipt rendering, and non-benchmarked receipt state.
- Step 40.6: Run app validation and visual sanity checks.
  - Classification: automated
  - Files: modify `tasks/todo.md` with review results
  - Run `pnpm --dir apps/skills-showcase test`.
  - Run `pnpm --dir apps/skills-showcase typecheck`.
  - Run `pnpm --dir apps/skills-showcase build`.
  - Run `scripts/validate-skills-showcase-data.sh` if generated data or showcase assets change.
  - Run `git diff --check`.
  - Start the local app if needed and verify `/workflows` at desktop and mobile widths before shipping.

### Milestone: Phase 40 Workflow Hybrid Replay Pilot
**Acceptance Criteria:**
- [ ] `/workflows` renders a hybrid replay panel as the primary selected-step surface.
- [ ] Step circles change the active replay state and expose user prompt/command, agent response, artifact/result, and proof content for each step.
- [ ] Benchmarked steps show visible pass-rate, quality, agent/run metadata, and report/run artifact paths without requiring a collapsed details panel.
- [ ] Non-benchmarked steps render curated scenario transcript content and a clear no-receipt state.
- [ ] The implementation uses structured replay data rather than adding more positional fields to `WorkflowStep`.
- [ ] Mobile layouts constrain chat, command, report path, and benchmark output blocks without horizontal page overflow.
- [ ] Focused component/data tests, typecheck, build, and whitespace validation pass.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

---

## Post-Phase Tail Work

- **2026-05-14 — Skills Showcase Playful Lab sitewide refactor plan:** Evaluate whether to refactor the full Skills Showcase UI around the Playful Lab / playful blueprint direction rather than only the `/workflows` player. Scope includes replacing legacy card-heavy route, catalog, pack, proof, follow, and benchmark surfaces with lab-style ledgers, rails, lane maps, notebook panels, and inspection drawers before implementation.
- **2026-05-01 — Creator-media packaging/search/cadence skills:** Added focused YouTube strategy skills for title/thumbnail audit, search positioning, and cadence diagnosis so the pack can turn channel audit and peer benchmark evidence into packaging fixes and programming inputs.
- **2026-05-12 — YouTube concept research skill:** Add a concept-first YouTube research workflow to `youtube-ops` that starts from a proposed video concept, finds direct and adjacent successful comparables, separates public evidence from performance hypotheses, and produces differentiated execution lessons before scripting or production.
- **2026-05-13 — Benchmark `session-triage`:** Run `$benchmark-test-skill session-triage` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Target skill has custom coverage through `tests/layer4/setups/tier1-workflows.setup.ts`.
- **2026-05-13 — Agent-review `session-triage` benchmark:** Run `$benchmark-agent-review session-triage` over the latest persisted Claude/Codex benchmark outputs, grade generated artifacts against the subjective review rubric, write `benchmark/review-session-triage-2026-05-13.md`, validate, commit, and push.
- **2026-05-13 — Tighten `session-triage` over-remediation rubric:** Update the custom benchmark quality rubric so one-off noncompliance with an adequate validation contract cannot keep an acceptable quality score when it routes to unconditional skill or contract edits.
- **2026-05-14 — Benchmark `content-programming` fresh full-contract run:** Run `$benchmark-test-skill content-programming` after the full-contract coverage and fixture-evidence rubric fixes, write the dated benchmark report, refresh generated showcase evidence, validate, commit, and push.
- **2026-05-14 — Agent-review `content-programming` fresh full-contract benchmark:** Review the latest Claude/Codex `content-programming` outputs after the full-contract benchmark run, refresh the dated review report, regenerate showcase data, validate, commit, and push. Result: six evaluated outputs reviewed, median subjective score 92.0, range 90-94, no remediation required. Recommended next command: `$ship`.
- **2026-05-14 — Benchmark `icon-handler` fresh rerun:** Run `$benchmark-test-skill icon-handler` after the valid-source-asset fixture fix, write the dated benchmark report, validate, commit, and push. Result: verify passed; both Claude and Codex completed 3 evaluated runs with 2/3 hard assertions passing and no infrastructure blocks. Report: `benchmark/test-icon-handler-2026-05-14.md`. Recommended next command: `$session-triage icon-handler benchmark failure`.
- **2026-05-14 — Triage `icon-handler` benchmark failure:** Investigate the fresh failed Claude/Codex benchmark assertions, classify contract versus harness versus runner noncompliance, write a dated triage report, validate, commit, and push. Result: verified mixed failure; primary durable gap is benchmark route clarity, while Codex no-artifact run is runner noncompletion. Report: `benchmark/triage-icon-handler-2026-05-14.md`. Recommended next skill: `$targeted-skill-builder icon-handler benchmark route clarity`.
- **2026-05-14 — Tighten `icon-handler` benchmark route clarity:** Update the custom benchmark prompt/rubric so build commands remain verification commands and the final next route must be `/icon-handler fix ...` for Claude or `$icon-handler fix ...` for Codex. Result: added final-route evaluator coverage, switched the source fixture to SVG to avoid Claude image ingestion, and passed Claude/Codex smoke benchmarks. Recommended next command: `$benchmark-test-skill icon-handler`.
- **2026-05-16 — Benchmark `ship`:** Run `$benchmark-test-skill ship` through eligibility, verify, both-agent benchmark, dated report generation, validation, commit, and push. Result: verify passed; both Claude and Codex completed 3 evaluated runs with 3/3 hard assertions passing and no infrastructure blocks, but both had deterministic quality critical failures on `evidence-linked`. Report: `benchmark/test-ship-2026-05-16.md`. Recommended next skill: `$session-triage ship benchmark failure`.

## Deferred / Future Work
- **Kanban analytics** — cycle time, throughput, WIP limits via `/kanban-stats` skill (from original backlog)
- **Two-way Neon ↔ poketowork UI sync** — webhook on git push (from original backlog)
- **Kanban card labels** — tags/labels field for filtering by type (deferred to after Phase 8)
- **Multi-project kanban dashboard** — cross-board view (larger initiative, deferred)
- **Add Codex poketo-kanban skill** — parity item, low priority
- **Cross-tool portability layer** — single-source skill generation (larger initiative)
- **Workflow orchestrator / meta-skill** — guided pipeline execution (larger initiative; partially addressed by Phase 26 monorepo pack)
- **Monorepo Pack V2** — planning skills (mono-roadmap, mono-plan-phase, mono-spec-interview), analysis skills (mono-affected, mono-debug, mono-trace, mono-investigate), and mono-migrate (single-app → monorepo migration with guided execution). Deferred until V1 is validated in real use.
- **Session continuity automation** — `/resume` skill for cold-start (medium effort)

## Cross-Phase Concerns
### Integration Tests
- All new tests must pass alongside existing 24 kanban.mjs tests
- Phase 6-7 tests should be runnable via `vitest` with existing config
### Non-Functional Requirements
- No credentials in test fixtures or tracked files
- Test suites must clean up after themselves (delete test boards/cards)
