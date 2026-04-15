---
name: ship
description: Ship current work (update docs, commit, push, deploy) and optionally plan the next step
type: shipping
version: 1.0.0
argument-hint: "[--no-plan] [--no-deploy]"
---

# Ship

Ship current work, commit, push, deploy, and plan the next step. If `$ARGUMENTS` contains `--no-plan`, skip planning. If `$ARGUMENTS` contains `--no-deploy`, skip deployment.

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
After shipping, deploy the project using the project's own deployment mechanism.

a) **Find the deploy method.** Check these locations in order:
   - `spec.md` — look for a deployment section
   - `CLAUDE.md` — look for deploy commands or instructions
   - `tasks/roadmap.md` — look for deploy instructions
   - `tasks/todo.md` — look for deploy instructions
   - `Makefile` / `Justfile` — look for deploy targets (e.g., `make deploy`, `just deploy`)
   - `package.json` — look for deploy scripts (e.g., `npm run deploy`)
   - `deploy/`, `infra/`, `scripts/` — look for deploy shell scripts
   - `docker-compose*.yml` — container-based deploys
   - **Do NOT look in `.github/workflows/`** — this project does not use GitHub Actions.
   - If no deploy method is found, **ask the user** how deployment works for this project. Do not guess or skip.

b) **Run the deploy** using the discovered mechanism.

c) **Verify the deploy:**
   - Check output for errors.
   - If there's a health check URL or status command in the project config, run it.
   - Report success or failure.

d) If the deploy fails, report the error clearly. Do not retry automatically.

### 4. Plan the next step (skip if `--no-plan`)

**Prerequisite:** If neither `tasks/todo.md` nor `tasks/roadmap.md` exists, or if no uncompleted steps remain, there is no plan to continue. Run `/roadmap` to scan task pipeline health and recommend the next context-aware action (stale todo, missing steps, etc.). Then stop (do not enter plan mode).

a) **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
b) Read `tasks/todo.md` to identify the next uncompleted step in the current phase.
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
     5. **Just-in-time planning:** **You MUST invoke `/plan-phases` for the new phase** — do NOT tell the user the phase is "deferred" or ask them to run `/plan-phases` manually. A phase without implementation steps is NOT deferred; it simply hasn't been decomposed yet (only items under the `## Deferred / Future Work` heading in the roadmap are actually deferred). This auto-invocation generates implementation steps and file-level detail using the full context of what was learned during prior phases. The roadmap only stores strategic outlines — implementation detail is generated when a phase is started, not upfront.
   - If **NO:** find the next uncompleted step within the current phase.
d) Write a **self-contained** implementation plan for the next step into `tasks/todo.md`. This plan must be complete enough that a fresh context can execute it by reading only CLAUDE.md and `tasks/todo.md`. Include:
   - What needs to be built/changed
   - Which files will be affected (full paths)
   - Key technical decisions or risks
   - Relevant context from the current session (gotchas, patterns established, conventions used)
   - If test strategy is `tdd`: which tests to write first and what they should assert
   - If test strategy is `tests-after`: note that tests will be written in the Green step
   - Acceptance criteria: how to verify the step is done
e) Ship `tasks/todo.md`, `tasks/roadmap.md`, `tasks/manual-todo.md` (if it exists), and `tasks/phases/` (if created) via `/commit-and-push-by-feature`, landing them on `main` or `master`.

### 5. Output a brief summary (2-3 lines max to save context)
- What was shipped (if anything)
- Deploy status (if deployed)
- Test status — **explicitly state whether any failing tests are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)**
- Manual tasks — pending count from `tasks/manual-todo.md` (if it exists), note any that block upcoming steps
- What the next step is (1 sentence) — or "session wrapped up" if `--no-plan`

### 6. Enter plan mode (skip if `--no-plan`)
**Before entering plan mode**, read `.claude/settings.local.json` and ensure `"showClearContextOnPlanAccept": true` is set. If the file doesn't exist, create it with `{ "showClearContextOnPlanAccept": true }`. If it exists but lacks the key, add it (preserve existing settings).

**YOU MUST call the EnterPlanMode tool.** This is not optional. This gives the user the option to "clear context and implement" — which starts a fresh context that reads `tasks/todo.md` and implements the plan.

### 7. Present the plan (skip if `--no-plan`)
After entering plan mode, **present the execution plan** to the user. Summarize the plan that was written to `tasks/todo.md` in step 4d:
- What needs to be built/changed
- Which files will be created or modified (full paths)
- The approach (e.g., test strategy, key technical decisions)
- Any decisions or trade-offs the user should weigh in on

This gives the user something concrete to review before selecting "clear context and implement".

## Constraints
- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message (e.g., `fix: resolve unused import warning in auth.ts`).
- Do NOT write plans into CLAUDE.md. CLAUDE.md is for project conventions and config only.
- `tasks/roadmap.md` is the source of truth for the full phased plan. `tasks/todo.md` holds only the current phase.
- Do NOT create `tasks/todo.md` from scratch — if it doesn't exist and there's no roadmap, suggest discovery skills instead.
- Do NOT re-read files you've already read this session. Use what's in context.
- Do NOT explore the codebase extensively for planning. Keep context footprint minimal.
- If the tree is clean and the next step plan already exists in `tasks/todo.md`, skip straight to step 6.
- Do not amend or rewrite history.
- Do not commit secrets.
- Do not push shipping commits to an existing feature branch. Use `/commit-and-push-by-feature` to move the work onto `main` or `master` and push it there, or stop and report a blocker if that cannot be done safely.
- The plan must be actionable, not vague. Include specific file paths and technical details.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.
- Do not modify code as part of the deploy process.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
