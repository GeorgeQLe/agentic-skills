---
name: competitive-analysis
description: Research competitors via web search — map the landscape, GTM strategies, strengths, weaknesses, and market gaps
type: research
version: 2.3.0
argument-hint: "[concept | optional: product category or specific competitors to investigate]"
---

# Competitive Analysis — Market Landscape Research

Conduct deep web-based research to compile a comprehensive competitive landscape for the project. Uses web search to identify competitors, evaluate their maturity, analyse their go-to-market strategies, and surface market gaps. The output gives the founder a clear picture of who they're up against and where opportunities exist.

## Prerequisites

**Detect mode before proceeding:**

- **Concept-validation mode** activates when: no `research/icp.md` exists AND (no meaningful codebase — i.e. no README, no source files, no package config — OR `$ARGUMENTS` contains "concept" or "validate"). In this mode, announce to the user: "Running in concept-validation mode — no ICP or product detected. I'll evaluate the market gap for your concept." Then ask the user to describe the concept, the problem it addresses, and the intended audience.
- **Standard mode** (default): Read the codebase, README, CLAUDE.md, and existing research/specs (`research/icp.md` or `research/{app}/icp.md`, `research/enterprise-icp.md` or `research/{app}/enterprise-icp.md`, `research/mvp-gap.md` or `research/{app}/mvp-gap.md`) to understand what the product does, who it's for, and what value it claims to provide. This context is essential for identifying the right competitors and evaluating positioning. If no codebase or specs exist but `research/icp.md` is present, proceed in standard mode using the ICP as context.

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

### 1. Establish Product Context

**Standard mode:**
- Read CLAUDE.md, README, package config, and key source files to understand the product
- Read `research/icp.md` (or `research/{app}/icp.md`) if it exists — the customer profile, pain map, and value prop define the competitive frame
- Read `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`) and `research/mvp-gap.md` (or `research/{app}/mvp-gap.md`) if they exist for additional context
- If `$ARGUMENTS` names specific competitors, use those as a starting point but still search broadly
- Summarise what the product does, who it's for, and what problem it solves. Confirm this understanding with the user before researching.

**Concept-validation mode:**
- Use the concept description from Prerequisites to establish the problem space
- Summarise what the concept proposes (problem it addresses, intended audience, hypothesised approach)
- Confirm this understanding with the user before researching

### 2. Identify Competitors

Use the WebSearch tool extensively to find competitors. Search across multiple angles:

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

**Checkpoint 1 — Present the competitor list to the user.** Use the AskUserQuestion tool to show all identified competitors grouped by category (direct, indirect, incumbent, emerging, DIY). For each competitor, include a one-line description of what they do and why they belong in that category, citing the search source. Then ask:
- "Are there competitors I missed?"
- "Any of these incorrectly categorised or not actually relevant?"

Incorporate feedback before proceeding to deep research.

### 3. Research Each Competitor

For each identified competitor, use WebSearch and WebFetch to gather:

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

### 4a. Gap Assessment (concept-validation mode only)

If running in concept-validation mode, synthesise the market gaps into a structured gap assessment:

- **Market State**: Virgin (no one does this) / Sparse (few players, early) / Crowded (many established players)
- **Incumbent Quality**: Dominant-and-loved / Dominant-but-resented (the Jira pattern — widely used, widely disliked) / Fragmented-and-mediocre / Emerging-and-unproven
- **Gap Quality**: Clear unmet need / Underserved segment / UX/approach gap / Minor improvement / No meaningful gap
- **Verdict**: Proceed to ICP (gap validated) / Pivot concept (gap exists but concept doesn't address it well) / Abandon (no meaningful gap)

**Checkpoint — Present gap assessment to user.** Use the AskUserQuestion tool to present the Market State, Incumbent Quality, Gap Quality, and Verdict with supporting evidence from the research. Ask: "Does this assessment match your read of the market? Should we adjust the verdict?" Incorporate feedback before continuing.

### 5. Analyse Positioning Opportunities

Based on all research:

**Standard mode:**
- Where does our product fit in the competitive landscape?
- What positioning would differentiate us most effectively?
- What can we learn from competitors' successes and failures?
- What GTM strategy best fits our product and the market dynamics?
- What are the 2-3 most compelling angles we could own?

**Concept-validation mode:**
- If you built this, where would it fit in the competitive landscape?
- What positioning would differentiate the concept most effectively?
- What can you learn from competitors' successes and failures?
- What GTM strategy would best fit the concept and the market dynamics?
- What are the 2-3 most compelling angles you could own?

### 6. Present Findings & Validate

**Checkpoint 2 — Present the full analysis to the user before writing.** Use the AskUserQuestion tool to present:

1. **Landscape summary** — the competitive picture in 3-5 sentences
2. **Key competitors** — top 3-5 with their strengths, weaknesses, and key takeaway
3. **Market gaps** — the most significant unmet needs
4. **Recommended positioning** — where we should play and why
5. **GTM insights** — what works in this market

Then ask:
- "Do the market gaps match your intuition?"
- "Which positioning angles resonate most?"
- "Any insider knowledge that changes the analysis?"

Continue the conversation until all non-trivial details are nailed down. If the user raises points that require additional research, go back and search before finalising.

### 7. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually. Include 3–5 applicable items with "Pick one:" framing:

**Concept-validation mode:**
- IF verdict is **Proceed to ICP**: recommend `/icp` — Define your ideal customer profile now that the market gap is validated
- IF verdict is **Pivot concept**: recommend `/brainstorm` — Generate alternative concepts that better address the gap before ICP work
- IF verdict is **Abandon**: recommend `No follow-up skill recommended` — Stop this concept because the analysis did not find a meaningful gap worth pursuing; include `/brainstorm` only if the user wants to explore a new concept
- IF verdict is **Proceed to ICP** and `/icp` creates `research/icp.md`: include `/competitive-analysis` as a later option to re-run in standard mode for full competitive positioning

**Impact-aware adjustments:**
- IF downstream impact is **Major**: prepend `/reconcile-research — [N] conflicts found in downstream docs` as the first item
- IF downstream impact is **Minor**: annotate relevant skill suggestions with "(stale — [brief description])"
- If downstream impact has not been classified yet, run the downstream impact check against the proposed output before selecting the final recommendation. Do not emit a Minor/Major impact recommendation speculatively.

**Standard mode:**
- RECOMMEND the first matching item:
  1. IF no `specs/` directory or it's empty: `/spec-interview [top market gap or positioning opportunity]` — Spec features that exploit the most important market gap above
  2. IF `specs/` exist but no `research/journey-map.md`: `/journey-map` — Map how the ICP experiences the product vs. competitors
  3. IF no `research/gtm.md`: `/gtm` — Build a GTM plan using the channel and positioning insights
  4. IF codebase exists and no `research/mvp-gap.md`: `/mvp-gap` — Evaluate codebase against ICP and competitive landscape
- Include `/brainstorm` only as an "Other option" when the analysis found multiple plausible market gaps and the product direction is still unclear. Do not recommend brainstorm just because competitive whitespace exists.

Any `/spec-interview` recommendation must include a concrete target from the analysis, not a bare command. Use the top market gap, riskiest competitive assumption, or strongest positioning opportunity as the bracketed topic.

**Impact-aware adjustments:**
- IF downstream impact is **Major**: prepend `/reconcile-research — [N] conflicts found in downstream docs` as the first item
- IF downstream impact is **Minor**: annotate relevant skill suggestions with "(stale — [brief description])"
- If downstream impact has not been classified yet, run the downstream impact check against the proposed output before selecting the final recommendation. Do not emit a Minor/Major impact recommendation speculatively.

### 8. Write Output

Only after the user has validated the findings, write the output files.

### 9. Downstream Impact Check

After writing, check for downstream research documents that may be affected by what was just decided. Only check documents that exist on disk.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/gtm.md`
- `research/monetization.md`

For each existing downstream document:
1. Read it — focus on `> Based on:` header, `## Summary`, and sections that reference concepts this skill just defined or changed
2. Identify **specific conflicts**: claims, assumptions, or references that contradict what was just decided. Examples:
   - Competitor positioning or market gaps that GTM strategy was built on that have changed
   - Pricing benchmarks referenced in monetization that no longer match the competitive landscape
   - Channel strategy assumptions based on competitor behavior that has shifted
3. Note each conflict: downstream file, section, the stale claim (quote it), and what it should now say

**Classify the impact**:
- **None**: No downstream documents exist, or no conflicts found. Skip display entirely.
- **Minor** (1–2 small conflicts): Display conflicts to user inline.
- **Major** (3+ conflicts OR a foundational assumption changed — e.g., market positioning shifted, new dominant competitor identified, pricing landscape changed significantly): Display conflicts and strongly recommend `/reconcile-research`.

Display to the user after showing the written file confirmation. This should be quick — one read per downstream doc, scan for conflicts against key decisions. Not a deep reconciliation.

## Output

### `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`)

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

## Gap Assessment (concept-validation mode only)

### Market State
[Virgin / Sparse / Crowded — with evidence]

### Incumbent Quality
[Dominant-and-loved / Dominant-but-resented / Fragmented-and-mediocre / Emerging-and-unproven — with evidence]

### Gap Quality
[Clear unmet need / Underserved segment / UX/approach gap / Minor improvement / No meaningful gap — with evidence]

### Verdict
[Proceed to ICP / Pivot concept / Abandon — with reasoning]

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

<!-- Include this section only when downstream impact is Minor or Major. Omit entirely for None. -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote from downstream doc]"
   - **Now**: [what this skill's output says instead]

[For Major only:]
> **Recommended action**: Run `/reconcile-research` to audit and fix all affected downstream documents.

## Next Steps

Pick one:
- [conditional items from step 7 — only include items whose conditions are met]
```

### `research/competitive-analysis-search-log.md` (or `research/{app}/competitive-analysis-search-log.md`)
Raw research log — every search query, key findings with source attribution, and the reasoning behind categorisation and positioning recommendations.

Create the `research/` (or `research/{app}/`) directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Use web search extensively.** This skill's value comes from real, current market data — not assumptions or hallucinated competitor names. Every competitor cited must come from a web search result.
- **Cite sources.** When stating facts about competitors (funding, features, pricing), note where the information came from.
- **Be honest about uncertainty.** If information couldn't be verified, say so. Don't fabricate metrics.
- **Stay in analysis mode.** Do not propose product changes, architecture, or features — that's for `/spec-interview` and `/mvp-gap`.
- **Focus on actionable insights.** Raw competitor lists are easy; the value is in the synthesis — gaps, patterns, positioning angles.
- **Do not overwrite existing `research/competitive-analysis.md`** (or `research/{app}/competitive-analysis.md`) without asking the user first.
- **Keep research current.** Prefer recent sources (last 12 months). Flag any information that may be outdated.
- **Search breadth over depth initially.** Cast a wide net to find all competitors before going deep on each one. It's better to identify 15 competitors and research 8 deeply than to miss half the landscape.
- **Present before writing.** Never write output files until findings have been presented to the user and validated through the checkpoint questions. The user must see and approve the analysis before anything is written to disk.

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
