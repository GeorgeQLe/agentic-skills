---
name: positioning
description: Orchestrator — detect market vs product mode, recommend positioning frameworks, synthesize outputs into unified positioning
type: research
version: v0.10
argument-hint: "[optional: \"product\" | \"--synthesize\" | focus area]"
invocation: orchestrator
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Positioning — Orchestrator

This is an **orchestrator skill** using the parent router delegation pattern. It detects context, recommends applicable positioning frameworks, and synthesizes their outputs. Individual frameworks live as child skills under `frameworks/`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Staged Research Workflow

Use this staged workflow for synthesized research or report outputs that would create or update canonical research, spec, or task files.

1. **Stage 1 - Research and clarify.** Perform the research, run required source/code checks, and ask any needed clarification questions. Write only a non-canonical working packet: flat mode uses `research/_working/preliminary-<skill>-research.md`; product-path mode uses `research/{slug}/_working/preliminary-<skill>-research.md`. Replace `<skill>` with this skill's `name` value. Do not create or update canonical research, spec, or task files in Stage 1. Raw evidence or search logs may remain as supporting evidence where this skill already requires them, but synthesized deliverables stay in the working packet.
2. **Stage 2 - Review alignment.** Consume the working packet and build the `review` HTML alignment page. The page must render the full preliminary packet, evidence matrix, assumptions/confidence register, source coverage gaps, proposed canonical file changes, and approval gates. Stop for either feedback-only YAML or final compiled YAML. Feedback-only YAML revises the working packet and page, then remains in Stage 2.
3. **Stage 3 - Finalize approved artifacts.** Consume final compiled YAML only when it has no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback. Apply approved edits first, archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`, remove the active working packet, write the approved canonical artifacts to the unchanged output paths below, and convert the alignment page to `confirmed` with the approval record preserved.

Canonical output paths remain unchanged. Search logs and other supporting evidence remain allowed only where this skill's output contract already requires them.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `/icp` first and stop.
- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `/competitive-analysis` first and stop.
- **Strong default**: `research/journey-map.md` (or `research/{slug}/journey-map.md`) should exist before writing canonical positioning. If missing, recommend `/journey-map` first unless the user explicitly needs a provisional positioning analysis.
- **Soft**: Read these if they exist:
  - `research/journey-map.md` — where value is delivered, the aha moment
  - `research/customer-feedback.md` — real customer language about what makes the product different
  - `research/monetization.md` — pricing context for value perception

## Operational Modes

### Mode A: Framework Selection (default first invocation)

Activated by: `/positioning` or `/positioning [focus area]` (no special flags).

### Mode B: Synthesis

Activated by: `/positioning --synthesize`

### Mode C: Product-Positioning Shortcut

Activated by: `/positioning product` or `/positioning post-launch` or `/positioning obviously-awesome`

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
7. Detect monorepo/app/package structure only as a secondary hint. Suggest creating a missing `research/{slug}/` product path when code clearly exposes an app, but do not require code or monorepo detection before using `research/{slug}/`.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`, and treat top-level `research/*.md` files as flat-mode documents or cross-path summaries.

### 1. Mode Detection

Detect **market-positioning mode** (default) or **product-positioning mode**:

**Market-positioning mode** activates when:
- No `research/customer-feedback.md` with post-launch customer evidence, AND
- No production codebase with live users detected, AND
- `$ARGUMENTS` does not contain "product", "post-launch", or "obviously-awesome"

Available frameworks in market mode:
- `jtbd-positioning` — Jobs-to-be-Done positioning analysis
- `strategic-canvas` — Blue Ocean strategic canvas (eliminate/reduce/raise/create)
- `moore-positioning` — Geoffrey Moore positioning hypothesis
- `category-design` — Play Bigger category creation

**Product-positioning mode** activates when:
- `research/customer-feedback.md` exists with real customer data, OR
- `$ARGUMENTS` contains "product", "post-launch", or "obviously-awesome", OR
- Production spec exists AND customer feedback references real users

Available frameworks in product mode:
- `obviously-awesome` — April Dunford (requires real customer evidence)
- `strategic-canvas` — optionally, for category refresh

### 2. Load Context

- Read `research/icp.md` — ICP segments, pain points, value props, trigger events
- Read `research/competitive-analysis.md` — competitor landscape, gaps
- Read `research/journey-map.md` if it exists — aha moment, value delivery
- Read `research/customer-feedback.md` if it exists — real language, satisfaction drivers
- Read CLAUDE.md, README for product context
- Read any existing `research/positioning-*.md` intermediate artifacts (from prior runs)

### 3. Mode A — Framework Selection

Build an alignment page with:

1. **Mode explanation**: which mode was detected and why (evidence for detection)
2. **Available evidence summary**: what research exists and what's missing
3. **Multi-select framework section**: checkboxes for each available framework with:
   - Framework name and one-line description
   - Why it's recommended or optional for this context
   - Pre-checked defaults based on available evidence:
     - Market mode defaults: `jtbd-positioning` + `strategic-canvas` + `moore-positioning` pre-checked; `category-design` unchecked (recommended only when strategic canvas shows no existing category fits)
     - Product mode defaults: `obviously-awesome` pre-checked; `strategic-canvas` unchecked (optional refresh)
4. **Execution plan explanation**: selected frameworks will be written to `tasks/todo.md` for sequential `/exec` execution
5. **Approval gate**: framework selection confirmation

After user approval via compiled YAML (which includes `selected_frameworks` list):

Write selected frameworks as sequential steps in `tasks/todo.md`:

```markdown
## Positioning Framework Execution

- [ ] Run `/positioning/frameworks/jtbd-positioning` — JTBD analysis
- [ ] Run `/positioning/frameworks/strategic-canvas` — Blue Ocean gap analysis
- [ ] Run `/positioning/frameworks/moore-positioning` — Positioning hypothesis
- [ ] Synthesize: `/positioning --synthesize` — Combine framework outputs into research/positioning.md
```

Only include frameworks the user selected. Always append the synthesis step last.

Stop after writing `tasks/todo.md`. The user runs `/exec` to execute each framework sequentially.

### 4. Mode B — Synthesis (`/positioning --synthesize`)

Read all intermediate framework outputs:
- `research/positioning-jtbd.md`
- `research/positioning-strategic-canvas.md`
- `research/positioning-moore.md`
- `research/positioning-category-design.md`
- `research/positioning-obviously-awesome.md`

At least one must exist. If none exist, tell user to run framework selection first.

Synthesize into unified `research/positioning.md`:

**Market-positioning synthesis includes:**
- Combined positioning hypothesis drawing from all framework outputs
- Moore template filled with evidence from JTBD + Canvas + Category analysis
- Evidence matrix: each claim mapped to which framework(s) support it
- Confidence levels per claim (strong/moderate/hypothesized)
- Validation plan: what needs testing before the position is canonical
- Mode header: `> Mode: Market Positioning (hypothesized, pre-product)`

**Product-positioning synthesis includes:**
- Positioning statement (Obviously Awesome output)
- Evidence matrix grounded in customer feedback
- Confidence levels (most should be "strong" — backed by customer data)
- Mode header: `> Mode: Product Positioning (customer-grounded)`

Build alignment page for synthesis approval with:
- Full proposed `research/positioning.md` content
- Evidence matrix combining all framework sources
- Confidence/assumption register
- Proposed file changes gate
- Approval gate

After approval: write `research/positioning.md`, then emit next-step routing.

### 5. Mode C — Product-Positioning Shortcut

Skip multi-select. Build an alignment page for the shortcut execution plan with:

1. **Shortcut explanation**: product-positioning shortcut selected and why `obviously-awesome` is the only queued framework
2. **Evidence readiness**: customer-feedback requirement and any missing evidence caveats
3. **Proposed execution plan**: the exact `tasks/todo.md` framework queue shown below
4. **Approval gate**: require final compiled YAML approval before writing `tasks/todo.md`

Do not write `tasks/todo.md` before alignment approval. The next action is review of the HTML alignment page.

After user approval via final compiled YAML, write this execution plan to `tasks/todo.md`:

```markdown
## Positioning Framework Execution

- [ ] Run `/positioning/frameworks/obviously-awesome` — April Dunford positioning
- [ ] Synthesize: `/positioning --synthesize` — Write research/positioning.md
```

Stop — user runs `/exec`.

### 6. Next Steps (after synthesis only)

Include 3–5 applicable items with "Recommended + Other options" framing:

- ALWAYS: check `.agents/project.json.enabled_packs` for `product-design` — if not enabled, recommend `/pack install product-design`; if enabled, recommend `/ux-variations [positioning-backed product direction]`
- IF no `research/journey-map.md`: check for `customer-lifecycle` pack → recommend `/journey-map`
- IF solution-customer fit is weak/disputed: `/value-prop-canvas`
- IF revenue/channels/cost/defensibility risks exposed: `/lean-canvas`
- IF no `research/gtm.md`: check for `business-growth` pack → recommend `/gtm`
- IF `research/gtm.md` exists: recommend `/gtm` refresh
- IF no `research/monetization.md`: check for `business-growth` pack → recommend `/monetization`
- IF codebase exists: check for `business-ops` pack → recommend `/mvp-gap`

### 7. Downstream Impact Check (after synthesis write)

Check for downstream research documents that may be affected:
- `research/gtm.md`

Classify impact as None/Minor/Major per standard pattern.

## Optional Research Trigger Map

These detours are conditional framework owners, not required AFPS chain links. Apply after synthesis.

| Positioning signal | Owner | Trigger threshold |
|---|---|---|
| Solution-customer fit weak/disputed, value mapping low confidence | `/value-prop-canvas` | Trigger: unique attributes can't be confidently mapped to value. Skip: value mapping clear even if hypothesized. |
| Business-model risk (revenue/channels/cost/defensibility) exposed by category strategy | `/lean-canvas` | Trigger: risk would change UX or prototype choices. Skip: normal competitive findings. |
| Pricing architecture central to positioning (premium vs value changes direction) | `/monetization` | Trigger: category/value mapping requires grounded pricing. Skip: pricing not a differentiator. |

## Output

### Mode A output: `tasks/todo.md` update

Framework execution steps (see section 3 above).

### Mode B output: `research/positioning.md` (or `research/{slug}/positioning.md`)

```markdown
# Positioning

> Based on: [list of framework outputs used]
> Date: [current date]
> Mode: Market Positioning (hypothesized, pre-product) | Product Positioning (customer-grounded)
> Frameworks applied: [list]

## Positioning Statement

**For** [target segment]
**who** [key pain / trigger event]
**[product name] is a** [market category]
**that** [key value / unique benefit]
**Unlike** [primary competitive alternative]
**[product name]** [key differentiator]

## Summary
[2-3 sentences: the positioning thesis]

## Evidence Matrix

| Claim | Supporting Framework(s) | Evidence | Confidence | Assumption Status |
|-------|------------------------|----------|------------|-------------------|
| [claim] | JTBD / Canvas / Moore / Category / OA | [source] | Strong / Moderate / Hypothesized | Validated / Needs testing |

## Framework Synthesis

### From JTBD Analysis
[Key findings — primary job, outcome positioning]

### From Strategic Canvas
[Key findings — eliminate/reduce/raise/create moves, competitive gaps]

### From Moore Hypothesis
[Key findings — positioning template, evidence gaps]

### From Category Design
[Key findings — category diagnosis, POV if new category]

### From Obviously Awesome
[Key findings — if product mode]

## Target Segment
[Best-fit segment with evidence from multiple frameworks]

## Market Category
[Chosen category with evidence from multiple frameworks]

## Confidence Register

| Element | Confidence | Evidence Source | What Would Change It |
|---------|-----------|----------------|---------------------|
| [element] | [level] | [source] | [condition] |

## Validation Plan (market mode only)
[What needs testing before this position is canonical]

## Positioning Implications

### For Messaging
### For Product
### For Sales
### For Pricing

## Downstream Impact
[Standard pattern]

## Next Steps
[Standard routing]
```

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`.
- One-time condition-gated records go in `tasks/record-todo.md`.
- Cadence-based reviews go in `tasks/recurring-todo.md`.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless promoted.

## Constraints

- **Requires ICP + competitive analysis.** Positioning without knowing the customer and the competition is guesswork.
- **Customer-grounded.** Every positioning decision must connect to real customer behavior or research evidence.
- **Mode detection is evidence-based.** Do not override mode detection without user confirmation.
- **Parent does not execute frameworks.** It selects and queues them. `/exec` handles execution.
- **Synthesis requires at least one framework output.** Do not synthesize from zero evidence.
- **Do not overwrite existing `research/positioning.md`** without asking the user first.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/positioning-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
