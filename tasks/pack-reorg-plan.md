# Pack Reorganization Plan

Date: 2026-05-04

## Goal

Implement the first four approved context-reduction recommendations from `tasks/pack-context-audit.md`.

## Scope

- Split `business-app` skills into `business-discovery`, `business-growth`, and `business-ops`.
- Split `creator-media` skills into `creator-foundation` and `youtube-ops`.
- Move global `youtube-audit` into `youtube-ops`.
- Move fleet/portfolio skills into a new `project-fleet` pack.

## Compatibility Strategy

- Keep old pack names as compatibility aliases in `scripts/pack.sh`.
- Keep old `PACK.md` files as thin migration guidance, not as skill containers.
- Do not keep domain-specific skills in global core when their new pack owns them.
- Preserve dirty in-progress LinkedIn edits while moving creator foundation skills.

## Validation

- `scripts/pack.sh list`
- Temporary install checks for new and compatibility aliases.
- `./scripts/skill-versions.sh --missing`
- `./scripts/skill-deps.sh --broken`
- `./scripts/skill-next-step-routing.sh --missing`
- Targeted `rg` checks for moved skills and pack docs.
- `git diff --check`

