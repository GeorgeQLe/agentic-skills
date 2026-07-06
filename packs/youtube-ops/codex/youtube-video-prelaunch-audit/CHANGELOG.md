# Changelog

## v0.5 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/youtube-video-prelaunch-audit-{topic}.html` is now the primary review surface and compiled YAML routes back to `$youtube-video-prelaunch-audit`.

## v0.4 - 2026-06-28

- Added persistent per-video URL ledger requirements under `research/youtube/data/`, including a per-video record and aggregate JSONL index for future YouTube skill context.
- Replaced loose title/thumbnail guidance with a required Test And Compare launch set containing exactly three simultaneous title and thumbnail variants plus YouTube Studio setup guidance.
- Updated the report and final response contract to include the URL record path and the three Test And Compare pairs after approved artifact writes.

## v0.3 - 2026-06-12

- Clarified staged research review pages must render complete working-packet substance as structured HTML UI, with raw Markdown packet text allowed only as a supplemental source view.

## v0.2 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.1 - 2026-06-10

- Changed report-first research flow to require alignment-page research-scope approval before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes.

## v0.0 - 2026-06-09

- Created the prelaunch audit skill for unlisted or scheduled YouTube videos, covering edit readiness, polish, launch packaging, chapters, publish settings, and cross-sharing strategy before public release.
