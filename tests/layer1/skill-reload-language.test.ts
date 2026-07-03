import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = resolve(TESTS_ROOT, "..");
const repoPath = (path: string) => resolve(REPO_ROOT, path);
const read = (path: string) => readFileSync(repoPath(path), "utf8");

const reloadExpectations = [
  "/reload-skills",
  "/clear",
  "top-level `.claude/skills` directory did not exist at session start",
  "fresh Codex CLI session",
  "`$` skill list remains stale",
];

describe("skill availability reload language", () => {
  it("tightens targeted skill-dev reload notes in both mirrors", () => {
    const targets = [
      { path: "packs/skill-dev/claude/create-local-skill/SKILL.md" },
      { path: "packs/skill-dev/codex/create-local-skill/SKILL.md" },
    ];

    for (const target of targets) {
      const content = read(target.path);

      expect(content, `${target.path} should be version bumped`).toMatch(/^version: v(?:0\.[1-9]\d*|[1-9]\d*\.\d+)$/m);
      for (const expected of reloadExpectations) {
        expect(content, `${target.path} should contain ${expected}`).toContain(expected);
      }
    }
  });

  it("keeps provisioned missing-skill fallback guidance runner-aware", () => {
    const surfaces = [
      { path: "CLAUDE.md", command: "/pack", skills: "/skills" },
      { path: "AGENTS.md", command: "$pack", skills: "$skills" },
      { path: "packs/base/claude/provision-agentic-config/SKILL.md", command: "/pack", skills: "/skills" },
      { path: "packs/base/codex/provision-agentic-config/SKILL.md", command: "$pack", skills: "$skills" },
    ];

    for (const surface of surfaces) {
      const content = read(surface.path);

      expect(content, `${surface.path} provision version`).toMatch(
        /<!-- provision-agentic-config v\d+\.\d+ -->/,
      );
      expect(content, `${surface.path} should route skill or pack installs`).toContain(
        "npx skillpacks install <pack-or-skill>",
      );
      expect(content, `${surface.path} should suggest skills browse`).toContain(surface.skills);
      for (const expected of reloadExpectations) {
        expect(content, `${surface.path} should contain ${expected}`).toContain(expected);
      }
    }

    for (const path of [
      "packs/base/claude/provision-agentic-config/SKILL.md",
      "packs/base/codex/provision-agentic-config/SKILL.md",
    ]) {
      expect(read(path), `${path} skill version`).toMatch(/^version: v\d+\.\d+$/m);
    }
  });

  it("rejects stale active non-archive reload phrases", () => {
    const stalePatterns = [
      /fresh Claude Code or Codex session/,
      /fresh Claude Code \/ Codex session/,
      /Codex \/ Claude Code may need a fresh session/,
      /new session is needed/,
      /Codex desktop sessions may list newly created skills only after the active skill registry refreshes/,
    ];
    const roots = ["base", "packs", "scripts", "README.md", "CLAUDE.md", "AGENTS.md"];
    const files: string[] = [];

    const collect = (absolutePath: string) => {
      const relativePath = absolutePath.slice(REPO_ROOT.length + 1);
      const pathSegments = relativePath.split("/");
      if (pathSegments.includes("archive") || pathSegments.includes("node_modules")) return;

      const stats = statSync(absolutePath);
      if (stats.isDirectory()) {
        for (const entry of readdirSync(absolutePath)) collect(join(absolutePath, entry));
        return;
      }

      files.push(relativePath);
    };

    for (const root of roots) collect(repoPath(root));

    const offenders = files.flatMap((file) => {
      const content = read(file);
      return stalePatterns
        .filter((pattern) => pattern.test(content))
        .map((pattern) => `${file}: ${pattern.source}`);
    });

    expect(offenders).toEqual([]);
  });
});
