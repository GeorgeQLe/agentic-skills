# enterprise-icp changelog (claude)

## v0.12 - 2026-07-06

- Added the shared interrogation-page workflow as a Stage 0 gate before alignment-page scope approval.

## v0.10 - 2026-06-12

- Clarified staged research review pages must render complete working-packet substance as structured HTML UI, with raw Markdown packet text allowed only as a supplemental source view.

## v0.9 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.8 - 2026-06-11

- Added npm-aware install-route guidance so unavailable-pack fallbacks keep `/pack install` while also offering `npx skillpacks install <pack>` from the project shell.

## v0.7 - 2026-06-10

- Changed report-first research flow to require alignment-page research-scope approval before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes.

## v0.6 - 2026-06-02

- Added a staged research workflow so preliminary findings stay in non-canonical `_working` packets until review alignment approval finalizes canonical artifacts.

## v0.5 - 2026-06-02

- Added evidence-aware feedback handling so agents push back on factual misunderstandings while honoring subjective user preferences.

## v0.4

- Archived previous skill contract.

## v0.3 - 2026-05-26

- Add Pack Availability Guard section (was missing)
- Gate cross-pack routing recommendations on pack availability — recommend `/pack install <pack>` when the target pack is not enabled

## v0.1

- Tighten research lanes: rename Lifecycle → Enterprise Buying Stages, Enterprise Value Prop → Enterprise Requirements Delta, Budget Cycle & Procurement Mechanics → Procurement Reality, Land-and-Expand Strategy → Land-and-Expand Patterns (Observed)
- Narrow sections to enterprise-specific buying reality, deferring lifecycle mapping to /journey-map, pricing to /monetization, GTM strategy to /gtm
- Add Signals for Downstream Research appendix routing to /journey-map, /monetization, /gtm, /competitive-analysis

## v0.0

- Initial version

## v0.2 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
