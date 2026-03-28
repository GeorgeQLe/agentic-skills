---
name: poketo-kanban
description: Manage Poketo kanban boards — list boards, view board state, create/update/move cards, manage lists. Use when the user wants to track tasks, view project status, or manage work items.
version: 1.0.0
argument-hint: <subcommand> [options]
---

# Poketo Kanban — Board & Task Management

Manage Poketo Work kanban boards directly from any session. All operations go straight to the Neon Postgres database — no gateway server needed.

## Prerequisites

- `~/.poketo/config.json` must contain a valid session (run `poketo auth login` first)
- `POKETOWORK_DATABASE_URL` environment variable must be set

## Process

1. **Parse subcommand** from `$ARGUMENTS`:
   - `boards` — list all boards
   - `board <id>` — view a board's lists and cards
   - `search --query "<term>"` — search cards across all boards
   - `create-card`, `update-card`, `move-card`, `done` — card mutations
   - `create-board`, `create-list` — board/list mutations

2. **Execute via CLI:**
   - Run the appropriate command via `node ${CLAUDE_SKILL_DIR}/scripts/kanban.mjs <command> [options]`

3. **Present results:**
   - Parse JSON output and display in human-readable format.
   - After mutations, re-fetch the board to show updated state.

## Output Format

- For `boards`: table of board names and IDs
- For `board <id>`: each list as a column header with cards as bullet points (include done status, due dates, starred)
- For mutations: confirmation with created/updated entity details

## Constraints

- If output contains `{ "error": "..." }`, report the error to the user with remediation steps.
- After any mutation, re-fetch and display the updated board state.
