# Current Task State

## Status

Active implementation: none.

Project: `agentic-skills`.
Last completed task: Add Publish Dirty Tree Override.
Last closeout: `publish.sh` now supports an explicit `--allow-dirty-tree` override for non-release dirty tracked paths, while default publishing and `--current` recovery remain strict around package-impacting dirt.

## Recent Completion - Add Publish Dirty Tree Override

### Goal

Keep `./publish.sh` strict by default while adding an explicit `--allow-dirty-tree` escape hatch that permits only non-release dirty tracked paths to coexist with a release or dry run.

### Execution Profile

- Parallel mode: serial edits, parallel reads/verifications where independent.
- Rationale: `publish.sh` flag parsing, dirty-tree classification, diagnostics, and release recovery behavior share one safety boundary and should be updated atomically.

### Plan

- [x] Capture the visible `exec` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect `publish.sh`, existing publish recovery tests, package metadata, and current dirty release files without overwriting unrelated work.
- [x] Add `--allow-dirty-tree` parsing, usage text, tracked/untracked dirty summary output, and release-impacting path classification.
- [x] Preserve strict default behavior and preserve the narrow `--current` release-metadata recovery exception.
- [x] Add focused tests for default tracked dirty blocking, allowed non-release dirty paths with untracked files, rejected release-impacting dirty paths, supported flag ordering, and unknown flag rejection.
- [x] Run the requested dry-run/fixture verification, package tests, package build check, task-doc audit, and diff hygiene checks.
- [x] Document review/results, produce a ship manifest, commit, and push intended changes on the primary branch if safe.

### Acceptance Criteria

- `./publish.sh patch` still fails on any tracked dirty path by default.
- `./publish.sh --allow-dirty-tree patch` and dry-run variants continue only when every dirty tracked path is outside the package/release boundary.
- Dirty package or release inputs under `packages/skillpacks/**`, `base/**`, `packs/**`, `scripts/**`, package-bundled docs/assets, `README.md`, `CHANGELOG.md`, or `LICENSE` still fail with the override.
- `--current` recovery keeps its existing narrow release-metadata exception and is not broadened by `--allow-dirty-tree`.
- Diagnostics group release-impacting paths, non-release paths, and untracked paths, and warn when allowed dirty changes are excluded from the release.

### Verification Plan

- `./publish.sh --dry-run --allow-dirty-tree patch` from a controlled dirty non-package state or mocked fixture.
- `npm --workspace skillpacks run test:node`
- `npm --workspace skillpacks run build:check`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

### Verification

Passed:

- `bash -n publish.sh`
- `node --test packages/skillpacks/test/publish-recovery.test.mjs`
- `npm --workspace skillpacks run test:node`
- `npm --workspace skillpacks run build:check`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

Validation note:

- A parallel run of `npm --workspace skillpacks run test:node` and `npm --workspace skillpacks run build:check` failed because both commands mutate `packages/skillpacks/build`; rerunning the commands serially passed.
- The direct root `./publish.sh --dry-run --allow-dirty-tree patch` path is covered by the mocked publish recovery fixture because the live tree still contains a pre-existing release-metadata bump at `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`.

### Review/results

- Added `--allow-dirty-tree` to `publish.sh` with usage text and parsing that works before or after the version target.
- Kept default tracked dirty-tree behavior strict: blocked runs still print `git status --short` and fail.
- Added dirty-tree summaries grouping release-impacting tracked paths, non-release tracked paths, and untracked paths.
- Classified package/release-impacting paths conservatively, including `packages/skillpacks/**`, `base/**`, `packs/**`, `scripts/**`, package-bundled convention/social docs, root release docs, package/workspace metadata, npm auth files, and `publish.sh`.
- Allowed the override only for non-release tracked dirt on normal release targets; `--current` recovery still accepts only the existing release-metadata exception.
- Extended publish recovery tests to cover default blocking, allowed non-release dirt plus untracked files, rejected package-impacting dirt, flag ordering, `--current` isolation, and unknown flags.
- Preserved the pre-existing `0.1.16` package metadata bump as unrelated dirty work and excluded it from this ship boundary.

## Recent Completion - Enforce Pending BIP Before Active Final Approval

### Plan

- [x] Capture the implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect the current BIP checkpoint audit, alignment-page convention, generated bundle behavior, and layer1 fixtures.
- [x] Add an audit helper that detects active final artifact approval gates from gate/question containers carrying final-artifact, canonical-artifact, or artifact-approval metadata without depending only on `data-required="true"`.
- [x] In the linked-BIP branch, keep the existing reference and handoff checks and fail when linked BIP coexists with an active final artifact approval gate.
- [x] Update the canonical alignment-page convention to allow linked-BIP handoff text and read-only final-approval preview content, while blocking active final artifact approval controls until BIP is approved or narrowly not-applicable.
- [x] Regenerate generated `ALIGNMENT-PAGE.md` bundles from the canonical convention.
- [x] Update layer1 fixtures for linked-BIP failure, linked-BIP read-only preview success, and approved-BIP active final approval success.
- [x] Run the requested audit, generator, and focused layer1 verification; document results, commit, and push on the primary branch.

### Acceptance Criteria

- A Stage 2 review page with `data-bip-status="linked"` and an active final artifact approval gate fails `scripts/audit-alignment-pages.mjs`.
- Linked-BIP pages may still include a visible BIP handoff and read-only final artifact approval preview wording.
- A Stage 2 review page with `data-bip-status="approved"` and `bip_approval_status: ready-for-agent-review` may expose active final artifact approval controls.
- A Stage 2 review page with a narrow `data-bip-status="not-applicable"` reason may expose active final artifact approval controls.
- Generated alignment-page convention bundles match `docs/alignment-page-convention.md`.

### Verification Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/audit-alignment-pages.mjs`
- `pnpm --dir tests test:layer1 -- audit-alignment-pages`
- `pnpm --dir tests test:layer1 -- ship-end-bip social-ledger-convention idea-scope-brief-approval-ordering audit-alignment-pages`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

### Review/results

- Added a final artifact approval gate detector in `scripts/audit-alignment-pages.mjs` that scans active gate/question containers for final-artifact, canonical-artifact, or artifact-approval metadata without depending on `data-required="true"`, while avoiding artifact destination/path-only metadata.
- Kept the existing linked-BIP page reference and handoff checks, then added a linked-BIP diagnostic when active final artifact approval controls are still rendered.
- Updated `docs/alignment-page-convention.md` so linked BIP checkpoints may show handoff instructions and read-only final-approval preview content, but active final artifact approval controls wait for BIP `approved` or narrowly `not-applicable`.
- Regenerated 309 generated `ALIGNMENT-PAGE.md` bundles from the canonical convention.
- Added layer1 fixtures for linked-BIP failure with an active final gate, linked-BIP success with read-only preview only, and approved-BIP success with active final approval controls.

### Verification

Passed:

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/audit-alignment-pages.mjs`
- `pnpm --dir tests test:layer1 -- audit-alignment-pages`
- `pnpm --dir tests test:layer1 -- ship-end-bip social-ledger-convention idea-scope-brief-approval-ordering audit-alignment-pages`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

## Recent Completion - Fix BIP Drafting-Mode Gate Leakage

### Goal

Prevent initial Build-In-Public channel-selection alignment pages from leaking drafting-mode or final content-approval gates before channel-selection YAML is approved, and remove the stale all-channels-not-now drafting option from selected-channel BIP draft pages.

### Plan

- [x] Capture the visible `investigate` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect the canonical alignment-page convention, generated `ALIGNMENT-PAGE.md` bundles, audit script, layer1 tests, recent history, and active/archived Alignmeant BIP page state.
- [x] Tighten `docs/alignment-page-convention.md` so the initial BIP channel-selection page requires only target-channel selection until approved channel-selection YAML is consumed.
- [x] Extend `scripts/audit-alignment-pages.mjs` with BIP gate-sequencing diagnostics for premature final gates, stale future-channel drafting wording, and stale all-channels-not-now selected-channel drafting options.
- [x] Add focused layer1 audit fixtures for passing/failing initial BIP channel-selection pages and selected-channel BIP draft pages.
- [x] Regenerate generated `ALIGNMENT-PAGE.md` bundles from the canonical convention.
- [x] Run the updated audit against Alignmeant and amend the active BIP page if it only contains the stale selected-channel drafting option.
- [x] Run required verification, document results, commit, and push on the primary branch.

### Acceptance Criteria

- Initial BIP channel-selection pages may require only the target-channel gate.
- Drafting mode, content angles, sample drafts/video ideas, tone, claim safety, and publish readiness are required only after channel-selection YAML has been approved and consumed.
- BIP pages containing the stale future-channel drafting question fail audit.
- Selected-channel BIP draft pages fail audit if the drafting-mode gate still offers the stale all-channels-remain-not-now option.
- The active Alignmeant page either passes the updated audit or is amended to remove only the stale selected-channel option.
- Generated alignment-page convention bundles match the canonical convention.

### Verification Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts layer1/alignment-gates.test.ts`
- `node scripts/audit-alignment-pages.mjs`
- `node scripts/audit-alignment-pages.mjs --root /Users/georgele/projects/tools/dev/alignmeant`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `npm --workspace skillpacks run build:check`

### Verification

Passed:

- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts layer1/alignment-gates.test.ts`
- `node scripts/audit-alignment-pages.mjs`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `npm --workspace skillpacks run build:check`

External audit:

- `node scripts/audit-alignment-pages.mjs --root /Users/georgele/projects/tools/dev/alignmeant` exits 1 because of pre-existing non-BIP drift: missing TTS and metadata on `alignment/idea-scope-brief-alignmeant.html`, plus confirmed-page control drift on older confirmed pages.
- The same external audit now reports `BIP handling: 1 Stage 2 pages, exact` after the active Alignmeant BIP page and parent checkpoint amendments.

### Review/results

- Confirmed the archived Alignmeant BIP page contained the original bug: initial channel selection also required drafting mode, content angles, sample drafts, tone, claim safety, and publish readiness, including the stale question "Which drafting mode should apply if channels are later selected?"
- Updated the canonical alignment-page convention so the initial BIP channel-selection page may require only the target-channel gate until approved channel-selection YAML is consumed.
- Added BIP gate-sequencing diagnostics to `scripts/audit-alignment-pages.mjs` for premature final gates, stale future-channel drafting wording, and stale selected-channel no-drafting options.
- Added focused layer1 fixtures for passing/failing initial BIP channel-selection pages and selected-channel BIP draft pages.
- Regenerated 309 generated `ALIGNMENT-PAGE.md` bundles.
- Amended the active Alignmeant BIP page to remove the stale all-channels-not-now drafting option and amended its parent page so the linked BIP checkpoint explicitly happens before final artifact approval.

## Recent Completion - BIP Channel Recommendations And Rankings

### Plan

- [x] Capture the visible `investigate` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Validate the current BIP target-channel language in the canonical convention, generated bundles, tests, and recent history.
- [x] Update `docs/alignment-page-convention.md` so BIP pages rank target channels, assign `recommended` / `optional` / `not-now`, preselect recommended channels for user confirmation, and treat the submitted gate as channel-selection approval only.
- [x] Preserve safety boundaries: no draft posts, video ideas, or channel-specific content before channel-selection approval; each recommendation needs source basis, fit rationale, claim risk, and non-recommended-channel rationale.
- [x] Regenerate generated `ALIGNMENT-PAGE.md` bundle files with `node scripts/upgrade-alignment-page.mjs`.
- [x] Update focused layer1 coverage for canonical and generated bundle text.
- [x] Run required verification, update `tasks/lessons.md`, document results, commit, and push on the primary branch.

### Acceptance Criteria

- BIP pages rank candidate target channels by fit using completed Stage 2 evidence.
- Each target channel has one of `recommended`, `optional`, or `not-now`.
- `recommended` channels are preselected by default but still require user confirmation and override controls.
- A submitted target-channel gate approves only channel selection; it is not final BIP approval.
- Social/channel convention files are loaded only after the selected/recommended channel set is approved.
- Channel-specific drafting remains blocked until channel-selection approval.
- Generated alignment-page convention bundles match the canonical convention.

### Verification Plan

- `node scripts/upgrade-alignment-page.mjs --check`
- `npm run test -- tests/layer1/alignment-gates.test.ts`
- `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts`
- `node scripts/audit-alignment-pages.mjs`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `npm --workspace skillpacks run build:check`

### Verification

Passed:

- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts`
- `node scripts/audit-alignment-pages.mjs`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `npm --workspace skillpacks run build:check`

Unavailable:

- `npm run test -- tests/layer1/alignment-gates.test.ts` failed because the repo root has no `test` script; `tests/package.json` owns the focused Vitest command above.

### Review/results

- Confirmed the current BIP target-channel language defaulted unapproved channels to `not-now`.
- Updated `docs/alignment-page-convention.md` so BIP pages rank candidate channels from completed Stage 2 evidence, assign `recommended` / `optional` / `not-now`, preselect recommended channels, and keep every channel overrideable.
- Made channel selection an intermediate approval response only; final BIP approval still requires later drafting-mode, angle, sample post/video idea, tone, claim-safety, and publish-readiness gates.
- Blocked draft posts, video ideas, channel-specific sample content, channel-specific convention-driven recommendations, and social convention loading until the selected/recommended channel set is approved.
- Regenerated 309 generated `ALIGNMENT-PAGE.md` bundles from the canonical convention.
- Added focused layer1 assertions for canonical and generated bundle text.
- Added a lesson for evidence-backed BIP channel recommendations and the separation between channel-selection approval and final BIP approval.

## Recent Completion - Fix Ship-End BIP Post Suggestions

### Plan

- [x] Capture the visible `investigate` invocation prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Validate the user's claim against the current `ship-end` skill contract, source pack mirrors, and recent history.
- [x] Patch the `ship-end` BIP step so enabled BIP skips only the enablement prompt, then prompts the agent to draft supported post suggestions after the wrap-up report.
- [x] Archive and bump affected `ship-end` skill mirrors if the contract changes behavior.
- [x] Add focused regression coverage or static contract checks proving enabled BIP produces post-suggestion instructions.
- [x] Run skill/version, archive, mirror, task-doc, and diff hygiene verification.
- [x] Document results, commit, and push on the primary branch.

### Acceptance Criteria

- `ship-end` still asks the one-time enablement question only when BIP is unset/off and the prompt has not been dismissed.
- When BIP is already enabled, `ship-end` no longer treats that as terminal post handling; it must draft source-safe BIP suggestions or explain why the shipped boundary has no safe public angle.
- Enabled-state output must not say only that the BIP gate was skipped.
- Claude and Codex mirrors of the `ship-end` skill remain behaviorally aligned.
- Skill versioning and archives are updated for the behavior change.
- Focused verification proves the contract contains enabled-BIP post-suggestion behavior.

### Verification

Passed:

- `pnpm --dir tests exec vitest run --project layer1 layer1/ship-end-bip.test.ts`
- `scripts/skill-versions.sh --missing`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-mirror-parity-audit.sh`
- `npm --workspace skillpacks run build:check`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git diff --cached --check`

### Review/results

- Confirmed the user report: `ship-end` v0.7 skipped the full BIP suggestion gate when `alignment.build_in_public === true`, so enabled projects got no post suggestions.
- Updated Claude and Codex `ship-end` mirrors to v0.8 so enabled BIP skips only the enablement question and then runs an enabled BIP post-suggestion path.
- Updated the shared `CLAUDE.md` BIP Suggestion Gate convention so it no longer says already-enabled BIP is a terminal skip.
- The enabled path now drafts 2-4 source-safe Build-In-Public post suggestions or states that no safe public angle exists; each suggestion must include target channel, angle, source basis, claim-safety notes, and draft text or outline.
- Archived prior v0.7 contracts, updated changelogs, regenerated package manifest metadata, and added focused layer1 regression coverage.
- Added a lesson: enabled feature gates must test the already-enabled branch, not just the opt-in prompt path.
- Deploy skipped: changed paths are skill source, package internals, tests, prompts, and task evidence, which are outside the Skills Showcase deploy surface in `tasks/deploy.md`.

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
