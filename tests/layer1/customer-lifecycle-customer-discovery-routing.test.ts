import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

const routeBearingSkillPaths = [
  ["packs/customer-lifecycle/codex/journey-map/SKILL.md", "$customer-discovery"],
  ["packs/customer-lifecycle/claude/journey-map/SKILL.md", "/customer-discovery"],
  ["packs/customer-lifecycle/codex/journey-map/frameworks/experience-map/SKILL.md", "$customer-discovery"],
  ["packs/customer-lifecycle/claude/journey-map/frameworks/experience-map/SKILL.md", "/customer-discovery"],
  ["packs/customer-lifecycle/codex/journey-map/frameworks/jtbd-timeline/SKILL.md", "$customer-discovery"],
  ["packs/customer-lifecycle/claude/journey-map/frameworks/jtbd-timeline/SKILL.md", "/customer-discovery"],
  ["packs/customer-lifecycle/codex/journey-map/frameworks/service-blueprint/SKILL.md", "$customer-discovery"],
  ["packs/customer-lifecycle/claude/journey-map/frameworks/service-blueprint/SKILL.md", "/customer-discovery"],
  ["packs/customer-lifecycle/codex/journey-map/frameworks/user-story-map/SKILL.md", "$customer-discovery"],
  ["packs/customer-lifecycle/claude/journey-map/frameworks/user-story-map/SKILL.md", "/customer-discovery"],
  [
    "packs/customer-lifecycle/codex/journey-map/frameworks/customer-journey-canvas/SKILL.md",
    "$customer-discovery",
  ],
  [
    "packs/customer-lifecycle/claude/journey-map/frameworks/customer-journey-canvas/SKILL.md",
    "/customer-discovery",
  ],
] as const;

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

describe("customer-lifecycle customer-discovery routing", () => {
  it("routes active journey-map contracts to customer-discovery instead of the retired icp command", () => {
    for (const [path, command] of routeBearingSkillPaths) {
      expect(read(path), `${path} should route to ${command}`).toContain(command);
    }
  });

  it("does not recommend the retired icp executable in active journey-map contracts", () => {
    for (const [path] of routeBearingSkillPaths) {
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
