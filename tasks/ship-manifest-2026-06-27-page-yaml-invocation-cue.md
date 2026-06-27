# Ship Manifest - Page YAML Invocation Cue

Date: 2026-06-27

## Scope

- Updated alignment and interrogation page YAML contracts so copied YAML starts with `# Invoke with: <resolved command>` and then `command` as the first real key.
- Preserved machine-readable routing by keeping root `command` authoritative and matching `agent_routing.command` where present.
- Regenerated generated alignment/interrogation convention bundles and synced installed Codex convention copies that mirror source bundles.
- Updated the skillmap Excalidraw YAML generator and the bespoke `brainstorm` alignment convention.
- Added regression expectations for the invocation comment and first real command key.

## Verification

- `node scripts/upgrade-alignment-page.mjs --check`
- `node scripts/upgrade-interrogation-page.mjs --check`
- `node scripts/skill-convention-bundle-audit.mjs`
- `node scripts/skill-alignment-routing-audit.mjs --report`
- stale-shape `rg` scans for old first-key YAML guidance
- `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts layer1/interrogation-confidence-gate.test.ts --reporter=dot` (80/80)
- `node scripts/audit-task-docs.mjs`
- `git diff --check`

## Deploy

Not applicable. This change updates skill conventions, generated convention bundles, tests, and task documentation; it does not modify a deployed runtime surface.
