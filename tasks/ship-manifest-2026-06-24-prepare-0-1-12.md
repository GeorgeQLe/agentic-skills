# Ship Manifest - Prepare 0.1.12 Publish Boundary

Date: 2026-06-24
Branch: `master`

## Scope

- Release-prep only: no skill source or CLI behavior changed in this session. The `0.1.12` boundary collects package-affecting work already merged across `v0.1.11..HEAD`.
- Reconciled the `CHANGELOG.md` `[0.1.12]` section so its Added / Changed / Fixed entries describe the actual `v0.1.11..HEAD` package boundary, and added a `### Verification` subsection recording the clean-tree revalidation and the intended `./publish.sh patch` publish path.
- Left source `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` at the last published version `0.1.11` so `./publish.sh patch` performs the real bump to `0.1.12` from a clean tree.
- Closed out the prepare-0.1.12 entries in `tasks/todo.md` and `tasks/roadmap.md`.

## Boundary Commits (v0.1.11..HEAD)

Package-affecting highlights backing the `0.1.12` changelog entries:

- `6cb8d04c` — retry published-package metadata verification (`--prefer-online`) before failing.
- `198050e2` — print final unsafe reasons for `skillpacks refresh --all --dry-run`.
- `3034cbd2` — add `skillpacks uninstall-global` dry-run preview (incl. `--reinstall-base`).
- `47959e71` — resolve product-design `state-model` `model_tree_ref` / `state_tree_path` references.
- `ba6b408a` — add product-design `create-ui-experiment` skill; design-tree branch-order metadata and contract tests (`d37e3a74`, `fdb99ea0`, `18211698`, `8693298d`).
- Routing/contract updates: `2cfc8480`, `6bd3904a`, `57981281`, `414441b6`, `ac102e63`, `a439b375`, `9b7f9c38`.

## Versioning

- No skill version bumps in this session; the version bump is the npm package artifact, performed by `./publish.sh patch` (`0.1.11` -> `0.1.12`).

## Validation

- Passed: `node bin/skillpacks.mjs --version` reports `0.1.11` (expected pre-publish source state).
- Passed: `npm run build:check` — skill convention bundle audit (390 active skills, 372 tracked bundles), manifest byte-in-sync check, package staging boundary check (390 skills, 41 packs).
- Passed: `npm run test:node` — 127/127 tests, including the published-package stale-metadata retry coverage.
- Passed: offline `npm pack ./build --dry-run --json --silent` — exit 0, name `skillpacks`, version `0.1.11`, 3615 files.
- Passed: `git diff --check --cached` (no whitespace/conflict markers).

## Publish Handoff

- Real release command: `./publish.sh patch` after `npm login` as `glexcorp`.
- The script bumps `package.json` + `dist/skillpacks-manifest.json` to `0.1.12`, stages, and publishes both `skillpacks` and `@glexcorp/gskp`.
- After publish: commit the bumped `package.json` + manifest at `0.1.12`, tag `v0.1.12`, and push commit + tag.
- `prepublishOnly` runs `scripts/prepublish-auth-check.mjs`; a dry run without `glexcorp` auth stops at the npm auth preflight (E401) by design and restores the tree via the EXIT trap.

## Rollback

Revert the commit containing this manifest. That restores the previous `CHANGELOG.md` `[0.1.12]` section and task-doc state. No source/CLI behavior is affected because this session changed only release-prep documentation.
