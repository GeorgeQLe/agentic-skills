# Ship Manifest - UI Interview Non-Buildout Experiment Handoff

## User Goal

Execute `$exec` Step 1.6: update and version the mirrored `ui-interview` contracts so active branch state uses `ui_experiments[]`, default full UI mode remains non-buildout, and approved clickable route experiment work routes to the dedicated `create-ui-experiment` owner.

## Changed Files

- `prompts/exec/skill-prompt-20260623-175520-exec.md`
- `packs/product-design/codex/ui-interview/SKILL.md`
- `packs/product-design/claude/ui-interview/SKILL.md`
- `packs/product-design/codex/ui-interview/CHANGELOG.md`
- `packs/product-design/claude/ui-interview/CHANGELOG.md`
- `packs/product-design/codex/ui-interview/archive/v0.25/SKILL.md`
- `packs/product-design/claude/ui-interview/archive/v0.25/SKILL.md`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/benchmark-results-matrix.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-23-ui-interview-non-buildout.md`

## Per-File Purpose

- Prompt history records the visible skill invocation required by project convention.
- Mirrored `ui-interview` contracts archive `v0.25`, bump active contracts to `v0.26`, replace `ui_reviews[]` with `ui_experiments[]`, and add the non-buildout/clickable-experiment handoff boundary.
- Changelogs document the `v0.26` behavior change.
- Skillpacks manifest and Skills Showcase generated assets reflect the staged skill version/content change.
- `docs/benchmark-results-matrix.md` was refreshed because the Skills Showcase validator owns it and reads local ignored benchmark-run evidence.
- Task docs mark Step 1.6 complete, record review evidence, and prepare Step 1.7.

## User-Goal Mapping

- The `ui-interview` contract edits satisfy the Step 1.6 requirements and the layer1 assertions for non-buildout UI interview behavior.
- Generated metadata keeps package and public showcase surfaces consistent with the new skill version.
- Task/history/manifest files make the completed step and next handoff executable for a fresh session.

## Tests Run

- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` -> expected red TDD state: 13 passed / 1 failed. The remaining failure is Step 1.7 `create-ui-experiment` ownership.
- `rg 'ui_reviews\\[\\]' packs/product-design/{codex,claude}/ui-interview/SKILL.md` -> no matches.
- `scripts/skill-archive-audit.sh --strict` -> passed.
- `scripts/skill-mirror-parity-audit.sh --verbose` -> exited 1 only for known unrelated `session-analytics/session-triage` shared-section drift.
- `npm --workspace packages/skillpacks run build:manifest` -> regenerated package manifest.
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs` -> regenerated showcase skill data and benchmark matrix.
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs` -> regenerated proof data.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` -> passed after staging the full generated asset set.
- `npm run skillpacks:verify` -> passed.
- `pnpm --dir apps/skills-showcase build` -> passed.
- `node scripts/audit-task-docs.mjs` -> passed with informational advisory counts only.
- `git diff --check` -> passed.

## Skipped Tests

- Full Step 1.9 repository contract validation is intentionally deferred until Steps 1.7 and 1.8 complete the new skill and bundle generation.
- `node scripts/upgrade-design-tree-loop.mjs --check` was not rerun in this step because no convention source or design-tree bundle file changed.
- `node scripts/upgrade-alignment-page.mjs --check` and `node scripts/upgrade-interrogation-page.mjs --check` were not run because this step did not add a new skill or regenerate those bundles.
- No production smoke test was run because production deploy requires explicit user confirmation; local showcase build covered the generated public asset boundary.

## Adversarial Review

Review method: changed-file self-review plus targeted contract scans and focused layer1 coverage.

Findings:
- The first Skills Showcase validation failed because the generated proof fingerprint was stale after staged generated files entered the index, and because the validator owns `docs/benchmark-results-matrix.md`.
- Fixed by staging the complete generated asset set, including the benchmark matrix refresh, then rerunning validation to a clean pass.
- The remaining layer1 failure is not a regression; it is the planned Step 1.7 missing `create-ui-experiment` skill.

## Residual Risk

- `create-ui-experiment` does not exist yet, so `ui-interview` now points at a planned owner that the next step must create before the focused layer1 suite turns fully green.
- `docs/benchmark-results-matrix.md` now references the current local ignored `exec` benchmark report selected by the generator. This is consistent with the existing generator contract, but it is not semantically part of the `ui-interview` behavior change.
- `scripts/skill-mirror-parity-audit.sh --verbose` still fails on known unrelated `session-analytics/session-triage` drift.

## Rollback Note

Revert the shipping commit to restore `ui-interview` `v0.25`, remove the `v0.25` archive copies, and restore generated package/showcase metadata to the previous fingerprints.

## Next Command

`$exec`
