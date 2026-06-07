# Changelog

## v0.6 - 2026-06-07

- Route missing customer-discovery prerequisites to `$customer-discovery` instead of the retired `$icp` executable.

## v0.5 - 2026-06-06

- Route top unspecced MVP gaps with missing flow/design shape to `$user-flow-map` before UI requirements, layout variations, and production specs.
- Reserve `$ux-variations --layout-mode` for gaps whose flow map and UI requirements already exist but layout alternatives are missing.

## v0.4 - 2026-06-02

- Added a staged research workflow so preliminary findings stay in non-canonical `_working` packets until review alignment approval finalizes canonical artifacts.

## v0.3 - 2026-06-02

- Added evidence-aware feedback handling so agents push back on factual misunderstandings while honoring subjective user preferences.

## v0.2 - 2026-05-30

- Added product-path scope resolution that prefers non-archived `research/{slug}/` paths and active manifest paths before code or monorepo hints.
- Excluded `research/_archive/`, legacy `abandoned`, `archived`, `deferred`, `revisit_candidate`, and `promoted` paths from active target selection while preserving flat `research/*.md` compatibility.


## v0.0

- Archived previous skill contract.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
