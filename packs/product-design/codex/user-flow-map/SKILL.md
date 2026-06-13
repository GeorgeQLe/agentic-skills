---
name: user-flow-map
description: Turn a high-level product concept, positioned goal, or goal sequence into screen flow structure with entry points, decisions/actions/states, branches, failure paths, and low-fidelity wireframe guidance before UI/spec/prototype work
type: planning
version: v0.4
argument-hint: "[optional: product, flow, feature, route, or goal]"
context_intake: deep
visual_tier: prototype
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `npx skillpacks install <pack>` from the project shell, instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# User Flow Map

Invoke as `$user-flow-map`.

Use this skill after positioning and before UI/layout/prototype work when a product, feature, or goal sequence needs concrete user-flow structure: entry points, screens/routes, actions, decisions, branches, states, failure paths, handoffs, and low-fidelity wireframe notes. This skill defines what screens and transitions exist before `$ui-interview --requirements-only` defines per-screen content requirements and before `$ux-variations --layout-mode` explores visual/layout alternatives.

This skill does not create polished UI, visual styling, production specs, or runnable prototypes. Keep layout and styling out of scope except for wireframe-level structural notes such as "summary panel beside task list" or "confirmation step before destructive action."

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

### 1. Resolve Context

Read available evidence before asking deep questions:

- `.agents/project.json`, `AGENTS.md`, `CLAUDE.md`, `README.md`, and relevant task docs.
- `research/idea-brief.md`, `research/icp.md`, `research/competitive-analysis.md`, `research/journey-map.md`, `research/positioning.md`, and product-path-scoped equivalents.
- Existing `specs/`, including `specs/user-flow-*.md`, `specs/ui-requirements-*.md`, `specs/ui-*.md`, and `specs/ux-variations-*.md`.
- Existing route files, component files, app shells, navigation config, screenshots, wireframes, mockups, and design artifacts when present.

If `research/positioning.md` is missing for a business-product flow, recommend `$positioning` first. If `product-design` is not enabled, recommend `npx skillpacks install product-design` from the project shell.

### 2. Flow Assumptions Checkpoint

Before deep probing, present a concise **Flow Assumptions Checkpoint** inline as the final message text of its own turn — never only as mid-turn text in a turn that ends with a tool or command call — then ask the user to confirm, correct, or flag it in the next turn. Tag each assumption with `[from idea]`, `[from research]`, `[from positioning]`, `[from journey]`, `[from spec]`, `[from codebase]`, `[from artifact]`, or `[inferred]`.

Cover:

- Persona, role, and goal.
- Entry points and triggers.
- First success or completion condition.
- Happy path sequence.
- Alternate paths and branch points.
- Decisions the user or system must make.
- Screens/routes likely required.
- Actions per screen.
- States to represent: empty, loading, error, partial, success, permission-denied, offline, validation, and edge states.
- Failure and recovery paths.
- Cross-role, cross-device, external-system, or manual handoffs.
- Flow boundaries and explicit non-goals.

Do not proceed until the user has reviewed the checkpoint. If the user confirms it as-is, continue. If they correct an assumption, carry the correction into both deliverables.

### 3. Map The Flow

Build the flow map at workflow level, not visual-design level:

1. Define the primary persona, goal, success condition, and triggering context.
2. List every entry point and precondition.
3. Write the happy path as ordered steps with the screen/route used by each step.
4. List alternate paths, including optional setup, skip paths, backtracking, cancellation, save-for-later, review/edit, and escalation.
5. List decision points and branch rules. Distinguish user decisions, system decisions, permissions decisions, and external/manual decisions.
6. Create a screen/route inventory with purpose, inputs, outputs, source evidence, and downstream destination.
7. For each screen, list required actions, available navigation, disabled/blocked rules, validation rules, and state coverage.
8. Map failures and recovery: invalid input, no data, permissions, lost connection, backend failure, timeouts, interrupted work, and contradictory user choices.
9. Map handoffs across roles, devices, systems, documents, notifications, approvals, payments, support, or manual operations.
10. Add low-fidelity wireframe notes for each screen: rough regions, primary/secondary content, key controls, data groupings, progressive disclosure, and fixed/sticky elements only when structurally necessary.

### 4. Coverage Checkpoint

Before writing deliverables, present a **Flow Coverage Checkpoint** inline as the final message text of its own turn (never only as mid-turn text before a tool or command call):

- Persona and goal covered.
- Entry points covered.
- Happy path covered.
- Branches and decision points covered.
- Screen/route inventory covered.
- Actions per screen covered.
- Required states covered.
- Failure/recovery paths covered.
- Handoffs covered.
- Wireframe-level notes covered.
- Layout/styling non-goals preserved.

In the next turn, ask whether any flow branch, state, or handoff is missing before writing.

## Deliverables

Write:

- `specs/user-flow-[topic].md`
- `user-flow-[topic]-interview.md`

The user-flow spec must include:

- Scope, source evidence, and assumptions checkpoint.
- Persona, goal, and success condition.
- Entry points and preconditions.
- Happy path.
- Alternate paths and branches.
- Decision-point table.
- Screen/route inventory.
- Per-screen action/state matrix.
- Failure and recovery paths.
- Handoffs and external/manual dependencies.
- Low-fidelity wireframe notes per screen.
- Open questions, risks, and explicit non-goals.
- Downstream handoff choices for `$ui-interview --requirements-only [topic]`.

The interview log must include:

- Evidence consulted.
- The Flow Assumptions Checkpoint and user corrections.
- Questions asked, options presented, recommendations, and user responses.
- Flow Coverage Checkpoint and remaining gaps.

After approved files are written, present this handoff choice instead of auto-running or auto-invoking the next skill:

1. Stop here so the user can clear context and run `$ui-interview --requirements-only [topic]` in a fresh session.
2. Continue immediately in this session with `$ui-interview --requirements-only [topic]`.

If the user chooses to continue immediately, the next skill must still execute its own required interaction gates. `user-flow-map` approval authorizes the route and provides source evidence; it does not count as `ui-interview` interview completion or replace the UI Assumptions Manifest and Content Requirements Manifest confirmations.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/user-flow-map-{topic}.html`.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.

## Constraints

- Keep this skill before UI layout and prototype work in the AFPS route.
- Do not produce high-fidelity mockups, component styling, color palettes, design systems, production architecture, database schemas, or implementation plans.
- Do not collapse branches or states into generic "standard flow" language. Name each branch/state or mark it explicitly out of scope.
- Do not route directly to `$ux-variations` from an approved flow map; route to `$ui-interview --requirements-only` first.
- Do not auto-run or auto-invoke downstream skills after approval. Present the stop/clear-context versus continue-now choice, and preserve the next skill's required gates either way.
- When recommending a skill from another pack, verify pack availability through `.agents/project.json.enabled_packs`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
