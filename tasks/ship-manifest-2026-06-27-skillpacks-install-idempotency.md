# Ship Manifest - Skillpacks Install Idempotency

Date: 2026-06-27

## Scope

- Updated the npm CLI install lifecycle so install helpers return whether they changed skill roots or `.agents/project.json`.
- Changed `installResolved` to print reload/fresh-session guidance only after real install mutations.
- Added the already-installed individual-skill no-op output: `Skill already installed!`.
- Strengthened lifecycle regression coverage so repeated `install quality-sweep` emits only the no-op message and preserves project config plus installed skill file snapshots.
- Refreshed `packages/skillpacks/dist/skillpacks-manifest.json` for pre-existing `upgrade-interrogation-pages` `v0.1` manifest drift found by `build:check`.
- Captured the visible `investigate` invocation prompt and updated task documentation.

## Verification

- `node --test --test-name-pattern "keeps already-current managed installs quiet on reinstall" packages/skillpacks/test/lifecycle.test.mjs`
- `npm --workspace packages/skillpacks run test:node`
- `npm --workspace packages/skillpacks run build:check`
- local `runSkillpacksCli(['install', 'fork-idea-branch'])` reinstall smoke
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

## Deploy

Not applicable. This change updates the published package source and generated package manifest, but does not modify a deployed runtime service.
