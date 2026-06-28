# Ship Manifest - Publish Retry After Web Auth Failure

Date: 2026-06-28
Branch: `master`

## Scope

- Fixed the remaining `./publish.sh patch` retry failure where npm web auth fails inside the first `npm publish` command before any package is published.
- Restored the current stranded local `0.1.14` metadata bump back to `0.1.13`.
- Preserved `./publish.sh --current` recovery for the partial-publish case where `skillpacks@$VERSION` succeeds and `@glexcorp/gskp@$VERSION` fails later.

## Changed Files

- `publish.sh`
- `packages/skillpacks/test/publish-recovery.test.mjs`
- `tasks/lessons.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-28-publish-retry-web-auth-failure.md`

## Root Cause

The prior rollback fix treated "first publish command invoked" as the irreversible boundary. `publish.sh` set `PUBLISH_STARTED=1` immediately before `npm publish "$SKILLPACKS_STAGE"`, so cleanup preserved the bumped source metadata even when npm web auth failed inside that first publish command and no package reached the registry.

## Fix

- Moved `PUBLISH_STARTED=1` to after the first `npm publish "$SKILLPACKS_STAGE"` command returns successfully.
- Extended the publish recovery test mock with a registry state file so tests can assert whether a publish attempt actually created a package version.
- Added a real `patch` regression for first-publish web-auth failure that proves the publish was attempted once, no mock registry entry exists, and both source metadata files are restored.
- Updated the durable release rollback lesson to use "first package publish completed successfully" as the preservation boundary.

## Verification

Passed:

- `node --test packages/skillpacks/test/publish-recovery.test.mjs` (5/5)
- `npm --workspace packages/skillpacks run test:node` (152/152)
- `node scripts/audit-task-docs.mjs` (0 failures, 0 warnings)
- `git diff --check`
- `git diff --cached --check`

Registry sanity:

- `npm view skillpacks@0.1.14 version` returned E404.
- `npm view @glexcorp/gskp@0.1.14 version` returned E404.

Source metadata sanity:

- `packages/skillpacks/package.json` version: `0.1.13`
- `packages/skillpacks/dist/skillpacks-manifest.json` package version: `0.1.13`
- `git status --short` no longer shows either release metadata file dirty.

## Next Work

Run the real `0.1.14` publish only when explicitly requested.
