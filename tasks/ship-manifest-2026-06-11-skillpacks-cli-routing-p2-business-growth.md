# Ship Manifest — Skillpacks CLI Routing P2 Business-Growth

## User Goal

Execute the next `$exec` step: remediate the business-growth P2 install-routing bucket so active skills preserve runner-local `/pack` or `$pack` routes and add the published `npx skillpacks install` shell route.

## Changed Files

- `packs/business-growth/{claude,codex}/{experiment,growth-model,gtm,hook-model,landing-copy,metrics,monetization,pmf-assessment}/SKILL.md`
- `packs/business-growth/{claude,codex}/{experiment,growth-model,gtm,hook-model,landing-copy,metrics,monetization,pmf-assessment}/CHANGELOG.md`
- `packs/business-growth/{claude,codex}/{experiment,growth-model,gtm,hook-model,landing-copy,metrics,monetization,pmf-assessment}/archive/<old-version>/SKILL.md`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `prompts/exec/skill-prompt-20260610-221208-exec.md`

## Per-File Purpose

- Active `SKILL.md` files: bump versions and update only `Pack Availability Guard` install-route wording.
- Archive snapshots: preserve prior active versions before the active skill changes.
- Changelogs: record each version bump and npm-aware install-route wording change.
- Skills Showcase generated assets: publish updated business-growth skill versions and refreshed proof fingerprints.
- Task docs and prompt history: record execution evidence, next plan, roadmap progress, and the visible `$exec` invocation.

## User-Goal Mapping

The edited business-growth skills were the next remaining P2 bucket in `research/skillpack-cli-routing-audit.md`. The targeted report gate confirms none of the 16 business-growth target paths remain in the install-routing audit report.

## Tests Run

- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `bash -n scripts/skill-install-routing-audit.sh`
- `scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing`
- `scripts/skill-install-routing-audit.sh --report > /tmp/skill-install-routing-report.txt`
- Targeted `rg` confirming no business-growth target remains in `/tmp/skill-install-routing-report.txt`
- `bash scripts/skill-pack-routing-audit.sh`
- `bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `bash scripts/skill-deps.sh --broken`
- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/skill-install-routing-audit.test.ts`
- `scripts/skill-install-routing-audit.sh --active` (expected-red: 140 remaining non-business-growth findings)
- `pnpm --dir apps/skills-showcase build`
- `git diff --check`

## Skipped Tests

Full layer1 was not rerun because this boundary changes only repeated install-route wording in a scoped skill bucket, and the focused scanner fixture/layer1 test plus targeted report gate cover the affected contract. The strict active install-routing audit is intentionally still red until later P2/P3 buckets are remediated.

## Adversarial Review

Diff review found and fixed an intermediate Codex guard replacement issue caused by `$` replacement semantics before validation. Final targeted scans verify the Codex guard text contains the literal stale `$` skill-list wording and no duplicated frontmatter. `git diff --check` is clean, archive strictness passed, and generated alignment bundles stayed exact.

## Residual Risk

The active strict install-routing audit still reports 140 known findings outside business-growth. They are deferred to the planned business-ops, creator-foundation, customer-lifecycle, devtool, and later P2/P3 buckets.

## Rollback Note

Revert the shipping commit to restore prior business-growth active versions, changelogs, archive additions, generated showcase assets, and task docs. The next execution slice can then rerun from the previous business-growth plan.

## Next Command

`$exec`
