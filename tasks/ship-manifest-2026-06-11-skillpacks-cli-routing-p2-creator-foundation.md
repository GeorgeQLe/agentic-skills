# Ship Manifest - Skillpacks CLI Routing P2 Creator-Foundation

## User Goal

Execute the next `$exec` step: remediate the P2 `creator-foundation` install-routing bucket from `research/skillpack-cli-routing-audit.md`, validate it, and ship it on `master`.

## Changed Files

- `packs/creator-foundation/{claude,codex}/{creator-evidence-schema,creator-metrics-review,creator-platform-capability-matrix,creator-positioning}/SKILL.md`
- `packs/creator-foundation/{claude,codex}/{creator-evidence-schema,creator-metrics-review,creator-platform-capability-matrix,creator-positioning}/CHANGELOG.md`
- `packs/creator-foundation/{claude,codex}/{creator-evidence-schema,creator-metrics-review,creator-platform-capability-matrix,creator-positioning}/archive/v0.4/SKILL.md`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `prompts/exec/skill-prompt-20260611-023424-exec.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-11-skillpacks-cli-routing-p2-creator-foundation.md`

## Per-File Purpose

- Creator-foundation `SKILL.md` files: preserve runner-specific `/pack install <pack>` or `$pack install <pack>` guidance while adding `npx skillpacks install <pack>` package-shell alternatives.
- Creator-foundation `CHANGELOG.md` files: record the version bump and npm-aware install-route wording change.
- Creator-foundation archive snapshots: preserve the previous active skill contracts before version bumps.
- Skills Showcase generated assets: refresh public generated versions, fingerprints, and proof data after active skill metadata/content changes.
- Prompt history: track the visible `$exec` invocation and pasted skill context for this run.
- Task/history/manifest docs: record completion, validation, residual expected-red debt, and the next executable bucket.

## User-Goal Mapping

The active todo selected the `creator-foundation` P2 remediation bucket. This boundary updates only that bucket, confirms no creator-foundation paths remain in the install-routing report, and leaves later P2/P3 findings for subsequent slices.

## Tests Run

- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `bash -n scripts/skill-install-routing-audit.sh`
- `scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing`
- `bash scripts/skill-pack-routing-audit.sh`
- `bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `bash scripts/skill-deps.sh --broken`
- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/skill-install-routing-audit.test.ts`
- `scripts/skill-install-routing-audit.sh --report > /tmp/skill-install-routing-report.txt`
- `rg 'packs/creator-foundation/(claude|codex)/(creator-evidence-schema|creator-metrics-review|creator-platform-capability-matrix|creator-positioning)/SKILL.md' /tmp/skill-install-routing-report.txt` (expected no matches)
- `scripts/skill-install-routing-audit.sh --active` (expected-red: 110 remaining non-creator-foundation findings)
- `rg -n "creator-evidence-schema|creator-metrics-review|creator-platform-capability-matrix|creator-positioning|Creator Evidence Schema|Creator Metrics Review|Creator Platform Capability Matrix|Creator Positioning" apps/skills-showcase/app apps/skills-showcase/docs docs/skills-showcase --glob '!**/assets/**'` (expected no matches)
- `pnpm --dir apps/skills-showcase build`
- `git diff --check`

## Skipped Tests

Full layer1 was not rerun because the changed behavior is limited to install-route wording in one P2 bucket, and the focused install-routing layer1 test plus repository scanner cover this contract. Full active install-routing strict mode remains intentionally red until later P2/P3 buckets are remediated.

## Adversarial Review

Targeted report filtering confirmed no creator-foundation target remains in `scripts/skill-install-routing-audit.sh --report`. A diff review confirmed the active `SKILL.md` changes are limited to version bumps and Pack Availability Guard wording. Generated showcase review found expected generated version/fingerprint changes, and a non-generated showcase scan found no hardcoded creator-foundation target names or versions requiring curated copy updates.

Unrelated worktree boundary: `prompts/repo-glossary/skill-prompt-20260610-223754-skill-conventions-audit.md` was already present as an untracked file during final status review. It is unrelated to this `$exec` creator-foundation boundary and is intentionally left unstaged.

## Residual Risk

`scripts/skill-install-routing-audit.sh --active` still exits 1 with 110 findings in later P2/P3 buckets. This is expected and tracked as remaining remediation work, not a regression from this slice.

## Rollback Note

Revert this shipping commit to restore the previous creator-foundation skill versions, changelogs, generated showcase assets, task docs, and prompt artifact. If rolling back manually, also remove the new `archive/v0.4/` snapshots for the bumped skills.

## Next Command

`$exec`
