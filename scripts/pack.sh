#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PACKS_DIR="$REPO_ROOT/packs"
PROJECT_ROOT="$(pwd)"
PROJECT_FILE="$PROJECT_ROOT/.agents/project.json"
PROJECT_LOCK_DIR="$PROJECT_ROOT/.agents/.pack.lock"
PROJECT_LOCKED=false

usage() {
  cat <<'EOF'
Usage: pack.sh <command> [pack...]

Commands:
  list              List available packs
  status            Show project designation and installed local pack links
  recommend         Recommend a pack from repository signals
  install <pack...> Enable one or more packs in the current project via local skill symlinks
  remove <pack...>  Remove one or more pack's local skill symlinks from the current project
  refresh           Recreate local symlinks for packs in .agents/project.json

Project state is stored in .agents/project.json.
EOF
}

die() {
  echo "ERROR: $*" >&2
  exit 1
}

release_project_lock() {
  if [[ "$PROJECT_LOCKED" == true ]]; then
    rmdir "$PROJECT_LOCK_DIR" 2>/dev/null || true
    PROJECT_LOCKED=false
  fi
}

acquire_project_lock() {
  mkdir -p "$(dirname "$PROJECT_LOCK_DIR")"

  local attempts=0
  until mkdir "$PROJECT_LOCK_DIR" 2>/dev/null; do
    attempts=$((attempts + 1))
    if [[ "$attempts" -gt 300 ]]; then
      die "Timed out waiting for project pack lock at $PROJECT_LOCK_DIR"
    fi
    sleep 0.1
  done

  PROJECT_LOCKED=true
  trap release_project_lock EXIT INT TERM
}

pack_exists() {
  [[ -d "$PACKS_DIR/$1" ]]
}

list_packs() {
  find "$PACKS_DIR" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | sort
}

available_packs_inline() {
  list_packs | paste -sd ', ' -
}

normalize_pack() {
  local pack="$1"
  pack="${pack%,}"
  pack="${pack#pack:}"
  case "$pack" in
    business|business_app|businessapp|product|saas) echo "business-app" ;;
    business-kanban|business_app_kanban|businessapp-kanban|saas-kanban) echo "business-app-kanban" ;;
    quality|codequality|code_quality|code-quality) echo "code-quality" ;;
    games) echo "game" ;;
    dev|dev-tool|dev-tools|developer-tool|developer-tools) echo "devtool" ;;
    dev-kanban|dev-tool-kanban|dev-tools-kanban|developer-tool-kanban|developer-tools-kanban) echo "devtool-kanban" ;;
    pack|packs|"") return 1 ;;
    *) echo "$pack" ;;
  esac
}

collect_pack_args() {
  local raw token normalized
  for raw in "$@"; do
    raw="${raw//,/ }"
    for token in $raw; do
      normalized="$(normalize_pack "$token")" || continue
      echo "$normalized"
    done
  done
}

pack_project_type() {
  case "$1" in
    business-app|business-app-kanban) echo "business-app" ;;
    code-quality) echo "unknown" ;;
    game|game-kanban) echo "game" ;;
    devtool|devtool-kanban) echo "devtool" ;;
    poketowork-kanban) echo "unknown" ;;
    *) echo "$1" ;;
  esac
}

read_enabled_packs() {
  if [[ ! -f "$PROJECT_FILE" ]]; then
    return 0
  fi
  grep -o '"enabled_packs"[[:space:]]*:[[:space:]]*\[[^]]*\]' "$PROJECT_FILE" \
    | sed 's/.*\[//; s/\].*//' \
    | tr ',' '\n' \
    | sed 's/[ "	]//g' \
    | sed '/^$/d' || true
}

write_project_file() {
  local project_type="$1"
  shift
  local packs=("$@")

  mkdir -p "$(dirname "$PROJECT_FILE")"
  {
    echo "{"
    printf '  "project_type": "%s",\n' "$project_type"
    printf '  "enabled_packs": ['
    local first=true
    for pack in "${packs[@]}"; do
      if [[ "$first" == true ]]; then
        first=false
      else
        printf ', '
      fi
      printf '"%s"' "$pack"
    done
    echo "],"
    echo '  "skill_pack_version": 1'
    echo "}"
  } > "$PROJECT_FILE"
}

current_project_type() {
  if [[ -f "$PROJECT_FILE" ]]; then
    sed -n 's/.*"project_type"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$PROJECT_FILE" | head -1
  fi
}

unique_packs_with() {
  local add_pack="${1:-}"
  {
    read_enabled_packs
    [[ -n "$add_pack" ]] && echo "$add_pack"
  } | awk '!seen[$0]++'
}

read_lines_into_packs() {
  packs=()
  local line
  while IFS= read -r line; do
    packs+=("$line")
  done
}

remove_pack_from_list() {
  local remove_pack="$1"
  read_enabled_packs | awk -v pack="$remove_pack" '$0 != pack'
}

link_one_tool() {
  local pack="$1"
  local tool="$2"
  local source_dir="$PACKS_DIR/$pack/$tool"
  local target_root="$PROJECT_ROOT/.$tool/skills"

  [[ -d "$source_dir" ]] || return 0
  mkdir -p "$target_root"

  for skill_dir in "$source_dir"/*/; do
    [[ -d "$skill_dir" ]] || continue
    skill_dir="${skill_dir%/}"
    local name
    name="$(basename "$skill_dir")"
    local target="$target_root/$name"
    if [[ -L "$target" ]]; then
      rm "$target"
    elif [[ -e "$target" ]]; then
      echo "WARNING: $target exists and is not a symlink, skipping"
      continue
    fi
    ln -sfn "$skill_dir" "$target"
    echo "Linked .$tool/skills/$name -> $skill_dir"
  done
}

install_pack() {
  local pack="$1"
  pack_exists "$pack" || die "Unknown pack '$pack'. Available packs: $(available_packs_inline)"

  link_one_tool "$pack" "claude"
  link_one_tool "$pack" "codex"

  read_lines_into_packs < <(unique_packs_with "$pack")
  local project_type
  project_type="$(current_project_type)"
  [[ -n "$project_type" ]] || project_type="$(pack_project_type "$pack")"
  write_project_file "$project_type" "${packs[@]}"
  echo "Updated .agents/project.json"
}

remove_pack() {
  local pack="$1"
  pack_exists "$pack" || die "Unknown pack '$pack'. Available packs: $(available_packs_inline)"

  for tool in claude codex; do
    local source_dir="$PACKS_DIR/$pack/$tool"
    local target_root="$PROJECT_ROOT/.$tool/skills"
    [[ -d "$source_dir" && -d "$target_root" ]] || continue
    for skill_dir in "$source_dir"/*/; do
      [[ -d "$skill_dir" ]] || continue
      skill_dir="${skill_dir%/}"
      local name target
      name="$(basename "$skill_dir")"
      target="$target_root/$name"
      if [[ -L "$target" && "$(readlink "$target")" == "$skill_dir" ]]; then
        rm "$target"
        echo "Removed .$tool/skills/$name"
      fi
    done
  done

  read_lines_into_packs < <(remove_pack_from_list "$pack")
  local project_type
  project_type="$(current_project_type)"
  [[ -n "$project_type" ]] || project_type="unknown"
  write_project_file "$project_type" "${packs[@]}"
  echo "Updated .agents/project.json"
}

status() {
  if [[ -f "$PROJECT_FILE" ]]; then
    echo "Project designation:"
    sed 's/^/  /' "$PROJECT_FILE"
  else
    echo "No .agents/project.json found."
  fi
  echo ""
  echo "Installed local pack links:"
  find "$PROJECT_ROOT/.claude/skills" "$PROJECT_ROOT/.codex/skills" -mindepth 1 -maxdepth 1 -type l -print 2>/dev/null | sort || true
}

recommend() {
  if [[ -f "$PROJECT_FILE" ]]; then
    echo "Project already declares: $(current_project_type)"
    echo "Enabled packs: $(read_enabled_packs | paste -sd ', ' -)"
    return 0
  fi
  if [[ "$PROJECT_ROOT" == *"/games/"* ]] || find "$PROJECT_ROOT" -maxdepth 2 \( -iname '*godot*' -o -iname '*unity*' -o -iname '*unreal*' \) -print | grep -q .; then
    echo "Recommended pack: game"
    echo "If this project intentionally uses PoketoWork boards, also install game-kanban."
  elif find "$PROJECT_ROOT" -maxdepth 2 \( -name 'package.json' -o -name 'pyproject.toml' -o -name 'Cargo.toml' \) -print | grep -q .; then
    echo "Recommended pack: devtool or business-app"
    echo "Use devtool for developer-facing tools/libraries; use business-app for SaaS or business applications."
    echo "If this project intentionally uses PoketoWork boards, install the matching explicit kanban pack: devtool-kanban or business-app-kanban."
    echo "For behavior-preserving refactors and code-health workflows, also install code-quality."
  else
    echo "Recommended pack: business-app"
    echo "If this project intentionally uses PoketoWork boards, also install business-app-kanban."
    echo "For behavior-preserving refactors and code-health workflows, also install code-quality."
  fi
}

refresh() {
  read_lines_into_packs < <(read_enabled_packs)
  [[ "${#packs[@]}" -gt 0 ]] || die "No enabled packs in .agents/project.json"
  for pack in "${packs[@]}"; do
    install_pack "$pack"
  done
}

cmd="${1:-}"
case "$cmd" in
  list) list_packs ;;
  status) status ;;
  recommend) recommend ;;
  install)
    acquire_project_lock
    shift
    read_lines_into_packs < <(collect_pack_args "$@")
    [[ "${#packs[@]}" -gt 0 ]] || die "install requires a pack name"
    for pack in "${packs[@]}"; do
      install_pack "$pack"
    done
    ;;
  remove)
    acquire_project_lock
    shift
    read_lines_into_packs < <(collect_pack_args "$@")
    [[ "${#packs[@]}" -gt 0 ]] || die "remove requires a pack name"
    for pack in "${packs[@]}"; do
      remove_pack "$pack"
    done
    ;;
  refresh)
    acquire_project_lock
    refresh
    ;;
  --help|-h|"") usage ;;
  *) usage; exit 2 ;;
esac
