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

- `tasks/roadmap.md` must exist. If it does not, stop and tell the user to run `/roadmap` (or `/spec-interview` → `/roadmap` if no spec exists).
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

For `agent-team` profiles, every lane **must** have `Mode:` and `Depends on:` filled in with concrete values (not placeholders). Write lanes must have disjoint `Owns:` paths and explicit `Must not edit:` boundaries — `/run` auto-dispatches agent-team lanes via isolated worktrees and uses those fields to build the lane DAG and enforce write-boundary integration. If this cannot be satisfied, downgrade to `implementation-safe`, `research-only`, or `serial`.

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

### Task Classification

Classify each step or follow-up as exactly one of:

- **automated** — Claude executes it as implementation or verification work in `tasks/todo.md`.
- **manual** — a human action tied to an automated step in `tasks/manual-todo.md`.
- **record** — a one-time, non-blocking record or measurement that should happen only after a condition becomes true in `tasks/record-todo.md`.
- **recurring** — cadence-based operational, research, or maintenance work in `tasks/recurring-todo.md`.

Manual tasks include:

- DNS configuration, domain setup, SSL certificates
- Browser/device testing, visual QA
- OAuth/API credential setup with third-party services
- Deployment approvals, environment provisioning
- Signing up for services, billing setup
- Any step requiring a GUI, physical device, or human judgment that cannot be scripted

Manual tasks MUST NOT appear in `tasks/todo.md`. They go in `tasks/manual-todo.md`.

Record tasks MUST NOT appear in `tasks/todo.md` unless they are launch gates or current execution work. They go in `tasks/record-todo.md` with source, condition, non-blocking reason, required data/access, measurement/query, target note, revisit cadence/date, completion evidence, and promotion rule.

Recurring tasks MUST NOT appear in `tasks/todo.md` unless the current run is explicitly in scope for this phase. They go in `tasks/recurring-todo.md` with task, cadence, owner/agent, scope, trigger, last run, next due, command/skill, evidence/output path, and escalation conditions.

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

4. **Write `tasks/record-todo.md`** (only if this phase identifies non-blocking condition-gated records):
   ```markdown
   # Record Tasks — [Project Name]

   > These tasks are non-blocking records or measurements. Do not execute them through `/run` unless promoted to `tasks/todo.md`.

   - [ ] [task]
     - Source: [phase/spec/criterion]
     - Condition: [when this becomes eligible]
     - Non-blocking reason: [why this is not a launch gate or current step]
     - Required data/access: [data, portal, aggregate, credential, or user-provided output]
     - Measurement/query: [how to collect evidence]
     - Target/acceptance note: [threshold or expected record]
     - Revisit: [date or cadence]
     - Completion evidence: [where to record the result]
     - Promotion rule: [when to move this into `tasks/todo.md`]
   ```

5. **Write `tasks/recurring-todo.md`** (only if this phase identifies recurring obligations):
   ```markdown
   # Recurring Tasks — [Project Name]

   > These tasks recur on a cadence. Do not execute them through `/run` unless a due run is promoted to `tasks/todo.md`.

   - [ ] [task]
     - Cadence: [daily/weekly/monthly/quarterly/on release/etc.]
     - Owner/agent: [human, `/skill`, or agent role]
     - Scope: [project/app/area]
     - Trigger: [time, release, data threshold, user request]
     - Last run: [date or never]
     - Next due: [date or rule]
     - Command/skill: [command or skill to run]
     - Evidence/output path: [where results are recorded]
     - Escalation conditions: [when it becomes executable or blocking work]
   ```

## Next-Step Routing

Before handing back, identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal report:

- **Next work:** <specific first step, manual blocker, or verification gap for the planned phase>
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. Derive it from the first executable step in `tasks/todo.md`, any matching blocker in `tasks/manual-todo.md`, or the phase's verification/setup gap. Do not use agent mode itself as the next work item.
- Use `./scripts/agent-mode.sh` only to choose command text. If it is missing, unset, or non-zero, infer routing from the current invocation and task type instead of asking the user to select a mode by default.
- Inference defaults:
  - Hybrid execution handoff → recommend `/delegate $run`.
  - Claude-only or orchestration-heavy work → recommend `/run`.
  - Codex-only execution → recommend `$run`.
  - External manual work (browser, auth, DNS, service console/dashboard, or production smoke-test work) → recommend `/guide` or a Claude-guided manual step rather than `/run`.
  - Task-doc bookkeeping, stale `tasks/manual-todo.md` cleanup, or reconciliation against repo/history reality → recommend `/reconcile-dev-docs fix tasks` or a direct dev-doc audit, not `/guide`.
- Only present multiple commands when the ambiguity materially changes execution safety or there are equally valid next work items. Otherwise choose the best route and mention degraded mode lookup inline.

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
- Non-blocking record tasks MUST NOT appear in `tasks/todo.md` — they go in `tasks/record-todo.md` unless explicitly promoted.
- Recurring obligations MUST NOT appear in `tasks/todo.md` by default — they go in `tasks/recurring-todo.md` unless a due run is current execution work.
- Do NOT put plans in `CLAUDE.md` or `docs/plan.md`.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
