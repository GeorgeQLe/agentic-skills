# Ship Manifest - Publish Final Verification ETARGET Recovery

Date: 2026-06-28
Branch: `master`

## User Goal

Fix the failed-after-publish state where both `skillpacks@0.1.14` and `@glexcorp/gskp@0.1.14` exist on npm, but final published-package smoke verification can fail transiently with npm `ETARGET` while `npx --package` resolves fresh package metadata.

## Changed Files

- `CHANGELOG.md`
- `publish.sh`
- `packages/skillpacks/package.json`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `packages/skillpacks/scripts/verify-published-package.sh`
- `packages/skillpacks/test/publish-recovery.test.mjs`
- `packages/skillpacks/test/verify-published-package.test.mjs`
- `prompts/exec/skill-prompt-20260628-182024-fix-publish-final-verification-etarget.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-28-publish-final-verification-etarget.md`

## Per-File Purpose

- `CHANGELOG.md`: records the already-published `0.1.14` source-state update and tracks the post-publication verifier/recovery fix under `[Unreleased]`.
- `publish.sh`: makes `--current` treat "both packages already published" as a verification recovery path, skipping auth and publish commands before rerunning final published-package verification.
- `packages/skillpacks/package.json`: preserves the current post-publish source package version `0.1.14`.
- `packages/skillpacks/dist/skillpacks-manifest.json`: preserves the current post-publish manifest package version `0.1.14`.
- `packages/skillpacks/scripts/verify-published-package.sh`: routes published CLI smoke commands through bounded retry handling for npm propagation errors and uses `npx --prefer-online`.
- `packages/skillpacks/test/publish-recovery.test.mjs`: covers real `--current` recovery when both package names are already published.
- `packages/skillpacks/test/verify-published-package.test.mjs`: covers `npx` propagation retry and non-propagation failure behavior.
- `prompts/exec/...`: captures the visible user invocation for this skill run.
- `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`: record the active plan, review results, and completed work.
- `tasks/ship-manifest-...`: this shipping record.

## User-Goal Mapping

- Retry final smoke verification ETARGET: `verify-published-package.sh` retries only npm propagation-style `npx` failures.
- Preserve real failure visibility: verifier tests prove non-propagation CLI failures fail without retry masking.
- Recover current failed-after-publish state: `publish.sh --current` skips both publish commands when both packages already exist and proceeds to final verification.
- Preserve partial-publish recovery: existing alias-only recovery test still proves only `@glexcorp/gskp` would publish when `skillpacks` exists and the alias is missing.

## Tests Run

Executable verification:

- `node --test packages/skillpacks/test/verify-published-package.test.mjs packages/skillpacks/test/publish-recovery.test.mjs` (9/9)
- `npm --workspace packages/skillpacks run test:node` (154/154)
- `bash -n publish.sh packages/skillpacks/scripts/verify-published-package.sh`
- `npm view skillpacks@0.1.14 version --workspaces=false` (`0.1.14`)
- `npm view @glexcorp/gskp@0.1.14 version --workspaces=false` (`0.1.14`)
- `./publish.sh --current` (skipped auth/publish because both packages already exist; rebuilt, verified package tests, and passed published smoke verification for both package names)
- `npm --workspace packages/skillpacks run build:manifest:check`

Documentation and hygiene:

- `node scripts/audit-task-docs.mjs` (0 failures, 0 warnings)
- `git diff --check`
- `git diff --cached --check`

## Skipped Tests

- Did not create or push `v0.1.14` in this pass. The code fix postdates the immutable npm `0.1.14` artifacts, so choosing a release tag target needs an explicit release-source policy decision.

## Adversarial Review

- Checked that the retry detector is scoped to npm resolution metadata (`ETARGET`, `notarget`, or `No matching version found for $NPM_SPEC`) rather than arbitrary CLI failures.
- Verified the first smoke command is retried and succeeds after a mocked `ETARGET`, while a mocked CLI failure after package resolution exits immediately with no retry text.
- Verified the partial-publish `--current` path still publishes only the alias package in dry-run mode.
- Verified live npm registry state matches the user's failed-after-publish premise for both package names at `0.1.14`.
- Verified real `./publish.sh --current` skips publish actions and completes both final published-package smoke checks.

## Residual Risk

- `ETARGET` matching is intentionally broad for npm output containing that code. If the published CLI itself prints npm-looking `ETARGET` text for an unrelated reason, it could receive bounded retries before failing.
- The `0.1.14` npm artifacts were already published before this fix, so the verifier/recovery code change ships in source now and in the next npm package release.
- No release tag was created; `v0.1.14` remains a follow-up release bookkeeping decision.

## Rollback Note

Revert the shipping commit to restore the prior behavior. If keeping the published `0.1.14` source-state commit while backing out only the verifier/recovery code, revert the script/test/changelog/task-doc portions and preserve the package version fields.

## Next Command

If release tags are maintained for npm publishes, decide the correct `v0.1.14` tag target before creating and pushing the tag.
