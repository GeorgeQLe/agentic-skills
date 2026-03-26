# Phase 4: Archive Automation

**Goal:** Keep boards clean by archiving old Done/Punt cards automatically.

## Steps

- [x] **Add `archive-card` command to kanban.mjs** — moves card to the board's archive list
- [ ] **Create `/kanban-archive` skill (Claude + Codex)** — archives Done/Punt cards older than N days

### Plan: Create `/kanban-archive` skill (Claude + Codex)

**What:** A standalone skill that bulk-archives Done/Punt cards older than N days (default 30). Shows which cards will be archived, asks for confirmation, then archives them using the `archive-card` command added in Step 1.

**Files to create (4):**
- `claude/kanban-archive/SKILL.md`
- `codex/kanban-archive/SKILL.md` (same content)
- `codex/kanban-archive/agents/openai.yaml`

**File to update (1):**
- `docs/skills-reference.md` — add `/kanban-archive` entry (if this file exists)

**SKILL.md structure:**

1. **Board Resolution** — reuse the standard protocol from other `-kanban` skills:
   - Check `tasks/.kanban-board` for saved board ID
   - If not found, run `kanban.mjs boards` and auto-match by repo directory name
   - If no match, ask user; save to `tasks/.kanban-board`
   - If no board exists, offer to create with `--template standard`

2. **Find archivable cards:**
   - Run `kanban.mjs board <id>` to get all lists and cards
   - Filter to lists with `type: "done"` or `type: "punt"`
   - Filter cards where `updatedAt` is older than N days (default 30, override with `--days <N>`)
   - If no cards match, report "No cards to archive" and stop

3. **Show candidates:**
   - Display a table/list: card name, list name, last updated date, age in days
   - Show total count

4. **Confirm with user:**
   - Ask: "Archive these N cards? (y/n)"
   - If no, stop

5. **Archive cards:**
   - For each card, run `kanban.mjs archive-card --id <card-id>`
   - Report progress

6. **Summary:**
   - "Archived N cards (X from Done, Y from Punt)"

**`agents/openai.yaml` content:**
```yaml
interface:
  display_name: "Kanban Archive"
  short_description: "Archive old Done/Punt cards from kanban board"
  default_prompt: "Use $kanban-archive to archive old Done/Punt cards."

policy:
  allow_implicit_invocation: true
```

**Key context:**
- The `archive-card` command in `kanban.mjs` handles auto-creating the Archive list if needed — the skill doesn't need to worry about that
- Card `updatedAt` field is available in the board response (it's returned by `cmdBoard`)
- The Board Resolution protocol is identical across all 6 existing `-kanban` skills — copy from `claude/brainstorm-kanban/SKILL.md`
- Script path: `claude/poketo-kanban/scripts/kanban.mjs` (referenced as `$KANBAN` in skills)
- The `--days` flag parsing happens in the skill prompt itself (parse from user args), not in kanban.mjs

**Acceptance criteria:**
- `claude/kanban-archive/SKILL.md` and `codex/kanban-archive/SKILL.md` exist with full skill content
- `codex/kanban-archive/agents/openai.yaml` exists
- Skill follows Board Resolution protocol consistent with other `-kanban` skills
- Skill filters Done/Punt cards by age, shows candidates, confirms before archiving
- Supports `--days <N>` to override the 30-day default
- `bash install.sh` picks up the new skill

## Milestone
- [ ] `/kanban-archive` cleans up Done/Punt cards older than 30 days with user confirmation
