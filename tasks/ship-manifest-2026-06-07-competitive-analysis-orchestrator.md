# Ship Manifest: Competitive Analysis Orchestrator

## User goal

Execute the next `$exec` task: refactor `competitive-analysis` into a Pattern A orchestrator with Porter's Five Forces, SWOT, strategic group map, and feature/pricing matrix framework subskills.

## Changed files

- `prompts/exec/skill-prompt-20260607-125029-next-exec.md`
- `packs/business-discovery/codex/competitive-analysis/SKILL.md`
- `packs/business-discovery/codex/competitive-analysis/CHANGELOG.md`
- `packs/business-discovery/codex/competitive-analysis/archive/v0.14/SKILL.md`
- `packs/business-discovery/codex/competitive-analysis/frameworks/porter-five-forces/SKILL.md`
- `packs/business-discovery/codex/competitive-analysis/frameworks/porter-five-forces/CHANGELOG.md`
- `packs/business-discovery/codex/competitive-analysis/frameworks/porter-five-forces/ALIGNMENT-PAGE.md`
- `packs/business-discovery/codex/competitive-analysis/frameworks/swot/SKILL.md`
- `packs/business-discovery/codex/competitive-analysis/frameworks/swot/CHANGELOG.md`
- `packs/business-discovery/codex/competitive-analysis/frameworks/swot/ALIGNMENT-PAGE.md`
- `packs/business-discovery/codex/competitive-analysis/frameworks/strategic-group-map/SKILL.md`
- `packs/business-discovery/codex/competitive-analysis/frameworks/strategic-group-map/CHANGELOG.md`
- `packs/business-discovery/codex/competitive-analysis/frameworks/strategic-group-map/ALIGNMENT-PAGE.md`
- `packs/business-discovery/codex/competitive-analysis/frameworks/feature-pricing-matrix/SKILL.md`
- `packs/business-discovery/codex/competitive-analysis/frameworks/feature-pricing-matrix/CHANGELOG.md`
- `packs/business-discovery/codex/competitive-analysis/frameworks/feature-pricing-matrix/ALIGNMENT-PAGE.md`
- `packs/business-discovery/claude/competitive-analysis/SKILL.md`
- `packs/business-discovery/claude/competitive-analysis/CHANGELOG.md`
- `packs/business-discovery/claude/competitive-analysis/archive/v0.14/SKILL.md`
- `packs/business-discovery/claude/competitive-analysis/frameworks/porter-five-forces/SKILL.md`
- `packs/business-discovery/claude/competitive-analysis/frameworks/porter-five-forces/CHANGELOG.md`
- `packs/business-discovery/claude/competitive-analysis/frameworks/porter-five-forces/ALIGNMENT-PAGE.md`
- `packs/business-discovery/claude/competitive-analysis/frameworks/swot/SKILL.md`
- `packs/business-discovery/claude/competitive-analysis/frameworks/swot/CHANGELOG.md`
- `packs/business-discovery/claude/competitive-analysis/frameworks/swot/ALIGNMENT-PAGE.md`
- `packs/business-discovery/claude/competitive-analysis/frameworks/strategic-group-map/SKILL.md`
- `packs/business-discovery/claude/competitive-analysis/frameworks/strategic-group-map/CHANGELOG.md`
- `packs/business-discovery/claude/competitive-analysis/frameworks/strategic-group-map/ALIGNMENT-PAGE.md`
- `packs/business-discovery/claude/competitive-analysis/frameworks/feature-pricing-matrix/SKILL.md`
- `packs/business-discovery/claude/competitive-analysis/frameworks/feature-pricing-matrix/CHANGELOG.md`
- `packs/business-discovery/claude/competitive-analysis/frameworks/feature-pricing-matrix/ALIGNMENT-PAGE.md`
- `docs/orchestrator-convention.md`
- `docs/skill-invocation-types.md`
- `tests/layer1/competitive-analysis-routing.test.ts`
- `tests/layer1/bench-coverage.test.ts`
- `tests/harness/bench-coverage.ts`
- `tests/layer4/setups/packs/pack-workflows.setup.ts`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/benchmark-results-matrix.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-07-competitive-analysis-orchestrator.md`

## Per-file purpose

- Prompt history captures the visible `$exec` invocation.
- Parent `SKILL.md` and `CHANGELOG.md` files convert `competitive-analysis` into an orchestrator and record v0.15.
- Archive files preserve the previous v0.14 parent contracts before the version bump.
- Framework directories add route-free child research contracts and generated alignment-page bundles.
- Orchestrator/taxonomy docs classify the new parent/subskill structure.
- Layer1 tests cover parent orchestration, child frontmatter, intermediate output paths, route-free subskills, and preserved AFPS routing.
- Benchmark coverage files classify new framework subskills as blocked until deterministic fixtures exist and fix stale harness validation.
- Generated showcase assets and benchmark matrix reflect the expanded active skill catalog.
- Task/history/manifest files record completion, validation, and next work.

## User-goal mapping

- The user goal required executing the next task; the next task explicitly requested the competitive-analysis orchestrator refactor.
- The parent mirrors now queue framework execution and synthesize approved framework outputs.
- The four requested framework subskills exist in both Codex and Claude mirrors.
- Existing canonical outputs and downstream customer-discovery/AFPS routing are preserved and regression-tested.

## Tests run

- `pnpm --dir tests exec vitest run --project layer1 layer1/competitive-analysis-routing.test.ts layer1/business-discovery-customer-discovery-routing.test.ts` - passed 8/8.
- `pnpm --dir tests exec vitest run --project layer1 layer1/bench-coverage.test.ts layer1/bench-setups.test.ts` - passed 92/92 after harness cleanup.
- `pnpm --dir tests exec vitest run --project layer1 layer1/competitive-analysis-routing.test.ts layer1/business-discovery-customer-discovery-routing.test.ts layer1/bench-coverage.test.ts layer1/bench-setups.test.ts` - passed 100/100.
- `scripts/skill-versions.sh --missing` - passed, all 405 skills have versions.
- `scripts/skill-archive-audit.sh --strict` - passed, 0 violations.
- `scripts/skill-deps.sh --broken` - passed, no broken references.
- `scripts/skill-pack-routing-audit.sh` - passed, no cross-pack recommendation gaps.
- `node scripts/upgrade-alignment-page.mjs --dry-run` - passed, `Updated: 0`.
- `node scripts/generate-skills-showcase-data.mjs` and `node scripts/generate-skills-showcase-github-data.mjs` - refreshed generated assets.
- `scripts/validate-skills-showcase-data.sh` - passed, generated data fresh.
- `pnpm --dir tests bench:coverage` - passed, benchmark coverage matrix valid for 185 skills.
- Active-file retired-route scan for `$icp`, `/icp`, `icp-needed`, and `Proceed to ICP` - no matches.
- `pnpm --dir apps/skills-showcase build` - passed.
- `git diff --check` - passed.

## Skipped tests

- Full `pnpm --dir tests test` was not run because this repo already documents broad unrelated layer1 failures in `tasks/todo.md`; the changed behavior is covered by focused layer1 contract tests, skill integrity checks, generated-data validation, benchmark coverage validation, and the Skills Showcase build.
- No browser visual check was run because this change alters generated catalog data and skill contracts, not UI layout or interaction behavior.

## Adversarial review

Changed-file self-review plus targeted scans looked for four failure modes:

- Parent queues framework steps but loses canonical output or downstream AFPS routing.
- Framework subskills accidentally emit downstream next-step routing.
- Active contracts reintroduce retired `$icp` or `/icp` handoffs.
- Benchmark/showcase metadata misses the new active subskills.

Findings fixed before shipping: restored explicit Claude post-synthesis next-step routing, added the optional strategic-group-map command to parent queue examples, added missing v0.14 changelog headings, and fixed stale benchmark harness validation for deterministic wording plus `repo-glossary` setup registration.

## Residual risk

The new framework contracts are validated structurally but not benchmarked with deterministic domain fixtures. They are intentionally marked blocked in benchmark coverage with next commands to build fixtures. Real user execution could still reveal wording gaps in framework selection or synthesis handoff, but canonical output paths and routing contracts are covered.

## Rollback note

Revert the shipping commit to restore `competitive-analysis` v0.14 parents, remove framework subskills, and restore prior generated showcase assets. If only the public catalog needs rollback, regenerate showcase data after reverting the skill files.

## Next command

`$exec`
