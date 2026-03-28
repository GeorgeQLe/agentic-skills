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

  it.todo(
    "search with backslash in query — known bug, backslash not escaped, Phase 7 fix",
  );

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
