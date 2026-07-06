# Changelog

## v0.8 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/experiment-{topic}.html` is now the primary review surface and compiled YAML routes back to `$experiment`.

## v0.7 - 2026-06-12

- Made alignment pages optional by default: report inline and write the skill's normal durable artifacts unless the user requests an alignment page or the agent identifies a concrete clarification/review need.

## v0.6 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.5 - 2026-06-10

- Added npm-aware install-route guidance to the Pack Availability Guard while preserving the runner-specific `$pack install <pack>` route.

## v0.4 - 2026-06-07

- Routed invalidated customer-fit assumptions to `$customer-discovery` instead of the retired `$icp` executable while preserving `research/icp.md` evidence usage.

## v0.3 - 2026-05-30

- Added product-path scope resolution that prefers non-archived `research/{slug}/` paths and active manifest paths before code or monorepo hints.
- Excluded `research/_archive/`, legacy `abandoned`, `archived`, `deferred`, `revisit_candidate`, and `promoted` paths from active target selection while preserving flat `research/*.md` compatibility.


## v0.0

- Archived previous skill contract.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.2

- Archived previous skill contract.
