---
skill: create-agentic-skill
agent: codex
captured_at: 2026-06-10T01:50:02Z
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Audit And Fix Research-Before-Alignment Skill Flow

## Summary
Fix active source skills so research-producing flows require user approval of the alignment page’s research scope before synthesized research is performed. Scope is active `global/` and `packs/` skill sources only, excluding archives, hibernated packs, and generated installed copies.

Audit findings from read-only inspection:
- 381 active source `SKILL.md` files.
- 270 active bundled `ALIGNMENT-PAGE.md` files.
- Shared convention currently says Stage 1 “performs research,” which propagates the bad sequence.
- 138 active `SKILL.md` files contain hard-coded old wording such as “Perform the research” or “Default to report-only: present findings...”
- `journey-map` and framework skills are confirmed examples of the old flow.

## Key Changes
- Update `docs/alignment-page-convention.md` to define a strict sequence:
  1. Minimal discovery only: inspect enough repo/user context to propose scope, sources, assumptions, output paths, and approval questions.
  2. Build `review` alignment page before synthesized research.
  3. Stop for final compiled YAML approval of research scope.
  4. After approval, perform synthesized research and write only non-canonical working packets.
  5. Update the alignment page with findings and stop again for artifact approval.
  6. Only after artifact approval, write canonical research/spec/task files and mark page `confirmed`.
- Regenerate bundled `ALIGNMENT-PAGE.md` files via `node scripts/upgrade-alignment-page.mjs`.
- Patch active `SKILL.md` files with bespoke old staged-research text so they match the new sequence.
- Archive and bump versions for every active `SKILL.md` whose behavior changes; update each `CHANGELOG.md`.
- Add a lesson to `tasks/lessons.md` capturing: research-producing skills must not synthesize research before the alignment page scope is approved.

## Tests
- Update `tests/layer1/alignment-gates.test.ts` to assert generated conventions no longer say Stage 1 performs research and instead require scope approval before synthesized research.
- Update `tests/layer1/research-approval-gate.test.ts` to reject old phrases like `Perform the research` in Stage 1 for active research skills.
- Update journey-specific coverage (`journey-map-alignment.test.ts` or equivalent) to verify `journey-map` does scope approval before research synthesis.
- Run:
  - `node scripts/upgrade-alignment-page.mjs --dry-run`
  - `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts layer1/research-approval-gate.test.ts layer1/journey-map-alignment.test.ts`
  - `scripts/skill-versions.sh --missing`
  - `scripts/skill-archive-audit.sh --strict`
  - `scripts/skill-deps.sh --broken`
  - `scripts/validate-skills-showcase-data.sh`
  - `git diff --check`

## Assumptions
- “All skills” means active source skills only, not archive snapshots or installed `.codex/skills` copies.
- Minimal pre-approval inspection is allowed only to frame the alignment page; no synthesized research claims, recommendations, candidate rankings, or working packets before scope approval.
- This is a behavior change, so version bumps and archives are required for changed `SKILL.md` files.
