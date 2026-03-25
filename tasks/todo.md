# Phase 2: Cross-Device Agent Awareness

**Goal:** Agents on different devices see each other's in-progress work and avoid conflicts.

## Steps

- [x] **Session activity cards**
- [ ] **Conflict detection**
- [ ] **Device tagging on cards**

## Milestone
- [ ] Two agents on different machines can see each other's active work on the kanban board

---

## Next Step Plan: Conflict detection

### What
Before starting work, check the kanban board for in-progress cards from other devices that overlap with the current task's scope. Warn the user if another session is working on the same files/features.

### Files to modify
- **`claude/run/SKILL.md`** — Add conflict check after session card creation, before migration check
- **`claude/run-step/SKILL.md`** — Same
- **`claude/run-phases/SKILL.md`** — Same
- **`codex/run/SKILL.md`** — Same
- **`codex/run-step/SKILL.md`** — Same
- **`codex/run-phases/SKILL.md`** — Same

### Approach
1. After the session card step in each `/run` variant, add a conflict detection step:
   - Read the board and find all cards in the "In Progress" list
   - Filter to cards whose name starts with `[hostname]` where hostname is NOT the current device
   - For each other-device card, check if the card's description references the same branch or the same step/phase as the current task
   - If overlap is found, **warn the user** with details: which device, what branch, what task
   - Do NOT block — just warn. The user decides whether to proceed.
2. The check is lightweight: it reuses the board state already fetched in the session card step

### Key context
- Session cards use format `[hostname] step-name` with description `Branch: branch-name\nStarted: YYYY-MM-DD HH:MM`
- The board is already fetched during the session card step — reuse that data
- poketo-kanban `board <id>` returns all lists and cards, so we can filter in-progress cards
- The `search` command can also be used: `search --query "In Progress"`
- This is a warning-only feature — never block the user from working

### Acceptance criteria
- Running `/run` on a project where another device has an in-progress card on the same branch/step shows a warning
- Cards from the current device are ignored (only other devices trigger warnings)
- If no conflicts, the process continues silently
- Both Claude and Codex skills are updated
