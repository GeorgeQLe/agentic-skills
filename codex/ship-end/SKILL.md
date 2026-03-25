---
name: ship-end
description: Wrap up the current working session by updating task-tracking docs, committing and pushing changes, and reporting what was accomplished and what remains.
---

# Ship End

Use this skill when the user wants the current session wrapped up cleanly.

## Workflow

0. If `--sync-kanban` flag is present, run the sync-roadmap-kanban skill first. Show discrepancies but continue.

1. Inspect `git status` and diffs.
2. If the tree is clean and there are no unpushed commits, report that there is nothing to ship and stop.
3. Update `tasks/todo.md` with completed items and blockers. Also update milestone progress in `tasks/roadmap.md` if criteria were met.
4. Update `tasks/history.md` with a brief record of the session. Create it if needed.
5. Deploy:
   - Find the deploy method by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   - If no deploy method is found, ask the user how deployment works. Do not guess or skip.
   - Run the deploy and verify the output for errors.
   - If the deploy fails, report the error. Do not retry automatically.
6. Commit and push using the `commit-and-push-by-feature` workflow.
7. **Session card cleanup:** If `tasks/.kanban-board` exists, get `hostname`, search the board for a card starting with `[hostname]`, move it to "Done", and update description with commit SHAs from this session.
8. Report:
   - What was accomplished
   - Test status — explicitly state whether any failing tests are expected (red phase: tests before implementation) or unexpected (regressions/bugs)
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
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.
