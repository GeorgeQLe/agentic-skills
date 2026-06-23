# Changelog

## v0.6 - 2026-06-23

- Added task-doc audit gating and current-only next-work routing so stale roadmap/advisory unchecked items are not recommended as executable session follow-up unless promoted into `tasks/todo.md`.

## v0.5 - 2026-06-17

- Added owning-route precedence for research, alignment, design, UI, UX, prototype-test, and copy-audit review artifacts so `/ship-end` does not route those workflows through `/exec` when a narrower skill, review, or compiled-YAML route owns the next action.

## v0.4 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.3 - 2026-06-11

- Added npm CLI install alternatives to cross-pack wrap-up routing fallback wording while preserving Claude `/pack install` recommendations.

## v0.0

- Archived previous skill contract.

# ship-end changelog (claude)

## v0.2 - 2026-05-30

- Added the pack install artifact boundary: ship `.agents/project.json` when pack configuration changes, but leave generated `.claude/skills/**` and `.codex/skills/**` roots uncommitted.

## v0.1 - 2026-05-26

- Gate cross-pack routing recommendations with formal inline pack-availability conditionals instead of informal parenthetical pack mentions
