# Ship Manifest — Skillpacks CLI Routing P2 Product-Design

## User Goal

Execute the next `$exec` step: remediate P2 product-design skill install-routing wording so active skill contracts preserve runner-local pack installs while adding the published `npx skillpacks install ...` route.

## Changed Files

- Product-design active skills, archives, and changelogs under `packs/product-design/{claude,codex}/`.
- Validation-remediation active skills, archives, and changelogs:
  - `global/{claude,codex}/codebase-status/`
  - `global/{claude,codex}/idea-scope-brief/`
  - `packs/repo-maintenance/{claude,codex}/bootstrap-repo/`
- Generated Skills Showcase data/proof assets:
  - `docs/skills-showcase/assets/skills-data.js`
  - `apps/skills-showcase/public/assets/skills-data.js`
  - `docs/skills-showcase/assets/github-proof-data.js`
  - `apps/skills-showcase/public/assets/github-proof-data.js`
  - `docs/benchmark-results-matrix.md`
- Task/prompt records:
  - `prompts/exec/skill-prompt-20260611-093504-exec.md`
  - `tasks/todo.md`
  - `tasks/history.md`
  - this manifest

## Per-File Purpose

- Product-design `SKILL.md` files: add npm-aware install-route alternatives without changing interview, prototype, design-system, variation, consolidation, approval, or alignment-page behavior.
- Product-design archives/changelogs: satisfy skill versioning for each active behavior/wording change.
- `codebase-status`, `idea-scope-brief`, and `bootstrap-repo`: fix stale `business-discovery` pack checks to current `business-research` after validation exposed current-HEAD cross-pack routing drift.
- Generated Skills Showcase assets: refresh public metadata, versions, fingerprints, and proof data after active skill content/version changes.
- Task/prompt/history files: record the execution boundary, validation evidence, and next planned slice.

## User-Goal Mapping

- The product-design targets no longer appear in `scripts/skill-install-routing-audit.sh --report`.
- Runner-specific install routes remain intact: Claude contracts keep `/pack install ...`, Codex contracts keep `$pack install ...`.
- Package-consumer routes are now explicit through `npx skillpacks install ...`.
- The validation-remediation files were changed only because the required cross-pack routing audit failed against current `HEAD`; the fix keeps the ship boundary validation-clean.

## Tests Run

- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `bash -n scripts/skill-install-routing-audit.sh`
- `scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing`
- `scripts/skill-install-routing-audit.sh --report > /tmp/skill-install-routing-report.txt`
- `bash scripts/skill-pack-routing-audit.sh`
- `bash scripts/skill-versions.sh --missing`
- `bash scripts/skill-archive-audit.sh --strict`
- `bash scripts/skill-deps.sh --broken`
- `node scripts/upgrade-alignment-page.mjs --check`
- `pnpm --dir tests exec vitest run --project layer1 layer1/skill-install-routing-audit.test.ts`
- `pnpm --dir apps/skills-showcase build`
- `git diff --check`

## Skipped Tests

- Full layer1 suite was not rerun because the changed behavior is constrained to skill install-route wording/version metadata and the focused install-routing layer1 test covers the scanner contract.
- Full `scripts/skill-install-routing-audit.sh --active` was run only as an expected-red debt measurement. It reports 42 remaining later-bucket findings outside this slice.

## Adversarial Review

- Reran the targeted report gate after edits; no product-design target path remained in `/tmp/skill-install-routing-report.txt`.
- Reran the cross-pack routing audit after fixing stale `business-research` checks; it passed with no gaps.
- Reviewed the dirty tree and left unrelated package CLI/update-check changes plus unrelated untracked alignment/prompt files outside this shipping boundary.
- Curated Skills Showcase copy, catalog grouping, workflow animation text, and proof receipt copy were reviewed at the boundary level; no hand-authored copy changed because the public names/descriptions/grouping/proof text stayed valid.

## Residual Risk

- `scripts/skill-install-routing-audit.sh --active` remains expected-red with 42 later P2/P3 findings in product-testing, remotion, research-admin, session-analytics, teardown, and youtube-ops.
- Unrelated local package CLI changes remain in the worktree and are not validated or shipped by this boundary.

## Rollback Note

Revert the shipping commit to restore the prior product-design and validation-remediation skill versions, changelogs, archives, generated Skills Showcase data, and task/prompt/history records.

## Next Command

`$exec`
