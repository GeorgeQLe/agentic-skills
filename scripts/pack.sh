#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PACKS_DIR="$REPO_ROOT/packs"
PROJECT_ROOT="$(pwd)"
PROJECT_FILE="$PROJECT_ROOT/.agents/project.json"
PROJECT_LOCK_DIR="$PROJECT_ROOT/.agents/.pack.lock"
PROJECT_LOCK_MAX_ATTEMPTS="${PACK_LOCK_MAX_ATTEMPTS:-300}"
PROJECT_LOCK_SLEEP_SECONDS="${PACK_LOCK_SLEEP_SECONDS:-0.1}"
PROJECT_LOCKED=false
PROJECT_AGENT_MODE=""
source "$REPO_ROOT/scripts/skill-links.sh"

usage() {
  cat <<'EOF'
Usage: pack.sh <command> [pack...]

Commands:
  list              List available packs
  list-packs        List enabled packs from .agents/project.json (one per line, no decoration)
  status            Show project designation and installed local pack links
  recommend         Recommend a pack from repository signals
  install <pack...> Enable one or more packs in the current project via local skill symlinks
  remove <pack...>  Remove one or more pack's local skill symlinks from the current project
  refresh           Recreate local symlinks for packs in .agents/project.json
  set-mode <mode>   Set .agents/project.json.agent_mode to claude-only, codex-only,
                    hybrid, or unset (clears the field)

Project state is stored in .agents/project.json.
EOF
}

die() {
  echo "ERROR: $*" >&2
  exit 1
}

release_project_lock() {
  if [[ "$PROJECT_LOCKED" == true ]]; then
    rm -f "$PROJECT_LOCK_DIR/pid" "$PROJECT_LOCK_DIR/started_at" "$PROJECT_LOCK_DIR/command" 2>/dev/null || true
    rmdir "$PROJECT_LOCK_DIR" 2>/dev/null || true
    PROJECT_LOCKED=false
  fi
}

lock_pid() {
  if [[ -f "$PROJECT_LOCK_DIR/pid" ]]; then
    sed -n '1p' "$PROJECT_LOCK_DIR/pid" 2>/dev/null || true
  fi
}

lock_started_at() {
  if [[ -f "$PROJECT_LOCK_DIR/started_at" ]]; then
    sed -n '1p' "$PROJECT_LOCK_DIR/started_at" 2>/dev/null || true
  fi
}

lock_command() {
  if [[ -f "$PROJECT_LOCK_DIR/command" ]]; then
    sed -n '1p' "$PROJECT_LOCK_DIR/command" 2>/dev/null || true
  fi
}

process_is_running() {
  local pid="$1"
  [[ "$pid" =~ ^[0-9]+$ ]] || return 1
  kill -0 "$pid" 2>/dev/null
}

clear_stale_project_lock() {
  local pid
  pid="$(lock_pid)"
  [[ -n "$pid" ]] || return 1
  process_is_running "$pid" && return 1

  echo "Removing stale project pack lock at $PROJECT_LOCK_DIR (pid $pid is not running)" >&2
  rm -f "$PROJECT_LOCK_DIR/pid" "$PROJECT_LOCK_DIR/started_at" "$PROJECT_LOCK_DIR/command" 2>/dev/null || true
  rmdir "$PROJECT_LOCK_DIR" 2>/dev/null || true
}

acquire_project_lock() {
  mkdir -p "$(dirname "$PROJECT_LOCK_DIR")"

  local attempts=0
  until mkdir "$PROJECT_LOCK_DIR" 2>/dev/null; do
    clear_stale_project_lock || true
    attempts=$((attempts + 1))
    if [[ "$attempts" -gt "$PROJECT_LOCK_MAX_ATTEMPTS" ]]; then
      local pid started_at command
      pid="$(lock_pid)"
      started_at="$(lock_started_at)"
      command="$(lock_command)"
      die "Timed out waiting for project pack lock at $PROJECT_LOCK_DIR (pid: ${pid:-unknown}; started_at: ${started_at:-unknown}; command: ${command:-unknown})"
    fi
    sleep "$PROJECT_LOCK_SLEEP_SECONDS"
  done

  PROJECT_LOCKED=true
  printf '%s\n' "$$" >"$PROJECT_LOCK_DIR/pid"
  date -u '+%Y-%m-%dT%H:%M:%SZ' >"$PROJECT_LOCK_DIR/started_at"
  printf 'pack.sh %s\n' "${*:-unknown}" >"$PROJECT_LOCK_DIR/command"
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
    business|business_app|businessapp|product|saas|business-app)
      echo "business-discovery"
      echo "business-growth"
      echo "business-ops"
      ;;
    business-discovery|discovery|customer-discovery|customer_discovery) echo "business-discovery" ;;
    business-growth|growth|gtm-growth|gtm_growth) echo "business-growth" ;;
    business-ops|business_ops|ops|business-operations|business_operations) echo "business-ops" ;;
    business-kanban|business_app_kanban|businessapp-kanban|saas-kanban) echo "business-app-kanban" ;;
    creator|creator_media|creatormedia|media|founder-media|creator-media)
      echo "creator-foundation"
      echo "youtube-ops"
      ;;
    creator-foundation|creator_foundation|creator-strategy|creator_strategy|founder-media-foundation) echo "creator-foundation" ;;
    youtube|youtube-media|youtube_media|youtube-ops|youtube_ops) echo "youtube-ops" ;;
    remotion|video-production|video_production|video-build|videobuild|video-script|videoscript) echo "remotion" ;;
    project-fleet|project_fleet|fleet|portfolio|portfolio-ops|portfolio_ops|clone-spec-store|spin-off|spinoff) echo "project-fleet" ;;
    quality|codequality|code_quality|code-quality) echo "code-quality" ;;
    games) echo "game" ;;
    dev|dev-tool|dev-tools|developer-tool|developer-tools) echo "devtool" ;;
    dev-kanban|dev-tool-kanban|dev-tools-kanban|developer-tool-kanban|developer-tools-kanban) echo "devtool-kanban" ;;
    alignment|align|grill|alignment_loop|alignmentloop) echo "alignment-loop" ;;
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

project_type_for_pack() {
  case "$1" in
    business-discovery|business-growth|business-ops|business-app|business-app-kanban) echo "business-app" ;;
    game|game-kanban) echo "game" ;;
    devtool|devtool-kanban) echo "devtool" ;;
    creator-foundation|youtube-ops|creator-media|remotion) echo "creator-media" ;;
    project-fleet) echo "project-fleet" ;;
    *) return 1 ;;
  esac
}

infer_project_type() {
  if [[ "$PROJECT_ROOT" == *"/games/"* ]] || find "$PROJECT_ROOT" -maxdepth 2 \( -iname '*godot*' -o -iname '*unity*' -o -iname '*unreal*' \) -print -quit | grep -q .; then
    echo "game"
  elif find "$PROJECT_ROOT" -maxdepth 2 \( -name 'package.json' -o -name 'pyproject.toml' -o -name 'Cargo.toml' \) -print -quit | grep -q .; then
    echo "devtool"
  else
    echo "business-app"
  fi
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
  local project_scopes notes
  project_scopes="$(project_json_value project_scopes)"
  notes="$(project_json_value notes)"

  mkdir -p "$(dirname "$PROJECT_FILE")"
  {
    echo "{"
    printf '  "project_type": "%s",\n' "$project_type"
    printf '  "enabled_packs": ['
    local first=true
    if [[ "$#" -gt 0 ]]; then
      local pack
      for pack in "$@"; do
        if [[ "$first" == true ]]; then
          first=false
        else
          printf ', '
        fi
        printf '"%s"' "$pack"
      done
    fi
    echo "],"
    if [[ -n "$PROJECT_AGENT_MODE" ]]; then
      echo '  "skill_pack_version": 1,'
      printf '  "agent_mode": "%s"' "$PROJECT_AGENT_MODE"
    else
      printf '  "skill_pack_version": 1'
    fi
    if [[ -n "$project_scopes" ]]; then
      printf ',\n  "project_scopes": %s' "$project_scopes"
    fi
    if [[ -n "$notes" ]]; then
      printf ',\n  "notes": %s' "$notes"
    fi
    echo ""
    echo "}"
  } > "$PROJECT_FILE"
}

write_project_file_from_packs() {
  local project_type="$1"

  if [[ "${#packs[@]}" -gt 0 ]]; then
    write_project_file "$project_type" "${packs[@]}"
  else
    write_project_file "$project_type"
  fi
}

current_project_type() {
  if [[ -f "$PROJECT_FILE" ]]; then
    sed -n 's/.*"project_type"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$PROJECT_FILE" | head -1
  fi
}

current_agent_mode() {
  if [[ -f "$PROJECT_FILE" ]]; then
    sed -n 's/.*"agent_mode"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$PROJECT_FILE" | head -1
  fi
}

project_json_value() {
  local key="$1"
  if [[ -f "$PROJECT_FILE" ]] && command -v jq >/dev/null 2>&1; then
    jq -c --arg key "$key" '.[$key] // empty' "$PROJECT_FILE" 2>/dev/null || true
  fi
}

validate_agent_mode() {
  case "$1" in
    claude-only|codex-only|hybrid) return 0 ;;
    *) return 1 ;;
  esac
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
    if sync_skill_link "$skill_dir" "$target"; then
      echo "Linked .$tool/skills/$name -> $skill_dir"
    fi
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
  if [[ -z "$project_type" ]]; then
    project_type="$(project_type_for_pack "$pack" 2>/dev/null || true)"
    [[ -n "$project_type" ]] || project_type="$(infer_project_type)"
  fi
  PROJECT_AGENT_MODE="$(current_agent_mode)"
  write_project_file_from_packs "$project_type"
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
  [[ -n "$project_type" ]] || project_type="$(infer_project_type)"
  PROJECT_AGENT_MODE="$(current_agent_mode)"
  write_project_file_from_packs "$project_type"
  echo "Updated .agents/project.json"
}

set_mode() {
  local mode="${1:-}"
  [[ -n "$mode" ]] || die "set-mode requires a mode: claude-only, codex-only, hybrid, or unset"
  if [[ "$mode" == "unset" ]]; then
    PROJECT_AGENT_MODE=""
  else
    validate_agent_mode "$mode" || die "Invalid mode '$mode'. Must be claude-only, codex-only, hybrid, or unset"
    PROJECT_AGENT_MODE="$mode"
  fi
  local project_type
  project_type="$(current_project_type)"
  [[ -n "$project_type" ]] || project_type="$(infer_project_type)"
  read_lines_into_packs < <(read_enabled_packs)
  write_project_file_from_packs "$project_type"
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

print_session_reload_notice() {
  cat <<'EOF'

Skill links changed. Claude Code and Codex may keep the skill list loaded when the current session started.
This pack installer does not have a supported in-session CLI skill refresh command; start a fresh CLI session to use newly installed or removed project-local skills.
EOF
}

recommend() {
  local inferred_project_type
  inferred_project_type="$(infer_project_type)"
  if [[ -f "$PROJECT_FILE" ]]; then
    local project_type
    project_type="$(current_project_type)"
    if [[ -n "$project_type" ]]; then
      echo "Project already declares: $project_type"
    else
      echo "Project already declares: (none)"
    fi
    echo "Enabled packs: $(read_enabled_packs | paste -sd ', ' -)"
    return 0
  fi
  if [[ "$inferred_project_type" == "game" ]]; then
    echo "Recommended pack: game"
    echo "If this project intentionally uses PoketoWork boards, also install game-kanban."
  elif [[ "$inferred_project_type" == "devtool" ]]; then
    echo "Recommended pack: devtool or a narrow business pack"
    echo "Use devtool for developer-facing tools/libraries; use business-discovery, business-growth, or business-ops for SaaS/business work."
    echo "If this project intentionally uses PoketoWork boards, install the matching explicit kanban pack: devtool-kanban or business-app-kanban."
    echo "For behavior-preserving refactors and code-health workflows, also install code-quality."
  else
    echo "Recommended pack: business-discovery"
    echo "Add business-growth or business-ops only when the current phase needs them."
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
  list-packs) read_enabled_packs ;;
  status) status ;;
  recommend) recommend ;;
  install)
    acquire_project_lock "$@"
    shift
    read_lines_into_packs < <(collect_pack_args "$@")
    [[ "${#packs[@]}" -gt 0 ]] || die "install requires a pack name"
    for pack in "${packs[@]}"; do
      install_pack "$pack"
    done
    print_session_reload_notice
    ;;
  remove)
    acquire_project_lock "$@"
    shift
    read_lines_into_packs < <(collect_pack_args "$@")
    [[ "${#packs[@]}" -gt 0 ]] || die "remove requires a pack name"
    for pack in "${packs[@]}"; do
      remove_pack "$pack"
    done
    print_session_reload_notice
    ;;
  refresh)
    acquire_project_lock "$@"
    refresh
    print_session_reload_notice
    ;;
  set-mode)
    acquire_project_lock "$@"
    shift
    set_mode "${1:-}"
    ;;
  --help|-h|"") usage ;;
  *) usage; exit 2 ;;
esac
