# Changelog

Public package-level changelog for the `skillpacks` npm package and its scoped alias package `@glexcorp/gskp`.

This file tracks npm package releases: CLI behavior, package contents, bundled skill snapshots, and release-process changes. Individual skills keep their own `CHANGELOG.md` files next to each `SKILL.md`; those files remain the source of truth for skill-specific behavior changes.

Keep this file updated before every npm package publish.

## [Unreleased]

## [0.1.11] - 2026-06-23

Prepared for publish for both `skillpacks` and `@glexcorp/gskp`.

Release-state note: source `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` intentionally remain at the last published version, `0.1.10`, so the real `./publish.sh patch` command can bump and publish `0.1.11` from a clean tree.

### Changed

- `skillpacks install` and install-argument resolution now defensively ignore any manifest skill entry whose path is under `archive/**`, preventing stale or malformed manifests from installing archived framework/orchestrator subskills as top-level project skills.
- `skillpacks refresh --all` and `skillpacks refresh --all --dry-run` now flag legacy skillpacks-owned user-home installs under `~/.claude/skills` and `~/.codex/skills`, continue scanning project roots, and exit nonzero with cleanup guidance.
- `skillpacks uninstall-global --reinstall-base` now removes legacy skillpacks-owned user-home installs, then enables and refreshes project-local base skills for discovered `.agents/project.json` roots below the current directory; when none are found, it initializes the current directory.
- `skillpacks uninstall-global` now removes legacy skillpacks-owned user-home installs whose managed markers point at retired `global/claude`, `global/codex`, or pack-era `global` source paths, while still leaving markerless user skills and foreign managed directories untouched.
- `skillpacks refresh` now prints session reload guidance only when project-local skill roots are installed, updated, or removed, and avoids no-op `.agents/project.json` update noise.
- `skillpacks refresh --all` now repeats failed project paths and emitted error messages in the final summary.
- `skillpacks refresh --all --dry-run` now uses a refresh-specific planner with per-project proposed install/update/remove counts, affected skill targets, failures, skipped unmanaged roots, and an aggregate `Safe to run` verdict.

### Verification

- Registry state before release prep confirmed both package names remain published at `0.1.10`.
- Release-prep verification passed in source so far: package tests, package verification, and diff hygiene. Clean-tree dry-run patch publish is the final gate before push.
- The intended real release command is `./publish.sh patch`, which will bump the package artifact from `0.1.10` to `0.1.11` before staging and publishing both npm package names.

## [0.1.10] - 2026-06-22

Prepared for publish for both `skillpacks` and `@glexcorp/gskp`.

### Fixed

- Corrected the active `consolidate-prototypes` Claude and Codex contracts so they actually write the AFPS graduation document required by the v0.16 rename/graduation release notes.
- Corrected the active `spec-interview` Claude and Codex prototype gates so production spec work requires the consolidated prototype, AFPS graduation readiness, and no blocking post-prototype cleanup items.

### Changed

- Refreshed the bundled package snapshot and Skills Showcase generated data after the product-design graduation contract correction.

### Verification

- Publish-prep verification passed in source: package tests, package verification, archive/version audits, mirror/base parity audits, generated-data validation, convention bundle audit, and `./publish.sh --dry-run patch`.
- The intended release command is `./publish.sh patch`, which will bump the package artifact from `0.1.9` to `0.1.10` before staging and publishing both npm package names.
- Dry-run note: npm CLI emitted `Cannot read properties of null (reading 'matches')` during `npm version`, but `publish.sh` detected that `0.1.10` was written, continued with verified manifest/package staging, and completed the dry run successfully.

## [0.1.9] - 2026-06-22

Published for both `skillpacks` and `@glexcorp/gskp`.

### Added

- Added product-design convention updates for design-tree HTML-first canonical writes and state-model/UX-variation flow state, including refreshed bundled `DESIGN-TREE-LOOP.md` snapshots.
- Added the interrogation-page convention bundle path, generator, active-skill bundles, and package audit coverage.
- Added the convention-bundle registry and package-gated audit coverage so declared skill convention bundles are checked across source, generated bundles, and npm staging.

### Changed

- Refreshed the bundled skill snapshot after Pattern A research-loop handoff wording, benchmark/self-improvement updates, design-tree/state-model work, interrogation-page convention work, and convention-bundle packaging.
- Hardened publish recovery and dry-run behavior so `./publish.sh --current` supports partial-publish recovery and dry runs prove npm auth/access before a real publish.
- Updated Pattern A review-pending handoffs so `## Next Work` owns review/compile/paste instructions and the command section only names the parent invocation for compiled YAML.

### Verification

- Release gates passed before publish: `npm --workspace packages/skillpacks run test:node`, `npm run skillpacks:verify`, `node scripts/skill-convention-bundle-audit.mjs`, `node scripts/audit-alignment-pages.mjs`, and `node scripts/audit-interrogation-pages.mjs`.
- npm registry checks showed both package `latest` dist-tags still at `0.1.8`, and `skillpacks@0.1.9` / `@glexcorp/gskp@0.1.9` unavailable before publish.
- Post-publish npm metadata confirms both `skillpacks` and `@glexcorp/gskp` latest versions are `0.1.9`.
- Published-package smoke checks passed for `@glexcorp/gskp@0.1.9` via `npx @glexcorp/gskp@0.1.9 list` and for `skillpacks@0.1.9` via clean temp install and `./node_modules/.bin/skillpacks list`.

## [0.1.8] - 2026-06-18

Published for both `skillpacks` and `@glexcorp/gskp`.

### Fixed

- `refresh --all` (and `status --all` / `doctor --all`) now reach projects nested under a scan root that is itself a project. `discoverProjectRoots` previously returned immediately when the scan root contained a `.agents/project.json`, pruning the entire subtree and reporting "1 project(s)". The root is still recorded, but discovery now keeps descending from depth 0; discovered *child* projects (depth > 0) still absorb their own nested directories.

### Changed

- Refreshed the bundled package snapshot. `user-flow-map` (v0.9 → v1.0, claude + codex) makes its post-approval downstream handoff fresh-session aware: when the compiled approval YAML is consumed in an already-fresh session (the page-building conversation is no longer in context), the skill no longer prompts another context clear — it defaults to continue-now and enters the next skill's own required gates. This is driven by a new **Fresh-session handoff** rule in the shared alignment-page convention, which is bundled into every skill's `ALIGNMENT-PAGE.md` snapshot.

## [0.1.7] - 2026-06-18

Published for both `skillpacks` and `@glexcorp/gskp`.

### Changed

- Refreshed the bundled package snapshot. Pattern A research orchestrators (`competitive-analysis`, `customer-discovery`, `positioning`, `journey-map`) and their framework subskills now use a `## Continue In A Fresh Session` review-step handoff in place of `## Recommended Next Command After Compiling YAML`: review pages instruct the user to compile the bottom YAML and paste it into a fresh session, which then emits the real `## Recommended Next Command` after writing the artifact.

### Verification

- npm metadata confirms `skillpacks@0.1.7` and `@glexcorp/gskp@0.1.7` are both published with latest dist-tag `0.1.7`. The release run's `verify:published` reported a transient registry-propagation lag for the scoped alias immediately after publish; a re-check shows both packages at version parity.

## [0.1.6] - 2026-06-17

Published for both `skillpacks` and `@glexcorp/gskp`.

### Changed

- Refreshed the bundled package snapshot after release-process, prompt-history, skill parity, and routing-contract updates.
- Restored same-version npm release parity for the canonical package and scoped alias.

### Verification

- Published-package verification passed for `skillpacks@0.1.6` and `@glexcorp/gskp@0.1.6`, including metadata, install, remove, pin/unpin, deck install, and unsupported direct version syntax smoke checks.

## [0.1.5] - 2026-06-16

Published for `skillpacks`. No matching `@glexcorp/gskp@0.1.5` publication is present in npm metadata as of 2026-06-17; the scoped alias latest remains `0.1.4`.

### Fixed

- Prevented `skillpacks refresh` and pack installs from creating top-level duplicate roots for nested framework skills. Nested framework skills remain available inside their parent orchestrator directories, while only installable parent skills become top-level managed roots.
- Added refresh pruning for old repo-managed duplicate framework roots created by earlier package versions, while preserving unmanaged local directories.

### Changed

- Tightened npm package boundaries so the tarball includes runtime files, base skills, packs, alignment runtime assets, README, and license, but excludes repository docs, task files, prompts, app sources, tests, `AGENTS.md`, and `CLAUDE.md`.
- Moved the packaged alignment-page convention fallback to `assets/alignment-page-convention.md` while preserving source-checkout behavior that reads `docs/alignment-page-convention.md`.

### Verification

- Published-package verification confirmed `skillpacks@0.1.5` as npm latest, passed package smoke tests, and reproduced the duplicate-framework bug on `0.1.4` before confirming it was fixed on `0.1.5`.
- First git release tag created: `v0.1.5`.

## [0.1.4] - 2026-06-16

Published for both `skillpacks` and `@glexcorp/gskp`.

### Added

- Added version-aware CLI status output for human-facing commands, including latest-version availability.
- Added install/update/no-op lifecycle messages that distinguish fresh installs, updates, and unchanged managed roots.
- Added tests for update-check formatting, lifecycle output, and current-version publish flow.

### Changed

- Added `publish.sh --current` support so release publishing can preserve an already-committed package/manifest version instead of always running a new version bump.

## [0.1.3] - 2026-06-15

Published for both `skillpacks` and `@glexcorp/gskp`.

### Changed

- Refreshed the bundled skill and documentation snapshot after several workflow-contract updates.
- Included package-visible documentation updates such as the prototype session loop convention in the release snapshot.
- Continued the dual-package release line for `skillpacks` and `@glexcorp/gskp`.

### Notes

- Registry metadata for this release points at commit `dbcb3204`, which is a documentation-only commit. No distinct package-specific CLI source change was identified for this version beyond the bundled snapshot update.

## [0.1.2] - 2026-06-13

Published for both `skillpacks` and `@glexcorp/gskp`.

### Added

- Added dual npm publish automation so `skillpacks` and `@glexcorp/gskp` can be staged and published from the same built artifact at the same version.
- Added `gskp` as a supported binary alias alongside `skillpacks`.

### Changed

- Rebranded user-facing package docs around `gSkillPacks` / `gskp` while keeping `skillpacks` as the primary npm package.
- Renamed packaged `global/` skill roots to `base/` and continued the move from user-home global installs toward project-local base skills.
- Shipped Node-doctor parity and related package metadata refreshes to npm users.

## [0.1.1] - 2026-06-12

Published for `skillpacks`. `@glexcorp/gskp@0.1.1` was published on 2026-06-13 when the scoped alias line was introduced.

### Added

- Added project-local base initialization through the npm CLI.
- Added exact skill resolution for installs.
- Added published-package verification tooling.
- Added npm prepublish auth/version guard wiring for future real publishes.

### Fixed

- Included required CLI module and alignment-page runtime files in the package boundary after validation found missing release contents.
- Refreshed package manifest artifacts for the `0.1.1` release snapshot.

## [0.1.0] - 2026-06-10

Published for `skillpacks` only. The scoped alias package did not exist yet.

### Added

- Initial public npm package release.
- Packaged the markdown skill library, base install support, project-local pack installation, individual skill installation, deck installation, refresh, doctor, and status workflows.
- Published MIT package metadata, GitHub repository links, README, license, package manifest, base skills, packs, and runtime scripts.
- Added post-publish smoke verification for fresh temp-project installs from npm.

### Notes

- `skillpack` singular is unrelated; this project uses `skillpacks` plural and the later scoped alias `@glexcorp/gskp`.
