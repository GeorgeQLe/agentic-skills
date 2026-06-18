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

## Intra-Skill Substep Chunking + Shared Context Brief

The phase chunking above is *cross-skill*: each prototype-phase skill runs in its own fresh session. This section adds a **second, optional chunking level** *inside* a single skill, for the case where one skill's heavy phase itself produces **N countable per-unit work products** and holding all N in one context is the dominant per-session cost (e.g. `ux-variations` authoring five full build-grade variation specs in one session). When that is the bottleneck, split the heavy phase into a setup session, one spec session per unit, and a final assemble+approve session — each carrying only a small shared brief plus the one unit it works on.

**When it applies.** Use intra-skill chunking only when a skill's heavy phase fans out into N independent, fully-specified per-unit artifacts and N is large enough that one-context authoring degrades quality. For small N, **fold** — run the heavy phase straight through in one session as before. Do not spend a fresh-context round-trip on a near-empty session (same near-empty-session judgment as `docs/research-session-loop-convention.md:44`). A skill that adopts this mechanism states its own fold threshold (e.g. auto-chunk at N ≥ 4 with a `--no-chunk` override).

### Three-tier state

Like the research loop's State store, the machine path deliberately stays minimal and HTML stays out of it. Intra-skill chunking adds two `_working`-band tiers *below* the committed manifest:

| Tier | Store | Content | Role |
|---|---|---|---|
| Machine cursor | Flow-tree manifest (`design/**/flow-tree-*.yaml`) | Committed, **post-approval** branch state only — unchanged by this mechanism | Authoritative branch/decision state |
| Shared context brief *(new)* | `design/{slug}/_working/{skill}-{topic}-brief.md` | **Pure context, no step list**: confirmed assumptions, locked shared constraints, the N per-unit theses, evaluation criteria, carried decisions | Lets each fresh spec session reconstruct the whole decision surface from one small file |
| Per-substep intermediates *(new)* | `design/{slug}/{skill}-{topic}/{unit-id}.md` | One full per-unit spec each | **Their existence IS the cursor** — the next substep is the first unit whose intermediate file does not yet exist |

Progress is read from the filesystem exactly as the research loop reads canonical-intermediate existence (`docs/research-session-loop-convention.md:100`): `pending = planned-units − existing-intermediates`. The brief carries **no step list and no status field** — it is pure context, never a rival ledger.

### Per-session shape

```
setup session       run the light phases together → write the brief (pure context)
                    → init the manifest entries at their pre-approval status → STOP
   → spec sessions  read brief + scan which {unit-id}.md intermediates exist
   (one per unit)   → author the one missing unit's full spec to its intermediate path
                    → append any cross-unit facts to the brief
                    → STOP / re-invoke (see Terminal handoff format)
      → assemble+approve session   when all intermediates exist: assemble the canonical
                                   artifact → ONE alignment-page review → confirmed gate
                                   → on approval flip manifest statuses + archive brief
                                     and intermediates
```

The setup session runs the cheap upfront phases (scope, assumptions, interview, concept set) together and stops the moment it has written the brief — those phases are individually light, so they fold into one head session rather than each taking a round-trip. Each spec session resolves its work purely from filesystem state (brief present + which intermediates exist), authors exactly one unit, and stops. The assemble+approve session is the only session that touches the alignment-page lifecycle.

### Terminal handoff format

Every chunked stop — the setup session and every spec session — must end its terminal message with a handoff that lets the user continue without knowing the skill's internal unit IDs. A bare `→ STOP / re-invoke continue with {unit-id}` is **not** a compliant handoff: an internal ID like `action-state-matrices` is meaningless to the user on its own. Each stop ends with, in this order:

1. **What was just written** — the intermediate path written this session (the brief for the setup session, or the one `{unit-id}.md` for a spec session).
2. **Next missing unit, in plain English** — name the next pending unit and describe what it is, never only the internal `{unit-id}`. Example: "Next section: **action–state matrices** — the per-screen matrix of actions, navigation, validation, and visual state for every screen in the inventory," not "continue with `action-state-matrices`." Derive pending from the filesystem (`planned-units − existing-intermediates`), exactly as the per-session shape resolves the cursor.
3. **Exact next-invocation command** — the concrete command to run, with `{slug}`/`{topic}`/product-path resolved to literal values, not placeholders. Example: `/user-flow-map alignment-page-review` (claude) or `$user-flow-map alignment-page-review` (codex), pointing at the resolved intermediate directory `design/alignmeant/user-flow-map-alignment-page-review/`.
4. **Last unit → assemble+approve** — when the unit just written was the final pending unit (no intermediates remain unwritten), the handoff must instead point to the assemble+approve session (the single alignment-page review), not another spec session, and give that session's exact command.

The handoff's continue-vs-stop framing reuses the **Routing Rules** section above rather than restating it: when the stop happens in a session that still carries build context, offer the stop/clear-context-versus-continue choice; when the stop is already a fresh cold session, default to continue-now and simply state the exact next command. Do not duplicate the Routing Rules text — reference it.

### Approval: exactly one final gate

There is **exactly one** binding alignment-page gate, in the assemble+approve session. The per-substep spec sessions are pre-approval `_working/`-band drafting — they write intermediates, not canonical artifacts, so no checkpoint inside them authorizes a canonical write (consistent with Approval Rules above: "checkpoint confirmations are not final approval"). The single end-of-loop `review → confirmed` gate approves the whole assembled set at once, preserving whole-set comparison UX. Adopting this mechanism therefore adds **no new alignment gate** and requires **no `ALIGNMENT-PAGE.md` or generator change** — the existing single page is unchanged.

### No schema change, no `tasks/todo.md`

The cursor is filesystem existence, so this mechanism needs **no `design/flow-tree.schema.json` change** and the manifest entries keep their existing status enum (initialized at their normal pre-approval status in the setup session, flipped on final approval). Reaffirming Routing Rule below: prototype-phase branch progress never routes through `/exec`, `$exec`, `tasks/roadmap.md`, or `tasks/todo.md`. The shared context brief is the **sanctioned substitute** for a per-substep working store — it is pure context, not a step ledger, and it lives in `_working/`, never in the task surfaces.

### Archive timing

The brief and the per-substep intermediates are `_working/`-band sources. Archive them at **canonical write** — when the assembled canonical artifact is committed on final approval — mirroring the research loop's archive-at-synthesis rule (`docs/research-session-loop-convention.md:122`). A rejected final page must still be able to rebuild from the brief + intermediates, so they survive until the canonical artifact exists.

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
