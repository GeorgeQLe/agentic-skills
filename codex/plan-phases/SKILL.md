---
name: plan-phases
description: Convert a finalized spec into a phased implementation plan written to tasks/todo.md (the execution source of truth) with milestones, TDD-first steps, and file-level scope.
---

# Plan Phases

Use this skill when the user has a completed spec and wants it broken into an implementation plan that can be executed phase by phase.

## Input

- Default spec path: `spec.md`
- If the user provides a path, use that instead.

## Workflow

1. Read the finalized spec.
2. Identify features, dependencies, and the critical path.
3. Split the work into sequential phases that are coherent, testable, and reasonably scoped.
4. For each phase, define ordered steps.
5. The first step of every phase must be writing failing tests.
6. Include milestone acceptance criteria with concrete, verifiable checks.
7. Write the full plan (all phases) to `tasks/todo.md`. Also write a copy to `docs/plan.md` as a historical artifact.

## Required Plan Shape

Write the plan to `tasks/todo.md` (and a copy to `docs/plan.md`) using this structure:

- Title and summary
- Phase overview table
- Repeated `## Phase N:` sections
- Within each phase:
  - `### Tests First`
  - `### Implementation`
  - `### Green`
  - `### Milestone`
- A closing `## Cross-Phase Concerns` section for integration tests and non-functional checks

## Constraints

- Every phase must start with failing tests.
- Every milestone must include specific acceptance criteria plus:
  - All phase tests pass
  - No regressions in previous phase tests
- Implementation steps should name the specific files or paths likely to change when that is knowable from the spec.
- Do not include implementation code in the plan.
- Keep the plan compatible with follow-on workflows that look for `## Phase N:` headers and `- Step N.X:` lines.
