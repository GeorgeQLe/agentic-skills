---
name: ui-consolidate
description: Compare multiple built UI variations, interview the user on what works and what doesn't, cherry-pick best elements, resolve conflicts, and produce a final consolidated implementation-ready UI specification
type: planning
version: 1.0.0
argument-hint: "[optional: topic, page, or path to variation specs]"
---

# UI Consolidate

Invoke as `/ui-consolidate`.

Use this skill after the user has built and reviewed multiple UI layout variations (typically generated via `/ux-variation --layout-mode` and built via `/run`). This skill compares the variations, interviews the user on what works and what doesn't in each one, cherry-picks the best elements, resolves conflicts where preferred choices are incompatible, and produces a single consolidated implementation-ready UI specification.

Users with manually built variations (not from the `/ux-variation` pipeline) can also use this skill directly — it only needs multiple implementations or specs to compare.

## Workflow

1. **Resolve context**
   - Read `.agents/project.json` if it exists.
   - Read `README.md`, `AGENTS.md`, `CLAUDE.md`, relevant `docs/`, `specs/`, `research/`, route files, component directories, and design artifacts when present.
   - Locate the variation spec: `specs/ui-layout-variations-[topic].md` or `specs/ux-variations-[topic].md`.
   - Locate the content requirements: `specs/ui-requirements-[topic].md` or equivalent content contract.
   - Locate built implementations: scan route files, component directories, and any variation-specific directories or branches.
   - If the variation spec or implementations cannot be found, ask the user to point to them.

2. **Present variation inventory**
   - List each variation with a one-line summary of its approach.
   - Note build status for each: built and reviewable, partially built, spec-only.
   - Use AskUserQuestion to confirm which variations the user has reviewed and wants to evaluate. Skip unreviewed or unbuilt variations unless the user wants to include them from spec alone.

3. **Interview per variation**
   - For each reviewed variation, ask using AskUserQuestion (1–3 questions per turn):
     - What works well in this variation? Name specific elements, regions, or interactions.
     - What doesn't work? What feels wrong, cluttered, sparse, or confusing?
     - Any specific component, region, or interaction you want to keep in the final design?
     - Anything to explicitly reject — never use this approach?
   - Record responses as structured annotations per variation:
     - **Keep**: elements the user wants in the final design (with source variation)
     - **Reject**: elements the user never wants (with source variation)
     - **Neutral**: elements the user has no strong opinion on

4. **Cross-variation synthesis**
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

5. **Draft consolidated spec**
   - Present the proposed final design as a structured summary:
     - Layout skeleton (regions, proportions, scroll behavior)
     - Primary content pattern (how items are displayed)
     - Detail view pattern (how full item details are accessed)
     - Navigation pattern and placement
     - Action placement (create, edit, delete, bulk, contextual)
     - Density and spacing approach
     - Responsive behavior at mobile, tablet, and desktop breakpoints
     - States rendering (empty, loading, error, partial, offline)
   - Use AskUserQuestion to confirm the consolidated design before writing deliverables.

6. **Coverage checkpoint**
   - Verify every content requirement from `specs/ui-requirements-[topic].md` has a UI home in the consolidated spec.
   - Verify every user action has a placement (button, menu item, keyboard shortcut, or gesture).
   - Verify all states (empty, loading, error, partial, full, offline, permission-denied) are accounted for.
   - Flag any gaps and resolve via AskUserQuestion before writing.

## Deliverables

- Write the consolidated UI specification to `specs/ui-final-[topic].md`.
- Write the consolidation interview log to `ui-consolidate-[topic]-interview.md`.

The consolidated UI specification must include:

- **Source attribution**: which variation each design decision came from
- **Consolidation matrix**: the full matrix with winners and rationale
- **Conflict resolutions**: each conflict, options considered, and resolution chosen
- **Design specification**:
  - Layout skeleton with regions and proportions
  - Primary content component and item anatomy
  - Detail view pattern and trigger
  - Navigation pattern, placement, and active-state behavior
  - Action inventory with placement and priority
  - Content-to-component mapping (every content requirement → UI component)
  - Spatial rules (gaps, padding, max-widths, fixed vs fluid dimensions)
  - Responsive behavior at mobile (≤640px), tablet (≤1024px), and desktop (>1024px)
  - States rendering for every identified state
  - Accessibility requirements (keyboard order, focus management, labels, contrast)
- **Implementation plan**: file list, creation order, estimated build time, and key decisions for the implementer

The interview log must include the variation inventory, per-variation interview responses (keep/reject/neutral), consolidation matrix, conflict resolutions, draft review, coverage checkpoint results, and all user responses.

After writing files, recommend `/run` or `/roadmap` for final implementation, or `/ui-interview` (full mode) if individual pages need deeper specification beyond what the consolidated layout covers.

## Constraints

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

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
