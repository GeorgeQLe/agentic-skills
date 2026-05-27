import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");

const coreSkills = [
  "packs/product-design/claude/ui-interview/SKILL.md",
  "packs/product-design/codex/ui-interview/SKILL.md",
  "packs/product-design/claude/ux-variations/SKILL.md",
  "packs/product-design/codex/ux-variations/SKILL.md",
  "packs/product-design/claude/spec-interview/SKILL.md",
  "packs/product-design/codex/spec-interview/SKILL.md",
  "packs/product-design/claude/consolidate-variations/SKILL.md",
  "packs/product-design/codex/consolidate-variations/SKILL.md",
  "packs/product-design/claude/prototype/SKILL.md",
  "packs/product-design/codex/prototype/SKILL.md",
  "packs/product-testing/claude/uat/SKILL.md",
  "packs/product-testing/codex/uat/SKILL.md",
  "packs/agent-work-admin/claude/roadmap/SKILL.md",
  "packs/agent-work-admin/codex/roadmap/SKILL.md",
  "packs/research-admin/claude/research-roadmap/SKILL.md",
  "packs/research-admin/codex/research-roadmap/SKILL.md",
];

const skippedSkills = [
  "packs/exec-loop/claude/exec/SKILL.md",
  "packs/exec-loop/codex/exec/SKILL.md",
  "packs/exec-loop/claude/ship/SKILL.md",
  "packs/exec-loop/codex/ship/SKILL.md",
  "packs/exec-loop/claude/ship-end/SKILL.md",
  "packs/exec-loop/codex/ship-end/SKILL.md",
  "packs/gitops/claude/sync/SKILL.md",
  "packs/gitops/codex/sync/SKILL.md",
  "packs/agent-work-admin/claude/plan-phase/SKILL.md",
  "packs/agent-work-admin/codex/plan-phase/SKILL.md",
];

const researchQualitySkills = [
  "packs/research-admin/claude/research-roadmap/SKILL.md",
  "packs/research-admin/codex/research-roadmap/SKILL.md",
];

function read(path: string) {
  return readFileSync(resolve(ROOT, path), "utf8");
}

function activeSkillFiles(dir: string, out: string[] = []) {
  for (const entry of readdirSync(resolve(ROOT, dir))) {
    const abs = resolve(ROOT, dir, entry);
    const rel = relative(ROOT, abs);
    const stat = statSync(abs);
    if (stat.isDirectory()) {
      if (entry === "archive" || entry === "node_modules" || entry === ".git") continue;
      activeSkillFiles(rel, out);
    } else if (stat.isFile() && entry === "SKILL.md") {
      out.push(rel);
    }
  }
  return out;
}

const activeAlignmentSkillFiles = [...activeSkillFiles("global"), ...activeSkillFiles("packs")]
  .filter((path) => {
    const content = read(path);
    return content.includes("## Alignment Page") && content.includes("**Gate YAML contract.**");
  })
  .sort();

describe("alignment page gate contract", () => {
  it("requires gate-based HTML review pages for core planning and research skills", () => {
    for (const path of coreSkills) {
      const content = read(path);
      expect(content, `${path} alignment heading`).toMatch(/^#{2,3} Alignment Page$/m);
      expect(content, `${path} gates`).toContain("**Alignment gates.**");
      expect(content, `${path} required gate types`).toContain("evidence coverage, assumptions/confidence, scope/non-goals");
      expect(content, `${path} required questions`).toContain("**Required inline questions.**");
      expect(content, `${path} yaml contract`).toContain("**Gate YAML contract.**");
      expect(content, `${path} yaml fields`).toContain("`section`, `gate_type`, `status`");
      expect(content, `${path} in-page assumptions`).toContain("assumptions/confidence");
      expect(content, `${path} proposed file changes`).toContain("proposed file changes");
      expect(content, `${path} pre-approval stop`).toContain("the next action is review of the HTML alignment page");
    }
  });

  it("keeps report-only research gates explicit", () => {
    for (const path of [
      "packs/research-admin/claude/research-roadmap/SKILL.md",
      "packs/research-admin/codex/research-roadmap/SKILL.md",
    ]) {
      const content = read(path);
      expect(content, `${path} report-only gates`).toContain("**Report-only research gates.**");
      expect(content, `${path} evidence coverage`).toContain("evidence coverage");
      expect(content, `${path} recommended path`).toContain("recommended path");
      expect(content, `${path} approval gates`).toContain("approval gates");
    }
  });

  it("requires research output pages to preserve evidence, uncertainty, and decision context", () => {
    for (const path of researchQualitySkills) {
      const content = read(path);
      expect(content, `${path} research quality contract`).toContain("**Research quality contract.**");
      expect(content, `${path} claim/evidence/inference split`).toContain("`claims` (what the report concludes), `evidence`");
      expect(content, `${path} no context loss`).toContain("**No context loss rule.**");
      expect(content, `${path} evidence matrix`).toContain("evidence matrix");
      expect(content, `${path} confidence register`).toContain("confidence/assumption register");
      expect(content, `${path} rejected findings`).toContain("rejected or lower-confidence findings");
      expect(content, `${path} source gaps`).toContain("source coverage gaps");
      expect(content, `${path} downstream implications`).toContain("downstream implications");
      expect(content, `${path} research completeness gate`).toContain("**Research completeness gate.**");
      expect(content, `${path} evidence sufficiency question`).toContain("whether the evidence is sufficient for the recommendation");
    }
  });

  it("requires source coverage categories for web research and file evidence for repo research", () => {
    for (const path of researchQualitySkills) {
      const content = read(path);
      expect(content, `${path} source coverage expectations`).toContain("**Source coverage expectations.**");
      expect(content, `${path} web source categories`).toContain("competitors, pricing, user sentiment, positioning, integrations, and recent activity");
      expect(content, `${path} repo evidence`).toContain("file/path evidence");
      expect(content, `${path} fact inference distinction`).toContain("distinguish observed code facts from inferred product, workflow, or user conclusions");
    }
  });

  it("preserves skill-specific gate language", () => {
    expect(read("packs/product-design/codex/ui-interview/SKILL.md")).toContain("Render surfaced assumptions, the UI or content requirements manifest");
    expect(read("packs/product-design/codex/ux-variations/SKILL.md")).toContain("Render surfaced assumptions, variation manifest, concept selection");
    expect(read("packs/customer-lifecycle/codex/journey-map/SKILL.md")).toContain("**Journey research translation.**");
    expect(read("packs/research-admin/codex/research-roadmap/SKILL.md")).toContain("**Research-roadmap translation.**");
  });

  it("requires every active alignment page to copy compiled YAML ergonomically", () => {
    expect(activeAlignmentSkillFiles.length).toBeGreaterThan(10);
    for (const path of activeAlignmentSkillFiles) {
      const content = read(path);
      expect(content, `${path} automatic copy`).toContain("automatically attempt to copy the YAML to the clipboard");
      expect(content, `${path} copy button`).toContain('explicit "Copy YAML" button');
      expect(content, `${path} fallback`).toContain("fall back to selecting the textarea contents");
      expect(content, `${path} old click-to-copy-only contract`).not.toContain("Display the YAML in a read-only, click-to-copy textarea.");
    }
  });

  it("leaves skip-list skills excluded from alignment requirements", () => {
    for (const path of skippedSkills) {
      const content = read(path);
      expect(content, `${path} skipped`).not.toContain("**Alignment gates.**");
    }
  });
});
