import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

const frameworkNames = [
  "jtbd-positioning",
  "strategic-canvas",
  "moore-positioning",
  "category-design",
  "obviously-awesome",
];

const agents = ["claude", "codex"] as const;

function repoPath(path: string) {
  return resolve(ROOT, path);
}

function read(path: string) {
  return readFileSync(repoPath(path), "utf8");
}

function shortcutSection(content: string) {
  const start = content.indexOf("### 5. State C via");
  const end = content.indexOf("### 6. Next Steps", start);
  expect(start, "shortcut section exists").toBeGreaterThanOrEqual(0);
  expect(end, "shortcut section boundary exists").toBeGreaterThan(start);
  return content.slice(start, end);
}

describe("positioning alignment contracts", () => {
  it("bundles sibling alignment-page conventions for positioning framework subskills", () => {
    for (const agent of agents) {
      for (const framework of frameworkNames) {
        const skillPath = `packs/business-research/${agent}/positioning/frameworks/${framework}/SKILL.md`;
        const bundlePath = resolve(dirname(repoPath(skillPath)), "ALIGNMENT-PAGE.md");
        const skill = read(skillPath);
        const bundle = readFileSync(bundlePath, "utf8");

        expect(existsSync(bundlePath), `${skillPath} sibling bundle`).toBe(true);
        expect(skill, `${skillPath} local stub`).toContain(
          "Follow `ALIGNMENT-PAGE.md` in this skill's directory",
        );
        expect(skill, `${skillPath} no parent-relative alignment pointer`).not.toContain(
          "../ALIGNMENT-PAGE.md",
        );
        expect(bundle, `${skillPath} bundled YAML contract`).toMatch(/\*\*(Gate|Response) YAML contract\.\*\*/);
        expect(bundle, `${skillPath} bundled research quality`).toContain(
          "**Research quality contract.**",
        );
        expect(bundle, `${skillPath} report-only research gates`).toContain(
          "**Report-only research gates.**",
        );
      }
    }
  });

  it("approval-gates the product-positioning shortcut before writing the run manifest", () => {
    const contracts = [
      "packs/business-research/claude/positioning/SKILL.md",
      "packs/business-research/codex/positioning/SKILL.md",
    ];

    for (const path of contracts) {
      const section = shortcutSection(read(path));
      const buildIndex = section.indexOf("Build an alignment page for the shortcut execution plan");
      const doNotWriteIndex = section.indexOf("Do not write the run manifest before alignment approval");
      const approvalIndex = section.indexOf("After user approval via final compiled YAML");
      const writeIndex = section.indexOf("write this selected set to the run manifest");
      const manifestIndex = section.indexOf("orchestrator: positioning");

      expect(buildIndex, `${path} builds alignment page`).toBeGreaterThanOrEqual(0);
      expect(doNotWriteIndex, `${path} forbids pre-approval manifest write`).toBeGreaterThan(buildIndex);
      expect(approvalIndex, `${path} waits for final compiled YAML`).toBeGreaterThan(doNotWriteIndex);
      expect(writeIndex, `${path} writes manifest only after approval phrase`).toBeGreaterThan(approvalIndex);
      expect(manifestIndex, `${path} manifest example appears after approval gate`).toBeGreaterThan(approvalIndex);
      expect(section, `${path} old task-queue shortcut removed`).not.toMatch(/tasks\/todo\.md|Framework Execution/);
    }
  });

  it("preserves parent positioning-specific alignment gates in generated bundles", () => {
    for (const agent of agents) {
      const bundle = read(`packs/business-research/${agent}/positioning/ALIGNMENT-PAGE.md`);

      expect(bundle, `${agent} parent multi-select gate`).toContain(
        "**Multi-select framework convention.**",
      );
      expect(bundle, `${agent} parent shortcut gate`).toContain(
        "**Product-positioning shortcut translation.**",
      );
      expect(bundle, `${agent} parent synthesis gate`).toContain(
        "**Synthesis mode translation.**",
      );
    }
  });
});
