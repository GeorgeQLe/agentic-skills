---
skill: exec
agent: codex
captured_at: 2026-06-27T23:26:03-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Fix Remaining Design-Tree Verification Gaps

## Summary
Close the two verified post-ship gaps from commit `3d8f212f3`: stale Skills Showcase GitHub proof data and stale active `user-flow-map` route wording that still points build-plan work at `prototype` instead of `logic-wiring`.

## Key Changes
- Update active `user-flow-map` contracts only:
  - In `packs/product-design/claude/user-flow-map/SKILL.md`, change the two stale downstream route references from `/prototype` to `/logic-wiring`.
  - In `packs/product-design/codex/user-flow-map/SKILL.md`, change the matching two references from `$prototype` to `$logic-wiring`.
  - Preserve generic “prototype” terminology where it describes the artifact, phase, or build-plan concept rather than a skill route.
- Keep versioning scoped:
  - Do not bump `user-flow-map` again unless the change is treated as a substantive behavior update. Default: no version bump because this corrects missed wording from the already-shipped v1.8 route rename.
  - Do not create new archives or changelog entries unless the implementation decision changes to bump versions.
- Commit generated showcase drift already produced by validation:
  - `apps/skills-showcase/public/assets/github-proof-data.js`
  - `docs/skills-showcase/assets/github-proof-data.js`
  - These should contain the regenerated source fingerprint and recent history list.

## Test Plan
- Run targeted stale-route grep on active Product Design skills, excluding archives/generated data, and confirm no active `/prototype` or `$prototype` route recommendations remain where `logic-wiring` is intended.
- Run `npm run skills-showcase:validate-data` and confirm it exits 0 with no regenerated-data drift.
- Run `npm run skillpacks:verify`.
- Run `node scripts/skill-alignment-routing-audit.mjs --active`.
- Run `scripts/skill-install-routing-audit.sh --active`.
- Run `npm run skills-showcase:test`.
- Run `git diff --check`.
- Confirm `git status --short --branch` is clean after commit and push.

## Ship Steps
- Apply the four wording edits in the two active `user-flow-map/SKILL.md` files.
- Re-run the showcase data generation/validation path so the two proof-data assets remain current.
- Commit the wording fixes plus regenerated proof-data assets directly on `master`.
- Push to `origin/master`.
- Report the new commit hash and validation results.
