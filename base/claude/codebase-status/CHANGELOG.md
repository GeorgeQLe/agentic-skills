# Changelog

## v0.11 - 2026-06-22

- Updated codebase-status AFPS route guidance to use `/consolidate-prototypes` as the primary post-UAT consolidation skill.

## v0.10 - 2026-06-13

- Removed direct execution-loop command handoffs from non-exec routing; route through approved YAML, task, or roadmap artifacts instead.


## v0.9 - 2026-06-12

- Updated canonical AFPS status routing to use the flow-tree prototype default: `/user-flow-map` -> `/ux-variations [specific-user-flow]` -> `/ui-interview [specific-ux-variation]`, with requirements-only/layout-mode as explicit bounded detours.

## v0.8 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.7 - 2026-06-11

- Updated optional business research detour pack checks from `business-discovery` to `business-research` after the pack rename.

## v0.6 - 2026-06-11

- Added npm-aware install-route alternatives to pack-local status recommendations while preserving Claude `/pack install` prerequisites.

## v0.5 - 2026-06-06

- Updated the canonical AFPS route string to start with `customer-discovery` while preserving `research/icp.md` as the evidence artifact check.

## v0.4 - 2026-06-06

- Updated canonical AFPS status routing to insert `/user-flow-map` after positioning and requirements-only UI interview before layout-mode UX variations.

## v0.3 - 2026-06-04

- Added explicit `business-discovery` pack-install fallback wording at optional `value-prop-canvas` and `lean-canvas` recommendation sites so the routing audit can verify cross-pack guards.

## v0.2 - 2026-05-29

- Added canonical AFPS routing evidence requirements, last completed skill next-step contract checks, pack availability guards, and phase-aware exec/ship/brainstorm routing boundaries.

## v0.0

- Archived previous skill contract.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
