---
name: spec-interview
description: Post-prototype production deep dive — walks through consolidated prototype screen by screen to extract production specifications
type: planning
version: v0.16
required_conventions: [alignment-page, design-tree-loop, interrogation-page]
argument-hint: "[--ideas]"
context_intake: deep
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `npx skillpacks install <pack>` from the project shell, instead of the target skill. Only the currently running skill and skills verified available in the active session or project-local install state are directly recommendable. For unavailable pack skills, recommend `npx skillpacks install <pack-or-skill>`; for unavailable base skills, recommend `npx skillpacks init` before the skill.

## Prototype Gate

Before starting the interview process, verify:

1. A consolidated prototype exists at `prototypes/{topic}/consolidated/`. If missing, halt and recommend `$consolidate-prototypes` first.
2. All blocking research tasks from the `--post-prototype` pass are completed — check `tasks/todo.md` for unchecked items under `## Priority Documentation Todo` that reference post-prototype research, contradicted research, stale research, or pre-spec blockers. If unchecked blocking post-prototype items remain, halt and recommend completing those first.

If both gates pass, proceed with the interview.

# Spec Interview

Invoke as `$spec-interview`.

Use this skill when the user has a consolidated prototype and research context that needs to be turned into a complete production implementation specification. For half-formed product ideas, run `$idea-scope-brief` before this skill.

## Design-Tree Flow

This skill runs the unified **5-stage design-tree flow** (`interrogation → research → design → plan → implement(scoped)`) from `DESIGN-TREE-LOOP.md` as the tree's **terminal spec writer**, formalizing the approved MVP into a production-ready v1 specification. The `## Process` steps below group by stage:

- **Stage 0 — Interrogation**: the `## Prototype Gate` plus the stage-zero loop in `## Interrogation Page` / `INTERROGATION-PAGE.md` and the prototype-grounded assumptions checkpoint — confirm the consolidated prototype, research frame, and that no unchecked blocking post-prototype items remain.
- **Stage 1 — Research**: read the consolidated prototype, research context, and `design/**/flow-tree-*.yaml` as upstream evidence.
- **Stage 2 — Design**: walk each screen/page to extract production behaviors, data, contracts, and acceptance criteria.
- **Stage 3 — Plan**: the screen-by-screen spec outline is the slice the implementation phase realizes.
- **Stage 4 — Implement (scoped)**: write the production specification, keeping `specs/` as the canonical output directory, behind the single binding alignment gate. This same confirmed alignment record owns the Production Ready Approval: approval to move from concept/prototype/spec into a production product build, not proof that the product is already shipped.

**Per-branch iteration contract.** Each session cold-starts, reads the approved tree, resolves the consolidated MVP ready to specify, runs the staged flow, writes the spec on approval, and stops with the handoff in `## Next Work`.

**Modify-back.** If specification reveals an unresolved design flaw, record a `modify` decision whose `targets[]` re-opens the upstream `model_ref` or user-flow branch rather than encoding the gap into the spec.

## Process

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as the product/app name, not the ICP, audience, or segment label.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived` or legacy `status: abandoned`, stop and warn that the path is archived; do not write or update scoped outputs there.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths` on read and write back `active_paths` on manifest updates. Treat legacy `abandoned` as `archived`; exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`, and any `scope_path` under `research/_archive/` from active target selection.
4. If active product paths exist in the manifest, use those paths. If multiple active paths exist, ask which one to target unless this skill explicitly supports cross-path output.
5. If no active manifest target exists, list non-archived product directories under `research/`, excluding `research/_archive/` and dot directories. Auto-select only when exactly one exists; ask when multiple exist.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint. Suggest creating a missing `research/{slug}/` product path when code clearly exposes an app, but do not require code or monorepo detection before using `research/{slug}/`.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`, and treat top-level `research/*.md` files as flat-mode documents or cross-path summaries.

1. **Read consolidated prototype and research context:**
   - Read the consolidated prototype directory at `prototypes/{topic}/consolidated/` as the primary input. Walk through every screen, component, and interaction in the prototype to understand the current state.
   - Read the consolidation interview log and `alignment/consolidate-prototypes-{topic}.html` when present. Treat final MVP decisions, rejected alternatives, UAT evidence, unresolved risks, and stale-research cleanup notes as upstream evidence, not as a separate production-readiness state store.
   - Check `.agents/project.json` first. If it exists, use `project_type` and `enabled_packs` to choose the right research frame:
     - `business-app` → use business research artifacts such as `research/icp.md`.
     - `game` → use game artifacts such as `research/game-audience.md`, `research/game-fantasy.md`, and `research/game-core-loop.md`.
     - `devtool` → use devtool artifacts such as `research/devtool-user-map.md`, `research/devtool-dx-journey.md`, and `research/devtool-integration-map.md`.
   - If project type is missing or mismatched, recommend `$pack recommend`, `npx skillpacks install <pack>` from the project shell before doing domain-specific planning.
   - For business-app projects, check if `research/idea-brief.md`, `research/icp.md`, and `research/journey-map.md` exist. Read them as source evidence — ground implementation decisions against the concept constraints, ICP, user journey, customer journey, technical sophistication, customer provisioning model, path to aha, conversion path, retention loop, and champion dynamics. If lifecycle evidence is missing and the `customer-lifecycle` pack is not enabled, recommend `npx skillpacks install customer-lifecycle` from the project shell, before `$journey-map`. Flag conflicts (e.g., "Journey map says the buyer needs a demo before sign-up — does this self-serve-only onboarding fit?"). Do not re-interview on concept, ICP, or journey topics already covered.
   - Read `design/user-flow-*.md`, `design/ux-variations-*.md`, `design/ui-*.md`, and `design/**/flow-tree-*.yaml` when present as upstream pre-prototype design evidence for screen order, route inventory, branch decisions, state coverage, failure/recovery paths, handoffs, selected UX variation branches, UI approval state, and low-fidelity wireframe intent.

2. **Surface a prototype-grounded assumptions checkpoint before probing:**
   - After reading the consolidated prototype and research context but **before** asking deep probing questions, present a concise **Assumptions Checkpoint** grounded in what the prototype reveals.
   - Tag each assumption with its source:
     - `[from spec]` — explicitly stated in the draft or spec document
     - `[from codebase]` — derived from reading existing code, config, or infrastructure
     - `[from research]` — derived from research docs (ICP, audience, journey maps)
     - `[from prototype]` — derived from the consolidated prototype
     - `[inferred]` — not stated anywhere; you filled in a default or made a judgment call
   - Keep the checkpoint short enough to preserve interview momentum: normally 3 to 7 bullets, grouped only when useful. Do not dump a comprehensive manifest unless the user explicitly asks to review assumptions first.
   - Bias the checkpoint toward assumptions that are uncertain, risky, contradicted by evidence, or likely to change data/API/architecture choices. Omit obvious restatements that can be captured later in the spec.
   - Focus the checkpoint on what the prototype assumes vs what production needs:
     - What the prototype assumes about **data model** — what's fake/fixture vs what needs real persistence
     - What the prototype assumes about **auth** — none? mock? real?
     - What **fake data needs to become real** — hardcoded lists, mock APIs, placeholder content
     - What **missing infrastructure** is needed — database, auth, payments, analytics, deployment
     - What **error/empty states** the prototype skips vs what production needs
   - Deliver the checkpoint inline as the final message text of its own turn — never only as mid-turn text in a turn that ends with a tool or command call. In the next turn, ask the user to confirm or correct it together with one focused interview question so momentum is kept. Do not stop at the assumptions checkpoint unless the user explicitly asks to pause and review assumptions first.
   - If any `[inferred]` assumption is corrected, note the correction — these corrections are high-signal for downstream risk and must appear in the interview log.

3. **Screen-by-screen prototype walkthrough:**
   - Walk through each screen/page in the consolidated prototype. For each screen, probe:
     - **Data model?** What entities, relationships, persistence does this screen need?
     - **API calls?** What endpoints, payloads, error responses?
     - **Auth?** What permissions, roles, access control apply to this screen?
     - **Empty/error states?** What happens when data is missing, requests fail, or the user has no content yet?
     - **Performance?** Loading states, pagination, caching needs?
     - **Analytics?** What events should be tracked on this screen?
   - Codex interview cadence: ask one primary decision question per turn by default. Use short follow-up bullets only when they clarify the same decision, not to batch unrelated questions.
   - If the session is already in Plan mode, `request_user_input` may present 2-3 real options for the current material decision. Otherwise ask one concise direct question in plain text.
   - **Research and recommend by default.** Use web search, upstream research docs, and codebase analysis to gather evidence before asking the user. Assume the user has no insider knowledge unless they explicitly provide it. Present findings with data, define relevant terms, state a recommendation with reasoning, and ask the user to approve, adjust, or override based on hard constraints, proprietary facts, or corrections. Only present options without a recommendation when internal constraints, preferences, or missing facts make evidence insufficient. For each real choice:
     - Explain the options with evidence
     - Give a brief pros and cons comparison
     - State a recommendation and why
     - Explain how to mitigate the recommended option's downside when useful

4. **Iterative prototype updates:**
   - When the interview reveals gaps in the prototype (missing screens, unclear flows, absent states), ask: "Should I update the prototype to add [gap]? This may warrant re-running upstream steps."
   - If the consolidated prototype exposes missing or unclear screen flow, branch coverage, state coverage, failure/recovery behavior, or handoff structure, recommend `$user-flow-map [topic]` as the upstream remediation before continuing production-spec work.
   - The user decides per-update whether to update the prototype now or note it for production implementation only.
   - If the user approves a prototype update, make the change and note it in the interview log before continuing.

5. **Cover all areas:**
   - Continue until implementation goals, architecture, data models, APIs/contracts, migrations, edge cases, security, performance, observability, test strategy, and scope boundaries are all covered.
   - **Coverage checkpoint** — Before concluding, present a structured summary inline as the final message text of its own turn: list each area covered with key decisions made and the evidence/reasoning that supported each. In the next turn, ask: "Does this cover everything? Any constraints, missing facts, or areas to revisit?"

## Deliverables

- Write the completed specification to `specs/[topic].md` (create the `specs/` directory if needed), where `topic` is a short kebab-case summary
- Keep `specs/` as the canonical output directory for finalized post-prototype implementation specifications. Do not write pre-prototype flow maps, UX variation plans, UI branch packets, or flow-tree manifests from this skill; those remain design-phase artifacts under `design/`.
- The spec must use these canonical section headings (unnumbered):
  - `## Overview`
  - `## Goals`
  - `## Non-Goals`
  - `## Detailed Design` (architecture, data models, APIs, UI flows)
  - `## Edge Cases`
  - `## Test Plan`
  - `## Acceptance Criteria`
  - `## Open Questions`
  - `## Assumptions & Risks` (the checkpoint output)
  Additional topic-specific sections (e.g. `## Data Model`, `## Security`) may appear between Detailed Design and Edge Cases. Do not number sections.
- Write an interview log to `[topic]-interview.md`

The interview log should include:

- The Assumptions Checkpoint as presented, with user corrections noted
- Each question asked
- Options presented, if any
- The user's responses and chosen direction
- A closing summary of significant deviations from the initial draft and why they changed

Append an **Assumptions & Risks** section to the end of the spec listing: each checkpoint assumption that was confirmed, corrected, or left unresolved during the interview, its source tag, and the downstream risk if the assumption turns out to be wrong later. Flag any `[inferred]` assumptions that were never explicitly confirmed by the user. Include a **Production Ready Approval** section in the spec or alignment page before implementation handoff. Follow `docs/production-ready-approval.md`: record the approved MVP scope, evidence basis, remaining blockers, and whether the concept/prototype is approved to enter production build. Do not create a new state database, `research/.progress.yaml` schema, or competing lifecycle registry.

### Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/spec-interview-{topic}.html`.

## Next Work

**Next work:** the specification is the design tree's terminal artifact. After the Production Ready Approval is confirmed, hand off to implementation/execution — verify the target pack is enabled in `.agents/project.json` `enabled_packs` before recommending `$roadmap` then `$exec` (agent-work-admin pack).

**Recommended next command:** implementation handoff via `$roadmap`.

## Invoke With YAML

Emit the `agent_routing` payload with the exact resolved implementation-handoff command, `{slug}`/`{topic}` filled to literal values: `$roadmap` then `$exec` (agent-work-admin pack; `npx skillpacks install agent-work-admin` if not enabled).

## Constraints

- Do not assume draft text is final.
- Keep probing until the spec is decision-complete enough to implement.

## Ideas Mode (`--ideas`)

When `$ARGUMENTS` contains `--ideas`, read `tasks/ideas.md` and run the interview process for each idea sequentially.

1. Read `tasks/ideas.md` and extract every distinct idea entry. If a filter keyword is provided, limit to matching ideas.
2. Show the user the list and ask them to confirm, skip any, or reorder.
3. For each idea, run the standard interview process using the idea's title and description as the initial implementation draft. If an idea is still only a raw concept, route it to `$idea-scope-brief` first.
4. Write deliverables (`specs/[topic].md` and `[topic]-interview.md`) for each completed idea.
5. After each idea, summarize decisions and move to the next. The user may say "skip".
6. If the user stops partway through, write deliverables for completed ideas and note which remain.

Do not repeat work already in `tasks/roadmap.md`, `tasks/todo.md`, or `specs/`.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Interrogation Page

Before producing research, run the stage-zero interrogation loop following `INTERROGATION-PAGE.md` in this skill's directory. Build one HTML page per round at `interrogation/spec-interview-r{N}-{branch}.html`, starting with the assumptions manifest as round 1, and loop until the confidence gate passes. This skill **cannot advance to stage one** (the framework/scope alignment page) **until** the confidence gate passes with at least one completed interrogation round and every interview area covered or waived. Each round page must contain at least one genuinely open input (`data-open-input`).

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
