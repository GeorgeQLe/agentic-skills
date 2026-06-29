# Ship Manifest - Simplify BIP Platform Setup

## User Goal

Simplify Build-In-Public from granular per-page approval gates into one project-level platform setup plus exhaustive, phase-aware, source-safe platform draft batches reviewed through one bulk downselect gate.

## Changed Files

- `packages/skillpacks/src/cli/project-config.mjs` - adds `alignment.bip_platforms` normalization, preservation, set, and unset behavior for the packaged CLI.
- `packages/skillpacks/src/cli/run-pack-script.mjs` - exposes `set-bip-platforms <platform...>` and `set-bip-platforms unset` in dispatch and help text.
- `scripts/pack.sh` - mirrors the project checkout writer for `set-bip-platforms`, including jq writes, normalization, dedupe, unset cleanup, and source-checkout command dispatch.
- `packages/skillpacks/test/project-config.test.mjs` and `packages/skillpacks/test/compatibility.test.mjs` - cover platform set/unset, no-project-file normalization, invalid inputs, help text, and distribution compatibility.
- `docs/alignment-page-convention.md` - updates the canonical BIP convention to saved platforms, first-run platform setup, phase classification, exhaustive ranked candidate batches, source-safety metadata, and one bulk downselect gate.
- `base/**/ALIGNMENT-PAGE.md` and `packs/**/ALIGNMENT-PAGE.md` - regenerated generated convention bundles from the canonical alignment convention.
- `scripts/audit-alignment-pages.mjs` and `tests/layer1/audit-alignment-pages.test.ts` - enforce required BIP bulk downselect, first-run platform setup when no saved platforms exist, and obsolete granular gate rejection.
- `tests/layer1/alignment-gates.test.ts` and `tests/layer1/ship-end-bip.test.ts` - update BIP fixture expectations for the new downselect/platform contract and `ship-end` batches.
- `packs/exec-loop/{claude,codex}/ship-end/SKILL.md` - bumps `ship-end` to `v0.9` and makes enabled BIP consume saved platforms for exhaustive phase-aware source-safe batches.
- `packs/exec-loop/{claude,codex}/ship-end/archive/v0.8/SKILL.md` and `CHANGELOG.md` - archive and document the prior `v0.8` behavior before the version bump.
- `CLAUDE.md`, `README.md`, `docs/QUICKSTART.md`, `docs/packs.md`, `docs/scripts-reference.md`, `docs/skillpacks-npm-distribution.md`, `docs/troubleshooting.md`, and `CHANGELOG.md` - document the new command and BIP workflow behavior.
- `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` - preserve the pre-existing `0.1.17` package metadata state and refresh the manifest from the staged source boundary.
- `docs/skills-showcase/assets/*.js`, `apps/skills-showcase/public/assets/*.js`, and `docs/benchmark-results-matrix.md` - refresh Skills Showcase generated data/proof assets for changed skill metadata and current source fingerprints.
- `prompts/exec/skill-prompt-20260629-100447-bip-platform-setup.md` - captures the visible invocation for this `exec` run.
- `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, and this manifest - record the plan, results, verification, deploy status, and next work.

## User-Goal Mapping

- Project platform setup: handled by `alignment.bip_platforms` and the `set-bip-platforms` writers.
- First-run no-stop behavior: handled by the convention requiring one setup gate plus exhaustive candidates in the same BIP artifact when saved platforms are absent.
- Lower-friction BIP review: handled by replacing target-channel, drafting-mode, content-angle, tone, claim-safety, and publish-readiness required gates with one bulk downselect gate.
- Phase-aware exhaustive drafts: handled by convention text, `ship-end` v0.9 behavior, and layer1 tests that require `bip_phase` and richer platform batches.
- Source safety: preserved through required candidate fields for source basis, claim-safety notes, risk level, publish precheck, and loaded convention path.
- Distributable behavior: handled by regenerated bundles, refreshed package manifest, docs, and Skills Showcase data.

## Tests Run

- `node --test packages/skillpacks/test/project-config.test.mjs`
- `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts layer1/audit-alignment-pages.test.ts layer1/ship-end-bip.test.ts`
- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/skill-convention-bundle-audit.mjs`
- `node scripts/audit-alignment-pages.mjs`
- `bash -n scripts/pack.sh`
- `scripts/pack.sh set-bip-platforms LinkedIn x youtube_shorts LinkedIn` in a temporary project
- `scripts/pack.sh set-bip-platforms unset` in a temporary project
- `npm --workspace skillpacks run build`
- `npm --workspace skillpacks run test:node`
- `npm --workspace skillpacks run build:check`
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `pnpm --dir apps/skills-showcase build`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git diff --cached --check`

## Skipped Tests

- Full benchmark runs were not executed: this changes workflow contracts, command writers, generated metadata, and audits, not benchmark runtime scoring.
- Production deployment was not executed: refreshed Skills Showcase assets are deploy-relevant, but production deployment requires explicit user confirmation.

## Adversarial Review

- Config preservation checked: the Node writer and tests preserve sibling `alignment` fields and arbitrary project config fields while setting and clearing only `bip_platforms`.
- Source-checkout parity checked: direct temp-project smoke tests caught and fixed an uninitialized shell `seen` variable under `set -u`; set and unset now execute and leave the expected config shape.
- Gate regression checked: active BIP pages now fail when they omit bulk downselect or keep obsolete target-channel/drafting/content/tone/claim/publish gates, while first-run pages can include platform setup and draft downselect together.
- Bundle freshness checked: canonical convention generation and bundle audit pass after regenerating all active `ALIGNMENT-PAGE.md` bundles.
- Package boundary checked: package build/check passed after staging source edits so the manifest fingerprint reflects the exact staged boundary.
- Skills Showcase checked: generated data/proof assets were refreshed because `ship-end/SKILL.md` metadata changed; curated title, description, grouping, workflow animation text, and proof receipts were reviewed, and only generated data/proof assets needed updates.

## Residual Risk

- Existing agent sessions with already-loaded skill copies may need a refresh or fresh Codex/Claude session before `ship-end` v0.9 and the new BIP convention text are visible locally.
- Platform slugs are intentionally syntax-validated but not registry-enforced; unsupported slugs will still rely on convention lookup/source-safety review to decide whether a platform has usable posting guidance.

## Rollback Note

Revert the commit to restore the previous granular BIP gate convention, remove `set-bip-platforms`, restore `ship-end` v0.8, and return generated bundles, package metadata, and Skills Showcase assets to their prior fingerprints.

## Next Command

Reply with explicit Skills Showcase deploy approval to deploy the refreshed public assets, or run `./publish.sh --current` if deploy is intentionally deferred and the `0.1.17` package release should proceed.
