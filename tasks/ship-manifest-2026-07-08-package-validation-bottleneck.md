# Ship Manifest - Package Validation Bottleneck

## User Goal

Profile the package validation path, identify the largest reproducible local bottleneck, and patch it only if the fix is low-risk and preserves package/release correctness.

## Changed Files

- `packages/skillpacks/test/package-boundary.test.mjs`
- `packages/skillpacks/scripts/build-package.mjs`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-07-08-package-validation-bottleneck.md`
- `prompts/exec/skill-prompt-20260708-094336-package-validation-bottleneck.md`

## Per-File Purpose

- `package-boundary.test.mjs`: caches per-lane staged package snapshots so duplicate assertions reuse the validated stable/canary package state instead of rebuilding and repacking.
- `build-package.mjs`: makes shared `packages/skillpacks/build` cleanup retryable to avoid stale artifacts after transient `ENOTEMPTY` removal failures.
- `skillpacks-manifest.json`: refreshes the canary manifest source fingerprint after concurrent package input changes landed on `master`; package metadata and inventory counts are unchanged.
- `tasks/todo.md` and `tasks/roadmap.md`: record the active plan, measurements, accepted patch rationale, and verification.
- `tasks/history.md`: records the completed session.
- This manifest: records the exact shipping boundary and validation.
- Prompt log: captures the visible `exec` invocation as required by project policy.

## User-Goal Mapping

The patch targets the measured bottleneck, `skillpacks npm publish target boundary`, which was 90.318s in baseline `test:node`. The final full-suite package-boundary block passed in 45.738s while preserving one full package staging and one full `npm pack --dry-run` for each tested lane.

## Tests Run

- `npm --workspace packages/skillpacks run test:node` baseline: 147.23s, 195 tests.
- `SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run build:check` baseline: 23.69s.
- `SKILLPACKS_PACKAGE_LANE=canary npm_config_cache=/tmp/skillpacks-npm-cache npm --workspace packages/skillpacks run verify:package` baseline: 54.65s.
- `npm_config_cache=/tmp/skillpacks-npm-cache node --test packages/skillpacks/test/package-boundary.test.mjs`: passed, 60.06s.
- `npm_config_cache=/tmp/skillpacks-npm-cache npm --workspace packages/skillpacks run test:node`: passed, 103.41s, 207 tests.
- `SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run build:check`: passed, 23.55s.
- `SKILLPACKS_PACKAGE_LANE=canary npm_config_cache=/tmp/skillpacks-npm-cache npm --workspace packages/skillpacks run verify:package`: passed, 29.92s.
- `node scripts/audit-task-docs.mjs`: passed, 0 failures, 0 warnings.
- `git diff --check`: passed.

## Skipped Tests

- No required executable validation was skipped.
- `test:node` baseline and final counts differ because `master` advanced during this session with briefing-slide audit coverage. The like-for-like evidence for the patched bottleneck is the package-boundary block timing: 90.318s baseline to 45.738s final full-suite block.

## Adversarial Review

- Coverage preservation: accepted. Stable and canary lanes each still execute full staging and full `npm pack --dry-run`; only repeated assertions over the same staged state are cached.
- Release lane safety: accepted. Stable assertions still deny canary-only briefing-slide paths and text; canary assertions still require briefing-slide assets and manifest entries.
- Shared build directory risk: reduced. The test suite serializes the package-boundary suite and `build-package.mjs` retries recursive cleanup, preventing stale `build/` artifacts from contaminating later checks.
- Manifest risk: accepted. The manifest change is fingerprint-only after concurrent package input commits; package metadata remains `0.1.22-experimental.1` / `canary`.

## Residual Risk

Timing is machine-load sensitive, especially package staging and npm dry-run packing. The structural saving is still clear because the selected-release-lane assertion no longer reruns package staging or npm pack, and the full package-boundary block roughly halved.

## Rollback Note

Revert this commit to restore the previous package-boundary test behavior, non-retry build cleanup, and previous canary manifest fingerprint.

## Next Command

`$exec`
