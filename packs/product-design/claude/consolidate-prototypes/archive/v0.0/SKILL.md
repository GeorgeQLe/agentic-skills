---
name: consolidate-variations
description: Compare multiple built UI variations, interview the user on what works and what doesn't, cherry-pick best elements, resolve conflicts, and produce a final consolidated implementation-ready UI specification
type: planning
version: v0.0
argument-hint: "[optional: topic, page, or path to variation specs]"
---

# Consolidate Variations

Invoke as `/consolidate-variations`.

Use this skill after the user has built and evaluated multiple UI layout variations (typically generated via `/ux-variations --layout-mode`, built via `/run`, and evaluated via `/uat --variant-evaluation`). This skill compares the variations, interviews the user on what works and what doesn't in each one, cherry-picks the best elements, resolves conflicts where preferred choices are incompatible, and produces a single consolidated implementation-ready UI specification.

Users with manually built variations (not from the `/ux-variations` pipeline) can also use this skill directly, but consolidation should not happen before the user has reviewed the variants and captured evidence.

## Workflow

1. **Resolve context**
   - Read `.agents/project.json` if it exists.
   - Read `README.md`, `AGENTS.md`, `CLAUDE.md`, relevant `docs/`, `specs/`, `research/`, route files, component directories, and design artifacts when present.
   - Locate the variation spec: `specs/ui-layout-variations-[topic].md` or `specs/ux-variations-[topic].md`.
   - Locate the content requirements: `specs/ui-requirements-[topic].md` or equivalent content contract.
   - Locate variant evaluation evidence: `research/uat-variant-evaluation-[topic].md`, `research/uat-plan.md` result logs, screenshots, notes, recordings, or explicit user-provided review notes.
   - Locate built implementations: scan route files, component directories, and any variation-specific directories or branches.
   - If the variation spec or implementations cannot be found, ask the user to point to them.

2. **Evidence gate**
   - If no evaluation evidence exists and the user has not explicitly said they already reviewed the variants and is ready to converge, stop and recommend `/uat --variant-evaluation`.
   - Do not infer a winner from specs alone. Built variants need hands-on review or explicit user readiness before consolidation.
   - If some variants are unreviewed, ask whether to exclude them, evaluate them first via `/uat --variant-evaluation`, or include them as spec-only references.

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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/consolidate-variations-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.

**Consolidation-specific gates.** Render UAT evidence coverage, variation verdicts, selected concept, rejected alternatives, unresolved assumptions, artifact destination, proposed file changes, and coverage checkpoint as gates.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/consolidate-variations-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Do not proceed without evaluation evidence unless the user explicitly says they have reviewed the variants and is ready to converge.
- Do not pick winners without user input. Present the matrix and let the user decide.
- Do not ignore conflicts. If two preferred choices are spatially or functionally incompatible, surface the tension and resolve it explicitly.
- The consolidated spec must be at least as detailed as a `/ui-interview` output — implementation-ready, not a summary.
- Do not lose content requirements. Every data field, action, and state from the requirements spec must appear in the final design.
- Do not bias toward the first or last variation reviewed. Present them neutrally and let the user's feedback drive the outcome.

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
