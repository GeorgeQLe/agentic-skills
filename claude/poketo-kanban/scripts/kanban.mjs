#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { eq, and, ilike, asc, desc, inArray } from "drizzle-orm";

// ─── Config ──────────────────────────────────────────────────────────────────

function loadConfig() {
  const configPath = join(homedir(), ".poketo", "config.json");
  if (!existsSync(configPath)) {
    return null;
  }
  return JSON.parse(readFileSync(configPath, "utf-8"));
}

function getSession() {
  const config = loadConfig();
  if (!config?.session) return null;
  return config.session;
}

function getDbUrl() {
  // Check env first, then try reading from poke .env
  if (process.env.POKETOWORK_DATABASE_URL) {
    return process.env.POKETOWORK_DATABASE_URL;
  }
  // Try common poke project locations
  const pokePaths = [
    join(homedir(), "projects", "apps", "poke", "monorepo", ".env.local"),
    join(homedir(), "projects", "apps", "poke", "monorepo", ".env"),
    join(homedir(), "projects", "poke", "dev", "poke-productivity-suite", ".env"),
    join(homedir(), "projects", "poke", "dev", "poke-productivity-suite", ".env.local"),
  ];
  for (const envPath of pokePaths) {
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, "utf-8");
      const match = content.match(/^POKETOWORK_DATABASE_URL=["']?([^\s"']+)["']?/m);
      if (match) return match[1];
    }
  }
  return null;
}

// ─── Inline Schema (minimal subset for standalone use) ───────────────────────

const listTypeEnum = pgEnum("list_type", ["normal", "done", "punt"]);
const cardSortPrefEnum = pgEnum("card_sort_preference", ["manual", "dueDate", "starred", "createdAt"]);
const cardTypeEnum = pgEnum("card_type", ["task", "action"]);

const boards = pgTable("board", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  orgId: text("org_id").notNull(),
  projectId: text("project_id"),
  teamId: text("team_id"),
  archiveListId: text("archive_list_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

const lists = pgTable("list", {
  id: text("id").primaryKey(),
  boardId: text("board_id").notNull(),
  name: text("name").notNull(),
  order: integer("order").notNull(),
  listType: listTypeEnum("list_type").default("normal"),
  cardSortPreference: cardSortPrefEnum("card_sort_preference"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

const cards = pgTable("card", {
  id: text("id").primaryKey(),
  listId: text("list_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  dueDate: timestamp("due_date"),
  done: boolean("done").default(false).notNull(),
  starred: boolean("starred").default(false).notNull(),
  progress: integer("progress"),
  teamId: text("team_id"),
  cardType: cardTypeEnum("card_type").default("task").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── DB Connection ───────────────────────────────────────────────────────────

function getDb() {
  const url = getDbUrl();
  if (!url) {
    output({ error: "POKETOWORK_DATABASE_URL not set. Set it as an environment variable or ensure poke-productivity-suite has a .env file." });
    process.exit(1);
  }
  const sql = neon(url);
  return drizzle(sql);
}

// ─── Output ──────────────────────────────────────────────────────────────────

function output(data) {
  console.log(JSON.stringify(data, null, 2));
}

// ─── Commands ────────────────────────────────────────────────────────────────

async function cmdBoards(db, session) {
  const results = await db
    .select()
    .from(boards)
    .where(eq(boards.orgId, session.orgId))
    .orderBy(desc(boards.createdAt));

  output({
    command: "boards",
    count: results.length,
    boards: results.map((b) => ({
      id: b.id,
      name: b.name,
      createdAt: b.createdAt,
    })),
  });
}

async function cmdBoard(db, boardId) {
  // Get board
  const [board] = await db.select().from(boards).where(eq(boards.id, boardId)).limit(1);
  if (!board) {
    output({ error: `Board not found: ${boardId}` });
    process.exit(1);
  }

  // Get lists with cards
  const boardLists = await db
    .select()
    .from(lists)
    .where(eq(lists.boardId, boardId))
    .orderBy(asc(lists.order));

  const listIds = boardLists.map((l) => l.id);
  let allCards = [];
  if (listIds.length > 0) {
    allCards = await db
      .select()
      .from(cards)
      .where(inArray(cards.listId, listIds))
      .orderBy(asc(cards.order));
  }

  // Group cards by list
  const cardsByList = {};
  for (const card of allCards) {
    if (!cardsByList[card.listId]) cardsByList[card.listId] = [];
    cardsByList[card.listId].push({
      id: card.id,
      name: card.name,
      done: card.done,
      starred: card.starred,
      dueDate: card.dueDate,
      description: card.description,
      progress: card.progress,
    });
  }

  output({
    command: "board",
    board: { id: board.id, name: board.name },
    lists: boardLists.map((l) => ({
      id: l.id,
      name: l.name,
      type: l.listType,
      order: l.order,
      cards: cardsByList[l.id] || [],
    })),
  });
}

async function cmdCreateCard(db, session, args) {
  const boardId = getArg(args, "--board");
  const listId = getArg(args, "--list");
  const name = getArg(args, "--name");
  const description = getArg(args, "--description");
  const due = getArg(args, "--due");

  if (!boardId || !listId || !name) {
    output({ error: "Required: --board <id> --list <id> --name \"title\"" });
    process.exit(1);
  }

  // Get max order in list
  const existing = await db
    .select({ order: cards.order })
    .from(cards)
    .where(eq(cards.listId, listId))
    .orderBy(desc(cards.order))
    .limit(1);

  const nextOrder = existing.length > 0 ? existing[0].order + 1 : 0;
  const id = randomUUID();

  const [created] = await db.insert(cards).values({
    id,
    listId,
    name,
    description: description || null,
    order: nextOrder,
    dueDate: due ? new Date(due) : null,
    done: false,
    starred: false,
    cardType: "task",
  }).returning();

  output({
    command: "create-card",
    card: created,
  });
}

async function cmdUpdateCard(db, args) {
  const id = getArg(args, "--id");
  if (!id) {
    output({ error: "Required: --id <card-id>" });
    process.exit(1);
  }

  const updates = {};
  const name = getArg(args, "--name");
  const description = getArg(args, "--description");
  const due = getArg(args, "--due");

  if (name) updates.name = name;
  if (description) updates.description = description;
  if (due) updates.dueDate = new Date(due);
  if (args.includes("--done")) updates.done = true;
  if (args.includes("--undone")) updates.done = false;
  if (args.includes("--starred")) updates.starred = true;
  if (args.includes("--unstarred")) updates.starred = false;

  updates.updatedAt = new Date();

  const [updated] = await db
    .update(cards)
    .set(updates)
    .where(eq(cards.id, id))
    .returning();

  if (!updated) {
    output({ error: `Card not found: ${id}` });
    process.exit(1);
  }

  output({
    command: "update-card",
    card: updated,
  });
}

async function cmdDone(db, args) {
  const id = getArg(args, "--id");
  if (!id) {
    output({ error: "Required: --id <card-id>" });
    process.exit(1);
  }

  const [updated] = await db
    .update(cards)
    .set({ done: true, updatedAt: new Date() })
    .where(eq(cards.id, id))
    .returning();

  if (!updated) {
    output({ error: `Card not found: ${id}` });
    process.exit(1);
  }

  output({
    command: "done",
    card: { id: updated.id, name: updated.name, done: true },
  });
}

async function cmdMoveCard(db, args) {
  const id = getArg(args, "--id");
  const listId = getArg(args, "--list");
  if (!id || !listId) {
    output({ error: "Required: --id <card-id> --list <target-list-id>" });
    process.exit(1);
  }

  // Get max order in target list
  const existing = await db
    .select({ order: cards.order })
    .from(cards)
    .where(eq(cards.listId, listId))
    .orderBy(desc(cards.order))
    .limit(1);

  const nextOrder = existing.length > 0 ? existing[0].order + 1 : 0;

  const [updated] = await db
    .update(cards)
    .set({ listId, order: nextOrder, updatedAt: new Date() })
    .where(eq(cards.id, id))
    .returning();

  if (!updated) {
    output({ error: `Card not found: ${id}` });
    process.exit(1);
  }

  output({
    command: "move-card",
    card: { id: updated.id, name: updated.name, listId: updated.listId },
  });
}

async function cmdCreateBoard(db, session, args) {
  const name = getArg(args, "--name");
  if (!name) {
    output({ error: "Required: --name \"Board Name\"" });
    process.exit(1);
  }

  const template = getArg(args, "--template");
  const customLists = getArg(args, "--lists");

  if (template && customLists) {
    output({ error: "--template and --lists are mutually exclusive" });
    process.exit(1);
  }

  const TEMPLATES = {
    standard: [
      { name: "Backlog", order: 0, listType: "normal" },
      { name: "Todo", order: 1, listType: "normal" },
      { name: "In Progress", order: 2, listType: "normal" },
      { name: "Done", order: 3, listType: "done" },
      { name: "Punt", order: 4, listType: "punt" },
    ],
  };

  let listDefs;
  if (template) {
    listDefs = TEMPLATES[template];
    if (!listDefs) {
      output({ error: `Unknown template: ${template}. Available: ${Object.keys(TEMPLATES).join(", ")}` });
      process.exit(1);
    }
  } else if (customLists) {
    listDefs = customLists.split(",").map((n, i) => {
      const parts = n.trim().split(":");
      return { name: parts[0], order: i, listType: parts[1] || "normal" };
    });
  } else {
    listDefs = [
      { name: "Backlog", order: 0, listType: "normal" },
      { name: "In Progress", order: 1, listType: "normal" },
      { name: "Done", order: 2, listType: "done" },
    ];
  }

  const boardId = randomUUID();
  const [board] = await db.insert(boards).values({
    id: boardId,
    name,
    orgId: session.orgId,
  }).returning();

  const createdLists = [];
  for (const l of listDefs) {
    const [created] = await db.insert(lists).values({
      id: randomUUID(),
      boardId,
      name: l.name,
      order: l.order,
      listType: l.listType,
    }).returning();
    createdLists.push(created);
  }

  output({
    command: "create-board",
    board: { id: board.id, name: board.name },
    lists: createdLists.map((l) => ({ id: l.id, name: l.name, type: l.listType })),
  });
}

async function cmdCreateList(db, args) {
  const boardId = getArg(args, "--board");
  const name = getArg(args, "--name");
  if (!boardId || !name) {
    output({ error: "Required: --board <id> --name \"List Name\"" });
    process.exit(1);
  }

  // Get max order
  const existing = await db
    .select({ order: lists.order })
    .from(lists)
    .where(eq(lists.boardId, boardId))
    .orderBy(desc(lists.order))
    .limit(1);

  const nextOrder = existing.length > 0 ? existing[0].order + 1 : 0;

  const [created] = await db.insert(lists).values({
    id: randomUUID(),
    boardId,
    name,
    order: nextOrder,
    listType: "normal",
  }).returning();

  output({
    command: "create-list",
    list: created,
  });
}

async function cmdSearch(db, session, args) {
  const query = getArg(args, "--query");
  if (!query) {
    output({ error: "Required: --query \"search term\"" });
    process.exit(1);
  }

  // Get all board IDs for this org
  const orgBoards = await db
    .select({ id: boards.id })
    .from(boards)
    .where(eq(boards.orgId, session.orgId));

  const boardIds = orgBoards.map((b) => b.id);
  if (boardIds.length === 0) {
    output({ command: "search", query, results: [] });
    return;
  }

  // Get all list IDs for these boards
  const orgLists = await db
    .select({ id: lists.id, boardId: lists.boardId, name: lists.name })
    .from(lists)
    .where(inArray(lists.boardId, boardIds));

  const listIds = orgLists.map((l) => l.id);
  if (listIds.length === 0) {
    output({ command: "search", query, results: [] });
    return;
  }

  // Search cards
  const results = await db
    .select()
    .from(cards)
    .where(
      and(
        inArray(cards.listId, listIds),
        ilike(cards.name, `%${query}%`),
      ),
    )
    .orderBy(desc(cards.updatedAt))
    .limit(50);

  // Enrich with list/board info
  const listMap = {};
  for (const l of orgLists) listMap[l.id] = l;

  const boardMap = {};
  const boardResults = await db.select().from(boards).where(inArray(boards.id, boardIds));
  for (const b of boardResults) boardMap[b.id] = b;

  output({
    command: "search",
    query,
    count: results.length,
    results: results.map((c) => {
      const list = listMap[c.listId];
      const board = list ? boardMap[list.boardId] : null;
      return {
        id: c.id,
        name: c.name,
        done: c.done,
        starred: c.starred,
        dueDate: c.dueDate,
        listName: list?.name,
        boardName: board?.name,
        boardId: board?.id,
      };
    }),
  });
}

async function cmdArchiveCard(db, args) {
  const id = getArg(args, "--id");
  if (!id) {
    output({ error: "Required: --id <card-id>" });
    process.exit(1);
  }

  // Look up card → list → board
  const [card] = await db.select().from(cards).where(eq(cards.id, id)).limit(1);
  if (!card) {
    output({ error: `Card not found: ${id}` });
    process.exit(1);
  }

  const [list] = await db.select().from(lists).where(eq(lists.id, card.listId)).limit(1);
  const [board] = await db.select().from(boards).where(eq(boards.id, list.boardId)).limit(1);

  let archiveListId = board.archiveListId;

  // Auto-create archive list if needed
  if (!archiveListId) {
    const maxOrder = await db
      .select({ order: lists.order })
      .from(lists)
      .where(eq(lists.boardId, board.id))
      .orderBy(desc(lists.order))
      .limit(1);
    const nextOrder = maxOrder.length > 0 ? maxOrder[0].order + 1 : 0;
    const newListId = randomUUID();
    await db.insert(lists).values({
      id: newListId,
      boardId: board.id,
      name: "Archive",
      order: nextOrder,
      listType: "normal",
    });
    await db
      .update(boards)
      .set({ archiveListId: newListId })
      .where(eq(boards.id, board.id));
    archiveListId = newListId;
  }

  // Move card to archive list
  const maxCardOrder = await db
    .select({ order: cards.order })
    .from(cards)
    .where(eq(cards.listId, archiveListId))
    .orderBy(desc(cards.order))
    .limit(1);
  const nextOrder = maxCardOrder.length > 0 ? maxCardOrder[0].order + 1 : 0;

  await db
    .update(cards)
    .set({ listId: archiveListId, order: nextOrder, updatedAt: new Date() })
    .where(eq(cards.id, id));

  output({
    command: "archive-card",
    card: { id, name: card.name, archivedTo: archiveListId },
  });
}

async function cmdDeleteBoard(db, args) {
  const id = getArg(args, "--id");
  if (!id || !args.includes("--confirm")) {
    output({ error: "Required: --id <board-id> --confirm" });
    process.exit(1);
  }

  // Get all lists for this board
  const boardLists = await db
    .select({ id: lists.id })
    .from(lists)
    .where(eq(lists.boardId, id));
  const listIds = boardLists.map((l) => l.id);

  // Delete all cards in those lists
  let deletedCards = 0;
  if (listIds.length > 0) {
    const result = await db.delete(cards).where(inArray(cards.listId, listIds));
    deletedCards = result.rowCount || 0;
  }

  // Delete all lists
  await db.delete(lists).where(eq(lists.boardId, id));

  // Delete the board
  const [deleted] = await db.delete(boards).where(eq(boards.id, id)).returning();
  if (!deleted) {
    output({ error: `Board not found: ${id}` });
    process.exit(1);
  }

  output({
    command: "delete-board",
    board: { id, name: deleted.name },
    deleted: { lists: listIds.length, cards: deletedCards },
  });
}

// ─── Arg Parsing Helpers ─────────────────────────────────────────────────────

function getArg(args, flag) {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return null;
  return args[idx + 1];
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "--help") {
    output({
      commands: [
        "boards                                  — List all boards",
        "board <id>                              — View board with lists and cards",
        "create-card --board <id> --list <id> --name \"...\" [--description \"...\"] [--due \"YYYY-MM-DD\"]",
        "update-card --id <id> [--name] [--done] [--undone] [--starred] [--due] [--description]",
        "done --id <id>                          — Mark card as done",
        "move-card --id <id> --list <id>         — Move card to another list",
        "create-board --name \"...\" [--template standard] [--lists \"...\"] — Create board",
        "create-list --board <id> --name \"...\"   — Add list to board",
        "search --query \"...\"                    — Search cards across boards",
        "archive-card --id <id>                  — Archive a card",
        "delete-board --id <id> --confirm        — Delete board and all its data",
      ],
    });
    return;
  }

  // Check auth
  const session = getSession();
  if (!session) {
    output({ error: "Not authenticated. Run `poketo auth login` first." });
    process.exit(1);
  }
  if (!session.orgId) {
    output({ error: "No organization found. Ensure your Poketo account belongs to an org." });
    process.exit(1);
  }

  const db = getDb();
  const rest = args.slice(1);

  switch (command) {
    case "boards":
      await cmdBoards(db, session);
      break;
    case "board":
      if (!rest[0]) { output({ error: "Usage: board <board-id>" }); process.exit(1); }
      await cmdBoard(db, rest[0]);
      break;
    case "create-card":
      await cmdCreateCard(db, session, rest);
      break;
    case "update-card":
      await cmdUpdateCard(db, rest);
      break;
    case "done":
      await cmdDone(db, rest);
      break;
    case "move-card":
      await cmdMoveCard(db, rest);
      break;
    case "create-board":
      await cmdCreateBoard(db, session, rest);
      break;
    case "create-list":
      await cmdCreateList(db, rest);
      break;
    case "search":
      await cmdSearch(db, session, rest);
      break;
    case "archive-card":
      await cmdArchiveCard(db, rest);
      break;
    case "delete-board":
      await cmdDeleteBoard(db, rest);
      break;
    default:
      output({ error: `Unknown command: ${command}. Run with --help for usage.` });
      process.exit(1);
  }
}

main().catch((err) => {
  output({ error: err.message });
  process.exit(1);
});
