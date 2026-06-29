# Changelog

## v0.9 - 2026-06-29

- Replaced local Skills Showcase regeneration with the public `exports/skills-catalog/v1/**` refresh contract and routed website copy follow-up to the separate Showcase repo.

## v0.8 - 2026-06-23

- Added task-doc audit gating and current-only next-work routing so historical roadmap/advisory unchecked items are not selected as executable work unless promoted into `tasks/todo.md`.

## v0.7 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.6 - 2026-06-11

- Added npm CLI install alternatives to cross-pack next-step routing fallback wording while preserving Claude `/pack install` recommendations.

## v0.5 - 2026-06-09

- Updated Skills Showcase refresh commands to use app-owned generator and validator paths after the workspace split.

## v0.0

- Archived previous skill contract.

# ship changelog (claude)

## v0.4 - 2026-05-30

- Added the pack install artifact boundary: ship `.agents/project.json` when pack configuration changes, but leave generated `.claude/skills/**` and `.codex/skills/**` roots uncommitted.

## v0.3 - 2026-05-27

- Added the non-trivial mutation quality gate, ship manifest requirements, Skills Showcase freshness refresh, and correction-boundary checks.

## v0.2 - 2026-05-27

- Allow `none` routing when all planned work is genuinely complete instead of forcing a route to `/exec`

## v0.1 - 2026-05-26

- Gate cross-pack routing recommendations with formal inline pack-availability conditionals instead of informal parenthetical pack mentions
