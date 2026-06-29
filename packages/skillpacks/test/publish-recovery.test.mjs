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
  writeFileSync(logPath, "");
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

if [[ "\${CP_MOCK_SIGNAL_DURING_RESTORE:-0}" == "1" && "$#" == "2" && "$2" == *.restore.* ]]; then
  if [[ ! -f "${tempDir}/restore-signal-sent" ]]; then
    touch "${tempDir}/restore-signal-sent"
    kill -s INT "$PPID" 2>/dev/null || true
  fi
fi

/bin/cp "$@"
`
  );

  writeFileSync(
    gitPath,
    `#!/usr/bin/env bash
set -euo pipefail

if [[ "$1" == "status" && "$*" == *"--porcelain"* ]]; then
  untracked_mode=normal
  for arg in "$@"; do
    if [[ "$arg" == "--untracked-files=no" ]]; then
      untracked_mode=no
    fi
  done

  if [[ "$untracked_mode" == "no" ]]; then
    printf '%b' "\${GIT_MOCK_TRACKED_STATUS:-}"
    exit 0
  fi
  printf '%b' "\${GIT_MOCK_TRACKED_STATUS:-}"
  printf '%b' "\${GIT_MOCK_UNTRACKED_STATUS:-}"
  exit 0
fi

if [[ "$1" == "status" ]]; then
  if [[ -n "\${GIT_MOCK_SHORT_STATUS:-}" ]]; then
    printf '%b' "\${GIT_MOCK_SHORT_STATUS}"
    exit 0
  fi
  printf '%b' "\${GIT_MOCK_TRACKED_STATUS:-}"
  printf '%b' "\${GIT_MOCK_UNTRACKED_STATUS:-}"
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

if [[ "$1" == "config" && "$2" == "get" ]]; then
  key="$3"
  if [[ "$key" == "auth-type" ]]; then
    printf '%s\\n' "\${NPM_MOCK_AUTH_TYPE:-legacy}"
    exit 0
  fi
  if [[ "$key" == *":_authToken" ]]; then
    if [[ -n "\${NPM_MOCK_REGISTRY_AUTH_TOKEN:-}" ]]; then
      printf '%s\\n' "\${NPM_MOCK_REGISTRY_AUTH_TOKEN}"
    else
      printf 'undefined\\n'
    fi
    exit 0
  fi
  printf 'undefined\\n'
  exit 0
fi

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

if [[ "$1" == "version" ]]; then
  node -e 'const fs = require("fs"); const path = require("path"); const target = process.argv[1]; const packagePath = path.join(process.cwd(), "package.json"); const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8")); let next = target; if (target === "patch") { const parts = pkg.version.split(".").map(Number); parts[2] += 1; next = parts.join("."); } pkg.version = next; fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\\n"); console.log("v" + next);' "$2"
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

if [[ "$1" == "run" && "$2" == "skillpacks:verify-published" ]]; then
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

  if [[ "$publish_count" == "1" && -n "\${NPM_MOCK_FIRST_PUBLISH_SIGNAL:-}" ]]; then
    printf 'npm notice Log in on https://www.npmjs.com/login?next=/v1/done\\n' >&2
    kill -s "\${NPM_MOCK_FIRST_PUBLISH_SIGNAL}" "$PPID" 2>/dev/null || true
    sleep 0.1
    exit 130
  fi

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

function runPublish(args, extraEnv = {}) {
  const originalPackageJson = readFileSync(packageJsonPath, "utf8");
  const originalManifestJson = readFileSync(manifestJsonPath, "utf8");
  const mock = makeMockBin();
  let result;
  let packageJsonAfter;
  let manifestJsonAfter;

  try {
    result = spawnSync("bash", [publishScript, ...args], {
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

function runPublishCurrent(extraEnv = {}, { dryRun = true } = {}) {
  const args = dryRun ? ["--dry-run", "--current"] : ["--current"];
  return runPublish(args, extraEnv);
}

function runPublishPatch(extraEnv = {}, args = ["patch"]) {
  return runPublish(args, extraEnv);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

test("tracked dirty paths block publish by default", () => {
  const result = runPublishPatch({
    GIT_MOCK_TRACKED_STATUS: " M alignment/index.html\n"
  });

  assert.equal(result.status, 1);
  assert.match(result.output, /non-release dirty paths/);
  assert.match(result.output, /alignment\/index\.html/);
  assert.match(result.output, /Tracked working tree changes must be committed before publishing/);
  assert.doesNotMatch(result.calls, /^--workspace packages\/skillpacks version /m);
  assert.doesNotMatch(result.calls, /^publish /m);
});

test("--allow-dirty-tree allows non-release dirty tracked paths and reports untracked paths", () => {
  const result = runPublishPatch({
    GIT_MOCK_TRACKED_STATUS: " M alignment/index.html\n",
    GIT_MOCK_UNTRACKED_STATUS: "?? alignment/draft-review.html\n"
  }, ["--dry-run", "--allow-dirty-tree", "patch"]);

  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /--allow-dirty-tree is continuing with non-release tracked changes present/);
  assert.match(result.output, /non-release dirty paths/);
  assert.match(result.output, /alignment\/index\.html/);
  assert.match(result.output, /untracked paths \(not included in release\)/);
  assert.match(result.output, /alignment\/draft-review\.html/);
  assert.match(result.output, /untracked files are present and will not be included unless committed/);
  assert.match(result.calls, /^publish .* --dry-run$/m);
});

test("--allow-dirty-tree works after the version target", () => {
  const result = runPublishPatch({
    GIT_MOCK_TRACKED_STATUS: " M tasks/todo.md\n"
  }, ["patch", "--allow-dirty-tree"]);

  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /--allow-dirty-tree is continuing with non-release tracked changes present/);
  assert.match(result.calls, /^publish /m);
});

test("--allow-dirty-tree rejects release-impacting dirty paths", () => {
  const releasePaths = [
    "packs/code-quality/codex/example/SKILL.md",
    "scripts/audit-alignment-pages.mjs",
    "docs/alignment-page-convention.md",
    "packages/skillpacks/package.json"
  ];

  for (const releasePath of releasePaths) {
    const result = runPublishPatch({
      GIT_MOCK_TRACKED_STATUS: ` M ${releasePath}\n`
    }, ["--allow-dirty-tree", "patch"]);

    assert.equal(result.status, 1, releasePath);
    assert.match(result.output, /release-impacting dirty paths/);
    assert.match(result.output, new RegExp(escapeRegExp(releasePath)));
    assert.match(result.output, /Tracked working tree changes must be committed before publishing/);
    assert.doesNotMatch(result.calls, /^--workspace packages\/skillpacks version /m);
    assert.doesNotMatch(result.calls, /^publish /m);
  }
});

test("--allow-dirty-tree does not broaden --current recovery dirty allowances", () => {
  const result = runPublish(["--dry-run", "--allow-dirty-tree", "--current"], {
    GIT_MOCK_TRACKED_STATUS: " M alignment/index.html\n",
    NPM_MOCK_SKILLPACKS_EXISTS: "1"
  });

  assert.equal(result.status, 1);
  assert.match(result.output, /non-release dirty paths/);
  assert.match(result.output, /alignment\/index\.html/);
  assert.match(result.output, /Tracked working tree changes must be committed before publishing/);
  assert.doesNotMatch(result.output, /--allow-dirty-tree is continuing/);
  assert.doesNotMatch(result.calls, /^publish /m);
});

test("unknown publish flags are rejected", () => {
  const result = runPublish(["--dry-run", "--unknown-flag", "patch"]);

  assert.equal(result.status, 1);
  assert.match(result.output, /Unknown option: --unknown-flag/);
  assert.doesNotMatch(result.calls, /^--workspace packages\/skillpacks version /m);
  assert.doesNotMatch(result.calls, /^publish /m);
});

test("real publish auth preflight failure restores source metadata before first publish", () => {
  const result = runPublishPatch({ NPM_MOCK_WHOAMI_RC: "1" });

  assert.equal(result.status, 1);
  assert.match(result.output, /npm publish auth preflight failed/);
  assert.doesNotMatch(result.calls, /^--workspace packages\/skillpacks version /m);
  assert.doesNotMatch(result.calls, /^publish /m);
  assert.equal(result.packageJsonAfter, result.originalPackageJson);
  assert.equal(result.manifestJsonAfter, result.originalManifestJson);
});

test("web auth without a token fails before source version bump and publish", () => {
  const result = runPublishPatch({ NPM_MOCK_AUTH_TYPE: "web" });

  assert.equal(result.status, 1);
  assert.match(result.output, /auth-type=web/);
  assert.doesNotMatch(result.calls, /^--workspace packages\/skillpacks version /m);
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

test("web auth with a token still reaches publish", () => {
  const result = runPublishPatch({
    NPM_MOCK_AUTH_TYPE: "web",
    NODE_AUTH_TOKEN: "test-token",
    NPM_MOCK_FIRST_PUBLISH_RC: "1"
  });

  const publishCalls = result.calls
    .split("\n")
    .filter((line) => line.startsWith("publish "));

  assert.equal(result.status, 1);
  assert.equal(publishCalls.length, 1, result.calls);
  assert.equal(result.packageJsonAfter, result.originalPackageJson);
  assert.equal(result.manifestJsonAfter, result.originalManifestJson);
});

test("SIGINT during first publish restores source metadata", () => {
  const result = runPublishPatch({ NPM_MOCK_FIRST_PUBLISH_SIGNAL: "INT" });

  assert.equal(result.status, 130, result.output);
  assert.match(result.output, /Interrupted by SIGINT/);
  assert.equal(result.packageJsonAfter, result.originalPackageJson);
  assert.equal(result.manifestJsonAfter, result.originalManifestJson);
  assert.deepEqual(result.registry, []);
});

test("repeated interrupt during cleanup still restores source metadata", () => {
  const result = runPublishPatch({
    NPM_MOCK_FIRST_PUBLISH_SIGNAL: "INT",
    CP_MOCK_SIGNAL_DURING_RESTORE: "1"
  });

  assert.equal(result.status, 130, result.output);
  assert.equal(result.packageJsonAfter, result.originalPackageJson);
  assert.equal(result.manifestJsonAfter, result.originalManifestJson);
  assert.deepEqual(result.registry, []);
});

test("--current publishes pre-bumped current version when both packages are unpublished", () => {
  const result = runPublishCurrent({
    GIT_MOCK_TRACKED_STATUS: [
      " M packages/skillpacks/package.json",
      " M packages/skillpacks/dist/skillpacks-manifest.json",
      ""
    ].join("\n")
  }, {
    dryRun: false
  });

  const publishCalls = result.calls
    .split("\n")
    .filter((line) => line.startsWith("publish "));

  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /--current is continuing with only release-state tracked changes present/);
  assert.match(result.output, /Current source release confirmed: neither skillpacks@/);
  assert.doesNotMatch(result.calls, /^--workspace packages\/skillpacks version /m);
  assert.equal(publishCalls.length, 2, result.calls);
  assert.deepEqual(result.registry, [
    `skillpacks@${packageVersion}`,
    `@glexcorp/gskp@${packageVersion}`
  ]);
  assert.match(result.output, /Post-publish source-state requirement/);
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

test("--current recovery verifies when both packages are already published", () => {
  const result = runPublishCurrent({
    NPM_MOCK_SKILLPACKS_EXISTS: "1",
    NPM_MOCK_GSKP_EXISTS: "1"
  }, {
    dryRun: false
  });

  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /both published; rerunning final verification/);
  assert.match(result.output, /skipping npm auth preflight because both packages are already published/);
  assert.match(result.output, /Verifying published packages/);
  assert.match(result.output, /Post-publish source-state requirement/);
  assert.doesNotMatch(result.calls, /^publish /m);
  assert.equal(
    result.calls
      .split("\n")
      .filter((line) => line === "run skillpacks:verify-published")
      .length,
    2,
    result.calls
  );
});

test("--current recovery rejects alias-only registry state", () => {
  const result = runPublishCurrent({ NPM_MOCK_GSKP_EXISTS: "1" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Inconsistent registry state/);
  assert.doesNotMatch(result.calls, /^publish /m);
});
