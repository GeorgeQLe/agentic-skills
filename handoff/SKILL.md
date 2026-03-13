---
name: handoff
description: Generate a self-contained project context snapshot to tasks/handoff.md so a fresh Claude session can resume work immediately without re-reading the codebase.
---

# Handoff

Use this skill when the user is ending a session and wants to capture context for a future session to pick up from.

## Workflow

1. Read tasks/todo.md, CLAUDE.md, git status, and recent git log.
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
- Exact next steps and key files for context

## Constraints

- The handoff must be self-contained — readable without other context.
- Keep it under 100 lines.
- Do not commit the handoff automatically.
- Warn if there are uncommitted changes.
