# Ship Manifest - Build-In-Public Alignment Mode

## Scope

Add a Build-In-Public (BIP) alignment mode for alignment-producing skills and project-level configuration support for enabling it by default.

## Changes

- Updated `docs/alignment-page-convention.md` with the BIP contract:
  - triggers from explicit `--bip` or `.agents/project.json.alignment.build_in_public: true`
  - required `alignment/{skill-name}-{topic}-bip.html` Stage 2 halfway review
  - angle and sample-post approval gates
  - tone, claim-safety, and publish-readiness approval gates
  - source-safety requirements and YAML handoff back to the producing skill
- Regenerated all 306 generated `ALIGNMENT-PAGE.md` bundles.
- Added `scripts/pack.sh set-bip <on|off|unset>` and preserved existing `alignment` fields through Bash project-file rewrites.
- Added Node-owned `npx skillpacks set-bip <on|off|unset>` support via `packages/skillpacks/src/cli/project-config.mjs` and `run-pack-script.mjs`.
- Added package tests covering `set-bip on`, `off`, and `unset`, including sibling `alignment` preservation.
- Updated README and docs for command compatibility, scripts reference, pack docs, quickstart, and troubleshooting.
- Rebuilt the package manifest and verified the ignored package staging output with `build:check`.

## Verification

- `npm --workspace packages/skillpacks run test:node` - pass, 129 tests.
- `npm --workspace packages/skillpacks run build` - pass.
- `node scripts/upgrade-alignment-page.mjs --check` - pass.
- `node scripts/skill-convention-bundle-audit.mjs` - pass.
- `bash -n scripts/pack.sh` - pass.
- Temp-project smoke test for `scripts/pack.sh set-bip on`, `off`, and `unset` - pass.
- `npm --workspace packages/skillpacks run build:check` - pass.
- `node scripts/audit-task-docs.mjs` - pass.
- `git diff --check` - pass.

## Notes

- BIP mode is an approval artifact workflow, not an auto-publishing integration.
- No individual skill version bump was made for generated `ALIGNMENT-PAGE.md` propagation.
- Existing brainstorm quick-mode work was present before this task and was preserved while the shared alignment bundles were regenerated.
