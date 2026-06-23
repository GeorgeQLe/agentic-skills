# Ship Manifest - skillpacks 0.1.11 Publish Prep

## User Goal

Make the `skillpacks@0.1.11` and `@glexcorp/gskp@0.1.11` publish path ready by fixing the stale manifest error and proving the release gates.

## Changed Files

- `CHANGELOG.md`
- `packages/skillpacks/package.json`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `publish.sh`
- `tasks/todo.md`
- `tasks/history.md`
- `prompts/exec/skill-prompt-20260622-224739-skillpacks-011-release-prep.md`
- `prompts/investigate/skill-prompt-20260623-102031-v0.1.11-publish-gates.md`
- `prompts/ship/skill-prompt-20260623-100830-v0.1.11-readiness.md`
- `tasks/ship-manifest-2026-06-23-skillpacks-0.1.11-publish-prep.md`

## Per-File Purpose

- `CHANGELOG.md`: Records the prepared `0.1.11` package release and the verified publish-prep gates.
- `packages/skillpacks/package.json`: Resets committed pre-publish source version to the last published version, `0.1.10`.
- `packages/skillpacks/dist/skillpacks-manifest.json`: Matches the committed package version and refreshed fingerprint after the publish-script fix.
- `publish.sh`: Restores dry-run backups atomically to avoid concurrent tests reading half-written JSON.
- `tasks/todo.md`: Marks the release-prep phase complete and records verification.
- `tasks/history.md`: Adds a durable release-prep history entry.
- `prompts/**`: Captures visible skill invocation prompts required by project prompt-history policy.
- `tasks/ship-manifest-2026-06-23-skillpacks-0.1.11-publish-prep.md`: Documents this shipping boundary.

## User-Goal Mapping

- The stale manifest error is fixed by regenerating `packages/skillpacks/dist/skillpacks-manifest.json` with package version `0.1.10`.
- The dry-run blocker is fixed by committing the release-prep state before running `./publish.sh --dry-run patch`.
- The race exposed by the dry-run is fixed in `publish.sh`, allowing the publish dry-run gate to pass.

## Tests Run

- `npm --workspace packages/skillpacks run test:node`
- `npm run skillpacks:verify`
- `./publish.sh --dry-run patch`
- `git diff --check`
- `git diff --cached --check`

## Skipped Tests

- No app tests were run; this boundary does not modify app code.
- No real npm publish was run; the verified next real command is `./publish.sh patch`.

## Adversarial Review

- Confirmed the committed prep state leaves both `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json` at `0.1.10`.
- Confirmed `./publish.sh --dry-run patch` stages both package names at `0.1.11`, skips real publish, and restores source release-state files to `0.1.10`.
- Checked that no app files are included in this boundary.

## Residual Risk

- The real publish still depends on npm auth, scope access, and OTP readiness for the publishing account.
- `npm version` still emits the known npm CLI `Cannot read properties of null (reading 'matches')` error after writing the target version; `publish.sh` detects the written version and continues through verified staging.

## Rollback Note

Revert the release-prep commits if the team decides not to publish `0.1.11`; no npm package was published by this boundary.

## Next Command

none; next manual shell command is `./publish.sh patch`.
