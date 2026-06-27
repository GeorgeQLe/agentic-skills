# Ship Manifest: Base Mirror Parity Audit Coverage

Date: 2026-06-27

## Scope

- Extended `scripts/skill-mirror-parity-audit.sh` so base Claude/Codex skills are audited alongside pack mirrors.
- Kept pack audit behavior unchanged while adding narrow approvals for existing intentional/base-specific drift.
- Updated validation documentation to describe the new `base/` + `packs/` audit surface.

## Changes

- `scripts/skill-mirror-parity-audit.sh`
  - Adds `base/` as the first mirror root.
  - Reuses the existing missing-mirror, frontmatter, shared-section, and heading checks for `base/<skill>` pairs.
  - Adds narrow approved drift for:
    - `base/init-agentic-skills` heading shape
    - `base/provision-agentic-config` heading shape
    - `product-design/eval-ideas::argument-hint` punctuation-only drift
- `README.md`
  - Updates the validation note so `skill-mirror-parity-audit.sh` is documented as scanning both `base/` and `packs/`.
- `tasks/roadmap.md`, `tasks/todo.md`
  - Record the implementation plan and review evidence for this shipped boundary.

## Verification

- `bash -n scripts/skill-mirror-parity-audit.sh` passed.
- `scripts/skill-mirror-parity-audit.sh --verbose` passed: 178 mirrored pairs checked, 116 approved drift entries, 0 failures.
- Temp-copy missing-base mirror simulation passed by failing as expected:
  - command: `bash /tmp/base-mirror-parity-audit-sim.pGBLHj/scripts/skill-mirror-parity-audit.sh`
  - result: exit 1 with `base/skills: missing Codex mirror`
- `npm --workspace packages/skillpacks run build:check` passed.
- `node scripts/audit-task-docs.mjs` passed.

## Residuals

- Exploratory `scripts/skill-archive-audit.sh --strict` was run before the final scope correction and failed on unrelated pre-existing `base/codex/fork-idea-branch: missing archive/v0.0/SKILL.md`. This task does not modify skill versions.
