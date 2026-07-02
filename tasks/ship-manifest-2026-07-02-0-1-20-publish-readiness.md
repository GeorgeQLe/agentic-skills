# Ship Manifest - 0.1.20 Publish Readiness

Date: 2026-07-02

## User Goal

Produce the full changelog since the last published package version and ensure the repository is packaged and ready to publish: no dirty tracked tree, release docs current, package artifacts generated, and verification recorded.

## Release Boundary

- Last published npm version: `0.1.19` for both `skillpacks` and `@glexcorp/gskp` (verified with `npm view` on 2026-07-02).
- Next prepared version: `0.1.20`.
- Source package version remains `0.1.19`; the next real publish command is `./publish.sh patch`, which owns the patch bump and publish staging.
- Commit boundary: committed changes after `b5c43bf6e` plus the existing dirty-tree skill/version/archive/documentation changes now being packaged.

## Changed Files

- `CHANGELOG.md`: adds the full `0.1.20` package-level changelog.
- `prompts/ship/skill-prompt-20260702-132035-publish-readiness.md`: captures the visible `$ship`-equivalent invocation.
- `tasks/history.md`, `tasks/todo.md`, this manifest: records the readiness pass and verification.
- Pattern A research loop docs/scripts/tests and mirrored research skills: remove duplicate review-pending `## Invoke With YAML` terminal command sections in favor of compiled YAML routing.
- Base/research/agent-work-admin/exec-loop/product-design/product-testing skill files, changelogs, archives, and generated alignment stubs: package the already-completed skill contract changes after `0.1.19`.
- Generated package/catalog artifacts: regenerated from the staged index before verification.

## Per-File Purpose

- Package changelog documents the public release delta since npm `0.1.19`.
- Prompt history satisfies repository skill-invocation traceability.
- Task docs preserve shipping state and exact validation evidence.
- Skill/archive/changelog edits preserve versioning hygiene for changed contracts.
- Generated package/catalog artifacts make npm staging reproducible from the committed source tree.

## User-Goal Mapping

- Full changelog: `CHANGELOG.md` `0.1.20` section.
- Packaged: package manifest/catalog regenerated and package verification run.
- Ready to publish: npm registry checked, source state prepared for `./publish.sh patch`, no dirty tree after commit/push.
- Everything documented: package changelog, task history, ship manifest, prompt history, skill changelogs, and archives included.

## Tests Run

- `npm view skillpacks version versions --json` and `npm view @glexcorp/gskp version versions --json`: both package names report latest `0.1.19`.
- `npm --workspace packages/skillpacks run test:node`: passed, 178/178 tests.
- `npm run skillpacks:build`: passed, staged package build with 415 skills, 42 packs, source fingerprint `a5599f53279a47a9393c9806c4e62cfe94b42db0d9c7e88a2ca0d297880a4103`.
- `node scripts/upgrade-design-tree-loop.mjs`: regenerated 22 stale design-tree loop bundles after the first package verification failure.
- `npm run skillpacks:verify`: passed after design-tree regeneration; convention bundle audit covered 415 active skills and 385 tracked bundles, manifest check passed, package staging boundary check passed, and `npm pack ./build --dry-run` produced `skillpacks-0.1.19.tgz`.
- `npm run exports:generate` and `npm run exports:check`: passed after regenerating catalog export metadata; check reported artifacts fresh.
- `bash scripts/skill-archive-audit.sh --strict`: passed, 415 skills checked, 0 violations.
- `bash scripts/skill-research-loop-handoff-audit.sh`: passed.
- `node scripts/audit-task-docs.mjs`: passed after removing unchecked review-section task items.
- `git diff --check`: passed.

## Skipped Tests

- `./publish.sh --dry-run patch` was not run in this readiness pass because npm already reports `0.1.19` as published and this pass is preparing source for the next real `./publish.sh patch` publish, not exercising npm auth/publish preflight.
- Full repository layer1 test sweep was not run; package Node tests plus focused Pattern A handoff audit cover the release-impacting behavior in this boundary.

## Adversarial Review

- The release boundary uses npm latest `0.1.19`, not the stale latest git tag `v0.1.15`.
- The dirty tree contains coherent tracked release-prep artifacts rather than unrelated app work.
- Source package version should remain at `0.1.19` so `./publish.sh patch` can own the real `0.1.20` bump.
- Initial `npm run skillpacks:verify` failure exposed stale generated design-tree loop bundles; regenerating those bundles was the correct fix because the package convention audit requires tracked bundles to match the canonical design-tree convention.
- Initial `npm run exports:check` failure exposed stale generated catalog export files; regenerating and staging the export artifacts was the correct fix because the export validator writes and compares the canonical output.
- Initial task-doc audit failure exposed checklist items inside a non-active review section; converting those to review evidence preserves the record without creating fake executable tasks.

## Residual Risk

- No npm publish was attempted; final publication still requires a real `./publish.sh patch` run in an npm-authenticated shell.
- The package source version intentionally remains `0.1.19`; this is consistent with the repo's release flow but means `0.1.20` exists as changelog/readiness intent until `publish.sh` performs the bump.

## Rollback Note

Revert the final publish-readiness commit if the prepared source package should not be included in the next release. No npm publish is performed by this pass.

## Next Command

`$exec`
