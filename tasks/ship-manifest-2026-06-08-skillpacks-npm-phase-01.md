# Ship Manifest - Skillpacks npm Distribution Phase 0/1

## User Goal

Run the exec loop to make the approved npm distribution real, starting from the `skillpacks` npm distribution design.

## Changed Files

- `package.json`
- `bin/skillpacks.mjs`
- `src/cli/run-pack-script.mjs`
- `packs/ord/claude/ord-ship/SKILL.md`
- `packs/ord/claude/ord-ship/CHANGELOG.md`
- `packs/ord/claude/ord-ship/archive/v0.0/SKILL.md`
- `packs/ord/codex/ord-ship/SKILL.md`
- `packs/ord/codex/ord-ship/CHANGELOG.md`
- `packs/ord/codex/ord-ship/archive/v0.0/SKILL.md`
- `tests/harness/bench-coverage.ts`
- `docs/skills-showcase/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/benchmark-results-matrix.md`
- `prompts/exec/skill-prompt-20260608-232218-skillpacks-npm-distribution.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-08-skillpacks-npm-phase-01.md`

Unrelated tracked changes left untouched:

- `alignment/skillmap.html`
- `docs/skillmap.excalidraw`
- `scripts/generate-skillmap-excalidraw.mjs`

## Per-File Purpose

- `package.json`: defines `skillpacks@0.1.0`, CLI bin, package allowlist, Node engine, and package scripts.
- `bin/skillpacks.mjs`: executable npm bin entry point.
- `src/cli/run-pack-script.mjs`: zero-dependency Node dispatcher that validates `bash`/`jq`, delegates pack commands to packaged `scripts/pack.sh`, and delegates `init-global` to packaged `init.sh`.
- `packs/ord/**/ord-ship`: closes the routing audit gap by requiring the `devtool` pack before `devtool-adoption` graduation, with version archive and changelog.
- `tests/harness/bench-coverage.ts`: adds coverage rows for active ORD/VARD rapid deck skills discovered during validation.
- Generated showcase files and benchmark matrix: refreshed after `ord-ship` metadata and coverage changed.
- Prompt, task, history, and manifest files: record exec invocation, active phase status, validation evidence, and shipping boundary.

## User-Goal Mapping

- The package metadata and CLI bin turn the repo from git-clone-only into a locally packable npm package.
- The tarball proof demonstrates the package can be installed into a separate consumer project and run from `node_modules/.bin/skillpacks`.
- The package allowlist excludes active task, prompt, alignment, app source, test, and docs history artifacts from npm while including required skill sources and install scripts.
- The validation remediations ensure packaged skill content and benchmark metadata pass current repository quality gates.

## Tests Run

- `npm view skillpacks --json` -> `E404`
- `npm view @skillpacks/cli --json` -> `E404`
- `npm view @skillpacks/core --json` -> `E404`
- `npm whoami` -> `ENEEDAUTH`
- `command -v bash && bash --version | sed -n '1p' && command -v jq && jq --version && command -v npm && npm --version && command -v node && node --version`
- `node bin/skillpacks.mjs --version`
- `node bin/skillpacks.mjs list`
- `node bin/skillpacks.mjs which quality-sweep`
- `node bin/skillpacks.mjs --help`
- Temp consumer checkout: `node /path/to/bin/skillpacks.mjs install code-quality`, `status`, `doctor`
- `npm_config_cache=/tmp/skillpacks-npm-cache npm pack --dry-run --json --silent` with package summary: 5,508 files, 9.24 MB package size, 53.33 MB unpacked, denied files 0.
- Local tarball install from `/tmp`: `npm install <skillpacks-0.1.0.tgz>`, `./node_modules/.bin/skillpacks install quality-sweep`, `doctor`; sources pointed at `node_modules/skillpacks`.
- `node --check bin/skillpacks.mjs`
- `node --check src/cli/run-pack-script.mjs`
- `node --check tests/harness/bench-coverage.ts`
- `node bin/skillpacks.mjs init-global --help`
- `scripts/skill-pack-routing-audit.sh`
- `scripts/skill-versions.sh --missing`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-deps.sh --broken`
- `pnpm --dir tests bench:coverage`
- `pnpm --dir tests exec vitest run --project layer1 bench-coverage`
- `node scripts/generate-skills-showcase-data.mjs`
- `node scripts/generate-skills-showcase-github-data.mjs`
- `scripts/validate-skills-showcase-data.sh`
- `pnpm --dir apps/skills-showcase build`
- `git diff --check`

## Skipped Tests

- Full `pnpm --dir tests test` was not run. The changed executable surface is a new CLI wrapper plus benchmark coverage registry; targeted CLI smoke tests, tarball install, syntax checks, package dry-run, skill audits, coverage validation, focused layer1 coverage tests, generated-data validation, and the Skills Showcase build cover the changed behavior more directly.
- Real `npm publish` was not run. Publishing is an external account action and remains out of scope until explicit publish approval, npm login/account readiness, and final license/package metadata confirmation.
- Production deploy was not run. A Skills Showcase deploy contract exists, but deploy requires explicit production confirmation; local generated-data validation and `pnpm --dir apps/skills-showcase build` passed.

## Adversarial Review

- Failure mode: delegated script exits non-zero but `skillpacks` exits zero. Fixed by making `bin/skillpacks.mjs` propagate the resolved exit code.
- Failure mode: package allowlist includes unrelated dirty repo utilities. Fixed by narrowing `files` from `scripts/` to only `scripts/pack.sh` and `scripts/skill-links.sh`.
- Failure mode: package writes into its own install directory rather than consumer project. Tested with direct checkout wrapper and installed tarball; `.agents` and skill roots were created in temp consumer directories.
- Failure mode: packaged skill content fails existing audits. Fixed `ord-ship` cross-pack route and added ORD/VARD benchmark coverage metadata.
- Failure mode: generated showcase data stale after skill metadata changes. Regenerated and validated both docs and app copies.

## Residual Risk

- The npm package is not published yet because this machine is not logged into npm and publication requires explicit approval.
- Package license metadata is currently `UNLICENSED` because no repository `LICENSE` file exists. Public publish should revisit this before `npm publish`.
- The monolith tarball is 9.24 MB compressed and 53.33 MB unpacked because skill archives are included for version pinning. This is acceptable for a first local proof but should be monitored before public release.
- Phase 2 deck manifest and `install-deck` are not implemented yet; this pass proves the package and thin wrapper only.
- Local default npm cache has root-owned files; validation used `/tmp/skillpacks-npm-cache`. The user's npm cache should be repaired separately before normal publish workflows.

## Rollback Note

Revert the shipping commit to remove the package metadata, CLI wrapper, ORD routing/coverage remediation, generated showcase updates, and task records. Existing git-checkout `init.sh` and `scripts/pack.sh` behavior is unchanged by this pass.

## Next Command

`$exec` for Phase 2 deck metadata and manifest implementation.
