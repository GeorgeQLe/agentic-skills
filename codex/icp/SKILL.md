---
name: icp
description: Customer discovery interview — map ICP, user journeys, pain points, and value prop
---

# ICP — Customer Discovery Interview

Interview the founder to map the complete problem space before solution design. This skill owns the **problem space** — who the customer is, who the user is, what their current experience looks like, where it breaks down, and what value we can uniquely provide.

## Modes (auto-detected)

- **Greenfield**: No codebase exists. Start from the founder's idea or problem area.
- **Existing project**: A product exists. Read the codebase to understand what's built, then interview to determine who it's for and whether it serves them.

## Workflow

1. **Greenfield**: Read any existing specs for background. **Existing**: Read codebase, README, package config, and summarise what's built.
2. Interview the user covering these areas (1–3 questions per turn, options with pros/cons when genuine alternatives exist):
   - **Customer Profile** — Who pays? Role, company size, buying triggers, discovery channels
   - **User Profile(s)** — Who uses it daily? Role, sophistication, goals, frustrations
   - **Current State Journey** — Step-by-step: how do users handle this problem today?
   - **Pain Map** — Where does the current state break down? Severity and frequency
   - **Market Landscape** — Alternatives, their shortcomings, unaddressed gaps
   - **Value Proposition** — Our unique wedge, the "aha moment"
   - **Customer ↔ User Dynamics** — Buying process, provisioning, adoption path
3. Confirm all areas are covered before concluding.

## Deliverables

- `specs/icp.md` — Structured discovery document with all 7 sections
- `specs/icp-interview.md` — Raw interview log with questions, responses, and closing summary

## Constraints

- Stay in problem space — do not propose features, architecture, or solutions.
- Challenge assumptions — push back on vague answers.
- Continue until all 7 areas are covered.
