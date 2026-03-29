# Session History

## 2026-03-28 — Enhance /icp skill: monorepo, geography, named accounts (v3.1→v3.2)

- Added monorepo detection to Step 1 — checks for turbo.json, pnpm-workspace.yaml, lerna.json, nx.json, package.json workspaces; produces per-app `research/icp-{app-name}.md` when multiple distinct user-facing products exist
- Added 2 new search strategies (#11 geographic/regulatory, #12 named account searches) to Step 2
- Expanded Customer Profile in Step 4 with two conditional sub-sections: Geographic Focus (regulatory/language/market constraints) and Named Accounts (B2B: 5-10 real companies)
- Updated output template with `### Geographic Focus` and `### Named Accounts` under `## Customer Profile`
- Added Monorepo Output Convention section to output spec
- Canonical 9 `##` sections preserved for downstream compatibility
- Applied to both claude/icp and codex/icp SKILL.md files

## 2026-03-28 — Add /monetization skill (49→50)

- Created `/monetization` skill (claude + codex) — research-driven monetization strategy with 3 validation checkpoints
- Covers: revenue model selection, value metric design, tier structure, price point anchoring, unit economics (CAC/LTV/payback), monetization timing, revenue diversification
- Reads upstream: icp, competitive-analysis, journey-map, metrics, gtm, customer-feedback, specs
- Outputs: research/monetization.md + research/monetization-interview.md
- Integrated into `/workflow`: staleness rules (stale when ICP or competitive data changes) + dependency graph
- Added to `/skills` stage mapping under Strategize
- Updated docs/skills-reference.md: count 49→50, new entry + quick reference row

## 2026-03-28 — Ship/ship-kanban: delegate to /workflow when no plan exists

- Replaced static suggestion list in `/ship` and `/ship-kanban` with `/workflow` delegation
- Both "no active plan" and "all phases complete" cases now run `/workflow` for context-aware next-step recommendation
- Updated claude/ship, claude/ship-kanban, codex/ship (3 files)

## 2026-03-28 — Add /hygiene skill and fix project-wide conventions (48→49)

- Created `/hygiene` skill (claude + codex) — audits project structure for convention violations with optional auto-fix mode
- Scopes: skills (frontmatter, sections), tasks (expected files), docs (reference sync), codex (mirror parity)
- Ran initial audit and fixed all errors/warnings:
  - Added missing `argument-hint` fields to 6 skills
  - Restructured 5 flat-format skills to use `## Process`/`## Output Format`/`## Constraints` headings (analyze-sessions, commit-and-push-by-feature, install-workflow-orchestration, plan-interview, ship-end)
  - Created 2 missing codex mirrors (poketo-kanban, skills)
  - Added `/competitive-analysis` to Quick Reference table
  - Synced 29 codex skill descriptions to match claude source of truth
- Updated docs/skills-reference.md: count 48→49, new `/hygiene` entry

## 2026-03-28 — Add contextual Next Steps to all 9 research skills

- Added `## Next Steps` section to all 9 research skill output templates (icp, competitive-analysis, enterprise-icp, journey-map, customer-feedback, gtm, metrics, mvp-gap, scale-audit)
- Claude skills (9): added "Populate Next Steps" process step with conditional logic (file existence checks) + `## Next Steps` in output template
- Codex skills (9): added Next Steps requirements to Deliverables + constraint enforcing format
- Each skill's suggestions are context-aware (3–5 items, "Pick one:" framing) — only includes commands whose prerequisites are met
- Replaced competitive-analysis's old `## Recommended Next Steps` (only suggested `/plan-interview`) with expanded contextual version
- 18 files modified, 165 lines added

## 2026-03-28 — Add 4 new skills: workflow, customer-feedback, gtm, metrics (44→48)

- Created `/workflow` skill — read-only diagnostic that scans project state, detects phase, checks staleness via timestamp comparison, and recommends next action
- Created `/customer-feedback` skill — append-only feedback ingestion with Confirmed/Wrong/New categorization against ICP and journey map, cumulative synthesis, staleness triggers at 3+ invalidated findings
- Created `/gtm` skill — interview-driven go-to-market planning (channel strategy, messaging, pricing, launch plan, 30/60/90 early traction tactics)
- Created `/metrics` skill — interview-driven success metrics framework (activation, engagement, retention, growth, business) tied to journey map stages with instrumentation gap tracking
- All 4 skills: Claude SKILL.md + Codex SKILL.md + Codex agents/openai.yaml (12 new files)
- Updated downstream skills to read new research outputs:
  - `/brainstorm` now reads customer-feedback.md (Wrong/New findings) and metrics.md (instrumentation gaps)
  - `/roadmap` now reads gtm.md (launch milestones) and metrics.md (instrumentation phases)
  - `/mvp-gap` now reads metrics.md (check if metrics are measurable)
- Updated `/skills` stage mapping: added Mapping, Evaluate, Workflow groups
- Updated docs/skills-reference.md: count 44→48, workflow diagram with Learn stage + feedback loop, 5 new entries, quick reference table
- install.sh: 4 new Claude + 4 new Codex symlinks installed

## 2026-03-28 — Research skills revamp + journey-map skill

- Revamped 3 research skills (icp, competitive-analysis, enterprise-icp) with present→validate→write pattern
  - All now report findings and validate with user via AskUserQuestion checkpoints before writing output
  - Output moved from `specs/` to `research/` directory (icp.md, competitive-analysis.md, enterprise-icp.md)
  - ICP: 3 checkpoints (candidates, scoring, cross-ICP); Competitive: 2 checkpoints (competitor list, full analysis); Enterprise: explicit present-findings step
- Added 2 new sections to /icp (v3.1.0): Trigger Events (ranked by frequency/urgency) and Market Sizing (TAM/SAM/SOM with confidence levels)
- Canonical ICP format expanded from 7 to 9 sections
- Created `/journey-map` skill (v1.0.0) — maps user journeys (per-use-case task flows) and customer journey (trigger→discovery→aha→conversion→retention)
  - Prerequisites: research/icp.md + specs/*.md
  - Outputs: research/journey-map.md + research/journey-map-interview.md
  - Same present→validate→write pattern as other research skills
- Updated ~20 downstream skills referencing old specs/ paths to use research/
- Updated docs/skills-reference.md: 43→44 skills, workflow diagrams, quick reference table
- Consolidated run-step, run-phases, ship-then-plan into run and ship (JIT /plan-phases invocation)

## 2026-03-27 — Kanban production hardening specs

- Assessed kanban test results (61 tests, 3 layers all passing) for production readiness
- Identified 4 caveats: multi-user concurrency, load/stress testing, rollback/undo safety, Neon outage resilience
- Ran 7-turn /plan-interview to spec out test plans and new features
- Created `specs/kanban-production-test-plan.md` — 10 Claude-to-Claude race scenarios, 4 Claude + Web App races, progressive load profiling (50→500 cards, p50/p95/p99), 8 safety gate tests
- Created `specs/kanban-offline-queue-soft-delete.md` — offline write queue (better-sqlite3, 100-op limit, FIFO sync with conflict detection), soft-delete with 30-day TTL, restore/purge commands, ~40 new test cases
- Created `specs/kanban-production-hardening-interview.md` — full interview log with decisions and deviations

## 2026-03-27 — Revamp /icp skill: interview → research-driven

- Rewrote `claude/icp/SKILL.md` and `codex/icp/SKILL.md` from v1.0.0 to v2.0.0
- Replaced 7-area founder interview with automated web search + codebase analysis
- Now identifies 2-5 ICP candidates, scores on Value x Accessibility, selects primary
- Output: primary ICP in canonical 7 `##` sections (downstream-compatible) + Additional ICPs + Cross-ICP Analysis
- Research log in `research/icp-search-log.md` replaces `specs/icp-interview.md`
- Brief 1-2 question validation replaces full interview

## 2026-03-27 — Phase 9 Step 3: Skill versioning

- Added `version: 1.0.0` to all 43 `claude/*/SKILL.md` frontmatter files
- Created `scripts/skill-versions.sh` — version audit script with `--json` and `--missing` modes
- Created `docs/skill-versioning.md` — semver rules, bump guidelines, audit usage
- Phase 9 complete: skill discovery, dependency graph, and versioning all shipped

## 2026-03-27 — Phase 9 Step 2: Skill dependency graph

- Created `scripts/skill-deps.sh` — PCRE-based dependency graph and validation script
- 4 output modes: default (graph), `--broken` (broken refs only), `--dot` (Graphviz), `--json` (programmatic)
- Regex with negative lookbehind/lookahead prevents false positives on path fragments (`tasks/todo.md`, `/home/user`)
- Scanned 43 skills, found 22 with dependencies, 0 broken refs
- Exit code 0 if clean, 1 if broken refs found

## 2026-03-27 — Phase 9 Step 1: Skill discovery command

- Created `claude/skills/SKILL.md` — prompt-only skill that discovers all skills via Glob + Read
- Groups skills into 13 workflow stages using static mapping matching `docs/skills-reference.md` sections
- Supports two modes: `list` (default, all skills) and `search <keyword>` (filter by name/description)
- Updated `docs/skills-reference.md` — added `/skills` entry to Utility section and quick reference table, bumped count 42→43

## 2026-03-27 — Phase 8 Step 3: Env path unification

- Created `claude/poketo-kanban/scripts/env-paths.mjs` — shared `ENV_SEARCH_PATHS` array (4 paths)
- Updated `kanban.mjs` to import and use `ENV_SEARCH_PATHS` instead of inline `pokePaths` array
- Updated `bootstrap-session.mjs` to import and use `ENV_SEARCH_PATHS` instead of inline 2-path fallback (was missing monorepo variants)
- Added test in `bootstrap-session.test.mjs` verifying array length and absolute paths
- All 83 tests pass (82 existing + 1 new). Phase 8 complete.

## 2026-03-27 — Phase 8 Step 2: Dry-run mode for kanban write commands

- Added `hasBoolFlag` utility and `--dry-run` checks to all 8 write commands in `kanban.mjs`
- Each dry-run outputs `{ dryRun: true, command, wouldDo }` with planned operation details, returns before any DB write
- Updated help text with `[--dry-run]` on all write commands
- Added 3 tests: create-card, move-card, delete-board — verify preview output and no DB side effects
- All 82 tests pass (79 existing + 3 new)

## 2026-03-27 — Phase 8 Step 1: Add `--board` flag to kanban search

- Added `getAllArgs` utility to `kanban.mjs` for collecting repeated flag values
- Modified `cmdSearch` to accept `--board <id>` (repeatable) — validates board belongs to org, scopes search to specified boards; falls back to all-org-boards when omitted
- Updated help text for search command
- Added 2 new tests: scoped search returns only matching board's cards, invalid board ID returns error
- All 79 tests pass (77 existing + 2 new)

## 2026-03-27 — Phase 7 Step 4: Fix backslash LIKE escape

- Fixed `kanban.mjs` line 462: added `.replace(/\\/g, '\\\\')` before `%` and `_` escapes
- Converted `it.todo` in `kanban.test.mjs` to real test — creates card with backslash in name, verifies search finds it
- All 77 tests pass (76 existing + 1 new). Phase 7 complete.

## 2026-03-27 — Phase 7 Step 3: Database error path tests

- Added 5 tests in new `describe("Database error paths")` block to `kanban.test.mjs`
- Malformed UUID rejection, FK violation on create-card, FK violation on move-card, extremely long board name, concurrent duplicate board names
- All tests hit real Postgres errors (no mocks) — verifies `main().catch()` handler works
- All 76 tests pass (71 existing + 5 new)

## 2026-03-27 — Phase 7 Step 2: install.sh tests

- Created `claude/poketo-kanban/scripts/install.test.mjs` with 8 tests using vitest + child_process
- Used vitest (existing) instead of bats-core (plan suggested) — no new dependencies needed
- Tests isolate via temp dirs with `HOME` override: symlink creation (claude/codex), idempotency, warning on non-symlink targets, symlink update, uninstall (selective removal + count), directory creation
- All 71 tests pass (53 kanban + 10 bootstrap + 8 install)

## 2026-03-27 — Phase 7 Step 1: bootstrap session tests

- Refactored `bootstrap-session.mjs` for testability: exported `loadEnv(searchPaths?)`, extracted `buildConfig(user, org)`, guarded auto-run with `import.meta.url` check
- Created `bootstrap-session.test.mjs` with 10 tests across 2 describe blocks
- `loadEnv` tests (6): KEY=value parsing, double/single quotes, comments/blanks, missing files, file merge order
- `buildConfig` tests (4): all fields present, userId/orgId match, valid ISO timestamp
- All 63 tests pass (53 existing + 10 new). CLI still works as direct-run script.

## 2026-03-27 — Phase 6 Step 2: create-list, update-card flags, error paths, card ordering

- Added 19 new tests across 4 describe blocks to `kanban.test.mjs`
- create-list: name, auto-increment order, missing --name error, missing --board error
- update-card flags: --progress (set/reset), --description (set + falsy-guard on empty), --due, combined --due+--progress
- Additional error paths: invalid board/card IDs for create-card/create-list/archive-card/move-card, missing --list
- Card ordering: first card order 0, second card order 1, moved card appends, board insertion order
- Discovered: `--description ""` is no-op (falsy guard line 243), move-card/board responses omit card `order`
- All 53 tests pass (1 todo). Phase 6 complete.

## 2026-03-27 — Phase 6 Step 1: kanban edge case tests

- Added 11 edge case tests (10 runnable + 1 `it.todo`) to `kanban.test.mjs`
- Search: `%` escape, `_` escape, unicode/emoji search, backslash (todo — known bug deferred to Phase 7)
- Move: same-list move, invalid list ID error
- Archive: archive card, double-archive idempotency
- Create: empty name validation, 500-char long name
- Done: idempotent double-done
- All 34 tests pass (24 existing + 10 new), 1 todo. Total: 35 test entries.

## 2026-03-27 — Layer 3 e2e testing: skills 7-8 (complete)

- `/sync-roadmap-kanban` (skill 7) — PASS: board resolved from `.kanban-board`, all 9 roadmap phases compared with board, Phases 1-5 deliverables verified in codebase, 5 reconciliation rules applied (1 orphan flagged, 1 expected discrepancy flagged), sync report generated
- `/kanban-archive` (skill 8) — PASS: board validated, Done/Punt lists scanned, 30-day threshold applied, no cards old enough to archive (board created 2026-03-26), correctly reported nothing to archive
- **Layer 3 complete: 8/8 skills PASS. All 3 testing layers fully pass (Layer 1: 24 tests, Layer 2: 9 skills, Layer 3: 8 skills).**

## 2026-03-27 — Layer 3 e2e testing: skills 3-6

- `/roadmap-kanban` (skill 3) — PASS: existing roadmap detected, 4 new phases added, 2 cards moved Backlog→Todo, 3 future phase cards created in Backlog
- `/run-kanban` (skill 4) — PASS: card created In Progress with hostname/branch metadata, conflict check passed, plan mode entered, progress set to 0%
- `/ship-kanban` (skill 5) — PASS: 2 logical commits shipped, card stays In Progress (step not complete), commit SHAs added to description
- `/ship-end-kanban` (skill 6) — session wrap-up: uncommitted test results shipped, card `31e37110` moved In Progress → Done, commit refs added

## 2026-03-27 — Roadmap updated: Phases 6-9 added

- Roadmap revised from 5 completed phases to 9 total (4 new planned)
- Phase 6: Testing Hardening I (edge cases + command test expansion)
- Phase 7: Testing Hardening II (bootstrap, install.sh, DB error paths, backslash fix)
- Phase 8: Kanban DX (--board flag, dry-run mode, env unification)
- Phase 9: Skill Infrastructure (discovery, dependency graph, versioning)
- Small phases (2-3 items each) for incremental shipping
- todo.md preserved for ongoing Layer 3 validation work

## 2026-03-27 — Kanban Skill Validation complete: all 9 skills pass

- Manually tested all 9 kanban skills in workflow order against real Neon DB
- Fixed `--progress` flag silently ignored in `kanban.mjs` `cmdUpdateCard`
- Added `showClearContextOnPlanAccept` setting to ship/ship-kanban/ship-then-plan plan mode steps
- Full lifecycle verified: Backlog → Todo → In Progress → Done → Archive
- Updated `docs/kanban-test-results.md` with all results
- Generated `tasks/ideas.md` with brainstormed improvements (quick wins, medium efforts, larger initiatives)

## 2026-03-27 — Phase 5 complete: try/catch for malformed config JSON

- Wrapped `JSON.parse` in `loadConfig()` with try/catch, returns `null` with stderr warning
- All 24 kanban tests pass, all Phase 5 milestone criteria met
- Phase 5 complete — all 7 expert review fixes shipped

## 2026-03-26 — Phase 5 step 6: fix stale output paths in skills-reference

- Fixed `/plan-interview` output paths: `spec.md` → `specs/[topic].md`, `interview-log.md` → `[topic]-interview.md`
- Fixed `/plan-interview-ideas` output paths: "appends to spec.md" → "writes specs/[topic].md per idea"
- Phase 5 steps 1–6 complete, step 7 remains (config JSON try/catch)

## 2026-03-26 — Phase 5 step 5: add missing codex agent manifest

- Created `codex/plan-interview-ideas/agents/openai.yaml` — the only codex skill (1 of 41) missing an agent manifest
- All 41 codex skills now have `agents/openai.yaml`
- Phase 5 steps 1–5 complete, steps 6–7 remain (stale docs paths, config JSON try/catch)

## 2026-03-26 — Expert review + Phase 5 roadmap

- Ran `/expert-review` on full project — 7 confirmed findings after false-positive verification
- Critical: database credential in tracked `docs/kanban-test-results.md`, null dereference in `cmdArchiveCard`
- High: LIKE metachar injection in search, sequential list inserts in `cmdCreateBoard`
- Medium: missing codex `plan-interview-ideas` agent manifest, stale output paths in skills-reference
- Added Phase 5 to `tasks/roadmap.md` with 7 steps to resolve all findings

## 2026-03-26 — Phase 4 complete + kanban integration tests

- Phase 3 (Board Templates) archived from remote
- Added `archive-card` command to kanban.mjs (Phase 4 Step 1)
- Created `/kanban-archive` skill (Claude + Codex) — Phase 4 Step 2
- Updated `docs/skills-reference.md` with all 9 kanban skills (33 → 42 skills)
- **Phase 4 Archive Automation complete** — all roadmap phases (1-4) done
- Ran `/analyze-sessions` on 5,332 messages across 1,912 sessions:
  - `/ship` is dominant (537 invocations + 215 manual equivalents)
  - Kanban skills never used yet — testing needed before adoption
- Added `delete-board` command to kanban.mjs for test cleanup
- Created `kanban.test.mjs` — 24 integration tests against real Neon DB, all passing
  - Board lifecycle, card CRUD, card movement, search, error handling, cleanup
- Set up `~/.poketo/config.json` on this machine for kanban DB access
- Installed vitest as dev dependency for poketo-kanban scripts

## 2026-03-26 — Phase 4 Step 1: archive-card command (superseded by entry above)

- Phase 3 (Board Templates) completed on remote — archived to `docs/phases/phase-3.md`
- Added `archive-card --id <card-id>` command to kanban.mjs
  - Looks up card → list → board chain, moves card to board's archive list
  - Auto-creates "Archive" list and sets `archiveListId` on board if none exists
  - Follows existing patterns (cmdMoveCard, cmdCreateList)
- Created `/kanban-archive` skill (Claude + Codex) — bulk-archives Done/Punt cards older than N days
- Updated `docs/skills-reference.md` — added all 9 kanban skills section + quick reference entries (33 → 42 skills)

## 2026-03-25 — Kanban skill suite, board intelligence, board templates

### Phase 3: Board Templates (in progress)
- Added `--template standard` flag to kanban.mjs — creates board with 5 lists (Backlog, Todo, In Progress, Done:done, Punt:punt) in one command
  - `--template` and `--lists` are mutually exclusive; unknown templates error with available list
  - Updated help text
- Updated Board Resolution protocol in all 12 -kanban SKILL.md files to use `--template standard` instead of verbose `--lists` string
- **Phase 3 Board Templates complete** — both steps done, milestone verified (0 old `--lists` matches, 12 `--template standard` matches)

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
