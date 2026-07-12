import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");
const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");

describe("GitHub delivery safety subskills", () => {
  const skills = ["github-issue", "github-branch", "github-pr"];

  it("provides versioned Claude and Codex base mirrors", () => {
    for (const skill of skills) {
      for (const agent of ["claude", "codex"]) {
        const source = read(`packs/base/${agent}/${skill}/SKILL.md`);
        expect(source).toContain(`name: ${skill}`);
        expect(source).toContain("version: v0.0");
        expect(read(`packs/base/${agent}/${skill}/CHANGELOG.md`)).toContain("## v0.0 - 2026-07-12");
        expect(read("packages/skillpacks/dist/skillpacks-manifest.json")).toContain(`"id": "base-${agent}-${skill}"`);
      }
      expect(read("packs/base/PACK.md")).toContain(`\`${skill}\``);
    }
  });

  it("keeps shared safety invariants in both mirrors", () => {
    for (const agent of ["claude", "codex"]) {
      const issue = read(`packs/base/${agent}/github-issue/SKILL.md`);
      const branch = read(`packs/base/${agent}/github-branch/SKILL.md`);
      const pr = read(`packs/base/${agent}/github-pr/SKILL.md`);
      expect(issue).toMatch(/Reuse one issue only when the evidence is unambiguous/);
      expect(issue).toContain("Do not close an issue when a branch or pull request opens");
      expect(branch).toContain("Refuse direct pushes to primary");
      expect(branch).toContain("Never delete an unmerged branch");
      expect(pr).toContain("Ordinary shipping ends after the ready pull request");
      expect(pr).toContain("explicit user confirmation immediately before the merge mutation");
      expect(pr).toContain("Never enable auto-merge");
    }
  });

  it("publishes Codex UI metadata for every new base skill", () => {
    for (const skill of skills) {
      const metadata = read(`packs/base/codex/${skill}/agents/openai.yaml`);
      expect(metadata).toContain("display_name:");
      expect(metadata).toContain("short_description:");
      expect(metadata).toContain(`Use $${skill}`);
    }
  });

  it("documents and passes the active direct-primary audit", () => {
    const contract = read("docs/github-delivery-contract.md");
    expect(contract).toContain("Never commit tracked mutations on, push tracked mutations directly to");
    expect(contract).toContain("Ordinary shipping stops at the ready pull request");
    expect(() => execFileSync("node", ["scripts/audit-github-delivery-contract.mjs"], { cwd: ROOT })).not.toThrow();
  });
});
