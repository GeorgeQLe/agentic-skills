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

  it("provisions issue-backed delivery without legacy direct-primary allowances", () => {
    for (const agent of ["claude", "codex"]) {
      const provision = read(`packs/base/${agent}/provision-agentic-config/SKILL.md`);
      expect(provision).toContain("Issue-Backed GitHub Delivery");
      expect(provision).toContain("reuse or create one GitHub Issue");
      expect(provision).not.toContain("Direct-To-Primary Git Flow");
    }

    const audit = read("scripts/audit-github-delivery-contract.mjs");
    expect(audit).not.toContain("legacyMigrationLimits");
    expect(audit).toContain("repository\\s+");
    expect(read("AGENTS.md")).toContain("<!-- provision-agentic-config v0.16 -->");
    expect(read("CLAUDE.md")).toContain("<!-- provision-agentic-config v0.16 -->");
    expect(read("AGENTS.md")).not.toContain("explicit exception to direct-to-primary work");
    expect(read("CLAUDE.md")).not.toContain("explicit exception to direct-to-primary work");
  });

  it("migrates active mutation skills that previously pushed the repository primary branch", () => {
    for (const agent of ["claude", "codex"]) {
      const updatePackages = read(`packs/code-maintenance/${agent}/update-packages/SKILL.md`);
      expect(updatePackages).toMatch(/non-primary branch/);
      expect(updatePackages).toMatch(/ready pull request/);
      expect(updatePackages).not.toMatch(/push on the repository primary branch/);
    }

    const productLine = read("packs/business-ops/codex/product-line/SKILL.md");
    expect(productLine).not.toMatch(/push changes to the repository primary branch/);
  });

  it("routes shipping orchestrators through the issue-backed ready-PR boundary", () => {
    for (const agent of ["claude", "codex"]) {
      const commit = read(`packs/gitops/${agent}/commit-and-push-by-feature/SKILL.md`);
      const lifecycle = read(`packs/release-ops/${agent}/branch-lifecycle/SKILL.md`);
      const ship = read(`packs/exec-loop/${agent}/ship/SKILL.md`);
      const shipEnd = read(`packs/exec-loop/${agent}/ship-end/SKILL.md`);

      expect(commit).toContain("docs/github-delivery-contract.md");
      expect(commit).toMatch(/ready pull request/i);
      expect(commit).toMatch(/Do not merge it/i);
      expect(lifecycle).toMatch(/compatibility and advanced-recovery wrapper/i);
      expect(lifecycle).toMatch(/github-pr (?:merge|upsert)/);
      expect(ship).toMatch(/ready pull request/i);
      expect(ship).toMatch(/defer deployment/i);
      expect(shipEnd).toMatch(/ready pull request/i);
      expect(shipEnd).toMatch(/defer deployment/i);
    }

    const claudeExec = read("packs/exec-loop/claude/exec/SKILL.md");
    const codexExec = read("packs/exec-loop/codex/exec/SKILL.md");
    expect(claudeExec).toContain("Preserve `/exec`'s dirty-tree handoff");
    expect(codexExec).toMatch(/ready pull request/i);
    expect(codexExec).toMatch(/defer deployment/i);
  });
});
