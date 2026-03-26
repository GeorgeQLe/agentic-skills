# Phase 4: Archive Automation

**Goal:** Keep boards clean by archiving old Done/Punt cards automatically.

## Steps

- [ ] **Add `archive-card` command to kanban.mjs** — moves card to the board's archive list
- [ ] **Create `/kanban-archive` skill (Claude + Codex)** — archives Done/Punt cards older than N days

### Plan: Add `archive-card` command to kanban.mjs

**What:** Add a new `archive-card` CLI command that moves a card to the board's archive list. If no archive list exists on the board, create one automatically and set `archiveListId` on the board.

**File:** `claude/poketo-kanban/scripts/kanban.mjs`

**Implementation:**

1. Add a new `cmdArchiveCard(db, args)` function:
   - Required args: `--id <card-id>`
   - Look up the card to get its `listId`
   - Look up the list to get its `boardId`
   - Look up the board to get its `archiveListId`
   - If `archiveListId` is null or the list doesn't exist:
     - Create a new list named "Archive" with `listType: "normal"` and order = max + 1
     - Update the board's `archiveListId` to the new list ID
   - Move the card to the archive list (set `listId` = archive list, `order` = next in archive, `updatedAt` = now)
   - Output: `{ command: "archive-card", card: { id, name, archivedTo: archiveListId } }`

2. Add `"archive-card"` case to the `switch` in `main()`:
   - Route to `cmdArchiveCard(db, rest)`

3. Update the help text to include:
   - `"archive-card --id <id>                    — Archive a card"`

**Key decisions:**
- The archive list is a regular list (not a special type) — it's just referenced by `archiveListId` on the board
- The board schema already has `archiveListId` (line 60) — no schema changes needed
- Auto-creating the archive list matches the roadmap spec: "If no archive list exists, create one automatically"
- The card's `done` status is NOT changed — archiving is about visibility, not completion state

**Acceptance criteria:**
- `node kanban.mjs archive-card --id <card-id>` moves the card to the archive list
- If the board has no archive list, one is created and `archiveListId` is set
- If the board already has an archive list, the card is moved there directly
- Help text shows the new command
- Existing commands are unaffected

## Milestone
- [ ] `/kanban-archive` cleans up Done/Punt cards older than 30 days with user confirmation
