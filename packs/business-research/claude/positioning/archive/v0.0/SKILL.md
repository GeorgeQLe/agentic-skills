---
name: positioning
description: Strategic positioning (April Dunford style) — competitive alternatives, unique attributes, value, target segment, market category
type: research
version: v0.0
argument-hint: "[optional: focus area e.g. \"category\", \"vs competitor X\"]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Positioning — Strategic Product Positioning

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Develops rigorous product positioning using the "Obviously Awesome" methodology (April Dunford). Determines competitive alternatives, unique attributes, customer value, target segment, and market category. Positioning is upstream of messaging — it determines *how you frame the product category itself*.

## Prerequisites

- **Hard**: `research/icp.md` (or `research/{app}/icp.md`) must exist. If not, tell the user to run `/icp` first and stop.
- **Hard**: `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`) must exist. If not, tell the user to run `/competitive-analysis` first and stop.
- **Soft**: Read these if they exist:
  - `research/journey-map.md` — where value is delivered, the aha moment
  - `research/customer-feedback.md` — real customer language about what makes the product different
  - `research/monetization.md` — pricing context for value perception

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`

### 1. Load Context

- Read `research/icp.md` — ICP segments, pain points, value props, trigger events, current-state journey
- Read `research/competitive-analysis.md` — competitor landscape, positioning, strengths/weaknesses, market gaps
- Read other soft prerequisite files if they exist
- Read CLAUDE.md, README, and key source files for product context

### 2. Research Positioning Approaches

Use WebSearch with **4-6 targeted queries**:

1. **Category definition** — "how [category] is defined", "[category] vs [adjacent category]"
2. **Positioning examples** — "[competitor] positioning statement", "how [competitor] describes itself"
3. **Category creation** — "creating new category [domain]", "[domain] category leadership"
4. **Customer language** — "[category] how customers describe", "[domain] buyer vocabulary"
5. **Positioning frameworks** — "obviously awesome positioning", "April Dunford [category]"

### 3. Step 1 — Competitive Alternatives (What Would Customers Use Instead?)

NOT just direct competitors. Include:
- **Direct competitors** — products in the same category
- **Adjacent solutions** — products in nearby categories that solve the same pain differently
- **DIY/manual workarounds** — spreadsheets, manual processes, hiring someone
- **Do nothing** — the status quo (this is often the real competitor)

Use AskUserQuestion to present and validate:
- "Here are the competitive alternatives I see. What would your best customers actually use if your product disappeared tomorrow?"

### 4. Step 2 — Unique Attributes (What Do You Have That Alternatives Don't?)

For each competitive alternative, identify what's genuinely different about this product:
- Features that alternatives lack
- Approach or philosophy that's fundamentally different
- Technical advantages (speed, accuracy, simplicity)
- Business model advantages (pricing structure, no lock-in)
- Community or ecosystem advantages

**Be ruthless.** Only include attributes that are truly unique, not "we also do X." If competitors also have it, it's table stakes, not positioning.

Use AskUserQuestion:
- "Are these genuinely unique? Would your most discerning customer agree these are different?"

### 5. Step 3 — Value (What Does Uniqueness Enable for Customers?)

Map each unique attribute to the customer value it creates:

| Unique Attribute | Customer Value | Evidence |
|-----------------|----------------|----------|
| [attribute] | [what it enables] | [from ICP, feedback, or research] |

Value categories:
- **Saves time** — enables faster outcomes
- **Saves money** — reduces cost vs. alternatives
- **Reduces risk** — prevents failures, compliance issues
- **Unlocks capability** — enables something previously impossible
- **Improves quality** — better outcomes than alternatives

Use AskUserQuestion:
- "Is this the value your customers actually experience, or the value you hope they'll experience?"

### 6. Step 4 — Target Segment (Who Cares Most About This Value?)

From the ICP analysis, identify the segment that values these unique attributes THE MOST. This is not the broadest market — it's the best-fit customer:

- Who has the most acute pain that your unique attributes address?
- Who would be most disappointed if the product disappeared?
- Who gets the most value from what makes you different (not just from the category)?

Use AskUserQuestion:
- "This is the segment I'd position for. Does this feel right, or is there a segment that values your uniqueness even more?"

### 7. Step 5 — Market Category (What Context Makes Your Value Obvious?)

This is the most consequential decision. The market category determines:
- Who you're compared against
- What features are expected (table stakes)
- What "good" looks like
- How buyers find you

Three strategies:
1. **Existing category** — position within a known category (e.g., "project management tool"). Best when the category is well-understood and you can win on a specific dimension.
2. **Subcategory** — carve out a niche within an existing category (e.g., "project management for creative teams"). Best when you serve a specific segment much better than generic tools.
3. **New category** — create a new category (e.g., "collaborative work management"). Best when existing categories don't capture your value — but expensive and slow.

Use WebSearch to research how customers and analysts describe the space. Present recommendation with reasoning:
- "I recommend positioning in [category/subcategory/new category] because [rationale]. Here's how it frames you against alternatives..."

### 8. Synthesize Positioning Statement

Combine all five steps into a positioning statement:

**For** [target segment]
**who** [key pain / trigger event]
**[product name] is a** [market category]
**that** [key value / unique benefit]
**Unlike** [primary competitive alternative]
**[product name]** [key differentiator]

Present the full positioning framework and statement to the user. Ask:
- "Does this positioning feel true to what your best customers experience?"
- "Would this change how you describe the product on your homepage?"
- "Ready to write this to `research/positioning.md`?"

### 9. Populate Next Steps

Include 3–5 applicable items with "Pick one:" framing:

- ALWAYS: `/lean-canvas` — Synthesize positioning + upstream research into a one-page business model before GTM
- IF no `research/journey-map.md`: `/journey-map` — Map the customer journey to ground the business model in reality
- IF no `research/gtm.md`: `/gtm` — Build go-to-market plan grounded in this positioning (after lean canvas)
- IF `research/gtm.md` exists: `/gtm` — Refresh messaging framework to align with positioning
- IF no `research/monetization.md`: `/monetization` — Positioning informs pricing — "premium" vs "value" positioning changes price expectations
- IF codebase exists: `/mvp-gap` — Check if the product delivers on the positioning promise

### 10. Write Output

Only after the user confirms, write the output files.

### 11. Downstream Impact Check

After writing, check for downstream research documents that may be affected.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/gtm.md`

For each existing downstream document:
1. Read it — focus on `## Messaging Framework` and `## Positioning vs. Competitors`
2. Identify conflicts where messaging doesn't align with the new positioning
3. Note each conflict: file, section, stale claim, what it should now say

**Classify the impact**:
- **None**: No downstream docs exist, or no conflicts. Skip display.
- **Minor** (1–2 small conflicts): Display inline.
- **Major** (3+ conflicts OR market category changed, primary alternative shifted, value framing changed): Display and recommend `/reconcile-research`.

## Output

### `research/positioning.md` (or `research/{app}/positioning.md`)

```markdown
# Positioning

> Based on: research/icp.md, research/competitive-analysis.md[, research/journey-map.md, research/customer-feedback.md]
> Date: [current date]
> Methodology: "Obviously Awesome" (April Dunford)

## Positioning Statement

**For** [target segment]
**who** [key pain / trigger event]
**[product name] is a** [market category]
**that** [key value / unique benefit]
**Unlike** [primary competitive alternative]
**[product name]** [key differentiator]

## Summary
[2-3 sentences: the positioning thesis — what category you're in, why, and what makes you different]

## Step 1: Competitive Alternatives

What customers would use if this product didn't exist:

| Alternative | Type | Strengths | Weaknesses |
|------------|------|-----------|------------|
| [alternative] | Direct / Adjacent / DIY / Status quo | [strengths] | [weaknesses] |

**Primary competitive alternative**: [the one most customers would default to]

## Step 2: Unique Attributes

What this product has that alternatives genuinely don't:

| Attribute | Why It's Unique | Table Stakes? |
|-----------|----------------|---------------|
| [attribute] | [explanation] | No — alternatives lack this |

**Attributes explicitly excluded** (table stakes):
- [common feature] — [which alternatives also have this]

## Step 3: Value Mapping

| Unique Attribute | Customer Value | Value Type | Evidence |
|-----------------|----------------|------------|----------|
| [attribute] | [what it enables] | Time / Money / Risk / Capability / Quality | [source] |

**Primary value**: [the single most important value customers get from what's unique]

## Step 4: Best-Fit Target Segment

**Segment**: [specific description]
**Why they care most**: [why this segment values the unique attributes more than others]
**From ICP**: [reference to ICP segment — how this aligns or narrows the ICP]

### Characteristics of Best-Fit Customers
- [characteristic 1]
- [characteristic 2]
- [characteristic 3]

### Who This Is NOT For
- [segment that's a bad fit and why]

## Step 5: Market Category

**Category**: [chosen category]
**Strategy**: [Existing category / Subcategory / New category]
**Why**: [rationale for this category choice]

### How This Category Frames Us
- **Compared against**: [who buyers will compare us to in this category]
- **Table stakes**: [what's expected in this category — we must have these]
- **Our edge**: [where we excel relative to category expectations]

### Categories Considered & Rejected
| Category | Why Considered | Why Rejected |
|----------|---------------|-------------|
| [category] | [reason] | [reason] |

## Positioning Implications

### For Messaging
[How this positioning should shape homepage copy, tagline, and pitch]

### For Product
[What this positioning means for feature prioritization — what to build, what to skip]

### For Sales
[How to talk about the product in sales conversations — what to emphasize, what to avoid]

### For Pricing
[How this positioning affects price perception — premium vs. value, what to anchor against]

<!-- Only include when downstream impact is Minor or Major -->
## Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote]"
   - **Now**: [what positioning says instead]

[For Major only:]
> **Recommended action**: Run `/reconcile-research` to audit and fix all affected downstream documents.

## Next Steps

Pick one:
- [conditional items from step 9]
```

### `research/positioning-search-log.md` (or `research/{app}/positioning-search-log.md`)
Raw research log — queries, findings, evidence for each positioning decision.

Create the `research/` directory if it doesn't exist.

## Task Classification

When this skill produces follow-up work, file it by execution semantics:

- Immediately actionable implementation or documentation work goes in `tasks/todo.md`.
- Human-only external actions tied to automated steps go in `tasks/manual-todo.md` with `_(blocks: Step N.X)_` or `_(after: Step N.X)_`; repo edits, SDK wiring, generated assets, local commands, tests, audits, and authenticated CLI/API work stay in `tasks/todo.md`.
- One-time condition-gated records, baselines, or future measurements go in `tasks/record-todo.md` with source, condition, non-blocking reason, evidence, and promotion rule.
- Cadence-based reviews, playtests, adoption checks, investor updates, retros, or docs-health checks go in `tasks/recurring-todo.md` with cadence, owner/agent, next due, evidence path, and escalation conditions.
- Do not put non-blocking records or recurring obligations in `tasks/todo.md` unless they have been explicitly promoted into current execution work.

## Constraints

- **Requires ICP + competitive analysis.** Positioning without knowing the customer and the competition is guesswork.
- **Customer-grounded.** Every positioning decision must connect to real customer behavior or research evidence, not aspirational branding.
- **Be honest about uniqueness.** If nothing is truly unique, say so — that's a critical finding. Don't manufacture differentiation.
- **Present before writing.** Never write output files until the positioning has been presented and validated.
- **Positioning ≠ messaging.** This skill produces the strategic foundation. Messaging (the actual copy and taglines) is `/gtm`'s job.
- **Do not overwrite existing `research/positioning.md`** without asking the user first.
- **One positioning per product.** Don't try to position differently for different segments — pick the best-fit segment and position for them.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/positioning-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/positioning-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Archive-First Replacement Policy

- Before replacing or substantively rewriting an existing canonical research/spec document (`research/**/*.md`, `specs/**/*.md`, or `docs/specifications/**/*.md`), copy the current file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.
- Preserve the archived snapshot exactly as it existed before the change; do not edit the archived copy after creating it.
- After the archive snapshot exists, write the updated document to the original canonical path.
- Report both the archive path and the updated canonical path in the final output.
- New files do not need archive snapshots. Append-only updates do not need archive snapshots unless an existing section is regenerated or rewritten.
- Keep any existing user approval requirement before overwriting or replacing a document; archiving does not replace asking when the skill already requires approval.

## Default Shipping Contract

- **Default next-step routing:** when reporting completion, include either `Recommended next skill: <command>` or the two-line pair `**Next work:** <specific task or "none">` and `**Recommended next command:** <one command or route>` so the next operator has a concrete handoff.
- If this skill creates or modifies tracked repository files, finish by committing and pushing all intended changes to the repository primary branch (`main` when present, otherwise `master`) before stopping, even if the user did not explicitly ask for commit/push.
- Do not leave tracked changes or unpushed commits behind. If unrelated tracked work is already present, either include it in sensible commits too or stop and explain the blocker.
- This contract does not override stricter safety rules about secrets, destructive history changes, release publication/tag confirmation, or production deploy confirmation.
