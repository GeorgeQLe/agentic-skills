---
skill: skill-creator
agent: codex
captured_at: 2026-06-28T18:51:37-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# YouTube Prelaunch A/B Test And URL Ledger

## Summary

Update the mirrored `youtube-video-prelaunch-audit` skill so every prelaunch report produces a YouTube Test and Compare-ready launch set: exactly 3 paired title + thumbnail variants, with setup guidance for getting them online in YouTube Studio. Also add a persistent per-video URL record so future YouTube skills can populate context from prior video URLs and artifacts.

Assumed defaults from unanswered prompts: the skill will create upload-ready guidance, not direct YouTube Studio/API automation; URL records will live under `research/youtube/data/`.

## Key Changes

- Update both `packs/youtube-ops/codex/youtube-video-prelaunch-audit/SKILL.md` and `packs/youtube-ops/claude/youtube-video-prelaunch-audit/SKILL.md`.
- Archive current `v0.3` skill files with `scripts/skill-archive.sh`, bump both active skills to `v0.4`, and add matching `CHANGELOG.md` entries.
- Extend the skill contract to require a **Test And Compare Launch Set**:
  - Exactly 3 simultaneous variants for YouTube Test and Compare.
  - Each variant includes a full title, thumbnail concept, packaging hypothesis, intended audience signal, and what a win would imply.
  - Titles must respect YouTube title constraints and stay upload-ready.
  - Thumbnail recommendations remain concepts or references unless user-provided assets exist; do not generate or claim final thumbnail files.
  - Frame these as three variants to upload together, not sequential manual swaps.
- Add persistent URL context capture:
  - Write/update `research/youtube/data/<video-id>/prelaunch/video-url-record.json`.
  - Write/update aggregate `research/youtube/data/video-url-index.jsonl`.
  - Record video ID, original URL, canonical watch URL, Shorts/embed/youtu.be forms when known, channel, status, working title, selected/preferred launch title if known, report path, evidence paths, capture date, and source skill.
  - On future runs, check the URL index and per-video record before asking for context already captured.
- Update report template sections:
  - Add `## Video URL Record`.
  - Replace loose title/thumbnail guidance with `## Test And Compare Launch Set`.
  - Keep current launch readiness, description, chapters, publish settings, cross-sharing, and evidence coverage sections.
- Update final response requirements so the skill reports the URL record path and the three Test and Compare pairs after approved artifact write.

## Test Plan

- Run focused static checks:
  - `scripts/skill-versions.sh --missing`
  - `scripts/skill-archive-audit.sh --strict`
  - `scripts/skill-mirror-parity-audit.sh`
  - `scripts/skill-next-step-routing.sh --missing`
  - `git diff --check`
- Manually read both active skill files to confirm:
  - Claude/Codex remain mirrored except invocation syntax.
  - Both are `v0.4`.
  - Both require exactly 3 title/thumbnail pairs.
  - Both define the URL record/index behavior.
  - Changelogs and archives match the version bump.

## Assumptions

- "Get online" means the skill prepares YouTube Studio-ready Test and Compare assets and instructions; it will not directly operate YouTube Studio or authenticate to YouTube.
- The skill should not create thumbnail image files by default. It recommends three concrete thumbnail concepts or maps supplied thumbnail drafts into the three-variant test.
- The URL ledger is a research artifact, not private analytics storage; it should not include credentials, private Studio-only data, or unshared account details.
- Implementation should be committed and pushed after verification, following this repo's direct-to-primary workflow.
