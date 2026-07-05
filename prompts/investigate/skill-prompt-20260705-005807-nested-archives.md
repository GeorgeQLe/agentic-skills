---
skill: investigate
agent: codex
captured_at: 2026-07-05T00:58:07-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Fix Nested Archived Skill Copies In Source-Checkout Installs

## Summary

The user’s claim is confirmed. In `vectorfit-redux`, `category-design` is not installed as a top-level skill, but its archived versions are being copied under the installed `positioning` skill at `.codex/.claude/skills/positioning/frameworks/category-design/archive/*`.

Root cause: the Node installer already recursively excludes `archive/`, but the source-checkout shell installer still only skips a top-level `archive` entry before `cp -R`, so nested framework archives are copied. The relevant fix is in `scripts/skill-links.sh`, not in `install-deck`.

## Key Changes

- Add the required prompt capture under `prompts/investigate/`, then update `tasks/roadmap.md`, `tasks/todo.md`, and `tasks/lessons.md` for this regression.
- Replace the shell `sync_skill_install` copy loop with a recursive helper that:
  - skips any directory named `archive` at every depth,
  - skips `.agentic-skills-managed`,
  - preserves normal files, dotfiles, directories, and symlinks with existing copy behavior.
- Leave pinned archive installs unchanged: when the source itself is `archive/<version>`, keep using the symlink path.
- Do not change active `SKILL.md` versions; this is installer behavior, not a skill contract change.
- After fixing source, clean the reported repo by running the fixed source-checkout refresh against `/Users/georgele/projects/web/dev/vectorfit-redux` so managed `positioning` installs are recopied without nested archives. This write is outside the current repo and should be run with approval/escalation.

## Tests

- Extend `tests/layer1/skill-links-install.test.ts` with a nested fixture like `source/frameworks/category-design/archive/v0.0/SKILL.md`; assert the installed target keeps `frameworks/category-design/SKILL.md` but has no `archive` path anywhere.
- Extend or add package lifecycle coverage to check `business-research` installs do not copy archives under `positioning/frameworks/category-design`, not only `customer-discovery`.
- Run:
  - `pnpm --dir tests exec vitest run --project layer1 layer1/skill-links-install.test.ts`
  - `node --test packages/skillpacks/test/lifecycle.test.mjs`
  - `npm --workspace packages/skillpacks run build:check`
  - `npm run skillpacks:verify`
  - `node scripts/audit-task-docs.mjs`
  - `git diff --check`
- Verify `vectorfit-redux` after refresh:
  - no `.codex/skills/positioning/frameworks/*/archive`
  - no `.claude/skills/positioning/frameworks/*/archive`
  - no top-level `.codex/.claude/skills/category-design`

## Assumptions

- The intended installed shape is: framework subskills may exist inside parent skill directories, but their `archive/` directories must never be copied into latest managed installs.
- The existing Node lifecycle behavior is correct; the regression is the shell/source-checkout installer path.
- The fix should be committed and pushed from `agentic-skills`; the `vectorfit-redux` cleanup is a verification/remediation step, not a source change to that repo unless its `.agents` state changes unexpectedly.
