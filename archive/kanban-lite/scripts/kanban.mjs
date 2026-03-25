#!/usr/bin/env node

import Database from "better-sqlite3";
import { randomUUID } from "node:crypto";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

// ─── Config ──────────────────────────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "..", "kanban.db");

// ─── DB ──────────────────────────────────────────────────────────────────────

function getDb() {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS board (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS list (
      id TEXT PRIMARY KEY,
      board_id TEXT NOT NULL REFERENCES board(id),
      name TEXT NOT NULL,
      "order" INTEGER NOT NULL,
      list_type TEXT NOT NULL DEFAULT 'normal' CHECK(list_type IN ('normal','done','punt')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS card (
      id TEXT PRIMARY KEY,
      list_id TEXT NOT NULL REFERENCES list(id),
      name TEXT NOT NULL,
      description TEXT,
      "order" INTEGER NOT NULL,
      due_date TEXT,
      done INTEGER NOT NULL DEFAULT 0,
      starred INTEGER NOT NULL DEFAULT 0,
      progress INTEGER,
      card_type TEXT NOT NULL DEFAULT 'task' CHECK(card_type IN ('task','action')),
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Flush WAL on exit so only the main .db file needs to be committed
  process.on("exit", () => {
    try {
      db.pragma("wal_checkpoint(TRUNCATE)");
      db.close();
    } catch {}
  });

  return db;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function output(data) {
  console.log(JSON.stringify(data, null, 2));
}

function getArg(args, flag) {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return null;
  return args[idx + 1];
}

// ─── Commands ────────────────────────────────────────────────────────────────

function cmdBoards(db) {
  const results = db.prepare("SELECT id, name, created_at FROM board ORDER BY created_at DESC").all();
  output({
    command: "boards",
    count: results.length,
    boards: results.map((b) => ({ id: b.id, name: b.name, createdAt: b.created_at })),
  });
}

function cmdBoard(db, boardId) {
  const board = db.prepare("SELECT * FROM board WHERE id = ?").get(boardId);
  if (!board) {
    output({ error: `Board not found: ${boardId}` });
    process.exit(1);
  }

  const boardLists = db.prepare('SELECT * FROM list WHERE board_id = ? ORDER BY "order" ASC').all(boardId);

  // Single JOIN to get all cards for this board's lists
  const allCards = boardLists.length > 0
    ? db.prepare(`
        SELECT c.* FROM card c
        JOIN list l ON c.list_id = l.id
        WHERE l.board_id = ?
        ORDER BY c."order" ASC
      `).all(boardId)
    : [];

  // Group cards by list
  const cardsByList = {};
  for (const card of allCards) {
    if (!cardsByList[card.list_id]) cardsByList[card.list_id] = [];
    cardsByList[card.list_id].push({
      id: card.id,
      name: card.name,
      done: !!card.done,
      starred: !!card.starred,
      dueDate: card.due_date,
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
      type: l.list_type,
      order: l.order,
      cards: cardsByList[l.id] || [],
    })),
  });
}

function cmdCreateCard(db, args) {
  const boardId = getArg(args, "--board");
  const listId = getArg(args, "--list");
  const name = getArg(args, "--name");
  const description = getArg(args, "--description");
  const due = getArg(args, "--due");

  if (!boardId || !listId || !name) {
    output({ error: 'Required: --board <id> --list <id> --name "title"' });
    process.exit(1);
  }

  const existing = db.prepare('SELECT "order" FROM card WHERE list_id = ? ORDER BY "order" DESC LIMIT 1').get(listId);
  const nextOrder = existing ? existing.order + 1 : 0;
  const id = randomUUID();

  db.prepare(`
    INSERT INTO card (id, list_id, name, description, "order", due_date, done, starred, card_type)
    VALUES (?, ?, ?, ?, ?, ?, 0, 0, 'task')
  `).run(id, listId, name, description || null, nextOrder, due || null);

  const created = db.prepare("SELECT * FROM card WHERE id = ?").get(id);
  output({ command: "create-card", card: created });
}

function cmdUpdateCard(db, args) {
  const id = getArg(args, "--id");
  if (!id) {
    output({ error: "Required: --id <card-id>" });
    process.exit(1);
  }

  const sets = [];
  const values = [];

  const name = getArg(args, "--name");
  const description = getArg(args, "--description");
  const due = getArg(args, "--due");

  if (name) { sets.push("name = ?"); values.push(name); }
  if (description) { sets.push("description = ?"); values.push(description); }
  if (due) { sets.push("due_date = ?"); values.push(due); }
  if (args.includes("--done")) { sets.push("done = 1"); }
  if (args.includes("--undone")) { sets.push("done = 0"); }
  if (args.includes("--starred")) { sets.push("starred = 1"); }
  if (args.includes("--unstarred")) { sets.push("starred = 0"); }

  sets.push("updated_at = datetime('now')");
  values.push(id);

  const result = db.prepare(`UPDATE card SET ${sets.join(", ")} WHERE id = ?`).run(...values);
  if (result.changes === 0) {
    output({ error: `Card not found: ${id}` });
    process.exit(1);
  }

  const updated = db.prepare("SELECT * FROM card WHERE id = ?").get(id);
  output({ command: "update-card", card: updated });
}

function cmdDone(db, args) {
  const id = getArg(args, "--id");
  if (!id) {
    output({ error: "Required: --id <card-id>" });
    process.exit(1);
  }

  const result = db.prepare("UPDATE card SET done = 1, updated_at = datetime('now') WHERE id = ?").run(id);
  if (result.changes === 0) {
    output({ error: `Card not found: ${id}` });
    process.exit(1);
  }

  const updated = db.prepare("SELECT id, name FROM card WHERE id = ?").get(id);
  output({ command: "done", card: { id: updated.id, name: updated.name, done: true } });
}

function cmdMoveCard(db, args) {
  const id = getArg(args, "--id");
  const listId = getArg(args, "--list");
  if (!id || !listId) {
    output({ error: "Required: --id <card-id> --list <target-list-id>" });
    process.exit(1);
  }

  const existing = db.prepare('SELECT "order" FROM card WHERE list_id = ? ORDER BY "order" DESC LIMIT 1').get(listId);
  const nextOrder = existing ? existing.order + 1 : 0;

  const result = db.prepare('UPDATE card SET list_id = ?, "order" = ?, updated_at = datetime(\'now\') WHERE id = ?').run(listId, nextOrder, id);
  if (result.changes === 0) {
    output({ error: `Card not found: ${id}` });
    process.exit(1);
  }

  const updated = db.prepare("SELECT id, name, list_id FROM card WHERE id = ?").get(id);
  output({ command: "move-card", card: { id: updated.id, name: updated.name, listId: updated.list_id } });
}

function cmdCreateBoard(db, args) {
  const name = getArg(args, "--name");
  if (!name) {
    output({ error: 'Required: --name "Board Name"' });
    process.exit(1);
  }

  const customLists = getArg(args, "--lists");
  const boardId = randomUUID();

  const insertBoard = db.prepare("INSERT INTO board (id, name) VALUES (?, ?)");
  const insertList = db.prepare('INSERT INTO list (id, board_id, name, "order", list_type) VALUES (?, ?, ?, ?, ?)');

  const listDefs = customLists
    ? customLists.split(",").map((n, i) => ({ name: n.trim(), order: i, listType: "normal" }))
    : [
        { name: "Backlog", order: 0, listType: "normal" },
        { name: "In Progress", order: 1, listType: "normal" },
        { name: "Done", order: 2, listType: "done" },
      ];

  const createdLists = [];
  const transaction = db.transaction(() => {
    insertBoard.run(boardId, name);
    for (const l of listDefs) {
      const listId = randomUUID();
      insertList.run(listId, boardId, l.name, l.order, l.listType);
      createdLists.push({ id: listId, name: l.name, type: l.listType });
    }
  });
  transaction();

  output({
    command: "create-board",
    board: { id: boardId, name },
    lists: createdLists,
  });
}

function cmdCreateList(db, args) {
  const boardId = getArg(args, "--board");
  const name = getArg(args, "--name");
  if (!boardId || !name) {
    output({ error: 'Required: --board <id> --name "List Name"' });
    process.exit(1);
  }

  const existing = db.prepare('SELECT "order" FROM list WHERE board_id = ? ORDER BY "order" DESC LIMIT 1').get(boardId);
  const nextOrder = existing ? existing.order + 1 : 0;
  const id = randomUUID();

  db.prepare('INSERT INTO list (id, board_id, name, "order", list_type) VALUES (?, ?, ?, ?, ?)').run(id, boardId, name, nextOrder, "normal");

  const created = db.prepare("SELECT * FROM list WHERE id = ?").get(id);
  output({ command: "create-list", list: created });
}

function cmdSearch(db, args) {
  const query = getArg(args, "--query");
  if (!query) {
    output({ error: 'Required: --query "search term"' });
    process.exit(1);
  }

  const results = db.prepare(`
    SELECT c.*, l.name AS list_name, l.board_id, b.name AS board_name
    FROM card c
    JOIN list l ON c.list_id = l.id
    JOIN board b ON l.board_id = b.id
    WHERE c.name LIKE ? COLLATE NOCASE
    ORDER BY c.updated_at DESC
    LIMIT 50
  `).all(`%${query}%`);

  output({
    command: "search",
    query,
    count: results.length,
    results: results.map((c) => ({
      id: c.id,
      name: c.name,
      done: !!c.done,
      starred: !!c.starred,
      dueDate: c.due_date,
      listName: c.list_name,
      boardName: c.board_name,
      boardId: c.board_id,
    })),
  });
}

function cmdSync() {
  const repoRoot = execSync("git rev-parse --show-toplevel", { encoding: "utf-8" }).trim();
  const dbRelPath = relative(repoRoot, DB_PATH);

  // Pull latest
  try {
    execSync("git pull --rebase", { cwd: repoRoot, stdio: "pipe", encoding: "utf-8" });
  } catch (e) {
    output({ command: "sync", error: "Pull failed: " + e.message, hint: "Resolve conflicts manually" });
    process.exit(1);
  }

  // Check if db has changes
  const status = execSync(`git status --porcelain -- "${dbRelPath}"`, { cwd: repoRoot, encoding: "utf-8" }).trim();
  if (!status) {
    output({ command: "sync", status: "up-to-date", message: "No local changes to push" });
    return;
  }

  // Commit and push
  execSync(`git add "${dbRelPath}"`, { cwd: repoRoot });
  execSync('git commit -m "kanban: sync board state"', { cwd: repoRoot });
  execSync("git push", { cwd: repoRoot });
  output({ command: "sync", status: "pushed", message: "Board state committed and pushed" });
}

// ─── Main ────────────────────────────────────────────────────────────────────

function main() {
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
        "create-board --name \"...\" [--lists \"A,B,C\"] — Create board with lists",
        "create-list --board <id> --name \"...\"   — Add list to board",
        "search --query \"...\"                    — Search cards across boards",
        "sync                                    — Pull latest, commit & push db changes",
      ],
    });
    return;
  }

  // sync doesn't need db
  if (command === "sync") {
    cmdSync();
    return;
  }

  const db = getDb();
  const rest = args.slice(1);

  switch (command) {
    case "boards":
      cmdBoards(db);
      break;
    case "board":
      if (!rest[0]) { output({ error: "Usage: board <board-id>" }); process.exit(1); }
      cmdBoard(db, rest[0]);
      break;
    case "create-card":
      cmdCreateCard(db, rest);
      break;
    case "update-card":
      cmdUpdateCard(db, rest);
      break;
    case "done":
      cmdDone(db, rest);
      break;
    case "move-card":
      cmdMoveCard(db, rest);
      break;
    case "create-board":
      cmdCreateBoard(db, rest);
      break;
    case "create-list":
      cmdCreateList(db, rest);
      break;
    case "search":
      cmdSearch(db, rest);
      break;
    default:
      output({ error: `Unknown command: ${command}. Run with --help for usage.` });
      process.exit(1);
  }
}

main();
