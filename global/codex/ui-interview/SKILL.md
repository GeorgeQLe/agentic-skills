---
name: ui-interview
description: Interview page by page to define a complete UI specification, including layout, hierarchy, controls, links, spacing, sizing, responsive behavior, visual states, and implementation-ready interface details
type: planning
version: 1.0.0
argument-hint: "[optional: app, page, flow, feature, or draft UI]"
---

# UI Interview

Invoke as `$ui-interview`.

Use this skill when the user needs to turn a rough product idea, feature, page, wireframe, screenshot, or existing app surface into a detailed implementation-ready UI specification. This skill focuses on the interface itself: pages, regions, components, buttons, links, labels, spacing, element size, visual hierarchy, state, responsive layout, and accessibility.

Use `$ux-variation` after this skill when the user wants multiple experience concepts or interface variants to compare before locking the final direction.

## Workflow

1. **Resolve context**
   - Read `.agents/project.json` if it exists.
   - Read `README.md`, `AGENTS.md`, `CLAUDE.md`, relevant `docs/`, `specs/`, `research/`, route files, component directories, screenshots, and design artifacts when present.
   - If the request is for an existing UI, inspect the current implementation before interviewing.
   - If multiple apps or surfaces are plausible, ask the user which app, flow, or page to cover first.

2. **Treat inputs as draft material**
   - Do not assume the current UI, prompt, screenshot, or mockup is final.
   - Preserve explicit constraints, but challenge unclear defaults before they become implementation decisions.
   - Distinguish product behavior decisions from UI presentation decisions.

3. **Surface assumptions before probing**
   - Present a UI Assumptions Manifest before deep questioning.
   - Tag each assumption with:
     - `[from spec]` - explicitly stated in a spec, prompt, or issue
     - `[from codebase]` - derived from existing routes, components, styles, or assets
     - `[from research]` - derived from ICP, audience, journey, feedback, or product research
     - `[from artifact]` - derived from screenshot, mockup, image, Figma export, or wireframe
     - `[inferred]` - filled in by judgment
   - Cover at least:
     - Product and user context
     - Pages, routes, and entry points
     - Primary tasks per page
     - Navigation model
     - Information hierarchy
     - Layout grid and spatial density
     - Component inventory
     - Button and link semantics
     - Form fields, validation, and error display
     - Empty, loading, disabled, success, warning, and failure states
     - Responsive breakpoints and mobile behavior
     - Accessibility requirements
     - Visual language, typography, color, iconography, and asset usage
     - Implementation constraints from the existing stack or design system
   - Ask the user to confirm, correct, or flag assumptions before continuing.

4. **Interview page by page**
   - Ask 1 to 3 focused questions per turn.
   - Move through the interface in this order unless the user asks otherwise:
     - Global shell: header, sidebar, footer, navigation, account controls, notifications
     - Page inventory: every route, modal, drawer, overlay, and important empty state
     - Page purpose: user goal, task priority, and success condition
     - Layout anatomy: top-to-bottom and left-to-right regions, alignment, density, scroll behavior
     - Component inventory: tables, lists, cards, forms, charts, media, editors, maps, canvases
     - Controls: every button, icon button, segmented control, checkbox, radio, toggle, input, menu, tab, link, and destructive action
     - Copy: headings, labels, helper text, validation text, confirmation text, empty-state text
     - States: default, hover, focus, active, selected, disabled, loading, error, success, partial, offline
     - Spatial details: element prominence, approximate sizes, gaps, padding, fixed or fluid dimensions, sticky regions, overlap rules, max widths
     - Responsive behavior: desktop, tablet, mobile, wide desktop, touch target sizing, collapsed controls
     - Accessibility: keyboard order, focus traps, labels, contrast, reduced motion, screen reader names
   - When a page includes repeated items, define one canonical item and its variations rather than asking about every row individually.

5. **Research and recommend by default**
   - Use project evidence and established UI conventions before asking the user to invent details.
   - For material decisions, present options, a recommendation, rationale, tradeoffs, and mitigation.
   - Recommend familiar controls over novel patterns unless the product has a strong reason to deviate.
   - For frontend work, respect the existing design system, component library, and implementation patterns.

6. **Coverage checkpoint**
   - Before concluding, present a concise checklist of pages, components, controls, states, responsive behavior, and unresolved risks.
   - Ask whether anything is missing or should be revisited before writing deliverables.

## Deliverables

- Write the completed UI specification to `specs/ui-[topic].md`.
- Write the interview log to `ui-[topic]-interview.md`.

The UI specification must include:

- Scope and source evidence
- UI Assumptions Manifest with confirmations and corrections
- Page inventory and route map
- Global shell and navigation rules
- Detailed page-by-page anatomy
- Component inventory and reuse guidance
- Control inventory with labels, destinations, actions, disabled rules, and confirmation behavior
- Link inventory with destinations and external/internal classification
- Layout, spacing, sizing, and responsive rules
- Visual style direction and asset requirements
- Interaction states and accessibility requirements
- Implementation notes tied to the existing stack
- Open questions, risks, and explicit non-goals

The interview log must include:

- The manifest as presented
- Every question asked
- Options and recommendations presented
- User responses and final decisions
- Notable changes from the initial draft, current implementation, or artifact

After writing files, recommend `$ux-variation` if variants are needed before implementation, or `$roadmap` if the interface is ready to sequence into work.

## Constraints

- Do not skip small interface elements. Buttons, links, icons, menus, and empty states are part of the spec.
- Do not collapse UI detail into generic phrases such as "standard dashboard layout" or "normal form behavior."
- Do not create high-fidelity implementation plans until the page anatomy and control behavior are decision-complete.
- Do not treat visual polish as separate from implementation. Size, spacing, hierarchy, and responsive behavior must be specified well enough for a developer to build.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
