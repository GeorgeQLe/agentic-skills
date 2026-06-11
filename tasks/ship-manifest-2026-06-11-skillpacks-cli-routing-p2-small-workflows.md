# Ship Manifest - Skillpacks CLI Routing P2 Small Workflows

## User Goal

Execute the next `$exec` step: remediate the P2 small workflow pack install-routing bucket so active skills mention the published `npx skillpacks install ...` route while preserving existing valid runner-local and source-checkout routes.

## Changed Files

Included in this shipping boundary:

- `packs/game/claude/game-workflow/SKILL.md`
- `packs/game/codex/game-workflow/SKILL.md`
- `packs/guided-walkthrough/claude/uat-guide/SKILL.md`
- `packs/guided-walkthrough/codex/uat-guide/SKILL.md`
- `packs/monorepo/claude/scaffold/SKILL.md`
- `packs/monorepo/codex/scaffold/SKILL.md`
- `packs/ord/claude/ord-ship/SKILL.md`
- `packs/ord/codex/ord-ship/SKILL.md`
- `packs/game/claude/game-workflow/CHANGELOG.md`
- `packs/game/codex/game-workflow/CHANGELOG.md`
- `packs/guided-walkthrough/claude/uat-guide/CHANGELOG.md`
- `packs/guided-walkthrough/codex/uat-guide/CHANGELOG.md`
- `packs/monorepo/claude/scaffold/CHANGELOG.md`
- `packs/monorepo/codex/scaffold/CHANGELOG.md`
- `packs/ord/claude/ord-ship/CHANGELOG.md`
- `packs/ord/codex/ord-ship/CHANGELOG.md`
- `packs/game/claude/game-workflow/archive/v0.1/SKILL.md`
- `packs/game/codex/game-workflow/archive/v0.1/SKILL.md`
- `packs/guided-walkthrough/claude/uat-guide/archive/v0.3/SKILL.md`
- `packs/guided-walkthrough/codex/uat-guide/archive/v0.3/SKILL.md`
- `packs/monorepo/claude/scaffold/archive/v0.1/SKILL.md`
- `packs/monorepo/codex/scaffold/archive/v0.1/SKILL.md`
- `packs/ord/claude/ord-ship/archive/v0.1/SKILL.md`
- `packs/ord/codex/ord-ship/archive/v0.1/SKILL.md`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `prompts/exec/skill-prompt-20260611-003742-exec.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-11-skillpacks-cli-routing-p2-small-workflows.md`

Excluded local changes:

- `scripts/alignment-tts-kokoro.js` is unrelated local TTS follow-along work. It was inspected, left untouched, and will not be staged or committed in this boundary.
- `scripts/.tmp-tts-segment-guard.mjs` is an unrelated temporary TTS guard file. It was inspected, left untouched, and will not be staged or committed in this boundary.

## Per-File Purpose

- Active `SKILL.md` files: add npm-aware install-route wording and bump versions for the eight planned targets.
- Archive snapshots: preserve the prior active skill contracts before version bumps.
- `CHANGELOG.md` files: record the versioned install-routing wording change for every target.
- Skills Showcase generated assets: publish the new versions/fingerprints after active skill metadata/content changes.
- Prompt/history/task/manifest files: satisfy repository prompt-history, task tracking, roadmap progress, history, and quality-gate contracts.

## User-Goal Mapping

The target bucket from `tasks/todo.md` named `game`, `guided-walkthrough`, `monorepo`, and `ord` skills. Those eight active skill contracts now preserve their existing source-checkout, Claude, or Codex routes while adding `npx skillpacks install ...` alternatives. The targeted active routing report no longer lists any of the eight target paths.

## Tests Run

- `scripts/skill-install-routing-audit.sh --report > /tmp/skill-install-routing-report.txt` - passed; 383 active files, 14/14 P1 coverage, 59 remaining findings.
- `rg 'packs/(game/(claude|codex)/game-workflow|guided-walkthrough/(claude|codex)/uat-guide|monorepo/(claude|codex)/scaffold|ord/(claude|codex)/ord-ship)/SKILL.md' /tmp/skill-install-routing-report.txt` - passed with no matches.
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs` - passed.
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs` - passed.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` - passed.
- `bash -n scripts/skill-install-routing-audit.sh` - passed.
- `scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing` - passed; 11 fixtures scanned, 6 expected invalid findings, exit 0.
- `bash scripts/skill-pack-routing-audit.sh` - passed.
- `bash scripts/skill-versions.sh --missing` - passed; all 439 skills have a version field.
- `bash scripts/skill-archive-audit.sh --strict` - passed; 383 active skills checked, 0 violations.
- `bash scripts/skill-deps.sh --broken` - passed.
- `node scripts/upgrade-alignment-page.mjs --check` - passed; 288 ownable generated bundles exact.
- `pnpm --dir tests exec vitest run --project layer1 layer1/skill-install-routing-audit.test.ts` - passed; 1 file, 2 tests.
- `scripts/skill-install-routing-audit.sh --active` - expected-red; exit 1 with 59 remaining non-target findings deferred to later P2/P3 buckets.
- `pnpm --dir apps/skills-showcase build` - passed.
- `git diff --check` - passed.
- Curated showcase copy scan - no hand-authored showcase version or npm-route text needed updates for this target bucket.

## Skipped Tests

- Full layer1 suite was not run because the changed executable contract is the install-routing scanner and the focused layer1 test covers that path; skill archive/version/dependency checks cover the repository-wide skill hygiene affected by this change.
- Full app/browser smoke tests were not run because the app changes are generated data version/fingerprint updates only; `pnpm --dir apps/skills-showcase build` proves the generated assets still compile into the app.

## Adversarial Review

Review method: changed-file self-review plus targeted scans, equivalent to the quality-gate targeted review for this multi-file workflow-policy change.

Findings:

- The initial post-edit grep accidentally read a stale `/tmp/skill-install-routing-report.txt`; I regenerated the report and reran the target-path check before treating it as evidence.
- `pnpm --dir apps/skills-showcase build` changed `apps/skills-showcase/next-env.d.ts` from dev routes to build routes. That known build side effect was restored before shipping.
- `scripts/alignment-tts-kokoro.js` and `scripts/.tmp-tts-segment-guard.mjs` are unrelated local TTS work. They are explicitly excluded from staging and commit.
- Generated Skills Showcase diffs are limited to source fingerprints and the eight expected target version fields.

## Residual Risk

The active strict install-routing audit still fails with 59 findings in later P2/P3 buckets, starting with `product-design`. That is planned residual migration debt, not a regression in this bucket. The next `$exec` step targets product-design and should reduce the count to 44 if no unrelated routing text changes.

## Rollback Note

Revert the shipping commit to restore the eight active skill contracts, changelogs, archive additions, generated showcase assets, and task docs. If only the generated site data is suspect, rerun the two Skills Showcase generators from the reverted skill state and validate with `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`.

## Next Command

`$exec`
