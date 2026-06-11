# Changelog

## v0.2 - 2026-06-10

- Assumptions checkpoint now renders inline as the final message text of its own turn (never only as mid-turn text before a tool or command call); the next turn asks the user to confirm or correct it together with one focused interview question.
- Coverage checkpoint split across two turns: the per-area summary is delivered as turn-final text, with the confirmation question asked in the following turn. Applies the Manifest Visibility Rule in docs/interview-convention.md.

## v0.0

- Archived previous skill contract.

## v0.1 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
