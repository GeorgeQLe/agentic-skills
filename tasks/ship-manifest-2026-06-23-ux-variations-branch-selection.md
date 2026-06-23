# Ship Manifest - UX Variations Branch Selection

## User Goal

Execute `$exec` for the next incomplete task: Step 1.5, "Update and version the mirrored `ux-variations` contracts."

## Changed Files

- `packs/product-design/codex/ux-variations/SKILL.md`
- `packs/product-design/claude/ux-variations/SKILL.md`
- `packs/product-design/codex/ux-variations/CHANGELOG.md`
- `packs/product-design/claude/ux-variations/CHANGELOG.md`
- `packs/product-design/codex/ux-variations/archive/v0.27/SKILL.md`
- `packs/product-design/claude/ux-variations/archive/v0.27/SKILL.md`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `prompts/exec/skill-prompt-20260623-145541-exec.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-23-ux-variations-branch-selection.md`

## Per-file Purpose

- `packs/product-design/{codex,claude}/ux-variations/SKILL.md`: bump to v0.28 and replace first-pending branch selection with deterministic branch routing and override persistence.
- `packs/product-design/{codex,claude}/ux-variations/CHANGELOG.md`: record the v0.28 behavior change.
- `packs/product-design/{codex,claude}/ux-variations/archive/v0.27/SKILL.md`: preserve the previous contract before the version bump.
- `packages/skillpacks/dist/skillpacks-manifest.json`: refresh package metadata for the staged skill version/content/archive changes.
- `docs/skills-showcase/assets/skills-data.js` and `apps/skills-showcase/public/assets/skills-data.js`: refresh public skill metadata for the `ux-variations` v0.28 bump.
- `prompts/exec/skill-prompt-20260623-145541-exec.md`: required prompt-history capture for the `$exec` invocation.
- `tasks/todo.md`: mark Step 1.5 complete, record review evidence, and write the self-contained Step 1.6 plan.
- `tasks/history.md`: record the shipped work.
- `tasks/ship-manifest-2026-06-23-ux-variations-branch-selection.md`: this quality-gate manifest.

## User-goal Mapping

- The active task required versioning mirrored `ux-variations` contracts and replacing first-pending default branch selection. The SKILL and CHANGELOG edits satisfy that directly.
- The archive files satisfy the repository skill-versioning rule.
- Generated package/showcase assets satisfy the quality gate for tracked skill metadata and behavior changes.
- Prompt/task/history/manifest files satisfy the repository workflow contract for skill invocation, task progress, and shipping evidence.

## Tests Run

- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` - expected red TDD result: 12 passed / 2 failed. Step 1.5's `ux-variations` assertion now passes; the remaining failures are for Steps 1.6-1.7 (`ui-interview` and missing `create-ui-experiment`).
- `scripts/skill-archive-audit.sh --strict` - passed, 398 skills checked, 0 violations.
- `scripts/skill-mirror-parity-audit.sh --verbose` - exits 1 only for known unrelated `session-analytics/session-triage` shared-section drift; no new `ux-variations` parity failure.
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs` - passed and refreshed the two `skills-data.js` files.
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs` - passed; no tracked proof-data diff remained.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` - passed.
- `npm run skillpacks:verify` - first failed because `packages/skillpacks/dist/skillpacks-manifest.json` was out of date; after `node packages/skillpacks/scripts/build-skillpacks-manifest.mjs`, rerun passed.
- `node scripts/audit-task-docs.mjs` - passed with 0 failures and 0 warnings; reported 4 manual advisory and 2 recurring advisory items.
- `git diff --check` - passed after task docs and this manifest were written.
- `git diff --cached --check` - passed for the staged shipping boundary.

## Skipped Tests

- Full phase green validation from Step 1.9 was not run because Steps 1.6-1.7 are still intentionally red in this TDD phase.
- `pnpm --dir apps/skills-showcase build` was not run because this step changed skill contracts and generated static metadata, not application runtime code. Skills Showcase data validation and `npm run skillpacks:verify` covered the changed generated surfaces.

## Adversarial Review

- Changed-file self-review verified both mirrors contain the required deterministic branch-selection sentence, raw first-pending prohibition, override/rationale persistence, and unchanged default-mode prototype deferral language.
- A first text scan used double quotes around literal backticks and triggered shell command substitution; no files changed. The scan was discarded and rerun with single-quoted patterns before relying on the result.
- `scripts/skill-archive-audit.sh --strict` verified the archive/version mechanics.
- `scripts/skill-mirror-parity-audit.sh --verbose` verified this change did not introduce new mirrored drift; the only failure is the pre-existing `session-triage` drift documented in prior task state.
- Generated-diff review identified and excluded unrelated `docs/benchmark-results-matrix.md` drift caused by an untracked `exec-codex-abbaef13` benchmark run.

## Residual Risk

- The phase remains intentionally red until Steps 1.6-1.7 update `ui-interview` and add `create-ui-experiment`.
- Mirror parity still fails on unrelated `session-analytics/session-triage` shared-section drift; Step 1.5 did not touch that skill.
- The deterministic selector text is contract-level only in this step. End-to-end product-design branch behavior remains covered by later Step 1.9 validation after all related contracts exist.

## Rollback Note

Revert this commit to restore `ux-variations` v0.27 contracts, remove the v0.27 archive additions, and return generated package/showcase metadata to the previous snapshot.

## Next Command

`$exec`
