---
name: ui-interview
description: Interview page by page to define a complete UI specification, including layout, hierarchy, controls, links, spacing, sizing, responsive behavior, visual states, and implementation-ready interface details — supports a requirements-only mode that establishes data, actions, and states without locking layout or component decisions
type: planning
version: v0.3
argument-hint: "[optional: app, page, flow, feature, or draft UI]"
---

# UI Interview

Invoke as `/ui-interview`.

Use this skill when the user needs to turn a rough product idea, feature, page, wireframe, screenshot, or existing app surface into a detailed implementation-ready UI specification. This skill focuses on the interface itself: pages, regions, components, buttons, links, labels, spacing, element size, visual hierarchy, state, responsive layout, and accessibility.

Use `/ux-variations` after this skill when the user wants multiple experience concepts or interface variants to compare before locking the final direction.

When invoked with `--requirements-only` (or when the user says "just requirements", "requirements only", or "content requirements"), this skill stops after establishing what the page needs — data, actions, states, and constraints — without committing to any layout, component, or spatial decisions. This mode feeds directly into `/ux-variations --layout-mode` to explore multiple concrete visual approaches for the same content contract.

## Workflow

1. **Resolve context**
   - Read `.agents/project.json` if it exists.
   - Read `README.md`, `AGENTS.md`, `CLAUDE.md`, relevant `docs/`, `specs/`, `research/`, route files, component directories, screenshots, and design artifacts when present.
   - If the request is for an existing UI, inspect the current implementation before interviewing.
   - If multiple apps or surfaces are plausible, ask the user which app, flow, or page to cover first.

2. **Treat inputs as draft material**
   - Do not assume the current UI, prompt, screenshot, or mockup is final.
   - Product specs, ICP documents, and journey maps are reference material, not locked constraints. The user may override any product decision during the interview. When a user's interview answer contradicts an existing spec, adopt the interview answer and note the divergence.
   - Preserve explicit constraints, but challenge unclear defaults before they become implementation decisions.
   - Distinguish product behavior decisions from UI presentation decisions.

3. **Surface assumptions before probing**
   - Present a UI Assumptions Manifest before deep questioning.
   - Tag each assumption with `[from spec]`, `[from codebase]`, `[from research]`, `[from artifact]`, or `[inferred]`.
   - Cover product and user context, pages and routes, primary tasks, navigation, hierarchy, layout grid, spatial density, component inventory, button and link semantics, form behavior, empty/loading/error/success states, responsive behavior, accessibility, visual language, implementation constraints, and the prototype-first boundary for new product or substantial feature work: what the user should be able to click through first, whether multiple route-based experiments should be built, what data can be fake, fixture-backed, or in-memory, and which infrastructure must be represented visually but not implemented yet.
   - Use AskUserQuestion to ask the user to confirm, correct, or flag assumptions before continuing.

4. **Interview page by page**
   - Ask 1 to 3 focused questions per turn using AskUserQuestion.
   - Move through the interface in this order unless the user asks otherwise:
     - Global shell: header, sidebar, footer, navigation, account controls, notifications
     - Page inventory: every route, modal, drawer, overlay, and important empty state
     - Page purpose: user goal, task priority, and success condition
     - Prototype calibration: first clickable journey, route-based experiment set, fixture/fake data boundaries, infrastructure-only states to mock rather than implement, and taste/feel questions the prototype must answer before database, auth, payment, analytics, deployment, admin, or multi-tenant work is planned.

4b. **Requirements gate (requirements-only mode)**
   - In requirements-only mode, stop here — do not proceed to layout anatomy, component inventory, or spatial decisions.
   - For each page, confirm:
     - Data fields and entities (with cardinality: one, many, nested, polymorphic)
     - User actions (create, edit, delete, filter, sort, export, navigate, bulk-select, reorder)
     - States (empty, loading, error, partial, full, offline, permission-denied)
     - Constraints (real-time updates, offline support, accessibility requirements, performance budgets)
     - Content hierarchy (primary / secondary / tertiary information)
     - Relationships between data elements (parent-child, peer, reference, aggregate)
   - Present a **Content Requirements Manifest** summarizing all pages, then use AskUserQuestion to confirm before writing deliverables.
   - Write `specs/ui-requirements-[topic].md` (content requirements) and `ui-requirements-[topic]-interview.md` (interview log).
   - After writing files, recommend `/ux-variations --layout-mode` to explore multiple visual approaches for these requirements, or `/ui-interview` (full mode, no flag) to proceed directly to a single deep UI specification.
   - Stop. Do not continue to step 5 or beyond.

   - Layout anatomy: top-to-bottom and left-to-right regions, alignment, density, scroll behavior
     - Component inventory: tables, lists, cards, forms, charts, media, editors, maps, canvases
     - Controls: every button, icon button, segmented control, checkbox, radio, toggle, input, menu, tab, link, and destructive action
     - Copy: headings, labels, helper text, validation text, confirmation text, empty-state text
     - States: default, hover, focus, active, selected, disabled, loading, error, success, partial, offline
     - Spatial details: element prominence, approximate sizes, gaps, padding, fixed or fluid dimensions, sticky regions, overlap rules, max widths
     - Responsive behavior: desktop, tablet, mobile, wide desktop, touch target sizing, collapsed controls
     - Accessibility: keyboard order, focus traps, labels, contrast, reduced motion, screen reader names. Include color-blind safe patterns, keyboard navigation, reduced motion support, and screen reader labels by default in every spec. Do not present accessibility features as optional checkboxes. Only ask about domain-specific accessibility (gamepad support, dyslexia fonts) when the product context warrants it.
   - When a page includes repeated items, define one canonical item and its variations rather than asking about every row individually.

5. **Research and recommend by default**
   - Use project evidence and established UI conventions before asking the user to invent details.
   - For material decisions, present options, a recommendation, rationale, tradeoffs, and mitigation.
   - Recommend familiar controls over novel patterns unless the product has a strong reason to deviate.
   - Respect the existing design system, component library, and implementation patterns.
   - Reference and inspiration questions ("apps you admire?") are low-priority. Ask once early, accept any answer including "none" or "let's experiment," and move on. Do not block the interview on reference input.

6. **Coverage checkpoint**
   - Before concluding, use AskUserQuestion to present a concise checklist of pages, components, controls, states, responsive behavior, and unresolved risks.
   - Ask whether anything is missing or should be revisited before writing deliverables.

## Deliverables

- Write the completed UI specification to `specs/ui-[topic].md`.
- Write the interview log to `ui-[topic]-interview.md`.

The UI specification must include source evidence, the confirmed UI Assumptions Manifest, page inventory, route map, global shell rules, page-by-page anatomy, component inventory, control inventory, link inventory, layout and responsive rules, visual style direction, interaction states, accessibility requirements, implementation notes, open questions, risks, and non-goals. For new product interfaces or substantial feature interfaces, include a prototype-first section naming the first clickable journey, experiment route map when multiple alternatives should be tested, fake/fixture data, visually mocked infrastructure states, deferred production infrastructure, and the evidence required before implementation planning promotes any deferred infrastructure.

The interview log must include the manifest, every question asked, options and recommendations presented, user responses, final decisions, and notable changes from the initial draft, current implementation, or artifact.

After writing files, recommend `/ux-variations` if variants are needed before implementation, or check `.agents/project.json.enabled_packs` for `agent-work-admin` — if `agent-work-admin` is not enabled, recommend `/pack install agent-work-admin` first; if `agent-work-admin` is enabled, recommend `/roadmap` — if the interface is ready to sequence into work.

### Alignment Page

Build and attempt to open `alignment/ui-interview-{topic}.html` before writing or replacing `specs/ui-[topic].md` or the interview log.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. Include evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and approval gates. Render surfaced assumptions, the UI or content requirements manifest, page inventory, route map, component/control/link inventories, prototype-first boundary, and every proposed deliverable section with no context loss from source evidence or interview notes.

**Required inline questions.** Ask whether the evidence is sufficient for the UI decisions, whether any assumptions or confidence levels are wrong, whether page/component decisions and non-goals are acceptable, whether the proposed canonical file changes are approved, and whether any downstream route should remain blocked.

**Gate YAML contract.** Compile answers into YAML with `section`, `gate_type`, `status`, `decision`, `notes`, and `approved_file_changes` fields. The page must automatically attempt to copy the YAML to the clipboard, provide an explicit "Copy YAML" button, and fall back to selecting the textarea contents.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

## Constraints

- Do not skip small interface elements. Buttons, links, icons, menus, and empty states are part of the spec.
- Do not collapse UI detail into generic phrases such as "standard dashboard layout" or "normal form behavior."
- Do not create implementation plans until the page anatomy and control behavior are decision-complete.
- Do not treat visual polish as separate from implementation. Size, spacing, hierarchy, and responsive behavior must be specified well enough for a developer to build.
- When recommending a skill from another pack, verify the pack is installed via `.agents/project.json` `enabled_packs`. If not installed, prepend `/pack install <pack-name>` to the recommendation.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
