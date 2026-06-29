---
skill: investigate
agent: codex
captured_at: 2026-06-28T21:30:14-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Harden Publish Against Web Auth Interrupts

## Summary
The previous fixes covered normal publish failures, but this report exposes a different path: `npm publish` entered interactive web auth, was interrupted with Ctrl-C, and left the source bumped to `0.1.15`. `0.1.15` is not published for either package, and the only dirty files are the release bump files, so the implementation should restore those first, then harden the publish script.

## Key Changes
- Restore the current failed-publish bump before coding:
  - Revert only `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` from `0.1.15` back to `HEAD` because neither `skillpacks@0.1.15` nor `@glexcorp/gskp@0.1.15` exists on npm.
- Move real-publish auth validation before any source mutation:
  - Compute the target version in a temporary package copy using npm’s own version behavior, without editing repo files.
  - Run preflight for both `skillpacks@<target>` and `@glexcorp/gskp@<target>` before `run_version_bump`.
  - Keep the existing staged-package preflight as a second guard.
- Make publish auth non-interactive by default:
  - Extend `packages/skillpacks/scripts/prepublish-auth-check.mjs` to accept package name/version overrides for pre-mutation checks.
  - For real publishes, fail early if npm is configured for `auth-type=web` and no publish token is detectable via `NODE_AUTH_TOKEN`, `NPM_TOKEN`, or registry `_authToken`.
  - Print explicit remediation: configure a publish-capable token or run legacy/token-based npm auth before retrying.
- Harden rollback on interruption:
  - Add `INT`, `TERM`, and `HUP` handling in `publish.sh`.
  - Ensure cleanup ignores repeated interrupts while restoring files, so double Ctrl-C cannot interrupt rollback.
  - Preserve the existing rule: keep bumped files only after the first `npm publish` succeeds.
- Update repo process artifacts:
  - Capture the visible prompt under `prompts/investigate/`.
  - Add a lesson to `tasks/lessons.md`: signal/interactive publish paths need rollback tests, not just nonzero-exit tests.
  - Record task plan/results in `tasks/roadmap.md` and `tasks/todo.md`.

## Test Plan
- Add release recovery tests:
  - Web-auth/no-token preflight fails before any version bump and never calls `npm publish`.
  - Ctrl-C/SIGINT during first `npm publish` restores `package.json` and manifest to their original contents.
  - Repeated interrupt during cleanup still leaves source files restored.
  - Token or legacy-auth mock path still reaches publish.
  - Existing first-publish nonzero failure and `--current` recovery tests still pass.
- Run:
  - `node --test packages/skillpacks/test/publish-recovery.test.mjs packages/skillpacks/test/prepublish-auth-check.test.mjs`
  - `npm --workspace skillpacks run test:node`
  - `npm --workspace skillpacks run build:check`
  - `node scripts/audit-task-docs.mjs`
  - `git diff --check`
  - `git diff --cached --check`
- After the fix is committed, rerun `./publish.sh --dry-run patch`; it should either pass with token/legacy auth or fail before mutating source with a clear auth message.

## Assumptions
- The dirty `0.1.15` files are failed-publish residue and should be restored because npm confirms `0.1.15` is unpublished for both package names.
- The preferred publish posture is non-interactive token/legacy auth, not browser web auth during `npm publish`.
- Publishing should wait until this hardening fix is committed and pushed.
