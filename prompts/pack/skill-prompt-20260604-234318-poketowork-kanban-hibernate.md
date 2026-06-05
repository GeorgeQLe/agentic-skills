---
skill: pack
agent: codex
captured_at: 2026-06-04T23:43:18-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Hibernate PoketoWork Kanban Skills

## Summary
Hibernate all Poketo.work/PoketoWork kanban skill surfaces while the service is being rebuilt. Treat this as a pack-level deactivation, not a version bump: preserve the current skill source in repo-root archive, remove it from active pack discovery/install surfaces, and update docs/routing so agents stop recommending kanban workflows.

## Key Changes
- Move these active pack directories out of `packs/` into a repo-root archive path such as `archive/hibernated-packs/2026-06-poketowork-rebuild/`:
  - `business-app-kanban`
  - `devtool-kanban`
  - `game-kanban`
  - `poketowork-kanban`
- Do not use per-skill `archive/<version>/` for this change; that convention is for prior versions of active skills. This is a full pack hibernation.
- Add a short `README.md` in the archive folder explaining:
  - hibernated because Poketo.work is being rebuilt
  - date of hibernation
  - preserved packs and skill surfaces
  - reactivation criteria: service/API stable, auth contract known, smoke tests updated
- Update `scripts/pack.sh` so kanban aliases and direct install attempts fail with a clear hibernation message instead of “unknown pack”:
  - `business-app-kanban`
  - `devtool-kanban`
  - `game-kanban`
  - `poketowork-kanban`
  - common aliases like `business-kanban`, `dev-kanban`, `saas-kanban`
- Remove kanban recommendations from pack recommendation flows and docs. Replace them with a concise note that PoketoWork kanban packs are hibernated during the rebuild.

## Public Surface
- Active pack list should no longer include any kanban pack.
- Active skill inventory should no longer include:
  - `brainstorm-kanban`
  - `exec-kanban`
  - `roadmap-kanban`
  - `ship-kanban`
  - `ship-end-kanban`
  - `spec-interview-kanban`
  - `poketo-kanban`
  - `sync-roadmap-kanban`
- `scripts/pack.sh install <kanban-pack-or-alias>` should exit non-zero with an explicit hibernation message.
- `scripts/pack.sh which <kanban-skill>` should not report an active installable pack; if feasible, report that the skill is archived/hibernated.

## Docs And Generated Data
- Update docs that currently present kanban packs as installable:
  - `docs/packs.md`
  - `docs/pack-workflow-matrix.md`
  - `docs/skills-reference.md`
  - `docs/canonical-workflow-report.md`
  - `docs/skill-invocation-types.md`
- Update any script allowlists or audit exceptions that mention `poketowork-kanban` only because it was active.
- Regenerate showcase/catalog assets after the active skill set changes:
  - `node scripts/generate-skills-showcase-data.mjs`
  - `node scripts/generate-skills-showcase-github-data.mjs`
  - `scripts/validate-skills-showcase-data.sh`

## Test Plan
- Run active inventory checks:
  - `find packs -path '*kanban*' -name SKILL.md -not -path '*/archive/*'` should return no active kanban skills.
  - `scripts/pack.sh list` should not include kanban packs.
- Run behavior checks:
  - `scripts/pack.sh install business-app-kanban` exits non-zero with a clear hibernated message.
  - `scripts/pack.sh install dev-kanban` exits non-zero with the same hibernation class of message.
  - `scripts/pack.sh which brainstorm-kanban` does not report an active installable pack.
- Run repo validation:
  - `bash scripts/skill-archive-audit.sh --strict`
  - `bash scripts/skill-mirror-parity-audit.sh`
  - `bash scripts/skill-pack-routing-audit.sh`
  - generated showcase validation commands above

## Assumptions
- “Hibernate” means unavailable for active install and recommendation, while preserving source for later restoration.
- Existing installed copies in downstream projects are not removed by this repo change; users can run `scripts/pack.sh refresh` or `scripts/pack.sh remove <kanban-pack>` in those projects after pulling the update.
- Historical docs under `docs/history/archive/` can remain unchanged unless a validation script requires otherwise.
