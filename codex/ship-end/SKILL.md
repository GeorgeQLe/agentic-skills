---
name: ship-end
description: "Wrap up the current session — update docs, commit, and push"
argument-hint: "[--no-deploy] [--kanban]"
---

# Ship End

Use this skill when the user wants the current session wrapped up cleanly.

## Workflow

1. Inspect `git status` and diffs.
2. If the tree is clean and there are no unpushed commits, report that there is nothing to ship and stop.
3. Update `tasks/todo.md` with completed items and blockers. Also update milestone progress in `tasks/roadmap.md` if criteria were met.
3b. Check `tasks/manual-todo.md` (if it exists) — note the status of manual tasks (checked vs unchecked). Do NOT modify checked items.
4. Update `tasks/history.md` with a brief record of the session. Create it if needed.
5. Deploy (skip if `--no-deploy`):
   - Check for an explicit manual deploy contract in `deploy.md` or `tasks/deploy.md`.
   - If neither file exists, skip deploy and report `Deploy skipped: no explicit manual deploy contract (deploy.md or tasks/deploy.md)`.
   - If a deploy contract exists, read it first and use it to determine the deploy method.
   - Supplement the contract by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   - If a deploy contract exists but no deploy method is found, ask the user how deployment works. Do not guess.
   - Run the deploy and verify the output for errors.
   - If the deploy fails, report the error. Do not retry automatically.
6. Commit and push using the `commit-and-push-by-feature` workflow.
7. Report:
   - What was accomplished
   - Test status — explicitly state whether any failing tests are expected (red phase: tests before implementation) or unexpected (regressions/bugs)
   - Manual tasks — X/Y complete (from `tasks/manual-todo.md`, if it exists)
   - What is still outstanding
   - Branch name
   - Commit list
   - Final working-tree state

## Constraints

- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message (e.g., `fix: resolve unused import warning in auth.ts`).
- Do not modify `CLAUDE.md` as part of progress tracking.
- Do not switch or create branches unless the current state requires it.
- Do not amend or rewrite history.
- Stop and report if secrets are detected.
- **Do not push to an existing feature branch.** If already on a feature branch, commit locally only. The `commit-and-push-by-feature` workflow enforces this — do not bypass it.
- `ship-end` only runs a deploy when `deploy.md` or `tasks/deploy.md` explicitly documents a manual deployment workflow. Repos without one are assumed to auto-deploy or require no manual deploy step.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.

## Kanban Mode (`--kanban`)

When `$ARGUMENTS` contains `--kanban`, move the session's kanban card to Done after committing.

### Kanban Setup

1. Resolve the board: check `tasks/.kanban-board` for stored ID, validate via `poketo kanban board <id>`. If missing, match board names against `basename $(pwd)`. If no match, ask the user.
2. Validate all 5 lists exist (Backlog, Todo, In Progress, Done, Punt). Create missing ones via `poketo kanban create-list`.
3. If the poketo CLI is missing or the gateway is unreachable, warn and continue without kanban.

All kanban commands use: `poketo kanban <command>`

### Move Session Card to Done

1. Get hostname (`hostname -s | lowercase`), fetch board state.
2. Find In Progress card matching `[this-hostname]` in description or current step name.
3. If found → move to Done + `done --id` + update description with commit SHAs.
4. If not found → skip silently.

### Next Work Suggestion

Suggest the top Todo card by priority (overdue > starred > list order). If no Todo cards, check Backlog. If nothing: "Board is clear."

Kanban operations are additive — if any kanban command fails, warn and continue. Core workflow must succeed.
