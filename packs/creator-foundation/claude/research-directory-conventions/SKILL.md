---
name: research-directory-conventions
description: Reference standard for creator-media research directory layout — platform-scoped nesting, handle-scoped data, dated snapshots, archive-before-replace, and README indexing
type: analysis
version: v0.1
required_conventions: [alignment-page]
invocation: sub-skill
parent: creator-positioning
---

# Research Directory Conventions

Reference skill that defines the shared directory layout for all creator-media research. Skills in the `creator-foundation`, `youtube-ops`, and `remotion` packs should follow these conventions when writing artifacts.

## When to use

- When building or reviewing a new creator-media skill that writes research artifacts.
- When auditing whether existing research output follows the standard layout.
- When onboarding a new creator to the pack and explaining where things go.

## Directory Tree

```text
research/
├── <platform>/                              # e.g. youtube/, tiktok/, linkedin/
│   ├── <report-type>-<slug>[-YYYY-MM-DD].md # analysis reports
│   └── data/                                # raw evidence root
│       ├── <handle>/                         # per-channel / per-creator
│       │   ├── videos-YYYY-MM-DD.jsonl       # dated metadata snapshots
│       │   └── transcripts/                  # per-video transcript JSON
│       │       ├── <video-id>.json
│       │       └── transcripts-summary.json
│       └── <video-id>/                       # per-video (external research)
│           ├── metadata-YYYY-MM-DD.json
│           └── transcript/
│               └── <video-id>.json
├── creator-platforms/                        # multi-platform evidence
│   ├── capability-matrix.md
│   ├── evidence-schema.md
│   └── data/<platform>/<slug>/
│       ├── raw/
│       ├── text/
│       ├── normalized/
│       └── notes/
├── creator-presence/                         # cross-platform dossiers
│   └── <slug>.md
specs/
├── <platform>/
│   ├── series-<slug>.md
│   ├── video-script-<slug>.md
│   ├── video-build-<slug>.md
│   └── video-build-<slug>-interview.md
docs/
└── history/
    └── archive/
        └── YYYY-MM-DD/
            └── HHMMSS/
                └── <original-relative-path>  # archived before replacement
```

## Convention 1 — Platform-scoped nesting

All platform-specific research lives under `research/<platform>/`. This scales when a creator adds new platforms without polluting the root.

**Rule:** Never write platform research directly to `research/`. Always nest under the platform name.

## Convention 2 — Handle-scoped raw data

Raw evidence for a specific channel or creator account goes under `research/<platform>/data/<handle>/`. This allows auditing your own channel and competitors in the same tree without collision.

**Rule:** `<handle>` is the kebab-case channel or account slug (e.g., `georgele`, `fireship`). Video-level research for external videos uses the video ID instead: `research/<platform>/data/<video-id>/`.

## Convention 3 — Dated snapshots

Raw data files include the capture date in the filename: `videos-YYYY-MM-DD.jsonl`, `metadata-YYYY-MM-DD.json`. This makes re-runs non-destructive — a new audit produces a new dated file alongside the old one.

**Rule:** Never overwrite a dated snapshot. Create a new file with today's date.

## Convention 4 — Archive before replace

When a canonical report (e.g., `channel-audit-<slug>.md`) is replaced by a newer version, the old version must be archived first.

**Rule:** Copy the existing file to `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>` before writing the replacement. The timestamp uses the archive moment, not the original creation date.

## Convention 5 — Reports separate from data

Analysis reports live at `research/<platform>/<report-type>-<slug>.md`. Raw evidence lives deeper at `research/<platform>/data/<handle>/`. This cleanly separates human-readable analysis from machine-collected evidence.

**Rule:** Reports reference raw data by relative path. Raw data never contains analysis or recommendations.

## Convention 6 — Root README as index

Each platform research directory should contain a `README.md` that documents the current audit state, file locations, transcript coverage, and any notes about evidence freshness.

**Rule:** Update the README when new audits complete. The README is the human entry point — a reader should be able to understand what research exists and how current it is without scanning filenames.

## Convention 7 — Specs are separate from research

Production-ready artifacts (series specs, video scripts, video builds) live under `specs/<platform>/`, not under `research/`. Research informs specs, but specs are forward-looking deliverables.

**Rule:** Never mix specs into the research tree. Reference research artifacts from specs by relative path.

## Report naming patterns

| Skill | Output path |
|---|---|
| youtube-channel-audit | `research/youtube/channel-audit-<slug>.md` |
| youtube-video-audit | `research/youtube/video-audit-<slug>-YYYY-MM-DD.md` |
| youtube-vid-research | `research/youtube/video-research-<video-id-or-slug>-YYYY-MM-DD.md` |
| youtube-format-research | `research/youtube/format-research-<video-id>-YYYY-MM-DD.md` |
| youtube-concept-research | `research/youtube/concept-research-<slug>-YYYY-MM-DD.md` |
| youtube-competitive-research | `research/youtube/competitive-research-<slug>-YYYY-MM-DD.md` |
| youtube-title-thumbnail-audit | `research/youtube/title-thumbnail-audit-<slug>.md` |
| youtube-description-optimizer | `research/youtube/description-optimizer-<slug>.md` |
| youtube-portfolio | `research/youtube/portfolio-<slug>.md` |
| youtube-peer-benchmark | `research/youtube/peer-benchmark-<slug>.md` |
| youtube-search-positioning | `research/youtube/search-positioning-<slug>.md` |
| youtube-cadence-diagnosis | `research/youtube/cadence-diagnosis-<slug>.md` |
| creator-positioning | `research/youtube/creator-positioning-<slug>.md` |
| content-programming | `research/youtube/content-programming-<slug>.md` |
| creator-metrics-review | `research/youtube/metrics-review-<slug>-YYYY-MM-DD.md` |
| product-led-media-map | `research/youtube/product-led-media-map-<slug>.md` |
| creator-platform-capability-matrix | `research/creator-platforms/capability-matrix.md` |
| creator-evidence-schema | `research/creator-platforms/evidence-schema.md` |
| creator-presence-dossier | `research/creator-presence/<slug>.md` |
| series-spec | `specs/youtube/series-<slug>.md` |
| video-script | `specs/youtube/video-script-<slug>.md` |
| video-build | `specs/youtube/video-build-<slug>.md` |

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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page following `ALIGNMENT-PAGE.md` in this skill's directory. Output: `alignment/research-directory-conventions-{topic}.html`.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

