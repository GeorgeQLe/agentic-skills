import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

const mirrors = [
  "packs/session-analytics/claude/analyze-sessions/SKILL.md",
  "packs/session-analytics/codex/analyze-sessions/SKILL.md",
] as const;

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

function extractSection(content: string, heading: string) {
  const start = content.indexOf(heading);
  expect(start, `missing section ${heading}`).toBeGreaterThan(-1);

  const rest = content.slice(start);
  const afterHeading = rest.slice(heading.length);
  const next = afterHeading.search(/\n(?:#{1,6} |\d+\. )/);
  return (next < 0 ? rest : rest.slice(0, heading.length + next)).trim();
}

describe("analyze-sessions token and cost contract", () => {
  it("requires Codex token_count usage parsing without cumulative double counting", () => {
    for (const path of mirrors) {
      const content = read(path);
      const parseSection = extractSection(content, "7. Parse token spend and cost metadata:");

      expect(content, path).toContain('payload.type == "token_count"');
      expect(content, path).toContain("payload.info.total_token_usage");
      expect(content, path).toContain("payload.info.last_token_usage");
      expect(parseSection, path).toContain("final or highest cumulative `total_token_usage` snapshot per session");
      expect(parseSection, path).toContain("instead of summing every cumulative snapshot");
      expect(parseSection, path).toContain("deduplicated `last_token_usage` records");
    }
  });

  it("requires cost estimates to name their basis or report cost unavailable", () => {
    for (const path of mirrors) {
      const content = read(path);
      const parseSection = extractSection(content, "7. Parse token spend and cost metadata:");
      const outputSection = extractSection(content, "## Output");
      const constraints = extractSection(content, "## Constraints");

      expect(parseSection, path).toContain("direct cost fields");
      expect(parseSection, path).toContain("user-provided or freshly verified provider pricing table");
      expect(parseSection, path).toContain("pricing source, retrieval date or table version");
      expect(parseSection, path).toContain("cost is unavailable instead of guessing");
      expect(outputSection, path).toContain("Token and cost check");
      expect(outputSection, path).toContain("total estimated cost or explicit `cost unavailable`");
      expect(constraints, path).toContain("Do not infer token counts from message length");
      expect(constraints, path).toContain("Do not estimate dollar cost from remembered or stale model pricing");
    }
  });
});
