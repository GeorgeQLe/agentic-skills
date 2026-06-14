# Audit: Intra-Skill Session Loops + a `design-inspirations` Skill for Prototype-Phase Design Skills

> **Status: non-normative audit / recommendation.** This document modifies no `SKILL.md`,
> convention, manifest, schema, or build mirror. It answers two questions with cited evidence and
> ends in a phased, effort/risk-tagged course of action so the user can pick scope for a follow-up
> implementation plan. All actual edits are explicitly deferred (see § Out of Scope).
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

## Evidence base (what was read)

| Source | What it established |
|---|---|
| `docs/prototype-session-loop-convention.md` | The design loop: state = flow-tree manifest + canonical-artifact existence; **no Pattern A run manifest**; `tasks/todo.md` is off-limits for branch progress (lines 8, 18, 31, 43). Phases are cross-skill (lines 49-55). "Each phase may run in a fresh context when the branch is heavy" (line 57). |
| `docs/research-session-loop-convention.md` | The research loop's unifying rule: "one heavy phase per session, light bookends" (lines 34-44). Unit = one heavy research phase; progress = canonical-intermediate file existence (lines 80-104). The per-framework intermediate `research/{orch}-{fw}.md` model (lines 106-117). |
| `ux-variations/SKILL.md` | Heavy per-unit phase = step 7 "Specify each approved variation enough to build" (lines 125-140), N≈5 (line 96). All units land in **one** doc `design/ux-variations-[topic].md` (line 158). Flow-tree cursor = `branches[].ux_variations[]` entries with `id/label/status` (lines 46, 160). |
| `ui-interview/SKILL.md` | Heavy phase = the per-branch "Branch review loop" steps 4-6 (lines 76-119); already one branch per run. One alignment-page approval gate per run (step 9, lines 135-144). Deprioritizes inspiration (line 127). |
| `user-flow-map/SKILL.md` | Owns the wireframe-tree root + build-plan synthesis (line 23). Its N-unit fan-out **is** downstream `/ux-variations` calls (line 19). Already emits a fresh-context stop/continue handoff (lines 191-198). |
| `design/flow-tree.schema.json` | `additionalProperties: false` throughout. `ux_variation_branch` requires `id/label/status/artifacts/ui_reviews` (lines 204-232). `status` enum has no "spec-drafted-not-approved" intermediate value (lines 90-101). Any per-sub-unit cursor field is a **schema change**. |
| `docs/orchestrator-convention.md` | Pattern A vs B vs C. Pattern A = framework decomposition + synthesis, self-advancing via the Research Session Loop (lines 33-113). |
| `docs/skill-versioning.md` | Decimal bump for behavioral change; archive prior `SKILL.md` to `archive/<old>/`; `CHANGELOG.md` entry; mirror parity across `{claude,codex}` (lines 14-35, 136-142). |
| `grep` web-harness scan | `WebSearch`/`WebFetch` appear in `customer-discovery` (lines 184, 560, 599), `enterprise-icp:70`, `growth-model:86`, and ~10 other business skills — **never** in the three design skills. `deep-research` is a built-in harness skill, not a repo file. |
| Mirror parity | `ux-variations` v0.20, `ui-interview` v0.22, `user-flow-map` v0.8 — `claude`/`codex` versions match; any change is a lockstep two-mirror edit. |

---

## Part A — Intra-skill self-re-invocation audit (per skill)

The question for each skill: is a **second** chunking level — one unit per cold session, the skill
re-invoking *itself* between units — worth adding *on top of* the cross-skill chaining the prototype
loop already provides?

### Shared findings that frame every verdict

1. **No per-unit intermediates exist today.** Unlike the research loop, where each framework writes a
   canonical intermediate `research/{orch}-{fw}.md` and "progress = file existence"
   (`research-session-loop-convention.md:100`), every design unit lands in **one** document per
   skill (`ux-variations/SKILL.md:158`; `ui-interview/SKILL.md:150`). There is **no design analog of
   the per-framework intermediate file.** An intra-skill loop therefore cannot reuse the research
   loop's "file existence = done" cursor; it must either invent per-unit intermediate files or key
   off a manifest status field.

2. **The cursor must be the flow-tree manifest — not a new `*-run.yaml`.** The prototype convention
   is explicit: prototype-phase skills "do not use Pattern A selected-framework run manifests"
   (`prototype-session-loop-convention.md:31`; restated `ux-variations/SKILL.md:18`). So any unit
   cursor must live as a `status` on existing manifest nodes (`branches[].ux_variations[].status`,
   `…ui_reviews[].status`), **not** a `ux-variations-run.yaml`.

3. **The schema constrains the cursor.** `flow-tree.schema.json` is `additionalProperties: false`
   (line 7 and every `$def`), and the `status` enum (`proposed`, `ready-for-ui`, `approved`,
   `rejected`, `retry-needed`, `promoted-to-prototype`, `consolidated` — lines 90-101) has **no
   "spec-drafted, not yet approved" value.** An intra-skill loop needs to distinguish "this unit's
   heavy spec work is done" from "this unit is approved." That requires **either** a new enum value
   (e.g. `specified`) **or** a new per-unit field — both are schema edits, which ripple to every
   skill that reads the schema.

4. **Approval-gate multiplication is the real cost.** Today each skill emits **one** binding
   alignment-page `review → confirmed` gate per run (`ui-interview/SKILL.md:135-144`;
   `ux-variations/SKILL.md:164-166`). Chunking one unit per session turns that into **one gate per
   unit** — N≈5 alignment pages and N YAML compile-and-paste round-trips for a single
   `ux-variations` run. That is the dominant added friction, and it cuts against the user's
   documented preference to see and adjust the **whole** concept set together
   (`ux-variations/SKILL.md:96,113-123` — "Present the concepts for adjustment"; "Do not ask the
   user to remove or merge concepts before they have been built").

These four findings mean an intra-skill loop is **not free** the way it looked by analogy to the
research loop. It is justified only where per-unit context cost is genuinely large *and* the
per-unit work can stand alone behind its own gate without harming the compare-the-set UX.

### A.1 `ux-variations` — **adopt, optional and threshold-gated (not mandatory)**

**Heavy per-unit phase.** Step 7, "Specify each approved variation enough to build"
(`SKILL.md:125-140`). In layout-mode this expands to content-to-component mapping, region
proportions, responsive behavior at 3 breakpoints, states rendering, an implementation file list,
and build-time estimates *per variation* (lines 127-140). With the default N=5 (line 96), this is
the single heaviest accumulation point in the whole design pack: five full build-grade specs
authored in one context.

**Natural unit.** One variation = one `branches[].ux_variations[]` entry — the cursor home already
exists in the schema (`flow-tree.schema.json:204-232`).

**Why it's the strongest candidate.** Clean countable units, the heaviest per-unit work, and a cursor
node that already exists. If any design skill benefits from per-unit fresh contexts, it's this one.

**Why *not* mandatory.** Two real frictions pull against it:

- **It collides with the "compare the whole set" UX.** Steps 5-6 deliberately generate all 5 concepts
  *lightweight* first and ask the user to adjust the **set** before any deep spec (`SKILL.md:95-123`).
  The concept-selection checkpoint and "do not ask the user to remove or merge concepts before they
  have been built" (line 120) assume the user holds all concepts in view at once. A per-variation
  loop that approves variation 1 fully before variation 2 is even specified weakens that
  whole-set comparison.
- **Gate multiplication.** Five binding alignment pages instead of one (see shared finding 4).

**Mechanism sketch (if adopted).** Keep the existing flow: interview → 5 lightweight concepts →
concept-set checkpoint (all in **one** session, because these phases are light). Then split **only
step 7**, the heavy spec phase:

- Add a per-variation intermediate `design/{slug}/ux-variations-{topic}/{variation-id}.md` (a new
  per-unit file, the design analog of the research loop's framework intermediate). The single
  canonical `design/{slug}/ux-variations-{topic}.md` is **assembled** from the per-variation files at
  the end (or links to them).
- Cursor: a per-variation `status` on `branches[].ux_variations[]`. This needs a new enum value
  (e.g. `specified`) to mean "spec drafted, awaiting the run's approval" distinct from `proposed`
  and `approved` — a `flow-tree.schema.json` change.
- Each re-invocation specs the next variation whose status is still `proposed`, writes its
  intermediate, sets it `specified`, and stops with a continue/clear-context handoff (mirroring
  `user-flow-map/SKILL.md:191-194`). When all are `specified`, one **final** approval page covers the
  assembled set — preserving the single whole-set gate and sidestepping gate multiplication.
- Gate it behind a **threshold** (e.g. `--chunked`, or auto only when N ≥ a threshold like 5–6 *and*
  layout-mode's heavy per-variation spec is in play). Small runs fold into one session per the loop's
  own "do not spend a round-trip on a near-empty session" rule
  (`research-session-loop-convention.md:44,160`).

**Verdict: adopt intra-skill loop — optional/threshold-gated, splitting only step 7, with one final
set-level approval gate (not one gate per variation).** This is the only place the bloat relief is
real, and the "intermediate per unit, assemble at end" shape keeps the whole-set comparison and the
single binding gate intact.

### A.2 `ui-interview` — **conditional; recommend an optional threshold-gated per-page split, not mandatory**

**Heavy phase.** The per-branch "Branch review loop" (steps 4-6, `SKILL.md:76-119`): investigate the
branch, design a proposed UI, render an HTML visual mockup, interview for alignment, and in full mode
produce the page-by-page spec (layout anatomy, component/control inventory, states, spatial details,
responsive, accessibility — step 6, lines 110-120).

**Already chunks at the branch level.** `ui-interview` handles **one UX-variation branch per run**
already (`SKILL.md:15,76-82`), and routes to the next branch via its own `/ui-interview
[next-specific-ux-variation]` recommendation (line 160) — i.e. the cross-skill loop already gives it
one-branch-per-cold-session granularity. The intra-skill question is only about going *finer*: one
**page/section** per session within a single branch.

**Natural sub-unit.** One page in the page inventory (step 5, lines 84-90). But the cursor problem is
worse here: the schema's `ui_reviews[]` node (`flow-tree.schema.json:234-256`) has **no per-page
sub-structure** — there is no `pages[]` array to hold per-page status. A per-page loop would need a
**new nested schema node**, not just a new enum value.

**Cost.** Per-page chunking only pays off for a genuinely large branch (many pages). For the common
case — a branch of a handful of pages — it adds round-trips and a much bigger schema change for
little context relief, and it fragments the single HTML visual mockup (step 4b, line 80) that the
user judges the branch by.

**Verdict: keep cross-skill phase only by default; recommend an *optional, threshold-gated* per-page
split.** Adopt a per-page intra-skill loop **only** when a branch exceeds a page-count threshold
(e.g. 6+ pages). Below that, the existing one-branch-per-run cross-skill chunking is sufficient. If
implemented, it requires a `pages[]` sub-node in `ui_reviews[]` (larger schema change than
`ux-variations`) — which is part of why this ranks below `ux-variations`.

### A.3 `user-flow-map` — **not worth it; no change**

**Heavy phase.** Mapping one flow (steps 3-4, `SKILL.md:88-119`) or build-plan synthesis (step 5,
lines 121-143).

**Its real N-unit fan-out is already downstream.** The skill's own framing: "each mapped user flow
can fan out into `/ux-variations [flow]`" (`SKILL.md:19`). The per-flow units are **not** spec'd
inside `user-flow-map`; they become downstream `/ux-variations` invocations — i.e. the fan-out is
*already* realized as the cross-skill loop. There is no large per-unit body of work trapped inside
one `user-flow-map` session the way step-7 specs are trapped in `ux-variations`.

**It already emits a fresh-context handoff.** Steps after approval present an explicit "stop here so
the user can clear context and run `/ux-variations` in a fresh session" vs "continue immediately"
choice (`SKILL.md:191-198`). The fresh-context relief an intra-skill loop would provide is **already
present** via this handoff plus the downstream chaining.

**Verdict: not worth it — recommend no change.** Adding an intra-skill loop here would duplicate the
cross-skill fan-out it already produces and add machinery with no bloat relief to show for it.

### Part A summary

| Skill | Verdict | Heavy unit | Cursor home | Schema change needed | Gate impact |
|---|---|---|---|---|---|
| `ux-variations` | **Adopt — optional/threshold, split step 7 only, one final set gate** | per-variation build spec (N≈5) | `branches[].ux_variations[].status` (exists) | new enum value `specified` + per-variation intermediate file path convention | none if assembled-then-one-gate |
| `ui-interview` | **Conditional — optional/threshold per-page split** | per-page spec within a branch | none today | **new `pages[]` sub-node** in `ui_reviews[]` | risk of fragmenting the single mockup gate |
| `user-flow-map` | **Not worth it — no change** | per-flow map | n/a | none | n/a |

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

Synthesis of Parts A + B into a phased plan. Each item is independently shippable; the user can pick
any subset for a follow-up implementation plan. "Version bump" follows `docs/skill-versioning.md`
(decimal bump for behavioral change, archive prior `SKILL.md`, `CHANGELOG.md` entry, **claude + codex
in lockstep**).

| # | Item | Effort | Risk | Version / artifact impact | Conventions / audits touched |
|---|---|---|---|---|---|
| 1 | **Add `design-inspirations` skill** (Part B) | **Medium** | **Low** | New skill at v0.0, two mirrors; new `design/design-inspirations-{topic}.md` artifact; `PACK.md` entry; `ALIGNMENT-PAGE.md` + `CHANGELOG.md` per skill scaffolding | `prototype-session-loop-convention.md` (new "inspiration feeder" subsection); glossary write-forward (type: research); mirror parity audit; alignment-page audit |
| 2 | **Add optional/threshold intra-skill loop to `ux-variations`** (Part A.1) — split step 7 only, per-variation intermediates, assemble-then-one-gate | **Medium-High** | **Medium** | `ux-variations` decimal bump (v0.20 → v0.21), both mirrors, archive prior; **`flow-tree.schema.json` change** (new `status` enum value `specified`) | `prototype-session-loop-convention.md` (intra-skill chunking subsection); `flow-tree.schema.json`; mirror parity audit; any skill reading the schema |
| 3 | **Optional threshold-gated per-page split for `ui-interview`** (Part A.2) | **High** | **Medium-High** | `ui-interview` decimal bump (v0.22 → v0.23), both mirrors, archive prior; **larger schema change** (`pages[]` sub-node in `ui_reviews[]`) | `flow-tree.schema.json`; `prototype-session-loop-convention.md`; mirror parity audit. Defer unless large-branch pain is demonstrated. |
| 4 | **Update `docs/prototype-session-loop-convention.md`** to describe (a) intra-skill chunking as a second level on top of cross-skill chaining and (b) the inspiration-feeder artifact | **Low-Medium** | **Low** | Convention doc only (non-skill); no version bump | This is the umbrella doc edit that items 1-3 reference |
| 5 | **Leave `user-flow-map` as-is** (Part A.3) | **None** | **None** | No change | — |

### Recommended sequencing & scope

1. **Do item 1 first (`design-inspirations`).** It is the highest value-to-risk: it directly answers
   the user's Q2, resolves the "web search for inspiration" premise cleanly, requires **no schema
   change**, and needs no change to the other three skills (they gain a soft read-if-exists input
   only when item 4's convention text lands). Low risk, self-contained.
2. **Then item 4 (convention update)** so items 1-3 have a documented home, and the soft read-if-exists
   integration for `ux-variations`/`ui-interview` is specified.
3. **Then item 2 (`ux-variations` intra-skill loop)** if the user wants the deeper bloat relief —
   gated behind the schema enum addition and the assemble-then-one-gate design that preserves the
   whole-set comparison UX. This is the only Part-A item with clearly positive return.
4. **Treat item 3 (`ui-interview` per-page) as deferred/optional** — adopt only if real large-branch
   context bloat is observed; it carries the biggest schema change for the narrowest benefit.
5. **Item 5 — no work.**

**Smallest sensible scope:** items 1 + 4 (add the inspirations skill + document its integration).
This delivers the user's main ask with the least risk and no schema churn.
**Fuller scope:** items 1 + 4 + 2 (add inspirations feeder *and* the `ux-variations` step-7 loop).
Items 3 stays deferred.

---

## Verification (editorial)

- **Both questions answered with cited evidence.** Part A gives a per-skill verdict against the
  prototype-loop model with `SKILL.md`/schema/convention line citations; Part B answers
  feasibility + shape + integration + placement with web-harness citations.
- **Concrete enough to seed a follow-up plan.** Named paths
  (`design/{slug}/ux-variations-{topic}/{variation-id}.md`,
  `design/{slug}/design-inspirations-{topic}.md`), the manifest cursor
  (`branches[].ux_variations[].status` + new `specified` enum value), route placement (feeder via
  `source_artifacts[]`, not a 7th `route` stage), and version-bump implications are all specified.
- **No normative artifact modified.** This audit edits no `SKILL.md`, convention, manifest, schema,
  or build mirror — only this new doc under `docs/`.

## Out of scope (deferred to a follow-up plan the user approves)

Actual edits to any `SKILL.md`; creation of the `design-inspirations` skill; `flow-tree.schema.json`
changes; convention updates; version bumps, archives, and `CHANGELOG.md` entries; `PACK.md` edits;
and shipping. Those happen only after the user reviews this recommendation and picks scope.
