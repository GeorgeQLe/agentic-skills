---
name: customer-feedback
description: Ingest and synthesize customer feedback — categorize findings against ICP and journey map, maintain a running log
version: 1.0.0
argument-hint: [file path, pasted text, or empty to be prompted]
---

# Customer Feedback — Ingest & Synthesize

Append-only skill that ingests customer feedback, categorizes findings against ICP and journey map, and maintains a running synthesis. Each run adds a session; the synthesis section regenerates across all sessions.

## Soft Prerequisites

- Read `research/icp.md` if it exists — grounds categorization in ICP segments and pain points.
- Read `research/journey-map.md` if it exists — tags findings to journey stages.

These are not required. The skill works without them but categorization will be less precise.

## Process

### 1. Load Context

- Read `research/icp.md` if it exists — extract ICP segments, user profiles, pain points, value props
- Read `research/journey-map.md` if it exists — extract journey stages, use cases, critical moments
- Read `research/customer-feedback.md` if it exists — load all previous sessions for synthesis context

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

### 6. Write Output

Only after the user validates, write to `research/customer-feedback.md`:

**If the file doesn't exist**: Create it with the structure below.
**If the file exists**: Append the new session section, then regenerate the `## Synthesis` section at the top.

## Output

### `research/customer-feedback.md`

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

## Constraints

- **Append-only.** Never delete or overwrite previous sessions. Only the `## Synthesis` section at the top is regenerated.
- **Present before writing.** Never write until the user validates the categorization.
- **Tag to existing research.** When ICP and journey map exist, every finding must be tagged. When they don't exist, skip tagging but note "no ICP/journey context" in the session header.
- **Count across sessions.** Staleness triggers are based on cumulative findings, not just the current session.
- **Accept any format.** The skill should handle messy, unstructured input gracefully.
