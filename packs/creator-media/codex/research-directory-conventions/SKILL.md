---
name: research-directory-conventions
description: Reference standard for creator-media research directory layout — platform-scoped nesting, handle-scoped data, dated snapshots, archive-before-replace, and README indexing
type: reference
version: 1.0.0
---

# Research Directory Conventions

Invoke as `$research-directory-conventions`.

Reference skill that defines the shared directory layout for all creator-media research. Other skills in the creator-media pack should follow these conventions when writing artifacts.

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
