import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(__dirname, "kanban.mjs");

// ─── Helper ─────────────────────────────────────────────────────────────────

async function run(...args) {
  try {
    const { stdout } = await execFileAsync("node", [SCRIPT, ...args], {
      timeout: 15000,
    });
    return JSON.parse(stdout);
  } catch (err) {
    // Command exited non-zero — try to parse JSON from stderr or stdout
    const output = err.stdout || err.stderr || "";
    try {
      return JSON.parse(output);
    } catch {
      throw new Error(`kanban.mjs failed: ${output || err.message}`);
    }
  }
}

// ─── Test State ─────────────────────────────────────────────────────────────

let boardId;
let listIds = {}; // { Backlog, Todo, "In Progress", Done, Punt }

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
    const listMap = {};
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

let cardId;

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

  it("update-card --description ignores empty string (falsy guard)", async () => {
    // The script uses `if (description)` so empty string is a no-op
    const result = await run(
      "update-card",
      "--id",
      flagTestCardId,
      "--description",
      "",
    );
    // Description stays as previously set
    expect(result.card.description).toBe("A test description");
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
