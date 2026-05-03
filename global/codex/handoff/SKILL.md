---
name: handoff
description: Generate a project-level context snapshot for resuming work in a fresh session
type: shipping
version: 1.0.0
---

# Handoff

Invoke as `$handoff`.

Use this skill when the user is ending a session and wants to capture context for a future session to pick up from.

## Workflow

1. Read tasks/todo.md for current phase detail, tasks/roadmap.md for overall progress, tasks/manual-todo.md (if it exists) for pending manual tasks, tasks/record-todo.md and tasks/recurring-todo.md (if they exist) for advisory task counts, CLAUDE.md, git status, and recent git log.
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
- Pending advisory tasks (counts from `tasks/record-todo.md` and `tasks/recurring-todo.md`, noting that they are not execution blockers unless promoted)
- Exact next steps and key files for context

## Constraints

- The handoff must be self-contained — readable without other context.
- Keep it under 100 lines.
- Do not commit the handoff automatically.
- Warn if there are uncommitted changes.
- `$handoff` writes a prose handoff document only; it does not produce `.agents/approved-plan.json` or `tasks/approved-plan.md`. Approval packets are produced by Claude-side `/handoff --target=codex`. In `codex-only` mode, cross-session resume is prose-only — for packet-gated resume, run a one-shot Claude `/handoff --target=codex` and consume with `$run --execute-approved`.


## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
