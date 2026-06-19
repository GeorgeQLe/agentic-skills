---
name: handoff
description: Generate a project-level context snapshot for resuming work in a fresh session
type: shipping
version: v0.2
required_conventions: [alignment-page]
---

# Handoff

Invoke as `$handoff`.

Use this skill when the user is ending a session and wants to capture context for a future session to pick up from.

## Process

1. Read tasks/todo.md for current phase detail, tasks/roadmap.md for overall progress, tasks/manual-todo.md (if it exists) for pending manual tasks, tasks/record-todo.md and tasks/recurring-todo.md (if they exist) for advisory task counts, CLAUDE.md, git status, and recent git log.
2. Identify work in progress, technical decisions, and loose ends.
3. Write a self-contained handoff document to tasks/handoff.md.
4. Report the project state and whether there are uncommitted changes.

## Output

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
- `$handoff` writes a prose handoff document only; it does not produce `.agents/approved-plan.json` or `tasks/approved-plan.md`. Approval packets are produced by Claude-side `/handoff --target=codex`. In `codex-only` mode, cross-session resume is prose-only — for packet-gated resume, run a one-shot Claude `/handoff --target=codex` and consume with `$exec --execute-approved`.


## Alignment Page

By default, this skill reports results inline and writes only its normal durable artifacts (for example `tasks/*.md`, reports, queues, benchmark notes, status docs, or other skill-specific files). Do not build an alignment page automatically. Create `alignment/handoff-{topic}.html` only when the user explicitly requests an alignment page or when you explicitly identify a concrete clarification/review need that cannot be handled cleanly inline; when you create one, follow `ALIGNMENT-PAGE.md` in this skill's directory.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
