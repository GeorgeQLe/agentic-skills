---
skill: investigate
agent: claude
captured_at: 2026-06-21T12:29:36Z
source: user-invocation
prompt_scope: visible-user-invocation
---

# Origin: `/investigate state-model` substep depth

The session began with an `/investigate` into `state-model` questioning whether its
framework "substeps" were too thin relative to Pattern A research orchestrators. The
investigation concluded the thinness was **intentional**: `state-model` and its
product-design pipeline siblings follow the Prototype Session Loop convention (one final
alignment gate, inline `_working` drafts), not Pattern A. So it was never a bug.

# Refactor directive (this plan)

Implement the following plan:

## Plan: Unify the design-tree skills into one tree-growing, 5-stage orchestrator pattern

Convert all prototype-loop / design-tree skills to a single unified orchestrator pattern.
Each pipeline skill runs the same 5-stage flow within its scope — interrogation (user↔agent
alignment) → research (as needed) → design → plan-to-implement → implement (scoped) — and
grows a shared design tree rooted at `user-flow-map`.

Target architecture:

| Skill | Role | Per-branch behavior |
|---|---|---|
| `user-flow-map` | Root orchestrator | Creates design-tree root; one user-flow branch per flow |
| `state-model` | Pipeline (per user-flow branch) | Designs+plans data schemas, state machines, backend logic; attaches a model to the branch |
| `ux-variations` | Pipeline (per branch w/ finished model) | 5 UX variations → UX child branches |
| `ui-interview` | Pipeline (per UX variation) | UI experiments → UI child branches |
| `prototype` | Pipeline (per UI branch) | Builds narrow-scope runnable prototypes for validate / approve / reject / modify-back |
| `consolidate-variations` | Pipeline | Converges the tree into a cohesive MVP |
| `spec-interview` | Pipeline | On MVP approval, formalizes → production-ready v1 |
| `design-inspirations` | Subskill of `ui-interview` | Reference/inspiration support |
| `uat` | Subskill of `prototype`, `consolidate-variations`, exec-loop | Step-by-step UAT checklists at milestones |

The literal runnable prototype is owned by `prototype`; for the design skills the "implement"
stage produces the scoped canonical artifact + tree-branch growth + the build-plan slice
`prototype` will later realize. Validation decisions can flow back up the tree (modify a
state-model or user-flow, reject a UX/UI branch).

Rollout: convention + schema + all skills in one coordinated pass (Phases 0–6 — prompt
history, unified convention doc, flow-tree/model-tree schema v0.2, 5-stage SKILL.md rewrites,
generators/registries/bundles, versioning/changelogs/archive, manifest + showcase regen).
