# Prototype Session Loop Convention

> Companion to `docs/research-session-loop-convention.md`, `docs/alignment-page-convention.md`, `docs/alignment-yaml-routing-contract.md`, and `docs/interview-convention.md`.
> This document defines how prototype-phase product-design and product-testing skills chunk user-flow, UX variation, UI review, prototype build, UAT, and consolidation work without using Pattern A selected-framework manifests or the implementation exec loop for branch progress.

## Why this exists

Prototype-phase product-design work is exploratory but not framework research. It branches through user flows, UX progression alternatives, UI review decisions, prototype build items, human UAT evidence, and consolidation choices. Those branches need durable state, but they should not be tracked as implementation steps in `tasks/todo.md`.

The state lives with the design artifacts:

- `design/**/flow-tree-*.yaml` stores branch and decision state.
- `design/**/prototype-build-plan-*.md` stores the prototype build ledger.
- `research/**/uat-variant-evaluation-*.md` stores human evaluation plans and result logs.
- `prototypes/{topic}/` stores runnable prototype output.
- `tasks/manual-todo.md` stores human-only UAT and prototype evaluation tasks.

`tasks/roadmap.md` and `tasks/todo.md` remain implementation-execution surfaces. Do not use them for design/prototype branch progress.

## Scope

This convention applies to prototype-phase skills such as:

- `user-flow-map`
- `ux-variations`
- `ui-interview`
- `prototype`
- `uat --variant-evaluation`
- `consolidate-variations`

It complements, but does not replace, `docs/research-session-loop-convention.md`. Prototype-phase skills do not use Pattern A selected-framework run manifests. Their machine state is the flow-tree manifest plus canonical artifact existence and UAT evidence.

## State Stores

| Store | Purpose | Typical Paths |
|---|---|---|
| Flow-tree manifest | Machine-readable branch state for user flows, UX variations, UI reviews, decisions, build-plan references, and consolidation status | `design/flow-tree-{topic}.yaml`, `design/{slug}/flow-tree-{topic}.yaml` |
| Prototype build plan | Authoritative build ledger for prototype items and statuses | `design/prototype-build-plan-{topic}.md`, `design/{slug}/prototype-build-plan-{topic}.md` |
| UAT evidence | Human evaluation plan, result logs, comparison matrix, and readiness checklist | `research/uat-variant-evaluation-{topic}.md`, `research/{slug}/uat-variant-evaluation-{topic}.md` |
| Prototype output | Disposable runnable prototype files and consolidated prototype | `prototypes/{topic}/variation-{N}/`, `prototypes/{topic}/consolidated/` |
| Human queue | Manual prototype/UAT tasks that an agent must not mark complete | `tasks/manual-todo.md` |

`research/.progress.yaml` remains product-path/product-line tracking only. Do not store ordinary UX branch, UI review, prototype build, or consolidation progress there.

## Session Phases

Prototype work usually advances through these phases:

1. **Flow map**: `user-flow-map` writes `design/user-flow-*` and initializes or updates `design/**/flow-tree-*.yaml`.
2. **UX variation**: `ux-variations` expands a selected user-flow branch and records variation branches in the flow tree.
3. **UI review**: `ui-interview` reviews one UX variation branch, produces a UI branch packet, and records approve/reject/retry decisions in the flow tree after its approval lifecycle allows canonical writes.
4. **Build-plan synthesis**: `user-flow-map --prototype-build-plan` reads approved UI branch decisions and writes `design/prototype-build-plan-*`.
5. **Prototype build**: `prototype` builds only ledger items that are `pending` or `needs-revision`, then updates the build plan and flow tree.
6. **UAT evaluation**: `uat --variant-evaluation` writes the human evaluation plan and queues manual tasks in `tasks/manual-todo.md`.
7. **Consolidation**: `consolidate-variations` uses UAT evidence plus explicit user consolidation choices before writing `prototypes/{topic}/consolidated/`.

Each phase may run in a fresh context when the branch is heavy. Small adjacent work may continue in the same session when the next skill still runs its own gates and the user explicitly chooses to continue.

## Routing Rules

- Route downstream only after the upstream skill has written approved or canonical artifacts.
- Prefer fresh context for heavy branch work: new user-flow branches, multiple UX variants, full UI review, prototype build, UAT evaluation, or consolidation.
- Allow continue-now only for small adjacent work and only when the next skill still executes its own assumptions, interview, approval, or evidence gates.
- Do not route to `prototype` before `design/prototype-build-plan-*` exists unless the user explicitly accepts an untracked ad hoc prototype run.
- Do not route from built variants directly to `consolidate-variations`; route through `uat --variant-evaluation` unless the user explicitly says they already evaluated the variants and is ready to converge.
- Do not route prototype-phase branch progress through `/exec`, `$exec`, `tasks/roadmap.md`, or `tasks/todo.md`.

## Approval Rules

Checkpoint confirmations are not final approval. A checkpoint can confirm that a draft is ready for the next review step, but it does not by itself authorize canonical writes for skills that use an alignment-page lifecycle.

For skills that already use staged approval pages, final compiled alignment YAML controls canonical writes. Feedback-only YAML keeps the work pre-approval. Downstream routing appears only after approved canonical artifacts are written.

For skills that write canonical artifacts after inline confirmation rather than a pre-approval lifecycle, the skill must still make the state transition explicit in the artifact and update the flow-tree manifest with source references.

## Task Rules

- Human prototype review, UAT execution, screenshot capture, recording capture, and subjective evaluation tasks go in `tasks/manual-todo.md`.
- Do not put human-run prototype/UAT evaluation tasks in `tasks/todo.md`.
- Implementation or documentation fixes may go in `tasks/todo.md` only after human evidence exists and a fix has been explicitly promoted into current execution work.
- One-time evidence capture that is not a human journey can use `tasks/record-todo.md`.
- Recurring acceptance checks can use `tasks/recurring-todo.md` only when there is a real release cadence.

## Artifact Rules

- Pre-prototype flow maps, UX variation plans, UI branch packets, UI requirements packets, branch decisions, mockup references, flow-tree manifests, and prototype build plans live in `design/`.
- Runnable prototype output lives in `prototypes/`.
- UAT plans and result logs live in `research/`.
- Finalized post-prototype implementation specifications live in `specs/`.
- Legacy `specs/ux-variations-*`, `specs/ui-requirements-*`, or `specs/ui-layout-variations-*` files may be read as fallback evidence during migration, but new prototype-phase branch artifacts should be read from and written to `design/`.
