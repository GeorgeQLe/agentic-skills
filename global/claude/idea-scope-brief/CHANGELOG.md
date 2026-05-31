# idea-scope-brief Changelog

## v0.6 - 2026-05-30

- Rename "Concept Assumptions Manifest" to "Idea Assumptions Manifest" so the manifest is named after the skill's subject, matching the convention used by `ui-interview` (UI Assumptions Manifest), `ux-variations` (UX Variation Assumptions Manifest), and `feature-interview`. The `concept-brief.md` output filename is unchanged.

## v0.4 - 2026-05-27

- Handle plural `active_paths` manifest field with backward compatibility for singular `active_path`
- Write `pipeline_stage: idea-scope-brief` on product-path entries
- Recommend `/product-line review` when 3+ product paths exist

## v0.3 - 2026-05-27

- Added `research/.progress.yaml` product-path manifest handling for related concepts, app paths, product lines, and pivots.
- Clarified that product-path divergence is tracked with `product_paths`, not git branch terminology.

## v0.1

- Remove bootstrap-repo from next-step routing — bootstrapping a repo is premature before research (no tech stack, no firm product decision)
- Make `/pack install business-discovery` the primary recommendation for business/product concepts
- Reorder routing: business-discovery install → ICP → customer-lifecycle → pack recommend

## v0.0

- Initial version

## v0.2 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
