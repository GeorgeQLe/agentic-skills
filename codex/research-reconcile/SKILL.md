---
name: research-reconcile
description: Cross-document consistency audit across research outputs — find contradictions, stale assumptions, and gaps
version: 1.2.0
argument-hint: "[audit|fix] [all|icp|pricing|journey|enterprise|feedback|specs]"
---

# Research Reconcile — Cross-Document Consistency Audit

Checks that research documents tell a consistent story. Finds contradictions between ICP and pricing, stale assumptions that customer feedback has invalidated, journey stages that metrics don't cover, and other cross-document gaps. Think of it as a linter for research coherence rather than structure.

## Process

### 0. App Scope Resolution (Monorepo Support)

Before determining mode and scope, detect the app structure:

1. If `$ARGUMENTS` specifies an app name matching a subdirectory of `research/`, scope the audit to that app.
2. If `research/` contains subdirectories (excluding files), list them. If the user hasn't specified a scope, reconcile per-app (each app's docs independently) plus cross-app checks.
3. If no subdirectories exist, proceed with flat structure (single-product mode).

When app scope `{app}` is active:
- Scan `research/{app}/` for documents instead of `research/`
- Also check `research/icp.md` (cross-app overview) for cross-references
- Specs are in `specs/{app}/` instead of `specs/`

### 1. Determine Mode and Scope

Parse `$ARGUMENTS`:

- **Mode**: `audit` (default, read-only) or `fix` (apply approved changes, write reconciliation report)
- **Scope**: `all` (default), `icp`, `pricing`, `journey`, `enterprise`, `feedback`, or `specs`

### 2. Inventory Research Documents

Scan `research/` for main documents. Skip files matching `*-search-log.md` and `*-interview.md` — these are raw logs, not assertion-bearing documents.

**Expected documents** (not all need to exist):
- `research/icp.md` (cross-app overview), `research/{app}/icp.md` (per-app)
- `research/competitive-analysis.md` (or `research/{app}/competitive-analysis.md`)
- `research/journey-map.md` (or `research/{app}/journey-map.md`)
- `research/metrics.md` (or `research/{app}/metrics.md`)
- `research/gtm.md` (or `research/{app}/gtm.md`)
- `research/monetization.md` (or `research/{app}/monetization.md`)
- `research/enterprise-icp.md` (or `research/{app}/enterprise-icp.md`)
- `research/customer-feedback.md` (or `research/{app}/customer-feedback.md`)

When `research/` contains subdirectories, scan each `research/{app}/` for per-app documents.

**Stop condition**: If fewer than 2 research documents exist, display a message and exit — there's nothing to reconcile.

### 3. Extract Claims

Launch a **subagent per document** to extract structured claims. Each subagent reads one file and returns claims in these categories:

| Category | Examples |
|----------|----------|
| **ICP targets** | Primary persona, company size, industry, geography |
| **Pain points** | Problems the product solves, severity rankings |
| **Budget signals** | Willingness to pay, price sensitivity, deal size |
| **Channels** | Acquisition channels, distribution strategy |
| **Messaging** | Value propositions, positioning statements |
| **Pricing** | Model type, price points, tier structure, usage limits |
| **Journey stages** | Stage names, transitions, aha moments, activation criteria |
| **Metrics** | North star, per-stage metrics, thresholds |
| **Competitors** | Named competitors, positioning relative to them |
| **Deal-killers** | Enterprise blockers, compliance requirements |
| **Feedback verdicts** | Validated assumptions, invalidated assumptions, new findings |

Each claim includes the source file, section heading, and a direct quote for traceability.

### 4. Cross-Reference Checks

Launch **subagents per scope group** to run pairwise checks. Only run checks where both documents in a pair exist.

#### `icp` scope — ICP vs all downstream (11 checks)

Requires: `research/icp.md` + at least one downstream document.

| # | Check | Documents | What to flag |
|---|-------|-----------|--------------|
| 1 | User profile consistency | ICP ↔ Journey Map | Journey references personas not defined in ICP |
| 2 | Pain point coverage | ICP ↔ Competitive Analysis | Competitive analysis addresses pains not in ICP, or misses ICP pains |
| 3 | Pain point → feature mapping | ICP ↔ Journey Map | Journey stages that don't map to any ICP pain point |
| 4 | Budget signal → pricing alignment | ICP ↔ Monetization | Pricing exceeds ICP budget signals, or ignores stated willingness-to-pay |
| 5 | Channel consistency | ICP ↔ GTM | GTM targets channels the ICP doesn't use, or misses primary ICP channels |
| 6 | Messaging ↔ value prop alignment | ICP ↔ GTM | GTM messaging doesn't reflect ICP's top pain points or value props |
| 7 | Market landscape agreement | ICP ↔ Competitive Analysis | ICP market sizing contradicts competitive analysis market data |
| 8 | Feedback invalidation | ICP ↔ Customer Feedback | Feedback explicitly invalidates ICP assumptions still stated as fact |
| 9 | Metric coverage of ICP goals | ICP ↔ Metrics | ICP success criteria not tracked by any metric |
| 10 | ICP ↔ enterprise profile conflicts | ICP ↔ Enterprise ICP | Base ICP and enterprise ICP contradict on overlapping fields |
| 11 | Geography/segment consistency | ICP ↔ GTM | GTM targets geographies or segments not mentioned in ICP |

#### `pricing` scope — GTM vs Monetization coherence (7 checks)

Requires: `research/gtm.md` + `research/monetization.md`.

| # | Check | What to flag |
|---|-------|--------------|
| 1 | Revenue model agreement | GTM and Monetization describe different revenue models |
| 2 | Price point consistency | GTM pricing references don't match Monetization's price points |
| 3 | Tier structure alignment | GTM tier names/features don't match Monetization tier definitions |
| 4 | Upgrade trigger consistency | GTM conversion triggers contradict Monetization's upgrade triggers |
| 5 | Expansion metric alignment | GTM growth metrics don't match Monetization's expansion revenue drivers |
| 6 | Aha moment → pricing gate | Monetization gates features before the aha moment defined in Journey Map |
| 7 | Free tier scope | GTM's free tier description contradicts Monetization's free tier limits |

#### `journey` scope — Journey Map vs Metrics/GTM/Monetization (7 checks)

Requires: `research/journey-map.md` + at least one of Metrics/GTM/Monetization.

| # | Check | What to flag |
|---|-------|--------------|
| 1 | Stage name consistency | Metrics or GTM reference journey stages by different names |
| 2 | Metric coverage per stage | Journey stages with no corresponding metric in Metrics |
| 3 | Aha moment agreement | Journey Map, Metrics, and Monetization define different aha moments |
| 4 | Activation criteria consistency | Journey Map activation ≠ Metrics activation definition |
| 5 | Channel → stage mapping | GTM channels don't map to the discovery/awareness stages in Journey Map |
| 6 | Conversion trigger alignment | Journey Map conversion triggers ≠ GTM conversion triggers |
| 7 | Retention stage coverage | Journey Map has retention stages that Metrics doesn't track |

#### `enterprise` scope — Enterprise ICP vs base docs (6 checks)

Requires: `research/enterprise-icp.md` + at least one base document.

| # | Check | What to flag |
|---|-------|--------------|
| 1 | Profile field conflicts | Enterprise ICP contradicts base ICP on overlapping demographics |
| 2 | Deal-killer coverage | Enterprise deal-killers not addressed in Journey Map or Monetization |
| 3 | Stakeholder journey gaps | Enterprise stakeholders have no corresponding journey in Journey Map |
| 4 | Pricing tier fit | Monetization tiers don't include an enterprise tier matching Enterprise ICP needs |
| 5 | Lifecycle stage coverage | Enterprise evaluation→deployment→renewal lifecycle not reflected in Metrics |
| 6 | Compliance gap propagation | Enterprise compliance requirements not reflected in scale-audit or journey |

#### `feedback` scope — Customer Feedback propagation (5 checks)

Requires: `research/customer-feedback.md` + at least one other document.

| # | Check | What to flag |
|---|-------|--------------|
| 1 | Invalidated assumptions still present | Feedback marks an assumption as invalidated, but the source doc still states it as fact |
| 2 | New findings not captured | Feedback identifies new pain points or personas not reflected upstream |
| 3 | Severity mismatches | Feedback downgrades a pain point's severity, but ICP still lists it as primary |
| 4 | Staleness alerts | Documents haven't been updated since feedback was last appended |
| 5 | Contradicted positioning | Feedback contradicts GTM messaging or competitive positioning |

#### Monorepo checks (3 checks)

Triggered when `research/` contains app subdirectories (e.g., `research/{app}/icp.md`).

| # | Check | What to flag |
|---|-------|--------------|
| 1 | Cross-ICP consistency | App-specific ICPs (`research/{app}/icp.md`) contradict each other on shared market assumptions |
| 2 | Shared pain point divergence | Same pain point described differently across app ICPs |
| 3 | Channel overlap conflicts | App ICPs target the same channel with conflicting messaging |

### 5. Aggregate and Classify Findings

Collect all findings from the cross-reference subagents. Classify each by severity:

| Severity | Meaning | Example |
|----------|---------|---------|
| **Error** | Active contradiction — two documents assert incompatible facts | ICP says "SMB $50/mo budget" but Monetization's cheapest tier is $200/mo |
| **Warning** | Stale or gap — may be intentional but should be reviewed | Journey Map defines 5 stages but Metrics only covers 3 |
| **Info** | Suggestion — not wrong, but could be improved | GTM mentions a channel not discussed in ICP (may be a valid expansion) |

### 6. Walk Through Findings Interactively

Present findings **one at a time** using `request_user_input` (in Plan mode) or a plain-text question (otherwise), ordered by severity (Errors first, then Warnings, then Info). For each finding, present:

```
### [Scope] — [Check Name]
**Severity**: Error | Warning | Info
**Documents**: file-a.md ↔ file-b.md

**file-a.md** says:
> [direct quote from source]

**file-b.md** says:
> [direct quote from source]

**Contradiction**: [one-sentence description of the conflict]
**Recommended resolution**: [which document to update and why, based on dependency direction]

How would you like to resolve this? (Options: accept recommendation, update the other document instead, skip/defer, or provide custom instructions)
```

**Dependency direction** informs the recommended resolution:
- Upstream contradiction (e.g., ICP vs Journey Map) → recommend updating the downstream document
- Customer feedback contradictions → recommend updating upstream (feedback is ground truth)
- Peer contradictions (e.g., GTM vs Monetization) → note both are peers and ask which is authoritative

Wait for the user's response before proceeding to the next finding. Collect all decisions into a resolution list.

### 7. Apply Resolutions

After walking through all findings:

- **Audit mode** (default): Compile a summary of all findings and user decisions. Do not modify any files. Display the summary with the user's stated resolution for each item.
- **Fix mode** (if `fix` was specified):
  1. Apply all user-approved changes to the research documents.
  2. Write `research/reconciliation-report.md` as an audit trail:

```markdown
# Reconciliation Report — [date]

## Resolved
- [Error/Warning description] — resolved by updating [file] per user decision: "[user's stated resolution]"

## Deferred
- [Description] — user chose to skip

## Info (no action)
- [Info items the user chose not to act on]
```

  3. Re-run the audit to confirm fixes resolved the flagged issues.

## Constraints

- **Read-only by default.** Only modify files when explicitly invoked with `fix` mode.
- **Never auto-resolve contradictions.** Errors always require user input on which side is correct. Use `request_user_input` (or plain-text question) for each finding individually.
- **Show evidence.** Every finding must include direct quotes from both documents.
- **Respect dependency direction.** Upstream documents are presumed authoritative over downstream, except customer feedback which is ground truth.
- **No false positives.** If uncertain whether something is a real contradiction, classify it as Info, not Error.
- **Skip absent documents.** Only run checks where both documents in a pair exist. Never flag a missing document as an error — that's `$workflow`'s job.
- **Use subagents** for claim extraction (one per document) and cross-reference checks (one per scope group) to parallelize work.
- **Idempotent.** Running audit twice with no changes between should produce identical output.
