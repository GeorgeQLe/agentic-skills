# idea-scope-brief Changelog

## v0.8 - 2026-05-31

- Require a pre-approval HTML alignment preview after the coverage checkpoint and before canonical `idea-brief`, interview-log, or `research/.progress.yaml` writes. Coverage-checkpoint confirmation is non-final; only final compiled YAML approval authorizes canonical writes or downstream routing. This applies the `tasks/lessons.md` lesson "Approval-gated research needs alignment preview before approval."

## v0.7 - 2026-05-30

- Rename the producer artifact from `concept-brief` to `idea-brief` across all output paths (`research/idea-brief.md`, `research/idea-brief-interview.md`, slugged `research/{slug}/idea-brief*.md`, and legacy `research/idea-brief-{slug}.md`) so the artifact is named after the skill's subject like every sibling skill. Hard rename with no legacy fallback: the skill now writes only the `idea-brief` names and no longer recognizes `concept-brief` filenames. Added a migration note to `## Constraints` instructing existing projects to rename prior `concept-brief*` files before re-running. The word "concept" is preserved everywhere it denotes the product concept itself (concept identity, concept slug, concept summary). Supersedes the v0.6 "filename unchanged" note, which stays as historical record.

## v0.6 - 2026-05-30

- Rename "Concept Assumptions Manifest" to "Idea Assumptions Manifest" so the manifest is named after the skill's subject, matching the convention used by `ui-interview` (UI Assumptions Manifest), `ux-variations` (UX Variation Assumptions Manifest), and `feature-interview`. The `concept-brief.md` output filename is unchanged.

## v0.5 - 2026-05-30

- Added product-path scope resolution before code/app structure hints, archived-path exclusion, `active_paths` normalization, and scoped `research/{slug}/concept-brief.md` output guidance.

## v0.3 - 2026-05-27

- Added `research/.progress.yaml` product-path manifest handling for related concepts, app paths, product lines, and pivots.
- Clarified that product-path divergence is tracked with `product_paths`, not git branch terminology.

## v0.1

- Remove bootstrap-repo from next-step routing — bootstrapping a repo is premature before research (no tech stack, no firm product decision)
- Make `$pack install business-discovery` the primary recommendation for business/product concepts
- Reorder routing: business-discovery install → ICP → customer-lifecycle → pack recommend

## v0.0

- Initial version

## v0.2 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.4

- Archived previous skill contract.
