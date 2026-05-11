#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(repoRoot, "docs/skills-showcase/assets/skills-data.js");

function gitFiles() {
  const output = execFileSync("git", ["ls-files"], {
    cwd: repoRoot,
    encoding: "utf8"
  });
  return output.split("\n").filter(Boolean).sort();
}

function readText(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function parseFrontmatter(markdown) {
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

function titleize(name) {
  return name
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean))).sort();
}

function parsePercent(value) {
  const match = String(value || "").match(/(\d+(?:\.\d+)?)%/);
  return match ? Number(match[1]) : null;
}

function parseBenchmarkReport(relativePath) {
  const text = readText(relativePath);
  const pathMatch = relativePath.match(/^benchmark\/test-(.+)-(\d{4}-\d{2}-\d{2})\.md$/);
  if (!pathMatch) return null;

  const skill = pathMatch[1];
  const date = pathMatch[2];
  const coverage = (text.match(/\*\*Coverage:\*\*\s*([^\n]+)/) || [])[1] || null;
  const verifyPassed = /\|\s*layer1\s*\|\s*PASS\s*\|/i.test(text);
  const layer2Skipped = /\|\s*layer2\s*\|\s*SKIP\s*\|/i.test(text);
  const agents = [];
  const agentRowPattern = /^\|\s*(claude|codex)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*`?([^|`]+)`?\s*\|$/gim;
  let match;

  while ((match = agentRowPattern.exec(text)) !== null) {
    agents.push({
      agent: match[1],
      passRate: match[2].trim(),
      passRatePercent: parsePercent(match[2]),
      infrastructureBlocked: match[3].trim(),
      wilson95: match[4].trim(),
      latencyP50: match[5].trim(),
      latencyP95: match[6].trim(),
      latencyP99: match[7].trim(),
      costPerRun: match[8].trim(),
      totalCost: match[9].trim(),
      meanPairwiseSimilarity: match[10].trim(),
      outliers: match[11].trim(),
      rawSessionPath: match[12].trim()
    });
  }

  const qualityRows = [];
  const qualityRowPattern = /^\|\s*(claude|codex)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|$/gim;
  while ((match = qualityRowPattern.exec(text)) !== null) {
    if (!/%/.test(match[2])) continue;
    qualityRows.push({
      agent: match[1],
      averageQualityScore: match[2].trim(),
      thresholdFailures: match[3].trim(),
      criticalFailures: match[4].trim(),
      lowestScoringCriteria: match[5].trim()
    });
  }

  const failedAssertions = /## Failed Assertions\s+None\./i.test(text) ? "none" : "see-report";

  return {
    skill,
    date,
    reportPath: relativePath,
    coverage,
    verify: {
      layer1: verifyPassed ? "PASS" : "UNKNOWN",
      layer2: layer2Skipped ? "SKIP" : "UNKNOWN"
    },
    agents,
    quality: qualityRows,
    failedAssertions
  };
}

function benchmarkEvidenceBySkill(files) {
  const reports = files
    .filter((file) => /^benchmark\/test-.+-\d{4}-\d{2}-\d{2}\.md$/.test(file))
    .map(parseBenchmarkReport)
    .filter(Boolean)
    .filter((report) => report.agents.length > 0)
    .sort((a, b) => a.date.localeCompare(b.date));

  const evidence = new Map();
  reports.forEach((report) => evidence.set(report.skill, report));
  return evidence;
}

function skillTags({ name, type, scope, pack, platform }) {
  const raw = [
    type,
    scope,
    pack,
    platform,
    ...name.split(/[-_]+/).filter((part) => part.length > 2)
  ];
  return unique(raw).slice(0, 8);
}

function parseSkill(relativePath) {
  const text = readText(relativePath);
  const fields = parseFrontmatter(text);
  const segments = relativePath.split("/");
  const scope = segments[0] === "global" ? "global" : "pack";
  const platform = scope === "global" ? segments[1] : segments[2];
  const pack = scope === "global" ? null : segments[1];
  const fallbackName = scope === "global" ? segments[2] : segments[3];
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

function parsePack(relativePath) {
  const text = readText(relativePath);
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

function fingerprintFor(files) {
  const hash = createHash("sha256");
  for (const relativePath of files) {
    hash.update(relativePath);
    hash.update("\0");
    hash.update(readText(relativePath));
    hash.update("\0");
  }
  return hash.digest("hex");
}

function main() {
  const files = gitFiles();
  const benchmarkEvidence = benchmarkEvidenceBySkill(files);
  const skillPaths = files.filter((file) => {
    return (
      /^global\/[^/]+\/[^/]+\/SKILL\.md$/.test(file) ||
      /^packs\/[^/]+\/(?:claude|codex)\/[^/]+\/SKILL\.md$/.test(file)
    );
  });
  const packPaths = files.filter((file) => /^packs\/[^/]+\/PACK\.md$/.test(file));
  const benchmarkPaths = files.filter((file) => /^benchmark\/test-.+-\d{4}-\d{2}-\d{2}\.md$/.test(file));
  const sourcePaths = [...skillPaths, ...packPaths, ...benchmarkPaths].sort();

  const skills = skillPaths
    .map(parseSkill)
    .map((skill) => {
      const evidence = benchmarkEvidence.get(skill.mirrorKey);
      return evidence ? { ...skill, benchmarkEvidence: evidence } : skill;
    })
    .sort((a, b) => a.path.localeCompare(b.path));
  const packMetadata = new Map(packPaths.map((packPath) => {
    const pack = parsePack(packPath);
    return [pack.name, pack];
  }));

  const packs = Array.from(new Set(skills.map((skill) => skill.pack).filter(Boolean)))
    .sort()
    .map((name) => {
      const packSkills = skills.filter((skill) => skill.pack === name);
      const metadata = packMetadata.get(name);
      return {
        name,
        title: metadata ? metadata.title : titleize(name),
        description: metadata ? metadata.description : null,
        platforms: unique(packSkills.map((skill) => skill.platform)),
        skillCount: packSkills.length,
        path: metadata ? metadata.path : null
      };
    });

  const sourceFingerprint = fingerprintFor(sourcePaths);

  const data = {
    generatedAt: "1970-01-01T00:00:00.000Z",
    sourceFingerprint,
    sourceCount: sourcePaths.length,
    skillCount: skills.length,
    packCount: packs.length,
    skills,
    packs,
    workflows: []
  };

  const serialized = JSON.stringify(data, null, 2);
  const contents = `// Generated by scripts/generate-skills-showcase-data.mjs. Do not edit by hand.\nwindow.SKILLS_SHOWCASE_DATA = ${serialized};\n`;

  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, contents);
  console.log(`Wrote ${path.relative(repoRoot, outputPath)} with ${skills.length} skills and ${packs.length} packs.`);
}

main();
