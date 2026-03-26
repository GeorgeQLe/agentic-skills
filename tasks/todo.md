# Phase 5: Expert Review Fixes

**Goal:** Resolve findings from `/expert-review` — credential leak, null dereference bug, stale docs, and missing codex manifest.

## Steps

- [x] **Remove leaked database credential from tracked file**
- [x] **Fix null dereference in `cmdArchiveCard`**
- [x] **Escape LIKE metacharacters in search**
- [x] **Batch list creation in `cmdCreateBoard`**
- [x] **Add missing `codex/plan-interview-ideas/agents/openai.yaml`**
- [ ] **Fix stale output paths in `docs/skills-reference.md`**
- [ ] **Add try/catch for malformed config JSON**

### Plan: Add missing `codex/plan-interview-ideas/agents/openai.yaml`

**What:** The `codex/plan-interview-ideas/` skill is the only codex skill (1 of 41) without an `agents/openai.yaml` manifest. All other codex skills have one. Create the file following the same pattern as `codex/plan-interview/agents/openai.yaml`.

**File to create:**
- `codex/plan-interview-ideas/agents/openai.yaml`

**Content** (modeled on `codex/plan-interview/agents/openai.yaml`):
```yaml
interface:
  display_name: "Plan Interview Ideas"
  short_description: "Run plan-interview for each idea in ideas.md"
  default_prompt: "Use $plan-interview-ideas to interview me for each idea in tasks/ideas.md."

policy:
  allow_implicit_invocation: true
```

**Acceptance criteria:**
- File exists at `codex/plan-interview-ideas/agents/openai.yaml`
- All 41 codex skills now have an `agents/openai.yaml`
- `install.sh` runs without errors

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
