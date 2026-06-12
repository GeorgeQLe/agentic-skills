# research-roadmap changelog (claude)

## v0.18 - 2026-06-12

- Made alignment pages optional by default: report inline and write the skill's normal durable artifacts unless the user requests an alignment page or the agent identifies a concrete clarification/review need.

## v0.17 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.16 - 2026-06-10

- Converted the hand-authored alignment-page section to the generator-owned stub plus a bundled `ALIGNMENT-PAGE.md`; the page contract now follows the full shared convention (lifecycle states, central alignment index, section feedback, gate/feedback YAML, TTS, browser open) with the research-roadmap-specific gates from the generator gate map.

## v0.15 - 2026-06-10

- Changed the inline report-first alignment contract to require research-scope approval before synthesized documentation-health findings, queue recommendations, working packets, or canonical writes.

## v0.14 - 2026-06-07

- Routed fallback documentation queue examples and direct-command guidance from retired `/icp` to `/customer-discovery` while preserving `research/icp.md` as the output artifact.

## v0.13 - 2026-06-06

- Added `/user-flow-map` as a documentation-producing product-design skill that writes `specs/user-flow-*.md`.
- Track user-flow specs, queue them between positioning and requirements-only UI interview, and mark UI/UX/prototype/roadmap artifacts stale when a newer user-flow map changes flow structure.

## v0.12 - 2026-06-05

- Changed alignment-page section feedback so the positive option is `emphasize` with `feedback: emphasize` and `requested_agent_action: add-weight-to-section`, making it a revision/weighting request instead of approval as-is.


## v0.11 - 2026-06-02

- Clarified that research-roadmap queues direct named research skill commands instead of wrapping them in execution-loop routes.

## v0.10 - 2026-05-31

- Required alignment pages to use a top in-flow Table of Contents instead of sidebar navigation, and to avoid sticky/fixed bottom compile banners.
- Restored bottom `Compile Feedback YAML` aggregation while keeping local section feedback YAML controls under selected section feedback textareas.

## v0.9 - 2026-05-31

- Kept final `Compile Answers` at the bottom while moving feedback-only YAML display/copy controls under each selected section feedback textarea.
- Clarified that section thumbs up/down/clarify selections always reveal their own multiline feedback textarea even when the section also has gate-question inputs.

## v0.8 - 2026-05-31

- Added top-level `alignment_page` to feedback-only and final compiled YAML so agents can reopen the exact HTML review page.

## v0.7 - 2026-05-30

- Added feedback-only YAML alignment-page handling so section concerns and clarification requests can be sent before final gate answers.

## v0.6

- Archived previous skill contract.

## v0.5 - 2026-05-27

- Handle plural `active_paths` manifest field with backward compatibility for singular `active_path`
- Show per-path pipeline progress in the priority queue
- Queue `/product-line review` when 3+ deferred paths accumulate
- Added `/product-line review` to business-app research outputs and dependency order

## v0.4 - 2026-05-27

- Added `research/.progress.yaml` product-path manifest intake so active and deferred paths appear in the documentation queue without forcing full downstream research for parked paths.

## v0.3 - 2026-05-27

- Added an explicit local alignment preview gate before documentation queue writes and downstream routing.

## v0.1

- Reorder the fallback business-app documentation queue so journey-map precedes positioning and UX/prototype/UAT gates precede spec-interview.
- Add research-roadmap post-prototype refresh before production spec work in the default AFPS route.

## v0.0

- Initial version

## v0.2 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
