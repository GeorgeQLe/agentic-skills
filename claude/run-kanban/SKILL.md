---
name: run-kanban
description: Plan and execute the next step from the phased plan, moving the kanban card to In Progress with cross-device conflict detection
argument-hint: [--phase]
allowed-tools: Bash(node *)
---

# Plan Executor (Kanban)

Identify the next incomplete unit of work from the phased plan, build an execution plan, and enter plan mode for user approval before implementing. Moves the current step's kanban card to In Progress and warns about cross-device conflicts. By default, plans **only the next single incomplete step**. If `$ARGUMENTS` contains `--phase`, plans the **entire next phase**.

## Kanban Setup

Run these steps before the main protocol. If any step fails, warn the user and continue without kanban — the core run workflow must always succeed.

### Board Resolution

```bash
node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs boards
```

1. If `tasks/.kanban-board` exists, read the board ID. Verify it via `board <id>`. If stale (error), delete the file and continue to step 2.
2. If no valid mapping: match board names against `basename $(pwd)` (case-insensitive). Prefer exact match over substring.
3. If one match → use it, save ID to `tasks/.kanban-board`.
4. If zero or multiple matches → list boards, ask the user to pick. Save their choice.
5. If no boards exist → ask the user if they want to create one. If yes: `create-board --name "$(basename $(pwd))" --lists "Backlog,Todo,In Progress,Done:done,Punt:punt"`. Save the ID.

### Board Validation

After resolving the board, verify all 5 required lists exist (case-insensitive name match): **Backlog, Todo, In Progress, Done, Punt**. If any are missing, create them via `create-list --board <id> --name "<name>"`. Store list IDs for use in subsequent operations.

### Graceful Degradation

If the poketo-kanban scripts are not found at `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`, or if the first kanban command fails (DB connectivity, auth error), warn the user and continue with the base run behavior. Kanban operations are additive — never block the core workflow.

### Board Overview

After board validation, display a brief board status to provide context:

1. Fetch the full board state: `board <id>`
2. Scan all cards and report:
   - **Overdue**: Cards with a due date in the past (highlight count and names)
   - **High priority**: Starred cards not yet in Done/Punt
   - **Blocked**: Cards whose description contains "blocked" or "blocker"
   - **In Progress**: Count of cards currently being worked on
   - **Backlog/Todo**: Counts for planning context
3. Display as a brief summary before proceeding. Do not take action — this is informational only.

## Session Card

After board setup, move the current step's card to In Progress:

1. Get the device hostname: `hostname -s | tr '[:upper:]' '[:lower:]'`
2. Get the current branch: `git branch --show-current`
3. Read `tasks/todo.md` to identify the current step name (next unchecked `- [ ]` item).
4. Search the board for a card matching the step name: `search --query "<step name>"`
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
5. **Research what's needed** — read only the files relevant to the step/phase to understand existing code, patterns, and dependencies.
6. **Enter plan mode** using the EnterPlanMode tool.
7. **Present the execution plan** to the user:
   - What the step/phase requires
   - Which files will be created or modified
   - The approach (e.g., what tests to write, what code to change)
   - Any decisions or trade-offs the user should weigh in on
8. **Wait for user approval.** Do NOT write any code until the user approves.
9. **After approval, exit plan mode** and execute the approved plan.

### Single Step Mode (default)

- If it's a "Tests First" step: write the failing tests, run them to confirm they fail (red). Stop.
- If it's an implementation step: implement it, run existing tests to check for regressions. Stop.
- If it's a "Green" step: run all tests, fix any failures. Stop.
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

After marking the step as done in `tasks/todo.md`, update the kanban card:

```bash
node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs update-card --id <card-id> --description "<existing desc> | Completed: YYYY-MM-DD HH:MM"
```

Do NOT move the card to Done here — that's `/ship-kanban`'s job.

## After Execution (both modes)

**Report concisely:**
- Phase/step completed
- Files modified
- Test results (if tests were run) — **explicitly state whether any failures are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)**
- Kanban status (card moved, conflicts detected)
- What's next (just its name — /ship-kanban will handle planning)

## What NOT to do

- Do NOT write code before entering plan mode and getting user approval.
- Do NOT execute more than one step (or more than one phase in `--phase` mode).
- Do NOT read unnecessary files — only what's needed for the current work.
- Do NOT plan ahead or analyze future phases/steps.
- Do NOT refactor unrelated code.
- Do NOT update CLAUDE.md.

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
- Do not skip the TDD steps.
- Each execution must be self-contained — read the plan fresh, don't rely on prior context.
- Kanban operations are additive — if any kanban command fails, warn and continue. The core run workflow must always succeed regardless of kanban state.
- Cross-device conflict warnings are advisory only — never block the user from working.
