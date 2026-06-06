# journey-map changelog (codex)

## v0.9 - 2026-06-06

- Route completed positioning output through `$user-flow-map` before UI requirements, layout variations, or prototype work.
- Update optional detour wording so missing flow/design shape routes to `$user-flow-map`.

## v0.8 - 2026-06-05

- Refactored to orchestrator pattern with 5 framework subskills: `service-blueprint`, `experience-map`, `user-story-map`, `jtbd-timeline`, `customer-journey-canvas`
- Added mode detection: pre-product (defaults: jtbd-timeline + experience-map) vs product-exists (defaults: service-blueprint + user-story-map)
- Three operational modes: Mode A (framework selection via alignment page), Mode B (--synthesize), Mode C ($journey-map product shortcut)
- Task queueing to tasks/todo.md with $exec-driven sequential framework execution
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

## v0.4 - 2026-05-27

- Make the pre-approval HTML alignment preview explicit before canonical journey-map writes.
- Add journey-specific alignment translation requirements for lifecycle evidence, critical moments, assumptions, and proposed file changes.

## v0.3 - 2026-05-26

- Gate cross-pack routing recommendations on pack availability — recommend `$pack install <pack>` when the target pack is not enabled

## v0.1

- Route default AFPS handoff from journey-map to positioning before UX work.
- Make deeper lifecycle maps conditional on specific stage risks instead of default blockers.

## v0.0

- Initial version

## v0.2 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.5

- Archived previous skill contract.
