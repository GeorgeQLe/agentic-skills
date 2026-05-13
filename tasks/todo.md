# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** All 39 roadmap phases complete.
**Last completed phase:** Phase 39 — Benchmark Results Visibility And Safe Git Fixtures

## Ad-Hoc Targeted Skill Update: session-triage Benchmark Over-Remediation Rubric

**Goal:** Tighten the `session-triage` benchmark rubric so reports that identify adequate existing contracts do not get full credit for unconditional `$targeted-skill-builder` remediation.

**Plan:**
- [x] Confirm the fix belongs in the benchmark fixture/rubric and layer1 setup tests, not the `session-triage` skill contract.
- [x] Add a deterministic quality criterion that penalizes unconditional skill-builder routing when a report says the existing contract is adequate or the issue is one-off agent noncompliance.
- [x] Add layer1 regression coverage for accepted no-skill-change routing and rejected over-remediation routing.
- [x] Run focused layer1 setup/quality tests, benchmark coverage, target verify, install/skill contract checks, and whitespace validation.
- [x] Record results here, then commit and push intended changes on `master`.

**Review:** Complete. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the `session-triage` quality rubric includes a critical `no-over-remediation-route` criterion. It penalizes reports that recommend `$targeted-skill-builder` unconditionally while also framing the incident as one-off agent noncompliance or an adequate existing contract. Updated `tests/layer1/bench-setups.test.ts` to prove `Recommended next skill: none` passes this branch and unconditional `$targeted-skill-builder run` fails it. Validation passed with `pnpm --dir tests test:layer1 -- bench-setups bench-quality`, `pnpm --dir tests bench:coverage`, `./install.sh`, skill dependency/version/routing checks, `pnpm --dir tests verify --skill session-triage`, and `git diff --check`. Recommended next command: `$benchmark-test-skill session-triage`.

## Ad-Hoc Benchmark: session-triage Fresh Rerun 2026-05-13 10:40

**Goal:** Run `$benchmark-test-skill session-triage` with fresh repository harness eligibility, verify, and both-agent benchmark evidence after the latest benchmark fixture routing fix.

**Plan:**
- [x] Confirm `session-triage` is a known benchmark harness target and record its coverage status. ✓ `coverage=custom`, `setup=tests/layer4/setups/tier1-workflows.setup.ts`.
- [x] Run `pnpm verify --skill session-triage` from `tests/` and stop if it fails. ✓ layer1 PASS (1,350 tests, 8.6s), layer2 SKIP (no target-specific tests).
- [x] If verify passes, run `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0`. ✓ Claude 3/3 (100.0%), Codex 3/3 (100.0%), no blocked runs.
- [x] Write and validate `benchmark/test-session-triage-2026-05-13.md` with verify, benchmark, latency, cost, consistency, and raw session evidence. ✓ Report updated with fresh 10:40 run data.
- [x] Record results here, then commit and push intended benchmark/task changes on `master`.

**Review:** Fresh benchmark rerun completed on 2026-05-13 at 10:40 ET. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.6s across 1,350 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 93.8% output quality, 1 critical quality failure, p50 latency 44.1s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 95.8% output quality, 1 critical quality failure, p50 latency 64.1s, and $0.75 total cost. Report validation passed with target, agent rows, pass-rate, latency, cost, consistency, raw session paths, and next-route evidence. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next skill: `$benchmark-agent-review session-triage`.

## Ad-Hoc Agent Review: session-triage Fresh Rerun 2026-05-13 10:40

**Goal:** Review the latest persisted `session-triage` Claude and Codex benchmark outputs for subjective operator quality after the fresh 10:40 benchmark rerun.

**Plan:**
- [x] Resolve the latest Claude and Codex run directories from `tests/benchmarks/runs/session-triage-*`. ✓ `session-triage-claude-e5f0772b` and `session-triage-codex-374ad6f0`.
- [x] Extract retained generated triage artifacts and benchmark context from each evaluated run. ✓ Claude retained stdout summaries; Codex retained full report text in transcripts.
- [x] Grade each evaluated output against the agent-review rubric without merging scores into deterministic benchmark metrics. ✓ 6 evaluated outputs scored separately from hard pass rates.
- [x] Write and validate `benchmark/review-session-triage-2026-05-13.md` with scores, findings, remediation, and next route. ✓ Required report fields present.
- [x] Record results here, then commit and push intended review/task changes on `master`.

**Review:** Complete. Reviewed `session-triage-claude-e5f0772b` and `session-triage-codex-374ad6f0`, covering 6 evaluated outputs and excluding no infrastructure-blocked runs. Deterministic benchmark context remained clean on hard assertions: both runners passed 3/3. Subjective median score was 78 with range 74-94. The best outputs were evidence-bound and routed to operational validation, but several over-remediated by recommending `$targeted-skill-builder` or `$run` contract edits even after identifying an adequate existing `$run` contract and likely one-off noncompliance. Report: `benchmark/review-session-triage-2026-05-13.md`. Recommended next command: `$targeted-skill-builder session-triage benchmark over-remediation rubric`.

## Ad-Hoc Targeted Skill Update: session-triage Evidence-Gate Over-Remediation Rubric

**Goal:** Tighten the `session-triage` benchmark rubric so reports that identify adequate existing contracts do not get full credit for re-labeling one-off noncompliance as a new `$run` evidence-gate or contract-change task.

**Plan:**
- [x] Confirm the fix belongs in the existing benchmark fixture/rubric and layer1 setup tests, not the `session-triage` skill contract.
- [x] Extend the `no-over-remediation-route` quality criterion to penalize evidence-gate or contract-change recommendations when the output also says the existing rule is adequate.
- [x] Add layer1 regression coverage for rejected `$run` evidence-gate over-remediation and accepted operational `$run` routing.
- [x] Run focused layer1 setup/quality tests, benchmark coverage, target verify, install/skill contract checks, showcase data refresh/validation, targeted `rg`, and whitespace validation.
- [x] Record results here, then commit and push intended changes on `master`.

**Review:** Complete. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so `no-over-remediation-route` fails outputs that call for skill or contract changes, including `$run` evidence-gate changes, after framing the incident as one-off noncompliance or an adequate existing contract. Updated `tests/layer1/bench-setups.test.ts` with regression cases proving evidence-gate over-remediation fails while operational `$run` routing passes. Regenerated Skills Showcase data and benchmark matrix artifacts. Validation passed with `pnpm --dir tests test:layer1 -- bench-setups bench-quality`, `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests bench:coverage`, `pnpm --dir tests verify --skill session-triage`, `node scripts/generate-skills-showcase-data.mjs`, `node scripts/generate-skills-showcase-github-data.mjs`, `scripts/validate-skills-showcase-data.sh`, targeted `rg`, and `git diff --check`. Recommended next command: `$benchmark-test-skill session-triage`.

## Ad-Hoc Agent Review: session-triage Fresh Benchmark 2026-05-13

**Goal:** Review the latest persisted `session-triage` Claude and Codex benchmark outputs for subjective operator quality.

**Plan:**
- [x] Resolve the latest Claude and Codex run directories from `tests/benchmarks/runs/session-triage-*`.
- [x] Extract retained generated triage artifacts and benchmark context from each evaluated run.
- [x] Grade each evaluated output against the agent-review rubric without merging scores into deterministic benchmark metrics.
- [x] Write and validate `benchmark/review-session-triage-2026-05-13.md` with scores, findings, remediation, and next route.
- [x] Record results here, then commit and push intended review/task changes on `master`.

**Review:** Complete. Reviewed `session-triage-claude-4cfa1e99` and `session-triage-codex-f8e827fb`, covering 6 evaluated outputs. Deterministic benchmark context was clean: both runners passed 3/3 hard assertions with 100.0% quality and no infrastructure blocks. Subjective median score was 82.5 with range 80-94. Outputs were generally good, with strong evidence-bounded incident triage, but several over-routed to `$targeted-skill-builder` despite identifying an adequate existing `$run` contract and likely one-off agent noncompliance. Report: `benchmark/review-session-triage-2026-05-13.md`. Recommended next command: `$targeted-skill-builder session-triage benchmark over-remediation rubric`.

## Ad-Hoc Benchmark: session-triage Fresh Rerun 2026-05-13

**Goal:** Run `$benchmark-test-skill session-triage` with fresh repository harness eligibility, verify, and both-agent benchmark evidence after the benchmark fixture routing fix.

**Plan:**
- [x] Confirm `session-triage` is a known benchmark harness target and record its coverage status. ✓ `coverage=custom`, `setup=tests/layer4/setups/tier1-workflows.setup.ts`.
- [x] Run `pnpm verify --skill session-triage` from `tests/` and stop if it fails. ✓ layer1 PASS (1,350 tests, 8.8s), layer2 SKIP (no target-specific tests).
- [x] If verify passes, run `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0`. ✓ Claude 3/3 (100.0%), Codex 3/3 (100.0%), no blocked runs.
- [x] Write and validate `benchmark/test-session-triage-2026-05-13.md` with verify, benchmark, latency, cost, consistency, and raw session evidence. ✓ Report updated with fresh run data.
- [x] Record results here, then commit and push intended benchmark/task changes on `master`.

**Review:** Fresh benchmark rerun completed on 2026-05-13. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.8s across 1,350 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 45.9s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 55.5s, and $0.75 total cost. Report validation passed with target, agent rows, pass-rate, latency, cost, consistency, raw session paths, and next-route evidence. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next skill: `$benchmark-agent-review session-triage`.

## Ad-Hoc Benchmark: session-triage 2026-05-13

**Goal:** Run `$benchmark-test-skill session-triage` with repository harness eligibility, verify, and both-agent benchmark evidence.

**Plan:**
- [x] Confirm `session-triage` is a known benchmark harness target and record its coverage status. ✓ `coverage=custom`, `setup_path=tests/layer4/setups/tier1-workflows.setup.ts`, `priority_tier=1`, `fixture_type=incident-report-fixture` (bench-coverage.ts:427-432).
- [x] Run `pnpm verify --skill session-triage` from `tests/` and stop if it fails. ✓ layer1 PASS (1349 tests, 8.8s), layer2 SKIP (no target-specific tests).
- [x] If verify passes, run `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0`. ✓ Claude 0/2 (0.0%), 1 blocked; Codex 3/3 (100.0%), 0 blocked.
- [x] Write and validate `benchmark/test-session-triage-2026-05-13.md` with verify, benchmark, latency, cost, consistency, and raw session evidence. ✓ Report updated with fresh run data and prior-run comparison.
- [x] Record results here, then commit and push intended benchmark/task changes on `master`.

**Review:** Benchmark rerun completed on 2026-05-13. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.8s across 1,349 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with 1 Claude infrastructure-blocked run. Claude passed 0/2 evaluated hard assertions (82.1% output quality, p50 52.3s, $0.75 total cost). Codex passed 3/3 evaluated hard assertions (100.0% output quality, p50 58.7s, $0.75 total cost). Claude consistently fails the "Output recommends $targeted-skill-builder" hard assertion. Codex improved from 66.7% to 100.0% pass rate across sessions. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next command: `$session-triage session-triage benchmark failure`.

## Ad-Hoc Triage: session-triage Benchmark Failure 2026-05-13

**Goal:** Verify the fresh `session-triage` benchmark failure and identify the smallest durable fix.

**Plan:**
- [x] Inspect the benchmark report and persisted Claude/Codex run evidence.
- [x] Compare mirrored `session-triage` contracts against the tier1 benchmark setup expectations.
- [x] Classify whether the failure is a skill contract gap, benchmark harness gap, or runner noncompliance.
- [x] Write and validate `benchmark/triage-session-triage-2026-05-13.md` with verdict, root cause, responsible gap, validation plan, and next route.
- [x] Record results here, then commit and push intended triage/task changes on `master`.

**Review:** Complete. The benchmark failure is verified, but the responsible gap is the benchmark setup, not the `session-triage` skill contract. The fixture describes one-off agent noncompliance with an adequate validation contract and existing lesson, while `session-triage` explicitly says not to recommend a skill change in that situation. The fixture still hard-requires `$targeted-skill-builder`; latest Codex evidence passes that assertion, but Claude still fails because the setup expects only the Codex dollar route instead of `/targeted-skill-builder`. Report: `benchmark/triage-session-triage-2026-05-13.md`. Recommended next skill: `$targeted-skill-builder session-triage benchmark fixture routing`.

## Ad-Hoc Targeted Skill Update: session-triage Benchmark Fixture Routing

**Goal:** Align the `session-triage` tier1 benchmark fixture with the skill contract's no-skill-change branch for one-off agent noncompliance.

**Plan:**
- [x] Confirm the fix belongs in the benchmark fixture and layer1 setup tests, not the `session-triage` skill contract.
- [x] Remove the hard-coded `$targeted-skill-builder` route requirement from the current one-off noncompliance fixture.
- [x] Add layer1 regression coverage that accepts `Recommended next skill: none` and rejects reintroducing the hard-coded route assertion.
- [x] Run focused layer1, benchmark coverage, target verify, smoke benchmark, and whitespace validation.
- [x] Record results here, then commit and push intended fixture/task/generated changes on `master`.

**Review:** Complete. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the `session-triage` fixture still requires report evidence, specificity, validation planning, and an explicit next-command handoff, but no longer hard-requires `$targeted-skill-builder` for a one-off noncompliance case where the existing contract is adequate. Added `tests/layer1/bench-setups.test.ts` coverage proving a `Recommended next skill: none` report passes route scoring and that the setup no longer emits `Output recommends $targeted-skill-builder`. Validation passed with focused layer1 tests (1,350 tests), `pnpm --dir tests bench:coverage`, `pnpm --dir tests verify --skill session-triage`, Codex smoke `session-triage-codex-14d81596` (1/1 hard assertions, $0.25), and `git diff --check`. Recommended next command: `$benchmark-test-skill session-triage`.

## Priority Documentation Todo

- [x] Documentation is current; no missing or stale research, spec, roadmap, or task artifacts found.

**Notes:**
- All 7 devtool research docs exist. Foundational docs (user-map, integration-map, dx-journey, adoption) date to 2026-04-22 with 55+ skill commits since; refresh is advisory, not blocking. Next `/devtool-docs-audit` is due 2026-05-30.
- Skills Showcase website has a full spec chain: `specs/skills-showcase-website.md`, `specs/ui-skills-showcase-website.md`, plus interview records. No additional research documentation is needed for the website.
- No `specs/ux-variations-*.md` exists, but UX decisions were made via UI interview and are baked into the built site. Creating a retroactive UX variations doc would be low-value.
- 5 ideas in `tasks/ideas.md` are unspecced; candidates for `/feature-interview` if any are prioritized.

## Ad-Hoc Pack Split: Customer Lifecycle

**Goal:** Split lifecycle planning out of `business-discovery` into a mirrored `customer-lifecycle` pack that owns journey, onboarding, conversion, transaction, retention, expansion, and lifecycle metrics workflows.

**Plan:**
- [x] Create mirrored Claude/Codex `customer-lifecycle` pack skills for the full lifecycle chain.
- [x] Hard-move `journey-map` out of `business-discovery`, including stale agent metadata.
- [x] Update pack aliases, `business-app` expansion, docs, and routing guidance.
- [x] Update benchmark coverage and pack workflow fixtures.
- [x] Refresh generated Skills Showcase data and validate pack install behavior.

**Review:** Complete. Added `packs/customer-lifecycle` with `journey-map`, `onboarding-map`, `conversion-map`, `transaction-map`, `retention-map`, `expansion-map`, and `lifecycle-metrics` for both Claude and Codex. `business-app` now expands to `business-discovery`, `customer-lifecycle`, `business-growth`, and `business-ops`; `business-discovery` no longer owns `journey-map`. Validation passed with benchmark coverage, focused layer1 tests, showcase data validation, and disposable pack install checks. Recommended next command: `$ship`.

## Ad-Hoc Benchmark Rerun: benchmark-test-skill Self Benchmark 2026-05-13 Fresh

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-13.

**Plan:**
- [x] Confirm `benchmark-test-skill` is a known benchmark harness target and record its coverage status.
- [x] Run `pnpm verify --skill benchmark-test-skill` from `tests/` and stop if it fails.
- [x] If verify passes, run `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0`.
- [x] Write and validate `benchmark/test-benchmark-test-skill-2026-05-13.md` with verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Record results here, then commit and push intended benchmark/task changes on `master`.

**Review:** Complete. `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.5s across 1,312 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 17.8s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 30.5s, and $0.75 total cost. Report: `benchmark/test-benchmark-test-skill-2026-05-13.md`. Recommended next skill: `$benchmark-agent-review benchmark-test-skill`.

## Ad-Hoc Agent Review: benchmark-test-skill Fresh Benchmark 2026-05-13

**Goal:** Review the latest persisted `benchmark-test-skill` Claude and Codex benchmark outputs for subjective operator quality.

**Plan:**
- [x] Resolve the latest Claude and Codex run directories from `tests/benchmarks/runs/benchmark-test-skill-*`.
- [x] Extract retained generated report artifacts and benchmark context from each evaluated run.
- [x] Grade each evaluated output against the agent-review rubric without merging scores into deterministic benchmark metrics.
- [x] Write and validate `benchmark/review-benchmark-test-skill-2026-05-13.md` with scores, findings, remediation, and next route.
- [x] Record results here, then commit and push intended review/task changes on `master`.

**Review:** Complete. Reviewed latest persisted runs `benchmark-test-skill-claude-46f32ef6` and `benchmark-test-skill-codex-e4c6aef6`. Both runners had 3/3 hard assertion pass rates and 100.0% deterministic output-quality scores. Subjective agent-review scores were excellent: Claude retained evidence scored 92/100 for each run, with the caveat that full generated report text was not retained; Codex scored 96/100, 96/100, and 95/100 with fully retained generated report diffs. Median subjective score was 93.5 with range 92-96. No target-skill remediation is needed. Report: `benchmark/review-benchmark-test-skill-2026-05-13.md`. Recommended next command: `$ship`.

## Ad-Hoc Benchmark Rerun: benchmark-test-skill Self Benchmark 2026-05-13

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-13.

**Plan:**
- [x] Confirm `benchmark-test-skill` is a known benchmark harness target and record its coverage status.
- [x] Run `pnpm verify --skill benchmark-test-skill` from `tests/` and stop if it fails.
- [x] If verify passes, run `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0`.
- [x] Write and validate `benchmark/test-benchmark-test-skill-2026-05-13.md` with verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Record results here, then commit and push intended benchmark/task changes on `master`.

**Review:** Complete. `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.2s across 1,312 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude failed 0/3 evaluated hard assertions, all on `Output matches workflow expectation`; its output-quality average was 80.0% with 3 threshold failures and 3 critical failures, driven by `metrics-table-structure`. Codex passed 3/3 evaluated hard assertions with 100.0% output quality. Report: `benchmark/test-benchmark-test-skill-2026-05-13.md`. Recommended next command: `$session-triage benchmark-test-skill benchmark failure`.

## Ad-Hoc Triage: benchmark-test-skill Benchmark Failure 2026-05-13

**Goal:** Verify the fresh `benchmark-test-skill` Claude benchmark failure and identify the smallest durable fix.

**Plan:**
- [x] Inspect the 2026-05-13 benchmark report and persisted Claude/Codex run evidence.
- [x] Compare mirrored `benchmark-test-skill` contracts and the tier1 benchmark setup expectations.
- [x] Classify whether the failure is a skill contract gap, benchmark harness gap, or runner noncompliance.
- [x] Write `benchmark/triage-benchmark-test-skill-2026-05-13.md` with verdict, root cause, responsible gap, validation plan, and next route.
- [x] Record results here, then commit and push intended triage/task changes on `master`.

**Review:** Complete. The benchmark failure is verified and narrow: Claude completed all three runs, created the expected report, included broad required facts and `/ship`, but failed the hard workflow expectation because `p50=1200` and `totalCost=0.42` were not detected as rows inside the `## Benchmark Metrics` table. Codex passed with the intended table shape. The mirrored `benchmark-test-skill` contracts are aligned; the responsible gap is the custom tier1 fixture prompt in `tests/layer4/setups/tier1-workflows.setup.ts`, which should explicitly require separate metric-table rows containing `passRate=1.0` or `100%`, `p50=1200`, `totalCost=0.42`, and `run-agent-abc`. Report: `benchmark/triage-benchmark-test-skill-2026-05-13.md`. Recommended next skill: `$targeted-skill-builder benchmark-test-skill benchmark failure`.

## Ad-Hoc Targeted Skill Update: benchmark-test-skill Fixture Prompt

**Goal:** Make the `benchmark-test-skill` custom benchmark fixture prompt explicit about the metric-table row structure required by its hard assertion and quality rubric.

**Plan:**
- [x] Update `tests/layer4/setups/tier1-workflows.setup.ts` so the fixture prompt requires separate `## Benchmark Metrics` rows for pass rate, p50 latency, total cost, and raw session path with the exact evidence tokens.
- [x] Run focused layer1 benchmark setup/quality tests.
- [x] Run required skill-builder validation and one-run Claude benchmark smoke.
- [x] Record results here, then commit and push intended changes on `master`.

**Review:** Complete. Updated the `benchmark-test-skill` tier1 fixture prompt to explicitly require `## Benchmark Metrics` table rows for pass rate, p50 latency, total cost, and raw session path with exact evidence tokens. Validation passed: `pnpm --dir tests test:layer1 -- bench-setups bench-quality`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests bench:coverage`, `./install.sh`, `pnpm --dir tests verify --skill benchmark-test-skill`, `pnpm --dir tests bench --skill benchmark-test-skill --agent claude --runs 1 --chunk-size 1 --pause 0` (`benchmark-test-skill-claude-58480bc9`, 1/1 hard assertions, 100.0% quality, no blocked runs), and `git diff --check`. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

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
- [x] A clean benchmark-results matrix lists skills with persisted evaluated benchmark data, hard pass rates, quality scores, subjective review grades when present, and raw report paths.
- [x] Skills Showcase exposes benchmark results or links to the generated matrix without confusing coverage status with completed graded runs.
- [x] `commit-and-push-by-feature` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [x] `sync` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [x] The benchmark coverage registry reflects any newly unblocked setup status only after the safe fixture is implemented and validated.
- [x] Cleanup and infrastructure-block handling are documented for the disposable repository workflow.
- [x] No GitHub Actions are created, modified, or recommended.

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

## Ad-Hoc Targeted Skill Update: benchmark-test-skill Benchmark Failure Rubric Alignment

**Goal:** Align the existing `benchmark-test-skill` tier1 benchmark quality rubric with the hard structural report assertion after the 2026-05-13 self-benchmark found Claude runs that preserved facts but failed report structure.

**Plan:**
- [x] Confirm the fix belongs in the existing benchmark-test-skill fixture/setup, not a new skill.
- [x] Update the output-quality rubric to require benchmark metrics inside a Markdown table under `## Benchmark Metrics`.
- [x] Add layer1 regression coverage for a facts-present but malformed metrics section.
- [x] Run targeted and required validation, then record results here.

**Review:** Complete. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the `benchmark-test-skill` hard assertion and output-quality rubric both require `passRate`, `p50`, and `totalCost` to appear as rows in the `## Benchmark Metrics` Markdown table before `## Raw Evidence`. Added a layer1 regression in `tests/layer1/bench-setups.test.ts` for a report that preserves all facts but moves those metrics into prose outside the table; it now fails both the hard structural assertion and the critical `metrics-table-structure` quality criterion. Validation passed with `pnpm --dir tests test:layer1 -- bench-setups bench-quality`, `pnpm --dir tests bench:coverage`, `./install.sh`, dependency/version/routing checks, `pnpm --dir tests verify --skill benchmark-test-skill`, and `git diff --check`. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Ad-Hoc Agent Review: benchmark-test-skill

**Goal:** Review the persisted `$benchmark-test-skill benchmark-test-skill` outputs for subjective operator ergonomics after deterministic hard assertions passed.

**Review:** Complete. Reviewed latest Claude run `tests/benchmarks/runs/benchmark-test-skill-claude-d0075f7e/` and Codex run `tests/benchmarks/runs/benchmark-test-skill-codex-76616c00/`, excluding Claude run #0 because it was infrastructure-blocked by agent runner budget. Median subjective score was 80 with range 70-92. The evaluated outputs are usable-to-good overall: they create the requested report, stay scoped, avoid unsupported external work, and choose the correct runner route. The material weakness is exact evidence fidelity: several reports summarize `layer1 PASS` as generic `PASS` or broad "verify status", leaving the next operator to infer source facts. Review report: `benchmark/review-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$targeted-skill-builder benchmark-test-skill exact benchmark evidence reporting`.

## Ad-Hoc Targeted Skill Update: benchmark-test-skill Exact Evidence Reporting

**Goal:** Tighten the existing `benchmark-test-skill` tier1 benchmark fixture so passing generated reports preserve exact benchmark evidence instead of broad keywords.

**Review:** Complete. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the benchmark prompt and hard assertions require exact report evidence: `layer1 PASS`, `layer2 SKIPPED`, `passRate=1.0` or `100%`, `p50=1200`, `totalCost=0.42`, `run-agent-abc`, source files, and literal report path `benchmark/test-run-2026-05-11.md`. Updated `tests/layer1/bench-setups.test.ts` to assert the prompt contract and reject a thin keyword-only report. Validation passed with `pnpm --dir tests test:layer1 -- bench-setups bench-quality`, `pnpm --dir tests bench:coverage`, `./install.sh`, dependency/version/routing checks, `pnpm --dir tests verify --skill benchmark-test-skill`, Codex smoke `benchmark-test-skill-codex-2527788d` (1/1 hard assertions), and `git diff --check`. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Ad-Hoc Targeted Skill Update: benchmark-test-skill Structured Fixture Report Ergonomics

**Goal:** Tighten the existing `benchmark-test-skill` tier1 benchmark fixture so generated reports preserve exact fixture evidence in a structured, operator-readable report shape.

**Plan:**
- [x] Confirm the fix belongs in the existing benchmark-test-skill fixture and layer1 setup tests, not a new skill.
- [x] Update the tier1 benchmark fixture prompt, hard assertions, and output-quality rubric to require stable report sections/tables for verification, benchmark metrics, raw evidence, and next route.
- [x] Add layer1 regression coverage that accepts a structured fixture report and rejects an exact-but-unstructured evidence dump.
- [x] Run targeted and required skill validation, then record results here.

**Review:** Complete. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the benchmark-test-skill fixture asks agents to use only `bench-output.txt` and `verify-output.txt`, avoid repository searching, and write a structured benchmark report with `## Verify`, `## Benchmark Metrics`, `## Raw Evidence`, and `## Next Route` sections plus Markdown metric tables. Hard assertions now require those headings/tables alongside exact fixture evidence, and the quality rubric scores the structured report fields directly. Updated `tests/layer1/bench-setups.test.ts` with prompt-contract checks, a passing structured report fixture, and a failing exact-but-unstructured report fixture. Validation passed with focused layer1 tests, benchmark coverage, install/dependency/version/routing checks, `pnpm --dir tests verify --skill benchmark-test-skill`, Codex smoke `benchmark-test-skill-codex-39561c73` (1/1 hard assertions, 100.0% quality), and `git diff --check`. Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** low
**Review gates:** correctness, tests, data contract, security

**Subagent lanes:** none

## Ad-Hoc Benchmark Rerun: benchmark-test-skill Fresh Self Benchmark

**Goal:** Run `$benchmark-test-skill benchmark-test-skill` with fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Plan:**
- [x] Confirm `benchmark-test-skill` is a known benchmark harness target and record its coverage status.
- [x] Run `pnpm verify --skill benchmark-test-skill` from `tests/` and stop if it fails.
- [x] If verify passes, run `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0`.
- [x] Write and validate `benchmark/test-benchmark-test-skill-2026-05-12.md` with verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Record results here, then commit and push intended benchmark/task changes on `master`.

**Review:** Complete. `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 9.1s across 1,304 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 92.4% output quality, p50 latency 26.3s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 92.4% output quality, p50 latency 67.5s, and $0.75 total cost. Report: `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next skill: `$benchmark-agent-review benchmark-test-skill`.

### Implementation
- [x] Step 39.1: Validate and promote `docs/benchmark-results-matrix.md` as a generated source of truth.
  - Classification: automated
  - Files: modify `scripts/generate-skills-showcase-data.mjs` (add matrix generation/validation logic), modify `docs/benchmark-results-matrix.md` (regenerate from persisted benchmark reports), modify `scripts/validate-skills-showcase-data.sh` (add matrix freshness check)
  - Parse persisted `benchmark/test-*.md` reports to extract skill name, date, agent, hard pass rate, quality score, subjective review grade (when present), and raw report path.
  - Generate a clean Markdown matrix table in `docs/benchmark-results-matrix.md` from the parsed data, replacing the hand-maintained content with generated output.
  - Add a freshness validation step to `scripts/validate-skills-showcase-data.sh` that fails when the matrix is stale relative to benchmark reports.
- [x] Step 39.2: Add benchmark results surface to Skills Showcase UI.
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
- [x] Step 39.3: Design safe disposable GitHub test-repository fixture infrastructure.
  - Classification: automated
  - Files: create `docs/safe-git-benchmark-fixtures.md` (design doc), create `tests/layer4/helpers/disposable-repo.ts` (fixture helper)
  - Document the permission-gated disposable repository workflow: explicit user approval before `gh repo create`, `gh repo delete`, or any mutation of a live GitHub test repository.
  - Document cleanup handling: cleanup failures are infrastructure-blocked evidence, not skill failures.
  - Implement a reusable fixture helper that creates a temporary GitHub repo via `gh`, clones it locally, and provides cleanup — all gated behind explicit confirmation.
- [x] Step 39.4: Add `commit-and-push-by-feature` safe fixture plan using the disposable repo infrastructure.
  - Classification: automated
  - Files: create `tests/layer4/setups/git-fixture-commit-and-push.setup.ts` (fixture definition), modify `tests/harness/bench-coverage.ts` (update coverage status from blocked to custom)
  - Define the benchmark setup: create disposable repo, stage mixed changes across multiple files, run `commit-and-push-by-feature`, verify commits are grouped by feature with conventional messages.
  - Update `COVERAGE_OVERRIDES` and `TIER23_GLOBAL_BLOCKED_SKILLS` to reflect newly unblocked status with the safe fixture path.
- [x] Step 39.5: Add `sync` safe fixture plan using the disposable repo infrastructure.
  - Classification: automated
  - Files: create `tests/layer4/setups/git-fixture-sync.setup.ts` (fixture definition), modify `tests/harness/bench-coverage.ts` (update coverage status from blocked to custom)
  - Define the benchmark setup: create disposable repo with upstream changes, run `sync`, verify pull/rebase behavior and stash handling.
  - Update `COVERAGE_OVERRIDES` and `TIER23_GLOBAL_BLOCKED_SKILLS` to reflect newly unblocked status with the safe fixture path.

### Green
- [x] Step 39.6: Write regression tests covering acceptance criteria.
  - Classification: automated
  - Files: create or modify `tests/layer1/benchmark-results-matrix.test.ts` (matrix generation/validation tests), modify existing layer1 test files as needed
  - Test matrix generation from fixture benchmark reports.
  - Test freshness validation catches stale matrix.
  - Test that showcase data includes `benchmarkEvidence` for graded skills.
  - Test that coverage registry entries for `commit-and-push-by-feature` and `sync` reflect custom coverage.
- [x] Step 39.7: Run all tests, verify they pass, and validate the phase.
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

## Handoff — Step 39.6

### What Needs to Be Built

Step 39.6 writes regression tests covering the Phase 39 acceptance criteria and fixes any stale generated assets.

**Regenerate stale assets:** The `docs/benchmark-results-matrix.md` still says "`commit-and-push-by-feature` and `sync` are currently blocked" — this is now stale since both were unblocked in Steps 39.4 and 39.5. Run `node scripts/generate-skills-showcase-data.mjs` to regenerate the matrix from the updated coverage registry. The generator reads `tests/harness/bench-coverage.ts` at runtime, so it will pick up the new custom status.

**Update** `tests/layer1/benchmark-results-matrix.test.ts`:
- The existing assertion checks for the exact string "`commit-and-push-by-feature` and `sync` are currently blocked in the coverage registry" — this will now fail because the generator should no longer emit that line. Update or remove this assertion to match the regenerated matrix content.
- Add assertions that the matrix reflects the updated coverage status (both skills are now `custom` with `git-disposable-repo-fixture`).

**Verify existing coverage tests already pass:** The `bench-setups.test.ts` and `bench-coverage.test.ts` already assert that `commit-and-push-by-feature` and `sync` have `coverage_status: "custom"` — confirmed passing in this session (1304 tests).

**Additional regression tests to consider:**
- Test that showcase data includes `benchmarkEvidence` for graded skills (may already be covered by existing `skills-showcase-*.test.ts` files — check before adding duplicates).
- Test that no GitHub Actions workflows exist in `.github/workflows/` (acceptance criterion).

**Validation:**
- `pnpm --dir tests test:layer1` — must pass.
- `scripts/validate-skills-showcase-data.sh` — must pass after regeneration.
- `git diff --check` — no whitespace errors.

### Execution Profile
- **Parallel mode:** serial
- **Test strategy:** tests-after

### Handoff
Implement only this step, validate it, then run `/ship` when done.

## Routing

## Review — Step 39.2

- Completed on 2026-05-12.
- Created `/benchmarks` page at `apps/skills-showcase/app/benchmarks/page.tsx` with server-rendered shell following the catalog page pattern.
- Created `src/showcase/benchmarks.tsx` client component that reads `window.SKILLS_SHOWCASE_DATA.skills`, filters to those with `benchmarkEvidence`, deduplicates by `mirrorKey`, and renders an aggregated table with columns: Skill, Status, Agent, Pass Rate, Quality, Date, Report.
- Extracted shared TypeScript interfaces (`BenchmarkEvidence`, `BenchmarkAgent`, `BenchmarkQuality`, `BenchmarkDemo`, `Skill`, `Pack`, `ShowcaseData`) from `catalog.tsx` into `src/showcase/types.ts`.
- Updated `catalog.tsx` to import shared types and make the "benchmark-passed" tag chip link to `/benchmarks` via `tag-link` styling.
- Added "Benchmarks" nav link to `ShowcaseHeader.tsx` and `MobilePanel.tsx`.
- Added `/benchmarks` route to `routes.ts` and updated `routes.test.ts` count from 7 to 8.
- Added benchmark table CSS (`.benchmarks-table`, `.badge`, `.badge-graded`, `.badge-partial`, `.tag-link`) to `globals.css`.
- Added smoke test for `BenchmarksPage` in `smoke.test.tsx`.
- Created `src/showcase/benchmarks.test.tsx` with 10 tests covering: table rendering, deduplication, count, graded/partial badges, catalog links, GitHub report links, quality scores, missing data notice.
- Regenerated showcase data and proof data.
- Validation:
  - `npx vitest run` — 85 tests passed across 8 files.
  - `npx next build` — succeeded, `/benchmarks` rendered as static route.
  - `pnpm --dir tests test:layer1` — 1304 tests passed across 12 files.
  - `git diff --check` — passed.

- **Next work:** Step 39.3 — design safe disposable GitHub test-repository fixture infrastructure
- **Recommended next command:** `/run`

## Handoff — Step 39.3

### What Needs to Be Built

Step 39.3 designs the safe disposable GitHub test-repository fixture infrastructure used by Steps 39.4 and 39.5 to benchmark `commit-and-push-by-feature` and `sync`.

**Create** `docs/safe-git-benchmark-fixtures.md` — design doc covering:
- The permission-gated disposable repository workflow: explicit user approval before any `gh repo create`, `gh repo delete`, or mutation of a live GitHub test repository.
- Cleanup handling: cleanup failures are infrastructure-blocked evidence, not skill failures.
- Naming convention for disposable repos (e.g., `agentic-skills-bench-<skill>-<timestamp>`).
- The lifecycle: create → clone → seed with fixture files → run benchmark → evaluate → cleanup.
- Security boundary: disposable repos are private, contain no secrets, and are deleted after use.

**Create** `tests/layer4/helpers/disposable-repo.ts` — reusable fixture helper:
- `createDisposableRepo(skillName: string)` — calls `gh repo create` with explicit confirmation gate, returns `{ repoUrl, localPath, cleanup }`.
- `seedRepo(localPath: string, files: Record<string, string>)` — writes fixture files, commits, and pushes initial state.
- `cleanupRepo(repoUrl: string)` — calls `gh repo delete` with confirmation gate. Logs cleanup failure as infrastructure-blocked, not a test failure.
- All `gh` operations must be gated: the helper throws or returns a blocked status if confirmation is not granted.
- Check for existing `tests/layer4/helpers/` directory structure and follow existing patterns.

**Validation:**
- `pnpm --dir tests test:layer1` — must pass (no regressions).
- TypeScript compilation of the new helper file.
- `git diff --check` — no whitespace errors.

### Execution Profile
- **Parallel mode:** serial
- **Test strategy:** tests-after

### Handoff
Implement only this step, validate it, then run `/ship` when done.

## Handoff — Step 39.4

### What Needs to Be Built

Step 39.4 adds the `commit-and-push-by-feature` safe fixture plan using the disposable repo infrastructure built in Step 39.3.

**Create** `tests/layer4/setups/git-fixture-commit-and-push.setup.ts` — benchmark fixture definition:
- Import `SkillBenchSetup` from `../../harness/bench-types.js` and follow the pattern in `tier1-workflows.setup.ts`.
- Import disposable repo helpers from `../helpers/disposable-repo.js`.
- Define a benchmark setup that:
  1. Creates a disposable repo via `createDisposableRepo("commit-and-push-by-feature")` with a confirmation gate.
  2. Seeds the repo with mixed changes across multiple files in different feature areas (e.g., `src/auth/login.ts`, `src/ui/button.css`, `README.md`, `tests/auth.test.ts`) to give the skill something to group by feature.
  3. Stages the files (via `git add`) but does NOT commit — the skill under test (`commit-and-push-by-feature`) should do the committing.
  4. Runs `commit-and-push-by-feature` against the local clone.
  5. Hard assertions verify: commits are grouped by feature (not one monolithic commit), commit messages follow conventional format, changes are pushed to origin.
  6. Cleanup via `repo.cleanup()`.
- Export the setup as a `SkillBenchSetup` with appropriate budget and timeout from `setup-helpers/budgets.js`.
- If the confirmation gate denies creation, return `infrastructure-blocked` status — do not fail the benchmark.

**Modify** `tests/harness/bench-coverage.ts`:
- Remove `"commit-and-push-by-feature"` from `TIER23_GLOBAL_BLOCKED_SKILLS` (lines 69-72).
- Add `"commit-and-push-by-feature"` to `COVERAGE_OVERRIDES` with `coverage: "custom"` and `setup_path: "tests/layer4/setups/git-fixture-commit-and-push.setup.ts"`.

**Context from Step 39.3:**
- `tests/layer4/helpers/disposable-repo.ts` exports: `createDisposableRepo(skillName, confirm)` → `CreateResult`, `seedRepo(localPath, files)` → void, `cleanupRepo(repoUrl, confirm)` → `CleanupResult`.
- `ConfirmationGate = (action: string) => Promise<boolean>`.
- `CreateResult` is `{ status: "created"; repo: DisposableRepo }` | `{ status: "infrastructure-blocked"; reason: string }`.
- `DisposableRepo` has `{ repoName, repoUrl, localPath, cleanup }`.

**Validation:**
- `pnpm --dir tests test:layer1` — must pass (no regressions). The coverage test should now show `commit-and-push-by-feature` as `custom` instead of `blocked`.
- `git diff --check` — no whitespace errors.

### Execution Profile
- **Parallel mode:** serial
- **Test strategy:** tests-after

### Handoff
Implement only this step, validate it, then run `/ship` when done.

- **Next work:** Step 39.4 — add `commit-and-push-by-feature` safe fixture plan using the disposable repo infrastructure
- **Recommended next command:** `/run`

## Review — Step 39.4

- Completed on 2026-05-12.
- Created `tests/layer4/setups/git-fixture-commit-and-push.setup.ts` — benchmark fixture that stages mixed-feature files (auth, UI, tests, docs) without committing, then asserts `commit-and-push-by-feature` produces multiple conventional commits grouped by feature and pushes them.
- Hard assertions: conventional commit messages, multiple commits (feature grouping), push performed, clean working tree.
- Updated `tests/harness/bench-coverage.ts`: removed `commit-and-push-by-feature` from `TIER23_GLOBAL_BLOCKED_SKILLS`, added it to `COVERAGE_OVERRIDES` with `coverage: "custom"`, `agent_scope: "both"`, `setup_path: "tests/layer4/setups/git-fixture-commit-and-push.setup.ts"`.
- Updated `tests/layer1/bench-setups.test.ts`: moved `commit-and-push-by-feature` from `expectedBlockedSkills` to a dedicated assertion checking custom status, setup path, agent scope, and fixture type.
- Validation:
  - `pnpm --dir tests test:layer1` — 1304 tests passed across 12 files (no regressions).
  - `pnpm --dir tests bench:coverage` — valid (145 skills).
  - `git diff --check` — passed.

- **Next work:** Step 39.5 — add `sync` safe fixture plan using the disposable repo infrastructure
- **Recommended next command:** `/run`

## Handoff — Step 39.5

### What Needs to Be Built

Step 39.5 adds the `sync` safe fixture plan using the disposable repo infrastructure built in Step 39.3.

**Create** `tests/layer4/setups/git-fixture-sync.setup.ts` — benchmark fixture definition:
- Import `SkillBenchSetup` from `../../harness/bench-types.js` and follow the pattern established in `git-fixture-commit-and-push.setup.ts`.
- Import disposable repo helpers from `../helpers/disposable-repo.js`.
- Define a benchmark setup that:
  1. Creates a disposable repo via `createDisposableRepo("sync")`.
  2. Seeds the repo with initial files (e.g., `README.md`, `src/index.ts`, `package.json`).
  3. Simulates upstream changes: after seeding, create additional commits directly on the remote (via a second clone or `git push` from a temp dir) so the local clone is behind origin.
  4. Optionally creates a local uncommitted change to test stash behavior.
  5. Runs `sync` against the local clone.
  6. Hard assertions verify: pulled commits are present locally, branch is up to date with origin, stashed changes (if any) were re-applied, output reports branch name and sync status.
  7. Cleanup via `repo.cleanup()`.
- Export as a `SkillBenchSetup` with `BENCH_BUDGETS_USD.standard` and `BENCH_TIMEOUTS_MS.standard`.
- If confirmation gate denies creation, return `infrastructure-blocked` — do not fail the benchmark.

**Modify** `tests/harness/bench-coverage.ts`:
- Remove `"sync"` from `TIER23_GLOBAL_BLOCKED_SKILLS` (currently at the entry with `blocked_reason: "Requires live remote git fetch/pull state..."`).
- Add `"sync"` to `COVERAGE_OVERRIDES` with `coverage: "custom"`, `agent_scope: "both"`, `setup_path: "tests/layer4/setups/git-fixture-sync.setup.ts"`, `fixture_type: "git-disposable-repo-fixture"`.

**Modify** `tests/layer1/bench-setups.test.ts`:
- Remove `"sync"` from `expectedBlockedSkills` array.
- Add a dedicated assertion (like the one for `commit-and-push-by-feature`) checking that `sync` has `coverage_status: "custom"`, correct `setup_path`, `agent_scope: "both"`, and `fixture_type`.

**Context from Step 39.4:**
- `git-fixture-commit-and-push.setup.ts` at `tests/layer4/setups/` is the closest pattern to follow — same imports, same structure, same budget/timeout, same `SkillBenchSetup` export pattern.
- The `bench-coverage.ts` override entry for `commit-and-push-by-feature` is the exact shape to replicate for `sync`.
- The test assertion added for `commit-and-push-by-feature` in `bench-setups.test.ts` is the pattern to follow.

**Validation:**
- `pnpm --dir tests test:layer1` — must pass (no regressions). The coverage test should now show `sync` as `custom` instead of `blocked`.
- `pnpm --dir tests bench:coverage` — must be valid.
- `git diff --check` — no whitespace errors.

### Execution Profile
- **Parallel mode:** serial
- **Test strategy:** tests-after

### Handoff
Implement only this step, validate it, then run `/ship` when done.

## Review — Step 39.5

- Completed on 2026-05-12.
- Created `tests/layer4/setups/git-fixture-sync.setup.ts` — benchmark fixture that seeds a disposable repo, simulates upstream changes via a second clone, adds a local uncommitted change (NOTES.md), then asserts `sync` performs pull/rebase, reports branch status, handles stashed local changes, and reports sync completion.
- Hard assertions: pull performed, branch reported, stash handling, sync status reported.
- Updated `tests/harness/bench-coverage.ts`: removed `sync` from `TIER23_GLOBAL_BLOCKED_SKILLS`, added it to `COVERAGE_OVERRIDES` with `coverage: "custom"`, `agent_scope: "both"`, `setup_path: "tests/layer4/setups/git-fixture-sync.setup.ts"`.
- Updated `tests/layer1/bench-setups.test.ts`: removed `sync` from `expectedBlockedSkills`, added a dedicated assertion checking custom status, setup path, agent scope, and fixture type.
- Validation:
  - `pnpm --dir tests test:layer1` — 1304 tests passed across 12 files (no regressions).
  - `pnpm --dir tests bench:coverage` — valid (145 skills).
  - `git diff --check` — passed.

- **Next work:** Step 39.6 — write regression tests covering acceptance criteria
- **Recommended next command:** `/run`

## Review — Step 39.6

- Completed on 2026-05-12.
- Updated `scripts/generate-skills-showcase-data.mjs`: replaced stale "currently blocked" coverage gaps text with "Safe Git-Fixture Skills" section reflecting custom coverage status for `commit-and-push-by-feature` and `sync`, with fixture paths and design doc reference.
- Regenerated `docs/benchmark-results-matrix.md`, `docs/skills-showcase/assets/skills-data.js`, `apps/skills-showcase/public/assets/skills-data.js`, and github proof data.
- Updated `tests/layer1/benchmark-results-matrix.test.ts`:
  - Replaced stale "currently blocked" assertion with assertions for "Safe Git-Fixture Skills" heading, custom coverage text, and both fixture paths.
  - Added regression test: matrix does not claim skills are blocked.
  - Added regression test: matrix references the safe git benchmark fixtures design doc.
  - Added "phase 39 acceptance criteria" describe block: no GitHub Actions workflows, design doc exists, disposable repo helper exists, both git fixture setups exist.
- Validation:
  - `pnpm --dir tests test:layer1` — 1310 tests passed across 12 files (6 new tests, no regressions).
  - `scripts/validate-skills-showcase-data.sh` — passed.
  - `git diff --check` — passed.

- **Next work:** Step 39.7 — run all tests, verify they pass, and validate the phase
- **Recommended next command:** `/run`

## Review — Step 39.3

- Completed on 2026-05-12.
- Created `docs/safe-git-benchmark-fixtures.md` — design doc covering permission-gated disposable repo workflow, naming convention (`agentic-skills-bench-<skill>-<timestamp>`), lifecycle (create → clone → seed → benchmark → evaluate → cleanup), security boundary (private, no secrets, deleted after use), and cleanup handling (failures are infrastructure-blocked evidence, not skill failures).
- Created `tests/layer4/helpers/disposable-repo.ts` — reusable fixture helper exporting `createDisposableRepo()`, `seedRepo()`, and `cleanupRepo()`, all gated behind a `ConfirmationGate` callback. Returns discriminated union types (`CreateResult`, `CleanupResult`) with `infrastructure-blocked` status when confirmation is denied or `gh` commands fail.
- Follows existing `setup-helpers/` patterns: pure functions, typed returns, no side effects without explicit invocation.
- Validation:
  - `pnpm --dir tests test:layer1` — 1304 tests passed across 12 files (no regressions).
  - TypeScript compilation — project does not have `@types/node` as an explicit dep; existing layer4 files have the same `tsc --noEmit` limitation. File is syntactically valid and follows the same import/export patterns as sibling helpers.
  - `git diff --check` — passed.

- **Next work:** Step 39.4 — add `commit-and-push-by-feature` safe fixture plan using the disposable repo infrastructure
- **Recommended next command:** `/run`

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

## Current Task — Benchmark `session-triage`

- [x] Confirm `$benchmark-test-skill` is the active workflow and `session-triage` is the target skill argument.
- [x] Run `pnpm bench --list-skills` and confirm `session-triage` is known to the harness.
- [x] Record coverage status: `custom`, setup `tests/layer4/setups/tier1-workflows.setup.ts`.
- [x] Run `pnpm verify --skill session-triage`.
- [x] If verify passes, run `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0`.
- [x] Write `benchmark/test-session-triage-2026-05-13.md` with verify, benchmark, latency, cost, consistency, raw paths, and recommended next route.
- [x] Validate the report contains required benchmark fields.
- [x] Commit and push intended changes.

## Review — Benchmark `session-triage`

- Verify passed: layer1 PASS in 8.5s with 1,350 tests across 12 files; layer2 SKIP because no target-specific layer2 tests matched `session-triage`.
- Benchmark completed for both agents:
  - Claude session `13f4872c`: 2/2 evaluated hard assertions passed, 1 infrastructure-blocked run due to agent runner budget, quality score 78.1%, 1 threshold failure, 3 critical failures, p50 40.7s, total cost $0.75.
  - Codex session `7cdefe10`: 3/3 evaluated hard assertions passed, 0 infrastructure blocks, quality score 100.0%, p50 71.0s, total cost $0.75.
- Report written to `benchmark/test-session-triage-2026-05-13.md`.
- Report validation passed: required target, agent rows, pass-rate and blocked-run data, latency, cost, raw session paths, and recommended next route are present.
- **Recommended next skill:** `$benchmark-agent-review session-triage`

## Current Task — Agent Review `session-triage`

- [x] Resolve `$benchmark-agent-review session-triage` as the active workflow.
- [x] Locate latest persisted `session-triage` benchmark runs for Claude and Codex.
- [x] Extract evaluated run outputs and exclude infrastructure-blocked runs.
- [x] Grade generated artifacts against the agent-review rubric.
- [x] Write `benchmark/review-session-triage-2026-05-13.md` with score table, findings, remediation handoff, and recommended next command.
- [x] Validate the review report contains required fields.
- [x] Commit and push intended changes.

## Review — Agent Review `session-triage`

- Reviewed latest benchmark runs:
  - Claude `13f4872c`: evaluated runs 0 and 1; excluded infrastructure-blocked run 2.
  - Codex `7cdefe10`: evaluated runs 0, 1, and 2.
- Subjective score table: Claude run 0 = 64, Claude run 1 = 66, Codex run 0 = 97, Codex run 1 = 92, Codex run 2 = 86.
- Median subjective score: 86; range: 64-97.
- Main finding: Codex outputs are good to excellent, while Claude outputs over-route one-off noncompliance to `/targeted-skill-builder run` and one makes an unsupported `/run` contract availability claim.
- Report written to `benchmark/review-session-triage-2026-05-13.md`.
- Report validation passed: source paths, reviewed run IDs, benchmark context, subjective scores, median/range, strengths, weaknesses, remediation table, deterministic-rubric notes, and recommended next command are present. `git diff --check` passed.
- **Recommended next command:** `$targeted-skill-builder session-triage benchmark over-remediation rubric`
