# Ship Manifest - skillpacks 0.1.9 Publish

## User goal

Record and ship the successful `skillpacks` / `@glexcorp/gskp` `0.1.9` npm publish after the user confirmed publication completed.

## Changed files

- `CHANGELOG.md`
- `packages/skillpacks/package.json`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `tasks/history.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-22-skillpacks-0.1.9-publish.md`

## Per-file purpose

- `CHANGELOG.md`: changes `0.1.9` from pending auth/publish to published and records post-publish verification.
- `packages/skillpacks/package.json`: preserves the release script's package version bump to `0.1.9`.
- `packages/skillpacks/dist/skillpacks-manifest.json`: preserves the packaged manifest version bump to `0.1.9`.
- `tasks/history.md`: records the successful publish and smoke verification.
- `tasks/todo.md`: updates the active release-readiness review from auth-blocked to published.
- `tasks/ship-manifest-2026-06-22-skillpacks-0.1.9-publish.md`: records the shipping boundary and quality-gate evidence.

## User-goal mapping

- The user reported that publish succeeded; the release records now reflect the actual published npm state.
- The runbook requires source release state to be committed after publish; the package version and dist manifest are included in this boundary.
- The release history now distinguishes the earlier auth/cache blocker from the final successful publication.

## Tests run

- `npm view skillpacks version`: `0.1.9`.
- `npm view @glexcorp/gskp version`: `0.1.9`.
- `node -p "require('./packages/skillpacks/package.json').version"`: `0.1.9`.
- `npm view skillpacks@0.1.9 bin --json`: published `gskp` and `skillpacks` bins are present.
- `npm view @glexcorp/gskp@0.1.9 bin --json`: published `gskp` and `skillpacks` bins are present.
- `npx @glexcorp/gskp@0.1.9 list`: exited 0 and listed packs, ending with `skillpacks 0.1.9 (latest)`.
- Clean temp install smoke: `npm install skillpacks@0.1.9` then `./node_modules/.bin/skillpacks list`: exited 0 and listed packs, ending with `skillpacks 0.1.9 (latest)`.
- `npm pack skillpacks@0.1.9 --json --silent`: exited 0 and confirmed published tarball metadata.
- `npm pack @glexcorp/gskp@0.1.9 --json --silent`: exited 0 and confirmed published tarball metadata.
- `npm run skillpacks:verify`: exited 0, reported CLI version `0.1.9`, passed convention bundle audit, manifest check, package staging boundary check, and local package dry-run pack.
- `git diff --check`: exited 0.
- Targeted release-record scan: `rg -n "0\\.1\\.9|pending npm authentication|E401|Published for both|Post-publish" CHANGELOG.md tasks/todo.md tasks/history.md tasks/ship-manifest-2026-06-22-skillpacks-0.1.9-publish.md` confirmed the new publish records and preserved historical auth-blocker notes.

## Skipped tests

- Full package Node tests were not rerun after this bookkeeping diff because they already passed before publication and no package runtime source changed after publish; `npm run skillpacks:verify` covered the updated version/manifest/package-staging state.
- `npx skillpacks@0.1.9 list` and explicit local-workspace `npx --package skillpacks@0.1.9 ...` failed with local bin-resolution issues, so the equivalent clean temp install path was used for the unscoped package and passed.
- Skills Showcase deploy validation was skipped because `tasks/deploy.md` classifies `tasks/**`, package CLI internals, and release evidence as non-showcase deploy changes unless generated public app data or app runtime paths changed.

## Adversarial review

Method: changed-file self-review plus release-state checks against npm metadata and published-package smoke commands.

Findings:

- Both package names report `0.1.9` from npm metadata, so package-version parity is restored.
- Published tarballs exist for both package names.
- The scoped alias works via direct `npx`; the unscoped package works after a clean temp install. Local workspace `npx` bin selection remains a tool-context quirk rather than published-package failure.
- No source code, scripts, generated showcase data, app runtime, or deploy behavior changed in this boundary.

## Residual risk

The immutable `0.1.9` tarballs were published before this repository changelog was changed from "pending publish" to "published." Users reading the published package tarball changelog may still see the pre-publish wording for `0.1.9`; the source repository and follow-up releases carry the corrected publication record.

## Rollback note

If this release record is wrong, revert the commit and delete the `v0.1.9` tag if it has not been consumed. npm package versions are immutable, so a bad published package would require a new patch release rather than rollback.

## Next command

`$ship-end`
