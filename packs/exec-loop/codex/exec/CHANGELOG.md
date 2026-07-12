# Changelog

## v0.7 - 2026-07-12

- Made Codex `$exec` the Sol lifecycle controller for bounded Luna implementation, integrated verification, fresh read-only Terra audit, disposition, risk-triggered focused re-audit, and final acceptance.

## v0.6 - 2026-07-02

- Normalized Codex next-step routing fallback wording so imported Claude slash routes become Codex `$...` commands unless an explicit cross-agent or human-guided Claude route is required.

## v0.5 - 2026-06-29

- Replaced local Skills Showcase regeneration with the public `exports/skills-catalog/v1/**` refresh contract and routed website copy follow-up to the separate Showcase repo.

## v0.4 - 2026-06-24

- Gated the `$brainstorm` new-phase-discovery route behind a `product-design` pack-availability check: when the pack is not enabled, the route now prepends `npx skillpacks install product-design` (plus a fresh-Codex-session note) instead of emitting a bare `$brainstorm` that can't be invoked.
- Added the missing generic cross-pack catch-all rule (verify `enabled_packs`, prepend `npx skillpacks install <pack-name>` when absent) that the Codex `$exec` variant lacked entirely.

## v0.3 - 2026-06-09

- Updated Skills Showcase refresh commands to use app-owned generator and validator paths after the workspace split.

## v0.2

- Stopped substituting PoketoWork kanban command variants in next-step recommendations while the kanban packs are hibernated.

## v0.1

- Renamed the Codex exec-loop command from `$exec` to `$exec` to avoid cross-agent naming drift with Claude's default slash-command surface.
- Preserved the existing default execution, shipping, approved-packet, and next-step routing behavior.

## v0.0

- Initial exec-loop `run` skill contract.
