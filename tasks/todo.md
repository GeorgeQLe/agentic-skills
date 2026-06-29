# Current Task State

## Current Implementation - Simplify BIP Into Project Platform Setup + Exhaustive Phase Drafts

Project: `agentic-skills`.

### Execution Profile

- Parallel mode: serial edits, parallel read-only inspection where useful.
- Reason: project-config CLI behavior, canonical alignment convention text, generated bundles, package assets, and ship-end skill behavior form one shared BIP contract and should land atomically.
- Safety boundary: preserve pre-existing dirty package release metadata until package build/check steps intentionally refresh package artifacts.

### Plan

- [x] Capture the visible `exec` handoff prompt and promote this implementation into `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Add `set-bip-platforms <platform...>` and `set-bip-platforms unset` support for `.agents/project.json.alignment.bip_platforms` in the Node CLI and source-checkout script.
- [x] Add focused project-config tests for platform preservation, unset behavior, no-project-file normalization, invalid/empty input, and help text.
- [x] Revise `docs/alignment-page-convention.md` so BIP uses saved project platforms, includes a first-run setup gate when needed, classifies the run phase, generates exhaustive ranked platform-specific draft candidates, and uses one bulk downselect gate.
- [x] Regenerate generated `ALIGNMENT-PAGE.md` bundles and packaged convention assets from the canonical convention.
- [x] Update `ship-end` BIP behavior to use saved platforms and generate exhaustive phase-aware post batches instead of only `2-4` suggestions; archive and bump skill versions.
- [x] Update BIP convention, audit, package-boundary, compatibility, and ship-end tests for the new platform setup/downselect contract.
- [x] Run focused verification plus package build/check gates, document results, commit, and push intended changes on the primary branch.

### Acceptance Criteria

- `.agents/project.json.alignment.bip_platforms` is written and cleared by supported CLI commands without clobbering sibling `alignment` fields.
- BIP pages use saved platforms when present and do not re-ask for project platform selection on later invocations.
- First BIP artifact can include both the platform setup gate and the exhaustive draft list when platforms are not saved.
- BIP review surfaces use one bulk downselect gate instead of separate drafting-mode, content-angle, sample-post, tone, claim-safety, and publish-readiness gates.
- Generated bundles and package assets match the canonical convention.
- `ship-end` enabled BIP produces phase-aware, platform-specific candidate batches from saved platforms.

### Test Plan

- `node --test packages/skillpacks/test/project-config.test.mjs`
- `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts layer1/audit-alignment-pages.test.ts layer1/ship-end-bip.test.ts`
- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/skill-convention-bundle-audit.mjs`
- `node scripts/audit-alignment-pages.mjs`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `npm --workspace skillpacks run build:check`

### Results

- Added `set-bip-platforms <platform...>` / `set-bip-platforms unset` to the Node CLI and source-checkout `scripts/pack.sh` writer, preserving sibling `alignment` fields and normalizing/deduping platform slugs.
- Reworked the canonical BIP alignment convention around saved project platforms, first-run platform setup, per-invocation `bip_phase`, exhaustive ranked platform-specific candidate batches, source-safety fields, and one bulk downselect gate.
- Regenerated 309 generated `ALIGNMENT-PAGE.md` bundles from the canonical convention and refreshed packaged skillpacks metadata.
- Updated active alignment-page audit logic and layer1 fixtures so BIP pages require bulk downselect, require platform setup only when no saved platforms exist, and reject obsolete granular BIP gates.
- Updated mirrored `ship-end` skills to `v0.9`, archived `v0.8`, and changed enabled BIP behavior to use saved platforms and generate exhaustive phase-aware source-safe batches.
- Refreshed Skills Showcase generated data/proof assets because tracked `SKILL.md` metadata changed; curated showcase title, description, grouping, and workflow copy did not need manual edits because the public skill identity stayed stable.
- Verification passed with the commands in the test plan plus the required Skills Showcase data validation, source-checkout `set-bip-platforms` smoke test, and app build.
- Deploy not run manually: `tasks/deploy.md` marks the refreshed Skills Showcase public assets as deploy-relevant, but production deployment requires explicit user confirmation.
- Manifest: `tasks/ship-manifest-2026-06-29-simplify-bip-platform-setup.md`.

## Next Work

Decide whether to deploy the refreshed Skills Showcase generated public assets, then publish the current `skillpacks@0.1.17` source release if deploy is deferred or completed.

## Recommended Next Command

Reply with explicit Skills Showcase deploy approval, or run `./publish.sh --current` if deploy is intentionally deferred.
