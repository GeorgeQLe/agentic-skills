import assert from "node:assert/strict";
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const packageRoot = path.resolve(import.meta.dirname, "..");
const preflightScript = path.join(packageRoot, "scripts", "prepublish-auth-check.mjs");

function makeMockNpm(packageVersion) {
  const tempDir = mkdtempSync(path.join(tmpdir(), "skillpacks-npm-mock-"));
  const npmPath = path.join(tempDir, "npm");
  writeFileSync(
    npmPath,
    `#!/usr/bin/env bash
set -euo pipefail

if [[ "$1" == "whoami" ]]; then
  if [[ "\${NPM_MOCK_WHOAMI_RC:-0}" != "0" ]]; then
    printf '%s\\n' "\${NPM_MOCK_WHOAMI_ERR:-npm error code E401}" >&2
    exit "\${NPM_MOCK_WHOAMI_RC}"
  fi
  printf '%s\\n' "\${NPM_MOCK_WHOAMI:-glexcorp}"
  exit 0
fi

if [[ "$1" == "view" && "$3" == "maintainers" ]]; then
  printf '%s\\n' "\${NPM_MOCK_MAINTAINERS:-[\\"glexcorp <george@leexperimental.com>\\"]}"
  exit "\${NPM_MOCK_MAINTAINERS_RC:-0}"
fi

if [[ "$1" == "view" && "$2" == *"@${packageVersion}" && "$3" == "version" ]]; then
  if [[ "\${NPM_MOCK_VERSION_EXISTS:-0}" == "1" ]]; then
    printf '"${packageVersion}"\\n'
    exit 0
  fi
  printf 'npm error code E404\\n' >&2
  exit 1
fi

printf 'unexpected npm args: %s\\n' "$*" >&2
exit 2
`
  );
  chmodSync(npmPath, 0o755);
  return tempDir;
}

function makePackageRoot(packageName) {
  const tempDir = mkdtempSync(path.join(tmpdir(), "skillpacks-preflight-package-"));
  mkdirSync(path.join(tempDir, "scripts"));
  copyFileSync(preflightScript, path.join(tempDir, "scripts", "prepublish-auth-check.mjs"));
  const packageVersion = JSON.parse(
    readFileSync(path.join(packageRoot, "package.json"), "utf8")
  ).version;
  writeFileSync(
    path.join(tempDir, "package.json"),
    `${JSON.stringify({ name: packageName, version: packageVersion }, null, 2)}\n`
  );
  return { root: tempDir, script: path.join(tempDir, "scripts", "prepublish-auth-check.mjs"), version: packageVersion };
}

function runPreflight(extraEnv = {}, options = {}) {
  const stage = options.packageName ? makePackageRoot(options.packageName) : {
    root: packageRoot,
    script: preflightScript,
    version: JSON.parse(readFileSync(path.join(packageRoot, "package.json"), "utf8")).version
  };
  const mockPath = makeMockNpm(stage.version);
  const result = spawnSync(process.execPath, [stage.script], {
    cwd: stage.root,
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${mockPath}${path.delimiter}${process.env.PATH}`,
      ...extraEnv
    }
  });
  result.packageVersion = stage.version;
  return result;
}

test("runs npm auth checks for publish dry-runs", () => {
  const result = runPreflight({ npm_config_dry_run: "true", NPM_MOCK_WHOAMI_RC: "1" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Log in to https:\/\/registry\.npmjs\.org\/ as glexcorp/);
  assert.doesNotMatch(result.stderr, /Skipping npm auth preflight/);
});

test("passes for the expected npm maintainer when the version is unpublished", () => {
  const result = runPreflight();
  const packageVersion = result.packageVersion;

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, new RegExp(`preflight passed for skillpacks@${packageVersion.replaceAll(".", "\\.")} as glexcorp`));
});

test("fails with login guidance when npm whoami is not authenticated", () => {
  const result = runPreflight({ NPM_MOCK_WHOAMI_RC: "1" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Log in to https:\/\/registry\.npmjs\.org\/ as glexcorp/);
  assert.match(result.stderr, /npm error code E401/);
});

test("fails when authenticated as the wrong npm user", () => {
  const result = runPreflight({ NPM_MOCK_WHOAMI: "someone-else" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Logged in as someone-else, but expected glexcorp/);
});

test("fails before publish if the package version already exists", () => {
  const result = runPreflight({ NPM_MOCK_VERSION_EXISTS: "1" });
  const packageVersion = result.packageVersion;

  assert.equal(result.status, 1);
  assert.match(result.stderr, new RegExp(`skillpacks@${packageVersion.replaceAll(".", "\\.")} is already published`));
});

test("passes for scoped alias maintainer output during dry-run preflight", () => {
  const result = runPreflight(
    {
      npm_config_dry_run: "true",
      NPM_MOCK_MAINTAINERS: JSON.stringify([{ name: "glexcorp", email: "george@leexperimental.com" }])
    },
    { packageName: "@glexcorp/gskp" }
  );
  const packageVersion = result.packageVersion;

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, new RegExp(`preflight passed for @glexcorp/gskp@${packageVersion.replaceAll(".", "\\.")} as glexcorp \\(dry run\\)`));
});

test("allows already-published versions only when explicitly requested", () => {
  const result = runPreflight({
    NPM_MOCK_VERSION_EXISTS: "1",
    SKILLPACKS_NPM_ALLOW_PUBLISHED: "true"
  });
  const packageVersion = result.packageVersion;

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, new RegExp(`skillpacks@${packageVersion.replaceAll(".", "\\.")} is already published`));
  assert.match(result.stderr, /preflight passed/);
});
