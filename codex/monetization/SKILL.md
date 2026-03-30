---
name: monetization
description: Research-driven monetization strategy — revenue models, pricing architecture, unit economics, and packaging grounded in ICP and competitive data
version: 1.1.0
argument-hint: [optional: focus area e.g. "pricing tiers", "usage-based", "freemium"]
---

# Monetization — Revenue & Pricing Strategy

Deep-research skill that analyzes how to monetize the product. Combines web research on revenue models in the category with codebase analysis, ICP data, and competitive pricing to produce a monetization strategy validated through user interview checkpoints.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{app}/icp.md`) must exist. If not, tell the user to run `/icp` first and stop.
- **Soft**: Read these if they exist — each adds specificity:
  - `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) — competitor pricing, tiers, freemium models
  - `research/journey-map.md` (or `research/{app}/journey-map.md`) — where value is delivered, conversion triggers
  - `research/metrics.md` (or `research/{app}/metrics.md`) — activation, engagement, retention signals
  - `research/gtm.md` (or `research/{app}/gtm.md`) — existing pricing strategy and channel economics
  - `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`) — willingness-to-pay signals, pricing complaints
  - `specs/*.md` (or `specs/{app}/*.md`) — what's being built, feature scope

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

### 1. Load Context

Read all prerequisite files. Extract monetization-relevant signals: buyer budget, purchasing process, current spend on alternatives, competitor pricing models, journey conversion triggers, activation/retention metrics, willingness-to-pay signals.

### 2. Market Research — Revenue Models in Category

Use WebSearch with 6–10 targeted queries: category pricing models, competitor pricing pages, revenue model analysis, pricing benchmarks, freemium analysis, usage-based research, pricing psychology, unit economics, expansion revenue patterns, pricing failures. Log every query and finding to the research log.

### 3. Identify Revenue Model Options — Present & Validate

Identify 2–4 viable revenue model options from research. For each: model type, evidence, ICP fit, product fit, risks. **Recommend one model** with reasoning grounded in evidence. Present all options plus recommendation to user — ask them to approve, adjust, or override before proceeding.

### 4. Deep-Dive: Pricing Architecture

For the selected model, design: value metric (what unit the customer pays for), tier design (free/trial structure, feature gates, good-better-best), price points (anchored against competitors and ICP budget), packaging (bundled vs add-on, usage limits, enterprise justification). Present and validate.

### 5. Unit Economics & Viability

Estimate with stated assumptions: CAC, LTV, LTV:CAC ratio, payback period, expansion revenue potential, gross margin. State confidence levels and data gaps. Present and validate.

### 6. Monetization Timing & Sequencing

Determine when to introduce paid, what stays free permanently, pricing evolution roadmap, revenue diversification opportunities.

### 7. Populate Next Steps

Contextual next steps based on which files exist (gtm, metrics, journey-map, roadmap, mvp-gap).

### 8. Final Review & Write

Present complete strategy, get user confirmation, write output files.

## Deliverables

- `research/monetization.md` (or `research/{app}/monetization.md`) — Complete monetization strategy: revenue model, pricing tiers, unit economics, timing, open questions, next steps
- `research/monetization-interview.md` (or `research/{app}/monetization-interview.md`) — Raw interview log with checkpoint validations

## Constraints

- Requires ICP — cannot build monetization strategy without knowing who pays
- Evidence-based — every pricing decision traces to research evidence
- Present before writing — validate through all three checkpoints before writing files
- Don't duplicate GTM — deepen existing pricing section rather than contradict
- Don't prescribe product changes — note gaps for `/mvp-gap`
- State assumptions — every unit economics estimate includes assumption and confidence level
- Minimum 6 WebSearch queries before presenting revenue model options
