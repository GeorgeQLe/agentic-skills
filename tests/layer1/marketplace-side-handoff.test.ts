import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

const ideaMirrors = [
  {
    path: "global/claude/idea-scope-brief/SKILL.md",
    command: "/icp",
  },
  {
    path: "global/codex/idea-scope-brief/SKILL.md",
    command: "$icp",
  },
] as const;

const icpMirrors = [
  "packs/business-discovery/claude/icp/SKILL.md",
  "packs/business-discovery/codex/icp/SKILL.md",
] as const;

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

function extractSection(content: string, heading: string) {
  const start = content.indexOf(heading);
  expect(start, `missing section ${heading}`).toBeGreaterThan(-1);

  const rest = content.slice(start);
  const afterHeading = rest.slice(heading.length);
  const next = afterHeading.search(/\n(?:#{1,6} |\d+\. \*\*)/);
  return (next < 0 ? rest : rest.slice(0, heading.length + next)).trim();
}

describe("marketplace side handoff contracts", () => {
  it("requires idea-scope-brief to hand apparent marketplace sides to ICP as hypotheses", () => {
    for (const { path, command } of ideaMirrors) {
      const content = read(path);
      const handoff = extractSection(content, "### Market Structure Handoff");

      expect(handoff, path).toContain("During the Idea Assumptions Manifest");
      expect(handoff, path).toContain("marketplace/platform/B2B2C/multi-sided");
      expect(handoff, path).toContain("apparent sides");
      expect(handoff, path).toContain("value exchange");
      expect(handoff, path).toContain("hypotheses, not validated ICPs");
      expect(handoff, path).not.toMatch(/web research|market research/i);

      expect(content, `${path} alignment preview should render handoff`).toContain(
        "including any Market Structure Handoff",
      );
      expect(content, `${path} ICP readiness should pass side hypotheses`).toContain(
        `If a Market Structure Handoff exists, include the apparent sides and value exchange as explicit inputs for \`${command}\` to validate or refute.`,
      );
    }
  });

  it("requires ICP to validate or refute marketplace sides before candidate generation", () => {
    for (const path of icpMirrors) {
      const content = read(path);
      const preflight = extractSection(content, "### Marketplace Side Preflight");

      expect(preflight, path).toContain("Read any `Market Structure Handoff`");
      expect(preflight, path).toContain("idea brief");
      expect(preflight, path).toContain("infer likely sides");
      expect(preflight, path).toContain("During broad market research, validate or refute");
      expect(preflight, path).toContain("Before candidate generation");
      expect(preflight, path).toContain("cover each material side");
      expect(preflight, path).toContain("excluded, deferred, or not a customer side");

      expect(content, `${path} search log should preserve side rationale`).toContain(
        "Marketplace Side Preflight validation/refutation plus side coverage/exclusion rationale",
      );
    }
  });

  it("keeps the new handoff and preflight sections mirrored", () => {
    const claudeIdea = extractSection(read("global/claude/idea-scope-brief/SKILL.md"), "### Market Structure Handoff");
    const codexIdea = extractSection(read("global/codex/idea-scope-brief/SKILL.md"), "### Market Structure Handoff");
    const claudeIcp = extractSection(
      read("packs/business-discovery/claude/icp/SKILL.md"),
      "### Marketplace Side Preflight",
    );
    const codexIcp = extractSection(
      read("packs/business-discovery/codex/icp/SKILL.md"),
      "### Marketplace Side Preflight",
    );

    expect(claudeIdea).toEqual(codexIdea);
    expect(claudeIcp).toEqual(codexIcp);
  });
});
