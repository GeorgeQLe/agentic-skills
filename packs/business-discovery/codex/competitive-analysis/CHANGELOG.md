# competitive-analysis changelog (codex)

## v0.3

- Clarify standard-mode missing-journey routing so agents recommend `$pack install customer-lifecycle` before `$journey-map` when the `customer-lifecycle` pack is not enabled
- Apply the same pack-availability guard to the "Other options" wording so cross-pack `journey-map` is not recommended directly before the pack is installed

## v0.2

- Tighten research lanes: rename Analyse Positioning Opportunities -> Identify Market Gaps & White Space, Go-to-Market Strategy -> Observable GTM Patterns, remove Recommended Positioning / Where We Fit from output
- Narrow scope to factual observations and gap identification, deferring positioning to $positioning and GTM strategy to $gtm
- Add Signals for Downstream Research appendix routing to $positioning, $gtm, $monetization, $value-prop-canvas

## v0.1

- Gate journey-map next-step routing on `customer-lifecycle` pack availability — recommend `$pack install customer-lifecycle` when the pack is not enabled instead of sending the user to an unavailable skill
- Apply same gate to journey-map entry in "Other options" list

## v0.0

- Initial version
