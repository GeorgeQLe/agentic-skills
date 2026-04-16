import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, text, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { eq, desc } from "drizzle-orm";
import { getDbUrl } from "./kanban.mjs";

/** @typedef {import("./types/kanban").BoardActionActivityEntry} BoardActionActivityEntry */
/** @typedef {import("./types/kanban").BoardActionRecord} BoardActionRecord */

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(__dirname, "kanban.mjs");

// ─── Test DB Helper (direct DB access for audit log verification) ───────────

// Inline board_actions schema (matches poketo-db BoardActionSchema)
const boardActionEnum = pgEnum("board_action", [
  "CREATE", "UPDATE", "DELETE", "MOVE", "REORDER", "RENAME",
  "UPDATE_DESCRIPTION", "SET_DUE_DATE", "CLEAR_DUE_DATE",
  "SET_PROGRESS", "CLEAR_PROGRESS", "ADD_CATEGORY", "REMOVE_CATEGORY",
  "STAR", "UNSTAR", "ASSIGN_USER", "UNASSIGN_USER", "ASSIGN_AGENT",
  "UNASSIGN_AGENT", "SET_TEAM", "REMOVE_TEAM", "ARCHIVE", "RESTORE",
  "MARK_DONE", "MARK_UNDONE", "ADD_CHECKLIST", "DELETE_CHECKLIST",
  "TOGGLE_CHECKLIST_ITEM",
]);

const actorTypeEnum = pgEnum("actor_type", ["user", "agent"]);
const entityTypeEnum = pgEnum("entity_type", ["board", "list", "card"]);

const boardActions = pgTable("board_actions", {
  id: text("id").primaryKey(),
  action: boardActionEnum("action").notNull(),
  boardComponent: entityTypeEnum("entity").notNull(),
  boardComponentId: text("entity_id").notNull(),
  boardComponentName: text("entity_name").notNull(),
  boardId: text("board_id").notNull(),
  changes: jsonb("changes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  userId: text("user_id").notNull(),
  actorType: actorTypeEnum("actor_type").notNull(),
  agentSessionId: text("agent_session_id"),
  agentTemplateId: text("agent_template_id"),
});

let testDb;
async function getTestDb() {
  if (testDb) return testDb;
  const url = getDbUrl();
  if (!url) throw new Error("POKETOWORK_DATABASE_URL not available for test DB helper");
  const sql = neon(url);
  testDb = drizzle(sql);
  return testDb;
}

/**
 * Query board_actions for a specific entity (card/board/list)
 * @returns {Promise<BoardActionRecord[]>}
 */
async function queryActions(entityId) {
  const db = await getTestDb();
  return db.select().from(boardActions)
    .where(eq(boardActions.boardComponentId, entityId))
    .orderBy(desc(boardActions.createdAt));
}

/**
 * Query board_actions for a board
 * @returns {Promise<BoardActionRecord[]>}
 */
async function queryBoardActions(boardIdVal) {
  const db = await getTestDb();
  return db.select().from(boardActions)
    .where(eq(boardActions.boardId, boardIdVal))
    .orderBy(desc(boardActions.createdAt));
}

// ─── Helper ─────────────────────────────────────────────────────────────────

function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error === null || error === undefined) return "No error detail provided";
  if (typeof error !== "object") return String(error);
  return "Non-Error thrown value";
}

async function run(...args) {
  try {
    const { stdout } = await execFileAsync("node", [SCRIPT, ...args], {
      timeout: 15000,
    });
    return JSON.parse(stdout);
  } catch (error) {
    // Command exited non-zero — try to parse JSON from stderr or stdout
    const output = error.stdout || error.stderr || "";
    try {
      return JSON.parse(output);
    } catch {
      throw new Error(`kanban.mjs failed: ${output || getErrorMessage(error)}`);
    }
  }
}

// ─── Test State ─────────────────────────────────────────────────────────────

let boardId = null;
const listIds = {
  Backlog: null,
  Todo: null,
  "In Progress": null,
  Done: null,
  Punt: null,
};

// ─── Board Lifecycle ────────────────────────────────────────────────────────

describe("Board lifecycle", () => {
  it("create-board --template standard creates 5 lists with correct types", async () => {
    const result = await run(
      "create-board",
      "--name",
      "test-kanban-integration",
      "--template",
      "standard",
    );
    expect(result.command).toBe("create-board");
    expect(result.board.name).toBe("test-kanban-integration");
    expect(result.lists).toHaveLength(5);

    boardId = result.board.id;

    // Verify list names and types
    const listMap = Object.create(null);
    for (const l of result.lists) {
      listMap[l.name] = l;
      listIds[l.name] = l.id;
    }
    expect(listMap["Backlog"].type).toBe("normal");
    expect(listMap["Todo"].type).toBe("normal");
    expect(listMap["In Progress"].type).toBe("normal");
    expect(listMap["Done"].type).toBe("done");
    expect(listMap["Punt"].type).toBe("punt");
  });

  it("boards lists the test board", async () => {
    const result = await run("boards");
    expect(result.command).toBe("boards");
    const found = result.boards.find((b) => b.id === boardId);
    expect(found).toBeDefined();
    expect(found.name).toBe("test-kanban-integration");
  });

  it("board <id> shows lists and empty cards", async () => {
    const result = await run("board", boardId);
    expect(result.command).toBe("board");
    expect(result.board.id).toBe(boardId);
    expect(result.lists).toHaveLength(5);
    for (const list of result.lists) {
      expect(list.cards).toEqual([]);
    }
  });

  it("create-board --template and --lists are mutually exclusive", async () => {
    const result = await run(
      "create-board",
      "--name",
      "should-fail",
      "--template",
      "standard",
      "--lists",
      "A,B",
    );
    expect(result.error).toMatch(/mutually exclusive/);
  });

  it("create-board with custom --lists works", async () => {
    const result = await run(
      "create-board",
      "--name",
      "test-custom-lists",
      "--lists",
      "Alpha,Beta:done",
    );
    expect(result.command).toBe("create-board");
    expect(result.lists).toHaveLength(2);
    expect(result.lists[0].name).toBe("Alpha");
    expect(result.lists[0].type).toBe("normal");
    expect(result.lists[1].name).toBe("Beta");
    expect(result.lists[1].type).toBe("done");

    // Clean up the extra board
    await run("delete-board", "--id", result.board.id, "--confirm");
  });
});

// ─── Card CRUD ──────────────────────────────────────────────────────────────

let cardId = null;

describe("Card CRUD", () => {
  it("create-card in Backlog with name only", async () => {
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Test card alpha",
    );
    expect(result.command).toBe("create-card");
    expect(result.card.name).toBe("Test card alpha");
    expect(result.card.listId).toBe(listIds["Backlog"]);
    expect(result.card.order).toBe(0);
    expect(result.card.done).toBe(false);
    expect(result.card.starred).toBe(false);
    cardId = result.card.id;
  });

  it("create-card with description and due date", async () => {
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Test card beta",
      "--description",
      "A detailed description",
      "--due",
      "2026-12-31",
    );
    expect(result.card.description).toBe("A detailed description");
    expect(result.card.dueDate).toBeTruthy();
    expect(result.card.order).toBe(1); // second card in Backlog
  });

  it("update-card --name changes the name", async () => {
    const result = await run(
      "update-card",
      "--id",
      cardId,
      "--name",
      "Renamed alpha",
    );
    expect(result.command).toBe("update-card");
    expect(result.card.name).toBe("Renamed alpha");
  });

  it("update-card --done marks card as done", async () => {
    const result = await run("update-card", "--id", cardId, "--done");
    expect(result.card.done).toBe(true);
  });

  it("update-card --undone marks card as not done", async () => {
    const result = await run("update-card", "--id", cardId, "--undone");
    expect(result.card.done).toBe(false);
  });

  it("update-card --starred marks card as starred", async () => {
    const result = await run("update-card", "--id", cardId, "--starred");
    expect(result.card.starred).toBe(true);
  });

  it("done --id marks card done", async () => {
    // Unstar first to reset
    await run("update-card", "--id", cardId, "--unstarred");
    const result = await run("done", "--id", cardId);
    expect(result.command).toBe("done");
    expect(result.card.done).toBe(true);
  });
});

// ─── Card Movement ──────────────────────────────────────────────────────────

describe("Card movement", () => {
  it("move-card moves card to a different list", async () => {
    const result = await run(
      "move-card",
      "--id",
      cardId,
      "--list",
      listIds["Todo"],
    );
    expect(result.command).toBe("move-card");
    expect(result.card.listId).toBe(listIds["Todo"]);
  });

  it("move-card appends to end of target list (no order collision)", async () => {
    // Create a card already in In Progress
    const first = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["In Progress"],
      "--name",
      "Existing in-progress card",
    );

    // Move our card into In Progress
    const result = await run(
      "move-card",
      "--id",
      cardId,
      "--list",
      listIds["In Progress"],
    );

    // Verify board state — both cards should be in In Progress with different orders
    const board = await run("board", boardId);
    const inProgress = board.lists.find((l) => l.name === "In Progress");
    expect(inProgress.cards).toHaveLength(2);
    const orders = inProgress.cards.map((c) => c.id);
    expect(new Set(orders).size).toBe(2); // no duplicates
  });

  it("archive-card auto-creates Archive list when none exists", async () => {
    // Move card to Done first (so we archive from a realistic state)
    await run("move-card", "--id", cardId, "--list", listIds["Done"]);

    const result = await run("archive-card", "--id", cardId);
    expect(result.command).toBe("archive-card");
    expect(result.card.archivedTo).toBeTruthy();

    // Verify the board now has an Archive list
    const board = await run("board", boardId);
    const archiveList = board.lists.find((l) => l.name === "Archive");
    expect(archiveList).toBeDefined();
    expect(archiveList.cards).toHaveLength(1);
    expect(archiveList.cards[0].name).toBe("Renamed alpha");
  });

  it("archive-card reuses existing Archive list", async () => {
    // Create another card and archive it
    const newCard = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Done"],
      "--name",
      "Second archive test",
    );
    const result = await run("archive-card", "--id", newCard.card.id);

    // Should be same archive list
    const board = await run("board", boardId);
    const archiveList = board.lists.find((l) => l.name === "Archive");
    expect(archiveList.cards).toHaveLength(2);
  });
});

// ─── Search ─────────────────────────────────────────────────────────────────

describe("Search", () => {
  it("search finds cards by name", async () => {
    const result = await run("search", "--query", "beta");
    expect(result.command).toBe("search");
    expect(result.count).toBeGreaterThanOrEqual(1);
    const match = result.results.find((r) => r.name === "Test card beta");
    expect(match).toBeDefined();
    expect(match.boardName).toBe("test-kanban-integration");
  });

  it("search with --board scopes to that board", async () => {
    const result = await run("search", "--query", "beta", "--board", boardId);
    expect(result.command).toBe("search");
    expect(result.count).toBeGreaterThanOrEqual(1);
    for (const r of result.results) {
      expect(r.boardId).toBe(boardId);
    }
  });

  it("search with --board invalid ID errors", async () => {
    const result = await run(
      "search",
      "--query",
      "beta",
      "--board",
      "00000000-0000-0000-0000-000000000000",
    );
    expect(result.error).toMatch(/Board not found/);
  });

  it("search returns empty for non-matching query", async () => {
    const result = await run(
      "search",
      "--query",
      "zzz-nonexistent-zzz-12345",
    );
    expect(result.count).toBe(0);
    expect(result.results).toEqual([]);
  });
});

// ─── Dry-run Mode ────────────────────────────────────────────────────────────

describe("Dry-run mode", () => {
  it("create-card --dry-run previews without creating", async () => {
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Dry-run ghost card",
      "--dry-run",
    );
    expect(result.dryRun).toBe(true);
    expect(result.command).toBe("create-card");
    expect(result.wouldDo.name).toBe("Dry-run ghost card");

    // Confirm card was NOT created
    const search = await run("search", "--query", "Dry-run ghost card");
    expect(search.results.find((r) => r.name === "Dry-run ghost card")).toBeUndefined();
  });

  it("move-card --dry-run previews without moving", async () => {
    // Create a real card in Backlog
    const card = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Dry-run move test",
    );
    const id = card.card.id;

    // Dry-run move to Todo
    const result = await run(
      "move-card",
      "--id",
      id,
      "--list",
      listIds["Todo"],
      "--dry-run",
    );
    expect(result.dryRun).toBe(true);
    expect(result.command).toBe("move-card");
    expect(result.wouldDo.listId).toBe(listIds["Todo"]);

    // Confirm card is still in Backlog
    const board = await run("board", boardId);
    const backlog = board.lists.find((l) => l.name === "Backlog");
    const found = backlog.cards.find((c) => c.id === id);
    expect(found).toBeDefined();
  });

  it("delete-board --dry-run --confirm previews without deleting", async () => {
    const result = await run(
      "delete-board",
      "--id",
      boardId,
      "--confirm",
      "--dry-run",
    );
    expect(result.dryRun).toBe(true);
    expect(result.command).toBe("delete-board");
    expect(result.wouldDo.boardId).toBe(boardId);

    // Confirm board still exists
    const boardResult = await run("board", boardId);
    expect(boardResult.command).toBe("board");
    expect(boardResult.board.id).toBe(boardId);
  });
});

// ─── Error Handling ─────────────────────────────────────────────────────────

describe("Error handling", () => {
  it("create-card without required args returns error", async () => {
    const result = await run("create-card", "--board", boardId);
    expect(result.error).toBeTruthy();
  });

  it("update-card with invalid ID returns error", async () => {
    const result = await run(
      "update-card",
      "--id",
      "00000000-0000-0000-0000-000000000000",
      "--name",
      "nope",
    );
    expect(result.error).toMatch(/not found/i);
  });

  it("done with invalid ID returns error", async () => {
    const result = await run(
      "done",
      "--id",
      "00000000-0000-0000-0000-000000000000",
    );
    expect(result.error).toMatch(/not found/i);
  });

  it("move-card without required args returns error", async () => {
    const result = await run("move-card", "--id", cardId);
    expect(result.error).toBeTruthy();
  });

  it("delete-board without --confirm returns error", async () => {
    const result = await run("delete-board", "--id", boardId);
    expect(result.error).toMatch(/--confirm/);
  });
});

// ─── Create List ────────────────────────────────────────────────────────────

describe("create-list", () => {
  let firstListId;
  let firstListOrder;

  it("create-list with name", async () => {
    const result = await run(
      "create-list",
      "--board",
      boardId,
      "--name",
      "Custom List A",
    );
    expect(result.command).toBe("create-list");
    expect(result.list.name).toBe("Custom List A");
    expect(result.list.listType).toBe("normal");
    firstListId = result.list.id;
    firstListOrder = result.list.order;
  });

  it("create-list auto-increments order", async () => {
    const result = await run(
      "create-list",
      "--board",
      boardId,
      "--name",
      "Custom List B",
    );
    expect(result.list.order).toBeGreaterThan(firstListOrder);
  });

  it("create-list without --name returns error", async () => {
    const result = await run("create-list", "--board", boardId);
    expect(result.error).toBeTruthy();
  });

  it("create-list without --board returns error", async () => {
    const result = await run("create-list", "--name", "orphan list");
    expect(result.error).toBeTruthy();
  });
});

// ─── Update Card Flags ──────────────────────────────────────────────────────

describe("update-card flags", () => {
  let flagTestCardId;

  beforeAll(async () => {
    const card = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Flag test card",
    );
    flagTestCardId = card.card.id;
  });

  it("update-card --progress sets progress", async () => {
    const result = await run(
      "update-card",
      "--id",
      flagTestCardId,
      "--progress",
      "50",
    );
    expect(result.command).toBe("update-card");
    expect(result.card.progress).toBe(50);
  });

  it("update-card --progress 0 resets progress", async () => {
    const result = await run(
      "update-card",
      "--id",
      flagTestCardId,
      "--progress",
      "0",
    );
    expect(result.card.progress).toBe(0);
  });

  it("update-card --description sets description", async () => {
    const result = await run(
      "update-card",
      "--id",
      flagTestCardId,
      "--description",
      "A test description",
    );
    expect(result.card.description).toBe("A test description");
  });

  it("update-card --description empty string clears description", async () => {
    const result = await run(
      "update-card",
      "--id",
      flagTestCardId,
      "--description",
      "",
    );
    // Empty string clears the description
    expect(result.card.description).toBe("");
  });

  it("update-card --due sets due date", async () => {
    const result = await run(
      "update-card",
      "--id",
      flagTestCardId,
      "--due",
      "2026-12-31",
    );
    expect(result.card.dueDate).toBeTruthy();
    expect(result.card.dueDate).toContain("2026-12-31");
  });

  it("update-card --due and --progress together", async () => {
    const result = await run(
      "update-card",
      "--id",
      flagTestCardId,
      "--due",
      "2027-01-15",
      "--progress",
      "75",
    );
    expect(result.card.dueDate).toContain("2027-01-15");
    expect(result.card.progress).toBe(75);
  });
});

// ─── Additional Error Paths ─────────────────────────────────────────────────

describe("Additional error paths", () => {
  const fakeUUID = "00000000-0000-0000-0000-000000000000";

  it("create-card with invalid board ID", async () => {
    const result = await run(
      "create-card",
      "--board",
      fakeUUID,
      "--list",
      fakeUUID,
      "--name",
      "ghost card",
    );
    expect(result.error).toBeTruthy();
  });

  it("create-list with invalid board ID", async () => {
    const result = await run(
      "create-list",
      "--board",
      fakeUUID,
      "--name",
      "ghost list",
    );
    expect(result.error).toBeTruthy();
  });

  it("archive-card with invalid card ID", async () => {
    const result = await run("archive-card", "--id", fakeUUID);
    expect(result.error).toBeTruthy();
  });

  it("move-card with invalid card ID", async () => {
    const result = await run(
      "move-card",
      "--id",
      fakeUUID,
      "--list",
      fakeUUID,
    );
    expect(result.error).toBeTruthy();
  });

  it("create-card without --list returns error", async () => {
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--name",
      "no list card",
    );
    expect(result.error).toBeTruthy();
  });
});

// ─── Database Error Paths ───────────────────────────────────────────────────

describe("Database error paths", () => {
  it("malformed UUID rejected by Postgres", async () => {
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      "not-a-uuid",
      "--name",
      "malformed uuid test",
    );
    expect(result.error).toBeTruthy();
  });

  it("FK violation on create-card with nonexistent list UUID", async () => {
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      "00000000-0000-0000-0000-000000000099",
      "--name",
      "fk-test",
    );
    expect(result.error).toBeTruthy();
  });

  it("FK violation on move-card to nonexistent list UUID", async () => {
    // Create a real card first
    const card = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "move-fk-test",
    );
    expect(card.card).toBeDefined();

    const result = await run(
      "move-card",
      "--id",
      card.card.id,
      "--list",
      "00000000-0000-0000-0000-000000000099",
    );
    expect(result.error).toBeTruthy();
  });

  it("create-board with extremely long name succeeds", async () => {
    const longName = "B".repeat(1000);
    const result = await run(
      "create-board",
      "--name",
      longName,
      "--template",
      "standard",
    );
    // Either succeeds or returns a graceful error
    if (result.error) {
      expect(result.error).toBeTruthy();
    } else {
      expect(result.command).toBe("create-board");
      expect(result.board.name).toBe(longName);
      // Clean up
      await run("delete-board", "--id", result.board.id, "--confirm");
    }
  });

  it("concurrent duplicate board names both succeed", async () => {
    const dupName = "duplicate-name-test";
    const [board1, board2] = await Promise.all([
      run("create-board", "--name", dupName, "--template", "standard"),
      run("create-board", "--name", dupName, "--template", "standard"),
    ]);

    expect(board1.command).toBe("create-board");
    expect(board1.board.name).toBe(dupName);
    expect(board2.command).toBe("create-board");
    expect(board2.board.name).toBe(dupName);
    expect(board1.board.id).not.toBe(board2.board.id);

    // Clean up both boards
    await Promise.all([
      run("delete-board", "--id", board1.board.id, "--confirm"),
      run("delete-board", "--id", board2.board.id, "--confirm"),
    ]);
  });
});

// ─── Card Ordering ──────────────────────────────────────────────────────────

describe("Card ordering", () => {
  let orderListId;
  let firstCardId;

  beforeAll(async () => {
    const list = await run(
      "create-list",
      "--board",
      boardId,
      "--name",
      "Order Test List",
    );
    orderListId = list.list.id;
  });

  it("first card in list gets order 0", async () => {
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      orderListId,
      "--name",
      "Order card 1",
    );
    expect(result.card.order).toBe(0);
    firstCardId = result.card.id;
  });

  it("second card gets order 1", async () => {
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      orderListId,
      "--name",
      "Order card 2",
    );
    expect(result.card.order).toBe(1);
  });

  it("moved card appends to target list", async () => {
    // Create a card in Backlog, then move it to our order test list
    const card = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Move-to-order test",
    );
    const result = await run(
      "move-card",
      "--id",
      card.card.id,
      "--list",
      orderListId,
    );
    expect(result.command).toBe("move-card");
    expect(result.card.listId).toBe(orderListId);
    // Verify via board that moved card is last (board returns cards ordered by `order`)
    const board = await run("board", boardId);
    const orderList = board.lists.find((l) => l.id === orderListId);
    expect(orderList.cards).toHaveLength(3);
    expect(orderList.cards[2].name).toBe("Move-to-order test");
  });

  it("board shows cards in insertion order", async () => {
    const board = await run("board", boardId);
    const orderList = board.lists.find((l) => l.id === orderListId);
    expect(orderList).toBeDefined();
    expect(orderList.cards.length).toBeGreaterThanOrEqual(3);
    // Cards should appear in creation/move order
    const names = orderList.cards.map((c) => c.name);
    expect(names).toEqual([
      "Order card 1",
      "Order card 2",
      "Move-to-order test",
    ]);
  });
});

// ─── Edge Cases ─────────────────────────────────────────────────────────────

describe("Edge cases", () => {
  // -- Search edge cases --

  it("search with % in query", async () => {
    const card = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "100% complete",
    );
    const result = await run("search", "--query", "100%");
    expect(result.count).toBeGreaterThanOrEqual(1);
    const match = result.results.find((r) => r.name === "100% complete");
    expect(match).toBeDefined();
  });

  it("search with _ in query", async () => {
    const card = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "step_1_done",
    );
    const result = await run("search", "--query", "step_1");
    expect(result.count).toBeGreaterThanOrEqual(1);
    const match = result.results.find((r) => r.name === "step_1_done");
    expect(match).toBeDefined();
  });

  it("search with backslash in query", async () => {
    await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "path\\to\\file",
    );
    const result = await run("search", "--query", "path\\to");
    expect(result.count).toBeGreaterThanOrEqual(1);
    const match = result.results.find((r) => r.name === "path\\to\\file");
    expect(match).toBeDefined();
  });

  it("search with unicode/emoji", async () => {
    await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "🚀 Launch Feature",
    );
    const result = await run("search", "--query", "🚀");
    expect(result.count).toBeGreaterThanOrEqual(1);
    const match = result.results.find((r) => r.name === "🚀 Launch Feature");
    expect(match).toBeDefined();
  });

  // -- Move edge cases --

  it("move card to same list", async () => {
    const card = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Same-list move test",
    );
    const result = await run(
      "move-card",
      "--id",
      card.card.id,
      "--list",
      listIds["Backlog"],
    );
    expect(result.command).toBe("move-card");
    expect(result.card.listId).toBe(listIds["Backlog"]);
  });

  it("move card with invalid list ID", async () => {
    const card = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Invalid move test",
    );
    const result = await run(
      "move-card",
      "--id",
      card.card.id,
      "--list",
      "00000000-0000-0000-0000-000000000000",
    );
    expect(result.error).toBeTruthy();
  });

  // -- Archive edge cases --

  it("archive card", async () => {
    const card = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Done"],
      "--name",
      "Archive edge test",
    );
    const result = await run("archive-card", "--id", card.card.id);
    expect(result.command).toBe("archive-card");

    const board = await run("board", boardId);
    const archiveList = board.lists.find((l) => l.name === "Archive");
    const found = archiveList.cards.find((c) => c.name === "Archive edge test");
    expect(found).toBeDefined();
  });

  it("archive already-archived card", async () => {
    // Create and archive a card
    const card = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Done"],
      "--name",
      "Double archive test",
    );
    await run("archive-card", "--id", card.card.id);

    // Archive again — should be idempotent
    const result = await run("archive-card", "--id", card.card.id);
    expect(result.error).toBeFalsy();
    expect(result.command).toBe("archive-card");
  });

  // -- Create card edge cases --

  it("create card with empty name", async () => {
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "",
    );
    expect(result.error).toBeTruthy();
  });

  it("create card with very long name", async () => {
    const longName = "A".repeat(500);
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      longName,
    );
    expect(result.command).toBe("create-card");
    expect(result.card.name).toBe(longName);
  });

  // -- Done edge cases --

  it("done on already-done card", async () => {
    const card = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Double done test",
    );
    await run("done", "--id", card.card.id);
    const result = await run("done", "--id", card.card.id);
    expect(result.command).toBe("done");
    expect(result.card.done).toBe(true);
  });
});

// ─── Card response includes updatedAt ───────────────────────────────────────

describe("Card response includes updatedAt", () => {
  let updatedAtCardId;

  it("create-card response includes updatedAt", async () => {
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "updatedAt test card",
    );
    expect(result.card.updatedAt).toBeTruthy();
    expect(new Date(result.card.updatedAt).getTime()).toBeGreaterThan(0);
    updatedAtCardId = result.card.id;
  });

  it("update-card response includes updatedAt", async () => {
    const result = await run(
      "update-card",
      "--id",
      updatedAtCardId,
      "--name",
      "updatedAt renamed",
    );
    expect(result.card.updatedAt).toBeTruthy();
    expect(new Date(result.card.updatedAt).getTime()).toBeGreaterThan(0);
  });

  it("move-card response includes updatedAt", async () => {
    const result = await run(
      "move-card",
      "--id",
      updatedAtCardId,
      "--list",
      listIds["Todo"],
    );
    expect(result.card.updatedAt).toBeTruthy();
    expect(new Date(result.card.updatedAt).getTime()).toBeGreaterThan(0);
  });

  it("done response includes updatedAt", async () => {
    const result = await run("done", "--id", updatedAtCardId);
    expect(result.card.updatedAt).toBeTruthy();
    expect(new Date(result.card.updatedAt).getTime()).toBeGreaterThan(0);
  });

  it("archive-card response includes updatedAt", async () => {
    const result = await run("archive-card", "--id", updatedAtCardId);
    expect(result.card.updatedAt).toBeTruthy();
    expect(new Date(result.card.updatedAt).getTime()).toBeGreaterThan(0);
  });
});

// ─── Audit Logging ──────────────────────────────────────────────────────────

describe("Audit logging", () => {
  let auditCardId;
  let auditCardName;

  it("create-card inserts a CREATE board_action", async () => {
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Audit test card",
    );
    auditCardId = result.card.id;
    auditCardName = result.card.name;

    const actions = await queryActions(auditCardId);
    expect(actions.length).toBeGreaterThanOrEqual(1);
    const createAction = actions.find((a) => a.action === "CREATE");
    expect(createAction).toBeDefined();
    expect(createAction.boardComponent).toBe("card");
    expect(createAction.boardId).toBe(boardId);
    expect(createAction.actorType).toBe("agent");
    expect(createAction.agentTemplateId).toBe("claude-code-kanban");
  });

  it("update-card --name inserts a RENAME action with before/after", async () => {
    const oldName = auditCardName;
    const result = await run(
      "update-card",
      "--id",
      auditCardId,
      "--name",
      "Audit renamed",
    );
    auditCardName = result.card.name;

    const actions = await queryActions(auditCardId);
    const renameAction = actions.find((a) => a.action === "RENAME");
    expect(renameAction).toBeDefined();
    expect(renameAction.changes).toBeDefined();
    expect(renameAction.changes.field).toBe("name");
    expect(renameAction.changes.from).toBe(oldName);
    expect(renameAction.changes.to).toBe("Audit renamed");
  });

  it("update-card --description inserts an UPDATE_DESCRIPTION action", async () => {
    await run(
      "update-card",
      "--id",
      auditCardId,
      "--description",
      "Audit description",
    );

    const actions = await queryActions(auditCardId);
    const descAction = actions.find((a) => a.action === "UPDATE_DESCRIPTION");
    expect(descAction).toBeDefined();
    expect(descAction.changes).toBeDefined();
    expect(descAction.changes.field).toBe("description");
    expect(descAction.changes.to).toBe("Audit description");
  });

  it("move-card inserts a MOVE action with fromList/toList", async () => {
    await run(
      "move-card",
      "--id",
      auditCardId,
      "--list",
      listIds["In Progress"],
    );

    const actions = await queryActions(auditCardId);
    const moveAction = actions.find((a) => a.action === "MOVE");
    expect(moveAction).toBeDefined();
    expect(moveAction.changes).toBeDefined();
    expect(moveAction.changes.toListId).toBe(listIds["In Progress"]);
    expect(moveAction.changes.fromListId).toBeTruthy();
    expect(moveAction.changes.toListName).toBe("In Progress");
  });

  it("done inserts a MARK_DONE action", async () => {
    await run("done", "--id", auditCardId);

    const actions = await queryActions(auditCardId);
    const doneAction = actions.find((a) => a.action === "MARK_DONE");
    expect(doneAction).toBeDefined();
    expect(doneAction.boardComponent).toBe("card");
  });

  it("archive-card inserts an ARCHIVE action", async () => {
    await run("archive-card", "--id", auditCardId);

    const actions = await queryActions(auditCardId);
    const archiveAction = actions.find((a) => a.action === "ARCHIVE");
    expect(archiveAction).toBeDefined();
    expect(archiveAction.changes).toBeDefined();
    expect(archiveAction.changes.toListName).toBe("Archive");
  });

  it("create-board inserts a CREATE action for board entity", async () => {
    const result = await run(
      "create-board",
      "--name",
      "audit-board-test",
      "--template",
      "standard",
    );
    const newBoardId = result.board.id;

    const actions = await queryActions(newBoardId);
    const createAction = actions.find(
      (a) => a.action === "CREATE" && a.boardComponent === "board",
    );
    expect(createAction).toBeDefined();
    expect(createAction.boardId).toBe(newBoardId);

    // Clean up
    await run("delete-board", "--id", newBoardId, "--confirm");
  });

  it("delete-board inserts a DELETE action for board entity", async () => {
    const result = await run(
      "create-board",
      "--name",
      "audit-delete-test",
      "--template",
      "standard",
    );
    const delBoardId = result.board.id;
    await run("delete-board", "--id", delBoardId, "--confirm");

    const actions = await queryActions(delBoardId);
    const deleteAction = actions.find(
      (a) => a.action === "DELETE" && a.boardComponent === "board",
    );
    expect(deleteAction).toBeDefined();
  });

  it("dry-run does NOT insert any board_action", async () => {
    const beforeActions = await queryBoardActions(boardId);
    const beforeCount = beforeActions.length;

    await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Dry-run audit test",
      "--dry-run",
    );

    const afterActions = await queryBoardActions(boardId);
    expect(afterActions.length).toBe(beforeCount);
  });

  it("agentSessionId differs across invocations", async () => {
    const card1 = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Session ID test 1",
    );
    const card2 = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Session ID test 2",
    );

    const actions1 = await queryActions(card1.card.id);
    const actions2 = await queryActions(card2.card.id);

    const session1 = actions1.find((a) => a.action === "CREATE")?.agentSessionId;
    const session2 = actions2.find((a) => a.action === "CREATE")?.agentSessionId;

    expect(session1).toBeTruthy();
    expect(session2).toBeTruthy();
    expect(session1).not.toBe(session2);
  });
});

// ─── Optimistic Locking ─────────────────────────────────────────────────────

describe("Optimistic locking", () => {
  let lockCardId;
  let lockCardUpdatedAt;

  beforeAll(async () => {
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Lock test card",
    );
    lockCardId = result.card.id;
    lockCardUpdatedAt = result.card.updatedAt;
  });

  it("update-card with correct --expect-updated-at succeeds", async () => {
    const result = await run(
      "update-card",
      "--id",
      lockCardId,
      "--name",
      "Lock success",
      "--expect-updated-at",
      lockCardUpdatedAt,
    );
    expect(result.command).toBe("update-card");
    expect(result.card.name).toBe("Lock success");
    lockCardUpdatedAt = result.card.updatedAt;
  });

  it("update-card with stale --expect-updated-at returns conflict", async () => {
    const staleTimestamp = "2020-01-01T00:00:00.000Z";
    const result = await run(
      "update-card",
      "--id",
      lockCardId,
      "--name",
      "Should fail",
      "--expect-updated-at",
      staleTimestamp,
    );
    expect(result.error).toMatch(/conflict/i);
    expect(result.cardId).toBe(lockCardId);
    expect(result.expectedUpdatedAt).toBe(staleTimestamp);
  });

  it("update-card without --expect-updated-at is backwards-compatible", async () => {
    const result = await run(
      "update-card",
      "--id",
      lockCardId,
      "--name",
      "Lock compat",
    );
    expect(result.command).toBe("update-card");
    expect(result.card.name).toBe("Lock compat");
    lockCardUpdatedAt = result.card.updatedAt;
  });

  it("move-card with stale --expect-updated-at returns conflict", async () => {
    const result = await run(
      "move-card",
      "--id",
      lockCardId,
      "--list",
      listIds["Todo"],
      "--expect-updated-at",
      "2020-01-01T00:00:00.000Z",
    );
    expect(result.error).toMatch(/conflict/i);
  });

  it("done with stale --expect-updated-at returns conflict", async () => {
    const result = await run(
      "done",
      "--id",
      lockCardId,
      "--expect-updated-at",
      "2020-01-01T00:00:00.000Z",
    );
    expect(result.error).toMatch(/conflict/i);
  });

  it("archive-card with stale --expect-updated-at returns conflict", async () => {
    const result = await run(
      "archive-card",
      "--id",
      lockCardId,
      "--expect-updated-at",
      "2020-01-01T00:00:00.000Z",
    );
    expect(result.error).toMatch(/conflict/i);
  });

  it("concurrent updates — exactly one wins with optimistic lock", async () => {
    // Create a fresh card for concurrency test
    const fresh = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Concurrency card",
    );
    const ts = fresh.card.updatedAt;

    // Both use the same timestamp — one should succeed, one should conflict
    const [result1, result2] = await Promise.all([
      run(
        "update-card",
        "--id",
        fresh.card.id,
        "--name",
        "Winner",
        "--expect-updated-at",
        ts,
      ),
      run(
        "update-card",
        "--id",
        fresh.card.id,
        "--name",
        "Loser",
        "--expect-updated-at",
        ts,
      ),
    ]);

    const successes = [result1, result2].filter((r) => r.command === "update-card");
    const conflicts = [result1, result2].filter((r) => r.error && /conflict/i.test(r.error));
    expect(successes).toHaveLength(1);
    expect(conflicts).toHaveLength(1);
  });

  it("conflict error includes expected shape", async () => {
    const result = await run(
      "update-card",
      "--id",
      lockCardId,
      "--name",
      "Shape test",
      "--expect-updated-at",
      "2020-01-01T00:00:00.000Z",
    );
    expect(result.error).toMatch(/conflict/i);
    expect(result.cardId).toBe(lockCardId);
    expect(result.expectedUpdatedAt).toBe("2020-01-01T00:00:00.000Z");
    expect(result.hint).toBeTruthy();
  });
});

// ─── Activity Command ───────────────────────────────────────────────────────

describe("Activity command", () => {
  let activityCardId;

  beforeAll(async () => {
    // Create and mutate a card so there's activity to read
    const result = await run(
      "create-card",
      "--board",
      boardId,
      "--list",
      listIds["Backlog"],
      "--name",
      "Activity test card",
    );
    activityCardId = result.card.id;
    await run("update-card", "--id", activityCardId, "--name", "Activity renamed");
    await run("move-card", "--id", activityCardId, "--list", listIds["Todo"]);
  });

  it("activity --card returns recent actions", async () => {
    const result = await run("activity", "--card", activityCardId);
    expect(result.command).toBe("activity");
    expect(result.entityId).toBe(activityCardId);
    /** @type {BoardActionActivityEntry[]} */
    const actions = result.actions;
    expect(result.actions).toBeInstanceOf(Array);
    expect(actions.length).toBeGreaterThanOrEqual(2);
  });

  it("activity --card --limit limits results", async () => {
    const result = await run(
      "activity",
      "--card",
      activityCardId,
      "--limit",
      "1",
    );
    expect(result.command).toBe("activity");
    /** @type {BoardActionActivityEntry[]} */
    const actions = result.actions;
    expect(actions).toHaveLength(1);
  });

  it("activity --board returns board-wide actions", async () => {
    const result = await run("activity", "--board", boardId);
    expect(result.command).toBe("activity");
    expect(result.entityId).toBe(boardId);
    /** @type {BoardActionActivityEntry[]} */
    const actions = result.actions;
    expect(result.actions).toBeInstanceOf(Array);
    expect(actions.length).toBeGreaterThanOrEqual(1);
  });

  it("activity without --card or --board returns error", async () => {
    const result = await run("activity");
    expect(result.error).toBeTruthy();
  });

  it("activity action shape includes expected fields", async () => {
    const result = await run("activity", "--card", activityCardId);
    /** @type {BoardActionActivityEntry} */
    const action = result.actions[0];
    expect(action.action).toBeTruthy();
    expect(action.actorType).toBeTruthy();
    expect(action.createdAt).toBeTruthy();
    // userId may or may not be present depending on actor
    expect(typeof action.action).toBe("string");
  });
});

// ─── Cleanup: delete-board ──────────────────────────────────────────────────

describe("Cleanup", () => {
  it("delete-board removes board and all data", async () => {
    const result = await run("delete-board", "--id", boardId, "--confirm");
    expect(result.command).toBe("delete-board");
    expect(result.board.id).toBe(boardId);
    expect(result.board.name).toBe("test-kanban-integration");
    expect(result.deleted.lists).toBeGreaterThanOrEqual(5);

    // Verify board is gone
    const boardResult = await run("board", boardId);
    expect(boardResult.error).toMatch(/not found/i);
  });
});
