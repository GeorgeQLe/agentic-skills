---
name: customer-feedback
description: Ingest and synthesize customer feedback — categorize findings against ICP and journey map, maintain a running log
type: research
version: 1.2.0
argument-hint: "[file path, pasted text, or empty to be prompted]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Customer Feedback — Ingest & Synthesize

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in the conversation for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

Append-only skill that ingests customer feedback, categorizes findings against ICP and journey map, and maintains a running synthesis. Each run adds a session; the synthesis section regenerates across all sessions.

## Soft Prerequisites

- Read `research/icp.md` (or `research/{app}/icp.md` in monorepo mode) if it exists — grounds categorization in ICP segments and pain points.
- Read `research/journey-map.md` (or `research/{app}/journey-map.md` in monorepo mode) if it exists — tags findings to journey stages.

These are not required. The skill works without them but categorization will be less precise.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before checking prerequisites, determine the app scope:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, use it.
2. If `research/` contains subdirectories (excluding files), list them and ask the user which app to target. If only one subdirectory exists, use it automatically.
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
- **Empty**: Use AskUserQuestion to ask the user to paste or describe the feedback

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

Use AskUserQuestion to present the categorized findings to the user:

- Show each finding with its classification, tags, and evidence
- Ask: "Does this categorization look right? Any findings I've miscategorized or missed?"
- If the user corrects anything, update before writing

### 5. Check Staleness Triggers

Count the number of **Wrong** and **New** findings across ALL sessions (including previous ones):

- If 3+ **Wrong** findings relate to ICP assumptions: recommend re-running `/icp`
- If 3+ **Wrong** findings relate to journey stages: recommend re-running `/journey-map`
- If 3+ **New** findings suggest an unserved segment: recommend re-running `/icp`

Display these recommendations after the categorized findings.

### 6. Populate Next Steps

Before writing, check which files exist and synthesis results to populate the `## Next Steps` section contextually. Include 3–5 applicable items with "Pick one:" framing:

- IF staleness alert for ICP: `/icp` — Re-run discovery — feedback has invalidated key assumptions
- IF staleness alert for journey map: `/journey-map` — Re-map journeys — real behavior differs from mapped experience
- IF 3+ New findings: `/brainstorm` — Generate ideas for newly revealed customer needs
- IF New findings relate to a gap: `/spec-interview [topic]` — Spec a solution for the most impactful new finding
- IF no staleness alerts: `/research-roadmap` — Check overall project status
- IF feedback came from experiment results: `/assumption-tracker` — Update assumption validation status with experiment findings
- IF 3+ research docs exist and no `research/assumption-tracker.md`: `/assumption-tracker` — Build the assumptions register to track what feedback is validating

**Impact-aware adjustments:**
- IF downstream impact is **Major**: prepend `/reconcile-research — [N] conflicts found in downstream docs` as the first item
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
- **Major** (3+ conflicts OR a foundational assumption changed — e.g., primary pain point invalidated, willingness-to-pay signals contradicted, key customer behavior pattern disproved): Display conflicts and strongly recommend `/reconcile-research`.

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
> **Recommended action**: Run `/reconcile-research` to audit and fix all affected downstream documents.

### Next Steps

Pick one:
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
