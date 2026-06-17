# Changelog

## v1.12 - 2026-06-17

- Added a required terminal handoff contract so Pattern A loop stops end with `## Next Work` plus the appropriate parent-owned recommended command section, including explicit synthesis routing after the last framework intermediate is written.

## v1.11 - 2026-06-15

- Narrowed approval-boundary routing language so pending review pages may name `Recommended next command after compiling YAML: /customer-discovery` for same-orchestrator loop continuation, while downstream and cross-skill routing remain blocked until approved synthesis artifacts are written.

## v1.10 - 2026-06-15

- Replaced the remaining concrete `customer-discovery/frameworks/...` placeholder in parent-loop routing guidance with generic path-shaped child framework wording.

## v1.9 - 2026-06-15

- Hardened framework-loop routing so pending framework work continues only through the parent orchestrator with the current research path argument, while path-shaped child framework commands remain prohibited.

## v1.8 - 2026-06-15

- Stage 3 now names a concrete confirmed-page validation: reconcile each displayed gate decision against the final compiled YAML and the written canonical artifact, render any `other`/freeform choice as the read-only decision and drop superseded options, and run the alignment-page post-confirmation self-check before handoff. Closes a verified incident where a `confirmed` page retained an active, stale gate question that contradicted the final compiled YAML.

## v1.7 - 2026-06-15

- Clarified that framework completion returns to the parent Research Session Loop rather than downstream routing. Parent-loop continuation now names the parent `customer-discovery` command and disallows execution-loop or direct framework handoffs before synthesized `icp.md` finalization.

## v1.6 - 2026-06-14

- Migrated the orchestrator to the Research Session Loop (`docs/research-session-loop-convention.md`): replaced the Mode A/B/C/D framing and the `tasks/todo.md` + `/exec` framework-queueing with a self-advancing session ladder (states F/E/C/B/A, YAML-first resolution).
- Added the selected-set run manifest `research/_working/customer-discovery-run.yaml` as chunk state; framework progress is now derived from canonical-intermediate file existence.
- State F (deep interview) now writes a preliminary interview handoff and stops; state E reads the handoff to detect mode, bootstrap candidates, and build the multi-select page.
- One approval gate per framework: the multi-select approval satisfies each framework's Stage-1 scope gate, so the loop runs frameworks inline entering at their research stage (Stage 2).
- Synthesis (state B) is auto-detected when all intermediates exist; on canonical write it archives the run manifest + working packet and updates `.progress.yaml`.
- Routing between frameworks is self-re-invocation of `/customer-discovery`; cross-skill routing only after synthesis.

## v1.5 - 2026-06-13

- Removed direct execution-loop command handoffs from non-exec routing; route through approved YAML, task, or roadmap artifacts instead.


# customer-discovery changelog (claude)

## v1.4 - 2026-06-12

- Clarified staged research review pages must render complete working-packet substance as structured HTML UI, with raw Markdown packet text allowed only as a supplemental source view.

## v1.3 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v1.2 - 2026-06-11

- Added npm-aware install-route guidance so unavailable-pack fallbacks keep `/pack install` while also offering `npx skillpacks install <pack>` from the project shell.

## v1.1 - 2026-06-10

- Changed report-first research flow to require alignment-page research-scope approval before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes.

## v1.0 - 2026-06-05

- Renamed skill from `icp` to `customer-discovery` to reflect that the skill performs customer discovery using established frameworks, not just ICP template-filling.
- Refactored from monolithic 9-step process to orchestrator pattern with 6 framework subskills: w3-hypothesis (Schwartzfarb), jtbd-needs (Ulwick/Christensen), four-forces (Moesta), five-rings (Revella), seven-dimensions (Lincoln Murphy), pmf-engine (Vohra/Supan).
- Added pre-product vs product-exists mode detection with framework defaults per mode.
- Added candidate bootstrapping step before framework selection (orchestrator is heavier than standard because it's the first research skill in the chain).
- Added shortcut modes: `/customer-discovery discovery` and `/customer-discovery validate`.
- Canonical output remains `research/icp.md` with preserved 9+1 section format for downstream compatibility.
- Framework intermediates written to `research/customer-discovery-{framework-slug}.md`.
- Synthesis mode (`--synthesize`) merges framework outputs using a defined section-mapping table.

## v0.11 - 2026-06-04

- Added Marketplace Side Preflight so ICP reads idea-brief side handoffs, infers sides on direct invocation, validates/refutes marketplace/platform/B2B2C classification during broad research, and covers or explicitly excludes each material side before candidate generation.

## v0.10 - 2026-06-02

- Added a staged research workflow so preliminary findings stay in non-canonical `_working` packets until review alignment approval finalizes canonical artifacts.

## v0.9 - 2026-06-02

- Added evidence-aware feedback handling so agents push back on factual misunderstandings while honoring subjective user preferences.

## v0.8

- Archived previous skill contract.

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
