# Development Docs Reconciliation Report

## 2026-06-15 - `$reconcile-dev-docs fix tasks`

### Errors (2)

- **tasks/history.md** - Recent shipped task work lacked matching history entries. Evidence: `git log --oneline -50` includes `152f1d42 docs: clarify alignment convention fallbacks` and `5adea8c2 Fix framework handoff alias routing coverage`, while targeted scans found those topics only in roadmap/todo, not `tasks/history.md`.
- **tasks/todo.md** - Framework Handoff Routing Alias Parity had all verification notes present but the final "Review final diff, commit, and push" checklist item remained unchecked. Evidence: `git log --oneline -50` includes `5adea8c2 Fix framework handoff alias routing coverage`.

### Warnings (2)

- **tasks/roadmap.md** - Many old "Current ..." sections remain stacked as historical work notes, so the first visible section is not the current active task. This was previously deferred as a cleanup decision on 2026-05-15.
- **tasks/todo.md** - Many old "Current ..." sections remain in the active todo surface. Several older unchecked commit/push lines appear to be historical dirty-boundary notes, not current executable work; broad migration needs a separate editorial cleanup pass.

### Info (3)

- **reconcile-dev-docs skill install state** - `./scripts/pack.sh which reconcile-dev-docs` reports the skill is provided by the uninstalled `docs-health` pack. This run used the local source skill at `packs/docs-health/codex/reconcile-dev-docs/SKILL.md`.
- **tasks/manual-todo.md** - Manual tasks remain deferred Phase 38 production launch items, matching the prior reconciliation report.
- **tasks/recurring-todo.md** - Recurring docs/spec-drift obligations remain advisory surfaces unless promoted into `tasks/todo.md`.

### Fixed

- [x] `tasks/history.md` - Appended factual history entries for alignment convention fallback documentation and framework handoff alias routing coverage.
- [x] `tasks/todo.md` - Checked the Framework Handoff Routing Alias Parity final ship checkbox based on commit evidence.
- [x] `tasks/roadmap.md` and `tasks/todo.md` - Recorded the current reconciliation plan and review notes for this run.

### Deferred

- [ ] `tasks/roadmap.md` - Decide whether to collapse old "Current ..." sections into a historical archive or convert them to dated completed work records.
- [ ] `tasks/todo.md` - Decide whether to migrate old completed/current sections into `tasks/history.md` or phase archives, preserving evidence without keeping them in the active todo surface.
- [ ] `tasks/phases/` - Older completed phases still lack full archive coverage, a backfill decision carried from prior reconciliation reports.

### Summary

- Roadmap/todo alignment: issues remain in presentation, but the current unambiguous shipped-work contradiction was fixed.
- History coverage: fixed for the two recent missing shipped-work entries found in this pass.
- Phase archives: known historical backfill warning remains.
- Spec freshness: not evaluated; scope was `tasks`.
- Recommended next action: commit and push this reconciliation boundary, then run a separate editorial cleanup if the stacked "Current ..." task sections should be collapsed.

---

## 2026-05-15 - `/reconcile-dev-docs fix tasks`

### Errors (1)

- **tasks/manual-todo.md** - Phase 38 marked ✓ in roadmap but 4 unchecked manual items remained (Neon DB, admin secret, Vercel env vars, live verification). Evidence: `tasks/roadmap.md` line 1469 has `## Phase 38: ... ✓`, milestone at line 1546 is checked, but `tasks/manual-todo.md` had 4 unchecked `- [ ]` items referencing Phase 38 steps.

### Warnings (1)

- **tasks/phases/** - 25 of 39 completed phases still lack archive files (previously deferred in 2026-05-11 and 2026-05-04 reports). Backfill decision, not active contradiction.

### Info (2)

- **tasks/recurring-todo.md** - Devtool docs audit next due 2026-05-30, spec drift check next due 2026-06-11. Neither is overdue.
- **tasks/ideas.md** - 5 unspecced ideas remain as `/feature-interview` candidates (noted in Priority Task Queue).

### Fixed

- [x] `tasks/manual-todo.md` - Restructured: moved 4 unchecked Phase 38 items to a "Deferred from Phase 38" section with 2026-05-15 deferral date and context. Moved completed Vercel task to a "Completed" section. Updated header to indicate no active phase manual tasks. User chose "defer all to future work."
- [x] `tasks/todo.md` - Checked off the `/reconcile-dev-docs fix tasks` priority queue item with resolution summary.

### Deferred

- [ ] `tasks/phases/` - 25 of 39 completed phases lack archive files. Recurring backfill decision.
- [ ] `tasks/roadmap.md` - Multiple completed "Current" sections remain at the top of the roadmap. Cleanup decision (carried from 2026-05-11).

### Summary

- Roadmap/todo alignment: ok — all 39 phases ✓, todo status matches
- History coverage: ok — recent work has matching entries
- Phase archives: 14/39 present (warning, previously deferred)
- Manual tasks: fixed — orphaned items deferred with context
- Recurring tasks: ok — neither due
- Spec freshness: ok — no specs newer than roadmap
- **Recommended next command:** `/feature-interview` to triage 5 unspecced ideas in `tasks/ideas.md`

---

## 2026-05-11 (post-spec-drift) - `$reconcile-dev-docs`

### Resolved

- [x] `tasks/roadmap.md` - Added ✓ to Phase 35 row in overview table. Evidence: Phase 35 heading already has ✓, all acceptance criteria checked, phase-35.md archive exists.
- [x] `tasks/recurring-todo.md` - Updated spec drift check last run from 2026-05-04 to 2026-05-11, next due from 2026-06-04 to 2026-06-11. Evidence: `/spec-drift fix all` completed this session with commit `2b056f1`.
- [x] `tasks/manual-todo.md` - Annotated both manual tasks with Phase 37 migration notes. The Vercel config task was updated to target `apps/skills-showcase/` and reference Phase 37 completion as the dependency. Evidence: Phase 37 todo.md documents the Next.js migration from `docs/skills-showcase/` to `apps/skills-showcase/`.
- [x] `tasks/history.md` - Added standalone history entry for the 2026-05-11 spec-drift fix all run. Previously only documented within the Step 37.1 ship manifest.

### Deferred

- [ ] `tasks/phases/` - 25 of 36 completed phases lack archive files. Backfill decision, not active contradiction.
- [ ] `tasks/roadmap.md` - Multiple completed "Current" sections remain at the top of the roadmap. Cleanup decision.
- [ ] `tasks/recurring-todo.md` - Devtool docs audit has passed the 50-commit threshold since last run (2026-04-30). Next due 2026-05-30.

### Remaining Findings

- No remaining unambiguous current-doc contradictions.
- Recommended next action: `/run` to continue Phase 37 Step 37.2 (port static routes to Next.js App Router).

---

## 2026-05-11 - `$reconcile-dev-docs fix all`

### Resolved

- [x] `tasks/roadmap.md` - Fixed header phase count from "34 complete, 2 planned" to "36 complete". Evidence: all 36 phases have checked acceptance criteria, todo.md says "All 36 roadmap phases complete", and phase-36.md archive exists.
- [x] `tasks/roadmap.md` - Updated summary paragraph to mark Phases 32-36 complete instead of saying "Phase 36 is planned." Evidence: Phase 36 has all acceptance criteria checked and a completed milestone section.
- [x] `tasks/roadmap.md` - Checked all 6 acceptance criteria in "Benchmark Contract Lint and Routing" section. Evidence: todo.md Review entry on 2026-05-11 records full validation and completion.
- [x] `tasks/roadmap.md` - Checked the final unchecked criterion in "Current Benchmark: run" section. Evidence: the Result paragraph in the same section records benchmark completion on 2026-05-11.
- [x] `tasks/roadmap.md` - Added ✓ to Phase 36 section header. Evidence: all acceptance criteria checked, phase-36.md archive exists, history entry records closure.
- [x] `tasks/roadmap.md` - Added ✓ to Phase 34 section header. Evidence: all acceptance criteria checked, phase-34.md archive exists, history entry records closure.
- [x] `tasks/roadmap.md` - Added ✓ to Phase overview table rows for Phases 28, 29, 30, 34. Evidence: summary text says "Phases 12-31 complete" and Phase 34 is archived.
- [x] `tasks/roadmap.md` - Marked "Planned Benchmark Work: Codex Custom Coverage" section as superseded by Phase 35. Evidence: Phase 35 delivered all listed goals with full acceptance criteria checked.
- [x] `tasks/roadmap.md` - Marked "Current Product: Skills Showcase Website MVP" section as superseded by Phases 32-34. Evidence: Phases 32, 33, 34 are all complete with archives.

### Deferred

- [ ] `tasks/phases/` - 25 of 36 completed phases lack archive files. This is a backfill decision, not an active contradiction.
- [ ] `tasks/roadmap.md` - Multiple completed "Current" sections (ship benchmark, run benchmark, design-system benchmark, hero overlap fix, mobile ideas assessment, etc.) remain at the top of the roadmap. Removing or collapsing them is a cleanup decision.
- [ ] `tasks/manual-todo.md` - 2 unchecked items reference Phase 34 (newsletter provider, Vercel deploy). These are intentional post-phase manual launch tasks, not contradictions.
- [ ] `tasks/recurring-todo.md` - Devtool docs audit has passed the 50-commit threshold. Already flagged in todo.md Priority Documentation section.

### Remaining Findings

- No remaining unambiguous current-doc contradictions after the fixes above.
- Recommended next action: `/spec-drift fix all` or `/devtool-docs-audit` per the Priority Documentation Todo queue.

## 2026-05-04 - `$reconcile-dev-docs fix all`

### Resolved

- [x] `tasks/roadmap.md` - Reconciled active Phase 14 and creator foundation file paths from old `packs/creator-media/...` physical locations to `packs/creator-foundation/...` after the pack split. Evidence: the referenced skills now exist under `packs/creator-foundation/`; old physical skill paths do not exist.
- [x] `tasks/todo.md` - Updated active Phase 14 status from planned to in progress because Step 14.1 is complete and Step 14.2 is next.
- [x] `tasks/history.md` - Appended a factual history entry for `ad65caf Document skill pack workflow matrix`.
- [x] `specs/project-fleet.md` - Archived the prior spec and updated implementation references from old global paths to `packs/project-fleet/codex/...`.
- [x] `specs/drift-report.md` - Archived the prior report and refreshed current evidence for project-fleet, creator-foundation, and the shipped monorepo pack.

### Deferred

- [ ] `tasks/phases/phase-12.md` and other archived phase snapshots still contain old pack paths from the historical state at the time. They remain unchanged because archived phase notes are evidence records, not current execution contracts.

### Remaining Findings

- No remaining unambiguous current-doc contradictions found for the pack reorganization.
- Recommended next action: `$run` for Phase 14 Step 14.2.

## 2026-05-04 - `$reconcile-dev-docs fix tasks`

### Resolved

- [x] `tasks/todo.md` - Checked the Phase 25 commit/push todo item. Evidence: `git status --short` was clean, `master` matched `origin/master`, and `159b4ee feat(skills): add codebase status skill` contains the shipped Phase 25 changes.
- [x] `tasks/roadmap.md` - Corrected the phase count from 23 complete / 2 planned future to 24 complete / 1 planned future. Evidence: the phase overview marks every phase except Phase 14 complete.
- [x] `tasks/roadmap.md` - Updated the summary language so Phases 22-25 are included in the completed range.
- [x] `tasks/roadmap.md` - Checked the duplicated Phase 21 milestone checklist and filled the completion fields. Evidence: the same Phase 21 acceptance criteria are checked earlier in the roadmap, `tasks/phases/phase-21.md` exists, and `412a5f8 docs(tasks): close quality gate phase` shipped the phase closure.
- [x] `tasks/history.md` - Appended missing factual history entries for `159b4ee feat(skills): add codebase status skill` and `e350448 spec: monorepo execution controller integration`.

### Deferred

- [ ] `tasks/phases/` - Many older completed phases lack `tasks/phases/phase-N.md` archives. This is a broader archival backfill decision rather than an unambiguous fix from the current active todo.
- [ ] `specs/drift-report.md` - Last spec drift report predates `e350448`, which added the monorepo execution controller spec. Recommended follow-up: `$spec-drift fix all`.
- [ ] `research/devtool-dx-journey.md` and `research/devtool-adoption.md` - Stale research language still says there is no skill behavior harness. Research docs are outside the requested `tasks` fix scope.

### Remaining Findings

- No remaining unambiguous task-doc contradictions found in the current active Phase 25 todo or Phase 21 milestone state.
- Next task-doc work is either discovery of a candidate Phase 26 or explicit project parking.

## 2026-04-20 - `$reconcile-dev-docs fix tasks`

### Resolved

- [x] `tasks/todo.md` - Checked the Phase 11 top-level acceptance criteria. Evidence: `tasks/roadmap.md` marks Phase 11 complete, `tasks/history.md` records Phase 11 Verify plus tail Steps 12 and 13, and `tasks/verify-phase-11.md` contains the empirical three-mode evidence.
- [x] `tasks/todo.md` - Checked archived Phase 11 active-plan acceptance criteria for completed Steps 4 through 11 and Verify. These checklists were historical records, not active work.
- [x] `tasks/todo.md` - Marked the priority documentation todo for `$reconcile-dev-docs fix tasks` complete.

### Deferred

- [ ] `$spec-drift fix packs/business-app/*/scale-audit` remains the next active priority documentation item.
- [ ] Remaining Priority Documentation Todo entries stay unchecked because they are separate queued work.

### Remaining Findings

- No remaining Phase 11 task-doc contradiction found: unchecked `tasks/todo.md` items now begin at the active Priority Documentation Todo queue.
