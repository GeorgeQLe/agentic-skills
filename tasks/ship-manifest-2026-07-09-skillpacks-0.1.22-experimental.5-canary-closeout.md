# Ship Manifest - skillpacks 0.1.22-experimental.5 canary closeout

## User goal

Wrap up the current session after the `0.1.22-experimental.5` canary publish by committing the matching source metadata, recording verification evidence, and leaving the repository clean on the primary branch.

## Changed files

- `packages/skillpacks/package.json`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `tasks/history.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/ship-manifest-2026-07-09-skillpacks-0.1.22-experimental.5-canary-closeout.md`
- `prompts/ship-end/skill-prompt-20260709-190337-ship-end.md`

## Per-file purpose

- `packages/skillpacks/package.json`: records the published canary source version `0.1.22-experimental.5`.
- `packages/skillpacks/dist/skillpacks-manifest.json`: records the matching canary package metadata in the generated manifest.
- `tasks/history.md`: records session closeout evidence and published smoke coverage.
- `tasks/todo.md`: marks the canary source closeout complete and preserves no active executable task.
- `tasks/roadmap.md`: records the completed closeout in historical roadmap state.
- `tasks/ship-manifest-2026-07-09-skillpacks-0.1.22-experimental.5-canary-closeout.md`: captures this shipping boundary and residual risk.
- `prompts/ship-end/skill-prompt-20260709-190337-ship-end.md`: captures the visible `$ship-end` invocation per repo prompt-history policy.

## User-goal mapping

- The package and generated manifest metadata align the repo source state with the already-published `.5` npm canary.
- The task/history/manifest updates create the required closeout audit trail for `ship-end`.
- The prompt-history file satisfies the repo's skill-invocation capture rule.

## Tests run

- `npm view skillpacks dist-tags --json` - passed; `experimental` is `0.1.22-experimental.5`, `latest` remains `0.1.21`.
- `npm view @glexcorp/gskp dist-tags --json` - passed; `experimental` is `0.1.22-experimental.5`, `latest` remains `0.1.21`.
- `npm view skillpacks@0.1.22-experimental.5 version` - passed.
- `npm view @glexcorp/gskp@0.1.22-experimental.5 version` - passed.
- `SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run build:check` - passed; package staging boundary check passed.
- `npx -y --prefer-online --package skillpacks@experimental --cache /tmp/skillpacks-npm-cache -- skillpacks --version` - passed; reported `0.1.22-experimental.5`.
- `npx -y --prefer-online --package @glexcorp/gskp@experimental --cache /tmp/skillpacks-npm-cache -- skillpacks --version` - passed; reported `0.1.22-experimental.5`.
- `npx -y --prefer-online --package skillpacks@experimental --cache /tmp/skillpacks-npm-cache -- skillpacks list` - passed and listed active packs.
- `npx -y --prefer-online --package @glexcorp/gskp@experimental --cache /tmp/skillpacks-npm-cache -- skillpacks list` - passed and listed active packs.
- From `/tmp/skillpacks-exp5-deck-remove-rnH6bO`, `npx -y --prefer-online --package skillpacks@experimental --cache /tmp/skillpacks-npm-cache -- skillpacks install-deck game-afps` - passed.
- From `/tmp/skillpacks-exp5-deck-remove-rnH6bO`, `npx -y --prefer-online --package skillpacks@experimental --cache /tmp/skillpacks-npm-cache -- skillpacks remove game` - passed.
- From `/tmp/skillpacks-exp5-deck-remove-rnH6bO`, `npx -y --prefer-online --package skillpacks@experimental --cache /tmp/skillpacks-npm-cache -- skillpacks doctor` - passed and reported `(no managed skill installs found)`.
- `node scripts/audit-task-docs.mjs` - passed, 0 failures and 0 warnings.
- `git diff --check` - passed.

## Skipped tests

- The full `verify:published` script for `skillpacks@experimental` was started and passed metadata resolution, but was manually stopped with exit 143 after a prolonged quiet stretch during the smoke phase. The completed direct smoke checks covered the release-critical assertions needed for this closeout: dist-tag metadata, package version, list output for both npm package names, and the deck-backed remove/doctor regression that failed in `.4`.
- The full `verify:published` script for `@glexcorp/gskp@experimental` was not run because the package alias shares the same CLI code and the direct scoped-alias version/list smoke checks passed.

## Adversarial review

- Reviewed whether this closeout accidentally commits unpublished package metadata. Npm registry reads confirmed both package names already publish `0.1.22-experimental.5` under the `experimental` dist-tag.
- Reviewed whether `latest` could have moved unintentionally. Both package names still report `latest: 0.1.21`.
- Reviewed the known `.4` residual risk: published `.5` deck-backed install/remove followed by `doctor` now reports no managed installs instead of missing convention-doc drift.
- Reviewed the source diff scope: only package version metadata, generated manifest package metadata, task closeout docs, and the prompt-history artifact are included.

## Residual risk

- The full published verifier did not complete end-to-end in this session, so a broader pin/unpin/remove matrix was not re-proven against the `.5` package. The targeted checks cover the release provenance and the specific `.4` regression; broader published matrix coverage can be rerun later if npm responsiveness is needed as additional confidence.

## Rollback note

- Do not unpublish or reuse npm `0.1.22-experimental.5`; npm versions are immutable. If the canary must be superseded, publish a later prerelease under the `experimental` dist-tag.
- To revert the repository source-state closeout only, revert the closeout commit and delete the local tag if it has not been pushed.

## Next command

`$roadmap`
