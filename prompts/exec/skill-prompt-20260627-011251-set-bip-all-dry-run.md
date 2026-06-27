---
skill: exec
agent: codex
captured_at: 2026-06-27T01:12:51-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Add `set-bip --all` and Dry Run

## Summary
Add multi-project support for `skillpacks set-bip <on|off|unset> --all`, plus `--all --dry-run` to preview parse/lock/config issues and planned changes before mutating any `.agents/project.json` files.

## Key Changes
- Update `runSkillpacksCli` parsing for `set-bip` to accept exactly one mode plus optional `--all` and `--dry-run`.
- Add a Node-owned batch path using existing project discovery from `discoverProjectRoots`.
- Keep single-project behavior unchanged: `set-bip on`, `off`, and `unset` continue to work as today.
- Implement dry-run behavior:
  - scan all discovered project roots under the current directory;
  - for each project, read/normalize the config and report whether `alignment.build_in_public` would be set, changed, removed, or already match;
  - do not write files or acquire persistent mutation locks;
  - report parse/read failures as unsafe;
  - print `Safe to run: yes/no` and recommend `skillpacks set-bip <mode> --all` only when safe.
- Implement apply behavior:
  - run `setBuildInPublicMode(mode, root)` for each discovered project;
  - continue across failures using the existing `runAcrossProjects` summary style;
  - return nonzero if any project fails or is flagged.

## Public Interface
- Usage text changes from:
  - `set-bip <mode>               Set build-in-public alignment default: on, off, or unset`
- To:
  - `set-bip <mode> [--all] [--dry-run]`
  - `set-bip <mode> --all --dry-run`
- `--dry-run` is only valid with `--all`; `set-bip on --dry-run` should error clearly.

## Tests
- Add tests in `packages/skillpacks/test/project-config.test.mjs` or the existing “Node multi-repo --all commands” suite for:
  - `set-bip on --all` updates every discovered project and ignores `node_modules`/dot dirs through existing discovery.
  - `set-bip unset --all` preserves sibling `alignment` fields and removes empty `alignment` objects.
  - `set-bip off --all --dry-run` prints per-project planned changes and leaves project files unchanged.
  - dry-run with invalid JSON reports unsafe and exits nonzero without mutating other projects.
  - `set-bip on --dry-run` without `--all` is rejected.
  - existing single-project `set-bip` tests still pass.
- Run `npm --workspace packages/skillpacks run test:node`.

## Assumptions
- Dry-run “issues” means parse/read/planning failures, not policy warnings about inferred defaults.
- Existing project discovery semantics remain unchanged.
- This feature is limited to `set-bip`; `set-bip-prompt --all` is out of scope.
- During implementation, update `tasks/roadmap.md` and `tasks/todo.md` before code changes per repo workflow, then document verification results in `tasks/todo.md`.
