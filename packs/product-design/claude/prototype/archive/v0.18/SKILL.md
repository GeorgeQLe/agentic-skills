---
name: prototype
description: Build tangible, runnable prototypes from design-phase UX variation and UI branch packets — static HTML/CSS for UI projects, runnable scripts for CLI, endpoint stubs for API, or minimal configs for infra
type: execution
version: v0.18
required_conventions: [alignment-page, design-tree-loop]
argument-hint: "[optional: topic, --variant N]"
visual_tier: prototype
---

# Prototype

Invoke as `/prototype`.

Build tangible, runnable prototypes before production spec work begins. Create the first concrete artifact users can interact with, grounded in research and UX variation planning. Prototypes are cheap, disposable, and designed for evaluation — not production readiness. The goal is to give humans something to click, run, or curl so they can form opinions before committing to a direction.

Use the prototype build plan from `design/prototype-build-plan-[topic].md` as the authoritative todo ledger. The UX variation plan describes possible branches; the build plan says which branches to build now, which need revision, and which are deferred or dropped.

Follow `DESIGN-TREE-LOOP.md` for prototype-phase routing, state storage, approval boundaries, and task classification. Prototype build state is stored in `design/prototype-build-plan-*.md` and `design/**/flow-tree-*.yaml`, never in `tasks/todo.md`.

## Gate

Before proceeding, verify the following files exist:

- At least one `design/ux-variations-*.md` file or product-path-scoped equivalent.
- At least one `design/ui-*.md` file or product-path-scoped equivalent (e.g., `design/ui-[topic].md`, `design/ui-layout-variations-[topic].md`, or `design/ui-requirements-[topic].md`).
- One `design/prototype-build-plan-*.md` file or product-path-scoped equivalent produced by `/user-flow-map --prototype-build-plan`.

Also read `design/user-flow-*.md` and `design/**/flow-tree-*.yaml` as upstream screen-ordering, task-sequencing, branch-state, build-item status, and approval-state signals.

If either is missing, halt with a clear message:

> Prototyping requires UX variation planning and UI specification. Missing prerequisites:
> - `design/ux-variations-*.md` — run `/ux-variations` to create variation concepts.
> - `design/ui-*.md` — run `/ui-interview` to define the interface specification.
> - `design/prototype-build-plan-*.md` — run `/user-flow-map --prototype-build-plan [topic]` to create the prototype todo ledger.

Do not proceed past this gate until both prerequisites exist.

## Design-Tree Flow

This skill runs the unified **5-stage design-tree flow** (`interrogation → research → design → plan → implement(scoped)`) from `DESIGN-TREE-LOOP.md` as the tree's **validation layer**, producing the literal runnable prototype. The `## Process` steps below group by stage:

- **Stage 0 — Interrogation**: folds — there is no blocking interrogation gate; scope comes from the approved build-plan slice (`design/prototype-build-plan-[topic].md`).
- **Stage 1 — Research**: resolve context and research integration (steps 1–2) — read the build plan plus `design/ux-variations-[topic].md`, `design/ui-[topic].md`, and `design/**/flow-tree-*.yaml`.
- **Stage 2 — Design**: project-type dispatch and scope rules (steps 3–4) decide what each narrow-scope build realizes.
- **Stage 3 — Plan**: the build item resolved from the build ledger (`pending` / `needs-revision`) is the slice this run builds.
- **Stage 4 — Implement (scoped)**: **runnable** — build each variation under `prototypes/{topic}/variation-{N}/` and the hub (steps 5–6), record a `decisions[]` entry, and pass the single binding alignment gate before downstream routing.

**Per-branch iteration contract.** Each session cold-starts, reads the flow-tree manifest, resolves the **first build item with status `pending` or `needs-revision`** (honoring `--variant N`), builds it, records its decision, and stops with the handoff in `## Next Work`. Items the user defers are marked `deferred`; abandoned items `dropped`.

**Modify-back originates here.** Human validation can `approve`, `reject`, `retry`, or `modify`. A `modify` decision **requires `targets[]`** naming the upstream node(s) to re-open — a `state-model` model attachment or a `user-flow` branch — returning each to pending so its owning skill re-runs its flow; descendant branches below the re-opened node are marked stale.

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

When product path `{slug}` is active, read research under `research/{slug}/`, read pre-prototype design artifacts under `design/{slug}/`, write prototype output under `prototypes/{topic}/`, and treat top-level `research/*.md` and `design/*.md` files as flat-mode documents or cross-path summaries.

### 1. Resolve context

- Read `.agents/project.json` if it exists. Extract `project_type` for dispatch decisions.
- Read research documents when present:
  - `research/idea-brief.md` — assumptions to test, core value proposition, and hypothesis framing.
  - `research/icp.md` — ideal customer profile; informs copy density, terminology, and information hierarchy.
  - `research/competitive-analysis.md` — differentiation points the prototype should highlight.
  - `research/journey-map.md` — screen flow ordering, entry points, and task sequencing.
- Read the prototype build plan: `design/prototype-build-plan-[topic].md` or product-path-scoped equivalent. Treat it as the authoritative list of build items and statuses.
- Read variation plans: `design/ux-variations-[topic].md` or product-path-scoped equivalents for each relevant topic.
- Read user-flow maps: `design/user-flow-[topic].md` and `design/**/flow-tree-*.yaml` for screen ordering, entry points, branches, decision points, required states, failure/recovery paths, handoffs, branch approval state, and low-fidelity wireframe notes when present.
- Read per-variation UI branch packets: `design/ui-[topic].md`, `design/ui-layout-variations-[topic].md`, and `design/ui-requirements-[topic].md` when present.
- If an argument is provided, use it as the topic filter. Otherwise, identify the topic from available design artifacts.
- If the build plan has no `pending` or `needs-revision` items, stop and report that no prototype build items are currently ready.

### 2. Research integration

Before building, extract actionable signals from research:

- **ICP** (`research/icp.md`): Determine copy density (expert vs. novice), terminology choices, information hierarchy, and default density (compact vs. spacious). The prototype should feel like it was built for the target user, not a generic audience.
- **Journey map** (`research/journey-map.md`): Derive screen flow ordering. The prototype's navigation and page sequence should follow the user's natural task progression, not an arbitrary menu order.
- **User-flow map** (`design/user-flow-[topic].md` and `design/**/flow-tree-*.yaml`): Derive concrete screen order, route inventory, branches, required states, failure/recovery behavior, low-fidelity wireframe structure, and branch approval state. The prototype should preserve the approved task sequence unless a variation plan explicitly changes it.
- **Competitive analysis** (`research/competitive-analysis.md`): Identify differentiation points the prototype must highlight. If the product's thesis is "faster than X" or "simpler than Y," the prototype should make that advantage viscerally obvious.
- **Idea brief** (`research/idea-brief.md`): Surface assumptions the prototype is designed to test. Each prototype variation should help validate or invalidate at least one idea-brief assumption.

Document which research signals influenced which prototype decisions in a brief `## Research Integration` section at the top of the hub page.

### 3. Project type dispatch

Determine the project type from `.agents/project.json` `project_type` field. If the field is absent, infer from repository signals (package.json scripts, Dockerfile presence, CLI entry points, route files, etc.). Dispatch to one of the following modes:

#### UI mode (business-app, or default when no project_type)

Build static HTML/CSS prototypes for each variation:

- One self-contained HTML file per variation at `prototypes/{topic}/variation-{N}/index.html`.
- Inline CSS and minimal inline JS (no build tools, no bundler, no framework dependencies).
- Fake but realistic data — use plausible names, dates, amounts, and content that matches the ICP.
- Clickable navigation between pages/views within the variation. Use anchor links, hash routing, or multiple HTML files as appropriate.
- Responsive layout when the UI spec defines responsive behavior.
- Visual states: show default, empty, loading (static representation), and error states where the spec defines them.
- Do not use CDN-hosted frameworks or libraries. The prototype must work offline from a file:// URL.
- Include a brief `<!-- Variation N: [Name] — [Thesis] -->` comment at the top of each HTML file.

#### CLI mode (devtool with CLI focus)

Build runnable script prototypes for each variation:

- One executable script per variation at `prototypes/{topic}/variation-{N}/demo.sh` (or `.py`, `.js`, etc., matching the project's primary language).
- Include fixture data files alongside the script.
- Demonstrate one core workflow end-to-end: the user runs a single command (or short sequence) and sees realistic output.
- Include inline comments explaining which variation thesis this demonstrates.
- Scripts must be runnable with standard tooling (bash, node, python) without additional dependencies.

#### API mode (devtool with API focus)

Build endpoint stub prototypes for each variation:

- One lightweight server or mock per variation at `prototypes/{topic}/variation-{N}/server.{ext}`.
- Fixture JSON responses for each endpoint.
- A `curl-examples.sh` file with annotated curl commands demonstrating the core workflow.
- Include a brief README in each variation directory explaining the API design thesis.
- Endpoints return fixture data; no database or persistence required.

#### Infra mode

Build minimal configuration prototypes for each variation:

- One `docker-compose.yml` or equivalent config per variation at `prototypes/{topic}/variation-{N}/`.
- Include `.env.example`, config files, and documentation sufficient to understand the infrastructure concept.
- Do not require running services; use placeholder images or mock services where possible.
- Include a brief README explaining the infrastructure thesis and what a user would observe if they ran it.

### 4. Scope rule (non-UI modes)

For CLI, API, and Infra modes, build exactly one core workflow demo with fixture data per variation. Do not attempt full API coverage, complete CLI help systems, or production-ready infrastructure. The prototype exists to make the variation thesis tangible, not to implement the product.

### 5. Build each variation

For each build item in `design/prototype-build-plan-[topic].md` with status `pending` or `needs-revision`:

1. Read the build item ID, status, source user-flow branch, UX variation branch, UI review branch, expected prototype path, and notes from the build plan.
2. Read the variation's thesis, target user, layout/flow model, and prototype scope from the referenced variation spec.
3. Read the corresponding UI branch details from `design/ui-[topic].md` or `design/ui-layout-variations-[topic].md`.
4. Build the prototype artifact at the build plan's expected path, normally `prototypes/{topic}/variation-{N}/`.
5. After each successful build, update the build plan item status to `built`, add the prototype path, and update `design/**/flow-tree-*.yaml` `prototype_build_plan.items[]`.
6. If a build item cannot be completed because the design is unclear, mark it `needs-revision` with a short note instead of inventing missing design decisions.
7. Do not build items marked `deferred` or `dropped` unless the current user instruction explicitly reactivates them; if reactivated, update the build plan status first.
8. Ensure the prototype is immediately usable: open the HTML file, run the script, curl the endpoint, or read the config.
9. Do not write build progress to `tasks/todo.md`; the build plan and flow-tree manifest are the authoritative prototype status stores.

### 6. Build the hub page

Create a hub page at `prototypes/{topic}/index.html` that:

- Lists every variation with its name, thesis, and a direct link to the variation's entry point.
- Shows each build item status: pending, built, needs-revision, deferred, or dropped.
- Includes the research integration summary (which research signals drove which decisions).
- Provides brief instructions for evaluating each variation.
- For UI mode: links open the variation's `index.html` in the same browser.
- For CLI/API/Infra modes: the hub page is a simple HTML document with copy-pasteable commands to run each variation.
- After writing or updating the hub page, attempt to open `prototypes/{topic}/index.html` in the browser and report whether the browser open succeeded or was blocked. A blocked browser open does not make the prototype fail when the files were written correctly.

### 7. `--variant N` flag

When the user provides `--variant N` (or says "rebuild variation N", "only variation N", etc.):

- Build or rebuild only the matching prototype build-plan item, preserving all other existing variations and the hub page.
- Update the hub page to reflect any changes to the rebuilt variation.
- Update the build-plan item and flow-tree manifest status after the rebuild.
- Do not delete or modify other variation directories.

## Output

The skill produces the following file structure:

```
prototypes/{topic}/
  index.html                    # Hub page listing all variations
  variation-1/
    index.html (or demo.sh, server.js, docker-compose.yml)
    [supporting files: fixtures, styles, curl-examples, README]
  variation-2/
    index.html (or demo.sh, server.js, docker-compose.yml)
    [supporting files]
  variation-N/
    ...
```

It also updates:

```
design/prototype-build-plan-{topic}.md
design/flow-tree-{topic}.yaml
```

## Next Step

After prototypes are built, recommend:

> Recommended next command: `/uat --variant-evaluation` (check `.agents/project.json.enabled_packs` for `product-testing` — if `product-testing` is not enabled, recommend `npx skillpacks install product-testing` from the project shell, first)

The user should interact with each prototype variation hands-on before consolidating. UAT variant evaluation provides a structured comparison framework to capture evidence for each variation's strengths, friction points, and rejection signals.

## Next Work

**Next work:** after the prototype preview is approved, route the built variants to `/uat --variant-evaluation` for hands-on evaluation evidence before `/consolidate-prototypes`. Do not route downstream until the prototype preview is approved.

**Recommended next command:** `/uat --variant-evaluation`.

## Invoke With YAML

Emit the `agent_routing` payload with the exact resolved next-invocation command, `{slug}`/`{topic}`/variant filled to literal values: `/uat --variant-evaluation` for the built variants, then `/consolidate-prototypes` once evaluation evidence exists.

## Constraints

- Do not introduce build tools, bundlers, package managers, or framework dependencies into prototypes. Prototypes must be immediately usable without installation steps.
- Do not connect to real databases, APIs, or external services. All data must be fixture/fake data.
- Do not build production-quality code. Prototypes are disposable artifacts for evaluation, not starting points for implementation.
- Do not skip buildable items. Build all `pending` or `needs-revision` items in the prototype build plan unless `--variant N` is provided.
- Do not build `deferred` or `dropped` items unless the user explicitly reactivates them.
- Do not use `design/ux-variations-*.md` as the build todo list when a prototype build plan exists; it is source evidence, not the ledger.
- Do not choose a winning variation or recommend consolidation. That is the user's decision after UAT evaluation.
- Do not modify specs, research documents, or task files. Only create files in the `prototypes/` directory and update the prototype build-plan/flow-tree status ledger.
- When recommending a skill from another pack, verify the pack is installed via `.agents/project.json` `enabled_packs`. If not installed, recommend `npx skillpacks install <pack-name>` from the project shell, before the target skill.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/prototype-{topic}.html`.

Prototype files may be created before the alignment page because the review needs runnable artifacts. After building or updating prototype files, build and attempt to open `alignment/prototype-{topic}.html` before downstream routing, UAT handoff, consolidation, spec updates, research updates, or task/roadmap changes.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
