---
skill: investigate
agent: codex
captured_at: 2026-06-22T21:50:44-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Plan: Flag Legacy Global Skills and Reinstall Base Locally

## Summary
- Use the `investigate` general strategy. User claims are confirmed: `refresh --all` only scans project roots, and `uninstall-global` currently rejects all args, so `--reinstall-base` does not exist.
- Root cause: `packages/skillpacks/src/cli/lifecycle.mjs` keeps global cleanup and multi-project refresh as separate flows. No reusable global detector exists, and `run-pack-script.mjs` hard-codes `uninstall-global` as no-args only.
- Before implementation, write the required prompt-history file plus `tasks/roadmap.md` / `tasks/todo.md` entries, then keep changes scoped to the CLI lifecycle path and tests.

## Key Changes
- Add a reusable detector in `lifecycle.mjs` that scans `~/.claude/skills` and `~/.codex/skills` for skillpacks-owned managed installs using the same ownership rules as `removeRepoSkillInstall`.
- Update `refresh --all` and `refresh --all --dry-run` to run that detector, print a flagged warning when legacy global installs exist, suggest `npx skillpacks uninstall-global`, continue scanning projects, and exit nonzero if globals were found.
- Add `uninstall-global --reinstall-base`:
  - Remove the same legacy global installs as today.
  - Discover project roots under the command’s current directory using the existing `refresh --all` discovery behavior.
  - For each discovered project, enable `base_skills: true`, preserve existing project config fields, install the current package’s base skills, prune/refresh like normal project refresh, and print per-project results.
  - If no project roots are discovered, initialize the current directory with base skills so the invoking directory is covered.
- Update CLI help and docs/changelog to describe the new warning and reinstall mode.

## Public Interface
- `npx skillpacks refresh --all`: unchanged options, new warning/exit-1 condition when legacy global skills are present.
- `npx skillpacks uninstall-global --reinstall-base`: new option; no other positional args accepted.
- `npx skillpacks uninstall-global`: existing cleanup behavior preserved.

## Tests
- Add lifecycle tests with temp home roots for:
  - `refresh --all` flags repo-managed global installs, suggests `npx skillpacks uninstall-global`, still refreshes valid project roots, and exits `1`.
  - `refresh --all --dry-run` reports the same global flag without mutating project skills.
  - `uninstall-global --reinstall-base` removes only skillpacks-owned global installs, preserves unmanaged/foreign skills, enables base skills in each discovered project, and installs `.claude/skills` / `.codex/skills` base roots.
  - No discovered projects: `--reinstall-base` initializes the current directory with base skills.
  - Unsupported `uninstall-global` args still fail.
- Run `npm --workspace packages/skillpacks run test:node` and `npm --workspace packages/skillpacks run build:check`.

## Assumptions
- “Current directory that invoked the command and all subdirectories” means existing `.agents/project.json` project roots discovered by the current `refresh --all` traversal, plus the current directory as an init target only when no project roots exist.
- “Global skills” means skillpacks-owned managed installs under user-home `.claude/skills` and `.codex/skills`, not unmanaged user-created skill directories.
