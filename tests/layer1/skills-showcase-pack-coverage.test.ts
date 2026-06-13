import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { globSync } from "glob";
import { describe, expect, it } from "vitest";

const repoRoot = resolve(import.meta.dirname, "../..");

interface ShowcaseSkill {
  name: string;
  pack: string | null;
  path: string;
}

interface ShowcasePack {
  name: string;
  skillCount: number;
  path: string | null;
}

interface ShowcaseData {
  skills: ShowcaseSkill[];
  packs: ShowcasePack[];
}

function loadShowcaseData(): ShowcaseData {
  const content = readFileSync(resolve(repoRoot, "docs/skills-showcase/assets/skills-data.js"), "utf8");
  const json = content.match(/window\.SKILLS_SHOWCASE_DATA = ([\s\S]*);\n$/)?.[1];
  if (!json) throw new Error("skills-data.js did not contain generated showcase data");
  return JSON.parse(json);
}

describe("skills showcase pack coverage", () => {
  it("represents every active PACK.md in generated pack data", () => {
    const data = loadShowcaseData();
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

  it("includes active nested framework skills in generated skills and pack counts", () => {
    const data = loadShowcaseData();
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
