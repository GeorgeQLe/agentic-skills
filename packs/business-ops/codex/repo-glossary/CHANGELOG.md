# repo-glossary Changelog

## v0.5 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/repo-glossary-{topic}.html` is now the primary review surface and compiled YAML routes back to `$repo-glossary`.

## v0.4 - 2026-06-12

- Clarified staged research review pages must render complete working-packet substance as structured HTML UI, with raw Markdown packet text allowed only as a supplemental source view.

## v0.3 - 2026-06-11

- Reclassified the active skill as `type: research` because it already uses the staged research lifecycle and writes approved glossary research artifacts.

## v0.2 - 2026-06-10

- Changed report-first research flow to require alignment-page research-scope approval before synthesized findings, candidate rankings, recommendations, working packets, or canonical research writes.

## v0.1 — 2026-06-03

- Added Codex mirror with `$repo-glossary` invocation and Codex display metadata.
- Two-level glossary hierarchy: parent (`research/glossary.md`) + scoped (`research/{slug}/glossary.md`)
- Child-inherits-parent model with explicit override (shadow) support
- Three new term categories: shadowed terms, cross-path divergences, inheritance gaps
- `confirmed-override` status for acknowledged shadows
- Optional Scope column in parent glossary for multi-path repos
- Hierarchy-aware write rules: promote, align, acknowledge shadow, reconcile divergence
- Dual glossary format: parent (with Scope) and scoped/flat (without Scope)
- Updated alignment gate string to cover all seven categories
- Backward compatible: flat single-product repos unchanged

## v0.0 — 2026-06-03

- Initial skill: glossary audit and reconciliation
- Four-category term classification: existing, missing, conflicting, stale
- Product-path scope resolution (flat and scoped modes)
- Staged research workflow with alignment page approval gates
- Report-first approval gate — no glossary writes before user approval
- Standard glossary format with Terms, Acronyms, and Recently Added tables
- Write-forward respect — confirmed terms are not downgraded during audit
