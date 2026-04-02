# Phase 10: Headless API Migration

**Goal:** Replace direct database kanban writes with a shared, authenticated Poketo headless API path so Claude and Codex both use the same app-layer permissions, validation, and audit logging.

**Current Step:** 1. Establish agent-friendly headless auth

**Why this step is next:** The current skill repo still documents direct DB access and Claude-specific script paths. Before any skill migration work starts, we need a concrete auth contract for automation agents and a clear mapping from today's local-script assumptions to the intended Poketo headless surface.

### Steps

- [ ] 1. Establish agent-friendly headless auth
  - Inventory the current local assumptions in:
    - `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/SKILL.md`
    - `/Users/georgele/projects/tools/claude-skills/codex/poketo-kanban/SKILL.md`
    - `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/KANBAN-SETUP.md`
    - `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/scripts/bootstrap-session.mjs`
    - `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/scripts/kanban.mjs`
    - `/Users/georgele/projects/tools/claude-skills/codex/run-kanban/SKILL.md`
    - `/Users/georgele/projects/tools/claude-skills/codex/ship-kanban/SKILL.md`
    - `/Users/georgele/projects/tools/claude-skills/codex/ship-end-kanban/SKILL.md`
  - Record every place that assumes `POKETOWORK_DATABASE_URL`, `~/.claude/skills/poketo-kanban/scripts/kanban.mjs`, or session-only local auth.
  - Inspect the Poketo Work repo and identify the real headless auth entry point for agents: API key, durable token, CLI login/session bridge, or another supported mechanism.
  - Write a migration brief that defines:
    - the supported auth mechanism for agents,
    - required env/config inputs,
    - fallback behavior for existing `~/.poketo/config.json` session-based setups,
    - which operations must be available before the skill migration can start.
  - Prefer writing the brief to `/Users/georgele/projects/tools/claude-skills/specs/poketo-headless-auth-migration.md`.

- [ ] 2. Finish wiring the Poketo Work headless tool layer
  - Replace stubbed Work primitives/adapters with real app-layer-backed implementations.
  - Ensure the shared surface covers board discovery/details/activity, create board/list/card, update card, move card, search, archive/restore.

- [ ] 3. Expose the shared API/gateway path for agent use
  - Make the headless operations available through the actual agent-facing gateway/CLI surface.
  - Verify the response shapes are stable enough for skill consumption without fragile text parsing.

- [ ] 4. Migrate Claude kanban skills
  - Update Claude kanban skills to use the shared headless path instead of direct DB writes through `kanban.mjs`.
  - Keep `kanban.mjs` only as fallback/admin tooling during rollout.

- [ ] 5. Migrate Codex kanban skills
  - Remove Codex dependence on `~/.claude/...` install paths.
  - Point Codex kanban skills at the same shared headless path Claude uses.

- [ ] 6. Deprecate the standalone DB-write path
  - Mark direct-write `kanban.mjs` usage as fallback-only after both toolchains are migrated.
  - Remove it from the default documented workflow once the shared path is verified.

### Next Step Implementation Plan

**Objective**
- Produce a concrete auth contract and migration brief that unblocks the Phase 10 implementation work.

**Files to inspect in this repo first**
- `/Users/georgele/projects/tools/claude-skills/tasks/roadmap.md`
- `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/SKILL.md`
- `/Users/georgele/projects/tools/claude-skills/codex/poketo-kanban/SKILL.md`
- `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/KANBAN-SETUP.md`
- `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/scripts/bootstrap-session.mjs`
- `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/scripts/kanban.mjs`
- `/Users/georgele/projects/tools/claude-skills/codex/brainstorm-kanban/SKILL.md`
- `/Users/georgele/projects/tools/claude-skills/codex/plan-interview-kanban/SKILL.md`
- `/Users/georgele/projects/tools/claude-skills/codex/roadmap-kanban/SKILL.md`
- `/Users/georgele/projects/tools/claude-skills/codex/run-kanban/SKILL.md`
- `/Users/georgele/projects/tools/claude-skills/codex/ship-kanban/SKILL.md`
- `/Users/georgele/projects/tools/claude-skills/codex/ship-end-kanban/SKILL.md`
- `/Users/georgele/projects/tools/claude-skills/codex/kanban-archive/SKILL.md`
- `/Users/georgele/projects/tools/claude-skills/codex/sync-roadmap-kanban/SKILL.md`

**External dependency to resolve**
- Open the Poketo Work repo that owns the canonical headless gateway/tool surface and identify the exact files/modules that implement agent auth and headless board/card/list operations. Capture those absolute paths in the migration brief once located.

**Technical decisions to make**
- Whether agent auth should be API-key based, session-bridged, or another durable non-DB-credential flow.
- Whether `~/.poketo/config.json` remains a fallback bridge or should be removed from the normal workflow.
- Which response fields the shared headless API must guarantee so current kanban skill flows can migrate without lossy parsing.

**Acceptance criteria for Step 1**
- A brief exists at `/Users/georgele/projects/tools/claude-skills/specs/poketo-headless-auth-migration.md`.
- The brief enumerates every current direct DB / Claude-path dependency in this repo.
- The brief names one recommended agent auth path and one fallback policy.
- The brief defines the minimum shared operation surface required for Step 2.

**Known risks**
- The external Poketo repo may not yet expose a fully usable headless auth path.
- If the gateway/tool surface lacks one or more required kanban operations, the migration will stall until Step 2 completes.

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
