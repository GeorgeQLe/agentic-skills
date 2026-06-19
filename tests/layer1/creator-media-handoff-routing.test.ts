import { describe, expect, it } from "vitest";
import { globSync } from "glob";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT_DIR = resolve(import.meta.dirname, "../..");

const creatorMediaSkillFiles = [
  ...globSync("packs/creator-foundation/{claude,codex}/*/SKILL.md", { cwd: ROOT_DIR }),
  ...globSync("packs/youtube-ops/{claude,codex}/*/SKILL.md", { cwd: ROOT_DIR }),
  ...globSync("packs/remotion/{claude,codex}/*/SKILL.md", { cwd: ROOT_DIR }),
];

describe("creator-media artifact handoff and intent routing contracts", () => {
  it("covers creator-media skill contracts", () => {
    expect(creatorMediaSkillFiles.length).toBeGreaterThan(0);
  });

  for (const relPath of creatorMediaSkillFiles) {
    it(`${relPath} requires artifact handoff before downstream routing`, () => {
      const content = readFileSync(resolve(ROOT_DIR, relPath), "utf-8");

      expect(content).toContain("## Approved Artifact Handoff");
      expect(content).toMatch(/List every created or updated synthesized artifact path/i);
      expect(content).toMatch(/State the verification performed/i);
      expect(content).toMatch(/git status/i);
      expect(content).toMatch(/modified or untracked/i);
      expect(content).toMatch(/shipping, committing, or an explicit dirty-artifact handoff/i);
      expect(content).toMatch(/Do not imply the research workflow is complete/i);
    });

    it(`${relPath} prioritizes immediate user intent over default routing`, () => {
      const content = readFileSync(resolve(ROOT_DIR, relPath), "utf-8");

      expect(content).toContain("## Intent-Aware Routing");
      expect(content).toMatch(/Before applying the default (`## Next-Skill Routing` sequence|`## Next-Step Routing` sequence|next-step routing)/i);
      expect(content).toMatch(/Strategy refresh/i);
      expect(content).toMatch(/Recording prep/i);
      expect(content).toMatch(/Upload prep/i);
      expect(content).toMatch(/Performance review/i);
      expect(content).toMatch(/Owner analytics or private\/manual platform evidence/i);
      expect(content).toMatch(/Dirty intended artifacts/i);
      expect(content).toMatch(/Use the default next-skill sequence only when no stronger user intent/i);
    });
  }

  for (const relPath of ["packs/creator-foundation/PACK.md", "packs/creator-media/PACK.md"]) {
    it(`${relPath} documents creator-media handoff precedence`, () => {
      const content = readFileSync(resolve(ROOT_DIR, relPath), "utf-8");

      expect(content).toMatch(/approved synthesized (artifact )?write/i);
      expect(content).toMatch(/created\/updated artifact paths/i);
      expect(content).toMatch(/dirty\/untracked intended files/i);
      expect(content).toMatch(/Default (next-skill routing|flow order) is (subordinate|a fallback)/i);
    });
  }
});
