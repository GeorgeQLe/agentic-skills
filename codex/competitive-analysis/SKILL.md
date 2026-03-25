---
name: competitive-analysis
description: Research competitors via web search — map the landscape, GTM strategies, strengths, weaknesses, and market gaps
argument-hint: [optional: product category or specific competitors to investigate]
---

# Competitive Analysis — Market Landscape Research

Conduct deep web-based research to compile a comprehensive competitive landscape for the project. Uses web search to identify competitors, evaluate their maturity, analyse their go-to-market strategies, and surface market gaps. The output gives the founder a clear picture of who they're up against and where opportunities exist.

## Prerequisites

Read the codebase, README, CLAUDE.md, and existing specs (`specs/icp.md`, `specs/enterprise-icp.md`, `specs/mvp-gap.md`) to understand what the product does, who it's for, and what value it claims to provide. This context is essential for identifying the right competitors and evaluating positioning.

If no codebase or specs exist, ask the user to describe the product and target market before proceeding.

## Process

### 1. Establish Product Context

- Read CLAUDE.md, README, package config, and key source files to understand the product
- Read `specs/icp.md` if it exists — the customer profile, pain map, and value prop define the competitive frame
- Read `specs/enterprise-icp.md` and `specs/mvp-gap.md` if they exist for additional context
- If `$ARGUMENTS` names specific competitors, use those as a starting point but still search broadly

Summarise what the product does, who it's for, and what problem it solves. Confirm this understanding with the user before researching.

### 2. Identify Competitors

Use web search extensively to find competitors. Search across multiple angles:

- **Direct competitors**: Products solving the same problem for the same audience
- **Indirect competitors**: Products solving an adjacent problem that could expand into this space
- **Incumbents**: Established tools or platforms the target audience currently uses (even if not purpose-built for this problem)
- **Emerging players**: New startups or open-source projects in the space
- **DIY alternatives**: Internal tools, spreadsheets, manual processes, or "do nothing" approaches

Search strategies:
- `"[product category] software"`, `"[product category] tools"`, `"[product category] alternatives"`
- `"best [product category] for [target audience]"`, `"[product category] comparison"`
- `"[competitor name] alternatives"` for each known competitor to find more
- `"[competitor name] vs"` to discover comparison articles and adjacent players
- Check Product Hunt, G2, Capterra, and industry-specific directories
- Search for recent funding rounds in the space: `"[product category] startup funding"`
- Look for open-source alternatives on GitHub

### 3. Research Each Competitor

For each identified competitor, gather:

#### Company & Product
- What exactly they do — core product, features, positioning
- Founding year, team size, funding raised, revenue signals
- Technology stack and platform (web, mobile, desktop, API, CLI)
- Pricing model and tiers (free, freemium, paid-only, enterprise)

#### Maturity & Traction
- Current stage: pre-launch, early, growth, mature, declining
- User base size signals (published metrics, app store downloads, community size)
- Customer logos and case studies
- Recent product launches or major updates
- Integration ecosystem breadth

#### Go-to-Market Strategy
- Primary acquisition channel: PLG, sales-led, community-led, content-led, partnerships
- Pricing strategy: freemium, free trial, demo-required, open-core, usage-based
- Content marketing approach: blog, docs, educational content, SEO strategy
- Community presence: Discord, Slack, forums, open-source community
- Social proof strategy: case studies, testimonials, review sites, certifications
- Partnership and integration strategy
- Target market segment: SMB, mid-market, enterprise, developer, consumer

#### Strengths
- What do users praise? (Check review sites, social media, community forums)
- What features or capabilities set them apart?
- What's their moat? (Network effects, data, integrations, brand, switching costs)

#### Weaknesses
- What do users complain about? (Check negative reviews, support forums, social media)
- What's missing from their product?
- Where do they lose deals? (Check comparison articles, competitor marketing)
- What's their biggest vulnerability?

### 4. Identify Market Gaps

Synthesise the research to find:

- **Underserved segments**: Customer types or use cases that no competitor serves well
- **Feature gaps**: Capabilities that users want but no competitor provides
- **Pricing gaps**: Market segments priced out by existing solutions or overpaying for features they don't need
- **UX gaps**: Areas where all competitors have poor user experience
- **Integration gaps**: Missing connections to tools the target audience already uses
- **Geographic or vertical gaps**: Markets or industries that competitors haven't entered
- **Technology gaps**: Emerging tech (AI, automation, APIs) that competitors haven't leveraged

### 5. Analyse Positioning Opportunities

Based on all research:

- Where does our product fit in the competitive landscape?
- What positioning would differentiate us most effectively?
- What can we learn from competitors' successes and failures?
- What GTM strategy best fits our product and the market dynamics?
- What are the 2-3 most compelling angles we could own?

### 6. Validate with User

Present the draft findings and ask the user:
- Are there competitors we missed?
- Do the market gaps match their intuition?
- Which positioning angles resonate most?
- Any insider knowledge that changes the analysis?

Incorporate feedback and finalise.

## Output

### `specs/competitive-analysis.md`

```markdown
# Competitive Analysis

> Product: [product name and one-line description]
> Category: [market category]
> Date: [current date]
> Sources: [number of competitors analysed]

## Summary
[3-5 sentences: competitive landscape overview, our positioning, and the biggest opportunity]

## Competitive Landscape

### Direct Competitors
For each:
- **[Competitor Name]** — [one-line description]
  - Stage: [pre-launch / early / growth / mature / declining]
  - Founded: [year] | Funding: [amount or "bootstrapped"] | Team: [size estimate]
  - Pricing: [model and range]
  - GTM: [primary strategy]
  - Strengths: [2-3 bullets]
  - Weaknesses: [2-3 bullets]
  - Key takeaway: [what we can learn]

### Indirect Competitors
[Same format]

### Incumbents & DIY Alternatives
[Same format, briefer]

### Emerging Players
[Same format, briefer]

## Go-to-Market Strategy Analysis
- **What works in this market**: [patterns from successful competitors]
- **What doesn't work**: [patterns from struggling competitors]
- **Dominant acquisition model**: [PLG / sales-led / community-led / etc.]
- **Pricing expectations**: [what the market is used to paying]
- **Key channels**: [where competitors acquire users]

## Market Gaps
- **[Gap title]** — [Description of the unmet need, who it affects, and why it exists]
- ...

## Competitive Positioning

### Where We Fit
[Current positioning relative to competitors on key dimensions]

### Recommended Positioning
[Suggested positioning based on gaps and strengths, with reasoning]

### Lessons from Competitors
- **Do this** (learned from [competitor]): [what they did well that we should emulate]
- **Avoid this** (learned from [competitor]): [what they did poorly that we should avoid]
- ...

## Recommended Next Steps
- Prioritised list of actions based on the analysis
- Each with a _Start with:_ `/plan-interview [topic]` prompt where appropriate
```

### `specs/competitive-analysis-interview.md`
Raw log of the validation conversation with the user — initial context confirmation, draft findings review, user feedback, and final adjustments.

Create the `specs/` directory if it doesn't exist.

## Constraints

- **Use web search extensively.** This skill's value comes from real, current market data — not assumptions or hallucinated competitor names. Every competitor cited must come from a web search result.
- **Cite sources.** When stating facts about competitors (funding, features, pricing), note where the information came from.
- **Be honest about uncertainty.** If information couldn't be verified, say so. Don't fabricate metrics.
- **Stay in analysis mode.** Do not propose product changes, architecture, or features — that's for `/plan-interview` and `/mvp-gap`.
- **Focus on actionable insights.** Raw competitor lists are easy; the value is in the synthesis — gaps, patterns, positioning angles.
- **Do not overwrite existing `specs/competitive-analysis.md`** without asking the user first.
- **Keep research current.** Prefer recent sources (last 12 months). Flag any information that may be outdated.
- **Search breadth over depth initially.** Cast a wide net to find all competitors before going deep on each one. It's better to identify 15 competitors and research 8 deeply than to miss half the landscape.
