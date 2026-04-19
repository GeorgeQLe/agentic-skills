---
name: handoff
description: Generate a project-level context snapshot for resuming work in a fresh session
type: shipping
version: 1.0.0
argument-hint: "[optional: specific focus area to emphasize in the handoff]"
---

# Handoff

Generate a self-contained context document that captures exactly where you left off in a project, so a fresh Claude session can pick up immediately without re-reading the entire codebase.

## Process

1. **Gather current state:**
   - Read `tasks/todo.md` for the current phase detail and active step.
   - Read `tasks/roadmap.md` for overall progress context (which phases are done, what's ahead).
   - Read `tasks/manual-todo.md` (if it exists) for pending manual tasks.
   - Read `tasks/record-todo.md` and `tasks/recurring-todo.md` (if they exist) for advisory task counts.
   - Read `CLAUDE.md` for project conventions.
   - Run `git status` and `git log --oneline -10` for recent activity.
   - Run `git diff --stat` if there are uncommitted changes.
   - Check for any blockers or notes in `tasks/todo.md`.

2. **Identify the work in progress:**
   - What phase/step was being worked on.
   - What files were being modified (from git status/diff).
   - What technical decisions were made during this session.
   - What approach was being taken and why.

3. **Check for loose ends:**
   - Uncommitted changes that need attention.
   - Failing tests.
   - TODOs or FIXMEs added during the session.
   - Blockers or open questions.

4. **If `$ARGUMENTS` specifies a focus area**, emphasize that in the handoff context.

5. **Write the handoff to `tasks/handoff.md`:**

## Handoff Document Format

```markdown
# Handoff — [Project Name] — [Date]

## Current State
- **Phase**: X — [phase name]
- **Step**: Y — [step name]
- **Status**: in-progress / blocked / ready-for-next
- **Branch**: [branch name]
- **Last commit**: [hash] [message]

## What Was Done This Session
- [Concise bullet list of completed work]

## Work In Progress
- [What's partially done, with file paths]
- [Technical decisions made and why]
- [Approach being taken]

## Uncommitted Changes
- [List of modified files and what changed, or "none"]

## Blockers / Open Questions
- [Any blockers, or "none"]

## Pending Manual Tasks
- [Unchecked items from `tasks/manual-todo.md`, or "none"]
- [Note any that block upcoming automated steps]

## Pending Advisory Tasks
- [Record/recurring task counts from `tasks/record-todo.md` and `tasks/recurring-todo.md`, or "none"]
- [Note that these are not execution blockers unless promoted to `tasks/todo.md`]

## Next Steps
- [Exactly what to do next, specific enough to execute without re-reading context]
- [Files to read first]
- [Commands to run]

## Key Files for Context
- [List of 3-5 files most relevant to the current work]
```

## Output Format

After writing the handoff, report:
- Path to the handoff document
- One-line summary of the project state
- Whether there are uncommitted changes that should be committed first

## Constraints
- The handoff must be **self-contained** — a fresh session should be able to read only this file, `tasks/todo.md`, and optionally `tasks/roadmap.md` to start working.
- Do not include full file contents — only paths and brief descriptions.
- Keep it concise — the handoff should be under 100 lines.
- Do not commit the handoff document automatically — let the user decide.
- If there are uncommitted changes, warn the user to commit or stash before switching contexts.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
