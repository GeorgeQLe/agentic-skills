---
name: vertical-slice-splitter
description: Decompose a destination doc or spec into vertical-slice issue cards with a dependency DAG
type: planning
version: 1.0.0
argument-hint: "[path to destination doc or spec]"
---

# Vertical Slice Splitter

Decompose a destination doc or spec into independently grabbable vertical-slice issue cards.

## Process

1. **Read input document** from `$ARGUMENTS` (destination doc or spec).
2. **Explore codebase:** file structure, layers, modules, existing test boundaries.
3. **Identify layers** the work crosses (DB, service, API, UI, infra, etc.).
4. **Decompose into vertical slices** — each slice crosses all relevant layers for its scope.
5. **Reject horizontal-only slices.** Enforce tracer-bullet: slice 000 must produce something visible and testable end-to-end.
6. **For each slice determine:**
   - Title, description (2-5 sentences), acceptance criteria (testable)
   - Dependencies: `blocks` and `blocked-by` (referencing other slice IDs)
   - Label: `afk` | `human-review` | `pair`
7. **Build DAG**, validate acyclic, identify parallel groups.
8. **Check `issues/` directory.** If it has existing content, ask user: archive or append.
9. **Write files:**
   - `issues/DAG.md` — mermaid graph + summary table + parallel group annotations
   - `issues/000-[slug].md` through `issues/NNN-[slug].md`

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
- `afk` slices must have unambiguous acceptance criteria (no taste judgment required)

## Alignment Page

When this skill writes or updates durable planning, research, spec, task, prototype, report, or document deliverables, also build a custom HTML alignment page at `alignment/vertical-slice-splitter-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/vertical-slice-splitter-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Shipping

Commit and push all issue files.

## Next-Skill Routing

After writing: "Grab the first unblocked `afk` slice with `/run issues/000-[slug].md`."
