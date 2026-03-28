---
name: poketo-kanban
description: Manage Poketo kanban boards — list boards, view board state, create/update/move cards, manage lists. Use when the user wants to track tasks, view project status, or manage work items.
version: 1.0.0
allowed-tools: Bash(node *)
---

# Poketo Kanban — Board & Task Management

Manage Poketo Work kanban boards directly from any Claude session. All operations go straight to the Neon Postgres database — no gateway server needed.

## Prerequisites

- `~/.poketo/config.json` must contain a valid session (run `poketo auth login` first)
- `POKETOWORK_DATABASE_URL` environment variable must be set

## Commands

Run commands via:
```bash
node ${CLAUDE_SKILL_DIR}/scripts/kanban.mjs <command> [options]
```

### Read Operations

**List all boards:**
```bash
node ${CLAUDE_SKILL_DIR}/scripts/kanban.mjs boards
```

**View a board (lists + cards):**
```bash
node ${CLAUDE_SKILL_DIR}/scripts/kanban.mjs board <board-id>
```

**Search cards across all boards:**
```bash
node ${CLAUDE_SKILL_DIR}/scripts/kanban.mjs search --query "search term"
```

### Card Operations

**Create a card:**
```bash
node ${CLAUDE_SKILL_DIR}/scripts/kanban.mjs create-card --board <board-id> --list <list-id> --name "Card title" [--description "Details"] [--due "2026-04-01"]
```

**Update a card:**
```bash
node ${CLAUDE_SKILL_DIR}/scripts/kanban.mjs update-card --id <card-id> [--name "New name"] [--description "New desc"] [--done] [--due "2026-04-01"] [--starred]
```

**Mark a card done:**
```bash
node ${CLAUDE_SKILL_DIR}/scripts/kanban.mjs done --id <card-id>
```

**Move a card to another list:**
```bash
node ${CLAUDE_SKILL_DIR}/scripts/kanban.mjs move-card --id <card-id> --list <target-list-id>
```

### Board & List Operations

**Create a new board (with default lists: Backlog, In Progress, Done):**
```bash
node ${CLAUDE_SKILL_DIR}/scripts/kanban.mjs create-board --name "Board Name"
```

**Add a list to a board:**
```bash
node ${CLAUDE_SKILL_DIR}/scripts/kanban.mjs create-list --board <board-id> --name "List Name"
```

## Output Format

All commands output JSON. Parse the output and present results in a human-readable format:
- For `boards`: show a table of board names and IDs
- For `board <id>`: show each list as a column header, with cards as bullet points underneath (include done status, due dates, starred)
- For mutations: confirm the action with the created/updated entity details

## Error Handling

If the output contains `{ "error": "..." }`, report the error message to the user. Common errors:
- `"Not authenticated"` → tell user to run `poketo auth login`
- `"POKETOWORK_DATABASE_URL not set"` → tell user to set the environment variable
- `"Board not found"` → verify the board ID

## Workflow Tips

When the user asks to "track tasks" or "manage my board":
1. First run `boards` to show available boards
2. Then `board <id>` to show the selected board's state
3. Create/update/move cards as requested
4. After mutations, re-fetch the board to show updated state
