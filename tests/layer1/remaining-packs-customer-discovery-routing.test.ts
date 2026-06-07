import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

const inspectedPackRoots = [
  "packs/research-admin",
  "packs/repo-maintenance",
  "packs/docs-health",
  "packs/teardown",
  "packs/monorepo",
] as const;

const routeBearingSkillPaths = [
  ["packs/research-admin/codex/research-roadmap/SKILL.md", "$customer-discovery"],
  ["packs/research-admin/claude/research-roadmap/SKILL.md", "/customer-discovery"],
  ["packs/repo-maintenance/codex/bootstrap-repo/SKILL.md", "$customer-discovery"],
  ["packs/repo-maintenance/claude/bootstrap-repo/SKILL.md", "/customer-discovery"],
  ["packs/teardown/codex/desk-flip/SKILL.md", "$customer-discovery"],
  ["packs/teardown/claude/desk-flip/SKILL.md", "/customer-discovery"],
  ["packs/monorepo/codex/scaffold/SKILL.md", "$customer-discovery"],
  ["packs/monorepo/claude/scaffold/SKILL.md", "/customer-discovery"],
] as const;

function collectActiveSkillPaths(root: string) {
  const discovered: string[] = [];
  const pending = [root];

  while (pending.length > 0) {
    const current = pending.pop()!;
    for (const entry of readdirSync(resolve(ROOT, current), { withFileTypes: true })) {
      const child = `${current}/${entry.name}`;
      if (entry.isDirectory()) {
        if (entry.name !== "archive") {
          pending.push(child);
        }
        continue;
      }

      if (entry.name === "SKILL.md") {
        discovered.push(child);
      }
    }
  }

  return discovered.sort();
}

const inspectedSkillPaths = inspectedPackRoots.flatMap(collectActiveSkillPaths);

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("remaining packs customer-discovery routing", () => {
  it("routes active remaining-pack contracts to customer-discovery instead of the retired icp command", () => {
    for (const [path, command] of routeBearingSkillPaths) {
      expect(read(path), `${path} should route to ${command}`).toContain(command);
    }
  });

  it("does not recommend the retired icp executable in active remaining-pack contracts", () => {
    for (const path of inspectedSkillPaths) {
      const content = read(path);

      expect(content, `${path} should not route to retired discovery command`).not.toMatch(
        /(^|[^A-Za-z0-9_.-])(\$icp|\/icp)(?![A-Za-z0-9_.-])/i,
      );
      expect(content, `${path} should not use the retired AFPS status`).not.toContain("icp-needed");
      expect(content, `${path} should not keep the old concept-validation verdict label`).not.toContain(
        "Proceed to ICP",
      );
    }
  });
});
