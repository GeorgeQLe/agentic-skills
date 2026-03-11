---
name: ship-end
description: Wrap up the current working session by updating task-tracking docs, committing and pushing changes, and reporting what was accomplished and what remains.
---

# Ship End

Use this skill when the user wants the current session wrapped up cleanly.

## Workflow

1. Inspect `git status` and diffs.
2. If the tree is clean and there are no unpushed commits, report that there is nothing to ship and stop.
3. Update `tasks/todo.md` with completed items and blockers.
4. Update `tasks/history.md` with a brief record of the session. Create it if needed.
5. If there is a phased plan under `docs/`, check off completed steps or milestones there too.
6. Commit and push using the `commit-and-push-by-feature` workflow.
7. Report:
   - What was accomplished
   - What is still outstanding
   - Branch name
   - Commit list
   - Final working-tree state

## Constraints

- Do not modify `AGENTS.md` as part of progress tracking.
- Do not switch or create branches unless the current state requires it.
- Do not amend or rewrite history.
- Stop and report if secrets are detected.
