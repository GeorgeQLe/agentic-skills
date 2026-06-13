---
skill: exec
agent: codex
captured_at: 2026-06-12T13:07:08-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Framework-Specific Alignment Guidance

## Summary
Populate delegated framework skills with review-page instructions that reflect each framework’s research method, expected documentation shape, and useful user feedback prompts. Use the generator path, not hand edits: update `scripts/upgrade-alignment-page.mjs`, regenerate bundled `ALIGNMENT-PAGE.md` files, and verify drift is gone.

## Key Changes
- Extend `skillSpecificGates()` / framework translation logic in `scripts/upgrade-alignment-page.mjs` with per-framework guidance for:
  - Business research competitive frameworks: `porter-five-forces`, `swot`, `strategic-group-map`, `feature-pricing-matrix`.
  - Customer discovery frameworks: `w3-hypothesis`, `five-rings`, `four-forces`, `jtbd-needs`, `pmf-engine`, `seven-dimensions`.
  - Positioning frameworks: `category-design`, `jtbd-positioning`, `moore-positioning`, `obviously-awesome`, `strategic-canvas`.
  - Other generated delegated framework pages discovered by the generator check, especially `customer-lifecycle/journey-map/frameworks/*`, if they are in scope for `ALIGNMENT-PAGE.md` generation.
- Each framework instruction should cover three explicit concerns:
  - **Research focus:** what evidence the framework must gather and how to separate claims, evidence, inference, assumptions, and decision impact.
  - **Review/documentation format:** the page structure to use, such as W3 triptychs, force maps, SWOT quadrants, strategic maps, scorecards, value curves, Moore templates, or journey/service-blueprint diagrams.
  - **Suggested user feedback:** the concrete decisions reviewers should be asked to confirm, correct, or challenge, such as candidate definitions, scoring, axis choices, competitor set, confidence ratings, missing sources, or synthesis implications.
- Keep broad parent fallback guidance for unknown `invocation: sub-skill` frameworks, but make known delegated frameworks specific enough that generated alignment pages no longer read like generic research guidance.
- Regenerate generated bundles with `node scripts/upgrade-alignment-page.mjs`; do not hand-edit generated `ALIGNMENT-PAGE.md` files.
- If implementation touches `SKILL.md` versions or changelogs, use the repo’s archive/version workflow. If only generated `ALIGNMENT-PAGE.md` bundles and the generator change, do not bump every framework skill version unless the repo’s existing convention requires it for generated bundle behavior changes.

## Test Plan
- Run `node scripts/upgrade-alignment-page.mjs --check` and require `Generated bundles: ... exact`.
- Use `rg` to confirm each targeted framework bundle contains its specific inserted guidance and no stale generic-only fallback where a specific rule exists.
- Run the relevant layer tests for alignment generation, at minimum the alignment-page generator tests under `tests/layer1`.
- Run package/build verification if generated package output is expected to be committed: `npm run skillpacks:build` then the repo’s package verification command.

## Assumptions
- Source of truth is `packs/**` plus `global/**`; installed `.claude/skills`, `.codex/skills`, and `packages/skillpacks/build` should be refreshed only through existing repo tooling.
- No GitHub Actions changes.
- Existing dirty worktree changes are treated as user-owned and must not be reverted or mixed into unrelated edits.
