# Changelog

## v0.4 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/create-alignment-page-{topic}.html` is now the primary review surface and compiled YAML routes back to `/create-alignment-page`.

## v0.3 - 2026-07-04

- Added packaged scaffold usage for ad hoc alignment pages while keeping normal producing skills responsible for their own alignment content, gates, and handoff flow.

## v0.2 - 2026-06-24

- Added explicit alignment-page review handoff: review the HTML page, compile section-feedback or bottom response YAML, paste it into `/<producing-skill> ...`, and distinguish revision YAML from final `ready-for-agent-review` approval YAML.

## v0.1 - 2026-06-15

- Removed `alignment bundles --check` as a target-repo fallback and clarified that missing installed alignment conventions must be reported instead of replaced with a simplified template.

## v0.0 - 2026-06-15

- Initial portable alignment-page creation workflow.
