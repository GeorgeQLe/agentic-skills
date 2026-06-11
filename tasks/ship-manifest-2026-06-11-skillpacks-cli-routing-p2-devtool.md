# Ship Manifest - Skillpacks CLI Routing P2 Devtool

## User Goal

Execute the next `$exec` step: remediate the P2 devtool skill install-routing wording from `research/skillpack-cli-routing-audit.md`, ship it, and prepare the next step.

## Changed Files

- `packs/devtool/{claude,codex}/{devtool-adoption,devtool-dx-journey,devtool-integration-map,devtool-monetization,devtool-positioning,devtool-user-map,devtool-workflow}/SKILL.md`
- `packs/devtool/{claude,codex}/{devtool-adoption,devtool-dx-journey,devtool-integration-map,devtool-monetization,devtool-positioning,devtool-user-map,devtool-workflow}/CHANGELOG.md`
- `packs/devtool/{claude,codex}/.../archive/<old-version>/SKILL.md`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `prompts/exec/skill-prompt-20260610-225209-exec.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-11-skillpacks-cli-routing-p2-devtool.md`

## Per-File Purpose

- Devtool `SKILL.md` files: bump versions and add npm-aware install-route guidance while preserving runner-specific and source-checkout routes.
- Devtool `CHANGELOG.md` files: record the new route-wording versions.
- Archive snapshots: preserve prior active skill contracts before version bumps.
- Skills Showcase assets: publish the new devtool versions/fingerprints in generated website data.
- Prompt history: preserve the visible `$exec` invocation context.
- Task docs/history/manifest: record completion, validation evidence, and the next P2 exec-loop handoff.

## User-Goal Mapping

This boundary completes only the devtool P2 bucket, reducing active install-routing findings from 86 to 72 and leaving later P2/P3 buckets explicitly queued.

## Tests Run

- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `scripts/skill-install-routing-audit.sh --report > /tmp/skill-install-routing-report.txt`
- `rg 'packs/devtool/(claude|codex)/(devtool-adoption|devtool-dx-journey|devtool-integration-map|devtool-monetization|devtool-positioning|devtool-user-map|devtool-workflow)/SKILL.md' /tmp/skill-install-routing-report.txt` returned no matches.
- `bash -n scripts/skill-install-routing-audit.sh`
- `scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing`
- `bash scripts/skill-pack-routing-audit.sh`
- `bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `bash scripts/skill-deps.sh --broken`
- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/skill-install-routing-audit.test.ts`
- `scripts/skill-install-routing-audit.sh --active` (expected-red: 72 remaining non-devtool findings)
- `pnpm --dir apps/skills-showcase build`
- `git diff --check`

## Skipped Tests

- Full repository test suites were not run because the source changes are limited to skill wording/version metadata, generated showcase data, and task docs. The focused scanner, skill hygiene checks, generated-data validation, and Skills Showcase build cover the changed contracts.

## Adversarial Review

- Confirmed no devtool target path remains in the install-routing report.
- Confirmed the final app/docs diff is limited to generated Skills Showcase assets; no curated showcase source, catalog grouping, workflow animation copy, or proof receipt source changed.
- Reviewed representative Claude/Codex diffs for research-skill route wording and `devtool-workflow` source-checkout wording.
- Restored the build-only `apps/skills-showcase/next-env.d.ts` side effect before shipping.

## Residual Risk

`scripts/skill-install-routing-audit.sh --active` remains red by design with 72 non-devtool findings. Those are deferred to the planned exec-loop and later P2/P3 remediation slices.

## Rollback Note

Revert the shipping commit to restore the previous devtool skill versions, changelogs, generated showcase assets, prompt/task docs, and archive additions as a single boundary.

## Next Command

`$exec`
