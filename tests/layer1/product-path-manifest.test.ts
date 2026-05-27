import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoPath = (path: string) => resolve(TESTS_ROOT, "..", path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");

const pairs = {
  concept: [
    "global/codex/concept-exploration/SKILL.md",
    "global/claude/concept-exploration/SKILL.md",
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

  it("requires ICP to emit secondary ICP product paths with revisit triggers", () => {
    for (const path of pairs.icp) {
      const content = read(path);
      expect(content, `${path} should convert secondary ICPs`).toMatch(/secondary ICPs/i);
      expect(content, `${path} should cover Cross-ICP Analysis`).toContain("Cross-ICP Analysis");
      expect(content, `${path} should record revisit triggers`).toContain("revisit_trigger");
      expect(content, `${path} should keep primary ICP active`).toMatch(/primary ICP as the `active_path`/i);
      expect(content, `${path} should not force all deferred paths through full research`).toMatch(
        /do not run full competitive analysis, positioning, journey mapping, UX, or specs for every deferred path/i,
      );
    }
  });

  it("keeps competitive analysis active-path-only while summarizing deferred path implications", () => {
    for (const path of pairs.competitive) {
      const content = read(path);
      expect(content, `${path} should read manifest`).toContain("research/.progress.yaml");
      expect(content, `${path} should scope full analysis to active path`).toMatch(/scope the full competitive analysis to the manifest `active_path`/i);
      expect(content, `${path} should add deferred implications section`).toContain(
        "## Implications for Deferred Product Paths",
      );
      expect(content, `${path} should not broaden into all paths`).toMatch(
        /Do not broaden standard mode into full competitive analysis for every deferred path/i,
      );
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

  it("makes research-roadmap read and report active and deferred product path state", () => {
    for (const path of pairs.researchRoadmap) {
      const content = read(path);
      expect(content, `${path} should read manifest`).toContain("research/.progress.yaml");
      expect(content, `${path} should show active/deferred paths`).toMatch(/show active and deferred product paths/i);
      expect(content, `${path} should queue only active or promoted paths`).toMatch(/only for `active` or `promoted` paths/i);
      expect(content, `${path} should keep parked paths visible with revisit triggers`).toMatch(
        /`revisit_trigger` and `next_skill`/,
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
