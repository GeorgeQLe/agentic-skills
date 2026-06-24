# Ship Manifest - Brainstorm Feature-Interview Availability Gate

Date: 2026-06-24
Branch: `master`

## Scope

- Added a `feature-interview` availability gate to mirrored `brainstorm` skill sources.
- Updated mirrored `session-triage` Pack Availability Guard text to treat `.agents/project.json.enabled_skills` as direct availability before falling back to provider-pack checks.
- Synced the active ignored `.codex/.claude` installed copies for `brainstorm` and `session-triage` with `scripts/pack.sh install brainstorm session-triage`.
- Added focused layer1 coverage for the exact downstream-skill availability contract.
- Captured the visible skill-update prompt and added a correction lesson.
- Regenerated package and Skills Showcase metadata from the staged index.

## Versioning

- `packs/product-design/codex/brainstorm`: `v0.3` -> `v0.4`; archived `archive/v0.3/SKILL.md`.
- `packs/product-design/claude/brainstorm`: `v0.3` -> `v0.4`; archived `archive/v0.3/SKILL.md`.
- `packs/session-analytics/codex/session-triage`: `v0.5` -> `v0.6`; archived `archive/v0.5/SKILL.md`.
- `packs/session-analytics/claude/session-triage`: `v0.5` -> `v0.6`; archived `archive/v0.5/SKILL.md`.

## Validation

- Passed: `pnpm --dir tests exec vitest run --project layer1 layer1/brainstorm-feature-interview-availability.test.ts` (1 file, 4 tests).
- Passed: targeted `rg` checks across canonical and installed mirrors for `Follow-up Skill Availability Gate`, `enabled_skills.feature-interview`, `npx skillpacks install feature-interview`, agent refresh guidance, `enabled_skills.<skill-name>`, and `npx skillpacks install <pack-or-skill>`.
- Passed: current-project replay showing `feature-interview` is unavailable:
  - `.agents/project.json` lacks `enabled_skills.feature-interview` and does not enable the `product-design` pack.
  - `scripts/pack.sh which feature-interview` reports `feature-interview` is provided by `product-design` and not installed.
  - `find .codex/skills .claude/skills -maxdepth 2 -path '*/feature-interview/SKILL.md' -print` returned no installed skill file.
- Passed: `scripts/skill-archive-audit.sh --strict` (400 skills, 0 violations).
- Passed: `node scripts/audit-task-docs.mjs` (0 failures, 0 warnings).
- Passed: `node packages/skillpacks/scripts/build-skillpacks-manifest.mjs --check`.
- Passed: `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`.
- Passed: `npm run skillpacks:verify`.
- Passed: `git diff --check --cached`.

## Diagnostic Note

- `scripts/pack.sh doctor` reports `brainstorm` and `session-triage` installed mirrors as `ok`.
- The same diagnostic still reports unrelated stale installed copies for other skills (`analyze-sessions`, `expert-review`, `reconcile-dev-docs`, `repo-glossary`, `ui-interview`, `user-flow-map`, and `ux-variations`). Those were not modified for this task.

## Rollback

Revert the commit containing this manifest. That restores the previous brainstorm/session-triage contracts, removes the new archives/test/prompt artifact, and restores generated metadata.
