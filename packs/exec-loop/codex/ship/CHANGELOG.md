# Changelog

## v0.7 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.6 - 2026-06-11

- Added npm CLI install alternatives to cross-pack next-step routing fallback wording while preserving Codex `$pack install` recommendations.

## v0.5 - 2026-06-09

- Updated Skills Showcase refresh commands to use app-owned generator and validator paths after the workspace split.

## v0.0

- Archived previous skill contract.

# ship changelog (codex)

## v0.4 - 2026-05-30

- Added the pack install artifact boundary: ship `.agents/project.json` when pack configuration changes, but leave generated `.claude/skills/**` and `.codex/skills/**` roots uncommitted.

## v0.3 - 2026-05-27

- Added the non-trivial mutation quality gate, ship manifest requirements, Skills Showcase freshness refresh, and correction-boundary checks.

## v0.2 - 2026-05-27

- Allow `none` routing when all planned work is genuinely complete instead of forcing a route to `$exec`

## v0.1 - 2026-05-26

- Gate cross-pack routing recommendations with formal inline pack-availability conditionals using `$pack install` syntax
