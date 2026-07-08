---
skill: ship-end
agent: codex
captured_at: 2026-07-08T09:32:40-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Post-Publish Canary Closeout Plan

## Summary

Close out the already-published canary release `0.1.22-experimental.1` for both npm packages by recording source state, tagging it, pushing it, and running published-package verification. Current npm state is confirmed: `skillpacks@experimental` and `@glexcorp/gskp@experimental` both point to `0.1.22-experimental.1`; `latest` remains `0.1.21`.

## Key Changes

- Recreate the canary source state locally because the repo is currently clean at `0.1.21` stable:
  - Set `packages/skillpacks/package.json` to `0.1.22-experimental.1`.
  - Regenerate `packages/skillpacks/dist/skillpacks-manifest.json` with `SKILLPACKS_PACKAGE_LANE=canary`.
  - Confirm package metadata is `{ version: "0.1.22-experimental.1", release_lane: "canary" }`.

- Commit and tag the canary source state on `master`:
  - Commit message: `Release skillpacks 0.1.22-experimental.1`
  - Tag: `skillpacks-v0.1.22-experimental.1`
  - Push `master` and the tag to `origin`.

- Record closeout evidence in task/history docs only if the implementation workflow requires repo session history updates:
  - Note npm dist-tag parity, smoke results, commit hash, and tag.
  - Do not move `latest`; do not create a stable `v0.1.22` tag.

## Test Plan

- Before commit:
  - `SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run build:check`
  - `git diff --check`
  - Verify both package and manifest versions match `0.1.22-experimental.1`.

- Published-package verification:
  - `npm view skillpacks dist-tags --json`
  - `npm view @glexcorp/gskp dist-tags --json`
  - Confirm both `experimental` tags equal `0.1.22-experimental.1` and both `latest` tags remain `0.1.21`.

- Canary smoke checks in disposable temp directories:
  - `npx -y --package skillpacks@experimental -- skillpacks list`
  - `npx -y --package @glexcorp/gskp@experimental -- skillpacks list`
  - `npx -y --package skillpacks@experimental -- skillpacks install code-quality`
  - `npx -y --package skillpacks@experimental -- skillpacks install quality-sweep`

## Assumptions

- The published canary version to close out is exactly `0.1.22-experimental.1`.
- The canonical post-publish tag name is `skillpacks-v0.1.22-experimental.1`, matching `scripts/publish-canary-steps.sh`.
- Source state should be committed at the canary prerelease version per the release runbook, even though `latest` remains stable at `0.1.21`.
- Smoke installs use `code-quality` for pack install coverage and `quality-sweep` for single-skill install coverage, matching prior npm release verification patterns.
