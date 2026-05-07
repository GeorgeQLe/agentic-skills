#!/usr/bin/env node

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(repoRoot, "docs/skills-showcase/assets/github-proof-data.js");

const proofArtifacts = [
  {
    id: "dogfood-history",
    title: "Dogfood changelog",
    path: "tasks/history.md",
    kind: "history"
  },
  {
    id: "phase-plan",
    title: "Active roadmap and todo",
    path: "tasks/todo.md",
    kind: "planning"
  },
  {
    id: "quality-gate",
    title: "Quality gate contract",
    path: "docs/quality-gate-contract.md",
    kind: "quality"
  },
  {
    id: "skills-reference",
    title: "Skills reference",
    path: "docs/skills-reference.md",
    kind: "reference"
  }
];

const validationScripts = [
  {
    id: "skill-deps",
    title: "Skill dependency references",
    command: "./scripts/skill-deps.sh --broken",
    path: "scripts/skill-deps.sh"
  },
  {
    id: "skill-versions",
    title: "Skill version metadata",
    command: "./scripts/skill-versions.sh --missing",
    path: "scripts/skill-versions.sh"
  },
  {
    id: "next-step-routing",
    title: "Mutation next-step routing",
    command: "./scripts/skill-next-step-routing.sh --missing",
    path: "scripts/skill-next-step-routing.sh"
  },
  {
    id: "pack-routing",
    title: "Cross-pack routing guard",
    command: "./scripts/skill-pack-routing-audit.sh",
    path: "scripts/skill-pack-routing-audit.sh"
  }
];

function git(args, fallback = null) {
  try {
    return execFileSync("git", args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
  } catch {
    return fallback;
  }
}

function gitFiles() {
  const output = git(["ls-files"], "");
  return output ? output.split("\n").filter(Boolean).sort() : [];
}

function readText(relativePath) {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function normalizeRepoUrl(remoteUrl) {
  if (!remoteUrl) {
    return null;
  }
  if (remoteUrl.startsWith("git@github.com:")) {
    return `https://github.com/${remoteUrl.slice("git@github.com:".length).replace(/\.git$/, "")}`;
  }
  return remoteUrl.replace(/\.git$/, "");
}

function githubApiUrl(repositoryUrl) {
  const match = repositoryUrl && repositoryUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+)$/);
  if (!match) {
    return null;
  }
  return `https://api.github.com/repos/${match[1]}/${match[2]}`;
}

function fileFingerprint(files) {
  const hash = createHash("sha256");
  for (const relativePath of files) {
    hash.update(relativePath);
    hash.update("\0");
    if (existsSync(path.join(repoRoot, relativePath))) {
      hash.update(readText(relativePath));
    }
    hash.update("\0");
  }
  return hash.digest("hex");
}

function generatedAtFor(files) {
  const tracked = files.filter((relativePath) => git(["ls-files", "--", relativePath], ""));
  if (tracked.length > 0) {
    const timestamp = git(["log", "-1", "--format=%cI", "--", ...tracked], "");
    if (timestamp) {
      return timestamp;
    }
  }
  return git(["log", "-1", "--format=%cI"], "1970-01-01T00:00:00+00:00");
}

function trackedStatus(relativePath) {
  const tracked = Boolean(git(["ls-files", "--", relativePath], ""));
  return {
    path: relativePath,
    tracked,
    exists: existsSync(path.join(repoRoot, relativePath))
  };
}

function recentHistoryEntries() {
  if (!existsSync(path.join(repoRoot, "tasks/history.md"))) {
    return [];
  }

  const lines = readText("tasks/history.md").split("\n");
  return lines
    .filter((line) => /^##\s+\d{4}-\d{2}-\d{2}/.test(line))
    .slice(0, 8)
    .map((line) => line.replace(/^##\s+/, "").trim());
}

async function publicGithubMetadata(repositoryUrl) {
  const apiUrl = githubApiUrl(repositoryUrl);
  if (!apiUrl || typeof fetch !== "function") {
    return {
      status: "fallback",
      reason: "Repository remote is not a public GitHub HTTPS URL or fetch is unavailable.",
      url: repositoryUrl
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Accept": "application/vnd.github+json",
        "User-Agent": "agentic-skills-showcase-generator"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      return {
        status: "fallback",
        reason: `GitHub public metadata request returned HTTP ${response.status}.`,
        url: repositoryUrl
      };
    }

    const json = await response.json();
    return {
      status: "refreshed",
      repository: json.full_name || null,
      description: json.description || null,
      visibility: json.visibility || null,
      defaultBranch: json.default_branch || null,
      stars: Number.isInteger(json.stargazers_count) ? json.stargazers_count : null,
      forks: Number.isInteger(json.forks_count) ? json.forks_count : null,
      openIssues: Number.isInteger(json.open_issues_count) ? json.open_issues_count : null,
      pushedAt: json.pushed_at || null,
      url: json.html_url || repositoryUrl
    };
  } catch (error) {
    return {
      status: "fallback",
      reason: `GitHub public metadata unavailable: ${error.name || "request-failed"}.`,
      url: repositoryUrl
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function main() {
  const files = gitFiles();
  const remoteUrl = git(["remote", "get-url", "origin"], null);
  const repositoryUrl = normalizeRepoUrl(remoteUrl);
  const headSha = git(["rev-parse", "HEAD"], null);
  const sourceFiles = [
    ...proofArtifacts.map((artifact) => artifact.path),
    ...validationScripts.map((script) => script.path),
    "docs/skills-showcase/assets/skills-data.js"
  ].filter((relativePath) => files.includes(relativePath));

  const data = {
    generatedAt: generatedAtFor(sourceFiles),
    sourceFingerprint: fileFingerprint(sourceFiles),
    repository: {
      remoteUrl,
      url: repositoryUrl,
      branch: git(["branch", "--show-current"], null),
      head: {
        sha: headSha,
        shortSha: headSha ? headSha.slice(0, 7) : null,
        committedAt: git(["log", "-1", "--format=%cI"], null),
        subject: git(["log", "-1", "--format=%s"], null)
      }
    },
    publicGithub: await publicGithubMetadata(repositoryUrl),
    proofArtifacts: proofArtifacts.map((artifact) => ({
      ...artifact,
      ...trackedStatus(artifact.path)
    })),
    validationScripts: validationScripts.map((script) => ({
      ...script,
      ...trackedStatus(script.path)
    })),
    recentHistoryEntries: recentHistoryEntries(),
    boundaries: [
      "Static proof data only; no runtime API or database is used.",
      "Public GitHub metadata is optional enrichment and falls back to local git evidence.",
      "No LexCorp live product metrics, visitor analytics, secrets, or GitHub Actions are claimed."
    ]
  };

  const serialized = JSON.stringify(data, null, 2);
  const contents = `// Generated by scripts/generate-skills-showcase-github-data.mjs. Do not edit by hand.\nwindow.SKILLS_SHOWCASE_GITHUB_PROOF_DATA = ${serialized};\n`;

  mkdirSync(path.dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, contents);
  console.log(`Wrote ${path.relative(repoRoot, outputPath)} with ${data.proofArtifacts.length} proof artifacts and ${data.validationScripts.length} validation scripts.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
