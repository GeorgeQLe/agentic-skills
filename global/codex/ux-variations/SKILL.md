---
name: ux-variations
description: Interview and plan multiple UX and UI variations for a product, page, or flow, including onboarding, typical workflows, sharing, collaboration, return use, and interface alternatives users can compare before locking a direction — and concrete visual/layout UI variations with UAT before consolidation
type: planning
version: 1.0.0
argument-hint: "[optional: app, page, flow, feature, or existing UI spec]"
---

# UX Variations

Invoke as `$ux-variations`.

Use this skill when the user wants to explore multiple UX/UI directions before committing to a final experience. This skill interrogates the full user journey: onboarding, first success, typical workflows, sharing and collaboration, return use, notifications, handoffs, failure recovery, and the interface patterns that support those moments. It then creates variation plans for flows, layouts, navigation models, interaction patterns, component choices, content density, visual tone, and behavior so the user can compare, test, and lock one direction.

Use `$ui-interview` first when the interface has not yet been specified page by page. Use this skill directly when a UI spec, current implementation, screenshot, prototype, or clear feature scope already exists.

When invoked with `--layout-mode` (or when the user says "layout mode", "layout variations", or "UI variations"), this skill operates at the concrete component/layout level — it varies HOW the same content is presented visually, not WHAT the user flow is. Layout-mode takes a fixed content contract from `specs/ui-requirements-[topic].md` or equivalent and generates 2-5 concrete visual/spatial approaches. Each variation must be specified well enough to build as a lightweight implementation, then evaluated through `$uat --variant-evaluation` before `$consolidate-variations`.

## Workflow

1. **Resolve context**
   - Read `.agents/project.json` if it exists.
   - Read `README.md`, `AGENTS.md`, `CLAUDE.md`, relevant `docs/`, `specs/`, `research/`, task files, screenshots, route files, and component implementations when present.
   - Prefer existing `specs/ui-*.md`, product specs, journey maps, ICP research, and user feedback as source evidence.
   - If no credible scope exists, run or recommend `$ui-interview` before developing variants.

2. **Define the decision surface**
   - Identify what the user is deciding: whole app experience, onboarding, activation, typical workflow, sharing flow, collaboration model, purchase flow, editor, dashboard, settings, mobile experience, page layout, or another bounded surface.
   - Identify which dimensions are allowed to vary:
     - First-run onboarding and activation
     - Core workflow sequencing
     - Sharing, invitations, permissions, and collaboration
     - Return-use loops and re-entry points
     - Notifications, reminders, and status surfaces
     - Handoffs between users, roles, devices, or channels
     - Recovery from errors, empty states, and stalled progress
     - Information architecture
     - Navigation
     - Page layout
     - Task flow order
     - Component model
     - Data density
     - Visual hierarchy
     - Motion and transition behavior
     - Copy tone
     - Mobile behavior
   - Identify fixed constraints: brand, stack, design system, must-keep components, accessibility, launch scope, performance, and business requirements.
   - **Layout-mode addition**: In layout-mode, read `specs/ui-requirements-[topic].md` as the fixed content contract. The WHAT is locked; only the HOW varies. Layout dimensions that can vary:
     - Container pattern: card grid, data table, list, kanban, timeline, tree, masonry
     - Detail pattern: sidebar panel, full-page route, modal, drawer, inline expand, popover
     - Navigation: top-nav, side-nav, tab-based, breadcrumb-driven, command-palette, hybrid
     - Density: compact, comfortable, spacious
     - Hierarchy: content-first, chrome-first, action-first
     - Responsive strategy: reflow, collapse, separate mobile layout, progressive disclosure

3. **Surface assumptions before probing**
   - Present a UX Variation Assumptions Manifest before deep questioning.
   - Tag assumptions with `[from spec]`, `[from codebase]`, `[from research]`, `[from artifact]`, or `[inferred]`.
   - Cover:
     - Target users and usage context
     - Primary job or workflow
     - First-run moment, activation event, and "aha" threshold
     - Typical repeat-use workflow
     - Sharing, collaboration, and permission assumptions
     - Return triggers, notifications, and re-engagement assumptions
     - Cross-device, cross-role, or external handoff assumptions
     - Existing pain points or uncertainty
     - Decisions that are locked versus open
     - Evaluation criteria
     - Required variants and desired breadth
     - Prototype fidelity and implementation budget
     - Success metrics and selection method
   - Ask the user to confirm, correct, or flag assumptions before proceeding.

4. **Interview for variation goals**
   - Codex interview cadence is one primary decision question per turn by default. Use short follow-up bullets only when they clarify the same variation decision, not to batch unrelated questions.
   - Default to maximally contrasting archetypes. Do not ask how different variants should be — assume dramatic contrast unless the user explicitly requests graduated steps.
   - Default evaluation method is: build each variation, then run `$uat --variant-evaluation` so the user has task-based evidence before consolidation.
   - When presenting a design decision with 3+ plausible answers during the interview, always include "Make this a variant axis (test all approaches)" as an option. When the user has already chosen "test all" for a prior question in the same session, default subsequent ambiguous decisions to variant axes without asking.
   - Establish:
     - Who will judge the variants
     - What they must be able to accomplish
     - How a new user arrives, signs up, understands the product, and reaches first value
     - What the normal repeat workflow looks like after onboarding
     - What users create, save, share, export, invite others into, or hand off
     - What roles or permission levels exist, and how collaboration should feel
     - What notifications, reminders, status updates, or activity feeds users expect
     - How users resume work after hours, days, or weeks away
     - What happens when a workflow is abandoned, blocked, invalid, offline, or partially complete
     - Which current interface parts are working
     - Which current interface parts feel wrong, uncertain, slow, confusing, too dense, too sparse, or too generic
     - What would make a variant unacceptable
     - What evidence will decide the winner
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
   - Useful archetypes include:
     - Task-first workflow
     - Data-dense operator console
     - Guided step-by-step flow
     - Onboarding-first activation path
     - Collaboration-first workspace
     - Sharing-first artifact flow
     - Notification/status-driven workflow
     - Role-based handoff workflow
     - Visual canvas or board
     - Command/search-first interface
     - Mobile-first progressive disclosure
     - Familiar SaaS dashboard
     - Editorial or showcase layout
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
   - For each variation, define:
     - Name and design thesis
     - Target user fit
     - Page and flow changes
     - Onboarding and activation model
     - Typical workflow sequence
     - Sharing, collaboration, and permissions model
     - Return-use and notification model
     - Failure recovery and abandoned-workflow behavior
     - Navigation model
     - Screen-by-screen layout
     - Key components and controls
     - Button and link behavior
     - Spatial density, sizing, and hierarchy
     - Responsive behavior
     - Visual tone
     - Strengths, risks, and failure modes
     - Implementation complexity
     - What to prototype first
     - What user signal would make this the winner
   - **Layout-mode variation spec additions**: In layout-mode, each variation spec must also include:
     - Content-to-component mapping: which content requirement maps to which UI component
     - Page regions with approximate proportions (e.g., sidebar 280px, content fluid, detail panel 400px)
     - Primary content component
     - Detail view pattern
     - Action placement
     - Navigation pattern and placement
     - Responsive behavior at 3 breakpoints (mobile <=640px, tablet <=1024px, desktop >1024px)
     - Density approach
     - States rendering
     - Implementation file list
     - Estimated build time
     - Variant evaluation task: the user task to perform in this variation before consolidation
     - Evidence to capture: screenshots, notes, time-to-complete, friction points, and acceptance/rejection signals

8. **Plan experimentation**
   - Recommend serial full buildout of all approved variants when the user is using layout-mode or explicitly wants to compare built interfaces. Do not recommend building a subset first unless the user asks for a smaller experiment.
   - For prototype-stage product or feature work, prefer numerous small route-based experiments over one merged prototype when multiple workflows, layouts, densities, copy approaches, navigation models, or interaction patterns remain plausible. Name the route for each experiment, such as `/experiments/table-first`, `/experiments/command-first`, or the project's equivalent, and keep shared production infrastructure out of those routes unless explicitly approved.
   - After variants are built, recommend `$uat --variant-evaluation` before `$consolidate-variations`. Consolidation is premature until evaluation evidence exists or the user explicitly says they reviewed the variants and is ready to converge.
   - Define the cheapest useful validation method:
     - Static mockups for visual direction
     - Clickable prototype for navigation and flow
     - Feature-flagged implementation for real usage
     - A/B test only when traffic and metrics are credible
     - Human UAT when target-user acceptance is the question
   - Define comparison criteria before selecting a winner.
   - Include a lock-in checklist so the chosen direction becomes a decision record, not a vague preference.
   - Include a UAT handoff checklist:
     - Target task for each variant
     - Success criteria and non-acceptance signals
     - Side-by-side comparison questions
     - Evidence to capture
     - Tradeoffs to notice
     - Readiness criteria for `$consolidate-variations`

9. **Coverage checkpoint**
   - Before concluding, summarize the variants, the decision criteria, and the proposed experiment plan.
   - Ask whether any decision criteria, risks, validation steps, or implementation constraints are missing before writing deliverables.

## Deliverables

- Write the variation plan to `specs/ux-variations-[topic].md`.
- Write the interview log to `ux-variations-[topic]-interview.md`.

### Alignment Page

After writing deliverables, build a custom HTML alignment page at `docs/alignment/ux-variations-{topic}.html` and open it in the browser. The page should visualize the variation concepts, comparison matrix, and decision criteria in a format tailored to the specific variations produced. Archive any previous alignment page at that path first.

Do not use a shared template or CSS framework — craft the page to fit the situation. The alignment page is a one-off communication artifact, not a reusable component.

In layout-mode, write `specs/ui-layout-variations-[topic].md` and `ui-layout-variations-[topic]-interview.md`.

The variation plan must include:

- Scope and source evidence
- UX Variation Assumptions Manifest with confirmations and corrections
- Fixed constraints and open decision dimensions
- Onboarding, activation, and first-success model
- Typical user workflow and repeat-use loop
- Sharing, collaboration, permissions, and handoff model
- Notification, status, and return-use model
- Failure, abandonment, and recovery behavior
- Evaluation criteria and selection method
- Variation matrix
- Detailed variation specifications
- Prototype or implementation plan for each variation, including separate experiment routes for prototype-stage alternatives
- Experiment plan and evidence capture
- Lock-in checklist for confirming the chosen interface
- Risks, non-goals, and follow-up work

Use this variation format:

```markdown
### Variation N: [Name]

- Thesis: [why this direction should work]
- Best for: [user/context]
- Page and flow model: [routes, steps, navigation]
- Onboarding and activation: [first-run path, setup, first success]
- Typical workflow: [repeat-use sequence and completion point]
- Sharing and collaboration: [invite, permission, handoff, export, or sharing behavior]
- Return-use and notifications: [resume path, reminders, status, activity]
- Recovery behavior: [blocked, invalid, abandoned, partial, or offline states]
- Layout and spatial model: [regions, density, sizing, responsive behavior]
- Components and controls: [core UI inventory]
- Button and link behavior: [primary actions, secondary actions, destinations]
- Visual tone: [hierarchy, typography, color, media, motion]
- Prototype scope: [smallest useful build]
- Experiment route: [`/experiments/<variant>` or project-native equivalent when prototype-stage]
- Strengths:
- Risks:
- Complexity: Low | Medium | High
- Winning signal: [evidence that selects this variation]
```

In layout-mode, use this variation format instead:

```markdown
### Layout Variation N: [Name]

- Thesis: [why this spatial/component approach suits the content]
- Best for: [user task and data characteristics]
- Content-to-component mapping:
  - [content requirement] -> [UI component]
- Page regions: [region layout with proportions]
- Primary content component: [card grid / data table / list / etc.]
- Detail view pattern: [sidebar panel / full-page / modal / drawer / inline]
- Action placement: [where primary and secondary actions live]
- Navigation: [nav pattern and placement]
- Density: [compact / comfortable / spacious with specifics]
- Responsive behavior:
  - Mobile (<=640px): [layout adaptation]
  - Tablet (<=1024px): [layout adaptation]
  - Desktop (>1024px): [full layout]
- States rendering:
  - Empty: [how empty state appears]
  - Loading: [skeleton / spinner / progressive]
  - Error: [inline / toast / page-level]
- Implementation files: [components, routes, layouts]
- Estimated build time: [hours]
- Variant evaluation task: [what the user should try in the built variant]
- Evidence to capture: [screenshots, notes, friction, timing, confidence]
- Strengths:
- Risks:
- Complexity: Low | Medium | High
```

After writing files in layout-mode, recommend `$run` to build each variation as a lightweight implementation, then `$uat --variant-evaluation` to guide hands-on review. Do not recommend `$consolidate-variations` until evaluation evidence exists or the user explicitly says they have reviewed variants and are ready to converge.

After writing files in standard mode, recommend `$ui-interview` per variation to deepen interface detail, then `$prototype` to build each variation.

## Constraints

- Do not present superficial variants that differ only by color palette, typography, or decorative treatment.
- Do not choose a winner for the user unless the evidence clearly supports it and the user asked for a recommendation.
- Do not defer all decisions to testing. State a recommended variant or experiment when evidence is sufficient.
- Do not ignore implementation cost. A compelling variation still needs a prototype path and selection criteria.
- Do not route directly from built UI variants to `$consolidate-variations`; insert `$uat --variant-evaluation` unless the user explicitly confirms they have already evaluated the variants.
- Do not enforce shared design constraints across variations. Each variation independently decides layout, density, color, navigation, and component choices. Only technical stack is shared unless the user explicitly locks a shared constraint.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
