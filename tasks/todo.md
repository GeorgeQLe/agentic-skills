# Active Phase: Benchmark Custom Coverage Planning

**Project:** Claude Skills / agentic-skills
**Status:** Feature planning in progress on 2026-05-11.

## Priority Task Queue

- [x] `$feature-interview benchmark custom coverage` - turn the broad benchmark coverage follow-up into a scoped spec/roadmap extension because `tasks/roadmap.md` had `## Planned Benchmark Work: Codex Custom Coverage` with unchecked acceptance criteria but no numbered `## Phase N:` entry, no pack/skill coverage matrix, and no implementation steps.

## Current Planning: benchmark custom coverage

- [x] Gather evidence from roadmap, todo, benchmark harness, bench pack contract, and recent git history.
- [x] Confirm the end state: every current skill should eventually have a custom benchmark test setup.
- [x] Confirm priority: start with highest-use skills, but do not limit the end state to high-use skills.
- [x] Confirm future contract: every future skill creation should include a benchmark test setup or an explicit blocked status.
- [x] Confirm constraint: no GitHub Actions.
- [x] Write `specs/benchmark-custom-coverage-feature-interview.md`.
- [x] Write `specs/benchmark-custom-coverage.md`.
- [x] Update `tasks/roadmap.md` with Phase 35 and benchmark coverage acceptance criteria.
- [x] Validate docs and record review results.

## Review: benchmark custom coverage planning

**Decision:** Create a durable custom coverage spec and roadmap phase. The user's desired end state is not a representative benchmark sample; it is custom benchmark setup coverage for every current and future skill.

**Evidence Used:** `tasks/roadmap.md`, `tasks/todo.md`, `tests/harness/bench-setups.ts`, `tests/harness/bench-types.ts`, `tests/harness/bench-runner.ts`, `tests/bench.ts`, existing `tests/layer4/setups/design-system*.setup.ts`, `tests/layer1/bench-setups.test.ts`, `packs/agentic-skills-bench/PACK.md`, `packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md`, and recent benchmark commits.

**Changes:** Added `specs/benchmark-custom-coverage-feature-interview.md` with the evidence brief, assumptions, claim validation, user answers, and destination checkpoint. Added `specs/benchmark-custom-coverage.md` with the repository-wide custom coverage plan, coverage matrix model, setup conventions, priority tiers, future skill creation contract, implementation phases, acceptance criteria, and validation commands. Updated `tasks/roadmap.md` to make custom benchmark coverage Phase 35 and explicitly require future skill coverage handling and no GitHub Actions.

**Validation:** `git diff --check` passed. Targeted `rg` checks confirmed Phase 35, future skill coverage handling, coverage matrix language, benchmark custom coverage spec links, and no-GitHub-Actions constraints appear in the new specs and task docs.

**Next Work:** Sequence Phase 35 into detailed implementation steps.

**Recommended next command:** `$roadmap`

## Current Benchmark Run: run Codex

- [x] Resolve the project-local `benchmark-test-skill` contract and confirm `run` is the skill under test.
- [x] Run `pnpm verify --skill run` from `tests/`.
- [x] Stop before benchmark because verify failed.
- [x] Record review results, then commit and push intended benchmark artifacts.

## Review: run Codex benchmark request

**Strategy Used:** Project-local `$benchmark-test-skill run --codex` from `packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md`. The `run` argument was treated as the skill under test, and `--codex` narrowed the benchmark runner to Codex.

**Verify:** `pnpm verify --skill run` failed from `tests/`. Layer1 passed in 7.1s with 1,188 tests. Layer2 failed in 286ms because Vitest found no layer2 test files matching the `run` filter.

**Benchmark:** Skipped. The benchmark-test-skill contract forbids running `pnpm bench` when verify fails.

**Report:** No `benchmark/test-run-2026-05-11.md` was written because no benchmark `report.json` exists for this failed verify-only run.

**Recommended next command:** `$session-triage run benchmark verify failure`

## Current Triage: run benchmark verify failure

- [x] Define scope from the failed `$benchmark-test-skill run --codex` verify gate.
- [x] Read the `benchmark-test-skill` and `run` skill contracts.
- [x] Inspect verify filtering, layer2 coverage, and layer4 benchmark setup support.
- [x] Diagnose whether this is a `run` skill failure, verifier behavior, or benchmark eligibility issue.
- [x] Record triage result and recommended fix.

## Review: run benchmark verify failure

**Target:** Failed `$benchmark-test-skill run --codex` request, scoped to the current conversation, `packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md`, `global/codex/run/SKILL.md`, `tests/verify.ts`, `tests/bench.ts`, `tests/layer4/bench.test.ts`, and current task docs.

**User-identified issue:** `$benchmark-test-skill run --codex` could not proceed because `pnpm verify --skill run` failed before the Codex benchmark step.

**Verification Verdict:** Verified. `pnpm verify --skill run` passed layer1 with 1,188 tests, then failed layer2 because Vitest found no layer2 test files matching the `run` filter. A diagnostic preflight of `pnpm bench --skill run --agent codex --runs 1 --chunk-size 1 --pause 0` failed before any agent run with `Unknown skill: run. Available: design-system, design-system-draftstonk`.

**Timeline:** The user invoked `$benchmark-test-skill run --codex`. The project-local benchmark skill correctly resolved `run` as the skill under test and `--codex` as the runner selector. The verify gate ran `pnpm verify --skill run`. `tests/verify.ts` applies the skill argument as a Vitest filter for layer2, and no layer2 `run` behavior test exists. The benchmark step was skipped per contract. Further inspection showed the benchmark runner only has setups for `design-system` and `design-system-draftstonk`.

**Root Cause:** Benchmark eligibility gap. The `benchmark-test-skill` contract says it benchmark-tests one skill defined in the repository, but the current harness only supports skills with both matching layer2 behavior coverage and a layer4 setup registered in `tests/bench.ts`. `run` is a repository skill but not a registered benchmark target, so the failure is not evidence that the `run` skill behavior is broken.

**Responsible Contract Gap:** `packs/agentic-skills-bench/{claude,codex}/benchmark-test-skill/SKILL.md` should preflight supported benchmark targets before running verify, or route unsupported skills to a setup-building workflow. The harness may also need an explicit supported-target listing to avoid relying on Vitest's "No test files found" as the first signal.

**Recommended Fix:** Route to `$targeted-skill-builder benchmark target eligibility preflight`. Update both mirrored benchmark-test-skill contracts to:
1. Check that the requested skill has a registered layer4 benchmark setup before running verify.
2. If unsupported, stop with `unsupported benchmark target`, list currently supported targets, and recommend creating layer2/layer4 benchmark coverage for the target skill.
3. Keep the existing rule that verify failure stops benchmark execution.

Optionally add a small harness helper or CLI option so `tests/bench.ts` can list supported benchmark targets from the shared setup registry.

**Validation Plan:** Run a supported target path (`pnpm verify --skill design-system`) to confirm unchanged behavior, run the unsupported target preflight for `run` to confirm it stops before verify with a clear message, run `pnpm --dir tests test:layer1 -- bench-report.test.ts runner.test.ts` if harness code changes, run `diff -u packs/agentic-skills-bench/claude/benchmark-test-skill/SKILL.md packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md` allowing only slash/dollar syntax differences, then run `git diff --check`.

**Confidence:** High. No broad `$analyze-sessions` recurrence analysis is needed; the issue is fully explained by current harness target support.

**Recommended next command:** `$targeted-skill-builder benchmark target eligibility preflight`

## Current Fix: benchmark target eligibility preflight

- [x] Read relevant lessons, triage notes, and mirrored benchmark-test-skill contracts.
- [x] Confirm the smallest durable fix is an existing-skill update plus small harness target-list support.
- [x] Add an explicit benchmark setup registry and `pnpm bench --list-skills`.
- [x] Update mirrored benchmark-test-skill contracts to preflight unsupported targets before verify.
- [x] Run targeted validation and refresh Skills Showcase generated data.
- [x] Record review results, commit, and push.

## Review: benchmark target eligibility preflight

**Decision:** Existing-skill update. `benchmark-test-skill` already owns verify -> bench -> report, so the fix belongs in that skill contract, with a small harness affordance to make supported targets discoverable.

**Evidence Used:** `tasks/lessons.md`, the run benchmark verify triage above, `packs/agentic-skills-bench/{claude,codex}/benchmark-test-skill/SKILL.md`, `tests/bench.ts`, `tests/layer4/bench.test.ts`, and the prior failed `run` verify/bench preflight output.

**Evidence Skipped:** Broad session-history analysis. The issue was already verified from the immediate failing command and current harness code.

**Existing-Skill Overlap:** `benchmark-test-skill` substantially covers the workflow. No new skill was needed.

**Changes:** Added `tests/harness/bench-setups.ts` as the explicit benchmark setup registry, added `tests/layer1/bench-setups.test.ts`, wired `tests/bench.ts` and `tests/layer4/bench.test.ts` through the registry, and added `pnpm bench --list-skills`. Updated both mirrored benchmark-test-skill contracts to run the eligibility preflight before verify, stop unsupported targets with `unsupported benchmark target`, list supported targets, and route to benchmark coverage creation instead of treating unsupported targets as skill behavior failures. Refreshed generated Skills Showcase assets for the tracked skill behavior change.

**Validation:** `pnpm bench --list-skills` prints `design-system` and `design-system-draftstonk`. `pnpm bench --skill run --agent codex --runs 1 --chunk-size 1 --pause 0` now fails before any agent work with `Unknown benchmark target: run. Supported: design-system, design-system-draftstonk`. `pnpm --dir tests test:layer1 -- bench-setups.test.ts bench-report.test.ts runner.test.ts` passed with 1,190 layer1 tests. `pnpm verify --skill design-system` passed layer1 in 7.2s and layer2 in 206.7s. `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, targeted `rg` checks, mirrored benchmark skill diff with only slash-vs-dollar differences, and `git diff --check` passed. `scripts/validate-skills-showcase-data.sh` required a generated proof refresh after the final task-doc review update; the refreshed generated assets are included in the shipping boundary.

**Next Work:** Re-run `$benchmark-test-skill run --codex` after this commit to confirm the user-facing workflow stops at the new eligibility preflight instead of the verify gate.

**Recommended next command:** `$benchmark-test-skill run --codex`

## Current Fix: generic benchmarks for all repository skills

- [x] Re-evaluate the selective layer4 design after user feedback.
- [x] Add generic smoke benchmark fallback for repository skills without custom setups.
- [x] Keep custom layer4 setups for domain-specific assertions.
- [x] Change verify behavior so missing target-specific layer2 tests are recorded as `SKIP`, not fatal.
- [x] Validate the generic path with `run`.
- [x] Record review results, commit, and push.

## Review: generic benchmarks for all repository skills

**Decision:** Extend the existing benchmark harness, not create a new skill. Layer4 was selective because domain-quality benchmarks require a per-skill oracle. The durable fix is a two-tier benchmark model: custom setup when available, generic smoke setup for every other repository skill.

**Evidence Used:** Current user feedback, `tests/harness/bench-types.ts`, `tests/harness/bench-runner.ts`, `tests/harness/bench-setups.ts`, `tests/verify.ts`, existing `design-system` layer4 setup, and mirrored `benchmark-test-skill` contracts.

**Evidence Skipped:** Broad session-history analysis. The design issue was local to the benchmark harness and already verified.

**Existing-Skill Overlap:** `benchmark-test-skill` owns this workflow. No new skill was needed.

**Changes:** `tests/harness/bench-setups.ts` now lists all repository skill names from `global/` and `packs/`, resolves custom setups for registered skills, and creates a generic smoke setup for other known skills. The generic setup asks the agent to create `benchmark-output.md` with the skill name and next-command handoff, then asserts command success, file creation, skill naming, and handoff presence. `tests/verify.ts` now treats "no layer2 tests matched this skill" as a target-specific layer2 `SKIP` instead of a verify failure. `pnpm bench --list-skills` now lists all repository skills. Mirrored benchmark-test-skill contracts explain generic smoke coverage versus deeper custom coverage.

**Validation:** `pnpm bench --list-skills` lists repository skills including `design-system` and `run`. `pnpm --dir tests test:layer1 -- bench-setups.test.ts bench-report.test.ts runner.test.ts` passed with 1,192 layer1 tests. `pnpm verify --skill run` passed with layer1 PASS and layer2 SKIP because no target-specific layer2 tests matched `run`. `pnpm bench --skill run --agent codex --runs 1 --chunk-size 1 --pause 0` completed session `run-codex-925f015a` with 100.0% pass rate, p50 latency 19.9s, and $0.25 estimated cost. `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, targeted `rg` checks, and Skills Showcase regeneration ran.

**Residual Risk:** Generic benchmark results prove invocation/compliance only. Skills that need output-specific quality measurement still need a custom layer4 setup.

**Next Work:** Add custom benchmark coverage for high-value skills where generic smoke evidence is too weak.

**Recommended next command:** `$targeted-skill-builder <skill> benchmark coverage`

## Planned Follow-up: Codex custom benchmark coverage

- [ ] Build the reusable custom benchmark setup pattern for Codex-first coverage.
- [ ] Apply that custom setup pattern across Codex skills, starting with high-use global skills and benchmark-test-related workflows.

**Reason:** Codex currently has more spare token capacity, so custom benchmark buildout should prioritize Codex runs before mirrored Claude benchmark coverage. Keep the generic fallback active while custom coverage is added incrementally.

## Current Update: design-system prose headings

- [x] Read relevant lessons and the mirrored `design-system` skill contracts.
- [x] Confirm the smallest durable fix is an existing-skill update, not a new skill.
- [x] Patch both mirrored skills to require Markdown headings for `DESIGN.md` prose sections.
- [x] Refresh generated Skills Showcase data for the skill behavior change.
- [x] Run standard skill validation, targeted heading checks, and diff checks.
- [x] Record review results, commit, and push intended changes.

## Review: design-system prose heading contract

**Decision:** Existing-skill update. The verified gap was ambiguity inside the mirrored `design-system` contract, not a missing workflow.

**Evidence Used:** `tasks/lessons.md`, the recent `design-system prose heading assertion` triage in `tasks/todo.md`, mirrored `global/{claude,codex}/design-system/SKILL.md`, benchmark/layer2 heading expectations recorded in the triage notes, and targeted overlap search for related heading/DESIGN.md contracts.

**Evidence Skipped:** Broad session-history analysis. The issue was already verified by focused triage and did not need recurrence mining.

**Existing-Skill Overlap:** `design-system` already owns the `DESIGN.md` output contract. No separate skill covers this narrower prose-heading rule, so updating the existing skill avoids a duplicate command.

**Changes:** Updated both mirrored `design-system` skills to require Part 2 prose sections as Markdown headings such as `## Colors` and `## Typography`, explicitly disallowing bold paragraph labels. Refreshed generated Skills Showcase assets for the tracked skill behavior change.

**Validation:** `diff -u global/claude/design-system/SKILL.md global/codex/design-system/SKILL.md` passed with no differences. `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir tests test:layer1 -- runner.test.ts bench-report.test.ts`, targeted `rg` checks, and `git diff --check` passed.

**Next Work:** Re-run a one-run Codex smoke for `design-system` when benchmark budget permits, to verify the tightened contract resolves the prose-section assertion end to end.

**Recommended next command:** `$benchmark-test-skill design-system`

# Prior Active Phase: Benchmark Test Skill Rename

**Project:** Claude Skills / agentic-skills
**Status:** Targeted skill update in progress on 2026-05-10.

## Current Benchmark Run: design-system

- [x] Confirm the project-local `benchmark-test-skill` contract and `design-system` target.
- [x] Run `pnpm verify --skill design-system` from `tests/`.
- [x] If verify passes, run `pnpm bench --skill design-system --agent both --runs 3 --chunk-size 3 --pause 0`.
- [x] Write `benchmark/test-design-system-2026-05-10.md` from the latest `report.json`.
- [x] Record review results, then commit and push intended benchmark artifacts.

## Review: Current design-system benchmark run

**Strategy Used:** Project-local `$benchmark-test-skill design-system` from `packs/agentic-skills-bench/codex/benchmark-test-skill/SKILL.md`.

**Verify:** `pnpm verify --skill design-system` passed from `tests/`: layer1 PASS in 7.9s with 1,186 tests, and layer2 PASS in 185.7s with both `design-system` behavior tests passing.

**Benchmark:** `pnpm bench --skill design-system --agent both --runs 3 --chunk-size 3 --pause 0` completed both agent sessions. Claude session `design-system-claude-d263df0d` passed 3/3 evaluated runs with p50 latency 154.9s, p95 319.0s, p99 333.6s, mean pairwise similarity 0.822, no outliers, and $3.00 total estimated cost. Codex session `design-system-codex-1a9bc956` completed 3/3 evaluated runs but passed 0/3 because every run failed `DESIGN.md created in project root`; p50 latency was 429.8s, p95 1014.6s, p99 1066.6s, mean pairwise similarity 1.000, no outliers, and $3.00 total estimated cost.

**Infrastructure Blocks:** None reported.

**Report:** Updated `benchmark/test-design-system-2026-05-10.md` with both-agent metrics and failed assertions.

## Current Triage: design-system benchmark failure

- [x] Define scope from the current benchmark report and `design-system` skill.
- [x] Inspect failed Codex run artifacts and benchmark evaluator expectations.
- [x] Compare Claude and Codex skill contracts for mirrored drift.
- [x] Diagnose whether the failure is skill contract, harness, or agent-runner behavior.
- [x] Record triage result and recommended fix.

## Review: design-system benchmark failure triage

**Target:** Current benchmark failure for `design-system`, scoped to `benchmark/test-design-system-2026-05-10.md`, `tests/benchmarks/runs/design-system-codex-1a9bc956/`, `tests/layer4/setups/design-system.setup.ts`, `tests/harness/runner.ts`, and mirrored `global/{claude,codex}/design-system/SKILL.md`.

**User-identified issue:** `$session-triage design-system benchmark failure` asked for focused diagnosis of the benchmark failure reported after `$benchmark-test-skill design-system`.

**Verification Verdict:** Verified, but the verified issue is a benchmark harness Codex-runner failure, not a `design-system` skill contract failure. The Codex benchmark completed three evaluated runs with exit code 0, empty stdout, only `Reading additional input from stdin...` on stderr, and no generated files beyond the input spec. A narrow local reproduction using Node `execFile("codex", ["exec", ..., "Say done only."])` produced the same empty stdout plus stdin message with exit code 0.

**Timeline:** The benchmark report showed Claude passing 3/3 runs and Codex failing 3/3 on `DESIGN.md created in project root`. The failed Codex run JSONs show the model did not produce output or files; the only stderr was Codex reading stdin. `design-system` layer2 verification still passed, and the Claude/Codex skill contracts are identical, so the target skill text is not the differentiator. `tests/harness/runner.ts` invokes Codex through promisified `execFile`, while `codex exec --help` says stdin is appended when piped.

**Root Cause:** Codex benchmark invocation uses Node `execFile` in a way that leaves stdin looking piped to `codex exec`; the Codex CLI reads/appends stdin and exits without executing the benchmark prompt in this environment. The benchmark harness then evaluates an empty temp project result as a skill failure. This is harness/runner contract drift caused by CLI I/O behavior, not missing `DESIGN.md` instructions in the `design-system` skill.

**Responsible Contract Gap:** `tests/harness/runner.ts` Codex runner. The benchmark report is accurate about observed output, but its next-step routing should be treated as harness triage before skill remediation.

**Recommended Fix:** Route to `$targeted-skill-builder benchmark Codex runner stdin handling` or implement a focused harness patch directly: replace the async `execFile` Codex invocation with a runner that explicitly closes/ignores stdin in a supported way, preferably `spawn` with `stdio: ["ignore", "pipe", "pipe"]` and collected stdout/stderr, or `execFileSync` with `stdio` if async execution is not needed. Add a regression test around Codex runner command construction or a mocked child-process helper so future runs cannot silently classify "empty stdout + Reading additional input from stdin" as a skill assertion failure.

**Validation Plan:** Run `pnpm --dir tests test:layer1 -- bench-report.test.ts` plus a targeted runner test for Codex stdin handling. Then run a single Codex benchmark smoke with `pnpm bench --skill design-system --agent codex --runs 1 --chunk-size 1 --pause 0` and verify stdout/files show real agent work before re-running the full both-agent benchmark. Finish with `git diff --check`.

**Confidence:** High for harness-level root cause. Evidence gaps: this triage did not patch and rerun the runner, so the exact implementation choice still needs validation. No `$analyze-sessions` recurrence analysis is needed.

**Recommended next skill:** `$targeted-skill-builder`

## Current Fix: benchmark Codex runner stdin handling

- [x] Decide the smallest durable fix from the verified triage.
- [x] Patch `tests/harness/runner.ts` so Codex bench runs close stdin explicitly.
- [x] Add regression coverage for the Codex child-process invocation.
- [x] Run targeted benchmark harness validation.
- [x] Record review results, commit, and push.

## Review: benchmark Codex runner stdin handling

**Decision:** Existing harness update, not a new skill. The verified gap was in `tests/harness/runner.ts`, so creating a new workflow skill would duplicate existing benchmark ownership.

**Evidence Used:** Current benchmark report, session-triage findings, `tests/benchmarks/runs/design-system-codex-1a9bc956/run-*.json`, `codex exec --help`, and a narrow reproduction of Node `execFile("codex", ["exec", ...])` returning empty stdout with `Reading additional input from stdin...`.

**Evidence Skipped:** Broad session-history analysis. The issue was already verified as one harness failure.

**Existing-Skill Overlap:** `benchmark-test-skill` owns running the benchmark, but the durable fix is harness code. No new skill or skill contract update was needed.

**Changes:** Replaced the Codex benchmark runner's promisified `execFile` path with a `spawn` path that explicitly uses `stdio: ["ignore", "pipe", "pipe"]`, added exported `codexExecArgs`, and added `tests/layer1/runner.test.ts` to lock the Codex command/stdin contract.

**Validation:** `pnpm --dir tests test:layer1 -- runner.test.ts bench-report.test.ts` passed with 1,188 layer1 tests. `pnpm bench --skill design-system --agent codex --runs 1 --chunk-size 1 --pause 0` no longer reproduced the empty-stdout/no-file stdin failure: Codex created `DESIGN.md` and `design-system-interview.md`. The smoke still failed evaluated assertions because the generated prose section labels were bold text rather than Markdown headings, which is a separate evaluator strictness issue. `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, and `git diff --check` passed. `pnpm --dir tests exec tsc --noEmit` remains blocked by pre-existing missing Node typings across the test package.

**Next Work:** Triage whether the `design-system` benchmark evaluator should accept bold prose section labels or the skill should require Markdown heading syntax for prose sections.

**Recommended next command:** `$session-triage design-system benchmark prose heading assertion`

## Current Triage: design-system prose heading assertion

- [x] Define scope from the one-run Codex smoke and `design-system` benchmark evaluator.
- [x] Inspect failed assertions and generated output shape.
- [x] Compare benchmark/layer2 expectations with the mirrored skill contract.
- [x] Diagnose whether this is evaluator strictness or skill contract ambiguity.
- [x] Record triage result and recommended fix.

## Review: design-system prose heading assertion

**Target:** The remaining `design-system` benchmark smoke failure after the Codex stdin fix, scoped to `tests/benchmarks/runs/design-system-codex-7fba9da2/report.json`, `tests/layer4/setups/design-system.setup.ts`, `tests/layer2/design-system*.test.ts`, and mirrored `global/{claude,codex}/design-system/SKILL.md`.

**User-identified issue:** `$session-triage design-system benchmark prose heading assertion` asked for focused diagnosis of why the Codex smoke still failed after it created the required files.

**Verification Verdict:** Verified. The Codex smoke generated both `DESIGN.md` and `design-system-interview.md`, and all frontmatter/token assertions passed. The only failed assertions were `Has Colors prose section` and `Has Typography prose section`. The generated document used bold labels like `**Colors**` and `**Typography**` for prose sections, while the benchmark and layer2 tests require Markdown heading syntax matching `/##?\s+Colors/i` and `/##?\s+Typography/i`.

**Timeline:** The earlier benchmark runner failure was fixed. A one-run Codex smoke then produced real artifacts. The evaluator read `DESIGN.md` and failed only the prose-section heading regex. The mirrored `design-system` skill says "Part 2 - Prose sections" and lists section names as bold text, not explicit Markdown headings, while tests encode headings as the accepted structure.

**Root Cause:** Weak output contract in the `design-system` skill. The skill requires prose sections and order but does not explicitly say each prose section must be a Markdown heading. Its own numbered list demonstrates bold section labels, which makes Codex's `**Colors**` output a reasonable interpretation even though the benchmark expects headings.

**Responsible Contract Gap:** `global/codex/design-system/SKILL.md` and `global/claude/design-system/SKILL.md`, mirrored. The benchmark assertion is reasonable for machine-readable document structure, but the skill text should match it.

**Recommended Fix:** Route to `$targeted-skill-builder design-system prose headings`. Update both mirrored `design-system` skills to require Part 2 prose sections as Markdown headings, e.g. "Each prose section must be written as a Markdown heading (`## Overview`, `## Colors`, ...), not bold paragraph labels." Optionally update the Part 2 list examples to use heading literals. Because tracked `SKILL.md` behavior changes, refresh Skills Showcase data and run the standard skill validation scripts.

**Validation Plan:** Run `diff -u global/claude/design-system/SKILL.md global/codex/design-system/SKILL.md`, targeted `rg` for the new heading requirement, `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, regenerate/validate Skills Showcase data, and run `pnpm --dir tests test:layer1 -- runner.test.ts bench-report.test.ts`. Then rerun `pnpm bench --skill design-system --agent codex --runs 1 --chunk-size 1 --pause 0` when runner budget permits.

**Confidence:** High. Evidence gaps: this triage did not change the skill text or rerun the smoke after contract tightening.

**Recommended next skill:** `$targeted-skill-builder`

## Current Plan

- [ ] Harden benchmark-test-skill for both-agent runs and rate-limit classification.
  - [x] Add explicit benchmark agent selection with `--agent both` as the default.
  - [x] Persist Claude and Codex benchmark sessions separately.
  - [x] Classify rate limits and quota exhaustion as infrastructure-blocked runs.
  - [x] Update benchmark-test-skill docs and lessons.
  - [x] Run targeted validation, commit, and push the harness update.

- [x] Run a fresh `$benchmark-test-skill design-system` harness cycle.
  - [x] Confirm the benchmark-test-skill contract and target skill.
  - [x] Run `pnpm verify --skill design-system` from `tests/`.
  - [x] If verify passes, run `pnpm bench --skill design-system --runs 3 --chunk-size 3 --pause 0`.
  - [x] Write or update `benchmark/test-design-system-2026-05-10.md` from `report.json`.
  - [x] Record review results, then commit and push the intended changes.

- [x] Read the relevant lesson and current `agentic-skills-bench` pack files.
- [x] Replace the old benchmark command with the clearer `benchmark-test-skill` skill for Claude and Codex.
- [x] Add `packs/agentic-skills-bench/PACK.md` and update discovery docs.
- [x] Remove the old benchmark command's skill files and references.
- [x] Regenerate Skills Showcase data for the skill and pack metadata change.
- [x] Run skill metadata, dependency, next-step routing, showcase freshness, targeted search, and whitespace validation.
- [ ] Commit and push the intended rename.

## Current Benchmark: design-system

- [x] Read the `benchmark-test-skill` contract and confirmed `design-system` is the skill under test.
- [x] Ran `pnpm verify --skill design-system`.
- [x] Ran `pnpm bench --skill design-system --runs 3 --chunk-size 3 --pause 0`.
- [x] Wrote `benchmark/test-design-system-2026-05-10.md`.
- [x] Committed and pushed the benchmark report.

## Current Fix: design-system benchmark timeout reporting

- [x] Triage confirmed the failing benchmark run exited 143 after a partial write.
- [x] Increase the `design-system` benchmark timeout above the observed slow run.
- [x] Add failed-run exit-code and failed-assertion reporting to benchmark reports.
- [x] Run targeted validation.
- [ ] Commit and push the harness fix.

## Review

**Fresh Benchmark Run:** `$benchmark-test-skill design-system` ran on 2026-05-10 through the `agentic-skills-bench` harness. `pnpm verify --skill design-system` passed: layer1 PASS in 7.4s with 1,185 tests and layer2 PASS in 177.2s with both `design-system` behavior tests passing.

**Fresh Benchmark Result:** `pnpm bench --skill design-system --runs 3 --chunk-size 3 --pause 0` completed session `design-system-d7f8c628`. Under the updated semantics, evaluated pass rate was 100.0% across 1 evaluated run, with 2 infrastructure-blocked rate-limit runs, p50 latency 13.5s, p95 latency 104.9s, p99 latency 113.0s, mean pairwise similarity 1.000, 0 outliers, and total estimated cost $3.00.

**Fresh Infrastructure Block:** Runs 1 and 2 were blocked before skill behavior could be evaluated after the agent runner reported `You've hit your limit · resets 3:40pm (America/New_York)`. The block is recorded in `benchmark/test-design-system-2026-05-10.md` with the raw session path.

**Both-Agent Benchmark Fix:** The benchmark harness now supports `--agent claude`, `--agent codex`, and `--agent both`, with `both` documented as the benchmark-test default. Raw sessions are separated as `tests/benchmarks/runs/<skill>-<agent>-<sessionId>/`, and rate-limit/quota outputs are reported as infrastructure-blocked runs outside the evaluated skill pass rate.

**Both-Agent Validation:** `pnpm --dir tests test:layer1 -- bench-report.test.ts`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-next-step-routing.sh --missing`, targeted stale-string scans, and `git diff --check` passed. `pnpm --dir tests exec tsc --noEmit` remains unusable because the test package still lacks Node typings and fails broadly on pre-existing configuration errors.

**Strategy Used:** Targeted skill-builder update after session-triage verified that the existing behavior was right but the old command name was ambiguous.

**Files Changed:** Added `benchmark-test-skill` under `packs/agentic-skills-bench/{claude,codex}/`, added `packs/agentic-skills-bench/PACK.md`, removed the old benchmark command, updated pack/reference docs and lessons/history, and refreshed generated showcase data.

**Behavior:** `$benchmark-test-skill <skill>` and `/benchmark-test-skill <skill>` now explicitly benchmark-test one repository skill via `pnpm verify --skill <SKILL>` followed by `pnpm bench --skill <SKILL> --agent both --runs 3 --chunk-size 3 --pause 0`. The contract says the trailing argument is the skill under test and not a mode for that skill.

**Validation:** `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `scripts/validate-skills-showcase-data.sh`, targeted `rg` checks for old and new command names, and `git diff --cached --check` passed. `github-proof-data.js` uses the generator's documented public-metadata fallback in this environment.

## Benchmark Review: design-system

**Strategy Used:** `benchmark-test-skill` harness run for the `design-system` skill only.

**Validation:** `pnpm verify --skill design-system` passed: layer1 PASS in 7.5s with 1,184 tests, and layer2 PASS in 167.1s with both `design-system` behavior tests passing.

**Benchmark Result:** `pnpm bench --skill design-system --runs 3 --chunk-size 3 --pause 0` completed session `design-system-534194ed`. Pass rate was 66.7% with Wilson 95% CI 20.8% - 93.9%, p50 latency 91.0s, p95 latency 225.0s, p99 latency 236.9s, mean pairwise similarity 0.843, 0 outliers, and total estimated cost $3.00.

**Failure:** Run 2 failed the `Interview log created` assertion. All other assertions passed in all runs.

## Fix Review: design-system benchmark timeout reporting

**Strategy Used:** Targeted harness hardening. The `design-system` skill contract already requires `design-system-interview.md`, so the fix belongs in benchmark timeout/reporting rather than the skill text.

**Changes:** Increased the `design-system` benchmark timeout to 300s and extended benchmark reports with a `Failed Runs` section that includes each failed run's exit code and failed assertions.

**Validation:** `pnpm --dir tests test:layer1 -- bench-report.test.ts`, `./install.sh`, `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, and `git diff --check` passed. `pnpm --dir tests exec tsc --noEmit` is not a usable gate because the test package currently lacks Node typings and fails broadly on pre-existing configuration errors.

## Completed Phase

Phase 34 - Skills Showcase Distribution Launch is archived at `tasks/phases/phase-34.md`.

## Launch Follow-Ups

Manual launch tasks remain in `tasks/manual-todo.md`:

- Choose and configure the static newsletter/email provider endpoint on `/follow/`, then re-run local validation.
- Configure the Vercel project for `docs/skills-showcase/` and verify deployed static route reloads after final local validation.

## Validation Snapshot

- `scripts/validate-skills-showcase-data.sh` passed after refreshing generated proof data.
- `node --check docs/skills-showcase/app.js` passed.
- Static route files exist for `/`, `/workflows/`, `/packs/`, `/catalog/`, `/inspect/`, and `/follow/`.
- One local HTTP HEAD check for `/` returned `HTTP/1.0 200 OK`; repeated temporary-server curl checks were unreliable in the sandbox.
- Targeted scans confirmed LexCorp, YouTube, X/Twitter, Discord, GitHub, newsletter states, proof boundaries, accessibility hooks, and reduced-motion handling.
- `git diff --check` passed.

## Next Work

Discover the next candidate project phase, or explicitly park the project after manual launch tasks are handled.

**Recommended next command:** `$brainstorm`

## Current Hotfix: Skills Showcase Hero Overlap

**Status:** Fixed on 2026-05-08.

**Plan**

- [x] Validate the reported homepage hero text/diagram collision against the current static site.
- [x] Trace the responsible hero HTML/CSS and recent git history.
- [x] Apply the smallest responsive layout fix that preserves the blueprint design.
- [x] Verify static syntax, generated data freshness, whitespace, and desktop/mobile visual layout.
- [x] Record investigation results and ship the tracked changes.

## Review

**Strategy Used:** UI investigation. No pivot required.

**User Claims Validated:** Confirmed. The homepage hero placed large headline text in a 5-column grid track while the right-side blueprint occupied 7 columns, and the layout did not stack until `900px`.

**Root Cause:** `docs/skills-showcase/styles.css` used an asymmetric desktop hero grid (`.hero-copy` span 5, `.hero-visual` span 7) with `h1` scaling up to `9vw`, so mid-size desktop/tablet widths could let the headline overflow into the blueprint area. The relevant layout was introduced with the initial showcase shell commit `bac0b1e`.

**Fix Applied:** Adjusted the hero to a balanced 6/6 desktop grid, added `min-width: 0` to both hero grid items, reduced the desktop headline clamp, moved the single-column hero breakpoint to `1080px`, and tightened stacked/mobile headline and blueprint wrapping so the diagram drops below the text before crowding it.

**Prevention:** Browser visual checks at desktop, tablet, and mobile widths should be part of showcase UI validation whenever hero copy or blueprint layout changes.
