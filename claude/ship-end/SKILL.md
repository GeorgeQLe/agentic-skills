---
name: ship-end
description: Wrap up the current session — update docs, commit, and push
---

Wrap up the current session: mark progress, commit, and push.

Process:
1) Run `git status` and `git diff` to see all changes.
   - If the working tree is clean and no unpushed commits: report "nothing to ship" and stop.
2) Update `tasks/todo.md` — mark completed items as done, note any outstanding items or blockers.
3) Update `tasks/history.md` — append a brief record of what was accomplished this session (phase/step completed, key changes). Create it if it doesn't exist.
4) If there's a phased plan in `docs/`, check off completed steps/milestones there too.
5) Commit and push using the /commit-and-push-by-feature workflow:
   - Group changes into logical feature/function buckets.
   - Use conventional commit messages.
   - Push to the current branch.
6) Output a brief session summary:
   - What was accomplished
   - What's outstanding
   - Branch and commit list
   - Confirm working tree is clean

Constraints:
- Do NOT modify CLAUDE.md. CLAUDE.md is for project conventions and config only — not progress tracking.
- Progress and active work go in `tasks/todo.md`. Completed work history goes in `tasks/history.md`.
- Do not switch branches or create new branches unless the current state requires it.
- Do not amend or rewrite history.
- Do not commit secrets.
- If pre-commit hooks fail, fix and retry.
