---
name: icp
description: Research-driven ICP discovery — web search + codebase analysis to identify multiple ICPs, pain points, value props, and cross-ICP prioritization
type: research
version: v0.3
argument-hint: <spec file path, concept/idea, or empty to use concept brief>
---

# ICP — Research-Driven Customer Discovery

Invoke as `$icp`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Automated research that identifies **multiple ICP candidates**, maps pain points and value props, and selects a primary ICP. Uses web search + codebase analysis instead of interviews. If `research/concept-brief.md` or `research/{app}/concept-brief.md` exists, use it as starting context for the research frame.

Default stance: assume the user has no insider knowledge of the market. Explain segments, pain signals, and tradeoffs from first principles so the recommendation is defensible without founder intuition. Ask for corrections, hard constraints, or proprietary facts only when needed.

## Workflow

0. **App Scope Resolution (Monorepo Support)**: Before parsing input, determine the app scope: (a) If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it. (b) If `research/` contains subdirectories (excluding files), list them and ask the user which app to target; if the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`, otherwise ask in plain text; if only one subdirectory exists, use it automatically. (c) If no subdirectories exist, proceed with flat structure (single-product mode). When app scope `{app}` is active: read/write research from `research/{app}/` instead of `research/`, read/write specs from `specs/{app}/` instead of `specs/`, prefer `research/{app}/concept-brief.md` as concept context when present, and also read `research/icp.md` (cross-app overview) for broader context.
1. **Parse input and gather concept context**:
   - Read `$ARGUMENTS` as a spec file path or concept text when provided.
   - Read `research/{app}/concept-brief.md` in app scope, or `research/concept-brief.md` in flat scope, when present. Treat it as starting context and source hypotheses, not as settled truth.
   - If `$ARGUMENTS` is empty and a concept brief exists, use the concept brief as the primary input before falling back to README, specs, or codebase inference.
   - If `$ARGUMENTS` conflicts with the concept brief, flag the mismatch at the first checkpoint and ask which premise should guide ICP research.
   - Read codebase if it exists. Read existing research for background.
   - **Detect monorepo** (`turbo.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`, or `package.json` workspaces) — if multiple distinct user-facing products exist, run the full ICP process per app and produce `research/{app-name}/icp.md` per app plus a unified `research/icp.md`.
   - **Migrate old convention:** If `research/icp-{app}.md` files exist (old naming), offer to move them to `research/{app}/icp.md` (and corresponding search logs to `research/{app}/icp-search-log.md`). Create the subdirectories as needed.
2. **Broad market research**: WebSearch with 8–12 query strategies (personas, pain points, segments, trends, competitors, forums, job postings, industry reports, business model, willingness-to-pay signals). Log all queries and findings. **Classify the business model** into one or more of: B2B SaaS (PLG), B2B SaaS (SLG), B2C, B2C subscription, marketplace/platform, B2B2C, D2C, open-source/open-core, API/developer-first. Document classification with evidence in search log — this gates which sub-sections appear in the Discovery & Evaluation Behavior section.
3. **Identify 2–5 ICP candidates** from research evidence — note who they are, pain evidence, accessibility, value potential, and WTP signal strength.
4. **Checkpoint 1 — Present candidates to user.** Show ICP candidates with rationale — cite pain evidence found, accessibility signals, and value delivery reasoning from search findings for each candidate. Ask: "Do any surprise you? Any segment I'm missing?" Incorporate feedback before proceeding.
5. **Deep research per ICP**: Targeted WebSearch to fill the 9-section framework for each candidate:
   - **Customer Profile** — buyer persona, budget, discovery channels. Include **Geographic Focus** (only if the product has regulatory, language, or market-specific constraints — initial target region, why, expansion sequence), **Named Accounts** (B2B: 5–10 real companies that fit, with name, size, industry, and why they fit), and **Business Model & Go-to-Market Motion** (model type with evidence, primary motion PLG/SLG/community/partner/hybrid, buyer-user relationship)
   - **User Profile(s)** — daily users, sophistication, goals, frustrations
   - **Trigger Events** — what causes them to look NOW? Job changes, growth milestones, compliance deadlines, tool sunsets, contract renewals, funding events, new regulations. Rank by frequency and urgency.
   - **Current State Journey** — step-by-step current workflow
   - **Pain Map** — breakdowns, severity, frequency
   - **Current Alternatives (User Perspective)** — what users say they currently use or have tried, in their own words
   - **Market Sizing** — TAM/SAM/SOM via bottom-up (company counts × deal size) and top-down (industry reports, competitor revenue). Flag confidence level.
   - **Stated Value Drivers** — what customers say matters in their own language, the "aha moment" as they describe it. Include **Willingness-to-Pay Signals** as a bounded evidence subsection: paid alternatives, budget owner/context, current spend or time-cost proxy, switching-cost tolerance, economic urgency, and pricing sensitivity cues. Do not recommend prices, packages, or monetization strategy here.
   - **Customer ↔ User Dynamics** — post-purchase buyer-user relationship (provisioning, onboarding, admin vs end-user dynamics). For B2B, detailed buying process and DMU live in Discovery & Evaluation Behavior; this section focuses on the post-purchase relationship.
   - **Discovery & Evaluation Behavior** — how this persona found, evaluated, and chose solutions. Capture behavioural signals only (where they searched, who they asked, what they compared). Populate section 10.
6. **Checkpoint 2 — Present scoring matrix and primary ICP selection.** Show Value x Accessibility scores. The value rationale must explicitly distinguish pain intensity from WTP quality: active spend on alternatives, clear budget owner/context, high cost of inaction, tolerance for switching costs, and urgency tied to measurable economic outcomes count as strong WTP evidence; verbal interest without budget, free-only behavior, unclear owner, or price sensitivity that outweighs pain count as weak WTP evidence. Ask: "Which constraints, missing segments, or weak evidence should change this ranking?" Incorporate feedback.
7. **Cross-ICP analysis**: Shared pains, conflicts, product line recs, build sequence, lowest-hanging-fruit x most-value prioritization, discovery & evaluation comparison (how discovery and evaluation behavior differs across ICPs; do different ICPs find and choose solutions through different paths?).
8. **Checkpoint 3 — Present cross-ICP analysis and build sequence.** Show shared pains with source data, conflicts with specific examples, and build sequence rationale grounded in the scoring matrix. Ask: "Does this sequencing make sense?" Incorporate feedback.
9. **Final review**: Present complete findings summary. Ask: "Ready to write? Anything to adjust?" Only write after user confirms.

**After writing is complete, repeat the Recommended next step from the generated `## Next Steps` section in the final chat response.**

## Deliverables

- `research/icp.md` — Primary ICP in canonical 9 top-level `##` sections (Customer Profile, User Profile(s), Trigger Events, Current State Journey, Pain Map, Current Alternatives (User Perspective), Market Sizing, Stated Value Drivers, Customer ↔ User Dynamics). Include WTP evidence as a subsection inside `## Stated Value Drivers`, not as a new top-level parser-breaking section. Then supplementary `## Discovery & Evaluation Behavior` (section 10: how they find solutions, how they evaluate, how they choose), then `## Additional ICPs` (condensed 9-section + condensed discovery & evaluation per ICP, including condensed WTP evidence), then `## Cross-ICP Analysis` (prioritization matrix, shared pains, conflicts, product line recs, build sequence, discovery & evaluation comparison), then `## Signals for Downstream Research` (unvalidated observations routed to /competitive-analysis, /positioning, /monetization, /gtm)
- `research/icp-search-log.md` — Raw research log: every query, findings, evidence, scoring rationale
- **Monorepo**: `research/{app-name}/icp.md` + `research/{app-name}/icp-search-log.md` per app, plus unified `research/icp.md` cross-referencing all app-level ICPs with top-level prioritization

The output file must end with a `## Next Steps` section based on which files exist. Include a **Recommended** item (the single highest-impact next step given current project state) with a one-line reason, followed by **Other options** (2–4 alternatives). Use this format in the output:

## Next Steps

**Recommended:** `$competitive-analysis` — maps the landscape your ICP operates in so positioning and GTM have competitive grounding

Other options:
- `$spec-interview` — validate the riskiest ICP assumption with a targeted interview (if `specs/` exist)
- `$journey-map` — map the current-state journey to find intervention points (if no `research/journey-map.md`)
- `$mvp-gap` — check if the codebase delivers on the ICP's top pain point (if codebase exists)
- `$brainstorm` — generate solution ideas grounded in the ICP research (if `research/competitive-analysis.md` exists)

Only include items whose conditions are met. The recommendation (`$competitive-analysis`) is always applicable.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- Stay in problem space — do not propose features, architecture, or solutions.
- Evidence-based — every claim must trace to research logged in `research/icp-search-log.md`.
- Primary ICP must use canonical 9 `##` headers for downstream compatibility (`$spec-interview`, `$mvp-gap`, `$roadmap`, `$journey-map`). The renamed sections (`Current Alternatives (User Perspective)`, `Stated Value Drivers`) replace the former `Market Landscape` and `Value Proposition` headers. Section 10 (`## Discovery & Evaluation Behavior`) is supplementary and does not affect downstream parsing.
- Section 10 captures behavioural signals only — how personas find, evaluate, and choose solutions. Do not include GTM strategy, channel analysis, budget authority, procurement process, or pricing expectations — those belong in downstream skills (`$gtm`, `$monetization`, `$enterprise-icp`).
- WTP belongs in ICP only as evidence of segment fit and urgency: budget ownership, paid alternatives, current spend/time-cost proxies, switching-cost tolerance, economic urgency, and price sensitivity cues. Do not convert WTP evidence into pricing recommendations, packaging, discounting, ARPA targets, or monetization strategy; route those raw signals to `$monetization`.
- Minimum 8 WebSearch queries before identifying candidates, 2–3 per candidate after.
- Do not overwrite existing `research/icp.md` without asking.
- Present before writing — never write output until findings are validated through checkpoints.
- `## Next Steps` must be the final section in the output file, with a recommended next step and 2–4 other options.

## Alignment Page

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/icp-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
