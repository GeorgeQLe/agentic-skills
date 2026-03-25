# Phase 1: Kanban-Roadmap Sync

**Goal:** Keep kanban boards, roadmap docs, and codebase state in agreement automatically.

## Steps

- [x] **Create `/sync-roadmap-kanban` skill (Claude + Codex)**
- [x] **Board-project auto-detection**
- [x] **Add sync-roadmap-kanban trigger to workflow skills**

## Milestone
- [ ] Agent runs `/sync-roadmap-kanban` → kanban and roadmap reflect the same state, grounded in what the code actually shows

---

## Next Step Plan: Add sync-roadmap-kanban trigger to workflow skills

### What
Make `/run` and `/ship` variants optionally call `/sync-roadmap-kanban` at session start, so the kanban board stays in sync without the user having to remember to run it manually.

### Requirements (from roadmap)
- `/run` and `/ship` variants optionally call sync at session start
- Keep it opt-in (flag or config) to avoid slowing down quick tasks

### Files to modify (all Claude + Codex pairs)
- **`claude/run/SKILL.md`** and **`codex/run/SKILL.md`** — Add optional `--sync-kanban` flag
- **`claude/ship/SKILL.md`** and **`codex/ship/SKILL.md`** — Add optional `--sync-kanban` flag
- **`claude/run-step/SKILL.md`** and **`codex/run-step/SKILL.md`** — Same
- **`claude/ship-end/SKILL.md`** and **`codex/ship-end/SKILL.md`** — Same
- **`claude/ship-then-plan/SKILL.md`** and **`codex/ship-then-plan/SKILL.md`** — Same
- **`claude/run-phases/SKILL.md`** and **`codex/run-phases/SKILL.md`** — Same

### Approach
1. Add a `--sync-kanban` flag to the argument-hint frontmatter of each skill
2. Add a new step at the top of each skill's process (before any existing steps):
   - "**Step 0 (optional): Sync kanban** — If `$ARGUMENTS` contains `--sync-kanban`, run `/sync-roadmap-kanban` first. If it reports discrepancies, show them but continue."
3. Keep it minimal — one sentence per skill, referencing the existing skill by name

### Key context
- Skills reference `$ARGUMENTS` to check for flags (see `ship/SKILL.md` which uses `--no-plan` and `--no-deploy`)
- The `argument-hint` frontmatter field documents available flags (e.g., `argument-hint: [--no-plan] [--no-deploy]`)
- Codex versions are typically shorter/condensed versions of the Claude SKILL.md
- The sync-roadmap-kanban skill handles all the heavy lifting — the trigger is just "run it if flag is present"

### Acceptance criteria
- Each `/run`, `/run-step`, `/run-phases`, `/ship`, `/ship-end`, `/ship-then-plan` skill (Claude + Codex) accepts `--sync-kanban`
- The flag is documented in `argument-hint` frontmatter
- Without the flag, behavior is unchanged (opt-in only)
- With the flag, `/sync-roadmap-kanban` runs before the skill's main process
