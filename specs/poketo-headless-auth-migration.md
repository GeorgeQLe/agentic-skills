# Poketo Headless Auth Migration Brief

Date: 2026-04-03
Status: Step 1 brief for Phase 10

## Decision Summary

The recommended agent auth path is a scoped Poketo API key (`pk_...`) presented to the agent gateway, not direct database access and not the current session-file-plus-DB-URL workflow.

This recommendation is grounded in the existing Poketo monorepo:

- Gateway auth already validates `pk_...` keys in `/Users/georgele/projects/apps/poke/monorepo/packages/agents/src/gateway/auth.ts`.
- Gateway request handling already enforces app scopes in `/Users/georgele/projects/apps/poke/monorepo/packages/agents/src/gateway/index.ts`.
- A server-side caller already exists for agent sessions in `/Users/georgele/projects/apps/poke/monorepo/packages/agents/src/caller/create-agent-caller.ts`.
- The Work app already has an adapter layer intended to expose app tools in `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/work-adapter.ts` and `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/adapted-tools.ts`.
- The canonical permissions and `board_actions` logging already live in the Work tRPC routers under:
  - `/Users/georgele/projects/apps/poke/monorepo/packages/trpc/src/server/routers/board/index.ts`
  - `/Users/georgele/projects/apps/poke/monorepo/packages/trpc/src/server/routers/card/index.tsx`
  - `/Users/georgele/projects/apps/poke/monorepo/packages/trpc/src/server/routers/list/index.tsx`

Inference from code:
- The repo already models durable API-key auth for agents.
- The repo does not yet define the final skill-facing env var names or the finished Work tool surface.
- This brief therefore recommends the target contract and records the gaps that Step 2 and Step 3 must close.

## Current Local Assumptions To Remove

### Direct database requirements

These files explicitly require direct Neon database access for standard kanban usage:

| File | Current assumption |
| --- | --- |
| `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/SKILL.md` | Standard usage requires `POKETOWORK_DATABASE_URL`; all operations go straight to Neon. |
| `/Users/georgele/projects/tools/claude-skills/codex/poketo-kanban/SKILL.md` | Same direct DB requirement for Codex usage. |
| `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/scripts/kanban.mjs` | Resolves `POKETOWORK_DATABASE_URL`, connects with `@neondatabase/serverless`, and queries tables directly. |
| `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/scripts/bootstrap-session.mjs` | Bootstraps local auth by querying auth and app databases directly; requires `AUTH_DATABASE_URL`, `POKEAPPS_DATABASE_URL`, and `POKETOWORK_DATABASE_URL`. |

### Session-file-only local auth

These files assume `~/.poketo/config.json` is the auth source for standard kanban operations:

| File | Current assumption |
| --- | --- |
| `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/SKILL.md` | `~/.poketo/config.json` must contain a valid session. |
| `/Users/georgele/projects/tools/claude-skills/codex/poketo-kanban/SKILL.md` | Same prerequisite. |
| `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/scripts/kanban.mjs` | Loads `~/.poketo/config.json` and uses it as the session model. |
| `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/scripts/bootstrap-session.mjs` | Creates `~/.poketo/config.json` locally via direct DB queries. |

Important constraint:
- The current config file is not a proper Better Auth session. `bootstrap-session.mjs` writes a synthetic session payload for the standalone DB script.
- That means `~/.poketo/config.json` cannot be treated as proof that the gateway/tRPC path is ready to authenticate agent traffic.

### Claude-install-path coupling in Codex skills

These files still hardcode Claude install paths for Codex behavior:

| File | Current assumption |
| --- | --- |
| `/Users/georgele/projects/tools/claude-skills/codex/brainstorm-kanban/SKILL.md` | Runs `node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs ...` |
| `/Users/georgele/projects/tools/claude-skills/codex/spec-interview-kanban/SKILL.md` | Same hardcoded Claude path. |
| `/Users/georgele/projects/tools/claude-skills/codex/roadmap-kanban/SKILL.md` | Same hardcoded Claude path. |
| `/Users/georgele/projects/tools/claude-skills/codex/run-kanban/SKILL.md` | Same hardcoded Claude path. |
| `/Users/georgele/projects/tools/claude-skills/codex/ship-kanban/SKILL.md` | Same hardcoded Claude path. |
| `/Users/georgele/projects/tools/claude-skills/codex/ship-end-kanban/SKILL.md` | Same hardcoded Claude path. |
| `/Users/georgele/projects/tools/claude-skills/codex/kanban-archive/SKILL.md` (merged into `poketo-kanban --archive`; path no longer present) | Same hardcoded Claude path and treats script presence as required runtime contract. |
| `/Users/georgele/projects/tools/claude-skills/codex/sync-roadmap-kanban/SKILL.md` | Still describes applying changes through `kanban.mjs`. |

### Shared setup docs tied to the standalone script

These files document the legacy script as the normal workflow:

| File | Current assumption |
| --- | --- |
| `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/KANBAN-SETUP.md` | Board resolution starts with `node ~/.claude/skills/poketo-kanban/scripts/kanban.mjs boards`. |
| `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/KANBAN-SETUP.md` | Graceful degradation is defined in terms of script presence and DB connectivity. |
| `/Users/georgele/projects/tools/claude-skills/claude/poketo-kanban/SKILL.md` | Says "All operations go straight to the Neon Postgres database — no gateway server needed." |
| `/Users/georgele/projects/tools/claude-skills/codex/poketo-kanban/SKILL.md` | Same direct-DB statement for Codex. |

## Canonical Poketo Headless Path

The intended target path is:

1. Agent presents a scoped API key to the gateway.
2. Gateway validates the key and app scopes.
3. Gateway resolves or constructs an authenticated server-side session for the owning user.
4. Gateway invokes the Work adapter.
5. Work adapter executes the canonical Work tools.
6. Work tools call the tRPC routers through a server-side caller.
7. tRPC routers enforce board permissions and write `board_actions`.

Relevant implementation files:

- Auth:
  - `/Users/georgele/projects/apps/poke/monorepo/packages/agents/src/gateway/auth.ts`
  - `/Users/georgele/projects/apps/poke/monorepo/packages/agents/src/gateway/index.ts`
- Session-backed tRPC caller:
  - `/Users/georgele/projects/apps/poke/monorepo/packages/agents/src/caller/create-agent-caller.ts`
  - `/Users/georgele/projects/apps/poke/monorepo/packages/trpc/src/server/caller.ts`
- Work tool adapter:
  - `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/index.ts`
  - `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/work-adapter.ts`
  - `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/adapted-tools.ts`
- Canonical Work business logic:
  - `/Users/georgele/projects/apps/poke/monorepo/packages/trpc/src/server/routers/board/index.ts`
  - `/Users/georgele/projects/apps/poke/monorepo/packages/trpc/src/server/routers/card/index.tsx`
  - `/Users/georgele/projects/apps/poke/monorepo/packages/trpc/src/server/routers/list/index.tsx`

## Recommended Agent Auth Contract

### Supported auth mechanism

Primary mechanism:
- Scoped durable API key, validated by the gateway.

Required scope model:
- Read-only skill flows should require `work:read`.
- Mutating kanban flows should require `work:write`.

Reasoning:
- This already matches the gateway model in `packages/agents/src/gateway/index.ts`.
- It avoids distributing raw DB credentials to local agent environments.
- It routes mutations through the canonical router layer, where permissions and `board_actions` already exist.

### Required env/config inputs

The codebase does not yet define the final skill-facing variable names. The following are recommended contract names for the migration:

- `POKETO_API_KEY`
  - Required for normal headless kanban usage.
  - Must be a scoped `pk_...` key associated with a user and org context.
- `POKETO_GATEWAY_URL`
  - Required when the skill is invoking the remote/local gateway over HTTP.
  - Optional if the skill runs inside a host that can call the gateway in-process.
- Optional local cache/config:
  - `~/.poketo/config.json` may remain for board-selection cache or transitional identity hints, but it must not be the primary auth primitive for normal kanban operations.

### Session resolution requirement behind the gateway

The missing server-side piece is not API-key validation itself. The missing piece is the bridge from:

- validated API key

to:

- a real authenticated session object that `createAgentCaller(session)` can use for protected tRPC procedures.

Step 2 or Step 3 must provide one of:

- a lookup that maps API keys to a full session payload,
- a session-exchange endpoint that issues a temporary server-side session from an API key,
- or another equivalent bridge that satisfies `protectedProcedure` requirements without exposing DB credentials.

## Fallback Policy For Existing `~/.poketo/config.json` Setups

Fallback policy:

1. Preferred path:
   - If `POKETO_API_KEY` and the gateway path are available, use the headless API path only.
2. Transitional path:
   - If `POKETO_API_KEY` is not available but a future session-exchange bridge exists, allow `~/.poketo/config.json` to seed that exchange.
   - The config file should help derive user/org identity, not authorize direct DB writes by default.
3. Legacy fallback while migration is incomplete:
   - If the gateway/tool surface is still missing required operations, `kanban.mjs` may remain available as fallback/admin tooling.
   - This fallback must be documented as temporary and non-default.
4. End-state:
   - Standard kanban workflows must not require `POKETOWORK_DATABASE_URL`.
   - `~/.poketo/config.json` must not be the primary long-term auth contract for skills.

Practical implication:
- Existing local users do not need to lose their current setup immediately.
- But the migration should treat that setup as compatibility mode, not the target architecture.

## Minimum Operation Surface Required Before Skill Migration

Before Claude or Codex kanban skills can migrate safely, the shared headless Work surface must support all of these operations with stable machine-readable results:

### Required read operations

- List accessible boards for the current user/org
- Get board details, including lists and cards
- Get board activity / recent `board_actions`
- Search cards across boards and within a board

### Required mutation operations

- Create board
- Create list
- Create card
- Update card fields used by current skills:
  - title/name
  - description
  - due date
  - progress
  - starred
  - done state
- Move card between lists
- Archive card
- Restore card

### Response-shape guarantees needed by skills

The shared surface should guarantee at least:

- Board:
  - `id`
  - `name`
  - `lists[]`
- List:
  - `id`
  - `boardId`
  - `name`
  - `type`
  - `order`
- Card:
  - `id`
  - `listId`
  - `name`
  - `description`
  - `done`
  - `starred`
  - `dueDate`
  - `progress`
- Activity:
  - `id`
  - `action`
  - `entity`
  - `entityId`
  - `boardId`
  - `createdAt`
  - actor metadata sufficient for agent audit visibility

## What Already Exists Versus What Is Missing

### Already present in the Poketo monorepo

- API-key validation for the gateway exists.
- Scope enforcement for action requests exists.
- A session-backed tRPC caller exists.
- Canonical board/card/list routers already perform permissions and `board_actions` writes.
- The Work adapter pattern exists.

### Missing or incomplete for the migration

The current Work headless tool layer is not yet sufficient for kanban skill migration:

- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/get-my-boards.ts`
  - Still a stub returning `[]`.
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/primitives/*.ts`
  - Primitive tool definitions are still mostly stubbed placeholders.
- `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/adapted-tools.ts`
  - Adapts only 11 tools today:
    - `get_board_details`
    - `get_card_details`
    - `get_board_activity`
    - `get_today_summary`
    - `create_card`
    - `update_card`
    - `move_card`
    - `delete_card`
    - `create_list`
    - `update_list`
    - `delete_list`
- Missing from the adapted surface for current skill needs:
  - board listing for board resolution
  - create board
  - search cards
  - explicit archive/restore surface
  - stable migration-ready response contract for all skill flows

There is also a semantic mismatch to fix:
- The primitive `delete_card` is described as permanent deletion in `/Users/georgele/projects/apps/poke/monorepo/apps/work/src/tools/primitives/delete-card.ts`.
- The documented Work API behavior says delete moves to archive when an archive list is configured in `/Users/georgele/projects/apps/poke/monorepo/apps/work/docs/api-reference.md`.
- The migration should normalize this before skills depend on it.

## Recommendation For Phase 10 Sequencing

### Step 2 should do

- Replace Work tool stubs with real tRPC-backed behavior.
- Expose the missing board discovery, create board, search, and archive/restore operations.
- Normalize response shapes so skills can consume them without brittle text parsing.
- Decide whether archive is modeled as:
  - `archive_card` and `restore_card`, or
  - `delete_card` and `restore_card` with archive semantics clearly documented.

### Step 3 should do

- Expose the finished Work tool layer through the actual gateway/CLI surface used by agents.
- Finalize the skill-facing config contract for `POKETO_API_KEY` and gateway endpoint resolution.
- Implement the API-key-to-session bridge required for protected tRPC procedures.

### Step 4 and Step 5 should only start after that

- Claude skill migration
- Codex skill migration

Anything earlier would swap documented behavior before the shared headless surface is actually complete.

## Final Recommendation

Recommended target:
- API-key-authenticated gateway access to Work tools backed by canonical tRPC routers.

Recommended fallback during rollout:
- Keep `kanban.mjs` as fallback/admin-only for users who only have the legacy local session + DB setup.

Definition of success for the migration:
- Standard kanban usage no longer requires `POKETOWORK_DATABASE_URL`.
- Codex no longer depends on `~/.claude/skills/...`.
- Claude and Codex both use the same Work headless path.
- Permissions and `board_actions` always come from the Poketo app layer rather than the standalone DB script.
