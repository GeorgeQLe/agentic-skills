---
name: publish-steps
description: List the steps to publish this repo's npm packages (skillpacks + @glexcorp/gskp). Use when asked how to publish, release, or ship the npm package.
type: reference
version: v0.0
argument-hint:
---

# Publish Steps

List the release/publishing steps for this repo's public npm packages. The canonical
source of truth is `docs/release-runbook.md`; this command is a fast summary of it.

Two packages publish **together at the same version** from one staged artifact via the
top-level `./publish.sh`:

- `skillpacks` — canonical package
- `@glexcorp/gskp` — same-version scoped alias

When invoked, print the steps below. Only execute a step if the user explicitly asks you
to run it; by default just list them.

## Before you start

Report the current vs published version so the user knows whether a new release is needed:

```sh
node -p "require('./packages/skillpacks/package.json').version"   # staged/local version
npm view skillpacks version                                       # last published
```

If the local version already equals the published version, a content change needs a new
release — use `./publish.sh patch` to bump.

## Steps

1. **Auth** (prerequisite):
   ```sh
   npm login --registry https://registry.npmjs.org/
   npm whoami --registry https://registry.npmjs.org/   # expect: glexcorp
   ```
   The account needs publish access to both `skillpacks` and the `@glexcorp` scope
   (`@glexcorp/gskp`), plus OTP ready if 2FA is enabled. To publish from another authorized
   account, prefix with `SKILLPACKS_NPM_PUBLISHER=<npm-username>`.

2. **Release gates** (run before publishing):
   ```sh
   npm --workspace packages/skillpacks run test:node
   npm run skillpacks:verify
   ./publish.sh --dry-run patch
   ```
   Hard gates — do not publish if any holds: only one of the two packages would publish;
   the staged `skillpacks` and `@glexcorp/gskp` versions differ; the account cannot publish
   both; or either dry run fails.

3. **Publish**:
   ```sh
   ./publish.sh patch          # normal next release (bumps patch)
   # or pin an explicit target:  ./publish.sh 0.1.7
   ```
   The script publishes `skillpacks` first, then `@glexcorp/gskp --access public`, and
   verifies both specs.

4. **Post-publish verification**:
   ```sh
   npm view skillpacks version
   npm view @glexcorp/gskp version            # must match skillpacks
   npx skillpacks@<version> list
   npx @glexcorp/gskp@<version> list
   ```

## Recovery

If `skillpacks` publishes but `@glexcorp/gskp` fails: fix npm auth / scope access / OTP,
then rerun from the already-committed version:

```sh
./publish.sh --current
```

npm versions are immutable, so `--current` matches the alias to the already-published
`skillpacks` version. Never hand-run `npm publish` for only one package.

## Source of truth

Full detail, prerequisites, and rationale: `docs/release-runbook.md`.
