---
name: category-design
description: Play Bigger category creation — category diagnosis, naming, POV development, ecosystem mapping
type: research
version: v0.13
required_conventions: [alignment-page]
invocation: sub-skill
parent: positioning
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `npx skillpacks install <pack>` from the project shell, instead of the target skill. Only the currently running skill and skills verified available in the active session or project-local install state are directly recommendable. For unavailable pack skills, recommend `npx skillpacks install <pack-or-skill>`; for unavailable base skills, recommend `npx skillpacks init` before the skill.

# Category Design — Play Bigger Category Creation

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
  framework_slug: category-design
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

- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `/competitive-analysis` first and stop.
- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `/customer-discovery` first and stop.
- **Soft**: `research/journey-map.md` (or `research/{slug}/journey-map.md`) — recommended for understanding where existing categories fail.

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

### 1. Load Context

- Read `research/competitive-analysis.md` — competitor landscape, how competitors position, existing category boundaries
- Read `research/icp.md` — target customers, pain points, how they search for and describe solutions
- Read `research/journey-map.md` if it exists — where existing category solutions fail the customer
- Read CLAUDE.md, README, and key source files for product context

### 2. Category Diagnosis

Determine whether the product fits an existing category, should create a subcategory, or needs an entirely new category.

**Criteria for Existing Category:**
- Clear incumbent category exists (buyers know where to look)
- Product competes on known dimensions within that category
- Customers would naturally place the product in this category
- The category correctly sets buyer expectations

**Criteria for Subcategory:**
- Existing category exists but product serves a distinct segment far better
- The broader category is correct but misleading about what makes this product valuable
- Buyers in the subcategory have needs the main category ignores
- Competitors in the main category are poor alternatives for this segment

**Criteria for New Category:**
- No existing category captures the value proposition
- Existing categories actively mislead buyers about what this product does
- Buyers who find this product through existing category labels get confused
- The product combines capabilities from multiple categories in a novel way
- There is a "why now" — a market shift that makes the new category inevitable

Document the diagnosis with evidence for and against each option.

### 3. Category Development (If Subcategory or New)

If the diagnosis points to subcategory or new category:

#### 3a. Category Naming

Develop 3-5 candidate category names. Good category names:
- Are descriptive (buyer understands roughly what's in the category)
- Are memorable (2-4 words, easy to say)
- Create a natural contrast with existing categories
- Are searchable (people might type this into Google)
- Do not require explanation to be directionally understood

For each candidate:
- The name itself
- What it communicates vs. what it obscures
- Existing Google results (is the term already taken?)
- How competitors would react

#### 3b. Category Definition

Write the category definition:
- **What's in**: Products/approaches that belong in this category
- **What's out**: What explicitly does NOT belong (this creates contrast)
- **Table stakes**: What every product in this category must have
- **Winning dimensions**: What separates leaders from followers within the category

#### 3c. Point of View (POV)

Develop the "why now" narrative — what changed in the world that makes this category necessary:
- What technological shift enables this?
- What market shift creates demand?
- What cultural shift makes the old way unacceptable?
- Why couldn't this category have existed 5 years ago?
- Why will it be obvious in 5 years?

The POV is the evangelism narrative — it explains why the world needs this category, not why the product is good.

#### 3d. Ecosystem Mapping

Map who else inhabits or borders this category:
- **Fellow travelers**: Other companies that could/should be in this category
- **Adjacent categories**: Neighboring categories that buyers might confuse with this one
- **Threatened incumbents**: Companies in existing categories that lose if this category wins
- **Enablers**: Infrastructure, platforms, or tools that support this category's existence

### 4. Existing Category Analysis (If Existing)

If the diagnosis points to existing category:
- Document which existing category and why
- Identify the winning dimension within that category
- Note what makes the product best-in-class on that dimension
- Acknowledge what the product sacrifices by accepting this category frame

### 5. Validate with User

Use AskUserQuestion to present the diagnosis and development:
- "Does the category diagnosis feel right? Is this an existing category, subcategory, or genuinely new?"
- If subcategory/new: "Which category name resonates? Which feels wrong?"
- "Does the POV narrative match your understanding of why the market is ready for this?"

## Output

### `research/positioning-category-design.md` (or `research/{slug}/positioning-category-design.md`)

```markdown
# Category Design Analysis

> Based on: research/competitive-analysis.md, research/icp.md[, research/journey-map.md]
> Date: [current date]
> Methodology: Play Bigger — Category Design

## Category Diagnosis

**Verdict**: Existing Category / Subcategory / New Category

### Evidence For Each Option

| Option | Evidence For | Evidence Against | Confidence |
|--------|-------------|-----------------|------------|
| Existing: [name] | [evidence] | [evidence] | High/Med/Low |
| Subcategory: [name] | [evidence] | [evidence] | High/Med/Low |
| New: [name] | [evidence] | [evidence] | High/Med/Low |

### Rationale
[Why the chosen diagnosis is correct — what evidence tips the balance]

## Category Name Candidates

(If subcategory or new category)

| # | Name | Communicates | Obscures | Search Viability | Competitor Reaction |
|---|------|-------------|----------|-----------------|-------------------|
| 1 | [name] | [what it says] | [what it hides] | [google results] | [reaction] |
| 2 | [name] | [what it says] | [what it hides] | [google results] | [reaction] |
| 3 | [name] | [what it says] | [what it hides] | [google results] | [reaction] |

**Recommended name**: [name] — [why]

## Category Definition

(If subcategory or new category)

### What's In
- [criterion for belonging]

### What's Out
- [what explicitly does not belong]

### Table Stakes
- [minimum requirements for category membership]

### Winning Dimensions
- [what separates leaders from followers]

## Point of View

(If subcategory or new category)

### The "Why Now" Narrative

[The evangelism narrative — 3-5 paragraphs explaining why the world needs this category now]

### Shifts That Enable This Category
| Shift Type | What Changed | Impact |
|-----------|--------------|--------|
| Technology | [shift] | [how it enables the category] |
| Market | [shift] | [how it creates demand] |
| Cultural | [shift] | [how it makes the old way unacceptable] |

## Ecosystem Map

(If subcategory or new category)

### Fellow Travelers
| Company/Product | Why They Belong | Current Category |
|----------------|-----------------|------------------|
| [company] | [rationale] | [where they sit today] |

### Adjacent Categories
| Category | Relationship | Confusion Risk |
|----------|-------------|---------------|
| [category] | [how it borders this one] | High/Med/Low |

### Threatened Incumbents
| Company/Category | What They Lose | Likely Response |
|-----------------|----------------|-----------------|
| [company] | [market share/narrative] | [how they'll react] |

### Enablers
| Enabler | Role | Dependency Level |
|---------|------|-----------------|
| [platform/tool] | [how it supports] | Critical/Important/Nice-to-have |

## Evidence Matrix

| Claim | Evidence Source | Evidence Type | Confidence |
|-------|---------------|---------------|------------|
| [claim about category] | [source file/section] | Observed/Inferred/Hypothesized | High/Medium/Low |
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

- **Category creation is expensive and slow.** Be honest about whether it's warranted. Default to existing/subcategory unless evidence strongly supports new category.
- **New categories require evangelism budget.** If the company cannot invest in educating the market, a new category is risky regardless of how well it fits.
- **The POV must be about the world, not the product.** The "why now" narrative explains market shifts, not product features.
- **Category names must work without explanation.** If the name requires a paragraph to understand, it's not a good category name.
- **Present before writing.** Never write output files until the diagnosis has been presented and validated.
- **Do not overwrite existing `research/positioning-category-design.md`** without asking the user first.
- **Recommended when strategic canvas evidence shows no existing category captures the value.** Most useful after the strategic-canvas intermediate indicates the four actions reveal a fundamentally different value curve.

## Alignment Page

Follow the shared alignment-page convention via the packaged convention resolver; output path is `alignment/category-design-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
