---
name: ship-then-plan
description: Ship the current work, update the repo's task-tracking files, write a self-contained next-step plan into tasks/todo.md, and end with a concise handoff for the next implementation session.
---

# Ship Then Plan

Use this skill when the user wants to finish the current slice of work, push it, and leave behind a precise next-step handoff.

## Workflow

1. Check whether there is anything to ship:
   - Inspect `git status` and `git diff --stat`
   - If the tree is clean and there are no unpushed commits, skip shipping and move to next-step planning
2. If there are changes to ship:
   - Read `CLAUDE.md` if it exists and is being used for project conventions
   - Update `tasks/todo.md`
   - Commit and push using the `commit-and-push-by-feature` workflow
3. Plan the next step:
   - Read `tasks/todo.md` to identify the next incomplete step
   - If the current phase is done, automatically move to the first step of the next incomplete phase
   - Only report `all done` when no remaining phase or step exists
4. Write a self-contained next-step handoff into `tasks/todo.md` that includes:
   - What needs to change
   - Full file paths expected to be touched
   - Key technical decisions or risks
   - Relevant current-session context
   - Tests to write first, if the next step is tests-first
   - Acceptance criteria
5. Report briefly:
   - What was shipped, if anything
   - What the next step is

## Translation Note

Some source versions of this workflow refer to an explicit "enter plan mode" tool. In Codex, preserve the intent by ending with a concise, decision-complete handoff for the next session rather than referencing a nonexistent tool.

## Constraints

- Do not write plans into `CLAUDE.md`.
- Do not amend or rewrite history.
- Do not commit secrets.
