---
name: plan-phase
description: Decompose a single roadmap phase into implementation steps, tests, and file-level detail
type: planning
version: 2.0.0
argument-hint: "[phase-number] [--no-tdd]"
---

# Plan Phase

Fill in the implementation detail for **one** phase of `tasks/roadmap.md`. This skill is invoked just-in-time — either manually, by `/roadmap` (to seed Phase 1), or by `/ship` and `/run` when a new phase begins. Implementation detail is generated when a phase starts, not upfront, because context from earlier phases informs later decisions.

## Prerequisites

- `tasks/roadmap.md` must exist. If it does not, stop and tell the user to run `/roadmap` (or `/plan-interview` → `/roadmap` if no spec exists).
- The target phase must already have a Goal, Scope, and Acceptance Criteria in the roadmap.

## Input

Read `$ARGUMENTS`:

- If `$ARGUMENTS` is a phase number (e.g., `2`), plan that phase.
- If `$ARGUMENTS` is empty, plan the **first phase that has acceptance criteria but no implementation steps** (no `### Tests First` or `### Implementation` section yet).
- If `$ARGUMENTS` contains `--no-tdd`, use `tests-after` for this phase regardless of other signals.

Read:

- `tasks/roadmap.md` for the target phase's Goal, Scope, and Acceptance Criteria.
- `specs/` (or `spec.md`) for the detailed requirements referenced by the phase's scope.
- The codebase as needed to understand existing code, patterns, and which files to modify.
- The roadmap phase's `Parallelization` and `Coordination Notes` fields, if present.

## Planning Process

### Determine Test Strategy

Check in order:

1. If `$ARGUMENTS` contains `--no-tdd`, use `tests-after`.
2. If `CLAUDE.md` has a `## Test Strategy` section, follow the project default.
3. Otherwise, classify the phase:
   - **`tdd`**: stable interfaces, APIs, data models, business logic with known contracts, payment/auth flows
   - **`tests-after`**: UI components, prototyping, exploratory features, design-in-flux work
   - **`none`**: pure config, docs, scaffolding, infra setup, CI/CD changes

Annotate the phase with `> Test strategy: tdd|tests-after|none`.

### Determine Execution Profile

Expand the roadmap's strategic parallelization mode into a concrete execution profile for this phase. If the roadmap has no `Parallelization` field, default to `serial`.

Use these modes:

- **`serial`**: one main agent does the work; use when ownership is coupled or unclear.
- **`research-only`**: read-only subagents may gather context before implementation; main agent implements.
- **`review-only`**: main agent implements; subagents review before final validation.
- **`implementation-safe`**: write subagents may work only on disjoint owned paths; main agent integrates.
- **`agent-team`**: work is too broad or cross-cutting for one shared local tree; recommend worktree isolation or Claude agent teams instead of local subagent writes.

Downgrade `implementation-safe` to `research-only` or `serial` if path ownership overlaps, shared chokepoints dominate, or the likely integration surface is unclear.

Add this section before implementation steps:

```markdown
### Execution Profile
**Parallel mode:** serial | research-only | review-only | implementation-safe | agent-team
**Integration owner:** main agent
**Conflict risk:** low | medium | high
**Review gates:** correctness, tests, security, performance, docs/API conformance, UX, or none

**Subagent lanes:**
- Lane: [lane-name]
  - Agent: explore | general-purpose
  - Role: explorer | implementer | reviewer | docs-researcher | test-reviewer
  - Mode: read-only | write | review
  - Scope: [bounded task]
  - Owns: `path/or/glob` (write lanes only)
  - Must not edit: `path/or/glob` (write lanes only)
  - Depends on: [lane, step, or none]
  - Deliverable: [findings, patch summary, changed paths, tests, or review report]
```

For `serial`, use `**Subagent lanes:** none`. For `research-only` and `review-only`, lanes must not have write mode. For `implementation-safe`, every write lane must have non-overlapping `Owns` paths and explicit `Must not edit` boundaries.

### Break the Phase into Steps

Define ordered steps beneath the existing Goal/Scope/Acceptance Criteria. The structure depends on the test strategy:

**For `tdd` phases:**
```
## Phase N: [Title]
> Test strategy: tdd

### Execution Profile
**Parallel mode:** serial | research-only | review-only | implementation-safe | agent-team
**Integration owner:** main agent
**Conflict risk:** low | medium | high
**Review gates:** correctness, tests, security, performance, docs/API conformance, UX, or none

**Subagent lanes:**
- Lane: [lane-name or none]
  - Agent: explore | general-purpose
  - Role: explorer | implementer | reviewer | docs-researcher | test-reviewer
  - Mode: read-only | write | review
  - Scope: [bounded task]
  - Owns: `path/or/glob` (write lanes only)
  - Must not edit: `path/or/glob` (write lanes only)
  - Depends on: [lane, step, or none]
  - Deliverable: [expected output]

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
**Acceptance Criteria:** (preserve from roadmap — do not rewrite)
- [ ] [criterion 1]
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests
```

**For `tests-after` phases:**
```
## Phase N: [Title]
> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial | research-only | review-only | implementation-safe | agent-team
**Integration owner:** main agent
**Conflict risk:** low | medium | high
**Review gates:** correctness, tests, security, performance, docs/API conformance, UX, or none

**Subagent lanes:**
- Lane: [lane-name or none]
  - Agent: explore | general-purpose
  - Role: explorer | implementer | reviewer | docs-researcher | test-reviewer
  - Mode: read-only | write | review
  - Scope: [bounded task]
  - Owns: `path/or/glob` (write lanes only)
  - Must not edit: `path/or/glob` (write lanes only)
  - Depends on: [lane, step, or none]
  - Deliverable: [expected output]

### Implementation
- Step N.1: [First implementation task]
  - Files: create `path/to/new.ts`, modify `path/to/existing.ts`
- ...

### Green
- Step N.X: Write regression tests covering acceptance criteria
- Step N.Y: Run all tests and verify they pass
- Step N.Z: Refactor if needed while keeping tests green

### Milestone: [Phase N Milestone Name]
**Acceptance Criteria:** (preserve from roadmap)
- [ ] [criterion 1]
- [ ] All phase tests pass
- [ ] No regressions in previous phase tests
```

**For `none` phases:**
```
## Phase N: [Title]
> Test strategy: none

### Execution Profile
**Parallel mode:** serial | research-only | review-only | implementation-safe | agent-team
**Integration owner:** main agent
**Conflict risk:** low | medium | high
**Review gates:** correctness, tests, security, performance, docs/API conformance, UX, or none

**Subagent lanes:**
- Lane: [lane-name or none]
  - Agent: explore | general-purpose
  - Role: explorer | implementer | reviewer | docs-researcher | test-reviewer
  - Mode: read-only | write | review
  - Scope: [bounded task]
  - Owns: `path/or/glob` (write lanes only)
  - Must not edit: `path/or/glob` (write lanes only)
  - Depends on: [lane, step, or none]
  - Deliverable: [expected output]

### Implementation
- Step N.1: [First implementation task]
  - Files: create `path/to/new.ts`, modify `path/to/existing.ts`
- ...

### Milestone: [Phase N Milestone Name]
**Acceptance Criteria:** (preserve from roadmap)
- [ ] [criterion 1]
```

**On Completion** (fill in when phase is done — all strategies):
- Deviations from plan: [none, or describe]
- Tech debt / follow-ups: [none, or list]
- Ready for next phase: yes/no

### Test Requirements

- **`tdd` phases**: start with writing tests BEFORE implementation. Tests tied to acceptance criteria. Include test file paths.
- **`tests-after` phases**: implementation comes first. The Green step writes regression tests covering the acceptance criteria.
- **`none` phases**: no test steps. Milestone omits "All phase tests pass".
- All `tdd` and `tests-after` milestones must include "All phase tests pass" and "No regressions in previous phase tests".
- If the project has no test framework yet, the first phase's first step should set it up.

### File-Level Granularity

- Every implementation step lists the specific files to create, modify, or delete.
- This gives the executing agent clear scope and prevents steps from becoming unbounded.
- Write-capable subagent lanes must have disjoint owned paths. If they do not, keep implementation serial and use research or review lanes only.

### Manual Task Classification

Classify each step as **automated** (Claude executes) or **manual** (requires human action). Manual tasks include:

- DNS configuration, domain setup, SSL certificates
- Browser/device testing, visual QA
- OAuth/API credential setup with third-party services
- Deployment approvals, environment provisioning
- Signing up for services, billing setup
- Any step requiring a GUI, physical device, or human judgment that cannot be scripted

Manual tasks MUST NOT appear in `tasks/todo.md`. They go in `tasks/manual-todo.md`.

## Output

1. **Update `tasks/roadmap.md`** — insert the implementation structure (Tests First / Implementation / Green / Milestone, per strategy) into the target phase, beneath the existing Goal/Scope/Acceptance Criteria. Do NOT modify other phases. Do NOT rewrite the Goal, Scope, or Acceptance Criteria.

2. **Write `tasks/todo.md`** — extract the target phase as a standalone working document, including the `### Execution Profile`. Include enough context (project name, current phase number, total phases) so a fresh session can orient itself without reading `tasks/roadmap.md`. If `tasks/todo.md` already has in-progress work for a different phase, ask the user before overwriting.

3. **Write `tasks/manual-todo.md`** (only if this phase has manual tasks):
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

## Constraints

- **One phase per invocation.** Do not decompose multiple phases ahead of time.
- **Require `tasks/roadmap.md`.** If it's missing, stop and direct the user to `/roadmap`.
- **Preserve the roadmap's Goal, Scope, and Acceptance Criteria exactly.** Those are `/roadmap`'s decisions. This skill only adds implementation detail beneath them.
- **Phase headers must use `## Phase N: [Title]` format** and steps must use `- Step N.X:` format — this is required by `/run` and `/ship`.
- Every milestone must have specific, checkable acceptance criteria — not vague statements like "works correctly" but concrete conditions like "POST /api/items returns 201 with valid payload and persists to database."
- Every `tdd` phase must start with writing failing tests. `tests-after` phases write tests in the Green step.
- Do not include implementation code — describe what to build and what to test.
- Note what already exists in the codebase vs. what needs to be created.
- The `### Execution Profile` must be decision-complete enough for `/run` to decide whether to use serial execution, read-only subagents, review subagents, or disjoint write subagents after the normal approval gate.
- Subagents must not own task docs, roadmap/history updates, shipping, or deploy steps. Those stay with the main agent.
- Manual tasks MUST NOT appear in `tasks/todo.md` — they go in `tasks/manual-todo.md` only.
- Do NOT put plans in `CLAUDE.md` or `docs/plan.md`.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
