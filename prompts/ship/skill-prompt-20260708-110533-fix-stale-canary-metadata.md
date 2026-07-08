---
skill: ship
agent: codex
captured_at: 2026-07-08T11:05:33-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Fix Stale Canary Metadata

## Summary
Publish a fresh canary prerelease from current `master` so `skillpacks@experimental` and `@glexcorp/gskp@experimental` move off the stale `0.1.22-experimental.1` tarballs. Current source already has the corrected manifest shape, so this is a release operation, not a code fix.

## Key Changes
- No source API or CLI behavior changes.
- Expected package version: `0.1.22-experimental.2`.
- npm dist-tags after publish:
  - `latest` remains `0.1.21` for both package names.
  - `experimental` points to `0.1.22-experimental.2` for both package names.
- Published canary manifest should show 409 skills, 2 canary skills, and only the Claude/Codex `create-briefing-slides` skills requiring `briefing-slides`.

## Implementation Steps
- Capture the execution prompt history first, then commit/push that prompt-only artifact so `publish.sh` starts from a clean tracked tree.
- Run pre-publish gates with a temp npm cache to avoid the local `~/.npm` permission issue:
  - `npm_config_cache=/tmp/skillpacks-npm-cache npm --workspace packages/skillpacks run test:node`
  - `npm_config_cache=/tmp/skillpacks-npm-cache npm run skillpacks:verify`
  - `npm_config_cache=/tmp/skillpacks-npm-cache ./publish.sh --dry-run --tag experimental --preid experimental prerelease`
- If all gates pass, publish:
  - `npm_config_cache=/tmp/skillpacks-npm-cache ./publish.sh --tag experimental --preid experimental prerelease`
- After successful publish, commit and tag the release-state files:
  - `git add packages/skillpacks/package.json packages/skillpacks/dist/skillpacks-manifest.json`
  - `git commit -m "Release skillpacks 0.1.22-experimental.2"`
  - `git tag skillpacks-v0.1.22-experimental.2`
  - `git push`
  - `git push origin skillpacks-v0.1.22-experimental.2`

## Test Plan
- Verify dist-tag parity:
  - `npm view skillpacks dist-tags --json`
  - `npm view @glexcorp/gskp dist-tags --json`
- Download/list both experimental tarballs and confirm canary-only files are present only in `@experimental`.
- Extract `package/dist/skillpacks-manifest.json` from both experimental tarballs and assert:
  - `package.release_lane === "canary"`
  - `canary_skill_count === 2`
  - `create_briefing_slides.length === 2`
  - `requires_briefing_slides === 2`
- Confirm stable tarballs still have 0 canary skills and no briefing-slide convention assets.
- Final `git status --short --branch` must be clean and even with origin.

## Assumptions
- npm auth is available for both `skillpacks` and `@glexcorp/gskp`.
- If `skillpacks` publishes but `@glexcorp/gskp` fails, recover with `./publish.sh --current --tag experimental` after fixing auth/access.
- Do not move or promote `latest`; this fix only refreshes the `experimental` canary lane.
