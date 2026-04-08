---
name: platform-strategy
description: Expand from a single product into a multi-product platform — map vertical and horizontal growth vectors, score candidates, design validation experiments, and sequence the portfolio
type: research
version: 1.0.0
argument-hint: "[optional: expansion direction e.g. \"vertical\", \"horizontal\", or specific adjacent market]"
---

# Platform Strategy — Multi-Product Expansion Planning

Takes a single-product company and maps the path to a multi-product platform. Identifies vertical (deeper into the same customer base) and horizontal (new related product for a new customer base) expansion vectors, scores them, designs cheap validation experiments for the top candidates, and produces a sequenced portfolio plan.

## Prerequisites

**Required (at least one):**
- `research/icp.md` (or `research/{app}/icp.md`) — who you serve today, their pain points, value props
- A working product/codebase to analyse for extensibility

If neither exists, tell the user: "Platform expansion requires a foundation. Run `/icp` first to define who you serve today, then come back."

**Strongly recommended** (read if they exist — they enrich the analysis):
- `research/competitive-analysis.md` — where competitors are/aren't, market gaps
- `research/journey-map.md` — current user flows, where users hit walls or leave
- `research/metrics.md` — retention, activation, engagement baselines for the core product

**Optional but enriching:**
- `research/monetization.md` — current revenue model, pricing leverage points
- `research/positioning.md` — current market category, unique attributes
- `research/customer-feedback.md` — what users are asking for that's adjacent
- `research/enterprise-icp.md` — if expanding upmarket is a vector
- `research/assumption-tracker.md` — unvalidated assumptions that affect expansion

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Assess Core Product Health

Before expanding, determine whether the foundation is solid enough. Read the codebase, existing research, and metrics to evaluate:

- **Product-market fit signals** — retention, activation, NPS/satisfaction signals from `research/metrics.md` or `research/customer-feedback.md`
- **Technical extensibility** — shared infrastructure (auth, billing, data models) that new products could build on vs. what's tightly coupled
- **Team/resource signals** — monorepo structure, package boundaries, deployment independence
- **Revenue stability** — from `research/monetization.md` if available

**Checkpoint 1 — Present core health assessment to the user.** Use the AskUserQuestion tool to show:
- A brief health summary: is the core product ready to support expansion, or are there risks?
- Key infrastructure that could be shared vs. what needs decoupling
- Any red flags (e.g., poor retention means the core product needs fixing first)

Ask:
- "Does this assessment match your sense of where the core product is?"
- "Are there resource constraints I should factor in? (team size, runway, technical debt)"

Incorporate feedback before proceeding.

### 2. Map Expansion Vectors

Use WebSearch with **8-12 diverse queries** to research expansion opportunities. Log every search query and key findings to the research log.

Query strategies (adapt to the specific domain):
1. **Adjacent market searches** — "[category] adjacent markets", "[category] expansion opportunities"
2. **Vertical depth searches** — "[category] enterprise features", "[category] advanced use cases", "[ICP role] additional tools needed"
3. **Horizontal breadth searches** — "[category] related categories", "tools used alongside [product category]"
4. **Platform precedent searches** — "[category] companies that became platforms", "[competitor] product line"
5. **User workflow searches** — "what do [ICP] use before/after [category]", "[ICP] tool stack"
6. **Ecosystem searches** — "[category] marketplace", "[category] integrations ecosystem"
7. **Acquisition pattern searches** — "[category] acquisitions", "[competitor] acquired companies"
8. **Market trend searches** — "[category] trends 2025 2026", "future of [domain]"
9. **Adjacent pain searches** — "[ICP] other frustrations", "[ICP] biggest challenges besides [core problem]"
10. **Bundling precedent searches** — "[category] suite vs point solution", "[category] all-in-one"

Also analyse the codebase and existing research for internal signals:
- Features users request that are adjacent to the core product (from `research/customer-feedback.md`)
- Competitor product lines (from `research/competitive-analysis.md`)
- Journey map drop-off points where a new product could re-engage users
- Data or infrastructure that could power additional products

### 3. Identify Expansion Candidates — Present & Validate

From the research, cluster findings into **4-8 expansion candidates** across two axes:

**Vertical (deeper into same customer base):**
- Advanced tiers, enterprise features, professional services
- Deeper workflow coverage (upstream/downstream of current product)
- Industry-specific variants of the core product
- Data products built on what the core product already collects

**Horizontal (adjacent products for new or overlapping customer bases):**
- Complementary tools the ICP uses alongside the core product
- Products for adjacent personas in the same organisation
- The same core technology applied to a different problem/audience
- Marketplace or platform plays that enable third-party value creation

For each candidate, note:
- Problem it solves and for whom
- Relationship to core product (shared data, shared users, shared infra, or independent)
- Initial market signal (from web research)
- Whether it's vertical or horizontal

**Checkpoint 2 — Present candidates to the user.** Use the AskUserQuestion tool to show all candidates grouped by vertical/horizontal, with a brief rationale and research evidence for each. Then ask:
- "Are there expansion directions I missed?"
- "Any of these clearly wrong for your situation or that you've already ruled out?"
- "Are there internal signals (user requests, sales conversations) that point toward any of these?"

Incorporate feedback before proceeding.

### 4. Score Expansion Candidates

For each validated candidate, score across five dimensions:

#### Synergy Score (how much the core product amplifies this)
- Shared users — do existing users want this?
- Shared data — does the core product generate data this product needs?
- Shared infrastructure — auth, billing, deployment, APIs reusable?
- Cross-sell potential — can you sell this through the same channel?

#### Market Opportunity (how big and accessible is this)
- Market size signals (from web research)
- Competitive density — is it crowded or open?
- Willingness to pay signals
- Growth trajectory of the adjacent market

#### Effort & Risk
- Build complexity — new app vs. feature vs. integration
- Time to first revenue signal
- Technical risk — new technology needed or existing stack sufficient?
- Cannibalization risk — could this undermine the core product?

#### Strategic Value
- Defensibility — does this create a moat (network effects, data, switching costs)?
- Brand coherence — does this make sense under the same brand?
- Sequencing value — does this unlock future expansion vectors?

#### Validation Cost
- How cheaply can we test demand before building?
- Existing channels to reach potential users
- Minimum viable experiment complexity

**Build a scoring matrix** with 1-5 ratings per dimension and a weighted total.

### 5. Design Validation Experiments for Top Candidates

For the **top 2-3 scored candidates**, design lightweight validation experiments:

- What's the cheapest way to test demand? (landing page, fake-door, survey, pre-sale, concierge)
- Who to test with? (existing users, adjacent audience, or both)
- What signal would confirm or kill this direction?
- How long would the experiment take?
- What's the decision rule? (proceed / pivot / kill thresholds)

Keep experiments to 1-4 weeks and minimal budget. Reference `/experiment` for full experiment design if the user wants to go deeper.

### 6. Sequence the Portfolio — Present & Validate

Based on scores, experiments, and strategic value, recommend a portfolio sequence:

- **Now** (next quarter): The highest-confidence, highest-synergy candidate — usually vertical
- **Next** (quarter after): The second candidate, ideally building on learnings from the first
- **Later** (6-12 months): Candidates that require more infrastructure or validation
- **Watch** (12+ months): Candidates that are interesting but premature

For each phase:
- What shared infrastructure needs to exist first
- Key dependency on the previous phase
- Revenue expectation (directional, not precise)
- Kill criteria — when to abandon this direction

**Checkpoint 3 — Present the full portfolio plan to the user.** Use the AskUserQuestion tool to show:
1. Scoring matrix with all candidates
2. Top 2-3 validation experiment designs
3. Recommended portfolio sequence with rationale
4. Shared platform considerations

Ask:
- "Does this sequencing match your priorities and constraints?"
- "Any experiments you'd want to run first that differ from what I suggested?"
- "Are there dependencies or constraints I'm not seeing?"

Continue the conversation until all non-trivial details are nailed down. If the user raises points that require additional research, go back and search before finalising.

### 7. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually. Include 3-5 applicable items with "Pick one:" framing:

- ALWAYS first: `/experiment [top candidate hypothesis]` — Validate the top expansion candidate
- IF no `research/assumption-tracker.md`: `/assumption-tracker` — Extract and rank assumptions behind the expansion plan
- IF `research/competitive-analysis.md` is stale or doesn't cover adjacent markets: `/competitive-analysis [adjacent category]` — Research competitors in the expansion space
- IF top candidate targets a new audience: `/icp [new audience]` — Define the ICP for the new product
- IF top candidate is vertical (enterprise): `/enterprise-icp` — Map enterprise stakeholders for the deeper play
- IF specs exist for core but not expansion: `/plan-interview [top candidate]` — Spec the expansion product
- ALWAYS: `/roadmap` — Integrate expansion phases into the project roadmap

**Impact-aware adjustments:**
- IF downstream impact is **Major**: prepend `/research-reconcile — [N] conflicts found in downstream docs` as the first item
- IF downstream impact is **Minor**: annotate relevant skill suggestions with "(stale — [brief description])"

### 8. Write Output

Only after the user has validated the findings, write the output files.

### 9. Downstream Impact Check

After writing, check for downstream research documents that may be affected by what was just decided. Only check documents that exist on disk.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/roadmap.md`
- `research/monetization.md`
- `research/gtm.md`
- `research/positioning.md`
- `research/metrics.md`

For each existing downstream document:
1. Read it — focus on `> Based on:` header, `## Summary`, and sections that reference concepts this skill just defined or changed
2. Identify **specific conflicts**: claims, assumptions, or references that contradict what was just decided. Examples:
   - Roadmap phases that don't account for expansion products
   - Monetization strategy built around a single product
   - GTM messaging that doesn't address multi-product positioning
   - Positioning anchored to a single-product category
   - Metrics frameworks that don't cover cross-product health
3. Note each conflict: downstream file, section, the stale claim (quote it), and what it should now say

**Classify the impact**:
- **None**: No downstream documents exist, or no conflicts found. Skip display entirely.
- **Minor** (1-2 small conflicts): Display conflicts to user inline.
- **Major** (3+ conflicts OR a foundational assumption changed — e.g., positioning shifted from point solution to platform, revenue model needs restructuring): Display conflicts and strongly recommend `/research-reconcile`.

Display to the user after showing the written file confirmation. This should be quick — one read per downstream doc, scan for conflicts against key decisions. Not a deep reconciliation.

## Output

### `research/platform-strategy.md` (or `research/{app}/platform-strategy.md`)

```markdown
# Platform Strategy

> Product: [product name and one-line description]
> Current ICP: [primary ICP from research/icp.md]
> Date: [current date]
> Candidates evaluated: [number]

## Summary
[3-5 sentences: core health assessment, top expansion direction, portfolio thesis, and the single most important next move]

## Core Product Health

### Product-Market Fit Signals
[Retention, activation, satisfaction — is the foundation solid?]

### Technical Extensibility
[What infrastructure is shareable vs. tightly coupled — auth, billing, data, APIs]

### Expansion Readiness
[Overall assessment: ready / ready with caveats / not yet — with reasoning]

## Expansion Vector Map

### Vertical Candidates (Deeper Into Same Customer Base)

For each:
- **[Candidate Name]** — [one-line description]
  - Problem: [what it solves]
  - Audience: [who benefits — same ICP or subset]
  - Synergy: [shared data, users, infra]
  - Market signal: [evidence from research]
  - Effort: [new app / feature / integration — rough complexity]

### Horizontal Candidates (Adjacent Products for New/Overlapping Audiences)

For each:
- **[Candidate Name]** — [one-line description]
  - Problem: [what it solves]
  - Audience: [who benefits — new or adjacent ICP]
  - Synergy: [shared data, users, infra]
  - Market signal: [evidence from research]
  - Effort: [new app / feature / integration — rough complexity]

## Scoring Matrix

| Candidate | Synergy | Market Opportunity | Effort & Risk | Strategic Value | Validation Cost | Weighted Total |
|-----------|---------|-------------------|---------------|-----------------|-----------------|----------------|
| ... | /5 | /5 | /5 | /5 | /5 | /25 |

### Scoring Rationale
[Brief justification for scores that aren't obvious — especially where candidates are close]

## Validation Experiments

### [Top Candidate 1]

**Hypothesis**: [structured hypothesis]
**Method**: [experiment type — landing page / fake-door / survey / pre-sale / concierge]
**Audience**: [who to test with and how to reach them]
**Timeline**: [duration]
**Success criteria**: [specific measurable threshold]
**Decision rule**: If validated → [action]. If invalidated → [pivot].

### [Top Candidate 2]
[Same structure]

### [Top Candidate 3]
[Same structure]

## Portfolio Sequence

### Now (Next Quarter)
- **[Candidate]**: [what to do and why this is first]
- Shared infra needed: [what to build/decouple]
- Validation: [experiment to run]
- Kill criteria: [when to abandon]

### Next (Quarter +1)
- **[Candidate]**: [what to do and why this follows]
- Depends on: [what must be true from previous phase]
- Kill criteria: [when to abandon]

### Later (6-12 Months)
- **[Candidate]**: [why it's deferred — what needs to change for it to move up]

### Watch (12+ Months)
- **[Candidate]**: [why it's interesting but premature]

## Shared Platform Considerations

### Infrastructure to Share
[Auth, billing, data layer, deployment, APIs — what should be centralised]

### What to Keep Independent
[Where new products should have their own stack to avoid coupling]

### Brand Architecture
[Single brand with sub-products, separate brands, or brand + "for [segment]" variants]

### Cross-Product Metrics
[Portfolio-level health metrics: cross-sell rate, multi-product retention, platform LTV vs. single-product LTV]

### Cannibalization Risks
[Where new products might undermine the core — and how to mitigate]

<!-- Include this section only when downstream impact is Minor or Major. Omit entirely for None. -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote from downstream doc]"
   - **Now**: [what this skill's output says instead]

[For Major only:]
> **Recommended action**: Run `/research-reconcile` to audit and fix all affected downstream documents.

## Next Steps

Pick one:
- [conditional items from step 7 — only include items whose conditions are met]
```

### `research/platform-strategy-search-log.md` (or `research/{app}/platform-strategy-search-log.md`)

Raw research log containing:
- Every WebSearch query executed and why
- Key findings from each search (with source attribution)
- Evidence for and against each expansion candidate
- Competitor product-line analysis
- Market size signals for adjacent markets
- Any data gaps or areas where research was inconclusive

Create the `research/` (or `research/{app}/`) directory if it doesn't exist.

## Constraints

- **Use web search extensively.** This skill's value comes from real market data about adjacent opportunities — not assumptions. Every market signal must trace to research evidence.
- **Cite sources.** When stating market signals, competitor product lines, or trend data, note where the information came from.
- **Be honest about uncertainty.** If market size or demand can't be verified, say so. Don't fabricate metrics.
- **Stay in strategy mode.** Do not propose architecture, features, or technical solutions — that's for `/plan-interview`. Do not design full experiments — that's for `/experiment`. Provide enough to decide direction, not enough to build.
- **Core health is gating.** If the core product shows clear PMF problems (poor retention, no activation), say so directly. Expanding from a weak foundation is a common startup mistake — flag it.
- **Score honestly.** Low-synergy, high-effort candidates should score low even if the market is exciting. The whole point is to find expansion that leverages the existing product.
- **Present before writing.** Never write output files until findings have been presented to the user and validated through the checkpoint questions. The user must see and approve the analysis before anything is written to disk.
- **Do not overwrite existing `research/platform-strategy.md`** (or `research/{app}/platform-strategy.md`) without asking the user first.
- **Keep validation experiments lightweight.** Full experiment design belongs in `/experiment`. Here, provide just enough to estimate validation cost and timeline.
