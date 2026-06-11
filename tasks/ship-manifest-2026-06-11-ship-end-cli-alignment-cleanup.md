# Ship Manifest - Ship-End CLI Module And Alignment Artifact Cleanup

## User Goal

`$ship-end`

## Changed Files

- `alignment/analyze-sessions-afps-workflow-patterns.html`
- `alignment/uat-card-pack-migration.html`
- `alignment/index.html`
- `packages/skillpacks/src/cli/update-check.mjs`
- `prompts/analyze-sessions/skill-prompt-20260609-120000-afps-workflow-patterns.md`
- `prompts/ship-end/skill-prompt-20260611-131120-ship-end.md`
- `tasks/history.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-11-ship-end-cli-alignment-cleanup.md`

## Per-File Purpose

- `alignment/analyze-sessions-afps-workflow-patterns.html`: tracks the AFPS workflow-patterns session-analysis review page and adds active-page metadata plus TTS support.
- `alignment/uat-card-pack-migration.html`: tracks the UAT plan review page for card-pack migration and deck-builder acceptance, with active-page metadata plus TTS support.
- `alignment/index.html`: indexes the two active alignment pages and updates page/category counts.
- `packages/skillpacks/src/cli/update-check.mjs`: adds the update-check module already imported by the tracked `packages/skillpacks/bin/skillpacks.mjs` CLI entrypoint.
- `prompts/analyze-sessions/skill-prompt-20260609-120000-afps-workflow-patterns.md`: tracks the visible invocation for the AFPS workflow-patterns analyze-sessions artifact.
- `prompts/ship-end/skill-prompt-20260611-131120-ship-end.md`: tracks the visible `$ship-end` invocation and pasted skill context.
- `tasks/history.md`: records the wrap-up result and deploy blocker.
- `tasks/roadmap.md`: records the ship-end plan and acceptance criteria.
- `tasks/todo.md`: records completed steps, review notes, validation, stale-task reconciliation, and deploy follow-up.
- `tasks/ship-manifest-2026-06-11-ship-end-cli-alignment-cleanup.md`: documents the shipping boundary and quality gate.

## User-Goal Mapping

- `$ship-end` requires inspecting the dirty tree, updating task/history docs, validating, committing, and pushing.
- The missing `update-check.mjs` file is included because a clean checkout of current `HEAD` has a tracked CLI import for it but no tracked module.
- The two alignment pages are included because they were active untracked artifacts and now pass the repository active alignment-page audit.
- The prompt-history files satisfy the repository prompt-history convention for invoked skills and the previously generated analyze-sessions artifact.
- Task/history/manifest updates make the wrap-up auditable before commit and push.

## Tests Run

- `node --check packages/skillpacks/src/cli/update-check.mjs`
- `node --check packages/skillpacks/bin/skillpacks.mjs`
- `npm --workspace skillpacks run test:node` (50 tests passed)
- `npm --workspace skillpacks run build:check`
- `node scripts/audit-alignment-pages.mjs` (48 active pages; TTS include, page metadata, viewport meta, embed prohibition, and index integrity exact)
- `npm --workspace skillpacks run skillpacks:list`
- `git diff --check`
- Targeted review scans:
  - `rg -n "update-check\.mjs|startUpdateCheck|printUpdateNotice" packages/skillpacks/bin/skillpacks.mjs packages/skillpacks/src/cli/update-check.mjs`
  - `rg -n "alignment/analyze-sessions-afps-workflow-patterns.html|alignment/uat-card-pack-migration.html|analyze-sessions-afps-workflow-patterns.html|uat-card-pack-migration.html" alignment/index.html`
  - `git status --short | rg '^\?\? \.claude/skills|^\?\? \.codex/skills|^ M \.claude/skills|^ M \.codex/skills'` returned no generated local skill-root changes.

## Skipped Tests

- Skills Showcase app build/deploy checks from `tasks/deploy.md` were not run because this boundary does not change `apps/skills-showcase/`, generated showcase assets, app routing, app build configuration, or deploy behavior.
- A live npm registry assertion for the update-check notice was not run. The module is intentionally best-effort: fetch failures are caught and the package binary smoke (`skillpacks:list`) verifies the CLI remains usable when the check runs.
- `$deploy` was not invoked because the deploy skill is not installed. `scripts/pack.sh which deploy` reports `deploy` is provided by the uninstalled `release-ops` pack.

## Adversarial Review

- Failure mode checked: a clean checkout has `packages/skillpacks/bin/skillpacks.mjs` importing `../src/cli/update-check.mjs`, but `git ls-tree HEAD packages/skillpacks/src/cli/update-check.mjs` was empty before this boundary. Including the module closes that clean-checkout gap.
- Failure mode checked: active alignment pages could be committed without required TTS, metadata, or index entries. The initial scoped audit failed on those exact issues; after remediation, the full active alignment-page audit passed.
- Failure mode checked: prompt/task files could contain secrets. A targeted token/secret scan over the shipping boundary found no credential values; matches were ordinary policy words in copied skill/task text.
- Failure mode checked: generated local skill roots could be staged accidentally. `git status --short` showed no `.claude/skills/**` or `.codex/skills/**` changes.
- Equivalent review rationale: this boundary contains one missing source module for an already-tracked import plus static alignment/task artifacts. Changed-file self-review, source/import scans, package executable checks, and the full alignment audit are a tighter fit than a broad project review lane for this small cleanup.

## Residual Risk

- The update notice's successful live-registry display is not asserted under network access. Risk is limited because `startUpdateCheck()` and `printUpdateNotice()` catch failures and the CLI smoke test confirms normal command output still succeeds.
- The two alignment pages are large static HTML artifacts; validation proves active-page contract compliance but does not review every content claim in those reports.
- Deployment remains outstanding because `tasks/deploy.md` exists and `$deploy` is unavailable until the `release-ops` pack or `deploy` skill is installed.

## Rollback Note

Revert the shipped commit to remove the tracked update-check module, two alignment pages, index updates, prompt artifacts, and task/history records. If only the alignment pages need removal, delete their index cards and the two HTML files, then rerun `node scripts/audit-alignment-pages.mjs`.

## Next Command

`$pack install release-ops`
