---
name: research-directory-conventions
description: Reference standard for creator-media research directory layout — platform-scoped nesting, handle-scoped data, dated snapshots, archive-before-replace, and README indexing
type: analysis
version: v0.1
invocation: sub-skill
parent: creator-positioning
---

# Research Directory Conventions

Invoke as `$research-directory-conventions`.

Reference skill that defines the shared directory layout for all creator-media research. Skills in the `creator-foundation`, `youtube-ops`, and `remotion` packs should follow these conventions when writing artifacts.

## Directory Tree

```text
research/
├── <platform>/                              # e.g. youtube/, tiktok/, linkedin/
│   ├── <report-type>-<slug>[-YYYY-MM-DD].md # analysis reports
│   └── data/                                # raw evidence root
│       ├── <handle>/                         # per-channel / per-creator
│       │   ├── videos-YYYY-MM-DD.jsonl       # dated metadata snapshots
│       │   └── transcripts/                  # per-video transcript JSON
│       └── <video-id>/                       # per-video (external research)
│           ├── metadata-YYYY-MM-DD.json
│           └── transcript/<video-id>.json
├── creator-platforms/                        # multi-platform evidence
│   ├── capability-matrix.md
│   ├── evidence-schema.md
│   └── data/<platform>/<slug>/{raw,text,normalized,notes}/
├── creator-presence/                         # cross-platform dossiers
│   └── <slug>.md
specs/
├── <platform>/
│   ├── series-<slug>.md
│   ├── video-script-<slug>.md
│   └── video-build-<slug>.md
docs/
└── history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>
```

## Rules

1. **Platform-scoped nesting** — never write platform research directly to `research/`.
2. **Handle-scoped raw data** — `research/<platform>/data/<handle>/` for channel data, `research/<platform>/data/<video-id>/` for external video research.
3. **Dated snapshots** — never overwrite; create a new file with today's date.
4. **Archive before replace** — copy existing canonical report to `docs/history/archive/YYYY-MM-DD/HHMMSS/<path>` before replacement.
5. **Reports separate from data** — reports at `research/<platform>/`, raw data at `research/<platform>/data/`.
6. **README as index** — each platform directory has a README documenting current audit state.
7. **Specs separate from research** — production artifacts under `specs/<platform>/`, not `research/`.

## Validation

When validating directory structure compliance:
- Check that no report files exist directly in `research/` (must be nested under platform).
- Check that raw data lives under `data/` subdirectories, not alongside reports.
- Check that dated files use `YYYY-MM-DD` format.
- Check that `docs/history/archive/` exists if any canonical reports have been replaced.

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
