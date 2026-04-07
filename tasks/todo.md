# Phase 10: Headless API Migration

**Goal:** Replace direct database kanban writes with a shared, authenticated Poketo headless API path so Claude and Codex both use the same app-layer permissions, validation, and audit logging.

**Current Step:** 5. Migrate Codex kanban skills

**Why this step is next:** Steps 1–3 are complete. The gateway action route dispatches through real adapters (auth → rate limit → scope check → adapter dispatch → response mapping). The CLI ships 12 kanban subcommands and 4 key management commands. 40+ gateway route tests and 37 CLI tests pass. The shared headless path is ready for skill consumption.

### Steps

- [x] 1. Establish agent-friendly headless auth
  - Inventory the current local assumptions in:
    - `/Users/georgele/projects/tools/agentic-skills/claude/poketo-kanban/SKILL.md`
    - `/Users/georgele/projects/tools/agentic-skills/codex/poketo-kanban/SKILL.md`
    - `/Users/georgele/projects/tools/agentic-skills/claude/poketo-kanban/KANBAN-SETUP.md`
    - `/Users/georgele/projects/tools/agentic-skills/claude/poketo-kanban/scripts/bootstrap-session.mjs`
    - `/Users/georgele/projects/tools/agentic-skills/claude/poketo-kanban/scripts/kanban.mjs`
    - `/Users/georgele/projects/tools/agentic-skills/codex/run/SKILL.md`
    - `/Users/georgele/projects/tools/agentic-skills/codex/ship/SKILL.md`
    - `/Users/georgele/projects/tools/agentic-skills/codex/ship-end/SKILL.md`
  - Record every place that assumes `POKETOWORK_DATABASE_URL`, `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`, or session-only local auth.
  - Inspect the Poketo Work repo and identify the real headless auth entry point for agents: API key, durable token, CLI login/session bridge, or another supported mechanism.
  - Write a migration brief that defines:
    - the supported auth mechanism for agents,
    - required env/config inputs,
    - fallback behavior for existing `~/.poketo/config.json` session-based setups,
    - which operations must be available before the skill migration can start.
  - Prefer writing the brief to `/Users/georgele/projects/tools/agentic-skills/specs/poketo-headless-auth-migration.md`.

- [x] 2. Finish wiring the Poketo Work headless tool layer
  - Replace stubbed Work primitives/adapters with real app-layer-backed implementations.
  - Ensure the shared surface covers board discovery/details/activity, create board/list/card, update card, move card, search, archive/restore.

- [x] 3. Expose the shared API/gateway path for agent use
  - Gateway action route fully wired: auth → rate limit → scope check → adapter dispatch → response mapping
  - CLI: 12 kanban subcommands + 4 key management commands (`create-key/list-keys/revoke-key/rotate-key`)
  - 40+ gateway route tests + 37 CLI tests pass
  - Response shapes are stable JSON (not free-text)

- [x] 4. Migrate Claude kanban skills
  - Update Claude kanban skills to use the shared headless path instead of direct DB writes through `kanban.mjs`.
  - Keep `kanban.mjs` only as fallback/admin tooling during rollout.

- [ ] 5. Migrate Codex kanban skills
  - Remove Codex dependence on `~/.claude/...` install paths.
  - Point Codex kanban skills at the same shared headless path Claude uses.

- [ ] 6. Deprecate the standalone DB-write path
  - Mark direct-write `kanban.mjs` usage as fallback-only after both toolchains are migrated.
  - Remove it from the default documented workflow once the shared path is verified.

### Next Step Implementation Plan

**Objective:** Replace `kanban.mjs` direct-DB references in all Claude kanban skills with `poketo kanban` CLI commands that go through the authenticated gateway.

**Target repo:** `/Users/georgele/projects/tools/agentic-skills` (skills) + `/Users/georgele/projects/apps/poke/monorepo` (CLI parity verification)

**Current state:**
- The `poketo kanban` CLI ships 12 subcommands that call `executeAction("work", ...)` through the gateway.
- All skills currently invoke `node ${CLAUDE_SKILL_DIR}/scripts/kanban.mjs <command>` for board operations.
- After consolidation (commit `88ead90`), the 8 kanban variant skills were merged into base skills with `--kanban` flags. Kanban references now live in these files:
  - `claude/poketo-kanban/SKILL.md` — core kanban skill (primary target)
  - `claude/poketo-kanban/KANBAN-SETUP.md` — board resolution protocol
  - `claude/run/SKILL.md` — run skill with kanban integration
  - `claude/ship/SKILL.md` — ship skill with kanban integration
  - `claude/ship-end/SKILL.md` — ship-end skill with kanban integration
  - `claude/brainstorm/SKILL.md` — brainstorm skill with kanban integration
  - `claude/roadmap/SKILL.md` — roadmap skill with kanban integration
  - `claude/sync-roadmap-kanban/SKILL.md` — sync roadmap-kanban skill
  - `claude/plan-interview/SKILL.md` — plan-interview skill with kanban integration
  - `codex/poketo-kanban/SKILL.md` — codex core kanban skill
  - `codex/sync-roadmap-kanban/SKILL.md` — codex sync roadmap-kanban skill

**Changes:**

### 1. Map kanban.mjs commands → poketo kanban equivalents

Build a command mapping table from `kanban.mjs` subcommands to `poketo kanban` CLI equivalents. Verify each CLI command produces compatible output shapes by running them against the test harness.

### 2. Update poketo-kanban core skill (Claude)

Modify `claude/poketo-kanban/SKILL.md`:
- Replace all `node ${CLAUDE_SKILL_DIR}/scripts/kanban.mjs` invocations with `poketo kanban` equivalents
- Update prerequisites: require `poketo auth login` or API key, remove `POKETOWORK_DATABASE_URL`
- Update `allowed-tools` from `Bash(node *)` to `Bash(poketo *)`

Modify `claude/poketo-kanban/KANBAN-SETUP.md`:
- Update board resolution protocol to use `poketo kanban boards` and `poketo kanban board <id>`
- Remove references to direct DB connection

### 3. Update dependent Claude skills

For each of `run`, `ship`, `ship-end`, `brainstorm`, `roadmap`, `sync-roadmap-kanban`, `plan-interview`:
- Replace `kanban.mjs` invocations with `poketo kanban` equivalents
- Update `allowed-tools` if present

### 4. Update Codex kanban skills

Modify `codex/poketo-kanban/SKILL.md` and `codex/sync-roadmap-kanban/SKILL.md`:
- Same command replacements as Claude variants
- Remove `~/.claude/skills/...` path references
- Update `allowed-tools`

### 5. Deprecate kanban.mjs scripts

- Keep `kanban.mjs` in place but add deprecation header comment
- Do NOT delete yet — Step 6 handles full removal after both toolchains are verified

**Files to modify (agentic-skills):**
| File | Action |
|------|--------|
| `claude/poketo-kanban/SKILL.md` | Replace kanban.mjs → poketo kanban |
| `claude/poketo-kanban/KANBAN-SETUP.md` | Update board resolution protocol |
| `claude/run/SKILL.md` | Replace kanban.mjs references |
| `claude/ship/SKILL.md` | Replace kanban.mjs references |
| `claude/ship-end/SKILL.md` | Replace kanban.mjs references |
| `claude/brainstorm/SKILL.md` | Replace kanban.mjs references |
| `claude/roadmap/SKILL.md` | Replace kanban.mjs references |
| `claude/sync-roadmap-kanban/SKILL.md` | Replace kanban.mjs references |
| `claude/plan-interview/SKILL.md` | Replace kanban.mjs references |
| `codex/poketo-kanban/SKILL.md` | Replace kanban.mjs + remove ~/.claude paths |
| `codex/sync-roadmap-kanban/SKILL.md` | Replace kanban.mjs + remove ~/.claude paths |

**Acceptance criteria:**
- All Claude kanban skills use `poketo kanban` instead of `kanban.mjs`
- No skill references `POKETOWORK_DATABASE_URL` for standard usage
- `allowed-tools` updated from `Bash(node *)` to `Bash(poketo *)`
- `kanban.mjs` still exists but is marked as deprecated fallback
- Skills fail with clear error if gateway is unreachable (no silent fallback)

### Acceptance Criteria

- [ ] Claude and Codex kanban skills use the same app-layer write path for normal board operations
- [ ] No kanban skill requires `POKETOWORK_DATABASE_URL` for standard usage
- [ ] Codex kanban skills no longer reference `~/.claude/skills/...` paths
- [ ] Shared headless operations cover the current kanban workflow needs: board discovery/details/activity, create board/list/card, update card, move card, search, archive/restore
- [ ] Board permissions and `board_actions` logging come from the canonical Poketo app layer rather than the standalone script
- [ ] `kanban.mjs` is documented as fallback/admin-only or removed from the default workflow

### Notes / Risks

- Auth is the main dependency. If the gateway/API-key flow is not usable for agents, the migration will stall.
- The Work tool layer and gateway surface must be completed before migrating the skill docs, otherwise the skills will lose functionality.
- Claude and Codex should migrate to the same target surface in close succession to avoid long-lived behavioral drift.
- Repo path updated to `agentic-skills`; `install.sh` was re-run after the rename to refresh global Claude and Codex skill symlinks.
