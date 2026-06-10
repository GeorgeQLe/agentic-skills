# Ship Manifest — Skillpacks Locking And Drift Parity

## User Goal

Execute `$exec skillpacks npm distribution Phase 3 Step 3.4 Locking And Drift Parity`.

## Changed Files

- `packages/skillpacks/src/cli/lifecycle.mjs`
- `packages/skillpacks/src/cli/run-pack-script.mjs`
- `packages/skillpacks/test/lifecycle.test.mjs`
- `prompts/exec/skill-prompt-20260610-005645-locking-drift-parity.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-locking-drift-parity.md`

## Per-File Purpose

- `packages/skillpacks/src/cli/lifecycle.mjs`: adds Node-owned `doctor`, `pin`, `unpin`, and `prune` behavior, plus drift-status and pin/prune helpers.
- `packages/skillpacks/src/cli/run-pack-script.mjs`: routes Step 3.4 commands through Node before the shell fallback.
- `packages/skillpacks/test/lifecycle.test.mjs`: proves PATH-empty execution, lock behavior, drift states, pin/unpin behavior, prune safety, and extra-arg shell compatibility.
- `prompts/exec/skill-prompt-20260610-005645-locking-drift-parity.md`: records the visible skill invocation as required by project prompt history policy.
- `tasks/todo.md`: marks Step 3.4 complete, records review notes, and adds the next Step 3.5 implementation plan.
- `tasks/roadmap.md`: marks the locking/drift roadmap item complete and records Step 3.5 as the remaining compatibility-closure work.
- `tasks/history.md`: records the shipped session outcome.
- `tasks/ship-manifest-2026-06-10-skillpacks-locking-drift-parity.md`: records this quality gate and shipping boundary.

## User-Goal Mapping

- Lock parity: covered by Node lock tests for stale cleanup, command labels, and release on errors.
- Drift parity: `doctor` now reports `ok`, `STALE`, `unknown`, `missing`, and `pinned` states from managed markers and archive symlinks.
- Pin/unpin parity: Node updates `pinned_versions`, validates archives, and relinks installed skill roots without `bash` or `jq`.
- Prune parity: Node preserves dry-run behavior, orphan detection, missing-source removal, expected enabled-pack/skill awareness, and unmanaged-directory safety.
- Fallback/oracle requirement: `pack.sh` remains packaged and shell-backed commands remain routed there; parity was checked against direct `scripts/pack.sh`.

## Tests Run

- `node --check packages/skillpacks/src/cli/lifecycle.mjs` — passed.
- `node --check packages/skillpacks/src/cli/run-pack-script.mjs` — passed.
- `node --check packages/skillpacks/test/lifecycle.test.mjs` — passed.
- `npm --workspace skillpacks run test:node` — passed, 31 tests.
- Temp-project shell oracle parity harness comparing Node CLI against direct `scripts/pack.sh` for `doctor`, `pin`, `unpin`, `prune --dry-run`, and `prune` — passed.
- `npm --workspace skillpacks run build:check` — passed; manifest check and package staging boundary check clean.
- `npm_config_cache=/tmp/skillpacks-npm-cache npm pack packages/skillpacks/build --dry-run --json --silent` plus parsed package boundary assertion — passed, `skillpacks@0.1.0`, 2315 files, denied repo paths absent.
- `git diff --check` — passed.

## Skipped Tests

- Full repository test suite was not run because the change is isolated to the `packages/skillpacks` CLI command surface and the package-owned tests plus shell parity harness directly exercise the changed behavior.
- Skills Showcase generation/validation was not run because no tracked `SKILL.md` or `PACK.md` behavior or metadata changed.
- Real `npm publish` was not run because publication is out of scope without explicit user approval and npm auth confirmation.

## Adversarial Review

- Method: changed-file self-review against `scripts/pack.sh`/`scripts/skill-links.sh` behavior, targeted scans for route/dependency changes, and executable Node-vs-shell oracle parity.
- Finding fixed: the first Node route rejected extra args for `doctor`, `pin`, and `unpin`, while `pack.sh` ignored them. The route now preserves shell behavior, and `packages/skillpacks/test/lifecycle.test.mjs` includes a regression test.
- Accepted residual concerns: `recommend`, `which`, `install-deck`, and global init remain shell-backed by design for the next compatibility-closure step.

## Residual Risk

- The most likely remaining issue is an untested edge case in a command surface still backed by `pack.sh`; Step 3.5 is scoped to document or close that compatibility boundary.
- The package was validated locally and by dry-run packaging, but not published to npm, so registry/install behavior from the public registry remains unproven until an explicitly approved publish smoke test.

## Rollback Note

Revert the shipping commit to restore `doctor`, `pin`, `unpin`, and `prune` to the prior `pack.sh` route. Because `scripts/pack.sh` remains packaged, rollback does not require reconstructing removed shell code.

## Next Command

`$exec skillpacks npm distribution Phase 3 Step 3.5 Compatibility Closure`
