# user-flow-map changelog (codex)

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
