# Changelog

## v0.9 - 2026-06-22

- Updated the Planning catalog to list `consolidate-prototypes` as the primary product-design consolidation skill.

## v0.8 - 2026-06-13

- Renamed the scanned skill set from "global" to "base": now scans `base/<tool>/*/SKILL.md`, and ungrouped skills are labeled `base` instead of `global`.

## v0.7 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.6 - 2026-06-11

- Added npm-aware install-route alternatives to available-but-not-installed skill guidance while preserving Claude `/pack install` routes.

## v0.5

- Updated the Discovery & Market Fit catalog examples to list `customer-discovery` as the standard business-discovery route while preserving `enterprise-icp`.

## v0.4

- Removed hibernated PoketoWork kanban skills from the static workflow-stage inventory while the kanban packs are archived.

## v0.3

- Added `afps-status` to the global Context & Session inventory mapping.

## v0.2

- Added invocation type awareness: reads `invocation:` and `parent:` frontmatter fields.
- Sub-skills displayed indented under their parent with `↳` prefix.
- Orchestrator skills marked with `⚙` prefix.
- Scans `frameworks/*/SKILL.md` sub-directories for sub-skills.
- Updated output format to show sub-skill counts separately.

## v0.1

- Updated pack-management discovery text to advertise pack-or-skill install/remove and `/pack which <skill>`.
- Available-but-not-installed pack skills now mention single-skill install as an option.

## v0.0

- Initial Claude skill browsing workflow.
