---
name: ui-consolidate
description: Compare multiple built UI variations after UAT evidence, interview the user on what works and what does not, resolve conflicts, and produce a final implementation-ready UI specification
type: planning
version: 1.0.0
argument-hint: "[optional: topic, page, or path to variation specs]"
---

# UI Consolidate

Invoke as `$ui-consolidate`.

Use this skill after the user has built and evaluated multiple UI layout variations, typically generated via `$ux-variation --layout-mode`, built via `$run`, and evaluated via `$uat --variant-evaluation`. This skill compares the variations, interviews the user on what works and what does not in each one, cherry-picks the best elements, resolves conflicts where preferred choices are incompatible, and produces a single consolidated implementation-ready UI specification.

Users with manually built variations can also use this skill directly, but consolidation should not happen before the user has reviewed the variants and captured evidence.

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
   - If no evaluation evidence exists and the user has not explicitly said they already reviewed the variants and is ready to converge, stop and recommend `$uat --variant-evaluation`.
   - Do not infer a winner from specs alone. Built variants need hands-on review or explicit user readiness before consolidation.
   - If some variants are unreviewed, ask whether to exclude them, evaluate them first via `$uat --variant-evaluation`, or include them as spec-only references.

3. **Present variation inventory**
   - List each variation with a one-line summary of its approach.
   - Note build status for each: built and reviewed, built but unreviewed, partially built, spec-only.
   - Note evidence status for each: result log present, user notes present, no evidence.
   - Confirm which variations the user wants to consolidate.

4. **Interview per variation**
   - For each reviewed variation, ask 1-3 focused questions per turn:
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

6. **Draft consolidated spec**
   - Present the proposed final design as a structured summary:
     - Layout skeleton: regions, proportions, scroll behavior
     - Primary content pattern
     - Detail view pattern
     - Navigation pattern and placement
     - Action placement
     - Density and spacing approach
     - Responsive behavior at mobile, tablet, and desktop breakpoints
     - States rendering
   - Ask the user to confirm the consolidated design before writing deliverables.

7. **Coverage checkpoint**
   - Verify every content requirement from `specs/ui-requirements-[topic].md` has a UI home in the consolidated spec.
   - Verify every user action has a placement: button, menu item, keyboard shortcut, or gesture.
   - Verify all states are accounted for: empty, loading, error, partial, full, offline, permission-denied.
   - Flag any gaps and resolve them before writing.

## Deliverables

- Write the consolidated UI specification to `specs/ui-final-[topic].md`.
- Write the consolidation interview log to `ui-consolidate-[topic]-interview.md`.

The consolidated UI specification must include:

- Source attribution: which variation each design decision came from
- UAT/evaluation evidence summary
- Consolidation matrix with winners and rationale
- Conflict resolutions: options considered and resolution chosen
- Design specification:
  - Layout skeleton with regions and proportions
  - Primary content component and item anatomy
  - Detail view pattern and trigger
  - Navigation pattern, placement, and active-state behavior
  - Action inventory with placement and priority
  - Content-to-component mapping
  - Spatial rules: gaps, padding, max-widths, fixed vs. fluid dimensions
  - Responsive behavior at mobile (<=640px), tablet (<=1024px), and desktop (>1024px)
  - States rendering for every identified state
  - Accessibility requirements
- Implementation plan: file list, creation order, estimated build time, and key decisions for the implementer

The interview log must include the variation inventory, evidence gate result, per-variation interview responses, consolidation matrix, conflict resolutions, draft review, coverage checkpoint results, and all user responses.

After writing files, recommend `$design-system` to lock visual tokens into a machine-readable `DESIGN.md` before implementation begins. If the user wants to skip token extraction, recommend `$run` or `$roadmap` for final implementation, or `$ui-interview` if individual pages need deeper specification beyond what the consolidated layout covers.

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

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
