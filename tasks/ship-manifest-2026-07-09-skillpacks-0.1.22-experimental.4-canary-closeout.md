# Ship Manifest - skillpacks 0.1.22-experimental.4 canary closeout

## User goal

Wrap up the session after canary publish readiness and the `0.1.22-experimental.4` canary publish, leaving repository state committed, tagged, pushed, and with surfaced verification failures addressed in source.

## Changed files

- `packages/skillpacks/package.json`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `packages/skillpacks/scripts/verify-published-package.sh`
- `packages/skillpacks/src/cli/lifecycle.mjs`
- `packages/skillpacks/test/lifecycle.test.mjs`
- `packages/skillpacks/test/verify-published-package.test.mjs`
- `CHANGELOG.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-07-09-skillpacks-0.1.22-experimental.4-canary-closeout.md`
- `prompts/ship-end/skill-prompt-20260709-130604-ship-end-wrap.md`

## Per-file purpose

- `packages/skillpacks/package.json`: recorded the published canary package version `0.1.22-experimental.4`.
- `packages/skillpacks/dist/skillpacks-manifest.json`: recorded the published canary package version and later refreshed the canary source fingerprint after follow-up source fixes.
- `packages/skillpacks/scripts/verify-published-package.sh`: fixed non-`latest` verification by querying `package@dist-tag` metadata and checking the dist-tag pointer separately.
- `packages/skillpacks/src/cli/lifecycle.mjs`: made `doctor` skip convention-doc drift checks when an empty project config has no enabled managed installs and no managed docs directory.
- `packages/skillpacks/test/lifecycle.test.mjs`: covered the empty-config/no-managed-install doctor case that surfaced after deck removal.
- `packages/skillpacks/test/verify-published-package.test.mjs`: covered real npm command shape for non-`latest` dist-tag verification.
- `CHANGELOG.md`: recorded the verifier and doctor fixes for the next package publish.
- `tasks/history.md`: recorded the canary closeout, verification, and follow-up fix evidence.
- `tasks/ship-manifest-2026-07-09-skillpacks-0.1.22-experimental.4-canary-closeout.md`: captured this shipping boundary and residual risk.
- `prompts/ship-end/skill-prompt-20260709-130604-ship-end-wrap.md`: captured the visible `ship-end` invocation per repo prompt-history policy.

## User-goal mapping

- The package/manifest version bump and tag preserve the exact source state for the canary already published to npm.
- The published-package smoke checks proved both npm names resolve through `experimental` and can perform representative installs.
- The verifier and lifecycle fixes address the two failures found during post-publish smoke verification before the session closes.
- The history, manifest, and prompt-history files leave a durable audit trail for the release state and the required follow-up.

## Tests run

- `npm view skillpacks dist-tags --json` - passed; `experimental` is `0.1.22-experimental.4`, `latest` remains `0.1.21`.
- `npm view @glexcorp/gskp dist-tags --json` - passed; `experimental` is `0.1.22-experimental.4`, `latest` remains `0.1.21`.
- `npm view skillpacks@0.1.22-experimental.4 version` - passed.
- `npm view @glexcorp/gskp@0.1.22-experimental.4 version` - passed.
- `npx -y --prefer-online --package skillpacks@experimental --cache /tmp/skillpacks-npm-cache -- skillpacks --version` - passed; reported `0.1.22-experimental.4`.
- `npx -y --prefer-online --package @glexcorp/gskp@experimental --cache /tmp/skillpacks-npm-cache -- skillpacks --version` - passed; reported `0.1.22-experimental.4`.
- `npx -y --prefer-online --package skillpacks@experimental --cache /tmp/skillpacks-npm-cache -- skillpacks list` - passed.
- `npx -y --prefer-online --package @glexcorp/gskp@experimental --cache /tmp/skillpacks-npm-cache -- skillpacks list` - passed.
- `npx -y --prefer-online --package skillpacks@experimental --cache /tmp/skillpacks-npm-cache -- skillpacks install code-quality` from `/tmp/skillpacks-canary-smoke-20260709-130604/pack-install` - passed.
- `npx -y --prefer-online --package skillpacks@experimental --cache /tmp/skillpacks-npm-cache -- skillpacks install quality-sweep` from `/tmp/skillpacks-canary-smoke-20260709-130604/skill-install` - passed.
- `SKILLPACKS_EXPECTED_DIST_TAG=experimental SKILLPACKS_NPM_SPEC=skillpacks@experimental SKILLPACKS_EXPECTED_VERSION=0.1.22-experimental.4 SKILLPACKS_NPM_CACHE=/tmp/skillpacks-npm-cache SKILLPACKS_KEEP_TMP=0 SKILLPACKS_VERIFY_PUBLISHED_ATTEMPTS=3 npm --workspace packages/skillpacks run verify:published` - failed against the already-published `.4` package after deck removal because the published CLI reports missing convention docs after all managed installs are removed. The source fix is included here and requires a follow-up canary publish.
- `node --test packages/skillpacks/test/verify-published-package.test.mjs` - passed, 5/5.
- `node --test packages/skillpacks/test/lifecycle.test.mjs` - passed, 71/71.
- `npm --workspace packages/skillpacks run test:node` - passed, 212/212.
- `SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run build:check` - passed.
- `npm_config_cache=/tmp/skillpacks-npm-cache SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run verify:package` - passed.
- `node scripts/audit-task-docs.mjs` - passed, 0 failures and 0 warnings.
- `git diff --check` - passed.

## Skipped tests

- Full published verifier for `@glexcorp/gskp@experimental` was not rerun after the source fixes because `0.1.22-experimental.4` is immutable on npm and still contains the same published CLI code as `skillpacks@experimental`; direct alias `list` and `--version` smoke checks passed.
- A follow-up real canary publish was not run in this `ship-end` wrap-up because it would publish a new immutable npm version (`0.1.22-experimental.5`). That should be the next explicit release action after this source fix is committed and pushed.

## Adversarial review

- Reviewed whether the `0.1.22-experimental.4` release tag would accidentally include follow-up source fixes that were not in the npm tarball. To keep provenance correct, `skillpacks-v0.1.22-experimental.4` points at commit `125dfea0b`, which contains only the package/manifest version bump.
- Reviewed the non-`latest` metadata fix against npm behavior: `npm view <package> version` returns the `latest` version, so the verifier now resolves `npm view <package>@<dist-tag> version license` and checks `npm view <package> dist-tags.<tag>` independently.
- Reviewed the doctor fix against stale-doc drift behavior: convention docs are still checked when managed installs exist, enabled packs/skills/base skills remain configured, or a managed docs directory exists; only empty managed-install intent skips the check.

## Residual risk

- The published `0.1.22-experimental.4` canary has a known post-remove `doctor` false-positive for the deck-backed removal path. Users hit it only after installing and then removing a deck-backed pack from the canary package. The source fix is verified locally but will not reach npm until `0.1.22-experimental.5` is published.
- The package version remains `0.1.22-experimental.4` in source after the follow-up fixes, so the next canary publish should use `./publish.sh --tag experimental --preid experimental prerelease` to bump to `0.1.22-experimental.5`.

## Rollback note

- To roll back only the source follow-up fixes, revert the follow-up commit after `125dfea0b` and regenerate the canary manifest if needed.
- Do not move or reuse npm `0.1.22-experimental.4`; npm versions are immutable. If the canary should be superseded, publish a new prerelease version under the `experimental` dist-tag.

## Next command

`npm_config_cache=/tmp/skillpacks-npm-cache ./publish.sh --dry-run --tag experimental --preid experimental prerelease`
