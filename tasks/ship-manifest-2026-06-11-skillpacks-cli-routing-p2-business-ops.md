# Ship Manifest - Skillpacks CLI Routing P2 Business-Ops

## User Goal

Execute the next `$exec` step: remediate the P2 `business-ops` install-routing bucket from `research/skillpack-cli-routing-audit.md`, validate it, and ship it on `master`.

## Changed Files

- `packs/business-ops/{claude,codex}/{burn-rate,cohort-review,investor-update,mvp-gap,platform-strategy,product-line,reconcile-research,retro,risk-register,runway-model,scale-audit}/SKILL.md`
- `packs/business-ops/{claude,codex}/{burn-rate,cohort-review,investor-update,mvp-gap,platform-strategy,product-line,reconcile-research,retro,risk-register,runway-model,scale-audit}/CHANGELOG.md`
- `packs/business-ops/{claude,codex}/{burn-rate,cohort-review,investor-update,mvp-gap,platform-strategy,product-line,reconcile-research,retro,risk-register,runway-model,scale-audit}/archive/*/SKILL.md`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `prompts/exec/skill-prompt-20260610-222213-exec.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-11-skillpacks-cli-routing-p2-business-ops.md`

## Per-File Purpose

- Business-ops `SKILL.md` files: preserve runner-specific `/pack install <pack>` or `$pack install <pack>` guidance while adding `npx skillpacks install <pack>` package-shell alternatives.
- Business-ops `CHANGELOG.md` files: record the version bump and npm-aware install-route wording change.
- Business-ops archive snapshots: preserve the previous active skill contracts before version bumps.
- Skills Showcase generated assets: refresh public generated versions, fingerprints, and proof data after active skill metadata/content changes.
- Prompt history: track the visible `$exec` invocation for this skill run.
- Task/history/manifest docs: record completion, validation, residual expected-red debt, and the next executable bucket.

## User-Goal Mapping

The active todo selected the `business-ops` P2 remediation bucket. This boundary updates only that bucket, confirms no business-ops paths remain in the install-routing report, and leaves later P2/P3 findings for subsequent slices.

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
- `rg 'packs/business-ops/(claude|codex)/(burn-rate|cohort-review|investor-update|mvp-gap|platform-strategy|product-line|reconcile-research|retro|risk-register|runway-model|scale-audit)/SKILL.md' /tmp/skill-install-routing-report.txt` (expected no matches)
- `scripts/skill-install-routing-audit.sh --active` (expected-red: 118 remaining non-business-ops findings)
- `pnpm --dir apps/skills-showcase build`
- `git diff --check`

## Skipped Tests

Full layer1 was not rerun because the changed behavior is limited to install-route wording in one P2 bucket, and the focused install-routing layer1 test plus repository scanner cover this contract. Full active install-routing strict mode remains intentionally red until later P2/P3 buckets are remediated.

## Adversarial Review

Targeted report filtering confirmed no business-ops target remains in `scripts/skill-install-routing-audit.sh --report`. A diff review caught and repaired an intermediate JavaScript replacement-string issue in Codex guard text before validation. Generated showcase review found only expected generated version/fingerprint changes, and a non-generated showcase scan found no hardcoded business-ops names or versions requiring curated copy updates.

## Residual Risk

`scripts/skill-install-routing-audit.sh --active` still exits 1 with 118 findings in later P2/P3 buckets. This is expected and tracked as remaining remediation work, not a regression from this slice.

## Rollback Note

Revert this shipping commit to restore the previous business-ops skill versions, changelogs, generated showcase assets, task docs, and prompt artifact. If rolling back manually, also remove the new archive snapshots for the bumped versions.

## Next Command

`$exec`
