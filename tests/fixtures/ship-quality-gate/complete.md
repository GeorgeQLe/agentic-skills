# Ship Manifest

## User Goal

Execute Phase 21 Step 21.2 by adding a dependency-light ship manifest validator and fixtures.

## Changed Files

- `scripts/ship-quality-gate.sh`
- `tests/fixtures/ship-quality-gate/complete.md`
- `tests/fixtures/ship-quality-gate/missing-fields.md`

## Per-File Purpose

- `scripts/ship-quality-gate.sh`: validates required manifest headings before shipping.
- `tests/fixtures/ship-quality-gate/complete.md`: provides a passing validator fixture.
- `tests/fixtures/ship-quality-gate/missing-fields.md`: provides a failing validator fixture.

## User-Goal Mapping

The script and fixtures directly implement the accepted Step 21.2 plan.

## Tests Run

- `scripts/ship-quality-gate.sh tests/fixtures/ship-quality-gate/complete.md` - passed.
- `scripts/ship-quality-gate.sh tests/fixtures/ship-quality-gate/missing-fields.md` - failed with expected missing-field output.

## Skipped Tests

No broader test suite is needed for this fixture because it is only validator input data.

## Adversarial Review

Changed-file self-review checked that every required contract field has a fixture example.

## Residual Risk

The fixture proves required-heading detection, but does not prove semantic quality of each field.

## Rollback Note

Revert the validator script and fixture directory if the manifest contract changes.

## Next Command

`$run`
