---
skill: exec
agent: codex
captured_at: 2026-06-01T23:45:31-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Address Positioning Alignment Caveats

## Summary
Fix the positioning workflow contracts so framework subskills use local bundled alignment-page conventions, and make the product-positioning shortcut follow the same pre-approval alignment gate as the default framework-selection path. Apply changes to both Codex and Claude mirrors.

## Key Changes
- **Framework subskills:** For `jtbd-positioning`, `strategic-canvas`, `moore-positioning`, `category-design`, and `obviously-awesome`, replace the parent-relative alignment reference with the standard sibling `ALIGNMENT-PAGE.md` stub.
- **Bundled alignment pages:** Run `scripts/upgrade-alignment-page.mjs` after archiving so each framework subskill gets its own generated `ALIGNMENT-PAGE.md`; do not hand-edit generated alignment pages.
- **Mode C shortcut:** Update `positioning` Mode C so it builds an alignment page for the shortcut execution plan, asks for approval, and only writes `tasks/todo.md` after final compiled YAML approval.
- **Versioning:** Archive and bump all changed active `SKILL.md` files:
  - `positioning`: `v0.8 -> v0.9`
  - framework subskills: `v0.1 -> v0.2`
  - Update each affected `CHANGELOG.md`.
- **Generated showcase data:** Regenerate skill showcase data because version fields are included in generated assets.

## Implementation Steps
- Run `scripts/skill-archive.sh` for both `packs/business-discovery/{codex,claude}/positioning` and each of the five framework subskill directories before editing.
- Apply the Mode C wording change manually in both Codex and Claude `positioning/SKILL.md`.
- Run `node scripts/upgrade-alignment-page.mjs` to create framework `ALIGNMENT-PAGE.md` files and normalize stubs.
- Bump versions and update changelogs for the parent and framework skills.
- Regenerate showcase data with the existing showcase generation scripts.

## Test Plan
- Add or update layer1 coverage to assert:
  - positioning framework subskills have sibling `ALIGNMENT-PAGE.md` files;
  - framework subskill stubs point to `ALIGNMENT-PAGE.md` in the skill directory;
  - Mode C no longer writes `tasks/todo.md` before alignment approval.
- Run:
  - `node scripts/upgrade-alignment-page.mjs --dry-run` and expect `Updated: 0`, `Bundled files written: 0`;
  - `bash scripts/skill-archive-audit.sh --strict`;
  - `cd tests && npm run test:layer1`.

## Assumptions
- Keep Codex and Claude positioning mirrors behaviorally aligned.
- Use the generator-owned bundled alignment convention; do not create a custom parent-relative exception for framework subskills.
- Treat the Mode C shortcut `tasks/todo.md` write as a durable planning write that must be approval-gated.
