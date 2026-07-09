import assert from "node:assert/strict";
import { chmodSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const packageRoot = path.resolve(import.meta.dirname, "..");
const verifyScript = path.join(packageRoot, "scripts", "verify-published-package.sh");

function writeExecutable(filePath, source) {
  writeFileSync(filePath, source);
  chmodSync(filePath, 0o755);
}

function makeMockBin() {
  const tempDir = mkdtempSync(path.join(tmpdir(), "skillpacks-verify-published-mock-"));
  const npmLog = path.join(tempDir, "npm.log");
  const npxLog = path.join(tempDir, "npx.log");
  const npxArgsLog = path.join(tempDir, "npx-args.log");
  const countFile = path.join(tempDir, "metadata-count");
  const npxCountFile = path.join(tempDir, "npx-count");
  writeFileSync(npmLog, "");
  writeFileSync(npxLog, "");
  writeFileSync(npxArgsLog, "");
  writeFileSync(countFile, "0\n");
  writeFileSync(npxCountFile, "0\n");

  writeExecutable(
    path.join(tempDir, "npm"),
    `#!/usr/bin/env bash
set -euo pipefail

printf '%s\\n' "$*" >> "$NPM_MOCK_LOG"

expected_version=\${NPM_MOCK_EXPECTED_VERSION:?}
stale_version=\${NPM_MOCK_STALE_VERSION:-0.0.0}
stale_attempts=\${NPM_MOCK_STALE_ATTEMPTS:-0}
count_file=\${NPM_MOCK_COUNT_FILE:?}

read_count() {
  if [[ -f "$count_file" ]]; then
    cat "$count_file"
  else
    printf '0\\n'
  fi
}

version_for_count() {
  local count=$1
  if (( count <= stale_attempts )); then
    printf '%s\\n' "$stale_version"
  else
    printf '%s\\n' "$expected_version"
  fi
}

if [[ "$1" == "view" && "$2" == skillpacks@* && "$3" == "version" && "$4" == "license" ]]; then
  count=$(read_count)
  count=$((count + 1))
  printf '%s\\n' "$count" > "$count_file"
  current_version=$(version_for_count "$count")
  printf '{"version":"%s","license":"MIT"}\\n' "$current_version"
  exit 0
fi

if [[ "$1" == "view" && "$2" == "skillpacks" && "$3" == dist-tags.* ]]; then
  count=$(read_count)
  current_version=$(version_for_count "$count")
  printf '"%s"\\n' "$current_version"
  exit 0
fi

if [[ "$1" == "view" && "$2" == "skillpacks" && "$3" == "versions" ]]; then
  count=$(read_count)
  current_version=$(version_for_count "$count")
  if [[ "$current_version" == "$expected_version" ]]; then
    printf '["%s","%s"]\\n' "$stale_version" "$expected_version"
  else
    printf '["%s"]\\n' "$stale_version"
  fi
  exit 0
fi

printf 'unexpected npm args: %s\\n' "$*" >&2
exit 2
`
  );

  writeExecutable(
    path.join(tempDir, "npx"),
    `#!/usr/bin/env bash
set -euo pipefail

printf '%s\\n' "$*" >> "$NPX_MOCK_ARGS_LOG"

cmd=()
while [[ $# -gt 0 ]]; do
  if [[ "$1" == "--" ]]; then
    shift
    if [[ "\${1:-}" == "skillpacks" ]]; then
      shift
      cmd=("$@")
      break
    fi
  fi
  shift
done

printf '%s\\n' "\${cmd[*]:-}" >> "$NPX_MOCK_LOG"

npx_count_file=\${NPX_MOCK_COUNT_FILE:?}
npx_fail_command=\${NPX_MOCK_FAIL_COMMAND:-list}
npx_propagation_failures=\${NPX_MOCK_PROPAGATION_FAILURES:-0}
npx_cli_failures=\${NPX_MOCK_CLI_FAILURES:-0}

read_npx_count() {
  if [[ -f "$npx_count_file" ]]; then
    cat "$npx_count_file"
  else
    printf '0\\n'
  fi
}

maybe_trigger_mock_failure() {
  local command=$1
  if [[ "$command" != "$npx_fail_command" ]]; then
    return 0
  fi

  local count
  count=$(read_npx_count)
  count=$((count + 1))
  printf '%s\\n' "$count" > "$npx_count_file"

  if (( count <= npx_propagation_failures )); then
    printf 'npm ERR! code ETARGET\\n' >&2
    printf 'npm ERR! notarget No matching version found for %s.\\n' "\${SKILLPACKS_NPM_SPEC:-skillpacks@9.9.9}" >&2
    exit 1
  fi

  if (( count <= npx_cli_failures )); then
    printf 'skillpacks CLI exploded after package resolution\\n' >&2
    exit 7
  fi
}

maybe_trigger_mock_failure "\${cmd[0]:-}"

write_skill() {
  local root=$1
  local name=$2
  local version=\${3:-v1.0}
  mkdir -p "$root/skills/$name"
  printf 'version: %s\\n' "$version" > "$root/skills/$name/SKILL.md"
}

write_counted_skills() {
  local count=$1
  rm -rf .claude .codex
  mkdir -p .claude/skills .codex/skills
  local i
  for ((i = 1; i <= count; i++)); do
    write_skill .claude "skill-$i"
    write_skill .codex "skill-$i"
  done
}

write_quality_skill() {
  local version=\${1:-v1.0}
  rm -rf .claude .codex
  mkdir -p .claude/skills .codex/skills
  write_skill .claude quality-sweep "$version"
  write_skill .codex quality-sweep "$version"
}

case "\${cmd[0]:-}" in
  list)
    printf 'code-quality\\ngame\\n'
    ;;
  install)
    if [[ "\${cmd[1]:-}" == "quality-sweep@v0.0" ]]; then
      printf "Unknown pack or skill 'quality-sweep@v0.0'\\n" >&2
      exit 1
    fi
    mkdir -p .agents
    if [[ "\${cmd[1]:-}" == "code-quality" ]]; then
      printf '{"enabled_packs":["code-quality"]}\\n' > .agents/project.json
      write_counted_skills 2
    elif [[ "\${cmd[1]:-}" == "quality-sweep" ]]; then
      printf '{"enabled_skills":{"quality-sweep":"code-quality"}}\\n' > .agents/project.json
      write_quality_skill v1.0
    else
      printf 'unexpected install target: %s\\n' "\${cmd[1]:-}" >&2
      exit 2
    fi
    ;;
  install-deck)
    mkdir -p .agents
    printf '{"enabled_packs":["game"]}\\n' > .agents/project.json
    write_counted_skills 11
    ;;
  remove)
    mkdir -p .agents
    rm -rf .claude .codex
    mkdir -p .claude/skills .codex/skills
    if [[ "\${cmd[1]:-}" == "quality-sweep" ]]; then
      printf '{"enabled_skills":{}}\\n' > .agents/project.json
    else
      printf '{"enabled_packs":[]}\\n' > .agents/project.json
    fi
    ;;
  doctor)
    if [[ -f .agents/project.json ]] && grep -q pinned_versions .agents/project.json; then
      printf 'ok pinned frozen v0.0\\n'
    elif [[ ! -d .codex/skills ]] || [[ -z "$(find .codex/skills -mindepth 1 -maxdepth 1 -type d 2>/dev/null)" ]]; then
      printf '(no managed skill installs found)\\n'
    else
      printf 'ok\\n'
    fi
    ;;
  pin)
    if [[ ! -f .agents/project.json ]]; then
      printf 'No .agents/project.json found\\n' >&2
      exit 1
    fi
    printf '{"enabled_skills":{"quality-sweep":"code-quality"},"pinned_versions":{"quality-sweep":"v0.0"}}\\n' > .agents/project.json
    write_quality_skill v0.0
    ;;
  unpin)
    printf '{"enabled_skills":{"quality-sweep":"code-quality"},"pinned_versions":{}}\\n' > .agents/project.json
    write_quality_skill v1.0
    ;;
  *)
    printf 'unexpected npx skillpacks command: %s\\n' "\${cmd[*]:-}" >&2
    exit 2
    ;;
esac
`
  );

  return { binDir: tempDir, npmLog, npxLog, npxArgsLog, countFile, npxCountFile };
}

function runVerifier({
  staleAttempts = 0,
  attempts = "3",
  npxPropagationFailures = 0,
  npxCliFailures = 0,
  npxFailCommand = "list",
  distTag = "latest"
}) {
  const mock = makeMockBin();
  const expectedVersion = "9.9.9";
  const staleVersion = "9.9.8";
  const result = spawnSync("bash", [verifyScript], {
    cwd: packageRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${mock.binDir}${path.delimiter}${process.env.PATH}`,
      SKILLPACKS_PACKAGE_NAME: "skillpacks",
      SKILLPACKS_EXPECTED_VERSION: expectedVersion,
      SKILLPACKS_EXPECTED_LICENSE: "MIT",
      SKILLPACKS_EXPECTED_DIST_TAG: distTag,
      SKILLPACKS_NPM_SPEC: `skillpacks@${distTag}`,
      SKILLPACKS_KEEP_TMP: "0",
      SKILLPACKS_VERIFY_PUBLISHED_ATTEMPTS: attempts,
      SKILLPACKS_VERIFY_PUBLISHED_DELAY_SECONDS: "0",
      NPM_MOCK_LOG: mock.npmLog,
      NPM_MOCK_COUNT_FILE: mock.countFile,
      NPM_MOCK_EXPECTED_VERSION: expectedVersion,
      NPM_MOCK_STALE_VERSION: staleVersion,
      NPM_MOCK_STALE_ATTEMPTS: String(staleAttempts),
      NPX_MOCK_LOG: mock.npxLog,
      NPX_MOCK_ARGS_LOG: mock.npxArgsLog,
      NPX_MOCK_COUNT_FILE: mock.npxCountFile,
      NPX_MOCK_PROPAGATION_FAILURES: String(npxPropagationFailures),
      NPX_MOCK_CLI_FAILURES: String(npxCliFailures),
      NPX_MOCK_FAIL_COMMAND: npxFailCommand
    }
  });

  return {
    ...result,
    output: `${result.stdout}\n${result.stderr}`,
    npmCalls: readFileSync(mock.npmLog, "utf8"),
    npxCalls: readFileSync(mock.npxLog, "utf8"),
    npxArgCalls: readFileSync(mock.npxArgsLog, "utf8")
  };
}

test("published-package verification retries stale npm metadata before smoke tests", () => {
  const result = runVerifier({ staleAttempts: 2, attempts: "3" });

  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /metadata mismatch for skillpacks expected 9\.9\.9 \(attempt 1\/3\)/);
  assert.match(result.output, /metadata mismatch for skillpacks expected 9\.9\.9 \(attempt 2\/3\)/);
  assert.match(result.output, /ok metadata: skillpacks@latest=9\.9\.9, license=MIT/);
  assert.match(result.output, /Published package smoke verification passed/);
  assert.match(result.npmCalls, /--prefer-online/);
  assert.match(result.npxArgCalls, /--prefer-online/);
  assert.equal(result.npxCalls.split("\n").filter(Boolean)[0], "list");
});

test("published-package verification checks a non-latest dist-tag when requested", () => {
  const result = runVerifier({ distTag: "experimental" });

  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /ok metadata: skillpacks@experimental=9\.9\.9, license=MIT/);
  assert.match(result.npmCalls, /^view skillpacks@experimental version license/m);
  assert.match(result.npmCalls, /^view skillpacks dist-tags\.experimental/m);
  assert.match(result.npxArgCalls, /--package skillpacks@experimental/);
});

test("published-package verification fails after bounded stale metadata retries", () => {
  const result = runVerifier({ staleAttempts: 99, attempts: "2" });

  assert.equal(result.status, 1);
  assert.match(result.output, /metadata mismatch for skillpacks expected 9\.9\.9 \(attempt 1\/2\)/);
  assert.match(result.output, /skillpacks@latest version expected 9\.9\.9, got 9\.9\.8/);
  assert.match(result.output, /skillpacks latest dist-tag expected 9\.9\.9, got 9\.9\.8/);
  assert.match(result.output, /skillpacks versions does not include 9\.9\.9/);
  assert.match(result.output, /after 2 attempt\(s\)/);
  assert.equal(result.npxCalls, "");
});

test("published-package verification retries npx propagation failures during smoke tests", () => {
  const result = runVerifier({
    attempts: "3",
    npxPropagationFailures: 1
  });

  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /published package smoke command hit npm propagation error for skillpacks@latest \(attempt 1\/3\)/);
  assert.match(result.output, /ETARGET/);
  assert.match(result.output, /Published package smoke verification passed/);
  assert.match(result.npxArgCalls, /--prefer-online/);

  const npxCalls = result.npxCalls.split("\n").filter(Boolean);
  assert.equal(npxCalls[0], "list");
  assert.equal(npxCalls[1], "list");
});

test("published-package verification does not retry non-propagation CLI failures", () => {
  const result = runVerifier({
    attempts: "3",
    npxCliFailures: 1
  });

  assert.equal(result.status, 1);
  assert.match(result.output, /skillpacks CLI exploded after package resolution/);
  assert.doesNotMatch(result.output, /retrying in/);

  const npxCalls = result.npxCalls.split("\n").filter(Boolean);
  assert.deepEqual(npxCalls, ["list"]);
});
