# Phase 10: Headless API Migration

**Goal:** Replace direct database kanban writes with a shared, authenticated Poketo headless API path so Claude and Codex both use the same app-layer permissions, validation, and audit logging.

**Current Step:** 3. Expose the shared API/gateway path for agent use

**Why this step is next:** Step 1 established the target contract: scoped `pk_...` API keys through the agent gateway, with `kanban.mjs` retained only as transitional fallback while the shared Work surface is incomplete. The next blocker is the Work tool layer itself: board discovery, create-board, search, and archive/restore are still missing or stubbed, so Claude and Codex cannot migrate yet.

### Steps

- [x] 1. Establish agent-friendly headless auth
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

- [x] 2. Finish wiring the Poketo Work headless tool layer
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
- Replace the incomplete Work headless tool layer with a real tRPC-backed surface that covers the current kanban migration requirements.

**Phase 10 Step 1 output**
- `/Users/georgele/projects/tools/claude-skills/specs/poketo-headless-auth-migration.md`

**Files to inspect in the Poketo monorepo first**
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/get-my-boards.ts`
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/index.ts`
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/work-adapter.ts`
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/adapted-tools.ts`
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/primitives/index.ts`
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/primitives/create-card.ts`
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/primitives/update-card.ts`
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/primitives/move-card.ts`
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/primitives/delete-card.ts`
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/primitives/create-list.ts`
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/primitives/update-list.ts`
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/primitives/delete-list.ts`
- `/Users/georgele/projects/apps/poke/monorepo/packages/agents/src/caller/create-agent-caller.ts`
- `/Users/georgele/projects/apps/poke/monorepo/packages/agents/src/gateway/auth.ts`
- `/Users/georgele/projects/apps/poke/monorepo/packages/agents/src/gateway/index.ts`
- `/Users/georgele/projects/apps/poke/monorepo/packages/trpc/src/server/routers/board/index.ts`
- `/Users/georgele/projects/apps/poke/monorepo/packages/trpc/src/server/routers/card/index.tsx`
- `/Users/georgele/projects/apps/poke/monorepo/packages/trpc/src/server/routers/list/index.tsx`

**Concrete gaps to close**
- `get-my-boards.ts` is still a stub.
- Primitive tool files are still placeholder definitions.
- `adapted-tools.ts` only covers 11 operations and does not yet expose board listing, create-board, search, or explicit archive/restore.
- The current delete/archive semantics need to be normalized before skills depend on them.

**Technical decisions to make**
- Whether board discovery should be exposed as `get_my_boards` backed by `board.getBoardsForPrimaryOrg`, or by a slightly different shared contract.
- Whether archive should be a first-class `archive_card` tool or documented `delete_card` archive semantics plus `restore_card`.
- Which exact response shapes should be stabilized for board resolution, skill card matching, and post-mutation refetch flows.
- How the session-backed caller should be threaded through the gateway/tool stack once Step 3 exposes the external entrypoint.

**Acceptance criteria for Step 2**
- Work tool stubs are replaced with real tRPC-backed implementations where required for kanban migration.
- The shared surface covers board discovery/details/activity, create board/list/card, update card, move card, search, and archive/restore.
- Mutations flow through the canonical board/card/list routers rather than direct DB writes in skill code.
- Response shapes are stable enough that Claude and Codex skills can consume them without fragile free-text parsing.

**Known risks**
- The gateway already models API-key validation, but the external gateway surface still has to expose the finished Work operations in Step 3.
- Router capabilities and tool definitions do not line up 1:1 today, so Step 2 may require widening the Work tool contract rather than only wiring existing stubs.
- Archive semantics are currently split across docs and tool naming; careless wiring could preserve ambiguous behavior.

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
