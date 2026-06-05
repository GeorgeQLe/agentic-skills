# Ship Manifest: Skill Mirror Parity Remediation

## User goal

Implement the Claude/Codex parity remediation plan: add a repo-wide mirrored pack skill audit, repair known semantic/version drift, wire the audit into normal validation, verify, and ship on `master`.

## Changed files

- `README.md`
- `docs/skill-versioning.md`
- `scripts/skill-mirror-parity-audit.sh`
- `scripts/generate-skills-showcase-github-data.mjs`
- `packs/business-discovery/codex/icp/SKILL.md`
- `packs/business-discovery/codex/icp/CHANGELOG.md`
- `packs/business-discovery/codex/icp/archive/v0.9/SKILL.md`
- `packs/business-growth/codex/gtm/SKILL.md`
- `packs/business-growth/codex/gtm/CHANGELOG.md`
- `packs/business-growth/codex/gtm/archive/v0.6/SKILL.md`
- `packs/business-growth/codex/monetization/SKILL.md`
- `packs/business-growth/codex/monetization/CHANGELOG.md`
- `packs/business-growth/codex/monetization/archive/v0.6/SKILL.md`
- `packs/product-design/claude/ux-variations/SKILL.md`
- `packs/product-design/claude/ux-variations/CHANGELOG.md`
- `packs/product-design/claude/ux-variations/archive/v0.10/SKILL.md`
- `packs/business-ops/claude/product-line/SKILL.md`
- `packs/business-ops/claude/product-line/CHANGELOG.md`
- `packs/business-ops/claude/product-line/archive/v0.1/SKILL.md`
- `packs/business-ops/codex/product-line/SKILL.md`
- `packs/business-ops/codex/product-line/CHANGELOG.md`
- `packs/business-ops/codex/product-line/archive/v0.1/SKILL.md`
- `packs/guided-walkthrough/claude/uat-guide/SKILL.md`
- `packs/guided-walkthrough/claude/uat-guide/CHANGELOG.md`
- `packs/guided-walkthrough/claude/uat-guide/archive/v0.1/SKILL.md`
- `packs/guided-walkthrough/codex/uat-guide/SKILL.md`
- `packs/guided-walkthrough/codex/uat-guide/CHANGELOG.md`
- `packs/guided-walkthrough/codex/uat-guide/archive/v0.1/SKILL.md`
- `global/claude/codebase-status/SKILL.md`
- `global/claude/codebase-status/CHANGELOG.md`
- `global/claude/codebase-status/archive/v0.2/SKILL.md`
- `global/codex/codebase-status/SKILL.md`
- `global/codex/codebase-status/CHANGELOG.md`
- `global/codex/codebase-status/archive/v0.2/SKILL.md`
- `global/claude/idea-scope-brief/SKILL.md`
- `global/claude/idea-scope-brief/CHANGELOG.md`
- `global/claude/idea-scope-brief/archive/v0.8/SKILL.md`
- `global/codex/idea-scope-brief/SKILL.md`
- `global/codex/idea-scope-brief/CHANGELOG.md`
- `global/codex/idea-scope-brief/archive/v0.8/SKILL.md`
- `docs/skills-showcase/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/benchmark-results-matrix.md`
- `prompts/exec/skill-prompt-20260604-183222-parity-remediation.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-04-skill-mirror-parity-remediation.md`

## Per-file purpose

- `scripts/skill-mirror-parity-audit.sh` enforces mirrored pack parity for missing mirrors, selected frontmatter, required shared sections, and normalized headings.
- README, `docs/skill-versioning.md`, and `scripts/generate-skills-showcase-github-data.mjs` make the new audit discoverable in validation guidance and proof data.
- The `packs/**/SKILL.md`, changelog, and archive files repair the known parity mismatches plus adjacent required-section findings found by the audit.
- The global `codebase-status` and `idea-scope-brief` changes repair cross-pack recommendation guards required for `scripts/skill-pack-routing-audit.sh` to pass.
- Generated showcase/proof assets and benchmark matrix keep committed public data fresh after skill metadata and proof-source changes.
- Prompt, task, history, and manifest files record the invocation, completed plan, validation evidence, boundary, and next route.

## User-goal mapping

Every source or skill-contract change either creates the requested parity audit, repairs drift the audit found, adds the audit to normal validation evidence, or fixes validation failures discovered while proving the remediation. Generated assets are included because the repository requires showcase data refresh after tracked skill metadata changes.

## Tests run

- `bash -n scripts/skill-mirror-parity-audit.sh` passed.
- `scripts/skill-mirror-parity-audit.sh` passed: 170 mirrored pairs, 87 approved drift entries, 0 failures.
- `scripts/skill-versions.sh --missing` passed: all 421 skills have a version field.
- `scripts/skill-archive-audit.sh --strict` passed: 371 skills checked, 0 violations.
- `scripts/skill-pack-routing-audit.sh` passed with no cross-pack recommendation gaps.
- `node scripts/generate-skills-showcase-data.mjs` regenerated skills data and the benchmark matrix.
- `node scripts/generate-skills-showcase-github-data.mjs` regenerated proof data with 6 validation scripts.
- `scripts/validate-skills-showcase-data.sh` passed after regeneration.
- `scripts/skill-deps.sh --broken` was run and failed with accepted existing unresolved-reference/parser noise.

## Skipped tests

- Full app test/build was not run because no application source, UI behavior, or runtime component changed; generated-data freshness covered the public asset outputs touched by this task.
- No live agent benchmark was run because the change is a repository validation and skill-contract parity fix, not a behavior benchmark target.

## Adversarial review

Method: changed-file self-review plus targeted failure-oriented validation. Findings fixed during review:

- The proof generator initially lacked the new parity audit entry, causing generated proof assets to drift back to 5 validation scripts; fixed in `scripts/generate-skills-showcase-github-data.mjs`.
- README wording initially implied the mirror audit scanned `global/`; tightened to state it checks mirrored pack pairs.
- `uat-guide` changelogs had pre-existing reverse-chronological drift that became visible while adding v0.2 entries; reordered v0.1 before v0.0 in both mirrors.
- The dirty tree contains unrelated animation-planner task/skill/test work; staging must remain selective so generated proof data and task docs in the commit match the intended boundary.

## Residual risk

The mirror parity audit allowlists many pre-existing heading and argument-hint drifts to keep this remediation scoped. It will catch new unapproved drift in the checked categories, but it does not yet prove full semantic equivalence for every mirrored skill body. Future work can shrink the allowlists after deliberate mirror cleanup.

## Rollback note

Revert the shipping commit on `master` to remove the new audit, restore previous skill versions/contracts, and return generated showcase/proof assets to the prior state. If only the audit causes trouble, remove it from README, `docs/skill-versioning.md`, `scripts/generate-skills-showcase-github-data.mjs`, and the generated proof assets.

## Next command

`$exec` for the next active task in `tasks/todo.md` after preserving the unrelated animation-planner worktree changes.
