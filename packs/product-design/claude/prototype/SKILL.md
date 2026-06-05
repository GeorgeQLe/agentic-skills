---
name: prototype
description: Build tangible, runnable prototypes from UX variation and UI specs — static HTML/CSS for UI projects, runnable scripts for CLI, endpoint stubs for API, or minimal configs for infra
type: execution
version: v0.9
argument-hint: "[optional: topic, --variant N]"
---

# Prototype

Invoke as `/prototype`.

Build tangible, runnable prototypes before production spec work begins. Create the first concrete artifact users can interact with, grounded in research and UX variation planning. Prototypes are cheap, disposable, and designed for evaluation — not production readiness. The goal is to give humans something to click, run, or curl so they can form opinions before committing to a direction.

## Gate

Before proceeding, verify the following files exist:

- At least one `specs/ux-variations-*.md` file.
- At least one `specs/ui-*.md` file (e.g., `specs/ui-[topic].md`, `specs/ui-layout-variations-[topic].md`, or `specs/ui-requirements-[topic].md`).

If either is missing, halt with a clear message:

> Prototyping requires UX variation planning and UI specification. Missing prerequisites:
> - `specs/ux-variations-*.md` — run `/ux-variations` to create variation concepts.
> - `specs/ui-*.md` — run `/ui-interview` to define the interface specification.

Do not proceed past this gate until both prerequisites exist.

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

### 1. Resolve context

- Read `.agents/project.json` if it exists. Extract `project_type` for dispatch decisions.
- Read research documents when present:
  - `research/idea-brief.md` — assumptions to test, core value proposition, and hypothesis framing.
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

> Recommended next command: `/uat --variant-evaluation` (check `.agents/project.json.enabled_packs` for `product-testing` — if `product-testing` is not enabled, recommend `/pack install product-testing` first)

The user should interact with each prototype variation hands-on before consolidating. UAT variant evaluation provides a structured comparison framework to capture evidence for each variation's strengths, friction points, and rejection signals.

## Constraints

- Do not introduce build tools, bundlers, package managers, or framework dependencies into prototypes. Prototypes must be immediately usable without installation steps.
- Do not connect to real databases, APIs, or external services. All data must be fixture/fake data.
- Do not build production-quality code. Prototypes are disposable artifacts for evaluation, not starting points for implementation.
- Do not skip variations. Build all variations defined in the spec unless `--variant N` is provided.
- Do not choose a winning variation or recommend consolidation. That is the user's decision after UAT evaluation.
- Do not modify specs, research documents, or task files. Only create files in the `prototypes/` directory.
- When recommending a skill from another pack, verify the pack is installed via `.agents/project.json` `enabled_packs`. If not installed, prepend `/pack install <pack-name>` to the recommendation.

## Alignment Page

Prototype files may be created before the alignment page because the review needs runnable artifacts. After building or updating prototype files, build and attempt to open `alignment/prototype-{topic}.html` before downstream routing, UAT handoff, consolidation, spec updates, research updates, or task/roadmap changes.

**Page layout contract.** After the page title and short summary, include a top-of-page "Table of Contents" section with anchor links to the major review sections and the bottom compile section. Keep the Table of Contents in normal document flow. Do not use a sidebar, side rail, drawer, split-shell layout, or sticky navigation for the Table of Contents unless the user explicitly asks for that layout. Do not place compile, copy, feedback, or answer controls in a sticky or fixed bottom banner/footer. Bottom compile controls must appear as ordinary content in a bottom compile section, so they scroll with the page and do not cover content at high zoom.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. Include evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and approval gates. Render the prototype inventory, source research signals, variant theses, file paths created or changed, known fixture/fake-data boundaries, deferred production infrastructure, and the exact downstream artifacts that remain blocked.

**Required inline questions.** Ask whether the prototypes adequately cover the intended journey, whether any assumptions or confidence levels are wrong, whether any prototype files need adjustment before UAT, whether the proposed file changes are accepted, and whether routing to UAT or consolidation is approved.

**Section feedback controls.** Add lightweight section-feedback controls to every major section of the page: emphasize, reject or flag a concern, and clarification needed. Selecting a control reveals a multi-line section-feedback textarea placed directly under or beside the emphasize/down/clarify controls. This textarea is separate from gate-question text inputs, so it still appears near the feedback controls even when the same section also has required gate questions with their own text boxes. These controls are optional for final approval and do not replace required gate questions. They also power the separate feedback-only YAML path so the user can send emphasis requests, concerns, or clarification requests before answering every required gate question.

**Feedback-only YAML contract.** Provide feedback-only YAML in two places: locally under each selected section-feedback textarea, and globally in the bottom compile section. When a section-feedback control is selected, show local "Compile Feedback YAML" and "Copy YAML" controls plus a read-only YAML textarea directly under that section's feedback textarea. The local feedback compile generates YAML with `alignment_page: alignment/{skill-name}-{topic}.html`, `feedback_status: revision-request`, `approval_status: not-approved`, `unanswered_required_questions`, and a `section_feedback` list containing the single selected section-feedback entry for that local control. The bottom "Compile Feedback YAML" control generates the same YAML shape but aggregates every selected section-feedback entry on the page. Enable both local and bottom feedback compile controls as soon as at least one section-feedback control is set, even if required inline gate questions are unanswered. Populate `alignment_page` from the known repo-relative output path used to write the HTML page, not from the page title, browser URL, window location, or any display label. Each feedback entry uses `section`, `feedback` (`emphasize`, `down`, or `needs-clarification`), optional `notes` from that section's feedback textarea, and `requested_agent_action` (`add-weight-to-section`, `investigate-and-revise`, or `clarify-before-approval`). For `emphasize` feedback, the YAML must tell the agent to add more weight, prominence, evidence, detail, or recommendation emphasis to that section or to the specific point named in the notes; this is a revision request, not approval of the section as-is. For `down` and `needs-clarification` feedback, the YAML must tell the agent to evaluate the feedback, investigate further when needed, and contextually amend the HTML alignment page before asking again for final approval answers. Copy and display feedback YAML locally or at the bottom with the same clipboard retry and textarea fallback behavior as final gate YAML. Do not render the bottom feedback compile controls as a sticky or fixed banner.

**Gate YAML contract.** At the bottom of the page, include an ordinary in-flow compile section with a "Compile Feedback YAML" button for selected section feedback and a separate "Compile Answers" button for final approval answers. The bottom compile section must not be sticky, fixed, floating, or styled as a persistent banner. The "Compile Answers" button compiles final approval answers into YAML with `alignment_page: alignment/{skill-name}-{topic}.html`, `approval_status: ready-for-agent-review`, `section`, `gate_type`, `status`, `decision`, `notes`, and `approved_file_changes` fields. Populate `alignment_page` from the known repo-relative output path used to write the HTML page, not from the page title, browser URL, window location, or any display label. The final approval button remains disabled until every required question has a selection. The final YAML may also include any section feedback the user set, using the feedback-only YAML `section_feedback` shape. The page must automatically attempt to copy the YAML to the clipboard, provide an explicit "Copy YAML" button, and fall back to selecting the textarea contents.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page. Ask the user to review the page and provide either local or bottom feedback-only YAML for emphasis requests, concerns, or clarification, or final compiled YAML answers when ready. Do not require the user to answer every gate before sending emphasis requests, negative feedback, or clarification needs. When feedback-only YAML is provided, treat it as a revision request: evaluate the feedback, investigate further when needed, archive and amend the HTML alignment page contextually, highlight the changes, and ask again for review. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after final compiled YAML has been provided and the approved artifacts have been written or updated.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
