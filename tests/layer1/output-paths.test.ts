import { describe, it, expect } from "vitest";
import { globSync } from "glob";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import matter from "gray-matter";

const PACKS_DIR = resolve(import.meta.dirname, "../../packs");

function extractOutputPaths(content: string): string[] {
  const outputSection = content.match(/## Output[\s\S]*?(?=\n## |\n$|$)/);
  if (!outputSection) return [];

  const paths: string[] = [];
  const backtickPaths = outputSection[0].match(/`([^`]*\/[^`]+)`/g);
  if (backtickPaths) {
    paths.push(...backtickPaths.map((p) => p.replace(/`/g, "")));
  }
  return paths;
}

const packDirs = globSync("*/", { cwd: PACKS_DIR }).map((d) => d.replace(/\/$/, ""));

describe("Output path conflicts", () => {
  for (const packName of packDirs) {
    const packDir = resolve(PACKS_DIR, packName);
    const skillFiles = globSync("**/SKILL.md", { cwd: packDir }).map((rel) =>
      resolve(packDir, rel),
    );

    // Group by tool (claude/codex) — claude and codex variants of the same
    // skill writing to the same path is expected, not a conflict.
    const toolPathMap = new Map<string, Map<string, string[]>>();

    for (const filePath of skillFiles) {
      const raw = readFileSync(filePath, "utf-8");
      const { content } = matter(raw);
      const skillRel = filePath.replace(PACKS_DIR + "/", "");
      const parts = skillRel.split("/");
      const tool = parts[1]; // claude or codex
      const outputs = extractOutputPaths(content);

      if (!toolPathMap.has(tool)) toolPathMap.set(tool, new Map());
      const pathMap = toolPathMap.get(tool)!;

      for (const out of outputs) {
        if (out.includes("[") && out.includes("]")) continue;
        if (out.includes("{") && out.includes("}")) continue;
        // Skip slash-command references misidentified as paths
        if (/^\/[a-z]/.test(out) && !out.includes(".")) continue;
        // Skip shared task management paths — multiple skills updating
        // these is expected behavior
        if (/^tasks\/(todo|manual-todo|recurring-todo)\.md$/.test(out)) continue;
        const existing = pathMap.get(out) || [];
        existing.push(skillRel);
        pathMap.set(out, existing);
      }
    }

    const conflicts: [string, string[]][] = [];
    for (const [, pathMap] of toolPathMap) {
      for (const [path, skills] of pathMap) {
        if (skills.length > 1) conflicts.push([path, skills]);
      }
    }

    if (conflicts.length > 0) {
      for (const [path, skills] of conflicts) {
        it(`pack "${packName}": no conflict on output path "${path}"`, () => {
          expect(
            skills.length,
            `Multiple skills write to "${path}": ${skills.join(", ")}`,
          ).toBe(1);
        });
      }
    } else {
      it(`pack "${packName}": no output path conflicts`, () => {
        expect(conflicts.length).toBe(0);
      });
    }
  }
});
