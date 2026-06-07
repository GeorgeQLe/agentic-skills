# Ship Manifest - Business-Discovery Customer-Discovery Routing

## User goal

Execute the next `$exec` step: update business-discovery pack skills so active routes no longer recommend the retired `icp` executable and instead route to `customer-discovery`, while preserving `enterprise-icp` and `research/icp.md`.

## Changed files

```text
apps/skills-showcase/public/assets/github-proof-data.js
apps/skills-showcase/public/assets/skills-data.js
docs/skills-showcase/assets/github-proof-data.js
docs/skills-showcase/assets/skills-data.js
packs/business-discovery/claude/competitive-analysis/SKILL.md
packs/business-discovery/claude/competitive-analysis/archive/v0.13/SKILL.md
packs/business-discovery/claude/customer-feedback/CHANGELOG.md
packs/business-discovery/claude/customer-feedback/SKILL.md
packs/business-discovery/claude/customer-feedback/archive/v0.4/SKILL.md
packs/business-discovery/claude/lean-canvas/SKILL.md
packs/business-discovery/claude/lean-canvas/archive/v0.6/SKILL.md
packs/business-discovery/claude/positioning/SKILL.md
packs/business-discovery/claude/positioning/archive/v0.11/SKILL.md
packs/business-discovery/claude/positioning/frameworks/category-design/CHANGELOG.md
packs/business-discovery/claude/positioning/frameworks/category-design/SKILL.md
packs/business-discovery/claude/positioning/frameworks/category-design/archive/v0.3/SKILL.md
packs/business-discovery/claude/positioning/frameworks/jtbd-positioning/CHANGELOG.md
packs/business-discovery/claude/positioning/frameworks/jtbd-positioning/SKILL.md
packs/business-discovery/claude/positioning/frameworks/jtbd-positioning/archive/v0.3/SKILL.md
packs/business-discovery/claude/positioning/frameworks/moore-positioning/CHANGELOG.md
packs/business-discovery/claude/positioning/frameworks/moore-positioning/SKILL.md
packs/business-discovery/claude/positioning/frameworks/moore-positioning/archive/v0.3/SKILL.md
packs/business-discovery/claude/positioning/frameworks/obviously-awesome/CHANGELOG.md
packs/business-discovery/claude/positioning/frameworks/obviously-awesome/SKILL.md
packs/business-discovery/claude/positioning/frameworks/obviously-awesome/archive/v0.3/SKILL.md
packs/business-discovery/claude/positioning/frameworks/strategic-canvas/CHANGELOG.md
packs/business-discovery/claude/positioning/frameworks/strategic-canvas/SKILL.md
packs/business-discovery/claude/positioning/frameworks/strategic-canvas/archive/v0.3/SKILL.md
packs/business-discovery/claude/value-prop-canvas/SKILL.md
packs/business-discovery/claude/value-prop-canvas/archive/v0.6/SKILL.md
packs/business-discovery/codex/competitive-analysis/SKILL.md
packs/business-discovery/codex/competitive-analysis/archive/v0.13/SKILL.md
packs/business-discovery/codex/customer-feedback/CHANGELOG.md
packs/business-discovery/codex/customer-feedback/SKILL.md
packs/business-discovery/codex/customer-feedback/archive/v0.4/SKILL.md
packs/business-discovery/codex/lean-canvas/SKILL.md
packs/business-discovery/codex/lean-canvas/archive/v0.6/SKILL.md
packs/business-discovery/codex/positioning/SKILL.md
packs/business-discovery/codex/positioning/archive/v0.11/SKILL.md
packs/business-discovery/codex/positioning/frameworks/category-design/CHANGELOG.md
packs/business-discovery/codex/positioning/frameworks/category-design/SKILL.md
packs/business-discovery/codex/positioning/frameworks/category-design/archive/v0.3/SKILL.md
packs/business-discovery/codex/positioning/frameworks/jtbd-positioning/CHANGELOG.md
packs/business-discovery/codex/positioning/frameworks/jtbd-positioning/SKILL.md
packs/business-discovery/codex/positioning/frameworks/jtbd-positioning/archive/v0.3/SKILL.md
packs/business-discovery/codex/positioning/frameworks/moore-positioning/CHANGELOG.md
packs/business-discovery/codex/positioning/frameworks/moore-positioning/SKILL.md
packs/business-discovery/codex/positioning/frameworks/moore-positioning/archive/v0.3/SKILL.md
packs/business-discovery/codex/positioning/frameworks/obviously-awesome/CHANGELOG.md
packs/business-discovery/codex/positioning/frameworks/obviously-awesome/SKILL.md
packs/business-discovery/codex/positioning/frameworks/obviously-awesome/archive/v0.3/SKILL.md
packs/business-discovery/codex/positioning/frameworks/strategic-canvas/CHANGELOG.md
packs/business-discovery/codex/positioning/frameworks/strategic-canvas/SKILL.md
packs/business-discovery/codex/positioning/frameworks/strategic-canvas/archive/v0.3/SKILL.md
packs/business-discovery/codex/value-prop-canvas/SKILL.md
packs/business-discovery/codex/value-prop-canvas/archive/v0.6/SKILL.md
prompts/exec/skill-prompt-20260606-225242-exec.md
tasks/history.md
tasks/ship-manifest-2026-06-06-business-discovery-pack-routing.md
tasks/todo.md
tests/layer1/business-discovery-customer-discovery-routing.test.ts
```

## Per-file purpose

- Active `SKILL.md` files above: replace retired `$icp` or `/icp` command handoffs with `$customer-discovery` or `/customer-discovery`, bump versions, and keep `research/icp.md` artifact language intact.
- Active `CHANGELOG.md` files above: record the new versions and routing behavior changes for skills whose changelogs were already present.
- `archive/*/SKILL.md` files above: preserve the pre-bump active skill contracts as required by the skill versioning policy.
- Skills Showcase generated assets: refresh catalog/proof data after tracked `SKILL.md` metadata changed.
- `tests/layer1/business-discovery-customer-discovery-routing.test.ts`: add regression coverage for active business-discovery routing.
- `prompts/exec/skill-prompt-20260606-225242-exec.md`: capture the visible `$exec` invocation and pasted context.
- `tasks/todo.md`: mark Phase 4.4 complete, record validation, and plan Phase 4.5.
- `tasks/history.md`: record this shipped step.
- This manifest: quality-gate record for the shipping boundary.

## User-goal mapping

- The changed business-discovery route contracts satisfy Phase 4.4 directly.
- Archives, versions, changelogs, and generated showcase assets satisfy repository skill-change policy.
- The new layer1 test prevents the same retired-route regression from returning.
- Task/history/manifest updates satisfy the `$exec` tracking and shipping contract.

## Tests run

- `pnpm --dir tests exec vitest run --project layer1 layer1/business-discovery-customer-discovery-routing.test.ts` - passed, 1 file and 2 tests.
- `pnpm --dir tests exec vitest run --project layer1 layer1/business-discovery-customer-discovery-routing.test.ts layer1/competitive-analysis-routing.test.ts layer1/routing-graph.test.ts` - passed, 3 files and 374 tests.
- `scripts/skill-versions.sh --missing` - passed, all 405 skills have a version field.
- `scripts/skill-archive-audit.sh --strict` - passed, 357 active skills checked, 0 violations.
- `scripts/skill-deps.sh --broken` - passed, no broken references found.
- `scripts/skill-pack-routing-audit.sh` - passed, no cross-pack recommendation gaps found.
- `node scripts/upgrade-alignment-page.mjs --dry-run` - passed with `Updated: 0` and `Bundled files written: 0`.
- `node scripts/generate-skills-showcase-data.mjs` then `node scripts/generate-skills-showcase-github-data.mjs` - completed sequentially.
- `scripts/validate-skills-showcase-data.sh` - passed after sequential generation; generated data is fresh.
- `pnpm --dir apps/skills-showcase build` - passed.
- Targeted active-file scan: `rg -n --glob 'SKILL.md' --glob '!**/archive/**' '\`\$icp\`|\`/icp\`|icp-needed|Proceed to ICP' packs/business-discovery/codex packs/business-discovery/claude` - no matches, expected `rg` exit 1.
- `PATH="/opt/homebrew/opt/grep/libexec/gnubin:$PATH" scripts/detect-secrets.sh` - passed with no findings.
- `git diff --check` - passed.

## Skipped tests

- Full `pnpm --dir tests test` was not rerun because the active task is a targeted routing-contract change and `tasks/todo.md` already documents known unrelated full-suite failures in layer1. The targeted layer1 routing tests, skill audits, generated-data validation, and Skills Showcase build cover the changed behavior.
- No deploy was run because this changes skill contracts, tests, generated catalog assets, and task docs only; production deployment requires explicit confirmation and no runtime app behavior was changed beyond generated showcase data.

## Adversarial review

- Changed-file diff review checked for overbroad renames and confirmed the diff changed command handoffs, version fields, changelogs, archives, generated assets, tests, and task docs only.
- Targeted scan found no remaining backticked `$icp`, backticked `/icp`, `icp-needed`, or `Proceed to ICP` in active business-discovery `SKILL.md` files.
- The first showcase freshness validation failed because the two generators were initially run in parallel and both touch shared assets. This was fixed by rerunning them sequentially and validating freshness.
- Accepted residual concern: broader full-suite failures remain known and unrelated per current task notes; this boundary did not attempt to remediate them.

## Residual risk

- Some active business-discovery files still intentionally use ICP terminology and `research/icp.md`; a future artifact-rename decision would need a separate plan and tests.
- `enterprise-icp` was inspected but not modified because its active references were intentional. If future requirements ask for broader customer-discovery naming instead of executable-route cleanup, that skill may need a dedicated semantic pass.

## Rollback note

Revert the shipping commit to restore the previous business-discovery routing contracts, generated showcase assets, task docs, and test addition. The archived `SKILL.md` snapshots also preserve each pre-bump contract under its old version directory.

## Next command

`$exec`
