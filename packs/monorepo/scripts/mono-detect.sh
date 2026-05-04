#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: mono-detect.sh [root] [--check-stale]

Detect a pnpm workspace monorepo and write .agents/monorepo.json.

Arguments:
  root           Repository root to inspect. Defaults to current directory.
  --check-stale  Exit 0 without rewriting when .agents/monorepo.json is fresh.

Output:
  .agents/monorepo.json with workspace manager, build orchestrator, packages,
  internal dependency graph, Turbo pipeline names, and detection timestamp.
EOF
}

ROOT=""
CHECK_STALE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    -h|--help)
      usage
      exit 0
      ;;
    --check-stale)
      CHECK_STALE=true
      shift
      ;;
    *)
      if [[ -n "$ROOT" ]]; then
        echo "ERROR: unexpected argument: $1" >&2
        usage >&2
        exit 2
      fi
      ROOT="$1"
      shift
      ;;
  esac
done

ROOT="${ROOT:-$(pwd)}"
ROOT="$(cd "$ROOT" && pwd)"

node - "$ROOT" "$CHECK_STALE" <<'NODE'
const fs = require("fs");
const path = require("path");

const root = process.argv[2];
const checkStaleOnly = process.argv[3] === "true";
const workspaceFile = path.join(root, "pnpm-workspace.yaml");
const turboFile = path.join(root, "turbo.json");
const outputFile = path.join(root, ".agents", "monorepo.json");

function fail(message, code = 1) {
  console.error(`ERROR: ${message}`);
  process.exit(code);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    fail(`failed to parse JSON at ${path.relative(root, file)}: ${error.message}`);
  }
}

function statMtime(file) {
  return fs.existsSync(file) ? fs.statSync(file).mtimeMs : 0;
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function normalizeWorkspacePattern(pattern) {
  let value = pattern.trim();
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  return value.trim();
}

function parsePnpmWorkspaceGlobs(file) {
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  const globs = [];
  let inPackages = false;
  let packageIndent = -1;

  for (const rawLine of lines) {
    const withoutComment = rawLine.replace(/\s+#.*$/, "");
    if (!withoutComment.trim()) continue;

    const indent = withoutComment.match(/^\s*/)[0].length;
    const trimmed = withoutComment.trim();

    if (/^packages\s*:\s*$/.test(trimmed)) {
      inPackages = true;
      packageIndent = indent;
      continue;
    }

    if (inPackages && indent <= packageIndent && !trimmed.startsWith("-")) {
      inPackages = false;
    }

    if (inPackages && trimmed.startsWith("-")) {
      const pattern = normalizeWorkspacePattern(trimmed.slice(1));
      if (pattern && !pattern.startsWith("!")) globs.push(pattern);
    }
  }

  return [...new Set(globs)];
}

function walkDirs(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if ([".git", "node_modules", ".turbo", ".agents"].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    results.push(fullPath);
    walkDirs(fullPath, results);
  }
  return results;
}

function globToRegex(pattern) {
  let escaped = "";
  for (let index = 0; index < pattern.length; index += 1) {
    const char = pattern[index];
    const next = pattern[index + 1];
    if (char === "*" && next === "*") {
      escaped += ".*";
      index += 1;
    } else if (char === "*") {
      escaped += "[^/]*";
    } else {
      escaped += char.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
    }
  }
  return new RegExp(`^${escaped}$`);
}

function packageDirsFromGlobs(globs) {
  const candidates = walkDirs(root)
    .filter((dir) => fs.existsSync(path.join(dir, "package.json")))
    .map((dir) => toPosix(path.relative(root, dir)))
    .filter(Boolean);

  const regexes = globs.map(globToRegex);
  return candidates
    .filter((candidate) => regexes.some((regex) => regex.test(candidate)))
    .sort();
}

function readTurboPipelines() {
  if (!fs.existsSync(turboFile)) return [];
  const turbo = readJson(turboFile);
  const tasks = turbo.tasks || turbo.pipeline || {};
  if (!tasks || typeof tasks !== "object" || Array.isArray(tasks)) return [];
  return Object.keys(tasks).sort();
}

function collectPackageJsonFiles(packageDirs) {
  return packageDirs.map((dir) => path.join(root, dir, "package.json"));
}

function isFresh(packageJsonFiles) {
  if (!fs.existsSync(outputFile)) return false;
  const outputMtime = statMtime(outputFile);
  const inputs = [workspaceFile, turboFile, ...packageJsonFiles].filter((file) => fs.existsSync(file));
  return inputs.every((file) => statMtime(file) <= outputMtime);
}

function findCycle(graph) {
  const visiting = new Set();
  const visited = new Set();
  const stack = [];

  function visit(node) {
    if (visiting.has(node)) {
      const start = stack.indexOf(node);
      return stack.slice(start).concat(node);
    }
    if (visited.has(node)) return null;

    visiting.add(node);
    stack.push(node);
    for (const next of graph[node] || []) {
      const cycle = visit(next);
      if (cycle) return cycle;
    }
    stack.pop();
    visiting.delete(node);
    visited.add(node);
    return null;
  }

  for (const node of Object.keys(graph).sort()) {
    const cycle = visit(node);
    if (cycle) return cycle;
  }
  return null;
}

if (!fs.existsSync(workspaceFile)) {
  fail("not a detected pnpm monorepo: pnpm-workspace.yaml not found");
}

const workspaceGlobs = parsePnpmWorkspaceGlobs(workspaceFile);
if (workspaceGlobs.length === 0) {
  fail("pnpm-workspace.yaml does not define any packages globs");
}

const packageDirs = packageDirsFromGlobs(workspaceGlobs);
const packageJsonFiles = collectPackageJsonFiles(packageDirs);

if (checkStaleOnly && isFresh(packageJsonFiles)) {
  console.log(`fresh: ${path.relative(root, outputFile)}`);
  process.exit(0);
}

const rawPackages = packageDirs.map((relativePath) => {
  const file = path.join(root, relativePath, "package.json");
  const pkg = readJson(file);
  if (!pkg.name || typeof pkg.name !== "string") {
    fail(`package.json missing string name: ${relativePath}/package.json`);
  }
  return {
    name: pkg.name,
    path: relativePath,
    dependencies: Object.keys(pkg.dependencies || {}).sort(),
    devDependencies: Object.keys(pkg.devDependencies || {}).sort(),
    scripts: pkg.scripts && typeof pkg.scripts === "object" && !Array.isArray(pkg.scripts) ? pkg.scripts : {}
  };
});

const packageNames = new Set(rawPackages.map((pkg) => pkg.name));
if (packageNames.size !== rawPackages.length) {
  fail("duplicate workspace package names detected");
}

const dependencyGraph = {};
for (const pkg of rawPackages) {
  dependencyGraph[pkg.name] = [...new Set([...pkg.dependencies, ...pkg.devDependencies])].sort();
  dependencyGraph[pkg.name] = dependencyGraph[pkg.name].filter((dependency) => packageNames.has(dependency));
}

const cycle = findCycle(dependencyGraph);
if (cycle) {
  fail(`workspace dependency graph contains a cycle: ${cycle.join(" -> ")}`);
}

const output = {
  workspace_manager: "pnpm",
  build_orchestrator: fs.existsSync(turboFile) ? "turborepo" : null,
  root,
  packages: rawPackages,
  dependency_graph: dependencyGraph,
  turbo_pipelines: readTurboPipelines(),
  detected_at: new Date().toISOString()
};

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(output, null, 2)}\n`);
console.log(`wrote ${path.relative(root, outputFile)} (${rawPackages.length} packages)`);
NODE
