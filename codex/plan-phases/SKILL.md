---
name: plan-phases
description: Break a finalized spec into phases, steps, milestones, and test plans
---

# Plan Phases

Use this skill when the user has a completed spec and wants it broken into an implementation plan that can be executed phase by phase.

## Input

- Default spec location: `specs/` directory (or `spec.md` for backwards compatibility)
- If the user provides a path, use that instead.

## Workflow

1. Read the finalized spec.
2. Identify features, dependencies, and the critical path.
3. Split the work into sequential phases that are coherent, testable, and reasonably scoped.
4. For each phase, define ordered steps.
5. Determine the test strategy for each phase: `tdd` (tests first — stable APIs, business logic), `tests-after` (implement first, test in Green step — UI, prototyping), or `none` (config, docs, scaffolding). If `$ARGUMENTS` contains `--no-tdd`, use `tests-after` for all. If CLAUDE.md has a `## Test Strategy` section, use that default. Annotate each phase: `> Test strategy: tdd|tests-after|none`
6. For `tdd` phases, the first step must be writing failing tests. For `tests-after` phases, the Green step writes regression tests.
7. Include milestone acceptance criteria with concrete, verifiable checks.
8. Write the full plan (all phases) to `tasks/roadmap.md` — the single source of truth for the full phased plan.
8. Extract Phase 1 only into `tasks/todo.md` — the active working document for the current phase.
9. If the phase has manual tasks, write them to `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_` annotations. Only create the file when manual tasks exist.
10. Do NOT write `docs/plan.md`.

## Required Plan Shape

Write the full plan to `tasks/roadmap.md` using this structure, and extract the current phase into `tasks/todo.md`:

- Title and summary
- Phase overview table
- Repeated `## Phase N:` sections
- Within each phase (structure depends on test strategy annotation):
  - `### Tests First` (`tdd` only)
  - `### Implementation`
  - `### Green` (`tdd` and `tests-after` only)
  - `### Milestone`
- A closing `## Cross-Phase Concerns` section for integration tests and non-functional checks

## Constraints

- Every `tdd` phase must start with failing tests. `tests-after` phases write tests in the Green step. `none` phases omit test steps.
- Every `tdd` and `tests-after` milestone must include "All phase tests pass" and "No regressions." `none` milestones omit test criteria.
- Implementation steps should name the specific files or paths likely to change when that is knowable from the spec.
- Do not include implementation code in the plan.
- Classify each step as **automated** (Claude can execute) or **manual** (requires human action — DNS config, browser testing, OAuth setup, deployment approvals, etc.). Manual tasks go in `tasks/manual-todo.md`, NOT in `tasks/todo.md`.
- Keep the plan compatible with follow-on workflows that look for `## Phase N:` headers and `- Step N.X:` lines.
- `tasks/roadmap.md` is the source of truth for the full plan. `tasks/todo.md` holds only the current phase. Do NOT put plans in `docs/plan.md`.
