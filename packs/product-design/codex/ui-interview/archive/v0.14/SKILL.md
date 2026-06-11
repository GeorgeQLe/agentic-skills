---
name: ui-interview
description: Interview page by page to define a complete UI specification, including layout, hierarchy, controls, links, spacing, sizing, responsive behavior, visual states, and implementation-ready interface details — supports a requirements-only mode that establishes data, actions, and states without locking layout or component decisions
type: planning
version: v0.14
argument-hint: "[optional: app, page, flow, feature, or draft UI]"
interview_depth: full
visual_tier: prototype
---

# UI Interview

Invoke as `$ui-interview`.

Use this skill when the user needs to turn a rough product idea, feature, page, wireframe, screenshot, or existing app surface into a detailed implementation-ready UI specification. This skill focuses on the interface itself: pages, regions, components, buttons, links, labels, spacing, element size, visual hierarchy, state, responsive layout, and accessibility.

Use `$user-flow-map` before this skill when the product or feature has no credible screen/route inventory, task sequence, branch coverage, or state map. Prefer `specs/user-flow-*.md` as source material when it exists; it is the upstream flow-structure contract for requirements-only UI work.

Use `$ux-variations` after this skill when the user wants multiple experience concepts or interface variants to compare before locking the final direction.

When invoked with `--requirements-only` (or when the user says "just requirements", "requirements only", or "content requirements"), this skill stops after establishing what the page needs — data, actions, states, and constraints — without committing to any layout, component, or spatial decisions. This mode feeds directly into `$ux-variations --layout-mode` to explore multiple concrete visual approaches for the same content contract.

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
   - Read `README.md`, `AGENTS.md`, `CLAUDE.md`, relevant `docs/`, `specs/`, `research/`, route files, component directories, screenshots, and design artifacts when present.
   - Prefer `specs/user-flow-*.md` (or product-path-scoped equivalents) for screen sequence, route inventory, branches, decisions, states, failure paths, and low-fidelity wireframe notes before inferring UI requirements.
   - If the request is for an existing UI, inspect the current implementation before interviewing.
   - If multiple apps or surfaces are plausible, ask the user which app, flow, or page to cover first.
   - If the interface has no credible screen/flow structure from a user-flow spec, existing routes, screenshot, wireframe, or explicit user prompt, stop and recommend `$user-flow-map [topic]` before UI requirements or layout decisions.

2. **Treat inputs as draft material**
   - Do not assume the current UI, prompt, screenshot, or mockup is final.
   - Product specs, ICP documents, and journey maps are reference material, not locked constraints. The user may override any product decision during the interview. When a user's interview answer contradicts an existing spec, adopt the interview answer and note the divergence.
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
     - Prototype-first boundary for new product or substantial feature work: what the user should be able to click through first, whether multiple route-based experiments should be built, what data can be fake, fixture-backed, or in-memory, and which infrastructure must be represented visually but not implemented yet.
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
   - Deliver every manifest/checklist/checkpoint the user must confirm inline as the final message text of its own turn; ask the confirmation question in the next turn (consistent with the one-question-per-turn cadence). Never emit it only as mid-turn text in a turn that ends with a tool or command call — harness rendering does not guarantee mid-turn text is shown. A confirmation question must never reference content the user has not been shown.

4. **Interview page by page**
   - Codex interview cadence is one primary decision question per turn by default. Use short follow-up bullets only when they clarify the same page or interface decision, not to batch unrelated questions.
   - Move through the interface in this order unless the user asks otherwise:
     - Global shell: header, sidebar, footer, navigation, account controls, notifications
     - Page inventory: every route, modal, drawer, overlay, and important empty state
     - Page purpose: user goal, task priority, and success condition
     - Prototype calibration: first clickable journey, route-based experiment set, fixture/fake data boundaries, infrastructure-only states to mock rather than implement, and taste/feel questions the prototype must answer before database, auth, payment, analytics, deployment, admin, or multi-tenant work is planned.

4b. **Requirements gate (requirements-only mode)**
   - In requirements-only mode, stop here — do not proceed to layout anatomy, component inventory, or spatial decisions.
   - For each page, confirm:
     - Data fields and entities with cardinality: one, many, nested, or polymorphic
     - User actions: create, edit, delete, filter, sort, export, navigate, bulk-select, reorder
     - States: empty, loading, error, partial, full, offline, permission-denied
     - Constraints: real-time updates, offline support, accessibility requirements, performance budgets
     - Content hierarchy: primary, secondary, tertiary information
     - Relationships between data elements: parent-child, peer, reference, aggregate
   - Present a **Content Requirements Manifest** summarizing all pages, then ask the user to confirm. Deliver the manifest per the inline visibility rule in step 3 (turn-final message text of its own turn; confirmation question in the next turn), never as mid-turn text only.
   - This manifest confirmation is non-final: it only confirms the requirements draft is ready for the pre-approval lifecycle in step 7. Route all writes through that lifecycle — working packet at `research/_working/preliminary-ui-interview-research.md` (or `research/{slug}/_working/preliminary-ui-interview-research.md` when a product path is active), then a `review`-state `alignment/ui-interview-{topic}.html` page rendering the Content Requirements Manifest as the candidate/verdict gate, then final compiled YAML approval.
   - Only after final compiled YAML approval, write `specs/ui-requirements-[topic].md` and `ui-requirements-[topic]-interview.md`, archive the working packet, and convert the page to `confirmed` per step 7.
   - Only after the page is converted to `confirmed` and canonical files are written, recommend `$ux-variations --layout-mode` to explore multiple visual approaches for these requirements, or `$ui-interview` without the flag to proceed directly to a single deep UI specification, or check `.agents/project.json.enabled_packs` for `agent-work-admin` — if `agent-work-admin` is not enabled, recommend `$pack install agent-work-admin` first; if `agent-work-admin` is enabled, recommend `$roadmap` — if the interface is ready to sequence into work.
   - If requirements-only work exposes missing screen order, branch decisions, or state coverage, recommend `$user-flow-map [topic]` instead of inventing layout variants.
   - Stop. Do not continue to step 5 or beyond; the pre-approval lifecycle in step 7 and the requirements deliverables above are the only remaining work in this mode.

5. **Full UI specification** (no `--content-only` flag):

     - Layout anatomy: top-to-bottom and left-to-right regions, alignment, density, scroll behavior
     - Component inventory: tables, lists, cards, forms, charts, media, editors, maps, canvases
     - Controls: every button, icon button, segmented control, checkbox, radio, toggle, input, menu, tab, link, and destructive action
     - Copy: headings, labels, helper text, validation text, confirmation text, empty-state text
     - States: default, hover, focus, active, selected, disabled, loading, error, success, partial, offline
     - Spatial details: element prominence, approximate sizes, gaps, padding, fixed or fluid dimensions, sticky regions, overlap rules, max widths
     - Responsive behavior: desktop, tablet, mobile, wide desktop, touch target sizing, collapsed controls
     - Accessibility: keyboard order, focus traps, labels, contrast, reduced motion, screen reader names. Include color-blind safe patterns, keyboard navigation, reduced motion support, and screen reader labels by default in every spec. Do not present accessibility features as optional checkboxes. Only ask about domain-specific accessibility when the product context warrants it.
   - When a page includes repeated items, define one canonical item and its variations rather than asking about every row individually.

5. **Research and recommend by default**
   - Use project evidence and established UI conventions before asking the user to invent details.
   - For material decisions, present options, a recommendation, rationale, tradeoffs, and mitigation.
   - Recommend familiar controls over novel patterns unless the product has a strong reason to deviate.
   - For frontend work, respect the existing design system, component library, and implementation patterns.
   - Reference and inspiration questions are low-priority. Ask once early, accept any answer including "none" or "let's experiment," and move on. Do not block the interview on reference input.

6. **Coverage checkpoint**
   - Before concluding, present a concise checklist of pages, components, controls, states, responsive behavior, and unresolved risks.
   - Deliver the checklist per the inline visibility rule in step 3 (turn-final message text of its own turn; confirmation question in the next turn), never as mid-turn text only.
   - Ask whether anything is missing or should be revisited before building the alignment page.
   - This confirmation is non-final: it only establishes that the draft is ready for the pre-approval lifecycle in step 7. It does not authorize canonical spec writes.

7. **Build pre-approval alignment page**
   - Before writing any canonical `specs/ui-[topic].md`, `specs/ui-requirements-[topic].md`, or interview log, write the full draft (spec or requirements content plus interview record) only to the working packet `research/_working/preliminary-ui-interview-research.md` (or `research/{slug}/_working/preliminary-ui-interview-research.md` when a product path is active).
   - Build `alignment/ui-interview-{topic}.html` as a `review`-state page rendering the full working packet — manifest, page-by-page decisions, coverage checkpoint, proposed canonical file destinations — and the approval gates.
   - Attempt to open the page in the browser and point the user at the repo-relative path.
   - Treat every checkpoint confirmation in steps 3–6 as non-final; each only confirms the draft is ready for review. Only final compiled YAML from the alignment page authorizes canonical writes.
   - When feedback-only YAML is provided, revise the working packet and the alignment page, then ask again; the work stays pre-approval.
   - Before final compiled YAML approval, the next action is review or revision of the HTML alignment page. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after final compiled YAML approval has been provided and the approved canonical files have been written.

## Deliverables

Before writing anything in this section, verify the alignment page has final compiled YAML approval. Do not write canonical UI specs or interview logs until `alignment/ui-interview-{topic}.html` has been reviewed and the user has provided final compiled YAML approval; checkpoint confirmations are not final approval and do not authorize these writes.

- Write the completed UI specification to `specs/ui-[topic].md`.
- Write the interview log to `ui-[topic]-interview.md`.

After the canonical files are written, archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`, remove the active working packet, and convert the alignment page from `review` to `confirmed`.

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
- For new product interfaces or substantial feature interfaces, a prototype-first section naming the first clickable journey, experiment route map when multiple alternatives should be tested, fake/fixture data, visually mocked infrastructure states, deferred production infrastructure, and the evidence required before implementation planning promotes any deferred infrastructure.

The interview log must include:

- The manifest as presented
- Every question asked
- Options and recommendations presented
- User responses and final decisions
- Notable changes from the initial draft, current implementation, or artifact

Only after the page is converted to `confirmed` and canonical files are written, recommend `$ux-variations` if variants are needed before implementation, or check `.agents/project.json.enabled_packs` for `agent-work-admin` — if `agent-work-admin` is not enabled, recommend `$pack install agent-work-admin` first; if `agent-work-admin` is enabled, recommend `$roadmap` — if the interface is ready to sequence into work.

### Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/ui-interview-{topic}.html`.

The page is built pre-approval in `review` state per step 7, before any canonical spec write, and converts to `confirmed` only after final compiled YAML approval and canonical writes.

## Constraints

- Do not skip small interface elements. Buttons, links, icons, menus, and empty states are part of the spec.
- Do not collapse UI detail into generic phrases such as "standard dashboard layout" or "normal form behavior."
- Do not create high-fidelity implementation plans until the page anatomy and control behavior are decision-complete.
- Do not treat visual polish as separate from implementation. Size, spacing, hierarchy, and responsive behavior must be specified well enough for a developer to build.
- When recommending a skill from another pack, verify the pack is installed via `.agents/project.json` `enabled_packs`. If not installed, prepend `$pack install <pack-name>` to the recommendation.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
