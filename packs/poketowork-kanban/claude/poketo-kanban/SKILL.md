---
name: poketo-kanban
description: Manage Poketo kanban boards — list boards, view board state, create/update/move cards, manage lists. Use when the user wants to track tasks, view project status, or manage work items.
type: ops
version: 1.1.0
allowed-tools: Bash(poketo *)
---

# Poketo Kanban — Board & Task Management

Manage Poketo Work kanban boards directly from any Claude session. All operations go through the poketo CLI gateway.

## Prerequisites

- `poketo` CLI installed and on PATH
- Authenticated: `poketo auth login` or `POKETO_API_KEY` env var set

## Commands

Run commands via:
```bash
poketo kanban <command> [options]
```

### Read Operations

**List all boards:**
```bash
poketo kanban boards
```

**View a board (lists + cards):**
```bash
poketo kanban board <board-id>
```

**Search cards across all boards:**
```bash
poketo kanban search --query "search term"
```

### Card Operations

**Create a card:**
```bash
poketo kanban create-card --board <board-id> --list <list-id> --name "Card title" [--description "Details"]
```

**Update a card:**
```bash
poketo kanban update-card --id <card-id> [--name "New name"] [--description "New desc"]
```

**Mark a card done:**
```bash
poketo kanban done --id <card-id>
```

**Move a card to another list:**
```bash
poketo kanban move-card --id <card-id> --list <target-list-id>
```

### Board & List Operations

**Create a new board (with standard lists: Backlog, Todo, In Progress, Done, Punt):**
```bash
poketo kanban create-board --name "Board Name" --template standard
```

**Create a bare board (no lists):**
```bash
poketo kanban create-board --name "Board Name"
```

**Add a list to a board:**
```bash
poketo kanban create-list --board <board-id> --name "List Name"
```

## Output Format

All commands output JSON. Parse the output and present results in a human-readable format:
- For `boards`: show a table of board names and IDs
- For `board <id>`: show each list as a column header, with cards as bullet points underneath (include done status, due dates, starred)
- For mutations: confirm the action with the created/updated entity details

## Error Handling

If the output contains `{ "error": "..." }`, report the error message to the user. Common errors:
- `"Not authenticated"` → tell user to run `poketo auth login`
- `"Could not reach the gateway"` → tell user to check that the gateway is running and reachable
- `"Board not found"` → verify the board ID

## Workflow Tips

When the user asks to "track tasks" or "manage my board":
1. First run `boards` to show available boards
2. Then `poketo kanban board <id>` to show the selected board's state
3. Create/update/move cards as requested
4. After mutations, re-fetch the board to show updated state

## Archive (`--archive`)

When `$ARGUMENTS` contains `--archive` (or starts with `archive`), archive old Done and Punt cards. Use `--days <N>` to override the 30-day default threshold.

### Kanban Setup

Read and follow the Kanban Setup protocol in `~/.claude/skills/poketo-kanban/KANBAN-SETUP.md` (Board Resolution and Board Validation — skip Board Overview). If any setup step fails, report the error and stop — this operation requires a working kanban connection.

### Process

1. **Parse arguments**: Extract `--days <N>` from `$ARGUMENTS`. Default to 30.
2. **Fetch board state**: Run `poketo kanban board <id>` to get all lists and cards.
3. **Find archivable cards**: Cards in Done or Punt lists where age (from `updatedAt` or `createdAt`) exceeds the threshold. If none qualify, report and stop.
4. **Display candidates**: Show each card with list name, last update date, and age.
5. **Confirm with user**: Ask "Archive these N cards? (y/n)". If declined, stop.
6. **Archive cards**: Run `archive-card --id <card-id>` for each. Continue on individual failures.
7. **Report**: "Archived N cards (X from Done, Y from Punt)."

### Constraints
- Never archive without explicit user confirmation.
- Process Done cards first, then Punt — oldest first within each list.
- Only archive from Done and Punt lists.
- The `archive-card` command handles auto-creating the Archive list.


## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
