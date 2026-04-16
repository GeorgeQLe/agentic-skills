---
name: positioning
description: Strategic positioning (April Dunford style) — competitive alternatives, unique attributes, value, target segment, market category
type: research
version: 1.1.0
argument-hint: "[optional: focus area e.g. \"category\", \"vs competitor X\"]"
---

# Positioning — Strategic Product Positioning

Invoke as `$positioning`.

Develops rigorous product positioning using the "Obviously Awesome" methodology (April Dunford). Determines competitive alternatives, unique attributes, customer value, target segment, and market category. Positioning is upstream of messaging — it determines *how you frame the product category itself*.

Default stance: assume the user has no insider knowledge of the market. The positioning recommendation must stand on research, customer evidence, and codebase reality before asking for user input. Ask for corrections, proprietary differentiators, and hard constraints, not intuition.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{app}/icp.md`) must exist. If not, tell the user to run `$icp` first and stop.
- **Hard**: `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) must exist. If not, tell the user to run `$competitive-analysis` first and stop.
- **Soft**: Read these if they exist:
  - `research/journey-map.md` — where value is delivered, the aha moment
  - `research/customer-feedback.md` — real customer language about what makes the product different
  - `research/monetization.md` — pricing context for value perception

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`

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

Present and validate with the user. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text:
- "Here are the competitive alternatives the evidence suggests. Which, if any, are factually wrong, missing, or mis-prioritized for this product?"

### 4. Step 2 — Unique Attributes (What Do You Have That Alternatives Don't?)

For each competitive alternative, identify what's genuinely different about this product:
- Features that alternatives lack
- Approach or philosophy that's fundamentally different
- Technical advantages (speed, accuracy, simplicity)
- Business model advantages (pricing structure, no lock-in)
- Community or ecosystem advantages

**Be ruthless.** Only include attributes that are truly unique, not "we also do X." If competitors also have it, it's table stakes, not positioning.

If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "Which of these attributes are unsupported, overstated, or missing a proprietary differentiator I should include?"

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

If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "Which value claims are strongest, and which need better evidence or should be removed?"

### 6. Step 4 — Target Segment (Who Cares Most About This Value?)

From the ICP analysis, identify the segment that values these unique attributes THE MOST. This is not the broadest market — it's the best-fit customer:

- Who has the most acute pain that your unique attributes address?
- Who would be most disappointed if the product disappeared?
- Who gets the most value from what makes you different (not just from the category)?

If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text:
- "This is the segment the evidence supports. Which commercial constraints, missing segments, or product realities should change this recommendation?"

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
- "Which parts of this positioning need stronger evidence, better wording, or adjustment for product realities?"
- "Would this change how you describe the product on your homepage?"
- "Ready to write this to `research/positioning.md`?"

### 9. Populate Next Steps

Include a **Recommended** item (the single highest-impact next step given current project state) with a one-line reason, followed by **Other options** (2–4 alternatives). Use this format in the output:

## Next Steps

**Recommended:** `$gtm` — messaging should flow directly from positioning; this is the natural next step

Other options:
- IF no `research/gtm.md`: `$gtm` — Build go-to-market plan grounded in this positioning
- IF `research/gtm.md` exists: `$gtm` — Refresh messaging framework to align with positioning
- IF no `research/monetization.md`: `$monetization` — Positioning informs pricing — "premium" vs "value" positioning changes price expectations
- IF codebase exists: `$mvp-gap` — Check if the product delivers on the positioning promise

The recommendation (`$gtm`) is always applicable — positioning without a GTM plan to execute it is incomplete.

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
- **Major** (3+ conflicts OR market category changed, primary alternative shifted, value framing changed): Display and recommend `$reconcile-research`.

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
> **Recommended action**: Run `$reconcile-research` to audit and fix all affected downstream documents.

## Next Steps

**Recommended:** `$gtm` — [one-line reason based on whether gtm.md exists or needs refresh]

Other options:
- [conditional items from step 9 — only include items whose conditions are met]
```

### `research/positioning-search-log.md` (or `research/{app}/positioning-search-log.md`)
Raw research log — queries, findings, evidence for each positioning decision.

Create the `research/` directory if it doesn't exist.

## Constraints

- **Requires ICP + competitive analysis.** Positioning without knowing the customer and the competition is guesswork.
- **Customer-grounded.** Every positioning decision must connect to real customer behavior or research evidence, not aspirational branding.
- **Be honest about uniqueness.** If nothing is truly unique, say so — that's a critical finding. Don't manufacture differentiation.
- **Present before writing.** Never write output files until the positioning has been presented and validated.
- **Positioning ≠ messaging.** This skill produces the strategic foundation. Messaging (the actual copy and taglines) is `$gtm`'s job.
- **Do not overwrite existing `research/positioning.md`** without asking the user first.
- **One positioning per product.** Don't try to position differently for different segments — pick the best-fit segment and position for them.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
