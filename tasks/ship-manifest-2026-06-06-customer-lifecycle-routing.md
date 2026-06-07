# Ship Manifest: Customer Lifecycle Customer-Discovery Routing

## User goal

Execute the next `$exec` task: Phase 4.5, updating customer-lifecycle journey-map routing so active contracts no longer recommend the retired `icp` executable and instead route missing discovery prerequisites to `customer-discovery`.

## Changed files

- `prompts/exec/skill-prompt-20260606-235533-exec.md`
- `packs/customer-lifecycle/codex/journey-map/SKILL.md`
- `packs/customer-lifecycle/claude/journey-map/SKILL.md`
- `packs/customer-lifecycle/codex/journey-map/CHANGELOG.md`
- `packs/customer-lifecycle/claude/journey-map/CHANGELOG.md`
- `packs/customer-lifecycle/codex/journey-map/archive/v0.9/SKILL.md`
- `packs/customer-lifecycle/claude/journey-map/archive/v0.9/SKILL.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/experience-map/SKILL.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/experience-map/SKILL.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/experience-map/CHANGELOG.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/experience-map/CHANGELOG.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/experience-map/archive/v0.0/SKILL.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/experience-map/archive/v0.0/SKILL.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/jtbd-timeline/SKILL.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/jtbd-timeline/SKILL.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/jtbd-timeline/CHANGELOG.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/jtbd-timeline/CHANGELOG.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/jtbd-timeline/archive/v0.0/SKILL.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/jtbd-timeline/archive/v0.0/SKILL.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/service-blueprint/SKILL.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/service-blueprint/SKILL.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/service-blueprint/CHANGELOG.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/service-blueprint/CHANGELOG.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/service-blueprint/archive/v0.0/SKILL.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/service-blueprint/archive/v0.0/SKILL.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/user-story-map/SKILL.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/user-story-map/SKILL.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/user-story-map/CHANGELOG.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/user-story-map/CHANGELOG.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/user-story-map/archive/v0.0/SKILL.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/user-story-map/archive/v0.0/SKILL.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/customer-journey-canvas/SKILL.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/customer-journey-canvas/SKILL.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/customer-journey-canvas/CHANGELOG.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/customer-journey-canvas/CHANGELOG.md`
- `packs/customer-lifecycle/codex/journey-map/frameworks/customer-journey-canvas/archive/v0.0/SKILL.md`
- `packs/customer-lifecycle/claude/journey-map/frameworks/customer-journey-canvas/archive/v0.0/SKILL.md`
- `tests/layer1/customer-lifecycle-customer-discovery-routing.test.ts`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-06-customer-lifecycle-routing.md`

Unrelated worktree item left untouched: `alignment/idea-scope-brief-npm-distribution.html`.

## Per-file purpose

- Prompt history records the visible `$exec` invocation as required by repository convention.
- Active `SKILL.md` files change only prerequisite command guidance from `icp` to `customer-discovery` and bump versions.
- `CHANGELOG.md` files document each behavior change.
- Archive files preserve the pre-bump active skill contracts.
- The new layer1 test prevents regression to retired executable routes in active customer-lifecycle journey-map contracts.
- Skills Showcase generated assets reflect the `journey-map` version bump and refreshed public GitHub proof metadata.
- `tasks/todo.md` records Phase 4.5 completion and prepares the next Phase 4.6 plan.
- `tasks/history.md` records the shipped work.
- This manifest records the quality gate and shipping boundary.

## User-goal mapping

- The `$exec` invocation selected the next incomplete task from `tasks/todo.md`: "Update customer-lifecycle pack skills (journey-map orchestrator + 5 frameworks)."
- The skill contract edits satisfy that task by replacing retired command routes while preserving ICP artifact names.
- The test and scans prove the active contracts no longer recommend `$icp` or `/icp`.
- Task/history updates prepare the next `$exec` handoff.

## Tests run

- `pnpm --dir tests exec vitest run --project layer1 layer1/customer-lifecycle-customer-discovery-routing.test.ts layer1/journey-map-routing.test.ts` - passed, 2 files and 7 tests.
- `scripts/skill-versions.sh --missing` - passed, all 405 skills have version fields.
- `scripts/skill-archive-audit.sh --strict` - passed, 357 skills checked and 0 violations.
- `scripts/skill-deps.sh --broken` - passed, no broken references.
- `scripts/skill-pack-routing-audit.sh` - passed, no cross-pack recommendation gaps.
- `node scripts/upgrade-alignment-page.mjs --dry-run` - passed, `Updated: 0`, `Bundled files written: 0`.
- `node scripts/generate-skills-showcase-data.mjs` - passed, refreshed skills data and benchmark matrix.
- `node scripts/generate-skills-showcase-github-data.mjs` - passed, refreshed proof data.
- `scripts/validate-skills-showcase-data.sh` - passed, generated data is fresh.
- `pnpm --dir apps/skills-showcase build` - passed, Next.js production build completed without warnings.
- `rg --pcre2` active-file scan for retired route labels - passed, no matches.
- `git diff --check` - passed.

Documentation/task-only checks:

- Updated `tasks/todo.md` review notes and next-step plan.
- Updated `tasks/history.md`.
- Wrote this ship manifest.

## Skipped tests

- Full `pnpm --dir tests test` was not rerun because the active task notes already record known unrelated layer1 failures from the ongoing customer-discovery rename cleanup. The targeted layer1 route tests, skill integrity checks, generated-data validation, and app build cover the changed contracts and generated assets in this boundary.
- Production deploy was not run because this step changed skill contracts and generated showcase metadata only, and production deployment requires explicit confirmation.

## Adversarial review

- Changed-file self-review checked that active skill diffs only changed version fields and prerequisite command guidance.
- Targeted `rg --pcre2` scan checked active customer-lifecycle journey-map contracts for `$icp`, `/icp`, `icp-needed`, and `Proceed to ICP`.
- Artifact-name scan verified `research/icp.md` and `research/{slug}/icp.md` remain as evidence artifact references.
- Initial non-PCRE route scan was invalid because ripgrep default regex does not support lookahead; it was rerun with `--pcre2` and passed.

Findings fixed:

- Restored `apps/skills-showcase/next-env.d.ts` build-mode churn from the validation build before shipping.

## Residual risk

- Customer-profile prose may still contain conceptual ICP language by design; this boundary only removes retired executable routes.
- Other packs still have unchecked Phase 4 routing work and may still contain retired routes until subsequent steps execute.
- GitHub proof data changed from fallback to refreshed public metadata because the generator could read public repository metadata during this run; volatile pushed-time fields remain excluded by the generator's freshness policy.

## Rollback note

After the shipping commit is known, revert it with `git revert <sha>` to restore the previous route guidance, generated data, task docs, and archive/test additions together.

## Next command

`$exec`
