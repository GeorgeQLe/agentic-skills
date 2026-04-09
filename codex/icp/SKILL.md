---
name: icp
description: Research-driven ICP discovery — web search + codebase analysis to identify multiple ICPs, pain points, value props, and cross-ICP prioritization
version: 3.4.0
argument-hint: <spec file path or concept/idea>
---

# ICP — Research-Driven Customer Discovery

Automated research that identifies **multiple ICP candidates**, maps pain points and value props, and selects a primary ICP. Uses web search + codebase analysis instead of interviews.

Default stance: assume the user has no insider knowledge of the market. Explain segments, pain signals, and tradeoffs from first principles so the recommendation is defensible without founder intuition. Ask for corrections, hard constraints, or proprietary facts only when needed.

## Workflow

0. **App Scope Resolution (Monorepo Support)**: Before parsing input, determine the app scope: (a) If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it. (b) If `research/` contains subdirectories (excluding files), list them and ask the user which app to target; if the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`, otherwise ask in plain text; if only one subdirectory exists, use it automatically. (c) If no subdirectories exist, proceed with flat structure (single-product mode). When app scope `{app}` is active: read/write research from `research/{app}/` instead of `research/`, read/write specs from `specs/{app}/` instead of `specs/`, and also read `research/icp.md` (cross-app overview) for broader context.
1. **Parse input**: Read `$ARGUMENTS` as spec file path or concept text. Read codebase if it exists. Read existing research for background. **Detect monorepo** (`turbo.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`, or `package.json` workspaces) — if multiple distinct user-facing products exist, run the full ICP process per app and produce `research/{app-name}/icp.md` per app plus a unified `research/icp.md`. **Migrate old convention:** If `research/icp-{app}.md` files exist (old naming), offer to move them to `research/{app}/icp.md` (and corresponding search logs to `research/{app}/icp-search-log.md`). Create the subdirectories as needed.
2. **Broad market research**: WebSearch with 8–12 query strategies (personas, pain points, segments, trends, competitors, forums, job postings, industry reports). Log all queries and findings.
3. **Identify 2–5 ICP candidates** from research evidence — note who they are, pain evidence, accessibility, and value potential.
4. **Checkpoint 1 — Present candidates to user.** Show ICP candidates with rationale — cite pain evidence found, accessibility signals, and value delivery reasoning from search findings for each candidate. Ask: "Do any surprise you? Any segment I'm missing?" Incorporate feedback before proceeding.
5. **Deep research per ICP**: Targeted WebSearch to fill the 9-section framework for each candidate:
   - **Customer Profile** — buyer persona, budget, discovery channels. Include **Geographic Focus** (only if the product has regulatory, language, or market-specific constraints — initial target region, why, expansion sequence) and **Named Accounts** (B2B: 5–10 real companies that fit, with name, size, industry, and why they fit)
   - **User Profile(s)** — daily users, sophistication, goals, frustrations
   - **Trigger Events** — what causes them to look NOW? Job changes, growth milestones, compliance deadlines, tool sunsets, contract renewals, funding events, new regulations. Rank by frequency and urgency.
   - **Current State Journey** — step-by-step current workflow
   - **Pain Map** — breakdowns, severity, frequency
   - **Market Landscape** — alternatives, shortcomings, gaps
   - **Market Sizing** — TAM/SAM/SOM via bottom-up (company counts × deal size) and top-down (industry reports, competitor revenue). Flag confidence level.
   - **Value Proposition** — unique wedge, "aha moment"
   - **Customer ↔ User Dynamics** — buying process, provisioning, adoption
6. **Checkpoint 2 — Present scoring matrix and primary ICP selection.** Show Value x Accessibility scores. Ask: "Which constraints, missing segments, or weak evidence should change this ranking?" Incorporate feedback.
7. **Cross-ICP analysis**: Shared pains, conflicts, product line recs, build sequence, lowest-hanging-fruit x most-value prioritization.
8. **Checkpoint 3 — Present cross-ICP analysis and build sequence.** Show shared pains with source data, conflicts with specific examples, and build sequence rationale grounded in the scoring matrix. Ask: "Does this sequencing make sense?" Incorporate feedback.
9. **Final review**: Present complete findings summary. Ask: "Ready to write? Anything to adjust?" Only write after user confirms.

## Deliverables

- `research/icp.md` — Primary ICP in canonical 9 top-level `##` sections (Customer Profile, User Profile(s), Trigger Events, Current State Journey, Pain Map, Market Landscape, Market Sizing, Value Proposition, Customer ↔ User Dynamics), then `## Additional ICPs` (condensed 9-section per ICP), then `## Cross-ICP Analysis` (prioritization matrix, shared pains, conflicts, product line recs, build sequence)
- `research/icp-search-log.md` — Raw research log: every query, findings, evidence, scoring rationale
- **Monorepo**: `research/{app-name}/icp.md` + `research/{app-name}/icp-search-log.md` per app, plus unified `research/icp.md` cross-referencing all app-level ICPs with top-level prioritization

The output file must end with a `## Next Steps` section (3–5 contextual items, "Pick one:" framing) based on which files exist: always suggest `$competitive-analysis`; conditionally suggest `$plan-interview`, `$journey-map`, `$mvp-gap`, `$brainstorm` based on whether `specs/`, `research/journey-map.md`, codebase, and `research/competitive-analysis.md` exist.

## Constraints

- Stay in problem space — do not propose features, architecture, or solutions.
- Evidence-based — every claim must trace to research logged in `research/icp-search-log.md`.
- Primary ICP must use canonical 9 `##` headers for downstream compatibility (`$plan-interview`, `$mvp-gap`, `$roadmap`, `$journey-map`).
- Minimum 8 WebSearch queries before identifying candidates, 2–3 per candidate after.
- Do not overwrite existing `research/icp.md` without asking.
- Present before writing — never write output until findings are validated through checkpoints.
- `## Next Steps` must be the final section in the output file, with 3–5 contextual items and "Pick one:" framing.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
