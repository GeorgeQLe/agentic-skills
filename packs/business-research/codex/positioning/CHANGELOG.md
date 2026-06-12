# positioning changelog (codex)

## v0.15 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.14 - 2026-06-11

- Added npm-aware install-route guidance so unavailable-pack fallbacks keep `$pack install` while also offering `npx skillpacks install <pack>` from the project shell.

## v0.13 - 2026-06-10

- Changed report-first research flow to require alignment-page research-scope approval before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes.

## v0.12 - 2026-06-09

- Routed the hard ICP prerequisite from retired `$icp` to `$customer-discovery` while preserving `research/icp.md` as the expected artifact.

## v0.11 - 2026-06-06

- Route completed positioning synthesis to `$user-flow-map` by default when the `product-design` pack is enabled, with `$pack install product-design` as the unavailable-pack fallback.
- Keep optional value-prop, lean-canvas, GTM, monetization, and MVP-gap detours conditional instead of sending positioned product work straight to layout variation planning.

## v0.10 - 2026-06-02

- Added a staged research workflow so preliminary findings stay in non-canonical `_working` packets until review alignment approval finalizes canonical artifacts.

## v0.9 - 2026-06-02

- Made the product-positioning shortcut build a pre-approval alignment page and write `tasks/todo.md` only after final compiled YAML approval.
- Restored detailed Codex product-path and report-first approval wording so it stays aligned with the Claude research contract.

## v0.8 - 2026-06-02

- Added evidence-aware feedback handling so agents push back on factual misunderstandings while honoring subjective user preferences.

## v0.7 - 2026-05-31

- Redesigned as parent router + framework child skills
- Market-positioning mode: multi-select from JTBD, Blue Ocean, Moore, Play Bigger, Category Design
- Product-positioning mode: Obviously Awesome (extracted to child skill)
- Frameworks live under positioning/frameworks/ as independent child skills
- Parent builds alignment page with multi-select framework convention (new)
- Selected frameworks written to tasks/todo.md for sequential $exec execution
- Synthesis mode (`--synthesize`) combines framework outputs into research/positioning.md
- Added Optional Research Trigger Map for detour routing
- research-roadmap scans now flag market-positioning for potential refresh

## v0.6

- Reserved skipped historical version for contiguous archive audit; no active Codex `v0.6` release existed.

## v0.3 - 2026-05-26

- Gate cross-pack routing recommendations on pack availability — recommend `$pack install <pack>` when the target pack is not enabled

## v0.1

- Prefer journey evidence before canonical positioning and allow early positioning only as provisional working notes.
- Route default post-positioning work to ux-variations, with value-prop-canvas and lean-canvas as optional risk-driven detours.

## v0.0

- Initial version

## v0.2 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.4

- Archived previous skill contract.

## v0.5

- Added Report-First Approval Gate, downstream impact check, task classification, and alignment page convention.
