---
skill: exec
agent: codex
captured_at: 2026-06-28T18:20:47-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Fix Publish Final Verification ETARGET

## Summary
Fix the end-of-`./publish.sh patch` failure where both `0.1.14` packages are published, but the final published-package smoke verification fails with npm `ETARGET` while resolving `@glexcorp/gskp@0.1.14`. Treat this as npm registry/install metadata propagation lag, not a failed publish.

## Key Changes
- Add retry handling around published-package smoke commands in `packages/skillpacks/scripts/verify-published-package.sh`, not just the metadata `npm view` checks.
- Retry only npm propagation-style failures from `npx --package "$NPM_SPEC"` such as `ETARGET`, `notarget`, or `No matching version found`.
- Keep immediate failure for real CLI/test failures after the package resolves, so broken published behavior is still caught.
- Add `--prefer-online` to the `npx`/package execution path to reduce stale cache reads while keeping the existing isolated npm cache.
- Update `publish.sh --current` recovery:
  - If `skillpacks@$VERSION` exists and `@glexcorp/gskp@$VERSION` is missing, keep the current partial-publish recovery behavior.
  - If both packages already exist, skip both publish commands and rerun the final published-package verification plus post-publish source-state instructions.
  - This lets the current failed-after-publish state recover cleanly from the bumped `0.1.14` source tree.

## Tests
- Extend `packages/skillpacks/test/verify-published-package.test.mjs` with a mock `npx` that fails the first published `list` command with npm `ETARGET`, then succeeds; assert retry output and final success.
- Add a negative verifier test where `npx` fails with a non-propagation CLI error; assert no retry loop hides the real failure.
- Update `packages/skillpacks/test/publish-recovery.test.mjs` so `--current` with both package names already published succeeds by skipping publishes and running verification, instead of failing as “Recovery already complete.”
- Run:
  - `node --test packages/skillpacks/test/verify-published-package.test.mjs packages/skillpacks/test/publish-recovery.test.mjs`
  - `npm --workspace packages/skillpacks run test:node`
  - `node scripts/audit-task-docs.mjs`
  - `git diff --check`
  - `git diff --cached --check`

## Assumptions
- The published package versions really exist once `npm view skillpacks@0.1.14 version` and `npm view @glexcorp/gskp@0.1.14 version` resolve.
- `ETARGET` during the final `npx --package @glexcorp/gskp@0.1.14` smoke test is transient npm install metadata lag and should be retried.
- After this fix, the intended recovery command for the current state is `./publish.sh --current`, which should verify both already-published packages and then print the normal commit/tag/push instructions.
