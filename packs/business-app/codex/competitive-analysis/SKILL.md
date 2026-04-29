---
name: competitive-analysis
description: Research competitors via web search — map the landscape, GTM strategies, strengths, weaknesses, and market gaps
type: research
version: 2.3.0
argument-hint: "[concept | optional: product category or specific competitors to investigate]"
---

# Competitive Analysis — Market Landscape Research

Conduct deep web-based research to compile a comprehensive competitive landscape for the project. Uses web search to identify competitors, evaluate their maturity, analyse their go-to-market strategies, and surface market gaps.

Default stance: assume the user has no insider knowledge of the market. Present the landscape, category terms, and recommendations from first principles so the analysis stands on its own. Ask for corrections, hard constraints, or proprietary facts, not intuition.

## Prerequisites

**Detect mode before proceeding:**

- **Concept-validation mode** activates when: no `research/icp.md` AND (no meaningful codebase OR `$ARGUMENTS` contains "concept"/"validate"). Use this mode to validate market gaps after a concept has been shaped by `$concept-exploration` or an equivalent brief; if no concept is clear, recommend `$concept-exploration` first. Announce mode to user, then ask for concept description (problem, audience, approach).
- **Standard mode** (default): Read the codebase, README, CLAUDE.md, and existing research/specs (`research/icp.md` or `research/{app}/icp.md`, `research/enterprise-icp.md` or `research/{app}/enterprise-icp.md`, `research/mvp-gap.md` or `research/{app}/mvp-gap.md`) to understand the product.

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

**Standard mode:** Read CLAUDE.md, README, package config, key source files. Read `research/icp.md` (or `research/{app}/icp.md`) if it exists — the ICP defines the competitive frame. Read `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`) and `research/mvp-gap.md` (or `research/{app}/mvp-gap.md`) if they exist. Summarise what the product does, who it's for, and what problem it solves.

**Concept-validation mode:** Use `research/concept-brief.md` when present, otherwise use the concept description from Prerequisites. Summarise what the concept proposes (problem, audience, approach). Confirm with the user before researching.

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

**Checkpoint 2 — Present full analysis before writing.** Show: landscape summary, key competitors, market gaps, recommended positioning, GTM insights. Ask: "Which gaps, positioning claims, or assumptions need stronger evidence? Any product-specific constraints or facts I should factor in?" Continue until all details are nailed down.

### 7. Write Output

Only after user validates, write the output files.

## Deliverables

- `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) — Full competitive landscape: summary, competitor profiles, GTM analysis, market gaps, positioning recommendations, next steps. In concept-validation mode, includes `## Gap Assessment` section (Market State, Incumbent Quality, Gap Quality, Verdict).
- `research/competitive-analysis-search-log.md` (or `research/{app}/competitive-analysis-search-log.md`) — Raw research log: every query, findings, source attribution, reasoning

**Standard mode next steps:** `## Next Steps` section with a **Recommended** item and **Other options** (2–4 alternatives). Choose the recommended item by the first matching condition:

1. IF no `research/journey-map.md`: `$journey-map` — map the customer and user journey before spec decisions, using competitive gaps as inspiration
2. IF no `specs/` directory or it's empty: `$spec-interview [top journey-backed market gap or positioning opportunity]` — spec the strongest opportunity after journey context exists
3. IF no `research/gtm.md`: `$gtm` — build go-to-market plan leveraging competitive gaps
4. IF codebase exists and no `research/mvp-gap.md`: `$mvp-gap` — check if the codebase exploits the gaps found

Use this format in the output:

## Next Steps

**Recommended:** `[first matching command above]` — [reason grounded in this analysis]

Other options:
- `$journey-map` — map the customer journey to find where competitors fall short (if no `research/journey-map.md` and not recommended)
- `$spec-interview [riskiest competitive assumption or top journey-backed market gap]` — validate the most important unresolved competitive assumption with a targeted interview (if not recommended and journey context exists)
- `$gtm` — build go-to-market plan leveraging competitive gaps (if no `research/gtm.md` and not recommended)
- `$mvp-gap` — check if the codebase exploits the gaps found (if codebase exists, no `research/mvp-gap.md` exists, and not recommended)
- `$brainstorm` — generate alternative solution ideas (only if the analysis found multiple plausible market gaps and product direction is still unclear)

Only include items whose conditions are met. Do not recommend brainstorm just because competitive whitespace exists.
Any `$spec-interview` recommendation must include a concrete target from the analysis, not a bare command. Use the top market gap, riskiest competitive assumption, or strongest positioning opportunity as the bracketed topic.

**Concept-validation mode next steps:** Use the same Recommended + Other options format, but choose the recommendation from the validated `## Gap Assessment` verdict:

## Next Steps

**Recommended:** [verdict-based next step] — [reason grounded in the gap assessment]

Other options:
- IF verdict is **Proceed to ICP**: recommend `$icp` — the competitive gap is validated; define who to build for
- IF verdict is **Pivot concept**: recommend `$brainstorm` — the market has a gap, but this concept needs a different angle before ICP work is useful
- IF verdict is **Abandon**: recommend `No follow-up skill recommended` — the analysis did not find a meaningful gap worth pursuing; include `$brainstorm` only if the user wants to explore a new concept
- `$competitive-analysis` — re-run in standard mode after ICP is defined (only after a proceed verdict and after `$icp` creates `research/icp.md`)

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

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
- `## Next Steps` must be the final section in the output file, with a recommended next step and 2–4 other options.

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
