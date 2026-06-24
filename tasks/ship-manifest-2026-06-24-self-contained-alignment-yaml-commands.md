# Ship Manifest - Self-Contained Alignment YAML Commands

Date: 2026-06-24
Branch: `master`

## Scope

- Updated the canonical alignment-page convention so every review-page YAML payload compiled by the page carries a top-level `command` field.
- Applied that requirement to both local section-feedback YAML and bottom compiled response YAML, using the exact producing-skill or parent-orchestrator continuation route.
- Clarified that the top-level command is review-loop continuation metadata, not downstream routing or execution authority before approval.
- Updated the Pattern A routing contract and research-session loop convention so root `command`, `agent_routing.command`, and `## Invoke With YAML` match when the parent orchestrator handles continuation.
- Updated the interrogation-page convention so compiled answer YAML also includes top-level `command` matching `agent_routing.command`, using a route-agnostic `<parent-skill-command>` placeholder so generated bundles do not hardcode slash or dollar syntax.
- Regenerated all generated `ALIGNMENT-PAGE.md` and `INTERROGATION-PAGE.md` bundles from the canonical docs.
- Added layer1 assertions covering top-level command requirements for both generated alignment and interrogation contracts.

## Versioning

- No `SKILL.md` files changed, so no skill version bump or archive was required.
- Generated bundle files changed only through `scripts/upgrade-alignment-page.mjs` and `scripts/upgrade-interrogation-page.mjs`.

## Validation

- Passed: `node scripts/upgrade-alignment-page.mjs --check` (306 generated alignment bundles byte-in-sync).
- Passed: `node scripts/upgrade-interrogation-page.mjs --check` (18 generated interrogation bundles byte-in-sync).
- Passed: `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts layer1/interrogation-confidence-gate.test.ts` (2 files, 76 tests).
- Passed: `node scripts/audit-alignment-pages.mjs` (54 active pages exact).
- Passed: `node scripts/audit-interrogation-pages.mjs` (0 active pages exact).
- Passed: `node scripts/audit-task-docs.mjs` (0 failures, 0 warnings).
- Passed: `npm run skillpacks:verify` (convention bundle audit for 390 active skills, manifest check, staging boundary check, package dry-run).
- Passed: `git diff --check`.

## Rollback

Revert the commit containing this manifest. That restores the previous canonical conventions, generated bundles, layer1 assertions, and task docs.
