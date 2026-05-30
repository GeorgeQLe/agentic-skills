# Changelog

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
