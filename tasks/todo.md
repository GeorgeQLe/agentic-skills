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

- [ ] Any mode can complete the full plan → execute → ship → deploy loop without requiring the unavailable CLI
- [ ] A user switching modes mid-project can continue with a degraded path, not a dead end
- [ ] `$run --execute-approved` would have eliminated the ~385 bare-`y` Codex approvals without allowing stale-plan execution
- [ ] Every cross-tool touchpoint in `docs/operating-modes.md` has a declared degraded path or hard mode requirement
- [ ] Pack content differs between CLIs by role (framing/research vs execution/reconciliation), not just invocation syntax
- [ ] Expert delegation pattern (Claude → Codex in-session) works via `/delegate` without leaving the Claude session

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
- [ ] **Step 7** — Mode-aware terminal recommendations across `/plan-interview`, `/roadmap`, `/plan-phase`, `/run`, `/ship`, `/ship-end` (and Codex equivalents):
  - `hybrid` → "delegate with `/delegate $run`"
  - `claude-only` → "run `/run`"
  - `codex-only` → "run `$run` in Codex"
  - unset → present all options
- [ ] **Step 8** — Degraded-path audit with concrete output: populate a table in `docs/operating-modes.md`:

  | Skill | Assumes | Fails how if unavailable | Degraded path |

  Covers: `/run`, `/ship`, `/ship-end`, `$run`, `$ship`, `$ship-end`, kanban variants, pack wrappers that recommend the other CLI. Every row has a filled degraded path or explicit "requires mode X" constraint.
- [ ] **Step 9** — Pack emphasis split by CLI role:
  - Claude pack skills → framing, interviews, strategy, requirements, research synthesis, tradeoffs
  - Codex pack skills → implementation, reconciliation, validation, task promotion, repo mutation, shipping
  - Not every skill needs both versions; document which packs skew which direction
- [ ] **Step 10** — Pack-aware `$run` on Codex — read `.agents/project.json.enabled_packs`, recommend/route to relevant pack skill when work matches
- [ ] **Step 11** — Expand `docs/operating-modes.md` to authoritative reference:
  - Complete mode-signal resolution rules
  - Approval packet schema + lifecycle diagram
  - Populated degraded-path audit table from step 8
  - Migration guide from parity-mirror model
- [ ] **Verify:** Run through all three modes on a sample workflow; confirm each mode completes plan → execute → ship without hitting the unavailable CLI

### Step 6 Summary (completed 2026-04-19)

- Added `scripts/approved-plan.sh mark-uncertain`: atomic `approved → uncertain` transition (`<file>.tmp` + `mv`), mirroring `mark-stale`. Rejects every non-`approved` source state (`draft`, `consumed`, `stale`, `superseded`, `uncertain`) with a clear single-line reason + non-zero exit. Usage help and dispatch case updated.
- Shipped `global/claude/delegate/SKILL.md`. Argument-hint `"[target-skill] [--allow-dirty <glob>] [--inline-fallback]"`. Workflow: mode-resolve via `scripts/agent-mode.sh` (hybrid-only; `claude-only` and `codex-only` exit with `mode-mismatch:`) → derive `phase`/`step`/`title` from the first unchecked `- [ ]` under `### Active Step Plan` (fallback: first unchecked under the current `## Phase N`) → `approved-plan.sh draft …` with any `--allow-dirty` flags → pretty-print packet → one concise approval question → `approve` → synchronous `codex exec "<target-skill> --execute-approved"` with start-marker timestamp captured before the call.
- Three-branch safe-fallback matrix documented explicitly — **never blind-retry cross-CLI**:
  - **Pre-start failure** (no `codex` binary, auth failure, start marker never printed) → packet stays `approved`; prompt inline-in-Claude vs keep-for-later; `--inline-fallback` auto-selects inline; `agent-team` profile requires explicit confirmation for the inline downgrade.
  - **Success** (exit 0 + `Approved packet consumed: …` + `tasks/approved-plan.md` shows `lifecycle: consumed`) → report success; Step 4's `consume` already flipped the lifecycle.
  - **Ambiguous** (non-zero exit or timeout after start marker) → `mark-uncertain`, then prompt inspect / discard (`supersede`) / continue inline. Never auto-retries.
- Contract untouched: no edits to `docs/operating-modes.md` or `specs/approved-plan.schema.json`. `uncertain` already existed in the schema enum; Step 6 is just its first writer. Codex side remains consumer-only.
- Verified `mark-uncertain` with fixture packets: happy path flips `approved → uncertain` atomically; each non-`approved` source state (`draft`, `consumed`, `stale`, `superseded`, `uncertain`) exits non-zero with a matching reason.

### Active Step Plan — Step 7: Mode-aware terminal recommendations

**Goal:** Wire mode-aware terminal recommendations across the planning and execution skills so that after presenting a plan or completing its workflow, each skill points the user at the appropriate next-step invocation based on the resolved agent mode. Steps 4–6 shipped the mechanisms (`$run --execute-approved`, `/handoff --target=codex`, `/delegate`); Step 7 is the discoverability layer that makes users actually reach for them instead of falling back to the pre-Phase-11 "run it manually" habit.

**Contract reminder:** Mode resolution is frozen at `scripts/agent-mode.sh` with precedence `SKILLS_AGENT_MODE` env > `.agents/project.json.agent_mode` > unset. Valid values: `claude-only`, `codex-only`, `hybrid`, or empty. Step 7 only *reads* the resolved mode; it does not add new mode values, new env vars, or change precedence.

**Scope:**

1. **Add a shared "Mode-aware next-step recommendation" block** to each planning/execution skill. The block appears after the skill's primary work completes (plan written, run finished, ship done) and before the skill hands back to the user. Source the mode via `./scripts/agent-mode.sh` (no inline logic duplication). Output copy by resolved mode:
   - `hybrid` → "**Next:** delegate with `/delegate <target>`" (target matches the skill's natural next move: `$run` after plan skills, `$ship` after `/run`, etc.).
   - `claude-only` → "**Next:** run `/run`" (or `/ship` / `/ship-end` where contextually right).
   - `codex-only` → "**Next:** run `$run` in Codex" (match Codex skill name to the context).
   - unset → present all three options and point at `docs/operating-modes.md` for the mode-signal resolution rules.

2. **Claude skills to modify** (paths relative to repo root; touch each):
   - `global/claude/plan-interview/SKILL.md` — after writing the spec, recommend the next step (typically `/roadmap` or `/plan-phase`, but the cross-CLI recommendation applies once execution begins).
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

- `/Users/georgele/projects/tools/agentic-skills/global/claude/plan-interview/SKILL.md`
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

- **One shared block, not six bespoke ones.** Copy the exact same recommendation-block text into each touched skill (minor target-skill substitution is OK). Skills-level wording drift is how modes become inconsistent. If future edits need to change the copy, a grep for a distinctive phrase ("resolved agent mode via `scripts/agent-mode.sh`") should find every copy.
- **Unset is not a failure.** A project that hasn't picked a mode yet should still see useful guidance. The unset branch lists all three options; it does not force a mode.
- **Codex-side inversion.** In `hybrid`, Claude orchestrates and Codex executes. A Codex skill in `hybrid` mode should therefore recommend *returning to Claude* for the next orchestration step, not delegating further. Spell this out in the Codex-side copy.
- **Don't recurse into `/delegate` infinitely.** `/delegate` is itself one of the mechanisms. Its own SKILL.md should NOT add a "next: delegate" recommendation block — that would be tautological.
- **Keep the block compact.** 3–5 lines max, matching the existing terse skill conventions. No ASCII tables.

**Conventions from prior work:**

- Skill edits follow the existing numbered-step structure. Insert the recommendation block as a new numbered step (or an explicit sub-section) at the natural end of the workflow, not as a sibling top-level section.
- Read the resolved mode via `./scripts/agent-mode.sh` (relative to project root) — same invocation pattern that `/handoff --target=codex` and `/delegate` use.
- No Bash 3.2 portability concerns here — the recommendation is instruction text in SKILL.md, not shell code.

**Test strategy (tests-after, per Execution Profile `serial`):**

1. Grep verification: every skill listed in the Files-to-modify section contains the distinctive phrase from the recommendation block. A single `grep -l` run with the phrase returns exactly the expected file list.
2. Mode-branch coverage: each touched skill's recommendation section names all three modes plus the unset case explicitly.
3. No-recurse verification: `global/claude/delegate/SKILL.md` and `global/claude/handoff/SKILL.md` do NOT contain the recommendation block.
4. Codex-side inversion: Codex-skill recommendation blocks for `hybrid` reference returning to Claude (e.g. "return to Claude"), not "delegate with `/delegate`".
5. Dry-run sanity: set `SKILLS_AGENT_MODE=hybrid`, `=claude-only`, `=codex-only`, and unset in a fixture; confirm the resolved mode shows up in the recommendation text the skill would render (manual walk-through, since skills are prose).
6. Schema/contract unchanged: `docs/operating-modes.md` and `specs/approved-plan.schema.json` untouched; `scripts/agent-mode.sh` untouched.

**Acceptance criteria:**

- [ ] Every Claude skill in scope (plan-interview, roadmap, plan-phase, run, ship, ship-end) emits the mode-aware recommendation block.
- [ ] Every present Codex equivalent (run, plus ship/ship-end if they exist) emits the inverted mode-aware recommendation block.
- [ ] `/delegate` and `/handoff` do NOT emit the block (no recursion).
- [ ] `tasks/todo.md` Step 7 checked off and Active Step Plan rolled to Step 8 (degraded-path audit).
- [ ] Contract files (`docs/operating-modes.md`, `specs/approved-plan.schema.json`, `scripts/agent-mode.sh`) untouched.

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

- [ ] `global/claude/delegate/SKILL.md` exists, is hybrid-only gated, produces the packet via Step 5 helpers, invokes Codex via `codex exec`, and handles the three fallback branches without blind retry.
- [ ] `scripts/approved-plan.sh mark-uncertain` exists, transitions `approved → uncertain` atomically, and rejects all non-`approved` source states.
- [ ] End-to-end fixture: `/delegate` invoking a stubbed Codex that runs `$run --execute-approved` drives a packet through `draft → approved → consumed` without Claude restarting the session.
- [ ] Ambiguous-failure fixture lands the packet in `uncertain` and surfaces the inspect/discard/continue prompt.
- [ ] Schema and lifecycle FSM unchanged (`docs/operating-modes.md` and `specs/approved-plan.schema.json` untouched).
- [ ] `tasks/todo.md` Step 6 checked off and Active Step Plan rolled to Step 7.

**Out of scope (do not drift):**

- Step 7 (mode-aware terminal recommendations). `/delegate` is the mechanism; the skill-level recommendations that point users to it land in Step 7.
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

- [ ] `scripts/approved-plan.sh {draft,approve,supersede,status}` exist, are executable, and pass tests 1–6 above.
- [ ] `global/claude/handoff/SKILL.md` documents `--target=codex`, derives step identity from `tasks/todo.md`, and presents the packet for a single approval question before writing the handoff doc.
- [ ] Full Claude-side produce → Codex-side consume loop works end-to-end on a local fixture: `/handoff --target=codex` produces an `approved` packet, `$run --execute-approved` consumes it, the `.md` mirror ends up `lifecycle: consumed`.
- [ ] No change to `docs/operating-modes.md` § "Approval / Delegation Packet" or `specs/approved-plan.schema.json` (schema and lifecycle stay stable).
- [ ] `tasks/todo.md` Step 5 is checked off and Active Step Plan rolls to Step 6.

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

- [ ] `scripts/approved-plan.sh {check,consume,mark-stale}` exist, are executable, and pass all seven test cases above.
- [ ] `global/codex/run/SKILL.md` documents `--execute-approved`, and inspecting its flow on a valid approved packet skips the plan-approval gate and logs the one-line consumption message.
- [ ] On any freshness failure, the packet is transitioned to `stale` and the user is re-prompted with the standard approval flow — never a blind retry.
- [ ] No change to `docs/operating-modes.md` § "Approval / Delegation Packet" beyond optional clarifying edits (schema and lifecycle stay stable).
- [ ] `jq` dependency is documented in SKILL.md; absence produces a clear install hint rather than a fragile fallback.
- [ ] `tasks/todo.md` Step 4 is checked off and the Active Step Plan rolls to Step 5.

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
- Recommendations after primitives exist so they point to working skills
- Audit after behavior is implemented — auditing unshipped code produces aspirational rows
- Pack work after core model stabilizes — pack differentiation assumes mode-awareness
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
