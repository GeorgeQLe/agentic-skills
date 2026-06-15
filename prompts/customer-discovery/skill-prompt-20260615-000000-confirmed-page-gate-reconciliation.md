---
skill: customer-discovery
agent: claude
captured_at: 2026-06-15
source: user-invocation
prompt_scope: visible-user-invocation
---

Implement the following plan:

# Plan: Close the confirmed-page gate-reconciliation gap (customer-discovery + shared alignment contract)

## Context

A verified incident (session-triage): in the `alignmeant` consumer repo, the `customer-discovery`
skill marked an alignment page `data-alignment-status="confirmed"` while it still contained an
**active, stale gate question** — the Primary ICP gate still offered "Approve Skillpacks maintainers
plus workflow reviewers..." even though the user's final compiled YAML had selected Candidate B
(workflow reviewers) and the canonical `research/alignmeant/icp.md` already reflected that. The page
also retained active radio inputs and a "Compile Responses" section, violating the confirmed-page
contract. A human had to hand-patch the stale label.

**Root cause.** The shared alignment contract says confirmed pages must *remove active controls* and
*preserve decisions as read-only records*, but it does **not** require the agent to **reconcile each
displayed gate decision against the final compiled YAML / canonical artifact**, nor to **render an
`other`/freeform selection as the read-only decision and drop the superseded generated options**, nor
to run any **post-confirmation self-check** before handoff. The per-skill Stage-3 step in
`customer-discovery` SKILL.md only says "convert the alignment page to `confirmed` with the approval
record preserved" — no concrete validation. The agent therefore stripped *some* controls but left a
stale gate intact.

**Intended outcome.** Add an explicit reconcile-then-verify step to the contract so confirmed pages
provably match the final decisions, with no active gate controls left behind. The fix lands in the
**canonical source in this repo** (`agentic-skills`) and propagates to every consumer (including
`alignmeant`) on the next `skillpacks refresh`.

(Full plan body as provided in the invocation: convention edit at line 93/97, both customer-discovery
SKILL.md mirrors Stage 3 + version bump, regenerate bundled ALIGNMENT-PAGE.md via
scripts/upgrade-alignment-page.mjs, verification, ship to master.)
</content>
</invoke>
