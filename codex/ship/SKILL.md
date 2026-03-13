---
name: ship
description: Ship current work (update docs, commit, push) and optionally plan the next step.
---

# Ship

Ship current work, commit, push, and plan the next step.

## Workflow

1. Check if there is anything to ship:
   - Run `git status` and `git diff --stat`.
   - If the working tree is clean and there are no unpushed commits, skip to step 3.
   - If there are changes, continue to step 2.
2. Ship the work:
   - Read `CLAUDE.md` to understand current progress.
   - Update `tasks/todo.md` — mark completed items as done.
   - Update `tasks/history.md` — append a brief record of what was accomplished. Create it if needed.
   - Commit and push using the commit-and-push-by-feature workflow.
3. Plan the next step:
   - Read `tasks/todo.md` to identify the next uncompleted step.
   - If the current phase has no more incomplete steps, check for the next phase.
   - Only report "all done" if there are truly no more phases or steps remaining.
4. Write a self-contained implementation plan for the next step into `tasks/todo.md`, complete enough for a fresh session to execute from `tasks/todo.md` alone.
5. Commit and push the updated `tasks/todo.md`.
6. Output a brief summary:
   - What was shipped (if anything)
   - What the next step is

## Constraints

- Do not write plans into `CLAUDE.md`. It is for project conventions only.
- `tasks/todo.md` is the single source of truth for the plan and active work.
- Create `tasks/todo.md` if it does not exist.
- Do not amend or rewrite history.
- Do not commit secrets.
- The plan must be actionable with specific file paths and technical details.
