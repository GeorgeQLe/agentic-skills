# Changelog

## v0.6 - 2026-06-15

- Updated business discovery fallback routing to use canonical `business-research` install guidance and explicit pack-availability wording for cross-pack discovery routes.

## v0.5 - 2026-06-14

- Made reporting and routing Research-Session-Loop-aware: when reconciling a research stage, read the selected-set run manifest (`research/{slug}/_working/{orchestrator}-run.yaml`), compare against existing canonical intermediates, and report "k of N frameworks complete" instead of reading `tasks/todo.md` checkboxes for research progress.
- Added a mid-run routing rule: when a research loop has pending frameworks (or all intermediates exist but no synthesized canonical), route to re-invoking that same orchestrator (clear context / fresh session), taking precedence over starting a new orchestrator. Kept `research/.progress.yaml` `pipeline_stage` as a pointer.

## v0.4 - 2026-06-12

- Made alignment pages optional by default: report inline and write the skill's normal durable artifacts unless the user requests an alignment page or the agent identifies a concrete clarification/review need.

## v0.3 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.2 - 2026-06-11

- Added npm-aware install-route alternatives to AFPS pack fallback recommendations while preserving Claude `/pack install` routes.

## v0.1 - 2026-06-06

- Renamed the discovery-needed AFPS stage and next-route wording to use `/customer-discovery`, while preserving `research/icp.md` as the customer-discovery evidence artifact where relevant.

## v0.0 - 2026-06-01

- Added the initial Claude `/afps-status` skill for read-mostly AFPS artifact reconciliation and next-command routing.
