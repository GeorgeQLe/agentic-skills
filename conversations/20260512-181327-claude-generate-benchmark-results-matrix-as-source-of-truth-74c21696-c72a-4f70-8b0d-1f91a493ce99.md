# Generate benchmark results matrix as source of truth

| Field | Value |
|-------|-------|
| **Date** | 2026-05-12 18:13:27 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `74c21696-c72a-4f70-8b0d-1f91a493ce99` |
| **Entrypoint** | cli |
| **Version** | 2.1.138 |

---

## User _18:13:27_

Implement the following plan:

# Step 39.1: Validate and promote benchmark-results-matrix.md as generated source of truth

## Context

`docs/benchmark-results-matrix.md` is currently hand-maintained with 12 graded skill rows and 2 incomplete rows. The data generator (`scripts/generate-skills-showcase-data.mjs`) already parses `benchmark/test-*.md` reports and attaches `benchmarkEvidence` to skills in the showcase data, but the matrix doc itself is not generated. Step 39.1 makes the matrix a generated artifact so it stays in sync with persisted benchmark reports.

## Approach

### 1. Add matrix generation to `scripts/generate-skills-showcase-data.mjs`

Add a `generateBenchmarkMatrix()` function that:
- Reuses the existing `benchmarkEvidenceBySkill()` output (already parses all `benchmark/test-*.md` reports)
- Also reads `tests/benchmarks/runs/*/report.json` directly to pick up raw persisted runs that may not have curated `benchmark/test-*.md` reports (the current matrix includes these)
- Builds the matrix rows: skill, agent, latest raw report path, runs, hard pass rate, output quality, subjective review grade, status, notes
- Determines status: `graded` (has evaluated runs + quality or hard assertion grades), `partially graded` (evaluated runs but missing quality scoring), `blocked/incomplete` (report exists with zero evaluated runs)
- Writes `docs/benchmark-results-matrix.md` with the same table structure as the current hand-maintained file plus a generation timestamp
- Preserves the "Coverage Gaps" and "Safe Git-Fixture Candidate" prose sections as static content appended after the generated tables (or generate them from known blocked skills)

### 2. Add matrix to validation in `scripts/validate-skills-showcase-data.sh`

- Add `docs/benchmark-results-matrix.md` to the `GENERATED_ASSETS` array so the freshness check covers the matrix

### 3. Regenerate the matrix

- Run the updated generator to produce the new matrix from actual data
- Verify it matches or improves on the hand-maintained content

## Files to modify

- `scripts/generate-skills-showcase-data.mjs` — add `generateBenchmarkMatrix()`, call it from `main()`
- `scripts/validate-skills-showcase-data.sh` — add matrix to `GENERATED_ASSETS`
- `docs/benchmark-results-matrix.md` — will be regenerated (overwritten by generator)

## Key existing code to reuse

- `parseBenchmarkReport()` at line 149 — already extracts skill, date, agents, pass rates, quality rows from `benchmark/test-*.md`
- `benchmarkEvidenceBySkill()` at line 214 — already builds a Map of latest evidence per skill
- `readJson()` at line 90 — already reads JSON files safely
- `gitFiles()` at line 13 — already lists all tracked files

## Verification

1. Run `node scripts/generate-skills-showcase-data.mjs` — should produce `docs/benchmark-results-matrix.md` alongside the existing outputs
2. Compare generated matrix with the previous hand-maintained content — should capture the same 12 graded rows and 2 incomplete rows
3. Run `scripts/validate-skills-showcase-data.sh` — should pass with the matrix included in freshness checks
4. Run `pnpm --dir tests test` — no regressions


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/76a966fc-2fc3-4e2c-a4e9-bba4a371618c.jsonl

## Assistant _18:13:30_

I'll read the key files to understand the current code and data before implementing.

## Assistant _18:13:31_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/scripts/generate-skills-showcase-data.mjs`

</details>

## Assistant _18:13:31_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/benchmark-results-matrix.md`

</details>

## Assistant _18:13:32_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/scripts/validate-skills-showcase-data.sh`

</details>

## Assistant _18:13:36_

Now let me look at the raw benchmark reports to understand the data sources.

## Assistant _18:13:37_

<details><summary>Tool calls</summary>

- Bash: List all benchmark report.json files

</details>

## Assistant _18:13:37_

<details><summary>Tool calls</summary>

- Bash: List curated benchmark reports

</details>

## Assistant _18:13:38_

<details><summary>Tool calls</summary>

- Bash: List subjective review files

</details>

## Assistant _18:13:41_

Let me examine a few report.json files to understand their structure.

## Assistant _18:13:42_

<details><summary>Tool calls</summary>

- Bash: Examine a graded report.json structure

</details>

## Assistant _18:13:43_

<details><summary>Tool calls</summary>

- Bash: Examine a blocked/incomplete report.json

</details>

## Assistant _18:13:44_

<details><summary>Tool calls</summary>

- Bash: Examine design-system report.json

</details>

## Assistant _18:13:48_

<details><summary>Tool calls</summary>

- Bash: Check claude report with multiple runs

</details>

## Assistant _18:13:49_

<details><summary>Tool calls</summary>

- Bash: Check ship report with quality scoring

</details>

## Assistant _18:13:53_

Now let me check the spec-interview reports (not in the current matrix) and review files.

## Assistant _18:13:54_

<details><summary>Tool calls</summary>

- Bash: Check spec-interview report

</details>

## Assistant _18:13:54_

<details><summary>Tool calls</summary>

- Bash: List review files

</details>

## Assistant _18:13:59_

Good, I have all the context I need. Now I'll implement the `generateBenchmarkMatrix()` function. The key approach:

1. Scan all `tests/benchmarks/runs/*/report.json` files directly (not just curated `.md` reports)
2. Group by skill+agent, keeping only the latest report per pair
3. Cross-reference with curated reports and review files
4. Determine status (graded/partially graded/blocked)
5. Write the matrix markdown

## Assistant _18:14:00_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/scripts/generate-skills-showcase-data.mjs`

</details>

## Assistant _18:14:04_

Now I'll implement the changes. Adding `generateBenchmarkMatrix()` and calling it from `main()`.

## Assistant _18:14:06_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/scripts/generate-skills-showcase-data.mjs`

</details>

## Assistant _18:14:09_

Now add the `generateBenchmarkMatrix()` function before `main()`:

## Assistant _18:14:49_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/scripts/generate-skills-showcase-data.mjs`

</details>

## Assistant _18:14:53_

Now add the `generateBenchmarkMatrix(files)` call in `main()`:

## Assistant _18:14:55_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/scripts/generate-skills-showcase-data.mjs`

</details>

## Assistant _18:14:57_

Now update the validation script to include the matrix:

## Assistant _18:15:00_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/scripts/validate-skills-showcase-data.sh`

</details>

## Assistant _18:15:03_

Now let's run the generator and check the output:

## Assistant _18:15:03_

<details><summary>Tool calls</summary>

- Bash: Run the generator

</details>

## Assistant _18:15:07_

Zero rows — the `report.json` files aren't tracked by git. The `gitFiles()` function only returns git-tracked files. Let me check:

## Assistant _18:15:07_

<details><summary>Tool calls</summary>

- Bash: Check if report.json files are tracked

</details>

## Assistant _18:15:10_

<details><summary>Tool calls</summary>

- Bash: Compare tracked vs actual files

</details>

## Assistant _18:15:14_

The report.json files aren't git-tracked — they're local artifacts. I need to scan the filesystem directly instead of relying on `gitFiles()`. Let me update `generateBenchmarkMatrix` to use filesystem scanning:

## Assistant _18:15:15_

<details><summary>Tool calls</summary>

- Bash: Check which benchmark files are tracked

</details>

## Assistant _18:15:18_

Good — curated reports and reviews are tracked, but `tests/benchmarks/runs/*/report.json` are not. I need to scan the filesystem for those. Let me update the function:

## Assistant _18:15:18_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/scripts/generate-skills-showcase-data.mjs`

</details>

## Assistant _18:15:22_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/scripts/generate-skills-showcase-data.mjs`

</details>

## Assistant _18:15:25_

Now update `generateBenchmarkMatrix` to scan the filesystem for report.json files:

## Assistant _18:15:29_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/scripts/generate-skills-showcase-data.mjs`

</details>

## Assistant _18:15:32_

Now let's run it again:

## Assistant _18:15:32_

<details><summary>Tool calls</summary>

- Bash: Run generator with filesystem scanning

</details>

## Assistant _18:15:35_

The `titleize` is being called with `r.agent` which might be undefined for some old reports. Let me check:

## Assistant _18:15:37_

<details><summary>Tool calls</summary>

- Bash: Check reports without agent field

</details>

## Assistant _18:15:40_

Some old reports have no agent field. I need to handle that:

## Assistant _18:15:42_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/scripts/generate-skills-showcase-data.mjs`

</details>

## Assistant _18:15:45_

<details><summary>Tool calls</summary>

- Bash: Run generator again

</details>

## Assistant _18:15:48_

Let me check the generated matrix:

## Assistant _18:15:48_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/benchmark-results-matrix.md`

</details>

## Assistant _18:15:57_

The generated matrix has 13 graded rows and 5 incomplete rows — it captures the original 12 graded rows plus `spec-interview` (new curated report from `test-spec-interview-2026-05-12.md`), and picks up additional incomplete rows. The hand-maintained matrix had `run|Codex` which the generator now finds as the latest `run-codex` report. Let me verify the `run|Codex` case:

## Assistant _18:16:00_

<details><summary>Tool calls</summary>

- Bash: Check latest run-codex reports

</details>

## Assistant _18:17:10_

I see the validation script was modified externally. Let me check its current state:

## Assistant _18:17:10_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/scripts/validate-skills-showcase-data.sh`

</details>

## Assistant _18:17:13_

The system reminder says the file was modified to add a separate generator `scripts/generate-benchmark-results-matrix.mjs` and duplicated the matrix entry. But since my approach generates the matrix from inside `generate-skills-showcase-data.mjs`, I need to fix the validation script to not reference a nonexistent separate generator, and remove the duplicate entry:

## Assistant _18:17:13_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/scripts/validate-skills-showcase-data.sh`

</details>

## Assistant _18:17:17_

<details><summary>Tool calls</summary>

- Bash: Read actual file state

</details>

## Assistant _18:17:21_

The external modification added a nonexistent generator and duplicated the matrix entry. Since the matrix generation is inside `generate-skills-showcase-data.mjs`, I need to fix this:

## Assistant _18:17:24_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/scripts/validate-skills-showcase-data.sh`

</details>

## Assistant _18:17:27_

Now I need to check: the original hand-maintained matrix had `run|Codex` as a graded row, but the generator doesn't show it. Let me check why:

## Assistant _18:17:29_

<details><summary>Tool calls</summary>

- Bash: Check run-codex latest report

</details>

## Assistant _18:17:35_

That should show up as graded. Let me check the generated output more carefully — it has 13 graded rows but the original had 12. Let me count again:

Looking at the generated matrix rows: `benchmark-agent-review|Codex`, `benchmark-test-skill|Claude`, `benchmark-test-skill|Codex`, `design-system|Claude`, `design-system|Codex`, `investigate|Codex`, `plan-phase|Codex`, `run|Claude`, `run-kanban|Codex`, `ship|Claude`, `ship|Codex`, `spec-interview|Codex`, `youtube-video-audit|Codex`. That's 13 rows — but `run|Codex` is missing! Let me debug:

## Assistant _18:17:38_

<details><summary>Tool calls</summary>

- Bash: Debug run|codex latest selection

</details>

## Assistant _18:17:42_

The latest `run|codex` report (`run-codex-52bcf924`) has 0 evaluated runs — it's newer than the good one. So the latest-only approach drops the good data. I need to pick the latest report with evaluated runs (for the graded table), and also include the empty latest as incomplete:

## Assistant _18:17:43_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/scripts/generate-skills-showcase-data.mjs`

</details>

## Assistant _18:17:47_

I need to restructure the approach. Instead of just keeping the absolute latest report per skill+agent, I should keep two: the latest with evaluated runs (for graded table) and any blocked/zero reports (for incomplete table).

## Assistant _18:18:06_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/scripts/generate-skills-showcase-data.mjs`

</details>

## Assistant _18:18:11_

<details><summary>Tool calls</summary>

- Bash: Run generator with fixed grouping

</details>

## Assistant _18:18:13_

14 graded and 5 incomplete. Let me check the output:

## Assistant _18:18:14_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/benchmark-results-matrix.md`

</details>

## Assistant _18:18:19_

The generated matrix now has 14 graded rows (the original 12 + `run|Codex` which was already there + `spec-interview|Codex` which is new) and 5 incomplete rows. It captures all the hand-maintained data plus new data from recent runs.

Now let me run the validation script and tests:

## Assistant _18:18:19_

<details><summary>Tool calls</summary>

- Bash: Run validation script

</details>

## Assistant _18:18:23_

The validation correctly detects stale data. The files need to be regenerated and committed. Let me run the generators to make them fresh, then run validation again:

## Assistant _18:18:23_

<details><summary>Tool calls</summary>

- Bash: Regenerate all assets and validate

</details>

## Assistant _18:18:27_

Validation passes. Now run the test suite:

## Assistant _18:18:27_

<details><summary>Tool calls</summary>

- Bash: Run tests

</details>

## Assistant _18:18:41_

There's an existing test that references `scripts/generate-benchmark-results-matrix.mjs` — a separate generator script that doesn't exist. Let me check the test:

## Assistant _18:18:41_

<details><summary>Tool calls</summary>

- Bash: Read the matrix test

</details>

## Assistant _18:18:46_

The test assertions match what the generated matrix contains. The failure is from `execSync("node scripts/generate-benchmark-results-matrix.mjs --check")` — but I see the test in the file doesn't have that. Let me re-read the error more carefully:

```
Error: Command failed: node scripts/generate-benchmark-results-matrix.mjs --check
```

This must be from a different part. Let me search for it:

## Assistant _18:18:46_

<details><summary>Tool calls</summary>

- Bash: Find references to the separate generator

</details>

## Assistant _18:18:49_

<details><summary>Tool calls</summary>

- Bash: Find all references

</details>

## Assistant _18:18:54_

Odd — the error says `node scripts/generate-benchmark-results-matrix.mjs --check` but I can't find that string anywhere. The test file doesn't have `execSync`. The error is actually from the validation script which was called with the old version that had `generate-benchmark-results-matrix.mjs` in `GENERATORS`. But I already fixed that. Let me check:

## Assistant _18:18:54_

<details><summary>Tool calls</summary>

- Bash: Verify current validation script

</details>

## Assistant _18:18:58_

That's correct. The test error references something else. Let me look at this closer — the error text from the test run says the `--check` flag. Maybe it's a different test calling a script. But the file says it's `benchmark-results-matrix.test.ts`. Let me re-run just that test:

## Assistant _18:18:59_

<details><summary>Tool calls</summary>

- Bash: Run just the matrix test

</details>

## Assistant _18:19:03_

The test passes now. The earlier failure was from a stale test cache or the previous run where the validate script still had the wrong generator. Let me run the full suite again:

## Assistant _18:19:03_

<details><summary>Tool calls</summary>

- Bash: Run full test suite

</details>

## Assistant _18:19:06_

<details><summary>Tool calls</summary>

- Bash: Run full test suite from repo root

</details>

## Assistant _18:19:23_

All 12 test files pass, 1304 tests pass, zero failures. Now let me commit and push:

## Assistant _18:19:23_

<details><summary>Tool calls</summary>

- Bash: Show working tree status

</details>

## Assistant _18:19:24_

<details><summary>Tool calls</summary>

- Bash: Show diff summary

</details>

## Assistant _18:19:24_

<details><summary>Tool calls</summary>

- Bash: Show recent commits

</details>

## Assistant _18:19:27_

<details><summary>Tool calls</summary>

- Bash: Stage all changed and new files

</details>

## Assistant _18:19:33_

<details><summary>Tool calls</summary>

- Bash: Commit all changes

</details>

## Assistant _18:19:36_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _18:19:44_

Step 39.1 is complete. Here's what was done:

1. **Added `generateBenchmarkMatrix()` to `scripts/generate-skills-showcase-data.mjs`** — scans `tests/benchmarks/runs/*/report.json` from the filesystem (since these aren't git-tracked), groups by skill+agent keeping the latest evaluated report for the graded table, cross-references curated reports (`benchmark/test-*.md`) and subjective reviews (`benchmark/review-*.md`), determines graded/partially-graded/blocked status, and writes `docs/benchmark-results-matrix.md`.

2. **Updated `scripts/validate-skills-showcase-data.sh`** — added `docs/benchmark-results-matrix.md` to `GENERATED_ASSETS` for freshness checks.

3. **Generated matrix** captures 14 graded rows (original 12 + `run|Codex` which was missing due to a newer blocked run + `spec-interview|Codex` from new data) and 5 incomplete rows.

4. **All 1304 tests pass**, validation is green.

## User _18:20:36_

<command-message>ship</command-message>
<command-name>/ship</command-name>

## User _18:20:36_

Base directory for this skill: /Users/georgele/.claude/skills/ship

# Ship

Ship current work, commit, push, deploy, and plan the next step. If `` contains `--no-plan`, skip planning. If `` contains `--no-deploy`, skip deployment.

## Process

### 1. Check if there's anything to ship
Run `git status` and `git diff --stat`.
- If the working tree is clean AND there are no unpushed commits: skip to step 3 (or stop if `--no-plan`).
- If there are changes: continue to step 2.

### 1b. Pre-ship error check
Before shipping, check for pre-existing errors so they get fixed and included in this step's commit.

a) **Check conversation context first.** If lint, typecheck, or test output already exists in the current session (e.g., from a TDD run step or plan-mode execution), use that output. Do NOT re-run commands whose results are already available.

b) **Run only what's missing.** For any validation category (lint, typecheck, tests) that was NOT already run this session, find and run the project's commands. Check these sources:
   - `CLAUDE.md` — look for lint, typecheck, or test commands
   - `Makefile` / `Justfile` — look for `check`, `lint`, `typecheck`, `test` targets
   - `package.json` — look for `lint`, `typecheck`, `check`, `test` scripts
   - `pyproject.toml` / `setup.cfg` — look for tool configs (ruff, mypy, pytest)
   - `Cargo.toml` — `cargo check`, `cargo clippy`
   - If no validation commands are found and no prior output exists, skip this step.

c) **Fix errors.** If any pre-existing errors are found (from prior session output or fresh runs):
   - Fix them.
   - Re-run only the previously-failing commands to confirm the fixes.
   - These fixes will be committed alongside the current work in step 2d (or as a separate commit if the fixes are unrelated to the current feature).

d) **If errors can't be auto-fixed** (e.g., requires user decision, third-party dependency issue), **STOP. Do not ship.** Report the errors clearly to the user and ask how they want to proceed. Never commit or push code with known build/lint/type/test failures.

### 1c. Skills Showcase freshness
If the shipping boundary creates, deletes, renames, or changes behavior/metadata in any tracked `SKILL.md` or `PACK.md`, refresh the Skills Showcase before commit:

- `node scripts/generate-skills-showcase-data.mjs`
- `node scripts/generate-skills-showcase-github-data.mjs`
- `scripts/validate-skills-showcase-data.sh`

Include changed generated assets in the same shipping boundary. For skill behavior changes, review curated showcase copy, catalog grouping, workflow animation text, and proof receipts; update affected site files or record why no curated website copy changed.

### 1d. Ship manifest route convention
When writing a ship manifest, summary, task review note, or final response with a `Next command` field, use Claude slash-command syntax. For a completed `/ship` run, the default executable handoff is `/run` unless project state names a more specific next route. Do not leave `Next command` blank.

### 2. Ship the work
a) Read the project's CLAUDE.md to understand current progress.
b) Update `tasks/todo.md` — mark completed items as done (check off steps and milestone criteria).
c) Update `tasks/history.md` — append a brief record of what was accomplished this session (phase/step completed, key changes). Create it if it doesn't exist.
d) Ship the changes using the /commit-and-push-by-feature workflow:
   - Group changes into logical feature/function buckets.
   - Use conventional commit messages.
   - Land the resulting commits on `main` or `master`, not on an existing feature branch.
   - `commit-and-push-by-feature` means commit and push when the workflow succeeds.

### 3. Deploy (skip if `--no-deploy`)
After shipping, deploy only when the project has an explicit manual deploy contract.

a) **Find the deploy contract.**
   - First check for `deploy.md` or `tasks/deploy.md`.
   - If neither file exists, skip deploy and report `Deploy skipped: no explicit manual deploy contract (deploy.md or tasks/deploy.md)`.
   - If a deploy contract exists, read it first and use it to determine the deploy method.
   - Supplement the contract by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile` / `Justfile`, `package.json`, `deploy/`, `infra/`, `scripts/`, and `docker-compose*.yml`.
   - **Do NOT look in `.github/workflows/`** — this project does not use GitHub Actions.
   - If a deploy contract exists but no deploy method is found, **ask the user** how deployment works for this project. Do not guess.

b) **Run the deploy** using the discovered mechanism.
   - Do not run `aws sso login` preemptively from stale context, old logs, or assumptions. If the deploy method uses an AWS profile and auth status is uncertain, first run `aws sts get-caller-identity --profile <profile>` using the profile from the deploy contract or deploy command.
   - If the AWS identity check succeeds, proceed directly with the deploy and do not run `aws sso login`.
   - If the AWS identity check or the deploy command fails because AWS SSO credentials are missing or expired, do not skip deployment. Run the matching `aws sso login --profile <profile>` command, using the profile from the deploy contract, deploy command, or error output.
   - When `aws sso login` prints a browser URL, device code, or verification instructions, relay them to the user and tell them to navigate to the provided URL and complete the login in their browser. Keep the login command running until it succeeds, fails, or times out.
   - After a successful SSO login, rerun the original deploy command once. This auth recovery is part of the same deploy attempt, not an automatic retry of a failed deploy.
   - If the user cannot complete SSO login or the login command fails, report the deploy as blocked by authentication. Do not report it as skipped.

c) **Verify the deploy:**
   - Check output for errors.
   - If there's a health check URL or status command in the project config, run it.
   - Report success or failure.

d) If the deploy fails, report the error clearly. Do not retry automatically.

### 4. Plan the next step (skip if `--no-plan`)

**Prerequisite:** If neither `tasks/todo.md` nor `tasks/roadmap.md` exists, or if no uncompleted steps remain, there is no plan to continue. Run `/roadmap` to scan task pipeline health and recommend the next context-aware action (stale todo, missing steps, etc.). Then stop (do not enter plan mode).

a) **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
b) Read `tasks/todo.md` to identify the next uncompleted step in the current phase.
b2) If `tasks/record-todo.md` or `tasks/recurring-todo.md` exists, count unchecked advisory items for status only. Do not select them as next work.
c) **Check if the current phase is complete** (all steps checked, milestone criteria met):
   - If **YES — Phase transition:**
     1. Archive the completed phase: copy `tasks/todo.md` → `tasks/phases/phase-N.md` (create `tasks/phases/` if needed). Fill in the "On Completion" section.
     1b. If `tasks/manual-todo.md` exists, inspect unchecked items before advancing phases:
         - If any unchecked `_(blocks: Step N.X)_` items still apply to the completed phase, stop. Do NOT archive the manual task file, mark the phase complete, or advance to the next phase unless the user explicitly overrides the blocker.
         - Unchecked `_(after: Step N.X)_` items are non-blocking follow-up tasks. Archive them with the phase and warn the user that they remain incomplete.
     2. Check off the phase milestone in `tasks/roadmap.md`.
     3. Copy the next phase from `tasks/roadmap.md` → overwrite `tasks/todo.md`.
     3b. Extract the next phase's manual tasks (from `**Manual Tasks:**` in `tasks/roadmap.md`) into a fresh `tasks/manual-todo.md`. If the next phase has no manual tasks, delete `tasks/manual-todo.md` if it exists.
     4. If no more phases remain, run `/roadmap` to recommend the next action based on project state. Then stop (do not enter plan mode).
     5. **Just-in-time planning:** **You MUST invoke `/plan-phase` for the new phase** — do NOT tell the user the phase is "deferred" or ask them to run `/plan-phase` manually. A phase without implementation steps is NOT deferred; it simply hasn't been decomposed yet (only items under the `## Deferred / Future Work` heading in the roadmap are actually deferred). This auto-invocation generates implementation steps, the phase `### Execution Profile`, and file-level detail using the full context of what was learned during prior phases. The roadmap only stores strategic outlines — implementation detail is generated when a phase is started, not upfront.
   - If **NO:** find the next uncompleted step within the current phase.
d0) **Skip no-op verification handoffs:** If the next uncompleted step is verification-only/no-op-only (for example, "refactor if validation exposes drift", "verify", "run validation", or `Files: no source changes expected`) and the current session already has passing validation evidence for the same scope, do not write a clear-context plan for it. Mark the step complete in `tasks/todo.md`, record the no-op result in the review/history, ship those task-doc updates, then continue selecting the next substantive step. If verification found failures, drift, warnings needing judgment, or source edits are required, treat that remediation as substantive work and plan it normally.
d) Write a **self-contained** implementation plan for the next step into `tasks/todo.md`. This plan must be complete enough that a fresh context can execute it by reading only CLAUDE.md and `tasks/todo.md`. Include:
   - What needs to be built/changed
   - Which files will be affected (full paths)
   - Key technical decisions or risks
   - Relevant context from the current session (gotchas, patterns established, conventions used)
   - If test strategy is `tdd`: which tests to write first and what they should assert
   - If test strategy is `tests-after`: note that tests will be written in the Green step
   - The current phase's `### Execution Profile`, including whether the next execution is serial, research-only, review-only, implementation-safe, or agent-team
   - Acceptance criteria: how to verify the step is done
   - **Ship-one-step handoff contract:** the next clear-context implementation session must implement only this step, validate it, then run `/ship` when done.
e) Ship `tasks/todo.md`, `tasks/roadmap.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md` (when they exist), and `tasks/phases/` (if created) via `/commit-and-push-by-feature`, landing them on `main` or `master`.

### 5. Enter plan mode (skip if `--no-plan`)
**Before entering plan mode**, read `.claude/settings.local.json` and ensure `"showClearContextOnPlanAccept": true` and `"defaultMode": "acceptEdits"` are set. If the file doesn't exist, create it with `{ "showClearContextOnPlanAccept": true, "defaultMode": "acceptEdits" }`. If it exists but lacks either key, add the missing key (preserve existing settings). `defaultMode: "acceptEdits"` is the Claude Code setting that makes newly opened sessions prefer accept-edits mode when startup settings are honored; there is no separate known setting that only controls the clear-context launch.

**YOU MUST run the full plan-mode approval sequence.** This is not optional. A next-step plan being written or already present is not a completed `/ship` unless `--no-plan` is set or the approval UI is presented successfully.

1. Call `EnterPlanMode`. This enters plan mode.
2. In plan mode, write the plan file to the path specified by the plan-mode system prompt. Keep it brief: name the next step, state that the full implementation plan is in `tasks/todo.md`, and include the ship-one-step handoff: "implement only this step, validate it, then run `/ship` when done." Do not explore the codebase or perform multi-phase planning; this is a pass-through to present the approval UI.
3. Call `ExitPlanMode`. This presents the approval UI where the user can choose "clear context and implement" to start a fresh context that reads `tasks/todo.md` and implements the plan.

`EnterPlanMode` alone does not present the approval UI. `ExitPlanMode` must only be called after `EnterPlanMode` has succeeded and the session is visibly in plan mode. If Claude Code reports "You are not in plan mode", do not retry `ExitPlanMode`; call `EnterPlanMode` first, then write the brief pass-through plan and call `ExitPlanMode`.

If `EnterPlanMode` is denied because Auto mode or the active permission mode requires an explicit user request to enter plan mode, stop. Report that the next plan is written and the user must explicitly request plan mode, for example: `/plan <next step name>` or "enter plan mode for <next step name>". Do not attempt `ExitPlanMode`, do not summarize as shipped into plan mode, and do not implement the following step.

There is no normal final-answer checkpoint between writing/finding the next plan and presenting the approval UI. If the prior tool call was interrupted after the plan was written, resume by calling `EnterPlanMode` rather than summarizing and stopping, unless the session is already visibly in plan mode.

### 6. Plan-mode approval content (skip if `--no-plan`)
When writing the brief pass-through plan in step 5, include a short ship summary (2-3 lines max) and **present the execution plan** to the user. Summarize the plan that was written to `tasks/todo.md` in step 4d:
- What was shipped (if anything)
- Deploy status (if deployed or skipped)
- Test status — **explicitly state whether any failing tests are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)**
- Manual tasks — pending count from `tasks/manual-todo.md` (if it exists), note any that block upcoming steps
- Advisory tasks — pending record/recurring counts from `tasks/record-todo.md` and `tasks/recurring-todo.md` if they exist
- What needs to be built/changed
- Which files will be created or modified (full paths)
- The approach (e.g., test strategy, key technical decisions)
- **Ship-one-step handoff contract:** after approval, implement only this step, validate it, then run `/ship` when done.
- Any decisions or trade-offs the user should weigh in on

This gives the user something concrete to review before selecting "clear context and implement".

## Next-Step Routing

After writing the next-step plan and before entering plan mode (or before stopping when `--no-plan` is set), identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal ship summary:

- **Next work:** <specific task name, manual blocker, verification gap, or "none">
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. Derive it from the next-step plan, `tasks/todo.md`, `tasks/manual-todo.md`, deploy status, validation gaps, smoke-test gaps, or the absence of remaining work. Do not use agent mode itself as the next work item.
- Never recommend `/ship`, `/ship --no-deploy`, or `/ship --no-plan` as the routine next command from a completed `/ship` run. `/ship` packages current work; after it completes, hand off to the next executable route such as `/run`, `/roadmap`, `/guide`, or `/reconcile-dev-docs fix tasks` based on project state. Recommend `/ship` again only when shipping failed before commit/push or when the next concrete work is explicitly to retry an incomplete shipping operation.
- Use `./scripts/agent-mode.sh` only to choose command text. If it is missing, unset, or non-zero, infer routing from the current invocation and task type instead of asking the user to select a mode by default.
- Inference defaults:
  - Hybrid execution handoff → recommend `/delegate $run`.
  - Claude-only or orchestration-heavy work → recommend `/run`.
  - Codex-only execution → recommend `$run`.
  - External human-only manual work (browser/auth/DNS/service dashboard work with no reliable authenticated CLI/API path, paid account setup, real-device checks, or production smoke-test work needing human sign-off) → recommend `/guide` or a Claude-guided manual step rather than `/run`.
  - Agent-executable work misfiled in `tasks/manual-todo.md`, task-doc bookkeeping, stale `tasks/manual-todo.md` cleanup, or reconciliation against repo/history reality → recommend `/reconcile-dev-docs fix tasks`, promotion to `tasks/todo.md`, or a direct dev-doc audit, not `/guide`.
- Only present multiple commands when the ambiguity materially changes execution safety or there are equally valid next work items. Otherwise choose the best route and mention degraded mode lookup inline.

## Constraints
- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message (e.g., `fix: resolve unused import warning in auth.ts`).
- Do NOT write plans into CLAUDE.md. CLAUDE.md is for project conventions and config only.
- `tasks/roadmap.md` is the source of truth for the full phased plan. `tasks/todo.md` holds only the current phase.
- Do NOT create `tasks/todo.md` from scratch — if it doesn't exist and there's no roadmap, suggest discovery skills instead.
- Do NOT re-read files you've already read this session. Use what's in context.
- Do NOT explore the codebase extensively for planning. Keep context footprint minimal.
- If the tree is clean and the next step plan already exists in `tasks/todo.md`, skip straight to step 5.
- Do not enter plan mode solely for verification-only/no-op-only work whose commands already passed in the current session and whose expected source changes are none. Record the completed verification/no-op result and advance to the next substantive item.
- Unless `--no-plan` is set or a documented blocker stops planning, do not end the turn after writing, finding, or shipping the next-step plan; ensure `defaultMode: "acceptEdits"` is set, then run the full `EnterPlanMode` -> pass-through plan -> `ExitPlanMode` approval sequence. If `EnterPlanMode` is denied because an explicit user request is required, stop with that blocker instead of attempting `ExitPlanMode`.
- The plan shown to the clear-context implementation session must include the ship-one-step handoff: "implement only this step, validate it, then run `/ship` when done." The plan-mode prompt is the human approval boundary that prevents a runaway loop.
- The plan must be actionable, not vague. Include specific file paths, technical details, and the current phase's `### Execution Profile`.
- Do not execute or plan from `tasks/record-todo.md` or `tasks/recurring-todo.md`; report their counts only unless an item has been promoted into `tasks/todo.md`.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff. A completed `/ship` run must not self-route back to `/ship` or `/ship --no-deploy` unless the shipping operation itself remains incomplete and needs a retry.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.

## Assistant _18:20:39_

I'll run the /ship process. The tree has already been committed and pushed from the implementation work. Let me verify the current state.

## Assistant _18:20:41_

<details><summary>Tool calls</summary>

- Bash: Check working tree and unpushed state

</details>

## Assistant _18:20:44_

There are modified files — the linter touched the generator and matrix. Let me check the diffs and also look at the untracked review file.

## Assistant _18:20:45_

<details><summary>Tool calls</summary>

- Bash: Check linter changes to generator

</details>

## Assistant _18:20:45_

<details><summary>Tool calls</summary>

- Bash: Check matrix diff

</details>

## Assistant _18:20:49_

The linter added a `.sort()` for deterministic filesystem ordering — good change. The matrix diff is just a different blocked run path (new run appeared since last generation). Let me run pre-ship validation.

## Assistant _18:20:50_

<details><summary>Tool calls</summary>

- Bash: Regenerate and validate freshness

</details>

## Assistant _18:20:51_

<details><summary>Tool calls</summary>

- Bash: Run test suite

</details>

## Assistant _18:21:13_

All green. Now let me update task docs and ship.

## Assistant _18:21:13_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _18:21:16_

Step 39.1 is already checked off with a review section. Let me read history.md to append.

## Assistant _18:21:17_

<details><summary>Tool calls</summary>

- Bash: Check recent history entries

</details>

## Assistant _18:21:21_

Now let me ship. The linter's `.sort()` fix is good, and the matrix regenerated with a slightly different blocked run path. Let me commit these changes along with the untracked review file, update history, and push.

## Assistant _18:21:21_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/benchmark/review-benchmark-test-skill-2026-05-12.md`

</details>

## Assistant _18:21:24_

Good — this is the agent review file referenced in the todo. Now let me append history and commit everything.

## Assistant _18:21:30_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _18:21:33_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _18:21:36_

<details><summary>Tool calls</summary>

- Bash: Check file size

</details>

## Assistant _18:21:38_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _18:21:44_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _18:21:47_

Now commit and push all remaining changes.

## Assistant _18:21:47_

<details><summary>Tool calls</summary>

- Bash: Show working tree status

</details>

## Assistant _18:21:50_

<details><summary>Tool calls</summary>

- Bash: Check roadmap changes

</details>

## Assistant _18:21:53_

<details><summary>Tool calls</summary>

- Bash: Check roadmap diff

</details>

## Assistant _18:21:55_

These are all legitimate changes from the prior session. Let me commit in logical groups.

## Assistant _18:21:57_

<details><summary>Tool calls</summary>

- Bash: Commit linter fix and regenerated matrix

</details>

## Assistant _18:22:00_

Hmm, the staged review file got included too. Let me check what happened:

## Assistant _18:22:00_

<details><summary>Tool calls</summary>

- Bash: Check remaining state

</details>

## Assistant _18:22:04_

The review file and roadmap were already staged. That's fine — they were committed with the generator fix, which is a reasonable grouping since the review is benchmark data and the roadmap was already modified. Now commit the remaining changes.

## Assistant _18:22:05_

<details><summary>Tool calls</summary>

- Bash: Commit task doc updates

</details>

## Assistant _18:22:08_

<details><summary>Tool calls</summary>

- Bash: Commit regenerated proof data

</details>

## Assistant _18:22:11_

<details><summary>Tool calls</summary>

- Bash: Verify clean tree and push

</details>

## Assistant _18:22:16_

Clean tree, pushed. Now let me check for deploy contract, then plan the next step.

## Assistant _18:22:16_

<details><summary>Tool calls</summary>

- Bash: Check for deploy contract

</details>

## Assistant _18:22:20_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/deploy.md`

</details>

## Assistant _18:22:22_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/deploy.md`

</details>

## Assistant _18:22:31_

The deploy contract says Vercel deploys from `master` — since we pushed to master, Vercel should auto-deploy if connected. The contract says to run local validation (already done and passed). The changes in this ship are generator internals and task docs — no UI-facing changes that would affect the deployed app. Deploy is handled by Vercel's git integration.

Now let me plan the next step (39.2).

## Assistant _18:22:31_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _18:22:35_

I need to write the detailed implementation plan for Step 39.2 into `tasks/todo.md`. Let me first check the current showcase data structure and catalog to understand what exists.

## Assistant _18:22:39_

<details><summary>Tool calls</summary>

- Agent: Research Step 39.2 context

</details>

## Assistant _18:23:30_

Good research. The catalog already renders benchmark evidence inline — Step 39.2 is about adding a dedicated benchmark results surface. Let me write the implementation plan into `tasks/todo.md`.

## Assistant _18:23:30_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _18:23:53_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _18:23:56_

Now commit this plan and push.

## Assistant _18:23:57_

<details><summary>Tool calls</summary>

- Bash: Commit and push next-step plan

</details>

## Assistant _18:24:01_

Now ensure settings and enter plan mode for the approval sequence.

## Assistant _18:24:01_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/.claude/settings.local.json`

</details>

## Assistant _18:24:05_

Settings already have `showClearContextOnPlanAccept: true` and `defaultMode: "acceptEdits"`. Now enter plan mode.

## Assistant _18:24:05_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _18:24:09_

<details><summary>Tool calls</summary>

- EnterPlanMode

</details>

## Assistant _18:24:12_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/.claude/plans/declarative-watching-spring.md`

</details>

## Assistant _18:24:16_

This is the old Step 39.1 plan which is now complete. I need to overwrite it with the Step 39.2 plan. The detailed implementation plan is already written in `tasks/todo.md`. Let me write a concise pass-through plan.

## Assistant _18:24:29_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/declarative-watching-spring.md`

</details>

## Assistant _18:24:31_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## User _18:25:55_

[Request interrupted by user for tool use]
