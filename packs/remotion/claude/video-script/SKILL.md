---
name: video-script
description: Draft a scene-by-scene video script with timing, visual direction, narration, and source attribution from upstream creator-media artifacts
type: planning
version: 1.0.0
argument-hint: "<topic or slug> [--type launch|explainer|demo|testimonial] [--duration short|medium|long] [--series <series-slug>]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Video Script

Invoke as `/video-script`.

Read upstream research and spec artifacts, interview on video goal and audience, then produce a scene-by-scene script with narration text, visual direction, timing, and source attribution.

## Prerequisites

At least one of these artifacts must exist:

- `research/youtube/product-led-media-map-<slug>.md`
- `specs/youtube/series-<slug>.md`
- `research/youtube/creator-positioning-<slug>.md`

Enhancement tiers based on available artifacts:

- **Tier 1:** Creator positioning only — voice but thin proof.
- **Tier 2:** + product-led-media-map — product-grounded claims.
- **Tier 3:** + series-spec — format-consistent episode.
- **Tier 4:** + journey-map + gtm — full-funnel narrative with aha moments and GTM messaging.

## Inputs

- `research/youtube/product-led-media-map-<slug>.md`
- `specs/youtube/series-<slug>.md`
- `research/youtube/creator-positioning-<slug>.md`
- `research/youtube/content-programming-<slug>.md`
- `research/journey-map.md` (or `research/{app}/journey-map.md`)
- `research/gtm.md` (or `research/{app}/gtm.md`)

## Process

0. Resolve arguments: topic/slug, video type (`launch`, `explainer`, `demo`, `testimonial`), duration (`short`, `medium`, `long`), optional series slug.
1. Load all available upstream artifacts. Determine enhancement tier.
2. Interview (AskUserQuestion): video goal, target audience, narrative approach, tone, production constraints.
3. Draft narrative arc using the type-specific template. Present for approval before proceeding.
4. Write scene-by-scene script: narration text, visual direction, on-screen text, music cues, timing, source attribution.
5. Present complete script with duration estimate, asset requirements, and ungrounded claims. Validate with user.
6. Write output only after user confirmation.

### Narrative Arc Templates

- **Launch:** Hook → Context → Reveal → Proof/Demo → Transformation (aha moment) → CTA → Outro
- **Explainer:** Hook → Problem → Concept → Application → Summary → CTA → Outro
- **Demo:** End result first → Setup → Walkthrough → Result → CTA → Outro
- **Testimonial:** Strongest quote → Problem framing → Discovery → Experience → Results → CTA → Outro

## Output

Write `specs/youtube/video-script-<slug>.md` with:

- **Video Brief:** type, audience, goal, duration target, series context, enhancement tier.
- **Narrative Arc:** high-level structure with per-section timing.
- **Scene Breakdown:** per scene — narration text, visual direction, on-screen text/graphics, music/mood, duration, source attribution via `<!-- Source: path — claim -->` comments.
- **CTA Strategy:** primary CTA, placement timing, end-screen plan.
- **Asset Requirements:** footage, screen recordings, graphics, music, b-roll — checklist with status.
- **Source Attribution Summary:** table mapping claim → upstream artifact → section.
- **Ungrounded Claims:** claims without research backing, marked `<!-- UNGROUNDED -->`.
- **Next Steps.**

Write `specs/youtube/video-script-<slug>-interview.md` with the interview log.

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

## Next-Skill Routing

After writing the artifact, recommend the next contextual Remotion or creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `/video-build`.

If the user declined the script or no upstream artifacts exist, do not recommend `/video-build`. When no artifacts exist, recommend the first missing prerequisite (`/creator-positioning`, `/product-led-media-map`, or `/series-spec`).

If the default successor already exists and is current, recommend the first missing or stale downstream Remotion or creator-media artifact in this order:

`/creator-presence-dossier` -> `/youtube-channel-audit` -> `/youtube-video-audit` -> `/youtube-vid-research` -> `/youtube-format-research` -> `/youtube-competitive-research` -> `/youtube-title-thumbnail-audit` -> `/youtube-description-optimizer` -> `/youtube-portfolio` -> `/youtube-peer-benchmark` -> `/youtube-search-positioning` -> `/youtube-cadence-diagnosis` -> `/creator-positioning` -> `/content-programming` -> `/series-spec` -> `/product-led-media-map` -> `/video-script` -> `/video-build` -> `/creator-metrics-review`

If the sequence is ambiguous, multiple upstream artifacts are stale, or the recommendation depends on channel-level strategy vs programming-level changes, recommend `/creator-metrics-review` when metrics evidence exists, otherwise recommend the default successor and explain the missing artifact.

## Constraints

- Source-attribute every factual claim with inline `<!-- Source: path — claim -->` comments.
- Mark ungrounded claims with `<!-- UNGROUNDED -->`.
- Respect series format when `--series` is provided.
- Respect anti-positioning from creator-positioning.
- Present the script before writing — never write until the user confirms.
- Do not prescribe thumbnail design or editing cuts.
- Do not expose secrets, private customer data, or unreleased commitments.
