# Ship Manifest - `uninstall-global --dry-run`

## User Goal

Add read-only preview support for `npx skillpacks uninstall-global --dry-run`, including `--reinstall-base --dry-run`, so users can see global cleanup and project-local base-skill migration actions without mutating global skills or project files.

## Changed Files

- `packages/skillpacks/src/cli/lifecycle.mjs`
- `packages/skillpacks/src/cli/run-pack-script.mjs`
- `packages/skillpacks/test/lifecycle.test.mjs`
- `packages/skillpacks/test/compatibility.test.mjs`
- `CHANGELOG.md`
- `README.md`
- `docs/QUICKSTART.md`
- `docs/scripts-reference.md`
- `docs/skillpacks-npm-distribution.md`
- `docs/skills-reference.md`
- `prompts/exec/skill-prompt-20260623-110837-add-uninstall-global-dry-run.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-23-uninstall-global-dry-run.md`

## Per-File Purpose

- `lifecycle.mjs`: separates global uninstall discovery from mutation, adds dry-run output, and previews reinstall-base project migration through the existing refresh planner.
- `run-pack-script.mjs`: accepts `--dry-run` for `uninstall-global` and advertises the new help surface.
- `lifecycle.test.mjs`: covers plain dry-run, reinstall-base dry-run, no-project dry-run initialization preview, parser flag order, unsupported args, and read-only filesystem assertions.
- `compatibility.test.mjs`: keeps the documented command matrix aligned with CLI help and parser ownership.
- `CHANGELOG.md` and docs/README files: document the new dry-run command surface and read-only guarantees.
- Prompt/task/history/manifest files: record the visible invocation, active plan, verification results, and shipping boundary.

## User-Goal Mapping

- Preview global removals: `uninstallGlobal({ dryRun: true })` prints `Would remove ...` from `globalRepoSkillInstalls()` and never calls removal helpers.
- Preview reinstall-base migration: dry-run discovers roots, computes the would-be `base_skills: true` config in memory, and reuses refresh dry-run planning output.
- Avoid mutation: dry-run paths skip `initProject`, `enableProjectLocalBaseSkills`, project config writes, skill-root sync, pruning, and project locks.
- Preserve existing behavior: normal uninstall still prints `Removed ...`; unsupported args still throw the existing `unsupported flag` / `unexpected argument` errors.

## Tests Run

- `node --test packages/skillpacks/test/lifecycle.test.mjs`
- `npm --workspace packages/skillpacks run test:node`
- `npm run skillpacks:verify`
- `git diff --check`

## Skipped Tests

- No additional app or browser checks were run because the change is limited to the Node CLI package, package docs, and task artifacts.

## Adversarial Review

- Checked that dry-run uses the same ownership predicate as real cleanup, so unmanaged directories and foreign managed markers stay out of both preview and deletion.
- Checked that reinstall-base dry-run plans against the same base-skill config shape as real init/reinstall by consolidating the config helper.
- Checked that dry-run does not acquire project locks and tests assert `.agents/project.json`, skill roots, global installs, and lock directories remain absent/unchanged.
- Checked the command matrix and help text so the new parser surface is documented and covered.

## Residual Risk

- Dry-run planning can still fail on malformed or stale project config, matching the same validation path used by refresh planning. That is expected; no project mutation occurs before such failures.

## Rollback Note

Revert the shipping commit to remove the dry-run parser branch, lifecycle preview helpers, docs, and tests. Existing normal `uninstall-global` and `--reinstall-base` behavior should return to the prior mutation-only path.

## Next Command

`$ship-end`
