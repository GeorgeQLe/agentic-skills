# customer-discovery changelog (codex)

## v1.2 - 2026-06-11

- Added npm-aware install-route guidance so unavailable-pack fallbacks keep `$pack install` while also offering `npx skillpacks install <pack>` from the project shell.

## v1.1 - 2026-06-10

- Changed report-first research flow to require alignment-page research-scope approval before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes.

## v1.0 - 2026-06-05

- Renamed skill from `icp` to `customer-discovery` to reflect that the skill performs customer discovery using established frameworks, not just ICP template-filling.
- Refactored from monolithic process to orchestrator pattern with 6 framework subskills: w3-hypothesis (Schwartzfarb), jtbd-needs (Ulwick/Christensen), four-forces (Moesta), five-rings (Revella), seven-dimensions (Lincoln Murphy), pmf-engine (Vohra/Supan).
- Added pre-product vs product-exists mode detection with framework defaults per mode.
- Added candidate bootstrapping step before framework selection.
- Added shortcut modes: `$customer-discovery discovery` and `$customer-discovery validate`.
- Canonical output remains `research/icp.md` with preserved 9+1 section format for downstream compatibility.

## v0.11 - 2026-06-04

- Added Marketplace Side Preflight so ICP reads idea-brief side handoffs, infers sides on direct invocation, validates/refutes marketplace/platform/B2B2C classification during broad research, and covers or explicitly excludes each material side before candidate generation.

## v0.10 - 2026-06-04

- Added the shared Pack Availability Guard to match the Claude mirror and restored version parity.

## v0.9 - 2026-06-02

- Added a staged research workflow so preliminary findings stay in non-canonical `_working` packets until review alignment approval finalizes canonical artifacts.

## v0.8 - 2026-06-02

- Added evidence-aware feedback handling so agents push back on factual misunderstandings while honoring subjective user preferences.

## v0.7 - 2026-05-30

- Added product-path scope resolution.

## v0.5 - 2026-05-27

- Added product-path manifest handling.

## v0.4 - 2026-05-26

- Gate cross-pack routing recommendations on pack availability.

## v0.3 - 2026-05-25

- Added bounded willingness-to-pay signal capture.

## v0.2 - 2026-05-25

- Added research-quality alignment requirements.

## v0.1

- Archived previous skill contract.

## v0.0

- Archived previous skill contract.

## v0.6

- Archived previous skill contract.
