# Phase 10: Headless API Migration

**Goal:** Replace direct database kanban writes with a shared, authenticated Poketo headless API path so Claude and Codex both use the same app-layer permissions, validation, and audit logging.

**Current Step:** 6. Deprecate the standalone DB-write path

**Why this step is next:** Steps 1–5 are complete. Both Claude and Codex skill docs now point at the shared `poketo kanban` gateway path for normal board operations, and Codex no longer depends on `~/.claude/...` install paths. The remaining work is to make the legacy DB-write script explicitly fallback-only everywhere it still appears in default documentation.

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

- [x] 5. Migrate Codex kanban skills
  - Remove Codex dependence on `~/.claude/...` install paths.
  - Point Codex kanban skills at the same shared headless path Claude uses.

- [ ] 6. Deprecate the standalone DB-write path
  - Mark direct-write `kanban.mjs` usage as fallback-only after both toolchains are migrated.
  - Remove it from the default documented workflow once the shared path is verified.

### Next Step Implementation Plan

**Objective:** Deprecate the standalone `kanban.mjs` DB-write path so the default documented workflow is the shared `poketo kanban` gateway path, while keeping the legacy script available only as fallback/admin tooling during rollout.

**Target repo:** `/Users/georgele/projects/tools/agentic-skills` (skills/docs) + `/Users/georgele/projects/apps/poke/monorepo` (CLI parity verification only if command coverage needs reconfirmation)

**Current state:**
- The `poketo kanban` CLI ships 12 subcommands that call `executeAction("work", ...)` through the gateway.
- Claude and Codex skill docs now use `poketo kanban` for normal board operations.
- `claude/poketo-kanban/scripts/kanban.mjs` still exists, with a deprecation header, for fallback/admin use.
- Remaining risk is documentation drift: docs, skill references, or residual prose may still present `kanban.mjs` as a standard path even though the intended default is now the gateway-backed CLI.

**Changes:**

### 1. Audit remaining default-workflow references

Search the repo for:
- `kanban.mjs`
- `POKETOWORK_DATABASE_URL`
- `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`

Classify each match as one of:
- intended fallback/admin tooling
- historical/archive content
- stale default-workflow documentation that still needs to change

### 2. Update active documentation to make the fallback role explicit

For active docs and skills outside archive/history files:
- Remove `kanban.mjs` from default instructions where the gateway CLI is the intended path
- Replace direct DB prerequisites with `poketo auth login` / `POKETO_API_KEY` where needed
- Keep one explicit note that `kanban.mjs` remains fallback/admin-only during rollout

### 3. Tighten the legacy script messaging

Review `claude/poketo-kanban/scripts/kanban.mjs` and any nearby README/help text:
- Ensure the deprecation header is present and clear
- If built-in usage/help text still presents the script as the primary path, update it to mark the script as fallback/admin-only

### 4. Verify the default path is now consistent

Run targeted searches to confirm:
- active Claude and Codex skill docs no longer require `POKETOWORK_DATABASE_URL`
- active Codex skill docs no longer reference `~/.claude/...`
- remaining `kanban.mjs` references are only fallback/admin or archive/history content

**Files to modify (agentic-skills):**
| File | Action |
|------|--------|
| `docs/skills-reference.md` | Remove any default-workflow `kanban.mjs` references if present |
| `docs/codex-workflow.md` | Confirm Codex examples use the shared CLI path if kanban is mentioned |
| `claude/poketo-kanban/scripts/kanban.mjs` | Keep deprecation/fallback-only messaging accurate |
| `claude/poketo-kanban/SKILL.md` | Verify fallback wording stays aligned with Step 6 |
| `codex/poketo-kanban/SKILL.md` | Verify fallback wording stays aligned with Step 6 |

**Acceptance criteria:**
- The default documented workflow uses `poketo kanban`, not `kanban.mjs`
- `kanban.mjs` is documented as fallback/admin-only wherever it still appears in active docs
- No active skill doc requires `POKETOWORK_DATABASE_URL` for standard usage
- No active Codex skill doc references `~/.claude/...` install paths

### Acceptance Criteria

- [x] Claude and Codex kanban skills use the same app-layer write path for normal board operations
- [x] No kanban skill requires `POKETOWORK_DATABASE_URL` for standard usage
- [x] Codex kanban skills no longer reference `~/.claude/...` paths
- [ ] Shared headless operations cover the current kanban workflow needs: board discovery/details/activity, create board/list/card, update card, move card, search, archive/restore
- [ ] Board permissions and `board_actions` logging come from the canonical Poketo app layer rather than the standalone script
- [ ] `kanban.mjs` is documented as fallback/admin-only or removed from the default workflow

### Notes / Risks

- Auth is the main dependency. If the gateway/API-key flow is not usable for agents, the migration will stall.
- The Work tool layer and gateway surface must be completed before migrating the skill docs, otherwise the skills will lose functionality.
- Claude and Codex should migrate to the same target surface in close succession to avoid long-lived behavioral drift.
- Repo path updated to `agentic-skills`; `install.sh` was re-run after the rename to refresh global Claude and Codex skill symlinks.
