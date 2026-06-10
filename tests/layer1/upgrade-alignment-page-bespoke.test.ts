import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const TESTS_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const REPO_ROOT = resolve(TESTS_ROOT, "..");
const repoPath = (path: string) => resolve(REPO_ROOT, path);
const SCRIPT = repoPath("scripts/upgrade-alignment-page.mjs");

const POINTER_PREFIX = "Follow the shared Alignment Page convention in CLAUDE.md";
const STUB_PREFIX = "When this skill produces durable deliverables";

function parseListFile(path: string): Set<string> {
  const names = new Set<string>();
  if (!existsSync(path)) return names;
  for (const rawLine of readFileSync(path, "utf8").split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    if (line) names.add(line);
  }
  return names;
}

function walkSkillFiles(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (entry === "archive" || entry === "node_modules" || entry === ".git") continue;
    const abs = join(dir, entry);
    const stat = statSync(abs);
    if (stat.isDirectory()) walkSkillFiles(abs, out);
    if (stat.isFile() && entry === "SKILL.md") out.push(abs);
  }
  return out;
}

function alignmentSectionBody(content: string): string | null {
  const m = content.match(/^(#{2,3}) Alignment Page$/m);
  if (!m || m.index === undefined) return null;
  const start = m.index + m[0].length;
  const level = m[1].length;
  const next = new RegExp(`\\n#{1,${level}} (?!#)`, "g");
  next.lastIndex = start;
  const boundary = next.exec(content);
  const end = boundary ? boundary.index : content.length;
  return content.slice(start, end).trim();
}

function isOwnable(body: string | null): boolean {
  if (body === null) return false;
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .some((p) => p.startsWith(POINTER_PREFIX) || p.startsWith(STUB_PREFIX));
}

// Re-derive the bespoke classification straight from active SKILL.md files,
// mirroring the generator's logic, so the allowlist is checked against the
// repo state rather than the script's own output.
function repoBespokeClassification(): Map<string, { bespokeFiles: string[]; ownableFiles: string[] }> {
  const skipped = parseListFile(repoPath("scripts/alignment-skip-list.txt"));
  const files = [...walkSkillFiles(repoPath("global")), ...walkSkillFiles(repoPath("packs"))]
    .filter((file) => /(^|\/)(codex|claude)\//.test(file))
    .sort();
  const classification = new Map<string, { bespokeFiles: string[]; ownableFiles: string[] }>();
  for (const file of files) {
    const parts = file.split("/");
    const skillName = parts[parts.length - 2];
    if (skipped.has(skillName)) continue;
    const body = alignmentSectionBody(readFileSync(file, "utf8"));
    if (body === null) continue;
    if (!classification.has(skillName)) {
      classification.set(skillName, { bespokeFiles: [], ownableFiles: [] });
    }
    classification.get(skillName)![isOwnable(body) ? "ownableFiles" : "bespokeFiles"].push(file);
  }
  return classification;
}

describe("alignment bespoke allowlist matches repo state", () => {
  it("exists and matches the set of bespoke alignment sections exactly", () => {
    const allowlistPath = repoPath("scripts/alignment-bespoke-list.txt");
    expect(existsSync(allowlistPath), "scripts/alignment-bespoke-list.txt exists").toBe(true);

    const allowlist = parseListFile(allowlistPath);
    const bespokeNames = new Set(
      [...repoBespokeClassification()]
        .filter(([, entry]) => entry.bespokeFiles.length > 0)
        .map(([name]) => name),
    );
    expect([...allowlist].sort()).toEqual([...bespokeNames].sort());
  });

  it("lists only skills that are bespoke in both mirrors", () => {
    const allowlist = parseListFile(repoPath("scripts/alignment-bespoke-list.txt"));
    const classification = repoBespokeClassification();
    for (const name of allowlist) {
      const entry = classification.get(name);
      expect(entry, `${name} has alignment sections`).toBeDefined();
      expect(entry!.ownableFiles, `${name} has no generated mirror`).toEqual([]);
      const mirrors = entry!.bespokeFiles;
      expect(mirrors.some((f) => /\/claude\//.test(f)), `${name} bespoke in claude mirror`).toBe(true);
      expect(mirrors.some((f) => /\/codex\//.test(f)), `${name} bespoke in codex mirror`).toBe(true);
    }
  });
});

describe("upgrade-alignment-page bespoke diagnostics", () => {
  const tempRoots: string[] = [];

  afterEach(() => {
    for (const root of tempRoots.splice(0)) rmSync(root, { recursive: true, force: true });
  });

  const CONVENTION = [
    "# Alignment Page Convention",
    "",
    "<!-- alignment-convention:start -->",
    "Convention body for {skill-name}.",
    "",
    "{{SKILL_SPECIFIC_GATES}}",
    "",
    "{{SKILL_VISUAL_TIER}}",
    "",
    "{{SKILL_GLOSSARY_GATE}}",
    "<!-- alignment-convention:end -->",
    "",
  ].join("\n");

  function makeFixtureRoot(): string {
    const root = mkdtempSync(join(tmpdir(), "alignment-bespoke-"));
    tempRoots.push(root);
    mkdirSync(join(root, "docs"), { recursive: true });
    mkdirSync(join(root, "scripts"), { recursive: true });
    writeFileSync(join(root, "docs/alignment-page-convention.md"), CONVENTION);
    return root;
  }

  function writeSkill(root: string, tool: "claude" | "codex", skillName: string, sectionBody: string): string {
    const dir = join(root, "packs/fixture-pack", tool, skillName);
    mkdirSync(dir, { recursive: true });
    const relPath = `packs/fixture-pack/${tool}/${skillName}/SKILL.md`;
    writeFileSync(
      join(root, relPath),
      `---\nname: ${skillName}\nversion: v0.0\n---\n\n# ${skillName}\n\n## Alignment Page\n\n${sectionBody}\n`,
    );
    return relPath;
  }

  const stubBody = (skillName: string) =>
    `When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following \`ALIGNMENT-PAGE.md\` in this skill's directory. Output: \`alignment/${skillName}-{topic}.html\`.`;

  const BESPOKE_BODY = "Hand-authored alignment rules for this skill. No generated stub here.";

  function writeAllowlist(root: string, names: string[]): void {
    writeFileSync(join(root, "scripts/alignment-bespoke-list.txt"), `${names.join("\n")}\n`);
  }

  function runScript(root: string) {
    return spawnSync(process.execPath, [SCRIPT, "--dry-run", "--root", root], { encoding: "utf8" });
  }

  it("fails on a bespoke section missing from the allowlist", () => {
    const root = makeFixtureRoot();
    const claudePath = writeSkill(root, "claude", "stray-skill", BESPOKE_BODY);
    writeSkill(root, "codex", "stray-skill", BESPOKE_BODY);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Unlisted bespoke section for "stray-skill"');
    expect(result.stderr).toContain(claudePath);
    expect(result.stderr).toContain("scripts/alignment-bespoke-list.txt");
  });

  it("fails on a mixed generated/bespoke sibling pair even when allowlisted", () => {
    const root = makeFixtureRoot();
    writeSkill(root, "claude", "half-skill", stubBody("half-skill"));
    const codexPath = writeSkill(root, "codex", "half-skill", BESPOKE_BODY);
    writeAllowlist(root, ["half-skill"]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Mixed siblings for "half-skill"');
    expect(result.stderr).toContain(codexPath);
  });

  it("passes on an allowlisted symmetric bespoke pair", () => {
    const root = makeFixtureRoot();
    writeSkill(root, "claude", "hand-skill", BESPOKE_BODY);
    writeSkill(root, "codex", "hand-skill", BESPOKE_BODY);
    writeAllowlist(root, ["hand-skill"]);

    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Bespoke allowlist: 1 skills, exact");
  });

  it("fails on a stale allowlist entry with no bespoke section", () => {
    const root = makeFixtureRoot();
    writeSkill(root, "claude", "converted-skill", stubBody("converted-skill"));
    writeSkill(root, "codex", "converted-skill", stubBody("converted-skill"));
    writeAllowlist(root, ["converted-skill"]);

    const result = runScript(root);
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Stale allowlist entry "converted-skill"');
  });

  it("passes on a clean stub-only repo with no allowlist file", () => {
    const root = makeFixtureRoot();
    writeSkill(root, "claude", "clean-skill", stubBody("clean-skill"));
    writeSkill(root, "codex", "clean-skill", stubBody("clean-skill"));

    const result = runScript(root);
    expect(result.stderr).toBe("");
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Bespoke allowlist: 0 skills, exact");
  });
});
