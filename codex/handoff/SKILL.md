---
name: handoff
description: Generate a project-level context snapshot for resuming work in a fresh session
---

# Handoff

Use this skill when the user is ending a session and wants to capture context for a future session to pick up from.

## Workflow

1. Read tasks/todo.md for current phase detail, tasks/roadmap.md for overall progress, tasks/manual-todo.md (if it exists) for pending manual tasks, CLAUDE.md, git status, and recent git log.
2. Identify work in progress, technical decisions, and loose ends.
3. Write a self-contained handoff document to tasks/handoff.md.
4. Report the project state and whether there are uncommitted changes.

## Output Format

The handoff document includes:
- Current phase/step and status
- What was done this session
- Work in progress with file paths
- Uncommitted changes
- Blockers and open questions
- Pending manual tasks (from `tasks/manual-todo.md`, noting any that block automated steps)
- Exact next steps and key files for context

## Constraints

- The handoff must be self-contained — readable without other context.
- Keep it under 100 lines.
- Do not commit the handoff automatically.
- Warn if there are uncommitted changes.
