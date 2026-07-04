# Changelog

## v0.2 - 2026-07-04

- Reclassified the skill from `type: research` to `type: analysis` because `research-amend` reviews and patches already-approved research rather than running a staged Pattern A research lifecycle.

## v0.1 - 2026-07-02

- Removed the separate review-pending `## Invoke With YAML` command block; compiled YAML now carries continuation via `command` and `agent_routing.command`, so terminal handoffs tell users to clear context and paste the compiled YAML directly.

## v0.0 - 2026-07-02

- Added the initial Claude `research-amend` base skill for bounded, alignment-gated amendments to approved research artifacts.
