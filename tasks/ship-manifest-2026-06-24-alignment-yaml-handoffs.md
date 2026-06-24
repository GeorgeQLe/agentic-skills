# Ship Manifest - Alignment Review YAML Handoffs

Date: 2026-06-24
Branch: `master`

## User Goal

Clarify alignment-page routing docs so agents explicitly tell users to review an HTML alignment page, compile feedback or approval YAML, and continue in the producing skill context. Revision YAML must route to amendment and renewed review; final approval YAML authorizes artifact confirmation.

## Changed Files

- `docs/alignment-page-convention.md`: canonical alignment-page handoff contract.
- `base/{codex,claude}/create-alignment-page/SKILL.md`: active portable alignment-page skill contracts bumped to `v0.2`.
- `base/{codex,claude}/create-alignment-page/CHANGELOG.md`: version notes for `v0.2`.
- `base/{codex,claude}/create-alignment-page/archive/v0.1/SKILL.md`: required pre-bump archives.
- `base/**/ALIGNMENT-PAGE.md` and `packs/**/ALIGNMENT-PAGE.md`: 306 generated bundles refreshed from the canonical convention.
- `tests/layer1/alignment-gates.test.ts`: regression assertions for generated handoffs and platform-specific create-alignment-page wording.
- `docs/skills-showcase/assets/*.js` and `apps/skills-showcase/public/assets/*.js`: generated Skills Showcase metadata reflecting `create-alignment-page` `v0.2`.
- `packages/skillpacks/dist/skillpacks-manifest.json`: regenerated package manifest reflecting versions, content hashes, and archives.
- `prompts/exec/skill-prompt-20260624-103955-alignment-yaml-handoffs.md`: prompt-history capture.
- `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, and this manifest: execution tracking and completion record.

## Per-File Purpose

- Canonical convention: adds the durable review/compile/paste route, Pattern A parent-route exception, feedback-vs-approval YAML distinction, downstream blocking, and no-duplicate-clear rule.
- Create-alignment-page mirrors: give user-facing Codex `$<producing-skill> ...` and Claude `/<producing-skill> ...` handoffs after page creation.
- Generated bundles: carry the convention into every generated alignment-producing skill.
- Tests: enforce the new contract at layer1.
- Showcase and package generated data: keep published/indexed metadata consistent with the skill version bump.
- Task/prompt/history files: satisfy repo workflow and shipping traceability.

## User-Goal Mapping

- Review page handoff: implemented in canonical convention and generated bundles.
- Feedback/revision YAML routing: implemented in canonical convention, create-alignment-page mirrors, and tests.
- Final approval YAML authorization: implemented in create-alignment-page mirrors and preserved in the canonical after-approval contract.
- Fresh-session behavior: preserved and cross-referenced in the pre-approval stop.
- Platform-specific command wording: implemented in Codex and Claude mirrors and tested.

## Tests Run

- `node scripts/upgrade-alignment-page.mjs --check` - passed.
- `node scripts/skill-alignment-routing-audit.mjs --report` - passed, 0 findings.
- `scripts/skill-research-loop-handoff-audit.sh` - passed.
- `apps/skills-showcase/node_modules/.bin/vitest run tests/layer1/alignment-gates.test.ts tests/layer1/skill-alignment-routing-audit.test.ts tests/layer1/afps-alignment-preview-gates.test.ts --root .` - passed, 3 files / 44 tests.
- `scripts/skill-archive-audit.sh --strict` - passed, 400 skills checked.
- `node scripts/audit-task-docs.mjs` - passed after correcting task heading structure.
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs` - passed.
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs` - passed.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` - passed.
- `npm run skillpacks:verify` - initially failed on stale `packages/skillpacks/dist/skillpacks-manifest.json`, passed after regenerating the manifest.
- `git diff --check` - passed.
- `git diff --cached --check` - passed.

## Skipped Tests

- Full repository Vitest/build was not run. The change is a documentation/contract and generated-bundle update; focused layer1 routing coverage, generator checks, package verification, showcase validation, and diff hygiene cover the touched behavior.
- Deployment was not run. No runtime deployment surface changed.

## Adversarial Review

- Checked that the new producing-skill route does not override Pattern A research-loop routing by preserving the `## Invoke With YAML` parent-orchestrator exception and running the Pattern A handoff audit.
- Checked that generated bundles were not hand-edited by running the alignment generator in write mode and `--check`.
- Checked that the skill version bump had complete archives and metadata by running strict archive audit, showcase validation, and `npm run skillpacks:verify`.

## Residual Risk

- The behavior is enforced through skill contracts and tests, not runtime YAML parsing. Future agents still need to follow the documented routing contract.
- The canonical wording propagates to 306 bundles, so review surface is broad but generator-verified.

## Rollback Note

Revert this commit to restore the prior generic handoff wording, `create-alignment-page` `v0.1` contracts, generated bundles, tests, and regenerated metadata together.

## Next Command

`$brainstorm`
