# Ship Manifest - Skillpacks Node Project Config Parity

## User Goal

Execute `$exec skillpacks npm distribution Phase 3 Node Port Parity` for the next default unit of work: move deterministic project-file reads and simple writes from bash/jq into the package-owned Node CLI.

## Changed Files

- `packages/skillpacks/src/cli/project-config.mjs`
- `packages/skillpacks/src/cli/run-pack-script.mjs`
- `packages/skillpacks/test/project-config.test.mjs`
- `packages/skillpacks/package.json`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `prompts/exec/skill-prompt-20260610-000657-skillpacks-npm-node-port-parity.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-node-project-config.md`

Excluded from this ship boundary: `scripts/alignment-tts-kokoro.js` and `tests/layer1/alignment-tts-kokoro.test.ts` have unrelated local modifications and must not be staged for this commit.

## Per-File Purpose

- `project-config.mjs`: adds JSON-backed project config reads/writes, Node-owned lock handling for the newly ported write commands, status/list output, and project-type inference for new `set-mode` files.
- `run-pack-script.mjs`: routes `list-packs`, `status`, `set-mode`, and `set-update-mode` through Node before bash dependency checks; leaves lifecycle commands on `pack.sh`.
- `project-config.test.mjs`: proves Node-routed commands work with `PATH` emptied and preserve project config fields.
- `package.json`: adds the package-owned test script and fixes dry-run package scripts to pack `./build`.
- `skillpacks-manifest.json`: refreshed generated manifest required by package `build:check`.
- Prompt, task, history, and manifest files: record the invocation, active plan, validation evidence, next step, and shipping boundary.

## User-Goal Mapping

The Node helper and dispatcher routing satisfy Phase 3's first parity task for project-file reads/writes. Tests prove these commands no longer need `bash` or `jq`. `pack.sh` fallback remains for install/link/drift behavior, matching the phase constraint to keep compatibility until parity tests cover the remaining lifecycle.

## Tests Run

- `node --check packages/skillpacks/src/cli/project-config.mjs`
- `node --check packages/skillpacks/src/cli/run-pack-script.mjs`
- `node --check packages/skillpacks/test/project-config.test.mjs`
- `npm --workspace skillpacks run test:node` - 6 tests passed
- `pnpm --dir tests exec vitest run --project layer1 layer1/install.test.ts` - 5 tests passed
- `node packages/skillpacks/bin/skillpacks.mjs list`
- `npm --workspace skillpacks run build:check`
- `npm_config_cache=/tmp/skillpacks-npm-cache npm pack packages/skillpacks/build --dry-run --json --silent`
- Parsed npm dry-run assertion: `skillpacks@0.1.0`, `entryCount: 2313`, includes `src/cli/project-config.mjs`, includes `src/cli/run-pack-script.mjs`, denied path count `0`
- `git diff --check`

## Skipped Tests

- Full repo test suite was not run because this step changes only package CLI project-config routing. The package-owned Node tests and existing focused `pack.sh` install regression cover the changed behavior and compatibility path.
- Temp tarball install was not repeated because the changed Node-owned commands are exercised directly and package build/dry-run proved the files are staged; install/remove lifecycle still uses the unchanged `pack.sh` backend and was covered by the focused install regression.

## Adversarial Review

Changed-file self-review checked for accidental lifecycle porting, `bash`/`jq` dependency leaks in routed commands, project config field loss, lock cleanup, package staging omissions, npm dry-run false positives, and unrelated worktree sweep. Review found and fixed two issues:

- `npm pack build` resolved the registry package named `build`; package scripts now use `npm pack ./build`.
- `set-update-mode` initially normalized unrelated project fields; it now only updates `skill_updates`, with regression coverage.

## Residual Risk

The newly ported commands now use a Node lock implementation for their writes, while the remaining lifecycle commands still use `pack.sh`. The risk is split-brain lock behavior if a future Node lifecycle port diverges from `pack.sh`; Step 3.2/3.4 should keep lock parity explicit before moving install/remove writes.

## Rollback Note

Revert the shipping commit to restore all project-config commands to the prior bash-backed dispatcher and previous package dry-run scripts. The generated manifest can be regenerated with `npm --workspace skillpacks run build:manifest`.

## Next Command

`$exec skillpacks npm distribution Phase 3 Step 3.2 Pack Normalization And Alias Parity`
