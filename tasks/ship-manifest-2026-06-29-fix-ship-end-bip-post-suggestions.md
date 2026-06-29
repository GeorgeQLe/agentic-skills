# Ship Manifest - Fix Ship-End BIP Post Suggestions

## User Goal

Fix `ship-end` so an already-enabled Build-In-Public project does not stop at "BIP gate skipped" and instead provides BIP posts or suggestions after wrap-up.

## Changed Files

- `packs/exec-loop/codex/ship-end/SKILL.md` - bumps `ship-end` to `v0.8` and changes enabled BIP from a terminal skip into an enabled post-suggestion path.
- `packs/exec-loop/claude/ship-end/SKILL.md` - mirrors the same behavior for Claude `/ship-end`.
- `packs/exec-loop/*/ship-end/archive/v0.7/SKILL.md` - archives the prior skip-only contract before the version bump.
- `packs/exec-loop/*/ship-end/CHANGELOG.md` - records the v0.8 behavior change.
- `CLAUDE.md` - updates the shared BIP Suggestion Gate convention so already-enabled BIP skips only enablement, not enabled behavior.
- `packages/skillpacks/dist/skillpacks-manifest.json` - refreshes packaged metadata for the v0.8 skills, v0.7 archives, and content hashes.
- `tests/layer1/ship-end-bip.test.ts` - adds regression coverage for already-enabled BIP post suggestions.
- `prompts/investigate/skill-prompt-20260628-222016-ship-end-bip-posts.md` - captures the visible invocation.
- `tasks/roadmap.md`, `tasks/todo.md`, `tasks/history.md`, `tasks/lessons.md` - track the active work, results, and user-correction lesson.

## User-Goal Mapping

- Already-enabled BIP behavior: handled by the new "BIP post suggestions" step in both `ship-end` mirrors.
- No skip-only output: enforced by explicit skill wording and `tests/layer1/ship-end-bip.test.ts`.
- Shared convention alignment: handled by `CLAUDE.md` and regression coverage in `tests/layer1/ship-end-bip.test.ts`.
- Packaged availability: handled by the regenerated package manifest.

## Tests Run

- `pnpm --dir tests exec vitest run --project layer1 layer1/ship-end-bip.test.ts`
- `scripts/skill-versions.sh --missing`
- `scripts/skill-archive-audit.sh --strict`
- `scripts/skill-mirror-parity-audit.sh`
- `npm --workspace skillpacks run build:check`
- `node scripts/audit-task-docs.mjs`
- `git diff --check`
- `git diff --cached --check`

## Skipped Tests

- Full benchmark suite not run: this change is a static workflow-contract update, not benchmark runtime logic.
- Full package `test:node` not run: package source code did not change, and `build:check` plus the focused layer1 contract test cover the changed package metadata and skill behavior.

## Adversarial Review

- Failure mode checked: active `ship-end` mirrors no longer contain the old exact `alignment.build_in_public === true` skip-only branch.
- Shared convention checked: `CLAUDE.md` no longer contains the old "BIP already on, skip" wording without enabled behavior.
- Boundary checked: generated local `.codex/skills/**` was not edited or staged; source pack mirrors and package manifest carry the distributable change.
- Manifest nuance checked: `build-skillpacks-manifest.mjs` reads the git index, so skill files and archives were staged before regenerating `packages/skillpacks/dist/skillpacks-manifest.json`.

## Residual Risk

- Current sessions that already loaded the old generated `.codex/skills/ship-end` copy may need a skill refresh or fresh Codex session before the v0.8 behavior appears locally.

## Rollback Note

Revert the commit to restore `ship-end` v0.7, remove the v0.7 archive additions, and restore the package manifest hashes.

## Next Command

After this commit is pushed, run `$ship-end` in a fresh or refreshed session to use the v0.8 BIP wrap-up behavior.
