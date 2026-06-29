import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { globSync } from "glob";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "../..");

interface CatalogSkill {
  name: string;
  pack: string | null;
  path: string;
}

interface CatalogPack {
  name: string;
  skillCount: number;
  path: string | null;
}

interface SkillsCatalog {
  schema_version: string;
  skills: CatalogSkill[];
  packs: CatalogPack[];
}

function loadCatalog(): SkillsCatalog {
  return JSON.parse(readFileSync(resolve(repoRoot, "exports/skills-catalog/v1/catalog.json"), "utf8"));
}

describe("skills catalog export pack coverage", () => {
  it("represents every active PACK.md in exported pack data", () => {
    const data = loadCatalog();
    expect(data.schema_version).toBe("skills-catalog.v1");
    const generatedPackPaths = new Set(data.packs.map((pack) => pack.path));
    const activePackPaths = globSync("packs/*/PACK.md", { cwd: repoRoot }).sort();

    activePackPaths.forEach((packPath) => {
      expect(generatedPackPaths).toContain(packPath);
    });

    expect(data.packs.map((pack) => pack.name)).toContain("business-app");
    expect(data.packs.map((pack) => pack.name)).toContain("creator-media");
    expect(data.packs.map((pack) => pack.name)).toContain("devtool");
    expect(data.packs.map((pack) => pack.name)).toContain("game");
  });

  it("includes active nested framework skills in exported skills and pack counts", () => {
    const data = loadCatalog();
    const activePackSkillPaths = globSync("packs/*/{claude,codex}/**/SKILL.md", {
      cwd: repoRoot,
      ignore: ["**/archive/**"],
    }).sort();
    const generatedSkillPaths = new Set(data.skills.map((skill) => skill.path));

    activePackSkillPaths.forEach((skillPath) => {
      expect(generatedSkillPaths).toContain(skillPath);
    });

    const businessDiscovery = data.packs.find((pack) => pack.name === "business-research");
    const businessDiscoverySkillCount = activePackSkillPaths.filter((skillPath) =>
      skillPath.startsWith("packs/business-research/"),
    ).length;

    expect(businessDiscovery?.skillCount).toBe(businessDiscoverySkillCount);
    expect(generatedSkillPaths).toContain(
      "packs/business-research/codex/competitive-analysis/frameworks/porter-five-forces/SKILL.md",
    );
  });
});
