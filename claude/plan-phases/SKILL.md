---
name: plan-phases
description: Break a finalized spec into phases, steps, milestones, and test plans
type: planning
version: 1.0.0
argument-hint: [phase-number | path-to-spec] [--no-tdd]
---

# Phase Planner

Decompose work into implementation steps with file-level granularity. Operates in two modes depending on whether a roadmap already exists.

## Input

Check for `tasks/roadmap.md` first, then read `$ARGUMENTS`.

### Mode A: Roadmap exists (typical — called just-in-time by `/ship`, `/run`, or manually)
The roadmap already defines phases, goals, scope, and acceptance criteria. Your job is to fill in the **implementation steps and file-level detail** for a specific phase. This is typically invoked just-in-time when a phase is about to start, so implementation detail benefits from context gained during prior phases.

- If `$ARGUMENTS` is a number (e.g., `2`), plan that phase.
- If `$ARGUMENTS` is empty, plan the **first phase that has acceptance criteria but no steps** (no `### Tests First` or `### Implementation` section yet).
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
For the target phase, define ordered steps.

### Determine Test Strategy

For each phase, classify its test strategy. Check in order:

1. If `$ARGUMENTS` contains `--no-tdd`, use `tests-after` for all phases.
2. If CLAUDE.md has a `## Test Strategy` section, read the project default.
3. Otherwise, classify each phase individually:
   - **`tdd`**: Stable interfaces, APIs, data models, business logic with known contracts, payment/auth flows
   - **`tests-after`**: UI components, prototyping, exploratory features, design-in-flux work
   - **`none`**: Pure config, docs, scaffolding, infra setup, CI/CD changes

Annotate each phase header with: `> Test strategy: tdd|tests-after|none`

Each phase follows a structure based on its test strategy:

**For `tdd` phases:**
```
## Phase N: [Title]
> Test strategy: tdd

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
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests
```

**For `tests-after` phases:**
```
## Phase N: [Title]
> Test strategy: tests-after

### Implementation
- Step N.1: [First implementation task]
  - Files: create `path/to/new.ts`, modify `path/to/existing.ts`
- Step N.2: [Next implementation task]
  - Files: modify `path/to/file.ts`
- ...

### Green
- Step N.X: Write regression tests covering acceptance criteria
- Step N.Y: Run all tests and verify they pass
- Step N.Z: Refactor if needed while keeping tests green

### Milestone: [Phase N Milestone Name]
**Acceptance Criteria:**
- [ ] [Specific, verifiable criterion 1]
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests
```

**For `none` phases:**
```
## Phase N: [Title]
> Test strategy: none

### Implementation
- Step N.1: [First implementation task]
  - Files: create `path/to/new.ts`, modify `path/to/existing.ts`
- ...

### Milestone: [Phase N Milestone Name]
**Acceptance Criteria:**
- [ ] [Specific, verifiable criterion 1]
```

**On Completion** (fill in when phase is done — all strategies):
- Deviations from plan: [none, or describe]
- Tech debt / follow-ups: [none, or list]
- Ready for next phase: yes/no

### Test Requirements
- **`tdd` phases**: Start with writing tests BEFORE implementation. Tests tied to acceptance criteria. Include test file paths.
- **`tests-after` phases**: Implementation comes first. The Green step writes regression tests covering the acceptance criteria.
- **`none` phases**: No test steps. Milestone omits "All phase tests pass" criterion.
- All `tdd` and `tests-after` milestones must include "All phase tests pass" and "No regressions in previous phase tests."
- If the project doesn't have a test framework set up, Phase 1 Step 1 should be setting up the test infrastructure.

### File-Level Granularity
- Each implementation step should list the specific files to create, modify, or delete.
- This gives the executing agent clear scope and prevents steps from becoming unbounded.

### Manual Task Classification
Classify each step as **automated** (Claude can execute) or **manual** (requires human action). Manual tasks include:
- DNS configuration, domain setup, SSL certificates
- Browser/device testing, visual QA
- OAuth/API credential setup with third-party services
- Deployment approvals, environment provisioning
- Signing up for services, billing setup
- Any step requiring a GUI, physical device, or human judgment that cannot be scripted

Manual tasks MUST NOT appear in `tasks/todo.md`. They go in `tasks/manual-todo.md` instead.

### Cross-Phase Concerns (Mode B only)
After all phases, add a section for:
- **Integration tests**: Tests that span multiple phases / features, to be written after relevant phases complete.
- **Non-functional requirements**: Performance, security, accessibility checks and when they should run.

## Output

### Mode A (roadmap exists)
1. **Update `tasks/roadmap.md`** — insert the implementation steps into the target phase. Preserve all other phases and content. Do not overwrite the phase's Goal, Scope, or Acceptance Criteria — only add the appropriate structure (Tests First / Implementation / Green / Milestone for `tdd`; Implementation / Green / Milestone for `tests-after`; Implementation / Milestone for `none`) beneath them.
2. **Write `tasks/todo.md`** — extract the target phase as a standalone working document. Include enough context (project name, current phase number, total phases) so a fresh session can orient itself without reading `tasks/roadmap.md`. If `tasks/todo.md` already has in-progress work for a different phase, ask the user before overwriting.
3. **Write `tasks/manual-todo.md`** (if the phase has manual tasks) — extract manual tasks for the target phase. Use this format:
   ```markdown
   # Manual Tasks — [Project Name]

   > Phase: N — [Phase Title]
   > These tasks require human action. Check them off as you complete them.

   ## Pre-Phase / Setup
   - [ ] [task] _(blocks: Step N.X)_

   ## During Phase
   - [ ] [task] _(after: Step N.X)_

   ## Post-Phase / Verification
   - [ ] [task]
   ```
   - `_(blocks: Step N.X)_` = must be done before that automated step
   - `_(after: Step N.X)_` = should be done after that automated step
   - No annotation = do anytime during the phase
   - Only create this file when manual tasks exist — no empty files.

### Mode B (no roadmap)
1. **`tasks/roadmap.md`** — the single source of truth for the **full phased plan**. Contains all phases and steps. This is a living document — milestones get checked off as phases complete.
2. **`tasks/todo.md`** — contains only the **current phase** (Phase 1 initially). This is the active working document that `/run` reads. It gets overwritten on phase transitions.
3. **`tasks/manual-todo.md`** — contains manual tasks for the current phase (if any). Same format as Mode A step 3 above. Only created when manual tasks exist.

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
| Phase | Title | Key Deliverable | Test Strategy | Est. Complexity |
|-------|-------|-----------------|---------------|-----------------|
| 1     | ...   | ...             | tdd           | S / M / L       |
| 2     | ...   | ...             | tests-after   | S / M / L       |

---

## Phase 1: [Title]
> Test strategy: tdd|tests-after|none

### Tests First (tdd only)
...
### Implementation
...
### Green (tdd and tests-after only)
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
- Every `tdd` phase must start with writing failing tests. `tests-after` phases write tests in the Green step.
- Phases must be ordered so each builds on completed prior phases.
- The plan must be compatible with `/run` and `/ship` — use `## Phase N:` headers and `- Step N.X:` format.
- Do not include implementation code in the plan — only describe what to build and what to test.
- If the spec references existing code or infrastructure, note what already exists vs. what needs to be created.
- `tasks/roadmap.md` is the source of truth for the full plan. `tasks/todo.md` holds only the current phase. Do NOT put plans in CLAUDE.md or `docs/plan.md`.
- Manual tasks MUST NOT appear in `tasks/todo.md` — they belong in `tasks/manual-todo.md` only.
- In Mode A, do NOT restructure phases, reorder them, or change acceptance criteria. Those decisions belong to `/roadmap`. Only add implementation detail.
