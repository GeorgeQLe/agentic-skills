# competitive-analysis changelog (claude)

## v0.21 - 2026-06-15

- Added a Re-entry Routing Guard so repeat `/competitive-analysis` invocations with pending selected frameworks resolve directly to State C and run the first pending framework inline.
- Added compatibility handling for legacy approved `tasks/todo.md` Competitive Analysis Framework Execution queues, treating them as evidence for parent-owned inline framework execution instead of routing to `/exec` or status/audit cleanup.

## v0.20 - 2026-06-14

- Migrated the orchestrator to the Research Session Loop (`docs/research-session-loop-convention.md`): replaced the Mode A/B framing and the `tasks/todo.md` + `/exec` framework-queueing with a self-advancing session ladder (states 0/A/B/C/E, YAML-first resolution).
- Added the selected-set run manifest `research/_working/competitive-analysis-run.yaml` as chunk state; framework progress is now derived from canonical-intermediate file existence.
- One approval gate per framework: the multi-select approval (state E) satisfies each framework's Stage-1 scope gate, so the loop runs frameworks inline entering at their research stage (Stage 2).
- Synthesis (state B) is auto-detected when all intermediates exist; on canonical write it archives the run manifest + working packet and updates `.progress.yaml`.
- Routing between frameworks is self-re-invocation of `/competitive-analysis`; cross-skill routing only after synthesis. Scoped intake means no deep-interview state F — a cold start resolves directly to state E.

## v0.19 - 2026-06-12

- Clarified staged research review pages must render complete working-packet substance as structured HTML UI, with raw Markdown packet text allowed only as a supplemental source view.

## v0.18 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.17 - 2026-06-11

- Added npm-aware install-route guidance so unavailable-pack fallbacks keep `/pack install` while also offering `npx skillpacks install <pack>` from the project shell.

## v0.16 - 2026-06-10

- Changed report-first research flow to require alignment-page research-scope approval before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes.

## v0.15 - 2026-06-07

- Refactored `/competitive-analysis` into a Pattern A framework-decomposition orchestrator with framework queueing and `--synthesize` mode.
- Added parent-owned framework contracts for Porter's Five Forces, SWOT, strategic group mapping, and feature/pricing matrix analysis.
- Preserved canonical `research/competitive-analysis.md` output paths and downstream customer-discovery routing semantics for approved synthesis.

## v0.14 - 2026-06-07

- Updated retired executable discovery routes from `/icp` to `/customer-discovery` while preserving `research/icp.md` as the customer evidence artifact.

## v0.13 - 2026-06-06

- Route standard AFPS output with completed positioning but missing flow structure to `/user-flow-map` before UI requirements, layout variations, or prototype work.

## v0.12 - 2026-06-02

- Added a staged research workflow so preliminary findings stay in non-canonical `_working` packets until review alignment approval finalizes canonical artifacts.

## v0.11 - 2026-06-02

- Added evidence-aware feedback handling so agents push back on factual misunderstandings while honoring subjective user preferences.

## v0.10

- Archived previous skill contract.

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
