---
name: sync-roadmap-kanban
description: Reconcile kanban board state with roadmap docs and codebase reality — sync cards, steps, and git history so they agree.
allowed-tools: Bash(node *), Bash(git *)
---

# Sync Roadmap ↔ Kanban

Reconcile the kanban board, roadmap docs, and codebase state so all three reflect the same reality.

## Process

### 1. Pull latest

Run `/sync` first. If there are merge conflicts, **stop** and report them — do not proceed with reconciliation on a dirty tree.

### 2. Read kanban state

```bash
node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs boards
```

- If there is exactly one board, use it.
- If there are multiple boards, check for a board mapping file at `tasks/.kanban-board` (contains a board ID). If no mapping exists, list the boards and ask the user to pick one. Do not guess.
- Run `board <id>` to get the full board state (all lists and cards).

### 3. Read roadmap docs

- Read `tasks/roadmap.md` (full phased plan).
- Read `tasks/todo.md` (current phase steps).
- Build a list of all roadmap items with their status (checked/unchecked).

### 4. Read codebase reality

- Run `git log --oneline -30` to see recent commits.
- For each roadmap item that claims to be done (checked) or has a "done" kanban card, verify the deliverable exists:
  - If the item references a file or directory, check it exists.
  - If the item references a feature, grep for key identifiers.
  - If verification is ambiguous, flag it rather than assuming.

### 5. Reconcile

Apply these rules in order:

**Rule 1 — Kanban done + code confirms → mark roadmap complete**
Cards in a "Done" list whose deliverables are verified in the codebase → check off the corresponding roadmap/todo item if not already checked.

**Rule 2 — Roadmap done + code confirms → move kanban card to Done**
Roadmap items that are checked off and verified in code, but their kanban card is not in "Done" → move the card to the Done list.

**Rule 3 — New roadmap items with no card → create cards**
Roadmap steps or phases that have no matching kanban card → create a card in the appropriate list:
- Unchecked items → "Backlog" or first non-Done list
- Items in the current phase's todo → "In Progress" list (if one exists)

**Rule 4 — Orphaned kanban cards → flag**
Cards on the board that don't correspond to any roadmap item → report as orphaned. Do NOT delete them — the user may want to add them to the roadmap or archive them.

**Rule 5 — Claimed done but code doesn't support → flag as discrepancy**
Items marked done (in roadmap or kanban) but whose deliverables cannot be verified in the codebase → report as discrepancies. Do NOT uncheck or move them — let the user decide.

### 6. Apply changes

- **Kanban mutations:** Use the poketo-kanban scripts to create cards, move cards, or mark cards done.
  ```bash
  node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs create-card --board <id> --list <list-id> --name "Step name" --description "Details"
  node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs move-card --id <card-id> --list <done-list-id>
  node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs done --id <card-id>
  ```
- **Roadmap doc edits:** Use Edit to check off completed items in `tasks/roadmap.md` and `tasks/todo.md`.
- After all mutations, re-fetch the board to confirm the final state.

### 7. Report

Output a summary with these sections:

**Synced:**
- Items checked off in roadmap (list them)
- Cards moved to Done (list them)
- Cards created (list them)

**Discrepancies (needs human judgment):**
- Items claimed done but not verified in code
- Orphaned kanban cards with no roadmap match

**Board state:** Show the updated board (lists and cards).

**Roadmap state:** Show current phase progress (e.g., "Phase 1: 2/3 steps complete").

## Constraints

- Do NOT auto-resolve discrepancies — always report and let the user decide.
- Do NOT delete kanban cards. Move or flag only.
- Do NOT force-push or rewrite git history.
- Do NOT modify code — this skill only syncs metadata (docs and board state).
- Do NOT proceed if the working tree has merge conflicts from the sync step.
- Card-to-roadmap matching is by name similarity. Use fuzzy matching (the card name should contain key words from the roadmap step). When ambiguous, ask rather than guess.
- If poketo-kanban scripts are not installed or fail, report the error and stop.
