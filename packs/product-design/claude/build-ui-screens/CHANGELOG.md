# Changelog

## v0.6 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/build-ui-screens-{topic}.html` is now the primary review surface and compiled YAML routes back to `/build-ui-screens`.

## v0.5 - 2026-07-05

- Changed the post-screen handoff so missing or invalid prototype build plans route to `/user-flow-map --prototype-build-plan [topic]` by default.
- Restricted `/logic-wiring [topic]` recommendations to cases where `design/**/prototype-build-plan-*.md` includes the approved `ui_experiment_id`, while preserving explicit user-accepted untracked ad hoc bypasses.
- Added `agent_routing` guidance to prevent unconditional wiring payloads from `build-ui-screens`.

## v0.4 - 2026-07-04

- Removed active-contract wording that referenced the archived `create-ui-experiment` alias; the visual build leaf now names only `build-ui-screens` and `/logic-wiring`.

## v0.3 - 2026-07-04

- Updated optional inspiration inputs for the hard rename: read `design/brainstorm-inspirations-{topic}.md` and `design/take-inspiration-{topic}-*.md` artifacts when present.

## v0.2 - 2026-06-26

- Renamed the skill from `create-ui-experiment` to `build-ui-screens` (flow-walk re-cut). A deprecated `create-ui-experiment` alias still routes here.
- Reframed from a single clickable-experiment owner to an ordered visual element-batch loop: one flow step per batch, a per-batch visual checkpoint, and a minimum-UI stop rule.
- Writes `ui_experiments[].build_ledger[]` entries (`flow_step`, `elements_added[]`, `minimum-ui-reached`/`parked`); hands screens to `/logic-wiring` as the default next step.
- Alignment page output renamed to `alignment/build-ui-screens-{topic}.html`.

## v0.1 - 2026-06-23

- Bumped the contract after archiving v0.0.
- Replaced vague clickable evidence wording with the exact flow-tree fields `experiment_path` and `review_evidence`, while keeping `artifacts[]` for canonical design and review files.

## v0.0 - 2026-06-23

- Initial contract for owning clickable UI experiment routes or project-native lightweight prototypes for one approved UI branch.
- Defines fake/fixture/local/in-memory data boundaries, progressive reveal, review evidence requirements, and post-evidence routing to prototype build plans, prototypes, or UAT variant evaluation.
