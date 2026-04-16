---
name: roadmap-kanban
description: PoketoWork kanban variant of roadmap — sync roadmap phases and current steps to cards
type: planning
version: 1.0.0
argument-hint: "[--existing] [path-to-spec]"
allowed-tools: Bash(poketo *)
---

# Roadmap Kanban

Invoke as `$roadmap-kanban`.

Use this skill only in projects that have opted into a PoketoWork kanban pack.

## Process

1. Follow the base `$roadmap` workflow exactly, passing through `$ARGUMENTS`.
2. Resolve and validate the project board using `tasks/.kanban-board`, `poketo kanban boards`, and the standard lists: Backlog, Todo, In Progress, Done, Punt.
3. Fetch the board and show a brief overview before roadmap work.
4. After the base roadmap writes or updates `tasks/roadmap.md` and `tasks/todo.md`, sync cards:
   - For each unchecked current step in `tasks/todo.md`, search for a matching card. Move it from Backlog to Todo, leave it alone if already Todo or later, or create it in Todo with phase context.
   - For each future roadmap phase, search for a matching phase card. Create a Backlog summary card when missing.
5. Report cards created, moved, skipped, and any failures.

Only move cards from Backlog to Todo. Never move cards backward. If kanban fails, warn and keep the roadmap output.
