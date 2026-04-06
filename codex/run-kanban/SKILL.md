---
name: run-kanban
description: "Execute the next step from the phased plan, ship it, and move the kanban card through the workflow"
argument-hint: "[--phase]"
---

# Run (Kanban)

Identify the next incomplete unit of work from the phased plan, build an execution plan, implement it, ship it, and prepare the next step. Moves the current step's kanban card to In Progress, warns about cross-device conflicts, and finalizes the card state after shipping. By default, executes only the next single incomplete step. If `$ARGUMENTS` contains `--phase`, execute the next full phase and ship once at the end.

## Kanban Setup

1. Resolve the board: check `tasks/.kanban-board` for stored ID, validate via `board <id>`. If missing, match board names against `basename $(pwd)`. If no match, ask the user. If the session is already in Plan mode and there are 2-3 concrete board choices, prefer `request_user_input`; otherwise ask a concise plain-text question. If no boards exist, offer to create one with `create-board --name "$(basename $(pwd))" --template standard`.
2. Validate all 5 lists exist (Backlog, Todo, In Progress, Done, Punt). Create missing ones via `create-list`.
3. If poketo-kanban scripts are missing or DB is unreachable, warn and continue without kanban.
4. **Board Overview:** Fetch board state and display a brief summary — overdue cards, starred/high-priority items, blocked cards, In Progress/Backlog/Todo counts. Informational only, no actions taken.

All kanban commands use: `node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs <command>`

## Session Card

1. Get hostname (`hostname -s | lowercase`) and branch (`git branch --show-current`).
2. Read `tasks/todo.md` for the current step name.
3. Search board for card matching step name.
4. If in Todo → move to In Progress. If already in In Progress → skip move. If not found → create in In Progress.
5. Update card description with: `[hostname] | Branch: branch | Started: datetime`

## Conflict Check

Scan all In Progress cards (advisory only, never block):
- `[other-hostname]` with same branch/step → warn about overlap
- `[this-hostname]` with different step → stale session, offer to move to Done/Punt
- No hostname → report as "untracked"

## Workflow

1. **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase. Commit with `chore: migrate to roadmap.md + todo.md split`.
2. Read `tasks/todo.md` — this contains the current phase's steps. Reference `tasks/roadmap.md` only if cross-phase context is needed.
3. Read `CLAUDE.md` for project conventions.
4. Find the next incomplete item:
   - Look for the next phase with an unchecked milestone.
   - If `$ARGUMENTS` contains `--phase`, scope the full next incomplete phase.
   - Otherwise, find the next unchecked `- [ ]` step within that phase.
   - **If the phase has acceptance criteria but no implementation steps** (no `### Tests First` or `### Implementation` section): invoke `$plan-phases` for this phase to generate implementation steps and file-level detail before proceeding.
5. **Check `tasks/manual-todo.md`** (if it exists) for unchecked items with `_(blocks: Step N.X)_` matching the current step. If found, warn the user — do NOT skip the step, let the user decide.
6. Research what is needed — read only the files relevant to the step.
7. Present the execution plan to the user:
   - What the step requires
   - Which files will be created or modified
   - The approach and any trade-offs
8. Use `update_plan` to track the proposed work. If the session is already in Plan mode and a structured choice would help, use `request_user_input`. Otherwise ask for approval with a concise plain-text question. Wait for approval before writing any code.
9. After approval, execute the plan:
   - If it is a tests-first step: write the failing tests, run them to confirm they fail.
   - If it is an implementation step: implement it, run existing tests for regressions.
   - If it is a verification step: run all tests, fix any failures.
10. Mark the completed work in `tasks/todo.md`:
   - Default mode: check off the completed step.
   - `--phase` mode: check off the completed steps and any acceptance criteria satisfied by the phase work.
11. **Pre-ship error check:**
   - First check conversation context for lint/typecheck/test output already produced this session. Do NOT re-run commands whose results are already available.
   - For any validation category not already run, find commands from: `CLAUDE.md`, `Makefile`/`Justfile`, `package.json`, `pyproject.toml`/`setup.cfg`, `Cargo.toml`. If none found and no prior output exists, skip.
   - If pre-existing errors are found (from prior output or fresh runs), fix them and re-run only the failing commands to confirm. Include fixes in the shipping commit, or a separate commit if unrelated.
   - If errors cannot be auto-fixed, document them in the summary and continue.
12. Ship the completed work:
   - Update `tasks/history.md` with a brief record of what was accomplished. Create it if needed.
   - Commit and push using the `$commit-and-push-by-feature` workflow.
13. **Kanban: Finalize the completed card**
   - Find the completed step's card on the board.
   - Move the completed card to Done and run `done --id`.
   - Update the card description with commit SHAs and `Progress: X/Y (Z%) | Completed: datetime`.
   - If the completed card cannot be found, warn and continue.
14. Deploy:
   - Check for an explicit manual deploy contract in `deploy.md` or `tasks/deploy.md`.
   - If neither file exists, skip deploy and report `Deploy skipped: no explicit manual deploy contract (deploy.md or tasks/deploy.md)`.
   - If a deploy contract exists, read it first and use it to determine the deploy method.
   - Supplement the contract by checking: `spec.md`, `CLAUDE.md`, `tasks/roadmap.md`, `tasks/todo.md`, `Makefile`/`Justfile`, `package.json`, `deploy/`/`infra/`/`scripts/`, `docker-compose*.yml`.
   - Do NOT look in `.github/workflows/`.
   - If a deploy contract exists but no deploy method is found, ask the user. Do not guess.
   - Run the deploy and verify output.
15. Plan the next step:
   - Read `tasks/todo.md` to identify the next uncompleted step in the current phase.
   - **Check if the current phase is complete** (all steps checked, milestone criteria met):
     - If **YES — Phase transition:**
       1. Archive the completed phase: copy `tasks/todo.md` → `tasks/phases/phase-N.md` (create `tasks/phases/` if needed). Fill in the "On Completion" section.
       1b. If `tasks/manual-todo.md` exists, archive it to `tasks/phases/phase-N-manual.md`. Warn (but do not block) if unchecked manual tasks remain.
       2. Check off the phase milestone in `tasks/roadmap.md`.
       3. Copy the next phase from `tasks/roadmap.md` → overwrite `tasks/todo.md`.
       3b. Extract the next phase's manual tasks (from `**Manual Tasks:**` in roadmap) into a fresh `tasks/manual-todo.md`. If the next phase has no manual tasks, delete the file.
       4. If no more phases remain, commit and push the planning/task updates from this step, then suggest the top Todo or Backlog card if one exists. Otherwise report `Board is clear.` Then stop.
       5. **Just-in-time planning:** Invoke `$plan-phases` for the new phase. This generates implementation steps and file-level detail using the full context of what was learned during prior phases.
     - If **NO:** find the next uncompleted step within the current phase.
16. Write a self-contained next-step plan into `tasks/todo.md`.
17. Commit and push `tasks/todo.md`, `tasks/roadmap.md`, `tasks/manual-todo.md` (if it exists), and `tasks/phases/` (if created).
18. **Kanban: Ensure next card in Todo**
   - Search for the next step's card.
   - If it is in Backlog, move it to Todo.
   - If it is not found, create it in Todo.
   - If it is already in Todo or later, skip.
19. **Next Work Suggestion:** Suggest the top Todo card by priority (overdue > starred > list order). If no Todo cards, check Backlog. If nothing: `Board is clear.`

## Output

- Step or phase completed
- Files modified
- Deploy status (if deployed)
- Test results (expected vs unexpected failures)
- Manual tasks — pending count from `tasks/manual-todo.md` (if it exists)
- Kanban status
- What is next (just its name)

## Constraints

- One step at a time by default, or one phase with `--phase`. Then stop and let the user decide what is next.
- Always present the plan and get approval before executing. Do not assume a Claude-style `EnterPlanMode` or clear-context accept flow exists.
- Keep context footprint minimal — only read files relevant to the current step.
- If a blocker prevents completion, document it in `tasks/todo.md` and stop.
- Follow the test strategy annotated on each phase. Do not skip test steps for `tdd` phases.
- Do NOT execute items from `tasks/manual-todo.md` — those require human action.
- `run-kanban` ships by default in Codex. Use `$ship-kanban` only when there is already finished work in the tree or board state that needs packaging without running a new step.
- Kanban operations are additive — if any fail, warn and continue. Core workflow must succeed.
- Conflict warnings are advisory only — never block.
- Never use GitHub Actions for deployment. Only use manual deploy scripts, Makefiles, or CLI commands.
- Never deploy to production without explicit user confirmation.
- Do not modify code as part of the deploy process.
