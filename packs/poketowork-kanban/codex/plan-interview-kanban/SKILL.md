---
name: plan-interview-kanban
description: PoketoWork kanban variant of plan-interview — write a spec and update or create the matching card
type: planning
version: 1.0.0
argument-hint: "[topic or draft spec]"
allowed-tools: Bash(poketo *)
---

# Plan Interview Kanban

Use this skill only in projects that have opted into a PoketoWork kanban pack.

## Process

1. Follow the base `$plan-interview` workflow exactly, passing through `$ARGUMENTS` as the topic, draft, or spec path.
2. Resolve and validate the project board:
   - Check `tasks/.kanban-board`, then validate with `poketo kanban board <id>`.
   - If missing or stale, match `poketo kanban boards` against `basename $(pwd)`.
   - If no board is clear, ask the user. If no boards exist, offer `poketo kanban create-board --name "$(basename $(pwd))" --template standard`.
   - Ensure Backlog, Todo, In Progress, Done, and Punt lists exist.
3. Fetch the board and show a brief overview before the interview.
4. After the base interview writes the spec and interview log:
   - Extract two or three distinctive keywords from the topic or spec title.
   - Search all lists for matching cards.
   - If one card matches, update that card description with the spec summary and file path. Do not move it.
   - If multiple cards match, ask the user which card to update.
   - If no card matches, create a Backlog card with the spec summary and file path.
5. Report the card updated or created.

Never move cards backward from Done or Punt. If kanban fails, warn and keep the completed spec as the source of truth.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.
