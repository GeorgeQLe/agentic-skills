# Ship Manifest - skillpacks 0.1.10 Publish Prep

## User goal

Prepare the consolidate-prototypes/graduation work for public npm publish while leaving the real publish command for the user.

## Changed files

- `CHANGELOG.md`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `packages/skillpacks/test/lifecycle.test.mjs`
- `apps/skills-showcase/public/assets/skills-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/skills-showcase/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `packs/product-design/{claude,codex}/consolidate-prototypes/**`
- `packs/product-design/{claude,codex}/spec-interview/**`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-22-skillpacks-0.1.10-publish-prep.md`

## Per-file purpose

- `CHANGELOG.md`: adds the pending `0.1.10` package release note.
- Product-design skills: archives `v0.16`, bumps active contracts to `v0.17`, and corrects AFPS graduation production/gating behavior.
- `packages/skillpacks/dist/skillpacks-manifest.json`: refreshes package manifest metadata for the `v0.17` skill snapshots.
- Skills Showcase data files: refresh generated public data from the updated package manifest.
- `packages/skillpacks/test/lifecycle.test.mjs`: makes a package-snapshot test read the current base skill version instead of asserting a stale literal.
- Task docs and this manifest: record the publish-prep boundary and verification evidence.

## Tests run

- `npm --workspace packages/skillpacks run test:node`: passed, 112/112.
- `npm run skillpacks:verify`: passed, including manifest check, package staging boundary check, and local package dry-run pack.
- `pnpm --dir apps/skills-showcase validate:data`: passed.
- `node scripts/skill-convention-bundle-audit.mjs`: passed for 387 active skills and 368 tracked bundles.
- `scripts/skill-archive-audit.sh --strict`: passed for 397 skills.
- `scripts/skill-mirror-parity-audit.sh --verbose`: passed, 161 mirrored pairs checked.
- `scripts/base-skill-version-parity-audit.sh`: passed.
- `git diff --check`: passed.
- `./publish.sh --dry-run patch`: passed. It staged and dry-ran both `skillpacks@0.1.10` and `@glexcorp/gskp@0.1.10`, then restored source package state to `0.1.9`.

## Skipped tests

- The real publish command was intentionally not run. The user will run `./publish.sh patch`.
- Real publish is intentionally skipped; the user will run `./publish.sh patch`.

## Adversarial review

Release prep found a real source inconsistency: the active `consolidate-prototypes` contracts still prohibited writing AFPS graduation even though the release notes and generated design-tree convention required it. The fix is narrower than a new workflow redesign: it updates the active producer/consumer contracts, archives the superseded snapshots, and refreshes generated package/showcase metadata.

The package version remains `0.1.9` before publish by design. Running `./publish.sh patch` from the clean committed tree will bump and stage `0.1.10` for both `skillpacks` and `@glexcorp/gskp`.

Dry-run note: npm CLI emitted `Cannot read properties of null (reading 'matches')` during `npm version`, but `publish.sh` detected that `0.1.10` had been written, continued through manifest/package verification, dry-ran both publishes, and exited 0.

## Next command

After this commit is pushed and the dry run passes: `./publish.sh patch`
