---
name: vertical-slice-splitter
description: Decompose a destination doc or spec into vertical-slice issue cards with a dependency DAG
type: planning
version: v0.3
required_conventions: [alignment-page, briefing-slides]
---

# Vertical Slice Splitter

Invoke as `$vertical-slice-splitter`.

Decompose a destination doc or spec into independently grabbable vertical-slice issue cards.

## Process

1. Read input document from `$ARGUMENTS`.
2. Explore codebase: file structure, layers, modules, test boundaries.
3. Identify layers the work crosses (DB, service, API, UI, infra, etc.).
4. Decompose into vertical slices — each crosses all relevant layers for its scope.
5. Reject horizontal-only slices. Slice 000 must be a tracer bullet: visible and testable end-to-end.
6. For each slice: title, description (2-5 sentences), testable acceptance criteria, dependency edges (`blocks`/`blocked-by`), label (`afk` | `human-review` | `pair`).
7. Build DAG, validate acyclic, identify parallel groups.
8. If `issues/` has existing content, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/issues/`.
9. Write `issues/DAG.md` (mermaid graph + summary table + parallel groups) and `issues/000-[slug].md` through `issues/NNN-[slug].md`.

## Issue File Format

```markdown
# [Title]

**Label:** afk | human-review | pair
**Blocks:** 001, 003
**Blocked by:** none

## Description
[2-5 sentences]

## Acceptance Criteria
- [ ] ...

## Notes
[Optional implementation hints]
```

## Constraints

- Every slice independently grabbable (one agent or session)
- No slice larger than one focused session
- First slice (000) is always the tracer bullet
- DAG must be acyclic
- `afk` slices must have unambiguous acceptance criteria (no taste judgment)


## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/vertical-slice-splitter-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `$vertical-slice-splitter`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/vertical-slice-splitter-{topic}.html`. By default, report results inline and write only this skill's normal durable artifacts; create an alignment page only when explicitly requested or when a concrete clarification/review need cannot be handled cleanly inline.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

