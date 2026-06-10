# Ship Manifest: Skillpacks Pack Normalization

## User Goal

Execute Skillpacks npm Distribution Phase 3 Step 3.2: Pack Normalization And Alias Parity.

## Changed Files

- `packages/skillpacks/src/cli/pack-normalization.mjs`
- `packages/skillpacks/src/cli/run-pack-script.mjs`
- `packages/skillpacks/test/pack-normalization.test.mjs`
- `prompts/exec/skill-prompt-20260610-002416-skillpacks-npm-distribution-step-3-2.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-pack-normalization.md`

## Per-File Purpose

- `packages/skillpacks/src/cli/pack-normalization.mjs`: Adds package-owned Node normalization for pack aliases, CLI token splitting, active pack/skill resolution, enabled-skill remove lookup, unknown-name diagnostics, and PoketoWork kanban hibernation diagnostics.
- `packages/skillpacks/src/cli/run-pack-script.mjs`: Routes `install` and `remove` through Node normalization before requiring `bash`/`jq`, then forwards canonical args to `scripts/pack.sh` for lifecycle mutations.
- `packages/skillpacks/test/pack-normalization.test.mjs`: Covers direct names, aliases, comma args, `pack:` prefixes, empty `pack`/`packs` tokens, active skill fallback, unknown names, hibernated aliases, remove cleanup behavior, and early diagnostics without `bash`/`jq`.
- `prompts/exec/skill-prompt-20260610-002416-skillpacks-npm-distribution-step-3-2.md`: Captures the visible `$exec` invocation and pasted context required by the project prompt-history convention.
- `tasks/todo.md`: Marks Step 3.2 complete, records review/validation notes, and adds a self-contained Step 3.3 plan.
- `tasks/roadmap.md`: Marks Phase 3 Step 3.2 roadmap items complete and sets Step 3.3 as current next work.
- `tasks/history.md`: Records the shipped Step 3.2 work.
- `tasks/ship-manifest-2026-06-10-skillpacks-pack-normalization.md`: Records this quality gate and shipping boundary.

## User-Goal Mapping

- Alias parity: implemented by `pack-normalization.mjs` and covered by package-owned tests.
- Hibernated PoketoWork diagnostics: implemented with the same safety language for install blocks and stale cleanup routing for remove.
- Lifecycle mutation boundary: `run-pack-script.mjs` resolves names in Node but still runs `scripts/pack.sh` for actual install/remove mutations.
- Representative comparison: baseline `pack.sh` runs were taken before the route change, then temp-project `skillpacks` smokes confirmed the Node-routed behavior.
- Step completion and next-step readiness: recorded in `tasks/todo.md`, `tasks/roadmap.md`, and `tasks/history.md`.

## Tests Run

- `node --check packages/skillpacks/src/cli/pack-normalization.mjs` passed.
- `node --check packages/skillpacks/src/cli/run-pack-script.mjs` passed.
- `node --check packages/skillpacks/test/pack-normalization.test.mjs` passed.
- `npm --workspace skillpacks run test:node` passed: 18 tests.
- Baseline `scripts/pack.sh` temp-project checks before routing change:
  - `scripts/pack.sh install business` passed and expanded to the four business packs.
  - `scripts/pack.sh install pack:code-quality,docs` passed and installed `code-quality` plus `docs-health`.
  - `scripts/pack.sh install pack:not-a-real-pack` failed with expected unknown-name diagnostics.
  - `scripts/pack.sh install dev-kanban` failed with expected hibernated pack diagnostics.
  - `scripts/pack.sh install exec-kanban` failed with expected hibernated skill diagnostics.
- Node-routed `skillpacks` temp-project smokes after implementation:
  - `node packages/skillpacks/bin/skillpacks.mjs install pack:code-quality,docs` passed.
  - `node packages/skillpacks/bin/skillpacks.mjs install business` passed.
  - `node packages/skillpacks/bin/skillpacks.mjs install not-a-real-pack` failed with expected unknown-name diagnostics.
  - `node packages/skillpacks/bin/skillpacks.mjs install dev-kanban` failed with expected hibernated pack diagnostics.
  - `node packages/skillpacks/bin/skillpacks.mjs remove quality` passed after the first install smoke.
  - `node -e "const fs=require('fs'); const p=JSON.parse(fs.readFileSync('.agents/project.json','utf8')); console.log(JSON.stringify(p.enabled_packs));"` confirmed `["docs-health"]` after removing `quality`.
- `npm --workspace skillpacks run build:check` passed.
- `npm_config_cache=/tmp/skillpacks-npm-cache npm pack packages/skillpacks/build --dry-run --json --silent` passed after sandbox escalation.
- Parsed `/tmp/skillpacks-pack-dry-run-phase-3-2.json` boundary assertion passed: required `dist/skillpacks-manifest.json`, `src/cli/pack-normalization.mjs`, and `src/cli/run-pack-script.mjs` were present; denied `apps/`, `tasks/`, `prompts/`, `alignment/`, `tests/`, and `docs/history/` paths were absent.
- `git diff --check` passed.

## Skipped Tests

- Full repository test suite was not run because the executable change is isolated to the `packages/skillpacks` CLI bridge and package-owned tests plus temp-project smokes cover the changed command surface.
- Skills Showcase generation/validation was not run because no tracked `SKILL.md` or `PACK.md` metadata changed.
- Full install/remove/refresh Node parity was not run because Step 3.2 intentionally keeps lifecycle mutations on `scripts/pack.sh`; Step 3.3 owns the full port and parity matrix.

## Adversarial Review

Method: changed-file self-review plus targeted parity checks against `scripts/pack.sh` baseline behavior.

Reviewed failure modes:

- `install` hibernated aliases must block, while `remove` hibernated aliases must remain available for stale project cleanup.
- Node must not require `bash`/`jq` before reporting unknown or hibernated install diagnostics.
- Alias order must preserve `pack.sh` behavior, including `product` resolving through the business bundle alias before the later product-design alias.
- Token splitting must preserve comma-separated args, `pack:` prefixes, and empty `pack`/`packs` no-op tokens.
- Active skill fallback must happen only after pack alias/direct pack resolution misses.
- `remove` must honor existing `enabled_skills` entries before active skill fallback.
- Lifecycle mutations must still run through `scripts/pack.sh`.

Findings: no source changes required after review. Residual static-alias drift is noted below.

## Residual Risk

- The Node alias table is intentionally duplicated from `scripts/pack.sh`; future alias edits must update both until Step 3.3 or later centralizes the implementation.
- Hibernated skill diagnostics use a static Node map so packaged installs can report useful errors without shipping the archived pack tree. If the hibernated archive changes, this map needs the same update.
- Successful install/remove mutations still depend on `bash`, `jq`, and `scripts/pack.sh`. This is intentional for Step 3.2 and becomes the main Step 3.3 target.

## Rollback Note

Revert the package resolver module, the `run-pack-script.mjs` routing change, and the test file to return `install`/`remove` to direct `pack.sh` forwarding. Task docs and this manifest can be reverted with the same commit if the Step 3.2 boundary needs to be backed out.

## Next Command

`$exec skillpacks npm distribution Phase 3 Step 3.3 Install/Remove/Refresh Parity`
