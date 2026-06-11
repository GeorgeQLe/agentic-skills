# Changelog

## v0.14 - 2026-06-10

- Made inline turn-final text the default delivery channel for every confirmation manifest/checklist/checkpoint: the content renders as the final message text of its own turn with the confirmation question in the next turn; AskUserQuestion option previews are demoted to a supplementary mirror and are never the sole channel. Supersedes the v0.13 either/or framing.
- Retrofitted the 3-phase research lifecycle into both modes (full and requirements-only): new step 7 routes the draft through a working packet at `research/_working/preliminary-ui-interview-research.md` (or the product-path-scoped equivalent), builds `alignment/ui-interview-{topic}.html` pre-approval in `review` state, treats all checkpoint confirmations as non-final, keeps feedback-only YAML revisions pre-approval, and forbids routing recommendations before final compiled YAML.
- Gated canonical writes: `specs/ui-[topic].md` / `specs/ui-requirements-[topic].md` and interview logs are written only after final compiled YAML approval, then the working packet is archived to `docs/history/archive/`, the active packet removed, and the page converted to `confirmed`. Routing recommendations now trigger only after the page is `confirmed`.

## v0.13 - 2026-06-10

- Required every confirmation manifest/checklist (UI Assumptions Manifest, Content Requirements Manifest, coverage checkpoint) to be delivered through a guaranteed-visible channel: AskUserQuestion option previews or turn-final message text, never mid-turn text in a turn that ends with a tool call. A confirmation question must never reference content the user has not been shown. Fixes the 2026-06-10 incident where the manifest was confirmed without ever rendering on screen.

## v0.12 - 2026-06-10

- Converted the hand-authored alignment-page section to the generator-owned stub plus a bundled `ALIGNMENT-PAGE.md`; the page contract now follows the full shared convention (lifecycle states, central alignment index, section feedback, gate/feedback YAML, TTS, browser open) with the ui-interview-specific gates from the generator gate map.

## v0.11 - 2026-06-06

- Prefer `specs/user-flow-*.md` as upstream flow-structure input for UI requirements and detailed UI specs.
- Route interfaces with missing screen/flow structure to `/user-flow-map` before requirements-only UI interview or layout variations.

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

## v0.3 - 2026-05-27

- Added an explicit local alignment preview gate before canonical UI spec writes and downstream routing.

## v0.2 - 2026-05-26

- Gate cross-pack routing recommendations with formal inline pack-availability conditionals instead of informal parenthetical pack mentions

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.4

- Archived previous skill contract.
