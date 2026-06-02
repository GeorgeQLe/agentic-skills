# competitive-analysis changelog (claude)

## v0.11 - 2026-06-02

- Added evidence-aware feedback handling so agents push back on factual misunderstandings while honoring subjective user preferences.

## v0.8 - 2026-05-27

- Handle plural `active_paths` manifest field with backward compatibility for singular `active_path`
- Write `pipeline_stage: competitive-analysis` on active path manifest entries
- Recommend `/product-line fork` when competitive gaps imply new product surfaces

## v0.7 - 2026-05-27

- Added active-path-only product-path manifest behavior and a bounded deferred-path implications section for parked product directions.

## v0.6 - 2026-05-26

- Gate cross-pack routing recommendations on pack availability — recommend `/pack install <pack>` when the target pack is not enabled

## v0.4

- Route standard AFPS output from competitive analysis to journey map, positioning, and UX variations before production spec work.
- Keep value-prop-canvas as an optional detour only for contested solution-customer fit evidence.

## v0.3

- Clarify standard-mode missing-journey routing so agents recommend `/pack install customer-lifecycle` before `/journey-map` when the `customer-lifecycle` pack is not enabled
- Keep cross-pack journey-map recommendations behind the same pack-availability guard

## v0.2

- Tighten research lanes: rename Analyse Positioning Opportunities → Identify Market Gaps & White Space, Go-to-Market Strategy → Observable GTM Patterns, remove Recommended Positioning / Where We Fit from output
- Narrow scope to factual observations and gap identification, deferring positioning to /positioning and GTM strategy to /gtm
- Add Signals for Downstream Research appendix routing to /positioning, /gtm, /monetization, /value-prop-canvas

## v0.1

- Gate journey-map next-step routing on `customer-lifecycle` pack availability — recommend `/pack install customer-lifecycle` when the pack is not enabled instead of sending the user to an unavailable skill

## v0.0

- Initial version

## v0.5 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.9

- Archived previous skill contract.
