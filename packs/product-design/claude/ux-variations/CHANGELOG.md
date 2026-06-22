# Changelog

## v0.26 - 2026-06-22

- Updated downstream design-tree route references to use `/consolidate-prototypes` as the primary post-UAT consolidation skill.

## v0.25 - 2026-06-22

- Enforced HTML-first canonical writes: chunked assembly now produces proposed whole-set review content for `alignment/ux-variations-{topic}.html` before any final variation plan, interview log, or flow-tree update.
- Moved final variation plan, interview log, `ux_variations[]` status/artifact updates, and archive cleanup into the approval-gated path.

## v0.24 - 2026-06-22

- Added the required chunked Progress Handoff Block for setup, per-variation, and assemble-ready stops so repeated `/ux-variations` invocations visibly explain completed variation count, durable cursor, current phase, next phase, fresh-session guidance, and the exact command.

## v0.23 - 2026-06-21

- Reframed the body to the unified 5-stage design-tree flow (`interrogation -> research -> design -> plan -> implement(scoped)`) from `DESIGN-TREE-LOOP.md`: added the `## Design-Tree Flow` stage map, the per-branch iteration contract, and modify-back handling, plus explicit `## Next Work` / `## Invoke With YAML` self-routing handoff sections.
- Added `context_intake: scoped`.
- Joined the stage-zero interrogation set (`## Interrogation Page` / `INTERROGATION-PAGE.md`).

## v0.22 - 2026-06-18

- Chunked setup-session and spec-session STOPs now emit the **Terminal handoff format** from `docs/prototype-session-loop-convention.md`: the intermediate just written, the next missing variation named in **plain English** by its concept thesis (never only the internal `{variation-id}`), and the **exact** resolved next command (e.g. `/ux-variations alignment-page-review`). When the last variation was written, the handoff routes to the assemble+approve session. Fixes chunked stops that ended with only a bare internal unit ID.

## v0.21 - 2026-06-14

- Added intra-skill substep chunking: when the approved concept count is N ≥ 4 (and `--no-chunk` is not passed), `ux-variations` splits into a setup session (steps 0–6, writes a pure-context shared brief and stops), one spec session per variation (step 7, authors a single `{variation-id}.md` intermediate), and a final assemble+approve session (steps 8–9 + deliverables + the one alignment page).
- Cursor is intermediate-file existence (the brief carries no step list) — no `design/flow-tree.schema.json` change and no `tasks/todo.md` use; the brief and per-variation intermediates are archived at canonical write.
- Exactly one binding alignment-page gate at the end (whole-set comparison preserved); brief = pure context. For N < 4 or `--no-chunk`, behavior is unchanged from v0.20.
- Added `--no-chunk` to `argument-hint`. Follows the new Intra-Skill Substep Chunking + Shared Context Brief section in `docs/prototype-session-loop-convention.md`.

## v0.20 - 2026-06-14

- Cited `docs/prototype-session-loop-convention.md` as the prototype-phase contract.
- Clarified that UX progression/layout branch state stays in the flow-tree manifest and human variant review stays out of `tasks/todo.md`.

## v0.19 - 2026-06-13

- Moved pre-prototype UX variation plans and interview logs from `specs/` to `design/`.
- Updated default and layout-mode inputs to read `design/user-flow-*`, `design/ui-requirements-*`, and scoped flow-tree manifests.
- Required ordinary UX branch status to live in the design flow-tree manifest, with `research/.progress.yaml` reserved for materially different product paths.

## v0.18 - 2026-06-12

- Reframed default `ux-variations` work as expanding one selected user flow into alternate progression branches before UI proposal work.
- Preserved `--layout-mode` as an explicit bounded mode for fixed flow/content contracts, while routing default progression branches to `/ui-interview [specific-ux-variation]`.
- Added branch-routing deliverable guidance covering parent flow, sibling flow/variation dependencies, and next UI-interview branch.

## v0.17 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.16 - 2026-06-11

- Added npm-aware install-route wording for product-testing and cross-pack recommendations while preserving Claude `/pack install ...` routes.

## v0.15 - 2026-06-10

- Added the inline manifest visibility rule to the assumptions manifest step: every confirmation manifest/checklist/checkpoint renders as the final message text of its own turn with the confirmation question in the next turn; AskUserQuestion option previews are a supplementary mirror only, never the sole channel.
- Coverage checkpoint split across two turns: the variants/criteria/experiment-plan summary is delivered as turn-final text, with the confirmation question asked in the following turn. Applies the Manifest Visibility Rule in docs/interview-convention.md.

## v0.14 - 2026-06-10

- Converted the hand-authored alignment-page section to the generator-owned stub plus a bundled `ALIGNMENT-PAGE.md`; the page contract now follows the full shared convention (lifecycle states, central alignment index, section feedback, gate/feedback YAML, TTS, browser open) with the ux-variations-specific gates from the generator gate map.

## v0.13 - 2026-06-06

- Clarified the normal AFPS route as `/user-flow-map` then `/ui-interview --requirements-only` before `/ux-variations --layout-mode`.
- Prefer `specs/user-flow-*.md` plus `specs/ui-requirements-*.md` as layout-mode inputs, and route missing flow structure to `/user-flow-map`.

## v0.12 - 2026-06-05

- Changed alignment-page section feedback so the positive option is `emphasize` with `feedback: emphasize` and `requested_agent_action: add-weight-to-section`, making it a revision/weighting request instead of approval as-is.

## v0.11 - 2026-06-04

- Restored version parity with the Codex mirror after verifying the solo-evaluator default is present in the Claude contract.

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

## v0.6 - 2026-05-30

- Added product-path scope resolution that prefers non-archived `research/{slug}/` paths and active manifest paths before code or monorepo hints.
- Excluded `research/_archive/`, legacy `abandoned`, `archived`, `deferred`, `revisit_candidate`, and `promoted` paths from active target selection while preserving flat `research/*.md` compatibility.

## v0.5 - 2026-05-27

- Handle plural `active_paths` manifest field with backward compatibility for singular `active_path`

## v0.4 - 2026-05-27

- Added product-path manifest handling for UX route experiments that imply materially different products, apps, ICPs, or product lines while keeping ordinary variants on the active path.

## v0.0

- Archived previous skill contract.

## v0.3 - 2026-05-27

- Added an explicit local alignment preview gate before canonical variation plan writes and downstream routing.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.2 - 2026-05-26

- Gate cross-pack routing recommendations on pack availability — recommend `/pack install <pack>` when the target pack is not enabled
