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

This file is the committable, human-readable mirror of \`.agents/approved-plan.json\` (the machine-readable source of truth, which is gitignored developer-local state). Only \`.md\`-safe fields are projected here. See \`docs/operating-modes.md\` § "Approval packet" for the full schema, lifecycle, and safety classification.

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

cmd_draft() {
  local packet="$DEFAULT_PACKET"
  local phase="" step="" title="" approved_by="" ttl=3600
  local -a allow_dirty=()
  local -a notes=()
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --phase) phase="$2"; shift 2 ;;
      --step) step="$2"; shift 2 ;;
      --title) title="$2"; shift 2 ;;
      --approved-by) approved_by="$2"; shift 2 ;;
      --ttl) ttl="$2"; shift 2 ;;
      --allow-dirty) allow_dirty+=("$2"); shift 2 ;;
      --note) notes+=("$2"); shift 2 ;;
      --packet) packet="$2"; shift 2 ;;
      *) die "Unknown arg to draft: $1" ;;
    esac
  done

  [[ -n "$phase" ]] || die "--phase required (e.g. --phase \"Phase 11\")"
  [[ -n "$step" ]] || die "--step required (e.g. --step \"Step 5\")"
  [[ -n "$title" ]] || die "--title required"

  require_jq_write

  if [[ -f "$packet" ]]; then
    local existing
    existing="$(jq -r '.lifecycle // empty' "$packet")"
    if [[ "$existing" == "approved" ]]; then
      fail "refuse: existing packet at $packet is approved (run supersede first)"
    fi
  fi

  local dirty
  dirty="$(git -C "$PROJECT_ROOT" status --porcelain 2>/dev/null | awk '{print $2}')"
  if [[ -n "$dirty" ]]; then
    local path matched glob
    while IFS= read -r path; do
      [[ -z "$path" ]] && continue
      matched=0
      for glob in "${allow_dirty[@]+"${allow_dirty[@]}"}"; do
        # shellcheck disable=SC2053
        case "$path" in
          $glob) matched=1; break ;;
        esac
      done
      if (( matched == 0 )); then
        fail "dirty path outside allowlist: $path (pass --allow-dirty <glob> if expected)"
      fi
    done <<<"$dirty"
  fi

  local git_head todo_hash approved_at
  git_head="$(git -C "$PROJECT_ROOT" rev-parse HEAD 2>/dev/null)" || die "not a git repo at $PROJECT_ROOT"
  todo_hash="$(todo_hash_of "$TODO_FILE")"
  [[ -n "$todo_hash" ]] || die "tasks/todo.md missing or empty"
  approved_at="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

  local manual_json="[]"
  if [[ -f "$MANUAL_TODO_FILE" ]]; then
    local -a snaps=()
    local line trimmed
    while IFS= read -r line; do
      [[ "$line" == *"_(blocks: Step "*")_"* ]] || continue
      [[ "$line" =~ ^[[:space:]]*-[[:space:]]*\[x\] ]] && continue
      trimmed="${line#"${line%%[![:space:]]*}"}"
      snaps+=("$trimmed")
    done <"$MANUAL_TODO_FILE"
    if (( ${#snaps[@]} > 0 )); then
      manual_json="$(printf '%s\n' "${snaps[@]}" | jq -R . | jq -s .)"
    fi
  fi

  local allow_json="[]"
  if (( ${#allow_dirty[@]} > 0 )); then
    allow_json="$(printf '%s\n' "${allow_dirty[@]}" | jq -R . | jq -s .)"
  fi

  local notes_joined="" i
  if (( ${#notes[@]} > 0 )); then
    for ((i=0; i<${#notes[@]}; i++)); do
      if (( i == 0 )); then
        notes_joined="${notes[$i]}"
      else
        notes_joined="${notes_joined}"$'\n'"${notes[$i]}"
      fi
    done
  fi

  mkdir -p "$(dirname "$packet")"
  local tmp="$packet.tmp"
  jq -n \
    --arg phase "$phase" \
    --arg step "$step" \
    --arg title "$title" \
    --arg approved_at "$approved_at" \
    --arg approved_by "$approved_by" \
    --arg git_head "$git_head" \
    --arg todo_hash "$todo_hash" \
    --argjson ttl "$ttl" \
    --argjson allow "$allow_json" \
    --argjson manual "$manual_json" \
    --arg notes "$notes_joined" \
    '{
      step_identity: { phase: $phase, step: $step, title: $title },
      approved_at: $approved_at,
      git_head: $git_head,
      todo_hash: $todo_hash,
      ttl_seconds: $ttl,
      lifecycle: "draft",
      allowed_dirty_paths: $allow,
      blocking_manual_tasks: $manual
    }
    + (if $approved_by == "" then {} else {approved_by: $approved_by} end)
    + (if $notes == "" then {} else {notes: $notes} end)' >"$tmp"
  mv "$tmp" "$packet"
  echo "ok: draft written to $packet"
}

cmd_approve() {
  local packet="$DEFAULT_PACKET"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --packet) packet="$2"; shift 2 ;;
      *) die "Unknown arg to approve: $1" ;;
    esac
  done
  [[ -f "$packet" ]] || die "no packet at $packet"
  require_jq_write

  local lifecycle
  lifecycle="$(jq -r '.lifecycle' "$packet")"
  [[ "$lifecycle" == "draft" ]] || die "cannot approve: lifecycle=$lifecycle (must be 'draft')"

  local expected_head actual_head expected_hash actual_hash
  expected_head="$(jq -r '.git_head' "$packet")"
  actual_head="$(git -C "$PROJECT_ROOT" rev-parse HEAD 2>/dev/null)" || die "not a git repo at $PROJECT_ROOT"
  if [[ "$expected_head" != "$actual_head" ]]; then
    fail "drift: git HEAD moved since draft ($expected_head -> $actual_head). Re-draft required."
  fi
  expected_hash="$(jq -r '.todo_hash' "$packet")"
  actual_hash="$(todo_hash_of "$TODO_FILE")"
  if [[ "$expected_hash" != "$actual_hash" ]]; then
    fail "drift: tasks/todo.md hash changed since draft. Re-draft required."
  fi

  local approved_at tmp
  approved_at="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
  tmp="$packet.tmp"
  jq --arg ts "$approved_at" '.lifecycle = "approved" | .approved_at = $ts' "$packet" >"$tmp"
  mv "$tmp" "$packet"
  echo "ok: approved at $approved_at"
}

cmd_supersede() {
  local packet="$DEFAULT_PACKET"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --packet) packet="$2"; shift 2 ;;
      *) die "Unknown arg to supersede: $1" ;;
    esac
  done
  [[ -f "$packet" ]] || die "no packet at $packet"
  require_jq_write

  local lifecycle
  lifecycle="$(jq -r '.lifecycle' "$packet")"
  case "$lifecycle" in
    consumed|stale|superseded)
      die "cannot supersede: lifecycle=$lifecycle (already terminal)"
      ;;
    draft|approved|uncertain) ;;
    *)
      die "cannot supersede: lifecycle=${lifecycle:-<missing>}"
      ;;
  esac

  local tmp="$packet.tmp"
  jq '.lifecycle = "superseded"' "$packet" >"$tmp"
  mv "$tmp" "$packet"
  echo "ok: superseded"
}

cmd_status() {
  local packet="$DEFAULT_PACKET"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --packet) packet="$2"; shift 2 ;;
      *) die "Unknown arg to status: $1" ;;
    esac
  done
  if [[ ! -f "$packet" ]]; then
    echo "absent: no packet at $packet"
    return 0
  fi

  if command -v jq >/dev/null 2>&1; then
    local lifecycle phase step title approved_at
    lifecycle="$(jq -r '.lifecycle // "?"' "$packet")"
    phase="$(jq -r '.step_identity.phase // "?"' "$packet")"
    step="$(jq -r '.step_identity.step // "?"' "$packet")"
    title="$(jq -r '.step_identity.title // "?"' "$packet")"
    approved_at="$(jq -r '.approved_at // "?"' "$packet")"
    echo "$lifecycle: $phase / $step — $title (approved_at=$approved_at)"
  else
    local lifecycle
    lifecycle="$(json_read "$packet" '.lifecycle')"
    echo "${lifecycle:-unknown}"
  fi
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

  local lifecycle
  lifecycle="$(jq -r '.lifecycle' "$packet")"
  case "$lifecycle" in
    approved) ;;
    draft|consumed|stale|superseded|uncertain)
      fail "cannot mark-stale: lifecycle=$lifecycle (only 'approved' may transition to 'stale')"
      ;;
    *)
      fail "cannot mark-stale: lifecycle=${lifecycle:-<missing>}"
      ;;
  esac

  local tmp="$packet.tmp"
  jq '.lifecycle = "stale"' "$packet" >"$tmp"
  mv "$tmp" "$packet"
  echo "ok"
}

cmd_mark_uncertain() {
  local packet="$DEFAULT_PACKET"
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --packet) packet="$2"; shift 2 ;;
      *) die "Unknown arg to mark-uncertain: $1" ;;
    esac
  done

  [[ -f "$packet" ]] || die "no packet at $packet"
  require_jq_write

  local lifecycle
  lifecycle="$(jq -r '.lifecycle' "$packet")"
  case "$lifecycle" in
    approved) ;;
    draft|consumed|stale|superseded|uncertain)
      fail "cannot mark-uncertain: lifecycle=$lifecycle (only 'approved' may transition to 'uncertain')"
      ;;
    *)
      fail "cannot mark-uncertain: lifecycle=${lifecycle:-<missing>}"
      ;;
  esac

  local tmp="$packet.tmp"
  jq '.lifecycle = "uncertain"' "$packet" >"$tmp"
  mv "$tmp" "$packet"
  echo "ok"
}

usage() {
  cat >&2 <<'EOF'
Usage: approved-plan.sh <sub> [args...] [--packet <path>]

Consumer (Codex-side):
  check        Run all six freshness checks on the packet.
               Prints 'ok' + exit 0 when fresh, or a single-line
               failure reason + non-zero exit.
  consume      Atomically transition approved -> consumed and
               write tasks/approved-plan.md mirror. Idempotent.
  mark-stale   Atomically transition approved -> stale.
  mark-uncertain
               Atomically transition approved -> uncertain. Used by
               /delegate when Codex may have started mutating state
               but the outcome is ambiguous. Rejects non-approved
               source states.

Producer (Claude-side):
  draft        Assemble a candidate packet from current repo state
               with lifecycle=draft. Required flags:
                 --phase "Phase N" --step "Step N.X" --title "…"
               Optional: --approved-by <id>, --ttl <seconds> (3600),
               repeatable --allow-dirty <glob>, repeatable --note <text>.
               Refuses to overwrite an existing approved packet.
  approve      Atomic draft -> approved. Re-verifies git_head and
               todo_hash still match the draft; refreshes approved_at.
  supersede    Atomic non-terminal -> superseded so a new draft can
               intentionally replace an older approved packet.
  status       Print lifecycle + one-line summary of the current packet.

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
  mark-uncertain) cmd_mark_uncertain "$@" ;;
  draft) cmd_draft "$@" ;;
  approve) cmd_approve "$@" ;;
  supersede) cmd_supersede "$@" ;;
  status) cmd_status "$@" ;;
  -h|--help|help) usage ;;
  *) usage ;;
esac
