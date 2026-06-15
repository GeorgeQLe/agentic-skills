# Changelog

## v0.19 - 2026-06-15

- Hardened framework-loop routing so pending framework work continues only through the parent orchestrator with the current research path argument, while path-shaped child framework commands remain prohibited.

## v0.18 - 2026-06-14

- Migrated the orchestrator to the Research Session Loop (`docs/research-session-loop-convention.md`): replaced the Mode A/B/C framing and the `tasks/todo.md` + `/exec` framework-queueing with a self-advancing session ladder (states 0/A/B/C/E, YAML-first resolution).
- Added the selected-set run manifest `research/_working/journey-map-run.yaml` as chunk state; framework progress is now derived from canonical-intermediate file existence.
- One approval gate per framework: the multi-select approval (state E) satisfies each framework's Stage-1 scope gate, so the loop runs frameworks inline entering at their research stage (Stage 2). Added the previously-absent State C inline-run step.
- Synthesis (state B) is auto-detected when all intermediates exist; on canonical write it archives the run manifest + working packet and updates `.progress.yaml`.
- Routing between frameworks is self-re-invocation of `/journey-map`; cross-skill routing only after synthesis. The `product` shortcut now writes the run manifest and enters state C. Scoped intake means no deep-interview state F — a cold start resolves directly to state E.
- Normalized frontmatter: added `context_intake: scoped` and `visual_tier: visual` to match the other research orchestrators.

## v0.17 - 2026-06-13

- Removed direct execution-loop command handoffs from non-exec routing; route through approved YAML, task, or roadmap artifacts instead.


# journey-map changelog (claude)

## v0.16 - 2026-06-12

- Updated cross-pack routing guards from the removed `business-discovery` pack name to the canonical `business-research` pack.

## v0.15 - 2026-06-12

- Clarified staged research review pages must render complete working-packet substance as structured HTML UI, with raw Markdown packet text allowed only as a supplemental source view.

## v0.14 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.13 - 2026-06-11

- Added npm-aware install-route guidance to pack availability checks and cross-pack next-step recommendations while preserving runner-specific in-agent pack install commands.

## v0.12 - 2026-06-11

- Reclassified the active orchestrator as `type: research` because it already uses the staged research lifecycle and writes approved journey-map research artifacts.

## v0.11 - 2026-06-10

- Changed report-first research flow to require alignment-page research-scope approval before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes.

## v0.10 - 2026-06-06

- Route missing customer-discovery prerequisite guidance to `/customer-discovery` instead of the retired `/icp` command while preserving `research/icp.md` as the evidence artifact name.

## v0.9 - 2026-06-06

- Route completed positioning output through `/user-flow-map` before UI requirements, layout variations, or prototype work.
- Update optional detour wording so missing flow/design shape routes to `/user-flow-map`.

## v0.8 - 2026-06-05

- Refactored to orchestrator pattern with 5 framework subskills: `service-blueprint`, `experience-map`, `user-story-map`, `jtbd-timeline`, `customer-journey-canvas`
- Added mode detection: pre-product (defaults: jtbd-timeline + experience-map) vs product-exists (defaults: service-blueprint + user-story-map)
- Three operational modes: Mode A (framework selection via alignment page), Mode B (--synthesize), Mode C (/journey-map product shortcut)
- Task queueing to tasks/todo.md with /exec-driven sequential framework execution
- Synthesis reads all framework intermediates into unified research/journey-map.md
- Kept: prerequisites, product-path scope resolution, next-step routing decision tree, optional research trigger map, constraints, pack availability guard

## v0.7 - 2026-06-01

- Evaluate blocking optional research triggers before default positioning or UX routing.
- Add a journey-map trigger map that routes existing framework/model owners such as `hook-model`, lifecycle stage maps, `lifecycle-metrics`, `value-prop-canvas`, `lean-canvas`, `monetization`, and `gtm`.
- Route habit-suitable repeat-use risks to `hook-model` with a `business-growth` pack guard, while preferring metrics/lifecycle measurement for enterprise, infrastructure, transactional, or naturally infrequent products.

## v0.6 - 2026-05-31

- Replace monorepo app-scope wording with product-path scope resolution before code/app structure exists.
- Exclude archived, abandoned, deferred, revisit, promoted, and `research/_archive/` paths from active target selection.
- Use `research/{slug}/` and `specs/{slug}/` consistently when a product path is active.

## v0.5 - 2026-05-27

- Added `research/.progress.yaml` product-path manifest awareness
- Scope journey map to active product path by default
- Surface product path implications when journey insights affect deferred paths

## v0.4 - 2026-05-27

- Make the pre-approval HTML alignment preview explicit before canonical journey-map writes.
- Add journey-specific alignment translation requirements for lifecycle evidence, critical moments, assumptions, and proposed file changes.

## v0.3 - 2026-05-26

- Gate cross-pack routing recommendations on pack availability — recommend `/pack install <pack>` when the target pack is not enabled
- Replace narrative "Cross-pack notes" paragraph with inline pack-availability conditionals on each cross-pack route

## v0.1

- Route default AFPS handoff from journey-map to positioning before UX work.
- Make deeper lifecycle maps conditional on specific stage risks instead of default blockers.

## v0.0

- Initial version

## v0.2 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
