---
name: ux-variations
description: Interview and plan multiple UX and UI variations for a product, page, or flow, including onboarding, typical workflows, sharing, collaboration, return use, and interface alternatives users can compare before locking a direction — and concrete visual/layout UI variations (component choices, spatial arrangements, information density)
type: planning
version: v0.17
argument-hint: "[optional: app, page, flow, feature, or existing UI spec]"
visual_tier: prototype
---

# UX Variations

Invoke as `/ux-variations`.

Use this skill when the user wants to explore multiple UX/UI directions before committing to a final experience. This skill interrogates the full user journey: onboarding, first success, typical workflows, sharing and collaboration, return use, notifications, handoffs, failure recovery, and the interface patterns that support those moments. It then creates variation plans for flows, layouts, navigation models, interaction patterns, component choices, content density, visual tone, and behavior so the user can compare, test, and lock one direction.

In the normal AFPS product route, use `/user-flow-map` first to lock screen flow, decisions, branches, states, and low-fidelity wireframe notes, then use `/ui-interview --requirements-only` to lock the per-screen content/data/action contract, then run `/ux-variations --layout-mode`.

Use `/user-flow-map` first when the interface has no credible flow structure. Use `/ui-interview --requirements-only` first when the flow exists but the page content, actions, and states are not specified. Use this skill directly only when a user-flow map plus UI requirements, current implementation, screenshot, prototype, or clear feature scope already exists.

When invoked with `--layout-mode` (or when the user says "layout mode", "layout variations", or "UI variations"), this skill operates at the concrete component/layout level — it varies HOW the same content is presented visually, not WHAT the user flow is. Layout-mode takes a fixed flow contract from `specs/user-flow-[topic].md` plus a fixed content contract from `specs/ui-requirements-[topic].md` or equivalent and generates 2-5 concrete visual/spatial approaches: different container patterns, detail views, navigation styles, density levels, and responsive strategies. Each variation is specified well enough to build as a lightweight implementation, then evaluated through `/uat --variant-evaluation` (check `.agents/project.json.enabled_packs` for `product-testing` — if `product-testing` is not enabled, recommend `npx skillpacks install product-testing` from the project shell, first) before `/consolidate-variations`.

## Process

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as the product/app name, not the ICP, audience, or segment label.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived` or legacy `status: abandoned`, stop and warn that the path is archived; do not write or update scoped outputs there.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths` on read and write back `active_paths` on manifest updates. Treat legacy `abandoned` as `archived`; exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`, and any `scope_path` under `research/_archive/` from active target selection.
4. If active product paths exist in the manifest, use those paths. If multiple active paths exist, ask which one to target unless this skill explicitly supports cross-path output.
5. If no active manifest target exists, list non-archived product directories under `research/`, excluding `research/_archive/` and dot directories. Auto-select only when exactly one exists; ask when multiple exist.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint. Suggest creating a missing `research/{slug}/` product path when code clearly exposes an app, but do not require code or monorepo detection before using `research/{slug}/`.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`, and treat top-level `research/*.md` files as flat-mode documents or cross-path summaries.

1. **Resolve context**
   - Read `.agents/project.json` if it exists.
   - Read `README.md`, `AGENTS.md`, `CLAUDE.md`, relevant `docs/`, `specs/`, `research/`, task files, screenshots, route files, and component implementations when present.
   - Read `research/.progress.yaml` when present. Normalize `active_path` (singular legacy) to `active_paths` (plural list) when reading; treat legacy `abandoned` as `archived` and exclude archived/deferred/revisit/promoted paths plus `research/_archive/` scopes from active target selection. Use `active_paths` as the product/app focuses and treat deferred `product_paths[]` as parked product directions, not required UX variants.
   - Prefer existing `specs/user-flow-*.md` plus `specs/ui-requirements-*.md` as the normal AFPS layout-mode inputs.
   - Also read `specs/ui-*.md`, product specs, journey maps, ICP research, positioning research, and user feedback as source evidence.
   - If no credible flow structure exists, run or recommend `/user-flow-map` before developing variants.
   - If flow exists but no credible content/data/action contract exists, run or recommend `/ui-interview --requirements-only` before developing layout-mode variants.

2. **Define the decision surface**
   - Identify what the user is deciding: whole app experience, onboarding, activation, typical workflow, sharing flow, collaboration model, purchase flow, editor, dashboard, settings, mobile experience, page layout, or another bounded surface.
   - Identify which dimensions may vary: first-run onboarding, activation, core workflow sequencing, sharing, invitations, permissions, collaboration, return-use loops, notifications, reminders, status surfaces, user or device handoffs, failure recovery, information architecture, navigation, page layout, task flow order, component model, data density, visual hierarchy, motion, copy tone, and mobile behavior.
   - Identify fixed constraints: brand, stack, design system, must-keep components, accessibility, launch scope, performance, and business requirements.
   - **Layout-mode addition**: In layout-mode, read `specs/user-flow-[topic].md` as the fixed screen-flow contract and `specs/ui-requirements-[topic].md` as the fixed content contract. The WHAT and flow order are locked; only the HOW varies. Layout dimensions that can vary:
     - Container pattern: card grid, data table, list, kanban, timeline, tree, masonry
     - Detail pattern: sidebar panel, full-page route, modal, drawer, inline expand, popover
     - Navigation: top-nav, side-nav, tab-based, breadcrumb-driven, command-palette, hybrid
     - Density: compact, comfortable, spacious
     - Hierarchy: content-first, chrome-first, action-first
     - Responsive strategy: reflow, collapse, separate mobile layout, progressive disclosure

3. **Surface assumptions before probing**
   - Present a UX Variation Assumptions Manifest before deep questioning.
   - Tag assumptions with `[from spec]`, `[from codebase]`, `[from research]`, `[from artifact]`, or `[inferred]`.
   - Cover target users, usage context, first-run moment, activation event, "aha" threshold, typical repeat-use workflow, sharing and collaboration assumptions, permissions, return triggers, notifications, re-engagement assumptions, handoffs, pain points, locked versus open decisions, evaluation criteria, required variant breadth, prototype fidelity, implementation budget, success metrics, and selection method.
   - Use AskUserQuestion to ask the user to confirm, correct, or flag assumptions before proceeding.
   - Deliver every manifest/checklist/checkpoint the user must confirm inline as the final message text of its own turn; ask the confirmation question in the next turn. AskUserQuestion option previews may mirror the content as a supplement but are never the sole channel. Never emit it only as mid-turn text in a turn that ends with a tool call — harness rendering does not guarantee mid-turn text is shown. A confirmation question must never reference content the user has not been shown.

4. **Interview for variation goals**
   - Ask 1 to 3 focused questions per turn using AskUserQuestion.
   - Default to maximally contrasting archetypes. Do not ask how different variants should be — assume dramatic contrast unless the user explicitly requests graduated steps.
   - Default evaluation method is: build each variation, then run `/uat --variant-evaluation` (check `.agents/project.json.enabled_packs` for `product-testing` — if `product-testing` is not enabled, recommend `npx skillpacks install product-testing` from the project shell, first) so the user has task-based evidence before consolidation. Do not ask who will judge — assume solo evaluator building and gut-checking unless the user states otherwise.
   - When presenting a design decision with 3+ plausible answers during the interview, always include "Make this a variant axis (test all approaches)" as an option. When the user has already chosen "test all" for a prior question in the same session, default subsequent ambiguous decisions to variant axes without asking.
   - Establish what the variants must accomplish, how a new user arrives and reaches first value, what the normal repeat workflow looks like, what users create/save/share/export/invite others into, what roles or permission levels exist, what notifications or status updates users expect, how users resume work after time away, what happens when a workflow is abandoned or blocked, which current interface parts work, which parts feel wrong or uncertain, what would make a variant unacceptable, and what evidence will decide the winner.
   - When the user is unsure, recommend a practical default and explain why.
   - **Layout-mode interview additions**: When in layout-mode, also ask:
     - What is the primary user task on this page? (scan, search, create, compare, monitor, triage)
     - How much data will typically be visible? (5 items, 50 items, 500 items)
     - Are there reference apps or pages the user admires for this type of content?
     - Are any layout patterns explicitly off the table?
     - What is the build budget per variation? (quick prototype, medium fidelity, production-ready)
     - What must the user do in each built variant before they are ready to consolidate?

5. **Create distinct variation concepts**
   - Produce 5 variations by default. Present the concepts for adjustment — do not ask the user to choose a count first.
   - Each variation must be meaningfully different, not just a color or spacing change.
   - At this stage, keep each concept lightweight: name, thesis, archetype, best-fit user/context, core workflow difference, major tradeoff, and rough complexity. Do not fully specify screens, controls, or implementation details yet.
   - Useful archetypes include task-first workflow, data-dense operator console, guided step-by-step flow, onboarding-first activation path, collaboration-first workspace, sharing-first artifact flow, notification/status-driven workflow, role-based handoff workflow, visual canvas or board, command/search-first interface, mobile-first progressive disclosure, familiar SaaS dashboard, and editorial or showcase layout.
   - Only choose archetypes that fit the product and user context.
   - **Layout-mode archetypes** (use these instead of the UX-flow archetypes above when in layout-mode):
     - Card grid: visual items in a responsive grid, good for browsing and scanning
     - Data table: dense rows with sortable/filterable columns, good for operators and power users
     - List + detail panel: master list on left, detail sidebar on right, good for email/messaging patterns
     - Full-page detail: list view navigates to full-page item view, good for content-heavy items
     - Kanban / board: columns representing states or categories, good for workflow and status tracking
     - Timeline / feed: chronological stream, good for activity, logs, and social patterns
     - Dashboard mosaic: mixed widget grid with charts, lists, and stats, good for monitoring and overview
     - Split-pane workspace: resizable panels for parallel content, good for editors and comparison
     - Command-first minimal: search/command bar with minimal chrome, good for keyboard-heavy power users
     - Sidebar-driven: persistent sidebar navigation with content area, good for settings and multi-section apps

6. **Concept selection checkpoint**
   - Before fully specifying any variant, ask the user to adjust the concept set.
   - Use bounded wording such as: "How should I adjust these UX variants before writing the final spec?"
   - Present clear options:
     - Keep all concepts
     - Make one concept bolder or more extreme
     - Add another concept
   - Do not ask the user to remove or merge concepts before they have been built. Pre-build narrowing is consistently rejected.
   - Ask the user to name the affected concept and briefly describe the change when they choose anything other than keeping all concepts.
   - Recommend a practical default when evidence supports it; do not imply that variants have already been built or committed.
   - Revise the concept set based on the answer before moving on.

7. **Specify each approved variation enough to build**
   - For each variation, define name and thesis, target user fit, onboarding and activation model, typical workflow sequence, sharing and collaboration model, permissions model, return-use and notification model, failure recovery behavior, page and flow changes, navigation model, screen-by-screen layout, key components and controls, button and link behavior, spatial density, sizing, hierarchy, responsive behavior, visual tone, strengths, risks, failure modes, implementation complexity, prototype scope, and winning signal.
   - **Layout-mode variation spec additions**: In layout-mode, each variation spec must also include:
     - Content-to-component mapping: which content requirement maps to which UI component
     - Page regions with approximate proportions (e.g., sidebar 280px, content fluid, detail panel 400px)
     - Primary content component (the main way items are displayed)
     - Detail view pattern (how a single item's full details are accessed)
     - Action placement (where create, edit, delete, and bulk actions live)
     - Navigation pattern and placement
     - Responsive behavior at 3 breakpoints (mobile ≤640px, tablet ≤1024px, desktop >1024px)
     - Density approach (line-height, padding, font sizes, information per viewport)
     - States rendering (how empty, loading, error, and partial states appear in this layout)
     - Implementation file list (components, routes, layouts to create or modify)
     - Estimated build time (hours)
     - Variant evaluation task: the user task to perform in this variation before consolidation
     - Evidence to capture: screenshots, notes, time-to-complete, friction points, and acceptance/rejection signals

8. **Plan experimentation**
   - Recommend serial full buildout of all approved variants. Do not recommend building a subset first — the user's consistent preference is to build all variants before evaluating.
   - For prototype-stage product or feature work, prefer numerous small route-based experiments over one merged prototype when multiple workflows, layouts, densities, copy approaches, navigation models, or interaction patterns remain plausible. Name the route for each experiment, such as `/experiments/table-first`, `/experiments/command-first`, or the project's equivalent, and keep shared production infrastructure out of those routes unless explicitly approved.
   - If route experiments imply materially different products, apps, ICPs, or product lines, update `research/.progress.yaml` with experiment product-path entries instead of making every divergent path a required UX variation. Include `id`, `label`, `source_skill: ux-variations`, `scope_path`, `status`, `reason`, `archive_reason`, `archived_at`, `promoted_at`, `evidence_refs`, `revisit_trigger`, `next_skill`, `pipeline_stage: ux-variations`, and `last_touched`.
   - After variants are built, recommend `/uat --variant-evaluation` (check `.agents/project.json.enabled_packs` for `product-testing` — if `product-testing` is not enabled, recommend `npx skillpacks install product-testing` from the project shell, first) before `/consolidate-variations`. Consolidation is premature until evaluation evidence exists or the user explicitly says they reviewed the variants and is ready to converge.
   - Define comparison criteria before selecting a winner.
   - Include a lock-in checklist so the chosen direction becomes a decision record, not a vague preference.
   - Include a UAT handoff checklist: target task for each variant, success criteria, side-by-side comparison questions, evidence to capture, tradeoffs to notice, and readiness criteria for `/consolidate-variations`.

9. **Coverage checkpoint**
   - Before concluding, summarize the variants, decision criteria, and experiment plan inline as the final message text of its own turn.
   - In the next turn, use AskUserQuestion to ask whether any decision criteria, risks, validation steps, or implementation constraints are missing before writing deliverables.

## Deliverables

- Write the variation plan to `specs/ux-variations-[topic].md`.
- Write the interview log to `ux-variations-[topic]-interview.md`.
- Update `research/.progress.yaml` only when variant or route experiments create materially different product paths; downstream research remains active-path-only until a path is activated.

### Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/ux-variations-{topic}.html`.

## Constraints

- Do not present superficial variants that differ only by color palette, typography, or decorative treatment.
- Do not choose a winner for the user unless the evidence clearly supports it and the user asked for a recommendation.
- Do not defer all decisions to testing. State a recommended variant or experiment when evidence is sufficient.
- Do not ignore implementation cost. A compelling variation still needs a prototype path and selection criteria.
- Do not route directly from built UI variants to `/consolidate-variations`; insert `/uat --variant-evaluation` (check `.agents/project.json.enabled_packs` for `product-testing` — if `product-testing` is not enabled, recommend `npx skillpacks install product-testing` from the project shell, first) unless the user explicitly confirms they have already evaluated the variants.
- When recommending a skill from another pack, verify the pack is installed via `.agents/project.json` `enabled_packs`. If not installed, recommend `npx skillpacks install <pack-name>` from the project shell, before the target skill.
- Do not enforce shared design constraints across variations. Each variation independently decides layout, density, color, navigation, and component choices. Only technical stack (framework, renderer, design system tokens) is shared unless the user explicitly locks a shared constraint.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
