#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
PACKAGE_DIR="$ROOT_DIR/packages/skillpacks"
PACKAGE_JSON="$PACKAGE_DIR/package.json"
MANIFEST_JSON="$PACKAGE_DIR/dist/skillpacks-manifest.json"
BUILD_DIR="$PACKAGE_DIR/build"
DRY_RUN=0
TARGET=""
TMP_DIRS=()
RESTORE_DIR=""

usage() {
  cat <<'USAGE'
Usage:
  ./publish.sh patch
  ./publish.sh minor
  ./publish.sh 0.1.2
  ./publish.sh --dry-run patch

Publishes both npm packages from the same built artifact:
  - skillpacks
  - @glexcorp/gskp
USAGE
}

log() {
  printf '\n==> %s\n' "$*"
}

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  exit 1
}

run() {
  printf '+'
  printf ' %q' "$@"
  printf '\n'
  "$@"
}

kill_process_tree() {
  local signal=$1
  local pid=$2
  local child

  while read -r child; do
    [[ -n "$child" ]] || continue
    kill_process_tree "$signal" "$child"
  done < <(pgrep -P "$pid" 2>/dev/null || true)

  kill "-$signal" "$pid" 2>/dev/null || true
}

run_version_bump() {
  local timeout_seconds=${SKILLPACKS_PUBLISH_VERSION_TIMEOUT_SECONDS:-20}
  printf '+ npm --workspace packages/skillpacks version %q --no-git-tag-version --ignore-scripts --no-commit-hooks\n' "$TARGET"

  npm --workspace packages/skillpacks version "$TARGET" --no-git-tag-version --ignore-scripts --no-commit-hooks &
  local pid=$!
  local start
  start=$(date +%s)

  while kill -0 "$pid" 2>/dev/null; do
    sleep 1
    local now
    now=$(date +%s)
    if (( now - start >= timeout_seconds )); then
      local bumped_version
      bumped_version=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).version)" "$PACKAGE_JSON")
      if [[ "$bumped_version" != "$ORIGINAL_VERSION" ]]; then
        printf 'npm version did not exit within %ss after writing %s; continuing with verified manifest bump.\n' "$timeout_seconds" "$bumped_version" >&2
        kill_process_tree TERM "$pid"
        sleep 1
        kill_process_tree KILL "$pid"
        wait "$pid" 2>/dev/null || true
        return 0
      fi
      kill_process_tree TERM "$pid"
      wait "$pid" 2>/dev/null || true
      fail "npm version timed out before updating $PACKAGE_JSON."
    fi
  done

  wait "$pid"
}

verify_skillpacks_package() {
  if run npm run skillpacks:verify; then
    return 0
  fi

  log "npm run skillpacks:verify failed; running equivalent direct package verification"
  (
    cd "$PACKAGE_DIR"
    run node bin/skillpacks.mjs --version
    run node bin/skillpacks.mjs list
    run npm run build:check
    run npm pack ./build --dry-run --silent
  )
}

cleanup() {
  local dir
  for dir in "${TMP_DIRS[@]}"; do
    if [[ "$dir" == /tmp/skillpacks-publish-* && -d "$dir" ]]; then
      rm -rf "$dir"
    fi
  done

  if [[ "$DRY_RUN" == "1" && -n "$RESTORE_DIR" && -d "$RESTORE_DIR" ]]; then
    cp "$RESTORE_DIR/package.json" "$PACKAGE_JSON"
    if [[ -f "$RESTORE_DIR/skillpacks-manifest.json" ]]; then
      cp "$RESTORE_DIR/skillpacks-manifest.json" "$MANIFEST_JSON"
    fi
    rm -rf "$RESTORE_DIR"
  fi
}

trap cleanup EXIT

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    -*)
      usage >&2
      fail "Unknown option: $1"
      ;;
    *)
      if [[ -n "$TARGET" ]]; then
        usage >&2
        fail "Expected one version target, got extra argument: $1"
      fi
      TARGET="$1"
      shift
      ;;
  esac
done

if [[ -z "$TARGET" ]]; then
  usage >&2
  fail "Missing version target."
fi

case "$TARGET" in
  major|minor|patch|premajor|preminor|prepatch|prerelease|[0-9]*.[0-9]*.[0-9]*)
    ;;
  *)
    fail "Unsupported version target '$TARGET'. Use patch, minor, major, or an explicit x.y.z version."
    ;;
esac

cd "$ROOT_DIR"

if [[ -n "$(git status --porcelain)" ]]; then
  git status --short
  fail "Working tree must be clean before publishing."
fi

if [[ "$DRY_RUN" == "1" ]]; then
  RESTORE_DIR=$(mktemp -d /tmp/skillpacks-publish-restore-XXXXXX)
  cp "$PACKAGE_JSON" "$RESTORE_DIR/package.json"
  if [[ -f "$MANIFEST_JSON" ]]; then
    cp "$MANIFEST_JSON" "$RESTORE_DIR/skillpacks-manifest.json"
  fi
fi

ORIGINAL_VERSION=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).version)" "$PACKAGE_JSON")

log "Bumping packages/skillpacks to $TARGET"
run_version_bump

VERSION=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).version)" "$PACKAGE_JSON")
log "Building and verifying skillpacks@$VERSION"
run npm --workspace packages/skillpacks run build:manifest
run npm --workspace packages/skillpacks run test:node

STAGE_ROOT=$(mktemp -d /tmp/skillpacks-publish-XXXXXX)
TMP_DIRS+=("$STAGE_ROOT")
verify_skillpacks_package

SKILLPACKS_STAGE="$STAGE_ROOT/skillpacks"
GSKP_STAGE="$STAGE_ROOT/glexcorp-gskp"

run cp -R "$BUILD_DIR" "$SKILLPACKS_STAGE"
run cp -R "$BUILD_DIR" "$GSKP_STAGE"

patch_stage_manifest() {
  local stage_dir=$1
  local package_name=$2

  node - "$stage_dir" "$package_name" "$VERSION" <<'NODE'
const fs = require("fs");
const path = require("path");
const [stageDir, packageName, version] = process.argv.slice(2);
const packagePath = path.join(stageDir, "package.json");
const manifestPath = path.join(stageDir, "dist", "skillpacks-manifest.json");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));

packageJson.name = packageName;
packageJson.version = version;
packageJson.bin = {
  gskp: "bin/skillpacks.mjs",
  skillpacks: "bin/skillpacks.mjs"
};
fs.writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  manifest.package = {
    ...(manifest.package || {}),
    name: packageName,
    version
  };
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}
NODE
}

log "Patching staged package metadata"
patch_stage_manifest "$SKILLPACKS_STAGE" "skillpacks"
patch_stage_manifest "$GSKP_STAGE" "@glexcorp/gskp"

node - "$SKILLPACKS_STAGE" "$GSKP_STAGE" "$VERSION" <<'NODE'
const fs = require("fs");
const path = require("path");
const [skillpacksStage, gskpStage, version] = process.argv.slice(2);
const expectations = [
  [skillpacksStage, "skillpacks"],
  [gskpStage, "@glexcorp/gskp"]
];
const failures = [];
for (const [stage, name] of expectations) {
  const pkg = JSON.parse(fs.readFileSync(path.join(stage, "package.json"), "utf8"));
  const manifest = JSON.parse(fs.readFileSync(path.join(stage, "dist", "skillpacks-manifest.json"), "utf8"));
  if (pkg.name !== name) failures.push(`${stage} package name ${pkg.name} !== ${name}`);
  if (pkg.version !== version) failures.push(`${stage} package version ${pkg.version} !== ${version}`);
  if (pkg.bin?.gskp !== "bin/skillpacks.mjs") failures.push(`${stage} missing gskp bin`);
  if (pkg.bin?.skillpacks !== "bin/skillpacks.mjs") failures.push(`${stage} missing skillpacks bin`);
  if (manifest.package?.name !== name) failures.push(`${stage} manifest package name ${manifest.package?.name} !== ${name}`);
  if (manifest.package?.version !== version) failures.push(`${stage} manifest package version ${manifest.package?.version} !== ${version}`);
}
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
NODE

log "Running npm auth preflight"
if [[ "$DRY_RUN" == "1" ]]; then
  (cd "$SKILLPACKS_STAGE" && npm_config_dry_run=true node scripts/prepublish-auth-check.mjs)
  (cd "$GSKP_STAGE" && npm_config_dry_run=true node scripts/prepublish-auth-check.mjs)
else
  (cd "$SKILLPACKS_STAGE" && node scripts/prepublish-auth-check.mjs)
  (cd "$GSKP_STAGE" && node scripts/prepublish-auth-check.mjs)
fi

log "Publishing staged packages"
if [[ "$DRY_RUN" == "1" ]]; then
  run npm publish "$SKILLPACKS_STAGE" --dry-run
  run npm publish "$GSKP_STAGE" --access public --dry-run
  log "Dry run complete; skipped published-package verification."
  exit 0
fi

run npm publish "$SKILLPACKS_STAGE"
run npm publish "$GSKP_STAGE" --access public

log "Verifying published packages"
run env SKILLPACKS_PACKAGE_NAME=skillpacks SKILLPACKS_EXPECTED_VERSION="$VERSION" SKILLPACKS_NPM_SPEC="skillpacks@$VERSION" npm run skillpacks:verify-published
run env SKILLPACKS_PACKAGE_NAME=@glexcorp/gskp SKILLPACKS_EXPECTED_VERSION="$VERSION" SKILLPACKS_NPM_SPEC="@glexcorp/gskp@$VERSION" npm run skillpacks:verify-published

log "Published skillpacks@$VERSION and @glexcorp/gskp@$VERSION"
