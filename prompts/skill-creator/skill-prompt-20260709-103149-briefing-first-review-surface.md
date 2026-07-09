---
skill: skill-creator
agent: codex
captured_at: 2026-07-09T10:31:49-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Briefing-First Review Surface Plan

## Summary
Implement briefing slides as the primary review surface whenever the `briefing-slides` convention is installed, while always creating dense `interrogation/*.html` and `alignment/*.html` pages first as canonical backup/reference surfaces. This should be implemented at the shared convention layer, not by manually editing every research/design skill.

## Key Changes
- Update the shared briefing-slides convention to make the workflow explicit:
  - Produce dense interrogation/alignment HTML first.
  - Then produce `briefing-slides/<skill>-<topic>.html`.
  - Open only the briefing deck.
  - Link dense pages and source artifacts from the deck.
  - Route compiled YAML back to the producing skill, not `$create-briefing-slides`.

- Tighten the alignment and interrogation conventions:
  - Replace the current vague “when briefing-slides is installed, follow it” browser-open wording with a concrete briefing-first sequence.
  - Make dense pages explicitly “canonical backup/reference surfaces” once the briefing deck exists.
  - Preserve stable behavior: if the briefing-slides convention asset is absent, open the dense page as today.

- Update generator/check surfaces so future stubs and audits preserve the behavior:
  - Adjust `scripts/upgrade-alignment-page.mjs` and `scripts/upgrade-interrogation-page.mjs` only if their generated resolver/stub text needs to mention the briefing-first backup-page contract.
  - Extend `scripts/skill-convention-bundle-audit.mjs` so it fails if canary briefing-first language disappears from the briefing convention or from alignment/interrogation open-step conventions.
  - Keep the fix convention-level; do not add `briefing-slides` to every research/design skill’s `required_conventions`.

- Keep package behavior aligned:
  - Ensure canary packages continue shipping `assets/briefing-slides-convention.md` and managed docs.
  - Do not run any `npx skillpacks install/init/which` commands in this repo.
  - Preserve unrelated existing edits in `packages/skillpacks/package.json` and `packages/skillpacks/dist/skillpacks-manifest.json`; inspect before rebuilding or staging.

## Test Plan
- Run convention audits:
  - `node scripts/skill-convention-bundle-audit.mjs`
  - `node scripts/audit-briefing-slides.mjs`
- Run package checks:
  - `npm --workspace packages/skillpacks run build:check`
  - `SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run build:check`
- Verify package contents after canary build:
  - Confirm `assets/briefing-slides-convention.md` exists.
  - Confirm alignment/interrogation convention assets contain the briefing-first dense-backup language.
- Spot-check active skills:
  - Confirm a research framework subskill and a product-design skill still point to alignment/interrogation conventions and inherit briefing-first behavior through those shared docs.

## Assumptions
- “Briefing slides first” means first opened/primary review surface, not first artifact written.
- Dense interrogation/alignment pages remain mandatory canonical artifacts and backups.
- Stable releases keep current dense-page-first behavior unless the briefing-slides convention is present.
- The right implementation is shared-convention enforcement, not editing all 186 research/design/framework producer skills individually.
