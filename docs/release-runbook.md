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
- Do not publish unless the npm account can publish both packages.
- Do not publish unless the dry run completes for both staged packages.

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

## Partial-Publish Recovery

If `skillpacks` publishes but `@glexcorp/gskp` fails:

1. Do not run manual `npm publish` from either staged package directory.
2. Fix npm auth, scope access, or OTP state.
3. Rerun the release from the current committed package version:

```bash
./publish.sh --current
```

`--current` is the recovery path because npm versions are immutable and the already-published `skillpacks` version must be matched by the scoped alias.

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
