# add-benchmark-results-page

| Field | Value |
|-------|-------|
| **Date** | 2026-05-12 18:25:55 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `75a9bcc0-6956-48c1-a4cb-330ecac633b6` |
| **Entrypoint** | cli |
| **Version** | 2.1.138 |

---

## User _18:25:55_

Implement the following plan:

# Step 39.2: Add benchmark results surface to Skills Showcase UI

## Ship Summary

- **Shipped:** Step 39.1 — generated `docs/benchmark-results-matrix.md` from persisted `report.json` files (14 graded, 5 incomplete rows). Added freshness validation and layer1 test.
- **Deploy:** Vercel auto-deploys from `master` push. No UI changes in 39.1 to verify.
- **Tests:** All 1304 tests pass (12 files). No failing tests expected.

## What Needs to Be Built

Step 39.2 adds a dedicated `/benchmarks` page to the Skills Showcase that aggregates benchmark results from skills with `benchmarkEvidence` data.

Full implementation plan is in `tasks/todo.md` under Step 39.2. Key points:

- **Create** `apps/skills-showcase/app/benchmarks/page.tsx` — server page with static HTML shell (follows `app/catalog/page.tsx` pattern)
- **Create** `apps/skills-showcase/src/showcase/benchmarks.tsx` — client component rendering aggregated benchmark results table (Skill, Agent, Pass Rate, Quality, Runs, Report Link)
- **Extract** shared TypeScript interfaces (`BenchmarkEvidence`, `BenchmarkAgent`, etc.) from `src/showcase/catalog.tsx` lines 42-84 into `src/showcase/types.ts`
- **Modify** `apps/skills-showcase/src/showcase/catalog.tsx` — make "benchmark-passed" tag link to `/benchmarks`
- **Add** styles to `apps/skills-showcase/app/globals.css` reusing `.benchmark-panel` green theme
- **Create** `apps/skills-showcase/src/showcase/benchmarks.test.tsx` — test coverage
- **Regenerate** showcase data and validate freshness

### Execution Profile
- **Parallel mode:** serial
- **Test strategy:** tests-after

## Handoff

Implement only this step, validate it, then run `/ship` when done.

- **Next work:** Step 39.2 — benchmark results surface in Skills Showcase UI
- **Recommended next command:** `/run`


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/74c21696-c72a-4f70-8b0d-1f91a493ce99.jsonl

## Assistant _18:26:01_

I'll implement Step 39.2 — adding a `/benchmarks` page to the Skills Showcase. Let me start by reading the plan and understanding the existing patterns.

## Assistant _18:26:02_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _18:26:03_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/catalog/page.tsx`

</details>

## Assistant _18:26:03_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/catalog.tsx`

</details>

## Assistant _18:26:12_

Now let me read the globals.css benchmark styles and check for any existing layout/nav patterns.

## Assistant _18:26:13_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/globals.css`

</details>

## Assistant _18:26:14_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/layout.tsx`

</details>

## Assistant _18:26:14_

<details><summary>Tool calls</summary>

- Bash: List app directory structure

</details>

## Assistant _18:26:23_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/ShowcaseHeader.tsx`

</details>

## Assistant _18:26:24_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/globals.css`

</details>

## Assistant _18:26:30_

Let me check the existing test setup and a sample showcase data file to understand the data shape.

## Assistant _18:26:31_

<details><summary>Tool calls</summary>

- Bash: List showcase source files

</details>

## Assistant _18:26:32_

<details><summary>Tool calls</summary>

- Bash: Find existing test files

</details>

## Assistant _18:26:34_

<details><summary>Tool calls</summary>

- Bash: Check skills-data.js structure and benchmark count

</details>

## Assistant _18:26:39_

Let me check the existing test pattern and the MobilePanel (which may have the nav links too).

## Assistant _18:26:40_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/catalog.test.tsx`

</details>

## Assistant _18:26:40_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/MobilePanel.tsx`

</details>

## Assistant _18:26:44_

Good, I have a clear picture. Now I'll implement all the pieces. Let me create the files in parallel.

## Assistant _18:26:51_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/types.ts`

</details>

## Assistant _18:27:11_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/benchmarks.tsx`

</details>

## Assistant _18:27:19_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/benchmarks/page.tsx`

</details>

## Assistant _18:27:26_

Now let me update catalog.tsx to use shared types and make the benchmark-passed tag link to `/benchmarks`, add nav links, add CSS, and create the test file.

## Assistant _18:27:40_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/catalog.tsx`

</details>

## Assistant _18:27:45_

Now update the benchmark-passed tag to link to `/benchmarks`.

## Assistant _18:27:48_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/catalog.tsx`

</details>

## Assistant _18:27:54_

Now add the Benchmarks nav link to both the header and mobile panel.

## Assistant _18:27:56_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/ShowcaseHeader.tsx`

</details>

## Assistant _18:27:59_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/MobilePanel.tsx`

</details>

## Assistant _18:28:02_

Now add the benchmarks table CSS and tag-link styles.

## Assistant _18:28:03_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/globals.css`

</details>

## Assistant _18:28:10_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/globals.css`

</details>

## Assistant _18:28:13_

Now add the benchmarks table styles and badge styles before `.status-ok`.

## Assistant _18:28:18_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/app/globals.css`

</details>

## Assistant _18:28:21_

Now create the test file and update routes.ts if it exists.

## Assistant _18:28:22_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/routes.ts`

</details>

## Assistant _18:28:26_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/routes.ts`

</details>

## Assistant _18:28:29_

Now create the test file.

## Assistant _18:28:57_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/benchmarks.test.tsx`

</details>

## Assistant _18:29:00_

Now let me run the showcase tests and build to verify everything works.

## Assistant _18:29:01_

<details><summary>Tool calls</summary>

- Bash: Run benchmarks tests

</details>

## Assistant _18:29:05_

All 10 tests pass. Now let me run all showcase tests and the build.

## Assistant _18:29:06_

<details><summary>Tool calls</summary>

- Bash: Run all showcase tests

</details>

## Assistant _18:29:07_

<details><summary>Tool calls</summary>

- Bash: Build the Next.js app

</details>

## Assistant _18:29:13_

One test expects exactly 7 routes — need to update it to 8. Let me also check the smoke tests for route coverage.

## Assistant _18:29:13_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/routes.test.ts`

</details>

## Assistant _18:29:18_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/routes.test.ts`

</details>

## Assistant _18:29:21_

Also need to add the expected route assertions.

## Assistant _18:29:22_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/routes.test.ts`

</details>

## Assistant _18:29:28_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/routes.test.ts`

</details>

## Assistant _18:29:32_

Now I need to check the smoke tests — they likely test for specific route rendering. Let me also check if there's a BenchmarksPage smoke test needed.

## Assistant _18:29:33_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/smoke.test.tsx`

</details>

## Assistant _18:29:36_

I should add a BenchmarksPage smoke test.

## Assistant _18:29:39_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/smoke.test.tsx`

</details>

## Assistant _18:29:43_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/src/showcase/smoke.test.tsx`

</details>

## Assistant _18:29:47_

Now run all tests and the build in parallel.

## Assistant _18:29:48_

<details><summary>Tool calls</summary>

- Bash: Run all showcase tests

</details>

## Assistant _18:29:49_

<details><summary>Tool calls</summary>

- Bash: Build the Next.js app

</details>

## Assistant _18:29:58_

All 85 tests pass and the build succeeds with `/benchmarks` as a static route. Now let me run the layer1 tests and regenerate showcase data.

## Assistant _18:29:59_

<details><summary>Tool calls</summary>

- Bash: Regenerate showcase data

</details>

## Assistant _18:30:00_

<details><summary>Tool calls</summary>

- Bash: Validate showcase data freshness

</details>

## Assistant _18:30:11_

Proof data is stale. Let me regenerate it.

## Assistant _18:30:11_

<details><summary>Tool calls</summary>

- Bash: Regenerate GitHub proof data

</details>

## Assistant _18:30:14_

<details><summary>Tool calls</summary>

- Bash: Re-validate showcase data freshness

</details>

## Assistant _18:30:29_

The validation script regenerates and compares — the files it's flagging still differ. Let me check what's happening.

## Assistant _18:30:29_

<details><summary>Tool calls</summary>

- Bash: Check what files changed

</details>

## Assistant _18:30:37_

The github-proof-data and benchmark-results-matrix are changing because of pre-existing dirty state. Let me check if the validation script compares working tree vs. freshly generated output.

## Assistant _18:30:37_

<details><summary>Tool calls</summary>

- Bash: Check validation script logic

</details>

## Assistant _18:30:44_

The validation checks if running generators changes the files — the proof data and matrix are changing because they were from a previous commit. These need to be committed along with my changes. The pre-existing dirty state in `tests/` is separate. Let me run the layer1 tests before committing.

## Assistant _18:30:45_

<details><summary>Tool calls</summary>

- Bash: Run layer1 tests

</details>

## Assistant _18:30:57_

All 1304 layer1 tests pass. Now let me check git diff to see the pre-existing dirty state in tests/.

## Assistant _18:30:57_

<details><summary>Tool calls</summary>

- Bash: Check pre-existing test changes

</details>

## Assistant _18:31:03_

Those were pre-existing from before (shown in initial git status). I should only commit the Step 39.2 changes. Let me update todo.md and then commit.

## Assistant _18:31:05_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _18:31:08_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _18:31:11_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _18:31:14_

Now let me add a review section for Step 39.2. Let me read the end of todo.md.

## Assistant _18:31:14_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _18:31:30_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _18:31:34_

Now let me verify git diff check and then run `/ship`.

## Assistant _18:31:34_

<details><summary>Tool calls</summary>

- Bash: Check for whitespace errors

</details>

## Assistant _18:31:40_

Clean. Now let me ship.

## Assistant _18:31:40_

<details><summary>Tool calls</summary>

- Skill: /ship

</details>

## User _18:31:40_

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

## Assistant _18:31:44_

I'll check the current state and ship the Step 39.2 work.

## Assistant _18:31:45_

<details><summary>Tool calls</summary>

- Bash: Show working tree status

</details>

## Assistant _18:31:46_

<details><summary>Tool calls</summary>

- Bash: Show changed file stats

</details>

## Assistant _18:31:46_

<details><summary>Tool calls</summary>

- Bash: Show recent commits

</details>

## Assistant _18:31:52_

There are staged changes from a prior session (roadmap.md, bench-setups.test.ts, tier1-workflows.setup.ts). I also have unstaged Step 39.2 changes and new untracked files. Let me check pre-ship validation — tests already passed (85 showcase tests, 1304 layer1 tests, build succeeded). Let me update history.md.

## Assistant _18:31:53_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _18:32:08_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/history.md`

</details>

## Assistant _18:32:13_

Now let me commit and push using feature-grouped commits. I'll organize into logical groups:

1. The pre-staged changes (benchmark setups — from prior session)
2. The Step 39.2 feature: benchmarks page + types extraction
3. Generated assets refresh
4. Task docs update

## Assistant _18:32:14_

<details><summary>Tool calls</summary>

- Bash: Check staged roadmap changes

</details>

## Assistant _18:32:18_

The staged changes are the benchmark-test-skill targeted fix from a prior session. Let me commit everything in logical groups.

## Assistant _18:32:20_

<details><summary>Tool calls</summary>

- Bash: Commit pre-staged benchmark fixture changes

</details>

## Assistant _18:32:25_

<details><summary>Tool calls</summary>

- Bash: Stage Step 39.2 feature files

</details>

## Assistant _18:32:31_

<details><summary>Tool calls</summary>

- Bash: Commit Step 39.2 feature

</details>

## Assistant _18:32:44_

<details><summary>Tool calls</summary>

- Bash: Commit regenerated assets

</details>

## Assistant _18:32:49_

<details><summary>Tool calls</summary>

- Bash: Commit task docs

</details>

## Assistant _18:32:53_

Looks like history.md wasn't tracked as changed. Let me check.

## Assistant _18:32:53_

<details><summary>Tool calls</summary>

- Bash: Check final state

</details>

## Assistant _18:33:00_

Wait — the todo.md changes should be in the last commit too. Let me check.

## Assistant _18:33:01_

<details><summary>Tool calls</summary>

- Bash: Check commit history

</details>

## Assistant _18:33:04_

The todo.md changes must have been picked up in the feature commit since the linter modified it. The tree is clean. Let me push and validate freshness.

## Assistant _18:33:05_

<details><summary>Tool calls</summary>

- Bash: Push commits to remote

</details>

## Assistant _18:33:06_

<details><summary>Tool calls</summary>

- Bash: Validate showcase data freshness

</details>

## Assistant _18:33:10_

The validation is still reporting staleness because the proof data regenerator picks up the new git commits (the commit hash changes the proof). Let me fix this by regenerating and pushing.

## Assistant _18:33:11_

<details><summary>Tool calls</summary>

- Bash: Regenerate all showcase data

</details>

## Assistant _18:33:16_

<details><summary>Tool calls</summary>

- Bash: Commit and push regenerated proof data

</details>

## Assistant _18:33:21_

Good. Now let me plan the next step. Reading todo.md for Step 39.3.

## Assistant _18:33:22_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _18:33:31_

Now I need to write the implementation plan for Step 39.3 into `tasks/todo.md` and set up the plan mode approval.

## Assistant _18:33:45_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md`

</details>

## Assistant _18:33:49_

<details><summary>Tool calls</summary>

- Bash: Commit and push plan

</details>

## Assistant _18:33:53_

Now let me set up plan mode for the approval flow.

## Assistant _18:33:54_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/.claude/settings.local.json`

</details>

## Assistant _18:33:57_

Settings already have `showClearContextOnPlanAccept: true` and `defaultMode: "acceptEdits"`. Now enter plan mode.

## Assistant _18:33:58_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _18:34:01_

<details><summary>Tool calls</summary>

- EnterPlanMode

</details>

## Assistant _18:34:17_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/declarative-watching-spring.md`

</details>

## Assistant _18:34:20_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/.claude/plans/declarative-watching-spring.md`

</details>

## Assistant _18:34:26_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/declarative-watching-spring.md`

</details>

## Assistant _18:34:30_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## User _18:34:44_

[Request interrupted by user for tool use]
