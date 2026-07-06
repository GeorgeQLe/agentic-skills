# Changelog

## v0.3 - 2026-07-06

- Added `briefing-slides` to the required conventions via the shared packaged convention resolver. Dense alignment/interrogation pages remain source artifacts, while `briefing-slides/ord-align-{topic}.html` is now the primary review surface and compiled YAML routes back to `$ord-align`.

## v0.2 - 2026-06-16

- Clarified that downstream routing is emitted only after approved `ord-align` artifacts have been written or updated.
- Preserved the existing staged scope approval, validation review, and artifact approval workflow.

## v0.1 - 2026-06-15

- Added a report-first HTML approval gate at `alignment/ord-align-<slug>.html`.
- Split validation into staged scope approval, validation review, and approved artifact finalization.
- Blocked `alignment/ord-<slug>.md` writes, namespace checks, synthesized verdicts, and downstream routing until the relevant compiled YAML approval stage.

## v0.0

- Initial rapid ORD candidate alignment contract.
