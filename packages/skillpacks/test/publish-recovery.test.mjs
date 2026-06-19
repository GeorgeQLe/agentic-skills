import assert from "node:assert/strict";
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const repoRoot = path.resolve(import.meta.dirname, "../../..");
const publishScript = path.join(repoRoot, "publish.sh");
const packageVersion = JSON.parse(
  readFileSync(path.join(repoRoot, "packages/skillpacks/package.json"), "utf8")
).version;

function makeMockBin() {
  const tempDir = mkdtempSync(path.join(tmpdir(), "skillpacks-publish-mock-"));
  const logPath = path.join(tempDir, "calls.log");
  const cpPath = path.join(tempDir, "cp");
  const gitPath = path.join(tempDir, "git");
  const npmPath = path.join(tempDir, "npm");

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

if [[ "$1" == "view" && "$2" == "skillpacks@${packageVersion}" && "$3" == "version" ]]; then
  if [[ "\${NPM_MOCK_SKILLPACKS_EXISTS:-0}" == "1" ]]; then
    printf '"${packageVersion}"\\n'
    exit 0
  fi
  printf 'npm error code E404\\n' >&2
  exit 1
fi

if [[ "$1" == "view" && "$2" == "@glexcorp/gskp@${packageVersion}" && "$3" == "version" ]]; then
  if [[ "\${NPM_MOCK_GSKP_EXISTS:-0}" == "1" ]]; then
    printf '"${packageVersion}"\\n'
    exit 0
  fi
  printf 'npm error code E404\\n' >&2
  exit 1
fi

if [[ "$1" == "view" && "$3" == "maintainers" ]]; then
  printf '[{"name":"glexcorp","email":"george@leexperimental.com"}]\\n'
  exit 0
fi

if [[ "$1" == "whoami" ]]; then
  printf 'glexcorp\\n'
  exit 0
fi

if [[ "$1" == "--workspace" && "$2" == "packages/skillpacks" && "$3" == "run" ]]; then
  exit 0
fi

if [[ "$1" == "run" && "$2" == "skillpacks:verify" ]]; then
  exit 0
fi

if [[ "$1" == "publish" ]]; then
  exit 0
fi

printf 'unexpected npm args: %s\\n' "$*" >&2
exit 2
`
  );

  chmodSync(cpPath, 0o755);
  chmodSync(gitPath, 0o755);
  chmodSync(npmPath, 0o755);
  return { binDir: tempDir, logPath };
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
    calls: readFileSync(mock.logPath, "utf8")
  };
}

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
