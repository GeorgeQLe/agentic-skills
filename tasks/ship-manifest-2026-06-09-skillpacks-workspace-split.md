# Ship Manifest — Skillpacks Workspace Split

## Scope

Separate the Skills Showcase website and `skillpacks` npm package into independent workspaces inside the same repository, while keeping `global/` and `packs/` as the canonical skill source.

## Changed Areas

- Root workspace metadata: `package.json`, `pnpm-workspace.yaml`, `.gitignore`.
- Package workspace: `packages/skillpacks/`.
- Website generator scripts: `apps/skills-showcase/scripts/`.
- Shared read-only catalog helpers: `scripts/catalog/`.
- Website-owned generated outputs: `apps/skills-showcase/public/assets/`, `docs/skills-showcase/assets/`, and `docs/benchmark-results-matrix.md`.
- Active documentation and task tracking for the new package/app boundary.

## Verification

- `node packages/skillpacks/bin/skillpacks.mjs --version`
- `node packages/skillpacks/bin/skillpacks.mjs list`
- `node packages/skillpacks/scripts/build-package.mjs --check`
- `npm_config_cache=/tmp/skillpacks-npm-cache npm pack packages/skillpacks/build --dry-run --json --silent`
- Temp consumer tarball install with `skillpacks install quality-sweep` and `skillpacks doctor`
- `pnpm --dir apps/skills-showcase test`
- `pnpm --dir apps/skills-showcase build`
- `pnpm --dir apps/skills-showcase validate:data`
- `npm run skills-showcase:validate-data`
- `scripts/skill-pack-routing-audit.sh`
- `scripts/skill-versions.sh --missing`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-deps.sh --broken`
- `node --check` for changed JavaScript modules
- `git diff --check`

## Boundary Results

- Package verification left `apps/skills-showcase/`, `docs/skills-showcase/`, and `docs/benchmark-results-matrix.md` unchanged.
- Website validation left package staging and package metadata unchanged.
- npm dry-run package contents excluded `apps/`, `tasks/`, `prompts/`, `alignment/`, `tests/`, and `docs/history/`.

## Notes

- `npm publish` was not run.
- A stale app animation reference page was regenerated because the app test gate found it no longer matched the current animation model.
- Public GitHub metadata refresh is now opt-in through `SKILLS_SHOWCASE_REFRESH_GITHUB=1`; committed proof data defaults to deterministic local git evidence.
