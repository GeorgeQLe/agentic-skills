---
name: ship-end-kanban
description: PoketoWork kanban variant of ship-end — close the active session card after wrapping up
type: shipping
version: 1.0.0
argument-hint: "[--no-deploy]"
allowed-tools: Bash(poketo *)
---

# Ship End Kanban

Use this skill only in projects that have opted into a PoketoWork kanban pack.

## Process

1. Follow the base `/ship-end` workflow exactly, passing through `$ARGUMENTS`.
2. Resolve and validate the project board using `tasks/.kanban-board`, `poketo kanban boards`, and the standard lists: Backlog, Todo, In Progress, Done, Punt.
3. Fetch the board state and find the In Progress session card matching this host or the current step.
4. If found, move it to Done, mark it done, and update the description with commit SHAs and session wrap-up notes.
5. If no matching session card is found, skip card movement and report that no active card was found.
6. Suggest the top Todo card by priority: overdue, starred, then list order. If no Todo cards exist, check Backlog.

Kanban failures are advisory and must not block the base ship-end workflow.

## Alignment Page

When this skill writes or updates durable planning, research, spec, task, prototype, report, or document deliverables, also build a custom HTML alignment page at `alignment/ship-end-kanban-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/ship-end-kanban-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.
