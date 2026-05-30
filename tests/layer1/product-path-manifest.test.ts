import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = resolve(TESTS_ROOT, "..");
const repoPath = (path: string) => resolve(REPO_ROOT, path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");
const posixRel = (path: string) => relative(REPO_ROOT, path).split("\\").join("/");

const pairs = {
  concept: [
    "global/codex/idea-scope-brief/SKILL.md",
    "global/claude/idea-scope-brief/SKILL.md",
  ],
  icp: [
    "packs/business-discovery/codex/icp/SKILL.md",
    "packs/business-discovery/claude/icp/SKILL.md",
  ],
  competitive: [
    "packs/business-discovery/codex/competitive-analysis/SKILL.md",
    "packs/business-discovery/claude/competitive-analysis/SKILL.md",
  ],
  platform: [
    "packs/business-ops/codex/platform-strategy/SKILL.md",
    "packs/business-ops/claude/platform-strategy/SKILL.md",
  ],
  productLine: [
    "packs/business-ops/codex/product-line/SKILL.md",
    "packs/business-ops/claude/product-line/SKILL.md",
  ],
  featureInterview: [
    "packs/product-design/codex/feature-interview/SKILL.md",
    "packs/product-design/claude/feature-interview/SKILL.md",
  ],
  uxVariations: [
    "packs/product-design/codex/ux-variations/SKILL.md",
    "packs/product-design/claude/ux-variations/SKILL.md",
  ],
  researchRoadmap: [
    "packs/research-admin/codex/research-roadmap/SKILL.md",
    "packs/research-admin/claude/research-roadmap/SKILL.md",
  ],
};

const changedContracts = Object.values(pairs).flat();

const researchPathRoots = [
  "global/codex/idea-scope-brief",
  "global/claude/idea-scope-brief",
  "packs/business-discovery",
  "packs/customer-lifecycle",
  "packs/business-growth",
  "packs/business-ops",
  "packs/product-design",
  "packs/product-testing",
  "packs/research-admin",
];

const collectSkillFiles = (root: string): string[] => {
  const absoluteRoot = repoPath(root);
  const collected: string[] = [];

  const visit = (absolutePath: string) => {
    const relativePath = posixRel(absolutePath);
    if (relativePath.split("/").includes("archive")) return;

    const stats = statSync(absolutePath);
    if (stats.isDirectory()) {
      for (const entry of readdirSync(absolutePath)) {
        visit(join(absolutePath, entry));
      }
      return;
    }

    if (relativePath.endsWith("/SKILL.md")) {
      collected.push(relativePath);
    }
  };

  visit(absoluteRoot);
  return collected;
};

const activeResearchSkillPaths = () =>
  researchPathRoots.flatMap(collectSkillFiles).filter((path) => read(path).includes("research/"));

describe("product path manifest contracts", () => {
  it("defines the product path manifest schema and avoids deferred_paths terminology", () => {
    const schemaFields = [
      "active_paths",
      "active_path",
      "product_paths",
      "id",
      "label",
      "source_skill",
      "scope_path",
      "status",
      "reason",
      "archive_reason",
      "archived_at",
      "promoted_at",
      "evidence_refs",
      "revisit_trigger",
      "next_skill",
      "pipeline_stage",
      "last_touched",
    ];

    const schemaContracts = [
      ...pairs.concept,
      ...pairs.icp,
      ...pairs.platform,
      ...pairs.productLine,
      ...pairs.featureInterview,
      ...pairs.uxVariations,
    ];

    for (const path of schemaContracts) {
      const content = read(path);
      expect(content, `${path} should use research/.progress.yaml`).toContain("research/.progress.yaml");
      expect(content, `${path} should use product_paths`).toContain("product_paths");
      expect(content, `${path} should not use legacy deferred_paths`).not.toContain("deferred_paths");
      for (const field of schemaFields) {
        expect(content, `${path} should mention manifest field ${field}`).toContain(field);
      }
    }
  });

  it("standardizes product-path scope resolution before code or monorepo hints", () => {
    const scopedSkills = activeResearchSkillPaths().filter((path) => !path.includes("/product-line/"));
    expect(scopedSkills.length).toBeGreaterThan(50);

    for (const path of scopedSkills) {
      const content = read(path);
      expect(content, `${path} should define product-path scope resolution`).toContain(
        "Product-Path Scope Resolution",
      );
      expect(content, `${path} should accept research/{slug} directly`).toContain(
        "If `$ARGUMENTS` names a non-archived `research/{slug}/`",
      );
      expect(content, `${path} should stop on archived paths`).toContain("stop and warn that the path is archived");
      expect(content, `${path} should normalize active_path`).toContain("Normalize legacy `active_path`");
      expect(content, `${path} should write active_paths`).toContain("write back `active_paths`");
      expect(content, `${path} should read legacy abandoned as archived`).toContain("legacy `status: abandoned`");
      expect(content, `${path} should exclude archive paths`).toContain("research/_archive/");
      expect(content, `${path} should preserve flat mode`).toContain(
        "If no product directories exist, use flat `research/` single-product mode",
      );
      expect(content, `${path} should treat monorepo detection as secondary`).toContain(
        "do not require code or monorepo detection before using `research/{slug}/`",
      );
    }
  });

  it("keeps archived and deferred paths out of active target selection", () => {
    for (const path of activeResearchSkillPaths()) {
      const content = read(path);
      if (path.includes("/product-line/")) continue;

      expect(content, `${path} should exclude archived manifest statuses`).toContain(
        "exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`",
      );
      expect(content, `${path} should exclude archive scope paths`).toContain(
        "scope_path` under `research/_archive/`",
      );
      expect(content, `${path} should not say archive paths are selectable`).not.toMatch(
        /auto-select[^.\n]*research\/_archive|list[^.\n]*research\/_archive[^.\n]*candidate/i,
      );
    }
  });

  it("does not keep old app-scope terminology in active research-path skills", () => {
    const forbidden = [
      /app scope/i,
      /app-scoped/i,
      /monorepo mode/i,
      /monorepo scope/i,
      /research\/\{app(?:-name)?\}/,
      /specs\/\{app(?:-name)?\}/,
      /product-line prune/i,
    ];

    for (const path of activeResearchSkillPaths()) {
      const content = read(path);
      if (path.includes("/product-line/")) continue;

      for (const pattern of forbidden) {
        expect(content, `${path} should not match ${pattern}`).not.toMatch(pattern);
      }
      expect(content, `${path} should not use promote for research activation`).not.toMatch(
        /\$product-line promote|\/product-line promote/i,
      );
    }
  });

  it("records platform expansion candidates without requiring full tracks", () => {
    for (const path of pairs.platform) {
      const content = read(path);
      expect(content, `${path} should record 4-8 candidates`).toMatch(/Record the 4-8 candidates/i);
      expect(content, `${path} should mark non-selected candidates deferred`).toMatch(
        /non-selected candidates should default to `status: deferred`/i,
      );
      expect(content, `${path} should not require full research tracks`).toMatch(
        /does not require every candidate to become a full research track/i,
      );
    }
  });

  it("records materially different feature and UX route experiments as product paths", () => {
    for (const path of [...pairs.featureInterview, ...pairs.uxVariations]) {
      const content = read(path);
      expect(content, `${path} should mention route experiments`).toMatch(/route experiments/i);
      expect(content, `${path} should identify materially different product paths`).toMatch(
        /materially different products, apps, ICPs, or product lines/i,
      );
      expect(content, `${path} should avoid forcing downstream expansion`).toMatch(
        /do not force all divergent paths through downstream research|downstream research remains active-path-only/i,
      );
    }
  });

  it("distinguishes product-path terminology from git branch workflows", () => {
    for (const path of changedContracts) {
      const content = read(path);
      expect(content, `${path} should use product-path language`).toMatch(/product[- ]path|product line|product-line/i);
      expect(content, `${path} should not use legacy deferred_paths`).not.toContain("deferred_paths");
      if (/branch/i.test(content)) {
        expect(content, `${path} should distinguish research paths from git branches`).toMatch(
          /not git branch|not git branches|without treating them as git branches|instead of branch terminology/i,
        );
      }
    }
  });

  it("supports scoped outputs for lifecycle stage maps", () => {
    const stageSkills = [
      "onboarding-map",
      "conversion-map",
      "transaction-map",
      "retention-map",
      "expansion-map",
      "lifecycle-metrics",
    ];

    for (const skill of stageSkills) {
      for (const agent of ["codex", "claude"]) {
        const path = `packs/customer-lifecycle/${agent}/${skill}/SKILL.md`;
        const content = read(path);
        expect(content, `${path} should write the flat markdown output`).toContain(`research/${skill}.md`);
        expect(content, `${path} should write the flat interview output`).toContain(
          `research/${skill}-interview.md`,
        );
        expect(content, `${path} should write the scoped markdown output`).toContain(
          `research/{slug}/${skill}.md`,
        );
        expect(content, `${path} should write the scoped interview output`).toContain(
          `research/{slug}/${skill}-interview.md`,
        );
      }
    }
  });

  it("documents archive, restore, activate, and promote operations for product-line state", () => {
    for (const path of pairs.productLine) {
      const content = read(path);

      expect(content, `${path} should activate deferred/revisit paths`).toContain("activate <path-id>");
      expect(content, `${path} should archive paths`).toContain("archive <path-id>");
      expect(content, `${path} should restore paths`).toContain("restore <path-id>");
      expect(content, `${path} should reserve promote for apps graduation`).toContain("promote <path-id>");
      expect(content, `${path} should move archived research under research/_archive`).toContain(
        "research/_archive/{slug}/",
      );
      expect(content, `${path} should promote to apps/{slug}`).toContain("apps/{slug}/");
      expect(content, `${path} should read legacy active_path`).toContain("Read legacy `active_path`");
      expect(content, `${path} should read legacy abandoned`).toContain("Read legacy `status: abandoned`");
      expect(content, `${path} should prefer archived going forward`).toContain("prefer `status: archived`");
      expect(content, `${path} should treat promoted as code/app graduation`).toContain(
        "graduated to code/app scope",
      );
      expect(content, `${path} should remove archived paths from active_paths`).toMatch(
        /Remove the path ID from `active_paths`/,
      );
      expect(content, `${path} should record archived_at`).toContain("archived_at");
      expect(content, `${path} should record promoted_at`).toContain("promoted_at");
    }
  });

  it("documents flat-to-product-path ICP migration and cross-path summaries", () => {
    for (const path of pairs.icp) {
      const content = read(path);
      expect(content, `${path} should offer flat file migration`).toContain(
        "Migrate flat files when product paths are introduced",
      );
      expect(content, `${path} should keep top-level files as summaries`).toContain(
        "Leave or regenerate top-level files only when they are cross-path summaries",
      );
      expect(content, `${path} should preserve the old icp slug migration`).toContain(
        "research/icp-{slug}.md",
      );
      expect(content, `${path} should support product-path output`).toContain("research/{slug}/icp.md");
      expect(content, `${path} should support a top-level overview`).toContain("research/icp.md");
    }
  });
});
