---
name: youtube-portfolio
description: Map a YouTube channel's video portfolio by archetype, strategic role, performance concentration, and cleanup or refresh opportunities
type: research
version: v0.2
argument-hint: "[channel slug or audit path]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube Portfolio

Invoke as `/youtube-portfolio`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Turn channel-audit evidence into a portfolio view: what the channel has published, what roles those videos serve, where performance concentrates, and what should be kept, refreshed, or reviewed.

## Evidence And Feedback Handling

Treat user feedback as input to evaluate, not as automatic ground truth.

- For factual, evidentiary, technical, or source-backed claims: verify against available evidence. If the user appears to misunderstand the evidence or states something factually incorrect, push back clearly and cite the evidence. Do not rewrite findings merely to agree.
- For taste, brand, positioning preference, risk appetite, prioritization, or other subjective judgment calls: weigh user feedback heavily and adapt the recommendation unless it conflicts with verified evidence.
- When feedback mixes facts and preference, separate them explicitly: correct the factual part, then incorporate the preference where it is a legitimate judgment call.
- When uncertain, say what is known, what is inferred, and what would change the conclusion.

## Inputs

- Prefer `research/youtube/channel-audit-<slug>.md`.
- Also read `research/youtube/youtube-audit-<slug>-*.md` and `research/youtube/data/<slug>/videos-*.jsonl` when present.
- If no evidence exists, run `/youtube-channel-audit <channel>` first.

## Output

Create the `research/youtube/` directory if it does not exist.

Write `research/youtube/portfolio-<slug>.md` with:

- Portfolio summary for `@GeorgeLe`, `WeeklyG`, `WeeklySOTA`, or the supplied channel.
- Archetype matrix: founder update, interview, tutorial, analysis, vlog, launch, reaction, teardown, other.
- Content-role matrix: acquisition, trust-building, proof, education, launch support, community retention, cleanup candidate.
- Concentration analysis: top 1, top 3, top 5 view share and whether the portfolio is over-dependent on outliers.
- Cadence and recency: gaps, stale clusters, and durable series.
- Cleanup register: `keep`, `refresh`, `unlist/private candidate`, `needs human review`.
- Portfolio recommendation: where the next planning work should focus.

## Approved Artifact Handoff

After an approved synthesized write, explicit write/update mode, or any direct artifact mutation:

- List every created or updated synthesized artifact path in the final response.
- State the verification performed, such as readback, schema/check command, or why no executable verification applies for a Markdown-only strategy artifact.
- Check and report the relevant git status for intended artifacts when the project is a git repository. If intended artifacts are modified or untracked, make the next action shipping, committing, or an explicit dirty-artifact handoff before recommending downstream strategy work.
- Do not imply the research workflow is complete while approved artifacts remain untracked or uncommitted unless the user explicitly asked not to ship.
- If stopping for approval before writing, the approval request remains the next action; do not include downstream routing.

## Intent-Aware Routing

Before applying the default `## Next-Skill Routing` sequence, classify the user's immediate intent and route to the missing action that best serves that intent:

- Strategy refresh: recommend the missing or stale positioning, programming, portfolio, metrics, or product-media artifact.
- Recording prep: recommend the missing series spec, script, build proof, walkthrough guide, or validation artifact needed before recording.
- Upload prep: recommend packaging, title/thumbnail, description, chapters, or final metadata work before broader strategy work.
- Performance review: recommend metrics, cadence, portfolio, peer benchmark, or owner-analytics export work before new content planning.
- Owner analytics or private/manual platform evidence: route to an explicit manual/guide handoff instead of inventing unavailable metrics.
- Dirty intended artifacts: route to shipping/commit/handoff first, not another creator strategy skill.

Use the default next-skill sequence only when no stronger user intent, missing artifact, manual blocker, or dirty-artifact handoff applies.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/youtube-portfolio-{topic}.html`.

## Constraints

- Use observed metadata and transcript evidence; do not make channel-management claims from memory.
- Cleanup recommendations are review flags, not destructive instructions.
- If portfolio evidence is thin, state the gap and route to `/youtube-channel-audit`.
