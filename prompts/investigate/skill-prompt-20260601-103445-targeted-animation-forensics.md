---
skill: investigate
agent: codex
captured_at: 2026-06-01T10:34:45-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Targeted Animation Forensics Plan

## Summary
Execute a targeted forensic analysis to identify where the `/prototype` pack/drawer animation last worked, which commit or session changed the intended sequence, and how Codex vs. Claude Code chat history explains the design intent. Produce a committed markdown report plus a concise follow-up fix plan if any issue remains.

## Key Changes
- Create prompt-history entries for the invoked analysis skills, then track the work in `tasks/roadmap.md` and `tasks/todo.md`.
- Analyze the animation commit cluster from `d6e688cc` through `781d44c1`, focusing on the pack/drawer files and `animation-audit-pack-drawer.html`.
- Build a timeline table with:
  - commit hash, date, author, touched animation files
  - intended behavior stated by commit/message/chat
  - observed code behavior
  - verdict: working, regressed, partial, or repaired
- Search Claude and Codex history with a filtered parser, not raw recursive grep:
  - Claude: `~/.claude/history.jsonl`, `~/.claude/projects/**`, `~/.claude/sessions/**`
  - Codex: `~/.codex/history.jsonl`, `~/.codex/sessions/**`
  - Filter by this repo path plus terms like `SealedPack`, `PackOpener`, `BottomSheet`, `animation-audit-pack-drawer`, `layout-morph-out`, `drop-elevation`, `collapse-complete`, and `/prototype`.
  - Exclude system/developer/tool-output text from intent evidence unless it records actual file edits.
- Compare source snapshots at the key commits using `git show <commit>:<path>` and `git blame`, without checking out over the current working tree.
- If runtime confirmation is needed, use temporary worktrees under `/tmp` for selected commits only, prioritizing:
  - `d6e688cc` drawer introduction
  - `e6652913` first close apex/debug timing
  - `fcc302a5` z-index close apex
  - `558a9873` flash fix
  - `4d076fff` debug harness
  - `3ed1e11a` two-stage open
  - `781d44c1` current repair

## Deliverables
- `docs/history/animation-pack-drawer-forensics-YYYY-MM-DD.md` containing:
  - known-good implementation and commit
  - first breaking or behavior-changing commit
  - whether breakage came from code, debug harness mismatch, or both
  - Claude/Codex session excerpts with source path/session/date
  - final root-cause summary and remaining risks
- `alignment/investigate-animation-pack-drawer.html` if the `investigate` skill’s alignment-page contract applies during execution.
- `tasks/todo.md` review section summarizing commands run, findings, and whether a follow-up implementation plan is needed.
- Commit and push all intended tracked artifacts when complete.

## Test Plan
- Verify history extraction by reporting counts for matched Claude sessions, Codex sessions, and matched commits.
- Verify each quoted chat-history claim has a source path/session id/timestamp.
- Verify every “working” or “broken” verdict is backed by either source diff evidence, audit HTML expectation, test result, or manual runtime observation.
- Run repo checks after report creation:
  - `pnpm --dir apps/skills-showcase typecheck`
  - `pnpm --dir apps/skills-showcase test`
  - `git diff --check`

## Assumptions
- Use a targeted scope: this repo, the pack/drawer animation files, relevant commits, and filtered Claude/Codex sessions.
- Do not change animation code during this analysis pass; produce a follow-up fix plan if new implementation work is discovered.
- Treat current unrelated unstaged files as user/generated work and do not revert them.
- Leave the currently running dev server alone unless runtime checks require a temporary isolated server on another port.
