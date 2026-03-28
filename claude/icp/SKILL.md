---
name: icp
description: Research-driven ICP discovery — web search + codebase analysis to identify multiple ICPs, pain points, value props, and cross-ICP prioritization
version: 2.0.0
argument-hint: <spec file path or concept/idea>
---

# ICP — Research-Driven Customer Discovery

Automated research that identifies **multiple ICP candidates**, maps their pain points and value props, scores them, and selects a primary ICP. Replaces the interview-driven approach with web search + codebase analysis. Input is a spec file path or a concept/idea as `$ARGUMENTS`.

The output preserves the canonical 7-section format at the top level (for downstream compatibility with `/plan-interview`, `/mvp-gap`, `/roadmap`) while adding multi-ICP analysis and cross-ICP prioritization.

## Process

### 1. Parse Input & Gather Context

**Read `$ARGUMENTS`:**
- If it's a file path, read the file for product/concept context
- If it's text, treat it as the concept or idea description
- If empty, check for `specs/spec.md`, `specs/plan.md`, or README for context — if nothing exists, ask the user what product or idea to research

**Read codebase (if it exists):**
Read CLAUDE.md, README, package config, key source files, routes, and data models to understand what's been built. This grounds the research in reality rather than pure market abstraction.

**Read existing specs** (`specs/icp.md`, `specs/mvp-gap.md`, etc.) if they exist — use as background context but do not treat as settled. This research may reshape direction.

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

Use WebFetch to pull in particularly relevant pages for deeper analysis when search snippets aren't enough.

### 3. Identify 2–5 ICP Candidates

From the research evidence, cluster findings into **2–5 distinct ICP candidates**. For each candidate, note:
- Who they are (role, company type, size)
- What pain evidence exists
- How accessible they are (can we reach them?)
- How much value we could deliver

### 4. Deep Research Per ICP

For each ICP candidate, run **targeted searches** to fill the 7-section framework:

- **Customer Profile** — buyer persona, triggers, budget authority, discovery channels
- **User Profile(s)** — daily users, technical sophistication, goals, frustrations
- **Current State Journey** — step-by-step workflow without our product
- **Pain Map** — where the current state breaks down, severity, frequency
- **Market Landscape** — alternatives they use, shortcomings, unaddressed gaps
- **Value Proposition** — our unique wedge for this specific ICP, the "aha moment"
- **Customer ↔ User Dynamics** — buying process, provisioning, adoption path

### 5. Score & Select Primary ICP

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

The ICP with the best combined score becomes the **Primary ICP** (occupies top-level sections in the output). If the scores are close, briefly note the trade-off.

### 6. Cross-ICP Analysis

Analyze across all ICP candidates:
- **Shared pains** — what pain points appear across multiple ICPs?
- **Conflicts** — where would serving one ICP hurt another?
- **Product line recommendations** — could different ICPs be served by different tiers/plans?
- **Build sequence** — which ICP to target first, second, third and why?
- **Lowest-hanging fruit x most value** — the prioritization sweet spot

### 7. Brief Validation

Ask the user **1–2 focused questions** to validate the primary ICP selection and any surprising findings. This is not a full interview — just a quick sanity check:
- "Based on research, [ICP X] looks like the strongest fit because [reasons]. Does this match your intuition, or is there a segment I'm missing?"
- If the research surfaced something unexpected, ask about it

Then finalize the output files.

## Output

Write two files:

### `specs/icp.md`

Structure — the **Primary ICP** fills the canonical top-level sections:

```markdown
# ICP: [Primary ICP Name]

> Primary ICP selected from [N] candidates. See Additional ICPs and Cross-ICP Analysis below.
> Research log: specs/icp-research.md

## Customer Profile
[Buyer persona, triggers, budget authority, discovery channels]

## User Profile(s)
[Daily user persona(s), technical sophistication, goals, frustrations]

## Current State Journey
[Step-by-step workflow without our product]

## Pain Map
[Where the current state breaks down — severity, frequency]

## Market Landscape
[Alternatives, their shortcomings, the unaddressed gap]

## Value Proposition
[Our unique wedge for this ICP, the "aha moment"]

## Customer ↔ User Dynamics
[Buying process, provisioning, adoption path]

## Additional ICPs

### [ICP 2 Name]
#### Customer Profile
...
#### User Profile(s)
...
#### Current State Journey
...
#### Pain Map
...
#### Market Landscape
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
```

### `specs/icp-research.md`

Raw research log containing:
- Every WebSearch query executed and why
- Key findings from each search (with source attribution)
- Evidence that supported or contradicted each ICP candidate
- The scoring rationale for primary ICP selection
- Any data gaps or areas where research was inconclusive

Create the `specs/` directory if it doesn't exist.

## Constraints

- **Stay in problem space.** Do not propose features, architecture, UI, or technical solutions. That is `/plan-interview`'s job.
- **Evidence-based.** Every claim in the ICP document must trace back to research evidence logged in `specs/icp-research.md`. Do not fabricate personas from assumptions.
- **In existing-project mode**, note misalignments between what's built and what the ICP research suggests, but do not prescribe fixes — that's `/mvp-gap`'s job.
- **Primary ICP must use the canonical 7 top-level `##` sections** — downstream skills (`/plan-interview`, `/mvp-gap`, `/roadmap`, `/competitive-analysis`) parse these exact headers.
- **Do not overwrite existing `specs/icp.md`** without asking the user first.
- **Minimum research depth**: at least 8 WebSearch queries before identifying ICP candidates, then at least 2–3 targeted queries per candidate.
