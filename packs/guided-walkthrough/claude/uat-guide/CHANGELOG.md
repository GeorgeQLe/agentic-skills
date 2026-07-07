# Changelog

## v0.6 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/uat-guide-{topic}.html` is now the primary review surface and compiled YAML routes back to `/uat-guide`.
- Changed generated UAT guide steps from plain numbered substeps to checkable tester actions with explicit checkpoint and evidence items.

## v0.5 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.4 - 2026-06-11

- Added npm-aware Pack Availability Guard wording while preserving Claude `/pack install` routing.

## v0.3 - 2026-06-06

- Route unclear acceptance criteria caused by missing flow, states, recovery, or handoffs to `/user-flow-map`.
- Reserve `/ux-variations --layout-mode` for layout-alternative remediation.

## v0.2 - 2026-06-04

- Added the shared Pack Availability Guard to match the Codex mirror and restored version parity.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.0

- Archived previous skill contract.
