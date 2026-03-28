---
name: icp
description: Research-driven ICP discovery — web search + codebase analysis to identify multiple ICPs with cross-ICP prioritization
version: 2.0.0
argument-hint: <spec file path or concept/idea>
---

# ICP — Research-Driven Customer Discovery

Automated research that identifies **multiple ICP candidates**, maps pain points and value props, and selects a primary ICP. Uses web search + codebase analysis instead of interviews.

## Workflow

1. **Parse input**: Read `$ARGUMENTS` as spec file path or concept text. Read codebase if it exists. Read existing specs for background.
2. **Broad market research**: WebSearch with 8–12 query strategies (personas, pain points, segments, trends, competitors, forums, job postings, industry reports). Log all queries and findings.
3. **Identify 2–5 ICP candidates** from research evidence — note who they are, pain evidence, accessibility, and value potential.
4. **Deep research per ICP**: Targeted WebSearch to fill the 7-section framework for each candidate:
   - **Customer Profile** — buyer persona, triggers, budget, discovery channels
   - **User Profile(s)** — daily users, sophistication, goals, frustrations
   - **Current State Journey** — step-by-step current workflow
   - **Pain Map** — breakdowns, severity, frequency
   - **Market Landscape** — alternatives, shortcomings, gaps
   - **Value Proposition** — unique wedge, "aha moment"
   - **Customer ↔ User Dynamics** — buying process, provisioning, adoption
5. **Score & select primary ICP**: Value (pain severity, willingness to pay, segment size, codebase alignment) x Accessibility (reachability, sales cycle, buying complexity, community).
6. **Cross-ICP analysis**: Shared pains, conflicts, product line recs, build sequence, lowest-hanging-fruit x most-value prioritization.
7. **Brief validation**: Ask user 1–2 questions to sanity-check the primary ICP selection.

## Deliverables

- `specs/icp.md` — Primary ICP in canonical 7 top-level `##` sections, then `## Additional ICPs` (condensed 7-section per ICP), then `## Cross-ICP Analysis` (prioritization matrix, shared pains, conflicts, product line recs, build sequence)
- `specs/icp-research.md` — Raw research log: every query, findings, evidence, scoring rationale

## Constraints

- Stay in problem space — do not propose features, architecture, or solutions.
- Evidence-based — every claim must trace to research logged in `specs/icp-research.md`.
- Primary ICP must use canonical `##` headers for downstream compatibility (`/plan-interview`, `/mvp-gap`, `/roadmap`).
- Minimum 8 WebSearch queries before identifying candidates, 2–3 per candidate after.
- Do not overwrite existing `specs/icp.md` without asking.
