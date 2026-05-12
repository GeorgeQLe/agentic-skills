#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(repoRoot, "docs/skills-showcase/assets/skills-data.js");
const appOutputPath = path.join(repoRoot, "apps/skills-showcase/public/assets/skills-data.js");
const matrixOutputPath = path.join(repoRoot, "docs/benchmark-results-matrix.md");

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

function compactText(value, maxLength = 700) {
  const clean = String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/\/(?:private\/)?var\/folders\/[^\s)`]+\/skill-test-[A-Za-z0-9_-]+\/?/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trimEnd()}…`;
}

function readJson(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  if (!existsSync(absolutePath)) return null;
  try {
    return JSON.parse(readFileSync(absolutePath, "utf8"));
  } catch {
    return null;
  }
}

function extractPromptFromRun(run) {
  const stderr = String(run?.stderr || "");
  const codexPrompt = stderr.match(/\nuser\n([\s\S]*?)(?:\n(?:codex|assistant|exec|apply patch)\n|$)/);
  if (codexPrompt) return compactText(codexPrompt[1], 600);
  return "";
}

function extractOutputFromRun(run) {
  return compactText(String(run?.stdout || ""), 900);
}

function buildBenchmarkDemo(report) {
  for (const agent of report.agents) {
    const rawSessionPath = String(agent.rawSessionPath || "").replace(/\/?$/, "/");
    if (!rawSessionPath.startsWith("tests/benchmarks/runs/")) continue;

    const reportJsonPath = `${rawSessionPath}report.json`;
    const reportJson = readJson(reportJsonPath);
    const preferredIndex =
      Array.isArray(reportJson?.failedRuns) && reportJson.failedRuns.length
        ? 0
        : Number.isInteger(reportJson?.consistency?.medoidIndex)
          ? reportJson.consistency.medoidIndex
          : 0;

    const candidateIndexes = Array.from(new Set([preferredIndex, 0, 1, 2])).filter((index) => index >= 0);
    for (const index of candidateIndexes) {
      const runPath = `${rawSessionPath}run-${String(index).padStart(3, "0")}.json`;
      const run = readJson(runPath);
      if (!run || run.infrastructureBlocked) continue;

      const prompt = extractPromptFromRun(run);
      const output = extractOutputFromRun(run);
      if (!prompt || !output) continue;

      return {
        agent: agent.agent,
        runIndex: index,
        prompt,
        output,
        runPath,
        reportPath: report.reportPath
      };
    }
  }

  return null;
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

  const report = {
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

  const demo = buildBenchmarkDemo(report);
  return demo ? { ...report, demo } : report;
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

function generateBenchmarkMatrix(files) {
  const runsDir = path.join(repoRoot, "tests/benchmarks/runs");
  const reportPaths = existsSync(runsDir)
    ? readdirSync(runsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => `tests/benchmarks/runs/${d.name}/report.json`)
        .filter((p) => existsSync(path.join(repoRoot, p)))
    : [];
  const curatedReports = files.filter((f) => /^benchmark\/test-.+-\d{4}-\d{2}-\d{2}\.md$/.test(f));
  const reviewFiles = files.filter((f) => /^benchmark\/review-.+-\d{4}-\d{2}-\d{2}\.md$/.test(f));

  const curatedBySkill = new Map();
  for (const rp of curatedReports) {
    const m = rp.match(/^benchmark\/test-(.+)-(\d{4}-\d{2}-\d{2})\.md$/);
    if (m) {
      const existing = curatedBySkill.get(m[1]);
      if (!existing || m[2] > existing.date) curatedBySkill.set(m[1], { path: rp, date: m[2] });
    }
  }

  const reviewBySkill = new Map();
  for (const rv of reviewFiles) {
    const m = rv.match(/^benchmark\/review-(.+)-(\d{4}-\d{2}-\d{2})\.md$/);
    if (m) {
      const existing = reviewBySkill.get(m[1]);
      if (!existing || m[2] > existing.date) reviewBySkill.set(m[1], { path: rv, date: m[2] });
    }
  }

  const reports = reportPaths.map((rp) => {
    const json = readJson(rp);
    if (!json || !json.skill || !json.agent) return null;
    return { ...json, reportPath: rp };
  }).filter(Boolean);

  // Group by skill+agent: keep latest evaluated report (for graded table)
  // and collect all zero-evaluated reports (for incomplete table)
  const latestEvaluated = new Map();
  const zeroEvaluated = [];
  for (const r of reports) {
    if (r.evaluatedRuns > 0) {
      const key = `${r.skill}|${r.agent}`;
      const existing = latestEvaluated.get(key);
      if (!existing || (r.generatedAt || "") > (existing.generatedAt || "")) {
        latestEvaluated.set(key, r);
      }
    } else {
      zeroEvaluated.push(r);
    }
  }

  const graded = [];
  for (const r of Array.from(latestEvaluated.values()).sort((a, b) => a.skill.localeCompare(b.skill) || a.agent.localeCompare(b.agent))) {
    const hardPassRate = `${Math.round(r.passRate * 100)}%`;
    const hasQuality = r.qualitySummary && r.qualitySummary.evaluatedRuns > 0;
    const outputQuality = hasQuality ? `${(r.qualitySummary.averageScore * 100).toFixed(1)}%` : "not scored";
    const review = reviewBySkill.get(r.skill);
    const subjectiveReview = review ? `\`${review.path}\`` : "none";
    const curated = curatedBySkill.get(r.skill);
    const status = hasQuality ? "graded" : "partially graded";

    const notes = [];
    if (curated) notes.push(`Curated report: \`${curated.path}\`.`);
    if (hasQuality && r.evaluatedRuns === 1) notes.push("One evaluated persisted run with deterministic quality scoring.");
    if (!hasQuality && r.evaluatedRuns > 0) notes.push("Hard assertion evidence exists; no quality score in the latest persisted evaluated report.");
    if (review) notes.push(`Subjective review median score available.`);

    graded.push({
      skill: r.skill,
      agent: titleize(r.agent),
      reportPath: r.reportPath,
      runs: r.evaluatedRuns,
      hardPassRate,
      outputQuality,
      subjectiveReview,
      status,
      notes: notes.join(" ") || "—"
    });
  }

  // Keep only the latest zero-evaluated report per skill+agent for the incomplete table
  const latestZero = new Map();
  for (const r of zeroEvaluated) {
    const key = `${r.skill}|${r.agent}`;
    const existing = latestZero.get(key);
    if (!existing || (r.generatedAt || "") > (existing.generatedAt || "")) {
      latestZero.set(key, r);
    }
  }

  const dedupedIncomplete = Array.from(latestZero.values())
    .sort((a, b) => a.skill.localeCompare(b.skill) || a.agent.localeCompare(b.agent))
    .map((r) => {
      const hasEvaluated = latestEvaluated.has(`${r.skill}|${r.agent}`);
      const notes = [];
      if (r.totalRuns === 0 && r.evaluatedRuns === 0) notes.push("Report exists with zero total and evaluated runs. Do not count as benchmarked.");
      if (hasEvaluated) notes.push("Prefer the later evaluated report listed above.");
      return {
        skill: r.skill,
        agent: titleize(r.agent),
        reportPath: r.reportPath,
        status: "blocked/incomplete",
        notes: notes.join(" ") || "Report exists with zero evaluated runs."
      };
    });

  const now = new Date().toISOString().slice(0, 10);

  let md = `# Benchmark Results Matrix

> Generated by \`scripts/generate-skills-showcase-data.mjs\` on ${now}. Do not edit by hand.

This matrix tracks skills that already have persisted benchmark run data and grades. It is separate from the benchmark coverage registry in \`tests/harness/bench-coverage.ts\`, which tracks whether a skill has custom, generic, or blocked setup coverage.

## Status Definitions

| Status | Meaning |
|---|---|
| \`graded\` | Persisted benchmark data exists with evaluated runs and either hard assertion grades, output-quality grades, or both. |
| \`partially graded\` | Persisted evaluated runs exist, but quality scoring or subjective review is missing. |
| \`blocked/incomplete\` | Persisted report exists, but no evaluated skill run was completed. |

## Current Graded Skills

| Skill | Agent | Latest Raw Report | Runs | Hard Pass Rate | Output Quality | Subjective Review | Status | Notes |
|---|---|---:|---:|---:|---:|---|---|---|
`;

  for (const row of graded) {
    md += `| \`${row.skill}\` | ${row.agent} | \`${row.reportPath}\` | ${row.runs} | ${row.hardPassRate} | ${row.outputQuality} | ${row.subjectiveReview} | ${row.status} | ${row.notes} |\n`;
  }

  if (dedupedIncomplete.length > 0) {
    md += `
## Incomplete Persisted Reports

| Skill | Agent | Raw Report | Status | Notes |
|---|---|---|---|---|
`;
    for (const row of dedupedIncomplete) {
      md += `| \`${row.skill}\` | ${row.agent} | \`${row.reportPath}\` | ${row.status} | ${row.notes} |\n`;
    }
  }

  md += `
## Coverage Gaps

- Most repository skills have custom benchmark setup coverage but do not yet have persisted evaluated benchmark data and grades.
- The website currently has no public benchmark-results surface. A follow-up should expose this matrix or generated data derived from it in the Skills Showcase.
- \`commit-and-push-by-feature\` and \`sync\` are currently blocked in the coverage registry, but they are plausible candidates for safe benchmark fixtures when a user explicitly permits creation of a temporary GitHub test repository through \`gh\`.

## Safe Git-Fixture Candidate

For \`commit-and-push-by-feature\` and \`sync\`, a safe setup can be designed around an ephemeral test repository instead of the primary repository:

- Require explicit user permission before any live GitHub operation.
- Create a temporary private GitHub repository with \`gh repo create\`.
- Seed it with a minimal fixture project and a default branch.
- Run the skill against only that temporary repository.
- Assert expected git/remote behavior from the temporary repo state and persisted benchmark output.
- Delete or archive the temporary repository at the end of the run, with cleanup failure reported as infrastructure-blocked.

This would convert those two skills from blocked coverage candidates into live, permission-gated integration benchmark targets without risking the main \`agentic-skills\` repository.
`;

  writeFileSync(matrixOutputPath, md);
  console.log(`Wrote ${path.relative(repoRoot, matrixOutputPath)} with ${graded.length} graded and ${dedupedIncomplete.length} incomplete rows.`);
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
  const benchmarkDemoPaths = Array.from(benchmarkEvidence.values())
    .flatMap((evidence) => (evidence.demo ? [evidence.demo.runPath] : []))
    .filter((file) => files.includes(file));
  const sourcePaths = [...skillPaths, ...packPaths, ...benchmarkPaths, ...benchmarkDemoPaths].sort();

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
  mkdirSync(path.dirname(appOutputPath), { recursive: true });
  writeFileSync(appOutputPath, contents);
  console.log(`Wrote ${path.relative(repoRoot, outputPath)} with ${skills.length} skills and ${packs.length} packs.`);
  console.log(`Wrote ${path.relative(repoRoot, appOutputPath)} (Next.js app copy).`);

  generateBenchmarkMatrix(files);
}

main();
