# Session History

## 2026-03-25 — Kanban skill suite, board intelligence, board templates

### Phase 3: Board Templates (in progress)
- Added `--template standard` flag to kanban.mjs — creates board with 5 lists (Backlog, Todo, In Progress, Done:done, Punt:punt) in one command
  - `--template` and `--lists` are mutually exclusive; unknown templates error with available list
  - Updated help text

### Earlier this session (pulled from remote)
Phases 1-2 completed, roadmap expanded with Phases 3-4.

### Original session

- Built and tested kanban-lite (SQLite) skill, then archived it after analysis showed Neon free tier costs ~$0 at our usage volume (~456 ops/month across all devices)
- Decision: stick with poketo-kanban + Neon for kanban — SQLite advantage is latency/simplicity, not cost
- Created `tasks/roadmap.md` with 3 phases: kanban-roadmap sync, cross-device agent awareness, proactive board intelligence
- Created `/sync-roadmap-kanban` skill (Claude + Codex) — Phase 1 Step 1 complete
  - Prompt-only skill that orchestrates poketo-kanban scripts, git commands, and file edits
  - 7-step process: sync → read kanban → read roadmap → check codebase → reconcile → apply → report
  - 5 reconciliation rules: done-on-kanban→roadmap, done-in-roadmap→kanban, new-items→cards, orphaned-cards→flag, false-done→flag
  - Set up `tasks/todo.md` for Phase 1 tracking
- Added board-project auto-detection — Phase 1 Step 2 complete
  - Auto-matches board name to repo directory name (case-insensitive substring)
  - Persists board ID in `tasks/.kanban-board` (committed to git for cross-device sharing)
  - Falls back to user prompt only when no match or ambiguous
- Added `--sync-kanban` opt-in flag to all workflow skills — Phase 1 Step 3 complete
  - 12 SKILL.md files updated (run, run-step, run-phases, ship, ship-end, ship-then-plan × Claude + Codex)
  - Flag triggers `/sync-roadmap-kanban` at session start; discrepancies shown but don't block
  - Phase 1 milestone complete: kanban-roadmap sync infrastructure in place
- **Phase 1 archived** to `docs/phases/phase-1.md`, transitioned to Phase 2
- Added session activity cards — Phase 2 Step 1 (later reverted)
- Reverted all kanban integration from workflow skills — decided to build separate `-kanban` skill suite instead
- Redesigned roadmap: 6 standalone `-kanban` skills (brainstorm, plan-interview, roadmap, run, ship, ship-end) with board ops baked in
- Fixed kanban.mjs `--lists` flag to support `name:type` annotations (e.g., `Done:done`, `Punt:punt`)
- Created `brainstorm-kanban` skill (Claude + Codex) — first of 6 kanban skill suite
  - Full copy of brainstorm + Board Resolution/Validation/Graceful Degradation protocols
  - Creates one Backlog card per idea (idempotent: skips existing cards)
- Created `plan-interview-kanban` skill (Claude + Codex) — 2nd of 6
  - Full copy of plan-interview + kanban sync: finds matching card by keyword search, updates with spec details
  - Searches all lists (not just Backlog), updates in place, never moves backward from Done/Punt
- Created `roadmap-kanban` skill (Claude + Codex) — 3rd of 6
  - Full copy of roadmap + kanban sync: current phase steps → Todo cards, future phases → Backlog summary cards
  - Moves matching Backlog cards to Todo, idempotent (skips existing)
- Created `run-kanban` skill (Claude + Codex) — 4th of 6 (most complex)
  - Full copy of run + session card (Todo → In Progress), cross-device conflict detection, stale session cleanup
  - Hostname/branch/time stored in card description; post-execution card update
- Created `ship-kanban` skill (Claude + Codex) — 5th of 6
  - Full copy of ship + Done/Punt card movement after shipping, next card ensured in Todo when planning
- Created `ship-end-kanban` skill (Claude + Codex) — 6th of 6, phase complete
  - Full copy of ship-end + moves In Progress card to Done with commit refs
- **Phase 1 Kanban Skill Suite complete** — all 6 skills built (18 files), kanban.mjs fixed, milestone verified
- Added Board Overview to 4 session-start kanban skills — Phase 2 Step 1
  - Surfaces overdue, starred, blocked cards + WIP/Backlog/Todo counts at session start
  - 8 SKILL.md files updated (run, brainstorm, roadmap, plan-interview × Claude + Codex)
- Added Next Work Suggestion to ship-end-kanban and ship-kanban — Phase 2 Step 2
  - After shipping, suggests top Todo card ranked by overdue > starred > list order
  - Falls back to Backlog if Todo empty, or "Board is clear" if nothing pending
- Added progress tracking to run-kanban — Phase 2 Step 3
  - Post-execution card update now includes `Progress: X/Y (Z%)` based on todo.md step counts
- **Phase 2 Proactive Board Intelligence complete** — board overview, next work suggestion, progress tracking all shipped
- Roadmap updated: added Phase 3 (board templates) and Phase 4 (archive automation) from backlog. Kanban analytics and Neon UI sync remain in backlog.

## 2026-03-24 — kanban-lite: local SQLite kanban skill

- Created new `/kanban-lite` skill — lightweight kanban boards stored in a local SQLite file, synced across machines via git commits
- Single dependency (`better-sqlite3`) with raw SQL — no ORM, no external DB, no auth
- Same CLI interface as `/poketo-kanban`: boards, board, create-card, update-card, done, move-card, create-board, create-list, search
- Added `sync` command for git pull/commit/push workflow to share board state across bismarck, desktop, and laptop
- WAL checkpoint on exit prevents `-wal`/`-shm` files from leaking into git
- Added `*.db-wal` and `*.db-shm` to `.gitignore`

## 2026-03-15 — Expert review fixes

Resolved all 10 findings from `/expert-review`:
- Fixed stale `/review` → `/expert-review` references in skills-reference.md
- Added missing `agents/openai.yaml` for brainstorm and debug codex skills
- Fixed unsafe `rm -rf` in install.sh codex path (now warns and skips like claude side)
- Deleted orphaned root `brainstorm.md`
- Added deploy step to `ship-then-plan` and `ship-end` (both claude and codex)
- Aligned deploy search order across `deploy` and `ship` skills
- Added `/brainstorm` entry to skills-reference.md, fixed skill count to 26
- Removed inconsistent `allowed-tools` from `ship` and `ship-then-plan`
- Rewrote "CI tests" → "tests" in install-workflow-orchestration
- Removed stale `docs/` plan reference from `ship-end`

## 2026-03-18 — Brainstorm output & plan-interview-ideas skill

- Updated `/brainstorm` (Claude + Codex) to append suggestions to `tasks/ideas.md`
- Created new `/plan-interview-ideas` skill (Claude + Codex) that reads `tasks/ideas.md` and runs a plan-interview for each idea sequentially
- Expanded brainstorm dimensions: added Strategic/Product tier (new features, new workflows, product line expansion) and reorganized into Strategic → Improvement → Hygiene

## 2026-03-20 — Spec-per-file, ship error fixing, project sync.md

- Moved spec output from single `spec.md` to individual `specs/[topic].md` files across `plan-interview` and `plan-interview-ideas` (Claude + Codex)
- Updated all downstream spec consumers (`roadmap`, `plan-phases`, `brainstorm`, `expert-review`) to check `specs/` directory with `spec.md` fallback
- Added "fix unrelated issues" constraint to all ship skills (`ship`, `ship-end`, `ship-then-plan` — Claude + Codex)
- Created project-level `sync.md` to run `install.sh` after pulls for symlink updates

## 2026-03-23 — False-positive verification & TDD test status clarity

- Added false-positive verification steps to `/expert-review` (step 6) and `/dead-code` (step 7) — both Claude + Codex
- Added explicit TDD test status reporting to summaries of `/run`, `/run-step`, `/ship`, `/ship-end`, `/ship-then-plan` (all Claude + Codex) — must state whether failing tests are expected (red phase) or unexpected (regressions)

## 2026-03-23 — Expert-review false-positive filter (superseded by entry above)

- Added step 6 "Verify findings" to `/expert-review` (Claude + Codex) — re-reads source code for every finding before reporting, drops unconfirmed findings, downgrades uncertain ones to Low

## 2026-03-20 — Sync skill: project-level sync.md support

- Added Step 5 (post-sync actions) to `/sync` skill (Claude + Codex)
- If `sync.md` exists at project root: parses and executes Dependencies, Conflict Resolution, Custom, and Notifications sections
- If `sync.md` doesn't exist: analyzes project, suggests a pre-filled `sync.md`, creates only with user approval
- Updated constraints for command failure handling, commented-out section skipping, and conflict resolution guidance
