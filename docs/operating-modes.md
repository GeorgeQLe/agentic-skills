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

## Degraded-path audit

This section enumerates every cross-tool touchpoint that ships today. One row per (skill, assumption) pair. **Assumes** names one of `claude-only` / `codex-only` / `hybrid` / `any`. **Degraded path** either cites the SKILL.md section that implements the escape hatch, or an explicit `requires mode X` constraint, or flags `⚠ gap — follow-up` when neither ships. Gaps are logged under `### Gaps surfaced by Step 8`; closing them is not in Step 8's scope.

| Skill | Assumes | Fails how if unavailable | Degraded path |
| --- | --- | --- | --- |
| `global/claude/delegate/SKILL.md` | `hybrid` mode | Exits non-zero with `mode-mismatch:` naming resolved mode; packet untouched | § "Mode requirement" + § "Process" step 1 — `requires mode hybrid` by design |
| `global/claude/delegate/SKILL.md` | `hybrid`; `codex` binary on PATH | Start marker never prints; enters pre-start-failure branch | § "Process" step 6 pre-start-failure branch: offer inline Claude execution or keep packet `approved`; `--inline-fallback` auto-selects inline |
| `global/claude/delegate/SKILL.md` | `hybrid`; Codex exec completes cleanly | Non-zero exit or timeout after start marker → transport ambiguous | § "Process" step 6 ambiguous branch: `mark-uncertain` + inspect/discard/continue prompt; never blind-retries |
| `global/claude/handoff/SKILL.md` | `--target=codex`: mode ≠ `codex-only` | Step 5.1 aborts with `mode-mismatch:` — Claude is not the planner in `codex-only` | § "Process" step 5.1 — `requires mode claude-only or hybrid` |
| `global/claude/handoff/SKILL.md` | `--target=codex`: `jq` on PATH for pretty-print (step 5.5) | Pretty-print call fails; no documented fallback | ⚠ gap — follow-up |
| `global/codex/run/SKILL.md` | `--execute-approved`: mode ≠ `claude-only` | `scripts/approved-plan.sh check` prints `mode-mismatch` reason; skill stops with user error | § "Process" step 6c + § "Constraints" — `requires mode codex-only or hybrid` |
| `global/codex/run/SKILL.md` | `--execute-approved`: `jq` on PATH for consume write path | Consume write fails; no documented fallback | ⚠ gap — follow-up (dependency declared in § "Constraints"; no degraded path) |
| `global/claude/plan-interview/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Unset mode leaves next-step recommendation ambiguous | § "Mode-aware next-step recommendation" unset branch presents all three options + `docs/operating-modes.md` pointer |
| `global/claude/roadmap/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Unset mode leaves next-step recommendation ambiguous | § "Mode-aware next-step recommendation" unset branch presents all three options + docs pointer |
| `global/claude/plan-phase/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Unset mode leaves `/delegate $run` vs `/run` vs `$run` ambiguous | § "Mode-aware next-step recommendation" unset branch presents all three options + docs pointer |
| `global/claude/run/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Unset mode leaves ship-variant recommendation ambiguous | § "Mode-aware next-step recommendation" unset branch presents all three options + docs pointer |
| `global/claude/ship/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Unset mode leaves next-step invocation ambiguous | § "Mode-aware next-step recommendation" unset branch presents all three options + docs pointer |
| `global/claude/ship-end/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Unset mode leaves next-session resume ambiguous | § "Mode-aware next-step recommendation" unset branch presents all three options + docs pointer |
| `global/codex/plan-interview/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Unset mode leaves return-to-Claude vs stay-in-Codex ambiguous | § "Mode-aware next-step recommendation" unset branch presents all three options + docs pointer |
| `global/codex/roadmap/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Unset mode leaves next-step recommendation ambiguous | § "Mode-aware next-step recommendation" unset branch presents all three options + docs pointer |
| `global/codex/plan-phase/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Unset mode leaves return-to-Claude vs `$run` ambiguous | § "Mode-aware next-step recommendation" unset branch presents all three options + docs pointer |
| `global/codex/run/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` (recommendation block, distinct from `--execute-approved` rows above) | Unset mode leaves next-step recommendation ambiguous | § "Mode-aware next-step recommendation" unset branch presents all three options + docs pointer |
| `global/codex/ship/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Unset mode leaves return-to-Claude vs stay-in-Codex ambiguous | § "Mode-aware next-step recommendation" unset branch presents all three options + docs pointer |
| `global/codex/ship-end/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Unset mode leaves next-session resume ambiguous | § "Mode-aware next-step recommendation" unset branch presents all three options + docs pointer |

Pack wrappers under `packs/**/SKILL.md` are intentionally absent from this audit: exploration confirmed they contain no cross-CLI branching — only intra-pack syntax references (`$skill` vs `/skill`) routed by the pack loader. Pack emphasis by CLI role lands in Step 9.

### Gaps surfaced by Step 8

Each gap below is logged for a follow-up step to close; Step 8 does not fix them.

- `global/claude/handoff/SKILL.md` `--target=codex` — `jq` is used for pretty-printing the drafted packet at step 5.5, but the skill does not document a degraded path when `jq` is absent. Missing: either declare `jq` as a hard dependency in § "Process" or fall back to a `jq`-free pretty-printer / raw JSON dump.
- `global/codex/run/SKILL.md` `--execute-approved` — `jq` is declared as a hard dependency for the consume write path in § "Constraints", but no degraded path is documented when it is missing. Missing: either a clean user-facing failure reason in § "Process" step 6c, or a `jq`-free consume fallback.

## Pack emphasis

This section tags every global skill and every pack with a **primary CLI role** — `Claude-orchestration` (framing, interviews, strategy, research synthesis, tradeoff surfacing), `Codex-execution` (implementation, reconciliation, validation, repo mutation, shipping), or `Both` (genuinely spans). Role tagging is additive and advisory: parity-mirror skills still exist under both `global/claude/` and `global/codex/`, and the tag names the *intended* emphasis, not a restriction. Kanban pack variants inherit from their base pack unless noted. This is the one authoritative table — pack-level docs reference it rather than duplicate.

### Global skills

| Skill | Primary role | Notes |
| --- | --- | --- |
| `affected` | Claude-orchestration | Monorepo scope framing for planning; read-only |
| `analyze-sessions` | Claude-orchestration | Usage analysis + automation recommendations |
| `brainstorm` | Claude-orchestration | Idea surfacing into `/plan-interview` |
| `branch-lifecycle` | Both | Evaluation is orchestration; merge/delete acts execute |
| `commit-and-push-by-feature` | Codex-execution | Grouped commits + push |
| `dead-code` | Claude-orchestration | Scan + report; no mutation |
| `debug` | Claude-orchestration | Investigate, log to changelog, propose fix |
| `decommission` | Codex-execution | Tear down services/packages |
| `delegate` | Claude-orchestration | Claude-only transport; the delegation mechanism itself |
| `deploy` | Codex-execution | Target-environment deploy + history |
| `expert-review` | Claude-orchestration | Panel-style review, read-only synthesis |
| `guide` | Claude-orchestration | GUI-blocker walk-throughs |
| `handoff` | Both | Context snapshot (orchestration); `--target=codex` produces approval packet (cross-CLI) |
| `hygiene` | Both | Audit (orchestration) + optional auto-fix (execution) |
| `install-workflow-orchestration` | Codex-execution | Writes CLAUDE.md / AGENTS.md |
| `investigate` | Claude-orchestration | Validate claims, trace to root cause, propose fix |
| `migrate` | Both | Plan + step-by-step verified mutation |
| `pack` | Both | Manages pack state; orchestrates which skills live per project |
| `plan-interview` | Claude-orchestration | Spec completion via interview |
| `plan-phase` | Claude-orchestration | Decompose roadmap phase into steps |
| `reconcile-dev-docs` | Codex-execution | Rewrites task docs to match reality |
| `regression-check` | Codex-execution | Monorepo health check after changes |
| `release` | Codex-execution | Version bump, tag, changelog |
| `research-roadmap` | Claude-orchestration | Documentation queue maintenance |
| `roadmap` | Claude-orchestration | Task pipeline + priority queue |
| `run` | Both | Plans next step (orchestration) and executes on approval (execution) |
| `scaffold` | Codex-execution | Generate package/app |
| `ship` | Codex-execution | Update docs, commit, push, deploy |
| `ship-end` | Codex-execution | End-of-session wrap: docs, commit, push |
| `skills` | Claude-orchestration | Browse/search the skill catalog |
| `slim-audit` | Claude-orchestration | LOC-reduction audit; read-only |
| `spec-drift` | Claude-orchestration | Specs ↔ code audit; read-only |
| `sync` | Codex-execution | `git pull` + status |
| `trace` | Claude-orchestration | Request end-to-end trace through stack |

### Packs

| Pack | Primary role | Notes |
| --- | --- | --- |
| `business-app` | Claude-orchestration | Strategy, ICP, GTM, positioning, metrics, retro — framing/research skills |
| `business-app-kanban` | Both | Inherits `business-app` (orchestration) + adds kanban `run`/`ship`/`ship-end` variants (execution) |
| `code-quality` | Codex-execution | `extract-shared-types`, `quality-sweep` — behavior-preserving refactor mutation |
| `devtool` | Claude-orchestration | Adoption, docs audit, DX journey, positioning, workflow — framing skills |
| `devtool-kanban` | Both | Inherits `devtool` (orchestration) + kanban `run`/`ship`/`ship-end` variants (execution) |
| `game` | Claude-orchestration | Audience, core loop, fantasy, launch, playtest metrics — framing/research skills |
| `game-kanban` | Both | Inherits `game` (orchestration) + kanban `run`/`ship`/`ship-end` variants (execution) |
| `poketowork-kanban` | Both | Kanban orchestration skills + `run`/`ship`/`ship-end` execution variants; no base pack to inherit from |

### Codex `$run` routing

Codex `$run` consumes this table at runtime. The "Mode-aware next-step recommendation" block in `global/codex/run/SKILL.md` resolves enabled packs via `scripts/pack.sh list-packs` and, when an enabled pack (e.g., `business-app-kanban`) ships a matching `-kanban` variant, emits the kanban invocation in place of the global `$run` / `$ship` / `$ship-end`. Recommendation text only — the approval-packet contract and `$run --execute-approved` execution path are unchanged. Missing or malformed `.agents/project.json` falls back silently to the global default with a single-line inline comment. See `global/codex/run/SKILL.md` § "Pack-aware routing" for the full resolver.

---

Status: Phase 11 Step 1 — thin doc; expansions tracked in `tasks/todo.md`. Degraded-path audit filled in Step 8. Pack emphasis table filled in Step 9. Codex `$run` pack-aware routing wired in Step 10.
