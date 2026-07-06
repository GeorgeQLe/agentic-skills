# Changelog

## v0.5 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/brainstorm-inspirations-{topic}.html` is now the primary review surface and compiled YAML routes back to `/brainstorm-inspirations`.

## v0.4 - 2026-07-04

- Hard-renamed active `design-inspirations` to `brainstorm-inspirations` and reframed the behavior from a single feeder brief to a survey-and-compare inspiration board for current design-tree flows, surfaces, UX branches, UI direction, visual language, and product class.
- Changed canonical output to `design/brainstorm-inspirations-{topic}.md` and alignment output to `alignment/brainstorm-inspirations-{topic}.html`; approved artifacts are referenced through flow-tree `source_artifacts[]` without adding schema fields or route positions.

## v0.3 - 2026-06-21

- Reframed to the unified design-tree loop (`DESIGN-TREE-LOOP.md`) as a sub-skill: marked `invocation: sub-skill` with `parent: ui-interview`; added the `## Design-Tree Role` note (enters at its research stage, parent-owned handoff) and regenerated its alignment bundle for the sub-skill translation.

## v0.2 - 2026-06-18

- Conformed to the staged-research lifecycle contract: Stage 1 now uses the canonical "rank candidates" literal, and a full `## Product-Path Scope Resolution` section was added (research/{slug} resolution, archived/abandoned/deferred exclusion, flat-mode fallback, monorepo-as-secondary-hint) so the skill satisfies the research-approval-gate and product-path-manifest contracts.

## v0.1 - 2026-06-15

- Added explicit `business-research` availability wording around the `customer-discovery` reference so cross-pack routing remains guarded.

## v0.0 - 2026-06-14

- Initial version. Single-pass web-research feeder for prototype-phase design work: gathers named UI/UX patterns, layout/interaction conventions, component-library references, competitor/comparable UX notes, and annotated reference links into a durable cited brief (`design/design-inspirations-{topic}.md`) plus a search log, behind the staged scope → working packet → `review` alignment page → approved canonical write lifecycle.
- The one home for web-driven inspiration in the product-design pack; read as a soft, read-if-exists input by `/ui-interview` and `/ux-variations`. Honest scope limit stated: named patterns, conventions, and links — not a rendered pixel-level moodboard. Minimum 6 WebSearch queries with a logged search trail. Referenced from the flow-tree manifest `source_artifacts[]` (no schema change).
