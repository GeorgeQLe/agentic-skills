# Current Task State

## Status

Active implementation: none.

Project: `agentic-skills`.
Last completed task: Investigate Publish 0.1.16 Release Metadata Dirty State.
Last closeout: `publish.sh --current` now supports publishing the current source version when both npm package names are unpublished, and the `0.1.16` source metadata is part of the shipped release boundary.

## Recent Completion - Investigate Publish 0.1.16 Release Metadata Dirty State

### Strategy

- Investigate strategy: General.
- Reason: the report concerned release-script behavior, git dirty-state handling, and package metadata recovery.
- Pivot: none.

### Plan

- [x] Capture the visible `investigate` invocation prompt and promote this investigation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Validate the current dirty paths, exact release metadata diffs, and whether they are pre-existing `0.1.16` work.
- [x] Inspect `publish.sh`, focused publish recovery tests, package metadata build behavior, and recent commits around dirty-tree handling.
- [x] Reproduce or model the dirty-state failure path with the existing test harness or a safe dry-run path.
- [x] Identify the root cause with file/line evidence and choose the minimal fix.
- [x] Add or update focused tests that would catch the dirty metadata behavior.
- [x] Run publish-script syntax checks, focused tests, package build/check commands as needed, task-doc audit, and diff hygiene checks.
- [x] Document investigation results, commit, and push intended changes if tracked files were intentionally modified.

### User Claims Validated

- Confirmed: the working tree had dirty `0.1.16` release metadata. The dirty paths were `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`, both changing package version `0.1.15` to `0.1.16`.
- Confirmed: `0.1.16` was not a partial-publish recovery state. `npm view skillpacks@0.1.16 version` and `npm view @glexcorp/gskp@0.1.16 version` both returned 404.
- Confirmed: normal `./publish.sh --dry-run --allow-dirty-tree patch` correctly rejected the dirty package metadata as release-impacting. The missing behavior was an explicit `--current` branch for an unpublished current source version.

### Root Cause

`publish.sh` treated `--current` only as partial-publish recovery. In the current-version registry-state branch, both package names missing immediately failed with advice to use a version target. That advice was not actionable once source metadata was already pre-bumped because version targets remain correctly blocked by dirty release metadata.

### Fix Applied

- Updated `publish.sh` so explicit `--current` supports three registry states:
  - both packages already published: skip publishing and rerun final verification;
  - `skillpacks` published and `@glexcorp/gskp` missing: recover by publishing only the alias;
  - both packages missing: publish both packages from current source metadata without running a version bump.
- Kept dirty-tree safety intact: `--current` still accepts only release metadata tracked dirt, and `--allow-dirty-tree` still rejects package/release-impacting dirty paths for normal version targets.
- Added focused regression coverage for the stranded pre-bumped state.
- Included the existing `0.1.16` package metadata in the shipped release boundary so the next publish command is explicit current-source publishing.

### Verification

Passed:

- `bash -n publish.sh`
- `node --test packages/skillpacks/test/publish-recovery.test.mjs`
- `npm --workspace skillpacks run test:node`
- `npm --workspace skillpacks run build:check`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

### Prevention

The focused recovery test now covers the exact dirty release-metadata dead end: a pre-bumped current package version where neither npm package has been published yet.

## Next Work

Publish the already-committed `0.1.16` current source version when npm auth is ready, then tag the release after publication succeeds.

## Recommended Next Command

`./publish.sh --current`
