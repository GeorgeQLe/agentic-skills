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

// ---------------------------------------------------------------------------
// Git-index content source (opt-in).
//
// Discovery (gitFiles) already reads the index; by default content readers
// (readText/contentHash/fileFingerprint/...) read the working tree. That mix
// is fine for a clean single session but bakes another session's *unstaged*
// edits into whole-repo artifacts on a shared working tree. Callers that must
// be a pure function of what is staged opt into `{ source: "index" }`, which
// routes content reads through the git index instead. Default stays "worktree"
// so existing callers are byte-for-byte unaffected.
// ---------------------------------------------------------------------------

const indexContentCache = new Map();

function indexCacheFor(repoRoot) {
  let cache = indexContentCache.get(repoRoot);
  if (!cache) {
    cache = new Map();
    indexContentCache.set(repoRoot, cache);
  }
  return cache;
}

function gitCatFileBatch(repoRoot, refs) {
  const result = new Map();
  if (refs.length === 0) {
    return result;
  }

  const stdout = execFileSync("git", ["cat-file", "--batch"], {
    cwd: repoRoot,
    input: `${refs.join("\n")}\n`,
    maxBuffer: 1024 * 1024 * 1024
  });

  let offset = 0;
  for (const ref of refs) {
    const newline = stdout.indexOf(0x0a, offset);
    const header = stdout.toString("utf8", offset, newline);
    offset = newline + 1;
    const refPath = ref.slice(1); // strip leading ":"

    const parts = header.split(" ");
    if (parts[parts.length - 1] === "missing") {
      result.set(refPath, null);
      continue;
    }

    const size = Number.parseInt(parts[parts.length - 1], 10);
    const content = stdout.toString("utf8", offset, offset + size);
    offset += size + 1; // skip the content and its trailing newline
    result.set(refPath, content);
  }

  return result;
}

// Batch-read the staged content of `paths` into the per-repo cache. Cheap to
// call repeatedly: already-cached paths are skipped, so a single up-front call
// followed by per-path reads costs one `git cat-file` spawn, not one per file.
export function prefetchIndex(repoRoot, paths) {
  const cache = indexCacheFor(repoRoot);
  const missing = Array.from(new Set(paths)).filter((relativePath) => !cache.has(relativePath));
  if (missing.length === 0) {
    return;
  }
  const fetched = gitCatFileBatch(repoRoot, missing.map((relativePath) => `:${relativePath}`));
  for (const [relativePath, content] of fetched) {
    cache.set(relativePath, content);
  }
}

// Read a path's staged content. Returns the content string, or null when the
// path is not in the index (mirrors the existsSync guard of working-tree reads).
export function readTextFromIndex(repoRoot, relativePath) {
  const cache = indexCacheFor(repoRoot);
  if (!cache.has(relativePath)) {
    prefetchIndex(repoRoot, [relativePath]);
  }
  return cache.get(relativePath) ?? null;
}

function readContent(repoRoot, relativePath, source) {
  return source === "index" ? readTextFromIndex(repoRoot, relativePath) : readText(repoRoot, relativePath);
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

export function parseFrontmatterList(markdown, field) {
  const frontmatter = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatter) return [];

  const fields = parseFrontmatter(markdown);
  const scalar = fields[field];
  if (scalar) {
    const inline = scalar.match(/^\[(.*)\]$/);
    const raw = inline ? inline[1] : scalar;
    return raw
      .split(",")
      .map((value) => value.trim().replace(/^['"]|['"]$/g, ""))
      .filter(Boolean)
      .sort();
  }

  const lines = frontmatter[1].split("\n");
  const start = lines.findIndex((line) => line === `${field}:`);
  if (start === -1) return [];

  const values = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^[A-Za-z0-9_-]+:\s*/.test(line)) break;
    const item = line.match(/^\s*-\s*([^#]+?)\s*(?:#.*)?$/);
    if (item) values.push(item[1].trim().replace(/^['"]|['"]$/g, ""));
  }
  return values.filter(Boolean).sort();
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
      (
        /^base\/(?:claude|codex)\/.+\/SKILL\.md$/.test(file) &&
        !file.split("/").includes("archive")
      ) ||
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

export function parseSkill(repoRoot, relativePath, { source = "worktree" } = {}) {
  const text = readContent(repoRoot, relativePath, source);
  const fields = parseFrontmatter(text);
  const segments = relativePath.split("/");
  const scope = segments[0] === "base" ? "base" : "pack";
  const platform = scope === "base" ? segments[1] : segments[2];
  const pack = scope === "base" ? null : segments[1];
  const fallbackName = segments[segments.length - 2];
  const name = fields.name || fallbackName;

  return {
    id: [scope, pack, platform, name].filter(Boolean).join("-"),
    name,
    title: titleize(name),
    description: fields.description || null,
    type: fields.type || null,
    contextIntake: fields.context_intake || null,
    visualTier: fields.visual_tier || null,
    version: fields.version || null,
    requiredConventions: parseFrontmatterList(text, "required_conventions"),
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

export function parsePack(repoRoot, relativePath, { source = "worktree" } = {}) {
  const text = readContent(repoRoot, relativePath, source);
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

export function listSkills(repoRoot, files = gitFiles(repoRoot), { source = "worktree" } = {}) {
  return activeSkillPaths(files)
    .map((skillPath) => parseSkill(repoRoot, skillPath, { source }))
    .sort((a, b) => a.path.localeCompare(b.path));
}

export function listPacks(
  repoRoot,
  files = gitFiles(repoRoot),
  skills = listSkills(repoRoot, files),
  { source = "worktree" } = {}
) {
  const metadata = new Map(
    packManifestPaths(files).map((packPath) => {
      const pack = parsePack(repoRoot, packPath, { source });
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

export function fingerprintFiles(repoRoot, files, { source = "worktree" } = {}) {
  if (source === "index") {
    prefetchIndex(repoRoot, files);
  }
  const hash = createHash("sha256");
  for (const relativePath of files) {
    hash.update(relativePath);
    hash.update("\0");
    hash.update(readContent(repoRoot, relativePath, source) ?? "");
    hash.update("\0");
  }
  return hash.digest("hex");
}

export function contentHash(repoRoot, relativePath, { source = "worktree" } = {}) {
  return createHash("sha256")
    .update(readContent(repoRoot, relativePath, source) ?? "")
    .digest("hex");
}

export function fileFingerprint(repoRoot, files, { source = "worktree" } = {}) {
  if (source === "index") {
    prefetchIndex(repoRoot, files);
  }
  const hash = createHash("sha256");
  for (const relativePath of files) {
    hash.update(relativePath);
    hash.update("\0");
    const present = source === "index"
      ? readTextFromIndex(repoRoot, relativePath) !== null
      : existsSync(path.join(repoRoot, relativePath));
    if (present) {
      hash.update(readContent(repoRoot, relativePath, source));
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

export function discoverArchiveVersions(repoRoot, skillPath, { source = "worktree", files = null } = {}) {
  if (source === "index") {
    const skillDir = skillPath.split("/").slice(0, -1).join("/");
    const archivePrefix = `${skillDir}/archive/`;
    const fileList = files || gitFiles(repoRoot);
    return fileList
      .filter((file) => file.startsWith(archivePrefix) && file.endsWith("/SKILL.md"))
      .filter((file) => file.slice(archivePrefix.length).split("/").length === 2)
      .map((file) => {
        const dirName = file.slice(archivePrefix.length).split("/")[0];
        const fields = parseFrontmatter(readTextFromIndex(repoRoot, file) ?? "");
        return fields.version || dirName;
      })
      .filter(Boolean)
      .sort();
  }

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
