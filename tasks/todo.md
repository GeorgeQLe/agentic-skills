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

**Objective:** Wire the gateway action route to dispatch tool calls through the Work adapter, so agents with `pk_...` API keys can invoke all 15 Work tools via HTTP.

**Target repo:** `/Users/georgele/projects/apps/poke/monorepo` (not claude-skills)

**Current state:**
- The gateway action route (`apps/flow/src/app/api/v1/actions/[app]/[action]/route.ts`) handles auth, rate limiting, and scope gating — but returns a stub `{ ok: true }` instead of dispatching to tool adapters.
- `createWorkAdapter({ caller })` in `apps/work/src/tools/work-adapter.ts` returns a fully functional adapter with 15 tools, `executeToolCall()`, and `undoToolCall()`.
- `createAgentCaller(session)` in `packages/agents/src/caller/create-agent-caller.ts` creates a session-backed tRPC caller.
- `createGateway(deps)` in `packages/agents/src/gateway/index.ts` expects an `executeTool(app, action, params)` dependency but nothing provides it yet.
- The gateway test file already has rate-limit tests (committed in a prior session) — there may be uncommitted route changes from that work. Check `git stash list` and `git diff` before starting.

**Changes:**

### 1. Create app adapter registry

Create `apps/flow/src/lib/app-registry.ts`:
- Export a `createAppRegistry()` factory that maps app names to adapter factories.
- Register the Work adapter: `work` → `(caller) => createWorkAdapter({ caller })`.
- Provide `getAdapter(app, caller)` that lazily creates and caches adapters per-caller.
- Keep it simple — no dynamic plugin loading, just a Map.

### 2. Create tool dispatcher

Create `apps/flow/src/lib/tool-dispatcher.ts`:
- Export `createToolDispatcher(deps: { getAdapter })`.
- Implement `executeTool(app, action, params, session)`:
  - Create agent caller from session via `createAgentCaller(session)`.
  - Get adapter from registry.
  - Call `adapter.executeToolCall({ toolName: action, params })`.
  - Return `{ success, result }` or `{ success: false, error }`.

### 3. Wire the action route

Modify `apps/flow/src/app/api/v1/actions/[app]/[action]/route.ts`:
- Replace the `{ ok: true }` stub with real dispatch logic.
- Parse `action` from route params, JSON body as `params`.
- Create session from the resolved identity.
- Call `dispatcher.executeTool(app, action, params, session)`.
- Return the result as JSON with appropriate status codes (200, 400, 404, 500).

### 4. Write integration tests

Add to or update `apps/flow/src/__tests__/gateway-routes.test.ts`:
- Test that POST `/api/v1/actions/work/get_board_details` with valid auth dispatches to the work adapter.
- Test that unknown app returns 404.
- Test that unknown action for a known app returns 404.
- Test that tool execution errors return 500 with error message.
- Mock the tRPC caller at the adapter boundary.

### 5. Verify response shape stability

Invoke a few representative tools through the gateway test harness and document the response shapes:
- `get_my_boards` → `{ boards: [...] }`
- `create_card` → `{ card: { id: "..." } }`
- `delete_card` → `{ success: true }`
- Ensure these match what skills will consume.

**Files to create (Poketo monorepo):**
| File | Action |
|------|--------|
| `apps/flow/src/lib/app-registry.ts` | **Create** |
| `apps/flow/src/lib/tool-dispatcher.ts` | **Create** |

**Files to modify (Poketo monorepo):**
| File | Action |
|------|--------|
| `apps/flow/src/app/api/v1/actions/[app]/[action]/route.ts` | Replace stub with dispatcher |
| `apps/flow/src/__tests__/gateway-routes.test.ts` | Add tool dispatch tests |

**Files to inspect first:**
- `apps/flow/src/app/api/v1/actions/[app]/[action]/route.ts` — check for uncommitted rate-limit wiring
- `packages/agents/src/gateway/index.ts` — understand `handleActionRequest()` shape
- `packages/agents/src/caller/create-agent-caller.ts` — session → caller threading
- `apps/work/src/tools/work-adapter.ts` — adapter interface

**Technical decisions:**
- Whether to route through `createGateway().handleActionRequest()` or directly through the dispatcher. The gateway module already has the `executeTool` dependency slot — using it keeps the architecture consistent.
- Whether to create the tRPC caller per-request (clean but potentially slow) or cache per API key session. Start with per-request; optimize later if needed.

**Known risks:**
- There are uncommitted changes in the flow routes from a rate-limit wiring task. Those need to be committed or stashed before starting Step 3.
- The `createAgentCaller` requires a `Session` object — need to verify how `resolveIdentity()` output maps to a session.
- Response shapes from tRPC callers may include internal fields (timestamps, IDs) that should be filtered before exposing to agents.

**Acceptance criteria:**
- POST `/api/v1/actions/work/{tool_name}` with a valid `pk_...` API key dispatches to the Work adapter and returns tool results as JSON.
- Unknown apps or actions return 404.
- Auth failures return 401, scope failures return 403 (already implemented).
- All 15 Work tools are callable through the gateway.
- Response shapes are consistent JSON (not free-text).
- Tests pass for the dispatch path.

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
