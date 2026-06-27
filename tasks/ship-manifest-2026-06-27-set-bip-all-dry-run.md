# Ship Manifest - Set BIP All And Dry Run

Date: 2026-06-27

## User Goal

Add multi-project support for `skillpacks set-bip <on|off|unset> --all`, plus `--all --dry-run` to preview planned `.agents/project.json` changes and unsafe parse/read issues before mutation.

## Changed Files

- `packages/skillpacks/src/cli/project-config.mjs`
- `packages/skillpacks/src/cli/lifecycle.mjs`
- `packages/skillpacks/src/cli/run-pack-script.mjs`
- `packages/skillpacks/test/project-config.test.mjs`
- `packages/skillpacks/test/compatibility.test.mjs`
- `docs/skillpacks-npm-distribution.md`
- `README.md`
- `prompts/exec/skill-prompt-20260627-011251-set-bip-all-dry-run.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-27-set-bip-all-dry-run.md`

## Per-File Purpose

- `project-config.mjs`: added shared BIP config application helpers and a no-write planner used by dry-run.
- `lifecycle.mjs`: added batch apply/dry-run orchestration across discovered project roots.
- `run-pack-script.mjs`: added `set-bip` flag parsing, validation, and help text.
- `project-config.test.mjs`: added regression coverage for batch apply, unset cleanup, dry-run safety, invalid JSON, and invalid flag combinations.
- `compatibility.test.mjs`: kept command ownership expectations aligned with the expanded public command surface.
- `docs/skillpacks-npm-distribution.md` and `README.md`: documented npm CLI fleet update and dry-run usage.
- `prompts/exec/...`: captured the visible invocation for this skill-driven implementation.
- `tasks/*`: recorded plan, review, history, and shipping evidence.

## User-Goal Mapping

- Multi-project apply: `setBuildInPublicModeAll` uses `discoverProjectRoots` and `runAcrossProjects`.
- Dry-run preview: `planBuildInPublicMode` computes set/change/remove/already-match actions without writes or locks.
- Unsafe issue reporting: dry-run continues across parse/read failures, summarizes failures, prints `Safe to run: no`, and exits nonzero.
- Single-project compatibility: existing `setBuildInPublicMode(mode)` remains the single-project path and existing tests still pass.
- Public interface: help/docs show `set-bip <mode> [--all] [--dry-run]` and explicit `--all --dry-run`.

## Tests Run

- `npm --workspace packages/skillpacks run test:node` (150/150)
- `npm --workspace packages/skillpacks run build:check`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `node packages/skillpacks/bin/skillpacks.mjs --help`

## Skipped Tests

- No Skills Showcase build/deploy checks: this change does not touch `apps/skills-showcase/**`, generated public showcase assets, dependency manifests, or deploy config.
- No `scripts/pack.sh set-bip --all` smoke: the requested feature is the Node-owned npm CLI path; the Bash checkout writer remains single-project.

## Adversarial Review

- Checked that invalid modes are rejected before batch discovery, including no-project directories.
- Checked that dry-run uses the planner only and does not call `withProjectLock` or `writeProjectConfig`.
- Checked that invalid JSON in one project does not stop other project plans and returns a nonzero unsafe result.
- Checked that `unset` preserves sibling `alignment` fields and removes an empty `alignment` object.
- Checked that discovery ignores `node_modules` and dot directories through existing `discoverProjectRoots` semantics.

## Residual Risk

- Source-checkout `scripts/pack.sh set-bip` remains single-project. That is intentional for this scope, but users should use `npx skillpacks set-bip <mode> --all` for fleet updates.

## Rollback Note

Revert the commit containing this manifest to remove the batch CLI path, dry-run planner, docs, and tests. Existing single-project `set-bip` behavior can be restored independently because the writer still funnels through the same public function.

## Next Command

`$brainstorm`
