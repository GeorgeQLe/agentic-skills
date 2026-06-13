import { describe, it, expect } from "vitest";
import { globSync } from "glob";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import matter from "gray-matter";

const PACKS_DIR = resolve(import.meta.dirname, "../../packs");

function getPackSkillNames(packDir: string): Set<string> {
  const skills = globSync("**/SKILL.md", { cwd: packDir });
  return new Set(
    skills.map((s) => {
      const parts = s.split("/");
      return parts[parts.length - 2];
    }),
  );
}

function extractSkillReferences(content: string): string[] {
  const refs: string[] = [];
  const slashRefs = content.match(/`\/([a-z][a-z0-9-]*)`/g);
  if (slashRefs) {
    refs.push(...slashRefs.map((r) => r.replace(/`/g, "").replace("/", "")));
  }
  return refs;
}

const packDirs = globSync("*/", { cwd: PACKS_DIR }).map((d) =>
  resolve(PACKS_DIR, d),
);

const allPackSkills = globSync("**/SKILL.md", { cwd: PACKS_DIR });
const allPackSkillNames = new Set(
  allPackSkills.map((s) => {
    const parts = s.split("/");
    return parts[parts.length - 2];
  }),
);

// Also check user-local skills (these are base skills installed
// outside of packs, referenced via slash commands)
const BASE_DIR = resolve(PACKS_DIR, "../base");
const baseCoreSkills = globSync("**/SKILL.md", { cwd: BASE_DIR });
const baseCoreNames = new Set(
  baseCoreSkills.map((s) => {
    const parts = s.split("/");
    return parts[parts.length - 2];
  }),
);

// User-local skills (~/.claude/skills) can't be checked at test
// time, so we maintain an allowlist of known external skill names
const knownExternalSkills = new Set([
  "regression-check",
  "ship",
  "run",
  "spec-interview",
  "feature-interview",
  "brainstorm",
  "roadmap",
]);

describe("Next-Skill routing references", () => {
  for (const packDir of packDirs) {
    const packName = packDir.split("/").pop()!;
    const skillNames = getPackSkillNames(packDir);
    const skillFiles = globSync("**/SKILL.md", { cwd: packDir }).map((rel) =>
      resolve(packDir, rel),
    );

    for (const filePath of skillFiles) {
      const rel = filePath.replace(PACKS_DIR + "/", "");
      const raw = readFileSync(filePath, "utf-8");
      const { content } = matter(raw);

      const routingSection = content.match(
        /## Next-Skill Routing[\s\S]*?(?=\n## |\n$|$)/,
      );
      if (!routingSection) continue;

      const refs = extractSkillReferences(routingSection[0]);
      if (refs.length === 0) continue;

      for (const ref of refs) {
        it(`${rel} references /${ref} which should exist in a pack or base`, () => {
          const existsInPack = skillNames.has(ref);
          const existsInAnyPack = allPackSkillNames.has(ref);
          const existsInCore = baseCoreNames.has(ref);
          const isKnownExternal = knownExternalSkills.has(ref);

          expect(
            existsInPack || existsInAnyPack || existsInCore || isKnownExternal,
            `/${ref} referenced in ${rel} not found in pack "${packName}", another pack, base, or known externals`,
          ).toBe(true);
        });
      }
    }
  }
});
