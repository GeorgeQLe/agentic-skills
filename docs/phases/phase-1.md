# Phase 1 (Original): Kanban-Roadmap Sync — Superseded

Original Phase 1 focused on embedding kanban operations into existing workflow skills. This approach was reverted — workflow skills should remain kanban-free. Instead, a separate suite of `-kanban` skills was designed.

## What survived from original Phase 1
- `/sync-roadmap-kanban` skill (Claude + Codex) — standalone reconciliation
- Board auto-detection via `tasks/.kanban-board`

## What was reverted
- `--sync-kanban` flag on all run/ship variants
- Session activity cards in run variants
- Conflict detection in run variants
- Session card cleanup in ship-end

## Why
Kanban operations should be in separate skills so the base workflow skills stay simple and testable. Users opt into kanban by using `/run-kanban` instead of `/run`.
