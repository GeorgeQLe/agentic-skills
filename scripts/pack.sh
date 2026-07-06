#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PACKS_DIR="$REPO_ROOT/packs"
HIBERNATED_KANBAN_DIR="$REPO_ROOT/archive/hibernated-packs/2026-06-poketowork-rebuild"
PROJECT_ROOT="$(pwd)"
PROJECT_FILE="$PROJECT_ROOT/.agents/project.json"
PROJECT_LOCK_DIR="$PROJECT_ROOT/.agents/.pack.lock"
MANAGED_CONVENTION_DOC_ROOT="$PROJECT_ROOT/.agents/skillpacks/docs"
MANAGED_CONVENTION_DOC_METADATA="$MANAGED_CONVENTION_DOC_ROOT/.skillpacks-managed.json"
PROJECT_LOCK_MAX_ATTEMPTS="${PACK_LOCK_MAX_ATTEMPTS:-300}"
PROJECT_LOCK_SLEEP_SECONDS="${PACK_LOCK_SLEEP_SECONDS:-0.1}"
PROJECT_LOCKED=false
PROJECT_AGENT_MODE=""
BIP_REMOVED_MESSAGE="Build-In-Public has been removed. Run scripts/pack.sh cleanup to remove stale alignment.build_in_public, alignment.bip_platforms, and alignment.bip_prompt_dismissed config."
source "$REPO_ROOT/scripts/skill-links.sh"

convention_doc_sources() {
  find "$REPO_ROOT/docs" -maxdepth 1 -type f \( -name '*convention*.md' -o -name '*contract*.md' \) -print 2>/dev/null
  find "$REPO_ROOT/docs/social" -maxdepth 1 -type f -name '*convention.md' -print 2>/dev/null
}

sync_managed_convention_docs() {
  [[ -d "$REPO_ROOT/docs" ]] || return 0

  rm -rf "$MANAGED_CONVENTION_DOC_ROOT"
  mkdir -p "$MANAGED_CONVENTION_DOC_ROOT"

  local source rel target hash first=true
  local metadata_docs=""
  while IFS= read -r source; do
    [[ -n "$source" ]] || continue
    rel="${source#"$REPO_ROOT/docs/"}"
    target="$MANAGED_CONVENTION_DOC_ROOT/$rel"
    mkdir -p "$(dirname "$target")"
    cp -p "$source" "$target"
    hash="$(_sha256 < "$source" | awk '{print $1}')"
    if [[ "$first" == true ]]; then
      first=false
    else
      metadata_docs+=","
    fi
    metadata_docs+=$'\n'"    { \"path\": \"$rel\", \"source_sha\": \"$hash\" }"
  done < <(convention_doc_sources | sort)

  {
    printf '{\n'
    printf '  "managed_by": "agentic-skills",\n'
    printf '  "source_package": "source-checkout",\n'
    printf '  "docs": ['
    printf '%s' "$metadata_docs"
    if [[ "$first" == false ]]; then
      printf '\n'
    fi
    printf '  ]\n'
    printf '}\n'
  } > "$MANAGED_CONVENTION_DOC_METADATA"
}

managed_convention_doc_statuses() {
  local source rel target expected actual
  while IFS= read -r source; do
    [[ -n "$source" ]] || continue
    rel="${source#"$REPO_ROOT/docs/"}"
    target="$MANAGED_CONVENTION_DOC_ROOT/$rel"
    expected="$(_sha256 < "$source" | awk '{print $1}')"
    if [[ ! -f "$target" ]]; then
      printf 'missing\t%s\n' "$rel"
      continue
    fi
    actual="$(_sha256 < "$target" | awk '{print $1}')"
    if [[ "$actual" == "$expected" ]]; then
      printf 'ok\t%s\n' "$rel"
    else
      printf 'stale\t%s\n' "$rel"
    fi
  done < <(convention_doc_sources | sort)
}

usage() {
  cat <<'EOF'
Usage: pack.sh <command> [pack-or-skill...]

Commands:
  list              List available packs
  list-packs        List enabled packs from .agents/project.json (one per line, no decoration)
  status            Show project designation and installed local pack skills
  recommend         Recommend a pack from repository signals
  install <name...> Enable one or more packs or individual skills via local skill roots
  remove <name...>  Remove one or more packs or individual skills from the current project
  refresh           Recreate local skill roots for packs and skills in .agents/project.json
  doctor            Report skill-install drift vs canonical sources (read-only; non-zero if stale)
  prune [--dry-run]  Remove installed skills whose source no longer exists or whose pack is not enabled
  set-update-mode <mode>  Set .agents/project.json.skill_updates.mode to warn, auto, or unset
  pin <skill> <ver> Pin a pack skill to an archived version (e.g., pin devtool-adoption v0.0)
  unpin <skill>     Revert a pinned skill to the latest version
  set-mode <mode>   Set .agents/project.json.agent_mode to claude-only, codex-only,
                    hybrid, or unset (clears the field)
  which <skill>     Show which pack provides a skill and whether it is installed

Project state is stored in .agents/project.json.
EOF
}

die() {
  echo "ERROR: $*" >&2
  exit 1
}

# jq is a hard dependency for any command that rewrites .agents/project.json.
# write_project_file rebuilds the file from jq-gated readers; without jq those
# readers return empty and silently drop project_scopes/notes/pinned_versions/
# enabled_skills/skill_updates. Fail fast instead of losing user-authored state.
require_jq_write() {
  command -v jq >/dev/null 2>&1 || die "jq required for write operations. Install with: brew install jq (macOS) or apt install jq (Debian/Ubuntu)."
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
  [[ "$1" != "base" ]] || return 1
  [[ -d "$PACKS_DIR/$1" ]]
}

list_packs() {
  find "$PACKS_DIR" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | sed '/^base$/d' | sort
}

available_packs_inline() {
  list_packs | paste -sd ', ' -
}

canonical_hibernated_pack() {
  local pack="$1"
  case "$pack" in
    business-app-kanban|business_app_kanban|businessapp-kanban|businessapp_kanban|business-kanban|business_kanban|saas-kanban|saas_kanban)
      echo "business-app-kanban"
      ;;
    devtool-kanban|devtool_kanban|dev-kanban|dev_kanban|dev-tool-kanban|dev-tool_kanban|dev-tools-kanban|dev-tools_kanban|developer-tool-kanban|developer-tool_kanban|developer-tools-kanban|developer-tools_kanban)
      echo "devtool-kanban"
      ;;
    game-kanban|game_kanban|games-kanban|games_kanban)
      echo "game-kanban"
      ;;
    poketowork-kanban|poketowork_kanban|poketo-work-kanban|poketo_work_kanban)
      echo "poketowork-kanban"
      ;;
    *)
      return 1
      ;;
  esac
}

die_hibernated_pack() {
  local requested="$1"
  local pack="$2"
  local archive_path="$HIBERNATED_KANBAN_DIR/$pack"
  local archive_rel="${archive_path#"$REPO_ROOT"/}"

  {
    echo "ERROR: PoketoWork kanban pack '$pack' is hibernated while Poketo.work is being rebuilt."
    echo "Requested: $requested"
    echo "Archive: $archive_rel"
    echo "Reactivation requires a stable service/API, a known auth contract, and updated smoke tests."
    echo "No active install is available. To clean up a stale project designation, run: scripts/pack.sh remove $pack"
  } >&2
  exit 1
}

find_hibernated_packs_for_skill() {
  local skill="$1"
  local pack_dir pack found=false
  [[ -d "$HIBERNATED_KANBAN_DIR" ]] || return 1

  for pack_dir in "$HIBERNATED_KANBAN_DIR"/*/; do
    [[ -d "$pack_dir" ]] || continue
    pack="$(basename "${pack_dir%/}")"
    if [[ -d "$pack_dir/claude/$skill" || -d "$pack_dir/codex/$skill" ]]; then
      echo "$pack"
      found=true
    fi
  done

  [[ "$found" == true ]]
}

die_hibernated_skill() {
  local skill="$1"
  local packs="$2"
  local packs_inline archive_rel
  packs_inline="$(printf '%s\n' "$packs" | awk 'BEGIN { first = 1 } { if (!first) printf ", "; printf "%s", $0; first = 0 } END { print "" }')"
  archive_rel="${HIBERNATED_KANBAN_DIR#"$REPO_ROOT"/}"

  {
    echo "ERROR: PoketoWork kanban skill '$skill' is archived in hibernated pack(s): $packs_inline"
    echo "PoketoWork kanban packs are hibernated while Poketo.work is being rebuilt."
    echo "Archive: $archive_rel"
    echo "Reactivation requires a stable service/API, a known auth contract, and updated smoke tests."
    echo "No active installable pack provides '$skill'."
  } >&2
  exit 1
}

normalize_pack() {
  local pack="$1"
  pack="${pack%,}"
  pack="${pack#pack:}"
  case "$pack" in
    business|business_app|businessapp|product|saas|business-app)
      echo "business-research"
      echo "customer-lifecycle"
      echo "business-growth"
      echo "business-ops"
      ;;
    business-research|business-discovery|discovery|research) echo "business-research" ;;
    customer-lifecycle|customer_lifecycle|lifecycle|journey|customer-journey|customer_journey|user-journey|user_journey|onboarding|conversion|transactions|transaction) echo "customer-lifecycle" ;;
    business-growth|growth|gtm-growth|gtm_growth) echo "business-growth" ;;
    business-ops|business_ops|ops|business-operations|business_operations) echo "business-ops" ;;
    creator|creator_media|creatormedia|media|founder-media|creator-media)
      echo "creator-foundation"
      echo "youtube-ops"
      ;;
    creator-foundation|creator_foundation|creator-strategy|creator_strategy|founder-media-foundation) echo "creator-foundation" ;;
    youtube|youtube-media|youtube_media|youtube-ops|youtube_ops) echo "youtube-ops" ;;
    remotion|video-production|video_production|video-build|videobuild|video-script|videoscript) echo "remotion" ;;
    project-fleet|project_fleet|fleet|portfolio|portfolio-ops|portfolio_ops|clone-spec-store|spin-off|spinoff|spinoff-idea|spinoff_idea) echo "project-fleet" ;;
    quality|codequality|code_quality|code-quality) echo "code-quality" ;;
    games) echo "game" ;;
    dev|dev-tool|dev-tools|developer-tool|developer-tools) echo "devtool" ;;
    alignment|align|taste|alignment_loop|alignmentloop) echo "alignment-loop" ;;
    product|product-design|product_design|productdesign|ux|design) echo "product-design" ;;
    agent-work|agent_work_admin|agent-work-admin|work-admin|planning|planner) echo "agent-work-admin" ;;
    review|code-review|code_review|codereview|audit) echo "code-review" ;;
    code-debug|code_debug|codedebug|debugging) echo "code-debug" ;;
    release|release-ops|release_ops|releaseops|releases) echo "release-ops" ;;
    exec|exec-loop|exec_loop|execloop|execution) echo "exec-loop" ;;
    research|research-admin|research_admin) echo "research-admin" ;;
    testing|product-testing|product_testing|producttesting|uat) echo "product-testing" ;;
    docs|docs-health|docs_health|docshealth|doc-health) echo "docs-health" ;;
    skill|skill-dev|skill_dev|skilldev|skills-dev) echo "skill-dev" ;;
    walkthrough|guided-walkthrough|guided_walkthrough|guides) echo "guided-walkthrough" ;;
    sessions|session-analytics|session_analytics|analytics) echo "session-analytics" ;;
    teardown|tear-down|tear_down) echo "teardown" ;;
    maintenance|code-maintenance|code_maintenance|codemaintenance) echo "code-maintenance" ;;
    git|gitops|git-ops|git_ops) echo "gitops" ;;
    website|website-polish|website_polish) echo "website-polish" ;;
    report|report-gen|report_gen|reportgen|reports) echo "report-gen" ;;
    context|context-transfer|context_transfer) echo "context-transfer" ;;
    bridge|agent-bridge|agent_bridge) echo "agent-bridge" ;;
    knowledge|knowledge-check|knowledge_check|quiz) echo "knowledge-check" ;;
    repo|repo-maintenance|repo_maintenance) echo "repo-maintenance" ;;
    exec-profile|exec_profile|execprofile) echo "exec-profile" ;;
    alignment-page|alignment-page-admin|alignment_page_admin) echo "alignment-page-admin" ;;
    vard|viral|viral-app|viral_app|rapid-app|rapid_app) echo "vard" ;;
    ord|oss-rapid|oss_rapid|rapid-oss|rapid_oss|oss-dist|oss_dist) echo "ord" ;;
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
    business-research|customer-lifecycle|business-growth|business-ops|business-app) echo "business-app" ;;
    game) echo "game" ;;
    devtool) echo "devtool" ;;
    creator-foundation|youtube-ops|creator-media|remotion) echo "creator-media" ;;
    project-fleet) echo "project-fleet" ;;
    vard) echo "business-app" ;;
    ord) echo "devtool" ;;
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
  if command -v jq >/dev/null 2>&1; then
    jq -r '.enabled_packs // [] | .[] | select(. != "base")' "$PROJECT_FILE" 2>/dev/null || true
  else
    grep -o '"enabled_packs"[[:space:]]*:[[:space:]]*\[[^]]*\]' "$PROJECT_FILE" \
      | sed 's/.*\[//; s/\].*//' \
      | tr ',' '\n' \
      | sed 's/[ "	]//g' \
      | sed '/^base$/d' \
      | sed '/^$/d' || true
  fi
}

write_project_file() {
  local project_type="$1"
  shift
  local project_scopes notes pinned_versions enabled_skills skill_updates alignment
  project_scopes="$(project_json_value project_scopes)"
  notes="$(project_json_value notes)"
  pinned_versions="$(read_pinned_versions)"
  enabled_skills="$(read_enabled_skills_json)"
  skill_updates="$(project_json_value skill_updates)"
  alignment="$(project_json_value alignment)"

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
    if [[ -n "$pinned_versions" ]]; then
      printf ',\n  "pinned_versions": %s' "$pinned_versions"
    fi
    if [[ -n "$enabled_skills" ]]; then
      printf ',\n  "enabled_skills": %s' "$enabled_skills"
    fi
    if [[ -n "$skill_updates" ]]; then
      printf ',\n  "skill_updates": %s' "$skill_updates"
    fi
    if [[ -n "$alignment" ]]; then
      printf ',\n  "alignment": %s' "$alignment"
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

read_pinned_versions() {
  if [[ -f "$PROJECT_FILE" ]] && command -v jq >/dev/null 2>&1; then
    jq -c '.pinned_versions // empty' "$PROJECT_FILE" 2>/dev/null || true
  fi
}

get_pinned_version() {
  local skill="$1"
  if [[ -f "$PROJECT_FILE" ]] && command -v jq >/dev/null 2>&1; then
    jq -r --arg s "$skill" '.pinned_versions[$s] // empty' "$PROJECT_FILE" 2>/dev/null || true
  fi
}

read_enabled_skills_json() {
  if [[ -f "$PROJECT_FILE" ]] && command -v jq >/dev/null 2>&1; then
    jq -c '.enabled_skills // empty' "$PROJECT_FILE" 2>/dev/null || true
  fi
}

read_enabled_skills() {
  if [[ -f "$PROJECT_FILE" ]] && command -v jq >/dev/null 2>&1; then
    jq -r '.enabled_skills // {} | to_entries[] | "\(.key) \(.value)"' "$PROJECT_FILE" 2>/dev/null || true
  fi
}

read_enabled_skill_pack() {
  local skill="$1"
  if [[ -f "$PROJECT_FILE" ]] && command -v jq >/dev/null 2>&1; then
    jq -r --arg s "$skill" '.enabled_skills[$s] // empty' "$PROJECT_FILE" 2>/dev/null || true
  fi
}

add_enabled_skill() {
  local skill="$1" pack="$2"
  command -v jq >/dev/null 2>&1 || die "jq is required for individual skill install"
  [[ -f "$PROJECT_FILE" ]] || die "No .agents/project.json found; install a pack first or let auto-create handle it"
  local tmp
  tmp="$(jq --arg s "$skill" --arg p "$pack" '.enabled_skills[$s] = $p' "$PROJECT_FILE")" || die "jq failed to update $PROJECT_FILE"
  [[ -n "$tmp" ]] || die "jq produced empty output for $PROJECT_FILE"
  echo "$tmp" > "$PROJECT_FILE"
}

remove_enabled_skill() {
  local skill="$1"
  command -v jq >/dev/null 2>&1 || die "jq is required for individual skill remove"
  [[ -f "$PROJECT_FILE" ]] || return 0
  local tmp
  tmp="$(jq --arg s "$skill" 'if .enabled_skills then .enabled_skills |= del(.[$s]) | if (.enabled_skills | length) == 0 then del(.enabled_skills) else . end else . end' "$PROJECT_FILE")" || die "jq failed to update $PROJECT_FILE"
  [[ -n "$tmp" ]] || die "jq produced empty output for $PROJECT_FILE"
  echo "$tmp" > "$PROJECT_FILE"
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
    local effective_source="$skill_dir"

    local pinned
    pinned="$(get_pinned_version "$name")"
    if [[ -n "$pinned" ]]; then
      local archive_path="$skill_dir/archive/$pinned"
      if [[ -d "$archive_path" && -f "$archive_path/SKILL.md" ]]; then
        effective_source="$archive_path"
      else
        echo "WARNING: pin $name=$pinned but $archive_path/SKILL.md not found, using current" >&2
      fi
    fi

    if sync_skill_install "$effective_source" "$target"; then
      if [[ -n "$pinned" && "$effective_source" != "$skill_dir" ]]; then
        echo "Installed .$tool/skills/$name -> $effective_source (pinned $pinned)"
      else
        echo "Installed .$tool/skills/$name -> $effective_source"
      fi
    fi
  done
}

install_pack() {
  local pack="$1"
  local hibernated_pack
  hibernated_pack="$(canonical_hibernated_pack "$pack" 2>/dev/null || true)"
  if [[ -n "$hibernated_pack" ]]; then
    die_hibernated_pack "$pack" "$hibernated_pack"
  fi
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

install_single_skill() {
  local skill="$1"
  local pack hibernated_packs
  pack="$(find_pack_for_skill "$skill" 2>/dev/null || true)"
  if [[ -z "$pack" ]]; then
    hibernated_packs="$(find_hibernated_packs_for_skill "$skill" 2>/dev/null || true)"
    if [[ -n "$hibernated_packs" ]]; then
      die_hibernated_skill "$skill" "$hibernated_packs"
    fi
    die "Skill '$skill' not found in any pack. Available packs: $(available_packs_inline)"
  fi

  for tool in claude codex; do
    local skill_dir="$PACKS_DIR/$pack/$tool/$skill"
    [[ -d "$skill_dir" ]] || continue
    local target_root="$PROJECT_ROOT/.$tool/skills"
    mkdir -p "$target_root"
    local target="$target_root/$skill"
    local effective_source="$skill_dir"

    local pinned
    pinned="$(get_pinned_version "$skill")"
    if [[ -n "$pinned" ]]; then
      local archive_path="$skill_dir/archive/$pinned"
      if [[ -d "$archive_path" && -f "$archive_path/SKILL.md" ]]; then
        effective_source="$archive_path"
      else
        echo "WARNING: pin $skill=$pinned but $archive_path/SKILL.md not found, using current" >&2
      fi
    fi

    if sync_skill_install "$effective_source" "$target"; then
      if [[ -n "$pinned" && "$effective_source" != "$skill_dir" ]]; then
        echo "Installed .$tool/skills/$skill -> $effective_source (pinned $pinned)"
      else
        echo "Installed .$tool/skills/$skill -> $effective_source"
      fi
    fi
  done

  if [[ ! -f "$PROJECT_FILE" ]]; then
    local project_type
    project_type="$(infer_project_type)"
    PROJECT_AGENT_MODE=""
    write_project_file "$project_type"
  fi
  add_enabled_skill "$skill" "$pack"
  echo "Updated .agents/project.json (skill: $skill from pack: $pack)"
}

remove_single_skill() {
  local skill="$1"
  local pack hibernated_packs
  pack="$(read_enabled_skill_pack "$skill")"
  if [[ -z "$pack" ]]; then
    pack="$(find_pack_for_skill "$skill" 2>/dev/null || true)"
    if [[ -z "$pack" ]]; then
      hibernated_packs="$(find_hibernated_packs_for_skill "$skill" 2>/dev/null || true)"
      if [[ -n "$hibernated_packs" ]]; then
        pack="$(printf '%s\n' "$hibernated_packs" | sed -n '1p')"
      else
        die "Skill '$skill' not found in any pack"
      fi
    fi
  fi

  for tool in claude codex; do
    local target_root="$PROJECT_ROOT/.$tool/skills"
    local target="$target_root/$skill"
    if remove_repo_skill_install "$target"; then
      echo "Removed .$tool/skills/$skill"
    fi
  done

  remove_enabled_skill "$skill"
  echo "Updated .agents/project.json (removed skill: $skill)"
}

remove_pack() {
  local pack="$1"
  local source_pack_dir="$PACKS_DIR/$pack"
  if ! pack_exists "$pack"; then
    local hibernated_pack
    hibernated_pack="$(canonical_hibernated_pack "$pack" 2>/dev/null || true)"
    if [[ -n "$hibernated_pack" && -d "$HIBERNATED_KANBAN_DIR/$hibernated_pack" ]]; then
      pack="$hibernated_pack"
      source_pack_dir="$HIBERNATED_KANBAN_DIR/$pack"
    else
      die "Unknown pack '$pack'. Available packs: $(available_packs_inline)"
    fi
  fi

  for tool in claude codex; do
    local source_dir="$source_pack_dir/$tool"
    local target_root="$PROJECT_ROOT/.$tool/skills"
    [[ -d "$source_dir" && -d "$target_root" ]] || continue
    for skill_dir in "$source_dir"/*/; do
      [[ -d "$skill_dir" ]] || continue
      skill_dir="${skill_dir%/}"
      local name target
      name="$(basename "$skill_dir")"
      target="$target_root/$name"
      if remove_repo_skill_install "$target"; then
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
  echo "Installed local pack skills:"
  find "$PROJECT_ROOT/.claude/skills" "$PROJECT_ROOT/.codex/skills" -mindepth 1 -maxdepth 1 \( -type l -o -type d \) -print 2>/dev/null | sort || true
  local skill_lines
  skill_lines="$(read_enabled_skills)"
  if [[ -n "$skill_lines" ]]; then
    echo ""
    echo "Individually installed skills:"
    echo "$skill_lines" | while IFS=' ' read -r skill pack; do
      echo "  $skill (from pack: $pack)"
    done
  fi
}

print_session_reload_notice() {
  cat <<'EOF'

Skill installs changed. Claude Code and Codex may keep the skill list loaded when the current session started.
Claude Code: use /reload-skills to rescan skills. /clear starts a new empty-context conversation and can also pick up the refreshed registry. Restart Claude Code if .claude/skills did not exist when the session started or the skill is still invisible.
Codex: start a fresh Codex CLI session if the $ skill list does not show newly installed or removed project-local skills.
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
    echo "PoketoWork kanban packs are hibernated during the Poketo.work rebuild."
  elif [[ "$inferred_project_type" == "devtool" ]]; then
    echo "Recommended pack: devtool or a narrow business pack"
    echo "Use devtool for developer-facing tools/libraries; use business-research, customer-lifecycle, business-growth, or business-ops for SaaS/business work."
    echo "For a quick OSS experiment (ship in days, not weeks), use ord instead."
    echo "PoketoWork kanban packs are hibernated during the Poketo.work rebuild."
    echo "For behavior-preserving refactors and code-health workflows, also install code-quality."
  else
    echo "Recommended pack: business-research"
    echo "Add customer-lifecycle when the current phase needs journey, onboarding, conversion, transaction, retention, expansion, or lifecycle metrics work."
    echo "Add business-growth or business-ops only when the current phase needs them."
    echo "For a quick viral app experiment (ship in days, not weeks), use vard instead."
    echo "PoketoWork kanban packs are hibernated during the Poketo.work rebuild."
    echo "For behavior-preserving refactors and code-health workflows, also install code-quality."
  fi
}

find_pack_for_skill() {
  local skill="$1"
  local pack
  for pack_dir in "$PACKS_DIR"/*/; do
    [[ -d "$pack_dir" ]] || continue
    pack="$(basename "$pack_dir")"
    for tool in claude codex; do
      if [[ -d "$PACKS_DIR/$pack/$tool/$skill" ]]; then
        echo "$pack"
        return 0
      fi
    done
  done

  # Fuzzy suffix pass: look for *-$skill directories
  local fuzzy_matches=()
  local fuzzy_packs=()
  for pack_dir in "$PACKS_DIR"/*/; do
    [[ -d "$pack_dir" ]] || continue
    pack="$(basename "$pack_dir")"
    for tool in claude codex; do
      for skill_dir in "$PACKS_DIR/$pack/$tool"/*-"$skill"/; do
        [[ -d "$skill_dir" ]] || continue
        local matched_skill
        matched_skill="$(basename "$skill_dir")"
        fuzzy_matches+=("$matched_skill")
        fuzzy_packs+=("$pack")
      done
    done
  done

  if [[ ${#fuzzy_matches[@]} -eq 1 ]]; then
    echo "Resolved '$skill' → '${fuzzy_matches[0]}' (${fuzzy_packs[0]})" >&2
    echo "${fuzzy_packs[0]}"
    return 0
  elif [[ ${#fuzzy_matches[@]} -gt 1 ]]; then
    echo "Ambiguous skill name '$skill'. Did you mean:" >&2
    for i in "${!fuzzy_matches[@]}"; do
      echo "  ${fuzzy_matches[$i]} (${fuzzy_packs[$i]})" >&2
    done
    return 1
  fi

  return 1
}

pin_skill() {
  local skill="${1:-}"
  local version="${2:-}"
  [[ -n "$skill" ]] || die "pin requires a skill name"
  [[ -n "$version" ]] || die "pin requires a version (e.g., v0.0)"

  local pack
  pack="$(find_pack_for_skill "$skill")" || die "Skill '$skill' not found in any pack"

  local found=false
  for tool in claude codex; do
    local archive_path="$PACKS_DIR/$pack/$tool/$skill/archive/$version/SKILL.md"
    if [[ -f "$archive_path" ]]; then
      found=true
      break
    fi
  done
  $found || die "No archive/$version/SKILL.md found for skill '$skill' in pack '$pack'"

  if command -v jq >/dev/null 2>&1 && [[ -f "$PROJECT_FILE" ]]; then
    local tmp
    tmp="$(jq --arg s "$skill" --arg v "$version" '.pinned_versions[$s] = $v' "$PROJECT_FILE")" || die "jq failed to update $PROJECT_FILE"
    [[ -n "$tmp" ]] || die "jq produced empty output for $PROJECT_FILE"
    echo "$tmp" > "$PROJECT_FILE"
  else
    [[ -f "$PROJECT_FILE" ]] || die "No .agents/project.json found; install a pack first"
    die "jq is required for pin/unpin"
  fi

  for tool in claude codex; do
    local skill_dir="$PACKS_DIR/$pack/$tool/$skill"
    local target_root="$PROJECT_ROOT/.$tool/skills"
    local target="$target_root/$(basename "$skill_dir")"
    local archive_source="$skill_dir/archive/$version"
    [[ -d "$archive_source" ]] || continue
    [[ -d "$target_root" ]] || continue
    if sync_skill_install "$archive_source" "$target"; then
      echo "Pinned .$tool/skills/$skill -> $archive_source"
    fi
  done
  echo "Pinned $skill to $version"
}

unpin_skill() {
  local skill="${1:-}"
  [[ -n "$skill" ]] || die "unpin requires a skill name"

  local pack
  pack="$(find_pack_for_skill "$skill")" || die "Skill '$skill' not found in any pack"

  if command -v jq >/dev/null 2>&1 && [[ -f "$PROJECT_FILE" ]]; then
    local tmp
    tmp="$(jq --arg s "$skill" 'if .pinned_versions then .pinned_versions |= del(.[$s]) | if (.pinned_versions | length) == 0 then del(.pinned_versions) else . end else . end' "$PROJECT_FILE")" || die "jq failed to update $PROJECT_FILE"
    [[ -n "$tmp" ]] || die "jq produced empty output for $PROJECT_FILE"
    echo "$tmp" > "$PROJECT_FILE"
  else
    [[ -f "$PROJECT_FILE" ]] || die "No .agents/project.json found"
    die "jq is required for pin/unpin"
  fi

  for tool in claude codex; do
    local skill_dir="$PACKS_DIR/$pack/$tool/$skill"
    local target_root="$PROJECT_ROOT/.$tool/skills"
    local target="$target_root/$(basename "$skill_dir")"
    [[ -d "$skill_dir" ]] || continue
    [[ -d "$target_root" ]] || continue
    if sync_skill_install "$skill_dir" "$target"; then
      echo "Unpinned .$tool/skills/$skill -> $skill_dir"
    fi
  done
  echo "Unpinned $skill (reverted to latest)"
}

refresh() {
  read_lines_into_packs < <(read_enabled_packs)
  local skill_lines
  skill_lines="$(read_enabled_skills)"
  [[ "${#packs[@]}" -gt 0 || -n "$skill_lines" ]] || die "No enabled packs or skills in .agents/project.json"
  if [[ ${#packs[@]} -gt 0 ]]; then
    for pack in "${packs[@]}"; do
      install_pack "$pack"
    done
  fi
  if [[ -n "$skill_lines" ]]; then
    echo "$skill_lines" | while IFS=' ' read -r skill pack; do
      install_single_skill "$skill"
    done
  fi
}

project_skill_updates_mode() {
  if [[ -f "$PROJECT_FILE" ]] && command -v jq >/dev/null 2>&1; then
    jq -r '.skill_updates.mode // empty' "$PROJECT_FILE" 2>/dev/null || true
  fi
}

set_update_mode() {
  local mode="${1:-}"
  case "$mode" in
    warn|auto|unset) ;;
    *) die "set-update-mode requires a mode: warn, auto, or unset" ;;
  esac
  command -v jq >/dev/null 2>&1 || die "jq is required for set-update-mode"
  [[ -f "$PROJECT_FILE" ]] || die "No .agents/project.json found; install a pack first"
  local tmp
  if [[ "$mode" == "unset" ]]; then
    tmp="$(jq 'del(.skill_updates)' "$PROJECT_FILE")" || die "jq failed to update $PROJECT_FILE"
  else
    tmp="$(jq --arg m "$mode" '.skill_updates = ((.skill_updates // {}) + {mode: $m})' "$PROJECT_FILE")" || die "jq failed to update $PROJECT_FILE"
  fi
  [[ -n "$tmp" ]] || die "jq produced empty output for $PROJECT_FILE"
  echo "$tmp" > "$PROJECT_FILE"
  echo "Set skill_updates.mode to $mode"
}

set_bip() {
  die "$BIP_REMOVED_MESSAGE"
}

set_bip_prompt() {
  die "$BIP_REMOVED_MESSAGE"
}

set_bip_platforms() {
  die "$BIP_REMOVED_MESSAGE"
}

# Read-only drift report for project-local managed skill installs.
# Exits non-zero if any install is stale so callers (sync, hook) can branch.
doctor() {
  local mode
  mode="$(project_skill_updates_mode)"
  [[ -n "$mode" ]] || mode="warn (default)"
  echo "Project skill update mode: $mode"
  echo "Skill install drift (.claude/skills, .codex/skills):"

  local found=false any_stale=false
  local target line status rec cur rel
  local refresh_cmd
  if [[ -d "$REPO_ROOT/.git" ]]; then
    refresh_cmd="$REPO_ROOT/scripts/pack.sh refresh"   # absolute → works from any cwd
  else
    refresh_cmd="npx skillpacks refresh"               # npx-bundle case (no checkout)
  fi
  while IFS= read -r target; do
    [[ -n "$target" ]] || continue
    line="$(skill_install_status "$target")"
    IFS=$'\t' read -r status rec cur <<< "$line"
    [[ "$status" == "not-managed" ]] && continue
    found=true
    rel="${target#"$PROJECT_ROOT"/}"
    case "$status" in
      ok)             printf '  ok       %s\n' "$rel" ;;
      pinned)         printf '  pinned   %s (frozen %s)\n' "$rel" "${rec:-?}" ;;
      unknown)        printf '  unknown  %s — run `%s` to enable drift tracking\n' "$rel" "$refresh_cmd" ;;
      missing-source) printf '  missing  %s — canonical source no longer exists\n' "$rel" ;;
      stale)          printf '  STALE    %s (%s -> %s)\n' "$rel" "${rec:-?}" "${cur:-?}"; any_stale=true ;;
    esac
  done < <(find "$PROJECT_ROOT/.claude/skills" "$PROJECT_ROOT/.codex/skills" -mindepth 1 -maxdepth 1 \( -type l -o -type d \) -print 2>/dev/null | sort)

  if [[ "$found" != true ]]; then
    echo "  (no managed skill installs found)"
  fi

  if [[ "$found" == true || -f "$PROJECT_FILE" || -d "$MANAGED_CONVENTION_DOC_ROOT" ]]; then
    echo "Convention doc drift (.agents/skillpacks/docs):"
    local doc_found=false doc_status doc_rel
    while IFS=$'\t' read -r doc_status doc_rel; do
      [[ -n "$doc_status" ]] || continue
      doc_found=true
      case "$doc_status" in
        ok)      printf '  ok       .agents/skillpacks/docs/%s\n' "$doc_rel" ;;
        missing) printf '  missing  .agents/skillpacks/docs/%s\n' "$doc_rel"; any_stale=true ;;
        stale)   printf '  STALE    .agents/skillpacks/docs/%s\n' "$doc_rel"; any_stale=true ;;
      esac
    done < <(managed_convention_doc_statuses)
    if [[ "$doc_found" != true ]]; then
      echo "  (no convention docs found)"
    fi
  fi

  if [[ "$any_stale" == true ]]; then
    echo ""
    echo "Fix: $refresh_cmd"
    return 1
  fi
  return 0
}

prune() {
  local dry_run=false
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dry-run) dry_run=true; shift ;;
      *) die "prune: unknown option '$1'" ;;
    esac
  done

  # Build the set of expected skill names from enabled packs and individually enabled skills
  local -A expected_skills
  local pack skill_dir name

  read_lines_into_packs < <(read_enabled_packs)
  for pack in "${packs[@]}"; do
    for tool in claude codex; do
      local source_dir="$PACKS_DIR/$pack/$tool"
      [[ -d "$source_dir" ]] || continue
      for skill_dir in "$source_dir"/*/; do
        [[ -d "$skill_dir" ]] || continue
        name="$(basename "${skill_dir%/}")"
        expected_skills["$name"]=1
      done
    done
  done

  local skill_lines
  skill_lines="$(read_enabled_skills)"
  if [[ -n "$skill_lines" ]]; then
    while IFS=' ' read -r name _pack; do
      expected_skills["$name"]=1
    done <<< "$skill_lines"
  fi

  local target line status rel removed=0
  while IFS= read -r target; do
    [[ -n "$target" ]] || continue
    line="$(skill_install_status "$target")"
    IFS=$'\t' read -r status _ _ <<< "$line"
    [[ "$status" != "not-managed" ]] || continue

    local reason=""
    if [[ "$status" == "missing-source" ]]; then
      reason="source no longer exists"
    else
      name="$(basename "$target")"
      if [[ -z "${expected_skills[$name]+x}" ]]; then
        reason="pack not enabled"
      fi
    fi
    [[ -n "$reason" ]] || continue

    rel="${target#"$PROJECT_ROOT"/}"
    if [[ "$dry_run" == true ]]; then
      printf 'would remove  %s (%s)\n' "$rel" "$reason"
    else
      if remove_repo_skill_install "$target"; then
        printf 'removed  %s (%s)\n' "$rel" "$reason"
      elif [[ -L "$target" ]]; then
        rm "$target"
        printf 'removed  %s (%s)\n' "$rel" "$reason"
      elif [[ -d "$target" ]]; then
        rm -rf "$target"
        printf 'removed  %s (%s)\n' "$rel" "$reason"
      else
        printf 'FAILED   %s (%s)\n' "$rel" "$reason" >&2
      fi
    fi
    ((removed++)) || true
  done < <(find "$PROJECT_ROOT/.claude/skills" "$PROJECT_ROOT/.codex/skills" -mindepth 1 -maxdepth 1 \( -type l -o -type d \) -print 2>/dev/null | sort)

  if [[ "$removed" -eq 0 ]]; then
    echo "Nothing to prune."
  else
    if [[ "$dry_run" == true ]]; then
      printf '%d orphan(s) found. Run without --dry-run to remove.\n' "$removed"
    else
      printf '%d orphan(s) removed.\n' "$removed"
    fi
  fi
}

cmd="${1:-}"
case "$cmd" in
  list) list_packs ;;
  list-packs) read_enabled_packs ;;
  status) status ;;
  recommend) recommend ;;
  install)
    acquire_project_lock "$@"
    require_jq_write
    shift
    install_packs=()
    install_skills=()
    for raw in "$@"; do
      raw="${raw//,/ }"
      for token in $raw; do
        token="${token%,}"
        token="${token#pack:}"
        case "$token" in pack|packs|"") continue ;; esac
        hibernated_pack="$(canonical_hibernated_pack "$token" 2>/dev/null || true)"
        if [[ -n "$hibernated_pack" ]]; then
          die_hibernated_pack "$token" "$hibernated_pack"
        fi
        normalized="$(normalize_pack "$token" 2>/dev/null)" || normalized=""
        if [[ -n "$normalized" ]]; then
          all_exist=true
          while IFS= read -r p; do
            pack_exists "$p" || { all_exist=false; break; }
          done <<< "$normalized"
          if [[ "$all_exist" == true ]]; then
            while IFS= read -r p; do
              install_packs+=("$p")
            done <<< "$normalized"
            continue
          fi
        fi
        find_pack_for_skill "$token" >/dev/null 2>&1 && {
          install_skills+=("$token")
          continue
        }
        hibernated_packs="$(find_hibernated_packs_for_skill "$token" 2>/dev/null || true)"
        if [[ -n "$hibernated_packs" ]]; then
          die_hibernated_skill "$token" "$hibernated_packs"
        fi
        die "Unknown pack or skill '$token'. Available packs: $(available_packs_inline)"
      done
    done
    [[ "${#install_packs[@]}" -gt 0 || "${#install_skills[@]}" -gt 0 ]] || die "install requires a pack or skill name"
    if [[ ${#install_packs[@]} -gt 0 ]]; then
      for pack in "${install_packs[@]}"; do
        install_pack "$pack"
      done
    fi
    if [[ ${#install_skills[@]} -gt 0 ]]; then
      for skill in "${install_skills[@]}"; do
        install_single_skill "$skill"
      done
    fi
    sync_managed_convention_docs
    print_session_reload_notice
    ;;
  remove)
    acquire_project_lock "$@"
    require_jq_write
    shift
    remove_packs=()
    remove_skills=()
    for raw in "$@"; do
      raw="${raw//,/ }"
      for token in $raw; do
        token="${token%,}"
        token="${token#pack:}"
        case "$token" in pack|packs|"") continue ;; esac
        hibernated_pack="$(canonical_hibernated_pack "$token" 2>/dev/null || true)"
        if [[ -n "$hibernated_pack" ]]; then
          remove_packs+=("$hibernated_pack")
          continue
        fi
        skill_pack="$(read_enabled_skill_pack "$token")"
        if [[ -n "$skill_pack" ]]; then
          remove_skills+=("$token")
          continue
        fi
        normalized="$(normalize_pack "$token" 2>/dev/null)" || normalized=""
        if [[ -n "$normalized" ]]; then
          all_exist=true
          while IFS= read -r p; do
            pack_exists "$p" || { all_exist=false; break; }
          done <<< "$normalized"
          if [[ "$all_exist" == true ]]; then
            while IFS= read -r p; do
              remove_packs+=("$p")
            done <<< "$normalized"
            continue
          fi
        fi
        find_pack_for_skill "$token" >/dev/null 2>&1 && {
          remove_skills+=("$token")
          continue
        }
        hibernated_packs="$(find_hibernated_packs_for_skill "$token" 2>/dev/null || true)"
        if [[ -n "$hibernated_packs" ]]; then
          remove_skills+=("$token")
          continue
        fi
        die "Unknown pack or skill '$token'. Available packs: $(available_packs_inline)"
      done
    done
    [[ "${#remove_packs[@]}" -gt 0 || "${#remove_skills[@]}" -gt 0 ]] || die "remove requires a pack or skill name"
    if [[ ${#remove_packs[@]} -gt 0 ]]; then
      for pack in "${remove_packs[@]}"; do
        remove_pack "$pack"
      done
    fi
    if [[ ${#remove_skills[@]} -gt 0 ]]; then
      for skill in "${remove_skills[@]}"; do
        remove_single_skill "$skill"
      done
    fi
    print_session_reload_notice
    ;;
  refresh)
    acquire_project_lock "$@"
    require_jq_write
    refresh
    sync_managed_convention_docs
    print_session_reload_notice
    ;;
  doctor)
    shift
    doctor
    ;;
  prune)
    acquire_project_lock "$@"
    require_jq_write
    shift
    prune "$@"
    print_session_reload_notice
    ;;
  set-update-mode)
    acquire_project_lock "$@"
    require_jq_write
    shift
    set_update_mode "${1:-}"
    ;;
  set-bip)
    shift
    set_bip "${1:-}"
    ;;
  set-bip-platforms)
    shift
    set_bip_platforms "$@"
    ;;
  set-bip-prompt)
    shift
    set_bip_prompt "${1:-}"
    ;;
  pin)
    acquire_project_lock "$@"
    require_jq_write
    shift
    pin_skill "${1:-}" "${2:-}"
    ;;
  unpin)
    acquire_project_lock "$@"
    require_jq_write
    shift
    unpin_skill "${1:-}"
    ;;
  set-mode)
    acquire_project_lock "$@"
    require_jq_write
    shift
    set_mode "${1:-}"
    ;;
  which)
    shift
    skill="${1:-}"
    [[ -n "$skill" ]] || die "which requires a skill name"
    pack="$(find_pack_for_skill "$skill" 2>/dev/null || true)"
    if [[ -z "$pack" ]]; then
      hibernated_packs="$(find_hibernated_packs_for_skill "$skill" 2>/dev/null || true)"
      if [[ -n "$hibernated_packs" ]]; then
        die_hibernated_skill "$skill" "$hibernated_packs"
      fi
      die "Skill '$skill' not found in any pack"
    fi
    skill_pack="$(read_enabled_skill_pack "$skill")"
    enabled="$(read_enabled_packs)"
    if [[ -n "$skill_pack" ]]; then
      echo "$skill is individually installed from pack '$pack'"
    elif echo "$enabled" | grep -qx "$pack"; then
      echo "$skill is provided by pack '$pack' (installed via pack)"
    else
      echo "$skill is provided by pack '$pack' (not installed)"
      echo "Install pack:  scripts/pack.sh install $pack"
      echo "Install skill: scripts/pack.sh install $skill"
    fi
    ;;
  --help|-h|"") usage ;;
  *) usage; exit 2 ;;
esac
