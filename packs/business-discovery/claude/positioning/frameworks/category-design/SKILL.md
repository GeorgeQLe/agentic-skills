---
name: category-design
description: Play Bigger category creation — category diagnosis, naming, POV development, ecosystem mapping
type: research
version: v0.0
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Category Design — Play Bigger Category Creation

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Prerequisites

- **Hard**: `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) must exist. If not, tell the user to run `/competitive-analysis` first and stop.
- **Hard**: `research/icp.md` (or `research/{slug}/icp.md`) must exist. If not, tell the user to run `/icp` first and stop.
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
- **Recommended when strategic canvas shows no existing category captures the value.** This skill is most useful as a follow-on to `/strategic-canvas` when the four actions reveal a fundamentally different value curve.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `../ALIGNMENT-PAGE.md`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
