---
name: competitive-analysis
description: Research competitors via web search — map the landscape, GTM strategies, strengths, weaknesses, and market gaps
version: 2.0.0
argument-hint: [optional: product category or specific competitors to investigate]
---

# Competitive Analysis — Market Landscape Research

Conduct deep web-based research to compile a comprehensive competitive landscape for the project. Uses web search to identify competitors, evaluate their maturity, analyse their go-to-market strategies, and surface market gaps.

## Prerequisites

Read the codebase, README, CLAUDE.md, and existing research/specs (`research/icp.md`, `research/enterprise-icp.md`, `specs/mvp-gap.md`) to understand the product. If nothing exists, ask the user to describe the product and target market.

## Process

### 1. Establish Product Context

- Read CLAUDE.md, README, package config, key source files
- Read `research/icp.md` if it exists — the ICP defines the competitive frame
- Read `research/enterprise-icp.md` and `specs/mvp-gap.md` if they exist
- If `$ARGUMENTS` names specific competitors, use as starting point but still search broadly

Summarise what the product does, who it's for, and what problem it solves. Confirm with the user before researching.

### 2. Identify Competitors

Use web search extensively across: direct competitors, indirect competitors, incumbents, emerging players, DIY alternatives.

**Checkpoint 1 — Present competitor list to user.** Show all identified competitors grouped by category. Ask: "Are there competitors I missed? Any incorrectly categorised?" Incorporate feedback.

### 3. Research Each Competitor

For each: Company & Product (features, funding, pricing), Maturity & Traction (stage, user signals, integrations), GTM Strategy (acquisition, pricing, content, community), Strengths (user praise, moat), Weaknesses (complaints, gaps, vulnerabilities).

### 4. Identify Market Gaps

Synthesise: underserved segments, feature gaps, pricing gaps, UX gaps, integration gaps, geographic/vertical gaps, technology gaps.

### 5. Analyse Positioning Opportunities

Where we fit, differentiation angles, competitor lessons, GTM strategy fit, 2-3 angles we could own.

### 6. Present Findings & Validate

**Checkpoint 2 — Present full analysis before writing.** Show: landscape summary, key competitors, market gaps, recommended positioning, GTM insights. Ask: "Do gaps match your intuition? Which positioning resonates? Any insider knowledge?" Continue until all details are nailed down.

### 7. Write Output

Only after user validates, write the output files.

## Deliverables

- `research/competitive-analysis.md` — Full competitive landscape: summary, competitor profiles, GTM analysis, market gaps, positioning recommendations, next steps
- `research/competitive-analysis-search-log.md` — Raw research log: every query, findings, source attribution, reasoning

## Constraints

- Use web search extensively — every competitor must come from a search result.
- Cite sources for competitor facts.
- Be honest about uncertainty.
- Stay in analysis mode — no product changes or architecture.
- Focus on actionable insights over raw lists.
- Do not overwrite existing `research/competitive-analysis.md` without asking.
- Prefer recent sources (last 12 months).
- Search breadth over depth initially.
- Present before writing — never write until findings are validated.
