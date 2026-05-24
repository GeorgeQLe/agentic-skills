---
name: customer-feedback
description: Ingest and synthesize customer feedback — categorize findings against ICP and journey map, maintain a running log
type: research
version: v0.0
argument-hint: "[file path, pasted text, or empty to be prompted]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Customer Feedback — Ingest & Synthesize

Invoke as `$customer-feedback`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Append-only skill that ingests customer feedback, categorizes findings against ICP and journey map, and maintains a running synthesis. Each run adds a session; the synthesis section regenerates across all sessions.

## Soft Prerequisites

- Read `research/icp.md` (or `research/{app}/icp.md` in monorepo mode) if it exists — grounds categorization in ICP segments and pain points.
- Read `research/journey-map.md` (or `research/{app}/journey-map.md` in monorepo mode) if it exists — tags findings to journey stages.

These are not required. The skill works without them but categorization will be less precise.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If the session is already in Plan mode and there are 2-3 concrete choices, prefer `request_user_input`; otherwise ask in plain text. If only one subdirectory exists, use it automatically.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Read/write research from `research/{app}/` instead of `research/`
- Read/write specs from `specs/{app}/` instead of `specs/`
- Also read `research/icp.md` (cross-app overview) for broader context

### 1. Load Context

- Read `research/icp.md` (or `research/{app}/icp.md`) if it exists — extract ICP segments, user profiles, pain points, value props
- Read `research/journey-map.md` (or `research/{app}/journey-map.md`) if it exists — extract journey stages, use cases, critical moments
- Read `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`) if it exists — load all previous sessions for synthesis context

### 2. Ingest Feedback

Check `$ARGUMENTS`:
- **File path provided**: Read the file and use its contents as the feedback input
- **Text provided**: Use the argument text directly as feedback
- **Empty**: Ask the user to paste or describe the feedback. If the session is already in Plan mode and there are 2-3 concrete input-source choices, prefer `request_user_input`; otherwise ask in plain text.

Accept any format: interview notes, support tickets, survey responses, NPS comments, user testing observations, sales call notes, social media mentions, app store reviews.

### 3. Categorize Findings

For each distinct finding in the feedback:

1. **Classification**: One of:
   - **Confirmed** — validates an existing ICP assumption, pain point, or journey step
   - **Wrong** — contradicts an ICP assumption, pain point, or mapped journey
   - **New** — reveals something not captured in ICP or journey map

2. **ICP Tag** (when `research/icp.md` exists): Which ICP section does this relate to? (pain point, value prop, user profile, trigger event, etc.)

3. **Journey Stage** (when `research/journey-map.md` exists): Which journey stage does this touch? (discovery, evaluation, onboarding, aha moment, retention, etc.)

4. **Severity**: High / Medium / Low — based on how many users it affects and how strongly

5. **Quote or Evidence**: The specific words or behavior that support this finding

### 4. Present & Validate

Present the categorized findings to the user. If the session is already in Plan mode and there are 2-3 concrete validation choices, prefer `request_user_input`; otherwise ask in plain text:

- Show each finding with its classification, tags, and evidence
- Ask: "Does this categorization look right? Any findings I've miscategorized or missed?"
- If the user corrects anything, update before writing

### 5. Check Staleness Triggers

Count the number of **Wrong** and **New** findings across ALL sessions (including previous ones):

- If 3+ **Wrong** findings relate to ICP assumptions: recommend re-running `$icp`
- If 3+ **Wrong** findings relate to journey stages: recommend re-running `$journey-map`
- If 3+ **New** findings suggest an unserved segment: recommend re-running `$icp`

Display these recommendations after the categorized findings.

### 6. Populate Next Steps

Before writing, check which files exist and synthesis results to populate the `## Next Steps` section contextually. Include a **Recommended** item (the single highest-impact next step given current project state) with a one-line reason, followed by **Other options** (2–4 alternatives). Use this format in the output:

### Next Steps

**Recommended:** [recommended skill] — [one-line reason why this is the highest-impact next action given current state]

Other options:
- `$skill` — [description]
- ...

**Recommendation priority** (first applicable becomes the recommendation):
1. IF downstream impact is **Major**: recommend `$reconcile-research` — [N] conflicts found in downstream docs need resolution before other work
2. IF staleness alert for ICP: recommend `$icp` — feedback has invalidated key ICP assumptions that other research depends on
3. IF staleness alert for journey map: recommend `$journey-map` — real user behavior differs from mapped experience
4. IF 3+ New findings: recommend `$brainstorm` — newly revealed customer needs deserve solution exploration
5. IF no staleness alerts and no major findings: recommend `$research-roadmap` — check overall project status for the next priority

**Other options** (include all applicable items not chosen as recommended):
- IF staleness alert for ICP: `$icp` — Re-run discovery — feedback has invalidated key assumptions
- IF staleness alert for journey map: `$journey-map` — Re-map journeys — real behavior differs from mapped experience
- IF 3+ New findings: `$brainstorm` — Generate ideas for newly revealed customer needs
- IF New findings relate to a gap: `$spec-interview [topic]` — Spec a solution for the most impactful new finding
- IF no staleness alerts: `$research-roadmap` — Check overall project status
- IF feedback came from experiment results: `$assumption-tracker` — Update assumption validation status with experiment findings
- IF 3+ research docs exist and no `research/assumption-tracker.md`: `$assumption-tracker` — Build the assumptions register to track what feedback is validating

**Impact-aware adjustments:**
- IF downstream impact is **Minor**: annotate relevant skill suggestions with "(stale — [brief description])"
- If downstream impact has not been classified yet, run the downstream impact check against the proposed output before selecting the final recommendation. Do not emit a Minor/Major impact recommendation speculatively.

### 7. Write Output

Only after the user validates, write to `research/customer-feedback.md`:

**If the file doesn't exist**: Create it with the structure below.
**If the file exists**: Append the new session section, then regenerate the `## Synthesis` section at the top.

### 8. Downstream Impact Check

After writing, check for downstream research documents that may be affected by what was just decided. Only check documents that exist on disk.

**Downstream documents to check** (use `{app}/` prefix when app scope is active):
- `research/gtm.md`
- `research/monetization.md`

For each existing downstream document:
1. Read it — focus on `> Based on:` header, `## Summary`, and sections that reference concepts this skill just defined or changed
2. Identify **specific conflicts**: claims, assumptions, or references that contradict what was just decided. Examples:
   - Customer language or pain point framing in GTM messaging that feedback has invalidated
   - Pricing assumptions in monetization anchored to customer willingness-to-pay signals that have shifted
   - Channel strategy built on customer behavior patterns that new feedback contradicts
3. Note each conflict: downstream file, section, the stale claim (quote it), and what it should now say

**Classify the impact**:
- **None**: No downstream documents exist, or no conflicts found. Skip display entirely.
- **Minor** (1–2 small conflicts): Display conflicts to user inline.
- **Major** (3+ conflicts OR a foundational assumption changed — e.g., primary pain point invalidated, willingness-to-pay signals contradicted, key customer behavior pattern disproved): Display conflicts and strongly recommend `$reconcile-research`.

Display to the user after showing the written file confirmation. This should be quick — one read per downstream doc, scan for conflicts against key decisions. Not a deep reconciliation.

## Output

### `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`)

```markdown
# Customer Feedback

> Last updated: [current date]
> Sessions: [total count]

## Synthesis

[Regenerated each run. Summarizes patterns across ALL sessions:]

### Confirmed Assumptions
[ICP and journey assumptions that feedback consistently validates]

### Invalidated Assumptions
[ICP and journey assumptions that feedback contradicts — with evidence count]

### New Discoveries
[Findings not captured in any existing research — potential ICP updates or new journey stages]

### Staleness Alerts
[If 3+ Wrong/New findings accumulated, list which research docs should be re-run and why]

<!-- Only include the Downstream Impact section when impact is Minor or Major. Omit entirely for None. -->
### Downstream Impact

> Checked: [list of downstream docs checked]
> Impact: Minor | Major

#### Conflicts Found

1. **research/[file].md** — [Section Name]
   - **Stale**: "[exact quote from downstream doc]"
   - **Now**: [what this skill's output says instead]

[For Major only:]
> **Recommended action**: Run `$reconcile-research` to audit and fix all affected downstream documents.

### Next Steps

**Recommended:** `$skill` — [one-line reason]

Other options:
- [conditional items from step 6 — only include items whose conditions are met]

---

## Feedback Session: [date]

> Source: [file path, "pasted text", or "interview"]
> ICP context: [yes/no — whether research/icp.md was loaded]
> Journey context: [yes/no — whether research/journey-map.md was loaded]

### Findings

| # | Finding | Classification | ICP Tag | Journey Stage | Severity |
|---|---------|---------------|---------|---------------|----------|
| 1 | [finding] | Confirmed/Wrong/New | [tag] | [stage] | H/M/L |

### Details

#### Finding 1: [title]
**Classification**: [Confirmed/Wrong/New]
**Evidence**: "[quote or observation]"
**ICP Tag**: [which ICP section]
**Journey Stage**: [which stage]
**Severity**: [High/Medium/Low]
**Implication**: [what this means for the product]

[Repeat for each finding]

---

[Previous sessions remain below, newest first]
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

- **Append-only.** Never delete or overwrite previous sessions in `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`). Only the `## Synthesis` section at the top is regenerated.
- **Present before writing.** Never write until the user validates the categorization.
- **Tag to existing research.** When ICP and journey map exist, every finding must be tagged. When they don't exist, skip tagging but note "no ICP/journey context" in the session header.
- **Count across sessions.** Staleness triggers are based on cumulative findings, not just the current session.
- **Accept any format.** The skill should handle messy, unstructured input gracefully.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/customer-feedback-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.

**Discovery-specific gates.** Render evidence coverage, assumptions/confidence, recommended path, artifact destination, proposed file changes, approval, and post-approval route as gates before creating or updating canonical discovery artifacts.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/customer-feedback-{topic}.html`.

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
