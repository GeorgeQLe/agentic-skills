# Ship Manifest — Skillpacks Phase 4 Docs Readiness

## User goal

`$exec skillpacks npm distribution Phase 4 Documentation And Dry Run Release`

Execute the next `$exec` unit for Skillpacks npm Distribution Phase 4: prepare package-included documentation for dry-run release work without publishing to npm.

## Changed files

- `README.md`
- `docs/QUICKSTART.md`
- `docs/packs.md`
- `docs/decks.md`
- `docs/skillpacks-npm-distribution.md`
- `packages/skillpacks/test/compatibility.test.mjs`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-phase4-docs.md`
- `prompts/exec/skill-prompt-20260610-133351-skillpacks-npm-distribution-phase-4.md`

Excluded pre-existing local worktree changes:

- `apps/skills-showcase/next-env.d.ts`
- `apps/skills-showcase/src/components/pack-opener-collapse-target.test.tsx`

## Per-file purpose

- `README.md`: adds source-checkout and post-publish npm setup paths, plus version/pinning notes.
- `docs/QUICKSTART.md`: presents checkout and npm setup paths, install verification, and migration notes.
- `docs/packs.md`: adds npm command equivalents, deck dependency caveats, and checkout-to-npm migration guidance.
- `docs/decks.md`: documents npm deck install commands and the package semver vs skill-version distinction.
- `docs/skillpacks-npm-distribution.md`: adds the canonical Phase 4 release-readiness notes.
- `packages/skillpacks/test/compatibility.test.mjs`: pins the new documentation contract.
- `packages/skillpacks/dist/skillpacks-manifest.json`: regenerated package manifest required by `build:check`; includes current source fingerprint and previously stale current skill metadata.
- `tasks/todo.md`: records Phase 4 plan, completed Step 4.1/4.2 notes, and next Step 4.3 plan.
- `tasks/roadmap.md`: mirrors Phase 4 roadmap status.
- `tasks/history.md`: records this shipped Phase 4 docs-readiness step.
- `tasks/ship-manifest-2026-06-10-skillpacks-phase4-docs.md`: this quality-gate manifest.
- `prompts/exec/...md`: required visible prompt-history capture for the `$exec` invocation.

## User-goal mapping

- Documentation readiness maps to README, Quickstart, packs, decks, and npm distribution docs.
- Dry-run release preparation maps to the no-publish Phase 4 language and package staging/tarball checks.
- Regression prevention maps to package-owned documentation contract tests.
- Execution-loop continuity maps to task docs, history, and prompt capture.

## Tests run

- `node --check packages/skillpacks/test/compatibility.test.mjs` — passed.
- `npm --workspace skillpacks run test:node` — passed, 37/37 tests.
- `npm --workspace skillpacks run build:check` — passed; manifest check passed and package staging boundary check passed.
- `npm --workspace skillpacks run pack:dry-run` — passed serially after staging; `skillpacks@0.1.0`, `skillpacks-0.1.0.tgz`, 2,348 entries, 5,220,684 bytes packed, 31,205,670 bytes unpacked.
- `npm_config_cache=/tmp/skillpacks-npm-cache npm pack ./build --dry-run --json --silent` from `packages/skillpacks/` — passed, confirming the dry-run works with a writable cache in restricted environments.
- `git diff --check` — passed.
- Targeted review scans over docs/tasks/tests for `npx skillpacks`, `npm publish`, package semver, archive pins, dependency claims, and GitHub Actions wording — passed after one readability fix.

## Skipped tests

- `npm publish --dry-run` was not run in this step; it is the next explicit Phase 4 unit (Step 4.3) so its output can be recorded cleanly with tarball inspection evidence.
- Full repository layer1 tests were not run because this boundary changes package-included docs, package manifest metadata, task docs, and one package-owned docs contract test. The package-owned test suite plus package staging/tarball checks are the relevant executable proof for this boundary.
- Real `npm publish` was not run. Publication is Phase 5 and requires explicit user approval and npm account readiness.

## Adversarial review

Method: changed-file self-review plus targeted scans.

Checks:

- Looked for wording that implies the package is already published.
- Confirmed the source-checkout path remains documented in README, Quickstart, and packs docs.
- Confirmed npm dependency caveats match the Phase 3 compatibility matrix: Node-owned commands no `jq`; `install-deck` still requires `bash` and `jq`.
- Confirmed no GitHub Actions workflow was introduced or recommended for release.
- Confirmed migration and pinning docs explain package semver vs skill `version:` and archive availability.

Finding fixed:

- Quickstart initially put checkout and npm verification commands in one code block. Split them into separate "Source checkout" and "npm after publication" blocks.

## Residual risk

The npm examples are intentionally future-facing until Phase 5 publishes the package. The docs repeatedly qualify them as "after publication," but users skimming examples could still try `npx skillpacks` before publish. Step 4.3 should run `npm publish --dry-run` and record release readiness before any publication decision.

The regenerated manifest includes stale current-repo skill metadata unrelated to the doc copy itself because the manifest had drifted before this step. This is acceptable because `build:check` requires the package manifest to match the current source tree before any dry-run release work.

## Rollback note

Revert the shipping commit to restore previous docs, manifest, task state, and prompt/history artifacts. No npm package was published and no external release state was changed.

## Next command

`$exec skillpacks npm distribution Phase 4 Documentation And Dry Run Release`
