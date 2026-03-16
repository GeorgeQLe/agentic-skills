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
3. Deploy:
   - Find the deploy method by checking: `spec.md`, `CLAUDE.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/` — this project does not use GitHub Actions.
   - If no deploy method is found, ask the user how deployment works. Do not guess or skip.
   - Run the deploy and verify the output for errors.
   - If the deploy fails, report the error. Do not retry automatically.
4. Plan the next step:
   - Read `tasks/todo.md` to identify the next incomplete step
   - If the current phase is done, automatically move to the first step of the next incomplete phase
   - Only report `all done` when no remaining phase or step exists
5. Write a self-contained next-step handoff into `tasks/todo.md` that includes:
   - What needs to change
   - Full file paths expected to be touched
   - Key technical decisions or risks
   - Relevant current-session context
   - Tests to write first, if the next step is tests-first
   - Acceptance criteria
6. Report briefly:
   - What was shipped, if anything
   - Deploy status (if deployed)
   - What the next step is

## Translation Note

Some source versions of this workflow refer to an explicit "enter plan mode" tool. In Codex, preserve the intent by ending with a concise, decision-complete handoff for the next session rather than referencing a nonexistent tool.

## Constraints

- Do not write plans into `CLAUDE.md`.
- Do not amend or rewrite history.
- Do not commit secrets.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.
