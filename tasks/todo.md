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
- [ ] **Step 2** — Mode resolution:
  - Add `agent_mode: "claude-only" | "codex-only" | "hybrid"` to `.agents/project.json` schema
  - Add `SKILLS_AGENT_MODE` env var override (not `AGENT_MODE` — collision risk)
  - Resolution precedence: env > project.json > unset (skills recommend all paths)
- [ ] **Step 3** — Shared approval/delegation packet schema:
  - `.agents/approved-plan.json` — gitignored, machine-readable source of truth
  - `tasks/approved-plan.md` — sanitized human-readable mirror
  - Explicit field-level safety classification (which fields are safe for `.md` vs JSON-only)
  - Fields: step identity (Phase N / Step N.X / normalized title), approval timestamp, git HEAD, `tasks/todo.md` hash, allowed dirty paths, blocking manual-task snapshot, approval age TTL
  - Lifecycle states: `draft` → `approved` → `consumed` | `stale` | `superseded` | `uncertain`
- [ ] **Step 4** — `$run --execute-approved` (Codex) — consumes packet, skips approval if `approved` + all freshness checks pass. Freshness: same git HEAD, unchanged `todo.md` hash, clean tree or dirty only on allowed paths, no new `_(blocks: Step N.X)_` entries, age under TTL. On failure, re-prompt with diff. Transitions `approved → consumed` or `approved → stale`.
- [ ] **Step 5** — `/handoff --target=codex` (Claude) — extend existing `/handoff` to produce the approval packet as async task brief. Covers "Codex cloud delegation coming soon" case and claude-only users who plan to execute in Codex later.
- [ ] **Step 6** — `/delegate` (Claude) — live in-session delegation to Codex, consumes same packet format. Safe-fallback semantics:
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
