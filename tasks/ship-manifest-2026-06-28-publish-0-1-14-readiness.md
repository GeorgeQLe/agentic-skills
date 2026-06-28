# Ship Manifest - Publish 0.1.14 Readiness Audit

## User Goal

Audit whether the repository is ready to publish `skillpacks` / `@glexcorp/gskp` `0.1.14`, compile the package changelog, and end with no dirty tree.

## Changed Files

- `CHANGELOG.md`
- `packages/skillpacks/scripts/verify-published-package.sh`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `prompts/ship/skill-prompt-20260628-000710-publish-0-1-14.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-28-publish-0-1-14-readiness.md`

## Per-File Purpose

- `CHANGELOG.md`: adds the prepared `0.1.14` package-level release notes, records registry readiness, and corrects stale `0.1.13` release-state wording.
- `packages/skillpacks/scripts/verify-published-package.sh`: guards empty temp-dir cleanup under `set -u` so stale-metadata retry verification works on macOS Bash.
- `packages/skillpacks/dist/skillpacks-manifest.json`: refreshes package source fingerprint and active `user-flow-map` content hashes from the staged release boundary.
- `prompts/ship/...`: records the visible `ship` invocation per project prompt-history policy.
- `tasks/*`: records the implementation plan, review evidence, history, and shipping boundary.

## User-Goal Mapping

- The changelog is compiled for `0.1.14`.
- Registry checks show `0.1.14` is available for both package names and latest is still `0.1.13`.
- Release blockers found during audit were fixed instead of papered over.
- The final closeout will commit and push this boundary so the tracked tree is clean.

## Tests Run

- `npm view skillpacks version versions --json`
- `npm view @glexcorp/gskp version versions --json`
- `npm view skillpacks@0.1.14 version --json` (expected E404)
- `npm view @glexcorp/gskp@0.1.14 version --json` (expected E404)
- `bash -n packages/skillpacks/scripts/verify-published-package.sh`
- empty-array `set -u` shell guard smoke
- `node --test packages/skillpacks/test/verify-published-package.test.mjs` (2/2)
- `npm --workspace packages/skillpacks run test:node` (150/150)
- `npm run skillpacks:verify`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git diff --cached --check`
- `./publish.sh --dry-run patch` (passed bump/build/test/package staging; blocked at npm auth preflight with E401)

## Skipped Tests

- Skills Showcase build/test commands are not part of the current executable gate because this audit changes package release docs, package verification script behavior, package manifest metadata, and task/prompt evidence. No `apps/skills-showcase/**` runtime or generated public showcase assets are modified in this boundary.
- Real npm publish and release tag creation are intentionally skipped because the user asked for readiness, changelog, and clean tree, not an actual publication.

## Adversarial Review

- The initial package Node test run failed on `TMP_DIRS[@]: unbound variable`; the focused root cause was macOS Bash `set -u` behavior with empty arrays. The cleanup fix returns before iterating an empty temp-dir list and the existing retry test now passes.
- `npm run skillpacks:verify` then failed because the package manifest was out of date. Regenerating from the staged release boundary showed stale active `user-flow-map` hashes, so the manifest refresh is included in this ship boundary.
- The clean-tree publish dry-run proved local bump/build/test/package staging but stopped at npm auth preflight. The blocker is external authentication, not package source validation.

## Residual Risk

- The real publish may still require npm login/2FA as the expected publisher.
- `./publish.sh patch` should not be run until `npm whoami --registry https://registry.npmjs.org/` succeeds as `glexcorp`.

## Rollback Note

Revert the release-audit commit(s) to restore the previous changelog, verifier script, generated manifest, and task/prompt evidence. No npm package version, real publish, or tag is created by this audit.

## Next Command

`$guide`
