# Ship Manifest - User-flow-map Branch Ordering

## User Goal

Execute `$exec` for the next incomplete task: Step 1.4, "Update and version the mirrored `user-flow-map` contracts."

## Changed Files

- `packs/product-design/codex/user-flow-map/SKILL.md`
- `packs/product-design/claude/user-flow-map/SKILL.md`
- `packs/product-design/codex/user-flow-map/CHANGELOG.md`
- `packs/product-design/claude/user-flow-map/CHANGELOG.md`
- `packs/product-design/codex/user-flow-map/archive/v1.4/SKILL.md`
- `packs/product-design/claude/user-flow-map/archive/v1.4/SKILL.md`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `prompts/exec/skill-prompt-20260623-144400-exec.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-23-user-flow-map-branch-ordering.md`

## Per-file Purpose

- `packs/product-design/{codex,claude}/user-flow-map/SKILL.md`: bump to v1.5 and require journey-ordered `branches[]`, progressive-review branch metadata, and branch-order override persistence.
- `packs/product-design/{codex,claude}/user-flow-map/CHANGELOG.md`: record the v1.5 behavior change.
- `packs/product-design/{codex,claude}/user-flow-map/archive/v1.4/SKILL.md`: preserve the previous contract before the version bump.
- `packages/skillpacks/dist/skillpacks-manifest.json`: refresh package metadata for the staged skill version/content/archive changes.
- `docs/skills-showcase/assets/skills-data.js` and `apps/skills-showcase/public/assets/skills-data.js`: refresh public skill metadata for the user-flow-map v1.5 bump. The generator also corrected stale showcase rows for already-shipped skill version changes present in the index.
- `docs/skills-showcase/assets/github-proof-data.js` and `apps/skills-showcase/public/assets/github-proof-data.js`: refresh proof metadata from the staged index and current task history.
- `prompts/exec/skill-prompt-20260623-144400-exec.md`: required prompt-history capture for the `$exec` invocation.
- `tasks/todo.md`: mark Step 1.4 complete, record review evidence, and write the self-contained Step 1.5 plan.
- `tasks/history.md`: record the shipped work.
- `tasks/ship-manifest-2026-06-23-user-flow-map-branch-ordering.md`: this quality-gate manifest.

## User-goal Mapping

- The active task required versioning mirrored `user-flow-map` contracts and adding branch-ordering requirements. The SKILL and CHANGELOG edits satisfy that directly.
- The archive files satisfy the repository skill-versioning rule.
- Generated package/showcase assets satisfy the quality gate for tracked skill metadata and behavior changes.
- Prompt/task/history/manifest files satisfy the repository workflow contract for skill invocation, task progress, and shipping evidence.

## Tests Run

- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` - expected red TDD result: 11 passed / 3 failed. Step 1.4's `user-flow-map` assertion now passes; the remaining failures are for Steps 1.5-1.7 (`ux-variations`, `ui-interview`, and missing `create-ui-experiment`).
- `scripts/skill-archive-audit.sh --strict` - passed, 398 skills checked, 0 violations.
- `scripts/skill-mirror-parity-audit.sh --verbose` - exits 1 only for known unrelated `session-analytics/session-triage` shared-section drift; no new `user-flow-map` parity failure.
- `npm run skillpacks:build` - passed and regenerated `packages/skillpacks/dist/skillpacks-manifest.json`.
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs` - passed.
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs` - passed.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` - passed.
- `npm run skillpacks:verify` - passed.
- `node scripts/audit-task-docs.mjs` - passed with 0 failures and 0 warnings; reported 4 manual advisory and 2 recurring advisory items.
- `git diff --check` - passed.
- `git diff --cached --check` - passed.

## Skipped Tests

- Full phase green validation from Step 1.9 was not run because Steps 1.5-1.7 are still intentionally red in this TDD phase.
- `pnpm --dir apps/skills-showcase build` was not run because this step changed skill contracts and generated static metadata, not application runtime code. Skills Showcase data validation and `npm run skillpacks:verify` covered the changed generated surfaces.

## Adversarial Review

- Changed-file self-review verified both mirrors contain the required phrases for ordered `branches[]`, override persistence, first value moment, primary task path, and progressive review sequence.
- `scripts/skill-archive-audit.sh --strict` verified the archive/version mechanics.
- `scripts/skill-mirror-parity-audit.sh --verbose` verified this change did not introduce new mirrored drift; the only failure is the pre-existing `session-triage` drift documented in prior task state.
- Generated-diff review identified and excluded unrelated `docs/benchmark-results-matrix.md` drift caused by an untracked `exec-codex-abbaef13` benchmark run.

## Residual Risk

- The phase remains intentionally red until Steps 1.5-1.7 update `ux-variations`, `ui-interview`, and add `create-ui-experiment`.
- Skills Showcase generated data also corrected stale rows for already-shipped skill version changes because the generator reads the staged index. This is included as generated metadata cleanup, not new source behavior.
- Mirror parity still fails on unrelated `session-analytics/session-triage` shared-section drift; Step 1.4 did not touch that skill.

## Rollback Note

Revert this commit to restore `user-flow-map` v1.4 contracts, remove the v1.4 archive additions, and return generated package/showcase metadata to the previous snapshot.

## Next Command

`$exec`
