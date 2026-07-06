# Changelog

## v0.6 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/plan-phase-{topic}.html` is now the primary review surface and compiled YAML routes back to `/plan-phase`.

## v0.5 - 2026-06-13

- Removed direct execution-loop command handoffs from non-exec routing; route through approved YAML, task, or roadmap artifacts instead.


## v0.4 - 2026-06-12

- Made alignment pages optional by default: report inline and write the skill's normal durable artifacts unless the user requests an alignment page or the agent identifies a concrete clarification/review need.

## v0.3 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.2 - 2026-06-10

- Added npm-aware install-route alternatives to cross-pack handoff guidance while preserving Claude `/pack install` syntax.

## v0.0

- Archived previous skill contract.

# plan-phase changelog (claude)

## v0.1 - 2026-05-26

- Gate cross-pack routing recommendations with formal inline pack-availability conditionals instead of informal parenthetical pack mentions
