# Changelog

## v0.33 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/ui-interview-{topic}.html` is now the primary review surface and compiled YAML routes back to `$ui-interview`.

## v0.32 - 2026-07-04

- Updated the direct-build guard to name `$logic-wiring` instead of the archived `$prototype` alias.

## v0.31 - 2026-07-04

- Updated inspiration inputs for the hard rename: read approved `design/**/brainstorm-inspirations-{topic}.md` and `design/**/take-inspiration-{topic}-*.md` artifacts instead of the retired active `design-inspirations` skill.

## v0.30 - 2026-07-03

- Required UI review gates with wording around missing coverage, rejected branches, retry, or revision to use explicit `data-approval-effect` metadata for every radio option.
- Added an all-approve compile-path verification before handoff so approving labels such as `No decision-critical coverage is missing.` cannot be misclassified by substring or regex checks.

## v0.29 - 2026-06-27

- Narrowed `ui-interview` to human-visible UI candidates while consuming upstream `user-flow-map` surfaces and channels as context.
- Clarified that MCP/CLI/API/SDK channel splits belong to `user-flow-map`/`state-model`/`logic-wiring` unless a non-visual surface needs a diagnostics, recovery, history, or audit UI.
- Updated upstream prerequisite and context wording from screen/route inventory to surface inventory, channels, visual UI candidates, branches, states, and failure paths.

## v0.28 - 2026-06-26

- Flow-walk re-cut: routing of approved clickable route experiments now targets `$build-ui-screens` (then `$logic-wiring`) instead of the renamed `$create-ui-experiment`.
- The branch packet now additionally authors a per-screen batch plan (one batch per flow step) that `build-ui-screens` walks. Role unchanged — `ui-interview` is not an orchestrator and still does not build.

## v0.27 - 2026-06-23

- Bumped the contract after archiving v0.26.
- Replaced the stale first-UX-variation selector with deterministic UX variation resolution: explicit user override, `evaluation_priority`, first-value/activation fit, status, then stable array order.

## v0.26 - 2026-06-23

- Replaced active flow-tree child-state language from `ui_reviews[]` to `ui_experiments[]`.
- Made default full UI mode explicitly non-buildout: it stops at UI requirements, branch packet, static or bounded HTML mockup, and branch decision.
- Routed approved clickable route experiment needs to `$create-ui-experiment [approved-ui-experiment]` instead of default prototype buildout from `ui-interview`.

## v0.25 - 2026-06-21

- Reframed the body to the unified 5-stage design-tree flow (`interrogation -> research -> design -> plan -> implement(scoped)`) from `DESIGN-TREE-LOOP.md`: added the `## Design-Tree Flow` stage map, the per-branch iteration contract, and modify-back handling, plus explicit `## Next Work` / `## Invoke With YAML` self-routing handoff sections.
- Stage 1 (Research) now references the `design-inspirations` sub-skill.
- Joined the stage-zero interrogation set (`## Interrogation Page` / `INTERROGATION-PAGE.md`).

## v0.24 - 2026-06-18

- Chunked setup-session and spec-session STOPs now emit the **Terminal handoff format** from `docs/prototype-session-loop-convention.md`: the intermediate just written, the next missing page named in **plain English** (never only the internal `{page-id}`), and the **exact** resolved next command (e.g. `$ui-interview alignment-page-review`). When the last page was written, the handoff routes to the assemble+approve session. Fixes chunked stops that ended with only a bare internal unit ID.

## v0.23 - 2026-06-14

- Added intra-skill substep chunking for large branches: in full UI mode, when the page count is N ≥ 4 (and `--no-chunk` is not passed), `ui-interview` splits into a setup session (steps 1–5, writes a pure-context shared brief and stops, keeping the HTML visual mockup whole), one spec session per page (step 6, authors a single `{page-id}.md` intermediate), and a final assemble+approve session (steps 7–9 + deliverables + the one alignment page).
- Cursor is intermediate-file existence (the brief carries no step list) — no `design/flow-tree.schema.json` change and no `tasks/todo.md` use; the brief and per-page intermediates are archived at canonical write. Exactly one binding alignment-page gate per branch (unchanged). Requirements-only mode never chunks; for N < 4 or `--no-chunk`, behavior is unchanged from v0.22.
- Added `--no-chunk` to `argument-hint`. Follows the Intra-Skill Substep Chunking + Shared Context Brief section in `docs/prototype-session-loop-convention.md`.
- Added a soft read-if-exists `design/**/design-inspirations-{topic}.md` input (from `$design-inspirations`): step 1 reads it as the pre-gathered "apps you admire" / reference-pattern input, and the step-7 inspiration line notes it supplies that input when present, without reversing the local-evidence stance. Absent → behavior unchanged.

## v0.22 - 2026-06-14

- Cited `docs/prototype-session-loop-convention.md` as the prototype-phase contract.
- Clarified that UI review decisions enter the flow-tree only after the skill's approval lifecycle allows canonical writes, and that checkpoint confirmations are not final approval.

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
