---
skill: exec
agent: codex
captured_at: 2026-06-02T00:56:52-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Mirror quiz-me, uat-guide, and taste-calibration for Codex

## Summary
Add Codex-side mirrors for the three currently Claude-only pack skills:

- `packs/knowledge-check/codex/quiz-me`
- `packs/guided-walkthrough/codex/uat-guide`
- `packs/alignment-loop/codex/taste-calibration`

Preserve the Claude skill intent and versions, but normalize runner-specific command syntax, input handling, and user-question mechanics for Codex.

## Key Changes
- Create Codex `SKILL.md` mirrors for all three skills:
  - `quiz-me`: keep the read-only quiz workflow; replace Claude `AskUserQuestion` wording with Codex-compatible user-question guidance.
  - `uat-guide`: convert `/uat-guide`, `/uat`, `/debug`, `/guide`, `/ux-variations`, and `/pack install ...` routing to `$...`; read `AGENTS.md` and `CLAUDE.md` when present.
  - `taste-calibration`: replace Claude-only subagent assumptions with “use permitted non-mutating exploration/subagents when available”; route continuation to `$destination-doc`.
- Add Codex `agents/openai.yaml` metadata for the three new mirrors, following existing Codex pack conventions.
- Copy or add companion files:
  - Copy `uat-guide`’s `ALIGNMENT-PAGE.md` and `CHANGELOG.md` into the Codex mirror.
  - Add missing `CHANGELOG.md` files for `quiz-me` and `taste-calibration` on both Claude and Codex sides with initial `v0.0` entries, matching the repo’s skill versioning rule.
- Update shared docs and pack metadata:
  - Remove “Claude-only” notes for `quiz-me` and `uat-guide` in `docs/skills-reference.md`.
  - Update `packs/alignment-loop/PACK.md` so the pack is no longer described as Claude-orchestration-only.
  - Search for stale slash-route references to these skills and convert Codex-side references to `$...`.
- Update benchmark/test metadata:
  - Remove `uat-guide` from the Claude-only blocked benchmark list.
  - Add or update pack workflow coverage so `uat-guide` has an executable Codex fixture.
  - Leave existing `quiz-me` and `taste-calibration` fixtures in place unless tests expose stale assumptions.
- Regenerate skills showcase data after the source changes, using a clean temporary worktree or staged-only workflow to avoid mixing in unrelated current dirty-tree/generated drift.

## Test Plan
- Add a focused layer-1 parity test asserting these three pack skills now have active Claude and Codex `SKILL.md` files.
- Assert no docs still describe `quiz-me`, `uat-guide`, or `taste-calibration` as Claude-only.
- Run:
  - `pnpm test -- tests/layer1/...`
  - targeted benchmark setup tests that cover `quiz-me`, `uat-guide`, and `taste-calibration`
  - `bash scripts/validate-skills-showcase-data.sh`
- Run `git diff --check` and verify only intended files are staged before commit.

## Assumptions
- This is mirror work only; no behavioral redesign of the Claude skills.
- Existing versions stay the same: `quiz-me v0.0`, `taste-calibration v0.0`, `uat-guide v0.1`.
- `delegate` and `patch-exec-profile` remain intentionally Claude-only unless separately requested.
- `project-fleet` and `spin-off` remain Codex-only unless separately requested.
