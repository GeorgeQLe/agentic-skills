---
name: poketo-kanban
description: Manage Poketo kanban boards — list boards, view board state, create/update/move cards, manage lists. Use when the user wants to track tasks, view project status, or manage work items.
type: ops
version: v0.1
argument-hint: "<subcommand> [options] [--archive]"
allowed-tools: Bash(poketo *)
---

# Poketo Kanban — Board & Task Management

Invoke as `$poketo-kanban`.

Manage Poketo Work kanban boards directly from any session. All operations go through the poketo CLI gateway.

## Prerequisites

- `poketo` CLI installed and on PATH
- Authenticated: `poketo auth login` or `POKETO_API_KEY` env var set

## Process

1. **Parse subcommand** from `$ARGUMENTS`:
   - `boards` — list all boards
   - `board <id>` — view a board's lists and cards
   - `search --query "<term>"` — search cards across all boards
   - `create-card`, `update-card`, `move-card`, `done` — card mutations
   - `create-board`, `create-list` — board/list mutations

2. **Execute via CLI:**
   - Run the appropriate command via `poketo kanban <command> [options]`

3. **Present results:**
   - Parse JSON output and display in human-readable format.
   - After mutations, re-fetch the board to show updated state.

## Output Format

- For `boards`: table of board names and IDs
- For `board <id>`: each list as a column header with cards as bullet points (include done status, due dates, starred)
- For mutations: confirmation with created/updated entity details

## Constraints

- If output contains `{ "error": "..." }`, report the error to the user with remediation steps.
- `"Not authenticated"` → tell user to run `poketo auth login`
- `"Could not reach the gateway"` → tell user to check that the gateway is running and reachable
- After any mutation, re-fetch and display the updated board state.

## Archive Mode (`--archive`)

When `$ARGUMENTS` contains `--archive` (or starts with `archive`), archive old Done and Punt cards. Use `--days <N>` to override the 30-day default.

### Setup

Run board resolution: check `tasks/.kanban-board` for stored ID, validate via `poketo kanban board <id>`. If missing, match board names against `basename $(pwd)`. If no match, ask the user. If setup fails, report the error and stop — this operation requires a working kanban connection.

### Process

1. **Parse arguments**: Extract `--days <N>` from `$ARGUMENTS`. Default to 30.
2. **Fetch board state**: Run `poketo kanban board <id>` to get all lists and cards.
3. **Find archivable cards**: Cards in Done/Punt lists where age (from `updatedAt` or `createdAt`) exceeds the threshold. If none qualify, report and stop.
4. **Display candidates**: Show each card with list name, last update date, and age.
5. **Confirm with user**: Ask "Archive these N cards? (y/n)". If declined, stop.
6. **Archive cards**: Run `poketo kanban archive-card --id <card-id>` for each. Continue on individual failures.
7. **Report**: "Archived N cards (X from Done, Y from Punt)."

### Constraints
- Never archive without explicit user confirmation.
- Process Done cards first, then Punt — oldest first within each list.
- Only archive from Done and Punt lists.
- The `poketo kanban archive-card` command handles auto-creating the Archive list.


## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/poketo-kanban-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
