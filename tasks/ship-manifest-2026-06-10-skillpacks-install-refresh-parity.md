# Ship Manifest - Skillpacks Install/Remove/Refresh Parity

## User Goal

Execute `$exec skillpacks npm distribution Phase 3 Step 3.3 Install/Remove/Refresh Parity`.

## Changed Files

- `packages/skillpacks/src/cli/lifecycle.mjs`
- `packages/skillpacks/src/cli/pack-normalization.mjs`
- `packages/skillpacks/src/cli/project-config.mjs`
- `packages/skillpacks/src/cli/run-pack-script.mjs`
- `packages/skillpacks/test/lifecycle.test.mjs`
- `prompts/exec/skill-prompt-20260610-003752-skillpacks-npm-parity.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-install-refresh-parity.md`

## Per-File Purpose

- `lifecycle.mjs`: adds package-owned Node lifecycle mutations for install, remove, and refresh, including managed marker/hash behavior and pinned archive symlinks.
- `pack-normalization.mjs`: exposes hibernated pack-to-skill lookup for stale hibernated pack cleanup.
- `project-config.mjs`: exports existing lock, write, and project-type helpers so lifecycle code reuses the same project-config path.
- `run-pack-script.mjs`: routes `install`, `remove`, and `refresh` through Node while leaving unported commands on `pack.sh`.
- `lifecycle.test.mjs`: adds package-owned tests for Node lifecycle behavior with `PATH` emptied.
- Prompt/task/history/manifest files: record invocation, completion evidence, next-step plan, and shipping proof.

## User-Goal Mapping

- Active pack install, individual skill install, remove, hibernated cleanup, and refresh are now Node-owned and no longer require `bash` or `jq`.
- `pin`, `unpin`, `prune`, `doctor`, `recommend`, `which`, and `install-deck` remain on the existing fallback path as required by the step scope.
- Parity checks compare the new Node path against direct `pack.sh` behavior before shipping.

## Tests Run

- `node --check packages/skillpacks/src/cli/lifecycle.mjs`
- `node --check packages/skillpacks/src/cli/run-pack-script.mjs`
- `node --check packages/skillpacks/src/cli/project-config.mjs`
- `node --check packages/skillpacks/src/cli/pack-normalization.mjs`
- `node --check packages/skillpacks/test/lifecycle.test.mjs`
- `npm --workspace skillpacks run test:node` - 25 tests passed.
- Temp-project Node-vs-`pack.sh` parity script - 6 surfaces passed: pack install, individual pinned install, pack remove, individual remove, hibernated stale remove, refresh.
- `npm --workspace skillpacks run build:check` - manifest and package staging checks passed.
- `npm_config_cache=/tmp/skillpacks-npm-cache npm pack packages/skillpacks/build --dry-run --json | node ...` - dry-run package boundary passed: `skillpacks@0.1.0`, 2315 files, denied repo paths absent.
- `git diff --check`

## Skipped Tests

- Full repository test suites were not run because this change is isolated to the `packages/skillpacks` CLI command surface, and package-owned tests plus direct `pack.sh` parity checks cover the changed behavior.
- Skills Showcase generation/validation was not run because no tracked `SKILL.md` or `PACK.md` behavior/metadata changed.
- Real `npm publish` and production deploy were not run; this step validates the local/staged package boundary only.

## Adversarial Review

Review method: changed-file self-review plus direct oracle parity against `pack.sh`. This is the targeted quality-sweep equivalent for this step because the user goal is command-port parity, and the parity script exercises the old and new implementations in temp projects and compares parsed project config, installed file trees, symlinks, and marker hashes.

The changed-file review focused on marker/hash parity, pinned archive relinking, unmanaged-directory safety, project-config preservation, hibernated cleanup, command routing, package root resolution, and accidental fallback removal.

Findings fixed before shipping:

- Node content hashing initially used locale-sensitive sorting and produced `source_sha` drift for Codex skills with `agents/openai.yaml`; fixed by byte-order sorting to match `LC_ALL=C sort`, then reran tests and parity.
- `refresh` with a hibernated enabled pack initially reported weaker diagnostics than `pack.sh`; fixed by reusing the full hibernation safety language and adding regression coverage.

The first npm dry-run parser attempt failed because the wrapper could not handle npm's large JSON payload; rerun through a streaming pipe passed. No source change was needed for that validation harness issue.

## Residual Risk

`doctor`, `pin`, `unpin`, and `prune` still depend on `pack.sh`; this is intentional Step 3.4 scope. The Node lifecycle writes pretty-printed project JSON rather than the compact `pack.sh` formatting, but parity checks compare parsed config semantics and installed file state. Package installs made from a future package path may need Step 3.4 review for removal of very old managed markers whose `source` points outside the current package/checkout root.

## Rollback Note

Revert the shipping commit to return `install`, `remove`, and `refresh` to the previous `pack.sh` backend route. Project config and managed skill installs created by this version remain ordinary `.agents/project.json` and `.agentic-skills-managed` artifacts compatible with `pack.sh refresh/remove`.

## Next Command

`$exec skillpacks npm distribution Phase 3 Step 3.4 Locking And Drift Parity`
