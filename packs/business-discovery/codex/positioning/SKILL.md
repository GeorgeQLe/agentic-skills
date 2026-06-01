---
name: positioning
description: Parent router — detect market vs product mode, recommend positioning frameworks, synthesize outputs into unified positioning
type: research
version: v0.7
argument-hint: "[optional: \"product\" | \"--synthesize\" | focus area]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Positioning — Parent Router

Invoke as `$positioning`.

This is a **parent router skill**. It detects context, recommends applicable positioning frameworks, and synthesizes their outputs. Individual frameworks live as child skills under `frameworks/`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Default stance: assume the user has no insider knowledge of the market. The positioning recommendation must stand on research, customer evidence, and codebase reality before asking for user input.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `$icp` first and stop.
- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `$competitive-analysis` first and stop.
- **Strong default**: `research/journey-map.md` should exist before writing canonical positioning. If missing, recommend `$journey-map` first unless the user explicitly needs a provisional positioning analysis.
- **Soft**: Read these if they exist:
  - `research/journey-map.md`
  - `research/customer-feedback.md`
  - `research/monetization.md`

## Operational Modes

### Mode A: Framework Selection (default first invocation)

Activated by: `$positioning` or `$positioning [focus area]` (no special flags).

### Mode B: Synthesis

Activated by: `$positioning --synthesize`

### Mode C: Product-Positioning Shortcut

Activated by: `$positioning product` or `$positioning post-launch` or `$positioning obviously-awesome`

---

## Process

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived`, stop and warn.
3. Read `research/.progress.yaml` when present. Normalize legacy fields.
4. If active product paths exist in the manifest, use those paths. Ask if multiple.
5. If no active manifest target exists, list non-archived product directories under `research/`.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint.

When product path `{slug}` is active, read and write research under `research/{slug}/`.

### 1. Mode Detection

Detect **market-positioning mode** (default) or **product-positioning mode**:

**Market-positioning mode** activates when:
- No `research/customer-feedback.md` with post-launch customer evidence, AND
- No production codebase with live users detected, AND
- `$ARGUMENTS` does not contain "product", "post-launch", or "obviously-awesome"

Available frameworks in market mode:
- `jtbd-positioning` — Jobs-to-be-Done positioning analysis
- `strategic-canvas` — Blue Ocean strategic canvas
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

- Read `research/icp.md`, `research/competitive-analysis.md`
- Read soft prerequisites if they exist
- Read CLAUDE.md, README for product context
- Read any existing `research/positioning-*.md` intermediate artifacts

### 3. Mode A — Framework Selection

Build an alignment page with:

1. **Mode explanation**: which mode was detected and why
2. **Available evidence summary**
3. **Multi-select framework section**: checkboxes with pre-checked defaults:
   - Market mode: `jtbd-positioning` + `strategic-canvas` + `moore-positioning` pre-checked; `category-design` unchecked
   - Product mode: `obviously-awesome` pre-checked; `strategic-canvas` unchecked
4. **Execution plan**: selected frameworks written to `tasks/todo.md` for sequential `$exec` execution
5. **Approval gate**

After user approval (compiled YAML with `selected_frameworks` list):

Write selected frameworks as sequential steps in `tasks/todo.md`:

```markdown
## Positioning Framework Execution

- [ ] Run `$positioning/frameworks/jtbd-positioning` — JTBD analysis
- [ ] Run `$positioning/frameworks/strategic-canvas` — Blue Ocean gap analysis
- [ ] Run `$positioning/frameworks/moore-positioning` — Positioning hypothesis
- [ ] Synthesize: `$positioning --synthesize` — Combine framework outputs into research/positioning.md
```

Only include selected frameworks. Always append synthesis step last. Stop after writing.

### 4. Mode B — Synthesis (`$positioning --synthesize`)

Read all intermediate framework outputs (`research/positioning-*.md`). At least one must exist.

Synthesize into unified `research/positioning.md`:

**Market-positioning synthesis**: combined hypothesis, Moore template filled with cross-framework evidence, evidence matrix, confidence levels, validation plan. Header: `> Mode: Market Positioning (hypothesized, pre-product)`

**Product-positioning synthesis**: positioning statement from Obviously Awesome, customer-grounded evidence matrix, confidence levels. Header: `> Mode: Product Positioning (customer-grounded)`

Build alignment page for synthesis approval. After approval: write `research/positioning.md`, emit next-step routing.

### 5. Mode C — Product-Positioning Shortcut

Skip multi-select. Write to `tasks/todo.md`:

```markdown
## Positioning Framework Execution

- [ ] Run `$positioning/frameworks/obviously-awesome` — April Dunford positioning
- [ ] Synthesize: `$positioning --synthesize` — Write research/positioning.md
```

Stop — user runs `$exec`.

### 6. Next Steps (after synthesis only)

- ALWAYS: check for `product-design` pack → recommend `$ux-variations`
- IF no journey-map: check for `customer-lifecycle` pack → recommend `$journey-map`
- IF solution-customer fit weak/disputed: `$value-prop-canvas`
- IF business-model risks: `$lean-canvas`
- IF no GTM: check for `business-growth` pack → recommend `$gtm`
- IF GTM exists: recommend `$gtm` refresh
- IF no monetization: check for `business-growth` pack → recommend `$monetization`
- IF codebase exists: check for `business-ops` pack → recommend `$mvp-gap`

### 7. Downstream Impact Check (after synthesis write)

Check `research/gtm.md`. Classify impact as None/Minor/Major per standard pattern.

## Optional Research Trigger Map

These detours are conditional framework owners, not required AFPS chain links.

| Positioning signal | Owner | Trigger threshold |
|---|---|---|
| Solution-customer fit weak/disputed, value mapping low confidence | `$value-prop-canvas` | Trigger: unique attributes can't be confidently mapped to value. Skip: value mapping clear. |
| Business-model risk exposed by category strategy | `$lean-canvas` | Trigger: risk would change UX or prototype choices. Skip: normal competitive findings. |
| Pricing architecture central to positioning | `$monetization` | Trigger: category/value mapping requires grounded pricing. Skip: pricing not a differentiator. |

## Output

### Mode A: `tasks/todo.md` update (framework execution steps)
### Mode B: `research/positioning.md` (unified synthesis — see claude variant for full template)
### Mode C: `tasks/todo.md` update (obviously-awesome + synthesis)

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable work goes in `tasks/todo.md`.
- Human-only external actions go in `tasks/manual-todo.md`.
- Condition-gated records go in `tasks/record-todo.md`.
- Cadence-based reviews go in `tasks/recurring-todo.md`.

## Constraints

- **Requires ICP + competitive analysis.**
- **Customer-grounded.** Every decision connects to real evidence.
- **Mode detection is evidence-based.** Do not override without user confirmation.
- **Parent does not execute frameworks.** It selects and queues them. `$exec` handles execution.
- **Synthesis requires at least one framework output.**
- **Do not overwrite existing `research/positioning.md`** without asking first.

## Alignment Page

When this skill produces durable deliverables, build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/positioning-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
