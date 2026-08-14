# Changelog

## v0.6 - 2026-08-11

- Migrated the prelaunch workflow to AFPS 2.0: reversible evidence collection, URL records, canonical reporting, and three real generated thumbnail variants now proceed without scope or final-artifact approval pages.
- Replaced three routine approval stops with one chat-first `launch-packaging-selection` checkpoint after image/manifest validation, capped at three material decisions.
- Preserved explicit permission stops for YouTube Studio upload, public visibility, scheduling, account-authenticated changes, and other external actions; input and capability gaps remain blockers rather than approval rituals.

## v0.5 - 2026-07-27

- Added repeatable `--thumbnail-asset` intake, backward-compatible `--thumbnail` handling, bounded inspection of explicitly pointed files/URLs/attachments/directories, and complete used-or-rejected asset accounting.
- Added Stage 2.5 to generate and verify exactly three upload-ready 1280x720 thumbnails under immutable per-generation directories, with a manifest covering paired titles, source assets, hypotheses, dimensions, and generation provenance.
- Required content-based JPG/PNG/GIF validation, a 50,000,000-byte desktop Studio limit, and per-variant manifest `format`/`byte_size` evidence before a generation can become complete.
- Required the review HTML to embed all three generated title/image pairs with open/download links and remain in `review` until a second compiled approval covers the actual images and titles.
- Updated report, evidence, checklist, handoff, and constraint contracts so successful runs reference three real thumbnail files, preserve revision generations, stop when image capability or required asset access is unavailable, and keep YouTube Studio upload manual.

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
