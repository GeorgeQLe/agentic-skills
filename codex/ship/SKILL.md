---
name: ship
description: "Ship already-finished work, optionally deploy it, and prepare the next step"
argument-hint: "[--no-plan] [--no-deploy] [--kanban]"
---

# Ship

Ship already-finished work, commit it, optionally deploy it, and plan the next step. In Codex, `$run` usually handles execution plus shipping; use `$ship` when finished work is already present in the tree or there are unpushed commits to package. If `$ARGUMENTS` contains `--no-plan`, skip planning. If `$ARGUMENTS` contains `--no-deploy`, skip deployment.

## Workflow

1. Check if there is anything to ship:
   - Run `git status` and `git diff --stat`.
   - If the working tree is clean and there are no unpushed commits, skip to step 3.
   - If there are changes, continue to step 2.
1b. **Pre-ship validation:**
   - First check conversation context for lint/typecheck/test/build output already produced this session (e.g., from a TDD run step). Do NOT re-run commands whose results are already available.
   - For any validation category not already run, find commands from: `CLAUDE.md`, `Makefile`/`Justfile` (check/lint/typecheck/test/build targets), `package.json` (lint/typecheck/check/test/build scripts), `pyproject.toml`/`setup.cfg`, `Cargo.toml`. If none found and no prior output exists, skip.
   - Inspect validation output even when commands exit zero. If warnings are emitted, either fix them, record them as explicitly accepted with rationale, or report them clearly as unresolved.
   - If errors are found (from prior output or fresh runs), fix them and re-run only the failing commands to confirm. Include fixes in the step's commit (or as a separate commit if unrelated).
   - If errors can't be auto-fixed, **STOP. Do not ship.** Report the errors to the user and ask how to proceed. Never commit or push code with known build/lint/type/test failures.
2. Ship the work:
   - Read `CLAUDE.md` to understand current progress.
   - Update `tasks/todo.md` — mark completed items as done.
   - Update `tasks/history.md` — append a brief record of what was accomplished. Create it if needed.
   - Commit and push using the `$commit-and-push-by-feature` workflow. That workflow must land the resulting commits on `main` or `master`, not on an existing feature branch.
3. Deploy (skip if `--no-deploy`):
   - Check for an explicit manual deploy contract in `deploy.md` or `tasks/deploy.md`.
   - If neither file exists, skip deploy and report `Deploy skipped: no explicit manual deploy contract (deploy.md or tasks/deploy.md)`.
   - If a deploy contract exists, read it first and use it to determine the deploy method.
   - Supplement the contract by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   - If a deploy contract exists but no deploy method is found, ask the user how deployment works. Do not guess.
   - Run the deploy and verify the output for errors.
   - If a health check URL or status command exists, run it.
   - If the deploy fails, report the error. Do not retry automatically.
4. Plan the next step:
   - **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
   - Read `tasks/todo.md` to identify the next uncompleted step in the current phase.
   - **Check if the current phase is complete** (all steps checked, milestone criteria met):
     - If **YES — Phase transition:**
       1. Archive the completed phase: copy `tasks/todo.md` → `tasks/phases/phase-N.md` (create `tasks/phases/` if needed). Fill in the "On Completion" section.
       1b. If `tasks/manual-todo.md` exists, inspect unchecked items before advancing phases:
           - If any unchecked `_(blocks: Step N.X)_` items still apply to the completed phase, stop. Do NOT archive the manual task file, mark the phase complete, or advance to the next phase unless the user explicitly overrides the blocker.
           - Unchecked `_(after: Step N.X)_` items are non-blocking follow-up tasks. Archive them with the phase and warn the user that they remain incomplete.
       2. Check off the phase milestone in `tasks/roadmap.md`.
       3. Copy the next phase from `tasks/roadmap.md` → overwrite `tasks/todo.md`.
       3b. Extract the next phase's manual tasks (from `**Manual Tasks:**` in roadmap) into a fresh `tasks/manual-todo.md`. If the next phase has no manual tasks, delete the file.
       4. If no more phases remain, run `$workflow` to recommend the next action based on project state. Then stop.
       5. **Just-in-time planning:** Invoke `$plan-phases` for the new phase. This generates implementation steps and file-level detail using the full context of what was learned during prior phases.
     - If **NO:** find the next uncompleted step within the current phase.
5. Write a self-contained implementation plan for the next step into `tasks/todo.md`, complete enough for a fresh session to execute from `tasks/todo.md` alone.
6. Ship `tasks/todo.md`, `tasks/roadmap.md`, `tasks/manual-todo.md` (if it exists), and `tasks/phases/` (if created) via `$commit-and-push-by-feature`, landing them on `main` or `master`.
7. Output a brief summary:
   - What was shipped (if anything)
   - Deploy status (if deployed)
   - Validation status — explicitly state whether any failing tests are expected (red phase: tests before implementation) or unexpected (regressions/bugs), and call out any warnings as fixed, accepted, or unresolved
   - Manual tasks — pending count from `tasks/manual-todo.md` (if it exists), note any blocking upcoming steps
   - What the next step is

## Constraints

- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message (e.g., `fix: resolve unused import warning in auth.ts`).
- Do not write plans into `CLAUDE.md`. It is for project conventions only.
- `tasks/roadmap.md` is the source of truth for the full phased plan. `tasks/todo.md` holds only the current phase.
- Create `tasks/todo.md` if it does not exist.
- Do not amend or rewrite history.
- Do not commit secrets.
- Do not push shipping commits to an existing feature branch. Use `$commit-and-push-by-feature` to move the work onto `main` or `master` and push it there, or stop and report a blocker if that cannot be done safely.
- The plan must be actionable with specific file paths and technical details.
- In Codex, `$ship` is a compatibility/manual cleanup workflow. Prefer `$run` for the normal execute-and-ship loop.
- `ship` only runs a deploy when `deploy.md` or `tasks/deploy.md` explicitly documents a manual deployment workflow. Repos without one are assumed to auto-deploy or require no manual deploy step.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.
- Do not modify code as part of the deploy process.

## Kanban Mode (`--kanban`)

When `$ARGUMENTS` contains `--kanban`, perform kanban operations during the ship workflow.

### Kanban Setup

1. Resolve the board: check `tasks/.kanban-board` for stored ID, validate via `poketo kanban board <id>`. If missing, match board names against `basename $(pwd)`. If no match, ask the user.
2. Validate all 5 lists exist (Backlog, Todo, In Progress, Done, Punt). Create missing ones via `poketo kanban create-list`.
3. If the poketo CLI is missing or the gateway is unreachable, warn and continue without kanban.

All kanban commands use: `poketo kanban <command>`

### After Shipping — Move Completed Card

1. Find the completed step's card on the board.
2. Step checked off → move to Done + `done --id`. Step has blocker/deferred → move to Punt + add reason. Unclear → ask the user. If in Plan mode, prefer `request_user_input`.
3. Update card description with commit SHAs.

### After Planning — Ensure Next Card in Todo

1. Search for next step's card.
2. If in Backlog → move to Todo. If not found → create in Todo. If already in Todo or later → skip.

### Next Work Suggestion

Suggest the top Todo card by priority (overdue > starred > list order). If no Todo cards, check Backlog. If nothing: "Board is clear."

Kanban operations are additive — if any kanban command fails, warn and continue. Core workflow must succeed.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
