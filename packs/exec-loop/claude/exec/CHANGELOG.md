# Changelog

## v0.6 - 2026-06-29

- Replaced local Skills Showcase regeneration with the public `exports/skills-catalog/v1/**` refresh contract and routed website copy follow-up to the separate Showcase repo.

## v0.5 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.4 - 2026-06-11

- Added the npm CLI install alternative to cross-pack recommendation fallback wording while preserving the Claude `/pack install` route.

## v0.3 - 2026-06-09

- Updated Skills Showcase refresh commands to use app-owned generator and validator paths after the workspace split.

## v0.2

- Aligned the Claude exec-loop mirror version with Codex v0.2 after PoketoWork kanban routing hibernation; Claude execution behavior is unchanged.

## v0.1

- Renamed the Claude exec-loop command from `/exec` to `/exec` to avoid collision with Claude's default slash-command surface.
- Preserved the existing execution behavior, plan-mode approval contract, and `/ship` handoff.

## v0.0

- Initial exec-loop `run` skill contract.
