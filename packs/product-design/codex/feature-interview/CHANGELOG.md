# Changelog

## v0.4 - 2026-05-30

- Added product-path scope resolution that prefers non-archived `research/{slug}/` paths and active manifest paths before code or monorepo hints.
- Excluded `research/_archive/`, legacy `abandoned`, `archived`, `deferred`, `revisit_candidate`, and `promoted` paths from active target selection while preserving flat `research/*.md` compatibility.


## v0.3 - 2026-05-27

- Added product-path manifest handling for feature route experiments that imply materially different products, apps, ICPs, or product lines.

## v0.1 - 2026-05-24

- Clarified that `$feature-interview` is the normal post-spec add-on workflow for smaller features.
- Added guidance to prefer scoped add-on specs or targeted existing-spec updates over re-running full `$spec-interview`.
- Added post-spec relationship evidence to deliverables and routing.

## v0.0

- Initial Codex feature-interview skill.

## v0.2 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
