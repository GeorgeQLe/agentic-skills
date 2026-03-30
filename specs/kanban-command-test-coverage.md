# Spec: Kanban Command Test Coverage Expansion

## Goal

Bring all 11 kanban.mjs commands to dedicated test coverage and fill edge case gaps in existing command tests. All tests go in `kanban.test.mjs`, sharing the existing test board, using the live Neon DB.

## Scope

### 1. create-list — Dedicated tests (new describe block)

| Test | What it verifies |
|------|-----------------|
| create-list with valid board and name | Basic creation, returns list object with correct name/type/order |
| create-list assigns incrementing order | Create 2 lists, verify order 6 and 7 (after the 5 template + Archive list) |
| create-list always creates type "normal" | Verify listType field is "normal" |
| create-list without required args errors | Missing --board or --name returns error JSON, exit 1 |

### 2. update-card — Untested flags (add to existing describe or new block)

| Test | What it verifies |
|------|-----------------|
| update-card --description sets description | String stored and returned correctly |
| update-card --progress sets integer progress | `--progress 50` → `progress: 50` |
| update-card --progress 0 sets zero | Edge: zero is falsy but valid |
| update-card --due sets due date | ISO date string parsed and stored |
| update-card --unstarred clears starred | Already tested starred, verify unstarred explicitly |

### 3. search — Special character handling

| Test | What it verifies |
|------|-----------------|
| search with % in query | `%` is escaped, doesn't act as wildcard |
| search with _ in query | `_` is escaped, doesn't match single char |
| search with backslash in query | `\` doesn't break the query (note: may need a code fix if this fails) |
| search matches description text | Verify search hits card descriptions, not just names |

### 4. create-card — Edge cases

| Test | What it verifies |
|------|-----------------|
| create-card order increments per list | Third card in a list gets order 2 |
| create-card without optional fields | No --description, --due → null fields, no error |
| create-card with invalid board ID errors | Non-existent board UUID returns error |

### 5. Error paths — Expanded

| Test | What it verifies |
|------|-----------------|
| create-list with invalid board ID | Non-existent board — verify behavior (FK error or graceful message) |
| archive-card with invalid card ID | Non-existent card UUID returns error |
| search without --query errors | Missing required arg returns error |
| board with invalid ID returns error | Non-existent board UUID returns error |

## Total: ~20 new tests

Current: 24 tests. After: ~44 tests.

## Technical Details

- **File:** `claude/poketo-kanban/scripts/kanban.mjs` (tested) + `kanban.test.mjs` (modified)
- **Test runner:** vitest via `npx vitest run` with `POKETOWORK_DATABASE_URL` env var
- **Shared state:** All new tests use the existing `boardId` and `listIds` variables created in the "Board lifecycle" describe block
- **New describe blocks to add:**
  - "create-list" (after "Board lifecycle")
  - "update-card edge cases" (after "Card CRUD")
  - "search edge cases" (after "Search")
  - "create-card edge cases" (after or within "Card CRUD")
  - "Error paths expanded" (after "Error handling")
- **Ordering:** New blocks must run after board creation and before cleanup. Vitest runs describe blocks in file order by default.
- **Cleanup:** Existing delete-board cascade handles all test data (lists, cards created during tests are removed when the board is deleted).

## Acceptance Criteria

- [ ] All 11 commands have at least one dedicated test
- [ ] update-card tests cover --progress, --description, --due flags
- [ ] search tests cover %, _, and backslash characters
- [ ] All new tests pass against live Neon DB
- [ ] No existing tests broken
- [ ] Test count: ~44 total (up from 24)

## Out of Scope

- Adding `--type` flag to create-list (feature work, not testing)
- Mock/fixture layer (staying with live DB pattern)
- Database error path testing (separate card)
- Input validation layer (separate card)
- bootstrap-session.mjs tests (separate card)
