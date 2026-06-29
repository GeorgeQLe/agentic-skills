# Ship Manifest - Publish Current Source Release

## User goal

Investigate the `publish 0.1.16 release metadata dirty state`, fix the release-script dead end, and preserve release safety around dirty package metadata.

## Changed files

Included in this ship boundary:

- `publish.sh`
- `packages/skillpacks/test/publish-recovery.test.mjs`
- `packages/skillpacks/package.json`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `prompts/investigate/skill-prompt-20260629-004503-publish-0-1-16-dirty-state.md`
- `tasks/history.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-29-publish-current-source-release.md`

## Per-file purpose

- `publish.sh`: Allows explicit `--current` to publish the current source version when both npm package names are not yet published, while preserving partial-publish recovery behavior and dirty-tree safety.
- `packages/skillpacks/test/publish-recovery.test.mjs`: Adds regression coverage for the stranded pre-bumped source state: release metadata dirty, both registry names missing, no version bump, and both publishes executed.
- `packages/skillpacks/package.json`: Carries the existing intended release source version `0.1.16`.
- `packages/skillpacks/dist/skillpacks-manifest.json`: Carries the matching existing intended release manifest version `0.1.16`.
- `prompts/investigate/skill-prompt-20260629-004503-publish-0-1-16-dirty-state.md`: Captures the visible skill invocation and pasted skill context.
- `tasks/history.md`: Records the shipped investigation and fix.
- `tasks/roadmap.md`: Preserves the investigation plan and result as historical implementation context.
- `tasks/todo.md`: Records the completed task state, verification, and next command.
- `tasks/ship-manifest-2026-06-29-publish-current-source-release.md`: Records the shipping boundary and quality-gate evidence.

## User-goal mapping

- Confirmed the dirty metadata claim: package metadata was pre-bumped from `0.1.15` to `0.1.16`.
- Confirmed `0.1.16` was not partially published: both `npm view` checks returned 404.
- Fixed the unusable advice in the prior `--current` branch by making explicit current-source publishing a valid path when both package names are missing.
- Kept `--allow-dirty-tree` strict for package/release-impacting dirt.

## Tests run

- `bash -n publish.sh` - passed.
- `node --test packages/skillpacks/test/publish-recovery.test.mjs` - passed, 16/16.
- `npm --workspace skillpacks run test:node` - passed, 170/170.
- `npm --workspace skillpacks run build:check` - passed.
- `node scripts/audit-task-docs.mjs` - passed with 0 failures and 0 warnings.
- `git diff --check` - passed.

## Skipped tests

- Real `npm publish` was not run. This task changes release-script behavior and prepares the `0.1.16` source state, but an actual npm release is an external publication step.
- Live `./publish.sh --current` was not run because the task's own uncommitted tracked edits would correctly trip the dirty-tree gate until this ship boundary is committed.

## Adversarial review

Review method: changed-file self-review, registry-state matrix review, and focused regression coverage through the mocked publish harness.

Findings:

- The original `--current` branch had three observed registry states covered except the both-missing current-source release case. Added a dedicated state variable and test for that path rather than weakening normal dirty-tree checks.
- The final post-publish instruction assumed package metadata was always dirty after publish. Reworded it to "ensure" the release metadata is committed so it also fits a pre-committed current-source publish.

Accepted residual concern:

- `./publish.sh --current` is now broader than partial-publish recovery. The broadened behavior is explicit, registry-checked, and still blocked by unrelated tracked dirt.

## Residual risk

If a future operator accidentally commits an unintended package version, `./publish.sh --current` can publish that committed current version after registry and auth checks. The command remains explicit, and normal `patch`/`minor`/exact-version targets still run through the existing pre-bump path.

## Rollback note

Revert the commit containing this manifest to restore the old `--current` recovery-only behavior. If rolling back before publishing `0.1.16`, also decide whether to keep or revert the `0.1.16` package metadata according to the active release plan.

## Next command

`./publish.sh --current`
