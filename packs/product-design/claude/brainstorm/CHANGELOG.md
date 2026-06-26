# Changelog

## v0.7 - 2026-06-26

- Removed the leftover generic `## Alignment Page` conditional trigger ("When this skill produces durable deliverables…"), which contradicted the now always-on alignment-page Process step (`### 4. Build the alignment page`).

## v0.6 - 2026-06-25

- Added a `--quick` escape hatch that restores the legacy lightweight path: skip the stage-zero interrogation loop and the alignment page, run light terminal scoping (or skip when a focus area is supplied), output suggestions inline grouped by effort, and append directly to `tasks/ideas.md`. `--dump` is implied in quick mode.
- Fixed the always-on alignment regression from v0.5: removed `brainstorm` from `OPTIONAL_ALIGNMENT_SKILLS` in `scripts/upgrade-alignment-page.mjs` so the generator now emits the full-depth alignment stub and bundle instead of force-wiping the always-on page back to the optional stub. The default flow is genuinely always-on again; the always-on hub spec now lives in Process §4 (idea cards, per-idea `/feature-interview` copy hub, review gates, artifact-destination gate, on-approval behavior).

## v0.5 - 2026-06-25

- Made the HTML interrogation → alignment flow the default. brainstorm now runs the stage-zero interrogation loop (Ideation Frame Manifest in round 1, adaptive follow-ups, confidence-gate coverage checkpoint) before generating any ideas, then presents the idea set in an always-on alignment page that doubles as a per-idea `/feature-interview` copy hub.
- Made the `tasks/ideas.md` dump opt-in: it is written only when the `--dump` flag is set and the alignment page's artifact-destination gate approves it. The alignment page is now the primary durable artifact.
- Registered brainstorm in the interrogation archetype (`INTERROGATION_SKILLS` + `INTERROGATION_AREAS`) and added `interrogation-page` to `required_conventions`.

## v0.4 - 2026-06-24

- Added a `feature-interview` availability preflight: check `enabled_skills`, enabled provider packs, or local/global skill files before listing `/feature-interview` prompts, and put `npx skillpacks install feature-interview` first when unavailable.

## v0.3 - 2026-06-12

- Made alignment pages optional by default: report inline and write the skill's normal durable artifacts unless the user requests an alignment page or the agent identifies a concrete clarification/review need.

## v0.2 - 2026-05-30

- Added product-path scope resolution that prefers non-archived `research/{slug}/` paths and active manifest paths before code or monorepo hints.
- Excluded `research/_archive/`, legacy `abandoned`, `archived`, `deferred`, `revisit_candidate`, and `promoted` paths from active target selection while preserving flat `research/*.md` compatibility.


## v0.0

- Archived previous skill contract.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
