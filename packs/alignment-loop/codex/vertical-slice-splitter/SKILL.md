---
name: vertical-slice-splitter
description: Decompose a destination doc or spec into vertical-slice issue cards with a dependency DAG
type: planning
version: 1.0.0
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

## Alignment Page

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/vertical-slice-splitter-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/vertical-slice-splitter-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/vertical-slice-splitter-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

After writing: "Grab the first unblocked `afk` slice with `$run issues/000-[slug].md`."
