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

Cross-CLI execution in `hybrid` and cross-session handoff in `claude-only` or `codex-only` will be mediated by a shared approval packet: `.agents/approved-plan.json` as the machine-readable source of truth, with `tasks/approved-plan.md` as a sanitized human-readable mirror. The packet has an explicit lifecycle (`draft` → `approved` → `consumed` | `stale` | `superseded` | `uncertain`) so that `$run --execute-approved`, `/handoff --target=codex`, and `/delegate` share one "approved work" definition rather than each inventing their own. Field-level schema and lifecycle detail land in Step 3; this file will point at them once shipped.

## Out of Scope for This Document Today

- `$continue` / `$resume-work` router on Codex
- Additional `$run` flags (`--plan-only`, `--docs-only`, `--no-ship`)
- Removing shipping skills from Claude
- Reverse delegation (Codex → Claude)

These are deliberately excluded from the Phase 11 scope, not deferred to a later step of it.

---

Status: Phase 11 Step 1 — thin doc; expansions tracked in `tasks/todo.md`.
