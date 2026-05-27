---
name: creator-positioning
description: Define a creator or founder-media channel's audience promise, category, differentiated wedge, proof, and anti-positioning
type: research
version: v0.1
argument-hint: "[channel slug or audit path]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Creator Positioning

Invoke as `$creator-positioning`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Turn audit, portfolio, and benchmark evidence into a clear creator positioning brief.

## Inputs

- Prefer `research/creator-presence/<slug>.md` when present for cross-platform career, public promise, proof asset, and owned-presence context.
- Prefer `research/youtube/channel-audit-<slug>.md`, `portfolio-<slug>.md`, and `peer-benchmark-<slug>.md`.
- Read product/company context when present: `README.md`, `research/**`, `specs/**`, and product docs.
- If no channel evidence or dossier exists, run `$youtube-channel-audit` for YouTube-only work or `$creator-presence-dossier` for mixed-platform, LinkedIn-first, career-signal, or owned-presence work.

## Output

Create the `research/youtube/` directory if it does not exist.

Write `research/youtube/creator-positioning-<slug>.md` with:

- Current audience promise.
- Best-fit viewer segment and non-viewer.
- Category or subcategory the channel should be understood within.
- Differentiated wedge and why it is credible.
- Proof assets: videos, founder experience, product evidence, community evidence.
- Anti-positioning: topics, formats, and promises to avoid.
- One-sentence positioning statement.
- Implications for `$content-programming` and `$series-spec`.

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

Follow the shared Alignment Page convention in CLAUDE.md. Output: `alignment/creator-positioning-{topic}.html`.

## Constraints

- Position from evidence; do not invent credentials or audience demand.
- Treat the dossier as an optional preferred creator context source, not a replacement for YouTube audit evidence when the work is channel-only.
- Prefer a narrow owned wedge over a broad generic creator promise.
- If the evidence supports multiple incompatible positions, present the trade-off and recommend one.
