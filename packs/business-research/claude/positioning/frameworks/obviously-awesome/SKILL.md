---
name: obviously-awesome
description: April Dunford Obviously Awesome methodology — competitive alternatives, unique attributes, value mapping, target segment, market category
type: research
version: v0.14
release_lane: canary
required_conventions: [alignment-page, briefing-slides]
invocation: sub-skill
parent: positioning
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `npx skillpacks install <pack>` from the project shell, instead of the target skill. Only the currently running skill and skills verified available in the active session or project-local install state are directly recommendable. For unavailable pack skills, recommend `npx skillpacks install <pack-or-skill>`; for unavailable base skills, recommend `npx skillpacks init` before the skill.

# Obviously Awesome — Customer-Grounded Positioning

## Parent Orchestrator Routing

Run only through the parent orchestrator `/positioning` as part of its Research Session Loop. If the user needs to continue pending framework work, tell them to clear context and re-invoke `/positioning` with the same product/research path argument when present, for example `/positioning research/afps-tracker`.

Do not ask users to invoke this framework directly or with a path-shaped child framework command. Do not emit downstream routing labels, child-framework commands, execution-loop commands, or downstream skill recommendations from this framework subskill.

## Terminal Handoff Contract

When this framework is run inline and stops on its findings `review` page, the terminal response must end with:

```markdown
## Next Work
Review the framework findings page, compile YAML, clear context, and paste the compiled YAML into a fresh session. The parent will consume that YAML, write the approved intermediate, and recalculate whether another framework or synthesis is next.
```

The compiled YAML must carry the parent command (for example, `/positioning`) in `command` and `agent_routing.command`.

Use the same product/research path argument when present. Do not decide from inside the framework whether the next parent run executes another framework or synthesis; the parent orchestrator recalculates that from the run manifest and canonical-intermediate files after approval.

The findings `review` page must also include `agent_routing` in bottom compiled YAML with this parent-owned shape:

```yaml
agent_routing:
  workflow: pattern-a-research-loop
  parent_skill: positioning
  command: "/positioning research/{slug}"
  product_path: research/{slug}
  gate_owner: parent-orchestrator
  gate_type: framework-findings
  framework_slug: obviously-awesome
  framework_mode: inline-subskill
  run_manifest: research/{slug}/_working/positioning-run.yaml
  next_resolution: parent-resolves-from-yaml-and-filesystem
```

Omit `product_path` in flat mode, keep `command` identical to `agent_routing.command`, and never replace it with a child framework path command. The parent consumes this YAML, writes the approved intermediate, archives the working packet/page, and recalculates the next state.

## Report-First Approval Gate

Default to scope-first approval: before synthesized research, inspect only enough repository, user, and source context to propose research scope, source plan, assumptions, output paths, and approval questions in a `review` alignment page plus a concise conversation summary.

Do not perform synthesized research, rank candidates, make recommendations, or write working packets or canonical deliverables until final compiled YAML approves the research scope. Minimal pre-approval discovery may identify available files, source categories, and open questions; label it as scope evidence, not findings.

After approved research-scope YAML, perform the research and write only the non-canonical working packet defined in the staged workflow. Then update the `review` alignment page with findings and stop again for feedback-only YAML or final compiled YAML artifact approval before creating or updating canonical research, spec, or task files.

Do not include downstream routing language. While the framework findings page is in `review`, use only the parent-owned terminal handoff sections above. Parent synthesis owns downstream routing only after approved synthesis artifacts are written or updated.

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

- **Hard**: `research/customer-feedback.md` (or `research/{slug}/customer-feedback.md`) must exist AND must contain real post-launch customer evidence (not hypothetical personas or pre-launch assumptions). If missing or hypothetical, STOP and tell user: "The Obviously Awesome methodology requires real customer data — what customers actually say and do post-launch. Run `/customer-feedback` with real interview/survey/support data first."
- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `/customer-discovery` first and stop.
- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `/competitive-analysis` first and stop.

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

### 1. Load Context and Verify Customer Evidence

- Read `research/customer-feedback.md` — verify it contains real customer data (quotes, behaviors, support tickets, interview transcripts, survey responses, usage patterns)
- **STOP CHECK**: If customer-feedback.md contains only hypothetical personas, pre-launch assumptions, or lacks real customer quotes/behaviors, STOP and inform the user this framework requires post-launch customer evidence.
- Read `research/icp.md` — ICP segments, pain points, value props
- Read `research/competitive-analysis.md` — competitor landscape, alternatives
- Read CLAUDE.md, README, and key source files for product context

### 2. Step 1 — Competitive Alternatives

Identify what customers would ACTUALLY use if this product disappeared tomorrow. This is not a competitive analysis exercise — it is grounded in real customer behavior:

- **Direct competitors** — products customers explicitly considered or switched from
- **Adjacent solutions** — tools customers repurpose to solve the same problem
- **DIY/manual workarounds** — spreadsheets, scripts, manual processes customers build
- **Do nothing** — the status quo (often the real competitor)
- **Hire someone** — outsourcing, consultants, agencies

Source from customer-feedback.md: What did customers use before? What do they compare this product to? What would they go back to?

### 3. Step 2 — Unique Attributes

For each competitive alternative, identify what this product has that alternatives genuinely don't:

- Features alternatives lack entirely
- Approach or philosophy that's fundamentally different
- Technical advantages (speed, accuracy, simplicity, reliability)
- Business model advantages (pricing, no lock-in, transparency)
- Experience advantages (UX, onboarding, community)

**Be ruthless.** Only include attributes that are truly unique:
- If competitors also have it, it's table stakes — exclude it
- If it's on the roadmap but not shipped, it's not an attribute — exclude it
- If customers don't notice or mention it, question whether it's actually unique

### 4. Step 3 — Value Mapping

Map each unique attribute to the customer value it creates. Use evidence from customer-feedback.md:

| Unique Attribute | Customer Value | Value Type | Evidence |
|-----------------|----------------|------------|----------|
| [attribute] | [what it enables for the customer] | Time/Money/Risk/Capability/Quality | [customer quote or behavior] |

Value types:
- **Saves time** — enables faster outcomes, reduces manual work
- **Saves money** — reduces cost vs. alternatives
- **Reduces risk** — prevents failures, compliance issues, errors
- **Unlocks capability** — enables something previously impossible
- **Improves quality** — better outcomes, fewer mistakes, higher standards

Use AskUserQuestion:
- "Is this value actually experienced by customers, or is it hoped-for value? Which rows have the strongest customer evidence?"

### 5. Step 4 — Target Segment

From the value mapping, identify who cares MOST about the unique value. This is not the broadest market — it is the best-fit segment:

- Who experiences the unique value most acutely?
- Who would be most disappointed if the product disappeared?
- Who gets the most value from what makes this product different (not just from the category)?
- Who has the shortest time-to-value?
- Who tells other people about the product?

Cross-reference with customer-feedback.md: Which segment provides the most enthusiastic feedback? Which has the highest retention/engagement?

### 6. Step 5 — Market Category

Determine what category makes the unique value obvious to the best-fit segment. The category must:
- Set correct buyer expectations
- Make the unique attributes feel like natural advantages (not weird edge features)
- Put the product alongside the right comparisons
- Help buyers find the product through familiar search terms

Three options:
- **Existing category**: Known category where the product can win on the unique dimensions
- **Subcategory**: Niche within an existing category that the product owns
- **New category**: Entirely new frame (expensive — only if existing categories actively mislead)

Use WebSearch to research:
- How do customers describe the product to others?
- What category do they put it in mentally?
- What search terms would the best-fit segment use?

### 7. Synthesize Positioning Statement

Combine all five steps into a complete positioning statement:

**For** [target segment from Step 4]
**who** [need/pain the unique value addresses]
**[product name] is a** [market category from Step 5]
**that** [primary value from Step 3]
**Unlike** [primary competitive alternative from Step 1]
**[product name]** [key differentiator from Step 2]

### 8. Final Validation

Use AskUserQuestion for final validation:
- "Does this positioning match what your best customers actually experience?"
- "Would your most enthusiastic customers recognize themselves in this statement?"
- "Is there anything here that feels aspirational rather than grounded in reality?"

## Output

### `research/positioning-obviously-awesome.md` (or `research/{slug}/positioning-obviously-awesome.md`)

```markdown
# Obviously Awesome Positioning

> Based on: research/customer-feedback.md, research/icp.md, research/competitive-analysis.md
> Date: [current date]
> Methodology: "Obviously Awesome" (April Dunford) — 5-Step Customer-Grounded Positioning

## Positioning Statement

**For** [target segment]
**who** [need/pain]
**[product name] is a** [market category]
**that** [primary value]
**Unlike** [primary competitive alternative]
**[product name]** [key differentiator]

## Step 1: Competitive Alternatives

What customers would actually use if this product didn't exist:

| Alternative | Type | Customer Evidence | Strengths | Weaknesses |
|------------|------|-------------------|-----------|------------|
| [alternative] | Direct/Adjacent/DIY/Status quo/Hire | [quote or behavior] | [strengths] | [weaknesses] |

**Primary competitive alternative**: [the one most customers would default to]
**Evidence**: [customer quote or behavior demonstrating this]

## Step 2: Unique Attributes

What this product has that alternatives genuinely don't:

| Attribute | Why It's Unique | Customer Evidence | Table Stakes? |
|-----------|----------------|-------------------|---------------|
| [attribute] | [explanation] | [quote or behavior] | No — alternatives lack this |

**Attributes explicitly excluded** (table stakes):
- [feature] — [which alternatives also have this]

**Honesty check**: [If nothing is truly unique, state that clearly here — that is a critical finding]

## Step 3: Value Mapping

| Unique Attribute | Customer Value | Value Type | Customer Evidence |
|-----------------|----------------|------------|-------------------|
| [attribute] | [what it enables] | Time/Money/Risk/Capability/Quality | [quote or behavior] |

**Primary value**: [the single most important value customers get from what's unique]
**Evidence strength**: [how many customers independently confirm this value]

## Step 4: Best-Fit Target Segment

**Segment**: [specific description]
**Why they care most**: [why this segment values the unique attributes more than others]
**Customer evidence**: [what feedback/behavior demonstrates this is the best-fit segment]

### Characteristics of Best-Fit Customers
- [characteristic with evidence]
- [characteristic with evidence]
- [characteristic with evidence]

### Who This Is NOT For
- [segment that's a bad fit and why — with evidence if available]

## Step 5: Market Category

**Category**: [chosen category]
**Strategy**: Existing category / Subcategory / New category
**Why**: [rationale grounded in how best-fit customers think and search]

### How Customers Describe It
[What language do customers actually use when describing this product to others?]

### Categories Considered & Rejected
| Category | Why Considered | Why Rejected |
|----------|---------------|-------------|
| [category] | [reason] | [reason — with customer evidence if available] |

## Evidence Matrix

| Claim | Evidence Source | Evidence Type | Confidence |
|-------|---------------|---------------|------------|
| [positioning claim] | [customer-feedback.md section/quote] | Customer-reported/Observed behavior/Inferred | High/Medium/Low |
```

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **REQUIRES real customer evidence.** If `customer-feedback.md` is hypothetical, pre-launch, or missing real customer quotes/behaviors, STOP and tell the user. This framework does not work with assumptions.
- **Customer-grounded: every decision must connect to real customer behavior.** If a positioning element cannot be connected to customer evidence, label it as hypothesized and flag it for validation.
- **Be honest about uniqueness.** If nothing is truly unique, say so — that is a critical strategic finding, not a failure of the analysis.
- **Value must be experienced, not hoped for.** Only include value that customers report or demonstrate, not value the team wishes customers experienced.
- **Best-fit is not broadest.** The target segment is the segment that cares MOST, not the segment that's largest.
- **Present before writing.** Never write output files until positioning has been presented and validated.
- **Do not overwrite existing `research/positioning-obviously-awesome.md`** without asking the user first.


## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/obviously-awesome-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `/obviously-awesome`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/obviously-awesome-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
