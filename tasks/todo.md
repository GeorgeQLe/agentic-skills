# Kanban Skill Validation

**Goal:** Manually walk through each kanban skill to verify it works correctly before adopting across active projects.

## Steps

- [ ] **Manual walkthrough of kanban skills** — run each skill against this repo with a real test board

### Plan: Manual Skill Walkthrough

**What:** Run each of the 9 kanban skills in workflow order against the claude-skills repo, using a real test board on the Neon DB. Document results.

**Prerequisites (done):**
- `~/.poketo/config.json` exists with orgId `1f09322a-4b4f-6861-bacb-a60b9bfbe6fd`
- `POKETOWORK_DATABASE_URL` available from `~/projects/apps/poke/monorepo/.env.local`
- kanban.mjs integration tests passing (24/24)
- Layer 1 (scripted integration tests) — 24/24 PASS
- Layer 2 (manual command verification) — all 9 skills' underlying commands verified

**Remaining: Layer 3 — End-to-end skill invocation**

Run each skill as a slash command in a Claude Code session and verify the full prompt-based workflow works. After each skill, check board state with:
```
node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs board 5ab6bbdb-d06c-4e47-8a27-5e1de29b2df7
```

1. **`/brainstorm-kanban`** — invoke with a focus area, verify Backlog cards created, check idempotency
2. **`/plan-interview-kanban`** — pick an idea from brainstorm, verify card updated with spec
3. **`/roadmap-kanban`** — verify cards move from Backlog to Todo
4. **`/run-kanban`** — verify Todo → In Progress, hostname/branch metadata, progress updates
5. **`/ship-kanban`** — verify In Progress → Done, commit refs, next card in Todo
6. **`/ship-end-kanban`** — verify session wrap-up, In Progress → Done
7. **`/sync-roadmap-kanban`** — verify board/roadmap reconciliation
8. **`/kanban-archive`** — verify Done cards archived with confirmation prompt

**Note:** `/poketo-kanban` (Board Resolution) already verified — board exists with correct 5 lists.

**Acceptance criteria:**
- All 8 remaining skills tested end-to-end as slash commands
- Results documented in `docs/kanban-test-results.md` (Layer 3 section)
- Any bugs found are fixed and committed
- Board state is clean after testing

## Milestone
- [ ] All kanban skills manually verified end-to-end and documented
