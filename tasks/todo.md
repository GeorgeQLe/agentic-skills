# Kanban Skill Validation

**Goal:** Manually walk through each kanban skill to verify it works correctly before adopting across active projects.

## Steps

- [x] **Manual walkthrough of kanban skills** — run each skill against this repo with a real test board

### Plan: Manual Skill Walkthrough

**What:** Run each of the 9 kanban skills in workflow order against the claude-skills repo, using a real test board on the Neon DB. Document results.

**Progress:** Skills 1-6 PASS. Skills 7-8 remaining.

**Current board state:** Backlog: 15, Todo: 2, In Progress: 0, Done: 1 (`31e37110`), Punt: 0

**Next: Skill 7 — `/sync-roadmap-kanban`**

# Layer 3 Test: `/sync-roadmap-kanban` (Skill 7/8)

## Context

Testing `/sync-roadmap-kanban` as part of Layer 3 e2e kanban skill validation. Skills 1-6 passed. The board has 1 Done card (`31e37110`), 2 Todo cards, and 15 Backlog cards. The roadmap has Phases 1-5 complete and Phases 6-9 planned.

**Board ID:** `5ab6bbdb-d06c-4e47-8a27-5e1de29b2df7`

## What to do

1. Invoke `/sync-roadmap-kanban` as a slash command
2. The skill should:
   - Resolve board from `tasks/.kanban-board` (no prompt)
   - Read kanban board state and `tasks/roadmap.md`
   - Check codebase for completed work not reflected on board
   - Reconcile: apply the 5 reconciliation rules (done-on-kanban→roadmap, done-in-roadmap→kanban, new-items→cards, orphaned-cards→flag, false-done→flag)
   - Report discrepancies and actions taken
3. Record test result in `docs/kanban-test-results.md` row #7

## Verification checklist

- [ ] Board resolved from `tasks/.kanban-board` (no prompt)
- [ ] Board state read and displayed
- [ ] Roadmap read and compared with board
- [ ] Codebase checked for reality vs board/roadmap
- [ ] Reconciliation rules applied (or no-ops reported)
- [ ] Report generated showing actions taken
- [ ] Test result recorded in docs/kanban-test-results.md row #7

## Files to modify
- `docs/kanban-test-results.md` — Layer 3 table row #7

## After skill 7, proceed to skill 8

**Skill 8 — `/kanban-archive`**: Archive Done/Punt cards. Should find the 1 Done card (`31e37110`) and prompt for confirmation before archiving.

## Milestone
- [ ] All kanban skills manually verified end-to-end and documented
