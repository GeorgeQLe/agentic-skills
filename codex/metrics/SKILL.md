---
name: metrics
description: Define success metrics framework — activation, engagement, retention, growth, and business metrics tied to journey stages
version: 1.1.0
---

# Metrics — Success Metrics Framework

Interview-driven skill that defines measurable success metrics tied to journey stages, with instrumentation requirements.

## Prerequisites

- **Hard**: `research/journey-map.md` (or `research/{app}/journey-map.md` in monorepo mode) must exist — run `/journey-map` first.
- **Soft**: Reads `research/icp.md` (or `research/{app}/icp.md`) and `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`) if they exist.

## Workflow

0. **App Scope Resolution (Monorepo Support)**: Before checking prerequisites, determine the app scope: (1) If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it. (2) If `research/` contains subdirectories (excluding files), list them and ask the user which app to target; if only one subdirectory exists, use it automatically. (3) If no subdirectories exist, proceed with flat structure (single-product mode). When app scope `{app}` is active: read/write research from `research/{app}/` instead of `research/`, read/write specs from `specs/{app}/` instead of `specs/`, also read `research/icp.md` (cross-app overview) for broader context.
1. **Load context**: Read `research/journey-map.md` (or `research/{app}/journey-map.md`), `research/icp.md` (or `research/{app}/icp.md`), `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`), codebase if it exists.
2. **Interview** (1–3 questions per turn, research and recommend by default — present findings with data, state recommendation, user approves/adjusts/overrides; only ask without recommendation when insider knowledge is required):
   - **Activation** — tied to aha moment: what action signals "gets it", time-to-value target, activation rate
   - **Engagement** — tied to habit loop: healthy usage pattern, core repeated action, frequency thresholds
   - **Retention** — tied to churn triggers: retention definition, leading churn indicators, target rate
   - **Growth** — tied to expansion/advocacy: discovery channels, viral coefficient, expansion metrics
   - **Business** — revenue model, CAC, LTV, LTV:CAC ratio, payback period
3. **Present findings before writing.** Summarise the metrics framework, North Star metric, and instrumentation gaps. Ask: "Does this capture what success looks like?" Continue until validated.
4. Only after user confirms, write the output files.

## Deliverables

- `research/metrics.md` (or `research/{app}/metrics.md`) — North Star metric, per-category metrics (definition, measurement, target, instrumentation, status), instrumentation gaps with `/plan-interview` prompts
- `research/metrics-interview.md` (or `research/{app}/metrics-interview.md`) — Raw interview log

The output file must end with a `## Next Steps` section (3–5 contextual items, "Pick one:" framing) based on which files exist: conditionally suggest `/plan-interview [topic]`, `/roadmap`, `/gtm`, `/run`, `/customer-feedback` based on instrumentation gaps, `tasks/roadmap.md`, `research/gtm.md`, and whether the product is live.

## Constraints

- Requires journey map — metrics must tie to actual journey stages.
- Be precise — "user engagement" is not a metric; "weekly active users completing 3+ [action]" is.
- Include instrumentation — every metric must specify how to measure it and whether that exists today.
- Present before writing — never write until validated.
- `## Next Steps` must be the final section in the output file, with 3–5 contextual items and "Pick one:" framing.
