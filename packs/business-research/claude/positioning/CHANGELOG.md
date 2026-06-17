# Changelog

## v0.23 - 2026-06-17

- Added self-routing Pattern A continuation metadata (`agent_routing`) to review-gate YAML requirements so fresh sessions can route to the parent orchestrator while preserving parent-owned state resolution and inline framework loading.

## v0.22 - 2026-06-17

- Added a required terminal handoff contract so Pattern A loop stops end with `## Next Work` plus the appropriate parent-owned recommended command section, including explicit synthesis routing after the last framework intermediate is written.

## v0.21 - 2026-06-15

- Narrowed approval-boundary routing language so pending review pages may name `Recommended next command after compiling YAML: /positioning` for same-orchestrator loop continuation, while downstream and cross-skill routing remain blocked until approved synthesis artifacts are written.

## v0.20 - 2026-06-15

- Hardened framework-loop routing so pending framework work continues only through the parent orchestrator with the current research path argument, while path-shaped child framework commands remain prohibited.

## v0.19 - 2026-06-14

- Completed the Research Session Loop migration: replaced the `### Operational Modes` (Mode A/B/C) framing with the formal 0/A/B/C/E state-resolution table, matching the other research orchestrators.
- Split framework selection into an explicit state-E build-multi-select-page-and-stop step and a state-C inline-run step, making the session boundary explicit (the manifest is written at the head of the first state-C session, not in state E).
- Added state-0 pasted-YAML resolution and `not-approved` refinement-session handling.
- Synthesis (state B) now archives the run manifest + working packet and updates `.progress.yaml` `pipeline_stage` on canonical write (previously only emitted routing).
- Fixed the synthesis intermediate read-list to use the full framework-slug filenames (`positioning-jtbd-positioning.md`, `positioning-moore-positioning.md`) so they match the run-manifest `intermediate` paths and file-existence state detection.
- Made the scoped cold entry explicit (no deep-interview state F — a cold start resolves directly to state E).

## v0.18 - 2026-06-14

- Replaced framework-selection `tasks/todo.md` + `/exec` routing with the Research Session Loop run-manifest model.

## v0.17 - 2026-06-13

- Removed direct execution-loop command handoffs from non-exec routing; route through approved YAML, task, or roadmap artifacts instead.


# positioning changelog (claude)

## v0.16 - 2026-06-12

- Clarified staged research review pages must render complete working-packet substance as structured HTML UI, with raw Markdown packet text allowed only as a supplemental source view.

## v0.15 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.14 - 2026-06-11

- Added npm-aware install-route guidance so unavailable-pack fallbacks keep `/pack install` while also offering `npx skillpacks install <pack>` from the project shell.

## v0.13 - 2026-06-10

- Changed report-first research flow to require alignment-page research-scope approval before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes.

## v0.12 - 2026-06-09

- Routed the hard ICP prerequisite from retired `/icp` to `/customer-discovery` while preserving `research/icp.md` as the expected artifact.

## v0.11 - 2026-06-06

- Route completed positioning synthesis to `/user-flow-map` by default when the `product-design` pack is enabled, with `/pack install product-design` as the unavailable-pack fallback.
- Keep optional value-prop, lean-canvas, GTM, monetization, and MVP-gap detours conditional instead of sending positioned product work straight to layout variation planning.

## v0.10 - 2026-06-02

- Added a staged research workflow so preliminary findings stay in non-canonical `_working` packets until review alignment approval finalizes canonical artifacts.

## v0.9 - 2026-06-02

- Made the product-positioning shortcut build a pre-approval alignment page and write `tasks/todo.md` only after final compiled YAML approval.

## v0.8 - 2026-06-02

- Added evidence-aware feedback handling so agents push back on factual misunderstandings while honoring subjective user preferences.

## v0.7 - 2026-05-31

- Redesigned as parent router + framework child skills
- Market-positioning mode: multi-select from JTBD, Blue Ocean, Moore, Play Bigger, Category Design
- Product-positioning mode: Obviously Awesome (extracted to child skill)
- Frameworks live under positioning/frameworks/ as independent child skills
- Parent builds alignment page with multi-select framework convention (new)
- Selected frameworks written to tasks/todo.md for sequential /exec execution
- Synthesis mode (`--synthesize`) combines framework outputs into research/positioning.md
- Added Optional Research Trigger Map for detour routing
- research-roadmap scans now flag market-positioning for potential refresh

## v0.4 - 2026-05-27

- Added `research/.progress.yaml` product-path manifest awareness
- Scope positioning to active product path by default
- Recommend `/product-line fork` when positioning reveals category-divergent paths

## v0.3 - 2026-05-26

- Gate cross-pack routing recommendations on pack availability — recommend `/pack install <pack>` when the target pack is not enabled

## v0.1

- Prefer journey evidence before canonical positioning and allow early positioning only as provisional working notes.
- Route default post-positioning work to ux-variations, with value-prop-canvas and lean-canvas as optional risk-driven detours.

## v0.0

- Initial version

## v0.2 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.5

- Archived previous skill contract.

## v0.6

- Added Report-First Approval Gate, downstream impact check, task classification, and alignment page convention.
