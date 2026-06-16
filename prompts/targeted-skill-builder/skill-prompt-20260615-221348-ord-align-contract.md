---
skill: targeted-skill-builder
agent: codex
captured_at: 2026-06-15T22:13:48-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# ord-align Staged Review Contract Update

## Summary

Update existing `ord-align` skill contracts, not create a new skill. The durable fix is to make `ord-align` use a lightweight report-first HTML approval gate before it writes `alignment/ord-<slug>.md`, matching the newer staged-review pattern already present in `ord-scan`.

Evidence used: current prompt, `tasks/lessons.md`, `packs/ord/{codex,claude}/ord-align/SKILL.md`, `ord-scan` staged contract and `ALIGNMENT-PAGE.md`, benchmark coverage registration. Broad session-history scans are intentionally skipped because the incident is already verified and scoped.

## Key Changes

- Archive and bump both active `ord-align` contracts from `v0.0` to `v0.1` using `scripts/skill-archive.sh`.
- Update both:
  - `packs/ord/codex/ord-align/SKILL.md`
  - `packs/ord/claude/ord-align/SKILL.md`
- Add mirrored `CHANGELOG.md` files for `ord-align`.
- Add mirrored `ALIGNMENT-PAGE.md` files for `ord-align`, derived from `ord-scan` but scoped to `alignment/ord-align-{topic}.html`.
- Add the new staged flow:
  - Stage 1: minimal candidate/scope discovery only, plus 1-3 required user questions when needed.
  - Stage 1 output: `review` HTML page at `alignment/ord-align-<slug>.html`.
  - Stop for final compiled YAML before namespace checks, synthesized feasibility verdict, or markdown write.
  - Stage 2: after approval, run npm namespace checks, existing-solution checks, feasibility analysis, and evidence review in the HTML page.
  - Stage 3: after final artifact approval, write `alignment/ord-<slug>.md` only for approved GO outcomes, then mark the HTML page `confirmed`.
- Keep `ord-align` lightweight: no full `ord-scan` research depth, no working packet unless needed, and no implementation/scaffolding.

## Tests And Validation

- Add or tighten a deterministic `ord-align` benchmark assertion in `tests/layer4/setups/packs/pack-workflows.setup.ts` requiring:
  - `alignment/ord-align-<slug>.html`
  - report-first approval gate language
  - compiled YAML approval
  - no direct `alignment/ord-<slug>.md` write before approval
- Keep `tests/harness/bench-coverage.ts` registered for `ord-align`; update only if the setup path or status changes.
- Run validation:
  - `npx skillpacks refresh`
  - `./scripts/skill-deps.sh --broken`
  - `./scripts/skill-versions.sh --missing`
  - `./scripts/skill-next-step-routing.sh --missing`
  - `pnpm --dir tests bench:coverage`
  - focused layer4 setup tests for the changed benchmark setup
  - `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`
  - `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`
  - `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
  - targeted `rg` checks for `Report-First`, `alignment/ord-align-`, `compiled YAML`, and blocked markdown writes
  - `diff -u` between Codex and Claude `ord-align` skill files
  - `git diff --check`

## Task And Shipping Work

- Capture this visible invocation under `prompts/targeted-skill-builder/skill-prompt-YYYYMMDD-HHMMSS-ord-align-contract.md`.
- Record the implementation plan in `tasks/roadmap.md` and current checklist in `tasks/todo.md`.
- Add `tasks/todo.md` review notes with validation results.
- Refresh generated package/build/showcase artifacts required by the skill metadata/behavior change.
- Commit and push all intended tracked changes on the primary branch per repo contract.

## Assumptions

- The editable source of truth is `packs/ord/{codex,claude}/ord-align`, not the generated `packages/skillpacks/build/...` copies.
- `ord-align` should remain a rapid ORD validation skill, so the fix adds approval gates and review HTML without expanding it into full `ord-scan` depth.
- Markdown `alignment/ord-<slug>.md` remains the final approved GO artifact path.
