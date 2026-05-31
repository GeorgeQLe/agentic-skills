---
name: consolidate-variations
description: Compare multiple built UI variations after UAT evidence, interview the user on what works and what does not, resolve conflicts, and produce a final implementation-ready UI specification
type: planning
version: v0.7
argument-hint: "[optional: topic, page, or path to variation specs]"
---

# Consolidate Variations

Invoke as `$consolidate-variations`.

Use this skill after the user has built and evaluated multiple UI layout variations (typically generated via `$ux-variations --layout-mode`, built via `$exec`, and evaluated via `$uat --variant-evaluation` (check `.agents/project.json.enabled_packs` for `product-testing` — if `product-testing` is not enabled, recommend `$pack install product-testing` first)). This skill compares the variations, interviews the user on what works and what does not in each one, cherry-picks the best elements, resolves conflicts where preferred choices are incompatible, and produces a single consolidated implementation-ready UI specification.

Users with manually built variations can also use this skill directly, but consolidation should not happen before the user has reviewed the variants and captured evidence.

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
   - If no evaluation evidence exists and the user has not explicitly said they already reviewed the variants and is ready to converge, stop and recommend `$uat --variant-evaluation` (check `.agents/project.json.enabled_packs` for `product-testing` — if `product-testing` is not enabled, recommend `$pack install product-testing` first).
   - Do not infer a winner from specs alone. Built variants need hands-on review or explicit user readiness before consolidation.
   - If some variants are unreviewed, ask whether to exclude them, evaluate them first via `$uat --variant-evaluation` (check `.agents/project.json.enabled_packs` for `product-testing` — if `product-testing` is not enabled, recommend `$pack install product-testing` first), or include them as spec-only references.

3. **Present variation inventory**
   - List each variation with a one-line summary of its approach.
   - Note build status for each: built and reviewed, built but unreviewed, partially built, spec-only.
   - Note evidence status for each: result log present, user notes present, no evidence.
   - Confirm which variations the user wants to consolidate.

4. **Interview per variation**
   - For each reviewed variation, ask one primary decision question per turn by default. Use short follow-up bullets only when they clarify the same variation decision, not to batch unrelated questions:
     - What works well in this variation? Name specific elements, regions, or interactions.
     - What does not work? What feels wrong, cluttered, sparse, or confusing?
     - Any specific component, region, or interaction to keep in the final design?
     - Anything to explicitly reject and never use?
   - Record responses as structured annotations per variation:
     - **Keep**: elements the user wants in the final design, with source variation
     - **Reject**: elements the user never wants, with source variation
     - **Neutral**: elements the user has no strong opinion on

5. **Cross-variation synthesis**
   - Present a **Consolidation Matrix** showing each design dimension and which variation's approach the user preferred:

   | Design Element | Variation A | Variation B | Variation C | Winner |
   |---|---|---|---|---|
   | Container pattern | card grid | data table | list + detail | ? |
   | Detail view | modal | sidebar | full-page | ? |
   | Navigation | top nav | side nav | tabs | ? |

   - Fill in winners based on UAT evidence and interview responses.
   - Mark conflicts where preferred choices from different dimensions are incompatible.
   - For each conflict, present the tension, offer 2-3 resolution options with tradeoffs, state a recommendation, and ask the user to resolve it.
   - Continue until every row in the matrix has a winner and all conflicts are resolved.

6. **Build consolidated prototype**
   - Merge the best elements from variation prototypes into a single runnable artifact at `prototypes/{topic}/consolidated/`.
   - The consolidated prototype must reflect:
     - Layout skeleton: regions, proportions, scroll behavior
     - Primary content pattern
     - Detail view pattern
     - Navigation pattern and placement
     - Action placement
     - Density and spacing approach
     - Responsive behavior at mobile, tablet, and desktop breakpoints
     - States rendering
   - Ask the user to confirm the consolidated design before building the prototype.

7. **Coverage checkpoint**
   - Verify every content requirement from `specs/ui-requirements-[topic].md` has a UI home in the consolidated spec.
   - Verify every user action has a placement: button, menu item, keyboard shortcut, or gesture.
   - Verify all states are accounted for: empty, loading, error, partial, full, offline, permission-denied.
   - Flag any gaps and resolve them before writing.

## Deliverables

- Write the consolidated prototype to `prototypes/{topic}/consolidated/`.
- Write the consolidation interview log to `consolidate-variations-[topic]-interview.md`.

### Alignment Page

Build and attempt to open `alignment/consolidate-variations-{topic}.html` before writing or replacing consolidated prototype files, the consolidation interview log, or any final UI specification.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. Include evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and approval gates. Render the variation inventory, UAT evidence, keep/reject/neutral annotations, consolidation matrix, conflict resolutions, coverage checkpoint, and every proposed deliverable section with no context loss from source evidence or interview notes.

**Required inline questions.** Ask whether the evidence is sufficient for consolidation, whether any assumptions or confidence levels are wrong, whether the selected winners and rejected alternatives are acceptable, whether the proposed canonical file changes are approved, and whether any downstream route should remain blocked.

**Section feedback controls.** Add lightweight section-feedback controls to every major section of the page: approve as-is, reject or flag a concern, and clarification needed. Selecting a control reveals a multi-line section-feedback textarea placed directly under or beside the thumbs up/down/clarify controls. This textarea is separate from gate-question text inputs, so it still appears near the feedback controls even when the same section also has required gate questions with their own text boxes. These controls are optional for final approval and do not replace required gate questions. They also power the separate feedback-only YAML path so the user can send concerns or clarification requests before answering every required gate question.

**Feedback-only YAML contract.** Do not place a global feedback-only compile/output banner at the bottom of the page. When a section-feedback control is selected, show local "Compile Feedback YAML" and "Copy YAML" controls plus a read-only YAML textarea directly under that section's feedback textarea. Enable the local feedback compile as soon as that section feedback is set, even if required inline gate questions are unanswered. The local feedback compile generates YAML with `alignment_page: alignment/{skill-name}-{topic}.html`, `feedback_status: revision-request`, `approval_status: not-approved`, `unanswered_required_questions`, and a `section_feedback` list containing the single selected section-feedback entry for that local control. Populate `alignment_page` from the known repo-relative output path used to write the HTML page, not from the page title, browser URL, window location, or any display label. The feedback entry uses `section`, `feedback` (`up`, `down`, or `needs-clarification`), optional `notes` from that section's feedback textarea, and `requested_agent_action` (`accept-as-is`, `investigate-and-revise`, or `clarify-before-approval`). For `down` and `needs-clarification` feedback, the YAML must tell the agent to evaluate the feedback, investigate further when needed, and contextually amend the HTML alignment page before asking again for final approval answers. Copy and display this feedback YAML locally with the same clipboard retry and textarea fallback behavior as final gate YAML.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that compiles final approval answers into YAML with `alignment_page: alignment/{skill-name}-{topic}.html`, `approval_status: ready-for-agent-review`, `section`, `gate_type`, `status`, `decision`, `notes`, and `approved_file_changes` fields. Keep this bottom compile area for final approval answers; feedback-only YAML output belongs under each selected section feedback textarea, not in the bottom area. Populate `alignment_page` from the known repo-relative output path used to write the HTML page, not from the page title, browser URL, window location, or any display label. The final approval button remains disabled until every required question has a selection. The final YAML may also include any section feedback the user set, using the feedback-only YAML `section_feedback` shape. The page must automatically attempt to copy the YAML to the clipboard, provide an explicit "Copy YAML" button, and fall back to selecting the textarea contents.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page. Ask the user to review the page and provide either feedback-only YAML for concerns/clarification or final compiled YAML answers when ready. Do not require the user to answer every gate before sending negative feedback or clarification needs. When feedback-only YAML is provided, treat it as a revision request: evaluate the feedback, investigate further when needed, archive and amend the HTML page contextually, highlight the changes, and ask again for review. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after final compiled YAML has been provided and the approved artifacts have been written or updated.

## Constraints

- Do not proceed without evaluation evidence unless the user explicitly says they have reviewed the variants and is ready to converge.
- Do not pick winners without user input. Present the matrix and let the user decide.
- Do not ignore conflicts. If two preferred choices are spatially or functionally incompatible, surface the tension and resolve it explicitly.
- The consolidated spec must be at least as detailed as a `$ui-interview` output — implementation-ready, not a summary.
- Do not lose content requirements. Every data field, action, and state from the requirements spec must appear in the final design.
- Do not bias toward the first or last variation reviewed. Present them neutrally and let the user's feedback and evaluation evidence drive the outcome.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
