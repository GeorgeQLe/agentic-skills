# icp changelog (claude)

## v0.6 - 2026-05-27

- Handle plural `active_paths` manifest field with backward compatibility for singular `active_path`
- Write `pipeline_stage: icp` on product-path entries
- Recommend `/product-line activate` for secondary ICPs with different product surfaces

## v0.5 - 2026-05-27

- Added product-path manifest handling so secondary ICPs and Cross-ICP Analysis outcomes create `research/.progress.yaml` `product_paths` entries with revisit triggers instead of forcing full downstream research for every path.

## v0.4 - 2026-05-26

- Gate cross-pack routing recommendations on pack availability — recommend `/pack install <pack>` when the target pack is not enabled

## v0.3 - 2026-05-25

- Added bounded willingness-to-pay signal capture to ICP research, candidate evaluation, scoring rationale, output template, and downstream monetization handoff.
- Clarified that ICP records WTP evidence for segment fit and urgency without recommending prices, packaging, or monetization strategy.

## v0.2 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.1

- Tighten research lanes: rename Market Landscape → Current Alternatives (User Perspective), Value Proposition → Stated Value Drivers, Acquisition & Conversion Model → Discovery & Evaluation Behavior
- Narrow section scope to user-perspective observations, deferring competitive analysis, positioning, GTM, and monetization to downstream skills
- Add Signals for Downstream Research appendix routing to /competitive-analysis, /positioning, /monetization, /gtm

## v0.0

- Initial version

## v0.7

- Archived previous skill contract.
