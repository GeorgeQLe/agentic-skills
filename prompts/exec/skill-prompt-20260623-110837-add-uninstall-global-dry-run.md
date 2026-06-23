---
skill: exec
agent: codex
captured_at: 2026-06-23 11:08:37 America/New_York
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Add `uninstall-global --dry-run`

## Summary

Add a read-only preview mode for `npx skillpacks uninstall-global --dry-run`, including full support for `--reinstall-base --dry-run`. The dry run should show exactly what would be removed and, when reinstall mode is requested, what project-local base skill migration would do, without deleting global skills, writing `.agents/project.json`, installing skill roots, pruning roots, or initializing a project.

## Key Changes

- Extend CLI parsing so `uninstall-global` accepts:
  - `uninstall-global --dry-run`
  - `uninstall-global --reinstall-base --dry-run`
  - `uninstall-global --dry-run --reinstall-base`
- Update help text to show `uninstall-global [--reinstall-base] [--dry-run]`.
- Refactor global cleanup to separate planning from mutation:
  - Detect repo-managed global installs using existing ownership logic.
  - In normal mode, keep current `Removed ...` behavior.
  - In dry-run mode, print `Would remove ...` lines and a summary like `Dry run. Would remove N repo-managed base skill install(s) from <home>.`
- Add dry-run behavior for `--reinstall-base`:
  - Discover project roots as today.
  - If roots exist, print the same project list and per-project preview using the existing refresh planner where possible.
  - If no project roots exist, print that the current directory would be initialized with base skills.
  - Do not call `initProject`, `enableProjectLocalBaseSkills`, `writeProjectConfigIfChanged`, `syncExpectedSkillRoots`, or `pruneOrphanedSkillRoots`.
- Keep unsupported argument behavior intact for unknown flags and positional args.

## Test Plan

- Add lifecycle tests for plain dry run:
  - Repo-managed global installs are listed as `Would remove`.
  - Unmanaged and foreign managed installs are not listed.
  - Files still exist after command completes.
  - Exit code is `0`.
- Add lifecycle tests for `--reinstall-base --dry-run`:
  - Global removals are previewed but not deleted.
  - Existing discovered projects are previewed without changing `.agents/project.json` or skill roots.
  - No-project case says the current directory would be initialized, but no `.agents/project.json` is created.
- Add parser tests or extend existing rejection tests:
  - `--dry-run --reinstall-base` and `--reinstall-base --dry-run` both work.
  - Unknown flags still fail with `uninstall-global: unsupported flag`.
- Run:
  - `node --test packages/skillpacks/test/lifecycle.test.mjs`
  - `npm --workspace packages/skillpacks run test:node`
  - `npm run skillpacks:verify`
  - `git diff --check`

## Assumptions

- Dry-run should be informational and exit `0` even when there are zero global installs.
- `--reinstall-base --dry-run` should preview project-local migration but not acquire project write locks or mutate any project files.
- Output should use existing command language and project refresh dry-run formatting where practical, rather than introducing a new report format.
