---
name: landing-copy
description: Generate or audit landing page copy grounded in upstream research — hero, benefits, social proof, pricing, FAQ, and CTAs
type: research
version: 1.0.0
argument-hint: "[generate|audit] [optional: focus section e.g. \"hero\", \"pricing\", \"FAQ\"]"
---

# Landing Copy — Research-Grounded Landing Page Copy

Dual-mode skill that either **generates** complete landing page copy from upstream research artifacts or **audits** existing copy against codebase reality, research drift, and conversion best practices. Every claim in the generated copy links back to a research source so nothing is hand-waved.

## Prerequisites

- **Hard**: None. Works with just a README or codebase — greenfield projects can use it immediately.
- **Soft** (enhancement tiers — display the applicable tier to the user before starting):

  | Tier | Research Docs Present | Copy Quality |
  |------|-----------------------|--------------|
  | 1 | None — only README / codebase | Functional but generic; many claims will be ungrounded |
  | 2 | `positioning.md` + `icp.md` | Targeted messaging with real pain points and value props |
  | 3 | Tier 2 + `gtm.md` + `competitive-analysis.md` + `journey-map.md` | Full funnel copy with differentiation and onboarding flow |
  | 4 | Tier 3 + `customer-feedback.md` + `monetization.md` + `metrics.md` | Production-grade copy with social proof, pricing, and data-backed claims |

  Read each if it exists (respect `{app}/` prefix when monorepo scope is active):
  - `research/positioning.md` — market category, positioning statement, unique attributes, value mapping
  - `research/gtm.md` — messaging framework, one-liner, channel strategy, launch plan
  - `research/icp.md` — ICP segments, pain points, value props, trigger events, customer language
  - `research/journey-map.md` — onboarding flow, aha moment, task flows
  - `research/customer-feedback.md` — real customer quotes, recurring themes, objections
  - `research/monetization.md` — pricing tiers, packaging, free vs paid boundaries
  - `research/metrics.md` — north star metric, activation/engagement/retention metrics
  - `research/competitive-analysis.md` — competitor positioning, strengths, weaknesses, market gaps

## Process

### 0. App Scope Resolution (Monorepo Support)

Before anything else, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`

### 1. Determine Mode

Parse `$ARGUMENTS`:

- **`generate`** (default): Create complete landing page copy from research + codebase context
- **`audit`**: Check existing copy against codebase reality, research drift, and conversion best practices

If mode is `audit`, jump to the **Audit Mode** section below.

---

## Generate Mode

### 2. Load Context

Read all available research docs listed in Prerequisites (soft). For each:
- Note which docs exist and which are missing
- Extract the key claims, data points, and customer language that will ground copy sections

Also read:
- `CLAUDE.md`, `README.md` — product name, description, core value proposition
- Key source files (routes, components, package.json) — to verify feature claims against reality

Determine the enhancement tier and display it to the user:
> **Research coverage: Tier [N]** — [tier description from table above].
> Missing docs that would improve copy: [list missing soft prerequisites with their `/skill` commands].

### 3. Web Research

Use WebSearch with **4–6 category-aware queries**:

1. **Landing page best practices** — "SaaS landing page copy best practices [year]", "high-converting landing page structure"
2. **Category-specific examples** — "[market category from positioning.md] landing page examples", "best [category] homepage copy"
3. **Hero section patterns** — "above the fold copy patterns", "hero section conversion optimization"
4. **Social proof patterns** — "social proof landing page examples", "trust signals [category]"
5. **CTA optimization** — "call to action best practices SaaS", "pricing page CTA patterns"
6. **Objection handling** — "FAQ section landing page", "reducing purchase anxiety [category]"

### 4. Interview

Use AskUserQuestion for each topic (batch where possible):

**Brand Voice & Tone**
- "What tone should the copy strike? (e.g., professional but approachable, bold and provocative, calm and reassuring)"
- "Any words or phrases you always use? Any you'd never use?"
- "Show me 1–2 examples of copy you admire (competitors, other products, anything)."

**Claims Boundaries**
- "What claims can we make confidently? (e.g., 'saves 10 hours/week' — do you have data for this?)"
- "Any claims we must NOT make? (legal, regulatory, unverified metrics)"
- "Do you have specific numbers we can cite? (users, uptime, speed benchmarks, customer count)"

**Social Proof Availability**
- "Do you have customer quotes or testimonials we can use? Company logos?"
- "Any press mentions, awards, or notable integrations?"
- "Case study data? (before/after metrics, customer stories)"

**CTA Strategy**
- "What's the primary CTA? (e.g., 'Start free trial', 'Book a demo', 'Get started')"
- "Secondary CTA? (e.g., 'See pricing', 'Watch demo', 'Read docs')"
- "Any urgency or scarcity elements? (limited beta, launch pricing)"

**Structural Constraints**
- "Any sections you definitely want or definitely don't want?"
- "Target audience for this page — is it the primary ICP or a broader audience?"
- "Any existing brand guidelines, style guides, or design constraints?"

### 5. Generate Sections (Parallel Subagents)

Launch **10 parallel subagents**, one per section. Each subagent receives the full research context and interview answers, and produces copy for its section with inline source attribution.

**Section assignments:**

1. **Hero** — Headline, subheadline, primary CTA, supporting visual description.
   Sources: `positioning.md` (positioning statement, market category), `gtm.md` (one-liner, messaging framework).

2. **Problem Agitation** — Articulate the pain the audience feels today.
   Sources: `icp.md` (pain points, trigger events), `customer-feedback.md` (customer language, recurring complaints).

3. **Solution Introduction** — Introduce the product as the answer to the pain.
   Sources: `positioning.md` (market category, unique attributes), `icp.md` (value props).

4. **Benefits** — 3–5 benefit blocks (not features — outcomes).
   Sources: `positioning.md` (value mapping), `icp.md` (value props per segment).

5. **How It Works** — 3–4 step walkthrough from signup to value.
   Sources: `journey-map.md` (onboarding flow, aha moment, task flows).

6. **Social Proof** — Testimonials, logos, metrics, trust signals.
   Sources: `customer-feedback.md` (quotes, themes), `metrics.md` (north star, key numbers), interview answers.

7. **Use Cases / Audience** — Who this is for, with scenario-specific hooks.
   Sources: `icp.md` (user profiles, segments), `journey-map.md` (use-case task flows).

8. **Pricing** — Tier summary, value anchoring, CTA per tier.
   Sources: `monetization.md` (pricing tiers, packaging, free vs paid).

9. **FAQ / Objection Handling** — Address top objections and common questions.
   Sources: `competitive-analysis.md` (competitor strengths to counter), `customer-feedback.md` (objections, concerns).

10. **Final CTA + Footer** — Closing argument, urgency, secondary links.
    Sources: `gtm.md` (launch strategy, urgency elements), interview CTA answers.

Each subagent must:
- Write copy for its section only
- Add `<!-- Source: research/[file].md — [specific section/claim] -->` comments after each grounded claim
- Flag any claim that has NO research backing as `<!-- UNGROUNDED: [claim] — no research source available -->`
- Respect brand voice and claims boundaries from the interview

### 6. Assemble and Present

Combine all 10 sections into a complete landing page copy document. Present to the user with:

- The full copy, section by section
- A **Research Grounding Summary** table:

  | Section | Grounded Claims | Ungrounded Claims | Primary Sources |
  |---------|----------------|-------------------|-----------------|
  | Hero | N | N | positioning.md, gtm.md |
  | ... | ... | ... | ... |

- If any section has >50% ungrounded claims, flag it: "⚠ [Section] has limited research backing — consider running [/skill] first."

Ask: "Ready to write this to `research/landing-copy.md`? Any sections to revise?"

### 7. Write Output

Only after user confirms, write:
- `research/landing-copy.md` (or `research/{app}/landing-copy.md`) — the full copy with source attribution
- `research/landing-copy-interview.md` (or `research/{app}/landing-copy-interview.md`) — interview Q&A log

### 8. Downstream Impact Check

Landing copy is a terminal artifact — it doesn't feed into other research skills. Perform a lightweight check:

- If `research/gtm.md` exists and has a `## Messaging Framework` section, compare the hero headline and one-liner against it. Flag if they've diverged.
- If `research/positioning.md` exists, confirm the positioning statement is reflected in the hero and solution sections.

**Classify impact**:
- **None**: No conflicts. Skip display.
- **Minor**: 1–2 messaging inconsistencies. Display inline.
- **Major**: Hero/positioning fundamentally misaligned. Recommend `/research-reconcile`.

### 9. Next Steps

Include 3–5 applicable items with "Pick one:" framing:

- IF no `research/positioning.md`: `/positioning` — Positioning drives hero copy; running it would significantly strengthen the headline
- IF no `research/customer-feedback.md`: `/customer-feedback` — Real customer quotes would replace placeholder social proof
- IF no `research/monetization.md`: `/monetization` — Pricing section is thin without a monetization strategy
- IF no `research/journey-map.md`: `/journey-map` — "How It Works" section would benefit from mapped onboarding flows
- ALWAYS: "Implement the copy in your codebase — the source attribution comments show where each claim comes from"
- IF `research/gtm.md` exists: `/gtm` — Refresh messaging framework to align with the final landing copy

---

## Audit Mode

### A1. Locate Existing Copy

Search for landing page copy in order of priority:
1. `research/landing-copy.md` (or `research/{app}/landing-copy.md`)
2. `src/pages/index.*`, `src/app/page.*`, `app/page.*`, `pages/index.*`
3. `index.html`, `public/index.html`
4. Any file matching `*landing*`, `*homepage*` in common source directories

If no copy is found, tell the user and suggest running `/landing-copy generate` instead.

### A2. Extract Verifiable Claims

Parse the located copy and extract every verifiable claim:
- Feature claims ("supports X", "integrates with Y")
- Performance claims ("10x faster", "99.9% uptime")
- Social proof claims ("trusted by N companies", "rated #1")
- Positioning claims ("the only X that Y", "unlike Z")
- Pricing claims (tier names, prices, feature lists)

### A3. Run Audit Categories (4 Parallel Subagents)

**Category 1: Staleness vs. Codebase**
- Check feature claims against actual codebase (do the features exist? have any been removed?)
- Check integration claims (are the integrations still present?)
- Flag features in codebase NOT mentioned in copy (missed selling points)

**Category 2: Drift from Research Docs**
- Compare claims against `research/positioning.md` (has the positioning changed?)
- Compare against `research/gtm.md` (has the messaging framework changed?)
- Compare against `research/icp.md` (are we still targeting the same audience?)
- Flag copy that contradicts current research

**Category 3: Conversion Best Practices**
- Check for missing sections (no hero? no social proof? no CTA?)
- Evaluate CTA strength and placement
- Check for above-the-fold value proposition clarity
- Assess objection handling coverage

**Category 4: Broken Promises**
- Claims the product can't currently deliver
- Metrics that are outdated or unverifiable
- Social proof that may be stale (old customer counts, outdated quotes)

### A4. Classify and Present Findings

Classify each finding:
- **Error**: Copy contradicts codebase or makes undeliverable claims
- **Warning**: Copy drifts from research or misses best practices
- **Info**: Suggestions for improvement, missed opportunities

Present interactively, errors first:

```
## Audit Results

### Errors (N)
1. **[Section]**: "[exact claim]" — [why it's wrong] (Source: [file:evidence])
...

### Warnings (N)
...

### Info (N)
...
```

Ask: "Want me to generate updated copy for any of these sections?"

### A5. Read-Only

Audit mode does **not** write any files. It is purely diagnostic. If the user wants fixes, suggest running `/landing-copy generate` with the audit findings as context.

---

## Output

### `research/landing-copy.md` (or `research/{app}/landing-copy.md`)

```markdown
# Landing Page Copy

> Based on: [list all research docs used]
> Date: [current date]
> Enhancement Tier: [1-4]

## Hero
<!-- Source: research/positioning.md — Positioning Statement -->
<!-- Source: research/gtm.md — One-Liner -->

**Headline**: [headline]
**Subheadline**: [subheadline]
**Primary CTA**: [CTA text] → [CTA destination]
**Supporting visual**: [description of what the hero image/video should convey]

## Problem Agitation
<!-- Source: research/icp.md — Pain Points -->
<!-- Source: research/customer-feedback.md — Customer Language -->

[2-3 paragraphs articulating the pain]

## Solution Introduction
<!-- Source: research/positioning.md — Market Category, Unique Attributes -->

[1-2 paragraphs introducing the product as the answer]

## Benefits

### [Benefit 1 — Outcome-Focused Title]
<!-- Source: research/positioning.md — Value Mapping -->
[Benefit description]

### [Benefit 2]
<!-- Source: research/icp.md — Value Props -->
[Benefit description]

### [Benefit 3]
[Benefit description]

## How It Works

### Step 1: [Action]
<!-- Source: research/journey-map.md — Onboarding Flow -->
[Description]

### Step 2: [Action]
[Description]

### Step 3: [Action — The Aha Moment]
<!-- Source: research/journey-map.md — Aha Moment -->
[Description]

## Social Proof
<!-- Source: research/customer-feedback.md — Quotes -->
<!-- Source: research/metrics.md — Key Numbers -->

[Testimonials, logos, metrics]

## Use Cases

### For [Audience Segment 1]
<!-- Source: research/icp.md — User Profiles -->
[Scenario-specific hook and value]

### For [Audience Segment 2]
[Scenario-specific hook and value]

## Pricing
<!-- Source: research/monetization.md — Pricing Tiers -->

| [Tier 1] | [Tier 2] | [Tier 3] |
|-----------|-----------|-----------|
| [Price] | [Price] | [Price] |
| [Features] | [Features] | [Features] |
| [CTA] | [CTA] | [CTA] |

## FAQ
<!-- Source: research/competitive-analysis.md — Competitor Strengths -->
<!-- Source: research/customer-feedback.md — Objections -->

**Q: [Common objection as question]**
A: [Answer that addresses the objection]

**Q: [Question]**
A: [Answer]

## Final CTA
<!-- Source: research/gtm.md — Launch Strategy -->

[Closing argument]
**[Primary CTA]** | [Secondary CTA]

---

## Research Grounding Summary

| Section | Grounded | Ungrounded | Primary Sources |
|---------|----------|------------|-----------------|
| Hero | N | N | [sources] |
| Problem Agitation | N | N | [sources] |
| Solution | N | N | [sources] |
| Benefits | N | N | [sources] |
| How It Works | N | N | [sources] |
| Social Proof | N | N | [sources] |
| Use Cases | N | N | [sources] |
| Pricing | N | N | [sources] |
| FAQ | N | N | [sources] |
| Final CTA | N | N | [sources] |

### Ungrounded Claims
[List each ungrounded claim and what research would be needed to ground it]

### Missing Research
[List research docs that would most improve copy quality, with /skill commands]

## Next Steps

Pick one:
- [conditional items from step 9]
```

### `research/landing-copy-interview.md` (or `research/{app}/landing-copy-interview.md`)
Interview Q&A log — brand voice decisions, claims boundaries, social proof inventory, CTA strategy, structural constraints.

Create the `research/` directory if it doesn't exist.

## Constraints

- **Present before writing.** Never write output files until the full copy has been presented and the user confirms.
- **Source-attribute every claim.** Every factual claim in the copy must have an inline HTML comment citing its research source. If no source exists, mark it `UNGROUNDED`.
- **Respect claims boundaries.** Never include claims the user explicitly ruled out in the interview. Never fabricate metrics or social proof.
- **Do not overwrite existing `research/landing-copy.md`** without asking the user first.
- **Copy ≠ design.** This skill produces the words, not the layout. Visual suggestions are limited to "supporting visual" descriptions, not mockups.
- **Audit mode is read-only.** Never write files in audit mode.
- **Brand voice is law.** Once the user defines tone and vocabulary in the interview, every section must respect it — no section should feel like it was written by a different voice.
- **Check `tasks/manual-todo.md`** — if it exists, read it. If it lists items related to landing page copy, messaging, or marketing, incorporate those requirements into your work and call them out to the user.


## Default Shipping Contract

- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
