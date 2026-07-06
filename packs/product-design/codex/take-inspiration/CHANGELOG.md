# Changelog

## v0.1 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/take-inspiration-{topic}.html` is now the primary review surface and compiled YAML routes back to `$take-inspiration`.

## v0.0 - 2026-07-04

- Initial version. Adds a reference-specific inspiration study skill that interrogates why the user chose one product/reference, seeks approval for the research lens, studies the reference through that lens, synthesizes against the current design tree, recommends owner-routed COAs, writes `design/take-inspiration-{topic}-{reference}.md`, and records the artifact through flow-tree `source_artifacts[]`.
