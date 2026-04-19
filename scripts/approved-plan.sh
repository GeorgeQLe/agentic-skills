#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="$(pwd)"
DEFAULT_PACKET="$PROJECT_ROOT/.agents/approved-plan.json"
TODO_FILE="$PROJECT_ROOT/tasks/todo.md"
MANUAL_TODO_FILE="$PROJECT_ROOT/tasks/manual-todo.md"
MIRROR_FILE="$PROJECT_ROOT/tasks/approved-plan.md"

die() {
  echo "ERROR: $*" >&2
  exit 1
}

fail() {
  # Single-line failure reason to stdout, non-zero exit.
  echo "$1"
  exit 1
}

require_jq_write() {
  command -v jq >/dev/null 2>&1 || die "jq required for write operations. Install with: brew install jq (macOS) or apt install jq (Debian/Ubuntu)."
}

json_read() {
  # json_read <file> <jq-filter>
  local file="$1"
  local filter="$2"
  if command -v jq >/dev/null 2>&1; then
    jq -r "$filter // empty" "$file"
  else
    # Extremely limited sed fallback: only supports top-level string fields
    # referenced as `.field_name` in the filter. Good enough for read path.
    local field
    field="${filter#.}"
    sed -n 's/.*"'"$field"'"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$file" | head -1
  fi
}

todo_hash_of() {
  local file="$1"
  [[ -f "$file" ]] || { echo ""; return; }
  perl -pe 's/^\xEF\xBB\xBF//; s/\r$//' "$file" | shasum -a 256 | awk '{print $1}'
}

iso_to_epoch() {
  # macOS BSD date and GNU date both accept ISO-8601 with a `Z` suffix via
  # slightly different flags. Try BSD first, then GNU.
  local iso="$1"
  local normalized="${iso%Z}"
  local epoch
  if epoch="$(date -u -j -f "%Y-%m-%dT%H:%M:%S" "$normalized" +"%s" 2>/dev/null)"; then
    echo "$epoch"
    return 0
  fi
  if epoch="$(date -u -d "$iso" +"%s" 2>/dev/null)"; then
    echo "$epoch"
    return 0
  fi
  return 1
}

check_mode_compat() {
  # Exit non-zero with a mode-mismatch message if SKILLS_AGENT_MODE or
  # project.json resolves to claude-only — this helper is a Codex-side
  # affordance.
  local mode=""
  if [[ -x "$PROJECT_ROOT/scripts/agent-mode.sh" ]]; then
    mode="$("$PROJECT_ROOT/scripts/agent-mode.sh" || true)"
  fi
  if [[ "$mode" == "claude-only" ]]; then
    fail "mode-mismatch: agent_mode=claude-only; \$run --execute-approved is a Codex-only affordance"
  fi
}

cmd_check() {
  local packet="$DEFAULT_PACKET"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --packet) packet="$2"; shift 2 ;;
      *) die "Unknown arg to check: $1" ;;
    esac
  done

  check_mode_compat

  [[ -f "$packet" ]] || fail "missing: no packet at $packet"

  # 1. Lifecycle enum
  local lifecycle
  lifecycle="$(json_read "$packet" '.lifecycle')"
  case "$lifecycle" in
    approved) ;;
    draft|consumed|stale|superseded|uncertain)
      fail "invalid: lifecycle=$lifecycle (only 'approved' is executable)"
      ;;
    *)
      fail "invalid: lifecycle=${lifecycle:-<missing>}"
      ;;
  esac

  # 2. TTL
  local approved_at ttl_seconds
  approved_at="$(json_read "$packet" '.approved_at')"
  ttl_seconds="$(json_read "$packet" '.ttl_seconds')"
  [[ -n "$approved_at" ]] || fail "missing: approved_at"
  [[ -n "$ttl_seconds" ]] || fail "missing: ttl_seconds"
  local approved_epoch now_epoch age
  approved_epoch="$(iso_to_epoch "$approved_at")" || fail "invalid: cannot parse approved_at=$approved_at"
  now_epoch="$(date -u +"%s")"
  age=$(( now_epoch - approved_epoch ))
  if (( age >= ttl_seconds )); then
    fail "stale: TTL expired (approved_at=$approved_at, age=${age}s, ttl=${ttl_seconds}s)"
  fi

  # 3. Git HEAD
  local expected_head actual_head
  expected_head="$(json_read "$packet" '.git_head')"
  [[ -n "$expected_head" ]] || fail "missing: git_head"
  actual_head="$(git -C "$PROJECT_ROOT" rev-parse HEAD 2>/dev/null)" || fail "invalid: not a git repo at $PROJECT_ROOT"
  if [[ "$expected_head" != "$actual_head" ]]; then
    fail "stale: git HEAD moved from $expected_head to $actual_head"
  fi

  # 4. todo.md hash
  local expected_hash actual_hash
  expected_hash="$(json_read "$packet" '.todo_hash')"
  [[ -n "$expected_hash" ]] || fail "missing: todo_hash"
  actual_hash="$(todo_hash_of "$TODO_FILE")"
  if [[ "$expected_hash" != "$actual_hash" ]]; then
    fail "stale: todo.md hash changed (expected ${expected_hash:0:12}…, got ${actual_hash:0:12}…)"
  fi

  # 5. Dirty paths outside allowlist
  local dirty
  dirty="$(git -C "$PROJECT_ROOT" status --porcelain 2>/dev/null | awk '{print $2}')"
  if [[ -n "$dirty" ]]; then
    local -a allow=()
    if command -v jq >/dev/null 2>&1; then
      while IFS= read -r glob; do
        [[ -n "$glob" ]] && allow+=("$glob")
      done < <(jq -r '(.allowed_dirty_paths // [])[]' "$packet")
    fi
    local path matched
    while IFS= read -r path; do
      [[ -z "$path" ]] && continue
      matched=0
      for glob in "${allow[@]+"${allow[@]}"}"; do
        # shellcheck disable=SC2053
        case "$path" in
          $glob) matched=1; break ;;
        esac
      done
      if (( matched == 0 )); then
        fail "stale: dirty path outside allowlist: $path"
      fi
    done <<<"$dirty"
  fi

  # 6. Blocking manual tasks
  if [[ -f "$MANUAL_TODO_FILE" ]]; then
    local -a known=()
    if command -v jq >/dev/null 2>&1; then
      while IFS= read -r snap; do
        known+=("$snap")
      done < <(jq -r '(.blocking_manual_tasks // [])[]' "$packet")
    fi
    local line
    while IFS= read -r line; do
      [[ "$line" == *"_(blocks: Step "*")_"* ]] || continue
      [[ "$line" =~ ^[[:space:]]*-[[:space:]]*\[x\] ]] && continue
      local seen=0
      for k in "${known[@]+"${known[@]}"}"; do
        if [[ "$line" == *"$k"* ]]; then
          seen=1; break
        fi
      done
      if (( seen == 0 )); then
        fail "stale: new blocking manual task: ${line## }"
      fi
    done <"$MANUAL_TODO_FILE"
  fi

  echo "ok"
}

write_mirror() {
  local packet="$1"
  require_jq_write

  local phase step title approved_at approved_by git_head todo_hash ttl lifecycle
  phase="$(jq -r '.step_identity.phase' "$packet")"
  step="$(jq -r '.step_identity.step' "$packet")"
  title="$(jq -r '.step_identity.title' "$packet")"
  approved_at="$(jq -r '.approved_at' "$packet")"
  approved_by="$(jq -r '.approved_by // "—"' "$packet")"
  git_head="$(jq -r '.git_head' "$packet")"
  todo_hash="$(jq -r '.todo_hash' "$packet")"
  ttl="$(jq -r '.ttl_seconds' "$packet")"
  lifecycle="$(jq -r '.lifecycle' "$packet")"

  local manual_block
  if [[ "$(jq -r '(.blocking_manual_tasks // []) | length' "$packet")" == "0" ]]; then
    manual_block="- **Blocking manual tasks:** none"
  else
    manual_block="- **Blocking manual tasks:**"$'\n'"$(jq -r '(.blocking_manual_tasks // [])[] | "  - " + .' "$packet")"
  fi

  local tmp="$MIRROR_FILE.tmp"
  cat >"$tmp" <<EOF
# Approved Plan (Sanitized Mirror)

This file is the committable, human-readable mirror of \`.agents/approved-plan.json\` (the machine-readable source of truth, which is gitignored developer-local state). Only \`.md\`-safe fields are projected here. See \`docs/operating-modes.md\` § "Approval / Delegation Packet" for the full schema, lifecycle, and safety classification.

## Status

- **Step:** $phase / $step — $title
- **Approved at:** $approved_at
- **Approved by:** $approved_by
- **Git HEAD:** $git_head
- **todo.md hash:** $todo_hash
- **TTL:** ${ttl}s
- **Lifecycle:** $lifecycle
$manual_block

Fields excluded from this mirror: \`allowed_dirty_paths\`, \`notes\`.
EOF
  mv "$tmp" "$MIRROR_FILE"
}

cmd_consume() {
  local packet="$DEFAULT_PACKET"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --packet) packet="$2"; shift 2 ;;
      *) die "Unknown arg to consume: $1" ;;
    esac
  done

  [[ -f "$packet" ]] || die "no packet at $packet"
  require_jq_write

  local lifecycle
  lifecycle="$(jq -r '.lifecycle' "$packet")"
  case "$lifecycle" in
    consumed)
      # Idempotent no-op: mirror already written; just confirm.
      echo "ok: already consumed"
      return 0
      ;;
    approved) ;;
    *)
      die "cannot consume: lifecycle=$lifecycle (must be 'approved' or 'consumed')"
      ;;
  esac

  local tmp="$packet.tmp"
  jq '.lifecycle = "consumed"' "$packet" >"$tmp"
  mv "$tmp" "$packet"
  write_mirror "$packet"
  echo "ok"
}

cmd_mark_stale() {
  local packet="$DEFAULT_PACKET"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --packet) packet="$2"; shift 2 ;;
      *) die "Unknown arg to mark-stale: $1" ;;
    esac
  done

  [[ -f "$packet" ]] || die "no packet at $packet"
  require_jq_write

  local tmp="$packet.tmp"
  jq '.lifecycle = "stale"' "$packet" >"$tmp"
  mv "$tmp" "$packet"
  echo "ok"
}

usage() {
  cat >&2 <<'EOF'
Usage: approved-plan.sh <check|consume|mark-stale> [--packet <path>]

  check        Run all six freshness checks on the packet.
               Prints 'ok' + exit 0 when fresh, or a single-line
               failure reason + non-zero exit.
  consume      Atomically transition approved -> consumed and
               write tasks/approved-plan.md mirror. Idempotent.
  mark-stale   Atomically transition approved -> stale.

Default packet path: .agents/approved-plan.json
EOF
  exit 2
}

[[ $# -ge 1 ]] || usage
sub="$1"; shift
case "$sub" in
  check) cmd_check "$@" ;;
  consume) cmd_consume "$@" ;;
  mark-stale) cmd_mark_stale "$@" ;;
  -h|--help|help) usage ;;
  *) usage ;;
esac
