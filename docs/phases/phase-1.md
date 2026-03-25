# Phase 1: Kanban-Roadmap Sync (Completed)

**Goal:** Keep kanban boards, roadmap docs, and codebase state in agreement automatically.

## Steps

- [x] **Create `/sync-roadmap-kanban` skill (Claude + Codex)**
- [x] **Board-project auto-detection**
- [x] **Add sync-roadmap-kanban trigger to workflow skills**

## Milestone
- [x] Agent runs `/sync-roadmap-kanban` → kanban and roadmap reflect the same state, grounded in what the code actually shows

## On Completion

Delivered:
- `/sync-roadmap-kanban` skill (Claude + Codex) — 7-step reconciliation process with 5 rules
- Board auto-detection via name matching, persisted in `tasks/.kanban-board`
- `--sync-kanban` opt-in flag on all 6 workflow skills (run, run-step, run-phases, ship, ship-end, ship-then-plan) × 2 platforms
