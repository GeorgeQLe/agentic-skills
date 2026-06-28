# Ship Manifest - Fix Refresh Reload Notices

Date: 2026-06-28

## User Goal

Make no-op `skillpacks refresh` runs stop printing reload guidance when installed skill content is current and only `.agentic-skills-managed` has a stale absolute `source=` path.

## Changed Files

- `packages/skillpacks/src/cli/lifecycle.mjs`
- `packages/skillpacks/test/lifecycle.test.mjs`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `prompts/exec/skill-prompt-20260628-193318-fix-refresh-reload-notices.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-28-fix-refresh-reload-notices.md`

## Per-File Purpose

- `lifecycle.mjs`: separates content-visible install changes from marker-only metadata rewrites and updates dry-run planning for source-path-only drift.
- `lifecycle.test.mjs`: covers real refresh marker rewrites without reload notices and all-project dry-run source-path-only drift.
- `skillpacks-manifest.json`: refreshes stale generated YouTube skill metadata required for package `build:check`.
- `prompts/exec/...`: records the visible `exec` invocation per project prompt-history policy.
- `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`: record plan, results, and project history.
- This manifest: documents the exact shipping boundary and verification.

## User-Goal Mapping

- Marker-only source path drift: handled by rewriting the marker when `source_version` and `source_sha` match.
- No reload notice for no-op refresh: `changed` remains false for marker-only rewrites, so refresh does not call `printSessionReloadNotice()`.
- Preserve real notices: content installs/updates, pinned symlink changes, removals, and config changes still return visible changes.
- Dry-run behavior: expected source-path-only drift targets are not counted as proposed updates or removals.

## Tests Run

- `npm --workspace skillpacks test -- lifecycle` (failed: workspace has no `test` script)
- `node --test packages/skillpacks/test/lifecycle.test.mjs` (57/57 pass)
- `node packages/skillpacks/scripts/build-skillpacks-manifest.mjs`
- `npm --workspace skillpacks run build:check` (passed after manifest regeneration)
- `npm --workspace skillpacks run test:node` (155/155 pass)
- `node scripts/audit-task-docs.mjs` (passed)
- `git diff --check` (passed)

## Skipped Tests

- No relevant executable checks were skipped.
- The exact requested `npm --workspace skillpacks test -- lifecycle` command is unavailable because the workspace exposes `test:node`, not `test`; the lifecycle file was run directly instead.

## Adversarial Review

- Checked same-version/same-hash marker drift: marker rewrites in place, no skill directory delete/copy, no install/update line, no reload notice.
- Checked content update path: stale hashes still remove and recopy the managed skill root and return a visible change.
- Checked pinned-version path: archive sources still use symlink replacement and return visible changes.
- Checked dry-run planning: expected targets with missing old marker sources are treated as refresh-reconcilable, while non-expected missing-source roots remain removable.
- Checked removal path: `pruneOrphanedSkillRoots()` still feeds reload guidance for actual removals in real refresh.

## Residual Risk

- The metadata-only fast path trusts the recorded `source_version` and `source_sha`, matching the existing doctor/refresh drift model. A manually edited installed skill whose marker still claims the current hash remains outside this detection model.
- The manifest regeneration includes stale YouTube skill metadata from prior committed skill changes; it is unrelated to this fix but required for `build:check`.

## Rollback Note

Revert this commit to restore the previous behavior. If rolling back manually, restore `lifecycle.mjs`, `lifecycle.test.mjs`, and task/prompt artifacts together; the generated manifest can be regenerated from the desired index with `node packages/skillpacks/scripts/build-skillpacks-manifest.mjs`.

## Next Command

`$brainstorm`
