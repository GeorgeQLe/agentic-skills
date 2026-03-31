---
name: plan-phases
description: Break a finalized spec into phases, steps, milestones, and TDD test plans
type: planning
version: 1.0.0
argument-hint: [phase-number | path-to-spec]
---

# Phase Planner

Decompose work into TDD implementation steps with file-level granularity. Operates in two modes depending on whether a roadmap already exists.

## Input

Check for `tasks/roadmap.md` first, then read `$ARGUMENTS`.

### Mode A: Roadmap exists (typical — called just-in-time by `/ship`, `/run`, or manually)
The roadmap already defines phases, goals, scope, and acceptance criteria. Your job is to fill in the **TDD steps and file-level detail** for a specific phase. This is typically invoked just-in-time when a phase is about to start, so implementation detail benefits from context gained during prior phases.

- If `$ARGUMENTS` is a number (e.g., `2`), plan that phase.
- If `$ARGUMENTS` is empty, plan the **first phase that has acceptance criteria but no steps** (no `### Tests First` section yet).
- Read specs from `specs/` (or `spec.md`) for detailed requirements referenced by the phase's scope.
- Read the codebase as needed to understand existing code, patterns, and what files to modify.

### Mode B: No roadmap (standalone — called directly after `/plan-interview`)
If `tasks/roadmap.md` does not exist, fall back to the original behavior: read specs from `$ARGUMENTS` (default: `specs/` directory or `spec.md`), define phases, and produce the full plan.

1. Identify all features, components, and systems described in the spec.
2. Map dependencies between components (what must exist before other things can be built).
3. Identify the critical path.
4. Split the spec into sequential phases ordered by dependency and priority. Each phase should:
   - Be a coherent, deployable/testable unit of work.
   - Build on the previous phase's output.
   - Be small enough to complete in a focused session (prefer more smaller phases over fewer large ones).

## Planning Process (both modes)

### Break the Phase into Steps
For the target phase, define ordered steps. **The first step of every phase must be writing tests.**

Each phase follows this structure:

```
## Phase N: [Title]

### Tests First
- Step N.1: Write failing tests for this phase's acceptance criteria
  - List specific test cases to write
  - Tests should cover happy path, edge cases, and error cases
  - Tests MUST fail at this point (red)

### Implementation
- Step N.2: [First implementation task]
  - Files: create `path/to/new.ts`, modify `path/to/existing.ts`
- Step N.3: [Next implementation task]
  - Files: modify `path/to/file.ts`
- ...

### Green
- Step N.X: Run tests and verify all pass (green)
- Step N.Y: Refactor if needed while keeping tests green

### Milestone: [Phase N Milestone Name]
**Acceptance Criteria:**
- [ ] [Specific, verifiable criterion 1]
- [ ] [Specific, verifiable criterion 2]
- [ ] [Specific, verifiable criterion 3]
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests

**On Completion** (fill in when phase is done):
- Deviations from plan: [none, or describe]
- Tech debt / follow-ups: [none, or list]
- Ready for next phase: yes/no
```

### TDD Requirements
- Every phase starts with writing tests BEFORE implementation code.
- Tests should be specific and tied to the phase's acceptance criteria.
- Include the test file paths and describe what each test validates.
- The milestone for each phase must include "All phase tests pass" and "No regressions in previous phase tests."
- If the project doesn't have a test framework set up, Phase 1 Step 1 should be setting up the test infrastructure.

### File-Level Granularity
- Each implementation step should list the specific files to create, modify, or delete.
- This gives the executing agent clear scope and prevents steps from becoming unbounded.

### Cross-Phase Concerns (Mode B only)
After all phases, add a section for:
- **Integration tests**: Tests that span multiple phases / features, to be written after relevant phases complete.
- **Non-functional requirements**: Performance, security, accessibility checks and when they should run.

## Output

### Mode A (roadmap exists)
1. **Update `tasks/roadmap.md`** — insert the TDD steps into the target phase. Preserve all other phases and content. Do not overwrite the phase's Goal, Scope, or Acceptance Criteria — only add the Tests First / Implementation / Green / Milestone structure beneath them.
2. **Write `tasks/todo.md`** — extract the target phase as a standalone working document. Include enough context (project name, current phase number, total phases) so a fresh session can orient itself without reading `tasks/roadmap.md`. If `tasks/todo.md` already has in-progress work for a different phase, ask the user before overwriting.

### Mode B (no roadmap)
1. **`tasks/roadmap.md`** — the single source of truth for the **full phased plan**. Contains all phases and steps. This is a living document — milestones get checked off as phases complete.
2. **`tasks/todo.md`** — contains only the **current phase** (Phase 1 initially). This is the active working document that `/run` reads. It gets overwritten on phase transitions.

Do NOT write `docs/plan.md`. The roadmap replaces it.

### `tasks/roadmap.md` structure (Mode B)

```markdown
# Implementation Plan: [Project Name]

> Generated from: [spec file path]
> Date: [current date]
> Total Phases: [N]

## Summary
[1-2 sentence overview of the implementation approach]

## Phase Overview
| Phase | Title | Key Deliverable | Est. Complexity |
|-------|-------|-----------------|-----------------|
| 1     | ...   | ...             | S / M / L       |
| 2     | ...   | ...             | S / M / L       |

---

## Phase 1: [Title]
### Tests First
...
### Implementation
...
### Green
...
### Milestone: [Name]
**Acceptance Criteria:**
...

---

[Repeat for each phase]

---

## Cross-Phase Concerns
### Integration Tests
...
### Non-Functional Requirements
...
```

### `tasks/todo.md` structure

Extract the target phase from the roadmap into `tasks/todo.md` as a standalone working document. Include enough context (project name, current phase number, total phases) so a fresh session can orient itself without reading `tasks/roadmap.md`.

## Constraints
- Every phase MUST have a milestone with specific, checkable acceptance criteria — not vague statements like "works correctly" but concrete conditions like "POST /api/items returns 201 with valid payload and persists to database."
- Every phase MUST start with writing failing tests.
- Phases must be ordered so each builds on completed prior phases.
- The plan must be compatible with `/run` and `/ship` — use `## Phase N:` headers and `- Step N.X:` format.
- Do not include implementation code in the plan — only describe what to build and what to test.
- If the spec references existing code or infrastructure, note what already exists vs. what needs to be created.
- `tasks/roadmap.md` is the source of truth for the full plan. `tasks/todo.md` holds only the current phase. Do NOT put plans in CLAUDE.md or `docs/plan.md`.
- In Mode A, do NOT restructure phases, reorder them, or change acceptance criteria. Those decisions belong to `/roadmap`. Only add implementation detail.
