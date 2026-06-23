# Current Task State

## Status

Active implementation queue: design-tree branch prioritization and progressive UI experiment ownership.

This file is the current execution contract, not a historical work log. Completed implementation records live in `tasks/history.md`, `tasks/reconciliation-report.md`, commit history, and ship manifests.

## Current Implementation - Design-Tree Branch Prioritization And UI Experiment Split

### Goal

Make the product-design tree choose downstream branches in a journey-aware order, separate clickable UI experiment/prototype work from `ui-interview`, and ensure review surfaces introduce UI progressively instead of dropping reviewers into an overloaded all-at-once screen.

### Plan

- [ ] Add explicit journey-aware branch ordering metadata to `design/flow-tree.schema.json`, such as `journey_stage`, `journey_sequence`, `priority_rationale`, and a progressive learning/review field.
- [ ] Update `$user-flow-map` so `branches[]` are ordered by user journey progression by default, with user overrides captured in the flow map, interview log, and manifest.
- [ ] Update `$ux-variations` so the recommended next child branch is selected by parent flow journey order, activation/first-value fit, and stated evaluation priority rather than only first-pending array order.
- [ ] Update `$ui-interview` to stop owning clickable prototype/buildout behavior by default; keep it focused on requirements, UI packet, static or bounded visual review, and branch decision capture.
- [ ] Design or add a dedicated `create-ui-experiment` skill to own clickable UI experiments, lightweight route prototypes, progressive reveal/review behavior, and experiment handoff into prototype/UAT.
- [ ] Add progressive UI review requirements so generated review/mockup surfaces teach the interface step by step, emphasizing first value, primary task path, and staged disclosure before showing dense controls.
- [ ] Fix the manifest naming drift between `ui-interview` guidance and `design/flow-tree.schema.json` (`ui_reviews[]` vs. `ui_experiments[]`).
- [ ] Run focused verification: schema validation or fixture checks, skill archive/changelog/version checks for any changed skills, generated bundle parity checks, and relevant repo audits.
- [ ] Document review results, commit, and push the completed change set on the primary branch.

### Acceptance Criteria

- Branch routing is deterministic and explicitly tied to journey sequence or a recorded user override.
- `ux-variations` and `ui-interview` no longer rely only on implicit “first pending” order when recommending child branches.
- Clickable UI experiment buildout has a dedicated owner separate from default `ui-interview` behavior.
- Review artifacts present complex interfaces progressively, with clear first-step and primary-path focus before dense secondary controls.
- The flow-tree schema and skill language use matching branch names for UI experiment/review nodes.
- Verification commands pass, or any residual failures are documented as unrelated pre-existing issues.

## Latest Completed Work - Task-Doc Routing Prevention Fix

### Goal

Prevent stale historical task sections from being routed as active next work by enforcing that `tasks/todo.md` is current-only, `tasks/roadmap.md` does not present historical entries as repeated active `Current Implementation` sections, and shipping/reconciliation skills consult only the promoted current task when selecting next work.

### Plan

- [x] Inspect current docs, existing audit scripts, and relevant skill contracts.
- [x] Add `scripts/audit-task-docs.mjs` to flag overloaded todo/roadmap routing surfaces.
- [x] Confirm the new audit fails against the pre-cleanup roadmap state.
- [x] Archive and bump mirrored `reconcile-dev-docs` contracts from `v0.2` to `v0.3`, then update changelogs.
- [x] Update `ship` and `ship-end` contracts so task-doc changes run the audit and next-work routing reads only the current active todo section.
- [x] Rewrite the top-level roadmap headings so historical implementation notes are explicitly historical, with only promoted current work using `Current Implementation`.
- [x] Add history/reconciliation evidence for this prevention fix.
- [x] Run verification: task-doc audit, diff hygiene, archive audit, mirror parity audit, and `npm run skillpacks:verify`.
- [x] Review final diff, commit, and push intended changes on the primary branch.

### Acceptance Criteria

- `scripts/audit-task-docs.mjs` fails on ambiguous stale active-task routing and passes on the cleaned docs.
- `tasks/todo.md` contains only this current task during execution, then returns to a no-active-task or explicitly promoted state before ship completion.
- `tasks/roadmap.md` no longer contains multiple historical `Current Implementation` sections.
- `reconcile-dev-docs` fix mode explicitly detects and repairs overloaded current-task sections.
- `ship` and `ship-end` do not recommend historical/advisory unchecked boxes as next executable work.
- Required verification passes or any failure is fixed and rerun.

### Review

- Added `scripts/audit-task-docs.mjs`; it failed before cleanup with 89 roadmap `Current Implementation` sections and passed after heading cleanup.
- Archived and bumped `reconcile-dev-docs` to `v0.3`, `ship` to `v0.8`, and `ship-end` to `v0.6` across Codex and Claude mirrors.
- Converted stale roadmap current headings to historical headings, then returned `tasks/todo.md` to this no-active-task state.
- Verification passed: `node scripts/audit-task-docs.mjs`, `git diff --check`, `scripts/skill-archive-audit.sh --strict`, Skills Showcase data validation, and `npm run skillpacks:verify`.
- Verification residual: `scripts/skill-mirror-parity-audit.sh --verbose` still fails on the unrelated pre-existing `session-analytics/session-triage` `Pack Availability Guard` shared-section drift; this task did not modify session-triage.

## Latest Completed Work - Development Docs Reconciliation

### Goal

Reconcile stale task docs after `$reconcile-dev-docs fix tasks`, close old unchecked task items that were already shipped, and determine why stale active-task entries keep reappearing.

### Plan

- [x] Capture the visible `$reconcile-dev-docs fix tasks` invocation.
- [x] Audit `tasks/todo.md`, `tasks/roadmap.md`, `tasks/manual-todo.md`, `tasks/recurring-todo.md`, `tasks/history.md`, prior reconciliation reports, recent git history, and relevant external Alignmeant git state.
- [x] Verify stale unchecked task entries against commits, npm package state, and external repository evidence.
- [x] Replace the stacked historical `tasks/todo.md` content with a current-only task state.
- [x] Append factual history/reconciliation evidence and record the root-cause lesson.
- [x] Run doc hygiene checks and ship the task-doc reconciliation.

### Review

- Confirmed `tasks/todo.md` had become a reverse-chronological stack of old implementation sections rather than a single active execution contract.
- Confirmed stale unchecked items were already shipped or superseded:
  - `Fix Alignment-Page Review Routing`: agentic-skills commit `87ed1017`; Alignmeant repair commit `3c4b598` is pushed. Newer dirty Alignmeant UI-interview files are unrelated later work.
  - `Fix skillpacks uninstall-global Legacy Cleanup` and reinstall-base migration: commits `64db1892`, `59ced4a0`, `524a94df`, `87f16a5e`; `skillpacks` and `@glexcorp/gskp` both report npm version `0.1.11`.
  - Recent dry-run, publish verification, fork-idea, spinoff, and prompt-history work all have matching commits and history/task evidence.
- Replaced the active todo surface with this current-state record so stale historical checkboxes no longer drive next-work routing.
- Added reconciliation findings and root-cause analysis to `tasks/reconciliation-report.md`.
- Added a durable workflow lesson to `tasks/lessons.md`.

## Development Docs Reconciliation

### Root Cause

This keeps happening because the repo has two conflicting task-doc behaviors:

- The workflow contract says `tasks/todo.md` is the current phase/current execution surface.
- Agents have repeatedly prepended completed ad hoc implementation plans to `tasks/todo.md` and `tasks/roadmap.md` as reverse-chronological history, then shipped without removing, archiving, or replacing the prior completed blocks.

That left old terminal checklist items in the active todo file. Later agents scanned unchecked boxes without first proving they were current work, so already-shipped tasks kept resurfacing as recommended next work.

### Prevention Rule

After a shipped implementation, `tasks/todo.md` must contain only the current active task, a no-active-task state, or explicitly promoted next work. Completed implementation detail belongs in `tasks/history.md`, ship manifests, reconciliation reports, and git history. Do not leave completed implementation sections in `tasks/todo.md` as an append-only log.

### Remaining Advisory Work

- `tasks/manual-todo.md` has four deferred human-only Skills Showcase production environment tasks. They remain intentionally deferred until the newsletter/admin feature needs production setup.
- `tasks/recurring-todo.md` has two due advisory items: Devtool docs audit refresh and spec drift check. They remain advisory unless explicitly promoted into active work.
- `tasks/roadmap.md` still contains older reverse-chronological implementation notes with stale `Current Implementation` headings. This run fixed the active todo surface; a broader roadmap archival rewrite is a separate editorial cleanup because the roadmap file is large and historically overloaded.

## Next Work

Decide whether to promote one advisory item from `tasks/recurring-todo.md` or start a new planned implementation/research phase.
