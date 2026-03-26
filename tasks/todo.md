# Phase 5: Expert Review Fixes

**Goal:** Resolve findings from `/expert-review` — credential leak, null dereference bug, stale docs, and missing codex manifest.

## Steps

- [x] **Remove leaked database credential from tracked file**
- [ ] **Fix null dereference in `cmdArchiveCard`**
- [ ] **Escape LIKE metacharacters in search**
- [ ] **Batch list creation in `cmdCreateBoard`**
- [ ] **Add missing `codex/plan-interview-ideas/agents/openai.yaml`**
- [ ] **Fix stale output paths in `docs/skills-reference.md`**
- [ ] **Add try/catch for malformed config JSON**

### Plan: Remove leaked database credential

**What:** `docs/kanban-test-results.md:39` contains the full Neon connection string with password in plain text. This file is tracked in git. Replace with env var placeholder and rotate the Neon password.

**Files to modify:**
- `docs/kanban-test-results.md` — replace connection string on line 39 with `$POKETOWORK_DATABASE_URL`

**Steps:**
1. Edit `docs/kanban-test-results.md` line 39: replace `database URL placeholder with `$POKETOWORK_DATABASE_URL`
2. Commit the fix
3. Inform user they need to rotate the Neon password (since it's in git history) — this is a manual step outside Claude's scope

**Acceptance criteria:**
- No database credentials in any tracked file (`grep -r "NEON_TOKEN_PREFIX" --include="*.md"` returns nothing)
- File still contains valid instructions for continuing testing

## Milestone
- [ ] No credentials in tracked files, Neon password rotated
- [ ] `cmdArchiveCard` handles orphaned list/board references gracefully
- [ ] All codex skills have `agents/openai.yaml`
- [ ] `docs/skills-reference.md` output paths match actual skill behavior

---

# Kanban Skill Validation (paused)

**Goal:** Manually walk through each kanban skill to verify it works correctly before adopting across active projects.

## Steps

- [ ] **Manual walkthrough of kanban skills** — run each skill against this repo with a real test board

### Plan: Manual Skill Walkthrough

**What:** Run each of the 9 kanban skills in workflow order against the claude-skills repo, using a real test board on the Neon DB. Document results.

**Prerequisites (done):**
- `~/.poketo/config.json` exists with orgId `1f09322a-4b4f-6861-bacb-a60b9bfbe6fd`
- `POKETOWORK_DATABASE_URL` available from `~/projects/apps/poke/monorepo/.env.local`
- kanban.mjs integration tests passing (24/24)

**Walkthrough order (follows real workflow):**

1. **`/poketo-kanban`** — verify Board Resolution protocol
   - Run `boards` to list existing boards
   - If a "claude-skills" board exists, use it; otherwise test `create-board --template standard`
   - Verify `tasks/.kanban-board` gets created with the board ID
   - Run `board <id>` to verify 5 lists

2. **`/brainstorm-kanban`** — verify idea cards created
   - Run the skill with a focus area (e.g., "testing")
   - Verify Backlog cards created for each idea
   - Check idempotency: run again, verify no duplicate cards

3. **`/plan-interview-kanban`** — verify card spec update
   - Pick one idea from the brainstorm output
   - Run plan-interview-kanban on it
   - Verify the matching Backlog card is updated with spec details

4. **`/roadmap-kanban`** — verify cards move to Todo
   - Run roadmap-kanban (may need a spec to build from)
   - Verify current phase steps have Todo cards

5. **`/run-kanban`** — verify Todo → In Progress + conflict detection
   - Run the skill to execute a step
   - Verify the card moves from Todo to In Progress
   - Check card description has hostname/branch/time
   - Verify progress percentage updates

6. **`/ship-kanban`** — verify In Progress → Done
   - Run after completing work
   - Verify card moves to Done with commit refs
   - Verify next step card is in Todo

7. **`/ship-end-kanban`** — verify session wrap-up
   - Run to wrap up session
   - Verify In Progress → Done with commit refs

8. **`/sync-roadmap-kanban`** — verify reconciliation
   - Run standalone reconciliation
   - Verify board state matches roadmap docs

9. **`/kanban-archive`** — verify archive old cards
   - Create test cards in Done with old dates (or use existing)
   - Run with `--days 0` to archive all Done cards
   - Verify cards moved to Archive list, confirmation prompt works

**Output:** Document results in `docs/kanban-test-results.md` with pass/fail per skill and any issues found.

**Acceptance criteria:**
- All 9 skills tested with documented results
- Any bugs found are fixed and committed
- Board state is clean after testing (test data archived or removed)

## Milestone
- [ ] All kanban skills manually verified and documented
