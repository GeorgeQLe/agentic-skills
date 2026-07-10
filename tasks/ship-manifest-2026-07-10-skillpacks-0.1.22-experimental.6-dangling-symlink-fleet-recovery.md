# Ship Manifest - skillpacks 0.1.22-experimental.6 dangling-symlink fleet recovery

## User goal

Fix `skillpacks refresh` so package-managed dangling symlinks are migrated through the canonical lifecycle command, publish the fix as `0.1.22-experimental.6` without moving `latest`, prove it in a pilot, and recover the affected project fleet without committing application repositories or disturbing their existing dirty state.

## Source changes

- `packages/skillpacks/src/cli/lifecycle.mjs`: adds `lstat`-based path inspection and applies managed dangling-link handling across refresh, planning, doctor, prune, remove, active installs, and pinned installs.
- `packages/skillpacks/test/lifecycle.test.mjs`: covers current and legacy dangling links, unmanaged links, pinned installs, dry-run, multi-project failure isolation, doctor, prune, remove, and idempotence.
- `publish.sh`: makes empty-array handling safe under macOS Bash 3.2 with `set -u`, preserving publish recovery test coverage.
- `CHANGELOG.md`: records the dangling-symlink lifecycle fix under Unreleased.
- `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`: record `0.1.22-experimental.6` and the matching canary manifest state.
- `tasks/roadmap.md`, `tasks/todo.md`, and `tasks/history.md`: record implementation, release, pilot, fleet recovery, and verification evidence.
- This manifest records the complete ship boundary and per-project recovery results.

## Source delivery

- Fix commit: `5ab7edbbb` (`Fix dangling skill symlink refresh`), pushed to `master`.
- Release metadata commit: `defe46efa` (`Release skillpacks 0.1.22-experimental.6`), pushed to `master`.
- Release tag: `skillpacks-v0.1.22-experimental.6`, pushed at `defe46efa`.
- Published packages: `skillpacks@0.1.22-experimental.6` and `@glexcorp/gskp@0.1.22-experimental.6`.
- Both `experimental` dist-tags point to `.6`; both `latest` dist-tags remain at `0.1.21`.
- No stable `v0.1.22` tag was created.

## Publish recovery record

- The first publish attempt failed npm authentication with `E401`; interactive `npm login` restored authentication.
- The first authenticated non-TTY publish attempt stopped at `EOTP` before either package was published. Registry checks confirmed there was no partial publish.
- The TTY retry completed the browser authorization prompt for each package, published both names, and ran the full published-package smoke matrix for each.
- Because neither package partially published, the one-package recovery command `./publish.sh --current --tag experimental` was not needed.

## Verification

- `node --test packages/skillpacks/test/lifecycle.test.mjs` - passed, 76/76.
- `npm --workspace packages/skillpacks run test:node` - passed, 217/217.
- `SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run build:check` - passed.
- `SKILLPACKS_PACKAGE_LANE=canary npm_config_cache=/tmp/skillpacks-npm-cache npm --workspace packages/skillpacks run verify:package` - passed.
- `./publish.sh --dry-run --tag experimental --preid experimental prerelease` - passed.
- Published verification for both npm package names - passed metadata, version, list, install, pin/unpin, remove, doctor, and upgrade smoke coverage.
- `node scripts/audit-task-docs.mjs` - passed after the final history, roadmap, todo, and manifest updates with zero failures and zero warnings.
- `git diff --check` - passed after the final closeout documentation updates.

## Pilot recovery

`apps/next-level-startup` exercised Claude and Codex links plus the `business-app` migration.

- Before: 32 package-managed dangling links, 16 per tool.
- Published `.6` dry run: 14 installs, 56 updates, and two removals (`icp` for Claude and Codex); no unmanaged skips.
- Refresh completed, doctor exited zero, and the managed install inventory was healthy.
- After: zero dangling links.
- Existing `.agents/project.json` and `desk-flip-report.md` SHA-256 values and mtimes were unchanged.

## Fleet dry-run decision

The published `.6` global dry run scanned 60 projects and proposed 233 installs, 389 updates, 38 removals, and three unmanaged skips. Every removal was inside a managed skill root. The three unmanaged links were preserved.

Thirteen planned removals were outside the ten dangling-link projects and were reviewed before mutation:

- `tools/dev/trackctl`: 11 current-checkout `business-ops` Claude links; `business-ops` was not enabled.
- `web/dev/afps-tracker`: current-checkout `ship` links for Claude and Codex; `exec-loop` was not enabled.

These were package-owned orphan reconciliation, not unmanaged deletion, so the fleet run remained within the approved refresh boundary.

## Per-project recovery inventory

| Project | Dangling before | Planned install/update/remove | Named removals or preservation notes | Dangling after |
| --- | ---: | ---: | --- | ---: |
| `apps/next-level-startup` | 32 | 14 / 56 / 2 | `icp` for Claude and Codex | 0 |
| `apps/b4` | 22 | 49 / 21 / 1 | Claude `icp` | 0 |
| `apps/claude-usage-review` | 44 | 28 / 42 / 2 | `icp` for Claude and Codex | 0 |
| `apps/gblockparty` | 54 | 18 / 52 / 2 | `icp` for Claude and Codex | 0 |
| `apps/lexcorp-war-room` | 34 | 22 / 48 / 2 | Removed managed `icp`; preserved unmanaged `portfolio-audit` and `unit-briefing` | 0 |
| `apps/pitwall-monorepo` | 56 | 18 / 60 / 4 | `icp` and `mono-run` for both tools | 0 |
| `apps/poke-productivity-monorepo-v3` | 44 | 28 / 42 / 2 | `icp` for Claude and Codex | 0 |
| `apps/poke/monorepo` | 44 | 28 / 46 / 2 | `icp` for Claude and Codex | 0 |
| `apps/warranit` | 44 | 28 / 42 / 2 | `icp` for Claude and Codex | 0 |
| `content` | 2 | 0 / 0 / 2 | `research-bootstrap` for Claude and Codex | 0 |
| `test-driftctl` | 42 | 14 / 36 / 6 | `video-build`, `video-script`, and `youtube-format-research` for both tools | 0 |
| `tools/dev/trackctl` | 0 | 0 / 0 / 11 | Disabled-pack `business-ops` Claude links | 0 |
| `web/dev/afps-tracker` | 0 | 0 / 0 / 2 | Disabled-pack `ship` links for both tools | 0 |

The pilot and the ten formerly failing fleet projects contained 418 dangling managed links before recovery and zero afterward.

## Fleet outcome

- Published `.6` `refresh --all`: `60 ok, 0 flagged, 0 failed across 60 project(s)`.
- Published `.6` `doctor --all`: `60 ok, 0 flagged, 0 failed across 60 project(s)`.
- Second published `.6` `refresh --all --dry-run`: zero installs, zero updates, zero removals, three preserved unmanaged skips, and `Safe to run: yes`.
- Direct dangling-link audit: zero across all ten formerly failing projects.
- Pre-existing non-managed dirty path sets remained unchanged. Recorded pilot, representative fleet, `trackctl`, and `afps-tracker` hashes matched their pre-run snapshots.
- No application repository was committed or pushed. `apps/poke-productivity-monorepo-v3` remained a non-Git worktree.

## Adversarial review

- Confirmed legacy ownership matching requires the expected `agentic-skills` or `skillpacks` checkout layout plus exact pack/tool/skill structure, limiting false ownership claims.
- Confirmed unrelated dangling links are reported as skipped rather than replaced or removed.
- Confirmed a valid pinned link and a second refresh remain unchanged in regression coverage.
- Confirmed `refresh --all` keeps per-project failure isolation and reports affected projects as `ok` after repair.
- Confirmed the fleet dry run contained no unmanaged deletion and the post-run plan was empty.
- The protected local release-credential file under `apps/pitwall-monorepo/apps/pitwall-local` was never opened, read, searched, printed, or included in snapshots.

## Residual risk

- This is an experimental canary. Stable `latest` remains at `0.1.21`; GA promotion requires a separate decision and release.
- Application worktrees intentionally remain dirty with their pre-existing user changes plus refreshed managed skill directories and convention docs. Those repositories were not committed.

## Rollback note

- Do not unpublish or reuse `0.1.22-experimental.6`; npm versions are immutable. Supersede it with a later prerelease if needed.
- Do not manually bulk-delete application skill paths. Use a later fixed `skillpacks refresh` or an explicit package configuration change so ownership rules remain authoritative.

## Next command

`$roadmap`
