#!/usr/bin/env node
// DEPRECATED: Use `poketo kanban` CLI instead. Kept as fallback/admin tooling.

import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";
import { hostname } from "node:os";
import { ENV_SEARCH_PATHS } from "./env-paths.mjs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, text, integer, boolean, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { eq, and, or, ilike, asc, desc, inArray } from "drizzle-orm";

/** @typedef {import("./types/kanban").BoardActionActivityEntry} BoardActionActivityEntry */
/** @typedef {import("./types/kanban").BoardActionInput} BoardActionInput */
/** @typedef {import("./types/kanban").BoardCardView} BoardCardView */
/** @typedef {import("./types/kanban").BoardListSummary} BoardListSummary */
/** @typedef {import("./types/kanban").BoardSearchResult} BoardSearchResult */
/** @typedef {import("./types/kanban").BoardView} BoardView */
/** @typedef {import("./types/kanban").ListDefinition} ListDefinition */

const agentSessionId = `${hostname()}-${new Date().toISOString()}`;

function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error === null || error === undefined) return "No error detail provided";
  if (typeof error !== "object") return String(error);
  return "Non-Error thrown value";
}

function normalizeSessionConfig(session) {
  if (!isRecord(session) || typeof session.orgId !== "string") {
    return null;
  }

  return {
    orgId: session.orgId,
    actorId: typeof session.userId === "string" ? session.userId : session.orgId,
  };
}

/** @returns {{ session: { orgId: string, actorId: string } } | null} */
function loadConfig() {
  const configPath = join(homedir(), ".poketo", "config.json");
  if (!existsSync(configPath)) {
    return null;
  }
  try {
    const config = JSON.parse(readFileSync(configPath, "utf-8"));
    const session = normalizeSessionConfig(config.session);
    if (!session) {
      console.error(`Warning: invalid session config in ${configPath}, ignoring config`);
      return null;
    }
    return { session };
  } catch (error) {
    console.error(`Warning: malformed JSON in ${configPath}, ignoring config (${getErrorMessage(error)})`);
    return null;
  }
}

/** @returns {{ orgId: string, actorId: string } | null} */
function getSession() {
  const config = loadConfig();
  if (!config?.session) return null;
  return config.session;
}

export function getDbUrl() {
  if (process.env.POKETOWORK_DATABASE_URL) {
    return process.env.POKETOWORK_DATABASE_URL;
  }
  for (const envPath of ENV_SEARCH_PATHS) {
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, "utf-8");
      const match = content.match(/^POKETOWORK_DATABASE_URL=["']?([^\s"']+)["']?/m);
      if (match) return match[1];
    }
  }
  return null;
}

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

/**
 * @param {BoardActionInput} input
 * @param {{ orgId: string, actorId: string }} session
 */
async function logAction(db, session, input) {
  const { action, entity, entityId, entityName, boardId, changes } = input;
  await db.insert(boardActions).values({
    id: randomUUID(),
    action,
    boardComponent: entity,
    boardComponentId: entityId,
    boardComponentName: entityName,
    boardId,
    userId: session.actorId,
    actorType: "agent",
    agentSessionId,
    agentTemplateId: "claude-code-kanban",
    changes: changes ?? null,
  });
}

async function getBoardIdForCard(db, card) {
  const [list] = await db.select({ boardId: lists.boardId }).from(lists).where(eq(lists.id, card.listId)).limit(1);
  if (!list?.boardId) {
    throw new Error(`Cannot determine board for card ${card.id}: list ${card.listId} not found`);
  }
  return list.boardId;
}

function getDb() {
  const url = getDbUrl();
  if (!url) {
    output({
      error: "POKETOWORK_DATABASE_URL not set for the legacy fallback script. Prefer `poketo kanban` for standard workflows, or set the DB URL / local poke .env only when you intentionally need direct DB access.",
    });
    process.exit(1);
  }
  const sql = neon(url);
  return drizzle(sql);
}

function output(data) {
  console.log(JSON.stringify(data, null, 2));
}

function parseIntegerArg(value, flag) {
  if (typeof value !== "string" || !/^-?\d+$/.test(value)) {
    throw new Error(`Invalid ${flag}: expected an integer`);
  }
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed)) {
    throw new Error(`Invalid ${flag}: integer is out of range`);
  }
  return parsed;
}

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
  const [board] = await db.select().from(boards).where(eq(boards.id, boardId)).limit(1);
  if (!board) {
    output({ error: `Board not found: ${boardId}` });
    process.exit(1);
  }
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
  /** @type {Record<string, BoardCardView[]>} */
  const cardsByList = Object.create(null);
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

  /** @type {BoardListSummary[]} */
  const boardListsView = boardLists.map((l) => ({
    id: l.id,
    name: l.name,
    type: l.listType,
    order: l.order,
    cards: cardsByList[l.id] || [],
  }));

  /** @type {BoardView} */
  const boardView = { id: board.id, name: board.name };

  output({
    command: "board",
    board: boardView,
    lists: boardListsView,
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
  const existing = await db
    .select({ order: cards.order })
    .from(cards)
    .where(eq(cards.listId, listId))
    .orderBy(desc(cards.order))
    .limit(1);

  const nextOrder = existing.length > 0 ? existing[0].order + 1 : 0;

  if (hasBoolFlag(args, "--dry-run")) {
    output({ dryRun: true, command: "create-card", wouldDo: { listId, name, description: description ?? null, dueDate: due ?? null, order: nextOrder } });
    return;
  }

  const id = randomUUID();

  const [created] = await db.insert(cards).values({
    id,
    listId,
    name,
    description: description ?? null,
    order: nextOrder,
    dueDate: due ? new Date(due) : null,
    done: false,
    starred: false,
    cardType: "task",
    updatedAt: new Date(),
    createdAt: new Date(),
  }).returning();

  await logAction(db, session, { action: "CREATE", entity: "card", entityId: id, entityName: name, boardId });

  output({
    command: "create-card",
    card: created,
  });
}

async function cmdUpdateCard(db, session, args) {
  const id = getArg(args, "--id");
  if (!id) {
    output({ error: "Required: --id <card-id>" });
    process.exit(1);
  }

  const updates = Object.create(null);
  const name = getArg(args, "--name");
  const description = getArg(args, "--description");
  const due = getArg(args, "--due");

  if (name) updates.name = name;
  if (description !== null) updates.description = description;
  if (due) updates.dueDate = new Date(due);
  if (args.includes("--done")) updates.done = true;
  if (args.includes("--undone")) updates.done = false;
  if (args.includes("--starred")) updates.starred = true;
  if (args.includes("--unstarred")) updates.starred = false;
  const progress = getArg(args, "--progress");
  if (progress !== null) updates.progress = parseIntegerArg(progress, "--progress");

  updates.updatedAt = new Date();

  if (hasBoolFlag(args, "--dry-run")) {
    output({ dryRun: true, command: "update-card", wouldDo: { id, updates } });
    return;
  }
  const [cardBefore] = await db.select().from(cards).where(eq(cards.id, id)).limit(1);

  const expectUpdatedAt = getArg(args, "--expect-updated-at");
  const whereClause = expectUpdatedAt
    ? and(eq(cards.id, id), eq(cards.updatedAt, new Date(expectUpdatedAt)))
    : eq(cards.id, id);

  const [updated] = await db
    .update(cards)
    .set(updates)
    .where(whereClause)
    .returning();

  if (!updated && expectUpdatedAt) {
    output({
      error: "conflict",
      message: "Card was modified since last read",
      cardId: id,
      expectedUpdatedAt: expectUpdatedAt,
      hint: "Re-read the card and retry",
    });
    process.exit(1);
  }

  if (!updated) {
    output({ error: `Card not found: ${id}` });
    process.exit(1);
  }
  if (cardBefore) {
    const boardId = await getBoardIdForCard(db, updated);
    if (name && name !== cardBefore.name) {
      await logAction(db, session, { action: "RENAME", entity: "card", entityId: id, entityName: updated.name, boardId, changes: { field: "name", from: cardBefore.name, to: name } });
    }
    if (description !== null && description !== undefined) {
      await logAction(db, session, { action: "UPDATE_DESCRIPTION", entity: "card", entityId: id, entityName: updated.name, boardId, changes: { field: "description", from: cardBefore.description, to: description } });
    }
    if (updates.done === true) {
      await logAction(db, session, { action: "MARK_DONE", entity: "card", entityId: id, entityName: updated.name, boardId });
    }
    if (updates.done === false) {
      await logAction(db, session, { action: "MARK_UNDONE", entity: "card", entityId: id, entityName: updated.name, boardId });
    }
    if (updates.starred === true) {
      await logAction(db, session, { action: "STAR", entity: "card", entityId: id, entityName: updated.name, boardId });
    }
    if (updates.starred === false) {
      await logAction(db, session, { action: "UNSTAR", entity: "card", entityId: id, entityName: updated.name, boardId });
    }
    if (due) {
      await logAction(db, session, { action: "SET_DUE_DATE", entity: "card", entityId: id, entityName: updated.name, boardId, changes: { field: "dueDate", from: cardBefore.dueDate, to: due } });
    }
    if (progress !== null) {
      await logAction(db, session, { action: "SET_PROGRESS", entity: "card", entityId: id, entityName: updated.name, boardId, changes: { field: "progress", from: cardBefore.progress, to: parseIntegerArg(progress, "--progress") } });
    }
  }

  output({
    command: "update-card",
    card: updated,
  });
}

async function cmdDone(db, session, args) {
  const id = getArg(args, "--id");
  if (!id) {
    output({ error: "Required: --id <card-id>" });
    process.exit(1);
  }

  if (hasBoolFlag(args, "--dry-run")) {
    output({ dryRun: true, command: "done", wouldDo: { id, set: { done: true } } });
    return;
  }

  const expectUpdatedAt = getArg(args, "--expect-updated-at");
  const whereClause = expectUpdatedAt
    ? and(eq(cards.id, id), eq(cards.updatedAt, new Date(expectUpdatedAt)))
    : eq(cards.id, id);

  const [updated] = await db
    .update(cards)
    .set({ done: true, updatedAt: new Date() })
    .where(whereClause)
    .returning();

  if (!updated && expectUpdatedAt) {
    output({
      error: "conflict",
      message: "Card was modified since last read",
      cardId: id,
      expectedUpdatedAt: expectUpdatedAt,
      hint: "Re-read the card and retry",
    });
    process.exit(1);
  }

  if (!updated) {
    output({ error: `Card not found: ${id}` });
    process.exit(1);
  }

  await logAction(db, session, { action: "MARK_DONE", entity: "card", entityId: id, entityName: updated.name, boardId: await getBoardIdForCard(db, updated) });

  output({
    command: "done",
    card: updated,
  });
}

async function cmdMoveCard(db, session, args) {
  const id = getArg(args, "--id");
  const listId = getArg(args, "--list");
  if (!id || !listId) {
    output({ error: "Required: --id <card-id> --list <target-list-id>" });
    process.exit(1);
  }
  const existing = await db
    .select({ order: cards.order })
    .from(cards)
    .where(eq(cards.listId, listId))
    .orderBy(desc(cards.order))
    .limit(1);

  const nextOrder = existing.length > 0 ? existing[0].order + 1 : 0;

  if (hasBoolFlag(args, "--dry-run")) {
    output({ dryRun: true, command: "move-card", wouldDo: { id, listId, order: nextOrder } });
    return;
  }
  const [cardBefore] = await db.select().from(cards).where(eq(cards.id, id)).limit(1);

  const expectUpdatedAt = getArg(args, "--expect-updated-at");
  const whereClause = expectUpdatedAt
    ? and(eq(cards.id, id), eq(cards.updatedAt, new Date(expectUpdatedAt)))
    : eq(cards.id, id);

  const [updated] = await db
    .update(cards)
    .set({ listId, order: nextOrder, updatedAt: new Date() })
    .where(whereClause)
    .returning();

  if (!updated && expectUpdatedAt) {
    output({
      error: "conflict",
      message: "Card was modified since last read",
      cardId: id,
      expectedUpdatedAt: expectUpdatedAt,
      hint: "Re-read the card and retry",
    });
    process.exit(1);
  }

  if (!updated) {
    output({ error: `Card not found: ${id}` });
    process.exit(1);
  }
  const fromListId = cardBefore?.listId;
  const [fromList] = fromListId ? await db.select({ name: lists.name }).from(lists).where(eq(lists.id, fromListId)).limit(1) : [null];
  const [toList] = await db.select({ name: lists.name }).from(lists).where(eq(lists.id, listId)).limit(1);
  const boardId = await getBoardIdForCard(db, updated);
  await logAction(db, session, {
    action: "MOVE", entity: "card", entityId: id, entityName: updated.name, boardId,
    changes: { fromListId, fromListName: fromList?.name, toListId: listId, toListName: toList?.name },
  });

  output({
    command: "move-card",
    card: updated,
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

  /** @type {ListDefinition[]} */
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

  if (hasBoolFlag(args, "--dry-run")) {
    output({ dryRun: true, command: "create-board", wouldDo: { name, lists: listDefs } });
    return;
  }

  const boardId = randomUUID();
  const [board] = await db.insert(boards).values({
    id: boardId,
    name,
    orgId: session.orgId,
  }).returning();

  const listValues = listDefs.map((l) => ({
    id: randomUUID(),
    boardId,
    name: l.name,
    order: l.order,
    listType: l.listType,
  }));
  const createdLists = await db.insert(lists).values(listValues).returning();

  await logAction(db, session, { action: "CREATE", entity: "board", entityId: boardId, entityName: name, boardId });

  /** @type {BoardListSummary[]} */
  const createdListSummaries = createdLists.map((l) => ({
    id: l.id,
    name: l.name,
    type: l.listType,
  }));

  output({
    command: "create-board",
    board: { id: board.id, name: board.name },
    lists: createdListSummaries,
  });
}

async function cmdCreateList(db, args) {
  const boardId = getArg(args, "--board");
  const name = getArg(args, "--name");
  if (!boardId || !name) {
    output({ error: "Required: --board <id> --name \"List Name\"" });
    process.exit(1);
  }
  const existing = await db
    .select({ order: lists.order })
    .from(lists)
    .where(eq(lists.boardId, boardId))
    .orderBy(desc(lists.order))
    .limit(1);

  const nextOrder = existing.length > 0 ? existing[0].order + 1 : 0;

  if (hasBoolFlag(args, "--dry-run")) {
    output({ dryRun: true, command: "create-list", wouldDo: { boardId, name, order: nextOrder } });
    return;
  }

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

  const boardFilterIds = getAllArgs(args, "--board");

  let boardIds;
  if (boardFilterIds.length > 0) {
    for (const id of boardFilterIds) {
      const [board] = await db.select({ id: boards.id }).from(boards)
        .where(and(eq(boards.id, id), eq(boards.orgId, session.orgId))).limit(1);
      if (!board) {
        output({ error: `Board not found: ${id}` });
        process.exit(1);
      }
    }
    boardIds = boardFilterIds;
  } else {
    const orgBoards = await db
      .select({ id: boards.id })
      .from(boards)
      .where(eq(boards.orgId, session.orgId));
    boardIds = orgBoards.map((b) => b.id);
  }
  if (boardIds.length === 0) {
    output({ command: "search", query, results: [] });
    return;
  }
  const orgLists = await db
    .select({ id: lists.id, boardId: lists.boardId, name: lists.name })
    .from(lists)
    .where(inArray(lists.boardId, boardIds));

  const listIds = orgLists.map((l) => l.id);
  if (listIds.length === 0) {
    output({ command: "search", query, results: [] });
    return;
  }
  const escaped = query.replace(/\\/g, '\\\\').replace(/%/g, '\\%').replace(/_/g, '\\_');
  const results = await db
    .select()
    .from(cards)
    .where(
      and(
        inArray(cards.listId, listIds),
        or(ilike(cards.name, `%${escaped}%`), ilike(cards.description, `%${escaped}%`)),
      ),
    )
    .orderBy(desc(cards.updatedAt))
    .limit(50);
  const listMap = Object.create(null);
  for (const l of orgLists) listMap[l.id] = l;

  const boardMap = Object.create(null);
  const boardResults = await db.select().from(boards).where(inArray(boards.id, boardIds));
  for (const b of boardResults) boardMap[b.id] = b;

  /** @type {BoardSearchResult[]} */
  const searchResults = results.map((c) => {
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
  });

  output({
    command: "search",
    query,
    count: results.length,
    results: searchResults,
  });
}

async function cmdArchiveCard(db, session, args) {
  const id = getArg(args, "--id");
  if (!id) {
    output({ error: "Required: --id <card-id>" });
    process.exit(1);
  }
  const [card] = await db.select().from(cards).where(eq(cards.id, id)).limit(1);
  if (!card) {
    output({ error: `Card not found: ${id}` });
    process.exit(1);
  }

  const [list] = await db.select().from(lists).where(eq(lists.id, card.listId)).limit(1);
  if (!list) {
    output({ error: `List not found for card: ${id}` });
    process.exit(1);
  }
  const [board] = await db.select().from(boards).where(eq(boards.id, list.boardId)).limit(1);
  if (!board) {
    output({ error: `Board not found for list: ${list.boardId}` });
    process.exit(1);
  }

  if (hasBoolFlag(args, "--dry-run")) {
    output({ dryRun: true, command: "archive-card", wouldDo: { cardId: id, archiveListExists: !!board.archiveListId } });
    return;
  }

  let archiveListId = board.archiveListId;
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
  const maxCardOrder = await db
    .select({ order: cards.order })
    .from(cards)
    .where(eq(cards.listId, archiveListId))
    .orderBy(desc(cards.order))
    .limit(1);
  const nextOrder = maxCardOrder.length > 0 ? maxCardOrder[0].order + 1 : 0;

  const expectUpdatedAt = getArg(args, "--expect-updated-at");
  const whereClause = expectUpdatedAt
    ? and(eq(cards.id, id), eq(cards.updatedAt, new Date(expectUpdatedAt)))
    : eq(cards.id, id);

  const [archived] = await db
    .update(cards)
    .set({ listId: archiveListId, order: nextOrder, updatedAt: new Date() })
    .where(whereClause)
    .returning();

  if (!archived && expectUpdatedAt) {
    output({
      error: "conflict",
      message: "Card was modified since last read",
      cardId: id,
      expectedUpdatedAt: expectUpdatedAt,
      hint: "Re-read the card and retry",
    });
    process.exit(1);
  }
  const fromListName = list.name;
  const [archiveListRow] = await db.select({ name: lists.name }).from(lists).where(eq(lists.id, archiveListId)).limit(1);
  await logAction(db, session, {
    action: "ARCHIVE", entity: "card", entityId: id, entityName: card.name, boardId: board.id,
    changes: { fromListId: card.listId, fromListName, toListId: archiveListId, toListName: archiveListRow?.name ?? "Archive" },
  });

  output({
    command: "archive-card",
    card: { ...archived, archivedTo: archiveListId },
  });
}

async function cmdDeleteBoard(db, session, args) {
  const id = getArg(args, "--id");
  if (!id || !args.includes("--confirm")) {
    output({ error: "Required: --id <board-id> --confirm" });
    process.exit(1);
  }
  const boardLists = await db
    .select({ id: lists.id })
    .from(lists)
    .where(eq(lists.boardId, id));
  const listIds = boardLists.map((l) => l.id);

  if (hasBoolFlag(args, "--dry-run")) {
    output({ dryRun: true, command: "delete-board", wouldDo: { boardId: id, listsToDelete: boardLists.length, cardsToDelete: "all cards in those lists" } });
    return;
  }
  const [boardForAudit] = await db.select().from(boards).where(eq(boards.id, id)).limit(1);
  if (boardForAudit) {
    await logAction(db, session, { action: "DELETE", entity: "board", entityId: id, entityName: boardForAudit.name, boardId: id });
  }
  let deletedCards = 0;
  if (listIds.length > 0) {
    const result = await db.delete(cards).where(inArray(cards.listId, listIds));
    deletedCards = result.rowCount || 0;
  }
  await db.delete(lists).where(eq(lists.boardId, id));
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

async function cmdActivity(db, args) {
  const cardId = getArg(args, "--card");
  const boardIdArg = getArg(args, "--board");
  if (!cardId && !boardIdArg) {
    output({ error: "Required: --card <id> or --board <id>" });
    process.exit(1);
  }
  const limit = parseIntegerArg(getArg(args, "--limit") || "10", "--limit");
  const entityId = cardId || boardIdArg;
  const where = cardId
    ? eq(boardActions.boardComponentId, cardId)
    : eq(boardActions.boardId, boardIdArg);
  const actions = await db.select().from(boardActions)
    .where(where).orderBy(desc(boardActions.createdAt)).limit(limit);
  /** @type {BoardActionActivityEntry[]} */
  const activity = actions.map((a) => ({
    action: a.action,
    actorType: a.actorType,
    userId: a.userId,
    changes: a.changes,
    createdAt: a.createdAt,
  }));
  output({
    command: "activity",
    entityId,
    actions: activity,
  });
}

function getArg(args, flag) {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return null;
  return args[idx + 1];
}

function getAllArgs(args, flag) {
  const values = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === flag && i + 1 < args.length) {
      values.push(args[++i]);
    }
  }
  return values;
}

function hasBoolFlag(args, flag) {
  return args.includes(flag);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "--help") {
    output({
      deprecated: true,
      message: "Use `poketo kanban` for the default workflow. This script is kept only for fallback/admin direct-DB operations.",
      commands: [
        "boards                                  — List all boards",
        "board <id>                              — View board with lists and cards",
        "create-card --board <id> --list <id> --name \"...\" [--description \"...\"] [--due \"YYYY-MM-DD\"] [--dry-run]",
        "update-card --id <id> [--name] [--done] [--undone] [--starred] [--due] [--description] [--dry-run]",
        "done --id <id> [--dry-run]              — Mark card as done",
        "move-card --id <id> --list <id> [--dry-run] — Move card to another list",
        "create-board --name \"...\" [--template standard] [--lists \"...\"] [--dry-run] — Create board",
        "create-list --board <id> --name \"...\" [--dry-run] — Add list to board",
        "search --query \"...\" [--board <id>]     — Search cards across boards (or scoped to --board)",
        "archive-card --id <id> [--dry-run]      — Archive a card",
        "activity --card <id> [--limit <n>]      — Show recent activity for a card",
        "activity --board <id> [--limit <n>]     — Show recent activity for a board",
        "delete-board --id <id> --confirm [--dry-run] — Delete board and all its data",
      ],
    });
    return;
  }
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
      await cmdUpdateCard(db, session, rest);
      break;
    case "done":
      await cmdDone(db, session, rest);
      break;
    case "move-card":
      await cmdMoveCard(db, session, rest);
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
      await cmdArchiveCard(db, session, rest);
      break;
    case "delete-board":
      await cmdDeleteBoard(db, session, rest);
      break;
    case "activity":
      await cmdActivity(db, rest);
      break;
    default:
      output({ error: `Unknown command: ${command}. Run with --help for legacy fallback usage.` });
      process.exit(1);
  }
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isDirectRun) {
  main().catch((error) => {
    output({ error: getErrorMessage(error) });
    process.exit(1);
  });
}
