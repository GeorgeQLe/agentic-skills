---
name: run
description: "Execute and ship approved project work continuously; use --step or --phase for an explicit stopping boundary"
type: execution
version: 1.1.0
argument-hint: "[--step | --phase]"
---

# Run

Execute approved project work continuously: plan the next actionable unit, implement,
validate and ship it, update the plan, then continue without requiring another
invocation. A step or phase is a review/checkpoint boundary, not a mandatory stop.
Use `--step` to stop after one step or `--phase` to stop after one phase. A user's
explicit scope or stopping instruction takes precedence; never expand a narrow
request into unrelated project work.

## Continuous execution contract

- Continue through the approved backlog until the project acceptance criteria are
  actually met, the user asks to stop, or no authorized independent work remains.
- Do not end a turn merely to recommend another run command after a successful
  step. Prepare and execute the next eligible unit in the same ongoing task.
- Re-plan at phase boundaries and validate/ship coherent units. Keep progress
  updates and durable task notes so compaction or session resumption preserves scope.
- A blocked item blocks its dependents, not unrelated authorized work. Record the
  concrete missing input/permission/device, request it once when needed, and continue
  independent work. Never bypass a safety boundary or mark an untested gate complete.
- Preserve credential confidentiality, budget/billing consent, production/deletion
  approvals, isolated write ownership and required tests. Continuous execution is
  not authorization for paid actions, deployment or destructive changes.
- When returning to a continuous caller from shipping/planning skills, continue
  execution; next-command output is a recovery aid, not an instruction to stop.
- `--execute-approved` remains restricted to its one approved packet unless a
  separate user instruction authorizes continued work. Never widen packet scope.

## Protocol

1. **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` -> `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Invoke `/ship --no-deploy` to validate/publish the task-doc split, then continue within the authorized scope.
2. **Read `tasks/todo.md`** — this contains the current phase's steps. Reference `tasks/roadmap.md` only if cross-phase context is needed.
3. **Read CLAUDE.md** for project conventions.
3b. If `tasks/record-todo.md` or `tasks/recurring-todo.md` exists, count unchecked advisory items for status only. Do not select them as next work.
4. **Find the next incomplete item:**
   - Look for the next phase with an unchecked milestone.
   - If `--phase` mode: scope the entire phase.
   - Otherwise: select the next unchecked `- [ ]` step within that phase.
   - **If the phase has acceptance criteria but no implementation steps** (no `### Tests First` or `### Implementation` section): this phase needs just-in-time planning. **You MUST invoke `/plan-phase` for this phase** to generate implementation steps and file-level detail before proceeding. Do NOT tell the user the phase is "deferred" or that they need to run `/plan-phase` manually — this auto-invocation is the designed workflow. A phase without implementation steps is NOT deferred; it simply hasn't been decomposed yet. Only items under the `## Deferred / Future Work` heading in the roadmap are actually deferred.
5. **Check `tasks/manual-todo.md`** (if it exists) for blocking manual tasks:
   - Look for unchecked items with `_(blocks: Step N.X)_` annotations matching the step about to be executed.
   - If a blocking external human-only manual task is found, stop and ask the user how to proceed: "**Manual task blocking this step:** [task]. Complete it before proceeding, or run `/guide` for step-by-step instructions." Do NOT execute the step unless the manual task is completed or the user explicitly overrides the blocker.
   - If the unchecked item is task-doc bookkeeping, reconciliation, or agent-executable work (repo edits, SDK wiring, local commands, tests, audits, generated assets, or authenticated CLI/API work), do not route it to `/guide`; route it to `/reconcile-dev-docs fix tasks`, promote it to `tasks/todo.md`, or handle it as a direct dev-doc audit.
6. **Research what's needed** — read only the files relevant to the step/phase to understand existing code, patterns, and dependencies.
6b. **Read the execution profile** — read the current phase's `### Execution Profile` from `tasks/todo.md` if present:
   - If missing, treat the phase as `serial`.
   - Apply the execution profile per unit and reassess at phase transitions.
   - If the profile's `Parallel mode` is `agent-team`:
     - Parse all lanes. If any lane is missing `Mode:` or `Depends on:`, still contains placeholder text, write lanes have overlapping `Owns`, or write lanes are missing a concrete non-primary `Branch:`, **auto-invoke `/patch-exec-profile`** for this phase (same pattern as step 4's auto-invocation of `/plan-phase`). Re-read `tasks/todo.md` after it returns. Do not tell the user to run `/patch-exec-profile` manually — this auto-invocation is the designed workflow.
     - Build the lane DAG from each lane's `Depends on:` field. Compute topological waves. Include the DAG and wave structure in the plan-mode presentation at step 8.
     - Confirm the plan includes a consolidation/PR review step after all write lanes and before final validation or shipping. If not, stop and patch the phase plan before dispatch.
7. **Plan the next unit.** Use plan mode when required by the active environment; existing continuous authorization does not require fresh routine approval.
8. **Present the execution plan** to the user:
   - What the step/phase requires
   - Which files will be created or modified
   - The approach (e.g., what tests to write, what code to change)
   - Whether the execution profile will run serially, use read-only research lanes, use review lanes, or use disjoint write lanes
   - For `agent-team`: the planned lane branches and the consolidation/PR review gate
   - Any decisions or trade-offs the user should weigh in on
9. **Proceed within existing authorization.** Ask only for missing decisions or separately gated actions; do not ask for routine approval at every step.
10. **After approval, execute the approved plan.** If Claude Code already returned to normal mode after approval, do not call ExitPlanMode again; continue directly with implementation. Only use the plan-mode exit tool when the session is still visibly in plan mode.

### Execution Profile Handling

After approval, apply the current phase's `### Execution Profile`:

- `serial`: execute normally.
- `research-only`: launch read-only subagent lanes first when the active environment permits subagents, synthesize their findings, then implement in the main agent.
- `review-only`: implement in the main agent, then launch review subagent lanes before final validation.
- `implementation-safe`: launch write subagent lanes only when every write lane has disjoint `Owns` paths and explicit `Must not edit` boundaries; otherwise downgrade to `research-only` or `serial` and report the downgrade.
- `agent-team`: auto-dispatch lanes via `Agent` tool calls with `isolation: "worktree"` (see **Agent-Team Dispatch** below). Each write lane must run on its declared separate GitHub branch and return branch, commit SHA, validation evidence, and PR URL. This is the current policy — **do not stop** merely because the profile says `agent-team` or because the phase/step body contains legacy advisory text like *"do not implement in a single `/run`"*, *"requires isolated worktrees or a dedicated agent team"*, or *"use `/delegate` instead"*. That guidance predates agent-team dispatch and is now stale. Trust the `### Execution Profile` metadata (after `/patch-exec-profile` fills it) and proceed. Only stop if `/patch-exec-profile` returns with unresolvable ambiguity (overlapping `Owns`, cyclic `Depends on`, missing lane specs that cannot be inferred, or missing branch/PR review requirements).

The main agent owns integration, conflict resolution, task doc updates, history updates, shipping handoff, and deploy handoff. If a subagent touches files outside its owned paths or returns conflicting changes, stop and reconcile before validation.

#### Agent-Team Dispatch

When the profile is `agent-team`:

- Execute lane waves in topological order (computed from `Depends on:` in step 6b).
- For each wave of **write** lanes: dispatch one `Agent` call per lane, in a single message (parallel execution), with:
  - `isolation: "worktree"`
  - The lane's declared `Branch:` value, created from the current primary branch (`main` when present, otherwise `master`) and never named `main` or `master`
  - `subagent_type: "general-purpose"` unless the lane spec names another agent
  - Prompt scoped to the lane's `Scope`, `Owns`, `Must not edit`, and `Deliverable`
  - Explicit instruction in the prompt: "Work only on your assigned branch. Before returning, commit all your changes, push the branch to GitHub, open or update a draft PR, and include the branch name, final commit SHA, validation evidence, and PR URL."
- If the repository has no GitHub remote, branch push is unavailable, or PR creation/review cannot be performed, stop before dispatch and report the blocker instead of downgrading silently.
- When each lane returns:
  1. **Verify branch evidence:** confirm the returned branch matches the lane's `Branch:`, the commit exists on that branch, and a PR URL was returned. If not, stop.
  2. **Validate write boundaries:** fetch the lane branch, then run `git diff --name-only <primary>...origin/<lane-branch>` (or the reviewed remote branch ref). Every changed path must be a subset of the lane's declared `Owns`. If any file falls outside (including matches against `Must not edit`), abort integration for that lane and surface the violation. Do not attempt partial integration.
  3. **Consolidation/PR review:** inspect the PR diff, test evidence, and lane summary. Record findings as `blocker` or `advisory` with file path and line references. Do not integrate a branch with blocker findings.
  4. **Integrate approved branch work into the shared tree:** `git restore --source=origin/<lane-branch> --staged --worktree -- <owns-path-1> <owns-path-2> …`. This captures modifications, additions, and deletions. Do not use `git checkout <branch> -- <paths>` — it silently drops deletions. Do not create a merge commit; the result is a dirty working tree for `/ship`.
  5. **Clean up local worktrees only after integration:** `git worktree remove <worktree-path>` then delete the local lane branch when safe. Leave the remote branch/PR available until consolidation status is documented or the project explicitly closes/merges it.
- After all write waves integrate, dispatch any additional **review** lanes as non-worktree `Agent` calls (no `isolation`) against the integrated dirty tree. Their deliverable contract: return findings as a list, each classified `blocker` or `advisory`, with file path and line references.
- Write a `### Review Findings` block under the step in `tasks/todo.md`:
  - If any finding is `blocker`: leave the step unchecked, stop `/run`, and surface the findings in the final report.
  - Else: record the findings, check off the step, and continue normal `/run` flow.
- Run the phase's test strategy against the integrated state before checking off the step.

### Per-unit execution (stop only with `--step`)

- If the step creates, deletes, renames, or changes behavior/metadata in any tracked `SKILL.md` or `PACK.md`, refresh the Skills Showcase before handing off to `/ship`: run `node scripts/generate-skills-showcase-data.mjs`, `node scripts/generate-skills-showcase-github-data.mjs`, and `scripts/validate-skills-showcase-data.sh`; include changed generated assets in the dirty tree. Review curated showcase copy, catalog grouping, workflow animation text, and proof receipts; update affected site files or record why no curated website copy changed.
- If it's a "Tests First" step: write the failing tests, run them to confirm they fail (red). In continuous mode proceed to the matching implementation; do not publish expected-red tests as a completed green unit.
- If it's an implementation step: implement it, run existing tests to check for regressions. Continue after validation and shipping unless --step applies.
- If it's a "Green" step: run all tests. For `tests-after` phases, also write regression tests covering acceptance criteria. Fix any failures. If validation is clean and a following cleanup/refactor step is explicitly conditional on validation findings or says no source changes are expected, complete that no-op cleanup in the same run by recording the no-op result instead of leaving it for a separate plan-mode handoff. Continue unless an explicit scope boundary applies.
- **Mark the step as done** in `tasks/todo.md` (check it off).

### Full Phase Mode (`--phase`)

- Execute the entire phase, step by step:
  - Start with the "Tests First" steps — write the failing tests.
  - Run the tests to confirm they fail (red).
  - Implement each step in order.
  - Run tests after implementation to confirm they pass (green).
  - Refactor only when validation exposes concrete drift or cleanup work; do not create or preserve separate no-op refactor steps after a clean validation gate.
- **Verify the milestone**:
  - Check each acceptance criterion.
  - Run the full test suite to confirm no regressions.
  - Check off completed criteria in `tasks/todo.md`.

## After each execution unit

Validate and invoke `/ship --no-deploy` for authorized publication, then plan and
execute the next eligible unit. Honor explicit --step/--phase boundaries. Final
handoff output below applies only at completion or a genuine stopping boundary.

**Report concisely:**
- Phase/step completed
- Files modified
- Test results (if tests were run) — **explicitly state whether any failures are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)**
- Manual tasks — if `tasks/manual-todo.md` exists, report count of pending manual tasks for this phase
- Advisory tasks — pending record/recurring counts from `tasks/record-todo.md` and `tasks/recurring-todo.md` if they exist
- **Next work:** the next concrete shipping, validation, blocker, or follow-up task
- **Recommended next command:** one command or route for that work

## Next-Step Routing

Before handing back, identify the next concrete work item from project state, then recommend the executor and invocation.

Output exactly two lines beyond the normal report:

- **Next work:** <specific shipping, validation, blocker, or follow-up task>
- **Recommended next command:** <one command or route>

Rules:

- Make the next work item primary. Derive it from `tasks/todo.md`, validation results, manual blockers, deploy/smoke-test gaps, or the absence of remaining work. Do not use agent mode itself as the next work item.
- Use `./scripts/agent-mode.sh` only to choose command text. If it is missing, unset, or non-zero, infer routing from the current invocation and task type instead of asking the user to select a mode by default.
- Inference defaults:
  - Hybrid execution handoff after Claude `/run` → recommend `/delegate $ship`.
  - Claude-only or manual/orchestration-heavy work → recommend `/ship` or `/guide`.
  - Codex-only execution → recommend `$ship`.
- Do **not** recommend `/delegate` as a workaround for an `agent-team` profile. `/run` now auto-dispatches agent-team lanes itself via isolated worktrees; `/delegate` is for Claude↔Codex handoff, not for lane parallelism.
- Only present multiple commands when the ambiguity materially changes execution safety or there are equally valid next work items. Otherwise choose the best route and mention degraded mode lookup inline.

## What NOT to do

- Do not exceed the user's authorized scope; ask only for separate decisions, not repeated routine approval.
- Do NOT call ExitPlanMode from normal mode. If Claude Code reports "You are not in plan mode" after approval, treat approval as complete and continue implementation.
- Honor explicit `--step` or `--phase` limits; otherwise continue through the approved backlog.
- Do NOT read unnecessary files — only what's needed for the current work.
- Plan the next eligible unit when the current one passes validation.
- Do NOT refactor unrelated code.
- Do NOT update CLAUDE.md.
- Delegate publication to `/ship --no-deploy` and resume execution afterward. Deployment needs its separate authorization.
- Do NOT execute external human-action items from `tasks/manual-todo.md`. Bookkeeping or agent-executable items that were misfiled there should be reconciled through `/reconcile-dev-docs` or promoted into `tasks/todo.md`, not routed to `/guide`.
- Do NOT execute items from `tasks/record-todo.md` or `tasks/recurring-todo.md` unless the item has first been promoted into `tasks/todo.md`.

## Workflow

```
/run                  → executes, validates, ships and continues approved work
/run --step           → executes one step then returns
/run --phase          → executes one phase then returns
/ship --no-deploy     → validates, commits, pushes, plans next; returns to continuous caller
```

## Constraints
- **Continue by default.** Step/phase boundaries are checkpoints, not mandatory stops.
- Present the next plan and proceed under existing authorization; preserve separate safety approvals.
- Keep context footprint minimal — don't read the entire codebase, only files relevant to this work.
- Document a blocked item and continue independent authorized work; stop only when none remains.
- Follow the test strategy annotated on each phase (`tdd`, `tests-after`, or `none`). Do not skip test steps for `tdd` phases.
- Follow the `### Execution Profile` annotated on each phase. If subagents are unavailable in the active environment, execute serially and report the downgrade.
- Do not let subagents update `tasks/todo.md`, `tasks/roadmap.md`, `tasks/history.md`, shipping commits, or deploy steps. Those remain main-agent responsibilities.
- Do not run parallel write lanes unless their `Owns` paths are disjoint. When in doubt, downgrade to `research-only` or `serial`.
- `/ship --no-deploy` owns publication; call it within continuous execution instead of leaving a routine handoff for the user.
- For `agent-team` phases: do not integrate a lane whose diff contains files outside its declared `Owns` — surface the violation and stop instead. Lane agent prompts must require branch-backed commit, push, and PR evidence before return; do not integrate from an uncommitted worktree, unpushed branch, or unreviewed PR. Clean up local worktrees after every integration, but preserve remote branches/PRs until consolidation status is documented.
- Each execution must be self-contained — read the plan fresh, don't rely on prior context.

## Execution Handoff Contract

Invoke `/ship --no-deploy` to validate, record history, commit/push and plan the
next unit. Resume the continuous loop afterward without requesting another run
invocation. At an explicit --step/--phase boundary or genuine blocker, return a
self-contained status with remaining work and the actual next route.
