import assert from "node:assert/strict";
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const packageRoot = path.resolve(import.meta.dirname, "..");
const preflightScript = path.join(packageRoot, "scripts", "prepublish-auth-check.mjs");

function makeMockNpm() {
  const tempDir = mkdtempSync(path.join(tmpdir(), "skillpacks-npm-mock-"));
  const npmPath = path.join(tempDir, "npm");
  const packageVersion = JSON.parse(
    readFileSync(path.join(packageRoot, "package.json"), "utf8")
  ).version;
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

if [[ "$1" == "view" && "$2" == "skillpacks" && "$3" == "maintainers" ]]; then
  printf '%s\\n' "\${NPM_MOCK_MAINTAINERS:-[\\"glexcorp <george@leexperimental.com>\\"]}"
  exit "\${NPM_MOCK_MAINTAINERS_RC:-0}"
fi

if [[ "$1" == "view" && "$2" == "skillpacks@${packageVersion}" && "$3" == "version" ]]; then
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

function runPreflight(extraEnv = {}) {
  const mockPath = makeMockNpm();
  return spawnSync(process.execPath, [preflightScript], {
    cwd: packageRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${mockPath}${path.delimiter}${process.env.PATH}`,
      ...extraEnv
    }
  });
}

test("skips npm auth checks for publish dry-runs", () => {
  const result = runPreflight({ npm_config_dry_run: "true", NPM_MOCK_WHOAMI_RC: "1" });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, /Skipping npm auth preflight/);
});

test("passes for the expected npm maintainer when the version is unpublished", () => {
  const result = runPreflight();
  const packageVersion = JSON.parse(
    readFileSync(path.join(packageRoot, "package.json"), "utf8")
  ).version;

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
  const packageVersion = JSON.parse(
    readFileSync(path.join(packageRoot, "package.json"), "utf8")
  ).version;

  assert.equal(result.status, 1);
  assert.match(result.stderr, new RegExp(`skillpacks@${packageVersion.replaceAll(".", "\\.")} is already published`));
});
