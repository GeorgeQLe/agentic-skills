# Ship Manifest - spinoff-idea Skill

## User Goal

Ship the already-finished `spinoff-idea` skill boundary as the next clean unit after confirming the workflow-design alignment page.

## Changed Files

Included in this ship boundary:

- `README.md`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/operating-modes.md`
- `docs/pack-workflow-matrix.md`
- `docs/packs.md`
- `docs/skill-invocation-types.md`
- `docs/skills-reference.md`
- `docs/skills-showcase/assets/github-proof-data.js`
- `docs/skills-showcase/assets/skills-data.js`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `packages/skillpacks/src/cli/pack-normalization.mjs`
- `packs/project-fleet/PACK.md`
- `packs/project-fleet/codex/spinoff-idea/CHANGELOG.md`
- `packs/project-fleet/codex/spinoff-idea/SKILL.md`
- `packs/project-fleet/codex/spinoff-idea/agents/openai.yaml`
- `prompts/ship/skill-prompt-20260623-005507-ship.md`
- `prompts/skill-creator/skill-prompt-20260622-231359-spinoff-idea.md`
- `scripts/pack.sh`
- `scripts/skill-mirror-parity-audit.sh`
- `tasks/history.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-23-spinoff-idea.md`
- `tests/harness/bench-coverage.ts`
- `tests/layer4/setups/packs/pack-workflows.setup.ts`

Left untouched for the separate release-prep boundary:

- `CHANGELOG.md`
- `packages/skillpacks/package.json`
- `prompts/exec/skill-prompt-20260622-224739-skillpacks-011-release-prep.md`

## Per-File Purpose

- `packs/project-fleet/codex/spinoff-idea/*`: add the new planning skill, UI metadata, and skill-local changelog.
- `packs/project-fleet/PACK.md`, `README.md`, `docs/operating-modes.md`, `docs/pack-workflow-matrix.md`, `docs/packs.md`, `docs/skill-invocation-types.md`, `docs/skills-reference.md`: make the new skill discoverable in the project-fleet pack and docs.
- `packages/skillpacks/src/cli/pack-normalization.mjs`, `scripts/pack.sh`: route `spinoff-idea` and spelling variants to `project-fleet`.
- `scripts/skill-mirror-parity-audit.sh`: record the new skill as an approved Codex-only project-fleet command surface.
- `tests/harness/bench-coverage.ts`, `tests/layer4/setups/packs/pack-workflows.setup.ts`: add benchmark/fixture coverage metadata for the new skill.
- `packages/skillpacks/dist/skillpacks-manifest.json`, Skills Showcase asset files: generated package and website data for the new skill.
- `prompts/**`: required visible invocation history for the creation and shipping skill invocations.
- `tasks/**`: shipping record, queue status, and next-step handoff.

## User-Goal Mapping

The user invoked `$ship` after the status handoff identified `spinoff-idea` as the next completed work to package. This boundary ships that completed skill without pulling in the separate `skillpacks 0.1.11` release-prep edits.

## Tests Run

- `npm --workspace packages/skillpacks run build` - passed with 388 skills, 41 packs.
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs` - passed.
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs` - passed.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` - passed after staging regenerated assets.
- `npm run skillpacks:verify` - passed; package verification reported `skillpacks@0.1.11`, manifest check passed, and npm dry-run pack completed.
- `node --test packages/skillpacks/test/pack-normalization.test.mjs packages/skillpacks/test/manifest.test.mjs` - passed, 26/26 tests.
- `scripts/pack.sh which spinoff-idea` - passed; reports `spinoff-idea` is provided by `project-fleet`.
- `scripts/skill-archive-audit.sh` - passed; 398 skills checked, 0 violations.
- `pnpm --dir apps/skills-showcase build` - passed; Next.js production build compiled, typechecked, and generated 209 static pages.
- `git diff --cached --check` and `git diff --check` - passed.

Known unrelated check:

- `scripts/skill-mirror-parity-audit.sh` - failed on existing `session-analytics/session-triage` shared-section drift: `Pack Availability Guard` differs after platform syntax normalization. The failure is unrelated to `spinoff-idea`; the new one-sided `project-fleet/spinoff-idea` exception is present in this boundary.

## Skipped Tests

- Full repository test suite was not run. The changed executable surface is limited to pack alias resolution, generated metadata, and the new skill contract; focused package tests, package verification, pack discovery, archive audit, Skills Showcase validation, and app production build cover the affected surfaces more directly.
- The known failing Layer 1 benchmark setup suite was not rerun because `tasks/todo.md` already records unrelated pre-existing failures for `analyze-sessions`, `spec-interview`, and `consolidate-variations`.

## Adversarial Review

Reviewed the staged boundary against the dirty working tree to ensure release-prep edits are excluded. The highest-risk failure mode was mixing the unstaged `packages/skillpacks/package.json` reset to `0.1.10` into this spinoff commit; generation and package verification were run against the committed `0.1.11` package boundary, then the release-prep file was left unstaged for the next pass.

Targeted review checks:

- New skill has `version: v0.0`.
- The skill is planning-only: it outputs a prompt for `$idea-scope-brief`, does not run that skill, does not copy source files, and does not mutate the target repo.
- Pack aliases resolve `spinoff-idea` to `project-fleet`.
- Generated manifest and showcase data list 388 skills and include `pack-project-fleet-codex-spinoff-idea`.
- The Codex-only parity exception is scoped to `project-fleet/spinoff-idea`.

## Residual Risk

The main residual risk is wording quality in the new skill prompt contract: it may need refinement after first real use if it over-includes source-repo context or under-specifies the target repo handoff. Current verification covers discoverability, packaging, generated metadata, and the safety contract, but not a live end-to-end use on a second repository.

The repo still has unrelated release-prep edits unstaged. They are intentionally preserved for the next task and are not part of this commit.

## Rollback Note

If this ship causes issues, revert the commit that adds `spinoff-idea`. That removes the skill, docs references, aliases, generated metadata, prompt logs, tests, and task/history records in one boundary.

## Next Command

`$exec`
