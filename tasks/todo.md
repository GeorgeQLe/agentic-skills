# Current Task State

## Status

Active implementation: Tighten BIP Agent Compliance.

Project: `agentic-skills`.
Last completed task: Fix No-Op Skillpacks Refresh Reload Notices.
Last closeout: `skillpacks refresh` now treats marker-only source path drift as internal metadata maintenance.

## Current Implementation - Tighten BIP Agent Compliance

### Execution Profile

- Parallel mode: serial
- Rationale: convention, audit, package, fixture, and generated bundle changes share tightly coupled files and should be integrated in one controlled lane.

### Plan

- [x] Capture the visible `exec` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect current BIP evidence, canonical alignment convention, generated `ALIGNMENT-PAGE.md` bundles, audit scripts, package command surface, and representative alignment-producing skills.
- [x] Add an enforceable BIP checkpoint contract to the canonical alignment convention and regenerate generated bundles from that source.
- [x] Extend active alignment-page audit behavior to read `.agents/project.json`, require BIP handling for active Stage 2 review pages when BIP is enabled, avoid false positives for Stage 1/confirmed pages, and include active BIP pages in `alignment/index.html`.
- [x] Add focused regression fixtures/tests for BIP-enabled missing checkpoint failure, linked sibling BIP pass, BIP-disabled pass, Stage 1 no-fail, convention/bundle propagation, and final handoff routing.
- [x] Run required validation, inspect warnings, document results, create a ship manifest, commit, and push on the primary branch.

### Acceptance Criteria

- With `.agents/project.json` `alignment.build_in_public === true`, an active Stage 2 review page fails audit unless it has a BIP checkpoint, an approved BIP YAML record, an explicit narrow not-applicable reason, or a sibling BIP page.
- Stage 1 scope pages and confirmed pages do not fail solely because BIP is enabled unless they claim pending Stage 2 artifact approval.
- BIP review pages carry stable metadata identifying them as BIP pages and naming the normal alignment page they gate.
- Normal Stage 2 handoff instructions require opening/reviewing the BIP page before final artifact approval when BIP is active.
- `alignment/index.html` includes active BIP pages consistently with other review pages.
- Canonical convention changes propagate to generated `ALIGNMENT-PAGE.md` bundles.
- Focused fixtures prove BIP-enabled missing checkpoint failure, linked sibling pass, disabled pass, Stage 1 no-fail, and final handoff routing.

### Verification

Passed:

- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts layer1/alignment-gates.test.ts layer1/upgrade-alignment-pages.test.ts`
- `npm --workspace skillpacks run build:check`
- `npm --workspace skillpacks run test:node`
- `node scripts/audit-alignment-pages.mjs`
- `node packages/skillpacks/bin/skillpacks.mjs alignment pages audit`
- `node scripts/skill-convention-bundle-audit.mjs`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git diff --cached --check`

Review/results:

- Reproduced the gap: project BIP mode is enabled in `.agents/project.json`, there are no active `alignment/*-bip.html` pages, and the prior active-page audit had no BIP enforcement.
- Root cause: BIP was a convention-only approval flow with no stable normal-page checkpoint metadata, no stable BIP-page metadata, and no active-page audit fixtures proving BIP-enabled Stage 2 failures.
- Added enforced Stage 2 BIP checkpoint handling to the canonical convention and regenerated generated `ALIGNMENT-PAGE.md` bundles from the canonical source.
- Extended active-page audit behavior to read `.agents/project.json`, enforce BIP page metadata, enforce Stage 2 BIP handling when BIP is enabled, avoid Stage 1/confirmed false positives, and keep active BIP pages covered by index integrity.
- Added layer1 fixtures for BIP-enabled missing checkpoint failure, linked sibling pass, BIP-disabled pass, Stage 1 no-fail, BIP metadata failure, and linked-handoff-before-final-approval failure.
- Package command surface remained covered because `skillpacks alignment pages audit` wraps the same script; the package build/check and CLI smoke both passed.
- Advisory task status from `node scripts/audit-task-docs.mjs`: `tasks/manual-todo.md` has 4 unchecked manual advisory items and `tasks/recurring-todo.md` has 2 unchecked recurring advisory items; none block this implementation.
