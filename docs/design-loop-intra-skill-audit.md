# Audit: Intra-Skill Session Loops + a `design-inspirations` Skill for Prototype-Phase Design Skills

> **Status: non-normative audit / recommendation.** This document modifies no `SKILL.md`,
> convention, manifest, schema, or build mirror. It answers two questions with cited evidence and
> ends in a phased, effort/risk-tagged course of action so the user can pick scope for a follow-up
> implementation plan. Part D additionally surfaces a structural concurrency risk (the global-singleton
> implementation ledger) that motivated the design — its fix is deferred to a separate plan. All actual
> edits are explicitly deferred (see § Out of Scope).
>
> Companion reading: `docs/prototype-session-loop-convention.md`,
> `docs/research-session-loop-convention.md`, `docs/orchestrator-convention.md`,
> `docs/skill-versioning.md`.

## Why this audit exists

After the four Pattern A research orchestrators migrated to the Research Session Loop
(`docs/research-session-loop-convention.md`), the question was raised whether the design-planning
skills — `ux-variations`, `ui-interview`, `user-flow-map` — should adopt the same **same-skill
self-re-invocation** to progress through their steps, partly on the premise that "they do web
searches for inspiration."

Exploration corrected two premises before any recommendation could be made:

1. **A design-side loop already exists.** `docs/prototype-session-loop-convention.md` is the design
   analog of the research loop. All three skills already follow it
   (`ux-variations/SKILL.md:18`, `ui-interview/SKILL.md:25`, `user-flow-map/SKILL.md:23`). They
   already chunk heavy work across fresh contexts — but by **cross-skill chaining**
   (`user-flow-map` → `/ux-variations` → `/ui-interview` → `prototype` →
   `consolidate-variations`), encoded in the flow-tree manifest `route` field
   (`design/flow-tree.schema.json:33-56`; `user-flow-map/SKILL.md:49`) — **not** by a single skill
   re-invoking itself. State is the flow-tree manifest plus canonical-artifact existence, and these
   skills explicitly opt **out** of Pattern A run manifests and `tasks/todo.md`
   (`prototype-session-loop-convention.md:31`; `ux-variations/SKILL.md:18,47-48`).

2. **These skills do no web search.** They are deliberately *local-evidence-driven*. `ui-interview`
   explicitly *deprioritizes* "apps you admire" and uses project evidence
   (`ui-interview/SKILL.md:127` — "Reference and inspiration questions ('apps you admire?') are
   low-priority. Ask once early, accept any answer including 'none' … Do not block the interview on
   reference input."). `grep` confirms **none** of the three skills reference `WebSearch`/`WebFetch`;
   the repo's web harnesses live in `customer-discovery` and the business-research/business-growth
   skills (verified below). So "they do web searches for inspiration" is **not true today.**

Two genuinely new ideas remain, and this audit evaluates each:

- **Part A** — a *second, intra-skill* level of chunking: one **unit** (one variation, one page) per
  cold session, advanced by the skill re-invoking **itself** — distinct from the existing cross-skill
  chaining that already chunks at the branch level.
- **Part B** — a new **`design-inspirations`** skill that gathers inspiration once (the one place web
  search belongs) and feeds all prototype skills, resolving the "web search for inspiration" concern
  without reversing the other skills' local-evidence stance.

---

## Reframed goal (user directive): minimize per-session context via substep chunking + a shared context brief

> **This section supersedes the cost/benefit weighting in the first draft of Part A.** The user's
> stated objective is to **minimize the context window each agent session consumes** before clearing
> context and starting the next step, by **chunking steps into substeps** that each run in a fresh
> session, with **a shared document each agent reads to gain just enough context to do its current
> substep.** Context minimization is the goal, not a benefit to be weighed against complexity — so the
> verdicts below shift from "is it worth it?" to "what is the cleanest mechanism, and where does it
> give the most relief?"

The shared document is the missing piece, and it is exactly what neutralizes the two objections that
made the first-draft verdicts lukewarm. It is the design-loop analog of the research loop's
**"complete context transfer" handoff** — the preliminary interview handoff that "must carry … detected
mode, context summary, recommended subset with rationale, and any user answers"
(`research-session-loop-convention.md:116`) so the *next cold session builds the next thing reading
only that file.*

### Three-tier state model

To run one substep per cold session without re-reading everything, a session bootstraps from three
bounded inputs instead of the full conversation + all prior artifacts:

| Tier | Artifact | Role | Lifecycle |
|---|---|---|---|
| **Machine cursor** | flow-tree manifest (`design/**/flow-tree-*.yaml`) | Names *which committed branch state* exists; the post-approval source of truth (unchanged from today) | Permanent |
| **Shared context brief** *(new)* | `design/{slug}/_working/{skill}-{topic}-brief.md` | Compact prose: distilled setup + carried decisions — **pure context, no step list.** It carries *what every substep needs to know* (assumptions, constraints, theses, criteria, carried decisions), never *which step is next*. **This is the "enough context to do the current substep" doc.** | `_working/`, throwaway, archived at canonical write |
| **Per-substep intermediates** *(new)* | `design/{slug}/{skill}-{topic}/{unit-id}.md` | The actual work product of each substep, accumulating one file per unit; assembled into proposed review content for the HTML alignment page. **Their existence IS the cursor** — the next substep is the first unit whose intermediate file does not yet exist (mirroring the research loop's "progress = file existence", `research-session-loop-convention.md:100`). | `_working`-band until the final gate, then written to canonical only after approval |

### The per-session shape (research loop's unifying rule, applied intra-skill)

```
(read brief + scan which intermediates already exist)   ← light, BOUNDED context bootstrap
   → (do exactly ONE substep: the first unit with no intermediate file yet)  ← the only heavy work; writes one intermediate
      → (append any new shared facts to the brief)        ← light tail
         → STOP, naming the same skill for re-invocation
```

**Why a brief and not "just read the prior intermediates."** Reading all prior substep outputs grows
context *linearly with progress* — the opposite of the goal. The brief is **bounded**: it carries
forward only the distilled shared context and a short decision log, never the full body of every prior
substep. Session cost stays roughly constant (small brief + one unit) instead of climbing as the run
proceeds. That bounded-cost property is the whole point.

### How the brief resolves the two first-draft objections

1. **"Schema change needed for the cursor" (first-draft shared finding 3) — resolved, no schema
   change.** The **substep cursor is intermediate-file existence**, not a field in any tracked
   artifact: the next substep is the first unit whose intermediate file
   (`design/{slug}/{skill}-{topic}/{unit-id}.md`) does not yet exist — the exact "progress = file
   existence" rule the research loop already proves (`research-session-loop-convention.md:100`). The
   intermediates live under `_working/`-band state, the analog of the research loop's working packets,
   which also live under `_working/` and are archived on commit
   (`research-session-loop-convention.md:84-104,119-124`). Because the cursor is the filesystem, the
   flow-tree manifest keeps recording only **committed, post-approval** branch state (its existing
   `status` enum is sufficient), so `flow-tree.schema.json` does **not** need a new enum value or
   sub-node for chunking — and the brief itself holds **no cursor at all**, leaving it a pure
   context-transfer artifact exactly like the research handoff. This drops the effort and risk of the
   Part-A items materially versus the first draft.

2. **"One approval gate per unit multiplies friction" (first-draft shared finding 4) — resolved by
   one-final-gate.** The substep sessions are **pre-approval drafting** into `_working/`; there is
   still exactly **one** binding alignment-page `review → confirmed` gate at the end, after the
   intermediates are assembled. This respects "checkpoint confirmations are not final approval"
   (`prototype-session-loop-convention.md:70`) and preserves the whole-set comparison UX
   (`ux-variations/SKILL.md:113-123`): the user reviews the assembled set once, not five times.

### Relationship to plan mode

Making the brief **pure context** with no step list is what lets it sit cleanly alongside a plan-mode
plan instead of competing with it. The two artifacts live at different altitudes and serve different
jobs:

| | Plan (plan mode) | Shared context brief |
|---|---|---|
| **Carries** | What to do, in what order, and why | The context payload a substep needs (assumptions, constraints, theses, criteria, carried decisions) |
| **Approval** | User-approved via ExitPlanMode; an approval surface | Not an approval surface — read and appended every session |
| **Lifecycle** | Write-once, approved, then executed | Living `_working/` doc; grows by appended facts, archived at canonical write |
| **Owns the step order?** | Yes (when one is used) | No — never |

**Three levels of "what's next."** Progress decomposes into three nested levels, and plan and brief
sit at different ones, so they do not collide:

1. **Cross-skill pipeline** — which skill runs next (`user-flow-map` → `ux-variations` → …). Owned by
   the flow-tree manifest `route` field, or by a plan-mode plan when the user wants explicit ordering.
2. **Intra-skill substeps** — which unit within a skill runs next (the loop this audit proposes).
   Owned by **intermediate-file existence**, not a plan and not the brief.
3. **The substep work itself** — building one unit. The brief supplies the context for it.

A plan-mode plan operates at level 1 (and the work inside any one substep at level 3); the loop's
cursor operates at level 2. They never own the same decision.

**The trap, and the fix.** If the brief carried a substep checklist *and* a plan or `tasks/todo.md`
also owned the step list, the run would have **two cursors that drift** — the checklist and the plan
disagree about which unit is done, and a cold session cannot tell which is authoritative. The fix is a
**single cursor**: intermediate-file existence is the one source of substep progress, and the brief
stays pure context with no list to drift against.

**Why the exec ledger is out of scope here, by convention.** Level 2 deliberately does *not* route
through `tasks/todo.md` + `/exec`: the prototype and research loops forbid driving design/research
branch progress through that ledger (`prototype-session-loop-convention.md:66,76-83`;
`research-session-loop-convention.md:4,31`). The brief + intermediate files are the *sanctioned
substitute* for tracking substep progress in these loops — not a rival to `tasks/todo.md`, but the
thing that stands in for it where `tasks/todo.md` is off-limits. (The flip side — what happens when a
product genuinely *is* in the implementation exec loop while a sibling product spins up design work —
is the concurrency risk in Part D.)

**Where plan mode fits.** Plan mode earns its keep at the **setup session**, where the user and agent
agree the chunking (how many units, where the boundaries fall, what the brief must carry). The
per-substep sessions are small and mechanical — read brief, build the one missing unit, append facts —
so they can skip plan mode unless a single unit is unusually gnarly. Binding user approval remains the
**alignment page** at the assemble-then-approve gate, exactly as today; plan mode at setup is about
agreeing the decomposition, not granting final approval.

### Scope decision: per-skill-run brief (recommended) vs. one pipeline-wide brief

A genuine fork for the follow-up plan:

- **Recommended — per-skill-run brief.** One brief per skill invocation
  (`{skill}-{topic}-brief.md`), scoped to that skill's substeps. Cross-skill context continues to flow
  through the canonical artifacts + flow-tree manifest exactly as today (those already serve the
  cross-skill loop well). Smallest change; each brief stays small and focused.
- **Alternative — one pipeline-wide brief.** A single `design/{slug}/{topic}-context.md` shared across
  `user-flow-map` → `ux-variations` → `ui-interview`. Richer cross-skill continuity, but the brief
  grows across the whole pipeline (working against the bounded-cost property) and overlaps the
  manifest's job. Recommend only if cross-skill context loss proves to be a real problem.

Default to the per-skill-run brief; revisit the pipeline-wide variant if needed.

---

## Evidence base (what was read)

| Source | What it established |
|---|---|
| `docs/prototype-session-loop-convention.md` | The design loop: state = flow-tree manifest + canonical-artifact existence; **no Pattern A run manifest**; `tasks/todo.md` is off-limits for branch progress (lines 8, 18, 31, 43). Phases are cross-skill (lines 49-55). "Each phase may run in a fresh context when the branch is heavy" (line 57). |
| `docs/research-session-loop-convention.md` | The research loop's unifying rule: "one heavy phase per session, light bookends" (lines 34-44). Unit = one heavy research phase; progress = canonical-intermediate file existence (lines 80-104). The per-framework intermediate `research/{orch}-{fw}.md` model (lines 106-117). |
| `ux-variations/SKILL.md` | Heavy per-unit phase = step 7 "Specify each approved variation enough to build" (lines 125-140), N≈5 (line 96). All units land in **one** doc `design/ux-variations-[topic].md` (line 158). Flow-tree cursor = `branches[].ux_variations[]` entries with `id/label/status` (lines 46, 160). |
| `ui-interview/SKILL.md` | Heavy phase = the per-branch "Branch review loop" steps 4-6 (lines 76-119); already one branch per run. One alignment-page approval gate per run (step 9, lines 135-144). Deprioritizes inspiration (line 127). |
| `user-flow-map/SKILL.md` | Owns the wireframe-tree root + build-plan synthesis (line 23). Its N-unit fan-out **is** downstream `/ux-variations` calls (line 19). Already emits a fresh-context stop/continue handoff (lines 191-198). |
| `design/flow-tree.schema.json` | `additionalProperties: false` throughout. `ux_variation_branch` requires `id/label/status/artifacts/ui_reviews` (lines 204-232). `status` enum has no "spec-drafted-not-approved" intermediate value (lines 90-101). A per-sub-unit cursor *in the manifest* would be a schema change — **but the reframe makes the cursor intermediate-file existence under `design/{slug}/{skill}-{topic}/` instead, so no schema change is required** (see § Reframed goal). |
| `docs/orchestrator-convention.md` | Pattern A vs B vs C. Pattern A = framework decomposition + synthesis, self-advancing via the Research Session Loop (lines 33-113). |
| `docs/skill-versioning.md` | Decimal bump for behavioral change; archive prior `SKILL.md` to `archive/<old>/`; `CHANGELOG.md` entry; mirror parity across `{claude,codex}` (lines 14-35, 136-142). |
| `grep` web-harness scan | `WebSearch`/`WebFetch` appear in `customer-discovery` (lines 184, 560, 599), `enterprise-icp:70`, `growth-model:86`, and ~10 other business skills — **never** in the three design skills. `deep-research` is a built-in harness skill, not a repo file. |
| Mirror parity | `ux-variations` v0.20, `ui-interview` v0.22, `user-flow-map` v0.8 — `claude`/`codex` versions match; any change is a lockstep two-mirror edit. |

---

## Part A — Intra-skill self-re-invocation audit (per skill)

Given the reframed goal, the question per skill is **not** "is a second chunking level worth it?" but
"how much per-session context relief does brief-driven substep chunking buy here, and what's the
cleanest unit?" — a second chunking level on top of the cross-skill chaining the prototype loop
already provides, advanced by the skill re-invoking *itself* between substeps.

### Shared findings that frame every verdict

1. **No per-unit intermediates exist today.** Unlike the research loop, where each framework writes a
   canonical intermediate `research/{orch}-{fw}.md` and "progress = file existence"
   (`research-session-loop-convention.md:100`), every design unit lands in **one** document per
   skill (`ux-variations/SKILL.md:158`; `ui-interview/SKILL.md:150`). There is **no design analog of
   the per-framework intermediate file** to key off today. An intra-skill loop must therefore
   *introduce* per-unit intermediate files — and once it does, their existence becomes the cursor,
   exactly reusing the research loop's "file existence = done" rule (the reframe's choice; the
   alternative of keying off a manifest status field is rejected in finding 3).

2. **No `*-run.yaml` is allowed.** The prototype convention is explicit: prototype-phase skills "do
   not use Pattern A selected-framework run manifests" (`prototype-session-loop-convention.md:31`;
   restated `ux-variations/SKILL.md:18`). So the substep cursor cannot be a `ux-variations-run.yaml`.
   The remaining homes are (a) a `status` on existing manifest nodes
   (`branches[].ux_variations[].status`, `…ui_reviews[].status`), (b) a checklist inside some
   `_working/` doc, or (c) **intermediate-file existence under
   `design/{slug}/{skill}-{topic}/`** — the next substep is the first unit whose file does not yet
   exist. The reframe chooses (c): it needs no schema change (unlike (a)) and no separately-maintained
   list that could drift (unlike (b)) — see finding 3.

3. **Putting the *drafting* cursor in the manifest would force a schema change; keying off
   intermediate-file existence does not.** `flow-tree.schema.json` is `additionalProperties: false`
   (line 7 and every `$def`), and the `status` enum (`proposed`, `ready-for-ui`, `approved`,
   `rejected`, `retry-needed`, `promoted-to-prototype`, `consolidated` — lines 90-101) has **no
   "spec-drafted, not yet approved" value.** Tracking per-substep drafting progress in the manifest
   would therefore need a new enum value (e.g. `specified`) or sub-node — a schema edit rippling to
   every reader. **The reframe sidesteps this:** drafting is pre-approval `_working/`-band state, so
   the substep cursor is simply **which intermediate files exist** under
   `design/{slug}/{skill}-{topic}/`, and the manifest keeps recording only committed, post-approval
   branch state with its existing enum. No schema change, and no second list to keep in sync — the
   filesystem is the single source of progress.

4. **Approval-gate multiplication is the real cost.** Today each skill emits **one** binding
   alignment-page `review → confirmed` gate per run (`ui-interview/SKILL.md:135-144`;
   `ux-variations/SKILL.md:164-166`). Chunking one unit per session turns that into **one gate per
   unit** — N≈5 alignment pages and N YAML compile-and-paste round-trips for a single
   `ux-variations` run. That is the dominant added friction, and it cuts against the user's
   documented preference to see and adjust the **whole** concept set together
   (`ux-variations/SKILL.md:96,113-123` — "Present the concepts for adjustment"; "Do not ask the
   user to remove or merge concepts before they have been built").

**Reframe note:** findings 1-2 still hold and define the mechanism (a pure-context brief + per-unit
intermediates, cursor = intermediate-file existence, not a `*-run.yaml`). Findings 3-4 are the two
objections that made the first-draft verdicts lukewarm — and **the reframe resolves both**: the
substep cursor is intermediate-file existence under `design/{slug}/{skill}-{topic}/` (no schema
change, no drifting list), and one final assemble-then-approve gate avoids gate multiplication (see
§ Reframed goal). With both objections neutralized and context minimization as the stated goal, the
verdicts below shift toward **adopt**, differing only in how much relief each skill gets.

### A.1 `ux-variations` — **adopt (primary target)**

**Heavy per-unit phase.** Step 7, "Specify each approved variation enough to build"
(`SKILL.md:125-140`). In layout-mode this expands to content-to-component mapping, region
proportions, responsive behavior at 3 breakpoints, states rendering, an implementation file list,
and build-time estimates *per variation* (lines 127-140). With the default N=5 (line 96), this is
the single heaviest accumulation point in the whole design pack: five full build-grade specs
authored in one context.

**Natural unit.** One variation = one `branches[].ux_variations[]` entry. Its committed status lives in
the manifest as today; its *drafting* cursor is whether its intermediate spec file exists yet.

**Why it's the primary target.** Clean countable units, the heaviest per-unit work, and the largest
single-session context accumulation in the whole design pack. This is where substep chunking buys the
most relief: instead of one session holding five full build-grade specs at once, each session holds
the brief + one spec.

**Mechanism (concrete).**

- **Setup session (one cold session):** run the existing light phases together — interview →
  assumptions manifest → 5 lightweight concepts → concept-set checkpoint (`SKILL.md:73-123`). These
  are cheap and benefit from being co-located. Its durable output is the **shared brief**
  `design/{slug}/_working/ux-variations-{topic}-brief.md` containing pure context only: the decision
  surface, the confirmed assumptions, the locked shared constraints (stack/design-system), the 5
  concept theses, the evaluation criteria, proposed branch IDs, and any carried decisions — **no step list.**
  Do not initialize flow-tree `branches[].ux_variations[]` entries before approval. Stop.
- **Spec sessions (one per variation):** read the brief + scan which `{variation-id}.md` files already
  exist → pick the next variation whose intermediate file does not yet exist → write its full build
  spec (step 7, `SKILL.md:125-140`) to `design/{slug}/ux-variations-{topic}/{variation-id}.md` →
  append any cross-variation facts worth carrying (e.g. "v2 shares the nav model decided for v1") to
  the brief → stop with a clear-context / re-invoke handoff (mirroring
  `user-flow-map/SKILL.md:191-194`). Context per session ≈ brief + one spec — bounded.
- **Assemble + approve session:** when every variation's intermediate file exists, assemble the per-variation files into
  proposed whole-set review content for `alignment/ux-variations-{topic}.html`, build **one** `review`
  alignment page over the whole set, and on approval write the canonical variation plan, create or
  update manifest statuses/artifacts, and archive the brief and intermediates. One binding gate,
  whole-set comparison preserved.
- **No schema change** (cursor is intermediate-file existence). **Small runs fold:** if a run has few variations, the
  loop's own "do not spend a round-trip on a near-empty session" rule
  (`research-session-loop-convention.md:44,160`) collapses it back toward one session — so a threshold
  (auto-chunk at N ≥ ~4, or `--chunked`) keeps tiny runs cheap.

**Verdict: adopt — primary target.** Split step 7 into per-variation spec sessions driven by the
shared brief, with one final assemble-then-approve gate. Largest context relief, no schema change,
whole-set UX intact.

### A.2 `ui-interview` — **adopt for large branches (cursor = per-page intermediate-file existence)**

**Heavy phase.** The per-branch "Branch review loop" (steps 4-6, `SKILL.md:76-119`): investigate the
branch, design a proposed UI, render an HTML visual mockup, interview for alignment, and in full mode
produce the page-by-page spec (layout anatomy, component/control inventory, states, spatial details,
responsive, accessibility — step 6, lines 110-120).

**Already chunks at the branch level.** `ui-interview` handles **one UX-variation branch per run**
already (`SKILL.md:15,76-82`), and routes to the next branch via its own `/ui-interview
[next-specific-ux-variation]` recommendation (line 160) — i.e. the cross-skill loop already gives it
one-branch-per-cold-session granularity. The intra-skill question is only about going *finer*: one
**page/section** per session within a single branch.

**Natural sub-unit.** One page in the page inventory (step 5, lines 84-90). In the first draft this
ranked low because the schema's `ui_reviews[]` node (`flow-tree.schema.json:234-256`) has no
`pages[]` sub-structure, implying a nested schema change. **The reframe removes that blocker:** the
per-page cursor is which page intermediate files exist under `design/{slug}/ui-interview-{topic}/`
(pre-approval `_working/`-band state), so the manifest still records only the one committed
`ui_reviews[]` decision per branch — **no schema change.**

**Mechanism.** Setup session: assumptions manifest + branch investigation + the HTML visual-mockup
direction (steps 3-4, `SKILL.md:69-82`) → write `design/{slug}/_working/ui-interview-{topic}-brief.md`
with the page inventory (as pure context) + the global-shell decisions every page shares. Spec
sessions: pick the next page whose intermediate file does not yet exist → write its full spec (step 6,
`SKILL.md:110-120`) per cold session, reading the brief. Assemble + approve: one alignment page over
the whole branch spec, one binding gate.

**Where it pays off.** Per-page chunking earns its round-trips on **large branches** (many pages); a
small branch folds back to one session via the near-empty-session rule. The one real caution is the
**HTML visual mockup** (step 4b, line 80): it is judged as a whole, so produce it in the setup session
(or a dedicated mockup session) and keep the page-spec sessions text-only, rather than fragmenting the
mockup across pages.

**Verdict: adopt for large branches.** Same brief-driven mechanism as `ux-variations`, gated by page
count; keep the visual mockup whole in the setup session. No schema change. Ranks just below
`ux-variations` only because branch sizes are often small enough to fold.

### A.3 `user-flow-map` — **applicable but lowest relief; chunk only large flows**

**Heavy phase.** Mapping one flow (steps 3-4, `SKILL.md:88-119`) or build-plan synthesis (step 5,
lines 121-143).

**Its real N-unit fan-out is already downstream.** The skill's own framing: "each mapped user flow
can fan out into `/ux-variations [flow]`" (`SKILL.md:19`). The per-flow units are **not** spec'd
inside `user-flow-map`; they become downstream `/ux-variations` invocations — i.e. the fan-out is
*already* realized as the cross-skill loop. There is no large per-unit body of work trapped inside
one `user-flow-map` session the way step-7 specs are trapped in `ux-variations`.

**It already emits a fresh-context handoff.** Steps after approval present an explicit "stop here so
the user can clear context and run `/ux-variations` in a fresh session" vs "continue immediately"
choice (`SKILL.md:191-198`) — so its *primary* fan-out relief already exists via downstream chaining.

**Where intra-skill chunking could still help.** A single large flow's step-3 mapping has ten
sub-steps (`SKILL.md:88-101`) producing one cohesive map. For a big flow this can be chunked: setup
session writes the brief (persona, goal, happy path, entry points — pure context); spec sessions then
fill, in order, the next section whose intermediate file does not yet exist — screen/route inventory,
then per-screen action/state matrices, then failure/recovery, then handoffs — each reading the brief.
The relief is smaller than `ux-variations` because the flow map is more holistic (later sections
reference earlier ones, so the brief must carry more), and small flows fold to one session.

**Verdict: applicable but lowest priority.** The same brief-driven mechanism works, but the
cross-skill fan-out already covers the common case and the per-screen units are more interdependent.
Adopt only after `ux-variations`/`ui-interview`, and only for large flows. No schema change.

### Part A summary (reweighted for context minimization)

| Skill | Verdict | Heavy unit chunked | Drafting cursor | Schema change | Final gate |
|---|---|---|---|---|---|
| `ux-variations` | **Adopt — primary target** | step-7 per-variation build spec (N≈5) | intermediate-file existence | **none** | one assemble-then-approve |
| `ui-interview` | **Adopt — large branches** | step-6 per-page spec | intermediate-file existence | **none** | one per branch; keep mockup whole in setup |
| `user-flow-map` | **Applicable, lowest priority** | step-3 per-section map (large flows only) | intermediate-file existence | **none** | one per flow |

All three use the **same** shared-brief mechanism; they differ only in how much relief chunking buys
(highest for `ux-variations`, lowest for `user-flow-map`). The reframe means **no `flow-tree.schema.json`
change is required for any of them** — the substep cursor is intermediate-file existence under
`design/{slug}/{skill}-{topic}/`, and the brief carries only context.

---

## Part B — `design-inspirations` skill evaluation

The user's Q2 reframe: "should we add a design-inspirations skill? would agents be able to do that?
then its data contributes to all prototype skills."

### B.1 Feasibility — agent-doable? **Yes, with honest limits.**

Agent web harnesses are well-established in this repo. `customer-discovery` runs "broad market
research using WebSearch with 8-12 diverse query strategies" and logs "every WebSearch query
executed and why" (`customer-discovery/SKILL.md:184,560`, with a minimum-depth floor at line 599);
`enterprise-icp:70` and `growth-model:86` run targeted WebSearch passes; the built-in `deep-research`
harness fans out searches, fetches sources, adversarially verifies, and synthesizes a cited report.
The plumbing to model a `design-inspirations` search loop on already exists.

**What an agent can reliably gather** (capture these):

- Named UI/UX **patterns** and interaction/layout **conventions** (e.g. "command palette," "split
  master-detail," "progressive disclosure onboarding") with textual descriptions of when/why used.
- **Component-library** references (shadcn/ui, Radix, Material, etc.) and which components fit the
  flow.
- **Competitor / comparable-product UX writeups**, teardowns, and case studies (text + links).
- **Reference links** to live products, galleries, and articles, annotated with what to look at.
- **Accessibility and responsive convention** notes for the pattern class.

**What an agent cannot reliably do** (state this limit plainly in the skill):

- Truly *"see"* pixel-level visual design from gallery screenshots and translate it faithfully. It
  gathers **named patterns, conventions, and descriptions**, not a rendered visual moodboard. The
  artifact is a **textual + linked** inspiration brief, not an image board. (This honesty is what
  keeps it credible and is why it should not over-promise "visual" inspiration.)

**Verdict: feasible.** Model the harness on `deep-research` / the `customer-discovery` search loop,
with a documented "named-patterns-and-links, not pixels" scope limit.

### B.2 Shape

- **Location:** `packs/product-design/{claude,codex}/design-inspirations/` (new skill, two-mirror
  lockstep per `skill-versioning.md:136-142`). Pack: `product-design` (`PACK.md` already lists the
  design workflow skills; this slots into the "early research → prototype" arc).
- **Type:** `type: research` (it does web research and produces a durable cited artifact) — which
  also automatically opts it into the glossary write-forward gate and the research-doc conventions
  per CLAUDE.md. Alternatively `type: planning` if it should sit purely inside the prototype loop;
  **recommend `type: research`** because its defining work is web evidence gathering, matching the
  other WebSearch skills.
- **Run model:** single-pass (gather → alignment page → confirmed write), **not** a multi-session
  loop. The gathering is one heavy phase; there is no per-framework decomposition to chunk. It uses
  the standard staged workflow (working packet → `review` alignment page → approved canonical write),
  consistent with the prototype convention's approval rules
  (`prototype-session-loop-convention.md:68-74`).
- **Artifact:** a shared `design/design-inspirations-{topic}.md` (flat) /
  `design/{slug}/design-inspirations-{topic}.md` (product-path), plus an **optional reference list
  in the flow-tree manifest** as a `source_artifacts[]` entry (`flow-tree.schema.json:57-63` already
  accepts arbitrary artifact paths — no schema change needed to *reference* it; adding a dedicated
  `inspirations` field would be a schema change and is not required).
- **Visual tier / interview depth:** `visual_tier: document` (it's a text+links brief; honest about
  not rendering pixels) and `interview_depth: light` (1-3 scoping questions: what surface, what
  product class, any reference products/anti-patterns) — it should not run a full 4-phase interview.

### B.3 Integration — soft, read-if-exists prerequisite

The cleanest integration is a **soft, read-if-exists** input to the prototype skills — *not* a hard
gate and *not* bolting WebSearch onto each design skill:

- **`ux-variations`** — reads `design/**/design-inspirations-{topic}.md` if present during concept
  generation (step 5, `SKILL.md:95-111`) to seed archetypes/patterns. Absent → unchanged behavior.
- **`ui-interview`** — reads it during mockup design (step 4b / step 7, `SKILL.md:80,122-127`),
  which cleanly *supplies* the "apps you admire" input the skill currently deprioritizes (line 127)
  **without** reversing its local-evidence stance: the inspiration now arrives as a pre-gathered
  artifact rather than as a blocking interview question.
- **`user-flow-map`** — optional read; lowest value (flow structure is less inspiration-driven than
  visual/UX choices).

This is the key payoff: **it resolves the "web search for inspiration" concern by giving web-driven
inspiration exactly one home, and keeps the other three skills deliberately local-evidence-driven.**

### B.4 Pipeline placement & convention fit

- **Route placement:** early — *before or alongside* `ux-variations`. In the flow-tree `route`
  (`flow-tree.schema.json:33-56`) the canonical six-stage route is
  `[user-flow-map, ux-variations, ui-interview, prototype, consolidate-variations, spec-interview]`.
  `design-inspirations` is a **gather-once feeder**, not a stage every branch passes through, so the
  better fit is **not** inserting a 7th `route` enum value (which would force a schema change and
  imply every flow must pass through it). Instead, place it as an **optional pre-step** whose output
  is referenced from `source_artifacts[]` — consumed by `ux-variations`/`ui-interview`, not
  sequenced as a mandatory branch stage.
- **Convention home:** it falls under `docs/prototype-session-loop-convention.md` scope (it's a
  prototype-phase design skill), but because it's single-pass web research it also leans on the
  research-doc conventions (glossary write-forward, alignment page). The convention doc would gain a
  short "inspiration feeder" subsection rather than a new loop state.
- **Relationship to `brainstorm`:** distinct. `brainstorm` evaluates the **codebase** and suggests
  *product/feature ideas* to explore with `/feature-interview` (PACK.md; skills index). It is
  inward/codebase-facing and idea-generating. `design-inspirations` is outward/web-facing and
  *design-pattern* gathering. No overlap; they sit at different points (ideation vs. design
  inspiration).

**Verdict: recommend YES — feasible and a clean fit for the "gather once, consumed downstream"
precedent** (`research/icp.md`, `research/glossary.md`). It is the right and *only* home for
web-driven inspiration in the design pack, and it preserves the local-evidence stance of the existing
three skills.

---

## Part C — Recommended course of action

Synthesis of Parts A + B, **reweighted around the stated goal** (minimize per-session context via
substep chunking + a shared brief). The foundational item is now the **shared-context-brief
mechanism** itself; the per-skill adoptions build on it; the `design-inspirations` skill is an
independent track. Each item is independently shippable. "Version bump" follows
`docs/skill-versioning.md` (decimal bump for behavioral change, archive prior `SKILL.md`,
`CHANGELOG.md` entry, **claude + codex in lockstep**).

| # | Item | Effort | Risk | Version / artifact impact | Conventions / audits touched |
|---|---|---|---|---|---|
| 1 | **Define the shared-context-brief mechanism** in `docs/prototype-session-loop-convention.md` — three-tier state (manifest cursor + `_working/` brief + per-substep intermediates), the per-session shape, the brief naming convention `design/{slug}/_working/{skill}-{topic}-brief.md`, archive-at-canonical-write timing, and the one-final-gate rule | **Low-Medium** | **Low** | Convention doc only (non-skill); no version bump. **No schema change.** | `prototype-session-loop-convention.md` (new "Intra-skill substep chunking + shared brief" section); references `research-session-loop-convention.md` handoff pattern |
| 2 | **Adopt the brief loop in `ux-variations`** (Part A.1, primary target) — split step 7 into per-variation spec sessions, cursor = intermediate-file existence, assemble-then-one-gate; threshold/`--chunked` so small runs fold | **Medium** | **Low-Medium** | `ux-variations` decimal bump (v0.20 → v0.21), both mirrors, archive prior; new `design/{slug}/ux-variations-{topic}/{variation-id}.md` intermediates + `_working/` brief. **No schema change.** | item 1 convention; mirror parity audit; alignment-page audit |
| 3 | **Adopt the brief loop in `ui-interview`** (Part A.2) — per-page spec sessions for large branches, cursor = per-page intermediate-file existence, mockup kept whole in setup, one gate per branch | **Medium** | **Low-Medium** | `ui-interview` decimal bump (v0.22 → v0.23), both mirrors, archive prior; new per-page intermediates + `_working/` brief. **No schema change.** | item 1 convention; mirror parity audit; alignment-page audit |
| 4 | **Add `design-inspirations` skill** (Part B) — independent track; single-pass web research feeder, soft read-if-exists input to `ux-variations`/`ui-interview` | **Medium** | **Low** | New skill at v0.0, two mirrors; new `design/design-inspirations-{topic}.md` artifact; `PACK.md` entry; `ALIGNMENT-PAGE.md` + `CHANGELOG.md` scaffolding; referenced from manifest `source_artifacts[]` (no schema change) | `prototype-session-loop-convention.md` ("inspiration feeder" subsection); glossary write-forward (type: research); mirror parity + alignment-page audits |
| 5 | **Adopt the brief loop in `user-flow-map`** (Part A.3) — large-flow per-section chunking only | **Medium** | **Low** | `user-flow-map` decimal bump (v0.8 → v0.9), both mirrors, archive prior. **No schema change.** | item 1 convention; mirror parity audit |

### Recommended sequencing & scope

1. **Item 1 first — define the mechanism.** Everything else depends on it, and it is the cheapest,
   lowest-risk piece: a convention section, no skill or schema change. It pins down the brief naming,
   the three-tier state, the per-session shape, and the one-final-gate rule so the per-skill adoptions
   are mechanical.
2. **Item 2 — `ux-variations`.** The primary target: largest single-session context accumulation, so
   the most relief per unit of effort. No schema change now that the cursor is intermediate-file existence.
3. **Item 3 — `ui-interview`.** Same mechanism; adopt for large branches. Keep the HTML mockup whole.
4. **Item 4 — `design-inspirations`.** Independent of the loop work; can proceed in parallel. Resolves
   the "web search for inspiration" premise and feeds items 2-3 as a soft input.
5. **Item 5 — `user-flow-map`.** Lowest relief; do last or skip until a large-flow pain case appears.

**Smallest sensible scope:** items 1 + 2 (mechanism + `ux-variations`) — directly delivers the
context-minimization goal where it matters most, no schema churn.
**Fuller scope:** items 1 + 2 + 3 (+ 4 in parallel) — the brief loop across both per-unit-heavy skills,
plus the inspiration feeder.
**One open decision for the follow-up plan:** per-skill-run brief (recommended) vs. one pipeline-wide
brief (see § Reframed goal → Scope decision).

---

## Part D — Cross-loop concurrency risk: the exec ledger is a global singleton

> **Why this part exists.** This extends the audit beyond its original two questions. It is here
> because it is the **structural risk that motivated the plan-mode question** in § Reframed goal →
> Relationship to plan mode: once you accept that design/research substep progress must *not* flow
> through `tasks/todo.md` + `/exec`, the live question becomes what happens when a product genuinely
> *is* in the implementation exec loop while a sibling product spins up new research/design work. The
> fix is large and cross-cutting, so it is **deferred to its own follow-up plan**; this part only
> names the risk, shows it is real and unmitigated, and records the recommended fix + an interim
> mitigation.

### The asymmetry: path-scoped research/design vs. a global-singleton implementation ledger

Research and design state is **path-scoped** and therefore concurrency-safe across products:

- Research artifacts live under `research/{slug}/`; design artifacts under `design/{slug}/`; the new
  shared brief and its intermediates under `design/{slug}/_working/` and `design/{slug}/{skill}-{topic}/`.
- The product portfolio is tracked as a list: `research/.progress.yaml` carries `active_paths` and
  per-path `product_paths[]` entries (`idea-scope-brief/SKILL.md:40`), so two products can each hold
  their own research/design state without colliding.

The **implementation ledger is a repo-global singleton** with no `{slug}` scoping:

- `tasks/todo.md`, `tasks/roadmap.md`, `tasks/history.md`, and `tasks/manual-todo.md` are single
  unscoped files (`afps-status/SKILL.md:36`; `ship/SKILL.md:175` — "`tasks/todo.md` holds only the
  current phase"). There is exactly one of each per repo.
- The `operating-modes` approval packet pins execution to **one** `tasks/todo.md`: the packet's
  validity check is `sha256(tasks/todo.md) == todo_hash` (`docs/operating-modes.md:119`), a hash of
  the single global file — so "approved work" is defined against one product's ledger at a time.
- `.progress.yaml` records **no implementation stage**: every `pipeline_stage` value is a *research*
  stage (e.g. `customer-discovery`, `idea-scope-brief`), used as a coarse pointer, not a per-path
  "in implementation" marker (`research-session-loop-convention.md:102`;
  `idea-scope-brief/SKILL.md:40`; `fork-idea-branch/SKILL.md:76`). Nothing in the path manifest says
  "path X owns the exec loop right now."

So the design loops this audit proposes are concurrency-safe by construction, but the layer **below**
them — implementation — assumes a single global ledger.

### The collision scenario

1. Product **A** is mid-implementation: its phased plan is in `tasks/roadmap.md`, the current phase is
   in `tasks/todo.md`, and `/exec` is driving it (possibly with a live `operating-modes` approval
   packet hashed against A's `tasks/todo.md`).
2. The user forks a new product **B** within the same product line. `fork-idea-branch` scaffolds B as
   a fresh path and routes it back to `/idea-scope-brief` (`fork-idea-branch/SKILL.md:106`,
   `74-78`) — it is silent on the exec loop and explicitly does **not** create `tasks/todo.md`
   entries (`fork-idea-branch/SKILL.md:106`).
3. B's research and design proceed safely: path-scoped under `research/{slug-B}/` and
   `design/{slug-B}/`, including the new shared brief and intermediates. **No collision yet.**
4. B reaches implementation. Now both A and B want the implementation loop — but `/exec` and `/ship`
   read and write the **same** `tasks/todo.md`, which "holds only the current phase"
   (`ship/SKILL.md:175`). B's phase silently interleaves with or overwrites A's current phase; the
   approval packet's `todo_hash` now matches whichever product last wrote the file; and
   `afps-status`/`codebase-status` read the global ledger with **no path attribution**
   (`afps-status/SKILL.md:36,42`) — so neither would flag that a todo belongs to a *different* product
   than the active research path. The system implicitly assumes **serial promotion**: one product in
   implementation at a time.

### The brief does NOT add to this risk

The shared context brief and its intermediates are **path-scoped working state**
(`design/{slug}/_working/{skill}-{topic}-brief.md`, `design/{slug}/{skill}-{topic}/{unit-id}.md`) —
safe by construction, exactly like the rest of `research/{slug}/` and `design/{slug}/`. The
concurrency risk is concentrated entirely in the **un-scoped exec ledger**, not in the design loops.
If anything, the brief reinforces the right pattern (path-scoped progress); it is the implementation
layer that has not caught up.

### Recommended structural fix (its own follow-up plan — NOT this audit's edits)

Path-scope the implementation ledger the same way research/design state is already scoped:

- Move the ledger under `tasks/{slug}/` — `tasks/{slug}/todo.md`, `tasks/{slug}/roadmap.md`,
  `tasks/{slug}/history.md`, etc.
- Add an `implementation` `pipeline_stage` value (or a dedicated per-path implementation pointer) in
  `.progress.yaml` so a path can be marked "in implementation," and so readers can attribute a ledger
  to a product.
- Teach the readers/writers to be path-aware: `/exec`, `/ship`, `/ship-end`, `afps-status`,
  `codebase-status`, the `operating-modes` approval packet (hash the *scoped* todo), and
  `fork-idea-branch` (carry the implementation pointer when forking).

This is a **large, cross-cutting change** touching multiple skills, two conventions, and the approval
contract — so it is explicitly a **separate implementation plan**, not part of this audit.

### Interim mitigation (no code)

Until the fix lands, treat implementation as **serial**:

- Only one product's exec loop is active at a time. Keep a newly-forked product in path-scoped
  research/design (where it is safe) until product A's exec loop is parked or finished.
- Optionally add a **product-path header line** to `tasks/todo.md` / `tasks/roadmap.md` (e.g.
  `<!-- product-path: {slug} -->`) so a cold session — or `afps-status` — can detect whose ledger it
  is and refuse to interleave a second product's phase. This is a convention-only stopgap, not the
  structural fix.

---

## Verification (editorial)

- **Both questions answered with cited evidence.** Part A gives a per-skill verdict against the
  prototype-loop model with `SKILL.md`/schema/convention line citations; Part B answers
  feasibility + shape + integration + placement with web-harness citations.
- **Brief = pure context; cursor = intermediate-file existence.** The brief carries only assumptions,
  constraints, theses, criteria, and carried decisions (no step list); the substep cursor is which
  intermediate file exists under `design/{slug}/{skill}-{topic}/`, mirroring the research loop's
  "progress = file existence" (`research-session-loop-convention.md:100`). § Relationship to plan mode
  maps the altitude (plan vs. brief), the three levels of "what's next," the two-cursor trap and its
  single-cursor fix, and where plan mode fits.
- **Concurrency risk surfaced (Part D).** The asymmetry (path-scoped research/design vs. global-singleton
  exec ledger) is cited; the A-mid-exec / B-forks collision scenario is shown; the brief is noted as
  path-scoped and safe; and the structural fix (path-scoped ledger + path-aware readers) is flagged as
  a **separate follow-up plan**, with a serial-implementation interim mitigation recorded.
- **Concrete enough to seed a follow-up plan.** Named paths (the `_working/` brief
  `design/{slug}/_working/{skill}-{topic}-brief.md`, per-substep intermediates
  `design/{slug}/ux-variations-{topic}/{variation-id}.md`, `design/{slug}/design-inspirations-{topic}.md`),
  the cursor location (intermediate-file existence under `design/{slug}/{skill}-{topic}/` — **no schema change**), route
  placement (feeder via `source_artifacts[]`, not a 7th `route` stage), the one-final-gate rule, and
  version-bump implications are all specified.
- **No normative artifact modified.** This audit edits no `SKILL.md`, convention, manifest, schema,
  or build mirror — only this new doc under `docs/`.

## Out of scope (deferred to a follow-up plan the user approves)

Actual edits to any `SKILL.md`; creation of the `design-inspirations` skill; convention updates (the
shared-brief mechanism and the inspiration-feeder subsection); version bumps, archives, and
`CHANGELOG.md` entries; `PACK.md` edits; and shipping. The reframe means **no `flow-tree.schema.json`
change is anticipated** (the substep cursor is intermediate-file existence); if the follow-up plan
finds a case that needs one, that is also deferred to it. All of the above happen only after the user
reviews this recommendation and picks scope.
