# Skill Next-Step Contracts

> Audit date: 2026-04-20
> Scope: 205 `SKILL.md` files under `global/` and `packs/`
> Purpose: define when a skill may recommend another skill, when it must say there is no valid follow-up, and how multi-state outputs choose the next step.

## Summary

Recommended next steps are valid only when they match the skill's current end state and all prerequisites for the recommended skill can be satisfied from the project state.

This audit checked:

- Every command-style skill reference in `SKILL.md` files resolves to an existing skill name.
- Next-step guidance does not recommend a command before its prerequisite artifact exists.
- Multi-state skills document a valid recommendation for each expected end state.
- Research/spec outputs either end with `## Next Steps` or explicitly explain why no follow-up skill exists.
- Downstream-impact recommendations are based on an actual impact classification, not a speculative one.

## Universal Rules

1. A recommended skill must exist in the active platform or pack context. Global skills are valid from any pack. Pack skills are valid only when that pack is installed or the text explicitly says to install it first.
2. A recommendation must name the artifact or condition that makes it valid, for example `research/icp.md exists`, `specs/` is empty, or `tasks/roadmap.md exists`.
3. If a skill has multiple end states, recommendation logic must branch by end state. A single "always recommend" command is invalid when any state makes that command premature or misleading.
4. If no useful follow-up exists, the valid recommendation is `No follow-up skill recommended` with a short reason. Do not invent work to keep the chain going.
5. If a recommendation depends on downstream impact, the skill must first classify impact as `None`, `Minor`, or `Major`. `Major` may recommend `reconcile-research`; `Minor` may annotate stale suggestions; `None` should not mention reconciliation.
6. Experiment result branches belong in `## Decision Rules` until results exist. A newly designed experiment's current next step is to run the experiment.
7. Human, one-time future, and recurring obligations must follow the task classification rules in the writing skill: `tasks/manual-todo.md`, `tasks/record-todo.md`, or `tasks/recurring-todo.md` as appropriate, not unconditional current `tasks/todo.md` work.

## Expected End States

| Skill family | Expected end states | Valid next-step contract |
| --- | --- | --- |
| Global planning/execution (`concept-exploration`, `spec-interview`, `ux-variation`, `ui-interview`, `roadmap`, `plan-phase`, `run`, `ship`, `ship-end`) | Concept needed, plan needed, design planning needed, execution ready, shipping ready, next phase ready, mode unset | Use mode-aware routing from `docs/operating-modes.md`: `claude-only` stays on Claude, `codex-only` stays on Codex, `hybrid` delegates from Claude to Codex, unset presents all viable paths. For user-facing product work, concept exploration precedes ICP when no concept brief, downstream research, or specs exist; roadmap is valid only after journey, UX variation, and UI interview artifacts exist or are explicitly not applicable. |
| Global audits/reviews (`debug`, `investigate`, `trace`, `affected`, `dead-code`, `slim-audit`, `expert-review`, `regression-check`, `spec-drift`, `reconcile-dev-docs`, `hygiene`) | Findings, no findings, fix required, blocked | Recommend the smallest skill that can address the highest-severity finding. If no findings remain, say no follow-up or point to the appropriate roadmap/status skill only when lifecycle work remains. |
| Global project operations (`sync`, `deploy`, `release`, `decommission`, `migrate`, `scaffold`, `pack`, `provision-agentic-config`, `commit-and-push-by-feature`, `handoff`, `guide`, `uat-guide`, `analyze-sessions`) | Completed, blocked, needs confirmation, no-op | Next step must be an operational continuation of the completed state. Confirmation-only states must ask for confirmation, not recommend an automatic command. |
| Kanban variants | Card created, moved, blocked/punted, done, board unavailable | Recommend the next same-platform kanban variant when board state can advance. If board tooling is unavailable, use the documented non-kanban degraded path. |
| Research documents | New document, updated document, downstream conflicts, no follow-up | End the canonical output with `## Next Steps` unless the document is append-style. Select recommendations from current files and findings only. |
| Append-style research documents (`customer-feedback`, `runway-model`, `cohort-review`, `retro`) | New session/snapshot, cumulative synthesis updated, stale research found, no stale research | Put next steps in the current synthesis/snapshot. Do not rewrite old sessions. Recommendations must use cumulative state, not only the latest entry. |
| Code-quality pack | Audit only, fix mode, no safe refactor, refactor complete | Audit mode recommends specific fix/refactor work only when findings exist. Fix mode recommends `regression-check` after behavior-preserving changes. |
| Game and devtool packs | Strategy artifact created, validation artifact created, roadmap ready, launch/docs audit complete | Follow the default flow in `docs/skills-reference.md`; if the final pack artifact is complete, recommend roadmap/execution only when a build plan is still missing. |

## Multi-State Skill Rules

| Skill | End states | Valid recommendation |
| --- | --- | --- |
| `video-script` | Script approved, no upstream artifacts, user declined | Approved -> `video-build`. No artifacts -> recommend prerequisite (`creator-positioning`, `product-led-media-map`, or `series-spec`). Declined -> no follow-up. |
| `video-build` | Build complete, script missing, user declined | Complete -> `creator-metrics-review` + task items in `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/recurring-todo.md`. Missing -> `video-script`. Declined -> no follow-up. |

`youtube-format-research`, `video-script`, and `video-build` live in the `remotion` pack. Creator-media skills that recommend them should mention enabling `remotion` when it is not installed.

| Skill | End states | Valid recommendation |
| --- | --- | --- |
| `concept-exploration` | Business discovery lane missing, business discovery enabled, project type unclear | Pack missing -> `pack install business-discovery`. Pack enabled -> `icp` using `research/concept-brief.md`. Project unclear -> `pack recommend`. |
| `competitive-analysis` concept-validation mode | `Proceed to ICP`, `Pivot concept`, `Abandon` | `Proceed` -> `icp`; `Pivot` -> `brainstorm`; `Abandon` -> `No follow-up skill recommended` unless the user wants a new concept. Standard-mode re-run is valid only after `icp` creates `research/icp.md`. |
| `competitive-analysis` standard mode | Value-prop missing, journey missing, specs missing, GTM missing, codebase exists | `value-prop-canvas` is the first standard-mode recommendation when `research/value-prop.md` is missing; then `journey-map`, `spec-interview`, `gtm`, `mvp-gap`. |
| `experiment` | Designed, validated, invalidated, inconclusive | Designed -> run the experiment manually. Validated -> log evidence with `customer-feedback`, update `assumption-tracker`, or plan/spec the validated opportunity. Invalidated -> update `assumption-tracker` and return to the domain skill for the failed assumption. Inconclusive -> `experiment [follow-up]` or `customer-feedback`. |
| `reconcile-research` | Actionable conflicts, deferred-only, resolved, no findings | Conflicts -> recommend the producer skill with the highest conflict count. Deferred-only or fully resolved -> `research-roadmap`. No remaining work -> `No follow-up skill recommended`. |
| `customer-feedback` | Major impact, stale ICP, stale journey, new needs, no stale findings, experiment feedback | Major -> `reconcile-research`. Stale ICP -> `icp`. Stale journey -> `journey-map`. New needs -> `brainstorm` or `feature-interview [topic]`. No stale findings -> `research-roadmap`. Experiment feedback -> `assumption-tracker`. |
| `metrics` | Instrumentation gaps, roadmap missing, GTM missing, roadmap exists, live product with data | Gaps -> `feature-interview [instrumentation topic]` unless full-spec creation is already confirmed. No roadmap -> `roadmap`. No GTM -> `gtm`. Roadmap exists -> `run`. Live data -> `cohort-review`. |
| `gtm` | Major downstream conflict, growth-model missing, roadmap missing, metrics missing, open research question, roadmap exists | Major -> `reconcile-research`. Growth-model missing -> `growth-model`. Roadmap missing with specs -> `roadmap`. Metrics missing -> `metrics`. Open question -> `feature-interview [topic]` unless full-spec creation is already confirmed. Roadmap exists -> `run`. |
| `monetization` | GTM missing, GTM stale, metrics missing, roadmap missing, live revenue | GTM missing/stale -> `gtm`. Metrics missing -> `metrics`. Specs without roadmap -> `roadmap`. Live revenue -> `runway-model`. |
| `positioning` | Lean canvas missing, GTM missing, GTM exists, monetization missing, codebase exists, major downstream conflict | Major -> `reconcile-research`. Otherwise `lean-canvas` is the natural next step; include `journey-map`, `gtm`, `monetization`, or `mvp-gap` only when their conditions hold. |
| `mvp-gap` | Missing specs, missing journey/competitive/metrics context, downstream conflict, roadmap ready | Top unspecced gap -> `feature-interview [gap]` unless full-spec creation is already confirmed. Missing context -> corresponding research skill. Major conflict -> `reconcile-research`. Otherwise -> `roadmap`. |
| `scale-audit` | Enterprise blockers lacking specs, missing enterprise journey/metrics/startup gap context, roadmap ready | Top blocker -> `feature-interview [blocker]` unless full-spec creation is already confirmed. Missing context -> `journey-map enterprise`, `mvp-gap`, or `metrics`. Otherwise -> `roadmap`. |
| `burn-rate` | Major conflict, monetization missing/stale, GTM missing, metrics missing, complex infra, unclear revenue | Major -> `reconcile-research`. Monetization missing/stale -> `monetization`. GTM missing -> `gtm`. Metrics missing -> `metrics`. Complex infra -> `scale-audit`. Unclear revenue model -> `brainstorm` only when no monetization path is plausible. |
| `value-prop-canvas` | Positioning missing, gaps identified, competitive-analysis missing, positioning exists | `positioning` is the natural next step. If gaps identified -> `feature-interview [top gap]`. If no competitive-analysis -> `competitive-analysis`. If positioning exists -> `lean-canvas`. |
| `lean-canvas` | Journey-map missing, monetization missing, positioning missing, riskiest hypothesis | `journey-map` is always the natural next step. Include `monetization` to validate revenue/cost hypotheses, `feature-interview [riskiest hypothesis]`, or `positioning` only when conditions hold. |
| `hook-model` | B2B/enterprise (skippable), metrics missing, engagement mechanism, monetization missing | B2B -> offer skip to `metrics`. Otherwise `metrics` is always the next step. Include `feature-interview [engagement mechanism]` or `monetization` when conditions hold. |
| `growth-model` | Top growth mechanism, specs exist, live product | `feature-interview [top growth mechanism]` is the recommended next step when the mechanism is not already specced. Include `roadmap` when specs exist, `experiment [growth hypothesis]` for live products. |
| `pmf-assessment` | Weak PMF, moderate PMF, strong PMF, pre-launch | Weak -> skill addressing weakest area (`spec-interview`, `icp`). Moderate -> `growth-model` or `hook-model`. Strong -> `growth-model` or `roadmap`. Pre-launch -> design framework for future use. |
| `platform-strategy` | Top expansion candidate, enterprise target, no assumption tracker, specs exist | Recommend `experiment [top candidate]` because expansion must be validated before build. Include `enterprise-icp`, `assumption-tracker`, `competitive-analysis [adjacent category]`, `icp [new audience]`, `feature-interview [top candidate]`, `spec-interview [top candidate]`, or `roadmap` only when their conditions hold. |

## Audit Evidence

Command-reference validation:

```bash
scripts/skill-deps.sh --broken
```

Expected result:

```text
No broken references found.
```

Manual semantic audit findings fixed in this pass:

- Concept-validation `competitive-analysis` now handles `Proceed`, `Pivot`, and `Abandon` distinctly.
- `experiment` now separates design-stage next steps from result-state decision rules.
- `reconcile-research` now documents resolved/no-work end states.
- Downstream-impact next steps now require an actual proposed-output impact check before selecting `reconcile-research` or stale annotations.
