# Ship Manifest - Publish Auth Failure Rollback

Date: 2026-06-28
Branch: `master`

## Scope

- Investigated the repeated `./publish.sh patch` failure after npm auth preflight returned E401.
- Fixed the retry blocker where `publish.sh` left source package metadata bumped to `0.1.14` after a pre-publish failure.
- Preserved the existing partial-publish recovery contract: once a real `npm publish` starts, the bumped source version remains available for `./publish.sh --current`.
- Restored the current failed-run source metadata back to `0.1.13`.

## Changed Files

- `publish.sh`
- `packages/skillpacks/test/publish-recovery.test.mjs`
- `CHANGELOG.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/lessons.md`
- `prompts/session-triage/skill-prompt-20260628-173247-publish-auth-dirty-tree.md`

## Root Cause

`publish.sh` created a restore snapshot only for `--dry-run` runs. In real publish mode, it bumped `packages/skillpacks/package.json`, regenerated `packages/skillpacks/dist/skillpacks-manifest.json`, staged package directories, and then ran npm auth preflight. When auth preflight failed before any publish command, the cleanup trap removed temp staging directories but did not restore the source metadata. The next `./publish.sh patch` then failed immediately at the clean-tree guard.

## Fix

- Added real-run source metadata snapshots for non-`--current` publishes.
- Updated cleanup to restore source metadata when the script exits nonzero before the first real publish begins.
- Added `PUBLISH_STARTED` tracking so failures after a real publish begins do not erase partial-publish recovery state.
- Added a focused regression test that mocks `npm whoami` failure and asserts no publish call occurs and both source metadata files match the pre-run contents.

## Verification

Passed:

- `node --test packages/skillpacks/test/publish-recovery.test.mjs` (4/4)
- `npm --workspace packages/skillpacks run test:node` (151/151)
- `node scripts/audit-task-docs.mjs` (0 failures, 0 warnings)
- `git diff --check`

Sanity:

- `packages/skillpacks/package.json` version: `0.1.13`
- `packages/skillpacks/dist/skillpacks-manifest.json` package version: `0.1.13`

Skipped:

- Real npm publish. The npm auth session is still the user's manual blocker, and publishing requires explicit user instruction.

## Next Work

Complete npm login/2FA as `glexcorp`, then run the real `0.1.14` publish only when explicitly requested.
