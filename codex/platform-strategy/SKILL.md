---
name: platform-strategy
description: Expand from a single product into a multi-product platform — map vertical and horizontal growth vectors, score candidates, design validation experiments, and sequence the portfolio
version: 1.0.0
argument-hint: [optional: expansion direction e.g. "vertical", "horizontal", or specific adjacent market]
---

# Platform Strategy — Multi-Product Expansion Planning

Takes a single-product company and maps the path to a multi-product platform. Identifies vertical (deeper into same customer base) and horizontal (new related product for new customer base) expansion vectors, scores them, designs cheap validation experiments, and produces a sequenced portfolio plan.

## Prerequisites

**Required (at least one):**
- `research/icp.md` (or `research/{app}/icp.md`) — who you serve today
- A working product/codebase to analyse for extensibility

If neither exists, tell the user: "Platform expansion requires a foundation. Run `$icp` first to define who you serve today, then come back."

**Strongly recommended** (read if they exist):
- `research/competitive-analysis.md` — market gaps
- `research/journey-map.md` — user flows, drop-off points
- `research/metrics.md` — retention, activation baselines

**Optional:** `research/monetization.md`, `research/positioning.md`, `research/customer-feedback.md`, `research/enterprise-icp.md`, `research/assumption-tracker.md`

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Assess Core Product Health

Read the codebase, existing research, and metrics to evaluate: PMF signals (retention, activation, satisfaction), technical extensibility (shared infra — auth, billing, data — vs. tightly coupled), team/resource signals, revenue stability.

**Checkpoint 1 — Present core health assessment.** Show health summary, shareable infrastructure, red flags. Ask: "Does this match your sense of where the core product is? Resource constraints to factor in?"

### 2. Map Expansion Vectors

Use web search with **8-12 diverse queries**: adjacent markets, vertical depth (enterprise features, advanced use cases), horizontal breadth (related categories, tools used alongside), platform precedents, user workflow gaps, ecosystem opportunities, acquisition patterns, market trends, adjacent pain points, bundling precedents.

Also analyse codebase and existing research for internal signals: adjacent feature requests from customer feedback, competitor product lines, journey map drop-offs, data/infra that could power new products.

### 3. Identify Expansion Candidates — Present & Validate

Cluster findings into **4-8 candidates** across two axes:

**Vertical:** advanced tiers, deeper workflow coverage, industry-specific variants, data products from existing data.

**Horizontal:** complementary tools, adjacent persona products, same tech applied to different problem, marketplace/platform plays.

For each: problem, audience, relationship to core, market signal, vertical vs. horizontal.

**Checkpoint 2 — Present candidates.** Group by vertical/horizontal with rationale and evidence. Ask: "Expansion directions I missed? Any clearly wrong? Internal signals pointing toward any of these?"

### 4. Score Expansion Candidates

Score each across five dimensions (1-5 each):

- **Synergy** — shared users, data, infra, cross-sell potential
- **Market Opportunity** — size, competitive density, willingness to pay, growth
- **Effort & Risk** — build complexity, time to revenue, tech risk, cannibalization
- **Strategic Value** — defensibility, brand coherence, sequencing value
- **Validation Cost** — how cheaply can we test demand

Build a scoring matrix with weighted totals.

### 5. Design Validation Experiments for Top Candidates

For **top 2-3 candidates**: cheapest test method (landing page, fake-door, survey, pre-sale, concierge), audience, success criteria, timeline (1-4 weeks), decision rules (proceed/pivot/kill). Reference `$experiment` for full experiment design.

### 6. Sequence the Portfolio — Present & Validate

Recommend a portfolio sequence: **Now** (next quarter), **Next** (quarter +1), **Later** (6-12 months), **Watch** (12+ months). For each: shared infra needed, dependencies, revenue expectation, kill criteria.

**Checkpoint 3 — Present full portfolio plan.** Show scoring matrix, validation experiments, portfolio sequence, shared platform considerations. Ask: "Sequencing match your priorities? Different experiments to run first? Dependencies I'm missing?"

### 7. Write Output

Only after user validates, write the output files.

## Deliverables

- `research/platform-strategy.md` (or `research/{app}/platform-strategy.md`) — Full platform strategy: summary, core health, expansion vector map, scoring matrix, validation experiments, portfolio sequence, shared platform considerations, next steps.
- `research/platform-strategy-search-log.md` (or `research/{app}/platform-strategy-search-log.md`) — Raw research log: every query, findings, source attribution, scoring rationale.

`## Next Steps` section (3-5 contextual items, "Pick one:" framing): always suggest `$experiment [top candidate]`; conditionally suggest `$assumption-tracker`, `$competitive-analysis [adjacent category]`, `$icp [new audience]`, `$enterprise-icp`, `$plan-interview [top candidate]`, `$roadmap`.

## Constraints

- Use web search extensively — every market signal must trace to research evidence.
- Cite sources for market signals, competitor product lines, trend data.
- Be honest about uncertainty.
- Stay in strategy mode — no architecture, features, or technical solutions.
- Core health is gating — flag PMF problems directly.
- Score honestly — low-synergy, high-effort candidates should score low.
- Present before writing — never write until findings are validated.
- Do not overwrite existing `research/platform-strategy.md` (or `research/{app}/platform-strategy.md`) without asking.
- Keep validation experiments lightweight — full design belongs in `$experiment`.
- `## Next Steps` must be the final section in the output file.
