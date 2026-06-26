import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoPath = (path: string) => resolve(TESTS_ROOT, "..", path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");

describe("upgrade-interrogation-pages skill contract", () => {
  const auditCommand = "node scripts/audit-interrogation-pages.mjs";
  const contracts = [
    {
      path: "packs/interrogation-page-admin/claude/upgrade-interrogation-pages/SKILL.md",
      command: "/upgrade-interrogation-pages",
    },
    {
      path: "packs/interrogation-page-admin/codex/upgrade-interrogation-pages/SKILL.md",
      command: "$upgrade-interrogation-pages",
    },
  ];

  it("adds mirrored ops skill contracts", () => {
    for (const contract of contracts) {
      expect(existsSync(repoPath(contract.path)), `${contract.path} exists`).toBe(true);
      const content = read(contract.path);

      expect(content, `${contract.path} name`).toContain("name: upgrade-interrogation-pages");
      expect(content, `${contract.path} type`).toMatch(/^type: ops$/m);
      expect(content, `${contract.path} version`).toMatch(/^version: v0\.\d+$/m);
      expect(content, `${contract.path} command`).toContain(`Invoke as \`${contract.command}\`.`);
      expect(content, `${contract.path} argument hint`).toContain("--repo <path>");
      expect(content, `${contract.path} apply flag`).toContain("--apply");
    }
  });

  it("defaults to audit dry-run and targets interrogation round pages", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} default audit`).toContain("Default mode is audit/dry-run.");
      expect(content, `${contract.path} no skill-name apply`).toContain(
        "The skill name alone is not apply intent",
      );
      expect(content, `${contract.path} no dry-run writes`).toContain(
        "In audit/dry-run mode, inspect pages and report drift without creating, editing, moving, or deleting any files.",
      );
      expect(content, `${contract.path} locate interrogation`).toContain(
        "Locate the project-root `interrogation/` directory",
      );
      expect(content, `${contract.path} enumerate round pages`).toContain(
        "Enumerate `interrogation/*.html` round pages.",
      );
    }
  });

  it("audits against local standards and the four open-question markers", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} standards sources`).toContain(
        "Read applicable local convention sources from `AGENTS.md`, `CLAUDE.md`, and active bundled `INTERROGATION-PAGE.md` files",
      );
      expect(content, `${contract.path} no external standards`).toContain("Do not fetch external standards.");
      for (const marker of [
        "data-open-input",
        "data-recommended-answer",
        "data-agent-confidence",
        "data-clarify-copy",
        "data-interrogation-status",
        "data-interrogation-round",
        "data-interrogation-gate",
        "data-answer-sidecar",
      ]) {
        expect(content, `${contract.path} ${marker}`).toContain(marker);
      }
    }
  });

  it("preserves page-specific substance and stops on likely content loss", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} read whole page`).toContain("Read the whole HTML file before judging it.");
      expect(content, `${contract.path} page substance`).toContain(
        "assumptions manifest, open questions, recommended answers, confidence badges, gate controls",
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

  it("archives before apply-mode replacements and routes to the auditor", () => {
    for (const contract of contracts) {
      const content = read(contract.path);

      expect(content, `${contract.path} archive path`).toContain(
        "docs/history/archive/YYYY-MM-DD/HHMMSS/interrogation/<filename>.html",
      );
      expect(content, `${contract.path} archive verify`).toContain(
        "Confirm every changed page has a matching archive copy.",
      );
      expect(content, `${contract.path} preserve round filename`).toContain(
        "Preserve the round filename, the `r{N}` round number, and the `data-answer-sidecar` path on rewrite.",
      );
      expect(content, `${contract.path} audit route`).toContain(auditCommand);
    }
  });

  it("is listed in pack metadata, skip list, and Codex UI metadata", () => {
    const pack = read("packs/interrogation-page-admin/PACK.md");
    expect(pack).toContain("`upgrade-interrogation-pages`");
    expect(pack).toContain("interrogation/*.html");

    const skipList = read("scripts/alignment-skip-list.txt");
    expect(skipList).toContain("upgrade-interrogation-pages");

    const openai = read("packs/interrogation-page-admin/codex/upgrade-interrogation-pages/agents/openai.yaml");
    expect(openai).toContain('display_name: "Upgrade Interrogation Pages"');
    expect(openai).toContain('short_description: "Audit and upgrade interrogation HTML pages"');
    expect(openai).toContain("Use $upgrade-interrogation-pages");
    expect(openai).toContain("allow_implicit_invocation: true");
  });
});
