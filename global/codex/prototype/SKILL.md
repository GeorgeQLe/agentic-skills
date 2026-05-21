---
name: prototype
description: Build tangible, runnable prototypes from UX variation and UI specs — static HTML/CSS for UI projects, runnable scripts for CLI, endpoint stubs for API, or minimal configs for infra
type: execution
version: 1.0.0
argument-hint: "[optional: topic, --variant N]"
---

# Prototype

Invoke as `$prototype`.

Build tangible, runnable prototypes before production spec work begins. This skill creates the first concrete artifact users can interact with, grounded in research and UX variation planning. Prototypes are cheap, disposable, and designed for evaluation — not production readiness. The goal is to give humans something to click, run, or curl so they can form opinions before committing to a direction.

## Gate

Before proceeding, verify the following files exist:

- At least one `specs/ux-variations-*.md` file.
- At least one `specs/ui-*.md` file (e.g., `specs/ui-[topic].md`, `specs/ui-layout-variations-[topic].md`, or `specs/ui-requirements-[topic].md`).

If either is missing, halt with a clear message:

> Prototyping requires UX variation planning and UI specification. Missing prerequisites:
> - `specs/ux-variations-*.md` — run `$ux-variations` to create variation concepts.
> - `specs/ui-*.md` — run `$ui-interview` to define the interface specification.

Do not proceed past this gate until both prerequisites exist.

## Workflow

### 1. Resolve context

- Read `.agents/project.json` if it exists. Extract `project_type` for dispatch decisions.
- Read research documents when present:
  - `research/concept-brief.md` — assumptions to test, core value proposition, and hypothesis framing.
  - `research/icp.md` — ideal customer profile; informs copy density, terminology, and information hierarchy.
  - `research/competitive-analysis.md` — differentiation points the prototype should highlight.
  - `research/journey-map.md` — screen flow ordering, entry points, and task sequencing.
- Read variation specs: `specs/ux-variations-[topic].md` for each relevant topic.
- Read per-variation UI specs: `specs/ui-[topic].md`, `specs/ui-layout-variations-[topic].md`, and `specs/ui-requirements-[topic].md` when present.
- If an argument is provided, use it as the topic filter. Otherwise, identify the topic from available specs.

### 2. Research integration

Before building, extract actionable signals from research:

- **ICP** (`research/icp.md`): Determine copy density (expert vs. novice), terminology choices, information hierarchy, and default density (compact vs. spacious). The prototype should feel like it was built for the target user, not a generic audience.
- **Journey map** (`research/journey-map.md`): Derive screen flow ordering. The prototype's navigation and page sequence should follow the user's natural task progression, not an arbitrary menu order.
- **Competitive analysis** (`research/competitive-analysis.md`): Identify differentiation points the prototype must highlight. If the product's thesis is "faster than X" or "simpler than Y," the prototype should make that advantage viscerally obvious.
- **Concept brief** (`research/concept-brief.md`): Surface assumptions the prototype is designed to test. Each prototype variation should help validate or invalidate at least one concept-brief assumption.

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

For each variation defined in `specs/ux-variations-[topic].md`:

1. Read the variation's thesis, target user, layout/flow model, and prototype scope from the spec.
2. Read the corresponding UI spec details from `specs/ui-[topic].md` or `specs/ui-layout-variations-[topic].md`.
3. Build the prototype artifact in `prototypes/{topic}/variation-{N}/`.
4. Name the directory using the variation number from the spec (1-indexed).
5. Ensure the prototype is immediately usable: open the HTML file, run the script, curl the endpoint, or read the config.

### 6. Build the hub page

Create a hub page at `prototypes/{topic}/index.html` that:

- Lists every variation with its name, thesis, and a direct link to the variation's entry point.
- Includes the research integration summary (which research signals drove which decisions).
- Provides brief instructions for evaluating each variation.
- For UI mode: links open the variation's `index.html` in the same browser.
- For CLI/API/Infra modes: the hub page is a simple HTML document with copy-pasteable commands to run each variation.
- After writing or updating the hub page, attempt to open `prototypes/{topic}/index.html` in the browser and report whether the browser open succeeded or was blocked. A blocked browser open does not make the prototype fail when the files were written correctly.

### 7. `--variant N` flag

When the user provides `--variant N` (or says "rebuild variation N", "only variation N", etc.):

- Build or rebuild only variation N, preserving all other existing variations and the hub page.
- Update the hub page to reflect any changes to the rebuilt variation.
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

## Next Step

After prototypes are built, recommend:

> Recommended next command: `$uat --variant-evaluation`

The user should interact with each prototype variation hands-on before consolidating. UAT variant evaluation provides a structured comparison framework to capture evidence for each variation's strengths, friction points, and rejection signals.

## Constraints

- Do not introduce build tools, bundlers, package managers, or framework dependencies into prototypes. Prototypes must be immediately usable without installation steps.
- Do not connect to real databases, APIs, or external services. All data must be fixture/fake data.
- Do not build production-quality code. Prototypes are disposable artifacts for evaluation, not starting points for implementation.
- Do not skip variations. Build all variations defined in the spec unless `--variant N` is provided.
- Do not choose a winning variation or recommend consolidation. That is the user's decision after UAT evaluation.
- Do not modify specs, research documents, or task files. This skill only creates files in the `prototypes/` directory.

## Alignment Page

When this skill writes or updates durable planning, research, spec, task, prototype, report, or document deliverables, also build a custom HTML alignment page at `alignment/prototype-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/prototype-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

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
