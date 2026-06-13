#!/usr/bin/env bash
set -euo pipefail

# Vercel Ignored Build Step contract:
# - exit 0: ignore this commit and skip the build
# - exit 1: continue with the build

usage() {
  cat <<'USAGE'
Usage:
  scripts/vercel-ignore-build.sh
  scripts/vercel-ignore-build.sh --classify <path>...
  scripts/vercel-ignore-build.sh --classify-stdin

With no arguments, the script reads the Vercel commit range from
VERCEL_GIT_PREVIOUS_SHA and VERCEL_GIT_COMMIT_SHA. It skips builds unless at
least one changed path affects the Skills Showcase deploy surface.

The --classify modes are for local tests and print either "deploy" or "skip".
USAGE
}

is_deploy_relevant_path() {
  local path="$1"

  case "$path" in
    apps/skills-showcase/*) return 0 ;;
    docs/skills-showcase/*) return 0 ;;
    docs/benchmark-results-matrix.md) return 0 ;;
    package.json) return 0 ;;
    pnpm-lock.yaml) return 0 ;;
    pnpm-workspace.yaml) return 0 ;;
    package-lock.json) return 0 ;;
    npm-shrinkwrap.json) return 0 ;;
    yarn.lock) return 0 ;;
    bun.lockb) return 0 ;;
    vercel.json) return 0 ;;
    apps/skills-showcase/vercel.json) return 0 ;;
    scripts/vercel-ignore-build.sh) return 0 ;;
    scripts/test-vercel-ignore-build.sh) return 0 ;;
    *) return 1 ;;
  esac
}

classify_paths() {
  local path
  for path in "$@"; do
    [[ -z "$path" ]] && continue
    if is_deploy_relevant_path "$path"; then
      echo "deploy"
      return 1
    fi
  done

  echo "skip"
  return 0
}

classify_stdin() {
  local paths=()
  local path

  while IFS= read -r path; do
    paths+=("$path")
  done

  classify_paths "${paths[@]}"
}

changed_paths_for_vercel_range() {
  local previous_sha="${VERCEL_GIT_PREVIOUS_SHA:-}"
  local commit_sha="${VERCEL_GIT_COMMIT_SHA:-HEAD}"

  if [[ -n "$previous_sha" ]] && git cat-file -e "$previous_sha^{commit}" 2>/dev/null; then
    git diff --name-only "$previous_sha" "$commit_sha"
    return
  fi

  if git rev-parse --verify HEAD^ >/dev/null 2>&1; then
    git diff --name-only HEAD^ "$commit_sha"
    return
  fi

  git ls-files
}

case "${1:-}" in
  --help|-h)
    usage
    exit 0
    ;;
  --classify)
    shift
    classify_paths "$@"
    exit $?
    ;;
  --classify-stdin)
    classify_stdin
    exit $?
    ;;
  "")
    if changed_paths_for_vercel_range | "$0" --classify-stdin; then
      echo "No Skills Showcase deploy-relevant paths changed. Skipping Vercel build."
      exit 0
    fi

    echo "Skills Showcase deploy-relevant path changed. Proceeding with Vercel build."
    exit 1
    ;;
  *)
    usage >&2
    exit 2
    ;;
esac
