---
skill: create-agentic-skill
agent: codex
captured_at: 2026-06-12T11:36:46-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Optional Alignment Pages For Operational Skills

## Summary
Change the selected operational/planning/status skills so they no longer create alignment pages automatically. Their default output becomes inline conversation summary plus normal durable artifacts (`tasks/*.md`, reports, queues, or status docs). They may still create `alignment/*.html` only when the user requests it or when the agent explicitly flags a concrete clarification/review need.

## Key Changes
- Add an “optional alignment page” policy to `scripts/upgrade-alignment-page.mjs`:
  - Introduce an `OPTIONAL_ALIGNMENT_SKILLS` set for the agreed first batch.
  - Generate a different `SKILL.md` stub for those skills: default inline/task artifacts; create an alignment page only on request or justified clarification need.
  - Generate matching `ALIGNMENT-PAGE.md` bundles whose first paragraph is conditional, while keeping the existing gate/YAML/page contract for cases where a page is actually created.
- First-batch optional skills:
  - `roadmap`, `research-roadmap`, `plan-phase`
  - `brainstorm`, `devtool-workflow`, `game-workflow`, `game-roadmap`, `experiment`, `mono-plan`, `vertical-slice-splitter`
  - `reconcile-dev-docs`, `analyze-sessions`, `prompt-history-backfill`, `benchmark-test-skill`, `benchmark-agent-review`
  - `afps-status`, `handoff`, `branch-lifecycle`, `release`, `product-line`, `skill-inventory`, `provision-agentic-config`
- Keep automatic alignment pages for approval-gated research/spec/product skills, including:
  - `idea-scope-brief`, `feature-interview`, `spec-interview`, `ui-interview`, `user-flow-map`, `ux-variations`, `consolidate-variations`, `design-system`
  - customer discovery, positioning, competitive analysis, journey-map frameworks, and similar research/spec-producing skills.
- Clean up the current inconsistency:
  - `roadmap` is in `alignment-skip-list.txt` but still has a hand-authored automatic alignment section.
  - Convert `roadmap` to the new optional generated policy and remove it from the “no alignment contract” skip semantics.
  - Add or convert `plan-phase` only to the optional policy, not automatic page creation.
- Update `scripts/alignment-skip-list.txt` comments so it means “excluded from automatic/generated alignment policy” only for skills that truly should have no alignment contract.
- Versioning:
  - For every changed `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>` first.
  - Bump each changed skill version by one decimal and add a `CHANGELOG.md` entry dated `2026-06-12`.
  - Regenerate affected `ALIGNMENT-PAGE.md` files through `node scripts/upgrade-alignment-page.mjs`; do not hand-edit generated bundles.

## Test Plan
- Update layer1 tests that currently require automatic roadmap/research-roadmap gates:
  - `tests/layer1/afps-alignment-preview-gates.test.ts`
  - `tests/layer1/alignment-gates.test.ts`
- Add assertions that optional skills contain:
  - default inline/task-artifact behavior
  - conditional alignment-page creation only on request or explicit clarification need
  - no “build before writing tasks/roadmap.md” automatic blocker language
- Preserve assertions that core approval-gated skills still require full alignment pages before canonical writes.
- Run:
  - `node scripts/upgrade-alignment-page.mjs --check`
  - `npm test -- tests/layer1/alignment-gates.test.ts tests/layer1/afps-alignment-preview-gates.test.ts tests/layer1/codex-interview-cadence.test.ts`
  - broader layer1 suite if targeted tests pass.

## Assumptions
- “Those updates” means the first-batch skill list from the prior answer, not every skill with an `ALIGNMENT-PAGE.md`.
- Optional alignment pages still use the existing page contract when created; the change is when they are required, not the HTML/YAML format.
- After implementation, commit and push all intended tracked changes on `master`, leaving unrelated existing worktree edits untouched.
