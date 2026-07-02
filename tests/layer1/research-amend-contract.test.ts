import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { parseFrontmatter } from "../helpers/frontmatter.js";

const ROOT_DIR = resolve(import.meta.dirname, "../..");

const variants = [
  {
    agent: "codex",
    command: "$research-amend",
    path: "packs/base/codex/research-amend/SKILL.md",
  },
  {
    agent: "claude",
    command: "/research-amend",
    path: "packs/base/claude/research-amend/SKILL.md",
  },
] as const;

describe("research-amend base skill contract", () => {
  for (const variant of variants) {
    const absolutePath = resolve(ROOT_DIR, variant.path);

    it(`${variant.agent} declares the base research amendment skill`, () => {
      const content = readFileSync(absolutePath, "utf8");
      const frontmatter = parseFrontmatter(absolutePath);

      expect(frontmatter.name).toBe("research-amend");
      expect(frontmatter.type).toBe("research");
      expect(frontmatter.version).toBe("v0.1");
      expect(frontmatter.required_conventions).toBe("[alignment-page]");
      expect(content).toContain(`Invoke as \`${variant.command}\`.`);
      expect(content).toContain("alignment/research-amend-{topic}.html");
    });

    it(`${variant.agent} keeps low and medium amendments bounded behind review`, () => {
      const content = readFileSync(absolutePath, "utf8");

      expect(content).toContain("A single missed competitor defaults to **medium impact**");
      expect(content).toContain("For low/medium impact, write a non-canonical working packet before any canonical edits");
      expect(content).toContain("Create or update `alignment/research-amend-{topic}.html` in `review` state before canonical writes");
      expect(content).toContain("The page must render the full amendment packet, not just a summary");
      expect(content).toContain("Stop for review. While the page is in `review`, do not write canonical research");
      expect(content).toContain("Only after final compiled YAML has `approval_status: ready-for-agent-review`");
      expect(content).toContain("Patch only the approved affected canonical/intermediate/search-log files");
      expect(content).toContain("Add an `## Amendment Note`");
    });

    it(`${variant.agent} escalates high and systemic changes to reruns`, () => {
      const content = readFileSync(absolutePath, "utf8");

      expect(content).toContain("**High impact:**");
      expect(content).toContain("**Systemic impact:**");
      expect(content).toContain("Do not small-patch");
      expect(content).toContain("Route to the affected Pattern A framework(s) and synthesis rerun");
      expect(content).toContain("Recommend a full Pattern A rerun");
      for (const route of ["customer-discovery", "competitive-analysis", "positioning", "journey-map", "research-roadmap"]) {
        expect(content).toContain(route);
      }
    });

    it(`${variant.agent} routes approval YAML back to itself`, () => {
      const content = readFileSync(absolutePath, "utf8");

      expect(content).toContain("clear context, and paste the compiled YAML into a fresh session");
      expect(content).toContain(`${variant.command} <same scope argument>`);
      expect(content).toContain("top-level `command` plus `agent_routing.command`");
      expect(content).not.toContain("$exec");
      expect(content).not.toContain("/exec");
    });
  }
});
