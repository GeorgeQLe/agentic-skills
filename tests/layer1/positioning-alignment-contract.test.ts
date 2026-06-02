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

function modeCSection(content: string) {
  const start = content.indexOf("### 5. Mode C");
  const end = content.indexOf("### 6. Next Steps", start);
  expect(start, "Mode C section exists").toBeGreaterThanOrEqual(0);
  expect(end, "Mode C section boundary exists").toBeGreaterThan(start);
  return content.slice(start, end);
}

describe("positioning alignment contracts", () => {
  it("bundles sibling alignment-page conventions for positioning framework subskills", () => {
    for (const agent of agents) {
      for (const framework of frameworkNames) {
        const skillPath = `packs/business-discovery/${agent}/positioning/frameworks/${framework}/SKILL.md`;
        const bundlePath = resolve(dirname(repoPath(skillPath)), "ALIGNMENT-PAGE.md");
        const skill = read(skillPath);
        const bundle = readFileSync(bundlePath, "utf8");

        expect(existsSync(bundlePath), `${skillPath} sibling bundle`).toBe(true);
        expect(skill, `${skillPath} local stub`).toContain(
          "following `ALIGNMENT-PAGE.md` in this skill's directory",
        );
        expect(skill, `${skillPath} no parent-relative alignment pointer`).not.toContain(
          "../ALIGNMENT-PAGE.md",
        );
        expect(bundle, `${skillPath} bundled gate contract`).toContain("**Gate YAML contract.**");
        expect(bundle, `${skillPath} bundled research quality`).toContain(
          "**Research quality contract.**",
        );
        expect(bundle, `${skillPath} report-only research gates`).toContain(
          "**Report-only research gates.**",
        );
      }
    }
  });

  it("approval-gates the product-positioning shortcut before writing tasks/todo.md", () => {
    const contracts = [
      "packs/business-discovery/claude/positioning/SKILL.md",
      "packs/business-discovery/codex/positioning/SKILL.md",
    ];

    for (const path of contracts) {
      const section = modeCSection(read(path));
      const buildIndex = section.indexOf("Build an alignment page for the shortcut execution plan");
      const doNotWriteIndex = section.indexOf("Do not write `tasks/todo.md` before alignment approval");
      const approvalIndex = section.indexOf("After user approval via final compiled YAML");
      const writeIndex = section.indexOf("write this execution plan to `tasks/todo.md`");
      const planIndex = section.indexOf("## Positioning Framework Execution");

      expect(buildIndex, `${path} builds alignment page`).toBeGreaterThanOrEqual(0);
      expect(doNotWriteIndex, `${path} forbids pre-approval todo write`).toBeGreaterThan(buildIndex);
      expect(approvalIndex, `${path} waits for final compiled YAML`).toBeGreaterThan(doNotWriteIndex);
      expect(writeIndex, `${path} writes only after approval phrase`).toBeGreaterThan(approvalIndex);
      expect(planIndex, `${path} plan appears after approval gate`).toBeGreaterThan(approvalIndex);
      expect(section, `${path} old direct-write shortcut removed`).not.toMatch(
        /Skip multi-select\. Write(?: directly)? to `tasks\/todo\.md`/,
      );
    }
  });

  it("preserves parent positioning-specific alignment gates in generated bundles", () => {
    for (const agent of agents) {
      const bundle = read(`packs/business-discovery/${agent}/positioning/ALIGNMENT-PAGE.md`);

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
