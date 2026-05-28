---
name: positioning
description: Strategic positioning (April Dunford style) — competitive alternatives, unique attributes, value, target segment, market category
type: research
version: v0.4
argument-hint: "[optional: focus area e.g. \"category\", \"vs competitor X\"]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Positioning — Strategic Product Positioning

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Develops rigorous product positioning using the "Obviously Awesome" methodology (April Dunford). Determines competitive alternatives, unique attributes, customer value, target segment, and market category. Positioning is upstream of messaging — it determines *how you frame the product category itself*.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{app}/icp.md`) must exist. If not, tell the user to run `/icp` first and stop.
- **Hard**: `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) must exist. If not, tell the user to run `/competitive-analysis` first and stop.
- **Strong default**: `research/journey-map.md` (or `research/{app}/journey-map.md`) should exist before writing canonical positioning. If missing, recommend `/journey-map` first unless the user explicitly needs a provisional category/alternatives hypothesis. Early positioning may be discussed as provisional working notes, but do not write canonical `research/positioning.md` without clear user approval to proceed without journey evidence.
- **Soft**: Read these if they exist:
  - `research/journey-map.md` — where value is delivered, the aha moment
  - `research/customer-feedback.md` — real customer language about what makes the product different
  - `research/monetization.md` — pricing context for value perception

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`

### 0a. Product Path Manifest

Read `research/.progress.yaml` when present. Normalize `active_path` (singular legacy) to `active_paths` (plural list) when reading. Scope positioning to the active product path by default. When positioning insights suggest a fundamentally different market category for a deferred path, add a `## Product Path Implications` section recommending `/product-line fork` or noting the impact on the deferred path's revisit trigger.

### 1. Load Context

- Read `research/icp.md` — ICP segments, pain points, value props, trigger events, current-state journey
- Read `research/competitive-analysis.md` — competitor landscape, positioning, strengths/weaknesses, market gaps
- Read other soft prerequisite files if they exist
- Read CLAUDE.md, README, and key source files for product context

### 2. Research Positioning Approaches

Use WebSearch with **4-6 targeted queries**:

1. **Category definition** — "how [category] is defined", "[category] vs [adjacent category]"
2. **Positioning examples** — "[competitor] positioning statement", "how [competitor] describes itself"
3. **Category creation** — "creating new category [domain]", "[domain] category leadership"
4. **Customer language** — "[category] how customers describe", "[domain] buyer vocabulary"
5. **Positioning frameworks** — "obviously awesome positioning", "April Dunford [category]"

### 3. Step 1 — Competitive Alternatives (What Would Customers Use Instead?)

NOT just direct competitors. Include:
- **Direct competitors** — products in the same category
- **Adjacent solutions** — products in nearby categories that solve the same pain differently
- **DIY/manual workarounds** — spreadsheets, manual processes, hiring someone
- **Do nothing** — the status quo (this is often the real competitor)

Use AskUserQuestion to present and validate:
- "Here are the competitive alternatives I see. What would your best customers actually use if your product disappeared tomorrow?"

### 4. Step 2 — Unique Attributes (What Do You Have That Alternatives Don't?)

For each competitive alternative, identify what's genuinely different about this product:
- Features that alternatives lack
- Approach or philosophy that's fundamentally different
- Technical advantages (speed, accuracy, simplicity)
- Business model advantages (pricing structure, no lock-in)
- Community or ecosystem advantages

**Be ruthless.** Only include attributes that are truly unique, not "we also do X." If competitors also have it, it's table stakes, not positioning.

Use AskUserQuestion:
- "Are these genuinely unique? Would your most discerning customer agree these are different?"

### 5. Step 3 — Value (What Does Uniqueness Enable for Customers?)

Map each unique attribute to the customer value it creates:

| Unique Attribute | Customer Value | Evidence |
|-----------------|----------------|----------|
| [attribute] | [what it enables] | [from ICP, feedback, or research] |

Value categories:
- **Saves time** — enables faster outcomes
- **Saves money** — reduces cost vs. alternatives
- **Reduces risk** — prevents failures, compliance issues
- **Unlocks capability** — enables something previously impossible
- **Improves quality** — better outcomes than alternatives

Use AskUserQuestion:
- "Is this the value your customers actually experience, or the value you hope they'll experience?"

### 6. Step 4 — Target Segment (Who Cares Most About This Value?)

From the ICP analysis, identify the segment that values these unique attributes THE MOST. This is not the broadest market — it's the best-fit customer:

- Who has the most acute pain that your unique attributes address?
- Who would be most disappointed if the product disappeared?
- Who gets the most value from what makes you different (not just from the category)?

Use AskUserQuestion:
- "This is the segment I'd position for. Does this feel right, or is there a segment that values your uniqueness even more?"

### 7. Step 5 — Market Category (What Context Makes Your Value Obvious?)

This is the most consequential decision. The market category determines:
- Who you're compared against
- What features are expected (table stakes)
- What "good" looks like
- How buyers find you

Three strategies:
1. **Existing category** — position within a known category (e.g., "project management tool"). Best when the category is well-understood and you can win on a specific dimension.
2. **Subcategory** — carve out a niche within an existing category (e.g., "project management for creative teams"). Best when you serve a specific segment much better than generic tools.
3. **New category** — create a new category (e.g., "collaborative work management"). Best when existing categories don't capture your value — but expensive and slow.

Use WebSearch to research how customers and analysts describe the space. Present recommendation with reasoning:
- "I recommend positioning in [category/subcategory/new category] because [rationale]. Here's how it frames you against alternatives..."

### 8. Synthesize Positioning Statement

Combine all five steps into a positioning statement:

**For** [target segment]
**who** [key pain / trigger event]
**[product name] is a** [market category]
**that** [key value / unique benefit]
**Unlike** [primary competitive alternative]
**[product name]** [key differentiator]

Present the full positioning framework and statement to the user. Ask:
- "Does this positioning feel true to what your best customers experience?"
- "Would this change how you describe the product on your homepage?"
- "Ready to write this to `research/positioning.md`?"

### 9. Populate Next Steps

Include 3–5 applicable items with "Pick one:" framing:

- ALWAYS: check `.agents/project.json.enabled_packs` for `product-design` — if `product-design` is not enabled, recommend `/pack install product-design` first; if `product-design` is enabled, recommend `/ux-variations [positioning-backed product direction]` — Explore prototype directions now that ICP, competitive, journey, and positioning evidence are aligned
- IF no `research/journey-map.md`: check `.agents/project.json.enabled_packs` for `customer-lifecycle` — if `customer-lifecycle` is not enabled, recommend `/pack install customer-lifecycle` first; if `customer-lifecycle` is enabled, recommend `/journey-map` — Map the customer journey before writing canonical positioning
- IF solution-customer fit is weak, disputed, or needs explicit scoring: `/value-prop-canvas` — Optional detour to validate contested fit before UX or spec work
- IF revenue, channels, cost, defensibility, or unfair-advantage assumptions are material risks: `/lean-canvas` — Optional business-model synthesis before growth or ops work
- IF no `research/gtm.md`: check `.agents/project.json.enabled_packs` for `business-growth` — if `business-growth` is not enabled, recommend `/pack install business-growth` first; if `business-growth` is enabled, recommend `/gtm` — Build go-to-market plan grounded in this positioning
- IF `research/gtm.md` exists: check `.agents/project.json.enabled_packs` for `business-growth` — if `business-growth` is not enabled, recommend `/pack install business-growth` first; if `business-growth` is enabled, recommend `/gtm` — Refresh messaging framework to align with positioning
- IF no `research/monetization.md`: check `.agents/project.json.enabled_packs` for `business-growth` — if `business-growth` is not enabled, recommend `/pack install business-growth` first; if `business-growth` is enabled, recommend `/monetization` — Positioning informs pricing — "premium" vs "value" positioning changes price expectations
- IF codebase exists: check `.agents/project.json.enabled_packs` for `business-ops` — if `business-ops` is not enabled, recommend `/pack install business-ops` first; if `business-ops` is enabled, recommend `/mvp-gap` — Check if the product delivers on the positioning promise

### 10. Write Output

Only after the user confirms, write the output files.

### 11. Downstream Impact Check

After writing, check for downstream research documents that may be affected.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/gtm.md`

For each existing downstream document:
1. Read it — focus on `## Messaging Framework` and `## Positioning vs. Competitors`
2. Identify conflicts where messaging doesn't align with the new positioning
3. Note each conflict: file, section, stale claim, what it should now say

**Classify the impact**:
- **None**: No downstream docs exist, or no conflicts. Skip display.
- **Minor** (1–2 small conflicts): Display inline.
- **Major** (3+ conflicts OR market category changed, primary alternative shifted, value framing changed): Display and recommend `/reconcile-research`.

## Output

### `research/positioning.md` (or `research/{app}/positioning.md`)

```markdown
# Positioning

> Based on: research/icp.md, research/competitive-analysis.md[, research/journey-map.md, research/customer-feedback.md]
> Date: [current date]
> Methodology: "Obviously Awesome" (April Dunford)

## Positioning Statement

**For** [target segment]
**who** [key pain / trigger event]
**[product name] is a** [market category]
**that** [key value / unique benefit]
**Unlike** [primary competitive alternative]
**[product name]** [key differentiator]

## Summary
[2-3 sentences: the positioning thesis — what category you're in, why, and what makes you different]

## Step 1: Competitive Alternatives

What customers would use if this product didn't exist:

| Alternative | Type | Strengths | Weaknesses |
|------------|------|-----------|------------|
| [alternative] | Direct / Adjacent / DIY / Status quo | [strengths] | [weaknesses] |

**Primary competitive alternative**: [the one most customers would default to]

## Step 2: Unique Attributes

What this product has that alternatives genuinely don't:

| Attribute | Why It's Unique | Table Stakes? |
|-----------|----------------|---------------|
| [attribute] | [explanation] | No — alternatives lack this |

**Attributes explicitly excluded** (table stakes):
- [common feature] — [which alternatives also have this]

## Step 3: Value Mapping

| Unique Attribute | Customer Value | Value Type | Evidence |
|-----------------|----------------|------------|----------|
| [attribute] | [what it enables] | Time / Money / Risk / Capability / Quality | [source] |

**Primary value**: [the single most important value customers get from what's unique]

## Step 4: Best-Fit Target Segment

**Segment**: [specific description]
**Why they care most**: [why this segment values the unique attributes more than others]
**From ICP**: [reference to ICP segment — how this aligns or narrows the ICP]

### Characteristics of Best-Fit Customers
- [characteristic 1]
- [characteristic 2]
- [characteristic 3]

### Who This Is NOT For
- [segment that's a bad fit and why]

## Step 5: Market Category

**Category**: [chosen category]
**Strategy**: [Existing category / Subcategory / New category]
**Why**: [rationale for this category choice]

### How This Category Frames Us
- **Compared against**: [who buyers will compare us to in this category]
- **Table stakes**: [what's expected in this category — we must have these]
- **Our edge**: [where we excel relative to category expectations]

### Categories Considered & Rejected
| Category | Why Considered | Why Rejected |
|----------|---------------|-------------|
| [category] | [reason] | [reason] |

## Positioning Implications

### For Messaging
[How this positioning should shape homepage copy, tagline, and pitch]

### For Product
[What this positioning means for feature prioritization — what to build, what to skip]

### For Sales
[How to talk about the product in sales conversations — what to emphasize, what to avoid]

### For Pricing
[How this positioning affects price perception — premium vs. value, what to anchor against]

<!-- Only include when downstream impact is Minor or Major -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote]"
   - **Now**: [what positioning says instead]

[For Major only:]
> **Recommended action**: Run `/reconcile-research` to audit and fix all affected downstream documents.

## Next Steps

Pick one:
- [conditional items from step 9]
```

### `research/positioning-search-log.md` (or `research/{app}/positioning-search-log.md`)
Raw research log — queries, findings, evidence for each positioning decision.

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Requires ICP + competitive analysis.** Positioning without knowing the customer and the competition is guesswork.
- **Customer-grounded.** Every positioning decision must connect to real customer behavior or research evidence, not aspirational branding.
- **Be honest about uniqueness.** If nothing is truly unique, say so — that's a critical finding. Don't manufacture differentiation.
- **Present before writing.** Never write output files until the positioning has been presented and validated.
- **Positioning ≠ messaging.** This skill produces the strategic foundation. Messaging (the actual copy and taglines) is `/gtm`'s job.
- **Do not overwrite existing `research/positioning.md`** without asking the user first.
- **One positioning per product.** Don't try to position differently for different segments — pick the best-fit segment and position for them.

## Alignment Page

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/positioning-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
