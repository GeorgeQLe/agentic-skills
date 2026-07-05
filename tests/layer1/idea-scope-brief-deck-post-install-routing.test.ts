import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");

const mirrors = [
  {
    name: "Codex",
    path: "packs/base/codex/idea-scope-brief/SKILL.md",
    command: "$customer-discovery",
  },
  {
    name: "Claude",
    path: "packs/base/claude/idea-scope-brief/SKILL.md",
    command: "/customer-discovery",
  },
];

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

function section(content: string, heading: string) {
  const start = content.indexOf(heading);
  expect(start, heading).toBeGreaterThan(-1);
  const next = content.indexOf("\n## ", start + heading.length);
  return next === -1 ? content.slice(start) : content.slice(start, next);
}

describe("idea-scope-brief deck post-install routing", () => {
  it("keeps high-confidence canonical deck install as the single primary command", () => {
    for (const mirror of mirrors) {
      const content = read(mirror.path);
      const nextSteps = section(content, "The `## Next Steps` section must recommend exactly one primary command:");

      expect(nextSteps, `${mirror.name} primary command count`).toContain("exactly one primary command");
      expect(nextSteps, `${mirror.name} canonical deck primary`).toContain(
        "If Deck Fit Handoff confidence is high for a canonical deck: `npx skillpacks install-deck <deck>`.",
      );
      expect(nextSteps, `${mirror.name} secondary context boundary`).toContain(
        "downstream research, discovery, or first-workflow skill routing must appear only as secondary context, not as the primary command",
      );
    }
  });

  it("requires a copy-pasteable post-install customer-discovery command with mirror syntax", () => {
    for (const mirror of mirrors) {
      const content = read(mirror.path);
      const deckHandoff = section(content, "### Deck Fit Handoff");
      const output = section(content, "## Output");
      const expectedLine = `After install, start with: ${mirror.command} [research/{slug}]`;
      const expectedScopedExample = `${mirror.command} research/{slug}`;

      expect(deckHandoff, `${mirror.name} handoff requires post-install line`).toContain(expectedLine);
      expect(output, `${mirror.name} output requires post-install line`).toContain(expectedLine);
      expect(output, `${mirror.name} readiness names scoped path argument`).toContain(expectedScopedExample);
    }
  });
});
