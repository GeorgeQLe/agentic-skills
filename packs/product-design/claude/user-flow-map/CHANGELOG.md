# user-flow-map changelog (claude)

## v0.5 - 2026-06-12

- Reframed `user-flow-map` as the root of a wireframe tree whose named user flows fan out into `/ux-variations [specific-user-flow]`.
- Replaced the default requirements-only UI handoff with a UX-variation handoff and clarified that flow-map approval does not approve UX branches, UI mockups, or implementation paths.

## v0.4 - 2026-06-12

- Replaced the single downstream command recommendation with an explicit stop/clear-context versus continue-now handoff choice for `/ui-interview --requirements-only`.
- Clarified that continuing immediately still requires `ui-interview` to run its own UI Assumptions Manifest and Content Requirements Manifest gates.

## v0.3 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.2 - 2026-06-11

- Added npm-aware install-route wording for product-design pack availability while preserving Claude `/pack install ...` routes.

## v0.1 - 2026-06-10

- Flow Assumptions Checkpoint and Flow Coverage Checkpoint now render inline as the final message text of their own turn, with the confirmation question asked in the following turn; AskUserQuestion option previews are a supplementary mirror only, never the sole channel. Applies the Manifest Visibility Rule in docs/interview-convention.md.

## v0.0 - 2026-06-06

- Initial product-design planning skill for mapping positioned product goals into screen flows, decisions, branches, states, failure/recovery paths, handoffs, and low-fidelity wireframe notes before UI requirements, layout variants, and prototypes.
