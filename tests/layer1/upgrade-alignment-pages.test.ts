import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoPath = (path: string) => resolve(TESTS_ROOT, "..", path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");

describe("upgrade-alignment-pages skill contract", () => {
  const contracts = [
    {
      path: "packs/alignment-page-admin/claude/upgrade-alignment-pages/SKILL.md",
      command: "/upgrade-alignment-pages",
      compileCommand: "/compile-central-alignment",
    },
    {
      path: "packs/alignment-page-admin/codex/upgrade-alignment-pages/SKILL.md",
      command: "$upgrade-alignment-pages",
      compileCommand: "$compile-central-alignment",
    },
  ];

  it("adds mirrored ops skill contracts", () => {
    for (const contract of contracts) {
      expect(existsSync(repoPath(contract.path)), `${contract.path} exists`).toBe(true);
      const content = read(contract.path);

      expect(content, `${contract.path} name`).toContain("name: upgrade-alignment-pages");
      expect(content, `${contract.path} type`).toMatch(/^type: ops$/m);
      expect(content, `${contract.path} version`).toMatch(/^version: v0\.\d+$/m);
      expect(content, `${contract.path} command`).toContain(`Invoke as \`${contract.command}\`.`);
      expect(content, `${contract.path} argument hint`).toContain("--repo <path>");
      expect(content, `${contract.path} apply flag`).toContain("--apply");
    }
  });

  it("defaults to audit dry-run and excludes the central index", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} default audit`).toContain("Default mode is audit/dry-run.");
      expect(content, `${contract.path} no skill-name apply`).toContain(
        "The skill name alone is not apply intent",
      );
      expect(content, `${contract.path} no dry-run writes`).toContain(
        "In audit/dry-run mode, inspect pages and report drift without creating, editing, moving, or deleting any files.",
      );
      expect(content, `${contract.path} locate alignment`).toContain(
        "Locate the project-root `alignment/` directory",
      );
      expect(content, `${contract.path} exclude index`).toContain(
        "Enumerate `alignment/*.html`, excluding `alignment/index.html`.",
      );
    }
  });

  it("audits against local standards and required page features", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} standards sources`).toContain(
        "Read applicable local convention sources from `AGENTS.md`, `CLAUDE.md`, and active bundled `ALIGNMENT-PAGE.md` files",
      );
      expect(content, `${contract.path} no external standards`).toContain("Do not fetch external standards.");
      for (const feature of [
        "dark-mode styling",
        "inline approval gates",
        "section feedback controls",
        "feedback-only YAML",
        "final answer YAML",
        "copy fallback behavior",
        "unanswered-question handling",
        "diff/change highlighting",
      ]) {
        expect(content, `${contract.path} ${feature}`).toContain(feature);
      }
    }
  });

  it("preserves page-specific substance and stops on likely content loss", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} read whole page`).toContain("Read the whole HTML file before judging it.");
      expect(content, `${contract.path} page substance`).toContain(
        "research findings, evidence/source matrices, assumptions, decisions, open questions, approval gates, review notes",
      );
      expect(content, `${contract.path} risk status`).toContain("blocked-content-loss-risk");
      expect(content, `${contract.path} stop on risk`).toContain(
        "If a page's structure is too ambiguous to upgrade while preserving substantive content, do not rewrite it.",
      );
      expect(content, `${contract.path} generic template ban`).toContain(
        "Do not replace page-specific content with a generic template.",
      );
    }
  });

  it("archives before apply-mode replacements and routes index regeneration", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} archive path`).toContain(
        "docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/<filename>.html",
      );
      expect(content, `${contract.path} archive verify`).toContain(
        "Confirm every changed page has a matching archive copy.",
      );
      expect(content, `${contract.path} preserve verify`).toContain(
        "confirm the preserved title, decisions/findings, questions, and gates still exist",
      );
      expect(content, `${contract.path} no index mutation`).toContain(
        "Do not modify `alignment/index.html`",
      );
      expect(content, `${contract.path} compile route`).toContain(contract.compileCommand);
    }
  });

  it("is listed in pack metadata, skip list, and Codex UI metadata", () => {
    const pack = read("packs/alignment-page-admin/PACK.md");
    expect(pack).toContain("`upgrade-alignment-pages`");
    expect(pack).toContain("alignment/*.html");

    const skipList = read("scripts/alignment-skip-list.txt");
    expect(skipList).toContain("upgrade-alignment-pages");

    const openai = read("packs/alignment-page-admin/codex/upgrade-alignment-pages/agents/openai.yaml");
    expect(openai).toContain('display_name: "Upgrade Alignment Pages"');
    expect(openai).toContain('short_description: "Audit and upgrade alignment HTML pages"');
    expect(openai).toContain("Use $upgrade-alignment-pages");
    expect(openai).toContain("allow_implicit_invocation: true");
  });
});
