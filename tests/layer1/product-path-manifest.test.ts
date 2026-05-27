import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoPath = (path: string) => resolve(TESTS_ROOT, "..", path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");

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

describe("product path manifest contracts", () => {
  it("defines the product path manifest schema and avoids deferred_paths terminology", () => {
    const schemaFields = [
      "active_path",
      "product_paths[]",
      "id",
      "label",
      "source_skill",
      "scope_path",
      "status",
      "reason",
      "evidence_refs",
      "revisit_trigger",
      "next_skill",
      "last_touched",
    ];

    const schemaContracts = [...pairs.concept, ...pairs.icp, ...pairs.platform, ...pairs.featureInterview];

    for (const path of schemaContracts) {
      const content = read(path);
      expect(content, `${path} should use research/.progress.yaml`).toContain("research/.progress.yaml");
      expect(content, `${path} should use product_paths`).toContain("product_paths");
      expect(content, `${path} should not use legacy deferred_paths`).not.toContain("deferred_paths");
      for (const field of schemaFields.slice(2)) {
        expect(content, `${path} should mention manifest field ${field}`).toContain(field);
      }
    }
  });

  it("records platform expansion candidates without requiring full tracks", () => {
    for (const path of pairs.platform) {
      const content = read(path);
      expect(content, `${path} should record 4-8 candidates`).toMatch(/Record the 4-8 candidates/i);
      expect(content, `${path} should mark non-selected candidates deferred`).toMatch(/non-selected candidates should default to `status: deferred`/i);
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
});
