# Changelog

## v0.12 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/reconcile-research-{topic}.html` is now the primary review surface and compiled YAML routes back to `/reconcile-research`.

## v0.11 - 2026-07-02

- Added research-amend next-step routing for isolated low/medium reconciliation findings while preserving targeted reruns for conflict clusters and systemic drift.

## v0.10 - 2026-06-12

- Clarified staged research review pages must render complete working-packet substance as structured HTML UI, with raw Markdown packet text allowed only as a supplemental source view.

## v0.9 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.8 - 2026-06-10

- Added npm-aware install-route guidance for business-ops cross-pack recommendations, preserving `/pack install <pack>` inside Claude Code while offering `npx skillpacks install <pack>` from the project shell.

## v0.7 - 2026-06-10

- Changed report-first research flow to require alignment-page research-scope approval before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes.

## v0.6 - 2026-06-02

- Added a staged research workflow so preliminary findings stay in non-canonical `_working` packets until review alignment approval finalizes canonical artifacts.

## v0.5 - 2026-06-02

- Added evidence-aware feedback handling so agents push back on factual misunderstandings while honoring subjective user preferences.

## v0.4 - 2026-05-30

- Added product-path scope resolution that prefers non-archived `research/{slug}/` paths and active manifest paths before code or monorepo hints.
- Excluded `research/_archive/`, legacy `abandoned`, `archived`, `deferred`, `revisit_candidate`, and `promoted` paths from active target selection while preserving flat `research/*.md` compatibility.


## v0.0

- Archived previous skill contract.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.

## v0.3 - 2026-05-27

- Handle plural `active_paths` manifest field with backward compatibility for singular `active_path`
- Added cross-path consistency checks when multiple paths are active
- Scope reconciliation audit to active product paths by default

## v0.2 - 2026-05-26

- Gate cross-pack routing recommendations on pack availability — recommend `/pack install <pack>` when the target pack is not enabled
