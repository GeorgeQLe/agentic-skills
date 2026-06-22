---
name: consolidate-variations
description: Compare multiple built UI variations, interview the user on what works and what doesn't, cherry-pick best elements, resolve conflicts, and produce a final consolidated implementation-ready UI specification
type: planning
version: v0.4
argument-hint: "[optional: topic, page, or path to variation specs]"
---

# Consolidate Variations

Invoke as `/consolidate-variations`.

Use this skill after the user has built and evaluated multiple UI layout variations (typically generated via `/ux-variations --layout-mode`, built via `/exec`, and evaluated via `/uat --variant-evaluation` (check `.agents/project.json.enabled_packs` for `product-testing` — if `product-testing` is not enabled, recommend `/pack install product-testing` first)). This skill compares the variations, interviews the user on what works and what doesn't in each one, cherry-picks the best elements, resolves conflicts where preferred choices are incompatible, and produces a single consolidated implementation-ready UI specification.

Users with manually built variations (not from the `/ux-variations` pipeline) can also use this skill directly, but consolidation should not happen before the user has reviewed the variants and captured evidence.

## Workflow

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
   - Read `README.md`, `AGENTS.md`, `CLAUDE.md`, relevant `docs/`, `specs/`, `research/`, route files, component directories, and design artifacts when present.
   - Locate the variation spec: `specs/ui-layout-variations-[topic].md` or `specs/ux-variations-[topic].md`.
   - Locate the content requirements: `specs/ui-requirements-[topic].md` or equivalent content contract.
   - Locate variant evaluation evidence: `research/uat-variant-evaluation-[topic].md`, `research/uat-plan.md` result logs, screenshots, notes, recordings, or explicit user-provided review notes.
   - Locate built implementations: scan route files, component directories, and any variation-specific directories or branches.
   - If the variation spec or implementations cannot be found, ask the user to point to them.

2. **Evidence gate**
   - If no evaluation evidence exists and the user has not explicitly said they already reviewed the variants and is ready to converge, stop and recommend `/uat --variant-evaluation` (check `.agents/project.json.enabled_packs` for `product-testing` — if `product-testing` is not enabled, recommend `/pack install product-testing` first).
   - Do not infer a winner from specs alone. Built variants need hands-on review or explicit user readiness before consolidation.
   - If some variants are unreviewed, ask whether to exclude them, evaluate them first via `/uat --variant-evaluation` (check `.agents/project.json.enabled_packs` for `product-testing` — if `product-testing` is not enabled, recommend `/pack install product-testing` first), or include them as spec-only references.

3. **Present variation inventory**
   - List each variation with a one-line summary of its approach.
   - Note build status for each: built and reviewed, built but unreviewed, partially built, spec-only.
   - Note evidence status for each: result log present, user notes present, no evidence.
   - Use AskUserQuestion to confirm which variations the user has reviewed and wants to evaluate. Skip unreviewed or unbuilt variations unless the user wants to include them from spec alone.

4. **Interview per variation**
   - For each reviewed variation, ask using AskUserQuestion (1–3 questions per turn):
     - What works well in this variation? Name specific elements, regions, or interactions.
     - What doesn't work? What feels wrong, cluttered, sparse, or confusing?
     - Any specific component, region, or interaction you want to keep in the final design?
     - Anything to explicitly reject — never use this approach?
   - Record responses as structured annotations per variation:
     - **Keep**: elements the user wants in the final design (with source variation)
     - **Reject**: elements the user never wants (with source variation)
     - **Neutral**: elements the user has no strong opinion on

5. **Cross-variation synthesis**
   - Present a **Consolidation Matrix** showing each design dimension and which variation's approach the user preferred:

   | Design Element | Variation A | Variation B | Variation C | Winner |
   |---|---|---|---|---|
   | Container pattern | card grid | data table | list+detail | ? |
   | Detail view | modal | sidebar | full-page | ? |
   | Navigation | top-nav | side-nav | tabs | ? |
   | ... | ... | ... | ... | ... |

   - Fill in winners based on the interview. Mark conflicts where preferred choices from different dimensions are incompatible (e.g., user wants sidebar detail from Variation B but also wants the full-width card grid from Variation A — these compete for horizontal space).
   - For each conflict:
     - Present the tension clearly
     - Offer 2–3 resolution options with tradeoffs
     - State a recommendation
     - Use AskUserQuestion to resolve
   - Continue until every row in the matrix has a winner and all conflicts are resolved.

6. **Build consolidated prototype**
   - Merge the best elements from variation prototypes into a single runnable artifact at `prototypes/{topic}/consolidated/`.
   - The consolidated prototype must reflect:
     - Layout skeleton (regions, proportions, scroll behavior)
     - Primary content pattern (how items are displayed)
     - Detail view pattern (how full item details are accessed)
     - Navigation pattern and placement
     - Action placement (create, edit, delete, bulk, contextual)
     - Density and spacing approach
     - Responsive behavior at mobile, tablet, and desktop breakpoints
     - States rendering (empty, loading, error, partial, offline)
   - Use AskUserQuestion to confirm the consolidated design before building the prototype.

7. **Coverage checkpoint**
   - Verify every content requirement from `specs/ui-requirements-[topic].md` has a UI home in the consolidated spec.
   - Verify every user action has a placement (button, menu item, keyboard shortcut, or gesture).
   - Verify all states (empty, loading, error, partial, full, offline, permission-denied) are accounted for.
   - Flag any gaps and resolve via AskUserQuestion before writing.

## Deliverables

- Write the consolidated prototype to `prototypes/{topic}/consolidated/`.
- Write the consolidation interview log to `consolidate-variations-[topic]-interview.md`.

### Alignment Page

Build and attempt to open `alignment/consolidate-variations-{topic}.html` before writing or replacing consolidated prototype files, the consolidation interview log, or any final UI specification.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. Include evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and approval gates. Render the variation inventory, UAT evidence, keep/reject/neutral annotations, consolidation matrix, conflict resolutions, coverage checkpoint, and every proposed deliverable section with no context loss from source evidence or interview notes.

**Required inline questions.** Ask whether the evidence is sufficient for consolidation, whether any assumptions or confidence levels are wrong, whether the selected winners and rejected alternatives are acceptable, whether the proposed canonical file changes are approved, and whether any downstream route should remain blocked.

**Gate YAML contract.** Compile answers into YAML with `section`, `gate_type`, `status`, `decision`, `notes`, and `approved_file_changes` fields. The page must automatically attempt to copy the YAML to the clipboard, provide an explicit "Copy YAML" button, and fall back to selecting the textarea contents.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

## Constraints

- Do not proceed without evaluation evidence unless the user explicitly says they have reviewed the variants and is ready to converge.
- Do not pick winners without user input. Present the matrix and let the user decide.
- Do not ignore conflicts. If two preferred choices are spatially or functionally incompatible, surface the tension and resolve it explicitly.
- The consolidated spec must be at least as detailed as a `/ui-interview` output — implementation-ready, not a summary.
- Do not lose content requirements. Every data field, action, and state from the requirements spec must appear in the final design.
- Do not bias toward the first or last variation reviewed. Present them neutrally and let the user's feedback drive the outcome.
- When recommending a skill from another pack, verify the pack is installed via `.agents/project.json` `enabled_packs`. If not installed, prepend `/pack install <pack-name>` to the recommendation.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
