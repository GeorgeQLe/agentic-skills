# Ship Manifest - 2026-06-23 - Task-Doc Routing Audit

## User Goal

Fix recurring stale task-doc routing by cleaning overloaded task docs, updating producer/recovery skills, and adding a mechanical audit that prevents historical/advisory unchecked work from being treated as active next work.

## Changed Files

- `scripts/audit-task-docs.mjs`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/reconciliation-report.md`
- `packs/docs-health/{codex,claude}/reconcile-dev-docs/**`
- `packs/exec-loop/{codex,claude}/ship/**`
- `packs/exec-loop/{codex,claude}/ship-end/**`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`

## Per-File Purpose

- `scripts/audit-task-docs.mjs`: read-only audit for current-only todo routing and roadmap current-section parity.
- `tasks/todo.md`: recorded and closed this remediation, returning the active surface to no-active-task state.
- `tasks/roadmap.md`: converted stale historical `Current Implementation` headings to `Historical Implementation`.
- `tasks/history.md` and `tasks/reconciliation-report.md`: recorded evidence, validation, and prevention rationale.
- `reconcile-dev-docs`: archived `v0.2`, bumped to `v0.3`, and added overloaded task-doc detection/fix rules.
- `ship`: archived `v0.7`, bumped to `v0.8`, and added task-doc audit/current-only next-work routing.
- `ship-end`: archived `v0.5`, bumped to `v0.6`, and added task-doc audit/current-only next-work routing.
- Generated proof data: refreshed Skills Showcase proof metadata after task history changed.

## User-Goal Mapping

- Mechanical prevention: `scripts/audit-task-docs.mjs`.
- Producer/recovery contracts: `reconcile-dev-docs`, `ship`, and `ship-end` updates.
- Current doc cleanup: `tasks/roadmap.md` and `tasks/todo.md`.
- Durable evidence: `tasks/history.md`, `tasks/reconciliation-report.md`, and this manifest.

## Tests Run

- `node scripts/audit-task-docs.mjs` before cleanup: failed with 89 roadmap `Current Implementation` sections.
- `node scripts/audit-task-docs.mjs` after cleanup: passed.
- `git diff --check`: passed.
- `scripts/skill-archive-audit.sh --strict`: passed.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`: passed.
- `npm run skillpacks:verify`: passed.
- `scripts/skill-mirror-parity-audit.sh --verbose`: failed on unrelated pre-existing `session-analytics/session-triage` `Pack Availability Guard` shared-section drift.

## Skipped Tests

- No app runtime or browser tests were run; this change affects repo workflow contracts, docs, generated metadata, and a Node audit script, not application UI/runtime behavior.

## Adversarial Review

- Verified the new audit fails on the original roadmap state and passes after final no-active-task cleanup.
- Verified no `## Current Implementation` or unchecked checkbox remains in `tasks/todo.md` or `tasks/roadmap.md`.
- Verified archive/version changelog entries exist for all bumped skill contracts.

## Residual Risk

- Mirror parity remains red because of a pre-existing `session-triage` drift outside this diff. This remediation does not change session-triage; fixing that should be a separate scoped skill bump if desired.
- The audit is intentionally scoped to task-doc routing invariants, not full semantic reconciliation of every historical roadmap note.

## Rollback Note

Revert this commit to remove the audit, restore prior skill contracts, and restore prior roadmap headings. If only the script is problematic, revert `scripts/audit-task-docs.mjs` and the audit-gating sentences in `reconcile-dev-docs`, `ship`, and `ship-end` together.

## Next Command

none
