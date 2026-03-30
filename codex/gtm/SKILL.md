---
name: gtm
description: Go-to-market planning — channel strategy, messaging, pricing, launch plan, and early traction tactics
version: 1.0.0
---

# GTM — Go-to-Market Planning

Interview-driven skill that builds a go-to-market plan grounded in ICP research and competitive landscape.

## Prerequisites

- **Hard**: `research/icp.md` must exist — run `/icp` first.
- **Soft**: Reads `research/competitive-analysis.md`, `research/journey-map.md`, `research/customer-feedback.md` if they exist.

## Workflow

1. **Load context**: Read `research/icp.md`, competitive analysis, journey map, customer feedback, CLAUDE.md, README.
2. **Interview** (1–3 questions per turn, research and recommend by default — present findings with data, state recommendation, user approves/adjusts/overrides; only ask without recommendation when insider knowledge is required):
   - **Channel Strategy** — where ICP hangs out, primary/secondary acquisition channels, budget constraints
   - **Messaging Framework** — one-liner, value prop framing, pain point headline, proof points, competitive positioning
   - **Pricing Strategy** — model (freemium/trial/paid), entry price, tiers, upgrade triggers, competitor comparison
   - **Launch Plan** — timeline, launch channel, goals, assets needed, first 10 customers
   - **Early Traction Tactics** — 30/60/90 day plan, manual tactics, feedback loop, the one metric that matters
3. **Present findings before writing.** Summarise the full GTM plan. Ask: "Does this capture your go-to-market strategy?" Continue until validated.
4. Only after user confirms, write the output files.

## Deliverables

- `research/gtm.md` — Channel strategy, messaging, pricing, launch plan, early traction tactics
- `research/gtm-interview.md` — Raw interview log

The output file must end with a `## Next Steps` section (3–5 contextual items, "Pick one:" framing) based on which files exist: conditionally suggest `/roadmap`, `/metrics`, `/plan-interview [top question]`, `/run`, `/journey-map` based on whether `specs/`, `tasks/roadmap.md`, `research/metrics.md`, `research/journey-map.md` exist and whether open questions need research.

## Constraints

- Requires ICP — cannot plan GTM without knowing the target customer.
- Ground every decision in research — channels, messages, and pricing must trace to ICP/competitive insights.
- Be specific — "use social media" is not a strategy.
- Present before writing — never write until validated.
- Don't prescribe product changes — GTM is about reaching the market with what exists.
- `## Next Steps` must be the final section in the output file, with 3–5 contextual items and "Pick one:" framing.
