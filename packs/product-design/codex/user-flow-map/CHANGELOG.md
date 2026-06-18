# user-flow-map changelog (codex)

## v1.1 - 2026-06-18

- Chunked spec-session and setup-session STOPs now emit the **Terminal handoff format** from `docs/prototype-session-loop-convention.md`: the intermediate just written, the next missing section named in **plain English** (never only the internal `{section-id}` — e.g. "action–state matrices: the per-screen actions/navigation/validation/state matrix"), and the **exact** resolved next command with `{slug}`/`{topic}` filled in (e.g. `$user-flow-map alignment-page-review`). When the last section was written, the handoff routes to the assemble+approve session instead of another spec session. Fixes the regression where a chunked stop ended with only a bare internal unit ID the user could not act on.

## v1.0 - 2026-06-18

- Made the downstream handoff fresh-session aware. When the approval YAML is consumed in an already-fresh session (the page-building conversation is no longer in context — e.g. the user cleared context and pasted the compiled YAML to start the session), there is no build context to shed, so the skill no longer prompts another context clear; it defaults to continue-now, invoking `$ux-variations [specific-user-flow]` and immediately entering its first required gate. The stop/clear-context-vs-continue-now choice is now offered only when consuming in the same session that built the page.
- Reframed the constraint accordingly: continue-now means invoking the next skill and immediately entering its own interaction gates under user control, not running it unattended — the no-auto-run intent is preserved either way.

## v0.9 - 2026-06-14

- Added intra-skill substep chunking for large flows: when the flow is large (screen/route inventory ≥ ~6 screens, and `--no-chunk` is not passed), `user-flow-map` splits into a setup session (steps 1–2 + step-3 sub-steps 1–5, writes a pure-context shared brief and stops), one spec session per step-3 heavy section (in order: `screen-inventory` → `action-state-matrices` → `failure-recovery` → `handoffs`, each authoring a single `{section-id}.md` intermediate), and a final assemble+approve session (step 4 + deliverables + the one alignment page).
- Cursor is intermediate-file existence (the brief carries no step list) — no `design/flow-tree.schema.json` change and no `tasks/todo.md` use; the brief and per-section intermediates are archived at canonical write. Exactly one alignment gate for the whole flow. The per-flow stop/continue handoff and prototype-build-plan synthesis mode are unchanged; synthesis mode never chunks. For small flows or `--no-chunk`, behavior is unchanged from v0.8.
- Added `--no-chunk` to `argument-hint`. Follows the Intra-Skill Substep Chunking + Shared Context Brief section in `docs/prototype-session-loop-convention.md`.

## v0.8 - 2026-06-14

- Cited `docs/prototype-session-loop-convention.md` as the prototype-phase contract.
- Clarified that flow-tree branch state and prototype build-plan synthesis are not tracked through `tasks/todo.md`.

## v0.7 - 2026-06-13

- Added prototype-build-plan synthesis mode that reads approved flow-tree branch decisions and writes `design/prototype-build-plan-[topic].md` as the todo ledger for `$prototype`.
- Extended flow-tree manifest guidance with `prototype_build_plan` item tracking for pending, built, needs-revision, deferred, and dropped prototype branches.

## v0.6 - 2026-06-13

- Moved pre-prototype flow-map deliverables from `specs/` to `design/` and added scoped `design/**/flow-tree-*.yaml` initialization.
- Added the `design/flow-tree.schema.json` manifest contract for user-flow, UX-variation, UI review, and branch-decision state.
- Clarified that `research/.progress.yaml` remains product-path/product-line tracking, not UX branch state.

## v0.5 - 2026-06-12

- Reframed `user-flow-map` as the root of a wireframe tree whose named user flows fan out into `$ux-variations [specific-user-flow]`.
- Replaced the default requirements-only UI handoff with a UX-variation handoff and clarified that flow-map approval does not approve UX branches, UI mockups, or implementation paths.

## v0.4 - 2026-06-12

- Replaced the single downstream command recommendation with an explicit stop/clear-context versus continue-now handoff choice for `$ui-interview --requirements-only`.
- Clarified that continuing immediately still requires `ui-interview` to run its own UI Assumptions Manifest and Content Requirements Manifest gates.

## v0.3 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.2 - 2026-06-11

- Added npm-aware install-route wording for product-design pack availability while preserving Codex `$pack install ...` routes.

## v0.1 - 2026-06-10

- Flow Assumptions Checkpoint and Flow Coverage Checkpoint now render inline as the final message text of their own turn, with the confirmation question asked in the following turn, never only as mid-turn text before a tool or command call. Applies the Manifest Visibility Rule in docs/interview-convention.md.

## v0.0 - 2026-06-06

- Initial product-design planning skill for mapping positioned product goals into screen flows, decisions, branches, states, failure/recovery paths, handoffs, and low-fidelity wireframe notes before UI requirements, layout variants, and prototypes.
