import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

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

// Resolve the sibling ALIGNMENT-PAGE.md bundled next to a SKILL.md.
function bundledPath(skillMdPath: string) {
  return relative(ROOT, resolve(dirname(resolve(ROOT, skillMdPath)), "ALIGNMENT-PAGE.md"));
}

function bundled(skillMdPath: string) {
  return read(bundledPath(skillMdPath));
}

function hasBundle(skillMdPath: string) {
  return existsSync(resolve(ROOT, bundledPath(skillMdPath)));
}

// Where the convention text lives for a skill: the bundled file when the
// generator owns it, otherwise the inline SKILL.md section (bespoke,
// skip-listed skills such as `roadmap` keep their convention inline).
function conventionText(skillMdPath: string) {
  return hasBundle(skillMdPath) ? bundled(skillMdPath) : read(skillMdPath);
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

// Alignment skills now carry the convention in a sibling ALIGNMENT-PAGE.md;
// the SKILL.md only holds a short stub heading that points at it.
const activeAlignmentSkillFiles = [...activeSkillFiles("global"), ...activeSkillFiles("packs")]
  .filter((path) => {
    const content = read(path);
    if (!/^#{2,3} Alignment Page$/m.test(content)) return false;
    // Bundled skills carry the convention in ALIGNMENT-PAGE.md; bespoke
    // skip-listed skills keep the full contract inline.
    return hasBundle(path) || content.includes("**Gate YAML contract.**");
  })
  .sort();

describe("alignment page gate contract", () => {
  it("points core skills at the bundled convention instead of CLAUDE.md", () => {
    for (const path of coreSkills) {
      const content = read(path);
      expect(content, `${path} alignment heading`).toMatch(/^#{2,3} Alignment Page$/m);
      expect(content, `${path} no dangling CLAUDE.md pointer`).not.toContain(
        "Follow the shared Alignment Page convention in CLAUDE.md",
      );
      if (hasBundle(path)) {
        // Generator-owned skills point their stub at the bundled file.
        expect(content, `${path} references bundled file`).toContain("ALIGNMENT-PAGE.md");
      } else {
        // Bespoke skip-listed skills (e.g. roadmap) keep the gates inline.
        expect(content, `${path} inline gates`).toContain("**Alignment gates.**");
      }
    }
  });

  it("requires gate-based HTML review pages for core planning and research skills", () => {
    for (const path of coreSkills) {
      const content = conventionText(path);
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
    for (const path of researchQualitySkills) {
      const content = conventionText(path);
      expect(content, `${path} report-only gates`).toContain("**Report-only research gates.**");
      expect(content, `${path} evidence coverage`).toContain("evidence coverage");
      expect(content, `${path} recommended path`).toContain("recommended path");
      expect(content, `${path} approval gates`).toContain("approval gates");
    }
  });

  it("requires research output pages to preserve evidence, uncertainty, and decision context", () => {
    for (const path of researchQualitySkills) {
      const content = conventionText(path);
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
      const content = conventionText(path);
      expect(content, `${path} source coverage expectations`).toContain("**Source coverage expectations.**");
      expect(content, `${path} web source categories`).toContain("competitors, pricing, user sentiment, positioning, integrations, and recent activity");
      expect(content, `${path} repo evidence`).toContain("file/path evidence");
      expect(content, `${path} fact inference distinction`).toContain("distinguish observed code facts from inferred product, workflow, or user conclusions");
    }
  });

  it("preserves skill-specific gate language", () => {
    expect(conventionText("packs/product-design/codex/ui-interview/SKILL.md")).toContain("Render surfaced assumptions, the UI or content requirements manifest");
    expect(conventionText("packs/product-design/codex/ux-variations/SKILL.md")).toContain("Render surfaced assumptions, variation manifest, concept selection");
    expect(conventionText("packs/customer-lifecycle/codex/journey-map/SKILL.md")).toContain("**Journey research translation.**");
    expect(conventionText("packs/research-admin/codex/research-roadmap/SKILL.md")).toContain("**Research-roadmap translation.**");
  });

  it("requires every active alignment page to copy compiled YAML ergonomically", () => {
    expect(activeAlignmentSkillFiles.length).toBeGreaterThan(10);
    for (const path of activeAlignmentSkillFiles) {
      const content = conventionText(path);
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
      expect(hasBundle(path), `${path} has no bundled ALIGNMENT-PAGE.md`).toBe(false);
    }
  });

  it("bundles the convention so it travels with pointer-form skills", () => {
    // Pointer-form skills used to carry only a dangling reference to CLAUDE.md
    // (the afps-tracker incident). They must now ship a sibling
    // ALIGNMENT-PAGE.md with the full convention and their skill-specific gates.
    const pointerSkills = [
      "global/claude/idea-scope-brief/SKILL.md",
      "global/codex/idea-scope-brief/SKILL.md",
      "packs/customer-lifecycle/claude/journey-map/SKILL.md",
      "packs/customer-lifecycle/codex/journey-map/SKILL.md",
    ];
    for (const path of pointerSkills) {
      const skill = read(path);
      expect(hasBundle(path), `${path} has bundled ALIGNMENT-PAGE.md`).toBe(true);
      expect(skill, `${path} stub references bundle`).toContain("ALIGNMENT-PAGE.md");
      expect(skill, `${path} no dangling CLAUDE.md pointer`).not.toContain(
        "Follow the shared Alignment Page convention in CLAUDE.md",
      );
      const page = bundled(path);
      expect(page, `${path} bundle has gate contract`).toContain("**Gate YAML contract.**");
      expect(page, `${path} bundle has required questions`).toContain("**Required inline questions.**");
    }
    expect(bundled("global/claude/idea-scope-brief/SKILL.md"), "idea-scope-brief gates").toContain(
      "**Concept-specific gates.**",
    );
    expect(bundled("packs/customer-lifecycle/codex/journey-map/SKILL.md"), "journey-map gates").toContain(
      "**Journey research translation.**",
    );
  });

  it("keeps every bundled ALIGNMENT-PAGE.md in sync with CLAUDE.md (drift guard)", () => {
    const out = execFileSync("node", ["scripts/upgrade-alignment-page.mjs", "--dry-run"], {
      cwd: ROOT,
      encoding: "utf8",
    });
    const updated = out.match(/^Updated: (\d+)$/m)?.[1];
    const bundles = out.match(/^Bundled files written: (\d+)$/m)?.[1];
    expect(updated, `generator reported drift:\n${out}`).toBe("0");
    expect(bundles, `generator reported bundle drift:\n${out}`).toBe("0");
  });
});
