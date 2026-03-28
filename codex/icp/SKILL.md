---
name: icp
description: Research-driven ICP discovery — web search + codebase analysis to identify multiple ICPs, pain points, value props, and cross-ICP prioritization
version: 3.1.0
argument-hint: <spec file path or concept/idea>
---

# ICP — Research-Driven Customer Discovery

Automated research that identifies **multiple ICP candidates**, maps pain points and value props, and selects a primary ICP. Uses web search + codebase analysis instead of interviews.

## Workflow

1. **Parse input**: Read `$ARGUMENTS` as spec file path or concept text. Read codebase if it exists. Read existing research for background.
2. **Broad market research**: WebSearch with 8–12 query strategies (personas, pain points, segments, trends, competitors, forums, job postings, industry reports). Log all queries and findings.
3. **Identify 2–5 ICP candidates** from research evidence — note who they are, pain evidence, accessibility, and value potential.
4. **Checkpoint 1 — Present candidates to user.** Show ICP candidates with rationale. Ask: "Do any surprise you? Any segment I'm missing?" Incorporate feedback before proceeding.
5. **Deep research per ICP**: Targeted WebSearch to fill the 9-section framework for each candidate:
   - **Customer Profile** — buyer persona, budget, discovery channels
   - **User Profile(s)** — daily users, sophistication, goals, frustrations
   - **Trigger Events** — what causes them to look NOW? Job changes, growth milestones, compliance deadlines, tool sunsets, contract renewals, funding events, new regulations. Rank by frequency and urgency.
   - **Current State Journey** — step-by-step current workflow
   - **Pain Map** — breakdowns, severity, frequency
   - **Market Landscape** — alternatives, shortcomings, gaps
   - **Market Sizing** — TAM/SAM/SOM via bottom-up (company counts × deal size) and top-down (industry reports, competitor revenue). Flag confidence level.
   - **Value Proposition** — unique wedge, "aha moment"
   - **Customer ↔ User Dynamics** — buying process, provisioning, adoption
6. **Checkpoint 2 — Present scoring matrix and primary ICP selection.** Show Value x Accessibility scores. Ask: "Does this ranking match your intuition?" Incorporate feedback.
7. **Cross-ICP analysis**: Shared pains, conflicts, product line recs, build sequence, lowest-hanging-fruit x most-value prioritization.
8. **Checkpoint 3 — Present cross-ICP analysis and build sequence.** Ask: "Does this sequencing make sense?" Incorporate feedback.
9. **Final review**: Present complete findings summary. Ask: "Ready to write? Anything to adjust?" Only write after user confirms.

## Deliverables

- `research/icp.md` — Primary ICP in canonical 9 top-level `##` sections (Customer Profile, User Profile(s), Trigger Events, Current State Journey, Pain Map, Market Landscape, Market Sizing, Value Proposition, Customer ↔ User Dynamics), then `## Additional ICPs` (condensed 9-section per ICP), then `## Cross-ICP Analysis` (prioritization matrix, shared pains, conflicts, product line recs, build sequence)
- `research/icp-search-log.md` — Raw research log: every query, findings, evidence, scoring rationale

The output file must end with a `## Next Steps` section (3–5 contextual items, "Pick one:" framing) based on which files exist: always suggest `/competitive-analysis`; conditionally suggest `/plan-interview`, `/journey-map`, `/mvp-gap`, `/brainstorm` based on whether `specs/`, `research/journey-map.md`, codebase, and `research/competitive-analysis.md` exist.

## Constraints

- Stay in problem space — do not propose features, architecture, or solutions.
- Evidence-based — every claim must trace to research logged in `research/icp-search-log.md`.
- Primary ICP must use canonical 9 `##` headers for downstream compatibility (`/plan-interview`, `/mvp-gap`, `/roadmap`, `/journey-map`).
- Minimum 8 WebSearch queries before identifying candidates, 2–3 per candidate after.
- Do not overwrite existing `research/icp.md` without asking.
- Present before writing — never write output until findings are validated through checkpoints.
- `## Next Steps` must be the final section in the output file, with 3–5 contextual items and "Pick one:" framing.
