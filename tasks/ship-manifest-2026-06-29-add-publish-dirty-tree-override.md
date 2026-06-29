# Ship Manifest - Add Publish Dirty Tree Override

## User goal

Implement the supplied plan to add an explicit `--allow-dirty-tree` escape hatch to `publish.sh` while keeping default publishing strict and preventing uncommitted package-impacting changes from entering a release.

## Changed files

Included in this ship boundary:

- `publish.sh`
- `packages/skillpacks/test/publish-recovery.test.mjs`
- `prompts/exec/skill-prompt-20260629-003310-allow-dirty-tree.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-29-add-publish-dirty-tree-override.md`

Pre-existing dirty files excluded from this ship boundary:

- `packages/skillpacks/package.json`
- `packages/skillpacks/dist/skillpacks-manifest.json`

## Per-file purpose

- `publish.sh`: Adds `--allow-dirty-tree`, dirty-path classification, grouped diagnostics, and the non-release dirty-path continuation warning.
- `packages/skillpacks/test/publish-recovery.test.mjs`: Extends the mocked publish harness and adds regression coverage for dirty-tree behavior and flag parsing.
- `prompts/exec/skill-prompt-20260629-003310-allow-dirty-tree.md`: Captures the visible `exec` invocation prompt per repository prompt-history rules.
- `tasks/roadmap.md`: Records the full implementation plan and result.
- `tasks/todo.md`: Records the current execution contract, completed checklist, verification, and review notes.
- `tasks/history.md`: Adds a session history entry for the shipped change.
- `tasks/ship-manifest-2026-06-29-add-publish-dirty-tree-override.md`: Records the quality-gate evidence and shipping boundary.

## User-goal mapping

- The new flag satisfies the explicit escape hatch requirement for known non-package dirty work.
- The release-impacting classifier satisfies the requirement to reject package inputs, bundled docs/assets, scripts, root release docs, and release metadata even when the flag is present.
- The `--current` test and script branch preserve the existing narrow recovery exception.
- The grouped diagnostics and warnings satisfy the requested operator feedback improvements.
- The publish recovery tests cover the requested default block, allowed non-release dirt, rejected package-impacting dirt, flag ordering, and unknown flag behavior.

## Tests run

- `bash -n publish.sh` - passed.
- `node --test packages/skillpacks/test/publish-recovery.test.mjs` - passed, 15/15.
- `npm --workspace skillpacks run test:node` - passed, 169/169, after rerunning serially.
- `npm --workspace skillpacks run build:check` - passed after rerunning serially.
- `node scripts/audit-task-docs.mjs` - passed with 0 failures and 0 warnings.
- `git diff --check` - passed.

An earlier parallel run of `npm --workspace skillpacks run test:node` and `npm --workspace skillpacks run build:check` failed because both commands mutate `packages/skillpacks/build`. That result was discarded as a validation-method race; serial reruns of both commands passed.

## Skipped tests

- Direct live-tree `./publish.sh --dry-run --allow-dirty-tree patch` was not run against the current working tree because it contains pre-existing release-impacting dirty metadata in `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`. The exact command shape is covered by the mocked publish recovery fixture, which isolates a controlled non-release dirty tree and verifies a successful dry run.

## Adversarial review

Review method: changed-file self-review plus targeted scans for every new flag/diagnostic surface and release-boundary classifier branch.

Findings:

- The first full validation attempt ran two build-directory-mutating commands in parallel, causing a false package-boundary/build-check failure. Fixed by rerunning those commands serially and recording the race in task docs and this manifest.
- The initial shell classifier pattern was harder to audit and duplicated one convention path. Fixed by splitting the `case` arms into readable groups.
- The test harness initially assumed npm would always be called and treated `--untracked-files=normal` as `--untracked-files=no`. Fixed by initializing the mock npm log and matching the git status flag exactly.

Accepted residual concern:

- The classifier is intentionally explicit. If future package builds add new root inputs, the classifier must be updated with the build boundary.

## Residual risk

Residual risk is limited to future package-boundary drift: a new package input path added outside `packages/skillpacks/**`, `base/**`, `packs/**`, `scripts/**`, the known bundled docs, or release-control files would need a matching classifier update. Current verification covers the present package builder inputs and release script behavior.

The pre-existing `0.1.16` package metadata bump remains dirty and is not part of this commit. That separation is safe because the exact excluded diff is limited to package version fields and was present before this task’s source edits.

## Rollback note

Revert the commit containing this manifest to remove the flag, diagnostics, and tests. Existing strict publish behavior remains the fallback if operators simply avoid passing `--allow-dirty-tree`.

## Next command

`$investigate publish 0.1.16 release metadata dirty state`
