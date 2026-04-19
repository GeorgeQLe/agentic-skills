# Operating Modes

This document names the three-mode operating model for the agentic-skills workflow: `claude-only`, `codex-only`, and `hybrid`. It is the forward-reference placeholder for the model, not yet an authoritative reference — that expansion is tracked as Step 11 in `tasks/todo.md`. The stance is plural by default: each mode must be end-to-end complete, and no mode is privileged over the others until the user declares one.

## Three Modes

| Mode | When | Orchestrator | Executor |
| --- | --- | --- | --- |
| `claude-only` | Codex unavailable | Claude | Claude |
| `codex-only` | Claude unavailable | Codex | Codex |
| `hybrid` | Both available | Claude | Codex via `/delegate` |

### `claude-only`

Claude both plans and executes. Used when Codex is unavailable — no subscription, rate-limited, outage, or not installed locally. The execution loop is `/run` → `/ship` → `/ship-end`, all in Claude Code.

### `codex-only`

Codex both plans and executes. Used when Claude is unavailable for the same class of reasons. The execution loop is `$run` → `$ship` → `$ship-end`, all in a Codex session.

### `hybrid`

Claude orchestrates — interviews, planning, framing, tradeoff surfacing — and Codex executes — implementation, reconciliation, shipping — via in-session delegation. The execution loop is `/plan-interview` → `/run` plans → `/delegate $run` → `$ship`. The delegation boundary is handled inside the Claude session; the user does not manually switch CLIs.

## Mode Signal

The mode-signal surface is `.agents/project.json.agent_mode` (project-scoped, optional) plus a `SKILLS_AGENT_MODE` environment variable override. Resolution precedence is env > project.json > unset, where "unset" means skills recommend all paths and let the user pick.

Usage:

- Field: `agent_mode` in `.agents/project.json`, values `"claude-only" | "codex-only" | "hybrid"`, absent = unset.
- Env var: `SKILLS_AGENT_MODE=<mode>` overrides the project.json value for the current shell.
- Writer: `scripts/pack.sh set-mode <claude-only|codex-only|hybrid|unset>` sets or clears the field. `install`, `remove`, and `refresh` preserve an existing value.
- Resolver: `scripts/agent-mode.sh` prints the effective mode on stdout (empty when unset), exits non-zero on invalid values from either source.

No skill consumes the signal yet — mode-aware recommendations land in Step 7 of Phase 11.

## Approval / Delegation Packet

Cross-CLI execution in `hybrid` and cross-session handoff in `claude-only` or `codex-only` is mediated by a shared approval packet: `.agents/approved-plan.json` is the machine-readable source of truth (gitignored, developer-local), and `tasks/approved-plan.md` is a sanitized human-readable mirror (committed). `$run --execute-approved`, `/handoff --target=codex`, and `/delegate` all consume this one contract rather than each inventing their own "approved work" definition.

No skill reads or writes the packet yet — Step 4 (`$run --execute-approved`) is the first legitimate consumer. The JSON Schema lives at `specs/approved-plan.schema.json` (draft-07).

### Schema

| Field | Type | Required | `.md`-safe |
| --- | --- | --- | --- |
| `step_identity` (`phase`, `step`, `title`) | object | yes | yes |
| `approved_at` | ISO-8601 UTC string (ends in `Z`) | yes | yes |
| `approved_by` | free-form identity string | no | yes |
| `git_head` | full 40-char commit SHA | yes | yes (public repo) |
| `todo_hash` | sha256 of normalized `tasks/todo.md` | yes | yes (hash only) |
| `allowed_dirty_paths` | array of globs | no | **no** (path layout) |
| `blocking_manual_tasks` | array of snapshot strings | no | yes (content snapshot, not file refs) |
| `ttl_seconds` | positive integer | yes | yes |
| `lifecycle` | enum (see below) | yes | yes |
| `notes` | free-form string | no | **no** (free-form) |

`todo_hash` normalization (defined once here so consumers cannot redefine it): strip a leading UTF-8 BOM if present, normalize CRLF → LF, then sha256 the resulting bytes.

`blocking_manual_tasks` snapshots the **content** of each `_(blocks: Step N.X)_` line from `tasks/manual-todo.md` at approval time, not path references — a path-only snapshot would silently drift when the file is edited post-approval.

### Lifecycle

`draft → approved → (consumed | stale | superseded | uncertain)`

- `draft` — packet assembled but not yet approved.
- `approved` — the **only** executable state. A consumer may act on the packet iff lifecycle is `approved` and all freshness checks pass.
- `consumed` — terminal success. A consumer executed against this packet.
- `stale` — terminal. A freshness check failed (git HEAD moved, `todo_hash` changed, unexpected dirty paths, new blocking manual task, TTL expired).
- `superseded` — terminal. A newer packet replaced this one before consumption.
- `uncertain` — terminal. Transport ambiguity during `/delegate` (Codex may or may not have started). Requires inspect / discard / continue — never blind retry.

`approved` is the only state from which work may execute. `consumed`, `stale`, `superseded`, and `uncertain` are all terminal and require a fresh `draft → approved` cycle to restart. There is no `consumed → approved` transition — allowing it would mask re-execution bugs.

Consumers only transition away from `approved` (→ `consumed` on success, → `stale` on failed freshness check, → `uncertain` on `/delegate` transport ambiguity). Producers own `draft → approved` and `* → superseded`.

### Safety classification

The `.md` mirror (`tasks/approved-plan.md`) projects only fields marked `.md`-safe in the schema table. Default-safe: `step_identity`, `approved_at`, `approved_by`, `ttl_seconds`, `lifecycle`, `blocking_manual_tasks`. Borderline-safe but mirrored here (hashes and public-repo SHAs are low-risk): `git_head`, `todo_hash`. JSON-only: `allowed_dirty_paths` (leaks repo path layout), `notes` (free-form, may contain context not intended for the committed mirror).

Never mirror packet fields into `.agents/project.json` — that file is shared across collaborators, while the packet is per-developer approval state.

### Freshness checks (named here, implemented in Step 4)

A consumer may act on the packet iff all of the following hold:

1. `lifecycle == "approved"`.
2. Current `git rev-parse HEAD` equals `git_head`.
3. sha256 of `tasks/todo.md` (using the normalization above) equals `todo_hash`.
4. Working tree clean, OR dirty paths are all matched by `allowed_dirty_paths`.
5. No new `_(blocks: Step N.X)_` entries in `tasks/manual-todo.md` beyond `blocking_manual_tasks`.
6. `now - approved_at < ttl_seconds`.

On any failure the consumer transitions the packet to `stale` and re-prompts with a diff. Implementation lands in Step 4.

## Out of Scope for This Document Today

- `$continue` / `$resume-work` router on Codex
- Additional `$run` flags (`--plan-only`, `--docs-only`, `--no-ship`)
- Removing shipping skills from Claude
- Reverse delegation (Codex → Claude)

These are deliberately excluded from the Phase 11 scope, not deferred to a later step of it.

---

Status: Phase 11 Step 1 — thin doc; expansions tracked in `tasks/todo.md`.
