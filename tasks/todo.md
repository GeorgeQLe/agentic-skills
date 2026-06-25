# Current Task State

## Status

Active implementation: none.

Project: `agentic-skills`.
Last completed task: Split Social Channel Conventions.

Completed implementation records live in `tasks/history.md`, `tasks/reconciliation-report.md`, commit history, and ship manifests.

## Review - Split Social Channel Conventions

### Goal

Split social channel conventions into focused `docs/social/` files and keep the top-level social convention docs as shared routers for context-efficient loading.

### Checklist

- [x] Re-read current social convention and package wiring.
- [x] Record the implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Add per-channel docs under `docs/social/`.
- [x] Replace top-level social convention docs with thin routers/shared contracts.
- [x] Update BIP alignment guidance and generated bundles.
- [x] Package `docs/social/` as `assets/social/` and update tests/audits.
- [x] Run required verification.
- [x] Document review results, commit, and push intended changes.

### Review

Implemented and verified.

- Added 14 focused channel/prompt convention docs under `docs/social/`.
- Replaced the two top-level social convention docs with thin routers/shared contracts.
- Updated BIP alignment guidance to load routers first and selected channel docs second.
- Packaged the child docs as `assets/social/` and added package-boundary assertions.
- Regenerated 306 alignment bundles.

Verification passed:

- `node scripts/upgrade-alignment-page.mjs`
- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/skill-convention-bundle-audit.mjs`
- `npm --workspace packages/skillpacks run test:node`
- `npm --workspace packages/skillpacks run build`
- `npm --workspace packages/skillpacks run build:check`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

Ship manifest: `tasks/ship-manifest-2026-06-25-split-social-channel-conventions.md`.

## No Active Implementation Phase

New implementation work should be promoted from `tasks/roadmap.md` before edits begin.
