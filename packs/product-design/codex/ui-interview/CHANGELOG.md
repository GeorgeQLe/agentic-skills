# Changelog

## v0.21 - 2026-06-13

- Removed premature `agent-work-admin`/`roadmap` handoff guidance from the research/prototype phase.
- Routed completed UI branch sets to `$user-flow-map --prototype-build-plan [topic]` so prototype work uses the explicit build-plan synthesis ledger before `$prototype`.

## v0.20 - 2026-06-13

- Moved confirmed pre-prototype UI branch packets, requirements-only packets, and interview logs from `specs/` to `design/`.
- Added flow-tree manifest updates for UI review status, artifact references, and approve/reject/retry branch decisions.
- Updated upstream reads to prefer `design/user-flow-*`, `design/ux-variations-*`, and scoped flow-tree manifests.

## v0.19 - 2026-06-12

- Reframed default `ui-interview` work around a specific UX variation branch rather than the old requirements-only handoff from `user-flow-map`.
- Added the four-step branch review loop: investigate touched flows and sibling variation/UI proposal coordination, design and render an HTML visual mockup, interview for alignment or retry, and record approve/reject/retry routing.
- Added deliverable requirements for branch investigation notes, visual mockup feedback, branch decision records, and next variation/user-flow routing.

## v0.18 - 2026-06-12

- Replaced the remaining packet-dump wording with the shared structured HTML review UI contract for complete working-packet substance.
- Required requirements-only runs to complete their own UI Assumptions Manifest and Content Requirements Manifest confirmations, with an explicit `evidence-synthesis review` exception only when the current user invocation asks to skip live questions.
- Added Interview provenance values for review pages: `live-ui-interview`, `evidence-synthesis-with-explicit-skip`, and `invalid-missing-ui-interview`.

## v0.17 - 2026-06-12

- Required pre-approval alignment pages to state the current interview stage in plain language and to distinguish requirements-only review from a live page-by-page interview.
- Required working packets to render as structured HTML sections/lists/tables, with raw Markdown previews allowed only as supplemental source views.

## v0.16 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.15 - 2026-06-11

- Added npm-aware install-route wording for agent-work-admin and cross-pack recommendations while preserving Codex `$pack install ...` routes.

## v0.14 - 2026-06-10

- Reaffirmed inline turn-final text as the only primary delivery channel for every confirmation manifest/checklist/checkpoint: the content renders as the final message text of its own turn with the confirmation question in the next turn, never mid-turn text in a turn that ends with a tool or command call.
- Retrofitted the 3-phase research lifecycle into both modes (full and requirements-only): new step 7 routes the draft through a working packet at `research/_working/preliminary-ui-interview-research.md` (or the product-path-scoped equivalent), builds `alignment/ui-interview-{topic}.html` pre-approval in `review` state, treats all checkpoint confirmations as non-final, keeps feedback-only YAML revisions pre-approval, and forbids routing recommendations before final compiled YAML.
- Gated canonical writes: `specs/ui-[topic].md` / `specs/ui-requirements-[topic].md` and interview logs are written only after final compiled YAML approval, then the working packet is archived to `docs/history/archive/`, the active packet removed, and the page converted to `confirmed`. Routing recommendations now trigger only after the page is `confirmed`.

## v0.13 - 2026-06-10

- Required every confirmation manifest/checklist (UI Assumptions Manifest, Content Requirements Manifest, coverage checkpoint) to be the final visible output of its own turn, with the confirmation question asked in the next turn — never mid-turn text in a turn that ends with a tool or command call. A confirmation question must never reference content the user has not been shown. Fixes the 2026-06-10 incident where the manifest was confirmed without ever rendering on screen.

## v0.12 - 2026-06-10

- Converted the hand-authored alignment-page section to the generator-owned stub plus a bundled `ALIGNMENT-PAGE.md`; the page contract now follows the full shared convention (lifecycle states, central alignment index, section feedback, gate/feedback YAML, TTS, browser open) with the ui-interview-specific gates from the generator gate map.

## v0.11 - 2026-06-06

- Prefer `specs/user-flow-*.md` as upstream flow-structure input for UI requirements and detailed UI specs.
- Route interfaces with missing screen/flow structure to `$user-flow-map` before requirements-only UI interview or layout variations.

## v0.10 - 2026-06-05

- Changed alignment-page section feedback so the positive option is `emphasize` with `feedback: emphasize` and `requested_agent_action: add-weight-to-section`, making it a revision/weighting request instead of approval as-is.


## v0.9 - 2026-05-31

- Required alignment pages to use a top in-flow Table of Contents instead of sidebar navigation, and to avoid sticky/fixed bottom compile banners.
- Restored bottom `Compile Feedback YAML` aggregation while keeping local section feedback YAML controls under selected section feedback textareas.

## v0.8 - 2026-05-31

- Kept final `Compile Answers` at the bottom while moving feedback-only YAML display/copy controls under each selected section feedback textarea.
- Clarified that section thumbs up/down/clarify selections always reveal their own multiline feedback textarea even when the section also has gate-question inputs.

## v0.7 - 2026-05-31

- Added top-level `alignment_page` to feedback-only and final compiled YAML so agents can reopen the exact HTML review page.

## v0.6 - 2026-05-30

- Added feedback-only YAML alignment-page handling so section concerns and clarification requests can be sent before final gate answers.

## v0.5 - 2026-05-30

- Added product-path scope resolution that prefers non-archived `research/{slug}/` paths and active manifest paths before code or monorepo hints.
- Excluded `research/_archive/`, legacy `abandoned`, `archived`, `deferred`, `revisit_candidate`, and `promoted` paths from active target selection while preserving flat `research/*.md` compatibility.


## v0.0

- Archived previous skill contract.

# ui-interview changelog (codex)

## v0.3 - 2026-05-27

- Added an explicit local alignment preview gate before canonical UI spec writes and downstream routing.

## v0.2 - 2026-05-26

- Gate cross-pack routing recommendations with formal inline pack-availability conditionals using `$pack install` syntax

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.4

- Archived previous skill contract.
