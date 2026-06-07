---
name: competitive-analysis
description: Research competitors via web search — map the landscape, GTM strategies, strengths, weaknesses, and market gaps
type: research
version: v0.14
argument-hint: "[concept | optional: product category or specific competitors to investigate]"
interview_depth: light
visual_tier: visual
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Competitive Analysis — Market Landscape Research

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Staged Research Workflow

Use this staged workflow for synthesized research or report outputs that would create or update canonical research, spec, or task files.

1. **Stage 1 - Research and clarify.** Perform the research, run required source/code checks, and ask any needed clarification questions. Write only a non-canonical working packet: flat mode uses `research/_working/preliminary-<skill>-research.md`; product-path mode uses `research/{slug}/_working/preliminary-<skill>-research.md`. Replace `<skill>` with this skill's `name` value. Do not create or update canonical research, spec, or task files in Stage 1. Raw evidence or search logs may remain as supporting evidence where this skill already requires them, but synthesized deliverables stay in the working packet.
2. **Stage 2 - Review alignment.** Consume the working packet and build the `review` HTML alignment page. The page must render the full preliminary packet, evidence matrix, assumptions/confidence register, source coverage gaps, proposed canonical file changes, and approval gates. Stop for either feedback-only YAML or final compiled YAML. Feedback-only YAML revises the working packet and page, then remains in Stage 2.
3. **Stage 3 - Finalize approved artifacts.** Consume final compiled YAML only when it has no unresolved `needs-clarification`, unresolved `down` feedback, or other unresolved negative feedback. Apply approved edits first, archive the working packet to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-working-path>`, remove the active working packet, write the approved canonical artifacts to the unchanged output paths below, and convert the alignment page to `confirmed` with the approval record preserved.

Canonical output paths remain unchanged. Search logs and other supporting evidence remain allowed only where this skill's output contract already requires them.

Conduct deep web-based research to compile a comprehensive competitive landscape for the project. Uses web search to identify competitors, evaluate their maturity, analyse their go-to-market strategies, and surface market gaps. The output gives the founder a clear picture of who they're up against and where opportunities exist.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Prerequisites

**Detect mode before proceeding:**

- **Concept-validation mode** activates when: no `research/icp.md` exists AND (no meaningful codebase — i.e. no README, no source files, no package config — OR `$ARGUMENTS` contains "concept" or "validate"). Use this mode to validate market gaps after a concept has been shaped by `/idea-scope-brief` or an equivalent brief; if no concept is clear, recommend `/idea-scope-brief` first. In this mode, announce to the user: "Running in concept-validation mode — no ICP or product detected. I'll evaluate the market gap for your concept." Then ask the user to describe the concept, the problem it addresses, and the intended audience.
- **Standard mode** (default): Read the codebase, README, CLAUDE.md, and existing research/specs (`research/icp.md` or `research/{slug}/icp.md`, `research/enterprise-icp.md` or `research/{slug}/enterprise-icp.md`, `research/mvp-gap.md` or `research/{slug}/mvp-gap.md`) to understand what the product does, who it's for, and what value it claims to provide. This context is essential for identifying the right competitors and evaluating positioning. If no codebase or specs exist but `research/icp.md` is present, proceed in standard mode using the ICP as context.
- Read `research/.progress.yaml` when present. Normalize `active_path` (singular legacy) to `active_paths` (plural list) when reading; treat legacy `abandoned` as `archived` and exclude archived/deferred/revisit/promoted paths plus `research/_archive/` scopes from active target selection. In standard mode, scope the full competitive analysis to the first entry in `active_paths` by default. Treat `product_paths[]` entries with `status: deferred` or `status: revisit_candidate` as parked product paths, not as extra full research tracks.

**Provisional product-path evidence.** When a referenced product path is not present in `research/.progress.yaml` (either absent entirely or not in `active_paths` or `product_paths[]`), do not treat it as a canonical active path. Before using it as source context, require an explicit provisional-path evidence reference: a `review-only-approved` alignment page (e.g., `alignment/idea-scope-brief-{topic}.html` with `approval_status: review-only-approved`) that fully renders the proposed path's concept, brief, and manifest entry. If no such evidence exists, ask the user whether to proceed with the path as unverified context or to run `/idea-scope-brief` first.

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

### 1. Establish Product Context

**Standard mode:**
- Read CLAUDE.md, README, package config, and key source files to understand the product
- Read `research/icp.md` (or `research/{slug}/icp.md`) if it exists — the customer profile, pain map, and value prop define the competitive frame
- Read `research/enterprise-icp.md` (or `research/{slug}/enterprise-icp.md`) and `research/mvp-gap.md` (or `research/{slug}/mvp-gap.md`) if they exist for additional context
- If `$ARGUMENTS` names specific competitors, use those as a starting point but still search broadly
- Summarise what the product does, who it's for, and what problem it solves. Confirm this understanding with the user before researching.

**Concept-validation mode:**
- Use `research/idea-brief.md` when present, otherwise use the concept description from Prerequisites to establish the problem space
- Summarise what the concept proposes (problem it addresses, intended audience, hypothesised approach)
- Confirm this understanding with the user before researching

### 2. Identify Competitors

Use the WebSearch tool extensively to find competitors. Search across multiple angles:

- **Direct competitors**: Products solving the same problem for the same audience
- **Indirect competitors**: Products solving an adjacent problem that could expand into this space
- **Incumbents**: Established tools or platforms the target audience currently uses (even if not purpose-built for this problem)
- **Emerging players**: New startups or open-source projects in the space
- **DIY alternatives**: Internal tools, spreadsheets, manual processes, or "do nothing" approaches

Search strategies:
- `"[product category] software"`, `"[product category] tools"`, `"[product category] alternatives"`
- `"best [product category] for [target audience]"`, `"[product category] comparison"`
- `"[competitor name] alternatives"` for each known competitor to find more
- `"[competitor name] vs"` to discover comparison articles and adjacent players
- Check Product Hunt, G2, Capterra, and industry-specific directories
- Search for recent funding rounds in the space: `"[product category] startup funding"`
- Look for open-source alternatives on GitHub

**Checkpoint 1 — Present the competitor list to the user.** Use the AskUserQuestion tool to show all identified competitors grouped by category (direct, indirect, incumbent, emerging, DIY). For each competitor, include a one-line description of what they do and why they belong in that category, citing the search source. Then ask:
- "Are there competitors I missed?"
- "Any of these incorrectly categorised or not actually relevant?"

Incorporate feedback before proceeding to deep research.

### 3. Research Each Competitor

For each identified competitor, use WebSearch and WebFetch to gather:

#### Company & Product
- What exactly they do — core product, features, positioning
- Founding year, team size, funding raised, revenue signals
- Technology stack and platform (web, mobile, desktop, API, CLI)
- Pricing model and tiers (free, freemium, paid-only, enterprise)

#### Maturity & Traction
- Current stage: pre-launch, early, growth, mature, declining
- User base size signals (published metrics, app store downloads, community size)
- Customer logos and case studies
- Recent product launches or major updates
- Integration ecosystem breadth

#### Observable GTM Patterns
- Primary acquisition channel observed: PLG, sales-led, community-led, content-led, partnerships
- Pricing model: freemium, free trial, demo-required, open-core, usage-based (as listed on pricing page)
- Community presence: Discord, Slack, forums, open-source community
- Target market segment: SMB, mid-market, enterprise, developer, consumer
- Observable facts only — GTM strategy analysis and recommendations belong in `/gtm`

#### Strengths
- What do users praise? (Check review sites, social media, community forums)
- What features or capabilities set them apart?
- What's their moat? (Network effects, data, integrations, brand, switching costs)

#### Weaknesses
- What do users complain about? (Check negative reviews, support forums, social media)
- What's missing from their product?
- Where do they lose deals? (Check comparison articles, competitor marketing)
- What's their biggest vulnerability?

### 4. Identify Market Gaps & White Space

Synthesise the research to find gaps and white-space opportunities:

- **Underserved segments**: Customer types or use cases that no competitor serves well
- **Feature gaps**: Capabilities that users want but no competitor provides
- **Pricing gaps**: Market segments priced out by existing solutions or overpaying for features they don't need
- **UX gaps**: Areas where all competitors have poor user experience
- **Integration gaps**: Missing connections to tools the target audience already uses
- **Geographic or vertical gaps**: Markets or industries that competitors haven't entered
- **Technology gaps**: Emerging tech (AI, automation, APIs) that competitors haven't leveraged

**Standard mode additional synthesis:**
- What are the 2-3 most significant white-space opportunities?
- What can we learn from competitors' successes and failures?

When evidence materially affects parked product paths from `research/.progress.yaml`, add a short `## Implications for Deferred Product Paths` section summarizing the impact, evidence refs, and whether the `revisit_trigger` should change. Do not broaden standard mode into full competitive analysis for every deferred path unless the user explicitly promotes one. When competitive gaps imply an entirely new product surface not covered by existing product paths, recommend `/product-line fork` to create a new path entry.

**Concept-validation mode additional synthesis:**
- What segments or use cases would this concept serve that competitors miss?
- What can you learn from competitors' successes and failures?

Positioning recommendations and "where we fit" analysis belong in `/positioning` — capture positioning signals in the appendix below.

### 4a. Gap Assessment (concept-validation mode only)

If running in concept-validation mode, synthesise the market gaps into a structured gap assessment:

- **Market State**: Virgin (no one does this) / Sparse (few players, early) / Crowded (many established players)
- **Incumbent Quality**: Dominant-and-loved / Dominant-but-resented (the Jira pattern — widely used, widely disliked) / Fragmented-and-mediocre / Emerging-and-unproven
- **Gap Quality**: Clear unmet need / Underserved segment / UX/approach gap / Minor improvement / No meaningful gap
- **Verdict**: Proceed to Customer Discovery (gap validated) / Pivot concept (gap exists but concept doesn't address it well) / Abandon (no meaningful gap)

**Checkpoint — Present gap assessment to user.** Use the AskUserQuestion tool to present the Market State, Incumbent Quality, Gap Quality, and Verdict with supporting evidence from the research. Ask: "Does this assessment match your read of the market? Should we adjust the verdict?" Incorporate feedback before continuing.

### 5. Present Findings & Validate

**Checkpoint 2 — Present the full analysis to the user before writing.** Use the AskUserQuestion tool to present:

1. **Landscape summary** — the competitive picture in 3-5 sentences
2. **Key competitors** — top 3-5 with their strengths, weaknesses, and key takeaway
3. **Market gaps** — the most significant unmet needs and white-space opportunities
4. **Observable GTM patterns** — what works and doesn't work in this market
5. **Lessons from competitors** — key do's and don'ts

Then ask:
- "Do the market gaps match your intuition?"
- "Any gaps I missed or got wrong?"
- "Any insider knowledge that changes the analysis?"

Continue the conversation until all non-trivial details are nailed down. If the user raises points that require additional research, go back and search before finalising.

### 6. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually:

**Concept-validation mode:**
- IF verdict is **Proceed to Customer Discovery**: recommend `/customer-discovery` — Define your ideal customer profile now that the market gap is validated
- IF verdict is **Pivot concept**: recommend `/brainstorm` — Generate alternative concepts that better address the gap before ICP work
- IF verdict is **Abandon**: recommend `No follow-up skill recommended` — Stop this concept because the analysis did not find a meaningful gap worth pursuing; include `/brainstorm` only if the user wants to explore a new concept
- IF verdict is **Proceed to Customer Discovery** and `/customer-discovery` creates `research/icp.md`: include `/competitive-analysis` as a later option to re-run in standard mode for full competitive positioning

**Impact-aware adjustments:**
- IF downstream impact is **Major**: prepend `/reconcile-research — [N] conflicts found in downstream docs` as the first item
- IF downstream impact is **Minor**: annotate relevant skill suggestions with "(stale — [brief description])"
- If downstream impact has not been classified yet, run the downstream impact check against the proposed output before selecting the final recommendation. Do not emit a Minor/Major impact recommendation speculatively.

**Standard mode:**
- RECOMMEND the first matching item:
  1. IF no `research/journey-map.md`: check `.agents/project.json.enabled_packs` for `customer-lifecycle` — if `customer-lifecycle` is not enabled, recommend `/pack install customer-lifecycle` first; if `customer-lifecycle` is enabled, recommend `/journey-map` — Map the customer and user journey before solution-value decisions, using competitive gaps as inspiration
  2. IF no `research/positioning.md`: `/positioning` — Frame the market category and alternatives after journey evidence shows where value is delivered
  3. IF no `specs/user-flow-*.md`: check `.agents/project.json.enabled_packs` for `product-design` — if `product-design` is not enabled, recommend `/pack install product-design` first; if `product-design` is enabled, recommend `/user-flow-map [top journey-backed market gap or positioning opportunity]` — Map flow structure before UI requirements, layout variants, and production specification
  4. IF no `research/value-prop.md` AND solution-customer fit is weak, disputed, or needs explicit fit scoring: `/value-prop-canvas` — Validate contested solution-fit evidence as an optional detour
  5. IF no `research/gtm.md`: check `.agents/project.json.enabled_packs` for `business-growth` — if `business-growth` is not enabled, recommend `/pack install business-growth` first; if `business-growth` is enabled, recommend `/gtm` — Build a GTM plan using the channel and positioning insights
  6. IF codebase exists and no `research/mvp-gap.md`: check `.agents/project.json.enabled_packs` for `business-ops` — if `business-ops` is not enabled, recommend `/pack install business-ops` first; if `business-ops` is enabled, recommend `/mvp-gap` — Evaluate codebase against ICP and competitive landscape
- Include `/brainstorm` only as an "Other option" when the analysis found multiple plausible market gaps and the product direction is still unclear. Do not recommend brainstorm just because competitive whitespace exists.
- Include `/value-prop-canvas` only as an "Other option" when solution-customer fit is weak, disputed, or needs explicit fit scoring before positioning/spec work. It is not part of the default route.

**Impact-aware adjustments:**
- IF downstream impact is **Major**: prepend `/reconcile-research — [N] conflicts found in downstream docs` as the first item
- IF downstream impact is **Minor**: annotate relevant skill suggestions with "(stale — [brief description])"
- If downstream impact has not been classified yet, run the downstream impact check against the proposed output before selecting the final recommendation. Do not emit a Minor/Major impact recommendation speculatively.

### 7. Write Output

Only after the user has validated the findings, write the output files.

### 8. Downstream Impact Check

After writing, check for downstream research documents that may be affected by what was just decided. Only check documents that exist on disk.

**Downstream documents to check** (use `{slug}/` prefix when product-path scope is active):
- `research/gtm.md`
- `research/monetization.md`

For each existing downstream document:
1. Read it — focus on `> Based on:` header, `## Summary`, and sections that reference concepts this skill just defined or changed
2. Identify **specific conflicts**: claims, assumptions, or references that contradict what was just decided. Examples:
   - Competitor positioning or market gaps that GTM strategy was built on that have changed
   - Pricing benchmarks referenced in monetization that no longer match the competitive landscape
   - Channel strategy assumptions based on competitor behavior that has shifted
3. Note each conflict: downstream file, section, the stale claim (quote it), and what it should now say

**Classify the impact**:
- **None**: No downstream documents exist, or no conflicts found. Skip display entirely.
- **Minor** (1–2 small conflicts): Display conflicts to user inline.
- **Major** (3+ conflicts OR a foundational assumption changed — e.g., market positioning shifted, new dominant competitor identified, pricing landscape changed significantly): Display conflicts and strongly recommend `/reconcile-research`.

Display to the user after showing the written file confirmation. This should be quick — one read per downstream doc, scan for conflicts against key decisions. Not a deep reconciliation.

## Output

### `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`)

```markdown
# Competitive Analysis

> Product: [product name and one-line description]
> Category: [market category]
> Date: [current date]
> Sources: [number of competitors analysed]

## Summary
[3-5 sentences: competitive landscape overview, our positioning, and the biggest opportunity]

## Competitive Landscape

### Direct Competitors
For each:
- **[Competitor Name]** — [one-line description]
  - Stage: [pre-launch / early / growth / mature / declining]
  - Founded: [year] | Funding: [amount or "bootstrapped"] | Team: [size estimate]
  - Pricing: [model and range]
  - GTM: [primary strategy]
  - Strengths: [2-3 bullets]
  - Weaknesses: [2-3 bullets]
  - Key takeaway: [what we can learn]

### Indirect Competitors
[Same format]

### Incumbents & DIY Alternatives
[Same format, briefer]

### Emerging Players
[Same format, briefer]

## Observable GTM Patterns
- **Dominant acquisition model**: [PLG / sales-led / community-led / etc. — as observed]
- **Pricing models seen**: [what competitors charge and how — from public pricing pages]
- **Common channels**: [where competitors are visibly present]
- **What works in this market**: [patterns from successful competitors]
- **What doesn't work**: [patterns from struggling competitors]

## Gap Assessment (concept-validation mode only)

### Market State
[Virgin / Sparse / Crowded — with evidence]

### Incumbent Quality
[Dominant-and-loved / Dominant-but-resented / Fragmented-and-mediocre / Emerging-and-unproven — with evidence]

### Gap Quality
[Clear unmet need / Underserved segment / UX/approach gap / Minor improvement / No meaningful gap — with evidence]

### Verdict
[Proceed to Customer Discovery / Pivot concept / Abandon — with reasoning]

## Market Gaps
- **[Gap title]** — [Description of the unmet need, who it affects, and why it exists]
- ...

## Competitive Positioning

### Market Gaps Identified
[Specific gaps, unserved segments, and white-space opportunities with evidence]

### Lessons from Competitors
- **Do this** (learned from [competitor]): [what they did well that we should emulate]
- **Avoid this** (learned from [competitor]): [what they did poorly that we should avoid]
- ...

Positioning recommendations ("where we fit", "recommended positioning") belong in `/positioning`.

<!-- Include this section only when downstream impact is Minor or Major. Omit entirely for None. -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote from downstream doc]"
   - **Now**: [what this skill's output says instead]

[For Major only:]
> **Recommended action**: Run `/reconcile-research` to audit and fix all affected downstream documents.

## Next Steps

**Recommended:** [first matching item from step 6]

**Other options:**
- [remaining conditional items from step 6 — only include items whose conditions are met]

## Signals for Downstream Research

> Raw signals captured during research. These are unvalidated observations —
> use the linked skill to verify, validate, and explore alternatives.

### → /positioning
- [signal]: positioning gaps identified in the landscape
- [signal]: category whitespace or unclaimed territory
- [signal]: differentiation opportunities from competitor weaknesses

### → /gtm
- [signal]: competitor channel strategies observed
- [signal]: pricing models and tiers seen across competitors
- [signal]: messaging patterns that appear effective

### → /monetization
- [signal]: competitor pricing tiers and structures
- [signal]: freemium vs. paid patterns in the market
- [signal]: enterprise pricing signals from competitor pages

### → /value-prop-canvas
- [signal]: competitor strengths and weaknesses mapped to customer jobs
- [signal]: unmet customer needs revealed by competitor gaps
- [signal]: value delivery patterns across the landscape
```

### `research/competitive-analysis-search-log.md` (or `research/{slug}/competitive-analysis-search-log.md`)
Raw research log — every search query, key findings with source attribution, and the reasoning behind categorisation and positioning recommendations.

### `research/.progress.yaml`
Update only when active-path evidence changes a deferred product path's status, reason, evidence refs, revisit trigger, or next skill. Use `product_paths` terminology instead of branch terminology. When writing manifest entries, include `pipeline_stage: competitive-analysis` on the active path entry.

Create the `research/` (or `research/{slug}/`) directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Use web search extensively.** This skill's value comes from real, current market data — not assumptions or hallucinated competitor names. Every competitor cited must come from a web search result.
- **Cite sources.** When stating facts about competitors (funding, features, pricing), note where the information came from.
- **Be honest about uncertainty.** If information couldn't be verified, say so. Don't fabricate metrics.
- **Stay in analysis mode.** Do not propose product changes, architecture, features, or positioning recommendations — product changes are for `/spec-interview` and `/mvp-gap`; positioning is for `/positioning`.
- **Focus on actionable insights.** Raw competitor lists are easy; the value is in the synthesis — gaps, patterns, positioning angles.
- **Do not overwrite existing `research/competitive-analysis.md`** (or `research/{slug}/competitive-analysis.md`) without asking the user first.
- **Keep research current.** Prefer recent sources (last 12 months). Flag any information that may be outdated.
- **Search breadth over depth initially.** Cast a wide net to find all competitors before going deep on each one. It's better to identify 15 competitors and research 8 deeply than to miss half the landscape.
- **Present before writing.** Never write output files until findings have been presented to the user and validated through the checkpoint questions. The user must see and approve the analysis before anything is written to disk.

## Context Gathering

**Step 1 — Scope questions.** Before researching, ask the user 1–3 questions via `AskUserQuestion` to understand: their product/service, target audience, and what they hope to learn or decide from this research.

**Step 2 — Research.** Conduct research scoped by the user's answers.

**Step 3 — Findings validation.** Before building the alignment page, present the 3–5 most important findings and ask the user to validate or correct any critical assumptions.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/competitive-analysis-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
