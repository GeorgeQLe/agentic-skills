---
name: icp
description: Research-driven ICP discovery — web search + codebase analysis to identify multiple ICPs, pain points, value props, and cross-ICP prioritization
type: research
version: 3.4.0
argument-hint: <spec file path or concept/idea>
---

# ICP — Research-Driven Customer Discovery

Automated research that identifies **multiple ICP candidates**, maps their pain points and value props, scores them, and selects a primary ICP. Replaces interview-driven approaches with web search + codebase analysis. Input is a spec file path or a concept/idea as `$ARGUMENTS`.

The output preserves the canonical 9-section format at the top level (for downstream compatibility with `/plan-interview`, `/mvp-gap`, `/roadmap`, `/journey-map`) while adding multi-ICP analysis and cross-ICP prioritization.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before parsing input, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Parse Input & Gather Context

**Read `$ARGUMENTS`:**
- If it's a file path, read the file for product/concept context
- If it's text, treat it as the concept or idea description
- If empty, check for `specs/spec.md`, `specs/plan.md`, or README for context — if nothing exists, ask the user what product or idea to research

**Read codebase (if it exists):**
Read CLAUDE.md, README, package config, key source files, routes, and data models to understand what's been built. This grounds the research in reality rather than pure market abstraction.

**Read existing research** (`research/icp.md`, `research/competitive-analysis.md`, etc.) and specs if they exist — use as background context but do not treat as settled. This research may reshape direction.

**Detect monorepo structure:**
Check for monorepo indicators (`turbo.json`, `pnpm-workspace.yaml`, `lerna.json`, `nx.json`, or `package.json` workspaces). If found, identify sub-apps or packages that serve **distinct user-facing products** (ignore shared libraries, configs, and internal tooling). When multiple distinct products exist, run the full ICP process separately for each — produce `research/{app-name}/icp.md` per app, plus a unified `research/icp.md` that cross-references all app-level ICPs with a top-level prioritization of which app/ICP to pursue first. If the monorepo contains only one user-facing product, proceed as normal with a single `research/icp.md`.

**Migrate old convention:** If `research/icp-{app}.md` files exist (old naming), offer to move them to `research/{app}/icp.md` (and corresponding search logs to `research/{app}/icp-search-log.md`). Create the subdirectories as needed.

### 2. Broad Market Research

Use WebSearch with **8–12 diverse query strategies** to cast a wide net. Log every search query and key findings to the research log.

Query strategies (adapt to the specific domain):
1. **Direct persona searches** — "who buys [category]", "[category] buyer persona"
2. **Pain point searches** — "[domain] biggest challenges", "[workflow] frustrations"
3. **Market segment searches** — "[category] market segments", "[category] by company size"
4. **Trend searches** — "[category] trends 2025 2026", "future of [domain]"
5. **Competitor user searches** — "[competitor] customers", "[competitor] case studies", "[competitor] reviews"
6. **Forum/community searches** — "[domain] reddit complaints", "[domain] community pain points"
7. **Job posting searches** — "[related role] job description responsibilities" (reveals workflows)
8. **Industry report searches** — "[category] market report", "[category] TAM"
9. **Switching trigger searches** — "why switch from [incumbent]", "[category] migration"
10. **Adjacent market searches** — "[related category] users", "[upstream/downstream] tools"
11. **Geographic/regulatory searches** (if the domain has regional constraints) — "[category] by region", "[domain] regulations by country", "[category] adoption [region]"
12. **Named account searches** (B2B) — "[competitor] customer list", "companies using [incumbent]", "[industry] companies that [trigger event]", "[category] case studies"

Use WebFetch to pull in particularly relevant pages for deeper analysis when search snippets aren't enough.

### 3. Identify ICP Candidates — Present & Validate

From the research evidence, cluster findings into **2–5 distinct ICP candidates**. For each candidate, note:
- Who they are (role, company type, size)
- What pain evidence exists
- How accessible they are (can we reach them?)
- How much value we could deliver

**Checkpoint 1 — Present candidates to the user.** Use the AskUserQuestion tool to show the ICP candidates with a brief rationale for each — cite the pain evidence found, accessibility signals, and value delivery reasoning from your search findings for each candidate. Then ask:
- "Do any of these surprise you? Is there a segment I'm missing?"
- "Any of these clearly wrong for your situation?"

Incorporate feedback before proceeding.

### 4. Deep Research Per ICP

For each validated ICP candidate, run **targeted searches** to fill the 9-section framework:

- **Customer Profile** — buyer persona, budget authority, discovery channels. Include two conditional sub-sections:
  - **Geographic Focus** (include only if the product has regulatory, language, compliance, or market-specific constraints) — initial target geography/region, why that region first, and expansion sequence. Search for "[category] by region", "[domain] regulations by country".
  - **Named Accounts** (include for B2B ICPs) — 5–10 real companies that fit this ICP. For each, note company name, approximate size, industry, and why they fit (e.g., uses the incumbent, recently hit a trigger event, posted a relevant job listing). Search for "[competitor] customer list", "companies using [incumbent]", "[industry] companies that [trigger event]".
- **User Profile(s)** — daily users, technical sophistication, goals, frustrations
- **Trigger Events** — what causes someone to start looking NOW? Job changes, growth milestones, compliance deadlines, tool sunsets, contract renewals, team scaling pain, funding events, new regulations. Search for "[category] buying triggers", "why companies switch [category]", "[incumbent] churn reasons". Rank by frequency and urgency.
- **Current State Journey** — step-by-step workflow without our product
- **Pain Map** — where the current state breaks down, severity, frequency
- **Market Landscape** — alternatives they use, shortcomings, unaddressed gaps
- **Market Sizing** — TAM (total addressable market), SAM (serviceable), SOM (obtainable). Search for "[category] market size", "[category] TAM", "[category] number of companies". Use company counts, average deal size signals, and segment data to build bottom-up estimates. Flag confidence level (strong data vs. rough extrapolation).
- **Value Proposition** — our unique wedge for this specific ICP, the "aha moment"
- **Customer ↔ User Dynamics** — buying process, provisioning, adoption path

### 5. Score & Select Primary ICP — Present & Validate

Build a **Value x Accessibility** scoring matrix:

**Value score** (how much we can help):
- Pain severity and frequency
- Willingness to pay (budget signals)
- Size of the segment
- Alignment with what we've built (if codebase exists)

**Accessibility score** (how easy to reach and convert):
- Can we reach them through available channels?
- How long is the sales cycle?
- How complex is the buying process?
- Is there an existing community we can tap?

**Checkpoint 2 — Present the scoring matrix and primary ICP selection to the user.** Use the AskUserQuestion tool to show the full matrix with scores and rationale, then ask:
- "Does this ranking match your intuition? Any factors I'm not weighing correctly?"
- If scores are close between candidates, ask which trade-offs the user prefers

Incorporate feedback before proceeding.

### 6. Cross-ICP Analysis — Present & Validate

Analyze across all ICP candidates:
- **Shared pains** — what pain points appear across multiple ICPs?
- **Conflicts** — where would serving one ICP hurt another?
- **Product line recommendations** — could different ICPs be served by different tiers/plans?
- **Build sequence** — which ICP to target first, second, third and why?
- **Lowest-hanging fruit x most value** — the prioritization sweet spot

**Checkpoint 3 — Present the cross-ICP analysis and recommended build sequence to the user.** Use the AskUserQuestion tool to show the analysis with evidence: shared pains with source data from each ICP, conflicts with specific examples, and build sequence rationale grounded in the scoring matrix. Then ask:
- "Does this sequencing make sense for where you are right now?"
- If conflicts exist between ICPs, ask the user to weigh in on the trade-offs

Incorporate feedback before proceeding.

### 7. Populate Next Steps

Before writing, check which files exist to populate the `## Next Steps` section contextually. Include 3–5 applicable items with "Pick one:" framing:

- ALWAYS: `/competitive-analysis` — Research competitors and market gaps for this ICP
- IF no `specs/` directory or it's empty: `/plan-interview` — Design the solution for this ICP's pain points
- IF `specs/` exist but no `research/journey-map.md`: `/journey-map` — Map how this ICP flows through the product
- IF codebase exists: `/mvp-gap` — Evaluate what's built against this ICP
- IF `research/competitive-analysis.md` exists: `/brainstorm` — Generate ideas from ICP needs + competitive gaps

**Impact-aware adjustments:**
- IF downstream impact is **Major**: prepend `/research-reconcile — [N] conflicts found in downstream docs` as the first item
- IF downstream impact is **Minor**: annotate relevant skill suggestions with "(stale — [brief description])"

### 8. Final Review & Write

Present the **complete findings summary** to the user — primary ICP, key sections, cross-ICP analysis, and build sequence. Ask:
- "Ready to write this to `research/icp.md`? Anything to adjust first?"

Only after the user confirms, write the output files.

### 9. Downstream Impact Check

After writing, check for downstream research documents that may be affected by what was just decided. Only check documents that exist on disk.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/competitive-analysis.md`
- `research/journey-map.md`
- `research/metrics.md`
- `research/gtm.md`
- `research/monetization.md`
- `research/enterprise-icp.md`
- `research/customer-feedback.md`

For each existing downstream document:
1. Read it — focus on `> Based on:` header, `## Summary`, and sections that reference concepts this skill just defined or changed
2. Identify **specific conflicts**: claims, assumptions, or references that contradict what was just decided. Examples:
   - A persona name or description that no longer matches the ICP
   - Competitive analysis positioning built on a different primary ICP
   - Journey stages mapped for a different user profile
   - Metric targets anchored to assumptions about a different ICP segment
   - GTM messaging addressing pain points that shifted
   - Monetization pricing tied to willingness-to-pay signals from a different ICP
   - Enterprise ICP referencing a primary ICP that changed
   - Customer feedback categorized against ICP segments that were restructured
3. Note each conflict: downstream file, section, the stale claim (quote it), and what it should now say

**Classify the impact**:
- **None**: No downstream documents exist, or no conflicts found. Skip display entirely.
- **Minor** (1–2 small conflicts): Display conflicts to user inline.
- **Major** (3+ conflicts OR a foundational assumption changed — e.g., primary ICP shifted, key pain points redefined, user profiles restructured, value proposition changed): Display conflicts and strongly recommend `/research-reconcile`.

Display to the user after showing the written file confirmation. This should be quick — one read per downstream doc, scan for conflicts against key decisions. Not a deep reconciliation.

## Output

Write two files:

### `research/icp.md`

Structure — the **Primary ICP** fills the canonical top-level sections:

```markdown
# ICP: [Primary ICP Name]

> Primary ICP selected from [N] candidates. See Additional ICPs and Cross-ICP Analysis below.
> Search log: research/icp-search-log.md

## Customer Profile
[Buyer persona, budget authority, discovery channels]

### Geographic Focus
[Include only if the product has regulatory, language, or market-specific constraints.
 Initial target geography/region, why that region first, expansion sequence.]

### Named Accounts
[Include for B2B ICPs. 5–10 real companies that fit this profile.
 For each: company name, approximate size, industry, and why they fit.]

## User Profile(s)
[Daily user persona(s), technical sophistication, goals, frustrations]

## Trigger Events
[What causes them to start looking NOW — ranked by frequency and urgency.
 Job changes, growth milestones, compliance deadlines, tool sunsets, contract renewals, etc.]

## Current State Journey
[Step-by-step workflow without our product]

## Pain Map
[Where the current state breaks down — severity, frequency]

## Market Landscape
[Alternatives, their shortcomings, the unaddressed gap]

## Market Sizing
[TAM / SAM / SOM with methodology and confidence level.
 Bottom-up: number of target companies × estimated deal size.
 Top-down: industry reports, competitor revenue signals.]

## Value Proposition
[Our unique wedge for this ICP, the "aha moment"]

## Customer ↔ User Dynamics
[Buying process, provisioning, adoption path]

## Additional ICPs

### [ICP 2 Name]
#### Customer Profile
[Include Geographic Focus and Named Accounts sub-sections where applicable]
...
#### User Profile(s)
...
#### Trigger Events
...
#### Current State Journey
...
#### Pain Map
...
#### Market Landscape
...
#### Market Sizing
...
#### Value Proposition
...
#### Customer ↔ User Dynamics
...

### [ICP 3 Name]
...

## Cross-ICP Analysis

### Prioritization Matrix
| ICP | Value Score | Accessibility Score | Combined | Rationale |
|-----|------------|-------------------|----------|-----------|
| ... | | | | |

### Shared Pain Points
[Pains that appear across multiple ICPs]

### Conflicts & Trade-offs
[Where serving one ICP would hurt another]

### Product Line Recommendations
[How different ICPs could map to tiers, plans, or product variants]

### Recommended Build Sequence
[Which ICP to target first → second → third, with reasoning]

<!-- Include this section only when downstream impact is Minor or Major. Omit entirely for None. -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote from downstream doc]"
   - **Now**: [what this skill's output says instead]

[For Major only:]
> **Recommended action**: Run `/research-reconcile` to audit and fix all affected downstream documents.

## Next Steps

Pick one:
- `/competitive-analysis` — Research competitors and market gaps for this ICP
- [conditional items from step 7 — only include items whose conditions are met]
```

### `research/icp-search-log.md`

Raw research log containing:
- Every WebSearch query executed and why
- Key findings from each search (with source attribution)
- Evidence that supported or contradicted each ICP candidate
- The scoring rationale for primary ICP selection
- Any data gaps or areas where research was inconclusive

Create the `research/` directory if it doesn't exist.

### Monorepo Output Convention

When a monorepo has multiple distinct user-facing products, write:
- `research/{app-name}/icp.md` — full 9-section ICP per app (same structure as above)
- `research/{app-name}/icp-search-log.md` — search log per app
- `research/icp.md` — unified cross-app summary that references each app-level ICP, with a top-level prioritization of which app/ICP combination to pursue first

## Constraints

- **Stay in problem space.** Do not propose features, architecture, UI, or technical solutions. That is `/plan-interview`'s job.
- **Evidence-based.** Every claim in the ICP document must trace back to research evidence logged in `research/icp-search-log.md`. Do not fabricate personas from assumptions.
- **In existing-project mode**, note misalignments between what's built and what the ICP research suggests, but do not prescribe fixes — that's `/mvp-gap`'s job.
- **Primary ICP must use the canonical 9 top-level `##` sections** — downstream skills (`/plan-interview`, `/mvp-gap`, `/roadmap`, `/journey-map`, `/competitive-analysis`) parse these exact headers.
- **Do not overwrite existing `research/icp.md`** without asking the user first.
- **Minimum research depth**: at least 8 WebSearch queries before identifying ICP candidates, then at least 2–3 targeted queries per candidate.
- **Present before writing.** Never write output files until findings have been presented to the user and validated through the checkpoint questions. The user must see and approve the analysis before anything is written to disk.
