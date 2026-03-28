# Phase 8: Kanban DX

**Goal:** Improve kanban CLI ergonomics — scoped search, safer testing, and consistent env resolution.

## Steps

- [x] **`--board` flag for search** — add `--board <id>` flag to kanban search command, scoping results to specified board(s); repeatable flag, error on invalid ID (spec: `specs/board-flag-kanban-search.md`)
- [ ] **Dry-run mode** — add `--dry-run` flag to kanban skills that shows intended card operations without executing DB writes
- [ ] **Env path unification** — extract shared env file search paths from bootstrap-session.mjs and kanban.mjs into a single module

## Acceptance Criteria
- [x] `search --board <id>` scopes results to specified board(s); repeatable flag works
- [x] Invalid `--board` ID exits with error (not silent empty results)
- [ ] `--dry-run` flag on kanban skills shows intended card operations without DB writes
- [ ] bootstrap-session.mjs and kanban.mjs share a single env path list
- [x] Existing tests still pass; new tests for --board flag (79 total: 77 existing + 2 new)

## Next Step Plan: Dry-run mode

### Context

`kanban.mjs` has 8 command functions that perform DB writes (create-card, update-card, done, move-card, create-board, create-list, archive-card, delete-board). Adding `--dry-run` to these commands lets users preview intended operations without executing them — useful for testing skill scripts and debugging.

### Changes

#### 1. Add `hasBoolFlag` utility in `kanban.mjs` (~line 630, after `getAllArgs`)

```javascript
function hasBoolFlag(args, flag) {
  return args.includes(flag);
}
```

#### 2. Thread `--dry-run` through write commands

For each of the 8 write commands, check `hasBoolFlag(args, "--dry-run")` before DB writes. When dry-run is active, output the planned operation as JSON with `{ dryRun: true, command: "...", wouldDo: { ... } }` instead of executing. Pattern:

```javascript
// Example for cmdCreateCard:
if (hasBoolFlag(args, "--dry-run")) {
  output({ dryRun: true, command: "create-card", wouldDo: { boardId, listId, name, description, dueDate } });
  return;
}
// ...existing db.insert(cards)...
```

Apply similarly to: `cmdUpdateCard`, `cmdDone`, `cmdMoveCard`, `cmdCreateBoard`, `cmdCreateList`, `cmdArchiveCard`, `cmdDeleteBoard`. For multi-step commands (archive-card, create-board), show all planned operations.

#### 3. Update help text

Change the help output to mention `[--dry-run]` on write commands.

#### 4. Add tests in `kanban.test.mjs`

Add a new `describe("Dry-run mode")` block with:
1. **create-card --dry-run** — verify output has `dryRun: true` and card is NOT created
2. **move-card --dry-run** — verify card stays in original list
3. **delete-board --dry-run --confirm** — verify board still exists after

### Files

- `claude/poketo-kanban/scripts/kanban.mjs` — add `hasBoolFlag`, modify 8 command functions, update help
- `claude/poketo-kanban/scripts/kanban.test.mjs` — add 3 new dry-run tests

### Verification

```bash
cd claude/poketo-kanban/scripts && npx vitest run --testTimeout=30000
```
- New dry-run tests pass (output has `dryRun: true`, no DB side effects)
- All 79 existing tests still pass

## On Completion (fill in when phase is done)
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:
