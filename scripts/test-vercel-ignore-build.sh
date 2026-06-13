#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT="$ROOT/scripts/vercel-ignore-build.sh"

pass_count=0

expect_skip() {
  local name="$1"
  shift

  local output
  if output="$("$SCRIPT" --classify "$@")" && [[ "$output" == "skip" ]]; then
    pass_count=$((pass_count + 1))
    return
  fi

  echo "FAIL: expected skip for $name" >&2
  echo "paths: $*" >&2
  echo "output: ${output:-<none>}" >&2
  exit 1
}

expect_deploy() {
  local name="$1"
  shift

  local output
  set +e
  output="$("$SCRIPT" --classify "$@")"
  local rc=$?
  set -e

  if [[ "$rc" -eq 1 && "$output" == "deploy" ]]; then
    pass_count=$((pass_count + 1))
    return
  fi

  echo "FAIL: expected deploy for $name" >&2
  echo "paths: $*" >&2
  echo "rc: $rc" >&2
  echo "output: ${output:-<none>}" >&2
  exit 1
}

expect_skip "skill source only" \
  "packs/product-design/codex/ui-interview/SKILL.md"

expect_skip "workflow evidence only" \
  "tasks/todo.md" \
  "prompts/investigate/skill-prompt-20260612-212935-repo-boundary-deploy-gating.md"

expect_skip "alignment only" \
  "alignment/investigate-repo-boundary.html"

expect_skip "archive only" \
  "archive/old-work/README.md"

expect_skip "non-showcase package only" \
  "packages/skillpacks/src/cli/lifecycle.mjs"

expect_deploy "showcase app runtime" \
  "apps/skills-showcase/src/showcase/catalog.tsx"

expect_deploy "showcase generated docs mirror" \
  "docs/skills-showcase/assets/skills-data.js"

expect_deploy "benchmark matrix generated asset" \
  "docs/benchmark-results-matrix.md"

expect_deploy "root package manifest" \
  "package.json"

expect_deploy "workspace manifest" \
  "pnpm-workspace.yaml"

expect_deploy "mixed skill plus showcase" \
  "packs/product-design/codex/ui-interview/SKILL.md" \
  "apps/skills-showcase/public/assets/skills-data.js"

expect_deploy "deploy gate changed" \
  "scripts/vercel-ignore-build.sh"

echo "vercel-ignore-build tests passed ($pass_count cases)."
