---
name: positioning
description: Orchestrator — detect market vs product mode, recommend positioning frameworks, synthesize outputs into unified positioning
type: research
version: v0.23
argument-hint: "[optional: \"product\" | \"--synthesize\" | focus area]"
context_intake: scoped
visual_tier: visual
invocation: orchestrator
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `npx skillpacks install <pack>` from the project shell, instead of the target skill. After install, tell Codex users to start a fresh Codex CLI session if the `$` skill list remains stale. Only the currently running skill and skills verified available in the active session or project-local install state are directly recommendable. For unavailable pack skills, recommend `npx skillpacks install <pack-or-skill>`; for unavailable base skills, recommend `npx skillpacks init` before the skill.

# Positioning — Orchestrator

Invoke as `$positioning`.

This is an **orchestrator skill** using the parent router delegation pattern. It detects context, recommends applicable positioning frameworks, and synthesizes their outputs. Individual frameworks live as child skills under `frameworks/`.

## Report-First Approval Gate

Default to scope-first approval: before synthesized research, inspect only enough repository, user, and source context to propose research scope, source plan, assumptions, output paths, and approval questions in a `review` alignment page plus a concise conversation summary.

Do not perform synthesized research, rank candidates, make recommendations, or write working packets or canonical deliverables until final compiled YAML approves the research scope. Minimal pre-approval discovery may identify available files, source categories, and open questions; label it as scope evidence, not findings.

After approved research-scope YAML, perform the research and write only the non-canonical working packet defined in the staged workflow. Then update the `review` alignment page with findings and stop again for feedback-only YAML or final compiled YAML artifact approval before creating or updating canonical research, spec, or task files.

Do not include downstream or cross-skill command recommendations while a scope, framework findings, or synthesis approval is pending. The approval request itself is the next action, and the only terminal command section allowed before approval is `## Recommended Next Command After Compiling YAML` and it must name this same parent orchestrator, such as `$positioning` plus the same product/research path argument when present. Parent-loop continuation is not downstream routing. Only emit downstream next-skill routing after the synthesized `positioning.md` artifact has been approved and written.

## Staged Research Workflow

Use this staged workflow for synthesized research or report outputs that would create or update canonical research, spec, or task files.

1. **Stage 1 - Scope discovery and approval.** Inspect only enough repository, user, and source context to propose research scope, source plan, assumptions, output paths, and approval questions. Build the `review` HTML alignment page before synthesized research. The page must render the proposed scope, available source categories, known context, assumptions/confidence, proposed working-packet and canonical output paths, and research-scope approval gates. Stop for final compiled YAML approval of the research scope. Do not perform synthesized research, rank candidates, make recommendations, or write working packets, canonical research, spec, or task files in Stage 1.
2. **Stage 2 - Research and artifact review.** Only after approved research-scope YAML with no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback, perform the synthesized research, run required source/code checks, and write only a non-canonical working packet: flat mode uses `research/_working/preliminary-<skill>-research.md`; product-path mode uses `research/{slug}/_working/preliminary-<skill>-research.md`. Replace `<skill>` with this skill's `name` value. Raw evidence or search logs may remain as supporting evidence where this skill already requires them, but synthesized deliverables stay in the working packet. Update the `review` HTML alignment page so it renders the complete working-packet substance as structured HTML review UI: purpose-built sections, tables, matrices, gates, cards, and tier-appropriate charts or diagrams that preserve every packet section, finding, caveat, and decision detail without summary loss. Raw Markdown packet text may appear only as a supplemental source view after the rendered review UI; do not make a `Full Preliminary Packet` or `Full Working Packet` raw Markdown dump, giant `<pre><code>` block, link-only view, or source-only view the primary review surface. Include the evidence matrix, assumptions/confidence register, source coverage gaps, proposed canonical file changes, and artifact approval gates. Stop for either feedback-only YAML or final compiled YAML. Feedback-only YAML revises the working packet and page, then remains in Stage 2.
3. **Stage 3 - Finalize approved artifacts.** Consume final compiled YAML for artifact approval only when it has no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback. Apply approved edits first, archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`, remove the active working packet, write the approved canonical artifacts to the unchanged output paths below, and convert the alignment page to `confirmed` with the approval record preserved.

Canonical output paths remain unchanged. Search logs and other supporting evidence remain allowed only where this skill's output contract already requires them.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `$customer-discovery` first and stop.
- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `$competitive-analysis` first and stop.
- **Strong default**: `research/journey-map.md` (or `research/{slug}/journey-map.md`) should exist before writing canonical positioning. If missing, recommend `$journey-map` first unless the user explicitly needs a provisional positioning analysis.
- **Soft**: Read these if they exist:
  - `research/journey-map.md` — where value is delivered, the aha moment
  - `research/customer-feedback.md` — real customer language about what makes the product different
  - `research/monetization.md` — pricing context for value perception

## Execution Model — Research Session Loop

This is a **self-advancing Pattern A research orchestrator** (see `docs/research-session-loop-convention.md`). Each invocation starts cold, resolves its state from **pasted YAML + filesystem**, runs **exactly one heavy phase**, emits the next gate, and stops. The user advances the loop by starting a fresh Codex session and re-invoking `$positioning`. The user never invokes a framework subskill directly — the orchestrator follows each selected framework's subskill inline.

When a framework is pending, the only user-facing continuation route is re-invoking `$positioning` with the same product/research path argument when present, for example `$positioning research/afps-tracker`. Never tell the user to run a path-shaped child framework command; the parent resolves the pending framework from the run manifest and filesystem.


### Terminal Handoff Contract

Every terminal response for this Research Session Loop must end with `## Next Work` and one command section. Use `## Recommended Next Command After Compiling YAML` only while a `review` page is waiting for compiled YAML. Use `## Recommended Next Command` only after approved YAML has been consumed and the approved artifact has been written or updated. Do not put any other section after the applicable command section.

### Self-Routing Continuation Payload

Every `review` alignment page this parent creates must include `agent_routing` in the bottom compiled YAML. The mapping routes a fresh agent back to this parent orchestrator; it does not authorize direct framework invocation or replace parent-owned state resolution. Use this shape, preserving the current product/research path argument when present:

```yaml
agent_routing:
  workflow: pattern-a-research-loop
  parent_skill: positioning
  command: "$positioning research/{slug}"
  product_path: research/{slug}        # omit in flat mode
  gate_owner: parent-orchestrator
  gate_type: framework-findings        # or framework-selection, shortcut-selection, synthesis
  framework_slug: <framework-slug>     # only for framework-findings gates
  framework_mode: inline-subskill      # only for framework-findings gates
  run_manifest: research/{slug}/_working/positioning-run.yaml
  next_resolution: parent-resolves-from-yaml-and-filesystem
```

For framework selection, shortcut, and synthesis gates, omit `framework_slug` and `framework_mode`; `gate_type` must name the actual gate. The `command` field must be the same parent command shown under `## Recommended Next Command After Compiling YAML`. The parent consumes the YAML, writes or amends the artifact, archives consumed sources, derives progress from the run manifest plus canonical-intermediate files, and decides whether to load a framework subskill inline.

For review-pending framework, selection, shortcut, or synthesis pages, `## Next Work` tells the user to review the alignment page and compile YAML, and the command section names `$positioning` with the same product/research path argument when present, then start a fresh Codex session if the skill list or context is stale. For post-write pending-framework states, `## Next Work` reports progress as "k of N frameworks complete" and says the next run executes the next pending framework; `## Recommended Next Command` names `$positioning`.

After every framework write, recalculate pending frameworks from the run manifest and canonical-intermediate files before writing this handoff. If no selected frameworks remain and canonical `positioning.md` is missing, `## Next Work` says the next run builds the unified synthesis review page, and `## Recommended Next Command` names `$positioning --synthesize` with the same product/research path argument when present. After approved synthesis writes canonical `positioning.md`, the final command section names only the first downstream command selected by the Next Steps decision tree.


State lives in two places only:

- **Run manifest** — `research/_working/positioning-run.yaml` (flat) or `research/{slug}/_working/positioning-run.yaml` (product-path). Records the selected framework set and each framework's intermediate path. Written when the multi-select YAML is approved. Shape:

  ```yaml
  orchestrator: positioning
  slug: skills-showcase            # omit in flat mode
  selected_frameworks:
    - slug: jtbd-positioning
      intermediate: research/skills-showcase/positioning-jtbd-positioning.md
    - slug: strategic-canvas
      intermediate: research/skills-showcase/positioning-strategic-canvas.md
  ```

- **Canonical-intermediate existence** — a selected framework is *done* when `research/positioning-{framework}.md` (or `research/{slug}/positioning-{framework}.md`) exists, *pending* otherwise. `pending = selected − existing-intermediates`. The manifest stores selection only, not per-framework status.

`research/.progress.yaml` stays coarse — its `pipeline_stage` is a pointer, not per-framework status.

### State resolution (resolve the first match; YAML first, then most-progressed A→E)

On each invocation, after Product-Path Scope Resolution (step 0), resolve state:

| State | Detected when | Heavy phase this session | Emits / stops with |
|---|---|---|---|
| **0 — pasted YAML** | a compiled alignment YAML is pasted | branch on `approval_status`: `ready-for-agent-review` → apply the approval for the gate it answers (light: write manifest and/or prior framework intermediate, archive consumed source), then fall through to the next pending state below; `not-approved` → amend the named page (refinement session) and stop | amended page, or proceeds ↓ |
| **A — done** | canonical `research/positioning.md` (or `research/{slug}/positioning.md`) exists | — | done; emit next-skill route (step 6) |
| **B — synthesize** | run manifest exists, all selected intermediates exist, no canonical `positioning.md` (also forced by `--synthesize`) | **synthesis** (step 4) | synthesis `review` page |
| **C — run framework** | run manifest exists, ≥1 selected framework pending | **run next pending framework inline at its research stage** (step 3b) | that framework's findings `review` page |
| **E — build selection** | no run manifest and no canonical (cold start) | mode detect → load context → recommend frameworks → build multi-select page (steps 1–3a) | multi-select `review` page |

**Cold entry (no state F).** This orchestrator uses `context_intake: scoped` — there is **no deep-interview phase**. A cold start (nothing on disk, after the hard `research/icp.md` + `research/competitive-analysis.md` prerequisites are satisfied) resolves directly to **state E**; the 1–3 light scope questions fold into the head of the E session. The `product`/`post-launch`/`obviously-awesome` shortcut short-circuits E→C with a fixed framework set (step 5).

**Light vs heavy.** Recording the approved selection into the run manifest (state 0→C head), writing an already-reviewed framework intermediate, and archiving a consumed source are *light* — they fold into the head of the next heavy session. The heavy phase (one framework's research, synthesis) is the only thing isolated per session.

**Shortcuts.** `$positioning --synthesize` forces state B. `$positioning product` (also `post-launch`, `obviously-awesome`) is the product-positioning shortcut (step 5): after the user approves the shortcut plan, it writes a fixed single-framework set (`obviously-awesome`) into the run manifest and enters state C. Do not queue framework work in `tasks/todo.md` or hand it to `$exec`.

---

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

### 1. Mode Detection

Detect **market-positioning mode** (default) or **product-positioning mode**:

**Market-positioning mode** activates when:
- No `research/customer-feedback.md` with post-launch customer evidence, AND
- No production codebase with live users detected, AND
- `$ARGUMENTS` does not contain "product", "post-launch", or "obviously-awesome"

Available frameworks in market mode:
- `jtbd-positioning` — Jobs-to-be-Done positioning analysis
- `strategic-canvas` — Blue Ocean strategic canvas
- `moore-positioning` — Geoffrey Moore positioning hypothesis
- `category-design` — Play Bigger category creation

**Product-positioning mode** activates when:
- `research/customer-feedback.md` exists with real customer data, OR
- `$ARGUMENTS` contains "product", "post-launch", or "obviously-awesome", OR
- Production spec exists AND customer feedback references real users

Available frameworks in product mode:
- `obviously-awesome` — April Dunford (requires real customer evidence)
- `strategic-canvas` — optionally, for category refresh

### 2. Load Context

- Read `research/icp.md`, `research/competitive-analysis.md`
- Read soft prerequisites if they exist
- Read CLAUDE.md, README for product context
- Read any existing `research/positioning-*.md` intermediate artifacts

### 3a. State E — Framework Selection & Build Multi-Select Page

Build the framework multi-select `review` alignment page with:

1. **Mode explanation**: which mode was detected and why
2. **Available evidence summary**
3. **Multi-select framework section**: checkboxes with pre-checked defaults:
   - Market mode: `jtbd-positioning` + `strategic-canvas` + `moore-positioning` pre-checked; `category-design` unchecked
   - Product mode: `obviously-awesome` pre-checked; `strategic-canvas` unchecked
4. **Loop plan**: the selected set is the scope-and-candidate approval gate; each selected framework is then run inline (one findings page per framework) and the run advances by re-invoking `$positioning`
5. **Approval gate**

This multi-select approval **is** the Stage-1 scope approval for the whole selected set. Stop for compiled YAML. Do **not** write the run manifest or run any framework in this session — that is state C.

### 3b. State C — Run Next Pending Framework (inline)

This session consumes the approved multi-select YAML (state 0→C) or advances after a prior framework's approval. At the **head** of the session, do the light bookkeeping first:

1. **Write the run manifest** if it does not yet exist: `research/_working/positioning-run.yaml` (flat) or `research/{slug}/_working/positioning-run.yaml` (product-path), recording `selected_frameworks` with each framework's `slug` and canonical `intermediate` path. Example (market mode):

   ```yaml
   orchestrator: positioning
   selected_frameworks:
     - slug: jtbd-positioning
       intermediate: research/positioning-jtbd-positioning.md
     - slug: strategic-canvas
       intermediate: research/positioning-strategic-canvas.md
     - slug: moore-positioning
       intermediate: research/positioning-moore-positioning.md
   ```

2. **If a prior framework's reviewed content was just approved** by the pasted YAML, write its canonical intermediate `research/positioning-{fw}.md` (or `research/{slug}/positioning-{fw}.md`) from the already-reviewed working packet, and archive that framework's working packet and superseded review page.

Then run the **one heavy phase**: determine the next pending framework (first selected framework whose canonical intermediate does not yet exist), then **load and follow that framework subskill's `SKILL.md` inline, entering at its research stage (Stage 2)** — the multi-select approval already satisfied the framework's Stage-1 scope gate, so perform the research, write its working packet, and build a single findings `review` page. Stop for that framework's compiled YAML.

**Advance the loop by self-re-invocation.** When a framework findings page is in `review`, end the terminal message with `## Next Work` telling the user to review the page and compile YAML, followed by `## Recommended Next Command After Compiling YAML` naming `$positioning` with the same product/research path argument when present. After a framework's compiled YAML is approved and its canonical intermediate is written, recalculate pending frameworks from the manifest and filesystem before writing the handoff. If pending frameworks remain, end with `## Next Work` reporting progress as "k of N frameworks complete" and saying the next run executes the next pending framework, followed by `## Recommended Next Command` naming `$positioning`. If no pending frameworks remain and canonical `positioning.md` is missing, end with `## Next Work` saying the next run builds the unified synthesis review page, followed by `## Recommended Next Command` naming `$positioning --synthesize` with the same product/research path argument when present. Do not emit cross-skill routing here — that happens only after synthesis.


### 4. State B — Synthesis (auto-detected; also `$positioning --synthesize`)

Enter synthesis when the run manifest exists, **all** selected framework intermediates exist, and no canonical `research/positioning.md` yet exists. An explicit `$positioning --synthesize` also forces this state. Read all selected intermediate framework outputs (the `intermediate` paths recorded in the run manifest — full framework-slug filenames such as `research/positioning-jtbd-positioning.md`, `research/positioning-moore-positioning.md`). At least one must exist.

Synthesize into unified `research/positioning.md`:

**Market-positioning synthesis**: combined hypothesis, Moore template filled with cross-framework evidence, evidence matrix, confidence levels, validation plan. Header: `> Mode: Market Positioning (hypothesized, pre-product)`

**Product-positioning synthesis**: positioning statement from Obviously Awesome, customer-grounded evidence matrix, confidence levels. Header: `> Mode: Product Positioning (customer-grounded)`

Build alignment page for synthesis approval. After approval: write `research/positioning.md`, then on this canonical write **archive the run manifest** (`positioning-run.yaml`) and the synthesis working packet under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`, update `research/.progress.yaml` `pipeline_stage` to `positioning`, and emit downstream next-step routing (step 6). This is the one place cross-orchestrator routing is allowed.

### 5. State C via Product-Positioning Shortcut (`$positioning product`)

Skip multi-select. Build an alignment page for the shortcut execution plan with:

1. **Shortcut explanation**: product-positioning shortcut selected and why `obviously-awesome` is the only queued framework
2. **Evidence readiness**: customer-feedback requirement and any missing evidence caveats
3. **Proposed loop plan**: the single `obviously-awesome` framework that will be recorded in the run manifest
4. **Approval gate**: require final compiled YAML approval before writing the run manifest

Do not write the run manifest before alignment approval. The next action is review of the HTML alignment page.

After user approval via final compiled YAML, write this selected set to the run manifest and enter the next pending framework session:

```yaml
orchestrator: positioning
selected_frameworks:
  - slug: obviously-awesome
    intermediate: research/positioning-obviously-awesome.md
```

Then enter **state C** and run `obviously-awesome` inline per step 3b. The loop advances by re-invoking `$positioning`.

### 6. Next Steps (after synthesis only)

- IF no journey-map: check for `customer-lifecycle` pack → recommend `$journey-map`
- DEFAULT: check for `product-design` pack → if enabled, recommend `$user-flow-map [positioning-backed product direction]`; if not enabled, recommend `npx skillpacks install product-design` from the project shell
- IF solution-customer fit weak/disputed: `$value-prop-canvas`
- IF business-model risks: `$lean-canvas`
- IF no GTM: check for `business-growth` pack → recommend `$gtm`
- IF GTM exists: recommend `$gtm` refresh
- IF no monetization: check for `business-growth` pack → recommend `$monetization`
- IF codebase exists: check for `business-ops` pack → recommend `$mvp-gap`

### 7. Downstream Impact Check (after synthesis write)

Check `research/gtm.md`. Classify impact as None/Minor/Major per standard pattern.

## Optional Research Trigger Map

These detours are conditional framework owners, not required AFPS chain links.

| Positioning signal | Owner | Trigger threshold |
|---|---|---|
| Solution-customer fit weak/disputed, value mapping low confidence | `$value-prop-canvas` | Trigger: unique attributes can't be confidently mapped to value. Skip: value mapping clear. |
| Business-model risk exposed by category strategy | `$lean-canvas` | Trigger: risk would change UX or prototype choices. Skip: normal competitive findings. |
| Pricing architecture central to positioning | `$monetization` | Trigger: category/value mapping requires grounded pricing. Skip: pricing not a differentiator. |

## Output

### State E / State C: run manifest plus per-framework findings review page (manifest written at the head of the first state-C session; one findings page + canonical `research/positioning-{framework}.md` per selected framework)
### State B: `research/positioning.md` (unified synthesis — see claude variant for full template)
### State C via shortcut: pre-approval alignment page, then run manifest update and `obviously-awesome` framework review after final compiled YAML approval

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable work goes in `tasks/todo.md`.
- Human-only external actions go in `tasks/manual-todo.md`.
- Condition-gated records go in `tasks/record-todo.md`.
- Cadence-based reviews go in `tasks/recurring-todo.md`.

## Constraints

- **Requires ICP + competitive analysis.**
- **Customer-grounded.** Every decision connects to real evidence.
- **Mode detection is evidence-based.** Do not override without user confirmation.
- **Parent owns the research loop.** It records selected frameworks in the run manifest and runs one pending framework inline per invocation. Do not queue framework work in `tasks/todo.md` or hand it to `$exec`.
- **Synthesis requires at least one framework output.**
- **Do not overwrite existing `research/positioning.md`** without asking first.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/positioning-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
