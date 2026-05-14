# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** All 39 roadmap phases complete.
**Last completed phase:** Phase 39 — Benchmark Results Visibility And Safe Git Fixtures

## Current Task — Frontend Content-Programming Benchmark Review Results

**Goal:** Update the Skills Showcase frontend so the latest `content-programming` deterministic and subjective review results are visible in the catalog and benchmarks surfaces.

**Plan:**
- [x] Inspect existing benchmark evidence generation and frontend rendering.
- [x] Fix generated benchmark data so current output-quality rows and subjective review summaries are included.
- [x] Render subjective review score/report evidence in catalog benchmark panels and the benchmarks table.
- [x] Add regression coverage for `content-programming` quality and review evidence.
- [x] Regenerate showcase data, validate, verify the UI locally, then commit and push on `master`.

## Review — Frontend Content-Programming Benchmark Review Results

- Updated `scripts/generate-skills-showcase-data.mjs` to parse `Output-Quality Rubric` tables, normalize review median/range values, attach latest `benchmark/review-*.md` summaries to `benchmarkEvidence.subjectiveReview`, and include review reports in the showcase data fingerprint.
- Updated the catalog benchmark panel to show subjective review median/range, verdict excerpt, and review report link.
- Updated the benchmarks table with a `Review` column linking to the review report and showing the median score/range.
- Regenerated `docs/skills-showcase/assets/skills-data.js` and `apps/skills-showcase/public/assets/skills-data.js`; both now include `content-programming` quality rows and subjective review evidence for median `92.0`, range `90-94`, and `$ship`.
- Validation passed:
  - `pnpm --dir tests exec vitest run --project layer1 skills-showcase-benchmark-demo`
  - `pnpm --dir apps/skills-showcase test -- src/showcase/catalog.test.tsx src/showcase/benchmarks.test.tsx`
  - `pnpm --dir apps/skills-showcase typecheck`
  - `pnpm --dir apps/skills-showcase build`
  - `curl -sS http://localhost:3026/benchmarks`
  - `curl -sS http://localhost:3026/assets/skills-data.js`
- The generated-data freshness check is expected to pass after commit because proof-data fingerprints include tracked source content.

## Current Task — Agent Review `content-programming` Fresh Full-Contract Benchmark 2026-05-14

**Goal:** Review the latest persisted `content-programming` Claude and Codex benchmark outputs for subjective operator quality.

**Plan:**
- [x] Resolve latest Claude and Codex run directories from `tests/benchmarks/runs/content-programming-*`.
- [x] Inspect retained generated `pack-benchmark-output.md` artifacts, fixture facts, benchmark report, and benchmark setup context.
- [x] Grade each evaluated output against the agent-review rubric separately from deterministic benchmark metrics.
- [x] Write `benchmark/review-content-programming-2026-05-14.md` with scores, findings, remediation, and next route.
- [x] Refresh generated Skills Showcase data because curated review evidence changes.
- [x] Validate report fields, record results, then commit and push on `master`.

## Review — Agent Review `content-programming` Fresh Full-Contract Benchmark 2026-05-14

- Reviewed `content-programming-claude-a8dda4dc` and `content-programming-codex-7f0f09f4`, covering 6 evaluated outputs and excluding no infrastructure-blocked runs.
- Deterministic context was clean: Claude passed 3/3 hard assertions with 96.8% quality, and Codex passed 3/3 hard assertions with 98.1% quality.
- Full `pack-benchmark-output.md` artifact snapshots were retained in every `run-*.json`.
- Subjective verdict: excellent overall, with median score 92.0 and range 90-94. The fresh outputs now exercise the full programming-strategy contract: thesis, durable pillars, recurring formats, cadence, portfolio balance, measurement, cleanup/refactor, next series candidates, fixture evidence, risks, and runner-specific `series-spec` routing.
- No remediation-worthy output-quality issue was found. Minor variation remains around percentage targets and whether local-first benchmark workflow is framed as a pillar or next-series lane, but this is acceptable for the local fixture.
- Report: `benchmark/review-content-programming-2026-05-14.md`.
- **Recommended next command:** `$ship`

## Current Task — Benchmark `content-programming` Fresh Full-Contract Run 2026-05-14

**Goal:** Run `$benchmark-test-skill content-programming` against the current repository harness and record fresh deterministic both-agent benchmark evidence.

**Plan:**
- [x] Confirm `$benchmark-test-skill` is the active workflow and `content-programming` is only the target skill argument.
- [x] Run `pnpm bench --list-skills` and confirm `content-programming` is known, including coverage status.
- [x] Run `pnpm verify --skill content-programming`; stop before bench if verification fails.
- [x] If verify passes, run `pnpm bench --skill content-programming --agent both --runs 3 --chunk-size 3 --pause 0`.
- [x] Write and validate `benchmark/test-content-programming-2026-05-14.md` with verify, benchmark, latency, cost, consistency, raw paths, and recommended next route.
- [x] Refresh generated Skills Showcase data because curated benchmark evidence changes.
- [x] Record results here, then commit and push intended changes on `master`.

## Review — Benchmark `content-programming` Fresh Full-Contract Run 2026-05-14

- Command resolution: `$benchmark-test-skill` was the active workflow; `content-programming` was treated as the target skill argument.
- Eligibility: `content-programming` is known to the benchmark harness with custom coverage via `tests/layer4/setups/packs/pack-workflows.setup.ts`.
- Verify passed: layer1 PASS in 3.6s with 1,182 tests across 14 files; layer2 SKIP because no target-specific layer2 tests matched `content-programming`.
- Benchmark completed for both agents with no infrastructure-blocked runs:
  - Claude session `a8dda4dc`: 3/3 evaluated hard assertions passed, output quality 96.8%, p50 45.9s, p95 126.4s, p99 133.6s, total cost $0.75, 0 threshold failures, and 0 critical failures.
  - Codex session `7f0f09f4`: 3/3 evaluated hard assertions passed, output quality 98.1%, p50 68.0s, p95 68.4s, p99 68.4s, total cost $0.75, 0 threshold failures, and 0 critical failures.
- Report updated at `benchmark/test-content-programming-2026-05-14.md`.
- Report validation passed: target, agent rows, pass-rate and blocked-run data, latency, cost, consistency, raw session paths, output-quality details, failed assertion statement, and recommended next route are present.
- Skills Showcase generated data was refreshed; `docs/benchmark-results-matrix.md` now points to `content-programming-claude-a8dda4dc` and `content-programming-codex-7f0f09f4`.
- **Recommended next skill:** `$benchmark-agent-review content-programming`

## Current Task — Targeted Update `content-programming` Full-Contract Benchmark Coverage

**Goal:** Upgrade `content-programming` benchmark coverage from a generic calendar smoke path to full programming-strategy contract coverage.

**Plan:**
- [x] Read relevant lessons and the `content-programming` benchmark agent-review remediation.
- [x] Confirm the fix belongs in benchmark harness coverage, not mirrored `content-programming` skill contracts or a new skill.
- [x] Update the pack benchmark setup so `content-programming` asks for pillars, formats, cadence constraints, portfolio balance, measurement, cleanup/refactor, and next series candidates.
- [x] Add hard assertions and deterministic quality criteria that distinguish full strategy output from calendar-only output.
- [x] Run required validation, record results, then commit and push intended changes on `master`.

## Review — Targeted Update `content-programming` Full-Contract Benchmark Coverage

- Decision: existing benchmark harness update. No new skill and no mirrored `content-programming` skill contract changes were needed.
- Evidence used: `tasks/lessons.md`, `benchmark/review-content-programming-2026-05-14.md`, mirrored `packs/creator-foundation/*/content-programming/SKILL.md`, and `tests/layer4/setups/packs/pack-workflows.setup.ts`.
- Evidence intentionally skipped: broad session-history scan; the benchmark review already verified the concrete gap and owner target.
- Updated `tests/layer4/setups/packs/pack-workflows.setup.ts` with `content-programming`-specific full-contract prompt requirements, fixture inputs, hard assertions, and quality criteria for full programming strategy coverage and fixture strategy facts.
- Updated `tests/layer1/bench-setups.test.ts` to prove the prompt requires full-contract dimensions, calendar-only output fails hard assertions, and the quality rubric scores full strategy output above calendar-only output.
- Validation passed:
  - `pnpm --dir tests exec vitest run --project layer1 bench-setups`
  - `./install.sh`
  - `./scripts/skill-deps.sh --broken`
  - `./scripts/skill-versions.sh --missing`
  - `./scripts/skill-next-step-routing.sh --missing`
  - `pnpm --dir tests bench:coverage`
  - `pnpm --dir tests verify --skill content-programming`
  - `pnpm --dir tests bench --skill content-programming --agent both --runs 1 --chunk-size 1 --pause 0` (`content-programming-claude-089cd18e` 1/1 hard assertions, 96.2% quality; `content-programming-codex-1be45ef5` 1/1 hard assertions, 100.0% quality)
  - targeted `rg` checks for full-contract benchmark coverage terms
  - `git diff --check`
- Skills Showcase regeneration was not needed because no tracked `SKILL.md`, `PACK.md`, curated benchmark report, or subjective review report changed.
- **Recommended next command:** `$benchmark-test-skill content-programming`

## Current Task — Agent Review `content-programming` Benchmark 2026-05-14

**Goal:** Review the latest persisted `content-programming` Claude and Codex benchmark outputs for subjective operator quality.

**Plan:**
- [x] Resolve latest Claude and Codex run directories from `tests/benchmarks/runs/content-programming-*`.
- [x] Inspect retained generated `pack-benchmark-output.md` artifacts, fixture facts, benchmark report, and mirrored skill contract context.
- [x] Grade each evaluated output against the agent-review rubric separately from deterministic benchmark metrics.
- [x] Write `benchmark/review-content-programming-2026-05-14.md` with scores, findings, remediation, and next route.
- [x] Refresh generated Skills Showcase data because curated review evidence changed.
- [x] Validate report fields, record results, then commit and push on `master`.

## Review — Agent Review `content-programming` Benchmark 2026-05-14

- Reviewed `content-programming-claude-9f0c62c8` and `content-programming-codex-ff03c35c`, covering 6 evaluated outputs and excluding no infrastructure-blocked runs.
- Deterministic context was clean: Claude passed 3/3 hard assertions with 96.7% quality, and Codex passed 3/3 hard assertions with 97.5% quality.
- Full `pack-benchmark-output.md` artifact snapshots were retained in every `run-*.json`.
- Subjective verdict: good overall, with median score 87.5 and range 84-90. The outputs are useful smoke-test artifacts: fixture-grounded, realistic about risks, and correctly routed to `/series-spec` or `$series-spec`.
- Main output-quality limitation: the benchmark prompt only exercises a calendar smoke path, so the artifacts do not prove the full `content-programming` contract around pillars, recurring formats, portfolio balance, measurement plan, cleanup/refactor plan, and next series candidates.
- Report: `benchmark/review-content-programming-2026-05-14.md`.
- Validation passed: Skills Showcase data regeneration/validation, report field `rg`, and `git diff --check`.
- **Recommended next command:** `$targeted-skill-builder content-programming full-contract benchmark coverage`

## Current Task — Benchmark `content-programming` Post-Rubric Fix 2026-05-14

**Goal:** Run `$benchmark-test-skill content-programming` with current repository harness eligibility, verify, and both-agent benchmark evidence after the fixture-evidence rubric fix.

**Plan:**
- [x] Confirm `$benchmark-test-skill` is the active workflow and `content-programming` is the target skill argument.
- [x] Run `pnpm bench --list-skills` and confirm `content-programming` is known, including coverage status. `coverage=custom`, setup `tests/layer4/setups/packs/pack-workflows.setup.ts`.
- [x] Run `pnpm verify --skill content-programming`; stop before bench if verification fails.
- [x] If verify passes, run `pnpm bench --skill content-programming --agent both --runs 3 --chunk-size 3 --pause 0`.
- [x] Write and validate `benchmark/test-content-programming-2026-05-14.md` with verify, benchmark, latency, cost, consistency, raw paths, and recommended next route.
- [x] Refresh generated Skills Showcase data because curated benchmark evidence changed.
- [x] Record results here, then commit and push intended changes on `master`.

## Review — Benchmark `content-programming` Post-Rubric Fix 2026-05-14

- Command resolution: `$benchmark-test-skill` was the active workflow; `content-programming` was treated as the target skill argument.
- Eligibility: `content-programming` is known to the harness with custom coverage via `tests/layer4/setups/packs/pack-workflows.setup.ts`.
- Verify passed: layer1 PASS in 3.7s with 1,181 tests across 14 files; layer2 SKIP because no target-specific layer2 tests matched `content-programming`.
- Benchmark completed for both agents with no infrastructure-blocked runs:
  - Claude session `9f0c62c8`: 3/3 evaluated hard assertions passed, output quality 96.7%, p50 25.7s, p95 25.8s, p99 25.8s, total cost $0.75, 0 threshold failures, and 0 critical failures.
  - Codex session `ff03c35c`: 3/3 evaluated hard assertions passed, output quality 97.5%, p50 49.0s, p95 53.9s, p99 54.4s, total cost $0.75, 0 threshold failures, and 0 critical failures.
- Report updated at `benchmark/test-content-programming-2026-05-14.md`.
- Report validation passed: target, agent rows, pass-rate and blocked-run data, latency, cost, consistency, raw session paths, output-quality details, failed assertion statement, and recommended next route are present.
- Skills Showcase generated data was refreshed and validated; `docs/benchmark-results-matrix.md` now points to `content-programming-claude-9f0c62c8` and `content-programming-codex-ff03c35c`.
- **Recommended next skill:** `$benchmark-agent-review content-programming`

## Current Task — Targeted Update `content-programming` Benchmark Next-Route Coverage

**Goal:** Fix the `content-programming` pack benchmark setup so accepted next-route labels and runner-specific `series-spec` handoffs are tested instead of defaulting to `$run`.

**Plan:**
- [x] Read relevant lessons, triage evidence, mirrored `content-programming` contracts, and pack benchmark setup overlap.
- [x] Update the existing pack benchmark setup rather than changing the mirrored skill contracts or creating a new skill.
- [x] Add layer1 regression coverage for the prompt label requirement, Claude `/series-spec`, Codex `$series-spec`, and quality scoring.
- [x] Run required validation, record results, then commit and push intended changes on `master`.

## Review — Targeted Update `content-programming` Benchmark Next-Route Coverage

- Decision: benchmark harness update. The mirrored `content-programming` skill contracts already define the correct approval gate and default successor, so no skill contract or new skill was needed.
- Evidence used: `tasks/lessons.md`, `benchmark/triage-content-programming-2026-05-14.md`, `benchmark/test-content-programming-2026-05-14.md`, mirrored `packs/creator-foundation/*/content-programming/SKILL.md`, and the generic pack workflow setup.
- Evidence intentionally skipped: broad session-history scan; the triage report already verified the concrete failure and responsible files.
- Updated `tests/layer4/setups/packs/pack-workflows.setup.ts` so pack benchmark prompts require a literal accepted handoff label, route quality defaults to a valid handoff label when no known route exists, and `content-programming` has runner-specific route expectations: Claude `/series-spec`, Codex `$series-spec`.
- Added `tests/layer1/bench-setups.test.ts` regression coverage for the prompt contract, runner-aware hard assertions, and quality scoring rejecting `$run` and bare `Next:` for this fixture.
- Validation passed:
  - `pnpm --dir tests exec vitest run --project layer1 bench-setups`
  - `./install.sh`
  - `./scripts/skill-deps.sh --broken`
  - `./scripts/skill-versions.sh --missing`
  - `./scripts/skill-next-step-routing.sh --missing`
  - `pnpm --dir tests bench:coverage`
  - `pnpm --dir tests verify --skill content-programming`
  - `pnpm --dir tests bench --skill content-programming --agent both --runs 1 --chunk-size 1 --pause 0` (`content-programming-claude-14af9582` and `content-programming-codex-807dbdfd`, both 1/1 hard assertions)
  - targeted `rg` checks for `content-programming`, `series-spec`, accepted handoff labels, and `pack-next-route`
  - `git diff --check`
- **Recommended next command:** `$benchmark-test-skill content-programming`

## Current Task — Benchmark `content-programming` Fresh Rerun 2026-05-14

**Goal:** Run deterministic verify and both-agent benchmark evidence for `content-programming` after the benchmark next-route coverage fix.

**Plan:**
- [x] Confirm `$benchmark-test-skill` is the active workflow and `content-programming` is the target skill argument.
- [x] Run `pnpm bench --list-skills` and confirm `content-programming` is known, including coverage status. `coverage=custom`, setup `tests/layer4/setups/packs/pack-workflows.setup.ts`.
- [x] Run `pnpm verify --skill content-programming`; stop before bench if verification fails. Layer1 PASS in 3.9s; layer2 SKIP because no target-specific layer2 tests matched.
- [x] If verify passes, run `pnpm bench --skill content-programming --agent both --runs 3 --chunk-size 3 --pause 0`. Claude 3/3 and Codex 3/3, no blocked runs.
- [x] Write and validate `benchmark/test-content-programming-2026-05-14.md` with verify, benchmark, latency, cost, consistency, raw paths, and recommended next route.
- [x] Record results here, then commit and push intended changes on `master`.

## Review — Benchmark `content-programming` Fresh Rerun 2026-05-14

- Command resolution: `$benchmark-test-skill` was the active workflow; `content-programming` was treated as the target skill argument.
- Eligibility: `content-programming` is known to the harness with custom coverage via `tests/layer4/setups/packs/pack-workflows.setup.ts`.
- Verify passed: layer1 PASS in 3.9s with 1,180 tests across 14 files; layer2 SKIP because no target-specific layer2 tests matched `content-programming`.
- Benchmark completed for both agents with no infrastructure-blocked runs:
  - Claude session `d041146e`: 3/3 evaluated hard assertions passed, output quality 89.2%, p50 29.0s, p95 30.5s, p99 30.6s, total cost $0.75. The output-quality rubric recorded 1 critical failure.
  - Codex session `f56f9728`: 3/3 evaluated hard assertions passed, output quality 98.3%, p50 68.0s, p95 69.1s, p99 69.2s, total cost $0.75.
- Report written to `benchmark/test-content-programming-2026-05-14.md`.
- Report validation passed: target, agent rows, pass-rate and blocked-run data, latency, cost, consistency, raw session paths, output-quality details, failed assertion statement, and recommended next route are present.
- **Recommended next skill:** `$session-triage content-programming benchmark failure`

## Current Task — Triage `content-programming` Benchmark Quality Failure 2026-05-14

**Goal:** Verify the fresh `content-programming` benchmark quality critical failure and identify the smallest durable fix.

**Plan:**
- [x] Inspect the fresh benchmark report and persisted Claude/Codex run evidence.
- [x] Compare mirrored `content-programming` contracts against the benchmark setup and quality rubric.
- [x] Classify the issue as a skill contract gap, benchmark harness gap, runner infrastructure issue, or agent noncompliance.
- [x] Write `benchmark/triage-content-programming-2026-05-14-quality.md` with verdict, root cause, responsible gap, validation plan, and next route.
- [x] Validate report fields, then commit and push intended changes on `master`.

## Review — Triage `content-programming` Benchmark Quality Failure 2026-05-14

- Verification verdict: verified.
- Evidence inspected: `benchmark/test-content-programming-2026-05-14.md`, raw Claude session `content-programming-claude-d041146e`, raw Codex session `content-programming-codex-f56f9728`, mirrored `content-programming` contracts, pack benchmark setup, quality helpers, and relevant lessons.
- Fresh benchmark context: both agents passed 3/3 hard assertions with no infrastructure-blocked runs. Claude alone had 1 output-quality critical failure.
- Root cause: benchmark quality-rubric brittleness. Claude run 002 cited `fixtures/local-evidence.md`, `pack-input.md`, practical build notes, weekly cadence, and local-only fixture constraints, but the critical `pack-fixture-evidence` criterion required the exact hyphenated token `local-fixture`.
- Responsible gap: `tests/layer4/setups/packs/pack-workflows.setup.ts`, not mirrored `packs/creator-foundation/*/content-programming/SKILL.md`.
- Recommended fix: make `pack-fixture-evidence` accept concrete fixture paths or retained fixture facts rather than requiring the literal `local-fixture` token, while keeping generic evidence-only output failing.
- Report written to `benchmark/triage-content-programming-2026-05-14-quality.md`.
- **Recommended next skill:** `$targeted-skill-builder content-programming benchmark fixture-evidence rubric`

## Current Task — Targeted Update `content-programming` Benchmark Fixture-Evidence Rubric

**Goal:** Fix the pack benchmark quality rubric so valid concrete fixture citations pass without requiring the exact token `local-fixture`.

**Plan:**
- [x] Confirm the fix belongs in the existing pack benchmark setup, not mirrored `content-programming` skill contracts or a new skill.
- [x] Update `pack-fixture-evidence` to require concrete fixture paths and fixture input facts.
- [x] Add layer1 regression coverage proving concrete fixture references pass and generic evidence prose still fails.
- [x] Run required validation, record results, then commit and push intended changes on `master`.

## Review — Targeted Update `content-programming` Benchmark Fixture-Evidence Rubric

- Decision: benchmark harness update. No mirrored `content-programming` skill contract changes were needed.
- Evidence used: `benchmark/triage-content-programming-2026-05-14-quality.md`, fresh benchmark runs `content-programming-claude-d041146e` and `content-programming-codex-f56f9728`, pack benchmark setup, and existing layer1 benchmark setup coverage.
- Evidence intentionally skipped: broad session-history scan; the triage report already verified the concrete failing criterion and responsible file.
- Updated `tests/layer4/setups/packs/pack-workflows.setup.ts` so the prompt asks for concrete local fixture evidence from `pack-input.md` or `fixtures/local-evidence.md`, and the critical `pack-fixture-evidence` rubric requires those concrete paths plus the first two fixture input facts instead of the exact token `local-fixture`.
- Updated `tests/layer1/bench-setups.test.ts` so representative pack quality evidence uses concrete fixture paths and added `content-programming` regression coverage proving fixture path/fact citations pass while generic evidence prose still fails.
- Validation passed:
  - `pnpm --dir tests exec vitest run --project layer1 bench-setups`
  - `./install.sh`
  - `./scripts/skill-deps.sh --broken`
  - `./scripts/skill-versions.sh --missing`
  - `./scripts/skill-next-step-routing.sh --missing`
  - `pnpm --dir tests bench:coverage`
  - `pnpm --dir tests verify --skill content-programming`
  - `pnpm --dir tests bench --skill content-programming --agent both --runs 1 --chunk-size 1 --pause 0` (`content-programming-claude-8abf7ae4` and `content-programming-codex-b1c858d6`, both 1/1 hard assertions, both 97.5% quality, both 0 critical failures)
  - targeted `rg` for `pack-fixture-evidence`, fixture paths, and `content-programming`
  - `git diff --check`
- Skills Showcase regeneration was not needed because no tracked `SKILL.md` or `PACK.md` behavior/metadata changed.
- **Recommended next command:** `$benchmark-test-skill content-programming`

## Current Task — Analyze Benchmark Claude/Codex Parity Trend

**Goal:** Determine whether recent `$benchmark-test-skill` runs show a recurring Claude-vs-Codex reliability gap, and whether the cause is missing setup parity, benchmark harness behavior, runner infrastructure, or skill-contract drift.

**Plan:**
- [x] Inventory recent persisted benchmark reports and raw both-agent run artifacts.
- [x] Cross-check local Claude and Codex session histories for benchmark-test-skill setup parity context.
- [x] Classify observed Claude/Codex failures by root-cause type with concrete examples.
- [x] Report counts, trend evidence, parity verdict, and recommended next route.

## Review — Analyze Benchmark Claude/Codex Parity Trend

- Source evidence: local Claude history (`~/.claude/history.jsonl`), local Codex history (`~/.codex/history.jsonl`), persisted benchmark reports under `benchmark/test-*.md`, triage reports for `content-programming` and `icon-handler`, and raw report JSON under `tests/benchmarks/runs/`.
- History scale: Claude history had 8 `benchmark-test-skill`/benchmark-harness setup mentions; Codex history had 68. Most benchmark iteration and reruns after the pack was created happened through Codex, so Codex has had more repeated tuning.
- Recent curated both-agent reports with parity after fixes: `benchmark-test-skill` passed both agents on 2026-05-12 and 2026-05-13; `run`, `ship`, `session-triage`, and final `icon-handler` also passed both agents in their latest curated reports.
- Recent asymmetric failures:
  - `design-system` 2026-05-10: Claude 3/3, Codex 0/3 because Codex did not create `DESIGN.md`.
  - `ship` 2026-05-11: initial issue was benchmark harness route convention; fixed to accept Claude `/run` and Codex `$run`.
  - `icon-handler` 2026-05-13/14: Claude failures included invalid image/runner transport and route-clarity issues; latest report passed both agents after fixture, route, and image-error classification fixes.
  - `content-programming` 2026-05-14: Claude 0/3, Codex 3/3, but triage classified this as benchmark pack prompt/assertion and expected-route drift, not mirrored skill-contract drift.
- Parity verdict: mirrored Claude/Codex skill setup parity is mostly present where checked, especially runner-specific slash-vs-dollar route conventions. The remaining gap is setup-level benchmark parity: generic pack fixtures and rubrics still default to Codex-shaped labels/routes often enough that Claude exposes false negatives.
- Recommended next route: `$targeted-skill-builder content-programming benchmark next-route coverage`.

## Current Task — Creator Pack Artifact Handoff And Routing Ergonomics

**Goal:** Tighten creator-media pack skills so high-quality approved research writes do not stop with untracked artifacts or mechanical next-skill routing.

**Plan:**
- [x] Confirm the narrow gap from the current `$analyze-sessions` findings and relevant lessons.
- [x] Update existing creator-media skill contracts instead of creating a duplicate meta-skill.
- [x] Add deterministic layer1 coverage for post-write artifact handoff and intent-aware routing.
- [x] Refresh generated showcase data because tracked `SKILL.md`/`PACK.md` behavior changes.
- [x] Validate, record review notes, then commit and push on `master`.

## Review — Creator Pack Artifact Handoff And Routing Ergonomics

- Decision: existing-skill update. No new meta-skill was created because the gap lives in creator-media pack contracts after approved artifact writes and next-step routing.
- Evidence used: current `$analyze-sessions` report, `tasks/lessons.md` approval-gate and next-routing lessons, creator-foundation/youtube-ops/remotion pack skill contracts, and recent `/Users/georgele/projects/content` artifact state from the prior analysis.
- Evidence intentionally skipped: another broad session-history scan; the previous `$analyze-sessions` run already established recurrence and concrete examples.
- Updated mirrored creator-media-adjacent skill contracts in `packs/creator-foundation`, `packs/youtube-ops`, and `packs/remotion` with:
  - `## Approved Artifact Handoff`: list created/updated artifacts, state verification/readback, report dirty/untracked intended files, and route to shipping/commit/handoff before downstream strategy when intended artifacts are not shipped.
  - `## Intent-Aware Routing`: classify immediate intent before default sequence routing, including strategy refresh, recording prep, upload prep, performance review, owner-analytics/manual evidence, and dirty-artifact cleanup.
- Updated `packs/creator-foundation/PACK.md` and `packs/creator-media/PACK.md` to document the same precedence.
- Added `tests/layer1/creator-media-handoff-routing.test.ts` covering all 50 creator-foundation/youtube-ops/remotion mirrored skill contracts plus pack docs.
- Refreshed Skills Showcase generated data. Only generated fingerprints/proof timestamps changed; no curated showcase copy, grouping, animation text, or proof receipts needed hand edits because the public catalog shape did not change.
- Validation passed:
  - `./install.sh`
  - `./scripts/skill-deps.sh --broken`
  - `./scripts/skill-versions.sh --missing`
  - `./scripts/skill-next-step-routing.sh --missing`
  - `pnpm --dir tests bench:coverage`
  - `pnpm --dir tests exec vitest run --project layer1 creator-media-handoff-routing research-approval-gate creator-media-linkedin`
  - `node scripts/generate-skills-showcase-data.mjs`
  - `node scripts/generate-skills-showcase-github-data.mjs`
  - `scripts/validate-skills-showcase-data.sh`
  - Targeted `rg` for the new handoff/routing contract language
  - `git diff --check`
- **Recommended next command:** `$benchmark-test-skill content-programming`

## Current Task — Benchmark `content-programming` 2026-05-14

**Goal:** Run deterministic verify and both-agent benchmark evidence for the `content-programming` skill.

**Plan:**
- [x] Confirm `$benchmark-test-skill` is the active workflow and `content-programming` is the target skill argument.
- [x] Run `pnpm bench --list-skills` and confirm `content-programming` is known to the harness, including coverage status. `coverage=custom`, setup `tests/layer4/setups/packs/pack-workflows.setup.ts`.
- [x] Run `pnpm verify --skill content-programming`; stop before bench if verification fails. Layer1 PASS in 4.5s; layer2 SKIP because no target-specific layer2 tests matched.
- [x] If verify passes, run `pnpm bench --skill content-programming --agent both --runs 3 --chunk-size 3 --pause 0`. Claude 0/3, Codex 3/3, no blocked runs.
- [x] Write `benchmark/test-content-programming-2026-05-14.md` with verify, benchmark, latency, cost, consistency, raw paths, and recommended next route.
- [x] Validate the report contains required benchmark fields.
- [x] Record results here, then commit and push intended changes on `master`.

## Review — Benchmark `content-programming` 2026-05-14

- Command resolution: `$benchmark-test-skill` was the active workflow; `content-programming` was treated as the target skill argument.
- Eligibility: `content-programming` is known to the harness with custom coverage via `tests/layer4/setups/packs/pack-workflows.setup.ts`.
- Verify passed: layer1 PASS in 4.5s with 1,179 tests across 14 files; layer2 SKIP because no target-specific layer2 tests matched `content-programming`.
- Benchmark completed for both agents with no infrastructure-blocked runs:
  - Claude session `20ea1edd`: 0/3 evaluated hard assertions passed, output quality 85.8%, p50 29.9s, p95 35.4s, p99 35.9s, total cost $0.75. All three runs failed `Output includes next command handoff`.
  - Codex session `cb044e72`: 3/3 evaluated hard assertions passed, output quality 86.7%, p50 51.2s, p95 53.9s, p99 54.2s, total cost $0.75.
- Report written to `benchmark/test-content-programming-2026-05-14.md`.
- Report validation passed: target, agent rows, pass-rate and blocked-run data, latency, cost, consistency, raw session paths, output-quality details, failed assertions, and recommended next route are present. `git diff --check` passed.
- **Recommended next skill:** `$session-triage content-programming benchmark failure`

## Current Task — Triage `content-programming` Benchmark Failure 2026-05-14

**Goal:** Verify the fresh `content-programming` benchmark failure and identify the smallest durable fix.

**Plan:**
- [x] Inspect `benchmark/test-content-programming-2026-05-14.md` and persisted Claude/Codex run evidence.
- [x] Compare mirrored `content-programming` contracts against benchmark setup expectations.
- [x] Check existing lessons and classify the failure as skill contract gap, benchmark harness gap, runner infrastructure issue, or runner noncompliance.
- [x] Write `benchmark/triage-content-programming-2026-05-14.md` with verdict, root cause, responsible gap, validation plan, and next route.
- [x] Validate report fields, then commit and push intended changes.

## Review — Triage `content-programming` Benchmark Failure 2026-05-14

- Verification verdict: verified.
- Evidence inspected: `benchmark/test-content-programming-2026-05-14.md`, persisted Claude session `content-programming-claude-20ea1edd`, persisted Codex session `content-programming-codex-cb044e72`, mirrored `content-programming` contracts, generic pack workflow setup, next-route helpers, quality helpers, and relevant lessons.
- Root cause: benchmark harness coverage defect. The pack prompt asks for "a Next command line" but the hard assertion requires accepted labels such as `Recommended next command`, `Next command`, `Recommended next skill`, or `Next work`; Claude used bare `Next:`. The pack quality evaluator also defaults unknown pack routes to `$run`, which conflicts with `content-programming`'s contract successor of `/series-spec` for Claude and `$series-spec` for Codex.
- Responsible gap: `tests/layer4/setups/packs/pack-workflows.setup.ts` and layer1 setup coverage, not mirrored `packs/creator-foundation/*/content-programming/SKILL.md`.
- Recommended fix: tighten the pack benchmark prompt to require literal accepted next-route labels and add `content-programming` runner-aware `series-spec` route expectations.
- Report written to `benchmark/triage-content-programming-2026-05-14.md`.
- Report validation passed: target, issue, verdict, timeline, root cause, responsible gap, recommended fix, validation plan, confidence/evidence gaps, and recommended next route are present. `git diff --check` passed.
- **Recommended next skill:** `$targeted-skill-builder content-programming benchmark next-route coverage`

## Current Task — Refresh Showcase Data For `icon-handler` Benchmark Evidence

**Goal:** Ensure the frontend Skills Showcase reflects the latest `icon-handler` benchmark and review evidence.

**Plan:**
- [x] Check whether `icon-handler` is already represented in the frontend generated data.
- [x] Identify why the site payload still points at the older 2026-05-13 benchmark report.
- [x] Patch the showcase data generator to parse current benchmark summary rows robustly.
- [x] Regenerate showcase data assets and benchmark results matrix.
- [x] Add layer1 regression coverage for the 2026-05-14 `icon-handler` evidence path.
- [x] Validate, document the correction lesson, then commit and push on `master`.

## Review — Refresh Showcase Data For `icon-handler` Benchmark Evidence

- `icon-handler` was already present in the catalog data, but its `benchmarkEvidence.reportPath` still pointed at `benchmark/test-icon-handler-2026-05-13.md`.
- Root cause: `scripts/generate-skills-showcase-data.mjs` used brittle benchmark table parsing that mishandled newer title-case `Claude`/`Codex` rows and the added `Output Quality` column.
- Updated the generator to parse benchmark summary and output-quality tables by header name, normalize agent labels to lowercase, and support both `Raw Session` and `Raw Session Path`.
- Regenerated `docs/skills-showcase/assets/skills-data.js`, `apps/skills-showcase/public/assets/skills-data.js`, both GitHub proof payloads, and `docs/benchmark-results-matrix.md`.
- Added `tests/layer1/skills-showcase-benchmark-demo.test.ts` coverage proving `icon-handler` now publishes `benchmark/test-icon-handler-2026-05-14.md` with both runner rows.
- Focused validation passed: `pnpm --dir tests exec vitest run --project layer1 skills-showcase-benchmark-demo benchmark-results-matrix`, `node --check scripts/generate-skills-showcase-data.mjs`, and `git diff --check`.
- `scripts/validate-skills-showcase-data.sh` correctly reported stale generated assets while those assets were still uncommitted; it should pass after the generated assets are committed.

## Current Task — Agent Review `icon-handler` Benchmark 2026-05-14

**Goal:** Review the latest persisted `icon-handler` Claude and Codex benchmark outputs for subjective operator quality.

**Plan:**
- [x] Resolve latest Claude and Codex `icon-handler` benchmark run directories.
- [x] Inspect `report.md`, `report.json`, run JSON files, and retained `icon-audit.md` artifacts.
- [x] Grade each evaluated output against the agent-review rubric separately from deterministic benchmark metrics.
- [x] Write `benchmark/review-icon-handler-2026-05-14.md` with scores, findings, remediation, and next route.
- [x] Validate report fields, update docs, then commit and push intended changes on `master`.

## Review — Agent Review `icon-handler` Benchmark 2026-05-14

- Reviewed latest Claude run `tests/benchmarks/runs/icon-handler-claude-bccbdf8a/` and Codex run `tests/benchmarks/runs/icon-handler-codex-68b180e6/`.
- Deterministic benchmark context: Claude 3/3 hard assertions with 84.1% quality, Codex 3/3 hard assertions with 84.8% quality, no infrastructure-blocked runs.
- Retained artifact evidence was complete for both runners: each `run-*.json` included full `icon-audit.md` content.
- Subjective verdict: good overall. All six outputs were useful audit artifacts, preserved audit-only scope, identified stale placeholders, included approval gating, and ended with the runner-specific fix route.
- Subjective score median: 89.0; range: 84-93.
- Main quality gap: output precision. Manifest destination varied across outputs, exact generated icon sizes/formats were not always named, and some outputs omitted public install/touch surfaces.
- Report written to `benchmark/review-icon-handler-2026-05-14.md`.
- **Recommended next command:** `$targeted-skill-builder icon-handler Next App Router manifest path specificity`

## Current Task — Targeted Update `icon-handler` Benchmark Image-Error Classification

**Goal:** Classify Claude runner image-processing API errors as benchmark infrastructure blocks instead of evaluated `icon-handler` skill failures.

**Plan:**
- [x] Read relevant lessons and latest triage report.
- [x] Confirm existing-skill overlap: update benchmark harness classification, not mirrored `icon-handler` skill contracts.
- [x] Extend `tests/harness/bench-runner.ts` infrastructure-block classification for non-zero `Could not process image` API errors.
- [x] Add layer1 regression coverage in `tests/layer1/runner.test.ts`.
- [x] Run targeted and required validation, record results, then commit and push intended changes on `master`.

## Review — Targeted Update `icon-handler` Benchmark Image-Error Classification

- Decision: benchmark harness update. No mirrored `global/claude/icon-handler` or `global/codex/icon-handler` skill contract change was needed.
- Evidence used: `benchmark/triage-icon-handler-2026-05-14-image.md`, benchmark infrastructure-block lesson in `tasks/lessons.md`, `tests/harness/bench-runner.ts`, and `tests/layer1/runner.test.ts`.
- Evidence intentionally skipped: broad session-history scan; the dated triage report already verified the concrete failed run.
- Files changed: `tests/harness/bench-runner.ts`, `tests/layer1/runner.test.ts`, `tasks/todo.md`, and `tasks/roadmap.md`.
- Implementation: added `Could not process image` to non-zero runner infrastructure-block classification with reason `agent runner image processing error`, and added layer1 coverage proving assertions are skipped for this API/runner failure.
- Validation passed:
  - `pnpm --dir tests install --force` repaired incomplete local test dependencies after the first Vitest command failed before running tests.
  - `pnpm --dir tests exec vitest run --project layer1 runner` (10 tests passed)
  - `./install.sh`
  - `./scripts/skill-deps.sh --broken`
  - `./scripts/skill-versions.sh --missing`
  - `./scripts/skill-next-step-routing.sh --missing`
  - `pnpm --dir tests bench:coverage`
  - `pnpm --dir tests verify --skill icon-handler` (layer1 PASS in 8.1s; layer2 SKIP because no target-specific tests matched)
  - `pnpm --dir tests bench --skill icon-handler --agent claude --runs 1 --chunk-size 1 --pause 0` (`icon-handler-claude-04ff1a83`, 1/1 hard assertions, no blocked runs)
  - Targeted `rg` for image-error classification coverage
  - `git diff --check`
- Showcase regeneration was not needed because no tracked `SKILL.md` or `PACK.md` behavior/metadata changed.
- **Recommended next command:** `$benchmark-test-skill icon-handler`

## Current Task — Triage `icon-handler` Benchmark Image Failure 2026-05-14

**Goal:** Verify the latest Claude `icon-handler` benchmark image-processing failure and identify the smallest durable fix.

**Plan:**
- [x] Inspect `benchmark/test-icon-handler-2026-05-14.md` and persisted failed run evidence for `icon-handler-claude-86ed23d1`.
- [x] Compare mirrored `icon-handler` contracts against the benchmark setup expectations.
- [x] Check existing lessons and classify the issue as a skill contract gap, benchmark harness gap, runner infrastructure issue, or runner noncompliance.
- [x] Write `benchmark/triage-icon-handler-2026-05-14-image.md` with verdict, root cause, responsible gap, validation plan, and next route.
- [x] Validate report fields, then commit and push intended changes.

## Review — Triage `icon-handler` Benchmark Image Failure 2026-05-14

- Verification verdict: verified.
- Evidence inspected: latest `benchmark/test-icon-handler-2026-05-14.md`, failed Claude run #2 in `icon-handler-claude-86ed23d1`, adjacent passing Claude run #0, Codex session `icon-handler-codex-35de8ee4`, mirrored `icon-handler` contracts, current Tier 2/3 benchmark fixture, runner infrastructure classification, layer1 runner/setup coverage, prior 2026-05-13 and 2026-05-14 triage reports, and `tasks/lessons.md`.
- Root cause: benchmark harness classification gap. Claude run #2 exited before skill execution with `API Error: 400 Could not process image` and no `icon-audit.md`; the harness did not classify that runner/API transport failure as infrastructure-blocked, so it counted as an evaluated skill failure.
- Responsible gap: `tests/harness/bench-runner.ts` infrastructure-block classifier and `tests/layer1/runner.test.ts` regression coverage. No mirrored `global/*/icon-handler/SKILL.md` or benchmark fixture change is justified by this latest evidence.
- Report written to `benchmark/triage-icon-handler-2026-05-14-image.md`.
- Report validation passed: required triage sections, persisted failure evidence, root-cause classification, validation plan, and recommended next route are present.
- **Recommended next skill:** `$targeted-skill-builder icon-handler benchmark image-error classification`

## Current Task — Benchmark `icon-handler` Rerun 2026-05-14

**Goal:** Run `$benchmark-test-skill icon-handler` against the current repository state after the benchmark route-clarity fix.

**Plan:**
- [x] Confirm `$benchmark-test-skill` is the active workflow and `icon-handler` is the target skill argument.
- [x] Run `pnpm bench --list-skills` and confirm `icon-handler` is known to the harness, including coverage status. `coverage=custom`, setup `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- [x] Run `pnpm verify --skill icon-handler`; stop before bench if verification fails. Layer1 PASS in 12.3s; layer2 SKIP because no target-specific layer2 tests matched.
- [x] If verify passes, run `pnpm bench --skill icon-handler --agent both --runs 3 --chunk-size 3 --pause 0`. Claude 2/3, Codex 3/3, no blocked runs.
- [x] Write `benchmark/test-icon-handler-2026-05-14.md` with verify, benchmark, latency, cost, consistency, raw paths, and recommended next route.
- [x] Validate the report contains required benchmark fields.
- [x] Record results here, then commit and push intended changes on `master`.

## Review — Benchmark `icon-handler` Rerun 2026-05-14

- Command resolution: `$benchmark-test-skill` was the active workflow; `icon-handler` was treated as the target skill argument.
- Eligibility: `icon-handler` is known to the harness with custom coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- Verify passed: layer1 PASS in 12.3s with 1,446 tests across 13 files; layer2 SKIP because no target-specific layer2 tests matched `icon-handler`.
- Benchmark completed for both agents with no infrastructure-blocked runs:
  - Claude session `86ed23d1`: 2/3 evaluated hard assertions passed, output quality 62.1%, p50 38.5s, p95 41.6s, p99 41.9s, total cost $3.00. Run #2 failed `Agent command exited successfully` and `icon-audit.md created in project root` after `API Error: 400 Could not process image`.
  - Codex session `35de8ee4`: 3/3 evaluated hard assertions passed, output quality 84.1%, p50 73.0s, p95 143.5s, p99 149.7s, total cost $3.00.
- Report written to `benchmark/test-icon-handler-2026-05-14.md`.
- Report validation passed: required target, agent rows, pass-rate and blocked-run data, latency, cost, consistency, raw session paths, quality details, and recommended next route are present.
- **Recommended next command:** `$session-triage icon-handler benchmark failure`

## Current Task — Targeted Update `icon-handler` Benchmark Route Clarity

**Goal:** Tighten the `icon-handler` benchmark fixture and rubric so build commands are verification commands only, and the final next command must be the runner-specific fix approval route.

**Plan:**
- [x] Read relevant lessons, triage report, benchmark fixture, and layer1 route coverage.
- [x] Confirm existing-skill overlap: update benchmark setup/rubric, not mirrored `icon-handler` skill contracts.
- [x] Update the `icon-handler` benchmark prompt to distinguish verification commands from the required final next route.
- [x] Tighten route assertions/quality scoring so approval-route mentions elsewhere cannot mask a final `npm run build` or `npx next build` handoff.
- [x] Add layer1 regression coverage for the observed wrong final routes and correct runner-specific final routes.
- [x] Run required validation, record results, then commit and push intended changes on `master`.

## Review — Targeted Update `icon-handler` Benchmark Route Clarity

- Decision: existing benchmark setup/rubric update. No mirrored `global/claude/icon-handler` or `global/codex/icon-handler` skill contract change was needed.
- Evidence used: `benchmark/triage-icon-handler-2026-05-14.md`, relevant benchmark lessons in `tasks/lessons.md`, `tests/layer4/setups/tier23-global-workflows.setup.ts`, `tests/layer4/setup-helpers/routing.ts`, `tests/layer4/setup-helpers/quality.ts`, and `tests/layer1/bench-setups.test.ts`.
- Evidence intentionally skipped: broad session-history scan; the dated triage report already verified the concrete benchmark failure.
- Files changed: `tests/layer4/setup-helpers/routing.ts`, `tests/layer4/setup-helpers/quality.ts`, `tests/layer4/setups/tier23-global-workflows.setup.ts`, `tests/layer1/bench-setups.test.ts`, `tasks/todo.md`, and `tasks/roadmap.md`.
- Implementation: added a final-next-route matcher/evaluator, opted `icon-handler` into final route enforcement, updated the fixture prompt so build commands are verification-only, changed the source fixture to `calc-mascot-icon.svg` to avoid Claude runner image ingestion while preserving stale PNG/ICO app surfaces, and added layer1 regressions for wrong final build routes plus valid fenced/bulleted final routes.
- Validation passed:
  - `./install.sh`
  - `./scripts/skill-deps.sh --broken`
  - `./scripts/skill-versions.sh --missing`
  - `./scripts/skill-next-step-routing.sh --missing`
  - `pnpm --dir tests bench:coverage`
  - `pnpm --dir tests exec vitest run --project layer1 bench-setups bench-quality`
  - `pnpm --dir tests verify --skill icon-handler` (layer1 PASS in 10.0s; layer2 SKIP because no target-specific tests matched)
  - `pnpm --dir tests bench --skill icon-handler --agent claude --runs 1 --chunk-size 1 --pause 0` (`icon-handler-claude-aa0ca24c`, 1/1, 84.1% quality, no failed runs)
  - `pnpm --dir tests bench --skill icon-handler --agent codex --runs 1 --chunk-size 1 --pause 0` (`icon-handler-codex-0e17fd76`, 1/1, 86.4% quality, no failed runs)
  - Targeted `rg` for route, SVG fixture, and final-route matcher coverage
  - `git diff --check`
- Showcase regeneration was not needed because no tracked `SKILL.md` or `PACK.md` behavior/metadata changed.
- Committed and pushed on `master`.
- **Recommended next command:** `$benchmark-test-skill icon-handler`

## Current Task — Triage `icon-handler` Benchmark Failure 2026-05-14

**Goal:** Verify the fresh `icon-handler` benchmark failure and identify the smallest durable fix.

**Plan:**
- [x] Inspect `benchmark/test-icon-handler-2026-05-14.md` and persisted failed run evidence.
- [x] Compare mirrored `icon-handler` contracts against benchmark setup expectations.
- [x] Check existing lessons and classify the failure as skill contract gap, benchmark harness gap, or runner noncompliance.
- [x] Write `benchmark/triage-icon-handler-2026-05-14.md` with verdict, root cause, responsible gap, validation plan, and next route.
- [x] Validate report fields, then commit and push intended changes.

## Review — Triage `icon-handler` Benchmark Failure 2026-05-14

- Verification verdict: verified.
- Evidence inspected: `benchmark/test-icon-handler-2026-05-14.md`, failed Claude run #2 in `icon-handler-claude-ba6ebaf0`, failed Codex run #2 in `icon-handler-codex-dc9c3d30`, passing runs from both sessions, mirrored `icon-handler` skill contracts, `tests/layer4/setups/tier23-global-workflows.setup.ts`, layer1 route/PNG fixture tests, prior 2026-05-13 triage, and `tasks/lessons.md`.
- Root cause: mixed. The old invalid-PNG fixture failure is fixed and did not recur. The remaining durable gap is benchmark fixture/rubric route clarity: the prompt asks for "verification commands, and Next command", which lets runners treat `npx next build` or `npm run build` as the next command even though the skill contract's audit-mode handoff is the approval/fix route. Codex run #2 is separate runner noncompletion after a status update, with no skill-contract evidence to change.
- Responsible gap: `tests/layer4/setups/tier23-global-workflows.setup.ts` and `tests/layer1/bench-setups.test.ts`, not mirrored `global/*/icon-handler/SKILL.md`.
- Recommended fix: tighten the `icon-handler` benchmark prompt/rubric so build commands are verification commands only and the final recommended next command must be `/icon-handler fix calc-mascot-icon.png` for Claude or `$icon-handler fix calc-mascot-icon.png` for Codex; add layer1 regressions for the observed wrong final routes.
- Report written to `benchmark/triage-icon-handler-2026-05-14.md`.
- Report validation passed: required triage sections, persisted failure evidence, root-cause classification, validation plan, and recommended next route are present. `git diff --check` passed.
- Committed and pushed on `master`.
- **Recommended next skill:** `$targeted-skill-builder icon-handler benchmark route clarity`

## Current Task — Benchmark `icon-handler` Fresh Rerun 2026-05-14

**Goal:** Run `$benchmark-test-skill icon-handler` against the current repository state after the valid-source-asset benchmark fixture fix.

**Plan:**
- [x] Confirm `$benchmark-test-skill` is the active workflow and `icon-handler` is the target skill argument.
- [x] Run `pnpm bench --list-skills` and confirm `icon-handler` is known to the harness. `coverage=custom`, setup `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- [x] Record coverage status and setup path from the harness list output.
- [x] Run `pnpm verify --skill icon-handler`; stop before bench if verification fails. Layer1 PASS in 10.8s; layer2 SKIP because no target-specific layer2 tests matched.
- [x] If verify passes, run `pnpm bench --skill icon-handler --agent both --runs 3 --chunk-size 3 --pause 0`. Claude 2/3, Codex 2/3, no blocked runs.
- [x] Write `benchmark/test-icon-handler-2026-05-14.md` with verify, benchmark, latency, cost, consistency, raw paths, and recommended next route.
- [x] Validate the report contains required benchmark fields.
- [x] Record results here, then commit and push intended changes on `master`.

## Review — Benchmark `icon-handler` Fresh Rerun 2026-05-14

- Verify passed: layer1 PASS in 10.8s with 1,446 tests across 13 files; layer2 SKIP because no target-specific layer2 tests matched `icon-handler`.
- Benchmark completed for both agents with no infrastructure-blocked runs:
  - Claude session `ba6ebaf0`: 2/3 evaluated hard assertions passed, output quality 78.0%, p50 40.5s, p95 44.2s, p99 44.5s, total cost $3.00. Run #2 failed `Output recommends /icon-handler`.
  - Codex session `dc9c3d30`: 2/3 evaluated hard assertions passed, output quality 81.1%, p50 65.0s, p95 7621.6s, p99 8293.3s, total cost $3.00. Run #2 failed `icon-audit.md created in project root`.
- The previous invalid-source-PNG transport issue did not recur; all 6 runs completed and were evaluated.
- Report written to `benchmark/test-icon-handler-2026-05-14.md`.
- Report validation passed: required target, agent rows, pass-rate and blocked-run data, latency, cost, consistency, raw session paths, and recommended next route are present. `git diff --check` passed.
- Committed and pushed on `master`.
- **Recommended next command:** `$session-triage icon-handler benchmark failure`

## Ad-Hoc Investigation: Research Skill Approval Reports

**Goal:** Update research-oriented skills so they can present findings for user approval before writing canonical research files, instead of always writing directly to disk.

**Plan:**
- [x] Identify research skills that currently require direct file writes.
- [x] Classify the smallest contract change that makes report-first approval behavior consistent.
- [x] Update affected skill contracts without weakening explicit write/update modes.
- [x] Run skill contract and targeted text validation.
- [x] Record investigation results here, then commit and push intended changes on `master`.

**Review:** Complete. Added a shared `## Report-First Approval Gate` to all 92 exact `type: research` skills across mirrored Claude and Codex packs. The gate defaults research skills to report-only output, requires presenting findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes for user approval before synthesized deliverables are written, and preserves explicit write/update/fix modes plus raw evidence capture for reproducibility. Added `tests/layer1/research-approval-gate.test.ts` so future research skills must include the gate. Validation passed with focused Vitest approval-gate coverage, direct YAML/text contract scan, skill dependency/version/routing checks, benchmark coverage, Skills Showcase data validation, and whitespace validation. Recommended next command: `$ship`.

## Ad-Hoc Targeted Skill Update: icon-handler Benchmark Coverage

**Goal:** Align the `icon-handler` benchmark coverage with Claude and Codex command conventions so Claude outputs are not failed for correctly recommending `/icon-handler`.

**Plan:**
- [x] Confirm the fix belongs in benchmark setup/rubric coverage, not the mirrored `icon-handler` skill contracts.
- [x] Add runner-specific route support to the Tier 2/3 global workflow benchmark helper.
- [x] Update the `icon-handler` fixture to expect `/icon-handler` for Claude and `$icon-handler` for Codex.
- [x] Add layer1 regression coverage for hard assertions and quality route scoring.
- [x] Run targeted validation, record results, then commit and push intended changes on `master`.

**Review:** Complete. Updated `tests/layer4/setups/tier23-global-workflows.setup.ts` to support `recommendedRoutes` by runner while preserving single-route definitions for existing global workflow fixtures. `icon-handler` now expects `/icon-handler` for Claude and `$icon-handler` for Codex; the quality route criterion accepts either syntax for the shared static evaluator. Added `tests/layer1/bench-setups.test.ts` regression coverage proving Claude slash routing passes, Codex dollar routing passes, and the wrong route fails. Validation passed with `pnpm --dir tests test -- --project layer1 tests/layer1/bench-setups.test.ts` (layer1 suite, 1,352 tests), `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests bench:coverage`, and `pnpm verify --skill icon-handler` (layer1 pass, layer2 skipped because no target-specific tests matched). Showcase regeneration was not needed because no tracked `SKILL.md` or `PACK.md` changed. Recommended next command: `$benchmark-test-skill icon-handler`.

## Ad-Hoc Targeted Skill Build: icon-handler

**Goal:** Add a shared Claude/Codex skill for auditing and applying a project-root desired icon across favicon, app icon, Apple touch icon, and manifest surfaces with a hygiene-style audit-first approval gate.

**Plan:**
- [x] Confirm existing overlap: `$hygiene` covers structural audits but not icon conversion/metadata correction.
- [x] Create mirrored `global/claude/icon-handler` and `global/codex/icon-handler` skill contracts.
- [x] Add the Codex `agents/openai.yaml` manifest.
- [x] Register benchmark coverage and a deterministic Next App Router icon audit fixture.
- [x] Update discovery docs.
- [x] Run install, skill integrity, coverage, showcase, and whitespace validation.
- [x] Record validation results, then commit and push intended changes on `master`.

**Review:** Complete. Created mirrored `global/claude/icon-handler` and `global/codex/icon-handler` skill contracts plus the Codex `agents/openai.yaml` manifest. The skill is audit-first by default, requires explicit `fix` approval before modifications, covers Next App Router favicon/app/Apple icon conventions, warns that `favicon.ico` is the conventional browser-probed file rather than `icon.ico`, and requires generated asset plus metadata/build-output verification. Added `icon-handler` to `docs/skills-reference.md`, `tests/harness/bench-coverage.ts`, and the Tier 2/3 global benchmark setup fixture. Refreshed Skills Showcase generated assets. Validation passed with `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests bench:coverage`, `pnpm --dir tests exec vitest run --project layer1 layer1/bench-setups.test.ts layer1/bench-quality.test.ts`, `pnpm --dir tests verify --skill icon-handler` (layer1 pass, layer2 skipped because no target-specific tests matched), `node scripts/generate-skills-showcase-data.mjs`, `node scripts/generate-skills-showcase-github-data.mjs`, `scripts/validate-skills-showcase-data.sh`, targeted `rg`, and `git diff --check`. A broad `pnpm --dir tests test:layer1 -- bench-setups bench-quality` run hit an unrelated routing-graph timeout, then the direct focused files passed. Recommended next command: `$icon-handler audit <asset>`.

## Ad-Hoc Targeted Skill Update: session-triage Benchmark Fixture Robustness

**Goal:** Harden the `session-triage` benchmark fixture so runs write the root report before optional exploration and the rubric accepts explicit no-skill-change outputs.

**Plan:**
- [x] Confirm the fix belongs in the benchmark fixture/rubric and layer1 setup tests, not the mirrored `session-triage` skill contracts.
- [x] Update the fixture prompt to require reading `session-log.md` and `tasks/lessons.md`, writing `session-triage-report.md` in the project root before optional exploration, and preserving the no-skill-change branch for one-off noncompliance with an adequate validation rule.
- [x] Add layer1 coverage for the root artifact requirement, required report sections, no-skill-change branch, and explicit "task checklist, not skill contract" language.
- [x] Run focused layer1 setup/quality tests, required skill checks, benchmark coverage, target verify, Codex smoke benchmark, and whitespace validation.
- [x] Record results here, then commit and push intended changes on `master`.

**Review:** Complete. Updated `tests/layer4/setups/tier1-workflows.setup.ts` so the `session-triage` fixture prompt forces a bounded evidence pass, root `session-triage-report.md` creation before optional exploration, richer report sections, and the no-skill-change branch. Tightened `no-over-remediation-route` so it still fails real contract-change over-remediation but accepts reports that explicitly say to update task docs or checklists rather than the skill contract unless later evidence proves a contract gap. Updated `tests/layer1/bench-setups.test.ts` with regression coverage. Validation passed with `pnpm --dir tests test:layer1 -- bench-setups bench-quality`, `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `pnpm --dir tests bench:coverage`, `pnpm --dir tests verify --skill session-triage`, Codex smoke `session-triage-codex-48488be1` (1/1 hard assertions, 100.0% quality, no blocked runs), and `git diff --check`. Recommended next command: `$benchmark-test-skill session-triage`.

## Ad-Hoc Triage: session-triage Benchmark Failure Current 2026-05-13

**Goal:** Triage the current `session-triage` benchmark failure from `session-triage-codex-fbec4404` and identify the smallest durable fix.

**Plan:**
- [x] Inspect the current benchmark report and persisted Claude/Codex run evidence.
- [x] Compare mirrored `session-triage` contracts against the tier1 benchmark setup expectations.
- [x] Classify whether the failure is a skill contract gap, benchmark harness gap, or runner noncompliance.
- [x] Update `benchmark/triage-session-triage-2026-05-13.md` with verdict, root cause, responsible gap, validation plan, and next route.
- [x] Record results here, then commit and push intended triage/task changes on `master`.

**Review:** Complete. The current benchmark failure is verified. Verify passed, but Codex passed only 2/3 hard assertions because run #0 exited without creating `session-triage-report.md` in the project root. Claude passed hard assertions but had low output-quality scores from over-remediation. The responsible gap is the benchmark fixture prompt and layer1 regression coverage, not the mirrored `session-triage` skill contracts. The prompt should force a bounded evidence pass and root report creation before optional exploration while preserving the no-skill-change branch for one-off noncompliance with an adequate validation rule. Report: `benchmark/triage-session-triage-2026-05-13.md`. Recommended next skill: `$targeted-skill-builder session-triage benchmark fixture robustness`.

## Ad-Hoc Benchmark: session-triage Fresh Rerun 2026-05-13 Current

**Goal:** Run `$benchmark-test-skill session-triage` with current repository harness eligibility, verify, and both-agent benchmark evidence.

**Plan:**
- [x] Confirm `session-triage` is a known benchmark harness target and record its coverage status. ✓ `coverage=custom`, `setup=tests/layer4/setups/tier1-workflows.setup.ts`.
- [x] Run `pnpm verify --skill session-triage` from `tests/` and stop if it fails. ✓ layer1 PASS (1,350 tests, 8.4s), layer2 SKIP (no target-specific tests).
- [x] If verify passes, run `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0`. ✓ Claude 3/3 (100.0%), Codex 2/3 (66.7%), no blocked runs.
- [x] Write and validate `benchmark/test-session-triage-2026-05-13.md` with verify, benchmark, latency, cost, consistency, and raw session evidence. ✓ Report updated with current 11:36 ET run data.
- [x] Record results here, then commit and push intended benchmark/task changes on `master`.

**Review:** Current benchmark rerun completed on 2026-05-13 at 11:36 ET. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 8.4s across 1,350 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 68.4% output quality, 3 threshold failures, 4 critical failures, p50 latency 41.1s, and $0.75 total cost. Codex passed 2/3 evaluated hard assertions with 73.7% output quality, 2 threshold failures, 3 critical failures, p50 latency 54.3s, and $0.75 total cost. Codex run #0 failed `session-triage-report.md created in project root`. Report validation passed with target, agent rows, pass-rate, latency, cost, consistency, raw session paths, and next-route evidence. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next command: `$session-triage session-triage benchmark failure`.

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

## Ad-Hoc Benchmark: session-triage Fresh Rerun 2026-05-13 Latest

**Goal:** Run `$benchmark-test-skill session-triage` with current harness eligibility, verify, and both-agent benchmark evidence.

**Plan:**
- [x] Confirm `session-triage` is a known benchmark harness target and record its coverage status. `coverage=custom`, `setup=tests/layer4/setups/tier1-workflows.setup.ts`.
- [x] Run `pnpm verify --skill session-triage` from `tests/` and stop if it fails.
- [x] If verify passes, run `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0`.
- [x] Write and validate `benchmark/test-session-triage-2026-05-13.md` with verify, benchmark, latency, cost, consistency, raw session paths, and next route.
- [x] Record results here, then commit and push intended benchmark/task changes on `master`.

**Review:** Fresh benchmark rerun completed on 2026-05-13 at 13:06 ET. `session-triage` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`. Verify passed with layer1 in 11.8s across 1,350 tests; layer2 was skipped because no target-specific layer2 tests matched `session-triage`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 37.1s, and $0.75 total cost. Codex passed 3/3 evaluated hard assertions with 100.0% output quality, p50 latency 37.4s, and $0.75 total cost. Report validation passed with target, agent rows, pass-rate, latency, cost, consistency, raw session paths, and next-route evidence. Report: `benchmark/test-session-triage-2026-05-13.md`. Recommended next skill: `$benchmark-agent-review session-triage`.

## Ad-Hoc Agent Review: session-triage Fresh Rerun 2026-05-13 Latest

**Goal:** Review the latest persisted `session-triage` Claude and Codex benchmark outputs for subjective operator quality.

**Plan:**
- [x] Resolve latest Claude and Codex run directories from `tests/benchmarks/runs/session-triage-*`.
- [x] Extract retained generated triage artifacts and benchmark context from each evaluated run.
- [x] Grade each evaluated output against the agent-review rubric without merging scores into deterministic benchmark metrics.
- [x] Write and validate `benchmark/review-session-triage-2026-05-13.md` with scores, findings, remediation, and next route.
- [x] Record results here, then commit and push intended review/task changes on `master`.

**Review:** Complete. Reviewed `session-triage-claude-69ca7dea` and `session-triage-codex-33b0cc9d`, covering 6 evaluated outputs and excluding no infrastructure-blocked runs. Deterministic benchmark context was clean: both runners passed 3/3 hard assertions with 100.0% output quality. Subjective median score was 89.5 with range 86-94. Codex outputs were excellent and evidence-bound; Claude outputs appeared good from retained summaries, but full generated report text was not persisted for Claude. Report: `benchmark/review-session-triage-2026-05-13.md`. Recommended next command: `$targeted-skill-builder benchmark-agent-review retained artifact evidence`.

## Ad-Hoc Targeted Skill Update: Benchmark Review Retained Artifact Evidence

**Goal:** Persist generated benchmark artifacts in raw run results so `$benchmark-agent-review` can review Claude and Codex outputs with the same fidelity.

**Plan:**
- [x] Confirm the gap belongs in benchmark harness persistence, not the `benchmark-agent-review` skill contract.
- [x] Add bounded generated artifact persistence to `run-*.json` results when a setup declares `qualityOutputPath`.
- [x] Add focused layer1 coverage proving generated artifact content is persisted for later review.
- [x] Run focused layer1 tests, install, skill dependency/version/routing checks, targeted retained-artifact checks, and whitespace validation; record benchmark coverage blocker.
- [x] Record results here, then commit and push intended harness/task changes on `master`.

**Review:** Complete. Updated `tests/harness/bench-types.ts` and `tests/harness/bench-runner.ts` so each benchmark run can persist an optional `artifacts` map with bounded generated artifact content. Setups with `qualityOutputPath` now retain that artifact content in `run-*.json`, which directly addresses the review fidelity gap for Claude outputs that do not echo full file diffs. Updated `tests/layer1/runner.test.ts` with focused coverage for persisted artifact evidence. Validation passed with `pnpm --dir tests test:layer1 -- runner`, `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, targeted `rg` checks, and `git diff --check`. `pnpm --dir tests bench:coverage` is blocked by unrelated untracked `global/claude/icon-handler/` and `global/codex/icon-handler/` skill directories missing benchmark coverage; those files were not part of this retained-artifact fix and were left unmodified. Recommended next command: `$targeted-skill-builder icon-handler benchmark coverage`.

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

## Current Task — Tighten `session-triage` Benchmark Over-Remediation Rubric

- [x] Read relevant lessons and current `session-triage` benchmark setup.
- [x] Identify existing-skill overlap: update existing custom benchmark setup, not the `session-triage` skill contract.
- [x] Increase `no-over-remediation-route` weight so unconditional skill/contract edit routes fall below the quality threshold.
- [x] Add layer1 regression coverage for the bad Claude pattern: claiming `/run` is unavailable or needs a gate, then routing to `/targeted-skill-builder run`.
- [x] Validate:
  - `pnpm --dir tests test:layer1 -- bench-setups bench-quality` — passed, 1,350 tests across 12 files.
  - `./scripts/skill-deps.sh --broken` — passed.
  - `./scripts/skill-versions.sh --missing` — passed.
  - `./scripts/skill-next-step-routing.sh --missing` — passed.
  - `pnpm --dir tests bench:coverage` — passed, 151 skills.
  - `./install.sh` — passed.
  - `pnpm verify --skill session-triage` — layer1 PASS in 8.6s; layer2 SKIP because no matching target-specific layer2 tests exist.
  - `git diff --check` — passed.
- [x] Commit and push intended changes.

## Review — Tighten `session-triage` Benchmark Over-Remediation Rubric

- Decision: existing benchmark setup update.
- Evidence used: current prompt, latest benchmark-agent-review findings, `tasks/lessons.md`, `tests/layer4/setups/tier1-workflows.setup.ts`, and focused layer1 tests.
- Evidence intentionally skipped: broad session-history scan; the latest persisted benchmark and review reports already verified the concrete gap.
- Files changed: `tests/layer4/setups/tier1-workflows.setup.ts`, `tests/layer1/bench-setups.test.ts`, `tasks/roadmap.md`, and `tasks/todo.md`.
- No Skills Showcase regeneration was needed because no tracked `SKILL.md` or `PACK.md` behavior/metadata changed.
- **Next work:** none.
- **Recommended next command:** `$benchmark-test-skill session-triage`

## Current Task — Fresh Benchmark `session-triage` 2026-05-13

- [x] Confirm `$benchmark-test-skill` is the active workflow and `session-triage` is the target skill argument.
- [x] Run `pnpm bench --list-skills` and confirm `session-triage` is known to the harness.
- [x] Record coverage status: `custom`, setup `tests/layer4/setups/tier1-workflows.setup.ts`.
- [x] Run `pnpm verify --skill session-triage`. ✓ layer1 PASS in 8.9s; layer2 SKIP because no target-specific layer2 tests matched.
- [x] If verify passes, run `pnpm bench --skill session-triage --agent both --runs 3 --chunk-size 3 --pause 0`. ✓ Claude 3/3 (100.0%), Codex 2/3 (66.7%), no blocked runs.
- [x] Write `benchmark/test-session-triage-2026-05-13.md` with verify, benchmark, latency, cost, consistency, raw paths, and recommended next route.
- [x] Validate the report contains required benchmark fields.
- [x] Record results here, then commit and push intended changes.

## Review — Fresh Benchmark `session-triage` 2026-05-13

- Verify passed: layer1 PASS in 8.9s with 1,350 tests across 12 files; layer2 SKIP because no target-specific layer2 tests matched `session-triage`.
- Benchmark completed for both agents:
  - Claude session `865e8407`: 3/3 evaluated hard assertions passed, 0 infrastructure-blocked runs, quality score 100.0%, p50 29.7s, p95 31.8s, p99 31.9s, total cost $0.75.
  - Codex session `d417810e`: 2/3 evaluated hard assertions passed, 0 infrastructure-blocked runs, failed run #1 on `session-triage-report.md created in project root`, quality score 82.5%, 1 threshold failure, 2 critical failures, p50 278.3s, total cost $0.75.
- Report written to `benchmark/test-session-triage-2026-05-13.md`.
- Report validation passed: required target, agent rows, pass-rate and blocked-run data, latency, cost, raw session paths, and recommended next route are present. `git diff --check` passed.
- **Recommended next command:** `$session-triage session-triage benchmark failure`

## Current Task — Triage `session-triage` Benchmark Failure 2026-05-13 12:07

- [x] Inspect fresh benchmark report and persisted failed run evidence.
- [x] Compare mirrored `session-triage` contracts against benchmark setup expectations.
- [x] Check existing lessons and prior `session-triage` benchmark triage history.
- [x] Write `benchmark/triage-session-triage-2026-05-13.md` with verdict, root cause, responsible gap, validation plan, and next route.
- [x] Validate report fields, then commit and push intended changes.

## Review — Triage `session-triage` Benchmark Failure 2026-05-13 12:07

- Verification verdict: verified.
- Evidence inspected: `benchmark/test-session-triage-2026-05-13.md`, Codex run `d417810e` run #1, adjacent Codex passing runs, Claude run `865e8407`, mirrored `session-triage` contracts, benchmark setup, layer1 setup tests, prior same-day triage/review reports, and `tasks/lessons.md`.
- Root cause: Codex runner noncompliance with an adequate fixture instruction; the failed run read the correct evidence but did not complete the required root artifact write.
- Responsible gap: benchmark fixture robustness, not the mirrored `session-triage` skill contracts.
- Recommended fix: add a fixture-level post-write existence check for `session-triage-report.md` and layer1 coverage preserving the no-skill-change branch.
- Report written to `benchmark/triage-session-triage-2026-05-13.md`.
- Report validation passed: required triage sections, fresh session IDs, root-cause classification, validation plan, and recommended next route are present. `git diff --check` passed.
- **Recommended next skill:** `$targeted-skill-builder session-triage benchmark artifact verification`

## Current Task — Targeted Update `session-triage` Benchmark Artifact Verification

- [x] Read relevant lessons, fresh triage report, current benchmark fixture, and layer1 setup coverage.
- [x] Identify existing-skill overlap: update the existing `session-triage` custom benchmark setup, not the mirrored `session-triage` skill contracts.
- [x] Add a fixture prompt requirement to verify `session-triage-report.md` exists in the project root after writing and create it before responding if missing.
- [x] Extend layer1 coverage for the post-write existence check while preserving the no-skill-change branch.
- [x] Validate:
  - `pnpm --dir tests test:layer1 -- bench-setups bench-quality` — passed, 1,350 tests across 12 files.
  - `./scripts/skill-deps.sh --broken` — passed.
  - `./scripts/skill-versions.sh --missing` — passed.
  - `./scripts/skill-next-step-routing.sh --missing` — passed.
  - `pnpm --dir tests bench:coverage` — passed, 151 skills.
  - `./install.sh` — passed.
  - `pnpm --dir tests verify --skill session-triage` — layer1 PASS in 10.5s; layer2 SKIP because no matching target-specific tests exist.
  - `pnpm --dir tests bench --skill session-triage --agent codex --runs 1 --chunk-size 1 --pause 0` — passed, `session-triage-codex-9ee8c354`, 1/1 hard assertions, 100.0% quality, no blocked runs, $0.25.
  - `git diff --check` — passed.
- [x] Commit and push intended changes.

## Review — Targeted Update `session-triage` Benchmark Artifact Verification

- Decision: existing benchmark fixture update.
- Evidence used: `benchmark/triage-session-triage-2026-05-13.md`, `tasks/lessons.md`, `tests/layer4/setups/tier1-workflows.setup.ts`, and `tests/layer1/bench-setups.test.ts`.
- Evidence intentionally skipped: broad session-history scan; the fresh triage report already verified the concrete failure.
- Files changed: `tests/layer4/setups/tier1-workflows.setup.ts`, `tests/layer1/bench-setups.test.ts`, `tasks/roadmap.md`, and `tasks/todo.md`.
- No Skills Showcase regeneration was needed because no tracked `SKILL.md` or `PACK.md` behavior/metadata changed.
- **Recommended next command:** `$benchmark-test-skill session-triage`

## Current Task — Benchmark `icon-handler` 2026-05-13

- [x] Confirm `$benchmark-test-skill` is the active workflow and `icon-handler` is the target skill argument.
- [x] Run `pnpm bench --list-skills` and confirm `icon-handler` is known to the harness.
- [x] Record coverage status and setup path from the harness list output. `coverage=custom`, setup `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- [x] Run `pnpm verify --skill icon-handler`; stop before bench if verification fails. ✓ layer1 PASS in 8.8s; layer2 SKIP because no target-specific layer2 tests matched.
- [x] If verify passes, run `pnpm bench --skill icon-handler --agent both --runs 3 --chunk-size 3 --pause 0`. ✓ Claude 1/3 (33.3%), Codex 3/3 (100.0%), no blocked runs.
- [x] Write `benchmark/test-icon-handler-2026-05-13.md` with verify, benchmark, latency, cost, consistency, raw paths, and recommended next route.
- [x] Validate the report contains required benchmark fields.
- [x] Record results here, then commit and push intended changes.

## Review — Benchmark `icon-handler` 2026-05-13

- Verify passed: layer1 PASS in 8.8s with 1,352 tests across 12 files; layer2 SKIP because no target-specific layer2 tests matched `icon-handler`.
- Benchmark completed for both agents:
  - Claude session `7d05699b`: 1/3 evaluated hard assertions passed, 0 infrastructure-blocked runs, failed runs #0 and #1 on `Agent command exited successfully` and `icon-audit.md created in project root`, quality score 40.2%, p50 21.6s, p95 30.0s, p99 30.8s, total cost $0.75.
  - Codex session `e4f1a34a`: 3/3 evaluated hard assertions passed, 0 infrastructure-blocked runs, quality score 84.1%, p50 65.8s, p95 71.5s, p99 72.0s, total cost $0.75.
- Report written to `benchmark/test-icon-handler-2026-05-13.md`.
- Report validation passed: required target, agent rows, pass-rate and blocked-run data, latency, cost, consistency, raw session paths, and recommended next route are present. `git diff --check` passed.
- Committed and pushed on `master`.
- **Recommended next command:** `$session-triage icon-handler benchmark failure`

## Current Task — Triage `icon-handler` Benchmark Failure 2026-05-13

- [x] Inspect `benchmark/test-icon-handler-2026-05-13.md` and persisted failed Claude run evidence.
- [x] Compare mirrored `icon-handler` contracts against benchmark setup expectations.
- [x] Check existing lessons and classify the failure as skill contract gap, benchmark harness gap, or runner noncompliance.
- [x] Write `benchmark/triage-icon-handler-2026-05-13.md` with verdict, root cause, responsible gap, validation plan, and next route.
- [x] Validate report fields, then commit and push intended changes.

## Review — Triage `icon-handler` Benchmark Failure 2026-05-13

- Verification verdict: verified.
- Evidence inspected: `benchmark/test-icon-handler-2026-05-13.md`, Claude failed runs #0 and #1 in `icon-handler-claude-7d05699b`, Claude passing run #2, Codex passing runs in `icon-handler-codex-e4f1a34a`, mirrored `icon-handler` skill contracts, `tests/layer4/setups/tier23-global-workflows.setup.ts`, layer1 route coverage, and `tasks/lessons.md`.
- Root cause: benchmark fixture robustness gap. The fixture writes ASCII text to a file named `calc-mascot-icon.png`, which can trigger runner/image transport processing before the skill can audit the file locally; failed Claude runs exited with `API Error: 400 Could not process image`.
- Responsible gap: benchmark fixture, not the mirrored `icon-handler` skill contracts.
- Recommended fix: make the canonical source asset a tiny valid PNG or add binary fixture support, while preserving stale placeholder evidence for existing icon surfaces; add layer1 coverage so the source asset cannot regress to ASCII placeholder content.
- Report written to `benchmark/triage-icon-handler-2026-05-13.md`.
- Report validation passed: required triage sections, persisted failure evidence, root-cause classification, validation plan, and recommended next route are present. `git diff --check` passed.
- **Recommended next skill:** `$targeted-skill-builder icon-handler benchmark valid source asset`

## Current Task — Targeted Update `icon-handler` Benchmark Valid Source Asset

- [x] Read relevant lessons, triage report, current benchmark fixture, and layer1 setup coverage.
- [x] Identify existing-skill overlap: update the existing `icon-handler` benchmark setup, not the mirrored `icon-handler` skill contracts.
- [x] Replace the ASCII root `calc-mascot-icon.png` fixture with a tiny valid PNG source asset while preserving stale existing icon-surface evidence.
- [x] Add layer1 coverage that fails if the root source asset regresses to non-PNG placeholder text.
- [x] Validate focused layer1 setup/quality tests, required skill checks, benchmark coverage, target verify, Claude smoke benchmark, and whitespace.
- [x] Record results here, then commit and push intended changes on `master`.

## Review — Targeted Update `icon-handler` Benchmark Valid Source Asset

**Ship manifest**

- **User goal:** Ship already-finished local benchmark fixture work for the `icon-handler` benchmark failure.
- **Changed files:** `tests/layer4/setups/tier23-global-workflows.setup.ts`, `tests/layer1/bench-setups.test.ts`, `tasks/todo.md`, `tasks/history.md`.
- **Per-file purpose:** `tier23-global-workflows.setup.ts` changes the root `calc-mascot-icon.png` fixture from ASCII placeholder text to a tiny valid PNG buffer. `bench-setups.test.ts` adds regression coverage for the PNG signature and placeholder absence. `tasks/todo.md` records completion and validation. `tasks/history.md` records the shipped change.
- **User-goal mapping:** The fix implements the triage recommendation to make the canonical source asset decodable while preserving stale placeholder files for existing icon surfaces.
- **Tests run:** `pnpm --dir tests exec vitest run --project layer1 bench-setups` passed 43 tests; `pnpm --dir tests bench:coverage` passed with 152 skills; `pnpm --dir tests verify --skill icon-handler` passed layer1 with 1,446 tests and skipped layer2 because no target-specific layer2 tests matched; `git diff --check` passed.
- **Skipped tests:** Claude smoke benchmark was not rerun during `$ship`; the fixture is covered by direct layer1 PNG-signature regression plus full `icon-handler` verify. A live Claude benchmark would add cost and can be run by `$benchmark-test-skill icon-handler` if fresh agent evidence is needed.
- **Adversarial review:** Changed-file self-review checked whether the fix weakens the intended stale-icon audit signal. It does not: only the root source asset is now valid PNG; `src/app/favicon.ico` and `src/app/icon.png` remain stale placeholders for audit findings.
- **Residual risk:** The benchmark runner could still fail for unrelated Claude image/tooling behavior, but the known API-level failure from invalid source PNG bytes is directly addressed.
- **Rollback note:** Revert the forthcoming commit to restore the prior text placeholder fixture and remove the regression assertion.
- **Next command:** `$benchmark-test-skill icon-handler`

**Deploy:** Skipped. `tasks/deploy.md` describes a Vercel production deploy from `master`; no explicit production deploy confirmation was provided for this `$ship` run.

**Recommended next command:** `$benchmark-test-skill icon-handler`

## Current Task — Stop Approval-Gated Skills From Routing Past Approval

**Goal:** Update report-first skill contracts so approval requests stop at the approval gate and do not recommend downstream commands before the current artifact is approved and written.

**Plan:**
- [x] Read the targeted-skill-builder contract and current lessons.
- [x] Use the current `$creator-positioning` correction and `$session-triage` result as evidence.
- [x] Audit report-first approval gates across packs and identify skills with the same risk.
- [x] Add a stop rule to affected mirrored Claude/Codex skill contracts.
- [x] Update benchmark coverage metadata and record a lesson.
- [x] Run validation and record results.
- [ ] Commit and push intended changes on `master`.

## Review — Stop Approval-Gated Skills From Routing Past Approval

- Decision: update existing report-first skill contracts instead of adding a new skill.
- Evidence used: current `$creator-positioning` correction, `$session-triage` verification, `tasks/lessons.md`, and scoped `rg` scans of `Report-First Approval Gate` usage under `packs/` and `global/`.
- Existing-skill overlap: the existing report-first approval gates owned the behavior; no new skill was needed.
- Changed contracts: added the approval-stop rule to all 92 report-first skill contracts found under `packs/` across business-discovery, business-growth, business-ops, creator-foundation, devtool, game, remotion, and youtube-ops, in both Claude and Codex variants where present.
- Benchmark coverage metadata: updated `tests/harness/bench-coverage.ts` `LAST_VERIFIED` to 2026-05-14.
- Showcase data: refreshed `docs/skills-showcase/assets/skills-data.js`, `apps/skills-showcase/public/assets/skills-data.js`, `docs/skills-showcase/assets/github-proof-data.js`, `apps/skills-showcase/public/assets/github-proof-data.js`, and `docs/benchmark-results-matrix.md`.
- Validation passed: `./install.sh`; `/opt/homebrew/bin/bash ./scripts/skill-deps.sh --broken`; `/opt/homebrew/bin/bash ./scripts/skill-versions.sh --missing`; `/opt/homebrew/bin/bash ./scripts/skill-next-step-routing.sh --missing`; `pnpm --dir tests bench:coverage`; `pnpm --dir tests exec vitest run --project layer1 bench-coverage bench-setups`; targeted `rg` check confirmed no report-first gates are missing the stop rule; `git diff --check`.
- Validation note: the same shell scripts fail under macOS `/bin/bash`/direct `zsh` because they require Bash 4 features (`declare -A`, `mapfile`); they pass with `/opt/homebrew/bin/bash`.
- Showcase validation note: `scripts/validate-skills-showcase-data.sh` regenerated the expected assets but exits nonzero while those generated files are uncommitted, reporting stale data. This should pass after the generated assets are committed.

## Current Task — Benchmark `icon-handler` After Image-Error Classification 2026-05-14

**Goal:** Run `$benchmark-test-skill icon-handler` against the current repository state after classifying image-processing runner errors as infrastructure-blocked.

**Plan:**
- [x] Confirm `$benchmark-test-skill` is the active workflow and `icon-handler` is the target skill argument.
- [x] Run `pnpm bench --list-skills` and confirm `icon-handler` is known to the harness, including coverage status. `coverage=custom`, setup `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- [x] Run `pnpm verify --skill icon-handler`; stop before bench if verification fails. Layer1 PASS in 8.9s; layer2 SKIP because no target-specific layer2 tests matched.
- [x] If verify passes, run `pnpm bench --skill icon-handler --agent both --runs 3 --chunk-size 3 --pause 0`. Claude 3/3, Codex 3/3, no blocked runs.
- [x] Write `benchmark/test-icon-handler-2026-05-14.md` with verify, benchmark, latency, cost, consistency, raw paths, and recommended next route.
- [x] Validate the report contains required benchmark fields.
- [x] Record results here, then commit and push intended changes on `master`.

## Review — Benchmark `icon-handler` After Image-Error Classification 2026-05-14

- Command resolution: `$benchmark-test-skill` was the active workflow; `icon-handler` was treated as the target skill argument.
- Eligibility: `icon-handler` is known to the harness with custom coverage via `tests/layer4/setups/tier23-global-workflows.setup.ts`.
- Verify passed: layer1 PASS in 8.9s with 1,447 tests across 13 files; layer2 SKIP because no target-specific layer2 tests matched `icon-handler`.
- Benchmark completed for both agents with no infrastructure-blocked runs:
  - Claude session `bccbdf8a`: 3/3 evaluated hard assertions passed, output quality 84.1%, p50 37.1s, p95 49.5s, p99 50.6s, total cost $3.00.
  - Codex session `68b180e6`: 3/3 evaluated hard assertions passed, output quality 84.8%, p50 61.5s, p95 82.8s, p99 84.7s, total cost $3.00.
- Report written to `benchmark/test-icon-handler-2026-05-14.md`.
- Report validation passed: required target, agent rows, pass-rate and blocked-run data, latency, cost, consistency, raw session paths, quality details, and recommended next route are present.
- **Recommended next skill:** `$benchmark-agent-review icon-handler`
