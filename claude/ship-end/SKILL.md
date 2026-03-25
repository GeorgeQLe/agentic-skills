---
name: ship-end
description: Wrap up the current session — update docs, commit, and push
argument-hint: [--sync-kanban]
---

Wrap up the current session: mark progress, commit, and push.

Process:

**Kanban sync (optional):** If `$ARGUMENTS` contains `--sync-kanban`, run `/sync-roadmap-kanban` first. If it reports discrepancies, show them but continue with the main process.

1) Run `git status` and `git diff` to see all changes.
   - If the working tree is clean and no unpushed commits: report "nothing to ship" and stop.
2) Update `tasks/todo.md` — mark completed items as done, note any outstanding items or blockers. Also update milestone progress in `tasks/roadmap.md` if criteria were met.
3) Update `tasks/history.md` — append a brief record of what was accomplished this session (phase/step completed, key changes). Create it if it doesn't exist.
4) Deploy:
   a) Find the deploy method by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   b) Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   c) If no deploy method is found, ask the user how deployment works. Do not guess or skip.
   d) Run the deploy and verify the output for errors.
   e) If the deploy fails, report the error. Do not retry automatically.
5) Commit and push using the /commit-and-push-by-feature workflow:
   - Group changes into logical feature/function buckets.
   - Use conventional commit messages.
   - Push to the current branch.
6) Output a brief session summary:
   - What was accomplished
   - Deploy status (if deployed)
   - Test status — **explicitly state whether any failing tests are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)**
   - What's outstanding
   - Branch and commit list
   - Confirm working tree is clean

Constraints:
- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message (e.g., `fix: resolve unused import warning in auth.ts`).
- Do NOT modify CLAUDE.md. CLAUDE.md is for project conventions and config only — not progress tracking.
- Progress and active work go in `tasks/todo.md`. Completed work history goes in `tasks/history.md`.
- Do not switch branches or create new branches unless the current state requires it.
- Do not amend or rewrite history.
- Do not commit secrets.
- If pre-commit hooks fail, fix and retry.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.
