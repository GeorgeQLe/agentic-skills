# Ship Manifest - Base Pack Nesting Migration

Date: 2026-07-02

## Scope

- Move canonical base skill sources from `base/{claude,codex}` to `packs/base/{claude,codex}`.
- Add `packs/base/PACK.md` as the base source metadata home.
- Preserve base install/runtime semantics: `scope: "base"`, `pack: null`, `base_skills: true`, and exact base-skill install through `enabled_skills[skill] = "base"`.
- Keep legacy managed marker cleanup compatible with existing installs that still point at old `base/...` source paths.
- Update package/catalog/build/install code, audits, generators, docs, and tests for the new canonical layout.

## Not Included

- `research-amend` skill creation.
- Product code changes.
- GitHub Actions changes.
- Remediation of unrelated dirty-tree convention/version work already present outside this boundary.

## Verification

- `npm run skillpacks:build` passed.
- `npm run skillpacks:verify` passed.
- `npm --workspace packages/skillpacks run test:node` passed: 176 tests.
- `npm --workspace packages/skillpacks run build:check` passed.
- Manifest semantic check passed for `packs/base/codex/skills/SKILL.md`: `scope: "base"`, `pack: null`, `installable: true`, and no `base` pack entry.
- `scripts/pack.sh list` excludes `base`.
- `scripts/validate-skills-catalog-export.sh` passed.
- `bash scripts/skill-versions.sh --missing` passed.
- `bash scripts/skill-archive-audit.sh --strict` passed.
- `bash scripts/skill-deps.sh --broken` passed.
- `bash scripts/skill-install-routing-audit.sh --active` passed.
- `node scripts/upgrade-alignment-page.mjs --check` passed.
- `node scripts/upgrade-interrogation-page.mjs --check` passed.
- `node scripts/upgrade-design-tree-loop.mjs --check` passed.
- `bash scripts/base-skill-version-parity-audit.sh` passed.
- `bash scripts/skill-pack-routing-audit.sh` passed.
- Focused layer1 suite passed from `tests/`: 7 files, 393 tests.

## Residual Risk

- Broad mirror/layer1 validation in the shared dirty worktree has unrelated pre-existing failures in convention/version work outside this migration boundary.
- `bash scripts/skill-mirror-parity-audit.sh` currently fails on 10 dirty-tree parity issues outside the migration fix scope: `agent-work-admin/plan-phase`, `base/provision-agentic-config`, `docs-health/hygiene`, `exec-loop/ship-end`, `monorepo/mono-plan`, `product-design/consolidate-prototypes`, `product-design/logic-wiring`, `product-design/state-model`, `product-design/ux-variations`, and `vard/vard-align`.
- A parallel package build/check run raced on `packages/skillpacks/build`; serial reruns passed.

## Deploy

Skipped. This change updates repository source layout, packaged skill metadata, generated catalog artifacts, docs, and tests; no manual deploy contract applies.

## Next Work

Add `research-amend` under `packs/base/{claude,codex}/research-amend` with the alignment-gated amendment workflow described in `tasks/roadmap.md`.
