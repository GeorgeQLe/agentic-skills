---
name: jtbd-needs
description: Ulwick/Christensen JTBD — identify jobs, map desired outcomes, score importance vs satisfaction, and segment ICP candidates by unmet needs
type: research
version: v0.0
invocation: sub-skill
parent: customer-discovery
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# JTBD Needs — Ulwick/Christensen Outcome-Driven Innovation

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

## Staged Research Workflow

Use this staged workflow for synthesized research or report outputs that would create or update canonical research, spec, or task files.

1. **Stage 1 - Research and clarify.** Perform the research, run required source/code checks, and ask any needed clarification questions. Write only a non-canonical working packet: flat mode uses `research/_working/preliminary-jtbd-needs-research.md`; product-path mode uses `research/{slug}/_working/preliminary-jtbd-needs-research.md`. Do not create or update canonical research, spec, or task files in Stage 1.
2. **Stage 2 - Review alignment.** Consume the working packet and build the `review` HTML alignment page. The page must render the full preliminary packet, evidence matrix, assumptions/confidence register, source coverage gaps, proposed canonical file changes, and approval gates. Stop for either feedback-only YAML or final compiled YAML.
3. **Stage 3 - Finalize approved artifacts.** Consume final compiled YAML only when it has no unresolved negative feedback. Apply approved edits first, archive the working packet, write the approved canonical artifacts, and convert the alignment page to `confirmed`.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. Push back clearly and cite the evidence when the user appears to misunderstand.
- For taste, prioritization, or subjective judgment calls: weigh user feedback heavily and adapt unless it conflicts with verified evidence.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Prerequisites

- **Hard**: ICP candidates from orchestrator working packet (`research/_working/preliminary-customer-discovery-research.md`) or `research/icp.md` (or `research/{slug}/icp.md`) must exist. If neither exists, tell the user to run `$customer-discovery` first and stop.
- **Soft**: `research/competitive-analysis.md`, `research/customer-feedback.md`, idea brief, specs, and codebase context when available.

## Process

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as the product/app name, not the ICP, audience, or segment label.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived` or legacy `status: abandoned`, stop and warn that the path is archived; do not write or update scoped outputs there.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths` on read and write back `active_paths` on manifest updates. Treat legacy `abandoned` as `archived`; exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`, and any `scope_path` under `research/_archive/` from active target selection.
4. If active product paths exist in the manifest, use those paths. If multiple active paths exist, ask which one to target unless this skill explicitly supports cross-path output.
5. If no active manifest target exists, list non-archived product directories under `research/`, excluding `research/_archive/` and dot directories. Auto-select only when exactly one exists; ask when multiple exist.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`.

### 1. Load Context

- Read ICP candidates from orchestrator working packet (`research/_working/preliminary-customer-discovery-research.md`) or `research/icp.md`
- Read idea brief (`research/idea-scope-brief.md`) if it exists
- Read `research/competitive-analysis.md` if it exists
- Read `research/customer-feedback.md` if it exists
- Read CLAUDE.md, README for product context
- Scan codebase and existing research for additional signal

### 2. Identify Jobs-to-be-Done

For each ICP candidate, identify the full job landscape:

**Functional jobs** — tasks and outcomes they need accomplished:
- Core tasks they hire a solution to perform
- Desired outcomes for each task (measurable results)
- Related tasks that precede, follow, or co-occur with the core job
- Frequency and context of job execution

**Social jobs** — how they want to be perceived:
- Professional reputation goals
- Peer perception and status signals
- Team/org perception of their decisions
- Industry credibility and thought leadership

**Emotional jobs** — how they want to feel:
- Confidence and control over outcomes
- Reduced anxiety about risks or unknowns
- Satisfaction and sense of progress
- Freedom from tedious or frustrating work

**Related jobs** — adjacent jobs that create context:
- Jobs performed immediately before and after
- Jobs that share the same workflow or trigger
- Jobs delegated to other roles that affect this one
- Jobs that compete for the same time/attention

**Consumption chain jobs** — jobs around acquiring, using, maintaining the solution:
- Evaluate and select solutions
- Onboard and learn the solution
- Integrate with existing workflow
- Maintain, update, and extend over time
- Migrate away when the job changes

### 3. Map Desired Outcomes

For each job, write Ulwick outcome statements following the canonical format:

`[Direction of improvement] + [performance metric] + [object of control] + [contextual clarifier]`

Direction of improvement: Minimize, Maximize, Increase, Reduce, Eliminate, Optimize

Examples:
- "Minimize the time it takes to identify qualified leads in a new market segment"
- "Reduce the likelihood of misallocating budget to underperforming channels"
- "Maximize the percentage of outreach messages that receive a response"
- "Minimize the number of tools required to complete end-to-end campaign analysis"

Write 8-15 outcome statements per core functional job, 3-5 per social/emotional job.

### 4. Score Importance & Satisfaction

For each outcome statement, score based on available evidence (research, feedback, competitive analysis, codebase signals):

- **Importance** (1-10): How important is achieving this outcome to the ICP candidate?
- **Current Satisfaction** (1-10): How well do existing solutions satisfy this outcome?

Calculate **Opportunity Score**: `Importance + max(Importance - Satisfaction, 0)`

Classify each outcome:
- **Underserved** (opportunity score ≥ 12): high importance, low satisfaction — prime innovation targets
- **Appropriately served** (opportunity score 8-11): adequate current solutions exist
- **Overserved** (opportunity score < 8): low importance or high satisfaction — potential to simplify/reduce

### 5. Segment by Unmet Needs

Cluster ICP candidates by shared patterns of underserved outcomes:

- Identify candidates with similar underserved outcome clusters
- Define natural segments based on shared unmet needs (not demographics)
- Map cross-segment patterns: outcomes underserved across all candidates
- Identify segment-specific opportunity areas unique to each cluster
- Rank segments by total addressable opportunity (sum of opportunity scores for underserved outcomes)
- Note which segments align with or diverge from demographic/firmographic ICP boundaries

### 6. Validate with User

Present jobs, outcomes, opportunity scores, and segment recommendations. Ask for corrections on:
- Job completeness: missing jobs or mischaracterized job importance
- Outcome accuracy: whether statements reflect real user language and priorities
- Scoring calibration: whether importance/satisfaction estimates match known reality
- Segment validity: whether proposed clusters reflect real behavioral differences

## Output

### `research/customer-discovery-jtbd-needs.md` (or `research/{slug}/customer-discovery-jtbd-needs.md`)

```markdown
# JTBD Needs Analysis

> Based on: [sources]
> Date: [current date]
> Methodology: Ulwick/Christensen Outcome-Driven Innovation

## ICP Candidate: [Name]

### Functional Jobs
| Job | Context | Frequency |
|-----|---------|-----------|
| [core task] | [when/where this job arises] | [how often] |

### Social & Emotional Jobs
| Type | Job | Evidence |
|------|-----|----------|
| Social | [how they want to be perceived] | [source] |
| Emotional | [how they want to feel] | [source] |

### Desired Outcomes & Opportunity Scores
| Outcome Statement | Job | Importance | Satisfaction | Opportunity Score | Classification |
|-------------------|-----|------------|--------------|-------------------|----------------|
| [direction] + [metric] + [object] + [context] | [parent job] | 1-10 | 1-10 | calculated | Underserved/Served/Overserved |

### Top Underserved Outcomes
1. [outcome] — Opportunity Score: [score]
2. [outcome] — Opportunity Score: [score]
3. [outcome] — Opportunity Score: [score]

## ICP Candidate: [Name 2]
...

## Opportunity Landscape
| Outcome | Candidate(s) | Importance | Satisfaction | Opportunity Score |
|---------|-------------|------------|--------------|-------------------|
| [outcome] | [who shares it] | [avg] | [avg] | [score] |

## Needs-Based Segments
### Segment: [Name]
- **Shared underserved outcomes**: [list]
- **ICP candidates in segment**: [list]
- **Total addressable opportunity**: [sum of opportunity scores]
- **Distinguishing characteristic**: [what unites them beyond demographics]

## Cross-Candidate Comparison
| Candidate | Top Underserved Outcome | Segment | Total Opportunity |
|-----------|------------------------|---------|-------------------|
| [name] | [highest-scoring outcome] | [segment] | [sum] |

## Evidence Matrix
| Claim | Evidence Source | Evidence Type | Confidence |
|-------|---------------|---------------|------------|
| [claim] | [source] | Observed/Inferred/Hypothesized | High/Medium/Low |
```

## Constraints

- Ground every job, outcome, and score in evidence from ICP candidates, research, specs, feedback, or codebase.
- Use Ulwick's canonical outcome statement format — do not shortcut to vague needs language.
- Prioritize underserved outcomes as innovation targets; do not optimize for overserved outcomes.
- Do not prescribe UI or architecture — describe the customer need, not the solution.
- Present findings before writing.
- Do not overwrite existing output without asking the user first.
- This is a sub-skill — do not emit next-step routing.

## Alignment Page

When this skill produces durable deliverables, build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/jtbd-needs-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
