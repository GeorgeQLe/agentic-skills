# Roadmap: Claude Skills

> Generated from: tasks/roadmap.md (existing), specs/board-flag-kanban-search.md, tasks/ideas.md, tasks/history.md
> Date: 2026-03-27
> Total Phases: 9 (8 complete, 1 planned)

## Summary

Phases 1-8 built the kanban skill suite, board intelligence, templates, archive automation, resolved expert review findings, hardened test coverage (83 tests), and improved kanban DX. Next: skill infrastructure (Phase 9).

## Phase Overview

| Phase | Title | Source Spec(s) | Key Deliverable | Est. Complexity |
|-------|-------|----------------|-----------------|-----------------|
| 1 | Kanban Skill Suite | — | 6 kanban workflow skills | L |
| 2 | Proactive Board Intelligence | — | Board overview, next work suggestion, progress tracking | M |
| 3 | Board Templates | — | `--template standard` flag | S |
| 4 | Archive Automation | — | `archive-card` command + `/kanban-archive` skill | M |
| 5 | Expert Review Fixes | — | 7 security/quality fixes | M |
| 6 | Testing Hardening I | tasks/ideas.md | Edge case + command test expansion (~20 new tests) | M |
| 7 | Testing Hardening II ✓ | tasks/ideas.md | Bootstrap tests, install.sh bats, DB error paths | M |
| 8 | Kanban DX ✓ | specs/board-flag-kanban-search.md, tasks/ideas.md | `--board` flag, dry-run mode, env path unification | M |
| 9 | Skill Infrastructure | tasks/ideas.md | Skill discovery, dependency graph, versioning | L |

---

## Phase 1: Kanban Skill Suite ✓

**Goal:** Create a parallel set of `-kanban` workflow skills that manage kanban board state alongside their normal operations. Board lists: Backlog → Todo → In Progress → Done → Punt.

### Prerequisites (done)
- `/poketo-kanban` skill — low-level board CRUD
- `/sync-roadmap-kanban` skill — standalone reconciliation with board auto-detection via `tasks/.kanban-board`

### Steps

1. **`brainstorm-kanban`** (Claude + Codex)
   - Full copy of `/brainstorm` with kanban ops added
   - After generating ideas, create one card per idea in the Backlog list
   - Card name: idea title. Card description: idea details, effort estimate, category

2. **`plan-interview-kanban`** (Claude + Codex)
   - Full copy of `/plan-interview` with kanban ops added
   - After validating/speccing an idea, find the matching Backlog card and update it with spec details
   - If no matching card exists, create one in Backlog with the spec summary

3. **`roadmap-kanban`** (Claude + Codex)
   - Full copy of `/roadmap` with kanban ops added
   - After building the phased plan, move specced Backlog cards to the Todo list
   - Create Todo cards for any roadmap phases/steps that don't have cards yet

4. **`run-kanban`** (Claude + Codex)
   - Full copy of `/run` with kanban ops added
   - At session start, move the current step's card from Todo to In Progress
   - Cross-device conflict detection: scan In Progress for cards from other hostnames, warn on overlap
   - After step completion, update the card (mark progress, add notes)

5. **`ship-kanban`** (Claude + Codex)
   - Full copy of `/ship` with kanban ops added
   - After shipping, move the step's card to Done
   - If work is deferred/blocked, move to Punt with a reason in the description
   - When planning next step, ensure the next card is in Todo

6. **`ship-end-kanban`** (Claude + Codex)
   - Full copy of `/ship-end` with kanban ops added
   - After wrapping up, move the session's In Progress card to Done with commit refs

### Milestone
- [x] Full kanban lifecycle works: brainstorm creates Backlog cards → plan-interview specs them → roadmap moves to Todo → run moves to In Progress (with conflict warnings) → ship/ship-end moves to Done or Punt

---

## Phase 2: Proactive Board Intelligence ✓

**Goal:** Agents use board state to make smarter decisions about what to work on.

### Steps

1. **Session start board check**
   - Kanban skills read the board at session start to understand project priorities
   - Surface overdue cards, blocked items, and high-priority backlog

2. **Auto-suggest next work**
   - After `/ship-end-kanban`, read the board and suggest the highest-priority unstarted card
   - Factor in due dates, starred status, and dependency order

3. **Progress tracking**
   - Update card `progress` field as agents complete sub-tasks within a step
   - `/run-kanban` updates progress percentage based on step completion within the phase

### Milestone
- [x] Agent recommends next task based on board state and project priorities

---

## Phase 3: Board Templates ✓

**Goal:** One-command board creation with the standard 5-list layout, reducing setup friction for new projects.

### Steps

1. **Add `--template standard` flag to kanban.mjs**
   - When `create-board` is called with `--template standard`, create board with the 5 lists: Backlog, Todo, In Progress, Done:done, Punt:punt
   - Keep existing `--lists` flag for custom layouts
   - `--template` and `--lists` are mutually exclusive

2. **Update -kanban skills' Board Resolution protocol**
   - When no board exists and user confirms creation, use `--template standard` instead of the long `--lists "Backlog,Todo,In Progress,Done:done,Punt:punt"` string
   - Update all 12 -kanban SKILL.md files (6 Claude + 6 Codex)

### Milestone
- [x] `create-board --template standard` creates a board with all 5 required lists in correct types

---

## Phase 4: Archive Automation ✓

**Goal:** Keep boards clean by archiving old Done/Punt cards automatically.

### Steps

1. **Add `archive-card` command to kanban.mjs**
   - New command: `archive-card --id <card-id>` — moves card to the board's archive
   - Uses the existing `archiveListId` field in the board schema
   - If no archive list exists, create one automatically

2. **Create `/kanban-archive` skill (Claude + Codex)**
   - Standalone skill that archives Done/Punt cards older than N days (default 30)
   - Shows which cards will be archived, asks for confirmation before proceeding
   - Supports `--days <N>` to override the default threshold
   - Reports: how many cards archived, from which lists

### Milestone
- [x] `/kanban-archive` cleans up Done/Punt cards older than 30 days with user confirmation

---

## Phase 5: Expert Review Fixes (2026-03-26) ✓

**Goal:** Resolve findings from `/expert-review` — credential leak, null dereference bug, stale docs, and missing codex manifest.

### Steps

1. **Remove leaked database credential from tracked file**
2. **Fix null dereference in `cmdArchiveCard`**
3. **Escape LIKE metacharacters in search**
4. **Batch list creation in `cmdCreateBoard`**
5. **Add missing `codex/plan-interview-ideas/agents/openai.yaml`**
6. **Fix stale output paths in `docs/skills-reference.md`**
7. **Add try/catch for malformed config JSON**

### Milestone
- [x] No credentials in tracked files, Neon password rotated
- [x] `cmdArchiveCard` handles orphaned list/board references gracefully
- [x] All codex skills have `agents/openai.yaml`
- [x] `docs/skills-reference.md` output paths match actual skill behavior

---

## Phase 6: Testing Hardening I ✓

**Goal:** Expand kanban.mjs test coverage with edge case and command-level tests to catch regressions like the Phase 5 LIKE injection and null dereference bugs.

**Acceptance Criteria:**
- [x] Edge case tests added: unicode card names, LIKE metacharacter queries (%, _, backslash as todo), moving card to same list, archiving already-archived card
- [x] create-list command has dedicated test coverage
- [x] update-card --progress, --description, --due flags each have at least one test
- [x] search with special characters has regression tests
- [x] All new + existing tests pass (53 passed, 1 todo — target was 40+)

**On Completion:**
- Deviations: `--description ""` no-op (falsy guard), no `--type` flag on create-list, move-card/board omit card `order`
- Tech debt: backslash search escape, empty description clearing, expose card `order` in responses
- Ready for next phase: yes

---

## Phase 7: Testing Hardening II ✓

**Goal:** Cover the remaining untested code paths: bootstrap-session.mjs, install.sh, and database error handling.

**Acceptance Criteria:**
- [x] bootstrap-session.mjs has unit tests (10 tests, temp file fixtures)
- [x] install.sh has vitest test suite covering happy path + error cases (8 tests)
- [x] At least 5 database error path tests (insert failure, FK violation, connection error)
- [x] Backslash LIKE escape bug fixed with regression test
- [x] All tests pass across all suites (77 tests)

**On Completion:**
- Deviations from plan: install.sh tests used vitest instead of bats-core (no new deps needed)
- Tech debt / follow-ups: empty description clearing (`--description ""`), expose card `order` in responses
- Ready for next phase: yes

---

## Phase 8: Kanban DX ✓

**Goal:** Improve kanban CLI ergonomics — scoped search, safer testing, and consistent env resolution.

**Scope**:
- Add `--board` flag to kanban search (spec: `specs/board-flag-kanban-search.md`)
- Dry-run mode for kanban skills (`--dry-run` shows intended ops without executing)
- Unify env path lists in bootstrap-session.mjs and kanban.mjs

**Acceptance Criteria:**
- [x] `search --board <id>` scopes results to specified board(s); repeatable flag works
- [x] Invalid `--board` ID exits with error (not silent empty results)
- [x] `--dry-run` flag on kanban skills shows intended card operations without DB writes
- [x] bootstrap-session.mjs and kanban.mjs share a single env path list
- [x] Existing tests still pass; new tests added (83 total)

**On Completion:**
- Deviations from plan: none
- Tech debt / follow-ups: empty description clearing (`--description ""`), expose card `order` in responses
- Ready for next phase: yes

---

## Phase 9: Skill Infrastructure

**Goal:** Improve skill discoverability, validate cross-references, and track changes.

**Scope**:
- Skill discovery command (`/skills` with search and workflow-stage grouping)
- Skill dependency graph and validation (parse SKILL.md cross-references, detect broken refs)
- Skill versioning and changelog (semver in frontmatter, changelog tracking)

**Acceptance Criteria:**
- [x] `/skills` command lists skills grouped by workflow stage with keyword search
- [x] Dependency graph script detects broken cross-references between skills
- [ ] At least one iteration of versioning scheme documented and applied to 3+ skills
- [x] No broken skill cross-references in the repo

**On Completion** (fill in when phase is done):
- Deviations from plan:
- Tech debt / follow-ups:
- Ready for next phase:

---

## Deferred / Future Work
- **Kanban analytics** — cycle time, throughput, WIP limits via `/kanban-stats` skill (from original backlog)
- **Two-way Neon ↔ poketowork UI sync** — webhook on git push (from original backlog)
- **Kanban card labels** — tags/labels field for filtering by type (deferred to after Phase 8)
- **Multi-project kanban dashboard** — cross-board view (larger initiative, deferred)
- **Add Codex poketo-kanban skill** — parity item, low priority
- **Cross-tool portability layer** — single-source skill generation (larger initiative)
- **Workflow orchestrator / meta-skill** — guided pipeline execution (larger initiative)
- **Session continuity automation** — `/resume` skill for cold-start (medium effort)

## Cross-Phase Concerns
### Integration Tests
- All new tests must pass alongside existing 24 kanban.mjs tests
- Phase 6-7 tests should be runnable via `vitest` with existing config
### Non-Functional Requirements
- No credentials in test fixtures or tracked files
- Test suites must clean up after themselves (delete test boards/cards)
