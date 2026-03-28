---
name: metrics
description: Define success metrics framework — activation, engagement, retention, growth, and business metrics tied to journey stages
version: 1.0.0
---

# Metrics — Success Metrics Framework

Interview-driven skill that defines measurable success metrics tied to journey stages, with instrumentation requirements.

## Prerequisites

- **Hard**: `research/journey-map.md` must exist — run `/journey-map` first.
- **Soft**: Reads `research/icp.md` and `research/customer-feedback.md` if they exist.

## Workflow

1. **Load context**: Read `research/journey-map.md`, `research/icp.md`, `research/customer-feedback.md`, codebase if it exists.
2. **Interview** (1–3 questions per turn):
   - **Activation** — tied to aha moment: what action signals "gets it", time-to-value target, activation rate
   - **Engagement** — tied to habit loop: healthy usage pattern, core repeated action, frequency thresholds
   - **Retention** — tied to churn triggers: retention definition, leading churn indicators, target rate
   - **Growth** — tied to expansion/advocacy: discovery channels, viral coefficient, expansion metrics
   - **Business** — revenue model, CAC, LTV, LTV:CAC ratio, payback period
3. **Present findings before writing.** Summarise the metrics framework, North Star metric, and instrumentation gaps. Ask: "Does this capture what success looks like?" Continue until validated.
4. Only after user confirms, write the output files.

## Deliverables

- `research/metrics.md` — North Star metric, per-category metrics (definition, measurement, target, instrumentation, status), instrumentation gaps with `/plan-interview` prompts
- `research/metrics-interview.md` — Raw interview log

## Constraints

- Requires journey map — metrics must tie to actual journey stages.
- Be precise — "user engagement" is not a metric; "weekly active users completing 3+ [action]" is.
- Include instrumentation — every metric must specify how to measure it and whether that exists today.
- Present before writing — never write until validated.
