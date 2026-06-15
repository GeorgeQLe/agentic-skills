# Ship Manifest - Customer Discovery Routing Cleanup

## User Goal

Clean up unintended fallout from the prior customer-discovery routing turn while preserving the intended framework handoff fix and VARD/ORD generated-source consistency.

## Changed Files

- `packs/business-research/{codex,claude}/customer-discovery/frameworks/*/SKILL.md`
- `packs/business-research/{codex,claude}/customer-discovery/frameworks/*/CHANGELOG.md`
- `packs/business-research/{codex,claude}/customer-discovery/frameworks/*/archive/v0.4/SKILL.md`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `apps/skills-showcase/public/assets/{skills-data.js,github-proof-data.js}`
- `docs/skills-showcase/assets/{skills-data.js,github-proof-data.js}`
- `tasks/lessons.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-15-customer-discovery-routing-cleanup.md`

Removed from the working tree only:

- `packs/business-research/claude/customer-discovery/archive/v1.6/`
- `packs/business-research/codex/customer-discovery/archive/v1.6/`

Explicitly not in scope:

- `tasks/roadmap.md`
- Pre-existing `tasks/todo.md` edits from another session
- `prompts/analyze-sessions/skill-prompt-20260615-112040-alignment-gate-reactivity.md`
- `tasks/alignment-gate-reactivity-analysis.md`

## Per-File Purpose

- Customer-discovery framework contracts: preserve the approved `v0.5` parent-loop handoff wording.
- Framework changelogs and archives: preserve required skill-versioning records for the `v0.4` to `v0.5` behavior change.
- Skillpacks manifest: regenerate package metadata from restored package version and current source skills.
- Skills Showcase assets: keep website-owned generated data fresh after source and manifest changes.
- Lessons/history/manifest: record the correction, verification, and shipping boundary.

## User-Goal Mapping

- Preserves the intended framework handoff fix without reverting the active customer-discovery parent.
- Removes only the accidental parent archives named in the cleanup plan.
- Restores package metadata fallout by removing the unintended package version bump.
- Keeps generated assets consistent with current tracked source, including VARD/ORD traction source.
- Avoids absorbing unrelated analyze-sessions artifacts.

## Tests Run

- `git status --short -- packs/ord packs/vard alignment/workflow-design-three-pipelines.html`
- `git ls-files packs/ord packs/vard | rg 'traction|PACK.md|SKILL.md'`
- `rg -n '\$exec|/exec|Recommended next command|\$customer-discovery/frameworks|/customer-discovery/frameworks' packs/business-research/codex/customer-discovery packs/business-research/claude/customer-discovery --glob 'SKILL.md' --glob '!**/archive/**'`
- `rg -n 'customer-discovery|parent|fresh Codex|fresh Claude|frameworks complete|Parent-loop|handoff|hand off' packs/business-research/codex/customer-discovery/frameworks/w3-hypothesis/SKILL.md packs/business-research/claude/customer-discovery/frameworks/w3-hypothesis/SKILL.md`
- `scripts/skill-mirror-parity-audit.sh --verbose`
- `scripts/pack.sh doctor`
- `bash scripts/skill-archive-audit.sh --strict`
- `bash scripts/skill-versions.sh --missing`
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- `git diff --check`

## Skipped Tests

- No app build was run. This cleanup changes skill contracts and generated data, not runtime app code; the Skills Showcase data validator covers the generated asset freshness required for this boundary.

## Adversarial Review

- Checked for accidental VARD/ORD tracked changes: none were present after regeneration.
- Confirmed the active framework files contain no `$exec`, `/exec`, `Recommended next command`, or direct `$customer-discovery/frameworks` / `/customer-discovery/frameworks` handoff strings.
- Confirmed all twelve active customer-discovery framework files are `version: v0.5`.
- Confirmed the accidental parent `archive/v1.6` directories no longer exist.
- Confirmed `packages/skillpacks/package.json` has no remaining diff.
- Confirmed local `.claude/.codex` install drift was reconciled for `pack.sh doctor`; those generated local skill roots remain outside tracked source.

## Residual Risk

Generated package and showcase assets include current source-state changes outside the customer-discovery framework files, notably existing VARD/ORD traction entries and previously changed business-research framework metadata. This is accepted because the cleanup plan explicitly asked to rebuild generated surfaces from current tracked sources.

## Rollback Note

Revert the cleanup commit to restore the previous generated manifest/assets and task records. If only the accidental archive deletion needs reversal, restore the two parent `archive/v1.6/` directories from the pre-cleanup working tree or history if they were later committed elsewhere.

## Next Command

`$ship-end`
