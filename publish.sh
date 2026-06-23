#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
PACKAGE_DIR="$ROOT_DIR/packages/skillpacks"
PACKAGE_JSON="$PACKAGE_DIR/package.json"
MANIFEST_JSON="$PACKAGE_DIR/dist/skillpacks-manifest.json"
BUILD_DIR="$PACKAGE_DIR/build"
DRY_RUN=0
USE_CURRENT=0
TARGET=""
TMP_DIRS=()
RESTORE_DIR=""

usage() {
  cat <<'USAGE'
Usage:
  ./publish.sh patch
  ./publish.sh minor
  ./publish.sh 0.1.2
  ./publish.sh --current
  ./publish.sh --dry-run patch
  ./publish.sh --dry-run --current

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

package_published() {
  local package_name=$1
  local version=$2
  npm view "${package_name}@${version}" version >/dev/null 2>&1
}

tracked_changes_allowed_for_current_recovery() {
  local status_output=$1
  local line path

  while IFS= read -r line; do
    [[ -n "$line" ]] || continue
    path=${line:3}
    case "$path" in
      packages/skillpacks/package.json|packages/skillpacks/dist/skillpacks-manifest.json)
        ;;
      *)
        return 1
        ;;
    esac
  done <<< "$status_output"

  return 0
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

  if ! wait "$pid"; then
    local bumped_version
    bumped_version=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).version)" "$PACKAGE_JSON")
    if [[ "$bumped_version" != "$ORIGINAL_VERSION" ]]; then
      printf 'npm version exited non-zero after writing %s; continuing with verified manifest bump.\n' "$bumped_version" >&2
      return 0
    fi
    return 1
  fi
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
  )
  node - "$BUILD_DIR" "$VERSION" <<'NODE'
const fs = require("fs");
const path = require("path");
const [buildDir, version] = process.argv.slice(2);
const pkg = JSON.parse(fs.readFileSync(path.join(buildDir, "package.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(buildDir, "dist", "skillpacks-manifest.json"), "utf8"));
const failures = [];
if (pkg.name !== "skillpacks") failures.push(`package name ${pkg.name} !== skillpacks`);
if (pkg.version !== version) failures.push(`package version ${pkg.version} !== ${version}`);
if (pkg.bin?.gskp !== "bin/skillpacks.mjs") failures.push("missing gskp bin");
if (pkg.bin?.skillpacks !== "bin/skillpacks.mjs") failures.push("missing skillpacks bin");
if (!fs.existsSync(path.join(buildDir, "bin", "skillpacks.mjs"))) failures.push("missing bin/skillpacks.mjs");
if (manifest.package?.name !== "skillpacks") failures.push(`manifest package name ${manifest.package?.name} !== skillpacks`);
if (manifest.package?.version !== version) failures.push(`manifest package version ${manifest.package?.version} !== ${version}`);
if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}
console.log(`Verified built package metadata for skillpacks@${version}.`);
NODE
}

atomic_restore_file() {
  local source=$1
  local target=$2
  local tmp="${target}.restore.$$"

  cp "$source" "$tmp"
  mv "$tmp" "$target"
}

cleanup() {
  local dir
  for dir in "${TMP_DIRS[@]}"; do
    if [[ "$dir" == /tmp/skillpacks-publish-* && -d "$dir" ]]; then
      rm -rf "$dir"
    fi
  done

  if [[ "$DRY_RUN" == "1" && -n "$RESTORE_DIR" && -d "$RESTORE_DIR" ]]; then
    atomic_restore_file "$RESTORE_DIR/package.json" "$PACKAGE_JSON"
    if [[ -f "$RESTORE_DIR/skillpacks-manifest.json" ]]; then
      atomic_restore_file "$RESTORE_DIR/skillpacks-manifest.json" "$MANIFEST_JSON"
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
    --current)
      USE_CURRENT=1
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

if [[ "$USE_CURRENT" == "1" && -n "$TARGET" ]]; then
  usage >&2
  fail "--current cannot be combined with a version target."
fi

if [[ "$USE_CURRENT" != "1" && -z "$TARGET" ]]; then
  usage >&2
  fail "Missing version target."
fi

if [[ "$USE_CURRENT" != "1" ]]; then
  case "$TARGET" in
    major|minor|patch|premajor|preminor|prepatch|prerelease|[0-9]*.[0-9]*.[0-9]*)
      ;;
    *)
      fail "Unsupported version target '$TARGET'. Use patch, minor, major, or an explicit x.y.z version."
      ;;
  esac
fi

cd "$ROOT_DIR"

TRACKED_STATUS=$(git status --porcelain --untracked-files=no)
if [[ -n "$TRACKED_STATUS" ]]; then
  git status --short
  if [[ "$USE_CURRENT" == "1" ]] && tracked_changes_allowed_for_current_recovery "$TRACKED_STATUS"; then
    printf 'WARNING: --current recovery is continuing with only release-state tracked changes present.\n' >&2
    printf 'WARNING: Commit/tag/push packages/skillpacks/package.json and packages/skillpacks/dist/skillpacks-manifest.json after recovery succeeds.\n' >&2
  else
    fail "Tracked working tree changes must be committed before publishing."
  fi
fi

if [[ -n "$(git status --porcelain --untracked-files=normal)" ]]; then
  git status --short --untracked-files=normal
  printf 'WARNING: untracked files are present and will not be included unless committed.\n' >&2
fi

if [[ "$DRY_RUN" == "1" ]]; then
  RESTORE_DIR=$(mktemp -d /tmp/skillpacks-publish-restore-XXXXXX)
  cp "$PACKAGE_JSON" "$RESTORE_DIR/package.json"
  if [[ -f "$MANIFEST_JSON" ]]; then
    cp "$MANIFEST_JSON" "$RESTORE_DIR/skillpacks-manifest.json"
  fi
fi

ORIGINAL_VERSION=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).version)" "$PACKAGE_JSON")

if [[ "$USE_CURRENT" == "1" ]]; then
  VERSION="$ORIGINAL_VERSION"
  MANIFEST_VERSION=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).package.version)" "$MANIFEST_JSON")
  if [[ "$MANIFEST_VERSION" != "$VERSION" ]]; then
    fail "Package version $VERSION does not match manifest version $MANIFEST_VERSION."
  fi

  log "Using current packages/skillpacks version $VERSION for partial-publish recovery"
  SKILLPACKS_ALREADY_PUBLISHED=0
  GSKP_ALREADY_PUBLISHED=0
  if package_published skillpacks "$VERSION"; then
    SKILLPACKS_ALREADY_PUBLISHED=1
  fi
  if package_published @glexcorp/gskp "$VERSION"; then
    GSKP_ALREADY_PUBLISHED=1
  fi

  if [[ "$SKILLPACKS_ALREADY_PUBLISHED" == "1" && "$GSKP_ALREADY_PUBLISHED" == "1" ]]; then
    fail "Recovery already complete: skillpacks@$VERSION and @glexcorp/gskp@$VERSION are both published."
  fi
  if [[ "$SKILLPACKS_ALREADY_PUBLISHED" == "0" && "$GSKP_ALREADY_PUBLISHED" == "1" ]]; then
    fail "Inconsistent registry state: @glexcorp/gskp@$VERSION is published but skillpacks@$VERSION is missing."
  fi
  if [[ "$SKILLPACKS_ALREADY_PUBLISHED" == "0" && "$GSKP_ALREADY_PUBLISHED" == "0" ]]; then
    fail "--current is only for partial-publish recovery. Neither skillpacks@$VERSION nor @glexcorp/gskp@$VERSION is published; use a version target instead."
  fi

  log "Recovery state confirmed: skillpacks@$VERSION exists and @glexcorp/gskp@$VERSION is missing"
else
  log "Bumping packages/skillpacks to $TARGET"
  run_version_bump

  VERSION=$(node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).version)" "$PACKAGE_JSON")
fi

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
if [[ "$USE_CURRENT" == "1" ]]; then
  (cd "$SKILLPACKS_STAGE" && SKILLPACKS_NPM_ALLOW_PUBLISHED=true node scripts/prepublish-auth-check.mjs)
  (cd "$GSKP_STAGE" && node scripts/prepublish-auth-check.mjs)
elif [[ "$DRY_RUN" == "1" ]]; then
  (cd "$SKILLPACKS_STAGE" && npm_config_dry_run=true node scripts/prepublish-auth-check.mjs)
  (cd "$GSKP_STAGE" && npm_config_dry_run=true node scripts/prepublish-auth-check.mjs)
else
  (cd "$SKILLPACKS_STAGE" && node scripts/prepublish-auth-check.mjs)
  (cd "$GSKP_STAGE" && node scripts/prepublish-auth-check.mjs)
fi

log "Publishing staged packages"
if [[ "$DRY_RUN" == "1" ]]; then
  if [[ "$USE_CURRENT" == "1" ]]; then
    log "Recovery dry run: skipping skillpacks@$VERSION because it is already published."
  else
    run npm publish "$SKILLPACKS_STAGE" --dry-run
  fi
  run npm publish "$GSKP_STAGE" --access public --dry-run
  log "Dry run complete; skipped published-package verification."
  exit 0
fi

cat <<EOF
Release prerequisite reminder:
  - Confirm npm login: npm whoami --registry https://registry.npmjs.org/
  - Expected publisher: ${SKILLPACKS_NPM_PUBLISHER:-glexcorp}
  - Publishing both packages at version: $VERSION
  - If skillpacks publishes but @glexcorp/gskp fails, fix npm auth/access and rerun: ./publish.sh --current
EOF

if [[ "$USE_CURRENT" == "1" ]]; then
  log "Recovery publish: skipping skillpacks@$VERSION because it is already published."
else
  run npm publish "$SKILLPACKS_STAGE"
fi
run npm publish "$GSKP_STAGE" --access public

log "Verifying published packages"
run env SKILLPACKS_PACKAGE_NAME=skillpacks SKILLPACKS_EXPECTED_VERSION="$VERSION" SKILLPACKS_NPM_SPEC="skillpacks@$VERSION" npm run skillpacks:verify-published
run env SKILLPACKS_PACKAGE_NAME=@glexcorp/gskp SKILLPACKS_EXPECTED_VERSION="$VERSION" SKILLPACKS_NPM_SPEC="@glexcorp/gskp@$VERSION" npm run skillpacks:verify-published

log "Published skillpacks@$VERSION and @glexcorp/gskp@$VERSION"
cat <<EOF
Post-publish source-state requirement:
  1. Commit packages/skillpacks/package.json and packages/skillpacks/dist/skillpacks-manifest.json at version $VERSION.
  2. Tag the release, then push the commit and tag before starting another release.
EOF
