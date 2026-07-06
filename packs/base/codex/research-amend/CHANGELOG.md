# Changelog

## v0.3 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/research-amend-{topic}.html` is now the primary review surface and compiled YAML routes back to `$research-amend`.

## v0.2 - 2026-07-04

- Reclassified the skill from `type: research` to `type: analysis` because `research-amend` reviews and patches already-approved research rather than running a staged Pattern A research lifecycle.

## v0.1 - 2026-07-02

- Removed the separate review-pending `## Invoke With YAML` command block; compiled YAML now carries continuation via `command` and `agent_routing.command`, so terminal handoffs tell users to clear context and paste the compiled YAML directly.

## v0.0 - 2026-07-02

- Added the initial Codex `research-amend` base skill for bounded, alignment-gated amendments to approved research artifacts.
