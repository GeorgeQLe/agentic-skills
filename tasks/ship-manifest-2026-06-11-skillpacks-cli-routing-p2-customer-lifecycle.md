# Ship Manifest — Skillpacks CLI Routing P2 Customer-Lifecycle

## User Goal

Run `$exec` for the next incomplete repository step: remediate the P2 `customer-lifecycle` install-routing bucket so active skill guidance mentions the published `npx skillpacks install` route without losing runner-local `/pack` and `$pack` routes.

## Changed Files

- `packs/customer-lifecycle/{claude,codex}/**/SKILL.md`
- `packs/customer-lifecycle/{claude,codex}/**/CHANGELOG.md`
- `packs/customer-lifecycle/{claude,codex}/**/archive/*/SKILL.md`
- `apps/skills-showcase/public/assets/{skills-data.js,github-proof-data.js}`
- `docs/skills-showcase/assets/{skills-data.js,github-proof-data.js}`
- `prompts/exec/skill-prompt-20260610-224353-exec.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-11-skillpacks-cli-routing-p2-customer-lifecycle.md`

## Per-File Purpose

- Active customer-lifecycle `SKILL.md` files: bump versions and add npm-aware install-route wording.
- Archive snapshots: preserve the previous active contracts before version bumps.
- Changelogs: record the versioned install-route wording change.
- Skills Showcase assets: refresh generated public skill versions, fingerprints, and proof metadata after active skill changes.
- Prompt/task/history/manifest files: preserve invocation context, mark the step complete, and prepare the next devtool remediation step.

## User-Goal Mapping

This boundary removes all customer-lifecycle paths from `scripts/skill-install-routing-audit.sh --report` while preserving the broader staged P2/P3 migration plan.

## Tests Run

- `scripts/skill-install-routing-audit.sh --report > /tmp/skill-install-routing-report.txt`
- `rg 'packs/customer-lifecycle/(claude|codex)/(conversion-map|expansion-map|journey-map|journey-map/frameworks/(customer-journey-canvas|experience-map|jtbd-timeline|service-blueprint|user-story-map)|lifecycle-metrics|onboarding-map|retention-map|transaction-map)/SKILL.md' /tmp/skill-install-routing-report.txt` (no matches)
- `scripts/skill-install-routing-audit.sh --active` (expected-red: 86 remaining non-customer-lifecycle findings)
- `bash -n scripts/skill-install-routing-audit.sh`
- `scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing`
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `bash scripts/skill-pack-routing-audit.sh`
- `bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `bash scripts/skill-deps.sh --broken`
- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/skill-install-routing-audit.test.ts`
- `pnpm --dir apps/skills-showcase build`

## Skipped Tests

- Full layer1 was not rerun because this boundary changes install-route wording and generated showcase data only; the focused scanner layer1 test, skill integrity checks, and app build cover the affected contracts.

## Adversarial Review

- Targeted report filtering proved no customer-lifecycle target remains in the active install-routing findings.
- Changed-file diff review confirmed edits are limited to version bumps, install-route wording, changelogs, archives, generated showcase data, prompt history, and task tracking.
- `journey-map` route-table edits were included because they are concrete cross-pack install recommendations, not only guard boilerplate.

## Residual Risk

- `scripts/skill-install-routing-audit.sh --active` still fails by design with 86 later P2/P3 findings, starting with the `devtool` bucket. That debt is outside this slice and is queued in `tasks/todo.md`.

## Rollback Note

Revert this shipping commit to restore the prior customer-lifecycle contracts and generated showcase assets. The archive directories added in this boundary can remain harmless historical snapshots or be removed in the same revert if the version bumps are rolled back.

## Next Command

`$exec`
