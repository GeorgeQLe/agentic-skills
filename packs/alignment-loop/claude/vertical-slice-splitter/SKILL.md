---
name: vertical-slice-splitter
description: Decompose a destination doc or spec into vertical-slice issue cards with a dependency DAG
type: planning
version: v0.2
required_conventions: [alignment-page]
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

Follow `ALIGNMENT-PAGE.md` in this skill's directory for optional alignment-page behavior and output path. By default, report results inline and write only this skill's normal durable artifacts; create an alignment page only when explicitly requested or when a concrete clarification/review need cannot be handled cleanly inline.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

