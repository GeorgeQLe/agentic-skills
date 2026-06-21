# Design Tree Loop Convention

> Authority for the **design-phase** product-design and product-testing skills.
> Companion to `docs/interview-convention.md`, `docs/interrogation-page-convention.md`,
> `docs/alignment-page-convention.md`, `docs/alignment-yaml-routing-contract.md`,
> `docs/orchestrator-convention.md`, and `docs/skill-next-step-contracts.md`.
>
> This document **supersedes** `docs/prototype-session-loop-convention.md` (now a thin
> redirect) and absorbs its intra-skill substep mechanics. It does **not** touch
> `docs/research-session-loop-convention.md` — business-research Pattern A orchestrators
> stay on the Research Session Loop and are out of scope here.

## Why this exists

The design-phase skills — `user-flow-map`, `state-model`, `ux-variations`, `ui-interview`,
`prototype`, `consolidate-variations`, `spec-interview`, and their subskills
`design-inspirations` and `uat` — were previously split across three loop conventions
(Pattern A research substeps, the prototype session loop, and the implementation exec loop).
They share one job: **grow a design tree from a product concept to a runnable, validated,
spec-ready MVP**, branching through user flows, per-flow domain models, UX variations, UI
experiments, runnable prototypes, consolidation, and specification.

This convention unifies them into **one tree-growing pattern**. Every pipeline skill runs the
**same 5-stage session flow within its own scope** and grows a shared **design tree**.
Research and implementation — formerly split — become two stages of one flow.

The state lives with the design artifacts, never in `tasks/todo.md`:

- `design/**/flow-tree-*.yaml` — the design-tree manifest (branch + decision + model-attachment state).
- `design/**/model-tree-*-{branch}.yaml` — the per-user-flow-branch domain/state/logic model.
- `design/**/*.md` — canonical per-node design artifacts (user-flow doc, UX variation specs, UI experiment packets, build-plan slices).
- `prototypes/{topic}/` — runnable prototype output (owned by `prototype` / `consolidate-variations`).
- `research/**/uat-*.md` — UAT plans and human evidence logs.
- `tasks/manual-todo.md` — human-only UAT / prototype evaluation tasks an agent must not mark complete.

`tasks/roadmap.md` and `tasks/todo.md` remain **implementation-execution** surfaces. Do not
use them for design-tree branch progress.

---

## 0. The Meta-Pattern: Two Phase-Loops, One Shape

The design-tree loop and the **Research Session Loop** (`docs/research-session-loop-convention.md`)
are two instances of **one meta-pattern**. Every self-advancing skill in either loop runs a
fixed sequence of heavy phases, one per cold session, bookended by cheap YAML-in / gate-out:

```
interrogation → research → ⟨transform⟩ → ⟨gate⟩ → implement
```

The universal stages are **interrogation**, **research**, and **implement**; the two middle
stages vary by phase. The two concrete instances:

| Phase loop | Stage sequence | `⟨transform⟩` | `⟨gate⟩` | `implement` deliverable |
|---|---|---|---|---|
| **Design / prototype** *(this doc)* | interrogation → research → **design** → **plan** → implement(scoped) | author the scoped design (flow, model, UX, UI, consolidation) | the build-plan slice the implement stage/`prototype` realizes | scoped canonical artifact + tree growth; **runnable** for `prototype` / `consolidate-variations` |
| **Research** *(Pattern A — `docs/research-session-loop-convention.md`, normative there; referenced here, not redefined)* | interrogation → research → **plan** → **review** → implement(docs) | run the selected frameworks | framework multi-select = the plan; each framework's + synthesis alignment page = review | canonical research doc (`research/{orchestrator}.md`) |

**Does the research mapping match reality?** Yes — it is the Research Session Loop's session
ladder relabelled: state G = interrogation, states F+C = research (deep interview + run each
framework), state E = plan (framework multi-select), the per-framework + synthesis alignment
pages = review, state A = implement(docs). The one nuance: in the research loop **review fires
per framework and again at synthesis** (interleaved with research), not as a single terminal
review. The design loop's gate is instead **one binding alignment gate per skill-run-on-a-branch**
(§4). Both keep the same outer shape: interrogation and research up front, implement at the end,
two domain-specific middle stages.

This document is **normative only for the design/prototype phase loop**. The research phase loop
stays owned by `docs/research-session-loop-convention.md`; the table above cross-references it so
the shared meta-pattern is visible, but does not restate or override it.

## 0a. Communication Surfaces (what talks to the user, and how)

The primary structured user↔agent channel is **HTML pages**, but with deliberately scoped roles
— HTML is *not* a blanket "everything goes on a page," and it is explicitly *not* the machine
state store (`docs/research-session-loop-convention.md` "Why not the HTML alignment page as the
store").

| Surface | Owns | Lifecycle |
|---|---|---|
| **Interrogation page** (`interrogation/{skill}-r{N}-{branch}.html`) | Stage-0 elicitation — one looping HTML round per turn until the confidence gate passes. The primary surface for stage-0 alignment. | `docs/interrogation-page-convention.md`; `data-open-input` per round; coverage checkpoint exits the loop |
| **Alignment page** (`alignment/{name}-{topic}.html`) | The **binding approval gate** — the single stage-4 whole-unit review per skill-run-on-a-branch. The primary surface where the user approves/rejects/modifies a scoped deliverable. | `docs/alignment-page-convention.md`; `review → confirmed → amended`; compiled Response YAML authorizes canonical writes |
| **Terminal text** | **Interviewing** (`docs/interview-convention.md` — all interviewing happens in the terminal *before* the alignment page), **confirmation manifests/checklists** (render inline as turn-final message text per the Manifest Visibility Rule), self-routing handoffs (`## Next Work` / `## Invoke With YAML`). | turn-final message |
| **Manifests** (`design/**/*.yaml`, `_working/` briefs) | Machine state + pure-context briefs. Never HTML. | filesystem; never a rival page |

So: **HTML alignment + interrogation pages are the primary surface for binding gates and
stage-0 elicitation; the terminal owns interviewing, inline confirmation manifests, and
handoffs; YAML/markdown manifests own machine state.** A skill never pushes branch progress or
machine state onto an HTML page, and never moves interviewing onto a page.

---

## 1. The Design Tree

The design tree is the single source of truth for design-phase progress. Its **cursor is
filesystem existence** of canonical per-node artifacts plus the flow-tree manifest — there is
no `tasks/todo.md` ledger for branch progress.

### Node types

```
root (one per topic)
└── user-flow branch            ← user-flow-map grows these (one per flow)
    ├── model attachment        ← state-model attaches one per user-flow branch (model_ref)
    └── ux-variation branch     ← ux-variations grows up to 5 per modelled flow
        └── ui-experiment branch ← ui-interview grows these per UX variation
            └── prototype        ← prototype builds a narrow-scope runnable artifact per UI branch
```

| Node | Manifest location | Grown by | Canonical artifact |
|---|---|---|---|
| **root** | flow-tree manifest itself | `user-flow-map` | `design/**/flow-tree-{topic}.yaml` + `design/user-flow-{topic}.md` |
| **user-flow branch** | `branches[]` | `user-flow-map` | flow doc section; `model_ref` filled by `state-model` |
| **model attachment** | `branches[].model_ref` → `model-tree-{topic}-{branch}.yaml` | `state-model` | per-branch model-tree manifest + canonical model doc |
| **ux-variation branch** | `branches[].ux_variations[]` | `ux-variations` | `design/ux-variations-{topic}.md` |
| **ui-experiment branch** | `branches[].ux_variations[].ui_experiments[]` | `ui-interview` | `design/ui-{topic}.md`, `design/ui-requirements-{topic}.md` |
| **prototype** | `prototype_build_plan.items[]` | `prototype` | `prototypes/{topic}/variation-{N}/` |
| **consolidated MVP** | manifest status `consolidated` | `consolidate-variations` | `prototypes/{topic}/consolidated/` |
| **spec** | downstream of MVP approval | `spec-interview` | `specs/{topic}.md` |

### Per-user-flow-branch model attachment

The domain/state/logic model is a property of the **flow**, not of any UI presentation — UX
variations re-skin the same entities, actions, and states. So `state-model` attaches **one
model per user-flow branch** via `branches[].model_ref` (a repo-relative path to that branch's
`design/**/model-tree-{topic}-{branch}.yaml`). This per-branch `model_ref` is the **primary**
linkage. The legacy top-level `model_tree_ref` is retained as **optional back-compat only**
(single-model repos predating per-branch attachment); new work uses `model_ref`.

`ux-variations` will not grow UX branches on a user-flow branch until that branch's model is
attached and confirmed.

### Validation layer (`prototype`) and feedback loops

`prototype` owns the literal runnable prototype. Each prototype is built narrow-scope so a
human can **validate / approve / reject / modify-back** it. Validation decisions are recorded
as `decisions[]` in the manifest and **can flow back up the tree**: a `modify` decision names
`targets[]` — the upstream node(s) (a `state-model` model attachment or a `user-flow` branch)
to **re-open** — returning that node to a pending status so the owning skill re-runs its
5-stage flow on it. See §4.

### Consolidation and spec

`consolidate-variations` converges the validated tree into a cohesive **MVP** at
`prototypes/{topic}/consolidated/`. On MVP approval, `spec-interview` formalizes it into a
**production-ready v1** specification at `specs/{topic}.md`.

---

## 2. The Universal 5-Stage Per-Skill Session Flow

Every **pipeline** skill (and the orchestrator) runs the **design/prototype instance** of the
§0 meta-pattern — the five stages **interrogation → research → design → plan → implement(scoped)**
— scoped to whatever the skill owns. The stage names are normative: a skill's process section
labels its phases with these five words so the shared shape is legible across skills. Each stage
is a **heavy phase that runs and stops**; the skill **self-re-invokes one heavy phase per
session** (cold start → resolve state from filesystem → run one phase → stop), exactly as the
research loop does. Light adjacent stages may **fold** into one session when each is individually
cheap (same near-empty-session judgment as `docs/research-session-loop-convention.md`).

| Stage | Name | What it does | Heavy? |
|---|---|---|---|
| **0** | **Interrogation** | The stage-zero user↔agent alignment loop (`INTERROGATION-PAGE.md`): build one HTML round page per turn at `interrogation/{skill}-r{N}-{branch}.html`, loop until the **confidence gate** passes. Cannot advance until every interview area is covered or waived. | usually folds with stage 1 setup |
| **1** | **Research** | Gather what the skill needs that is not derivable from the repo — references (`design-inspirations`), prior art, domain evidence, framework selection. Run **as needed**; skip when the repo already carries the context. | as needed |
| **2** | **Design** | Author the scoped design — the per-node `_working` drafts: flow structure, the domain model, the UX variations, the UI experiment, the consolidation choices. | yes |
| **3** | **Plan-to-implement** | Produce the **build-plan slice** the implement stage (or downstream `prototype`) will realize: ordered, scoped, with acceptance criteria. | folds with stage 2 for small scope |
| **4** | **Implement (scoped)** | Produce the skill's scope-appropriate deliverable (see below), grow the tree's child nodes, and pass the **single binding alignment gate** (§4) before any canonical write. | yes |

### The "implement (scoped)" deliverable per skill

**The literal runnable prototype is owned by `prototype`.** For the upstream design skills,
"implement" means the **scoped canonical design artifact + tree-branch growth + the build-plan
slice `prototype` will later realize** — not runnable code.

| Skill | Stage-4 "implement" deliverable |
|---|---|
| `user-flow-map` | Flow doc + flow-tree root + one user-flow branch per flow + the prototype build-plan scaffold |
| `state-model` | Per-branch `model-tree` manifest + canonical model doc, attached via `branches[].model_ref` |
| `ux-variations` | UX variation specs + up to 5 `ux_variation` child branches on the modelled flow |
| `ui-interview` | UI experiment packet(s) + `ui_experiment` child branches under the UX variation |
| `prototype` | **Runnable** narrow-scope prototype under `prototypes/{topic}/variation-{N}/` + build-plan + decision |
| `consolidate-variations` | **Runnable** consolidated MVP under `prototypes/{topic}/consolidated/` |
| `spec-interview` | Production-ready specification under `specs/{topic}.md` |

### Intra-skill substep chunking (absorbed from the prototype loop)

When a skill's stage-2/4 heavy phase fans out into **N independent fully-specified per-unit
artifacts** (e.g. `ux-variations` authoring five build-grade variation specs, or `state-model`
running one framework per session), split it into a setup session, one spec session per unit,
and a final assemble+approve session — each carrying only a small **shared context brief**
(`design/{slug}/_working/{skill}-{topic}-brief.md`, pure context, **no step list, no status
field**) plus the one unit it works on. The cursor is filesystem existence of the per-unit
intermediates (`design/{slug}/{skill}-{topic}/{unit-id}.md`): `pending = planned-units −
existing-intermediates`. Fold for small N — do not spend a fresh-context round-trip on a
near-empty session. Archive the brief and intermediates at canonical write (final approval), so
a rejected final page can still rebuild. This adds **no schema change** and **no new alignment
gate**.

---

## 3. Orchestrator vs. Pipeline vs. Subskill

| Role | Skills | Contract |
|---|---|---|
| **Root orchestrator** | `user-flow-map` | Creates the design-tree root and the `flow-tree-{topic}.yaml` manifest; grows one user-flow branch per flow. Owns the build-plan scaffold (`--prototype-build-plan`). `invocation: orchestrator`. |
| **Pipeline** | `state-model`, `ux-variations`, `ui-interview`, `prototype`, `consolidate-variations`, `spec-interview` | Resolves the **next pending branch** from the tree, runs its 5-stage flow on that branch, grows the branch's children, and **stops**. One branch per heavy session. |
| **Subskill** | `design-inspirations` (parent: `ui-interview`), `uat` (parents: `prototype`, `consolidate-variations`, exec-loop) | Invoked **inline by a parent**; enters at its own research/checklist stage; does **no downstream routing** — it returns control to the parent, which owns the handoff. |

### Per-branch iteration contract (pipeline skills)

Each pipeline-skill session:

1. **Cold start** — read the flow-tree manifest (and, where relevant, the per-branch
   `model_ref` and parent artifacts).
2. **Resolve next pending branch** — the first branch whose status indicates this skill's work
   is due (e.g. `state-model` picks the first user-flow branch with no confirmed `model_ref`;
   `ux-variations` picks the first modelled branch with no `ux_variations`; `ui-interview` the
   first UX variation with no `ui_experiments`; `prototype` the first `pending` /
   `needs-revision` build item; etc.). Honor any explicit branch argument the user passed.
3. **Run the 5-stage flow** scoped to that branch (folding light stages).
4. **Grow children** — write the scoped canonical artifact and the child nodes on final
   approval.
5. **Stop** and emit the self-routing handoff (§5).

A skill that finds **no pending branch** for its role reports the tree is current for its
stage and routes to the next skill in the route.

---

## 4. Approval Gates and the Modify-Back Path

### One binding gate per skill-run-on-a-branch

There is **exactly one** binding alignment gate per skill-run on a branch (the stage-4
assemble+approve gate), preserving **whole-unit review** — the user approves the whole scoped
deliverable (all 5 UX variations, the whole model, the whole UI packet) at once. Stage-0/1/2/3
checkpoints are **confirmations, not approvals**: they confirm a draft is ready for the next
step but never authorize a canonical write. `_working/`-band drafts and per-unit intermediates
are pre-approval; canonical artifacts and child-node growth happen only after the single gate
passes (final compiled alignment YAML for staged-page skills; explicit in-artifact transition
+ manifest update for inline-confirmation skills).

### The modify-back decision path

Validation decisions live in `decisions[]`. The enum is **`approve | reject | retry | modify`**:

- **`approve`** — the node is validated; advance.
- **`reject`** — the node is abandoned; prune that branch.
- **`retry`** — re-run the **same** node's flow (no upstream change).
- **`modify`** *(new)* — re-open an **upstream** node. A `modify` decision **requires
  `targets[]`**, each pointing at the upstream node to re-open (a `state-model` model
  attachment or a `user-flow` branch). Recording a `modify` returns each target to a pending
  status, so the owning skill re-runs its 5-stage flow on it; descendant branches below the
  re-opened node are marked stale for re-validation. This is how validation **flows back up**
  the tree.

---

## 5. Self-Routing Handoff Format

Every stop ends with the standard self-routing handoff so the user (or a continuation agent)
can advance without knowing internal IDs. Reuse the existing payload shape:

- **`## Next Work`** — what was just written (canonical artifact / intermediate path), the next
  pending branch **in plain English** (name it and describe it — never only an internal
  `{branch-id}`), and whether to continue-now or clear-context-first.
- **`## Invoke With YAML`** — the `agent_routing` payload: the exact resolved next-invocation
  command with `{slug}` / `{topic}` / branch filled to literal values (claude `/skill …`,
  codex `$skill …`).

Continue-vs-stop framing follows the routing rules: when the stop carries heavy build context,
offer stop/clear-context-versus-continue; when already cold, default to continue-now with the
exact next command. Subskills (`design-inspirations`, `uat`) emit a **parent-owned** handoff
only — they hand results back to the invoking parent and do **not** route downstream.

---

## 6. Routing Rules

- Route downstream only after the upstream skill has written **approved/canonical** artifacts.
- Prefer **fresh context** for heavy branch work: new user-flow branch, per-branch model,
  multiple UX variants, full UI experiment, prototype build, consolidation, spec.
- Allow **continue-now** only for small adjacent work and only when the next skill still runs
  its own interrogation, design, approval, or evidence gates.
- `ux-variations` requires the branch's `model_ref` confirmed; do not grow UX branches first.
- Do not route to `prototype` before the build-plan slice exists unless the user explicitly
  accepts an untracked ad hoc prototype run.
- Do not route from built variants directly to `consolidate-variations`; route through
  `uat` (variant evaluation) unless the user explicitly says they already evaluated and are
  ready to converge.
- Do not route design-tree branch progress through `/exec`, `$exec`, `tasks/roadmap.md`, or
  `tasks/todo.md`.
- The top-level `route` tuple stays the **6-skill sequence** (`user-flow-map → ux-variations →
  ui-interview → prototype → consolidate-variations → spec-interview`). `state-model` is a
  **per-branch attachment** (`model_ref`), not a route position — keeping the route stable
  while the model rides each branch.

---

## 7. Task Rules

- Human prototype review, UAT execution, screenshot/recording capture, and subjective
  evaluation go in `tasks/manual-todo.md`. Never in `tasks/todo.md`.
- Implementation/documentation fixes may enter `tasks/todo.md` only after human evidence exists
  and a fix has been explicitly promoted into execution work.
- One-time non-journey evidence capture may use `tasks/record-todo.md`; recurring acceptance
  checks `tasks/recurring-todo.md` only with a real release cadence.

---

## 8. Artifact Rules

- Pre-prototype flow maps, model trees, UX variation plans, UI experiment packets, UI
  requirements packets, branch decisions, mockup references, flow-tree manifests, and build
  plans live in `design/`.
- Runnable prototype output lives in `prototypes/`.
- UAT plans and result logs live in `research/`.
- Finalized production specifications live in `specs/`.
- `research/.progress.yaml` remains product-path/product-line tracking only — never ordinary
  UX/UI/build branch progress.

---

## 9. Migration Note

- `docs/prototype-session-loop-convention.md` is now a **thin redirect** to this document. Its
  intra-skill substep + shared-context-brief mechanics are absorbed into §2.
- Per-skill bundles move from `PROTOTYPE-SESSION-LOOP.md` to **`DESIGN-TREE-LOOP.md`**, generated
  by `scripts/upgrade-design-tree-loop.mjs` (mirroring the retired
  `scripts/upgrade-prototype-session-loop.mjs`).
- `docs/research-session-loop-convention.md` (business-research Pattern A) is **unchanged** and
  out of scope.
