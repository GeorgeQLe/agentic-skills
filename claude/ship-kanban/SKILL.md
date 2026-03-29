---
name: ship-kanban
description: Ship current work, move kanban card to Done or Punt, deploy, and plan the next step with card in Todo
version: 1.0.0
argument-hint: [--no-plan] [--no-deploy]
allowed-tools: Bash(node *)
---

# Ship (Kanban)

Ship current work, commit, push, deploy, and plan the next step. Moves the completed step's kanban card to Done or Punt, and ensures the next step's card is in Todo. If `$ARGUMENTS` contains `--no-plan`, skip planning. If `$ARGUMENTS` contains `--no-deploy`, skip deployment.

## Kanban Setup

Run these steps before the main process. If any step fails, warn the user and continue without kanban — the core ship workflow must always succeed.

### Board Resolution

```bash
node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs boards
```

1. If `tasks/.kanban-board` exists, read the board ID. Verify it via `board <id>`. If stale (error), delete the file and continue to step 2.
2. If no valid mapping: match board names against `basename $(pwd)` (case-insensitive). Prefer exact match over substring.
3. If one match → use it, save ID to `tasks/.kanban-board`.
4. If zero or multiple matches → list boards, ask the user to pick. Save their choice.
5. If no boards exist → ask the user if they want to create one. If yes: `create-board --name "$(basename $(pwd))" --template standard`. Save the ID.

### Board Validation

After resolving the board, verify all 5 required lists exist (case-insensitive name match): **Backlog, Todo, In Progress, Done, Punt**. If any are missing, create them via `create-list --board <id> --name "<name>"`. Store list IDs for use in subsequent operations.

### Graceful Degradation

If the poketo-kanban scripts are not found at `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`, or if the first kanban command fails (DB connectivity, auth error), warn the user and continue with the base ship behavior. Kanban operations are additive — never block the core workflow.

## Process

### 1. Check if there's anything to ship
Run `git status` and `git diff --stat`.
- If the working tree is clean AND there are no unpushed commits: skip to step 3 (or stop if `--no-plan`).
- If there are changes: continue to step 2.

### 2. Ship the work
a) Read the project's CLAUDE.md to understand current progress.
b) Update `tasks/todo.md` — mark completed items as done (check off steps and milestone criteria).
c) Update `tasks/history.md` — append a brief record of what was accomplished this session (phase/step completed, key changes). Create it if it doesn't exist.
d) Commit and push using the /commit-and-push-by-feature workflow:
   - Group changes into logical feature/function buckets.
   - Use conventional commit messages.
   - Push to the current branch.

### 2b. Kanban: Move completed card

After shipping, move the completed step's kanban card:

1. Identify the step(s) that were just checked off in `tasks/todo.md`.
2. For each completed step, search the board: `search --query "<step name>"`
3. Determine Done vs. Punt:
   - **Step checkbox checked off** (normal completion) → move card to Done list + mark done:
     ```bash
     node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs move-card --id <card-id> --list <done-list-id>
     node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs done --id <card-id>
     ```
   - **Step has a blocker note or was explicitly deferred** → move card to Punt list + add reason:
     ```bash
     node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs move-card --id <card-id> --list <punt-list-id>
     node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs update-card --id <card-id> --description "<existing desc> | Punted: <reason>"
     ```
   - **Unclear** (step not checked, no blocker) → ask the user: "Move to Done or Punt?"
4. Update card description with commit SHAs from this session.

### 3. Deploy (skip if `--no-deploy`)
After pushing, deploy the project using the project's own deployment mechanism.

a) **Find the deploy method.** Check these locations in order:
   - `spec.md` — look for a deployment section
   - `CLAUDE.md` — look for deploy commands or instructions
   - `tasks/roadmap.md` — look for deploy instructions
   - `tasks/todo.md` — look for deploy instructions
   - `Makefile` / `Justfile` — look for deploy targets (e.g., `make deploy`, `just deploy`)
   - `package.json` — look for deploy scripts (e.g., `npm run deploy`)
   - `deploy/`, `infra/`, `scripts/` — look for deploy shell scripts
   - `docker-compose*.yml` — container-based deploys
   - **Do NOT look in `.github/workflows/`** — this project does not use GitHub Actions.
   - If no deploy method is found, **ask the user** how deployment works for this project. Do not guess or skip.

b) **Run the deploy** using the discovered mechanism.

c) **Verify the deploy:**
   - Check output for errors.
   - If there's a health check URL or status command in the project config, run it.
   - Report success or failure.

d) If the deploy fails, report the error clearly. Do not retry automatically.

### 4. Plan the next step (skip if `--no-plan`)

**Prerequisite:** If neither `tasks/todo.md` nor `tasks/roadmap.md` exists, or if no uncompleted steps remain, there is no plan to continue. Run `/workflow` to scan project state and recommend the next context-aware action (stale research, missing steps, etc.). Then stop (do not enter plan mode, skip steps 4b, 4c, 5, and 6).

a) **Migration check:** If `tasks/roadmap.md` does not exist but `tasks/todo.md` contains multiple `## Phase` headers, migrate: copy `tasks/todo.md` → `tasks/roadmap.md`, then trim `tasks/todo.md` to just the current phase (first phase with unchecked steps). Commit with `chore: migrate to roadmap.md + todo.md split`.
b) Read `tasks/todo.md` to identify the next uncompleted step in the current phase.
c) **Check if the current phase is complete** (all steps checked, milestone criteria met):
   - If **YES — Phase transition:**
     1. Archive the completed phase: copy `tasks/todo.md` → `tasks/phases/phase-N.md` (create `tasks/phases/` if needed). Fill in the "On Completion" section.
     2. Check off the phase milestone in `tasks/roadmap.md`.
     3. Copy the next phase from `tasks/roadmap.md` → overwrite `tasks/todo.md`.
     4. If no more phases remain, run `/workflow` to recommend the next action based on project state. Then stop (do not enter plan mode).
     5. **Just-in-time planning:** Invoke `/plan-phases` for the new phase. This generates TDD steps and file-level detail using the full context of what was learned during prior phases.
   - If **NO:** find the next uncompleted step within the current phase.
d) Write a **self-contained** implementation plan for the next step into `tasks/todo.md`. This plan must be complete enough that a fresh context can execute it by reading only CLAUDE.md and `tasks/todo.md`. Include:
   - What needs to be built/changed
   - Which files will be affected (full paths)
   - Key technical decisions or risks
   - Relevant context from the current session (gotchas, patterns established, conventions used)
   - If TDD: which tests to write first and what they should assert
   - Acceptance criteria: how to verify the step is done
e) Commit and push `tasks/todo.md`, `tasks/roadmap.md`, and `tasks/phases/` (if created).

### 4b. Kanban: Ensure next card in Todo (skip if `--no-plan`)

After planning the next step, ensure its kanban card exists in Todo:

1. Search the board for the next step's card: `search --query "<next step name>"`
2. Based on where it's found:
   - **In Backlog** → move to Todo:
     ```bash
     node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs move-card --id <card-id> --list <todo-list-id>
     ```
   - **Not found** → create in Todo:
     ```bash
     node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs create-card --board <id> --list <todo-list-id> --name "<next step name>" --description "Phase: <phase name>"
     ```
   - **Already in Todo or later** → skip (already positioned correctly).

### 4c. Next Work Suggestion

After completing kanban operations, suggest the next highest-priority card:

1. Read all cards in the Todo list from the board state.
2. Rank by priority:
   - First: cards with overdue due dates (past today)
   - Second: starred cards
   - Third: list position order (lower order = higher priority)
3. Display the top suggestion: "**Suggested next:** `card-name`" with description summary and due date if set.
4. If no Todo cards exist, check Backlog for starred or overdue items. If nothing: "Board is clear — no pending work."
5. This is a suggestion only — the user decides what to do next.

### 5. Output a brief summary (2-3 lines max to save context)
- What was shipped (if anything)
- Deploy status (if deployed)
- Test status — **explicitly state whether any failing tests are expected (red phase: tests written before implementation) or unexpected (regressions/bugs that need fixing)**
- Kanban status (card moved to Done/Punt, next card in Todo)
- What the next step is (1 sentence) — or "session wrapped up" if `--no-plan`

### 6. Enter plan mode (skip if `--no-plan`)
**Before entering plan mode**, read `.claude/settings.local.json` and ensure `"showClearContextOnPlanAccept": true` is set. If the file doesn't exist, create it with `{ "showClearContextOnPlanAccept": true }`. If it exists but lacks the key, add it (preserve existing settings).

**YOU MUST call the EnterPlanMode tool.** This is not optional. This gives the user the option to "clear context and implement" — which starts a fresh context that reads `tasks/todo.md` and implements the plan.

### 7. Present the plan (skip if `--no-plan`)
After entering plan mode, **present the execution plan** to the user. Summarize the plan that was written to `tasks/todo.md` in step 4d:
- What needs to be built/changed
- Which files will be created or modified (full paths)
- The approach (e.g., TDD order, key technical decisions)
- Any decisions or trade-offs the user should weigh in on

This gives the user something concrete to review before selecting "clear context and implement".

## Workflow

```
/run-kanban            → plans one step, moves card to In Progress, executes
/ship-kanban           → commits, pushes, moves card to Done/Punt, plans next
                       → select "clear context and implement"
                       → fresh context reads tasks/todo.md and implements
```

## Constraints
- **Fix unrelated issues:** If any step surfaces errors, warnings, or lint issues — even ones unrelated to the current work — investigate and fix them before continuing. Commit these fixes separately with a descriptive message.
- Do NOT write plans into CLAUDE.md. CLAUDE.md is for project conventions and config only.
- `tasks/roadmap.md` is the source of truth for the full phased plan. `tasks/todo.md` holds only the current phase.
- Do NOT create `tasks/todo.md` from scratch — if it doesn't exist and there's no roadmap, suggest discovery skills instead.
- Do NOT re-read files you've already read this session. Use what's in context.
- Do NOT explore the codebase extensively for planning. Keep context footprint minimal.
- If the tree is clean and the next step plan already exists in `tasks/todo.md`, skip straight to step 6.
- Do not amend or rewrite history.
- Do not commit secrets.
- The plan must be actionable, not vague. Include specific file paths and technical details.
- Never use GitHub Actions for deployment.
- Never deploy to production without explicit user confirmation.
- Do not modify code as part of the deploy process.
- Kanban operations are additive — if any kanban command fails, warn and continue. The core ship workflow must always succeed regardless of kanban state.
