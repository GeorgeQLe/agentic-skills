# Ship Manifest — Skillpacks Compatibility Closure

## User Goal

Execute `$exec skillpacks npm distribution Phase 3 Step 3.5 Compatibility Closure`.

## Changed Files

- `README.md`
- `docs/QUICKSTART.md`
- `docs/packs.md`
- `docs/skillpacks-npm-distribution.md`
- `packages/skillpacks/test/compatibility.test.mjs`
- `prompts/exec/skill-prompt-20260610-010817-skillpacks-npm-compatibility-closure.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-compatibility-closure.md`

## Per-File Purpose

- `README.md`: updates top-level prerequisites and field-preservation notes for the post-Phase-3 npm CLI dependency boundary.
- `docs/QUICKSTART.md`: updates quickstart prerequisites so clone users and npm users see the correct `bash`/`jq` split.
- `docs/packs.md`: adds the npm Node-owned no-`jq` preservation note alongside the existing git-checkout `pack.sh` caveat.
- `docs/skillpacks-npm-distribution.md`: records the Phase 3 compatibility decision and command matrix, updates backward-compatibility language, risk, and open question text.
- `packages/skillpacks/test/compatibility.test.mjs`: adds executable coverage that parses the matrix and verifies command ownership/dependency rows against CLI help and routing structure.
- `prompts/exec/skill-prompt-20260610-010817-skillpacks-npm-compatibility-closure.md`: records the visible skill invocation as required by prompt-history policy.
- `tasks/todo.md`: marks Step 3.5 and its verification complete, records review notes, and captures next-work state.
- `tasks/roadmap.md`: marks Phase 3 compatibility closure complete.
- `tasks/history.md`: records the shipped session outcome.
- `tasks/ship-manifest-2026-06-10-skillpacks-compatibility-closure.md`: records this quality gate and shipping boundary.

## User-Goal Mapping

- Wrapper decision: `docs/skillpacks-npm-distribution.md` states that `scripts/pack.sh` remains the canonical git-checkout compatibility wrapper and packaged fallback rather than becoming a thin Node wrapper now.
- Remaining command surfaces: the compatibility matrix documents `list`, `recommend`, `which`, `install-deck`, and `init-global` with owner and dependency classification.
- Package-level matrix: the matrix is in a package-included doc and is covered by `packages/skillpacks/test/compatibility.test.mjs`.
- Source/staged parity: the final smoke harness exercised source checkout and `packages/skillpacks/build` CLI paths after package staging.
- Publish boundary: docs and task notes explicitly keep real npm publication out of scope without explicit approval and npm auth confirmation.

## Tests Run

- `node --check packages/skillpacks/test/compatibility.test.mjs` — passed.
- `node --check packages/skillpacks/src/cli/run-pack-script.mjs` — passed.
- `npm --workspace skillpacks run test:node` — passed, 33 tests.
- Source/staged compatibility smoke harness — passed for `--version`, `--help`, `list --json`, `list-packs`, `status`, `set-mode`, `set-update-mode`, `refresh`, `doctor`, `pin`, `unpin`, `prune --dry-run`, `install`, `remove`, shell-backed `list`/`recommend`/`which`, hybrid `install-deck vard`, and `init-global --help`.
- `npm --workspace skillpacks run build:check` — passed; manifest check and package staging boundary check clean.
- `npm_config_cache=/tmp/skillpacks-npm-cache npm pack packages/skillpacks/build --dry-run --json --silent` plus parsed package boundary assertion — passed, 2315 files, denied repo paths absent.
- Targeted stale dependency scan over package-included docs with `rg -n "jq|bash|pack\\.sh can become|Initial command map|Current source of truth|write commands fail|remove in phase 3" README.md docs/QUICKSTART.md docs/decks.md docs/packs.md docs/skillpacks-npm-distribution.md` — passed after the `docs/packs.md` note was updated; remaining hits are expected current matrix, git-checkout-specific notes, or historical roadmap entries.
- `git diff --check` — passed.

## Skipped Tests

- Full repository test suite was not run because the change is isolated to package docs and package-owned compatibility coverage; `npm --workspace skillpacks run test:node`, source/staged CLI smokes, build staging, and tarball boundary checks directly exercise the changed package surface.
- Skills Showcase generation/validation was not run because no tracked `SKILL.md` or `PACK.md` behavior or metadata changed.
- Real `npm publish` was not run because publication requires explicit user approval and npm auth confirmation.

## Adversarial Review

- Method: changed-file self-review, matrix-vs-CLI route test, source/staged command smokes, package dry-run boundary assertion, and targeted stale dependency scans across package-included docs.
- Finding fixed: `docs/packs.md` still only described the git-checkout `pack.sh` `jq` preservation caveat. It now also points npm users to the Node-owned no-`jq` path and compatibility matrix.
- Accepted residual concerns: `recommend`, `which`, `install-deck`, and `init-global` remain shell or external-script backed by design. This is documented and tested as the current compatibility boundary rather than treated as a parity gap in this step.

## Residual Risk

- The most likely remaining issue is user confusion between git-checkout `scripts/pack.sh` commands and npm `skillpacks` commands in docs outside the package-included set. The package-facing docs were scanned and patched; broader historical docs may still describe earlier phases.
- Public registry behavior remains unproven because no real npm publish or `npx skillpacks@latest` check was run.

## Rollback Note

Revert the shipping commit to restore the previous docs and remove the compatibility matrix test. No CLI routing changed, so rollback does not alter installed project behavior.

## Next Command

`$brainstorm`
