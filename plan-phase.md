---
description: Break a finalized spec into phases, steps, milestones, and TDD test plans
argument-hint: [path-to-spec, defaults to spec.md]
---

# Phase Planner

Take a finalized specification (output of /plan-interview) and decompose it into a phased implementation plan with TDD support.

## Input

Read the spec at `$ARGUMENTS` (default: `spec.md` in the current directory). This spec should already be validated and finalized from a /plan-interview session.

## Planning Process

### 1. Analyze the Spec
- Identify all features, components, and systems described in the spec.
- Map dependencies between components (what must exist before other things can be built).
- Identify the critical path.

### 2. Define Phases
Split the spec into sequential phases ordered by dependency and priority. Each phase should:
- Be a coherent, deployable/testable unit of work.
- Build on the previous phase's output.
- Be small enough to complete in a focused session (prefer more smaller phases over fewer large ones).

### 3. Break Each Phase into Steps
For each phase, define ordered steps. **The first step of every phase must be writing tests.**

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
- Step N.3: [Next implementation task]
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
```

### 4. TDD Requirements
- Every phase starts with writing tests BEFORE implementation code.
- Tests should be specific and tied to the phase's acceptance criteria.
- Include the test file paths and describe what each test validates.
- The milestone for each phase must include "All phase tests pass" and "No regressions in previous phase tests."
- If the project doesn't have a test framework set up, Phase 1 Step 1 should be setting up the test infrastructure.

### 5. Cross-Phase Concerns
After all phases, add a section for:
- **Integration tests**: Tests that span multiple phases / features, to be written after relevant phases complete.
- **Non-functional requirements**: Performance, security, accessibility checks and when they should run.

## Output

Write the phased plan to `docs/plan.md` (create `docs/` if it doesn't exist) with this structure:

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

Also create/update `tasks/todo.md` with Phase 1's steps as the active work items, so the next session can pick it up immediately.

## Constraints
- Every phase MUST have a milestone with specific, checkable acceptance criteria — not vague statements like "works correctly" but concrete conditions like "POST /api/items returns 201 with valid payload and persists to database."
- Every phase MUST start with writing failing tests.
- Phases must be ordered so each builds on completed prior phases.
- The plan must be compatible with `/run-phases` — use `## Phase N:` headers and `- Step N.X:` format.
- Do not include implementation code in the plan — only describe what to build and what to test.
- If the spec references existing code or infrastructure, note what already exists vs. what needs to be created.
- Plans go in `docs/`, active work goes in `tasks/todo.md`. Do NOT put plans in CLAUDE.md.
