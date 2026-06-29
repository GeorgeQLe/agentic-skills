# Current Task State

## Status

Active implementation: none.

Project: `agentic-skills`.
Last completed task: Harden Publish Against Web Auth Interrupts.
Last closeout: publish now preflights auth before source mutation, rejects tokenless web auth non-interactively, and restores release files on interrupted first publish.

## Recent Completion - Harden Publish Against Web Auth Interrupts

### Plan

- [x] Capture the visible `investigate` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Restore only `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` from the failed `0.1.15` bump back to `HEAD`.
- [x] Inspect current publish, auth-check, and recovery test behavior.
- [x] Move real-publish package/auth preflight ahead of source mutation by computing the target version in a temporary package copy.
- [x] Extend `prepublish-auth-check.mjs` with package/version overrides and non-interactive web-auth rejection when no publish token or legacy/token auth is detected.
- [x] Add interrupt-safe rollback handling for `INT`, `TERM`, and `HUP`, preserving bumped files only after the first publish succeeds.
- [x] Add focused regression coverage for web-auth preflight, publish interruption rollback, repeated interrupt during cleanup, token/legacy-auth pass-through, and existing recovery paths.
- [x] Run focused and workspace verification, task-doc audit, diff hygiene checks, and post-commit dry-run release verification.
- [x] Document results, commit, and push on `master`.

### Acceptance Criteria

- Failed `0.1.15` bump files are restored before release script implementation changes.
- Real publishes validate both `skillpacks@<target>` and `@glexcorp/gskp@<target>` before `run_version_bump` mutates tracked files.
- `auth-type=web` without `NODE_AUTH_TOKEN`, `NPM_TOKEN`, or registry `_authToken` fails before source mutation with clear remediation.
- Existing staged-package preflight remains as a second guard after package staging.
- `SIGINT`, `SIGTERM`, and `SIGHUP` during the first package publish restore tracked release files to their pre-bump contents.
- Repeated interrupt during cleanup cannot prevent rollback from restoring the source files.
- Bumped files are kept only after the first `npm publish` succeeds, preserving partial-publish recovery behavior.
- Focused, workspace, task-doc, diff hygiene, and dry-run release checks pass or any blocker is documented.

### Verification

Passed:

- `node --test packages/skillpacks/test/publish-recovery.test.mjs packages/skillpacks/test/prepublish-auth-check.test.mjs`
- `npm --workspace skillpacks run test:node`
- `npm --workspace skillpacks run build:check`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git diff --cached --check`
- `./publish.sh --dry-run patch`

### Review/results

- Restored the failed `0.1.15` package and manifest bump to `HEAD` before implementing the release hardening.
- Added pre-bump target-version computation in a temporary package copy and preflighted both package names before source mutation.
- Extended `prepublish-auth-check.mjs` with package/version overrides and token-aware `auth-type=web` rejection before `npm whoami`.
- Added `INT`, `TERM`, and `HUP` handling so cleanup ignores repeated interrupts while restoring release files.
- Added regression coverage for web-auth/no-token preflight, token pass-through, first-publish interruption rollback, repeated interrupt during cleanup, existing first-publish failure rollback, and `--current` recovery paths.
- Post-commit `./publish.sh --dry-run patch` passed for `0.1.15`; cleanup restored both package and manifest versions to `0.1.14`.

## Recent Completion - Refresh Package Manifest For Interrogation Split

### Plan

- [x] Check local release posture, published versions, and current package metadata.
- [x] Regenerate `packages/skillpacks/dist/skillpacks-manifest.json`.
- [x] Rerun package build/check and focused package tests.
- [x] Document results, commit, and push the manifest fix on `master`.

### Verification

Passed:

- `npm --workspace skillpacks run build:check`
- `npm --workspace skillpacks run test:node`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git diff --cached --check`

### Review/results

- `skillpacks` and `@glexcorp/gskp` are both published at `0.1.14`; next patch release would be `0.1.15`.
- `npm --workspace skillpacks run build:check` initially failed because `packages/skillpacks/dist/skillpacks-manifest.json` is stale after regenerated interrogation bundles.
- Regenerated the manifest; the diff updates the package source fingerprint, `upgrade-interrogation-pages` active versions to `v0.2`, content hashes, and `v0.1` archive listings.
- Reran `npm --workspace skillpacks run build:check` in isolation after manifest regeneration and it passed.
- `npm --workspace skillpacks run test:node` passed with 155 tests.

## Recent Completion - Separate Visible And Agent Recommended Answers

### Execution Profile

- Parallel mode: serial
- Rationale: canonical convention, generated bundles, audit behavior, fixtures, and upgrade-skill versioning all share the same interrogation-page contract and should be changed in one lane.

### Plan

- [x] Capture the visible `investigate` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect current interrogation convention, generated `INTERROGATION-PAGE.md` bundles, audit script, layer1 tests, and upgrade skill mirrors.
- [x] Update the canonical convention so visible `data-recommended-answer` text is separate from hidden `data-agent-recommended-answer` payload text.
- [x] Update canonical JavaScript/YAML guidance to apply and compile the hidden agent payload while retaining backward-compatible fallback behavior.
- [x] Regenerate generated interrogation-page bundles from the canonical convention.
- [x] Extend active-page audit behavior and layer1 fixtures/tests to require a hidden agent answer per open question.
- [x] Archive and bump mirrored `upgrade-interrogation-pages` skills to `v0.2`, preserving/creating hidden agent payloads during upgrades.
- [x] Run required validation, inspect generated text, document results, commit, and push on the primary branch.

### Acceptance Criteria

- Every canonical `data-open-question` example includes visible `data-recommended-answer`, hidden `data-agent-recommended-answer`, existing confidence/clarify/apply/input attributes, and clear guidance for the two payload roles.
- `Apply recommended` fills `data-open-input` from the nearest hidden `data-agent-recommended-answer`, falling back to `data-recommended-answer` only for transition compatibility.
- Compiled YAML guidance records both `recommended_answer` and `agent_recommended_answer` for each `open_answers` entry.
- Active interrogation-page audits fail when an open question lacks a hidden agent answer or the agent answer is not hidden by an accepted convention.
- Generated `INTERROGATION-PAGE.md` bundles match the canonical convention.
- Mirrored `upgrade-interrogation-pages` skills are archived from `v0.1`, bumped to `v0.2`, and describe preserving/creating the hidden agent payload.

### Verification

Passed:

- `node scripts/upgrade-interrogation-page.mjs --check`
- `node scripts/audit-interrogation-pages.mjs`
- `pnpm --dir tests exec vitest run --project layer1 layer1/audit-interrogation-pages.test.ts layer1/upgrade-interrogation-pages.test.ts`
- `scripts/skill-versions.sh --missing`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-mirror-parity-audit.sh`
- `node scripts/audit-task-docs.mjs`
- `node scripts/skill-convention-bundle-audit.mjs`
- `git diff --check`
- Manual inspection of generated convention text for visible recommendation guidance and hidden agent answer-shaped payload guidance.

Review/results:

- The plan's root cause was confirmed: `data-recommended-answer` served both as visible user guidance and the value copied into open-answer textareas/YAML.
- The canonical convention now requires visible `data-recommended-answer` plus hidden `data-agent-recommended-answer` in every `data-open-question` block.
- The Apply recommended handler now reads hidden `data-agent-recommended-answer` first, including hidden input `value` payloads, and falls back to `data-recommended-answer` only during transition.
- Compiled YAML guidance now records `recommended_answer`, `agent_recommended_answer`, and `agent_confidence` per open answer.
- `scripts/audit-interrogation-pages.mjs` now fails missing or visible `data-agent-recommended-answer` payloads, accepts the documented hidden conventions, and counts open-question/recommended markers by opening tag to avoid selector-string false positives.
- Layer1 coverage proves missing hidden payload failure, visible payload failure, accepted hidden conventions, and script-selector non-counting.
- Mirrored `upgrade-interrogation-pages` skills were archived at `v0.1`, bumped to `v0.2`, and updated to preserve/create hidden agent payloads.
- Advisory task status from `node scripts/audit-task-docs.mjs`: `tasks/manual-todo.md` has 4 unchecked manual advisory items and `tasks/recurring-todo.md` has 2 unchecked recurring advisory items; none are promoted into active work.
