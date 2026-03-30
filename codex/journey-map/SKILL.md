---
name: journey-map
description: Map user journeys (per-use-case task flows) and customer journey (trigger→discovery→aha→conversion→retention) through the product
version: 1.0.0
argument-hint: [optional: specific use case or journey stage to focus on]
---

# Journey Map — User & Customer Journey Mapping

Interview the user to map how people flow through the product (user journey) and through the business relationship (customer journey). Requires both `research/icp.md` and at least one `specs/*.md`.

## Prerequisites

- `research/icp.md` must exist — run `/icp` first.
- At least one spec in `specs/` must exist — run `/plan-interview` first.

## Workflow

1. **Load context**: Read `research/icp.md`, `research/competitive-analysis.md`, `research/enterprise-icp.md`, all spec files, codebase if it exists.
2. **Interview — User Journeys** (1–3 questions per turn, research and recommend by default — present findings with data, state recommendation, user approves/adjusts/overrides; only ask without recommendation when insider knowledge is required):
   - **Identify use cases** per user profile — 3–5 core tasks, entry point, highest-value use case, frequency patterns
   - **Map task flows** per use case — entry point, steps, decision points, happy path, failure modes, output
   - **Cross-reference current state** — which ICP current-state steps does each flow replace? Where is the delta greatest/smallest?
3. **Interview — Customer Journey** (1–3 questions per turn):
   - **Trigger → Discovery** — trigger events, discovery channels, first impression, the hook
   - **Evaluation → Trial** — what evaluation looks like, what they need to see, deal-killers
   - **Onboarding → Aha Moment** — first 5 min/hour/day, the specific aha moment, steps to aha, drop-off points
   - **Conversion** — what triggers payment, who decides, objections, timeline
   - **Retention & Expansion** — core habit loop, churn triggers, expansion paths, leading indicators
   - **Advocacy** — what drives recommendations, sharing channels, viral loops
4. **Present findings before writing.** Summarise user journey overview, customer journey overview, critical moments, and journey gaps. Ask: "Does this capture the experience? Any missing use cases or stages?" Continue until validated.
5. Only after user confirms, write the output files.

## Deliverables

- `research/journey-map.md` — User journeys (use case overview + task flows per profile), customer journey (full funnel), critical moments, journey gaps with `/plan-interview` prompts
- `research/journey-map-interview.md` — Raw interview log

The output file must end with a `## Next Steps` section (3–5 contextual items, "Pick one:" framing) based on which files exist: always suggest `/metrics`; conditionally suggest `/roadmap`, `/gtm`, `/plan-interview [top gap]`, `/run` based on whether `specs/`, `tasks/roadmap.md`, `research/gtm.md` exist and whether journey gaps were identified.

## Constraints

- Requires both ICP and specs — cannot work without knowing the user AND the solution.
- Stay concrete — specific actions, screens, decisions, not abstract concepts.
- Ground in ICP — every journey step should connect to a real user need.
- Cross-reference specs — flag functionality gaps with `/plan-interview` prompts.
- Do not prescribe UI or architecture.
- Present before writing — never write until validated.
- `## Next Steps` must be the final section in the output file, with 3–5 contextual items and "Pick one:" framing.
