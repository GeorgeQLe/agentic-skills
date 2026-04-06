---
name: run-kanban
description: Plan and execute the next step from the phased plan, moving the kanban card to In Progress with cross-device conflict detection
type: execution
version: 1.0.0
argument-hint: [--phase]
allowed-tools: Bash(node *)
---

# Plan Executor (Kanban)

Identify the next incomplete unit of work from the phased plan, build an execution plan, and enter plan mode for user approval before implementing. Moves the current step's kanban card to In Progress and warns about cross-device conflicts. By default, plans **only the next single incomplete step**. If `$ARGUMENTS` contains `--phase`, plans the **entire next phase**.

## Kanban Setup

Read and follow the Kanban Setup protocol in `~/.claude/skills/poketo-kanban/KANBAN-SETUP.md` (all sections including Board Overview).

## Session Card

After board setup, move the current step's card to In Progress:

1. Get the device hostname: `hostname -s | tr '[:upper:]' '[:lower:]'`
2. Get the current branch: `git branch --show-current`
3. Read `tasks/todo.md` to identify the current step name (next unchecked `- [ ]` item).
4. Search the board for a card matching the step name: `search --board <board-id> --query "<step name>"`
5. Based on where the card is found:
   - **In Todo** → move to In Progress:
     ```bash
     node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs move-card --id <card-id> --list <in-progress-list-id>
     ```
   - **Already in In Progress** → skip the move, update description only.
   - **Not found** → create directly in In Progress:
     ```bash
     node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs create-card --board <id> --list <in-progress-list-id> --name "<step name>" --description "<session info>"
     ```
6. Update the card description with session info:
   ```bash
   node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs update-card --id <card-id> --description "<existing desc> | [hostname] | Branch: <branch> | Started: YYYY-MM-DD HH:MM"
   ```

## Conflict Check

After setting up the session card, scan for cross-device conflicts. This is **advisory only** — never block.

1. Fetch the full board state: `board <id>`
2. Find all cards in the In Progress list.
3. For each In Progress card, check its description for hostname markers:
   - **`[other-hostname]` with same branch or step name** → warn: "Device `other-hostname` is also working on `branch/step`. Consider coordinating to avoid conflicts."
   - **`[this-hostname]` with a different step name** → stale session: "Found stale session card `card-name` from this device. Move to Done or Punt?" If the user confirms, move the card accordingly.
   - **No hostname in description** → note: "Untracked In Progress card: `card-name` — origin unknown."
4. Continue with the main protocol regardless of findings.

## Protocol

1. **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
2. **Read `tasks/todo.md`** — this contains the current phase's steps. Reference `tasks/roadmap.md` only if cross-phase context is needed.
3. **Read CLAUDE.md** for project conventions.
4. **Find the next incomplete item:**
   - Look for the next phase with an unchecked milestone.
   - If `--phase` mode: scope the entire phase.
   - Otherwise (default): find only the next unchecked `- [ ]` step within that phase.
   - **If the phase has acceptance criteria but no implementation steps** (no `### Tests First` or `### Implementation` section): this phase needs just-in-time planning. **You MUST invoke `/plan-phases` for this phase** to generate implementation steps and file-level detail before proceeding. Do NOT tell the user the phase is "deferred" or that they need to run `/plan-phases` manually — this auto-invocation is the designed workflow. A phase without implementation steps is NOT deferred; it simply hasn't been decomposed yet. Only items under the `## Deferred / Future Work` heading in the roadmap are actually deferred.
5. **Check `tasks/manual-todo.md`** (if it exists) for blocking manual tasks:
   - Look for unchecked items with `_(blocks: Step N.X)_` annotations matching the step about to be executed.
   - If a blocking manual task is found, warn the user: "**Manual task blocking this step:** [task]. Complete it before proceeding." Do NOT skip the step — let the user decide.
6. **Research what's needed** — read only the files relevant to the step/phase to understand existing code, patterns, and dependencies.
7. **Enter plan mode** using the EnterPlanMode tool.
8. **Present the execution plan** to the user:
   - What the step/phase requires
   - Which files will be created or modified
   - The approach (e.g., what tests to write, what code to change)
   - Any decisions or trade-offs the user should weigh in on
9. **Wait for user approval.** Do NOT write any code until the user approves.
10. **After approval, exit plan mode** and execute the approved plan.

### Single Step Mode (default)

- If it's a "Tests First" step: write the failing tests, run them to confirm they fail (red). Stop.
- If it's an implementation step: implement it, run existing tests to check for regressions. Stop.
- If it's a "Green" step: run all tests. For `tests-after` phases, also write regression tests covering acceptance criteria. Fix any failures. Stop.
- **Mark the step as done** in `tasks/todo.md` (check it off).

### Full Phase Mode (`--phase`)

- Execute the entire phase, step by step:
  - Start with the "Tests First" steps — write the failing tests.
  - Run the tests to confirm they fail (red).
  - Implement each step in order.
  - Run tests after implementation to confirm they pass (green).
  - Refactor if needed while keeping tests green.
- **Verify the milestone**:
  - Check each acceptance criterion.
  - Run the full test suite to confirm no regressions.
  - Check off completed criteria in `tasks/todo.md`.

## Post-Execution Card Update

After marking the step as done in `tasks/todo.md`, update the kanban card with progress and completion info:

1. Count steps in `tasks/todo.md`: total `- [x]` + `- [ ]` items, and how many are checked.
2. Calculate progress percentage: `checked / total * 100`.
3. Update the card:
   ```bash
   node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs update-card --id <card-id> --description "<existing desc> | Progress: X/Y (Z%) | Completed: YYYY-MM-DD HH:MM"
   ```

Do NOT move the card to Done here — that's `/ship-kanban`'s job.

## After Execution (both modes)

**Report concisely:**
- Phase/step completed
- Files modified
- Test results (if tests were run) — **explicitly state whether any failures are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)**
- Manual tasks — if `tasks/manual-todo.md` exists, report count of pending manual tasks for this phase
- Kanban status (card moved, conflicts detected)
- What's next (just its name — /ship-kanban will handle planning)

## What NOT to do

- Do NOT write code before entering plan mode and getting user approval.
- Do NOT execute more than one step (or more than one phase in `--phase` mode).
- Do NOT read unnecessary files — only what's needed for the current work.
- Do NOT plan ahead or analyze future phases/steps.
- Do NOT refactor unrelated code.
- Do NOT update CLAUDE.md.
- Do NOT execute items from `tasks/manual-todo.md` — those require human action.

## Workflow

```
/run-kanban            → plans one step, moves card to In Progress, executes after approval
/run-kanban --phase    → plans the next full phase, moves cards, executes after approval
/ship-kanban           → commits, pushes, moves card to Done, plans next
```

## Constraints
- **One step (or one phase). That's it.** Then stop and let the user decide what's next.
- **Always enter plan mode before executing.** The user must approve the approach first.
- Keep context footprint minimal — don't read the entire codebase, only files relevant to this work.
- If the work can't be completed due to a blocker, document the blocker in `tasks/todo.md` and stop.
- Follow the test strategy annotated on each phase (`tdd`, `tests-after`, or `none`). Do not skip test steps for `tdd` phases.
- Each execution must be self-contained — read the plan fresh, don't rely on prior context.
- Kanban operations are additive — if any kanban command fails, warn and continue. The core run workflow must always succeed regardless of kanban state.
- Cross-device conflict warnings are advisory only — never block the user from working.
