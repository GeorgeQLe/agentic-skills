---
name: customer-discovery
description: Orchestrator — detect pre-product vs product-exists mode, bootstrap ICP candidates, recommend customer-discovery frameworks, synthesize outputs into unified ICP research
type: research
version: v1.1
argument-hint: "[optional: \"discovery\" | \"validate\" | \"--synthesize\" | concept/idea, spec file path]"
invocation: orchestrator
interview_depth: full
visual_tier: visual
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Customer Discovery — Orchestrator

Invoke as `$customer-discovery`.

This is an **orchestrator skill** using the parent router delegation pattern. It detects context, bootstraps ICP candidates, recommends applicable customer-discovery frameworks, and synthesizes their outputs into unified ICP research. Individual frameworks live as child skills under `frameworks/`.

Available frameworks:

| Framework | Slug | Creator | Lens |
|-----------|------|---------|------|
| W3 Hypothesis | `w3-hypothesis` | Schwartzfarb | WHO/WHAT/WHY hypothesis generation + disproval |
| JTBD Needs Analysis | `jtbd-needs` | Ulwick / Christensen | Needs-based segmentation via jobs and outcomes |
| Four Forces | `four-forces` | Moesta | Push/Pull/Anxiety/Habit switching moment analysis |
| Five Rings of Buying Insight | `five-rings` | Revella | Decision psychology and buyer journey |
| Seven Dimensions | `seven-dimensions` | Lincoln Murphy | Ready/Willing/Able/Success/Acquisition/Ascension/Advocacy scoring |
| PMF Engine | `pmf-engine` | Vohra / Supan | Empirical ICP from existing user data (Sean Ellis test + HXC) |

## Report-First Approval Gate

Default to scope-first approval: before synthesized research, inspect only enough repository, user, and source context to propose research scope, source plan, assumptions, output paths, and approval questions in a `review` alignment page plus a concise conversation summary.

Do not perform synthesized research, rank candidates, make recommendations, or write working packets or canonical deliverables until final compiled YAML approves the research scope. Minimal pre-approval discovery may identify available files, source categories, and open questions; label it as scope evidence, not findings.

After approved research-scope YAML, perform the research and write only the non-canonical working packet defined in the staged workflow. Then update the `review` alignment page with findings and stop again for feedback-only YAML or final compiled YAML artifact approval before creating or updating canonical research, spec, or task files.

Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Staged Research Workflow

Use this staged workflow for synthesized research or report outputs that would create or update canonical research, spec, or task files.

1. **Stage 1 - Scope discovery and approval.** Inspect only enough repository, user, and source context to propose research scope, source plan, assumptions, output paths, and approval questions. Build the `review` HTML alignment page before synthesized research. The page must render the proposed scope, available source categories, known context, assumptions/confidence, proposed working-packet and canonical output paths, and research-scope approval gates. Stop for final compiled YAML approval of the research scope. Do not perform synthesized research, rank candidates, make recommendations, or write working packets, canonical research, spec, or task files in Stage 1.
2. **Stage 2 - Research and artifact review.** Only after approved research-scope YAML with no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback, perform the synthesized research, run required source/code checks, and write only a non-canonical working packet: flat mode uses `research/_working/preliminary-<skill>-research.md`; product-path mode uses `research/{slug}/_working/preliminary-<skill>-research.md`. Replace `<skill>` with this skill's `name` value. Raw evidence or search logs may remain as supporting evidence where this skill already requires them, but synthesized deliverables stay in the working packet. Update the `review` HTML alignment page with the full preliminary packet, evidence matrix, assumptions/confidence register, source coverage gaps, proposed canonical file changes, and artifact approval gates. Stop for either feedback-only YAML or final compiled YAML. Feedback-only YAML revises the working packet and page, then remains in Stage 2.
3. **Stage 3 - Finalize approved artifacts.** Consume final compiled YAML for artifact approval only when it has no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback. Apply approved edits first, archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`, remove the active working packet, write the approved canonical artifacts to the unchanged output paths below, and convert the alignment page to `confirmed` with the approval record preserved.

Canonical output paths remain unchanged. Search logs and other supporting evidence remain allowed only where this skill's output contract already requires them.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Prerequisites

- **Hard**: None — this is the first research skill in the AFPS chain.
- **Soft**: Read these if they exist:
  - `research/idea-brief.md` (or `research/{slug}/idea-brief.md`) — concept, hypotheses, ICP readiness notes
  - Specs, README/CLAUDE, and relevant source files for product context
  - `research/customer-feedback.md` — real customer evidence (triggers product-exists mode)

## Operational Modes

### Mode A: Candidate Bootstrap + Framework Selection (default first invocation)

Activated by: `$customer-discovery` or `$customer-discovery [concept/idea]` (no special flags).

### Mode B: Synthesis

Activated by: `$customer-discovery --synthesize`

### Mode C: Discovery Shortcut

Activated by: `$customer-discovery discovery`

### Mode D: Validation Shortcut

Activated by: `$customer-discovery validate`

---

## Process

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as the product/app name, not the ICP, audience, or segment label.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived` or legacy `status: abandoned`, stop and warn that the path is archived; do not write or update scoped outputs there.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths` on read and write back `active_paths` on manifest updates. Treat legacy `abandoned` as `archived`; exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`, and any `scope_path` under `research/_archive/` from active target selection.
4. If active product paths exist in the manifest, use those paths. If multiple active paths exist, ask which one to target unless this skill explicitly supports cross-path output.
5. If no active manifest target exists, list non-archived product directories under `research/`, excluding `research/_archive/` and dot directories. Auto-select only when exactly one exists; ask when multiple exist.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`.

0b. **Product-path manifest**: Read `research/.progress.yaml` when present. Normalize `active_path` (singular legacy) to `active_paths` (plural list) when reading; treat legacy `abandoned` as `archived` and exclude archived/deferred/revisit/promoted paths plus `research/_archive/` scopes from active target selection.

### 1. Mode Detection

Detect **pre-product mode** (default) or **product-exists mode**:

**Pre-product mode** activates when:
- No production codebase with live users detected, AND
- No `research/customer-feedback.md` with post-launch customer evidence, AND
- `$ARGUMENTS` does not contain "product" or "validate"

Available frameworks in pre-product mode:
- `w3-hypothesis` (default) — Schwartzfarb WHO/WHAT/WHY hypothesis generation + disproval
- `jtbd-needs` (default) — Ulwick/Christensen needs-based segmentation via jobs and outcomes
- `four-forces` (default) — Moesta Push/Pull/Anxiety/Habit switching moment analysis
- `five-rings` (optional) — Revella decision psychology and buyer journey. Pre-check when idea brief indicates B2B model.
- `seven-dimensions` (optional) — Lincoln Murphy ICP scoring with post-sale dimensions
- `pmf-engine` (unavailable) — requires real user data; grayed out with explanation

**Product-exists mode** activates when:
- Production code or deployment exists, OR
- `research/customer-feedback.md` exists with real customer data, OR
- `$ARGUMENTS` contains "product" or "validate"

Available frameworks in product-exists mode:
- `pmf-engine` (default) — Vohra/Supan empirical ICP from existing user data
- `seven-dimensions` (default) — Lincoln Murphy structured scoring with post-sale dimensions
- `four-forces` (optional) — switching analysis grounded in real churn/adoption data
- `five-rings` (optional) — buying insight refresh with real buyer evidence
- `jtbd-needs` (optional) — job validation against actual usage
- `w3-hypothesis` (unavailable) — superseded by empirical data; grayed out with explanation

### 2. Load Context

- Read `$ARGUMENTS`: if file path, read it; if text, treat as concept; if empty, check for idea brief
- Read `research/{slug}/idea-brief.md` or `research/idea-brief.md` — treat as starting hypotheses, not settled truth
- Read CLAUDE.md, README for product context
- Read codebase (if it exists): package config, key source files, routes, data models
- Read existing `research/icp.md` if it exists (prior run — ask user if they want to refine or start fresh)
- Read any existing `research/customer-discovery-*.md` intermediate artifacts (from prior framework runs)

**Provisional product-path evidence.** When a referenced product path is not present in `research/.progress.yaml`, do not treat it as a canonical active path. Require an explicit provisional-path evidence reference before using it as source context. If no such evidence exists, ask the user whether to proceed or to run `$idea-scope-brief` first.

### 3. Marketplace Side Preflight

Before identifying ICP candidates, resolve market-structure side coverage:

- Read any `Market Structure Handoff` or marketplace/platform/B2B2C/multi-sided notes from the idea brief, especially `## ICP Readiness`. Treat side names and value exchange as hypotheses, not validated ICPs.
- If no idea brief exists, infer likely sides from `$ARGUMENTS`, README, specs, codebase context, or product description when the concept suggests a marketplace/platform/B2B2C/multi-sided model.
- During broad market research, validate or refute the classification with evidence.
- Before candidate generation, write a side-coverage note in the working packet.
- Candidate generation must cover each material side or explicitly explain why a side is excluded.

### 4. Candidate Bootstrapping

This step runs in Mode A only (skipped when `research/icp.md` already exists and user chooses to refine).

**Broad market research** using web search with **8–12 diverse query strategies** (direct persona, pain point, market segment, trend, competitor user, forum/community, job posting, industry report, switching trigger, adjacent market, geographic/regulatory, business model, WTP signal, named account searches).

**Classify the business model** into one or more of: B2B SaaS (PLG), B2B SaaS (SLG), B2C, B2C subscription, marketplace/platform, B2B2C, D2C, open-source/open-core, API/developer-first.

**Identify 2–5 ICP candidates.** For each, note: who they are, pain evidence, accessibility, value delivery potential, WTP signal strength.

Write candidates to `research/_working/preliminary-customer-discovery-research.md`.

**Checkpoint — Present candidates to the user.** Show ICP candidates with evidence. Ask for corrections and missing segments. Incorporate feedback before framework selection.

### 5. Mode A — Framework Selection

Build an alignment page with mode explanation, ICP candidates summary, available evidence, multi-select framework section (with mode-appropriate defaults pre-checked), execution plan explanation, and approval gate.

After user approval, write selected frameworks as sequential steps in `tasks/todo.md`:

```markdown
## Customer Discovery Framework Execution

- [ ] Run `$customer-discovery/frameworks/w3-hypothesis` — Schwartzfarb W3 hypothesis
- [ ] Run `$customer-discovery/frameworks/jtbd-needs` — JTBD needs analysis
- [ ] Run `$customer-discovery/frameworks/four-forces` — Moesta four forces
- [ ] Synthesize: `$customer-discovery --synthesize` — Combine framework outputs into research/icp.md
```

Only include frameworks the user selected. Always append the synthesis step last.

Stop after writing `tasks/todo.md`. The user runs `$exec` to execute each framework sequentially.

### 6. Mode B — Synthesis (`$customer-discovery --synthesize`)

Read all intermediate framework outputs (`research/customer-discovery-{slug}.md`). At least one must exist.

**Synthesis mapping** — how framework outputs merge into the canonical 9+1 section format:

| Canonical Section | Primary Source | Secondary Sources |
|---|---|---|
| Customer Profile | w3-hypothesis (WHO), pmf-engine (HXC) | seven-dimensions (Ready/Willing/Able) |
| User Profile(s) | w3-hypothesis (WHO detail), pmf-engine (daily users) | jtbd-needs (job performers) |
| Trigger Events | four-forces (Push), five-rings (Priority Initiative) | jtbd-needs (unmet outcomes) |
| Current State Journey | jtbd-needs (current job map) | four-forces (Habit) |
| Pain Map | jtbd-needs (underserved outcomes) | four-forces (Push intensity) |
| Current Alternatives | four-forces (Habit, current solution language) | five-rings (Decision Criteria) |
| Market Sizing | Aggregated across frameworks | seven-dimensions (Acquisition Efficiency) |
| Stated Value Drivers | w3-hypothesis (WHAT/WHY), jtbd-needs (desired outcomes) | five-rings (Success Factors), pmf-engine |
| Customer ↔ User Dynamics | seven-dimensions (post-sale dimensions) | five-rings (Buyer's Journey) |
| Discovery & Evaluation | five-rings (all 5 rings) | four-forces (Active Looking) |

**Cross-ICP handling**: Merge per-candidate evidence across frameworks, select primary ICP using seven-dimensions scoring (or value × accessibility matrix), populate Additional ICPs and Cross-ICP Analysis sections.

Build alignment page for synthesis approval. After approval: write `research/icp.md` and `research/icp-search-log.md`, then emit next-step routing.

### 7. Mode C — Discovery Shortcut (`$customer-discovery discovery`)

Pre-product shortcut. Build alignment page, then after approval write to `tasks/todo.md`:

```markdown
## Customer Discovery Framework Execution

- [ ] Run `$customer-discovery/frameworks/w3-hypothesis` — Schwartzfarb W3 hypothesis
- [ ] Run `$customer-discovery/frameworks/jtbd-needs` — JTBD needs analysis
- [ ] Run `$customer-discovery/frameworks/four-forces` — Moesta four forces
- [ ] Synthesize: `$customer-discovery --synthesize` — Write research/icp.md
```

Stop — user runs `$exec`.

### 8. Mode D — Validation Shortcut (`$customer-discovery validate`)

Product-exists shortcut. Build alignment page, then after approval write to `tasks/todo.md`:

```markdown
## Customer Discovery Framework Execution

- [ ] Run `$customer-discovery/frameworks/pmf-engine` — Vohra PMF Engine + HXC
- [ ] Run `$customer-discovery/frameworks/seven-dimensions` — Lincoln Murphy scoring
- [ ] Synthesize: `$customer-discovery --synthesize` — Write research/icp.md
```

Stop — user runs `$exec`.

### 9. Next Steps (after synthesis only)

Recommend the first matching condition as **Recommended**, remaining as **Other options**:

- ALWAYS: `$competitive-analysis` — Research competitors and market gaps for this ICP
- IF no `specs/`: `$competitive-analysis` — Map the competitive landscape
- IF `specs/` exist but no `research/journey-map.md`: check pack availability for `customer-lifecycle`, recommend `$journey-map` or `$pack install customer-lifecycle`
- IF codebase exists: check pack availability for `business-ops`, recommend `$mvp-gap` or `$pack install business-ops`
- IF `research/competitive-analysis.md` exists: check pack availability for `product-design`, recommend `$brainstorm` or `$pack install product-design`

### 10. Downstream Impact Check

After writing, check existing downstream documents for conflicts. Classify as None/Minor/Major. For Major, recommend `$reconcile-research`.

## Output

### Mode A output: `tasks/todo.md` update + working packet

### Mode B output: `research/icp.md` (or `research/{slug}/icp.md`)

Canonical 9+1 section format preserved for downstream compatibility. See claude mirror for full template.

### `research/icp-search-log.md`

Raw research log with all queries, findings, evidence, and data gaps.

### `research/.progress.yaml`

Product-path manifest updated when secondary ICPs create parked or promotable paths.

## Task Classification

- Immediately actionable → `tasks/todo.md`
- Human-only external actions → `tasks/manual-todo.md`
- Condition-gated records → `tasks/record-todo.md`
- Cadence-based reviews → `tasks/recurring-todo.md`

## Constraints

- **Parent does not execute frameworks.** It bootstraps candidates, selects frameworks, and synthesizes. `$exec` handles framework execution.
- **Synthesis requires at least one framework output.**
- **Mode detection is evidence-based.**
- **Stay in problem space.** No features, architecture, UI, or technical solutions.
- **Evidence-based.** Every claim must trace back to research evidence.
- **Primary ICP must use the canonical 9 top-level `##` sections** for downstream compatibility.
- **Section 10 captures behavioural signals only.**
- **WTP is evidence, not pricing strategy.** Route raw signals to `$monetization`.
- **Do not overwrite existing `research/icp.md`** without asking.
- **Minimum 8 web search queries** before identifying ICP candidates.
- **Present before writing.**

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/customer-discovery-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
