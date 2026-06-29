#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)
PACKAGE_DIR="$ROOT_DIR/packages/skillpacks"
PACKAGE_JSON="$PACKAGE_DIR/package.json"
MANIFEST_JSON="$PACKAGE_DIR/dist/skillpacks-manifest.json"
BUILD_DIR="$PACKAGE_DIR/build"
DRY_RUN=0
USE_CURRENT=0
ALLOW_DIRTY_TREE=0
TARGET=""
TMP_DIRS=()
RESTORE_DIR=""
PUBLISH_STARTED=0
RECOVERY_BOTH_PUBLISHED=0
CURRENT_SOURCE_RELEASE=0
CLEANUP_RUNNING=0

usage() {
  cat <<'USAGE'
Usage:
  ./publish.sh patch
  ./publish.sh minor
  ./publish.sh 0.1.2
  ./publish.sh --current
  ./publish.sh --dry-run patch
  ./publish.sh --allow-dirty-tree patch
  ./publish.sh --dry-run --allow-dirty-tree patch
  ./publish.sh --dry-run --current

Publishes both npm packages from the same built artifact:
  - skillpacks
  - @glexcorp/gskp

By default, tracked working tree changes block publishing. Use
--allow-dirty-tree only when every tracked dirty path is outside the package
and release boundary. --current publishes or verifies the current
packages/skillpacks version and keeps its narrower release-metadata exception.
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

porcelain_status_paths() {
  local line=$1
  local path

  path=${line:3}
  if [[ "$path" == *" -> "* ]]; then
    printf '%s\n' "${path%% -> *}"
    printf '%s\n' "${path##* -> }"
    return
  fi

  printf '%s\n' "$path"
}

is_release_impacting_dirty_path() {
  local path=$1

  case "$path" in
    packages/skillpacks|packages/skillpacks/*)
      return 0
      ;;
    base|base/*|packs|packs/*|scripts|scripts/*)
      return 0
      ;;
    docs/alignment-page-convention.md|docs/interrogation-page-convention.md|docs/design-tree-loop-convention.md)
      return 0
      ;;
    docs/social-post-convention.md|docs/social-video-content-convention.md|docs/social-ledger-convention.md)
      return 0
      ;;
    docs/social|docs/social/*)
      return 0
      ;;
    README.md|CHANGELOG.md|LICENSE)
      return 0
      ;;
    publish.sh|package.json|package-lock.json|pnpm-lock.yaml|pnpm-workspace.yaml|.npmrc|packages/skillpacks/.npmrc)
      return 0
      ;;
  esac

  return 1
}

RELEASE_IMPACTING_DIRTY_PATHS=()
NON_RELEASE_DIRTY_PATHS=()
UNTRACKED_DIRTY_PATHS=()

classify_tracked_dirty_paths() {
  local status_output=$1
  local line path

  RELEASE_IMPACTING_DIRTY_PATHS=()
  NON_RELEASE_DIRTY_PATHS=()

  while IFS= read -r line; do
    [[ -n "$line" ]] || continue
    while IFS= read -r path; do
      [[ -n "$path" ]] || continue
      if is_release_impacting_dirty_path "$path"; then
        RELEASE_IMPACTING_DIRTY_PATHS+=("$path")
      else
        NON_RELEASE_DIRTY_PATHS+=("$path")
      fi
    done < <(porcelain_status_paths "$line")
  done <<< "$status_output"
}

collect_untracked_paths() {
  local status_output=$1
  local line

  UNTRACKED_DIRTY_PATHS=()

  while IFS= read -r line; do
    [[ -n "$line" ]] || continue
    if [[ "${line:0:3}" == "?? " ]]; then
      UNTRACKED_DIRTY_PATHS+=("${line:3}")
    fi
  done <<< "$status_output"
}

print_path_group() {
  local title=$1
  shift

  [[ "$#" -gt 0 ]] || return 0

  printf '%s:\n' "$title" >&2
  local path
  for path in "$@"; do
    printf '  %s\n' "$path" >&2
  done
}

print_dirty_tree_summary() {
  print_path_group "release-impacting dirty paths" "${RELEASE_IMPACTING_DIRTY_PATHS[@]}"
  print_path_group "non-release dirty paths" "${NON_RELEASE_DIRTY_PATHS[@]}"
  print_path_group "untracked paths (not included in release)" "${UNTRACKED_DIRTY_PATHS[@]}"
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
  printf '+ npm --workspace packages/skillpacks version %q --no-git-tag-version --ignore-scripts --no-commit-hooks --no-workspaces-update\n' "$TARGET"

  npm --workspace packages/skillpacks version "$TARGET" --no-git-tag-version --ignore-scripts --no-commit-hooks --no-workspaces-update &
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

compute_target_version() {
  local version_dir
  version_dir=$(mktemp -d /tmp/skillpacks-version-XXXXXX)
  TMP_DIRS+=("$version_dir")
  cp "$PACKAGE_JSON" "$version_dir/package.json"

  (
    cd "$version_dir"
    npm version "$TARGET" --no-git-tag-version --ignore-scripts --no-commit-hooks --no-workspaces-update >/dev/null
  )

  node -e "console.log(JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).version)" "$version_dir/package.json"
}

run_pre_mutation_auth_preflight() {
  local package_name=$1
  local version=$2
  local env_args=()

  if [[ "$DRY_RUN" == "1" ]]; then
    env_args+=(npm_config_dry_run=true)
  fi

  run env "${env_args[@]}" node "$PACKAGE_DIR/scripts/prepublish-auth-check.mjs" --package-name "$package_name" --package-version "$version"
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
  local status=$?
  local dir

  if [[ "$CLEANUP_RUNNING" == "1" ]]; then
    return "$status"
  fi

  CLEANUP_RUNNING=1
  trap '' INT TERM HUP
  set +e

  for dir in "${TMP_DIRS[@]}"; do
    if [[ ( "$dir" == /tmp/skillpacks-publish-* || "$dir" == /tmp/skillpacks-version-* ) && -d "$dir" ]]; then
      rm -rf "$dir" || true
    fi
  done

  if [[ -n "$RESTORE_DIR" && -d "$RESTORE_DIR" ]]; then
    if [[ "$DRY_RUN" == "1" || ( "$status" != "0" && "$PUBLISH_STARTED" != "1" ) ]]; then
      atomic_restore_file "$RESTORE_DIR/package.json" "$PACKAGE_JSON" || status=1
      if [[ -f "$RESTORE_DIR/skillpacks-manifest.json" ]]; then
        atomic_restore_file "$RESTORE_DIR/skillpacks-manifest.json" "$MANIFEST_JSON" || status=1
      fi
    fi
    rm -rf "$RESTORE_DIR" || true
  fi

  return "$status"
}

handle_signal() {
  local signal_name=$1
  local exit_status=$2

  trap '' INT TERM HUP
  printf '\nInterrupted by SIG%s; restoring release source state when required.\n' "$signal_name" >&2
  exit "$exit_status"
}

trap cleanup EXIT
trap 'handle_signal INT 130' INT
trap 'handle_signal TERM 143' TERM
trap 'handle_signal HUP 129' HUP

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
    --allow-dirty-tree)
      ALLOW_DIRTY_TREE=1
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
ALL_STATUS=$(git status --porcelain --untracked-files=normal)
classify_tracked_dirty_paths "$TRACKED_STATUS"
collect_untracked_paths "$ALL_STATUS"

if [[ -n "$TRACKED_STATUS" ]]; then
  git status --short
  print_dirty_tree_summary
  if [[ "$USE_CURRENT" == "1" ]] && tracked_changes_allowed_for_current_recovery "$TRACKED_STATUS"; then
    printf 'WARNING: --current is continuing with only release-state tracked changes present.\n' >&2
    printf 'WARNING: Commit/tag/push packages/skillpacks/package.json and packages/skillpacks/dist/skillpacks-manifest.json after the current-version publish succeeds.\n' >&2
  elif [[ "$ALLOW_DIRTY_TREE" == "1" && "$USE_CURRENT" != "1" && "${#RELEASE_IMPACTING_DIRTY_PATHS[@]}" -eq 0 ]]; then
    printf 'WARNING: --allow-dirty-tree is continuing with non-release tracked changes present.\n' >&2
    printf 'WARNING: These dirty changes will not be included in the release; commit or remove them separately.\n' >&2
  else
    fail "Tracked working tree changes must be committed before publishing."
  fi
fi

if [[ "${#UNTRACKED_DIRTY_PATHS[@]}" -gt 0 ]]; then
  git status --short --untracked-files=normal
  if [[ -z "$TRACKED_STATUS" ]]; then
    print_dirty_tree_summary
  fi
  printf 'WARNING: untracked files are present and will not be included unless committed.\n' >&2
fi

if [[ "$DRY_RUN" == "1" || "$USE_CURRENT" != "1" ]]; then
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
    RECOVERY_BOTH_PUBLISHED=1
  fi
  if [[ "$SKILLPACKS_ALREADY_PUBLISHED" == "0" && "$GSKP_ALREADY_PUBLISHED" == "1" ]]; then
    fail "Inconsistent registry state: @glexcorp/gskp@$VERSION is published but skillpacks@$VERSION is missing."
  fi
  if [[ "$SKILLPACKS_ALREADY_PUBLISHED" == "0" && "$GSKP_ALREADY_PUBLISHED" == "0" ]]; then
    CURRENT_SOURCE_RELEASE=1
  fi

  if [[ "$RECOVERY_BOTH_PUBLISHED" == "1" ]]; then
    log "Recovery state confirmed: skillpacks@$VERSION and @glexcorp/gskp@$VERSION are both published; rerunning final verification"
  elif [[ "$CURRENT_SOURCE_RELEASE" == "1" ]]; then
    log "Current source release confirmed: neither skillpacks@$VERSION nor @glexcorp/gskp@$VERSION is published; publishing both from current source metadata"
  else
    log "Recovery state confirmed: skillpacks@$VERSION exists and @glexcorp/gskp@$VERSION is missing"
  fi
else
  VERSION=$(compute_target_version)
  log "Running pre-bump npm auth preflight for skillpacks@$VERSION and @glexcorp/gskp@$VERSION"
  run_pre_mutation_auth_preflight skillpacks "$VERSION"
  run_pre_mutation_auth_preflight @glexcorp/gskp "$VERSION"

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
if [[ "$RECOVERY_BOTH_PUBLISHED" == "1" ]]; then
  log "Recovery verification: skipping npm auth preflight because both packages are already published."
elif [[ "$USE_CURRENT" == "1" && "$CURRENT_SOURCE_RELEASE" != "1" ]]; then
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
  if [[ "$RECOVERY_BOTH_PUBLISHED" == "1" ]]; then
    log "Recovery dry run: skipping skillpacks@$VERSION and @glexcorp/gskp@$VERSION because both are already published."
  elif [[ "$USE_CURRENT" == "1" && "$CURRENT_SOURCE_RELEASE" != "1" ]]; then
    log "Recovery dry run: skipping skillpacks@$VERSION because it is already published."
    run npm publish "$GSKP_STAGE" --access public --dry-run
  else
    run npm publish "$SKILLPACKS_STAGE" --dry-run
    run npm publish "$GSKP_STAGE" --access public --dry-run
  fi
  log "Dry run complete; skipped published-package verification."
  exit 0
fi

if [[ "$RECOVERY_BOTH_PUBLISHED" == "1" ]]; then
  cat <<EOF
Recovery prerequisite reminder:
  - Both packages already exist at version: $VERSION
  - Rerunning final published-package verification without publishing.
EOF
else
  cat <<EOF
Release prerequisite reminder:
  - Confirm npm login: npm whoami --registry https://registry.npmjs.org/
  - Expected publisher: ${SKILLPACKS_NPM_PUBLISHER:-glexcorp}
  - Publishing both packages at version: $VERSION
  - If skillpacks publishes but @glexcorp/gskp fails, fix npm auth/access and rerun: ./publish.sh --current
EOF
fi

if [[ "$RECOVERY_BOTH_PUBLISHED" == "1" ]]; then
  log "Recovery publish: skipping skillpacks@$VERSION and @glexcorp/gskp@$VERSION because both are already published."
elif [[ "$USE_CURRENT" == "1" && "$CURRENT_SOURCE_RELEASE" != "1" ]]; then
  log "Recovery publish: skipping skillpacks@$VERSION because it is already published."
  PUBLISH_STARTED=1
  run npm publish "$GSKP_STAGE" --access public
else
  run npm publish "$SKILLPACKS_STAGE"
  PUBLISH_STARTED=1
  run npm publish "$GSKP_STAGE" --access public
fi

log "Verifying published packages"
run env SKILLPACKS_PACKAGE_NAME=skillpacks SKILLPACKS_EXPECTED_VERSION="$VERSION" SKILLPACKS_NPM_SPEC="skillpacks@$VERSION" npm run skillpacks:verify-published
run env SKILLPACKS_PACKAGE_NAME=@glexcorp/gskp SKILLPACKS_EXPECTED_VERSION="$VERSION" SKILLPACKS_NPM_SPEC="@glexcorp/gskp@$VERSION" npm run skillpacks:verify-published

log "Published skillpacks@$VERSION and @glexcorp/gskp@$VERSION"
cat <<EOF
Post-publish source-state requirement:
  1. Ensure packages/skillpacks/package.json and packages/skillpacks/dist/skillpacks-manifest.json are committed at version $VERSION.
  2. Tag the release, then push the commit and tag before starting another release.
EOF
