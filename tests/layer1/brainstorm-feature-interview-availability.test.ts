import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");
const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");

describe("brainstorm feature-interview availability gate", () => {
  const brainstormMirrors = [
    {
      path: "packs/product-design/codex/brainstorm/SKILL.md",
      command: "$feature-interview",
      refresh: "fresh Codex CLI session",
    },
    {
      path: "packs/product-design/claude/brainstorm/SKILL.md",
      command: "/feature-interview",
      refresh: "/reload-skills",
    },
  ];

  for (const mirror of brainstormMirrors) {
    it(`${mirror.path} puts install prerequisite before unavailable feature-interview prompts`, () => {
      const content = read(mirror.path);

      expect(content).toContain("## Follow-up Skill Availability Gate");
      expect(content).toContain(`Before listing any \`${mirror.command}\` prompts`);
      expect(content).toContain("enabled_skills.feature-interview");
      expect(content).toContain("enabled pack that provides `feature-interview`");
      expect(content).toContain("scripts/pack.sh which feature-interview");
      expect(content).toContain("feature-interview/SKILL.md");
      expect(content).toContain("the first line of the displayed output");
      expect(content).toContain("the first line appended for this run in `tasks/ideas.md`");
      expect(content).toContain("npx skillpacks install feature-interview");
      expect(content).toContain(mirror.refresh);
      expect(content).toContain(`Put this prerequisite before any brainstorm suggestion or \`${mirror.command} <topic>\` prompt.`);
    });
  }
});

describe("session-triage skill availability guard", () => {
  const sessionTriageMirrors = [
    {
      path: "packs/session-analytics/codex/session-triage/SKILL.md",
      refresh: "fresh Codex CLI session",
    },
    {
      path: "packs/session-analytics/claude/session-triage/SKILL.md",
      refresh: "/reload-skills",
    },
  ];

  for (const mirror of sessionTriageMirrors) {
    it(`${mirror.path} checks enabled_skills before falling back to provider packs`, () => {
      const content = read(mirror.path);

      expect(content).toContain("## Pack Availability Guard");
      expect(content).toContain("enabled_skills.<skill-name>");
      expect(content).toContain("even when the provider pack is not listed in `enabled_packs`");
      expect(content).toContain("enabled_packs");
      expect(content).toContain("scripts/pack.sh which <skill-name>");
      expect(content).toContain("<skill-name>/SKILL.md");
      expect(content).toContain("npx skillpacks install <pack-or-skill>");
      expect(content).toContain("Prefer the provider pack when it is known; otherwise recommend installing the target skill by name.");
      expect(content).toContain(mirror.refresh);
    });
  }
});
