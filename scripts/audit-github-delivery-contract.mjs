#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

const directPrimaryPatterns = [
  /(?:commit|push|ship|land)[^\n]{0,100}(?:directly\s+(?:to|on)|on|to)\s+(?:the\s+)?(?:repository\s+)?(?:primary branch|`?(?:main|master)`?)/i,
  /(?:git\s+push|push)[^\n]{0,60}(?:origin\s+)?(?:main|master)\b/i,
  /(?:switch|checkout)[^\n]{0,60}(?:main|master)[^\n]{0,80}(?:commit|push)/i,
  /(?:ensure|commits?|push)[^\n]{0,80}(?:land|to|on)\s+(?:the\s+)?primary branch/i,
  /direct-to-primary\s+development/i,
  /explicit exception to direct-to-primary work/i,
];

function collectSkills(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    const normalized = path.split(sep).join("/");
    if (entry.isDirectory()) {
      if (entry.name === "archive" || /packs\/release-ops\/(?:claude|codex)\/(?:release|deploy)$/.test(normalized)) continue;
      files.push(...collectSkills(path));
    } else if (entry.name === "SKILL.md") {
      files.push(relative(process.cwd(), path).split(sep).join("/"));
    }
  }
  return files;
}

const files = collectSkills("packs").sort();

const failures = [];
for (const file of files) {
  const content = readFileSync(file, "utf8");
  const lines = content.split("\n");
  lines.forEach((line, index) => {
    const explicitProhibition = /\b(?:do not|never|refuse)\b/i.test(line);
    if (!explicitProhibition && directPrimaryPatterns.some((pattern) => pattern.test(line))) {
      failures.push(`${file}:${index + 1}: ${line.trim()}`);
    }
  });
}

if (failures.length > 0) {
  console.error("GitHub delivery contract violations:\n" + failures.join("\n"));
  process.exit(1);
}

console.log(`GitHub delivery contract audit passed (${files.length} active skills; zero legacy direct-primary allowances).`);
