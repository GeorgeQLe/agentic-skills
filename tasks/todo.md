# Phase 1: Kanban-Roadmap Sync

**Goal:** Keep kanban boards, roadmap docs, and codebase state in agreement automatically.

## Steps

- [x] **Create `/sync-roadmap-kanban` skill (Claude + Codex)** — standalone skill created
- [x] **Board-project auto-detection** — added to sync-roadmap-kanban skill
- [ ] **Add sync-roadmap-kanban trigger to workflow skills** — reverted; kanban integration should be tested standalone first before embedding in run/ship skills

## Milestone
- [ ] Agent runs `/sync-roadmap-kanban` → kanban and roadmap reflect the same state, grounded in what the code actually shows

## Status

Kanban operations were embedded into run/ship/ship-end skills (session cards, conflict detection, --sync-kanban flag) but reverted to keep those skills kanban-free until the standalone `/sync-roadmap-kanban` skill is tested and debugged. The standalone skill and board auto-detection remain in place.
