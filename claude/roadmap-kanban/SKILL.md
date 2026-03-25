---
name: roadmap-kanban
description: Build or update the project roadmap, then sync phases and steps to kanban board — current phase steps go to Todo, future phases to Backlog
argument-hint: [--existing] [path-to-spec]
allowed-tools: Bash(node *)
---

# Roadmap Builder (Kanban)

Build or update `tasks/roadmap.md` by synthesizing all project documentation, interviewing the user on priorities and sequencing, and producing a phased roadmap. After writing the roadmap, sync phases and steps to the kanban board.

## Kanban Setup

Run these steps before the main process. If any step fails, warn the user and continue without kanban — the roadmap output must always succeed.

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

If the poketo-kanban scripts are not found at `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`, or if the first kanban command fails (DB connectivity, auth error), warn the user and continue with the base roadmap behavior. Kanban operations are additive — never block the core workflow.

## Modes

### New Project (default)
When `tasks/roadmap.md` does not exist or is empty. Reads specs and interviews to create the roadmap from scratch.

### Existing Project (`--existing`, or when `tasks/roadmap.md` already has content)
Reviews the codebase, documented history, and current roadmap. Updates the roadmap with new work, completed phases, or changed priorities.

## Process

### 1. Gather Context

Read all available project documentation:

- **`specs/`** directory (individual spec files from `/plan-interview-kanban` and `/plan-interview-ideas`), or `spec.md` if it exists for backwards compatibility
- **`specs/icp.md`** — customer discovery from `/icp` (if it exists)
- **`specs/mvp-gap.md`** — MVP gap analysis from `/mvp-gap` (if it exists)
- **`specs/enterprise-icp.md`** and **`specs/scale-audit.md`** — enterprise discovery and audit (if they exist)
- **`tasks/roadmap.md`** — existing roadmap if any
- **`tasks/todo.md`** — current work in progress
- **`tasks/history.md`** — what's been accomplished
- **`tasks/ideas.md`** — brainstorm output not yet specced
- **`CLAUDE.md`** — project conventions
- **`README.md`** or equivalent — project overview

For existing projects, also:
- Review key source files to understand what's already built
- Check git log for recent activity and trajectory
- Identify gaps between spec and implementation (what's done vs. what remains)

### 2. Synthesize and Present

Present the user with a structured summary:

**For new projects:**
- List each spec section / feature area identified
- Note dependencies between them
- Highlight any conflicts or overlaps between specs
- Flag specs that seem incomplete or ambiguous

**For existing projects:**
- What's been built (verified against codebase, not just docs)
- What's in progress (current phase/step from todo.md)
- What's remaining on the current roadmap
- New specs or ideas not yet on the roadmap
- Whether the current roadmap needs restructuring

### 3. Interview on Strategy

Use the AskUserQuestion tool to align on roadmap decisions. Ask one to three focused questions per turn. Cover:

- **Priority**: Which features/specs are most important? What's MVP vs. later?
- **Grouping**: Should any specs be combined into a single phase? Split apart?
- **Sequencing**: What depends on what? What should ship first for user value or risk reduction?
- **Scope**: Should anything be deferred, dropped, or marked as stretch?
- **Market fit** (when ICP/gap specs exist): Which phases directly address customer pain points or deal-blockers from gap analysis? Prioritise these unless technically impossible. Surface tension between technical sequencing and market urgency.
- **Phase sizing**: Preference for many small phases vs. fewer larger ones?
- **Existing work**: (existing projects) Does completed work change priorities? Should anything be reworked?

When options exist, present pros/cons with a recommendation — same style as `/plan-interview-kanban`. Do not manufacture artificial choices.

Continue until the user confirms the phase structure is complete.

### 4. Write the Roadmap

Write `tasks/roadmap.md` with the agreed phase structure. Use this format:

```markdown
# Roadmap: [Project Name]

> Generated from: [source files]
> Date: [current date]
> Total Phases: [N]

## Summary
[2-3 sentence overview of the implementation strategy and sequencing rationale]

## Phase Overview
| Phase | Title | Source Spec(s) | Key Deliverable | Est. Complexity |
|-------|-------|----------------|-----------------|-----------------|
| 1     | ...   | ...            | ...             | S / M / L       |

---

## Phase 1: [Title]

**Goal**: [What this phase achieves and why it comes first]

**Scope**:
- [Feature/capability 1]
- [Feature/capability 2]

**Acceptance Criteria:**
- [ ] [Specific, verifiable criterion 1]
- [ ] [Specific, verifiable criterion 2]

**On Completion** (fill in when phase is done):
- Deviations from plan: [none, or describe]
- Tech debt / follow-ups: [none, or list]
- Ready for next phase: yes/no

---

[Repeat for each phase]

---

## Deferred / Future Work
- [Items explicitly descoped during interview, with reasoning]

## Cross-Phase Concerns
### Integration Tests
- [Tests that span multiple phases]
### Non-Functional Requirements
- [Performance, security, accessibility]
```

**Important**: The roadmap defines phases, goals, scope, and acceptance criteria — but NOT implementation steps, TDD structure, or file-level detail. That's `/plan-phases`' job.

### 5. Populate Phase 1 Detail

After writing the roadmap, invoke `/plan-phases` scoped to Phase 1 only. This fills in the TDD steps and writes `tasks/todo.md`.

If `tasks/todo.md` already exists with in-progress work, ask the user before overwriting.

### 6. Update History (existing projects only)

If updating an existing roadmap, append a brief entry to `tasks/history.md` noting the roadmap was revised and why.

## Kanban Sync

After writing the roadmap and populating Phase 1, sync to the kanban board:

### Current phase steps → Todo

1. Read `tasks/todo.md` to get all `- [ ]` step names for the current phase.
2. For each step:
   a. Search the board for a card with that step name: `search --query "<step name>"`
   b. If found in Backlog → move to Todo: `move-card --id <card-id> --list <todo-list-id>`
   c. If found in Todo or later list → skip (already positioned correctly)
   d. If not found → create in Todo:
      ```bash
      node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs create-card --board <id> --list <todo-list-id> --name "<step name>" --description "Phase: <phase name>"
      ```

### Future phases → Backlog

3. For each future phase in `tasks/roadmap.md` (phases after the current one):
   a. Search the board for a card with the phase title: `search --query "<Phase N: Title>"`
   b. If not found → create a summary card in Backlog:
      ```bash
      node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs create-card --board <id> --list <backlog-list-id> --name "Phase N: <Title>" --description "<Phase goal>"
      ```
   c. If found → skip (already exists)

4. Report: "Created X Todo cards, moved Y from Backlog to Todo, created Z Backlog cards for future phases, skipped W existing."

## Constraints

- **Always interview.** Do not produce a roadmap without user input on priorities and sequencing. The whole point is interactive alignment.
- **Respect existing specs.** Do not modify files in `specs/` (or `spec.md`) — the roadmap references specs, it doesn't rewrite them.
- **Phase headers must use `## Phase N: [Title]` format** for compatibility with `/run-kanban`, `/ship-kanban`, and phase transition logic.
- **Acceptance criteria must be specific and checkable** — not vague statements like "works correctly."
- **Do not include TDD steps or file-level implementation detail** in the roadmap. That belongs in `/plan-phases`.
- **`tasks/roadmap.md` is the source of truth** for the full phased plan. `tasks/todo.md` holds only the current phase.
- **Do not put roadmap content in CLAUDE.md** — CLAUDE.md is for project conventions only.
- **Keep the interview focused.** This is about sequencing and priority, not re-litigating spec decisions. If a spec question comes up, note it and suggest running `/plan-interview-kanban` again for that topic.
- Kanban operations are additive — if board resolution or any kanban command fails, warn and continue. The roadmap output must always succeed regardless of kanban state.
- Only move cards FROM Backlog → Todo. Never move cards backward from Todo, In Progress, Done, or Punt.
