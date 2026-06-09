import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export function gitFiles(repoRoot) {
  const output = execFileSync("git", ["ls-files"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  return output.split("\n").filter(Boolean).sort();
}

export function readText(repoRoot, relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

export function readJson(repoRoot, relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!existsSync(absolutePath)) return null;
  try {
    return JSON.parse(readFileSync(absolutePath, "utf8"));
  } catch {
    return null;
  }
}

export function parseFrontmatter(markdown) {
  if (!markdown.startsWith("---\n")) {
    return {};
  }

  const end = markdown.indexOf("\n---", 4);
  if (end === -1) {
    return {};
  }

  const frontmatter = markdown.slice(4, end).split("\n");
  const fields = {};

  for (const line of frontmatter) {
    if (!line.trim() || line.trim().startsWith("#")) {
      continue;
    }

    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      continue;
    }

    const key = match[1];
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    fields[key] = value || null;
  }

  return fields;
}

export function titleize(name) {
  return name
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function unique(values) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

export function compactText(value, maxLength = 700) {
  const clean = String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\/(?:private\/)?var\/folders\/[^\s)`]+\/skill-test-[A-Za-z0-9_-]+\/?/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trimEnd()}…`;
}

export function activeSkillPaths(files) {
  return files.filter((file) => {
    return (
      /^global\/[^/]+\/[^/]+\/SKILL\.md$/.test(file) ||
      (
        /^packs\/[^/]+\/(?:claude|codex)\/.+\/SKILL\.md$/.test(file) &&
        !file.split("/").includes("archive")
      )
    );
  });
}

export function packManifestPaths(files) {
  return files.filter((file) => /^packs\/[^/]+\/PACK\.md$/.test(file));
}

export function skillTags({ name, type, scope, pack, platform }) {
  const raw = [
    type,
    scope,
    pack,
    platform,
    ...name.split(/[-_]+/).filter((part) => part.length > 2)
  ];
  return unique(raw).slice(0, 8);
}

export function parseSkill(repoRoot, relativePath) {
  const text = readText(repoRoot, relativePath);
  const fields = parseFrontmatter(text);
  const segments = relativePath.split("/");
  const scope = segments[0] === "global" ? "global" : "pack";
  const platform = scope === "global" ? segments[1] : segments[2];
  const pack = scope === "global" ? null : segments[1];
  const fallbackName = segments[segments.length - 2];
  const name = fields.name || fallbackName;

  return {
    id: [scope, pack, platform, name].filter(Boolean).join("-"),
    name,
    title: titleize(name),
    description: fields.description || null,
    type: fields.type || null,
    version: fields.version || null,
    argumentHint: fields["argument-hint"] || null,
    platform,
    command: platform === "claude" ? `/${name}` : `$${name}`,
    scope,
    pack,
    path: relativePath,
    mirrorKey: name,
    tags: skillTags({ name, type: fields.type, scope, pack, platform })
  };
}

export function parsePack(repoRoot, relativePath) {
  const text = readText(repoRoot, relativePath);
  const fields = parseFrontmatter(text);
  const name = relativePath.split("/")[1];
  const heading = text.match(/^#\s+(.+)$/m);
  return {
    name,
    title: fields.name || (heading ? heading[1].trim() : titleize(name)),
    description: fields.description || null,
    path: relativePath
  };
}

export function listSkills(repoRoot, files = gitFiles(repoRoot)) {
  return activeSkillPaths(files)
    .map((skillPath) => parseSkill(repoRoot, skillPath))
    .sort((a, b) => a.path.localeCompare(b.path));
}

export function listPacks(repoRoot, files = gitFiles(repoRoot), skills = listSkills(repoRoot, files)) {
  const metadata = new Map(
    packManifestPaths(files).map((packPath) => {
      const pack = parsePack(repoRoot, packPath);
      return [pack.name, pack];
    })
  );

  return Array.from(new Set([
    ...metadata.keys(),
    ...skills.map((skill) => skill.pack).filter(Boolean)
  ]))
    .sort()
    .map((name) => {
      const packSkills = skills.filter((skill) => skill.pack === name);
      const pack = metadata.get(name);
      return {
        name,
        title: pack ? pack.title : titleize(name),
        description: pack ? pack.description : null,
        platforms: unique(packSkills.map((skill) => skill.platform)),
        skillCount: packSkills.length,
        path: pack ? pack.path : null
      };
    });
}

export function fingerprintFiles(repoRoot, files) {
  const hash = createHash("sha256");
  for (const relativePath of files) {
    hash.update(relativePath);
    hash.update("\0");
    hash.update(readText(repoRoot, relativePath));
    hash.update("\0");
  }
  return hash.digest("hex");
}

export function fileFingerprint(repoRoot, files) {
  const hash = createHash("sha256");
  for (const relativePath of files) {
    hash.update(relativePath);
    hash.update("\0");
    if (existsSync(path.join(repoRoot, relativePath))) {
      hash.update(readText(repoRoot, relativePath));
    }
    hash.update("\0");
  }
  return hash.digest("hex");
}

export function discoverBenchmarkReportPaths(files) {
  return {
    testReports: files.filter((file) => /^benchmark\/test-.+-\d{4}-\d{2}-\d{2}\.md$/.test(file)),
    reviewReports: files.filter((file) => /^benchmark\/review-.+-\d{4}-\d{2}-\d{2}\.md$/.test(file))
  };
}

export function discoverBenchmarkRunReportPaths(repoRoot) {
  const runsDir = path.join(repoRoot, "tests/benchmarks/runs");
  if (!existsSync(runsDir)) {
    return [];
  }

  return readdirSync(runsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => `tests/benchmarks/runs/${dirent.name}/report.json`)
    .filter((relativePath) => existsSync(path.join(repoRoot, relativePath)))
    .sort();
}

export function discoverArchiveVersions(repoRoot, skillPath) {
  const skillDir = path.dirname(path.join(repoRoot, skillPath));
  const archiveDir = path.join(skillDir, "archive");
  if (!existsSync(archiveDir)) {
    return [];
  }

  return readdirSync(archiveDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      const archivedSkillPath = path.join(archiveDir, dirent.name, "SKILL.md");
      if (!existsSync(archivedSkillPath)) {
        return null;
      }
      const fields = parseFrontmatter(readFileSync(archivedSkillPath, "utf8"));
      return fields.version || dirent.name;
    })
    .filter(Boolean)
    .sort();
}
