# Ship Manifest - Shared Convention Resolver Migration

## User goal

Implement the shared convention document migration: keep canonical alignment/interrogation convention text in `docs/`, package the same files as runtime assets, replace duplicated per-skill convention sections with resolver stubs, preserve legacy sibling bundle compatibility, and update tests/audits to validate resolution rather than byte-equal bundle generation.

## Changed files

Shipping boundary:

- `docs/alignment-page-convention.md`
- `alignment/bip/ship-end.html`
- `alignment/index.html`
- `docs/history/archive/2026-07-02/124922/alignment/bip/ship-end.html`
- `docs/interrogation-page-convention.md`
- `docs/skillpacks-npm-distribution.md`
- `packages/skillpacks/src/cli/run-pack-script.mjs`
- `packages/skillpacks/test/alignment.test.mjs`
- Active `packs/**/SKILL.md` files whose alignment/interrogation convention section was generated from the new shared resolver stub contract.
- `packs/alignment-page-admin/{claude,codex}/upgrade-alignment-pages/SKILL.md`
- `packs/interrogation-page-admin/{claude,codex}/upgrade-interrogation-pages/SKILL.md`
- `packs/base/{claude,codex}/provision-agentic-config/SKILL.md`
- `scripts/skill-convention-bundle-audit.mjs`
- `scripts/skill-convention-registry.mjs`
- `scripts/upgrade-alignment-page.mjs`
- `scripts/upgrade-interrogation-page.mjs`
- `tasks/history.md`
- `tasks/ship-manifest-2026-07-02-shared-convention-resolver.md`
- `tests/layer1/afps-alignment-preview-gates.test.ts`
- `tests/layer1/alignment-gates.test.ts`
- `tests/layer1/interrogation-confidence-gate.test.ts`
- `tests/layer1/positioning-alignment-contract.test.ts`
- `tests/layer1/upgrade-alignment-page-bespoke.test.ts`
- `tests/layer1/upgrade-alignment-pages.test.ts`
- `tests/layer1/upgrade-interrogation-pages.test.ts`
- `prompts/ship-end/skill-prompt-20260702-124334-ship-end.md`

Excluded pre-existing worktree changes:

- Pattern A routing changes in `docs/alignment-yaml-routing-contract.md`, `docs/orchestrator-convention.md`, `docs/research-session-loop-convention.md`, `scripts/skill-research-loop-handoff-audit.sh`, `tasks/lessons.md`, and related skill/version/archive files.
- Pre-existing version/changelog/archive changes for roadmap, plan-phase, hygiene, exec, ship, ship-end, mono-plan, and research skills except for the resolver-stub hunks needed in overlapping `SKILL.md` files.

## Per-file purpose

- Convention docs describe source checkout, packaged asset, and legacy sibling fallback resolution.
- Generators write resolver stubs by default and retain `--legacy-bundles` for transitional bundle generation.
- Registry/audit code models shared-doc-or-asset resolution and accepts legacy bundle fallback.
- Package CLI help and tests cover the new allowed flag and packaged asset boundary.
- Layer1 tests prove stub validation, source/asset resolution, legacy fallback, and unchanged active page contracts.
- Skill stubs point agents at the packaged convention resolver while preserving per-skill output paths.
- BIP artifacts record source-safe post candidates for the shipped implementation because Build-In-Public mode is enabled.
- Task and prompt-history files record the implementation and wrap-up.

## User-goal mapping

The changed generator, registry, audit, docs, package CLI, and tests directly implement the requested migration away from duplicated per-skill convention bundles. The generated skill stub changes make the new contract active for alignment/interrogation-producing skills. Legacy sibling bundles remain on disk and are treated as fallback compatibility artifacts.

## Tests run

- `node --check scripts/upgrade-alignment-page.mjs && node --check scripts/upgrade-interrogation-page.mjs` - passed.
- `pnpm exec vitest run --project layer1 layer1/upgrade-alignment-page-bespoke.test.ts layer1/interrogation-confidence-gate.test.ts layer1/alignment-gates.test.ts layer1/afps-alignment-preview-gates.test.ts layer1/positioning-alignment-contract.test.ts layer1/upgrade-alignment-pages.test.ts layer1/upgrade-interrogation-pages.test.ts` - passed, 122 tests.
- `node scripts/skill-convention-bundle-audit.mjs` - passed, 415 active skills and 385 tracked bundles.
- `npm --workspace packages/skillpacks run build:check` - passed and proved package staging includes shared convention assets.
- `node scripts/audit-alignment-pages.mjs` - passed, 61 active pages exact.
- `node scripts/audit-interrogation-pages.mjs` - passed, 0 active pages exact.
- `node --test packages/skillpacks/test/package-boundary.test.mjs` - passed.
- `node --test packages/skillpacks/test/alignment.test.mjs` - passed, 14 tests.
- `bash scripts/skill-versions.sh --missing` - passed.
- `bash scripts/skill-archive-audit.sh --strict` - passed.
- `node scripts/audit-task-docs.mjs` - passed.
- `node scripts/audit-alignment-pages.mjs` after BIP page update - passed.
- `git diff --check` - passed.

## Skipped tests

- Full repository layer1 suite was not rerun because the focused migration suites plus active page audits and package build boundary cover the changed generator/audit/package surfaces. Broader unrelated Pattern A routing changes are excluded from this shipping boundary.

## Adversarial review

Diff-aware self-review checked the main failure modes: installed skills without repo-local `docs/`, source checkouts without packaged assets, lingering legacy sibling bundles, optional alignment behavior, interrogation output paths, package CLI flag allow-listing, and false-positive convention audit findings from admin skills that document standards. Findings were fixed in the resolver audit, generator stubs, CLI allowed flags, and focused tests.

## Residual risk

The main residual risk is a skill-specific edge case in generated stubs because hundreds of active skills were touched mechanically. The generator check, convention audit, package build check, and focused layer1 coverage reduce that risk. The current worktree also contains unrelated pre-existing edits; those are intentionally excluded and left for their owning task.

## Rollback note

Revert the shipped commit to restore generator defaults, registry/audit behavior, tests, and generated stubs to the prior sibling-bundle contract. Existing `ALIGNMENT-PAGE.md` and `INTERROGATION-PAGE.md` files remain available as legacy fallback artifacts during rollback.

## Next command

`$reconcile-dev-docs fix tasks`
