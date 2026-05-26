---
name: youtube-peer-benchmark
description: Compare a channel against peer channels using evidence-backed portfolio, positioning, packaging, and performance benchmarks
type: research
version: v0.1
argument-hint: "<primary channel> <peer channel...> [--count N]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube Peer Benchmark

Invoke as `$youtube-peer-benchmark`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Benchmark one primary channel against comparable channels. Use this for creator channels, founder-led shows, and topic publications such as `@GeorgeLe`, `WeeklyG`, and `WeeklySOTA`.

## Workflow

1. Require one primary channel and at least one peer channel.
2. For each channel, ensure a current `$youtube-channel-audit` exists or run one with the same `--count`.
3. Read raw metadata from `research/youtube/data/<slug>/videos-*.jsonl` when available.
4. Write `research/youtube/peer-benchmark-<primary-slug>.md`.

## Report Sections

- Peer set rationale and caveats.
- Channel comparison table: videos analyzed, median views, views/day median, top-video concentration, transcript coverage.
- Positioning comparison: audience promise, topical wedge, category clarity.
- Portfolio comparison: archetypes, content roles, cadence, series usage.
- Packaging comparison: title patterns, thumbnail clarity, description/chapter quality.
- Opportunity gaps: formats or promises peers prove but the primary channel does not yet own.
- Strategic benchmark recommendation.

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

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/youtube-peer-benchmark-{topic}.html`.

## Constraints

- Do not compare channels without comparable evidence windows.
- Mark subscriber counts or external metrics as unavailable unless present in fetched metadata.
- Do not recommend copying peers; translate benchmark evidence into differentiated positioning.
