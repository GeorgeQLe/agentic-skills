# Spec: Add --board flag to kanban search

## Overview

Add an optional `--board <id>` flag to `kanban.mjs search` that scopes results to specific board(s) instead of scanning all org boards. The flag can be repeated to search a subset of boards.

## Motivation

`cmdSearch` currently queries all 21 org boards on every invocation. Kanban skills already resolve the current project's board ID via `tasks/.kanban-board`, so they have the ID ready. Scoping search to a single board reduces query surface and makes idempotency checks faster.

## Detailed Design

### Flag Behavior

- **Flag:** `--board <uuid>` (optional, repeatable)
- **Format:** Board ID only (UUID). No name matching.
- **When present:** Search only the specified board(s).
- **When absent:** Current behavior — search all org boards.
- **Multiple values:** `--board <id1> --board <id2>` searches both boards.

### Argument Parsing

Add a new `getAllArgs(args, flag)` utility alongside the existing `getArg`:

```javascript
function getAllArgs(args, flag) {
  const values = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag && i + 1 < args.length) {
      values.push(args[++i]);
    }
  }
  return values;
}
```

### Search Logic Changes (`cmdSearch`)

1. Parse `--board` flags via `getAllArgs(args, "--board")`.
2. If board IDs provided:
   - Validate each ID belongs to the user's org. If any ID is invalid or not found, **exit with error**: `"Board not found: <id>"`.
   - Use the provided board IDs directly instead of querying all org boards.
3. If no `--board` flag: fall through to current all-boards behavior.
4. Rest of the function (list lookup, card search, enrichment) unchanged.

### Output Shape

No change. Results always include `boardName` and `boardId` fields regardless of whether `--board` was used. This preserves backward compatibility for all consumers parsing the JSON.

### Search Scope

Name-only ILIKE search. No change to search semantics. Description search is out of scope (could be a separate `--description` flag later).

### Error Handling

| Scenario | Behavior |
|----------|----------|
| `--board` with valid ID | Search scoped to that board |
| `--board` repeated N times | Search scoped to those N boards |
| `--board` with unknown ID | Exit 1: `"Board not found: <id>"` |
| `--board` with ID from another org | Exit 1: `"Board not found: <id>"` |
| No `--board` flag | Current behavior (all org boards) |

## Scope Boundaries

### In Scope
- `--board` flag on `search` command
- `getAllArgs` utility function
- Board ID validation with error exit
- Tests for new flag behavior

### Out of Scope
- Board name matching / fuzzy search
- Description search (`--description` flag)
- Adding `--board` to other commands (can follow later)
- Changes to output schema

## Implementation Notes

- Signal location: `kanban.mjs:430-501` (`cmdSearch`)
- New utility: `getAllArgs` near existing `getArg` at line 615
- Effort: Quick win (hours)
