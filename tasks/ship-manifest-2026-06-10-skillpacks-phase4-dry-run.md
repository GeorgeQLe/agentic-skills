# Ship Manifest — Skillpacks Phase 4 Dry-Run Release Checks

## User goal

`$exec skillpacks npm distribution Phase 4 Documentation And Dry Run Release`

Execute the next `$exec` unit for Skillpacks npm Distribution Phase 4: run package staging, tarball dry-run inspection, and `npm publish --dry-run` without publishing to npm or changing the git-checkout setup path.

## Changed files

- `prompts/exec/skill-prompt-20260610-135305-skillpacks-npm-phase-4.md`
- `tasks/lessons.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-phase4-dry-run.md`

Excluded pre-existing local worktree changes:

- `apps/skills-showcase/next-env.d.ts`
- `apps/skills-showcase/src/components/pack-opener-collapse-target.test.tsx`

## Per-file purpose

- `prompts/exec/skill-prompt-20260610-135305-skillpacks-npm-phase-4.md`: required visible prompt-history capture for the `$exec` invocation.
- `tasks/lessons.md`: records the shell-safety pattern learned after an unsafe review scan command-substituted a Markdown command literal.
- `tasks/todo.md`: marks Step 4.3 and the shipping-record Step 4.4 complete and records exact dry-run evidence.
- `tasks/roadmap.md`: mirrors Phase 4 dry-run and ship status.
- `tasks/history.md`: records the Phase 4 dry-run release-check outcome.
- `tasks/ship-manifest-2026-06-10-skillpacks-phase4-dry-run.md`: records this quality-gate boundary.

## User-goal mapping

- Package staging evidence maps to the dry-run release-readiness goal.
- Tarball JSON inspection maps to the package-inclusion and denied-path verification goal.
- `npm publish --dry-run` maps to the release dry-run goal while preserving the no-real-publish Phase 4 boundary.
- Task, history, manifest, and prompt updates map to the `$exec` shipping contract.

## Tests run

- `npm --workspace skillpacks run build:check` — passed. Manifest check passed for `packages/skillpacks/dist/skillpacks-manifest.json`; package staging reported 373 skills, 41 packs, source fingerprint `0551497b26389ffa0c5083054944599fe935252a71fbbc7cd2d84735825abffe`, and `Package staging boundary check passed.`
- `npm_config_cache=/tmp/skillpacks-npm-cache npm pack ./build --dry-run --json --silent` from `packages/skillpacks/` — passed. Parsed output: `skillpacks@0.1.0`, `skillpacks-0.1.0.tgz`, 2,348 entries, 5,220,684 bytes packed, 31,205,670 bytes unpacked.
- Parsed the tarball JSON file list — passed. Denied paths absent: `alignment/`, `tasks/`, `prompts/`, `apps/`, `tests/`, and `docs/history/`. Package docs present: `README.md`, `docs/QUICKSTART.md`, `docs/decks.md`, `docs/packs.md`, and `docs/skillpacks-npm-distribution.md`.
- `npm_config_cache=/tmp/skillpacks-npm-cache npm publish --dry-run --json` from `packages/skillpacks/build` — passed. npm printed `Publishing to https://registry.npmjs.org/ with tag latest and default access (dry-run)` and exited 0. Parsed output matched the tarball facts, with shasum `3c9748ca0b947cbd58a31e00e5e3f425e07ed076` and integrity `sha512-8rjxURX7+NKjo/BUV0BviODqq2XJusAb4oljpgqobG6ZxMJlJcfp/x0jcSKPzVX9077Lgp8CW8KnUe20v/V2vA==`.
- `npm --workspace skillpacks run test:node` — passed, 37/37 tests, including the Phase 4 release-readiness docs contracts.
- `npm --cache /tmp/skillpacks-npm-cache view skillpacks version --json` — sandboxed attempt failed with `EAI_AGAIN` DNS/network failure.
- `npm view skillpacks version --json --cache /tmp/skillpacks-npm-cache` under sandbox escalation — returned `E404`, confirming `skillpacks@*` is not in the npm registry after the accidental command-substitution incident.
- `git diff --check` — passed for tracked edits.
- `git diff --cached --check` — passed after staging the exact intended boundary.

## Skipped tests

- No intended real publish was run. During adversarial-review scanning, a double-quoted `rg` pattern containing the Markdown literal `` `npm publish` `` accidentally command-substituted `npm publish` from the repo root; it failed with `EROFS` before publication. Publication is Phase 5 and still requires explicit user approval.
- Full repository layer1 tests were not run because this boundary changes task/history/manifest/prompt documentation only; the package source and generated package artifacts did not change. Package-owned tests plus package staging, tarball inspection, and publish dry-run are the relevant executable proof for this dry-run release step.
- Skills Showcase app tests were not run because the only Skills Showcase worktree changes are pre-existing unrelated files excluded from this boundary.

## Adversarial review

Method: changed-file self-review plus targeted command-boundary checks.

Checks:

- Confirmed no package source or generated package artifact changed after dry-run commands.
- Confirmed the tarball and publish dry-run JSON report the same package id, filename, sizes, and file count.
- Confirmed denied repo paths are absent from the tarball file list.
- Confirmed the task docs keep real publication as a Phase 5 approval-gated action and do not claim that a package was published.
- Verified `skillpacks@*` remains absent from the npm registry after the accidental `npm publish` command-substitution incident.
- Confirmed no GitHub Actions workflow was introduced or recommended.

Findings:

- Step 4.4 would have been a redundant follow-up after clean Step 4.3 validation because it only records evidence and ships, which `$exec` requires in the same run. It is marked complete with an explicit review note so future sessions do not rerun the dry-run release checks just to close task bookkeeping.
- The first targeted scan used a double-quoted pattern containing backticks, which command-substituted `npm publish`. Fixed by recording the incident, verifying registry state with read-only `npm view`, and adding a lesson that shell search patterns containing Markdown command literals must use single quotes, escaping, or pattern files.

## Residual risk

`npm publish --dry-run` verifies npm's local packaging and registry/auth path in dry-run mode, but it is not a substitute for an explicitly approved real publish in Phase 5. The first real publish may still surface account, two-factor, package access, provenance, or unclaimed-name issues that dry-run mode does not fully exercise.

The accidental `npm publish` command substitution failed before publication and registry verification returned E404, but it demonstrates that shell quoting errors can turn review scans into release commands. The new lesson reduces recurrence risk; future release-adjacent scans should avoid shell-active Markdown literals in double-quoted patterns.

The tarball contains 2,348 entries; denied-path checks covered the known repository exclusions from the design, but they do not prove every included skill archive is semantically useful. Package staging and manifest checks cover inclusion structure, not human quality of each skill.

## Rollback note

Revert the shipping commit to restore task status, history, manifest, and prompt-history state. No npm package was published and no external release state was changed.

## Next command

`$brainstorm`
