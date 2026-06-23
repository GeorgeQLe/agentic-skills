#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const taskPath = (...parts) => path.join(repoRoot, "tasks", ...parts);

const failures = [];
const warnings = [];
const info = [];

function readIfExists(file) {
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}

function lineNumberAt(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function h2Sections(text) {
  const matches = [...text.matchAll(/^## .+$/gm)];
  return matches.map((match, index) => {
    const start = match.index ?? 0;
    const end = index + 1 < matches.length ? matches[index + 1].index ?? text.length : text.length;
    return {
      heading: match[0].trim(),
      title: match[0].replace(/^##\s+/, "").trim(),
      line: lineNumberAt(text, start),
      body: text.slice(start, end),
    };
  });
}

function currentImplementationSections(text) {
  return h2Sections(text).filter((section) => section.title.startsWith("Current Implementation - "));
}

function activeTodoSections(text) {
  return h2Sections(text).filter(
    (section) => section.title.startsWith("Current Implementation - ") || /^Phase \d+: /.test(section.title),
  );
}

function uncheckedItems(text) {
  return [...text.matchAll(/^- \[ \] .+$/gm)].map((match) => ({
    line: lineNumberAt(text, match.index ?? 0),
    text: match[0],
    index: match.index ?? 0,
  }));
}

function sectionForIndex(sections, index) {
  return sections.find((section, sectionIndex) => {
    const start = section.line;
    const next = sections[sectionIndex + 1]?.line ?? Number.POSITIVE_INFINITY;
    const line = lineNumberAt(todoText, index);
    return line >= start && line < next;
  });
}

const todoFile = taskPath("todo.md");
const roadmapFile = taskPath("roadmap.md");
const manualFile = taskPath("manual-todo.md");
const recurringFile = taskPath("recurring-todo.md");
const recordFile = taskPath("record-todo.md");

const todoText = readIfExists(todoFile);
const roadmapText = readIfExists(roadmapFile);

if (todoText == null) {
  failures.push("tasks/todo.md is missing; current-task routing cannot be audited.");
} else {
  const todoSections = h2Sections(todoText);
  const todoCurrent = currentImplementationSections(todoText);
  const todoActive = activeTodoSections(todoText);
  const implementationHeadings = todoSections.filter((section) =>
    /^(Current|Previous) Implementation - /.test(section.title),
  );

  if (todoCurrent.length > 1) {
    failures.push(
      `tasks/todo.md has ${todoCurrent.length} Current Implementation sections; keep only one active task.`,
    );
  }

  if (todoActive.length > 1) {
    failures.push(
      `tasks/todo.md has ${todoActive.length} active task sections; keep only one Current Implementation or Phase section.`,
    );
  }

  const staleImplementationHeadings = implementationHeadings.filter(
    (section) => !section.title.startsWith("Current Implementation - "),
  );
  if (staleImplementationHeadings.length > 0) {
    failures.push(
      `tasks/todo.md contains historical implementation headings: ${staleImplementationHeadings
        .map((section) => `line ${section.line}`)
        .join(", ")}. Move completed implementation detail to tasks/history.md or tasks/reconciliation-report.md.`,
    );
  }

  for (const item of uncheckedItems(todoText)) {
    const section = sectionForIndex(todoSections, item.index);
    const inCurrentTask =
      section?.title.startsWith("Current Implementation - ") || /^Phase \d+: /.test(section?.title ?? "");
    if (!inCurrentTask) {
      failures.push(
        `tasks/todo.md line ${item.line} has an unchecked item outside the current active task: ${item.text}`,
      );
    }
  }

  if (todoCurrent.length === 0) {
    if (todoActive.length === 0) {
      info.push("tasks/todo.md has no active Current Implementation or Phase section.");
    } else {
      info.push(`tasks/todo.md active task: ${todoActive[0].title}`);
    }
  } else {
    info.push(`tasks/todo.md active task: ${todoCurrent[0].title.replace("Current Implementation - ", "")}`);
  }
}

if (roadmapText == null) {
  warnings.push("tasks/roadmap.md is missing; roadmap current-section parity was skipped.");
} else {
  const roadmapCurrent = currentImplementationSections(roadmapText);
  const todoCurrent = todoText == null ? [] : currentImplementationSections(todoText);

  if (roadmapCurrent.length > 1) {
    failures.push(
      `tasks/roadmap.md has ${roadmapCurrent.length} Current Implementation sections; historical entries must not use current-task headings.`,
    );
  }

  if (roadmapCurrent.length === 1) {
    const roadmapTitle = roadmapCurrent[0].title.replace("Current Implementation - ", "");
    const todoTitle = todoCurrent[0]?.title.replace("Current Implementation - ", "");
    if (roadmapTitle !== todoTitle) {
      failures.push(
        `tasks/roadmap.md Current Implementation (${roadmapTitle}) is not explicitly promoted in tasks/todo.md (${todoTitle ?? "none"}).`,
      );
    }
  }

  if (roadmapCurrent.length === 0 && todoText != null && currentImplementationSections(todoText).length > 0) {
    failures.push("tasks/todo.md has an active task, but tasks/roadmap.md has no matching Current Implementation.");
  }
}

for (const [label, file] of [
  ["manual", manualFile],
  ["recurring", recurringFile],
  ["record", recordFile],
]) {
  const text = readIfExists(file);
  if (text == null) continue;
  const count = uncheckedItems(text).length;
  if (count > 0) {
    info.push(`tasks/${path.basename(file)} has ${count} unchecked ${label} advisory item(s); not executable unless promoted into tasks/todo.md.`);
  }
}

console.log("Task Doc Audit");
console.log("==============");
console.log(`Failures: ${failures.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Info: ${info.length}`);

if (failures.length > 0) {
  console.log("\nFailures");
  for (const failure of failures) console.log(`  - ${failure}`);
}

if (warnings.length > 0) {
  console.log("\nWarnings");
  for (const warning of warnings) console.log(`  - ${warning}`);
}

if (info.length > 0) {
  console.log("\nInfo");
  for (const item of info) console.log(`  - ${item}`);
}

if (failures.length > 0) process.exit(1);
