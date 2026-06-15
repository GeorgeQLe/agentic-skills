import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { describe, expect, it } from "vitest";

const ROOT = resolve(import.meta.dirname, "../..");
const FRAMEWORK_PARENTS = new Set([
  "competitive-analysis",
  "customer-discovery",
  "positioning",
  "journey-map",
]);

const searchRoots = [
  "packs",
  ".codex/skills",
  ".claude/skills",
  "packages/skillpacks/build/packs",
].map((path) => resolve(ROOT, path));

type FrameworkSkill = {
  child: string;
  file: string;
  parent: string;
};

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];

  const entries = readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "archive" || entry.name === "node_modules") continue;
      files.push(...walk(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name === "SKILL.md") files.push(fullPath);
  }

  return files;
}

function frameworkSkillFromNestedPath(file: string): FrameworkSkill | null {
  const parts = relative(ROOT, file).split(sep);
  const frameworksIndex = parts.indexOf("frameworks");
  if (frameworksIndex < 1) return null;

  const parent = parts[frameworksIndex - 1];
  const child = parts[frameworksIndex + 1];
  if (!FRAMEWORK_PARENTS.has(parent) || !child) return null;

  return { child, file, parent };
}

function frameworkSkillFromInstalledAlias(file: string): FrameworkSkill | null {
  const parts = relative(ROOT, file).split(sep);
  if (parts.length !== 4 || parts[1] !== "skills" || parts[3] !== "SKILL.md") return null;
  if (parts[0] !== ".codex" && parts[0] !== ".claude") return null;

  const content = readFileSync(file, "utf8");
  if (!content.includes("invocation: sub-skill")) return null;

  const parent = content.match(/^parent: (.+)$/m)?.[1];
  if (!parent || !FRAMEWORK_PARENTS.has(parent)) return null;

  return { child: parts[2], file, parent };
}

function activeFrameworkSkills() {
  return searchRoots
    .flatMap(walk)
    .map((file) => frameworkSkillFromNestedPath(file) ?? frameworkSkillFromInstalledAlias(file))
    .filter((skill): skill is FrameworkSkill => skill !== null)
    .sort((a, b) => relative(ROOT, a.file).localeCompare(relative(ROOT, b.file)));
}

function activeParentSkillPaths() {
  const paths: string[] = [];
  const roots = [
    "packs/business-research/codex",
    "packs/business-research/claude",
    ".codex/skills",
    ".claude/skills",
    "packages/skillpacks/build/packs/business-research/codex",
    "packages/skillpacks/build/packs/business-research/claude",
  ];

  for (const root of roots) {
    for (const parent of ["competitive-analysis", "customer-discovery", "positioning"]) {
      paths.push(resolve(ROOT, root, parent, "SKILL.md"));
    }
  }

  for (const root of [
    "packs/customer-lifecycle/codex",
    "packs/customer-lifecycle/claude",
    "packages/skillpacks/build/packs/customer-lifecycle/codex",
    "packages/skillpacks/build/packs/customer-lifecycle/claude",
  ]) {
    paths.push(resolve(ROOT, root, "journey-map", "SKILL.md"));
  }

  return paths.filter(existsSync).sort();
}

function routePrefix(file: string) {
  return file.includes(`${sep}claude${sep}`) || file.includes(`${sep}.claude${sep}`) ? "/" : "$";
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

describe("framework handoff routing", () => {
  it("keeps framework subskills parent-routed and free of path-shaped child handoffs", () => {
    const skills = activeFrameworkSkills();
    expect(skills.length, "framework subskill inventory should be non-empty").toBeGreaterThan(0);

    for (const { child, file, parent } of skills) {
      const relPath = relative(ROOT, file);
      const prefix = routePrefix(file);
      const command = `${prefix}${parent}`;
      const content = readFileSync(file, "utf8");
      const directChildRoute = new RegExp(
        `(?:[$/])?${escapeRegExp(parent)}/frameworks/${escapeRegExp(child)}(?:\\s+research/[^\\s)]+)?`,
      );
      const placeholderChildRoute = new RegExp(
        `(?:[$/])?${escapeRegExp(parent)}/frameworks/(?:\\.\\.\\.|<[^>\\s]+>|\\[[^\\]\\s]+\\])`,
      );

      expect(content, `${relPath} should declare subskill invocation`).toContain("invocation: sub-skill");
      expect(content, `${relPath} should declare its parent`).toContain(`parent: ${parent}`);
      expect(content, `${relPath} should route through ${command}`).toContain(
        `Run only through the parent orchestrator \`${command}\``,
      );
      expect(content, `${relPath} should preserve product-path continuation through the parent`).toContain(
        `${command} research/afps-tracker`,
      );
      expect(content, `${relPath} should not expose path-shaped child framework commands`).not.toMatch(
        directChildRoute,
      );
      expect(content, `${relPath} should not expose placeholder child framework commands`).not.toMatch(
        placeholderChildRoute,
      );
      expect(content, `${relPath} should not emit next-routing labels`).not.toMatch(
        /Recommended next (skill|command):/i,
      );
    }
  });

  it("documents parent self-reinvocation for all framework-loop orchestrators", () => {
    const paths = activeParentSkillPaths();
    expect(paths.length, "parent orchestrator inventory should be non-empty").toBeGreaterThan(0);

    for (const file of paths) {
      const relPath = relative(ROOT, file);
      const parent = relPath.split(sep).at(-2);
      const prefix = routePrefix(file);
      const command = `${prefix}${parent}`;
      const content = readFileSync(file, "utf8");

      expect(content, `${relPath} should declare orchestrator invocation`).toContain("invocation: orchestrator");
      expect(content, `${relPath} should use parent self-reinvocation for pending frameworks`).toContain(
        `the only user-facing continuation route is re-invoking \`${command}\``,
      );
      expect(content, `${relPath} should preserve product-path continuation through the parent`).toContain(
        `${command} research/afps-tracker`,
      );
      expect(content, `${relPath} should reject path-shaped child framework commands`).toContain(
        "Never tell the user to run a path-shaped child framework command",
      );
    }
  });
});
