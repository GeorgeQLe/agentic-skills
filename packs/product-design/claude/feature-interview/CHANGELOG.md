# Changelog

## v0.9 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/feature-interview-{topic}.html` is now the primary review surface and compiled YAML routes back to `/feature-interview`.

## v0.8 - 2026-07-04

- Updated the medium-complexity mini-prototype route from archived `/prototype` to `/logic-wiring`.

## v0.7 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.6 - 2026-06-11

- Added npm-aware install-route wording for pack availability and cross-pack recommendations while preserving Claude `/pack install ...` routes.

## v0.5 - 2026-06-10

- Feature Evidence Brief + Assumptions Manifest now renders inline as the final message text of its own turn, with the step 6 confirmation asked in the following turn; AskUserQuestion option previews are a supplementary mirror only, never the sole channel.
- Planning Destination + Priority Checkpoint split across two turns: the checkpoint is delivered as turn-final text, with the confirmation question asked in the following turn. Applies the Manifest Visibility Rule in docs/interview-convention.md.

## v0.4 - 2026-05-30

- Added product-path scope resolution that prefers non-archived `research/{slug}/` paths and active manifest paths before code or monorepo hints.
- Excluded `research/_archive/`, legacy `abandoned`, `archived`, `deferred`, `revisit_candidate`, and `promoted` paths from active target selection while preserving flat `research/*.md` compatibility.


## v0.2 - 2026-05-27

- Added product-path manifest handling for feature route experiments that imply materially different products, apps, ICPs, or product lines.

## v0.0

- Archived previous skill contract.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.3

- Archived previous skill contract.
