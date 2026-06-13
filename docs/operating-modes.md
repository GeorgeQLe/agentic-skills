# Operating Modes

This document is the authoritative reference for the three-mode operating model that drives the agentic-skills workflow: `claude-only`, `codex-only`, and `hybrid`. The stance is plural by default: each mode must be end-to-end complete, and no mode is privileged over the others until the user declares one. A newcomer can read this document top-to-bottom to understand how modes are signalled, how cross-CLI work is approved and executed, where each shipped skill degrades, how packs emphasize CLI roles, and how to migrate a pre-Phase-11 project onto the new model.

## Three Modes

| Mode | When | Orchestrator | Executor |
| --- | --- | --- | --- |
| `claude-only` | Codex unavailable | Claude | Claude |
| `codex-only` | Claude unavailable | Codex | Codex |
| `hybrid` | Both available | Claude | Codex via `/delegate` |

### `claude-only`

Claude both plans and executes. Used when Codex is unavailable — no subscription, rate-limited, outage, or not installed locally. The execution loop is `/exec` → `/ship` → `/ship-end`, all in Claude Code.

### `codex-only`

Codex both plans and executes. Used when Claude is unavailable for the same class of reasons. The execution loop is `$exec` → `$ship` → `$ship-end`, all in a Codex session.

### `hybrid`

Claude orchestrates — interviews, planning, framing, tradeoff surfacing — and Codex executes — implementation, reconciliation, shipping — via in-session delegation. The execution loop is `/spec-interview` → `/exec` plans → `/delegate $exec` → `$ship`. The delegation boundary is handled inside the Claude session; the user does not manually switch CLIs.

## Mode-signal resolution

Two sources combine to resolve the effective mode: the `SKILLS_AGENT_MODE` environment variable (shell-scoped override) and the `agent_mode` field in `.agents/project.json` (project-scoped, committed optionally, usually developer-local). The resolver `scripts/agent-mode.sh` (function `validate_agent_mode` + top-level env/file check) is the single source of truth for precedence and validation; skills and pack wrappers defer to it rather than reimplementing the lookup.

**Precedence.** `SKILLS_AGENT_MODE` env > `.agents/project.json.agent_mode` > unset. The resolver prints the effective mode on stdout (empty string when unset) and exits non-zero if either source holds an invalid value.

**Valid values.** `claude-only`, `codex-only`, `hybrid`. Any other non-empty value is a hard error — the resolver refuses to fall through to the next source.

**Truth table.**

| `SKILLS_AGENT_MODE` | `.agents/project.json.agent_mode` | Resolved |
| --- | --- | --- |
| (unset) | (absent or `null`) | unset (empty stdout, exit 0) |
| (unset) | `claude-only` \| `codex-only` \| `hybrid` | that value |
| (unset) | invalid | non-zero exit, error on stderr |
| `claude-only` \| `codex-only` \| `hybrid` | (any) | env value wins |
| invalid | (any) | non-zero exit, error on stderr |

**Writer.** `scripts/pack.sh set-mode <claude-only|codex-only|hybrid|unset>` is the only supported writer for `.agents/project.json.agent_mode`. `pack.sh install`, `remove`, and `refresh` preserve an existing value. No other script writes the field.

**Skill-update mode.** `.agents/project.json.skill_updates.mode` (`warn` default | `auto`) controls whether a drift *trigger* (the opt-in session-start hook, or sync-with-approval) refreshes stale installs automatically or only warns. Its only supported writer is `scripts/pack.sh set-update-mode <warn|auto|unset>`; `install`, `remove`, and `refresh` preserve an existing value. The machine-wide equivalent is `~/.agentic-skills/preferences.json` `skills.auto_refresh`. Drift itself is detected from the `.agentic-skills-managed` marker's `source_sha` (track-latest) and surfaced read-only by `scripts/pack.sh doctor` and `scripts/init-agentic-skills.sh doctor`; pinned (symlinked) installs are frozen and never stale. See `docs/packs.md` for the full model.

**Unset semantics.** "Unset" is a deliberate mode: skills that consume the resolver (Step 7 — the twelve planning/execution skills in `base/claude/` and `base/codex/`) keep the concrete next work item primary and infer the command route from invocation and task type when mode lookup is missing, unset, or non-zero. Unset is the default for a fresh project.

**Invariant — do not restate precedence in skill copy.** Skills say "Next-Step Routing" and link here. Precedence lives in one place: the resolver and this document.

## Approval packet

Cross-CLI execution in `hybrid`, and cross-session handoff from `claude-only` or `hybrid` into a later Codex session, is mediated by a shared approval packet. `.agents/approved-plan.json` is the machine-readable source of truth (gitignored, developer-local). `tasks/approved-plan.md` is the sanitized human-readable mirror (committed). `$exec --execute-approved`, `/handoff --target=codex`, and `/delegate` all consume this one contract rather than inventing their own "approved work" definition.

### Fields

The authoritative field reference is `specs/approved-plan.schema.json` (JSON Schema draft-07). Rather than duplicate the schema here (drift risk), the table below summarizes by category:

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
| `lifecycle` | enum (see § Lifecycle) | yes | yes |
| `notes` | free-form string | no | **no** (free-form) |

For exact types, regex patterns, and validator rules, read the schema file directly — it is the contract.

**`todo_hash` normalization** (defined once here so consumers cannot redefine it): strip a leading UTF-8 BOM if present, normalize CRLF → LF, then sha256 the resulting bytes.

**`blocking_manual_tasks` snapshot rule.** Snapshots the **content** of each `_(blocks: Step N.X)_` line from `tasks/manual-todo.md` at approval time, not path references — a path-only snapshot would silently drift when the file is edited post-approval.

### Lifecycle

```
            draft ──approve──▶ approved ──consume───▶ consumed  (terminal)
              │                   │
              │                   ├─mark-stale──────▶ stale      (terminal)
              │                   │
              │                   ├─supersede───────▶ superseded (terminal)
              │                   │
              │                   └─mark-uncertain──▶ uncertain  (terminal)
              │
              └──supersede────────────────────────────▶ superseded
```

| Transition | Writer (`scripts/approved-plan.sh`) | Actor |
| --- | --- | --- |
| `* → draft` (initial write) | `draft` | Producer (Claude-side `/handoff --target=codex`, `/delegate`) |
| `draft → approved` | `approve` | Producer, after user approval |
| `approved → consumed` | `consume` | Consumer (`$exec --execute-approved`) on success |
| `approved → stale` | `mark-stale` (via `check` on failed freshness) | Consumer |
| `approved → uncertain` | `mark-uncertain` | Consumer (`/delegate` transport ambiguity) |
| `draft → superseded` / `approved → superseded` | `supersede` | Producer, discarding a prior packet |

Only `approved` is executable; a consumer may act on the packet iff lifecycle is `approved` and all freshness checks pass. `consumed`, `stale`, `superseded`, and `uncertain` are terminal — restarting requires a fresh `draft → approved` cycle. There is no `consumed → approved` transition — allowing it would mask re-execution bugs. `uncertain` exists specifically for `/delegate` transport ambiguity (Codex may or may not have started); it requires explicit inspect / discard (`supersede`) / continue-inline resolution, never blind retry.

### Safety classification

The `.md` mirror (`tasks/approved-plan.md`) projects only fields marked `.md`-safe in the Fields table. Projection is enforced by `consume`, which rewrites the mirror on every lifecycle transition — developers cannot accidentally widen the projection by hand-editing.

- **Default-safe** (always mirrored): `step_identity`, `approved_at`, `approved_by`, `ttl_seconds`, `lifecycle`, `blocking_manual_tasks`.
- **Borderline-safe but mirrored** (hashes and public-repo SHAs are low-risk): `git_head`, `todo_hash`.
- **JSON-only** (never mirrored): `allowed_dirty_paths` (leaks repo path layout), `notes` (free-form, may contain context not intended for the committed mirror).

Never mirror packet fields into `.agents/project.json` — that file is shared across collaborators, while the packet is per-developer approval state.

### Freshness checks

`scripts/approved-plan.sh check` applies the following six checks, cheapest-first. A consumer may act on the packet iff all pass.

1. `lifecycle == "approved"`.
2. Current `git rev-parse HEAD` equals `git_head`.
3. sha256 of `tasks/todo.md` (using the normalization above) equals `todo_hash`.
4. Working tree clean, OR dirty paths are all matched by `allowed_dirty_paths`.
5. No new `_(blocks: Step N.X)_` entries in `tasks/manual-todo.md` beyond `blocking_manual_tasks`.
6. `now - approved_at < ttl_seconds`.

On any failure the consumer transitions the packet to `stale` and re-prompts with a diff.

## Out of Scope for This Document Today

- `$continue` / `$resume-work` router on Codex
- Additional `$exec` flags (`--plan-only`, `--docs-only`, `--no-ship`)
- Removing shipping skills from Claude
- Reverse delegation (Codex → Claude)

These are deliberately excluded from the Phase 11 scope, not deferred to a later step of it.

## Degraded-path audit

This section enumerates every cross-tool touchpoint that ships today. One row per (skill, assumption) pair. **Assumes** names one of `claude-only` / `codex-only` / `hybrid` / `any`. **Degraded path** either cites the SKILL.md section that implements the escape hatch, or an explicit `requires mode X` constraint, or flags `⚠ gap — follow-up` when neither ships. Gaps are logged under `### Gaps surfaced by Step 8`; closing them is not in Step 8's scope.

| Skill | Assumes | Fails how if unavailable | Degraded path |
| --- | --- | --- | --- |
| `base/claude/delegate/SKILL.md` | `hybrid` mode | Exits non-zero with `mode-mismatch:` naming resolved mode; packet untouched | § "Mode requirement" + § "Process" step 1 — `requires mode hybrid` by design |
| `base/claude/delegate/SKILL.md` | `hybrid`; `codex` binary on PATH | Start marker never prints; enters pre-start-failure branch | § "Process" step 6 pre-start-failure branch: offer inline Claude execution or keep packet `approved`; `--inline-fallback` auto-selects inline |
| `base/claude/delegate/SKILL.md` | `hybrid`; Codex exec completes cleanly | Non-zero exit or timeout after start marker → transport ambiguous | § "Process" step 6 ambiguous branch: `mark-uncertain` + inspect/discard/continue prompt; never blind-retries |
| `base/claude/handoff/SKILL.md` | `--target=codex`: mode ≠ `codex-only` | Step 5.1 aborts with `mode-mismatch:` — Claude is not the planner in `codex-only` | § "Process" step 5.1 — `requires mode claude-only or hybrid` |
| `base/claude/handoff/SKILL.md` | `--target=codex`: `jq` on PATH for pretty-print (step 5.5) | `scripts/approved-plan.sh draft` dies first via `require_jq_write` with the install-hint error; packet is never drafted | § "Process" step 5 preamble — `jq` declared a hard dependency; failure text cited |
| `base/codex/exec/SKILL.md` | `--execute-approved`: mode ≠ `claude-only` | `scripts/approved-plan.sh check` prints `mode-mismatch` reason; skill stops with user error | § "Process" step 6c + § "Constraints" — `requires mode codex-only or hybrid` |
| `base/codex/exec/SKILL.md` | `--execute-approved`: `jq` on PATH for consume write path | `scripts/approved-plan.sh consume` dies via `require_jq_write` with `ERROR: jq required for write operations. Install with: brew install jq …` | § "Process" step 6c + § "Constraints" — `jq` declared a hard dependency; failure text cited |
| `base/claude/spec-interview/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Mode lookup missing, unset, or non-zero degrades to inferred command text | § "Next-Step Routing" infers from invocation and task type |
| `base/claude/roadmap/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Mode lookup missing, unset, or non-zero degrades to inferred command text | § "Next-Step Routing" infers from invocation and task type |
| `base/claude/plan-phase/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Mode lookup missing, unset, or non-zero degrades to inferred command text | § "Next-Step Routing" infers from invocation and task type |
| `base/claude/exec/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Mode lookup missing, unset, or non-zero degrades to inferred command text | § "Next-Step Routing" infers from invocation and task type |
| `base/claude/ship/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Mode lookup missing, unset, or non-zero degrades to inferred command text | § "Next-Step Routing" infers from invocation and task type |
| `base/claude/ship-end/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Mode lookup missing, unset, or non-zero degrades to inferred command text | § "Next-Step Routing" infers from invocation and task type |
| `base/codex/spec-interview/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Mode lookup missing, unset, or non-zero degrades to inferred command text | § "Next-Step Routing" infers from invocation and task type |
| `base/codex/roadmap/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Mode lookup missing, unset, or non-zero degrades to inferred command text | § "Next-Step Routing" infers from invocation and task type |
| `base/codex/plan-phase/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Mode lookup missing, unset, or non-zero degrades to inferred command text | § "Next-Step Routing" infers from invocation and task type |
| `base/codex/exec/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` (Next-Step Routing block, distinct from `--execute-approved` rows above) | Mode lookup missing, unset, or non-zero degrades to inferred command text | § "Next-Step Routing" infers from invocation and task type |
| `base/codex/ship/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Mode lookup missing, unset, or non-zero degrades to inferred command text | § "Next-Step Routing" infers from invocation and task type |
| `base/codex/ship-end/SKILL.md` | `any` mode resolved via `scripts/agent-mode.sh` | Mode lookup missing, unset, or non-zero degrades to inferred command text | § "Next-Step Routing" infers from invocation and task type |
| `scripts/approved-plan.sh draft` | `hybrid` back-to-back cycles (prior `consume` rewrote `tasks/approved-plan.md`) | Next `draft` fails with `dirty path outside allowlist: tasks/approved-plan.md` | Commit the mirror between cycles (evidence of the prior consumed packet), or pass `--allow-dirty tasks/approved-plan.md` to the next `draft` |

Pack wrappers under `packs/**/SKILL.md` are intentionally absent from this audit: exploration confirmed they contain no cross-CLI branching — only intra-pack syntax references (`$skill` vs `/skill`) routed by the pack loader. Pack emphasis by CLI role lands in Step 9.

### Gaps surfaced by Step 8

Each gap below is logged for a follow-up step to close; Step 8 does not fix them.

**Closed in Step 13 (2026-04-19):** both `jq` gaps resolved by declaring `jq` a hard dependency in the two skills and naming the exact failure text users see (sourced verbatim from `scripts/approved-plan.sh:21` `require_jq_write`). No `jq`-free fallback was added — `jq` is trivially installable on every supported dev environment, and a second code path would duplicate JSON handling for no benefit. Original gap descriptions preserved below for audit.

- ~~`base/claude/handoff/SKILL.md` `--target=codex`~~ — Resolved: step 5 preamble now declares `jq` required and cites the `require_jq_write` error that fires at draft time (before the 5.5 pretty-print is reached).
- ~~`base/codex/exec/SKILL.md` `--execute-approved`~~ — Resolved: step 6c now names the exact user-facing failure reason when `jq` is missing; § "Constraints" unchanged.

## Pack emphasis

This section tags every base skill and every pack with a **primary CLI role** — `Claude-orchestration` (framing, interviews, strategy, research synthesis, tradeoff surfacing), `Codex-execution` (implementation, reconciliation, validation, repo mutation, shipping), or `Both` (genuinely spans). Role tagging is additive and advisory: parity-mirror skills still exist under both `base/claude/` and `base/codex/`, and the tag names the *intended* emphasis, not a restriction. Kanban pack variants inherit from their base pack unless noted. This is the one authoritative table — pack-level docs reference it rather than duplicate.

### Base skills

| Skill | Primary role | Notes |
| --- | --- | --- |
| `affected` | Claude-orchestration | Monorepo scope framing for planning; read-only |
| `analyze-sessions` | Claude-orchestration | Cross-session usage trends + automation recommendations |
| `brainstorm` | Claude-orchestration | Idea surfacing into `/idea-scope-brief` or `/feature-interview` |
| `branch-lifecycle` | Both | Evaluation is orchestration; merge/delete acts execute |
| `codebase-status` | Claude-orchestration | Read-only repo status plus related local conversation history |
| `commit-and-push-by-feature` | Codex-execution | Grouped commits + push |
| `idea-scope-brief` | Claude-orchestration | Raw idea shaping before ICP and implementation specs |
| `dead-code` | Claude-orchestration | Scan + report; no mutation |
| `debug` | Claude-orchestration | Investigate, log to changelog, propose fix |
| `decommission` | Codex-execution | Tear down services/packages |
| `delegate` | Claude-orchestration | Claude-only transport; the delegation mechanism itself |
| `deploy` | Codex-execution | Target-environment deploy + history |
| `expert-review` | Claude-orchestration | Panel-style review, read-only synthesis |
| `guide` | Claude-orchestration | GUI-blocker walk-throughs |
| `handoff` | Both | Context snapshot (orchestration); `/handoff --target=codex` (Claude) produces an approval packet; Codex `$handoff` writes only `tasks/handoff.md` prose (no packet) |
| `hygiene` | Both | Audit (orchestration) + optional auto-fix (execution) |
| `init-agentic-skills` | Both | Initializes base Claude/Codex managed skill installs; pack setup remains project-local through `pack` |
| `provision-agentic-config` | Codex-execution | Writes CLAUDE.md / AGENTS.md |
| `investigate` | Claude-orchestration | Validate claims, trace to root cause, propose fix |
| `migrate` | Both | Plan + step-by-step verified mutation |
| `pack` | Both | Manages pack state; orchestrates which skills live per project |
| `feature-interview` | Claude-orchestration | Evidence-backed feature intake, documentation destination, and priority decision |
| `spec-interview` | Claude-orchestration | Implementation spec completion via interview |
| `targeted-skill-builder` | Both | Skill-design framing plus repository mutation for focused skill additions or updates |
| `plan-phase` | Claude-orchestration | Decompose roadmap phase into steps |
| `reconcile-dev-docs` | Codex-execution | Rewrites task docs to match reality |
| `regression-check` | Codex-execution | Monorepo health check after changes |
| `release` | Codex-execution | Version bump, tag, changelog |
| `research-roadmap` | Claude-orchestration | Documentation queue maintenance |
| `roadmap` | Claude-orchestration | Task pipeline + priority queue |
| `run` | Both | Plans next step (orchestration) and executes on approval (execution) |
| `scaffold` | Codex-execution | Generate package/app |
| `session-triage` | Claude-orchestration | Focused one-session issue verification + fix recommendation |
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
| `alignment-loop` | Claude-orchestration | Lightweight operator-agent calibration: taste calibration, destination doc, vertical slice |
| `business-discovery` | Claude-orchestration | ICP, customer/market research, value proposition, positioning, lean canvas |
| `customer-lifecycle` | Both | Journey, onboarding, conversion, transaction, retention, expansion, lifecycle metrics |
| `business-growth` | Claude-orchestration | Engagement loops, metrics, monetization, GTM, landing copy, experiments, growth, PMF |
| `business-ops` | Both | Assumptions, cohorts, retros, risks, runway, stakeholder reporting, platform/research reconciliation |
| `business-app` | Claude-orchestration | Compatibility alias for `business-discovery`, `customer-lifecycle`, `business-growth`, and `business-ops` |
| `code-quality` | Codex-execution | `extract-shared-types`, `quality-sweep` — behavior-preserving refactor mutation |
| `creator-foundation` | Both | Creator evidence, dossier, positioning, programming, series, product-led media, metrics |
| `creator-media` | Both | Compatibility alias for `creator-foundation` and `youtube-ops`; add `remotion` separately for production work |
| `youtube-ops` | Both | YouTube audit, prelaunch review, packaging, portfolio, benchmarking, search, cadence, external video research |
| `remotion` | Both | Format research, scene-by-scene scripts, Remotion build specs and scaffolds |
| `project-fleet` | Both | Spec-store, multi-repo fleet orchestration, and spin-off workflows |
| `devtool` | Claude-orchestration | Adoption, docs audit, DX journey, positioning, workflow — framing skills |
| `game` | Claude-orchestration | Audience, core loop, fantasy, launch, playtest metrics — framing/research skills |
| `monorepo` | Both | Workspace-aware detection, branch-backed lane specs, guardrails, and scoped shipping overlay |

### Codex `$exec` routing

PoketoWork kanban packs are hibernated while Poketo.work is being rebuilt. Codex `$exec` should not substitute `$exec-kanban`, `$ship-kanban`, or `$ship-end-kanban` for base defaults. If a stale `.agents/project.json` still lists a hibernated kanban pack, keep using the base default command and remove the stale pack designation with `scripts/pack.sh remove <kanban-pack>` when cleanup is relevant.

## Migrating from the parity-mirror model

Before Phase 11, every skill existed in parallel under `base/claude/` and `base/codex/`, and users chose a CLI by opening the corresponding terminal. The three-mode model replaces "pick a terminal" with "declare a mode, then let skills route." The migration is pointer-level — there is no automated converter, and there is no breaking change to any skill surface.

- **Designate a mode.** Run `scripts/pack.sh set-mode <claude-only|codex-only|hybrid>` once per project. This writes `.agents/project.json.agent_mode`, which the resolver (`scripts/agent-mode.sh`) reads on every skill invocation. `scripts/pack.sh set-mode unset` clears the field — skills then keep the concrete next work item primary and infer the command route from invocation and task type. For a shell-scoped override (e.g., demoing a different mode), export `SKILLS_AGENT_MODE` instead of editing the file.
- **Pick packs by role, not by CLI.** The `## Pack emphasis` tables above tag each pack as `Claude-orchestration`, `Codex-execution`, or `Both`. Enable packs via `pack.sh install` based on the work the project does, not based on which CLI the developer happens to prefer. Parity-mirror skills in `base/` still work everywhere; pack emphasis just records intent.
- **Use `/delegate` in hybrid.** The old workflow — "plan in Claude, switch terminals, paste the plan into Codex, run it" — collapses into `/delegate <target-skill>` inside the Claude session. `/delegate` produces an approval packet, prompts once, then synchronously invokes `codex exec`. No manual CLI switching.
- **Use `/handoff --target=codex` for async handoffs.** When a human needs to resume work later in a separate Codex session (e.g., end of day, or cross-developer), `/handoff --target=codex` produces the same approval packet plus a `tasks/handoff.md` note. Codex resumes with `$exec --execute-approved`. Used in both `claude-only` (planning in Claude, executing later in Codex) and `hybrid` (async variant of `/delegate`).
- **Leave mode unset if you are unsure.** An absent `agent_mode` field is not a bug — the twelve Step-7 planning/execution skills keep the concrete next work item primary and infer the command route from invocation and task type. Declare a mode only once the project's steady-state workflow is clear.

## Gaps surfaced by Step 11

None. Step 11 surfaced no spec-level gap beyond those already logged under `### Gaps surfaced by Step 8`.

---

Status: Phase 11 Steps 1–11 complete: authoritative operating-model reference.
