---
name: competitive-analysis
description: Research competitors via web search — map the landscape, GTM strategies, strengths, weaknesses, and market gaps
version: 2.2.0
argument-hint: "[concept | optional: product category or specific competitors to investigate]"
---

# Competitive Analysis — Market Landscape Research

Conduct deep web-based research to compile a comprehensive competitive landscape for the project. Uses web search to identify competitors, evaluate their maturity, analyse their go-to-market strategies, and surface market gaps.

## Prerequisites

**Detect mode before proceeding:**

- **Concept-validation mode** activates when: no `research/icp.md` AND (no meaningful codebase OR `$ARGUMENTS` contains "concept"/"validate"). Announce mode to user, then ask for concept description (problem, audience, approach).
- **Standard mode** (default): Read the codebase, README, CLAUDE.md, and existing research/specs (`research/icp.md` or `research/{app}/icp.md`, `research/enterprise-icp.md` or `research/{app}/enterprise-icp.md`, `specs/mvp-gap.md` or `specs/{app}/mvp-gap.md`) to understand the product.

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

### 1. Establish Product Context

**Standard mode:** Read CLAUDE.md, README, package config, key source files. Read `research/icp.md` (or `research/{app}/icp.md`) if it exists — the ICP defines the competitive frame. Read `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`) and `specs/mvp-gap.md` (or `specs/{app}/mvp-gap.md`) if they exist. Summarise what the product does, who it's for, and what problem it solves.

**Concept-validation mode:** Use the concept description from Prerequisites. Summarise what the concept proposes (problem, audience, approach). Confirm with the user before researching.

### 2. Identify Competitors

Use web search extensively across: direct competitors, indirect competitors, incumbents, emerging players, DIY alternatives.

**Checkpoint 1 — Present competitor list to user.** Show all identified competitors grouped by category. For each competitor, include a one-line description and why it's in that category, citing the search source. Ask: "Are there competitors I missed? Any incorrectly categorised?" Incorporate feedback.

### 3. Research Each Competitor

For each: Company & Product (features, funding, pricing), Maturity & Traction (stage, user signals, integrations), GTM Strategy (acquisition, pricing, content, community), Strengths (user praise, moat), Weaknesses (complaints, gaps, vulnerabilities).

### 4. Identify Market Gaps

Synthesise: underserved segments, feature gaps, pricing gaps, UX gaps, integration gaps, geographic/vertical gaps, technology gaps.

### 4a. Gap Assessment (concept-validation mode only)

Synthesise market gaps into: **Market State** (Virgin/Sparse/Crowded), **Incumbent Quality** (Dominant-and-loved / Dominant-but-resented / Fragmented-and-mediocre / Emerging-and-unproven), **Gap Quality** (Clear unmet need / Underserved segment / UX/approach gap / Minor improvement / No meaningful gap), **Verdict** (Proceed to ICP / Pivot concept / Abandon). If the session is already in Plan mode, prefer `request_user_input`; otherwise ask in plain text before continuing.

### 5. Analyse Positioning Opportunities

**Standard mode:** Where we fit, differentiation angles, competitor lessons, GTM strategy fit, 2-3 angles we could own.

**Concept-validation mode:** Frame as hypothetical — "if you built this": where it would fit, differentiation angles, competitor lessons, GTM fit.

### 6. Present Findings & Validate

**Checkpoint 2 — Present full analysis before writing.** Show: landscape summary, key competitors, market gaps, recommended positioning, GTM insights. Ask: "Do gaps match your intuition? Which positioning resonates? Any insider knowledge?" Continue until all details are nailed down.

### 7. Write Output

Only after user validates, write the output files.

## Deliverables

- `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) — Full competitive landscape: summary, competitor profiles, GTM analysis, market gaps, positioning recommendations, next steps. In concept-validation mode, includes `## Gap Assessment` section (Market State, Incumbent Quality, Gap Quality, Verdict).
- `research/competitive-analysis-search-log.md` (or `research/{app}/competitive-analysis-search-log.md`) — Raw research log: every query, findings, source attribution, reasoning

**Standard mode next steps:** `## Next Steps` section (3–5 contextual items, "Pick one:" framing) based on which files exist: always suggest `$brainstorm`; conditionally suggest `$plan-interview`, `$journey-map`, `$gtm`, `$mvp-gap`.

**Concept-validation mode next steps:** `$icp` is always the first next step (gap validated). Also suggest `$brainstorm` if pivot verdict, and `$competitive-analysis` to re-run in standard mode after ICP.

## Constraints

- Use web search extensively — every competitor must come from a search result.
- Cite sources for competitor facts.
- Be honest about uncertainty.
- Stay in analysis mode — no product changes or architecture.
- Focus on actionable insights over raw lists.
- Do not overwrite existing `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) without asking.
- Prefer recent sources (last 12 months).
- Search breadth over depth initially.
- Present before writing — never write until findings are validated.
- `## Next Steps` must be the final section in the output file, with 3–5 contextual items and "Pick one:" framing.
