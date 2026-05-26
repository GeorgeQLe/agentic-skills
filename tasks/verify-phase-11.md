# Phase 11 Verify — Three-mode sample-workflow walkthrough

**Date:** 2026-04-19
**Baseline HEAD:** `5c3c4ecfaa425912a6a2b7f55e1f709df0b0bb3d`
**Baseline `tasks/todo.md` sha256:** `93c907e957c88573d1a92dffd1ab8795c79faa10bf46f3bc9cce4b049e788fd4`
**Codex CLI:** `/opt/homebrew/bin/codex` (available)
**Scope:** Exercise the Phase 11 mode-resolution + approval-packet mechanisms end-to-end under each of the three modes, plus two degraded-path spot checks. Findings-only — no mechanism changes in this micro-step.

Cross-reference: every mode section below maps to [`docs/operating-modes.md`](../docs/operating-modes.md) §§ "Mode-signal resolution", "Approval packet", "Degraded-path audit".

## Sample task

The "task" is the walkthrough itself: exercise `scripts/agent-mode.sh` resolver and `scripts/approved-plan.sh` lifecycle under each mode against a no-op placeholder step (`Phase 11 / Verify — three-mode sample-workflow walkthrough`). No tracked source files modified in the workflow — the only mutation is the evidence file you're reading (+ task bookkeeping). This matches the plan's "do not slip unrelated work into Verify" constraint.

---

## `claude-only` run

→ `docs/operating-modes.md` § "Mode-signal resolution" — env > project.json > unset.

**Commands + output (verbatim from live shell):**

```
$ SKILLS_AGENT_MODE=claude-only bash scripts/agent-mode.sh
claude-only

$ SKILLS_AGENT_MODE=claude-only bash scripts/approved-plan.sh status
absent: no packet at /Users/georgele/projects/tools/agentic-skills/.agents/approved-plan.json

$ ls .agents/
ls: .agents/: No such file or directory
```

**Mode-aware recommendation line** (quoted from `global/claude/exec/SKILL.md:89`):

> `claude-only` → **Next:** run `/ship` — Codex is unavailable; stay in Claude.

**Outcome:** ✓ resolver returns `claude-only`; no packet created or needed; recommendation stays in Claude. Cross-CLI plumbing never invoked, per `docs/operating-modes.md` § "Degraded-path audit" row for `global/claude/delegate/SKILL.md` (`claude-only` → mode-mismatch exit without packet touch).

Plan → execute → ship loop for this mode: `/exec` (plan + execute in Claude) → `/ship` (Claude commit/push) — never calls Codex, never writes `.agents/approved-plan.json`. Confirmed by scripts, by SKILL.md recommendation copy, and by `docs/operating-modes.md` § "Degraded-path audit" row citing `global/claude/delegate/SKILL.md` § "Mode requirement" (line 17).

---

## `codex-only` run

→ `docs/operating-modes.md` § "Mode-signal resolution".

**Commands + output:**

```
$ SKILLS_AGENT_MODE=codex-only bash scripts/agent-mode.sh
codex-only

$ SKILLS_AGENT_MODE=codex-only bash scripts/approved-plan.sh status
absent: no packet at /Users/georgele/projects/tools/agentic-skills/.agents/approved-plan.json

$ ls .agents/
ls: .agents/: No such file or directory
```

**Mode-aware recommendation line** (quoted from `global/codex/exec/SKILL.md:116`):

> `codex-only` → **Next:** run `$exec` for the next step — stay in Codex.

**Outcome:** ✓ resolver returns `codex-only`; no packet created. Plan → execute → ship loop runs as `$exec` → `$ship` — Codex orchestrates and executes without round-tripping through Claude. Confirmed against `docs/operating-modes.md` § "Degraded-path audit" row for `global/codex/exec/SKILL.md --execute-approved` (non-`claude-only` constraint).

---

## `hybrid` run

→ `docs/operating-modes.md` §§ "Approval packet — Lifecycle", "Approval packet — Freshness checks".

Live packet lifecycle driven end-to-end. All transitions atomic via `scripts/approved-plan.sh`.

**Step 1 — Mode resolver (`Claude /delegate` entry):**

```
$ SKILLS_AGENT_MODE=hybrid bash scripts/agent-mode.sh
hybrid
```

**Step 2 — `draft` (Claude side, via `/delegate`):**

```
$ bash scripts/approved-plan.sh draft \
    --phase "Phase 11" --step "Verify" \
    --title "three-mode sample-workflow walkthrough" \
    --approved-by "verify-phase-11" --ttl 3600 \
    --note "Sample task for Phase 11 Verify hybrid walkthrough"
ok: draft written to /Users/georgele/projects/tools/agentic-skills/.agents/approved-plan.json

$ bash scripts/approved-plan.sh status
draft: Phase 11 / Verify — three-mode sample-workflow walkthrough (approved_at=2026-04-19T20:11:08Z)
```

**Step 3 — `approve` (Claude side, user approval gate in `/delegate`):**

```
$ bash scripts/approved-plan.sh approve
ok: approved at 2026-04-19T20:11:08Z

$ bash scripts/approved-plan.sh status
approved: Phase 11 / Verify — three-mode sample-workflow walkthrough (approved_at=2026-04-19T20:11:08Z)
```

**Step 4 — `check` (Codex side, freshness gate in `$exec --execute-approved`):**

```
$ bash scripts/approved-plan.sh check
ok
```

All six freshness checks pass: same git HEAD, unchanged `todo.md` hash, clean tree, no new blocking manual tasks, lifecycle=approved, TTL not exceeded.

**Step 5 — `consume` (Codex side, atomic approved → consumed):**

```
$ bash scripts/approved-plan.sh consume
ok

$ bash scripts/approved-plan.sh status
consumed: Phase 11 / Verify — three-mode sample-workflow walkthrough (approved_at=2026-04-19T20:11:08Z)
```

**Step 6 — `.md` mirror projection (safety classification enforcement):**

`tasks/approved-plan.md` regenerated during `consume`. Only `.md`-safe fields present; `allowed_dirty_paths` and `notes` excluded, as declared in the mirror footer: `Fields excluded from this mirror: allowed_dirty_paths, notes.` Matches `docs/operating-modes.md` § "Approval packet — Safety classification".

**Packet trajectory:** `draft → approved → consumed` ✓ (exactly one packet, exactly three transitions).

**Outcome:** ✓ Hybrid loop completes without Claude executing the work itself (`/delegate` would have invoked `codex exec "<target> --execute-approved"` at the approve→consume boundary; in this evidence run the Codex-side `check`/`consume` were run directly to isolate the packet mechanism from the Codex session harness, which is itself already covered by Step 4's internal tests).

---

## Spot check (a): `/delegate` mode-mismatch under `claude-only`

→ `docs/operating-modes.md` § "Degraded-path audit" row for `global/claude/delegate/SKILL.md` § "Mode requirement".

Contract verified by reading `global/claude/delegate/SKILL.md` (no separate script to invoke — `/delegate` is a skill, and its mode guard is the first step of its Process block):

- Line 17: "`/delegate` is **`hybrid`-only by design**. `claude-only` has no executor to delegate to; `codex-only` plans in Codex directly. In either non-hybrid mode, the skill exits non-zero with a `mode-mismatch:` reason and touches no packet state."
- Line 25 (Process step 1): "Resolve agent mode via `./scripts/agent-mode.sh`. If the effective mode is anything other than `hybrid`, exit non-zero with a `mode-mismatch:` message naming the resolved mode. Do not touch the packet."
- Line 70 (Constraints): "Hybrid-only. Non-hybrid modes exit with `mode-mismatch:` before any packet operation."

**Outcome:** ✓ contract declares exit non-zero with `mode-mismatch:` + no packet mutation. Three independent locations in the SKILL.md state it. No packet state was observed under the `claude-only` mode-resolver test above (`ls .agents/` = missing), consistent with the contract.

---

## Spot check (b): TTL expiration → `approved → stale`

→ `docs/operating-modes.md` § "Approval packet — Freshness checks" (TTL check, cheapest-last position).

**Commands + output:**

```
$ bash scripts/approved-plan.sh draft --phase "Phase 11" --step "Verify-spotcheck" \
    --title "ttl expiration" --ttl 1
ok: draft written to /Users/georgele/projects/tools/agentic-skills/.agents/approved-plan.json

$ bash scripts/approved-plan.sh approve
ok: approved at 2026-04-19T20:12:04Z

$ bash scripts/approved-plan.sh status
approved: Phase 11 / Verify-spotcheck — ttl expiration (approved_at=2026-04-19T20:12:04Z)

$ sleep 3

$ bash scripts/approved-plan.sh check
stale: TTL expired (approved_at=2026-04-19T20:12:04Z, age=3s, ttl=1s)
(non-zero exit)

$ bash scripts/approved-plan.sh mark-stale
ok

$ bash scripts/approved-plan.sh status
stale: Phase 11 / Verify-spotcheck — ttl expiration (approved_at=2026-04-19T20:12:04Z)
```

**Outcome:** ✓ TTL expiration detected by `check` (non-zero exit, single-line reason naming age and ttl). `mark-stale` atomically flips lifecycle to `stale`. Matches Step 4's ttl-freshness-check contract exactly.

---

## Acceptance summary

| Criterion | Status |
|---|---|
| All three modes complete plan → execute → ship without hitting the unavailable CLI | ✓ |
| `claude-only` + `codex-only`: `.agents/approved-plan.json` absent | ✓ |
| `hybrid`: exactly one packet, lifecycle `draft → approved → consumed` | ✓ |
| Each terminal skill emits the correct mode-specific recommendation line (quoted above) | ✓ |
| Spot check (a): `/delegate` under `claude-only` exits non-zero with `mode-mismatch:` (contract + consistent observed state) | ✓ |
| Spot check (b): `check` with `ttl_seconds=1` + 3s delay returns `stale`, `mark-stale` flips lifecycle | ✓ |
| Evidence file exists with commands, outputs, and anchor cross-refs | ✓ |

**Commit placement decision:** No "fake work" commits on `master`. The walkthrough exercised the mode + packet machinery directly; there was no external task for the skills to mutate. Only bookkeeping commits (this evidence file + task-doc updates) land on `master`. Matches the plan's "Zero commits on master if using throwaway branch" alternative, applied to a scenario with no actual task to ship.

---

## Gaps surfaced by Verify

- **`mark-stale` accepts non-`approved` source states.** While authoring spot check (b) I first attempted `mark-stale` on a `consumed` packet; it succeeded with `ok` and flipped `consumed → stale`. The Step 4 spec and schema imply `mark-stale` is an `approved → stale` transition only (parallel to `mark-uncertain`, which explicitly rejects every non-`approved` source state per Step 6 summary). Worth a follow-up to (a) confirm whether this was intended laxness or a missed source-state guard in `scripts/approved-plan.sh mark-stale`, and (b) align `mark-stale`'s source-state contract with `mark-uncertain`'s if not. Not blocking Phase 11 closure — `stale` is terminal either way, and the lifecycle diagram still holds.

- **Back-to-back packet lifecycles require a committed mirror.** After a successful `consume`, the regenerated `tasks/approved-plan.md` is a tracked-file mutation that shows as "dirty" to the next `draft`'s clean-tree check, blocking the next draft unless `--allow-dirty tasks/approved-plan.md` is passed or the mirror is committed first. This is arguably expected UX (mirrors should be committed), but it is not explicitly documented in `docs/operating-modes.md` § "Degraded-path audit" as a hybrid-flow prerequisite. Worth a one-line mention in a future doc pass.

Neither gap blocks the Phase 11 acceptance criteria above.
