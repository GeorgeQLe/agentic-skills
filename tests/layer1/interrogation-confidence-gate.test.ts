import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = resolve(TESTS_ROOT, "..");
const GENERATOR = resolve(REPO_ROOT, "scripts/upgrade-interrogation-page.mjs");

// Participating skills (both mirrors) — must match INTERROGATION_SKILLS in the generator.
const participatingSkillDirs = [
  "base/claude/idea-scope-brief",
  "base/codex/idea-scope-brief",
  "packs/business-research/claude/customer-discovery",
  "packs/business-research/claude/positioning",
  "packs/business-research/codex/customer-discovery",
  "packs/business-research/codex/positioning",
  "packs/product-design/claude/brainstorm",
  "packs/product-design/codex/brainstorm",
  "packs/product-design/claude/consolidate-prototypes",
  "packs/product-design/claude/spec-interview",
  "packs/product-design/claude/state-model",
  "packs/product-design/claude/ui-interview",
  "packs/product-design/claude/user-flow-map",
  "packs/product-design/claude/ux-variations",
  "packs/product-design/codex/consolidate-prototypes",
  "packs/product-design/codex/spec-interview",
  "packs/product-design/codex/state-model",
  "packs/product-design/codex/ui-interview",
  "packs/product-design/codex/user-flow-map",
  "packs/product-design/codex/ux-variations",
];

describe("interrogation confidence-gate contract", () => {
  it("the canonical convention treats open answers as evidence to validate before downstream use", () => {
    const text = readFileSync(join(REPO_ROOT, "docs/interrogation-page-convention.md"), "utf8");
    expect(text).toContain("Open-answer evidence validation");
    expect(text).toContain("not automatically validated facts");
    expect(text).toContain("Validation happens during compiled-answer consumption");
    expect(text).toContain("defer deeper research as an explicit research question or source-plan item");
    expect(text).toContain("`hunch/inferred` and `needs-research` claims may be carried forward as research questions");
    expect(text).toContain("Founder-supplied phrasing without provenance is hunch language");
  });

  for (const dir of participatingSkillDirs) {
    it(`${dir}/SKILL.md carries the confidence-gate blocking language and open-input rule`, () => {
      const text = readFileSync(join(REPO_ROOT, dir, "SKILL.md"), "utf8");
      expect(text, `${dir} interrogation section`).toContain("## Interrogation Page");
      expect(text, `${dir} blocking language`).toContain("cannot advance to stage one");
      expect(text, `${dir} open-input rule`).toContain("at least one genuinely open input");
    });

    it(`${dir}/INTERROGATION-PAGE.md carries the confidence gate and ≥1-open-input rule`, () => {
      const text = readFileSync(join(REPO_ROOT, dir, "INTERROGATION-PAGE.md"), "utf8");
      expect(text, `${dir} bundle blocking language`).toContain("cannot advance to stage one until");
      expect(text, `${dir} bundle open-input rule`).toContain("must contain at least one genuinely open input");
      expect(text, `${dir} bundle evidence validation`).toContain("Open-answer evidence validation");
      expect(text, `${dir} bundle validation timing`).toContain("Validation happens during compiled-answer consumption");
      expect(text, `${dir} bundle research deferral`).toContain("defer deeper research as an explicit research question or source-plan item");
      expect(text, `${dir} bundle needs-research handling`).toContain("`hunch/inferred` and `needs-research` claims may be carried forward as research questions");
      expect(text, `${dir} bundle round file naming`).toContain("interrogation/" + dir.split("/").pop() + "-r{N}-{branch}.html");
      expect(text, `${dir} bundle root command`).toContain("top-level `command`");
      expect(text, `${dir} bundle invocation comment`).toContain("# Invoke with: <parent-skill-command>");
      expect(text, `${dir} bundle command yaml`).toContain('command: "<parent-skill-command>"');
      expect(text, `${dir} bundle first real command key`).toContain("first real YAML key");
      expect(text, `${dir} bundle matching command metadata`).toContain("keep those values identical");
      expect(text, `${dir} bundle no separate command copy`).toContain("does not need a separate command clipboard item");
    });
  }

  it("the generated bundles are in sync (dry-run reports Updated: 0)", () => {
    const result = spawnSync(process.execPath, [GENERATOR, "--dry-run"], { encoding: "utf8" });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Updated: 0");
  });

  it("the generator passes its --check drift gate", () => {
    const result = spawnSync(process.execPath, [GENERATOR, "--check"], { encoding: "utf8" });
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Generated bundles: 20 ownable, exact");
  });
});
