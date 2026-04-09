---
name: journey-map
description: Map user journeys (per-use-case task flows) and customer journey (trigger→discovery→aha→conversion→retention) through the product
version: 1.2.0
argument-hint: "[optional: specific use case or journey stage to focus on]"
---

# Journey Map — User & Customer Journey Mapping

Research-first journey mapping for how people flow through the product (user journey) and through the business relationship (customer journey). Requires both `research/icp.md` and at least one `specs/*.md`.

## Prerequisites

- `research/icp.md` (or `research/{app}/icp.md` in monorepo mode) must exist — run `$icp` first.
- At least one spec in `specs/*.md` (or `specs/{app}/*.md`) must exist — run `$plan-interview` first.

## Workflow

0. **App Scope Resolution (Monorepo Support)**: Before checking prerequisites, determine the app scope: (1) If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it. (2) If `research/` contains subdirectories (excluding files), list them and ask the user which app to target; if the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`, otherwise ask in plain text; if only one subdirectory exists, use it automatically. (3) If no subdirectories exist, proceed with flat structure (single-product mode). When app scope `{app}` is active: read/write research from `research/{app}/` instead of `research/`, read/write specs from `specs/{app}/` instead of `specs/`, also read `research/icp.md` (cross-app overview) for broader context.
1. **Load context**: Read `research/icp.md` (or `research/{app}/icp.md`), `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`), `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`), all spec files in `specs/` (or `specs/{app}/`), codebase if it exists.
2. **Interview — User Journeys** (1–3 questions per turn, research and recommend by default — assume the user has no insider knowledge unless they explicitly provide it; present findings with data, define relevant terms, state a recommendation, and ask for hard constraints, proprietary facts, or corrections; only ask without a recommendation when evidence cannot resolve the choice):
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
4. **Present findings before writing.** Summarise user journey overview, customer journey overview, critical moments (citing ICP data, competitive analysis, or spec evidence for each), and journey gaps (citing the evidence that reveals each gap). Ask: "Which stages, use cases, or assumptions need correction, stronger evidence, or product-specific context?" Continue until validated.
5. Only after user confirms, write the output files.

## Deliverables

- `research/journey-map.md` (or `research/{app}/journey-map.md`) — User journeys (use case overview + task flows per profile), customer journey (full funnel), critical moments, journey gaps with `$plan-interview` prompts
- `research/journey-map-interview.md` (or `research/{app}/journey-map-interview.md`) — Raw interview log

The output file must end with a `## Next Steps` section (3–5 contextual items, "Pick one:" framing) based on which files exist: always suggest `$metrics`; conditionally suggest `$roadmap`, `$gtm`, `$plan-interview [top gap]`, `$run` based on whether `specs/`, `tasks/roadmap.md`, `research/gtm.md` exist and whether journey gaps were identified.

## Constraints

- Requires both ICP and specs — cannot work without knowing the user AND the solution.
- Stay concrete — specific actions, screens, decisions, not abstract concepts.
- Ground in ICP — every journey step should connect to a real user need.
- Cross-reference specs — flag functionality gaps with `$plan-interview` prompts.
- Do not prescribe UI or architecture.
- Present before writing — never write until validated.
- `## Next Steps` must be the final section in the output file, with 3–5 contextual items and "Pick one:" framing.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
