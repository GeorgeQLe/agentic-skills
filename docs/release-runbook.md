# Release Runbook

This runbook is for maintainers publishing the public npm packages:

- `skillpacks`
- `@glexcorp/gskp`

Both packages are generated from the same staged artifact and must publish at the same version. Keep `skillpacks` as the canonical package and `@glexcorp/gskp` as the same-version scoped alias.

## Prerequisites

Log in to npm before starting a release:

```bash
npm login --registry https://registry.npmjs.org/
npm whoami --registry https://registry.npmjs.org/
```

Expected publisher:

- Default npm user: `glexcorp`
- Override only when intentionally publishing from another authorized account:

```bash
SKILLPACKS_NPM_PUBLISHER=<npm-username> ./publish.sh patch
```

The publishing account must have:

- Publish access to `skillpacks`.
- Publish access to the `@glexcorp` scope and `@glexcorp/gskp`.
- 2FA/OTP ready if the npm account or package policy requires it.

## Release Gates

Before publishing:

```bash
npm --workspace packages/skillpacks run test:node
npm run skillpacks:verify
./publish.sh --dry-run patch
```

Use `patch` for the normal next release. From `packages/skillpacks@0.1.5`, the next parity-restoring patch release is `0.1.6`.

Hard gates:

- Do not run manual `npm publish` for only one package.
- Do not publish if the staged `skillpacks` and `@glexcorp/gskp` versions differ.
- Do not publish unless the npm account can publish both packages. The dry run performs read-only `npm whoami`, maintainer/scope, and target-version checks for both staged package names.
- Do not publish unless the dry run completes for both staged packages.
- Do not ship experimental behavior on the `latest` npm channel first. The current `publish.sh` path is latest-oriented; if a feature needs field testing, add a canary/pre-release publishing lane and verify both `skillpacks` and `@glexcorp/gskp` publish under a non-`latest` dist-tag before exposing it broadly.

## Publish

Preferred command:

```bash
./publish.sh patch
```

For an explicit semver target:

```bash
./publish.sh 0.1.6
```

The script publishes `skillpacks` first, then `@glexcorp/gskp --access public`, and verifies both published package specs afterward.

After a successful publish, commit and push the source release state immediately:

```bash
git add packages/skillpacks/package.json packages/skillpacks/dist/skillpacks-manifest.json
git commit -m "Release skillpacks <version>"
git tag skillpacks-v<version>
git push
git push origin skillpacks-v<version>
```

Use the actual published version in the commit message and tag. Do this before starting another release so npm and git do not drift.

## Partial-Publish Recovery

If `skillpacks` publishes but `@glexcorp/gskp` fails:

1. Do not run manual `npm publish` from either staged package directory.
2. Fix npm auth, scope access, or OTP state.
3. Leave the source release-state files at the failed release version. The recovery script allows only these tracked edits while recovering:
   - `packages/skillpacks/package.json`
   - `packages/skillpacks/dist/skillpacks-manifest.json`
4. Rerun the release from the current package version:

```bash
./publish.sh --current
```

`--current` is the recovery path because npm versions are immutable and the already-published `skillpacks` version must be matched by the scoped alias. It requires `skillpacks@<version>` to already exist, requires `@glexcorp/gskp@<version>` to be missing, skips republishing `skillpacks`, publishes only `@glexcorp/gskp`, then verifies both package specs.

If both package versions already exist, recovery is complete and the script exits without publishing. If only `@glexcorp/gskp` exists, stop and investigate the inconsistent registry state.

After recovery succeeds, commit, tag, and push the same source release-state files as described in the publish section.

## Post-Publish Verification

Confirm version parity:

```bash
npm view skillpacks version
npm view @glexcorp/gskp version
```

The two commands must print the same version.

Then verify the published packages:

```bash
SKILLPACKS_PACKAGE_NAME=skillpacks SKILLPACKS_EXPECTED_VERSION=<version> SKILLPACKS_NPM_SPEC=skillpacks@<version> npm run skillpacks:verify-published
SKILLPACKS_PACKAGE_NAME=@glexcorp/gskp SKILLPACKS_EXPECTED_VERSION=<version> SKILLPACKS_NPM_SPEC=@glexcorp/gskp@<version> npm run skillpacks:verify-published
```

Recommended smoke checks:

```bash
npx skillpacks@<version> list
npx @glexcorp/gskp@<version> list
```
