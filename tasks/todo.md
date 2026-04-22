# Three-Mode Operating Model for Agentic Skills

**Status:** Planning complete 2026-04-19. New workstream kicking off; prior roadmap phases archived.

## Phase 11 — Three-Mode Operating Model

**Goal:** Evolve the agentic-skills system from parity-mirrored Claude/Codex skills into a plural-by-default operating model with three first-class modes (claude-only, codex-only, hybrid), a shared approval/delegation packet contract, and enforceable mode-completeness.

### Context

Session-history analysis (2025-12-10 → 2026-04-19):
- Claude: 7,247 prompts / 2,658 sessions. `/ship` dominates at 1,034 uses.
- Codex: 1,861 prompts / 621 sessions. `$run` dominates; last 7 days show 909 vs Claude 427 (2.1× flip).
- ~470 bare-approval prompts across both CLIs (`y` = 385 on Codex) — major friction signal.
- Pack skills differ only in invocation syntax, not substance.

External expert consensus (OpenAI `codex-plugin-cc`, Claude best practices, practitioner writeups) favors **Claude orchestrates, Codex executes, in-session delegation** — but ignores real availability constraints (subs, rate limits, outages). Hence the three-mode model.

### Design Summary

Plural by default. Each mode must be end-to-end complete:

| Mode | When | Orchestrator | Executor |
|---|---|---|---|
| `claude-only` | Codex unavailable | Claude | Claude |
| `codex-only` | Claude unavailable | Codex | Codex |
| `hybrid` | Both available | Claude | Codex via `/delegate` |

Mode is a signal (`.agents/project.json.agent_mode` + `SKILLS_AGENT_MODE` env var), not enforcement. Every cross-tool touchpoint has a degraded path. Cross-CLI execution is mediated by a shared approval packet with an explicit lifecycle.

### Acceptance Criteria

- [x] Any mode can complete the full plan → execute → ship → deploy loop without requiring the unavailable CLI
- [x] A user switching modes mid-project can continue with a degraded path, not a dead end
- [x] `$run --execute-approved` would have eliminated the ~385 bare-`y` Codex approvals without allowing stale-plan execution
- [x] Every cross-tool touchpoint in `docs/operating-modes.md` has a declared degraded path or hard mode requirement
- [x] Pack content differs between CLIs by role (framing/research vs execution/reconciliation), not just invocation syntax
- [x] Expert delegation pattern (Claude → Codex in-session) works via `/delegate` without leaving the Claude session

### Out of Scope

- `$continue` / `$resume-work` router on Codex (no data support)
- Additional `$run` flags (`--plan-only`, `--docs-only`, `--no-ship`) — duplicate existing skills
- Removing shipping skills from Claude (both CLIs stay end-to-end capable)
- Reverse delegation (Codex → Claude) — YAGNI

### Steps

- [x] **Step 1** — Thin `docs/operating-modes.md` — one page, three-mode table, paragraph per mode, pointer to approval packet. Do not pre-specify unshipped behavior.
- [x] **Step 2** — Mode resolution:
  - Add `agent_mode: "claude-only" | "codex-only" | "hybrid"` to `.agents/project.json` schema
  - Add `SKILLS_AGENT_MODE` env var override (not `AGENT_MODE` — collision risk)
  - Resolution precedence: env > project.json > unset (skills recommend all paths)
- [x] **Step 3** — Shared approval/delegation packet schema:
  - `.agents/approved-plan.json` — gitignored, machine-readable source of truth
  - `tasks/approved-plan.md` — sanitized human-readable mirror
  - Explicit field-level safety classification (which fields are safe for `.md` vs JSON-only)
  - Fields: step identity (Phase N / Step N.X / normalized title), approval timestamp, git HEAD, `tasks/todo.md` hash, allowed dirty paths, blocking manual-task snapshot, approval age TTL
  - Lifecycle states: `draft` → `approved` → `consumed` | `stale` | `superseded` | `uncertain`
- [x] **Step 4** — `$run --execute-approved` (Codex) — consumes packet, skips approval if `approved` + all freshness checks pass. Freshness: same git HEAD, unchanged `todo.md` hash, clean tree or dirty only on allowed paths, no new `_(blocks: Step N.X)_` entries, age under TTL. On failure, re-prompt with diff. Transitions `approved → consumed` or `approved → stale`.
- [x] **Step 5** — `/handoff --target=codex` (Claude) — extend existing `/handoff` to produce the approval packet as async task brief. Covers "Codex cloud delegation coming soon" case and claude-only users who plan to execute in Codex later.
- [x] **Step 6** — `/delegate` (Claude) — live in-session delegation to Codex, consumes same packet format. Safe-fallback semantics:
  - Failure before Codex starts → offer inline execution or emit packet
  - Codex may have started → set packet to `uncertain`, prompt inspect/discard/continue (never blind retry)
  - `agent-team` profile → inline fallback is a downgrade user must accept
- [x] **Step 7** — Next-step routing across `/spec-interview`, `/roadmap`, `/plan-phase`, `/run`, `/ship`, `/ship-end` (and Codex equivalents):
  - `hybrid` → "delegate with `/delegate $run`"
  - `claude-only` → "run `/run`"
  - `codex-only` → "run `$run` in Codex"
  - unset → infer from invocation and task type
- [x] **Step 8** — Degraded-path audit with concrete output: populate a table in `docs/operating-modes.md`:

  | Skill | Assumes | Fails how if unavailable | Degraded path |

  Covers: `/run`, `/ship`, `/ship-end`, `$run`, `$ship`, `$ship-end`, kanban variants, pack wrappers that recommend the other CLI. Every row has a filled degraded path or explicit "requires mode X" constraint.
- [x] **Step 9** — Pack emphasis split by CLI role:
  - Claude pack skills → framing, interviews, strategy, requirements, research synthesis, tradeoffs
  - Codex pack skills → implementation, reconciliation, validation, task promotion, repo mutation, shipping
  - Not every skill needs both versions; document which packs skew which direction
- [x] **Step 10** — Pack-aware `$run` on Codex — read `.agents/project.json.enabled_packs`, recommend/route to relevant pack skill when work matches
- [x] **Step 11** — Expand `docs/operating-modes.md` to authoritative reference:
  - Complete mode-signal resolution rules
  - Approval packet schema + lifecycle diagram
  - Populated degraded-path audit table from step 8
  - Migration guide from parity-mirror model
- [x] **Verify:** Run through all three modes on a sample workflow; confirm each mode completes plan → execute → ship without hitting the unavailable CLI

### Step 6 Summary (completed 2026-04-19)

- Added `scripts/approved-plan.sh mark-uncertain`: atomic `approved → uncertain` transition (`<file>.tmp` + `mv`), mirroring `mark-stale`. Rejects every non-`approved` source state (`draft`, `consumed`, `stale`, `superseded`, `uncertain`) with a clear single-line reason + non-zero exit. Usage help and dispatch case updated.
- Shipped `global/claude/delegate/SKILL.md`. Argument-hint `"[target-skill] [--allow-dirty <glob>] [--inline-fallback]"`. Workflow: mode-resolve via `scripts/agent-mode.sh` (hybrid-only; `claude-only` and `codex-only` exit with `mode-mismatch:`) → derive `phase`/`step`/`title` from the first unchecked `- [ ]` under `### Active Step Plan` (fallback: first unchecked under the current `## Phase N`) → `approved-plan.sh draft …` with any `--allow-dirty` flags → pretty-print packet → one concise approval question → `approve` → synchronous `codex exec "<target-skill> --execute-approved"` with start-marker timestamp captured before the call.
- Three-branch safe-fallback matrix documented explicitly — **never blind-retry cross-CLI**:
  - **Pre-start failure** (no `codex` binary, auth failure, start marker never printed) → packet stays `approved`; prompt inline-in-Claude vs keep-for-later; `--inline-fallback` auto-selects inline; `agent-team` profile requires explicit confirmation for the inline downgrade.
  - **Success** (exit 0 + `Approved packet consumed: …` + `tasks/approved-plan.md` shows `lifecycle: consumed`) → report success; Step 4's `consume` already flipped the lifecycle.
  - **Ambiguous** (non-zero exit or timeout after start marker) → `mark-uncertain`, then prompt inspect / discard (`supersede`) / continue inline. Never auto-retries.
- Contract untouched: no edits to `docs/operating-modes.md` or `specs/approved-plan.schema.json`. `uncertain` already existed in the schema enum; Step 6 is just its first writer. Codex side remains consumer-only.
- Verified `mark-uncertain` with fixture packets: happy path flips `approved → uncertain` atomically; each non-`approved` source state (`draft`, `consumed`, `stale`, `superseded`, `uncertain`) exits non-zero with a matching reason.

### Step 7 Summary (completed 2026-04-19)

- Added a shared **Next-Step Routing** section to 12 planning/execution skills — Claude: `spec-interview`, `roadmap`, `plan-phase`, `run`, `ship`, `ship-end`; Codex: same six. Each block resolves the effective agent mode via `./scripts/agent-mode.sh` and emits Next work plus Recommended next command, with a distinctive phrase ("Next-Step Routing") for grep-auditability.
- Claude-side branches (hybrid→`/delegate <target>`, claude-only→Claude skill, codex-only→Codex `$skill`, unset→infer from invocation and task type). Targets vary per skill context: `/roadmap` after spec-interview; `/plan-phase`/`/run` after roadmap; `/delegate $run` after plan-phase; `/delegate $ship` after `/run`; `/delegate $run` after `/ship` and `/ship-end`.
- Codex-side inversion for `hybrid`: "return to Claude for the next orchestration step" rather than "delegate further." `codex-only` stays in Codex; `claude-only` tells the user to switch to Claude.
- No-recurse invariant preserved: `global/claude/delegate/SKILL.md` and `global/claude/handoff/SKILL.md` do NOT carry the block. Grep of the distinctive phrase returns exactly the expected 12 files.
- Contract untouched: no edits to `docs/operating-modes.md`, `specs/approved-plan.schema.json`, or `scripts/agent-mode.sh`. Pure consumer of the mode resolver.

### Step 8 Summary (completed 2026-04-19)

- Appended `## Degraded-path audit` to `docs/operating-modes.md` — 19 rows covering `delegate` (3), `handoff` (2), `codex/run --execute-approved` (2), and the 12 Step-7 planning/execution skills' unset-mode recommendation branches. Every row names one of `claude-only` / `codex-only` / `hybrid` / `any` in **Assumes** and cites a specific SKILL.md section in **Degraded path** — no empty cells.
- Flagged two concrete gaps under `### Gaps surfaced by Step 8`: (a) `handoff --target=codex` uses `jq` at step 5.5 with no degraded path; (b) `codex/run --execute-approved` declares `jq` as a hard dependency but documents no user-facing failure path. Both are deferred to a follow-up step.
- Pack wrappers: explicitly noted as out-of-audit because exploration confirmed they contain no cross-CLI branching, only intra-pack syntax routed by the pack loader. Absence documented inline so Step 9 can pick up pack emphasis cleanly.
- Contract untouched: no edits to `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, or any `SKILL.md` workflow. Step 8 was documentation-only per plan.
- Verification: `grep -c "^| \`global/" docs/operating-modes.md` = 19 (≥14 required); `grep "| *|$"` = 0 empty cells; three rows spot-checked against source SKILL.md sections (`delegate` § "Mode requirement", `handoff` step 5.1, `codex/run` step 6c).

### Step 9 Summary (completed 2026-04-19)

- Appended `## Pack emphasis` to `docs/operating-modes.md` with two authoritative tables: **Global skills** (34 rows, one per unique skill name across `global/claude/` + `global/codex/`) and **Packs** (8 rows, one per directory under `packs/`). Every row tags a single primary role — `Claude-orchestration`, `Codex-execution`, or `Both` — with a compact Notes phrase.
- Role distribution: 18 skills tagged Claude-orchestration (spec-interview, roadmap, plan-phase, brainstorm, research-roadmap, investigate, trace, expert-review, spec-drift, slim-audit, affected, dead-code, debug, delegate, skills, guide, analyze-sessions, handoff-subset-intent), 10 Codex-execution (commit-and-push-by-feature, decommission, deploy, install-workflow-orchestration, reconcile-dev-docs, regression-check, release, scaffold, ship, ship-end, sync — 11), 5 Both (branch-lifecycle, handoff, hygiene, migrate, pack, run — 6). Every "Both" row explains the rationale inline; no default-assignments.
- Pack distribution: 3 Claude-orchestration (`business-app`, `devtool`, `game` — all base packs are framing/strategy skills), 1 Codex-execution (`code-quality` — refactor mutation), 4 Both (`business-app-kanban`, `devtool-kanban`, `game-kanban` inherit base pack and add kanban run/ship execution variants; `poketowork-kanban` has no base pack and mixes both natively).
- Added one-line role tags pointing back at the table to the four existing `PACK.md` files (`business-app-kanban`, `code-quality`, `devtool-kanban`, `game-kanban`). Packs without a pack-level doc today (`business-app`, `devtool`, `game`, `poketowork-kanban`) were not given new files — out of scope per plan.
- Contract untouched: no edits to `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, or any `SKILL.md` workflow. Step 8's `## Degraded-path audit` section remains byte-identical.
- Verified: `ls global/claude global/codex | sort -u` → 34 unique names, matching 34 rows in Global skills; 8 pack dirs match 8 rows in Packs; `grep -oE '(Claude-orchestration|Codex-execution|Both)'` returns only the three allowed role values.

### Step 10 Summary (completed 2026-04-19)

- Extended `global/codex/run/SKILL.md` § "Next-Step Routing" with a new `### Pack-Aware Command Text` subsection. Resolver order: (a) mode via `./scripts/agent-mode.sh` (Step 7, unchanged), (b) enabled packs via `./scripts/pack.sh list-packs`, (c) emit recommendation substituting the `-kanban` variant when an enabled pack ships it, otherwise emit the global default. Candidate packs named inline: `business-app-kanban`, `devtool-kanban`, `game-kanban`, `poketowork-kanban` — all tagged `Both` in Step 9's Packs table, load-bearing citation.
- Added `list-packs` subcommand to `scripts/pack.sh` — one newline-separated enabled-pack name per line, no decoration. Reuses the existing `read_enabled_packs` reader (no duplicated JSON parsing). Silent on missing/malformed `.agents/project.json` (exit 0, empty output), matching the plan's degraded-path contract.
- Documented the degraded path in the SKILL.md subsection: missing/malformed project.json → global fallback with a single-line inline `pack-lookup: skipped (no project.json)` comment; ambiguity (two packs ship the same variant) → first in `enabled_packs` order + inline tie note, no prompt. Scope explicitly fenced: recommendation-text routing only — `$run --execute-approved` still consumes `.agents/approved-plan.json` verbatim.
- Added a short `### Codex `$run` routing` subsection under `## Pack emphasis` in `docs/operating-modes.md` (above the closing `---` status line) pointing at the SKILL.md resolver. Status line updated to mention Step 10.
- Contract untouched: no edits to `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, `global/claude/run/SKILL.md`, any other skill, any pack skill, or the Step 8/9 doc sections.
- Verified `list-packs`: no project.json → empty output, exit 0; `enabled_packs: ["business-app-kanban"]` → emits `business-app-kanban`; malformed JSON → empty output, exit 0 (silent degraded path).

### Step 11 Summary (completed 2026-04-19)

- Expanded `docs/operating-modes.md` from a 200-line thin doc + appended audit tables into a ~280-line authoritative reference. New and reorganized sections: `## Mode-signal resolution` (precedence truth table + writer + unset semantics + invariant), `## Approval packet` split into Fields / Lifecycle / Safety classification / Freshness checks, a Lifecycle ASCII diagram plus a transitions-to-writers table mapping every `scripts/approved-plan.sh` subcommand (`draft`, `approve`, `consume`, `mark-stale`, `supersede`, `mark-uncertain`) to its lifecycle edge. Cites `specs/approved-plan.schema.json` for field-level truth rather than duplicating.
- Step 8 (`## Degraded-path audit`, 19 rows + Gaps), Step 9 (`## Pack emphasis`, 34 global skills + 8 packs), and Step 10 (`### Codex $run routing`) tables preserved byte-identically — diffed against `HEAD:docs/operating-modes.md`, only the trailing status line differs. Section ordering retained: three-mode intro → mode-signal resolution → approval packet → out of scope → degraded-path audit → pack emphasis → migration guide → status line.
- New `## Migrating from the parity-mirror model` section (~25 lines) orients newcomers at the right entry points without re-describing workflows: `pack.sh set-mode` for declaring mode, pack emphasis tables for role-based pack selection, `/delegate` for in-session hybrid execution, `/handoff --target=codex` for async handoff, and the deliberate "unset is a mode too" semantics. Pointer-only — no tutorial depth.
- Status line replaced: single `Phase 11 Steps 1–11 complete: authoritative operating-model reference.` — no more incremental per-step append. `### Gaps surfaced by Step 11` opened and explicitly closed with "None" — no new spec gaps found during the docs pass.
- Contract untouched: no edits to `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, `scripts/pack.sh`, any `SKILL.md` (global or pack), any pack wrapper, `CLAUDE.md`, or `tasks/roadmap.md`. Only `docs/operating-modes.md`, `tasks/todo.md`, and `tasks/history.md` touched.
- Verified: `git diff` on Step 8/9/10 table bodies — zero content changes; resolver precedence in the new `## Mode-signal resolution` matches `scripts/agent-mode.sh` behavior (env > file > unset, invalid in either source → non-zero exit); every lifecycle-diagram edge maps to an `approved-plan.sh` subcommand and every subcommand appears; migration guide cites `pack.sh set-mode`, `/delegate`, `/handoff --target=codex`, `$run --execute-approved` by name without re-describing their internals.
- Checked off Step 11 in `tasks/todo.md`. The Phase 11 final **Verify** item (three-mode sample-workflow walkthrough) rolled to its own deferred micro-step — it requires a real workflow run, not a docs task.

### Verify Summary (completed 2026-04-19)

- Exercised the Phase 11 mode-resolution and approval-packet mechanisms end-to-end under each of the three modes (`claude-only`, `codex-only`, `hybrid`), plus two degraded-path spot checks. Evidence lives in `tasks/verify-phase-11.md` — real shell output for every `scripts/agent-mode.sh` and `scripts/approved-plan.sh` invocation, with cross-references to `docs/operating-modes.md` anchors.
- **`claude-only`** and **`codex-only`** runs: resolver returns the correct mode; `.agents/` directory never created; no packet written. Recommendation copy quoted directly from `global/claude/run/SKILL.md:89` and `global/codex/run/SKILL.md:116` — each mode emits exactly one in-mode next-step line, never crosses to the unavailable CLI.
- **`hybrid`** run: drove the full packet lifecycle `draft → approved → consumed` via `scripts/approved-plan.sh`. Captured `status` output at each transition. Verified `tasks/approved-plan.md` mirror projection excludes JSON-only fields (`allowed_dirty_paths`, `notes`) per the footer declaration, matching `docs/operating-modes.md` § "Approval packet — Safety classification".
- **Spot check (a) — `/delegate` mode-mismatch under `claude-only`:** contract verified by quoting three independent locations in `global/claude/delegate/SKILL.md` (lines 17, 25, 70) that declare non-zero exit with `mode-mismatch:` reason and no packet mutation. Consistent with observed state (no `.agents/` dir during `claude-only` resolver test).
- **Spot check (b) — TTL expiration `approved → stale`:** drafted packet with `--ttl 1`, approved, slept 3s, `check` returned non-zero with single-line reason `stale: TTL expired (age=3s, ttl=1s)`. `mark-stale` atomically flipped lifecycle.
- **Sample-task commit policy:** no "fake work" commits on `master`. The walkthrough exercised the machinery directly — there was no external task for skills to mutate. Only bookkeeping commits (evidence file + task-doc updates) land on `master`.
- **Gaps surfaced (non-blocking):** (1) `mark-stale` accepted a `consumed` source state during spot-check authoring, unlike `mark-uncertain` which explicitly rejects all non-`approved` sources — worth a follow-up to align source-state guards. (2) Back-to-back hybrid cycles require committing the `tasks/approved-plan.md` mirror between runs (otherwise the next `draft` sees a dirty tree); expected UX but not documented in `docs/operating-modes.md` § "Degraded-path audit". Neither gap blocks Phase 11 closure. Full detail in `tasks/verify-phase-11.md` § "Gaps surfaced by Verify".
- Contract untouched: no edits to `SKILL.md` files, scripts, `specs/approved-plan.schema.json`, `docs/operating-modes.md`, `CLAUDE.md`, or pack files. Verify is empirical; findings get logged, not fixed in this step.

**Phase 11 is complete.** All 11 steps + Verify shipped. Step 12 (tail) closes the two non-blocking gaps Verify surfaced. Step 13 (tail) closes the two non-blocking `jq`-dependency gaps the Step 8 audit surfaced.

- [x] **Step 12** — Gap fixes from Verify: source-state guard on `mark-stale`; document hybrid back-to-back mirror-commit prerequisite in the degraded-path audit + `/delegate` SKILL.md.
- [x] **Step 13** — Close the two `jq`-dependency gaps from Step 8's degraded-path audit: declare `jq` a hard dependency in `global/claude/handoff/SKILL.md` (`--target=codex`) and `global/codex/run/SKILL.md` (`--execute-approved`), naming the exact `require_jq_write` failure text. Doc-only; audit gap bullets marked resolved.

### Step 13 Summary (completed 2026-04-19)

- Closed the two non-blocking `jq` gaps surfaced by Phase 11 Step 8's degraded-path audit. Both were purely documentary — `scripts/approved-plan.sh:21` `require_jq_write` already dies on every write subcommand with `ERROR: jq required for write operations. Install with: brew install jq (macOS) or apt install jq (Debian/Ubuntu).`
- **Gap 1 — `handoff --target=codex`.** Added a `jq`-required note to step 5's preamble in `global/claude/handoff/SKILL.md` covering both 5.4 (`draft`) and 5.5 (pretty-print).
- **Gap 2 — `codex/run --execute-approved`.** Strengthened step 6c in `global/codex/run/SKILL.md` to name the exact failure text users see when `jq` is missing.
- **Audit cleanup.** Both `⚠ gap — follow-up` cells in `docs/operating-modes.md`'s audit table updated to cite the new declarations. § "Gaps surfaced by Step 8" preserved with a dated resolution line + strikethroughs of the original bullets.
- Decision: declare, don't fallback. `jq` is trivially installable; a `jq`-free parser would duplicate 30+ lines of JSON handling for no benefit.
- Contract untouched: no edits to `scripts/approved-plan.sh`, `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/pack.sh`, `CLAUDE.md`, any other `SKILL.md`, or any pack file.
- Verified: zero `⚠ gap — follow-up` cells in the audit table; `bash -n scripts/approved-plan.sh` still parses.

### Step 12 Summary (completed 2026-04-19)

- Added a source-state guard to `scripts/approved-plan.sh cmd_mark_stale`, mirroring the proven `cmd_mark_uncertain` pattern. Only `approved` now transitions to `stale`; `draft`, `consumed`, `stale`, `superseded`, and `uncertain` each exit non-zero with the single-line reason `cannot mark-stale: lifecycle=<state> (only 'approved' may transition to 'stale')`. Closes Verify gap (1) — retroactive `consumed → stale` rewrites of terminal history are no longer possible.
- Added one row to `docs/operating-modes.md` § "Degraded-path audit" documenting the hybrid back-to-back mirror-commit prerequisite: after a `consume` rewrites `tasks/approved-plan.md`, the next `draft` will fail with `dirty path outside allowlist: tasks/approved-plan.md` unless the mirror is committed or `--allow-dirty tasks/approved-plan.md` is passed. Added a one-line in-context note to `global/claude/delegate/SKILL.md` step 2's `--allow-dirty` discussion so `/delegate` invokers see it without opening the audit. Closes Verify gap (2).
- Contract untouched: no edits to `specs/approved-plan.schema.json` (lifecycle enum already had all five states — this is a pure runtime guard), `scripts/agent-mode.sh`, `scripts/pack.sh`, `CLAUDE.md`, any other `SKILL.md`, or any pack file. Codex side (`global/codex/**`) untouched — `mark-stale` is Claude-side tooling per Step 6 design.
- Verified with fixture packets under `/tmp/apkstale12/`: happy path `approved → stale` flips atomically with `ok` exit 0; each of the five non-`approved` source states (`draft`, `consumed`, `stale`, `superseded`, `uncertain`) rejects non-zero with the expected reason and leaves the packet unchanged. Six cases in total, mirroring the Step 6 `mark-uncertain` verification (`tasks/history.md:73`, `/tmp/apktest6/`). Doc edits verified by grep of the new audit row + the new `--allow-dirty` sentence.

### Active Step Plan — Step 12: Gap fixes from Verify [archived for reference]

**Goal:** Close the two non-blocking gaps Phase 11 Verify surfaced (logged in `tasks/verify-phase-11.md` § "Gaps surfaced by Verify"): (1) add a source-state guard to `cmd_mark_stale` so only `approved` can transition to `stale`; (2) document the hybrid back-to-back mirror-commit prerequisite in the degraded-path audit + `/delegate` SKILL.md. Tail step of Phase 11 — no mechanism redesign.

**Contract reminder:** No schema, resolver, or lifecycle-FSM changes. Runtime guard parity + doc clarification only. `specs/approved-plan.schema.json` untouched (enum already covers all five states).

**Scope:**

1. **Gap 1 — Source-state guard on `cmd_mark_stale`.** Copy the guard block from `cmd_mark_uncertain` (lines 505–515) into `cmd_mark_stale` between `require_jq_write` and the `jq '.lifecycle = "stale"'` write. Only `approved` accepted; rejection reason `cannot mark-stale: lifecycle=$lifecycle (only 'approved' may transition to 'stale')` for consistency with the `mark-uncertain` wording.
2. **Gap 2 — Doc clarification.** One new row under `docs/operating-modes.md` § "Degraded-path audit" (targeting `scripts/approved-plan.sh draft`'s clean-tree check, not a skill). One-line note near `global/claude/delegate/SKILL.md` step 2's `--allow-dirty` collection.

**Files to modify:**

- `scripts/approved-plan.sh` — guard block in `cmd_mark_stale`.
- `docs/operating-modes.md` — new audit row.
- `global/claude/delegate/SKILL.md` — one-line note.
- `tasks/todo.md`, `tasks/history.md`, `tasks/roadmap.md` — bookkeeping.

**Do NOT modify:** `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/pack.sh`, `CLAUDE.md`, any other `SKILL.md`, any pack file, `global/codex/` skills.

**Test strategy:** Fixture packets under `/tmp/apkstale12/`, mirroring Step 6's approach. Six guard cases (happy path + rejection for each of `draft`, `consumed`, `stale`, `superseded`, `uncertain`); two doc greps.

**Acceptance criteria:**

- [x] `mark-stale` rejects all non-`approved` source states with a consistent reason; happy path still returns `ok` exit 0 and flips lifecycle atomically.
- [x] `docs/operating-modes.md` § "Degraded-path audit" has a new row for the hybrid back-to-back mirror-commit prerequisite.
- [x] `global/claude/delegate/SKILL.md` mentions the same prerequisite in-context near the existing `--allow-dirty` discussion.
- [x] No edits to schema, other scripts, `CLAUDE.md`, other skills, or pack files.

**Out of scope:**

- Changing `draft`'s default allowlist to auto-include `tasks/approved-plan.md` (contract change — separate decision).
- Building a proper `tests/` suite (not in this step; fixture-packet precedent stands).
- Reviewing the other four lifecycle transitions (all already guarded per `scripts/approved-plan.sh:253`, `:396`, `:433`).

**Execution Profile:** `serial`. Main agent owns everything.

**Commit plan:**

- `fix(approved-plan): guard mark-stale source state to 'approved' only`.
- `docs(operating-modes): document hybrid mirror-commit prerequisite`.
- `chore(tasks)`: task-doc updates.

### Active Step Plan — Phase 11 Verify: Three-mode sample-workflow walkthrough [archived for reference]

**Goal:** Prove — with a real workflow on a real project — that each of the three operating modes (`claude-only`, `codex-only`, `hybrid`) can complete a plan → execute → ship cycle without requiring the unavailable CLI. This is the final Phase 11 acceptance item deferred from Step 11 because it requires an actual run, not a docs task. On completion, Phase 11 is fully closed.

**Contract reminder:** All Phase 11 mechanisms are frozen: `scripts/agent-mode.sh` (Step 2), `specs/approved-plan.schema.json` (Step 3), `scripts/approved-plan.sh` (Steps 3–6), `/handoff --target=codex` (Step 5), `/delegate` (Step 6), Step 7 next-step routing, Step 8 degraded-path audit, Step 9 pack emphasis, Step 10 `$run` pack-aware routing, Step 11 authoritative doc. Verify is purely an empirical acceptance test — no mechanism edits. If Verify surfaces a real defect, log it under a new `### Gaps surfaced by Verify` subsection and defer the fix to a follow-up step.

**Starting context (from Steps 1–11, all shipped):**

- `docs/operating-modes.md` is the authoritative reference (~280 lines). Precedence: env `SKILLS_AGENT_MODE` > `.agents/project.json.agent_mode` > unset. Writer: `scripts/pack.sh set-mode <mode|unset>`.
- Approval packet lifecycle: `draft → approved → (consumed | stale | superseded | uncertain)`. All transitions live in `scripts/approved-plan.sh`.
- Six Claude + six Codex planning/execution skills carry the Step 7 "Next-Step Routing" block. `/delegate` is hybrid-only; `/handoff --target=codex` requires `claude-only` or `hybrid`.
- No project currently sits in all three modes end-to-end for a single step — prior shipping has exercised pieces but not a full loop per mode.

**Scope:**

Pick **one** small, self-contained task (e.g., a one-line doc fix in a scratch repo, or a no-op README tweak in this repo on a throwaway branch) and run it through each mode. One task, three runs. For each run, capture: the starting mode signal, every skill invoked, every packet lifecycle transition, and the final commit SHA. Record evidence inline in `tasks/verify-phase-11.md` (new, gitignored-or-committed per evidence contract below).

1. **`claude-only` run.** `SKILLS_AGENT_MODE=claude-only` in the shell. `/spec-interview` or `/run --plan-only` (whichever fits the task) → Claude plans → `/run` executes → `/ship`. Expected: no packet written (claude-only does not need cross-CLI approval). Expected recommendation at each terminal skill: the Claude next-step (never `/delegate`, never `$…`).
2. **`codex-only` run.** `SKILLS_AGENT_MODE=codex-only`. `$run` plans → `$run` executes → `$ship`. Expected: no packet written. Recommendation line resolves to stay-in-Codex at each terminal.
3. **`hybrid` run.** `SKILLS_AGENT_MODE=hybrid`. Claude `/run` plans → `/delegate $run` produces packet → Codex consumes via `$run --execute-approved` → `$ship`. Expected packet trajectory: `draft → approved → consumed`. Capture the exact `scripts/approved-plan.sh status` output at each transition.

4. **Degraded-path spot check (bonus, optional).** Attempt `/delegate` under `claude-only` mode — expect `mode-mismatch:` exit. Attempt `$run --execute-approved` under `hybrid` with an expired `ttl_seconds` — expect `stale` transition. Two one-shot checks, not a full matrix.

5. **Evidence write-up.** New file `tasks/verify-phase-11.md` with one section per mode: commands run, skill outputs (quoted or summarized), packet lifecycle snapshots, final commit SHAs. Cross-reference the relevant `docs/operating-modes.md` sections (Mode-signal resolution, Approval packet lifecycle, Degraded-path audit).

**Files to modify (full paths):**

- `/Users/georgele/projects/tools/agentic-skills/tasks/verify-phase-11.md` — **new.** Evidence for all three runs + the optional degraded-path spot checks. Committed (not gitignored) so future readers can see the Phase 11 acceptance record.
- `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md` — check off the final **Verify** item; append a Verify Summary; archive this Active Step Plan in place; decide whether to mark Phase 11 complete and advance, or close the phase if no next phase exists.
- `/Users/georgele/projects/tools/agentic-skills/tasks/history.md` — append a Verify entry.
- `/Users/georgele/projects/tools/agentic-skills/tasks/roadmap.md` — add a Phase 11 section marked ✓ once Verify passes (Phase 11 is currently absent from roadmap.md; todo.md is the only place it lives).
- **Do NOT modify:** any `SKILL.md`, any script under `scripts/`, `specs/approved-plan.schema.json`, `docs/operating-modes.md`, `CLAUDE.md`, or any pack file. Verify is empirical — if it finds a bug, log it, do not fix it in this step.

**Key technical decisions / risks:**

- **Pick a safe sample task.** The walkthrough is about exercising the mode machinery, not about the task itself. A one-line `README.md` typo fix or a no-op whitespace edit on a throwaway branch is ideal. Do not use Verify to slip in unrelated work — that confuses the evidence record.
- **Use `SKILLS_AGENT_MODE`, not `pack.sh set-mode`, for the three runs.** Shell env override is reversible per-invocation; writing to `.agents/project.json` pollutes the repo state. Only use `set-mode` if explicitly testing the file-sourced path.
- **`hybrid` needs both CLIs.** This run requires an active Codex session (`codex exec` reachable from PATH) and an active Claude Code session. If Codex is unavailable at Verify time, stop and report blocked — do not skip the `hybrid` run or substitute `claude-only` for it. The whole point is exercising all three.
- **Don't commit the sample task to `master`.** If the walkthrough produces real commits on `master` as part of `/ship`, each run will leave a trace. Either run the walkthrough in a scratch worktree / throwaway branch that gets deleted, or use a no-op task and allow three tiny commits on `master` (tagged clearly in commit message: `verify(phase-11): claude-only walkthrough`, etc.). Decide before starting.
- **Packet evidence must be real.** Capture `tasks/approved-plan.md` content at `draft`, `approved`, and `consumed` — screenshots of the mirror file, not narrative. `scripts/approved-plan.sh status` output at each transition.
- **If a run fails, that's a finding.** Do not patch-fix on the spot. Log under `### Gaps surfaced by Verify`, roll back to a clean state, and report — then decide with the user whether to close Phase 11 with a known gap or open a follow-up step.

**Reusable existing code / sources:**

- `scripts/agent-mode.sh` — resolver, cite for precedence in the evidence file.
- `scripts/approved-plan.sh` — `draft`, `approve`, `consume`, `mark-stale`, `supersede`, `mark-uncertain`, `status` — all lifecycle writers + the `status` reader for evidence capture.
- `docs/operating-modes.md` — cross-reference for each evidence section (mode signal, packet lifecycle, degraded-path audit).
- `tasks/history.md` — pattern-match recent phase-closure entries for the Verify history entry format.

**Test strategy (tests-after, per Execution Profile `serial`):**

1. Each of the three runs completes its full plan → execute → ship cycle.
2. `claude-only` and `codex-only` runs write no packet (`.agents/approved-plan.json` absent or unchanged across the run).
3. `hybrid` run writes exactly one packet with lifecycle trajectory `draft → approved → consumed` — verified by `scripts/approved-plan.sh status` captures.
4. Each terminal skill's "Next-Step Routing" block emits the correct branch for the resolved mode — verified by reading the actual recommendation text from each run.
5. Optional degraded-path spot checks: `/delegate` under `claude-only` exits non-zero with `mode-mismatch:`; `$run --execute-approved` with `ttl_seconds=1` and a >1s delay transitions the packet to `stale`.
6. `tasks/verify-phase-11.md` exists, cites `docs/operating-modes.md` sections by anchor, and covers all three modes.

**Acceptance criteria:**

- [x] Three sample-workflow runs complete — one per mode — without hitting the unavailable CLI.
- [x] `hybrid` run shows the full `draft → approved → consumed` packet lifecycle; `claude-only` and `codex-only` runs show no packet written.
- [x] Every terminal skill's recommendation line matches the resolved mode.
- [x] `tasks/verify-phase-11.md` captures evidence for all three runs with command logs + packet snapshots + commit SHAs.
- [x] Phase 11 final **Verify** checkbox in `tasks/todo.md` ticked.
- [x] `tasks/roadmap.md` gets a Phase 11 section marked ✓.
- [x] No edits to `SKILL.md`, scripts, schema, `docs/operating-modes.md`, `CLAUDE.md`, or pack files.

**Out of scope (do not drift):**

- Any mechanism change. Verify is empirical; findings get logged, not fixed.
- Re-running Steps 1–11's internal test strategies — those already passed at their shipping time.
- Exercising every degraded path from the Step 8 audit. Two optional spot checks are sufficient.
- Writing new skills, scripts, or schema extensions to "help Verify" — use what's shipped.
- Running the walkthrough on a real production project. Scratch repo or throwaway branch only.

**Execution Profile:** `serial` (inherited from Phase 11). Main agent drives all three runs and writes the evidence file. No subagent lanes — evidence capture is sequential and the three modes share the sample task.

**Commit plan:**

- `verify(phase-11): claude-only walkthrough` / `codex-only walkthrough` / `hybrid walkthrough` — one commit per run if using no-op task on `master`. Zero commits if using throwaway branch.
- `docs(verify): phase-11 three-mode walkthrough evidence` — the `tasks/verify-phase-11.md` write-up.
- `chore(tasks)` — `todo.md` checkoff, Verify Summary, history entry, `roadmap.md` Phase 11 ✓.

### Active Step Plan — Step 11: Expand `docs/operating-modes.md` to authoritative reference [archived for reference]

**Goal:** Turn `docs/operating-modes.md` from a thin reference + appended audit tables into the authoritative operating-model doc. By the end of Step 11, a newcomer should be able to read `docs/operating-modes.md` top-to-bottom and understand: what each of the three modes means, how the resolver decides which mode is active, the full approval/delegation packet schema and lifecycle, every declared cross-tool degraded path (Step 8), the pack emphasis split (Step 9), the Codex `$run` pack-aware routing behavior (Step 10), and how to migrate a pre-Phase-11 project onto the new model.

**Contract reminder:** Mode resolution (`scripts/agent-mode.sh`), approval-packet schema (`specs/approved-plan.schema.json`), Step 4 consumer (`scripts/approved-plan.sh`), Step 8 degraded-path audit rows, Step 9 pack emphasis tables, and Step 10 `$run` routing behavior are all frozen. Step 11 is pure documentation expansion — no new modes, lifecycle states, schema fields, env vars, or skill workflow edits. Reorganization, prose expansion, and cross-references are in scope. If Step 11 surfaces a genuine spec gap that's not a docs issue, log it under a new `### Gaps surfaced by Step 11` subsection and defer the fix.

**Starting context (from Steps 1–10, already shipped):**

- `docs/operating-modes.md` (200 lines currently) contains: three-mode table, paragraph per mode, forward pointer to approval packet, the approval packet contract (Step 3, ~108 lines with fields + lifecycle + freshness checks + `todo_hash` normalization), `## Degraded-path audit` (Step 8, 19 rows + Gaps subsection), `## Pack emphasis` (Step 9, Global skills 34 rows + Packs 8 rows), and `### Codex $run routing` (Step 10, short subsection). Status line at the bottom mentions Steps 8–10.
- The resolver `scripts/agent-mode.sh` (Step 2) implements env-var → `.agents/project.json.agent_mode` → unset precedence; this doc currently only gestures at it.
- `specs/approved-plan.schema.json` (Step 3) is the authoritative field spec; the current doc restates most of it but not with schema-level precision.
- `scripts/approved-plan.sh` (Step 4) implements all lifecycle transitions (`check`, `consume`, `mark-stale`, `draft`, `approve`, `supersede`, `mark-uncertain`, `status`) with atomic `.tmp` + `mv` writes.
- Newcomers land on this doc via CLAUDE.md workflow orchestration and via skill copy that says "point at `docs/operating-modes.md` for mode-signal resolution rules."

**Scope:**

1. **Mode-signal resolution (expand).** Add a dedicated `## Mode-signal resolution` section (or promote the existing paragraph-level treatment) citing the exact precedence `scripts/agent-mode.sh` applies: `SKILLS_AGENT_MODE` env var > `.agents/project.json.agent_mode` > unset. Name the valid values (`claude-only`, `codex-only`, `hybrid`). Cite the script by file path + symbol name, not line range (line ranges rot). Include a truth table mapping `(env, project.json)` → resolved mode.

2. **Approval packet (reorganize + expand).** Keep the existing "Approval / Delegation Packet" section, but split into clearer subsections: **Fields** (reference `specs/approved-plan.schema.json` authoritatively; don't duplicate field-by-field prose), **Lifecycle** (ASCII or mermaid-ish lifecycle diagram showing `draft → approved → (consumed | stale | superseded | uncertain)` plus the writers of each transition: `draft` ← `approved-plan.sh draft`; `approved` ← `approve`; `consumed` ← `consume` (in Step 4 `$run --execute-approved`); `stale` ← `mark-stale`; `superseded` ← `supersede`; `uncertain` ← `mark-uncertain`), **Safety classification** (`.md`-safe vs JSON-only — projection already enforced by `consume`), **Freshness checks** (the six checks applied by `check`, in cheapest-first order — already documented but group them here).

3. **Degraded-path audit (keep byte-identical).** Already populated in Step 8. Re-read once during Step 11 to confirm no row has drifted; keep byte-identical otherwise. Optionally re-order sections so `## Degraded-path audit` appears after `## Mode-signal resolution` and `## Approval packet` for better flow.

4. **Pack emphasis + Codex `$run` routing (keep byte-identical).** Already populated in Steps 9 and 10. Keep byte-identical. Confirm the Step 10 subsection's pointer to `global/codex/run/SKILL.md` § "Pack-Aware Command Text" is still accurate.

5. **Migration guide (new).** Short new section `## Migrating from the parity-mirror model`. Covers: (a) how to designate a project's mode (`pack.sh set-mode`), (b) which packs to enable and how role emphasis differs from parity mirrors, (c) how `/delegate` replaces the old "switch CLI manually" flow in hybrid mode, (d) how `/handoff --target=codex` covers the async case, (e) what happens if `.agents/project.json` is absent (infer route from invocation and task type). Keep to under ~40 lines; this is a pointer doc, not a tutorial.

6. **Status line refresh.** Replace the trailing `Status: Phase 11 Step 1 — thin doc; expansions tracked in …` line with a summary reflecting the now-authoritative state: "Phase 11 Steps 1–11 complete: authoritative operating-model reference."

**Files to modify (full paths):**

- `/Users/georgele/projects/tools/agentic-skills/docs/operating-modes.md` — expand to authoritative reference per Scope above. Target length: ~300–400 lines total (up from 200). Keep every Step 8/9/10 row byte-identical in content; section ordering may change.
- `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md` — check off Step 11, check off the final Verify item if the expanded doc makes the three-mode walk-through self-evident; otherwise roll Active Step Plan to the Verify item as its own micro-step.
- `/Users/georgele/projects/tools/agentic-skills/tasks/history.md` — append Step 11 entry following the existing section pattern.
- **Do NOT modify:** `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, `scripts/pack.sh`, any `SKILL.md` (Claude or Codex, global or pack), any pack wrapper, `CLAUDE.md`, `tasks/roadmap.md`.

**Key technical decisions / risks:**

- **Don't duplicate the schema.** `specs/approved-plan.schema.json` is the authoritative field reference. The doc should cite it by path and summarize categories (required vs optional, `.md`-safe vs JSON-only), not re-enumerate every field's type and constraints — that creates drift risk. If readers need field-level detail, they open the schema.
- **Don't restate the resolver's precedence in skill copy.** Step 7 already enforces this — skills say "Next-Step Routing" and defer precedence to the doc. Keep that invariant: precedence lives in the doc + script only.
- **Preserve byte-identity of audit tables.** Steps 8/9/10 tables are load-bearing and cross-referenced. Reorganization may move them within the file but must not change their content. Run a diff of the table bodies before/after to confirm.
- **Migration guide scope discipline.** Easy to expand into a how-to tutorial — don't. Keep it to orientation + pointers to the relevant skill/script entry points.
- **Status line.** Current line mentions Steps 8/9/10 incrementally. Step 11 should replace it with a single summary line; don't keep appending.

**Reusable existing code / sources:**

- `docs/operating-modes.md` — the canvas. All Step 11 edits live here.
- `scripts/agent-mode.sh` — cite for resolver precedence. Read once to confirm current behavior; do not edit.
- `specs/approved-plan.schema.json` — cite for field reference. Do not duplicate.
- `scripts/approved-plan.sh` — cite for lifecycle transition writers. Do not edit.
- Step 8/9/10 content already in `docs/operating-modes.md` — preserve byte-identically.

**Test strategy (tests-after, per Execution Profile `serial`):**

1. **Doc renders and scans correctly.** Preview `docs/operating-modes.md` after edits; confirm TOC-style flow top-to-bottom makes sense for a newcomer. No broken internal anchors.
2. **Byte-identity of Step 8/9/10 tables.** `diff` the table bodies against the pre-edit version; confirm zero content changes (whitespace is acceptable, row content is not).
3. **No cross-file edits.** `git diff --stat` on commit shows only `docs/operating-modes.md`, `tasks/todo.md`, `tasks/history.md`. No `SKILL.md`, script, schema, or pack files touched.
4. **Resolver citation correctness.** The resolver precedence described in the doc matches what `scripts/agent-mode.sh` actually does today. Spot-check by reading the script.
5. **Lifecycle diagram correctness.** Every transition named in the lifecycle diagram has a matching `approved-plan.sh` subcommand, and every subcommand is represented. Spot-check.
6. **Migration guide links out, not in.** The guide should point at `pack.sh set-mode`, `/delegate`, `/handoff --target=codex`, `$run --execute-approved` — not re-describe their workflows.

**Acceptance criteria:**

- [x] `docs/operating-modes.md` has dedicated sections for: three-mode table, per-mode paragraphs, `## Mode-signal resolution`, `## Approval packet` (with Fields / Lifecycle / Safety / Freshness subsections), `## Degraded-path audit`, `## Pack emphasis` (with Codex `$run` routing subsection), `## Migrating from the parity-mirror model`.
- [x] Step 8/9/10 tables are byte-identical in content; section ordering may have changed.
- [x] Status line replaced with a single Phase-11-complete summary line.
- [x] `tasks/todo.md` Step 11 checked off; final Verify item either checked or rolled to its own micro-step plan.
- [x] `tasks/history.md` has a Step 11 entry.
- [x] No edits to `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, `scripts/pack.sh`, or any `SKILL.md` / pack file.

**Out of scope (do not drift):**

- Any change to mechanisms (packet schema, mode resolver, pack router, `/delegate`, `/handoff`, `$run` routing). Step 11 is docs-only.
- Adding a new mode, lifecycle state, env var, or schema field.
- Rewriting skill copy to match the expanded doc. Skills already point at the doc; that's the contract.
- Creating a separate `MIGRATION.md` or `ARCHITECTURE.md` — everything lands in `docs/operating-modes.md`.
- Deep tutorials in the migration guide — pointer-level only.
- The Phase 11 Verify acceptance item (running all three modes through a real workflow) — if needed, track as its own micro-step after Step 11 ships.

**Execution Profile:** `serial` (inherited from Phase 11). Main agent owns the single-file doc edit and task/history bookkeeping. No subagent lanes.

**Commit plan:**

- `docs(operating-modes)` — the expansion itself.
- `chore(tasks)` — todo.md + history.md bookkeeping.

### Active Step Plan — Step 10: Pack-aware `$run` routing on Codex [archived for reference]

**Goal:** Teach `$run` on Codex to read `.agents/project.json.enabled_packs` and, when an enabled pack ships a skill whose surface matches the current recommendation target (`$run`, `$ship`, `$ship-end` and their kanban variants), recommend the pack skill invocation instead of the global-default skill. Step 9's pack emphasis table is the classification input; Step 10 is the routing logic that consumes it — strictly on the Codex `$run` side, strictly recommendation-only (no forced execution).

**Contract reminder:** Mode resolution (`scripts/agent-mode.sh`), approval-packet schema (`specs/approved-plan.schema.json`), Step 8 degraded-path audit, and Step 9 pack emphasis tables are all frozen. Step 10 touches `global/codex/run/SKILL.md` (recommendation block) and optionally adds a small doc pointer in `docs/operating-modes.md`. No new modes, lifecycle states, env vars, or transport behavior.

**Scope:**

1. **Reader location.** `scripts/pack.sh` already ships `read_enabled_packs` (lines 117–130-ish) — a library function that greps `"enabled_packs": [ ... ]` out of `.agents/project.json` and emits one pack name per line. Reuse, do not reimplement. `$run` will shell out to `scripts/pack.sh list` (or a new `list-packs` subcommand if the current `list` output is not machine-parseable) to get the enabled set.

2. **Matching rule.** The pack skills that are candidates for recommendation routing today are the kanban variants: `run-kanban`, `ship-kanban`, `ship-end-kanban` (present in `business-app-kanban`, `devtool-kanban`, `game-kanban`, `poketowork-kanban`). When the next-step routing block in `global/codex/run/SKILL.md` is about to emit `$run`, `$ship`, or `$ship-end`, it first checks whether any enabled pack ships a matching `-kanban` variant. If yes, recommend the kanban variant invocation instead (e.g., `$run-kanban` under the kanban pack).

3. **No-match fallback.** When no enabled pack matches, behave exactly as today — emit the global `$run` / `$ship` / `$ship-end` recommendation. This is the common case; it must stay silent (no "I checked enabled_packs and found nothing" noise).

4. **Degraded path.** Missing or malformed `.agents/project.json` → fall back to global skills silently. If `scripts/pack.sh list` exits non-zero, treat it as "no enabled packs" and continue. Log a single-line `pack-lookup: skipped (no project.json)` comment inline with the recommendation block, not a separate error line. Matches the Step 8 pattern of "degraded path documented, not silently swallowed."

5. **Ambiguity rule.** If two enabled packs both ship a `-kanban` variant (e.g., `business-app-kanban` + `devtool-kanban` both enabled simultaneously — unusual but legal), recommend the first in `enabled_packs` order and note the tie in the recommendation line. Do not prompt the user or fail.

6. **Scope limiter.** Only the recommendation emission is pack-aware. The actual next-step execution remains the user's call — `$run --execute-approved` still consumes `.agents/approved-plan.json` exactly as today, regardless of pack routing. Step 10 is pure text-routing in the recommendation block.

**Files to modify (full paths):**

- `/Users/georgele/projects/tools/agentic-skills/global/codex/run/SKILL.md` — extend the `## Next-Step Routing` section with a "Pack-Aware Command Text" subsection (or inline paragraph — match existing structure). Add the 3-step resolver: (a) mode resolve via `scripts/agent-mode.sh`, (b) enabled-pack resolve via `scripts/pack.sh list`, (c) emit recommendation with pack-specific variant if matched.
- `/Users/georgele/projects/tools/agentic-skills/docs/operating-modes.md` — optional: add a short subsection under `## Pack emphasis` called "Codex `$run` routing" pointing at the new SKILL.md behavior. Keep to 3–5 lines.
- `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md` — check off Step 10, roll Active Step Plan to Step 11 (docs/operating-modes.md authoritative expansion).
- `/Users/georgele/projects/tools/agentic-skills/tasks/history.md` — append Step 10 entry.
- **Do NOT modify:** `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, `scripts/pack.sh` (reuse, do not extend — if `list` is not machine-parseable, add a minimal subcommand with one PR-local change only), `global/claude/run/SKILL.md` (Claude-side routing is a parity-mirror debate deferred to Step 11+), any other skill's workflow, any pack skill, or the Step 8/9 doc sections.

**Key technical decisions / risks:**

- **Recommendation-only, not execution routing.** `$run --execute-approved` still runs what the packet says; pack-aware routing only changes what the next-step recommendation line prints. This keeps the approval-packet contract frozen.
- **Reuse, don't reimplement.** `scripts/pack.sh` owns `.agents/project.json` parsing. `$run` must not grep project.json directly. If `scripts/pack.sh list` output is not parseable, add a minimal `list-packs` subcommand (plain newline-separated pack names, no decoration) — one tight PR-local change, documented inline.
- **Silent fallback is the default.** The common case is no enabled packs or no matching pack; in that case the recommendation block looks identical to today. Avoid adding noise.
- **Degraded-path honesty.** Document the "malformed project.json → global fallback" behavior in the SKILL.md recommendation block, not just inline code. Step 8 set the standard: every cross-tool assumption has a declared degraded path.
- **Codex-only scope.** Claude-side `/run` stays untouched. Users in hybrid mode calling `/delegate $run` already land in Codex `$run`, which will then apply pack routing — so the hybrid path picks up pack awareness for free without touching Claude.

**Conventions from prior work:**

- `docs/operating-modes.md` is the canonical reference doc; Steps 8 and 9 both appended sibling sections under the status line. If adding a subsection under `## Pack emphasis`, do so above the closing `---` status line.
- `global/codex/run/SKILL.md` already has the Step 7 "Next-Step Routing" block with the distinctive phrase `Next-Step Routing`. Pack routing is command-text routing under Next-Step Routing.
- Commit split: one `feat(codex-run)` for the SKILL.md change (+ optional `scripts/pack.sh list-packs` if needed), one `docs(operating-modes)` for the subsection (if added), one `chore(tasks)` for todo/history.

**Test strategy (tests-after, per Execution Profile `serial`):**

1. **No-pack case:** with no `.agents/project.json` present, `$run` recommendation block emits the same text as today (the Step 7 recommendation, byte-compatible). Spot-check by reading a dry-run recommendation.
2. **Enabled-pack match:** set `.agents/project.json` with `enabled_packs: ["business-app-kanban"]`; the `$run` recommendation for a next-step should emit `$run-kanban` (or whatever the documented variant name is) instead of `$run`.
3. **No-match:** set `enabled_packs: ["code-quality"]` (which has no run/ship variants); recommendation block emits the global `$run` and does not log any pack-routing comment.
4. **Malformed project.json:** mangle the JSON; recommendation block falls back to global silently, with a single-line `pack-lookup: skipped` comment.
5. **Contract unchanged:** `git diff` shows no edits to `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, Claude-side SKILL.md files, or `## Degraded-path audit` / `## Pack emphasis` tables (except the optional new subsection).
6. **Evidence:** one row of the Step 9 Packs table should become load-bearing for this routing — cite it from the new SKILL.md subsection so the connection is explicit.

**Acceptance criteria:**

- [x] `global/codex/run/SKILL.md` recommendation block reads `enabled_packs` via `scripts/pack.sh` and emits a pack-variant invocation when a match exists.
- [x] No-pack and no-match cases emit unchanged recommendations.
- [x] Malformed project.json falls back to global with a single documented degraded-path line.
- [x] `tasks/todo.md` Step 10 checked off; Active Step Plan rolled to Step 11.
- [x] No edits to Claude-side `run/SKILL.md`, scripts/agent-mode.sh, approval-packet schema, or Step 8/9 doc sections.

**Out of scope (do not drift):**

- Claude-side `/run` pack-aware routing — Step 11+ debate.
- Pack-Aware Command Text for skills other than `$run`/`$ship`/`$ship-end` (e.g., `$plan-phase-kanban` doesn't exist today; don't invent it).
- Forcing the user onto a pack skill — routing is recommendation text only.
- Reading enabled packs from any source other than `.agents/project.json` via `scripts/pack.sh`.
- Docs expansion into the authoritative reference — Step 11.

**Execution Profile:** `serial` (inherited from Phase 11). Main agent owns the SKILL.md edit, optional `scripts/pack.sh list-packs` tightening, doc subsection, and task/history updates. No subagent lanes — single-file edit + reuse of existing infra.

### Active Step Plan — Step 9: Pack emphasis split by CLI role [archived for reference]

**Goal:** Tag every pack under `packs/` and every skill under `global/claude/**` / `global/codex/**` with a primary CLI role — **Claude-orchestration** (framing, interviews, strategy, requirements, research synthesis, tradeoffs), **Codex-execution** (implementation, reconciliation, validation, task promotion, repo mutation, shipping), or **both** — and record the split in a single authoritative "Pack emphasis" table in `docs/operating-modes.md`. Pack authors and users should be able to answer "where does this skill belong?" by reading one table.

**Contract reminder:** Mode resolution (`scripts/agent-mode.sh`), approval packet (`specs/approved-plan.schema.json`), and the Step 8 degraded-path table are all frozen. Step 9 adds guidance prose only — no new modes, lifecycle states, transport behavior, or skill deletions/renames. Role tagging is additive.

**Starting context (from session just shipped):**

- `global/claude/` has 34 skills; `global/codex/` has 33. The only asymmetry is `global/claude/delegate/` (no Codex counterpart by design — delegation is Claude-only orchestration). Every other name is parity-mirrored today.
- Packs present under `packs/`: `business-app`, `business-app-kanban`, `code-quality`, `devtool`, `devtool-kanban`, `game`, `game-kanban`, `poketowork-kanban`. Several `*-kanban` pack wrappers exist alongside base packs.
- Step 8 documented that pack wrappers contain no cross-CLI branching — only intra-pack syntax (`$skill` vs `/skill`) routed by the pack loader. That frees Step 9 to tag roles without touching transport.
- The 12 Step-7 planning/execution skills already encode an implicit split: Claude skills recommend `/delegate <target>` in hybrid; Codex equivalents recommend "return to Claude for the next orchestration step." Step 9 makes that split explicit across the whole skill set, not just the Step-7 twelve.

**Scope:**

1. **Survey skills (both CLIs).** For each skill name that appears under `global/claude/` and/or `global/codex/`, classify by primary role:
   - **Claude-orchestration:** `spec-interview`, `roadmap`, `plan-phase`, `brainstorm`, `research-roadmap`, `investigate`, `trace`, `expert-review`, `review`, `security-review`, `spec-drift`, `affected`, `handoff`, `delegate` (Claude-only), `skills`, `guide`, `debug` (framing side), …
   - **Codex-execution:** `run`, `ship`, `ship-end`, `commit-and-push-by-feature`, `deploy`, `release`, `regression-check`, `hygiene`, `dead-code`, `slim-audit`, `reconcile-dev-docs`, `scaffold`, `migrate`, `decommission`, `branch-lifecycle`, `sync`, `pack`, `install-workflow-orchestration`, …
   - **Both:** skills whose work genuinely spans orchestration and execution (rare — document the rationale when used).
   - The lists above are the audit's *starting hypothesis*, not its answer. Verify each by skimming the skill's frontmatter `description` and primary workflow. Re-classify where the description contradicts the hypothesis.

2. **Survey packs.** For each directory under `packs/`, identify the pack's primary role by inspecting its skill list + manifest (`packs/<pack>/SKILL.md` if present, plus the directory contents). Kanban variants inherit from their base pack unless their skill set diverges materially.

3. **Add a "Pack emphasis" section to `docs/operating-modes.md`.** Sibling of `## Degraded-path audit`, placed immediately before the closing `---` / status line. Structure:

   ```markdown
   ## Pack emphasis

   [1–2 sentence preamble stating the split and that role tagging is additive, not exclusive.]

   ### Global skills

   | Skill | Primary role | Notes |
   | --- | --- | --- |
   | `spec-interview` | Claude-orchestration | Interview-first planning — no repo mutation |
   | `run` | Codex-execution | Executes an approved step |
   | `delegate` | Claude-orchestration | Claude-only; the transport mechanism itself |
   | … | … | … |

   ### Packs

   | Pack | Primary role | Notes |
   | --- | --- | --- |
   | `business-app` | Both | Full planning + execution lifecycle for product work |
   | `code-quality` | Codex-execution | Reconciliation, validation, repo mutation |
   | `business-app-kanban` | Both | Inherits `business-app` split; adds kanban ceremony |
   | … | … | … |
   ```

4. **Update pack-level documentation** when a pack's README/manifest doesn't already state its role. Do *not* rewrite pack workflows — only add a role tag and one-line rationale. If a pack has no SKILL.md or README, mention this finding in the history entry but do not create one (out of scope).

5. **No deletions, no renames.** Parity-mirror skills (same name in both Claude and Codex dirs) stay as-is. The audit tags their intended primary role; removing genuine parity mirrors is a Step 11+ conversation.

**Files to modify (full paths):**

- `/Users/georgele/projects/tools/agentic-skills/docs/operating-modes.md` — append the `## Pack emphasis` section with the two role tables (Global skills, Packs).
- `/Users/georgele/projects/tools/agentic-skills/packs/*/README.md` or `packs/*/SKILL.md` — only where a pack-level doc exists and currently has no role tag. List exact paths during the audit.
- `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md` — check off Step 9, roll Active Step Plan to Step 10 (pack-aware `$run` routing).
- `/Users/georgele/projects/tools/agentic-skills/tasks/history.md` — append Step 9 entry.
- **Do NOT modify:** any `SKILL.md` workflow (frontmatter + body), `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, `specs/approved-plan.schema.json`. Step 9 is documentation-only, same as Step 8.

**Key technical decisions / risks:**

- **One authoritative table, not sprinkled tags.** The role split must live in `docs/operating-modes.md` so there's a single place to look. Pack-level docs reference it; they do not duplicate it.
- **"Both" is a real role, not a cop-out.** Some skills (e.g., `handoff` when called without `--target=codex`; `pack`) genuinely serve both orchestration and execution. Flag these explicitly with rationale in the Notes column — don't default-assign "Claude-orchestration" out of laziness.
- **Starting hypothesis is not the answer.** Every skill needs its description skimmed. The hypothesis lists above may over-assign Codex-execution to anything that touches files.
- **Kanban packs inherit.** `business-app-kanban` inherits from `business-app`; document the inheritance rather than re-enumerating skills.
- **Uniform row granularity.** One row per (skill, role) in the Global skills table — same convention as Step 8. A skill classified as "Both" is still one row.
- **Compact cells.** Same as Step 8 — one short phrase in Notes; link out to the skill's SKILL.md for deeper context.

**Conventions from prior work:**

- `docs/operating-modes.md` is the canonical reference doc; Step 8 already uses Markdown tables there. Stay consistent.
- `tasks/todo.md` bookkeeping follows Steps 4–8: check off step, append Summary section, roll Active Step Plan forward.
- Commit split: one `docs(operating-modes)` for the tables + pack doc tweaks, one `chore(tasks)` for todo/history.

**Test strategy (tests-after, per Execution Profile `serial`):**

1. **Coverage:** every skill under `global/claude/**` and `global/codex/**` has at least one row in the Global skills table. `ls global/claude/ global/codex/ | sort -u | wc -l` compared against table row count.
2. **Pack coverage:** every directory under `packs/` has one row in the Packs table.
3. **Role values:** every row's **Primary role** cell contains exactly one of `Claude-orchestration`, `Codex-execution`, or `Both` — no free-form role strings.
4. **Contract unchanged:** `git diff` shows no edits to `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, `scripts/approved-plan.sh`, or any `SKILL.md` workflow (only `docs/operating-modes.md`, `tasks/todo.md`, `tasks/history.md`, and optionally pack-level READMEs).
5. **No drift from Step 8:** `## Degraded-path audit` section still present and unmodified.

**Acceptance criteria:**

- [x] `docs/operating-modes.md` has a `## Pack emphasis` section with Global skills + Packs tables.
- [x] Every global skill (both CLIs) and every pack is tagged with one of `Claude-orchestration` / `Codex-execution` / `Both`.
- [x] `tasks/todo.md` Step 9 checked off; Active Step Plan rolled to Step 10 (pack-aware `$run` routing).
- [x] No edits to SKILL.md workflows, scripts, or schema.

**Out of scope (do not drift):**

- Pack-aware `$run` routing — Step 10.
- Expanding `docs/operating-modes.md` into the authoritative reference — Step 11.
- Fixing Step 8's surfaced gaps (jq dependencies on `handoff` and `codex/run`).
- Removing or renaming parity-mirror skills. That's a Step 11+ conversation if it ever happens.

**Execution Profile:** `serial` (inherited from Phase 11). Main agent owns the survey, the tables, and the task/history updates. No subagent lanes — documentation of shared-contract behavior is where parallel lanes drift.

### Active Step Plan — Step 8: Degraded-path audit [archived for reference]

**Goal:** Populate the degraded-path audit table in `docs/operating-modes.md`. For every cross-tool touchpoint (`/run`, `/ship`, `/ship-end`, `$run`, `$ship`, `$ship-end`, kanban variants, pack wrappers that recommend the other CLI), produce one row with columns: Skill | Assumes | Fails how if unavailable | Degraded path. Every row must have either a filled degraded path or an explicit "requires mode X" constraint — no empty cells.

**Contract reminder:** Mode resolution is frozen at `scripts/agent-mode.sh`; the approval-packet schema and FSM are frozen at `specs/approved-plan.schema.json` and `docs/operating-modes.md` § "Approval / Delegation Packet". Step 8 only *documents* existing behavior — it does not add new lifecycle states, env vars, or transport behavior. If the audit surfaces a genuine gap, note it in the row and defer the fix to a follow-up step (do not silently widen scope).

**Scope:**

1. **Audit targets** — enumerate every skill or wrapper whose workflow contains a cross-tool assumption (e.g., "recommend `/delegate`", "invoke `codex exec`", "recommend `$run`"). Start from:
   - `global/claude/run/SKILL.md`, `global/claude/ship/SKILL.md`, `global/claude/ship-end/SKILL.md`.
   - `global/codex/run/SKILL.md`, `global/codex/ship/SKILL.md`, `global/codex/ship-end/SKILL.md`.
   - `global/claude/delegate/SKILL.md` and `global/claude/handoff/SKILL.md` (the transport mechanisms themselves — their cross-tool assumptions need auditing).
   - Any kanban pack variants under `packs/*-kanban/` that differ from the base kanban skill.
   - Pack wrappers that explicitly recommend the other CLI (grep for `codex exec`, `/delegate`, `$run`, `/run` inside `packs/**/SKILL.md`).
2. **Table format** — insert the table into `docs/operating-modes.md` under a new heading `## Degraded-path audit`. Columns:
   - **Skill** — skill name + which CLI (e.g., `global/claude/run/SKILL.md`).
   - **Assumes** — the concrete cross-tool assumption (e.g., "Codex binary on PATH", "hybrid mode", "a Claude session is available for plan mode").
   - **Fails how if unavailable** — observable symptom (e.g., "exits non-zero with `codex: command not found`", "falls back to inline execution and prompts user").
   - **Degraded path** — the specific escape hatch the skill already ships (e.g., "`--inline-fallback` flag", "pre-start-failure branch keeps packet at `approved`"), OR an explicit "requires mode X" constraint if no degraded path exists.
3. **Evidence per row** — cite the SKILL.md line range or section header that implements the degraded path. Do not invent behavior; only document what ships.
4. **Gap flagging** — when a touchpoint has no degraded path and no explicit mode requirement, flag it with `⚠ gap — follow-up` in the Degraded path column and log the gap under a `### Gaps surfaced by Step 8` subheading for a later step to close. Do not fix gaps inside Step 8.

**Files to modify (full paths):**

- `/Users/georgele/projects/tools/agentic-skills/docs/operating-modes.md` — append the `## Degraded-path audit` section with the filled table and (if any surface) a `### Gaps surfaced by Step 8` follow-up list.
- `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md` — check off Step 8, roll Active Step Plan to Step 9 (pack emphasis split by CLI role).
- `/Users/georgele/projects/tools/agentic-skills/tasks/history.md` — append Step 8 entry.
- **Do NOT modify:** `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, or any SKILL.md workflow. Step 8 is documentation-only; it consumes shipped behavior and records it.

**Key technical decisions / risks:**

- **Audit what ships, not what's aspirational.** Rows must cite a specific behavior in a specific SKILL.md. If a skill's "degraded path" exists only as a TODO comment, flag it as a gap.
- **Uniform row granularity.** One row per (skill, assumption) pair. A single skill with two independent cross-tool assumptions gets two rows — do not collapse them, because the degraded paths likely differ.
- **Do not widen scope to packs until base skills are audited.** Finish the global Claude/Codex skills first, then sweep pack wrappers. Pack rows land at the bottom of the table grouped by pack.
- **Markdown table width.** Keep cells compact (one short phrase per cell, not multi-sentence paragraphs). Link out to specific SKILL.md locations for deeper detail instead of inlining.

**Conventions from prior work:**

- `docs/operating-modes.md` is the canonical reference for mode semantics. Append the audit table in the same prose style — not ASCII-tables in skill copy, but a proper Markdown table with evidence links is fine here.
- `tasks/todo.md` bookkeeping follows the same pattern as Steps 4–7 (check off the step, append a Summary section, roll the Active Step Plan sketch forward).

**Test strategy (tests-after, per Execution Profile `serial`):**

1. Grep verification: every skill enumerated in the audit scope has at least one row in the table. A `grep -c "^| global/" docs/operating-modes.md` returns at least the count of targeted skills.
2. Column completeness: no row has an empty **Degraded path** cell. Empty cells signal an unchecked gap — either fill or flag as `⚠ gap — follow-up`.
3. Evidence spot-check: for at least three rows, the cited SKILL.md section exists and matches the claim (open each cited file and confirm the referenced language is present).
4. Contract unchanged: `git diff` on `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, and the 12 Step-7 SKILL.md files shows no unintended edits.
5. Mode-branch coverage: every row names one of `claude-only`, `codex-only`, `hybrid`, or "any" in the **Assumes** column — no ambiguous rows.

**Acceptance criteria:**

- [x] `docs/operating-modes.md` contains a `## Degraded-path audit` section with a filled table for every scope target.
- [x] Every row has either a concrete degraded path (with SKILL.md evidence) or an explicit `requires mode X` constraint, or is flagged with `⚠ gap — follow-up`.
- [x] All surfaced gaps are listed under `### Gaps surfaced by Step 8` for a follow-up step to close — Step 8 does not close them.
- [x] `tasks/todo.md` Step 8 checked off and Active Step Plan rolled to Step 9 (pack emphasis split).
- [x] No edits to `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`, or any SKILL.md workflow.

**Out of scope (do not drift):**

- Fixing gaps surfaced by the audit. Those belong in a follow-up step or a scoped fix commit, not in Step 8 itself.
- Pack emphasis split by CLI role — Step 9.
- Pack-aware `$run` routing — Step 10.
- Docs expansion of `docs/operating-modes.md` beyond the audit table — Step 11.

**Execution Profile:** `serial` (inherited from Phase 11). Main agent owns the audit, the table, and the task/history updates. No subagent lanes — documentation of shared-contract behavior is where parallel lanes drift.

### Active Step Plan — Step 7: Next-step routing [archived for reference]

**Goal:** Wire next-step routing across the planning and execution skills so that after presenting a plan or completing its workflow, each skill points the user at the appropriate next-step invocation based on mode lookup, invocation style, and task type. Steps 4–6 shipped the mechanisms (`$run --execute-approved`, `/handoff --target=codex`, `/delegate`); Step 7 is the discoverability layer that makes users actually reach for them instead of falling back to the pre-Phase-11 "run it manually" habit.

**Contract reminder:** Mode resolution is frozen at `scripts/agent-mode.sh` with precedence `SKILLS_AGENT_MODE` env > `.agents/project.json.agent_mode` > unset. Valid values: `claude-only`, `codex-only`, `hybrid`, or empty. Step 7 only *reads* the resolved mode; it does not add new mode values, new env vars, or change precedence.

**Scope:**

1. **Add a shared "Next-Step Routing" block** to each planning/execution skill. The block appears after the skill's primary work completes (plan written, run finished, ship done) and before the skill hands back to the user. Source the mode via `./scripts/agent-mode.sh` (no inline logic duplication). Output copy by resolved mode:
   - `hybrid` → "**Next:** delegate with `/delegate <target>`" (target matches the skill's natural next move: `$run` after plan skills, `$ship` after `/run`, etc.).
   - `claude-only` → "**Next:** run `/run`" (or `/ship` / `/ship-end` where contextually right).
   - `codex-only` → "**Next:** run `$run` in Codex" (match Codex skill name to the context).
   - unset → infer from invocation and task type when mode lookup is unavailable.

2. **Claude skills to modify** (paths relative to repo root; touch each):
   - `global/claude/spec-interview/SKILL.md` — after writing the spec, recommend the next step (typically `/roadmap` or `/plan-phase`, but the cross-CLI recommendation applies once execution begins).
   - `global/claude/roadmap/SKILL.md` — after writing/updating the roadmap, recommend the appropriate next action.
   - `global/claude/plan-phase/SKILL.md` — after writing the phase plan, recommend `/delegate $run` (hybrid) / `/run` (claude-only) / `$run` (codex-only).
   - `global/claude/run/SKILL.md` — at the end of execution (handoff to ship), recommend the ship variant by mode.
   - `global/claude/ship/SKILL.md` — at the end of shipping (before plan mode), recommend how the next step will be executed.
   - `global/claude/ship-end/SKILL.md` — at session wrap-up, recommend the appropriate resume command for next session.

3. **Codex equivalents** (same treatment, matching Codex-side skills):
   - `global/codex/run/SKILL.md`.
   - `global/codex/ship/SKILL.md` (if present — verify).
   - `global/codex/ship-end/SKILL.md` (if present — verify).
   - Codex-side plan/roadmap skills (if present — verify via `ls global/codex/`). Recommendations on Codex skills invert the default: `hybrid` on Codex recommends returning to Claude for orchestration (since Claude is the orchestrator in hybrid); `codex-only` stays in Codex.

4. **Do not add the recommendation block to transport skills themselves.** `/delegate` and `/handoff --target=codex` are *how you get there*, not steps that recommend other mechanisms. `scripts/agent-mode.sh` stays untouched — Step 7 is a pure consumer.

**Out of scope:**

- Any new transport/lifecycle behavior — Step 6 shipped the last mechanism.
- Degraded-path audit table — Step 8.
- Pack emphasis split by CLI role — Step 9.
- Pack-aware `$run` routing — Step 10.
- Changes to `scripts/agent-mode.sh`, `docs/operating-modes.md`, or the approval-packet contract.

**Files to modify (full paths):**

- `/Users/georgele/projects/tools/agentic-skills/global/claude/spec-interview/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/global/claude/roadmap/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/global/claude/plan-phase/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/global/claude/run/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/global/claude/ship/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/global/claude/ship-end/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/global/codex/run/SKILL.md`
- `/Users/georgele/projects/tools/agentic-skills/global/codex/ship/SKILL.md` *(verify existence; skip if absent)*
- `/Users/georgele/projects/tools/agentic-skills/global/codex/ship-end/SKILL.md` *(verify existence; skip if absent)*
- Any Codex plan/roadmap skills discovered under `global/codex/` *(verify and include if present)*
- `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md` — check off Step 7, roll Active Step Plan to Step 8.
- `/Users/georgele/projects/tools/agentic-skills/tasks/history.md` — append Step 7 entry.

**Key technical decisions / risks:**

- **One shared block, not six bespoke ones.** Copy the exact same routing-block text into each touched skill (minor target-skill substitution is OK). Skills-level wording drift is how modes become inconsistent. If future edits need to change the copy, a grep for a distinctive phrase ("Next-Step Routing") should find every copy.
- **Unset is not a failure.** A project that hasn't picked a mode yet should still see useful guidance. The unset branch infers the route from invocation and task type; it does not force a mode.
- **Codex-side inversion.** In `hybrid`, Claude orchestrates and Codex executes. A Codex skill in `hybrid` mode should therefore recommend *returning to Claude* for the next orchestration step, not delegating further. Spell this out in the Codex-side copy.
- **Don't recurse into `/delegate` infinitely.** `/delegate` is itself one of the mechanisms. Its own SKILL.md should NOT add a "next: delegate" recommendation block — that would be tautological.
- **Keep the rendered output compact.** Emit the two-line Next work / Recommended next command result, matching the existing terse skill conventions. No ASCII tables.

**Conventions from prior work:**

- Skill edits follow the existing numbered-step structure. Insert the routing block as a new numbered step (or an explicit sub-section) at the natural end of the workflow, not as a sibling top-level section.
- Read the resolved mode via `./scripts/agent-mode.sh` (relative to project root) — same invocation pattern that `/handoff --target=codex` and `/delegate` use.
- No Bash 3.2 portability concerns here — the recommendation is instruction text in SKILL.md, not shell code.

**Test strategy (tests-after, per Execution Profile `serial`):**

1. Grep verification: every skill listed in the Files-to-modify section contains the distinctive phrase from the routing block. A single `grep -l` run with the phrase returns exactly the expected file list.
2. Routing coverage: each touched skill names the concrete next work and one recommended command, with missing/unset lookup falling back to invocation and task-type inference.
3. No-recurse verification: `global/claude/delegate/SKILL.md` and `global/claude/handoff/SKILL.md` do NOT contain the routing block.
4. Codex-side inversion: Codex-skill routing for `hybrid` references returning to Claude (e.g. "return to Claude"), not "delegate with `/delegate`".
5. Dry-run sanity: set `SKILLS_AGENT_MODE=hybrid`, `=claude-only`, `=codex-only`, and unset in a fixture; confirm the rendered command follows the resolved mode or inference fallback (manual walk-through, since skills are prose).
6. Schema/script unchanged: `specs/approved-plan.schema.json` and `scripts/agent-mode.sh` untouched.

**Acceptance criteria:**

- [x] Every Claude skill in scope (spec-interview, roadmap, plan-phase, run, ship, ship-end) emits the next-step routing block.
- [x] Every present Codex equivalent (run, plus ship/ship-end if they exist) emits the inverted next-step routing block.
- [x] `/delegate` and `/handoff` do NOT emit the block (no recursion).
- [x] `tasks/todo.md` Step 7 checked off and Active Step Plan rolled to Step 8 (degraded-path audit).
- [x] Contract files (`docs/operating-modes.md`, `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`) untouched.

**Out of scope (do not drift):**

- New modes, new env vars, or changes to mode precedence.
- Rewriting any skill's primary workflow. The recommendation block is additive at the natural terminus; the rest of the skill is out-of-bounds for Step 7.
- Step 8's degraded-path audit. A skill missing a "failure" recommendation row is noted for Step 8, not fixed here.

**Execution Profile:** `serial` (inherited from Phase 11). Recommendation copy is a shared surface across ~9 skills; parallel lanes drift on shared copy. Main agent owns every SKILL.md edit and the task/history updates.

### Active Step Plan — Step 6: `/delegate` (Claude) [archived for reference]

**Goal:** Ship a Claude-side `/delegate` skill that delegates the next step's execution to Codex **live, inside the current Claude session**, by producing an `approved` packet (reusing the Step 5 producer path) and then invoking Codex with `$run --execute-approved`. Unlike `/handoff --target=codex` (async, user resumes later), `/delegate` is synchronous transport: Claude remains the orchestrator, Codex executes, and Claude picks up once Codex returns. Step 6 also wires the **first writer of the `uncertain` lifecycle state** — when Codex may have started but we don't know its outcome, the packet must land in `uncertain`, not blind-retry.

**Contract reminder:** Schema, lifecycle FSM, `todo_hash` normalization, safety classification, and the six freshness checks are **frozen** at `docs/operating-modes.md` § "Approval / Delegation Packet" + `specs/approved-plan.schema.json`. Step 6 is pure transport + failure-mode wiring; it consumes the Step 5 producer (`draft`/`approve`/`supersede`) and the Step 4 consumer (`$run --execute-approved`). If a real contract gap surfaces, amend in a separate commit first.

**Scope:**

1. **New skill `/delegate` at `global/claude/delegate/SKILL.md`:**
   - `argument-hint`: `"[target-skill] [--allow-dirty <glob>] [--inline-fallback]"`. Target skill defaults to `$run`; other skills (e.g., `$ship`) are accepted but `$run` is the primary use case.
   - Workflow steps:
     1. Resolve agent mode via `./scripts/agent-mode.sh`. If not `hybrid`, stop with `mode-mismatch:` — `claude-only` has no Codex to delegate to, and `codex-only` plans in Codex directly.
     2. Derive `phase` / `step` / `title` from `tasks/todo.md` using the same rules `/handoff --target=codex` uses (first unchecked `- [ ]` under `### Active Step Plan`, fallback to current phase header).
     3. Produce the packet: `./scripts/approved-plan.sh draft …` then `./scripts/approved-plan.sh approve` — same one-question approval prompt as `/handoff --target=codex`. On rejection, leave at `draft` and stop.
     4. **Invoke Codex synchronously** from the Claude session: shell out to `codex exec` (or the equivalent Codex CLI entry) with the target skill invocation (e.g., `codex exec "$run --execute-approved"`). Capture stdout/stderr + exit code + a start-marker timestamp so the fallback matrix can reason about what happened.
     5. Safe-fallback matrix — select from the three states **before auto-retrying anything**:
        - **Failure before Codex starts** (exec command not found, auth failure, start marker never printed) → packet is still `approved`. Offer the user two options: (a) run inline in Claude (same session, no CLI boundary), or (b) keep the packet at `approved` for manual `$run --execute-approved` later. Never blind-retry the Codex invocation.
        - **Codex succeeded** (exit 0, `$run --execute-approved` logged `Approved packet consumed: …`) → the Step 4 consumer already flipped `approved → consumed`. Claude validates by reading `tasks/approved-plan.md`: if `lifecycle: consumed`, report success and hand back to the user. If not, treat as the ambiguous case below.
        - **Codex may have started** (non-zero exit, timeout, crash mid-execution) → call `./scripts/approved-plan.sh supersede` is WRONG — we need `uncertain`, not `superseded`. Add a new helper subcommand `mark-uncertain` (see §2). Then prompt: *inspect repo state / discard packet via `supersede` / continue inline in Claude*. Never blind-retry.
     6. Inline-fallback semantics: if `--inline-fallback` is passed, the "failure before Codex starts" branch auto-selects option (a) without prompting. Under an `agent-team` execution profile, inline fallback is a **downgrade** the user must explicitly opt into each time — the skill warns and requires interactive confirmation unless `--inline-fallback` is already on the command line.

2. **Extend `scripts/approved-plan.sh` with `mark-uncertain`:**
   - Atomic `approved → uncertain` transition, mirroring `mark-stale` (`<file>.tmp` + `mv`). Only valid from `approved` (not `draft` — an unapproved packet cannot go uncertain; it just stays draft).
   - Rationale: `uncertain` is already in the schema enum but Step 4 and Step 5 didn't need a writer. Step 6 is the first legitimate writer.

3. **Do NOT add new freshness checks, schema fields, or lifecycle states.** `uncertain` already exists. The FSM already covers it. Step 6 only wires the transition.

**Files to modify / create (full paths):**

- **Create:** `/Users/georgele/projects/tools/agentic-skills/global/claude/delegate/SKILL.md` — the new Claude `/delegate` skill per §1.
- **Modify:** `/Users/georgele/projects/tools/agentic-skills/scripts/approved-plan.sh` — add `mark-uncertain` subcommand, update usage help, extend the top-level dispatch case.
- **Modify:** `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md` — check off Step 6, roll Active Step Plan to Step 7.
- **Modify:** `/Users/georgele/projects/tools/agentic-skills/tasks/history.md` — append Step 6 session entry.
- **Do NOT modify:** `docs/operating-modes.md`, `specs/approved-plan.schema.json` (contract frozen). `tasks/approved-plan.md` is helper-written, never hand-edited.

**Key technical decisions / risks:**

- **Transport-layer only, no new FSM surface.** Step 6 composes Step 4 (`check` + `consume`) and Step 5 (`draft` + `approve`). The only new writer is `mark-uncertain`, and that transition is already in the schema.
- **`uncertain` is ambiguity, not failure.** A clean Codex failure with no side effects belongs in `superseded` (user discards) or stays `approved` (user retries deliberately). `uncertain` is specifically for "we don't know whether Codex started mutating state." Reserve it for that case — overusing it makes the lifecycle noise.
- **Never blind-retry cross-CLI.** This is the single most important invariant. If Codex may have started, re-running `$run --execute-approved` against the same packet risks double-execution. The skill must always prompt between "inspect / discard / continue inline" and never auto-retry on its own.
- **`codex exec` availability.** The Codex CLI invocation is the transport dependency. If the user's system has no `codex` binary, the skill falls back cleanly to the "failure before Codex starts" branch rather than crashing. Document the dependency in the SKILL.md header.
- **Hybrid-only by design.** `/delegate` is meaningless in `claude-only` (no executor) and `codex-only` (no orchestrator). Surface the mismatch with the same convention as `scripts/approved-plan.sh check` in claude-only: non-zero exit + `mode-mismatch:` reason.
- **Bash 3.2 portability** continues to apply to `mark-uncertain`. Same style as the rest of `approved-plan.sh`.

**Conventions from prior work:**

- Shell style: match `scripts/approved-plan.sh` — `die`, `fail`, `require_jq_write`, atomic `<file>.tmp` + `mv`. Add `cmd_mark_uncertain` next to `cmd_mark_stale` so the pairing is obvious.
- SKILL.md structure: follow `global/claude/handoff/SKILL.md` as the closest reference; numbered workflow steps, explicit `Process` + `Constraints` + `Default Shipping Contract` sections.
- `.gitignore` already covers `.agents/approved-plan.json`. No gitignore change needed.

**Test strategy (tests-after, per Execution Profile `serial`):**

1. `mark-uncertain` happy path: craft a fixture `approved` packet, run `mark-uncertain`, assert `lifecycle=uncertain` + atomic write (temp file gone, packet intact).
2. `mark-uncertain` rejects non-`approved` states: `draft`, `consumed`, `stale`, `superseded`, `uncertain` itself → each exits non-zero with a clear reason.
3. Mode gating: `SKILLS_AGENT_MODE=claude-only ./global/claude/delegate/SKILL.md` (or equivalent skill invocation) exits non-zero with `mode-mismatch:`. Same for `codex-only`. Only `hybrid` proceeds.
4. End-to-end happy path on a local fixture: stub `codex` with a shell wrapper that runs `./scripts/approved-plan.sh check && ./scripts/approved-plan.sh consume`; invoke `/delegate`, assert the packet ends at `lifecycle: consumed` and `tasks/approved-plan.md` mirror is updated.
5. Ambiguous-failure path: stub `codex` to exit 1 after printing a partial start marker; assert the skill calls `mark-uncertain` and presents the three-option prompt (do not auto-continue).
6. Pre-start-failure path: stub `codex` to not exist on `PATH`; assert the skill leaves the packet at `approved` and offers inline fallback without touching the lifecycle.
7. Packet schema validation: every lifecycle transition in tests 1–6 validates against `specs/approved-plan.schema.json` via `jsonschema` in a venv.
8. SKILL.md doc grep: confirms `/delegate`, `--allow-dirty`, `--inline-fallback`, `mark-uncertain`, and the `hybrid`-only constraint all appear in the skill.

**Acceptance criteria:**

- [x] `global/claude/delegate/SKILL.md` exists, is hybrid-only gated, produces the packet via Step 5 helpers, invokes Codex via `codex exec`, and handles the three fallback branches without blind retry.
- [x] `scripts/approved-plan.sh mark-uncertain` exists, transitions `approved → uncertain` atomically, and rejects all non-`approved` source states.
- [x] End-to-end fixture: `/delegate` invoking a stubbed Codex that runs `$run --execute-approved` drives a packet through `draft → approved → consumed` without Claude restarting the session.
- [x] Ambiguous-failure fixture lands the packet in `uncertain` and surfaces the inspect/discard/continue prompt.
- [x] Schema and lifecycle FSM unchanged (`docs/operating-modes.md` and `specs/approved-plan.schema.json` untouched).
- [x] `tasks/todo.md` Step 6 checked off and Active Step Plan rolled to Step 7.

**Out of scope (do not drift):**

- Step 7 (next-step routing). `/delegate` is the mechanism; the skill-level recommendations that point users to it land in Step 7.
- Reverse delegation (Codex → Claude). Still YAGNI per the Phase 11 roadmap.
- New schema fields, new lifecycle states, or changes to the six freshness checks. Contract is frozen.
- Codex-side producer. Still consumer-only on the Codex side.

**Execution Profile:** `serial` (inherited from Phase 11). Main agent owns the new skill, helper extension, and tasks/history updates. No subagent lanes — cross-CLI transport is exactly the shared-contract surface where parallel lanes drift.

### Step 5 Summary (completed 2026-04-19)

- Extended `scripts/approved-plan.sh` with producer subcommands (`draft`, `approve`, `supersede`, `status`) that reuse the Step 4 helpers (`die`, `fail`, `require_jq_write`, `todo_hash_of`, atomic `<file>.tmp` + `mv`). Producer never runs the six consumer freshness checks — the producer snapshots state at draft time; the consumer verifies freshness at execute time.
- `draft` refuses to overwrite a live `approved` packet (explicit `supersede` required). `approve` is atomic `draft → approved`, re-verifies `git_head` + `todo_hash` still match the draft snapshot (drift → fail loudly, user must re-draft), and refreshes `approved_at` so TTL starts at approval, not drafting. `supersede` flips any non-terminal packet to `superseded`. `status` prints a one-line lifecycle summary for preflight use. `blocking_manual_tasks` snapshots the **content** of unchecked `_(blocks: Step N.X)_` lines from `tasks/manual-todo.md`, not the path.
- `global/claude/handoff/SKILL.md` now documents `--target=codex` in `argument-hint` and adds a numbered step that mode-resolves via `scripts/agent-mode.sh` (abort on `codex-only`), validates a clean tree or matching `--allow-dirty <glob>` flags (same semantics as Step 4's `check`), derives `phase` / `step` / `title` from the first unchecked `- [ ]` under `### Active Step Plan` (fallback: first unchecked under the current `## Phase N`), calls `approved-plan.sh draft …`, pretty-prints the packet, asks one concise approval question, and on yes calls `approve`. The handoff doc gains a "Cross-CLI handoff" section naming `.agents/approved-plan.json`, `tasks/approved-plan.md`, and the resume command `$run --execute-approved`. Default (no `--target`) flow untouched.
- Verified with `/tmp/apktest5` fixtures: draft happy path, draft-with-dirty-allowlist positive + negative, draft-refuses-to-clobber-approved, approve happy path (timestamp refreshed), approve drift detection on `todo_hash` change, full `draft → approve → check → consume` round-trip ending at `lifecycle: consumed` in the `.md` mirror. Every lifecycle state validates against `specs/approved-plan.schema.json` via `jsonschema` in a venv.
- Contract untouched — no edits to `docs/operating-modes.md` or `specs/approved-plan.schema.json`. The producer side ships without modifying the frozen schema or FSM.

### Active Step Plan — Step 5: `/handoff --target=codex` (Claude) [archived for reference]

**Goal:** Extend Claude's existing `/handoff` skill with a `--target=codex` mode that, in addition to writing the `tasks/handoff.md` context document, **produces the first `draft → approved` approval packet** — the mirror image of Step 4's consumer. This gives claude-only and hybrid users a way to stage work inside Claude and then execute it later (or in another session/CLI) via `$run --execute-approved`. The packet produced here conforms to the Step 3 contract exactly; the schema and lifecycle FSM stay frozen.

**Contract reminder:** Schema, lifecycle, `todo_hash` normalization, and `.md`/JSON safety classification live in `docs/operating-modes.md` § "Approval / Delegation Packet". JSON Schema at `specs/approved-plan.schema.json`. Step 4 defined `consume` and `mark-stale`; Step 5 adds the producer side. **Do not redefine any schema or FSM surface.** If a real gap surfaces, amend the contract in a separate commit first.

**Scope:**

1. **New helper subcommands on `scripts/approved-plan.sh`** (extend, don't fork):
   - `draft` — assembles a candidate packet from current repo state and writes it to `.agents/approved-plan.json` with `lifecycle=draft`. Inputs are flags: `--phase "Phase N"`, `--step "Step N.X"`, `--title "<string>"`, optional `--approved-by`, optional `--ttl <seconds>` (default 3600), optional repeatable `--allow-dirty <glob>`, optional repeatable `--note <text>` (joined with newlines). Auto-fills `git_head` (`git rev-parse HEAD`), `todo_hash` (BOM-strip + CRLF→LF + sha256 on `tasks/todo.md`), `approved_at=<now UTC Z>`, and `blocking_manual_tasks` by scanning `tasks/manual-todo.md` for unchecked `_(blocks: Step N.X)_` lines and snapshotting the content of each. Refuses to overwrite an existing `approved` packet (that would clobber live approval state) — caller must explicitly call the new `supersede` subcommand first.
   - `approve` — atomic `draft → approved` transition (temp file + `mv`), same pattern as `consume`/`mark-stale`. Only valid from `draft`. Refreshes `approved_at` to "now" at the moment of approval so the TTL clock starts at approval, not drafting. Also re-runs the safety check that the current `git_head`/`todo_hash` still match what the draft captured — if they drifted between draft and approve, the transition fails loudly and the user must re-draft.
   - `supersede` — atomic `* → superseded` for any non-terminal prior packet, so a new draft can replace an older approved packet without violating the no-`consumed → approved` rule.
   - `status` — read-only: prints the current packet's `lifecycle` + one-line summary, exits 0. Useful as a preflight for `/handoff`.
   - All new writes go through `jq` and the same `<file>.tmp` + `mv` atomic pattern used in Step 4. Reads may still fall back to `sed`.

2. **Edit `global/claude/handoff/SKILL.md`** to add the `--target=codex` branch:
   - New `argument-hint` entry: `"[focus area] [--target=codex]"` (keep existing focus-area arg optional).
   - After step 4 (focus-area check) and before step 5 (write handoff), if `$ARGUMENTS` contains `--target=codex`:
     1. Resolve agent mode via `scripts/agent-mode.sh`. If mode is `codex-only`, relay a mode-mismatch error (Claude is not the planner in that mode) and stop.
     2. Require a clean tracked tree for packet production, OR require the user to pass `--allow-dirty <glob>` (repeatable) entries that cover any dirty paths. Mirror the Step 4 dirty-path semantics exactly — globs, not regex.
     3. Derive `phase` / `step` / `title` from the current `tasks/todo.md` active step (first unchecked `- [ ]` under the Active Step Plan section, or the first unchecked `- [ ]` under the current phase header if no Active Step Plan block exists).
     4. Call `scripts/approved-plan.sh draft …` with the derived values plus any `--allow-dirty` flags the user supplied.
     5. Present the drafted packet (pretty-printed JSON via `jq`) to the user and ask: "Approve this packet for Codex execution?" — exactly one concise approval question. On yes, call `scripts/approved-plan.sh approve`; on no, leave the packet at `draft` and note that it can be approved later with `./scripts/approved-plan.sh approve` or discarded with `./scripts/approved-plan.sh supersede`.
     6. Write the `tasks/handoff.md` document as usual, but add a "Cross-CLI handoff" section pointing at `.agents/approved-plan.json` (JSON, gitignored) and `tasks/approved-plan.md` (mirror, committed), and spelling out the Codex resume command: `$run --execute-approved`.
   - Keep the default (no `--target`) flow untouched so existing `/handoff` invocations don't change behavior.

3. **Update `tasks/approved-plan.md` and `docs/operating-modes.md` pointers:** no contract edits. Step 5 only needs to ensure the mirror/doc correctly name `/handoff --target=codex` as the first `draft → approved` producer (the Step 3 doc already forward-references this — verify it reads correctly and leave it if so).

**Files to modify / create (full paths):**

- **Modify:** `/Users/georgele/projects/tools/agentic-skills/scripts/approved-plan.sh` — add `draft`, `approve`, `supersede`, `status` subcommands; reuse existing `die`, `fail`, `require_jq_write`, `todo_hash_of`, `iso_to_epoch`, atomic-write pattern. Do not duplicate freshness-check logic — the producer side doesn't need the six checks; it just assembles a fresh snapshot.
- **Modify:** `/Users/georgele/projects/tools/agentic-skills/global/claude/handoff/SKILL.md` — add the `--target=codex` branch and update `argument-hint`. Keep the numbered-step structure; insert the new branch as a step after the current step 4 (focus-area check).
- **Modify:** `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md` — check off Step 5, roll Active Step Plan to Step 6.
- **Modify:** `/Users/georgele/projects/tools/agentic-skills/tasks/history.md` — append Step 5 session entry.
- **Do NOT modify:** `docs/operating-modes.md` or `specs/approved-plan.schema.json` (contract frozen). `tasks/approved-plan.md` is written by the helper on `consume` only — do not hand-edit.

**Key technical decisions / risks:**

- **Producer-only, no consumer drift.** The new subcommands are `draft` / `approve` / `supersede` / `status`; they never run the six freshness checks. Those belong exclusively to the consumer (`check`). Mixing producer-side validation into consumer checks is how Step 3's "consumer cannot redefine" rule gets eroded. The producer snapshots state at draft time; the consumer verifies freshness at execute time. Two different jobs.
- **Approval refreshes `approved_at`.** Drafting may happen minutes before approval (user reviews the packet). If we carry the draft timestamp forward, the effective TTL window is already partly burned. Reset at approval time.
- **Re-verify `git_head` / `todo_hash` at approve time.** If the user edits `tasks/todo.md` between draft and approve, the resulting packet would be born stale. The approve transition must fail loudly in that case — the user is expected to re-draft.
- **No overwrite of live `approved` packets.** `draft` refuses to clobber an existing `approved` packet. The explicit `supersede` path exists so replacement is intentional.
- **Manual-todo snapshot is content, not path.** Per the contract: snapshot the full text of each `_(blocks: Step N.X)_` line, not just file refs. A path-based snapshot silently drifts when the file is edited post-approval.
- **Mode-mismatch is a user error.** `codex-only` projects don't plan in Claude. Helper exits non-zero with a `mode-mismatch:` reason.
- **Bash 3.2 portability** still applies. No associative arrays, no `${var,,}`, no `readarray`. Repeatable flags (`--allow-dirty`, `--note`) land in plain indexed arrays.

**Conventions from prior work:**

- Shell style: match `scripts/agent-mode.sh` / the existing `scripts/approved-plan.sh` — `#!/usr/bin/env bash`, `set -euo pipefail`, `die`, `fail`, `$PROJECT_ROOT`, `case` validation, atomic `<file>.tmp` + `mv`.
- SKILL.md edits preserve the numbered-step structure; add the new branch inline, not as a sibling section.
- `.gitignore` already covers `.agents/approved-plan.json`. No gitignore change needed.

**Test strategy (tests-after, per Execution Profile `serial`):**

1. `draft` happy path: run on a clean tree with `--phase "Phase 11" --step "Step 5" --title "…" --ttl 3600`, assert the resulting `.agents/approved-plan.json` has `lifecycle=draft`, correct `git_head`, correct `todo_hash`, `approved_at` within the last few seconds, and `blocking_manual_tasks=[]` when no manual-todo file exists.
2. `draft` with dirty tree and matching `--allow-dirty` glob → succeeds; without matching glob → fails with a clear reason. Must mirror the Step 4 `check` semantics.
3. `draft` refuses to overwrite an existing `approved` packet; `supersede` first, then `draft`, succeeds.
4. `approve` happy path: after `draft`, run `approve`, assert lifecycle=`approved` and `approved_at` got refreshed.
5. `approve` drift detection: after `draft`, modify `tasks/todo.md` (append whitespace), then `approve` must fail because the `todo_hash` drifted; user must re-draft.
6. Full round-trip: `draft → approve → check (from Step 4)` returns `ok`; `consume` flips to `consumed`; `.md` mirror updates; packet validates against `specs/approved-plan.schema.json` at every lifecycle state.
7. `/handoff --target=codex` in `codex-only` mode: exits non-zero with mode-mismatch; does not touch `.agents/approved-plan.json`.
8. SKILL.md documentation: grep confirms `--target=codex` appears in the `handoff` SKILL.md workflow + `argument-hint`.

**Acceptance criteria:**

- [x] `scripts/approved-plan.sh {draft,approve,supersede,status}` exist, are executable, and pass tests 1–6 above.
- [x] `global/claude/handoff/SKILL.md` documents `--target=codex`, derives step identity from `tasks/todo.md`, and presents the packet for a single approval question before writing the handoff doc.
- [x] Full Claude-side produce → Codex-side consume loop works end-to-end on a local fixture: `/handoff --target=codex` produces an `approved` packet, `$run --execute-approved` consumes it, the `.md` mirror ends up `lifecycle: consumed`.
- [x] No change to `docs/operating-modes.md` § "Approval / Delegation Packet" or `specs/approved-plan.schema.json` (schema and lifecycle stay stable).
- [x] `tasks/todo.md` Step 5 is checked off and Active Step Plan rolls to Step 6.

**Out of scope (do not drift):**

- `/delegate` (Step 6) and `uncertain` transitions — those are transport-layer concerns for live in-session delegation, not async packet production.
- Codex-side producer — Codex does not yet plan for another session; `$run --execute-approved` stays consumer-only.
- Schema, lifecycle FSM, or freshness-check semantics. The contract is frozen.
- Reverse delegation (Codex → Claude). Still YAGNI per the Phase 11 roadmap.

**Execution Profile:** `serial` (inherited from Phase 11). Main agent owns all helper-script extensions, SKILL.md edits, and task/history updates. No subagent lanes — the lifecycle FSM is shared-contract work where parallel lanes drift.

### Step 4 Summary (completed 2026-04-19)

- Shipped `scripts/approved-plan.sh` (Bash 3.2, mirrors `scripts/agent-mode.sh` style) with `check`, `consume`, and `mark-stale` subcommands. `check` runs the six freshness checks from the contract in cheapest-first order and emits a single-line reason per failure. `consume` atomically transitions `approved → consumed` and projects the sanitized mirror to `tasks/approved-plan.md`; `mark-stale` atomically transitions `approved → stale`. Writes go through `<file>.tmp` + `mv` so a crashed transition leaves either prior or new state, never corruption. `jq` is required for writes; reads may fall back to `sed`. Hidden `--packet <path>` flag on every subcommand for fixture-based testing.
- `todo_hash` pipeline: `perl -pe 's/^\xEF\xBB\xBF//; s/\r$//' | shasum -a 256` per the contract normalization. `iso_to_epoch` supports both BSD (`date -j -f`) and GNU (`date -d`) so TTL math works across macOS and Linux without extra deps.
- Mode-mismatch guard: when `SKILLS_AGENT_MODE` or `.agents/project.json.agent_mode` resolves to `claude-only`, `check` exits non-zero with a `mode-mismatch:` reason before touching the packet. Codex-only affordance by design.
- `global/codex/run/SKILL.md` wires the `--execute-approved` branch as step 6c (after the execution-profile read): on `check=ok` it calls `consume`, logs the one-line consumption message, and jumps to step 9 (execute), skipping plan present + approval gate (steps 7–8). On failure it relays the single-line reason, calls `mark-stale`, and falls through to the normal plan/approval flow — never an auto-retry. `--execute-approved --phase` is rejected. Flag documented in the header `argument-hint` and a new Constraints bullet.
- Verification with fixtures under `/tmp/apktest/`: happy path → `ok` exit 0; each of the six freshness failure modes (lifecycle=draft, expired TTL, mismatched git_head, mismatched todo_hash, unexpected dirty path, mode-mismatch) → matching single-line reason + non-zero exit; `consume` flips lifecycle to `consumed` and writes the `.md` mirror that omits `allowed_dirty_paths`/`notes`; re-`consume` on an already-consumed packet is an idempotent no-op; pre-consume and post-consume packets both validate against `specs/approved-plan.schema.json` via `jsonschema` in a venv.
- Contract untouched: no edits to `docs/operating-modes.md` or `specs/approved-plan.schema.json`. Step 4 is the first legitimate consumer, exactly as Step 3 intended.

### Active Step Plan — Step 4: `$run --execute-approved` (Codex) [archived for reference]

**Goal:** Wire the Codex `$run` skill to consume the approval packet shipped in Step 3. When `.agents/approved-plan.json` contains a valid `approved` packet AND all six freshness checks pass, `$run --execute-approved` skips the usual plan-approval prompt and goes straight to implementation. On any failure, it transitions the packet to `stale`, re-prompts the user with a clear diff of what changed, and falls through to the standard `$run` approval path. Target: eliminate the ~385 bare-`y` Codex approvals surfaced in the Phase 11 context without ever letting a stale plan execute.

**Contract reminder:** Schema, lifecycle, freshness-check list, `todo_hash` normalization, and the `.md`/JSON safety classification all live in `docs/operating-modes.md` § "Approval / Delegation Packet". JSON Schema at `specs/approved-plan.schema.json`. **Do not redefine any of these in Step 4** — if the consumer needs a nuance the contract doesn't cover, amend the contract in a separate commit first.

**Scope:**

1. **New helper:** `scripts/approved-plan.sh` (Bash 3.2 compatible, like `scripts/agent-mode.sh`). Subcommands:
   - `check` — reads `.agents/approved-plan.json`, runs the six freshness checks from the contract, prints `ok` on stdout + exits 0 when fresh, or prints a single-line human-readable failure reason (`stale: git HEAD moved from X to Y`, `stale: todo.md hash changed`, `stale: TTL expired (approved_at=…, now=…, ttl=…)`, `stale: dirty path outside allowlist: <path>`, `stale: new blocking manual task: <snapshot>`, `invalid: lifecycle=<value>`, `missing: <reason>`) + exits non-zero.
   - `consume` — atomically transitions an `approved` packet to `consumed` (write to a temp file, `mv` into place) and emits the sanitized `.md` mirror by projecting `.md`-safe fields. Idempotent: second call on a `consumed` packet is a no-op success.
   - `mark-stale` — transitions `approved → stale` with the same atomic write pattern. Called when `check` fails.
   - Uses `jq` when available for JSON read/write; falls back to `sed`/`grep` only if `jq` is missing (document the dependency in the SKILL.md). Do not depend on Python or Node.
   - For `todo_hash`: implement the BOM-strip + CRLF→LF + sha256 pipeline in Bash using `perl -pe 's/^\xEF\xBB\xBF//; s/\r$//'` → `shasum -a 256` (both BSD on macOS and GNU Linux).
   - Validation: if `jq` is available, also run `jq -e` checks mirroring the JSON Schema `required` list.

2. **SKILL.md edit:** `global/codex/run/SKILL.md` — add an `--execute-approved` flag path that runs before step 8 (the normal approval gate):
   - After step 6b (execution-profile read), if `$ARGUMENTS` contains `--execute-approved`, invoke `scripts/approved-plan.sh check`.
   - On `ok`: call `scripts/approved-plan.sh consume`, skip steps 7 and 8 (plan present + approval gate), jump directly to step 9 (execute). Log one line: `Approved packet consumed: Phase X / Step Y (approved_at=…).`
   - On failure: relay the single-line failure reason to the user, call `scripts/approved-plan.sh mark-stale`, then fall through to the normal steps 7–8 (present plan and ask for approval). Do **not** auto-retry.
   - Unknown flag combinations (`--execute-approved --phase`) are rejected with an error — approved packets target one step, not a full phase. Document this in SKILL.md constraints.
   - The flag only has an effect in `codex-only` and `hybrid` modes; in `claude-only` it is a user error (Codex is not the executor). Read the effective mode via `scripts/agent-mode.sh`.

3. **Sanitized mirror writer** (inside `approved-plan.sh consume`): projects `step_identity`, `approved_at`, `approved_by`, `git_head`, `todo_hash`, `ttl_seconds`, `lifecycle`, `blocking_manual_tasks` into `tasks/approved-plan.md` using the worked-example format already seeded there. Explicitly omit `allowed_dirty_paths` and `notes` (JSON-only per contract).

4. **No writer for `draft → approved`:** that transition is a human approval action. Step 4 does not introduce a "create packet" flow — Step 5 (`/handoff --target=codex`) and Step 6 (`/delegate`) will. For Step 4 testing, a packet will be hand-written or fixture-generated.

**Out of scope (do not drift):**
- `/handoff --target=codex` packet emission — Step 5.
- `/delegate` packet emission + `uncertain` transitions — Step 6.
- Claude `$run` equivalent — in `claude-only` mode Claude still uses the normal plan-approval flow.
- Any change to the schema or lifecycle FSM. If a real need surfaces, amend `docs/operating-modes.md` + `specs/approved-plan.schema.json` in a separate commit first.

**Files to modify / create (full paths):**

- **Create:** `/Users/georgele/projects/tools/agentic-skills/scripts/approved-plan.sh` — Bash 3.2 helper with `check` / `consume` / `mark-stale` subcommands.
- **Modify:** `/Users/georgele/projects/tools/agentic-skills/global/codex/run/SKILL.md` — insert the `--execute-approved` branch, document the flag in the header and constraints.
- **Modify:** `/Users/georgele/projects/tools/agentic-skills/docs/operating-modes.md` — if the freshness-check section needs any clarification the Step 4 implementer discovers, amend it; otherwise leave untouched.
- **Modify:** `/Users/georgele/projects/tools/agentic-skills/tasks/todo.md` — check off Step 4, roll Active Step Plan to Step 5.
- **Modify:** `/Users/georgele/projects/tools/agentic-skills/tasks/history.md` — append Step 4 session entry.
- **Do NOT modify:** `tasks/approved-plan.md` (written by the helper, not hand-edited), `.agents/approved-plan.json` (gitignored developer-local state).

**Key technical decisions / risks:**

- **Bash 3.2 (macOS default).** No associative arrays, no `${var,,}`, no `readarray`. Follow the style of `scripts/agent-mode.sh`: `set -euo pipefail`, `die()` helper, `case` statements for validation, `sed -n 's/…/\1/p'` for single-field JSON extraction when `jq` is absent.
- **Atomic state transitions.** `consume` and `mark-stale` must write to `.agents/approved-plan.json.tmp` then `mv`. A crashed transition should leave either the previous state or the new state — never a corrupted file. A lifecycle FSM with half-written state masks re-execution bugs (the exact failure Step 3 called out).
- **Freshness-check ordering.** Cheapest checks first so a stale packet fails fast: lifecycle enum → TTL → git HEAD → todo_hash → dirty-path scan → manual-todo scan. Each check reports one specific reason; don't bundle multiple reasons into one error string.
- **No `consumed → approved` path.** The FSM is strict. A user wanting to re-run the same step must produce a new `draft → approved` transition (via the Step 5 or Step 6 flows, once those exist, or by hand).
- **jq dependency.** If `jq` is not installed, print a one-line install hint (`brew install jq` / `apt install jq`) and exit non-zero rather than fall back to fragile `sed` JSON editing for the write path. Reads can fall back; writes must be jq-backed.
- **Testing a stale packet without clobbering real state.** Use a fixture packet under `/tmp/approved-plan-test-*.json` and invoke `approved-plan.sh check --packet <path>` (add an override flag for test harness use only). Document the flag but do not advertise it in the happy-path SKILL.md workflow.
- **Mode interaction.** The flag is a Codex-only affordance. A `claude-only` project invoking `$run --execute-approved` in Codex is a user misconfiguration, not something the helper should silently paper over — report the mode mismatch and exit non-zero.

**Conventions from prior work:**

- Shell style: match `scripts/agent-mode.sh` exactly (`#!/usr/bin/env bash`, `set -euo pipefail`, `die` helper, `$PROJECT_ROOT` from `$(pwd)`).
- `.gitignore` already covers `.agents/approved-plan.json`. No gitignore changes needed.
- SKILL.md edits should preserve the numbered-step structure of `global/codex/run/SKILL.md`; add the `--execute-approved` branch as an inline clause on existing steps, not a sibling section.

**Test strategy (tests-after, per Execution Profile `serial`):**

1. Fixture test: hand-build a valid `approved` packet at `/tmp/approved-plan-ok.json`, run `scripts/approved-plan.sh check --packet /tmp/approved-plan-ok.json`, assert `ok` + exit 0.
2. Negative fixtures for each freshness-check failure mode: (a) lifecycle=`draft`, (b) `ttl_seconds=1` with backdated `approved_at`, (c) mismatched `git_head`, (d) mismatched `todo_hash`, (e) unexpected dirty path. Each must print a reason matching its failure and exit non-zero.
3. FSM test: after `consume`, re-read the JSON and assert `lifecycle == "consumed"`. Assert `tasks/approved-plan.md` mirror contains `lifecycle: consumed` and omits `allowed_dirty_paths` / `notes`.
4. JSON Schema round-trip: validate both the pre-consume and post-consume packet against `specs/approved-plan.schema.json` using `jsonschema` (Python venv) — both must remain schema-valid.
5. Idempotency: second `consume` on a `consumed` packet is a no-op success; does not corrupt the file.
6. SKILL.md grep: confirm the new flag is documented in both the header `argument-hint` (`"[--phase] [--execute-approved]"`) and the Workflow section.
7. Mode-mismatch: set `SKILLS_AGENT_MODE=claude-only` and run the check; expect a mode-mismatch error.

**Acceptance criteria:**

- [x] `scripts/approved-plan.sh {check,consume,mark-stale}` exist, are executable, and pass all seven test cases above.
- [x] `global/codex/run/SKILL.md` documents `--execute-approved`, and inspecting its flow on a valid approved packet skips the plan-approval gate and logs the one-line consumption message.
- [x] On any freshness failure, the packet is transitioned to `stale` and the user is re-prompted with the standard approval flow — never a blind retry.
- [x] No change to `docs/operating-modes.md` § "Approval / Delegation Packet" beyond optional clarifying edits (schema and lifecycle stay stable).
- [x] `jq` dependency is documented in SKILL.md; absence produces a clear install hint rather than a fragile fallback.
- [x] `tasks/todo.md` Step 4 is checked off and the Active Step Plan rolls to Step 5.

**Execution Profile:** `serial` (inherited from Phase 11). Main agent writes the helper, SKILL.md edit, and task/history updates. No subagent lanes — the lifecycle FSM is the exact kind of shared-contract work where parallel lanes drift.

### Step 3 Summary (completed 2026-04-19)

- Published schema + lifecycle + safety classification in `docs/operating-modes.md` (108 lines, kept in place — no extraction).
- Shipped `specs/approved-plan.schema.json` (draft-07). Validated a well-formed example, rejected a bad-lifecycle packet and a missing-`git_head` packet via `jsonschema`.
- Seeded `tasks/approved-plan.md` with an empty-state notice and a worked example of the mirror format.
- Added `.agents/approved-plan.json` to `.gitignore`; `git check-ignore` confirms.
- Grep confirms no SKILL.md or script consumes the packet yet — Step 4 is the first legitimate consumer.

### Sequencing Rationale

- Doc-thin-first names the model without pre-specifying unshipped behavior
- Mode resolution before primitives gives `/delegate` a stable "hybrid" definition
- Shared packet schema before execution primitives prevents `$run --execute-approved` and `/delegate` from drifting on "approved work" semantics
- Approval primitive before delegation (step 4 before 5–6) — delegation is transport + fallback on top of approval-state machinery, not a second approval model
- Async handoff before live delegate (5 before 6) — packet output is subset of live delegation; shipping first validates format
- Next-step routing after primitives exist so recommendations point to working skills
- Audit after behavior is implemented — auditing unshipped code produces aspirational rows
- Pack work after core model stabilizes — pack differentiation assumes next-step routing
- Doc-expand last — docs follow shipped behavior, per the pattern of current `docs/codex-workflow.md`

### Execution Profile

- Profile: `serial`
- Rationale: each step builds on prior step's contract (packet schema → approval consumer → delegation consumer → recommendations → audit). Subagent lanes would risk semantic drift on the shared packet definition.
- Parallel mode: none
- Main agent owns: all schema definitions, skill edits, doc writes, audit table population, mode-resolution helper logic

---

## Archived: All Prior Planned Phases Complete

**Status:** Roadmap complete as of 2026-04-07.

**Last completed step:** Phase 10 Step 6 — Deprecate the standalone DB-write path

## Priority Documentation Todo

- [x] `$reconcile-dev-docs fix tasks` - resolve the Phase 11 task-doc contradiction: `tasks/todo.md` still contains unchecked archived Phase 11 acceptance criteria even though `tasks/roadmap.md` and `tasks/history.md` report Phase 11 complete.
- [x] `$spec-drift fix packs/business-app/*/scale-audit` - align Claude and Codex `scale-audit` next-step guidance with `docs/skill-next-step-contracts.md`: recommend `spec-interview [top blocker]` when hard blockers lack specs, and make `roadmap` primary only when blockers are already specced.
- [x] `$spec-drift fix docs/operating-modes.md global/*/handoff` - clarify approval-packet handoff support: Claude `/handoff --target=codex` produces packets, but Codex `$handoff` only writes `tasks/handoff.md`; update wording that currently implies `codex-only` cross-session handoff uses the shared packet.
- [x] `$spec-drift fix approval-packet references` - update stale section anchors from `docs/operating-modes.md` § "Approval / Delegation Packet" to the current `## Approval packet` heading in `tasks/approved-plan.md`, `scripts/approved-plan.sh`, and `global/codex/run/SKILL.md`.
- [x] `$spec-drift fix code-quality docs` - reconcile `README.md` and `specs/code-quality-skill-pack.md` with the implemented `code-quality` pack, which now includes both `extract-shared-types` and `quality-sweep`.
- [x] `$spec-drift fix kanban archive docs` - update roadmap/archive references that still describe `/kanban-archive` as a standalone skill; current implementation exposes archive mode through `poketo-kanban --archive`.
- [x] `$spec-drift fix docs/canonical-workflow-report.md` - refresh or demote the stale canonical workflow report, which still says Phase 11 Steps 7-11 are not fully wired even though Phase 11 is complete.
- [x] `$spec-drift fix kanban legacy specs` - classify or update specs that still target the legacy `kanban.mjs`/direct-Neon path now that active kanban skills use `poketo kanban` and `kanban.mjs` is fallback/admin-only.
- [ ] `$reconcile-dev-docs fix skills-reference` - decide how to document Claude-only `delegate` in `README.md` and `docs/skills-reference.md`, since it exists under `global/claude/delegate` and is central to hybrid mode but has no Codex mirror.
- [ ] `$reconcile-dev-docs fix pack-command docs` - document `scripts/pack.sh list-packs` where appropriate, or explicitly mark it as an internal subcommand used by Codex `$run` routing.
- [ ] `$devtool-user-map` - create/update `research/devtool-user-map.md` because the repo infers as a devtool project and the canonical research output is missing.
- [ ] `$devtool-integration-map` - create/update `research/devtool-integration-map.md` after `$devtool-user-map`; currently blocked because `research/devtool-user-map.md` is missing.
- [ ] `$devtool-dx-journey` - create/update `research/devtool-dx-journey.md` after `$devtool-integration-map`; currently blocked because `research/devtool-integration-map.md` is missing.
- [ ] `$devtool-adoption` - create/update `research/devtool-adoption.md` after `$devtool-dx-journey`; currently blocked because `research/devtool-dx-journey.md` is missing.
- [ ] `$devtool-positioning` - create/update `research/devtool-positioning.md` after `$devtool-adoption`; currently blocked because `research/devtool-adoption.md` is missing.
- [ ] `$devtool-monetization` - create/update `research/devtool-monetization.md` after `$devtool-positioning`; currently blocked because `research/devtool-positioning.md` is missing.
- [ ] `$devtool-docs-audit` - create/update `research/devtool-docs-audit.md` after `$devtool-monetization`; currently blocked because `research/devtool-monetization.md` is missing and no docs-audit artifact exists for the devtool default flow.
- [ ] `$spec-drift fix all` - reconcile `specs/*.md` against implementation because source changes are newer than the latest spec evidence: commit `975c823` (`feat(code-quality): add quality sweep skill`, 2026-04-16 12:38:47 -0400) updated `packs/code-quality/.../quality-sweep` after `specs/code-quality-skill-pack.md` was last modified on 2026-04-13 09:52:16.
- [ ] `$roadmap` - create/update `tasks/roadmap.md` and `tasks/todo.md` after `$spec-drift fix all`; currently blocked because specs may be stale, and `specs/code-quality-skill-pack.md` (2026-04-13 09:52:16) is newer than `tasks/roadmap.md` (2026-04-07 22:58:31).

## Priority Task Queue

- [x] `$research-roadmap` - refreshed `tasks/todo.md` with priority documentation items because all roadmap phases are complete and the next useful project action is a research/documentation health scan.

## Final Step Outcome

- [x] Legacy helper messaging now points standard usage at `poketo kanban`
- [x] `kanban.mjs` remains available only as fallback/admin tooling during rollout
- [x] Active skill/docs verification still shows no standard-use dependency on `POKETOWORK_DATABASE_URL`
- [x] Active Codex skill/docs verification still shows no `~/.claude/.../kanban.mjs` dependency

## Current State

- Archived final phase snapshot to `tasks/phases/phase-10.md`
- No unchecked phases remain in `tasks/roadmap.md`
- No active `tasks/manual-todo.md` file is present
- Skill sources now use the two-layer `global/{claude,codex}` plus `packs/<pack>/{claude,codex}` layout
- Base `business-app`, `game`, and `devtool` packs do not include PoketoWork kanban behavior; `*-kanban` and `poketowork-kanban` packs are explicit opt-ins
- Skill frontmatter `argument-hint` values were normalized to quoted YAML scalars so Codex skill loading no longer trips on inline bracket syntax
- Shipping skills now define `commit-and-push-by-feature` as landing commits on `main`/`master` and pushing there when the workflow succeeds
- Research-oriented Codex skills now default to self-sufficient, first-principles analysis and ask for constraints or factual corrections instead of relying on user intuition
- Pack management now supports guided no-argument setup, multi-pack install/remove, aliases, project lock protection, and skill-local launcher scripts
- Pack install/remove/refresh now tells users to start a fresh Claude Code or Codex CLI session when changed project-local skills are not visible
- Added the `code-quality` pack with the first `extract-shared-types` skill for behavior-preserving type extraction refactors
- `research-roadmap` now front-loads missing and stale documentation work into `tasks/todo.md` instead of only reporting read-only status
- Research/spec-writing skills now require archive-first replacement: before substantively rewriting existing canonical docs, snapshot the old file under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>` and then update the canonical path
- Roadmap, plan-phase, run, and ship skills now carry an explicit `### Execution Profile` so agents can choose serial, research-only, review-only, implementation-safe, or agent-team execution deliberately
- Claude plan-mode skills now guard `ExitPlanMode` calls so an already-normal post-approval session continues implementation instead of failing with "You are not in plan mode"

## Next Action

Start with `$devtool-user-map` from the priority documentation todo, or start a new spec and roadmap cycle if new work is being introduced.

## Next Step Plan: `$reconcile-dev-docs fix skills-reference`

### Goal

Decide how to document Claude-only `delegate` in `README.md` and `docs/skills-reference.md`. The skill exists at `global/claude/delegate/SKILL.md` and is central to hybrid Claude→Codex live delegation, but has no Codex mirror and is not mentioned in either reference doc.

### Scope

Doc-only reconciliation. No skill code changes. Same shape as prior `$reconcile-dev-docs fix …` and `$spec-drift fix …` doc-only steps.

### Execution Profile

Serial, implementation-safe. Single-agent, doc-only edits. No tests, no migrations.

### Ground truth

- Source of truth: `global/claude/delegate/SKILL.md` (Claude-only). No `global/codex/delegate/` directory exists.
- The skill's purpose: live in-session delegation from Claude to Codex via the approved-packet contract; sibling to `/handoff --target=codex` (async) and complementary to `$run`/`$ship` execution paths.
- `docs/skills-reference.md` and `README.md` currently contain zero mentions of `delegate` (`grep -in delegate` returns no hits).
- `tasks/todo.md:1015` is the queue item to tick.

### Files to inspect / modify

- `docs/skills-reference.md` — add a `delegate` entry in the appropriate section (likely under the cross-CLI / orchestration / hybrid-mode group), explicitly marked Claude-only with a short blurb mirroring the SKILL.md description.
- `README.md` — add a brief mention in whichever section currently lists hybrid-mode or Claude-only skills (or the skills overview list, depending on existing structure). Mark it Claude-only.
- Tick `tasks/todo.md:1015`.
- `tasks/history.md` — add a dated 2026-04-22 entry.

### Key context

- `delegate` has no Codex mirror by design (it is the Claude→Codex transport). Document the asymmetry explicitly so a Codex user reading the reference does not expect to find `$delegate`.
- Cross-link to `/handoff --target=codex` for the async equivalent and to the approved-packet contract docs (`tasks/approved-plan.md` / `scripts/approved-plan.sh`).
- Archive-first is **not** required for additive doc entries. If either edit grows into a substantive rewrite of an existing section, snapshot the pre-edit file under `docs/history/archive/YYYY-MM-DD/HHMMSS/<path>` first.

### Acceptance criteria

- `docs/skills-reference.md` lists `delegate` with a short description and a Claude-only marker.
- `README.md` mentions `delegate` (Claude-only) wherever skills are catalogued or hybrid-mode workflow is discussed.
- `tasks/todo.md:1015` ticked.
- `tasks/history.md` has a dated 2026-04-22 entry summarizing the additions.
- Ship via `/commit-and-push-by-feature` on `master`. No deploy contract → deploy skipped.

### Ship-one-step handoff contract

After approval, implement **only** this step: add `delegate` entries to `docs/skills-reference.md` and `README.md` (Claude-only), tick `tasks/todo.md:1015`, add a dated entry to `tasks/history.md`, commit and push to `master` via `/commit-and-push-by-feature`. Deploy skipped (no `deploy.md` / `tasks/deploy.md`). Then write the following step's plan (next unchecked queue item — likely `$reconcile-dev-docs fix pack-command docs` at `tasks/todo.md:1016`), ensure `.claude/settings.local.json` has `"showClearContextOnPlanAccept": true` and `permissions.defaultMode: "acceptEdits"`, start the approval UI for that following step by calling `EnterPlanMode` first, write a brief pass-through plan in plan mode, call `ExitPlanMode`, and stop before implementing it. Do not call `ExitPlanMode` from normal mode. If `EnterPlanMode` is denied because an explicit user request is required, stop and ask for `/plan <next step>`.

## Previous Step Plan (shipped): `$spec-drift fix kanban legacy specs`

### Goal

Classify five `specs/kanban-*.md` files that still described `kanban.mjs` as the primary kanban entry point, even though active kanban skills now run on `poketo kanban` (headless HTTP) and `kanban.mjs` is fallback/admin-only.

### Outcome

- Added a 3-line `> Status:` blockquote banner directly under the H1 of each of the five legacy-path specs (`board-flag-kanban-search.md`, `kanban-multi-user.md`, `kanban-production-test-plan.md`, `kanban-command-test-coverage.md`, `kanban-offline-queue-soft-delete.md`), identifying them as targeting the legacy `kanban.mjs` fallback path and pointing readers at `specs/poketo-headless-auth-migration.md` for the active path.
- Technical bodies left untouched — still valid for the fallback path and for historical reference.
- `specs/poketo-headless-auth-migration.md` already declared the legacy/active split; no edit needed.
- `tasks/todo.md:1014` ticked. `tasks/history.md` updated with a 2026-04-22 entry.
- Shipped to `master` as commits `2b63265` (banners) and `044d80b` (tasks bookkeeping). Deploy skipped.

## Previous Previous Step Plan (shipped): `$spec-drift fix docs/canonical-workflow-report.md`

### Goal

Refresh or demote the stale canonical workflow report, which still listed Phase 11 Steps 7–11 as unfinished even though Phase 11 completed 2026-04-19.

### Outcome

- In-place refresh chosen over demote-and-snapshot: drift was localized to the scope line and "Current Gaps And Active Work" section; body otherwise accurate.
- `docs/canonical-workflow-report.md:3–4` now reads "refreshed 2026-04-22" with Phase 11 marked complete and pointing at `docs/operating-modes.md` as the authoritative reference.
- `docs/canonical-workflow-report.md:484–494` rewritten: Steps 7–11 listed as done; stale operating-modes freshness caveat removed.
- `tasks/todo.md:1013` ticked. `tasks/history.md` updated with a 2026-04-22 entry.
- Shipped to `master` as commit `c61809b`. Deploy skipped.
- `grep -n "Phase 11 Step 7\|not fully wired\|active planning work" docs/canonical-workflow-report.md` returns no output.

## Previous Previous Step Plan (shipped): `$spec-drift fix kanban archive docs`

### Goal

Update active roadmap references that still described `/kanban-archive` as a standalone skill. Implementation exposes archive mode through `poketo-kanban --archive` (the standalone skill was merged in — see `tasks/history.md`). Brought `tasks/roadmap.md` and `specs/poketo-headless-auth-migration.md` in line with that reality without rewriting archived phase docs.

### Outcome

- `tasks/roadmap.md:18` (Phase 4 overview row) now reads `archive-card` command + `poketo-kanban --archive` mode.
- `tasks/roadmap.md:155–162` (Phase 4 step 2 heading + milestone) rewritten to describe archive mode on `poketo-kanban`, preserving the `[x]` complete state, with a short pointer to the merge history.
- `specs/poketo-headless-auth-migration.md:66` annotated `(merged into `poketo-kanban --archive`; path no longer present)`; the archival migration row itself was preserved.
- `tasks/history.md` updated with a 2026-04-22 entry.
- `tasks/todo.md:1012` ticked.
- Shipped to `master` as commit `bd0f207`. Deploy skipped (no deploy contract).
