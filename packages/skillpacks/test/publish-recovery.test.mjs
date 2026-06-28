import assert from "node:assert/strict";
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const publishScript = path.join(repoRoot, "publish.sh");
const packageJsonPath = path.join(repoRoot, "packages/skillpacks/package.json");
const manifestJsonPath = path.join(repoRoot, "packages/skillpacks/dist/skillpacks-manifest.json");
const packageVersion = JSON.parse(
  readFileSync(packageJsonPath, "utf8")
).version;

function makeMockBin() {
  const tempDir = mkdtempSync(path.join(tmpdir(), "skillpacks-publish-mock-"));
  const logPath = path.join(tempDir, "calls.log");
  const publishCountPath = path.join(tempDir, "publish-count");
  const registryPath = path.join(tempDir, "registry.txt");
  const cpPath = path.join(tempDir, "cp");
  const gitPath = path.join(tempDir, "git");
  const npmPath = path.join(tempDir, "npm");
  writeFileSync(publishCountPath, "0\n");
  writeFileSync(registryPath, "");

  writeFileSync(
    cpPath,
    `#!/usr/bin/env bash
set -euo pipefail

if [[ "$1" == "-R" && "$2" == "${repoRoot}/packages/skillpacks/build" ]]; then
  dest="$3"
  mkdir -p "$dest/dist" "$dest/scripts" "$dest/bin"
  printf '{"name":"skillpacks","version":"${packageVersion}","bin":{"gskp":"bin/skillpacks.mjs","skillpacks":"bin/skillpacks.mjs"}}\\n' > "$dest/package.json"
  printf '{"package":{"name":"skillpacks","version":"${packageVersion}"}}\\n' > "$dest/dist/skillpacks-manifest.json"
  printf '#!/usr/bin/env node\\n' > "$dest/bin/skillpacks.mjs"
  /bin/cp "${repoRoot}/packages/skillpacks/scripts/prepublish-auth-check.mjs" "$dest/scripts/prepublish-auth-check.mjs"
  exit 0
fi

/bin/cp "$@"
`
  );

  writeFileSync(
    gitPath,
    `#!/usr/bin/env bash
set -euo pipefail

if [[ "$1" == "status" && "$*" == *"--porcelain"* ]]; then
  exit 0
fi

if [[ "$1" == "status" ]]; then
  exit 0
fi

printf 'unexpected git args: %s\\n' "$*" >&2
exit 2
`
  );

  writeFileSync(
    npmPath,
    `#!/usr/bin/env bash
set -euo pipefail

printf '%s\\n' "$*" >> "${logPath}"

if [[ "$1" == "view" && "$3" == "version" ]]; then
  spec="$2"
  version="\${spec##*@}"
  package_name="\${spec%@*}"
  if grep -Fxq "$spec" "${registryPath}"; then
    printf '"%s"\\n' "$version"
    exit 0
  fi
  if [[ "$package_name" == "skillpacks" && "\${NPM_MOCK_SKILLPACKS_EXISTS:-0}" == "1" ]]; then
    printf '"%s"\\n' "$version"
    exit 0
  fi
  if [[ "$package_name" == "@glexcorp/gskp" && "\${NPM_MOCK_GSKP_EXISTS:-0}" == "1" ]]; then
    printf '"%s"\\n' "$version"
    exit 0
  fi
  printf 'npm error code E404\\n' >&2
  exit 1
fi

if [[ "$1" == "view" && "$3" == "maintainers" ]]; then
  printf '[{"name":"glexcorp","email":"george@leexperimental.com"}]\\n'
  exit 0
fi

if [[ "$1" == "--workspace" && "$2" == "packages/skillpacks" && "$3" == "version" ]]; then
  node -e 'const fs = require("fs"); const [packagePath, target] = process.argv.slice(1); const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8")); let next = target; if (target === "patch") { const parts = pkg.version.split(".").map(Number); parts[2] += 1; next = parts.join("."); } pkg.version = next; fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\\n"); console.log("v" + next);' "${packageJsonPath}" "$4"
  exit 0
fi

if [[ "$1" == "whoami" ]]; then
  if [[ "\${NPM_MOCK_WHOAMI_RC:-0}" != "0" ]]; then
    printf '%s\\n' "\${NPM_MOCK_WHOAMI_ERR:-npm error code E401}" >&2
    exit "\${NPM_MOCK_WHOAMI_RC}"
  fi
  printf 'glexcorp\\n'
  exit 0
fi

if [[ "$1" == "--workspace" && "$2" == "packages/skillpacks" && "$3" == "run" ]]; then
  if [[ "$4" == "build:manifest" ]]; then
    node -e 'const fs = require("fs"); const [packagePath, manifestPath] = process.argv.slice(1); const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8")); const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8")); manifest.package = { ...(manifest.package || {}), version: pkg.version }; fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\\n");' "${packageJsonPath}" "${manifestJsonPath}"
  fi
  exit 0
fi

if [[ "$1" == "run" && "$2" == "skillpacks:verify" ]]; then
  exit 0
fi

if [[ "$1" == "publish" ]]; then
  is_dry_run=0
  for arg in "$@"; do
    if [[ "$arg" == "--dry-run" ]]; then
      is_dry_run=1
    fi
  done
  if [[ "$is_dry_run" == "1" ]]; then
    exit 0
  fi

  publish_count=$(cat "${publishCountPath}")
  publish_count=$((publish_count + 1))
  printf '%s\\n' "$publish_count" > "${publishCountPath}"

  if [[ "$publish_count" == "1" && "\${NPM_MOCK_FIRST_PUBLISH_RC:-0}" != "0" ]]; then
    printf 'npm notice Log in on https://www.npmjs.com/login?next=/v1/done\\n' >&2
    printf 'npm error code E404\\n' >&2
    printf 'npm error 404 Not Found - PUT https://registry.npmjs.org/-/v1/done\\n' >&2
    exit "\${NPM_MOCK_FIRST_PUBLISH_RC}"
  fi

  node -e 'const fs = require("fs"); const path = require("path"); const [stage, registry] = process.argv.slice(1); const pkg = JSON.parse(fs.readFileSync(path.join(stage, "package.json"), "utf8")); fs.appendFileSync(registry, pkg.name + "@" + pkg.version + "\\n");' "$2" "${registryPath}"
  exit 0
fi

printf 'unexpected npm args: %s\\n' "$*" >&2
exit 2
`
  );

  chmodSync(cpPath, 0o755);
  chmodSync(gitPath, 0o755);
  chmodSync(npmPath, 0o755);
  return { binDir: tempDir, logPath, registryPath };
}

function runPublishCurrent(extraEnv = {}) {
  const mock = makeMockBin();
  const result = spawnSync("bash", [publishScript, "--dry-run", "--current"], {
    cwd: repoRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${mock.binDir}${path.delimiter}${process.env.PATH}`,
      ...extraEnv
    }
  });

  return {
    ...result,
    output: `${result.stdout}\n${result.stderr}`,
    calls: readFileSync(mock.logPath, "utf8"),
    registry: readFileSync(mock.registryPath, "utf8")
      .split("\n")
      .filter(Boolean)
  };
}

function runPublishPatch(extraEnv = {}) {
  const originalPackageJson = readFileSync(packageJsonPath, "utf8");
  const originalManifestJson = readFileSync(manifestJsonPath, "utf8");
  const mock = makeMockBin();
  let result;
  let packageJsonAfter;
  let manifestJsonAfter;

  try {
    result = spawnSync("bash", [publishScript, "patch"], {
      cwd: repoRoot,
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: `${mock.binDir}${path.delimiter}${process.env.PATH}`,
        ...extraEnv
      }
    });
    packageJsonAfter = readFileSync(packageJsonPath, "utf8");
    manifestJsonAfter = readFileSync(manifestJsonPath, "utf8");
  } finally {
    writeFileSync(packageJsonPath, originalPackageJson);
    writeFileSync(manifestJsonPath, originalManifestJson);
  }

  return {
    ...result,
    output: `${result.stdout}\n${result.stderr}`,
    calls: readFileSync(mock.logPath, "utf8"),
    originalPackageJson,
    originalManifestJson,
    packageJsonAfter,
    manifestJsonAfter,
    registry: readFileSync(mock.registryPath, "utf8")
      .split("\n")
      .filter(Boolean)
  };
}

test("real publish auth preflight failure restores source metadata before first publish", () => {
  const result = runPublishPatch({ NPM_MOCK_WHOAMI_RC: "1" });

  assert.equal(result.status, 1);
  assert.match(result.output, /npm publish auth preflight failed/);
  assert.doesNotMatch(result.calls, /^publish /m);
  assert.equal(result.packageJsonAfter, result.originalPackageJson);
  assert.equal(result.manifestJsonAfter, result.originalManifestJson);
});

test("real first publish web auth failure restores source metadata", () => {
  const result = runPublishPatch({ NPM_MOCK_FIRST_PUBLISH_RC: "1" });

  assert.equal(result.status, 1);
  assert.match(result.output, /\/v1\/done/);
  const publishCalls = result.calls
    .split("\n")
    .filter((line) => line.startsWith("publish "));

  assert.equal(publishCalls.length, 1, result.calls);
  assert.deepEqual(result.registry, []);
  assert.equal(result.packageJsonAfter, result.originalPackageJson);
  assert.equal(result.manifestJsonAfter, result.originalManifestJson);
});

test("--current recovery publishes only the scoped alias when skillpacks exists and alias is missing", () => {
  const result = runPublishCurrent({ NPM_MOCK_SKILLPACKS_EXISTS: "1" });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.output, /Recovery dry run: skipping skillpacks/);
  const publishCalls = result.calls
    .split("\n")
    .filter((line) => line.startsWith("publish "));

  assert.equal(publishCalls.length, 1, result.calls);
  assert.match(publishCalls[0], /--access public --dry-run/);
});

test("--current recovery fails clearly when both packages are already published", () => {
  const result = runPublishCurrent({
    NPM_MOCK_SKILLPACKS_EXISTS: "1",
    NPM_MOCK_GSKP_EXISTS: "1"
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Recovery already complete/);
  assert.doesNotMatch(result.calls, /^publish /m);
});

test("--current recovery rejects alias-only registry state", () => {
  const result = runPublishCurrent({ NPM_MOCK_GSKP_EXISTS: "1" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Inconsistent registry state/);
  assert.doesNotMatch(result.calls, /^publish /m);
});
