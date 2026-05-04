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
        it(`${rel} references /${ref} which should exist in pack or globally`, () => {
          const globalPackSkills = globSync("**/SKILL.md", { cwd: PACKS_DIR });
          const allPackSkillNames = new Set(
            globalPackSkills.map((s) => {
              const parts = s.split("/");
              return parts[parts.length - 2];
            }),
          );

          // Also check user-local skills (these are global skills installed
          // outside of packs, referenced via slash commands)
          const GLOBAL_DIR = resolve(PACKS_DIR, "../global");
          const globalCoreSkills = globSync("**/SKILL.md", { cwd: GLOBAL_DIR });
          const globalCoreNames = new Set(
            globalCoreSkills.map((s) => {
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
            "brainstorm",
            "roadmap",
          ]);

          const existsInPack = skillNames.has(ref);
          const existsGlobally = allPackSkillNames.has(ref);
          const existsInCore = globalCoreNames.has(ref);
          const isKnownExternal = knownExternalSkills.has(ref);

          expect(
            existsInPack || existsGlobally || existsInCore || isKnownExternal,
            `/${ref} referenced in ${rel} not found in pack "${packName}", globally, or known externals`,
          ).toBe(true);
        });
      }
    }
  }
});
