# Ship Manifest — Skillpacks Deck Manifest And CLI Resolver

## Scope

Implement Phase 2 of the `skillpacks` npm distribution: a package-owned manifest, manifest validation, JSON listing, and deck installation resolver over the existing `pack.sh` backend.

## Changed Areas

- `packages/skillpacks/scripts/build-skillpacks-manifest.mjs`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `packages/skillpacks/package.json`
- `packages/skillpacks/scripts/build-package.mjs`
- `packages/skillpacks/src/cli/run-pack-script.mjs`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `tasks/roadmap.md`, `tasks/todo.md`, and `tasks/history.md`

## Verification

- `node packages/skillpacks/scripts/build-skillpacks-manifest.mjs`
- `node packages/skillpacks/scripts/build-skillpacks-manifest.mjs --check`
- `node --check packages/skillpacks/scripts/build-skillpacks-manifest.mjs`
- `node --check packages/skillpacks/scripts/build-package.mjs`
- `node --check packages/skillpacks/src/cli/run-pack-script.mjs`
- `node --check scripts/catalog/index.mjs`
- Manifest shape assertion for four decks, package-list fields, registry-tag fields, skill versions, archive-version arrays, content hashes, and path existence
- `node packages/skillpacks/bin/skillpacks.mjs list`
- `node packages/skillpacks/bin/skillpacks.mjs list --json`
- Temp consumer checks from `/tmp`: `install-deck vard`, `install-deck business-afps`, `install-deck business-afps --full`, and `doctor`
- Negative CLI checks: unknown deck and unsupported install-deck flag
- `npm --workspace skillpacks run build:check`
- Parsed `npm_config_cache=/tmp/skillpacks-npm-cache npm pack packages/skillpacks/build --dry-run --json --silent`
- `scripts/skill-pack-routing-audit.sh`
- `scripts/skill-versions.sh --missing`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-deps.sh --broken`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `git diff --check`

## Boundary Results

- npm dry-run includes `dist/skillpacks-manifest.json`.
- npm dry-run excludes `apps/`, `tasks/`, `prompts/`, `alignment/`, `tests/`, and `docs/history/`.
- Skills Showcase validation refreshed GitHub proof data because `tasks/history.md` is one of its source inputs.
- Skill/pack catalog generated data and the benchmark matrix ended with no tracked diff.
- No npm publish was run.

## Notes

- The Phase 3 Node port was not started.
- `devtool` and `game` remain valid active pack directories with null `PACK.md` metadata in the manifest.
- Unrelated local skillmap/alignment worktree changes were left untouched.
