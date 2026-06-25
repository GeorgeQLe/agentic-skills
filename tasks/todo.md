# Current Task State

## Status

Active implementation queue: none.

Project: `agentic-skills`.
Last completed task: Build-In-Public Alignment Mode.

Completed implementation records live in `tasks/history.md`, `tasks/reconciliation-report.md`, commit history, and ship manifests.

## Review - Build-In-Public Alignment Mode

### Goal

Add a build-in-public alignment mode for alignment-producing skills. When enabled, Stage 2 produces a source-safe social-content review page before returning to the normal final artifact approval flow.

### Checklist

- [x] Inspect dirty worktree state and relevant alignment/config files.
- [x] Record the implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Patch the canonical alignment-page convention with the BIP contract.
- [x] Add `scripts/pack.sh set-bip <on|off|unset>`.
- [x] Add Node CLI `npx skillpacks set-bip <on|off|unset>` support.
- [x] Add package tests for `set-bip on`, `off`, and `unset`, including sibling-field preservation.
- [x] Update CLI/docs compatibility references for the new command.
- [x] Regenerate bundled alignment convention files and package build artifacts.
- [x] Run required verification and document results.
- [x] Commit and push intended changes.

### Review

- Passed: `npm --workspace packages/skillpacks run test:node`.
- Passed: `npm --workspace packages/skillpacks run build`.
- Passed: `node scripts/upgrade-alignment-page.mjs --check`.
- Passed: `node scripts/skill-convention-bundle-audit.mjs`.
- Passed: `bash -n scripts/pack.sh`.
- Passed: temp-project `scripts/pack.sh set-bip on/off/unset` smoke test.
- Passed: `npm --workspace packages/skillpacks run build:check`.
- Passed: `node scripts/audit-task-docs.mjs`.
- Passed: `git diff --check`.

## No Active Implementation Phase

The Build-In-Public alignment mode change is complete and ready to ship. Deferred manual production setup items remain in `tasks/manual-todo.md`; they are not active implementation blockers unless promoted into a future phase.
