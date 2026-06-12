# Ship Manifest - Skillpacks Prepublish Auth Guard

## User Goal

Wrap up the current session with `$ship-end`: update task records, validate the current `skillpacks@0.1.1` publish-readiness changes, commit, and push.

## Changed Files

| File | Purpose |
|---|---|
| `packages/skillpacks/scripts/prepublish-auth-check.mjs` | Adds the npm publish auth/version preflight for real publish attempts. |
| `packages/skillpacks/test/prepublish-auth-check.test.mjs` | Covers the guard with a mocked `npm` binary. |
| `packages/skillpacks/package.json` | Registers `prepublishOnly`, `publish:preflight`, and package-file inclusion for the guard. |
| `packages/skillpacks/scripts/build-package.mjs` | Copies the guard into staged package builds and requires it in package boundary checks. |
| `packages/skillpacks/dist/skillpacks-manifest.json` | Refreshes the generated source fingerprint after package-boundary changes. |
| `tasks/todo.md` | Records completed ship-end addendum steps and validation evidence. |
| `tasks/roadmap.md` | Records the package-readiness addendum in milestone notes. |
| `tasks/history.md` | Adds the session history entry. |
| `tasks/ship-manifest-2026-06-11-skillpacks-prepublish-auth-guard.md` | Records this shipping boundary. |
| `prompts/ship-end/skill-prompt-20260611-232053-wrap-up-session.md` | Captures the visible `$ship-end` invocation. |
| `prompts/commit-and-push-by-feature/skill-prompt-20260611-232432-ship-end-commit-boundary.md` | Captures the commit workflow invocation context used by `$ship-end`. |

## Per-File Purpose

- `prepublish-auth-check.mjs` skips `npm publish --dry-run`, then checks `npm whoami`, expected publisher identity, package maintainer membership when available, and whether the target package version is already published.
- `prepublish-auth-check.test.mjs` makes the guard deterministic without requiring network or real npm credentials.
- `package.json` ensures real publishes invoke the guard automatically and exposes a manual preflight command.
- `build-package.mjs` keeps the staged npm package behavior aligned with the source package behavior.
- `skillpacks-manifest.json` records the refreshed generated fingerprint.
- Task and prompt artifacts document the wrap-up and make the shipping boundary auditable.

## User-Goal Mapping

- Clean wrap-up: task notes, history, prompt log, and manifest are updated.
- Ship readiness: the package now fails real publish attempts before npm upload when auth/account/version state is wrong.
- Safety: dry-runs remain allowed, so readiness checks can continue without credentials.

## Tests Run

- `npm --workspace skillpacks run test:node` - passed, 55 tests.
- `npm --workspace skillpacks run build:check` - passed.
- `node --check packages/skillpacks/scripts/prepublish-auth-check.mjs` - passed.
- `node --check packages/skillpacks/test/prepublish-auth-check.test.mjs` - passed.
- `git diff --check` - passed.
- `npm --workspace skillpacks run build` - passed.
- `npm --workspace skillpacks run verify:package` - passed; dry-run tarball reports `skillpacks@0.1.1`, 2,570 entries, and includes `scripts/prepublish-auth-check.mjs`.

## Skipped Tests

- Real `npm publish` was not run. This was intentionally out of scope; the work only prepares and guards the future explicit publish.
- Real `npm whoami`/maintainer preflight was not used as a pass/fail gate because this environment is not logged in to the intended npm publisher account. Prior readiness notes already record the external auth blocker.
- Skills Showcase deploy validation was not run because this change does not alter the app, generated showcase data, or deploy surface.

## Adversarial Review

- Checked that dry-run publish behavior is not blocked by the guard.
- Checked that the staged package includes the guard and only exposes `prepublishOnly` in the staged package scripts.
- Checked that the guard fails before publish when unauthenticated, logged in as the wrong user, or targeting an already-published version.
- Checked that package validation still passes after adding the guard to the package boundary.

## Residual Risk

- The maintainer check depends on npm CLI output shape for `npm view skillpacks maintainers --json`. The parser handles string arrays and object values covered by likely npm output shapes, but live npm behavior should still be confirmed after logging in.
- Real publishing remains blocked until the intended publisher account authenticates.

## Rollback Note

Revert the ship-end commit to remove the prepublish guard, its package wiring, tests, generated fingerprint refresh, and task artifacts. Then rerun `npm --workspace skillpacks run build` and `npm --workspace skillpacks run verify:package` before any later publish attempt.

## Next Command

`$pack install guided-walkthrough` for guided manual npm login/publish preparation, or manually run `npm login --registry https://registry.npmjs.org/` before an explicitly requested publish.
