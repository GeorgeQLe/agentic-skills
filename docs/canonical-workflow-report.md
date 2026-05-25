# Canonical Agentic Workflow Report

> Date: 2026-05-24
> Scope: current `agentic-skills` workflow contracts and workflow documentation as of the AFPS alignment/prototype routing updates. This report is an audit snapshot, not a new skill contract.
> Authoritative operating-model reference: `docs/operating-modes.md`.
> Evidence sources: `README.md`, `docs/operating-modes.md`, `docs/packs.md`, `docs/skills-reference.md`, `docs/pack-workflow-matrix.md`, `docs/codex-workflow.md`, `docs/skill-next-step-contracts.md`, `global/{claude,codex}/*/SKILL.md`, `packs/*/{claude,codex}/*/SKILL.md`, `tasks/roadmap.md`, `tasks/todo.md`, and `tasks/lessons.md`.

## Executive Summary

The canonical workflow is a file-backed, pack-routed planning and execution system shared by Claude Code and Codex. Its current product stance is AFPS: alignment first, prototype second, production specification third, implementation after the production spec is sequenced into phases.

The report previously described the workflow as implemented through a completed Phase 11 snapshot. That framing is stale. Phase 11 remains important history for the three-mode operating model, but the current workflow has since changed around business pack routing, prototype gates, research-refresh gates, and feature-addition routing.

The durable source of truth remains the repository task and planning surface:

- `research/*.md` captures concept, market, customer, lifecycle, and operating evidence.
- `specs/ux-variations-*.md` captures UX alternatives before implementation is locked.
- `specs/ui-*.md` and `specs/ui-requirements-*.md` capture screen and content requirements for prototypes.
- `prototypes/{topic}/variation-N/` captures cheap built variants.
- `research/uat-variant-evaluation-*.md` captures comparable hands-on variant evidence.
- `prototypes/{topic}/consolidated/` captures the chosen prototype direction after consolidation.
- `specs/{topic}.md` captures the production implementation specification after the consolidated prototype and post-prototype research refresh.
- `tasks/roadmap.md` captures phased strategy.
- `tasks/todo.md` captures the current queue and active execution contract.
- `tasks/manual-todo.md`, `tasks/record-todo.md`, and `tasks/recurring-todo.md` capture human-only, condition-gated, and cadence-based work.
- `tasks/history.md` captures completed work as append-only evidence.
- `alignment/*.html` captures full-depth interactive review pages for durable planning, research, report, spec, prototype, and document outputs.

The canonical product path is:

```text
concept-exploration
  -> pack selection
  -> icp
  -> competitive-analysis
  -> journey-map
  -> value / positioning / growth / operating research as needed
  -> ux-variations
  -> ui-interview
  -> prototype
  -> uat --variant-evaluation
  -> consolidate-variations
  -> research-roadmap --post-prototype
  -> spec-interview
  -> research-roadmap --post-spec
  -> roadmap
  -> plan-phase
  -> run / delegate
  -> ship / ship-end
```

## Current Routing Model

### Project Designation And Packs

Projects are designated through `pack`, which reads and writes `.agents/project.json`, sets `project_type`, tracks `enabled_packs`, and can set the optional `agent_mode`.

The current business routing model is lane-based:

| Lane | Pack | Primary purpose |
| --- | --- | --- |
| Discovery | `business-discovery` | ICP, competitive analysis, customer feedback, value proposition, positioning, lean canvas |
| Customer lifecycle | `customer-lifecycle` | Journey, onboarding, conversion, transaction, retention, expansion, lifecycle metrics |
| Growth | `business-growth` | Hook model, growth model, metrics, GTM, monetization, landing copy, experiments, PMF |
| Operations | `business-ops` | Assumptions, risk, runway, cohorts, retros, investor updates, platform strategy, research reconciliation |

`business-app` is now a compatibility alias that installs the four business lanes. It should not be described as the primary pack for normal work. Prefer the narrow lane that matches the current job, then add downstream lanes as evidence becomes ready.

Kanban execution remains separate. `business-app-kanban` is an opt-in board-aware execution variant and should be paired with the relevant business lane; it is not a substitute for discovery, lifecycle, growth, or ops research.

### Operating Modes

The operating modes are unchanged:

| Mode | Orchestrator | Executor |
| --- | --- | --- |
| `claude-only` | Claude | Claude |
| `codex-only` | Codex | Codex |
| `hybrid` | Claude | Codex through `/delegate` and the approval packet |

`scripts/agent-mode.sh` remains the resolver. `SKILLS_AGENT_MODE` overrides `.agents/project.json.agent_mode`; unset mode is valid and skills infer command syntax from the active invocation.

The approval-packet contract remains scoped to cross-CLI execution and handoff. `.agents/approved-plan.json` is local and machine-readable. `tasks/approved-plan.md` is the sanitized committed mirror.

## Canonical Workflows By Starting Point

### Fresh Directory Or Rough Product Idea

Use this when there is no decision-complete codebase contract.

Claude route:

```bash
/concept-exploration
/pack
/pack install business-discovery        # when the discovery lane is missing
/icp
/competitive-analysis
/pack install customer-lifecycle        # when lifecycle mapping is missing
/journey-map
/value-prop-canvas                      # when value framing is needed
/positioning                            # when market narrative is needed
/lean-canvas                            # when business-model synthesis is needed
/pack install business-growth           # when GTM/growth/pricing work is needed
/metrics
/monetization
/gtm
/growth-model
/ux-variations
/ui-interview
/prototype
/uat --variant-evaluation
/consolidate-variations
/research-roadmap --post-prototype
/spec-interview
/research-roadmap --post-spec
/roadmap
/plan-phase 1
/run
/ship-end
```

Codex route:

```bash
$concept-exploration
$pack
$pack install business-discovery
$icp
$competitive-analysis
$pack install customer-lifecycle
$journey-map
$value-prop-canvas
$positioning
$lean-canvas
$pack install business-growth
$metrics
$monetization
$gtm
$growth-model
$ux-variations
$ui-interview
$prototype
$uat --variant-evaluation
$consolidate-variations
$research-roadmap --post-prototype
$spec-interview
$research-roadmap --post-spec
$roadmap
$plan-phase 1
$run
$ship-end
```

This is an ordered default, not a mandate to run every optional business skill. Skip value, positioning, growth, or ops skills when the evidence is already sufficient or the product does not need that lane yet. Do not skip ICP, competitive analysis, journey mapping, UX/UI planning, prototype evaluation, consolidation, or the production spec for non-trivial user-facing product work.

### Existing Codebase With No Current Docs

Use `pack` first to designate the project. Then run the lightest evidence-producing path that fits the codebase:

- If the product concept is unclear, use `concept-exploration`.
- If there is product direction but no market evidence, use `business-discovery` and start with `icp`.
- If there is market evidence but no user/customer path, install or enable `customer-lifecycle` and run `journey-map`.
- If the implementation already exists but specs are stale, use `spec-drift` or `reconcile-dev-docs` before mutating plans.
- If a stale project should restart, use `desk-flip` and `bootstrap-repo --reset-existing` so old docs and code are archived before fresh alignment begins.

### Existing Spec Or Planned Feature

The current `roadmap` contract distinguishes unresolved ideas from confirmed full-spec creation:

| State | Current behavior |
| --- | --- |
| No specs and missing journey for user-facing work | Queue `journey-map` first. |
| No specs, unresolved idea, unclear destination | Queue `feature-interview`. |
| No specs, user already selected full production spec creation | Queue `spec-interview`. |
| Specs exist but UX/UI/prototype gate is incomplete | Queue the missing gate: `journey-map`, `ux-variations`, `ui-interview`, `prototype`, `uat --variant-evaluation`, `consolidate-variations`, or post-prototype refresh. |
| Production spec exists, roadmap missing | Build or update `tasks/roadmap.md`, then seed `plan-phase`. |
| All roadmap phases complete | Queue `research-roadmap`, then route to `brainstorm` unless a concrete idea is selected. |

`spec-interview` is no longer the broad default for every unspecced thought. It is the production-spec deep dive after a consolidated prototype exists, or after the user explicitly chooses full-spec creation for a scope that already has the necessary upstream evidence.

### Post-Spec Additions

After a production spec exists, feature additions should route through `feature-interview` by default. The purpose is to decide whether the addition updates the existing spec, becomes a smaller add-on spec, or should be parked. This preserves the parent spec as the baseline contract and avoids reflexively re-running a full `spec-interview` for every incremental feature.

Use `spec-interview` again only when the selected follow-up truly requires a full production-spec pass and the prototype/research gates are already satisfied.

## Prototype-Gated Product Specification

The current product-spec path is gated by built and reviewed prototypes:

1. `ux-variations` creates multiple UX/UI directions from research and journey evidence.
2. `ui-interview` or layout/UI requirement artifacts make those directions buildable.
3. `prototype` builds runnable disposable artifacts in `prototypes/{topic}/variation-N/`.
4. `uat --variant-evaluation` creates the human-run comparison plan and evidence capture.
5. `consolidate-variations` compares reviewed variants, interviews the user on keep/reject decisions, resolves conflicts, and builds `prototypes/{topic}/consolidated/`.
6. `research-roadmap --post-prototype` checks whether prototype decisions stale or contradict research.
7. `spec-interview` walks the consolidated prototype screen by screen and produces `specs/{topic}.md`.
8. `research-roadmap --post-spec` checks whether production-spec decisions stale or contradict research.
9. `roadmap` sequences the spec into phases.

The production spec should be decision-complete enough to implement. The prototype remains disposable evidence, not production code.

## Task Pipeline Contracts

### Roadmap

`roadmap` is a task-pipeline manager, not a brainstorming shortcut. It scans `tasks/`, `specs/`, `research/`, git status, manual work, records, recurring work, and ideas. It either writes/updates a roadmap or writes a priority queue.

Important current invariants:

- It queues `feature-interview` for unresolved ideas and unspecced gaps unless full-spec creation is already selected.
- It applies pack availability guards before recommending pack-local skills such as `journey-map`.
- It does not queue itself for a missing roadmap when it can build or extend the roadmap in the same run.
- When it writes a roadmap, it immediately seeds the first relevant phase with `plan-phase`.
- It keeps implementation detail out of `tasks/roadmap.md`; detailed steps belong in `tasks/todo.md`.

### Plan Phase

`plan-phase` decomposes exactly one roadmap phase. It writes the active execution contract in `tasks/todo.md`, including test strategy, execution profile, file-level work, manual blockers, and completion criteria. Later phases stay strategic until they become current.

Execution profiles remain:

| Profile | Meaning |
| --- | --- |
| `serial` | Main agent owns all work. |
| `research-only` | Parallel reads are useful; implementation stays integrated. |
| `review-only` | Main build is serial; reviewers inspect after. |
| `implementation-safe` | Write lanes can be separated by owned paths. |
| `agent-team` | Branch-backed parallel write lanes with consolidation/PR review. |

### Run, Ship, And Ship-End

`run`, `ship`, and `ship-end` are operational loops. They execute, validate, update docs, commit, push, and route. They are intentionally exempt from the durable alignment-page requirement, even though they may mutate task docs as part of shipping.

## Alignment Review Pages

Durable planning, research, spec, prototype, report, and decision-producing skills now create root-level `alignment/*.html` pages. These pages are full-depth review artifacts, not short summaries.

The current page contract includes:

- dark-mode review UI;
- complete content of proposed deliverables;
- evidence coverage;
- assumptions and confidence;
- scope and non-goals where relevant;
- proposed file changes;
- coverage checkpoints;
- required radio questions with `Other / None of the above` and `Need clarification`;
- disabled-until-complete compile-answer behavior;
- structured YAML output with `section`, `gate_type`, `status`, `answer`, optional `notes`, and optional target path fields;
- copy-to-clipboard with fallback selection;
- archive-first replacement under `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/`;
- best-effort browser-open reporting.

Approval-gated research and planning skills should build the alignment page before canonical Markdown is written, ask the user to review it, and suppress downstream routing until approval is received.

## Current Audit Findings

### Finding 1: The Old Report Used Stale Phase 11 Framing

The prior report dated 2026-04-19 and refreshed 2026-04-22 described Phase 11 as the current implementation horizon. That is now only historical context. Later workflow changes introduced lane-based business packs, approval-gated alignment previews, run/ship alignment exemptions, prototype-gated spec work, and revised post-spec feature routing.

**Resolution in this report:** metadata and narrative now describe the current workflow as of 2026-05-24 and treat Phase 11 as the origin of the operating-mode model, not the whole current workflow.

### Finding 2: Business-Pack Language Drifted Toward The Compatibility Alias

The old report described `business-app` as a normal project-local opt-in. Current docs and pack contracts split business work into `business-discovery`, `customer-lifecycle`, `business-growth`, and `business-ops`; `business-app` remains a compatibility alias.

**Resolution in this report:** the pack model now centers the narrow lanes and labels `business-app` as compatibility-only.

### Finding 3: No-Spec Routing Needed Feature-Interview Precision

Older text said no specs should route to `spec-interview` after journey context. The current `roadmap` contract says unresolved ideas or gaps route to `feature-interview`; `spec-interview` is used only when full-spec creation is already selected.

**Resolution in this report:** no-spec routing now distinguishes unresolved idea triage from confirmed full-spec creation.

### Finding 4: Product Spec Work Must Respect The Prototype Gate

The old report had pieces of the prototype path but still treated spec creation too broadly. Current contracts place `spec-interview` after consolidated prototype evidence and post-prototype research refresh.

**Resolution in this report:** the product-spec path is explicitly prototype-gated.

### Finding 5: Post-Spec Feature Additions Belong In Feature-Interview

`tasks/lessons.md` records the 2026-05-24 correction that post-spec additions should use `feature-interview` to update an existing spec or create a small add-on spec, rather than defaulting back to a full `spec-interview`.

**Resolution in this report:** post-spec addition routing is now part of the canonical model.

### Finding 6: Consolidate-Variations Contract Has Tension Around Output Shape

The current `consolidate-variations` contract says the skill produces a consolidated prototype and an interview log, and its description says it produces a final implementation-ready UI specification. The workflow later relies on `spec-interview` to turn the consolidated prototype into the production implementation spec. That can be read two ways:

- consolidation writes an implementation-ready UI specification for the final design surface; or
- consolidation writes a consolidated prototype and evidence log, while production implementation details wait for `spec-interview`.

**Audit note:** this task does not patch skill contracts. The ambiguity should be handled as a future skill-contract cleanup if it causes agents to skip `spec-interview` or treat the consolidated prototype as the production spec.

## Canonical Decision Rules

- Start with `concept-exploration` for raw ideas.
- Install narrow packs, not broad aliases, unless compatibility or context loading makes the alias desirable.
- For business products, run ICP and competitive analysis before journey mapping; run journey mapping before UX/UI and prototype work.
- Treat optional value, positioning, growth, monetization, and ops work as evidence lanes selected by risk and product type.
- Do not move non-trivial user-facing product work from idea directly to production spec or roadmap.
- Build and evaluate prototypes before production spec creation.
- Use `feature-interview` for unresolved ideas, post-spec additions, and destination triage.
- Use `spec-interview` for confirmed full production spec work after upstream evidence and prototype gates are satisfied.
- Use `roadmap` to sequence specs into phases; use `plan-phase` to produce one active execution contract.
- Keep run/ship loops operational and alignment-page-free.
- Commit and push intended repository mutations unless the user explicitly says not to, while preserving unrelated dirty work.

## Current End-To-End Sequence

```text
concept-exploration
  -> pack recommend/install
  -> business-discovery: icp -> competitive-analysis
  -> customer-lifecycle: journey-map
  -> optional business-discovery/growth/ops evidence lanes
  -> ux-variations
  -> ui-interview
  -> prototype
  -> uat --variant-evaluation
  -> consolidate-variations
  -> research-roadmap --post-prototype
  -> spec-interview
  -> research-roadmap --post-spec
  -> roadmap
  -> plan-phase
  -> run or delegate
  -> ship
  -> ship-end
```

For existing specs with smaller additions:

```text
feature-interview
  -> update existing spec or create add-on spec
  -> research-roadmap --post-spec when research may be stale
  -> roadmap extension
  -> plan-phase
  -> run / ship
```

For completed implementation queues with no active documentation issue:

```text
research-roadmap
  -> first unchecked documentation item, if any
  -> brainstorm when documentation is current and no concrete idea is selected
```

## Confidence And Open Questions

Confidence is high that this report reflects the current stated contracts because the same routing appears in `roadmap`, `research-roadmap`, `prototype`, `uat`, `consolidate-variations`, `spec-interview`, `feature-interview`, pack docs, and recent lessons.

Open questions:

- Whether `consolidate-variations` should explicitly write a Markdown UI spec in addition to the consolidated prototype and interview log.
- Whether docs should standardize the exact optional order among `value-prop-canvas`, `positioning`, `lean-canvas`, `metrics`, `monetization`, `gtm`, and `growth-model` by product type.
- Whether `business-app` compatibility alias language should be further reduced in user-facing docs to prevent broad-pack defaulting.
