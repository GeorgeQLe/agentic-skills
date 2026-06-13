import { execFileSync, spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const SCANNER = join(REPO_ROOT, "packs/project-fleet/codex/skill-inventory/scripts/skill-inventory.sh");
const CLAUDE_SCANNER = join(REPO_ROOT, "packs/project-fleet/claude/skill-inventory/scripts/skill-inventory.sh");
const SKILL_LINKS = join(REPO_ROOT, "scripts/skill-links.sh");

function shellQuote(value: string): string {
  return `'${value.replace(/'/g, "'\\''")}'`;
}

function runBash(script: string, cwd: string): string {
  return execFileSync("bash", ["-lc", script], {
    cwd,
    encoding: "utf8",
  });
}

function createControlRepo(): string {
  const control = mkdtempSync(join(tmpdir(), "skill-inventory-control-"));
  mkdirSync(join(control, "scripts"), { recursive: true });
  mkdirSync(join(control, "tasks"), { recursive: true });
  copyFileSync(SKILL_LINKS, join(control, "scripts", "skill-links.sh"));
  return control;
}

function createSkillSource(control: string, name: string, version = "v0.0"): string {
  const source = join(control, "canonical", name);
  mkdirSync(source, { recursive: true });
  writeFileSync(
    join(source, "SKILL.md"),
    [
      "---",
      `name: ${name}`,
      `description: ${name} fixture`,
      `version: ${version}`,
      "---",
      "",
      `# ${name}`,
      "",
    ].join("\n"),
  );
  writeFileSync(join(source, "notes.txt"), `initial ${name}\n`);
  return source;
}

function installManaged(control: string, source: string, target: string): void {
  runBash(
    [
      "set -euo pipefail",
      `source ${shellQuote(join(control, "scripts", "skill-links.sh"))}`,
      `sync_skill_install ${shellQuote(source)} ${shellQuote(target)}`,
    ].join("\n"),
    control,
  );
}

describe("skill-inventory scanner", () => {
  it("reports managed skill drift categories without mutating downstream repos", () => {
    const control = createControlRepo();
    const downstream = join(control, "downstream-a");
    mkdirSync(join(downstream, ".codex", "skills"), { recursive: true });
    mkdirSync(join(downstream, ".claude", "skills"), { recursive: true });

    const okSource = createSkillSource(control, "ok-skill", "v0.1");
    installManaged(control, okSource, join(downstream, ".codex", "skills", "ok-skill"));

    const staleSource = createSkillSource(control, "stale-skill", "v0.2");
    installManaged(control, staleSource, join(downstream, ".codex", "skills", "stale-skill"));
    writeFileSync(join(staleSource, "notes.txt"), "changed after install\n");

    const unknownSource = createSkillSource(control, "unknown-skill", "v0.3");
    const unknownTarget = join(downstream, ".codex", "skills", "unknown-skill");
    mkdirSync(unknownTarget, { recursive: true });
    writeFileSync(
      join(unknownTarget, ".agentic-skills-managed"),
      [`source=${unknownSource}`, "managed_by=agentic-skills", "source_version=v0.3", ""].join("\n"),
    );
    copyFileSync(join(unknownSource, "SKILL.md"), join(unknownTarget, "SKILL.md"));

    const missingTarget = join(downstream, ".claude", "skills", "missing-source-skill");
    mkdirSync(missingTarget, { recursive: true });
    writeFileSync(
      join(missingTarget, ".agentic-skills-managed"),
      [
        `source=${join(control, "canonical", "deleted-skill")}`,
        "managed_by=agentic-skills",
        "source_version=v0.4",
        "source_sha=abc123",
        "",
      ].join("\n"),
    );
    writeFileSync(join(missingTarget, "SKILL.md"), "---\nname: missing-source-skill\ndescription: missing\nversion: v0.4\n---\n");

    const archiveSource = join(control, "canonical", "pinned-skill", "archive", "v0.5");
    mkdirSync(archiveSource, { recursive: true });
    writeFileSync(join(archiveSource, "SKILL.md"), "---\nname: pinned-skill\ndescription: pinned\nversion: v0.5\n---\n");
    symlinkSync(archiveSource, join(downstream, ".claude", "skills", "pinned-skill"));

    const manualTarget = join(downstream, ".claude", "skills", "manual-skill");
    mkdirSync(manualTarget, { recursive: true });
    writeFileSync(join(manualTarget, "SKILL.md"), "---\nname: manual-skill\ndescription: manual\nversion: v9.9\n---\n");

    writeFileSync(
      join(control, "tasks", "downstream-repos.md"),
      [
        "# Downstream Repos",
        "",
        "| ID | Repository | Local Path | State |",
        "| --- | --- | --- | --- |",
        "| a | owner/downstream-a | `../downstream-a` | seeded |",
        "",
      ].join("\n"),
    );

    const beforeMarker = readFileSync(join(downstream, ".codex", "skills", "stale-skill", ".agentic-skills-managed"), "utf8");
    const markdown = execFileSync("bash", [SCANNER, "--out", "-"], {
      cwd: control,
      encoding: "utf8",
    });
    const afterMarker = readFileSync(join(downstream, ".codex", "skills", "stale-skill", ".agentic-skills-managed"), "utf8");

    expect(afterMarker).toBe(beforeMarker);
    for (const status of ["ok", "stale", "unknown", "missing-source", "pinned", "not-managed"]) {
      expect(markdown, status).toContain(`| ${status} |`);
    }
    expect(markdown).toContain("scripts/pack.sh refresh");
    expect(markdown).toContain("No downstream repositories were modified");
    expect(markdown).toContain("V1 has no cleanup, apply, refresh, or delete route");

    const json = execFileSync("bash", [SCANNER, "--repo", downstream, "--format", "json", "--out", "-"], {
      cwd: control,
      encoding: "utf8",
    });
    const parsed = JSON.parse(json) as {
      report_only: boolean;
      summary: Record<string, number>;
      installs: Array<{ status: string; skill: string }>;
    };
    expect(parsed.report_only).toBe(true);
    expect(parsed.summary.ok).toBe(1);
    expect(parsed.summary.stale).toBe(1);
    expect(parsed.summary.unknown).toBe(1);
    expect(parsed.summary["missing-source"]).toBe(1);
    expect(parsed.summary.pinned).toBe(1);
    expect(parsed.summary["not-managed"]).toBe(1);
    expect(parsed.installs.map((row) => row.status).sort()).toEqual([
      "missing-source",
      "not-managed",
      "ok",
      "pinned",
      "stale",
      "unknown",
    ]);
  });

  it("fails non-destructively with a manifest template when no local paths exist", () => {
    const control = createControlRepo();
    writeFileSync(
      join(control, "tasks", "downstream-repos.md"),
      [
        "# Downstream Repos",
        "",
        "| ID | Repository | Path | State |",
        "| --- | --- | --- | --- |",
        "| a | owner/downstream-a | owner/downstream-a | seeded |",
        "",
      ].join("\n"),
    );

    const result = spawnSync("bash", [SCANNER], {
      cwd: control,
      encoding: "utf8",
    });

    expect(result.status).toBe(2);
    expect(result.stderr).toContain("No local downstream repository paths were found");
    expect(result.stderr).toContain("| ID | Repository | Local Path | State |");
    expect(result.stderr).toContain("No downstream repositories were modified");
    expect(existsSync(join(control, "tasks", "skill-inventory.md"))).toBe(false);
  });

  it("keeps mirrored scanner scripts identical", () => {
    expect(readFileSync(CLAUDE_SCANNER, "utf8")).toBe(readFileSync(SCANNER, "utf8"));
  });
});

describe("skill-inventory skill contracts", () => {
  const skillPaths = [
    "packs/project-fleet/codex/skill-inventory/SKILL.md",
    "packs/project-fleet/claude/skill-inventory/SKILL.md",
  ];

  for (const relativePath of skillPaths) {
    it(`${relativePath} declares report-only inventory behavior`, () => {
      const content = readFileSync(resolve(REPO_ROOT, relativePath), "utf8");
      expect(content).toMatch(/^version: v0\.1$/m);
      expect(content).toContain("report-only");
      expect(content).toContain("Do not run `scripts/pack.sh refresh`");
      expect(content).toContain("Do not run delete, cleanup, remove, prune, or reinstall commands.");
      expect(content).toContain("tasks/skill-inventory.md");
      for (const status of ["ok", "stale", "unknown", "missing-source", "pinned", "not-managed"]) {
        expect(content).toContain(`\`${status}\``);
      }
    });
  }
});
