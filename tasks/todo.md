# Current Task State

## Priority Task Queue

_Updated 2026-06-29 by `/roadmap`. The active implementation task below (Three-Repo Split) is COMPLETE, shipped (commit `4b5734cd5`), and recorded in `tasks/history.md`. Working tree clean, pushed to `master`. No next implementation work is promoted into this todo. The items below are advisory routes, not unchecked execution steps._

**No blocking issues:** tree clean, no unpushed commits, no missing implementation steps in an active phase.

Advisory next routes (not promoted as active work):

- **Recommended:** `/reconcile-dev-docs fix tasks` (docs-health pack) — reconcile the 4 unchecked `tasks/manual-todo.md` items (Neon `DATABASE_URL`, `NEWSLETTER_ADMIN_SECRET`, Vercel env, live `/follow` verification, all tagged Step 38.x). Evidence: these belong to the Skills Showcase, now the separate `agentic-skills-showcase` repo — they are orphaned here and should be moved there or explicitly deferred.
- Advisory: `tasks/recurring-todo.md` has 2 active cadence items ("Devtool docs audit refresh", "Spec drift check"); promote to `tasks/todo.md` only if either becomes concrete execution work.

## Current Implementation - Materialize Agentic Skills Three-Repo Split

**Status: COMPLETE (reconciled 2026-06-29) — pending `/ship` to archive to `tasks/history.md`.**

Project: `agentic-skills`.

### Execution Profile

- Parallel mode: serial repo mutation, parallel read-only inspection where useful.
- Reason: this task moves repository boundaries and remotes; mutations must be staged, verified, and reversible.
- Safety boundary: do not create or modify GitHub Actions; do not discard current `agentic-skills` history; do not overwrite existing sibling directories; ask before creating GitHub repositories or moving the current checkout path.

### Proposed Local Layout

Recommended final layout:

```text
/Users/georgele/projects/tools/agentic-skills/
  skills/      -> https://github.com/GeorgeQLe/agentic-skills.git
  showcase/    -> https://github.com/GeorgeQLe/agentic-skills-showcase.git
  benchmarks/  -> https://github.com/GeorgeQLe/agentic-skills-benchmarks.git
```

Current reality (verified read-only 2026-06-29 via `gh repo view` / `gh api .../contents`):

- All three GitHub repos exist and are populated (default branch `master`, ~30 commits each):
  `GeorgeQLe/agentic-skills` (this checkout), `GeorgeQLe/agentic-skills-showcase` (created
  2026-06-29 17:20), and `GeorgeQLe/agentic-skills-benchmarks` (created 2026-06-29 19:30; received the
  catalog-pin determinism fix `dca929b` this session).
- Remote roots are correctly normalized: showcase has a Next.js app at repo root
  (`package.json`, `pnpm-lock.yaml`, `app/`, `src/`, `next.config.mjs`, …); benchmarks has the
  harness at root (`benchmark/`, `data/`, `tests/`, `scripts/`, `specs/`, `package.json`).
- The existing checkout `/Users/georgele/projects/tools/agentic-skills` points to
  `https://github.com/GeorgeQLe/agentic-skills.git`. Materialization happened out-of-band
  (parallel/prior session); `ef4151b65` removed the Showcase/benchmark trees from this repo and
  they were recovered from parent commit `b7c0775bc` into the sibling remotes.
- Local layout decision (this session): single `agentic-skills` checkout, **no** local sibling
  `showcase/`/`benchmarks/` clones — showcase and benchmarks are remote-only by choice.

### Plan

- [x] Inspect current tree, docs, git status, and split commit history.
- [x] Capture this implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Confirm the desired local directory layout and whether missing GitHub repos should be created if they do not already exist.
  - **Decision (2026-06-29):** all three GitHub repos already exist and are populated → none to create. Layout = single `agentic-skills` checkout, no local sibling clones; showcase/benchmarks remain remote-only by choice.
- [x] Stage a temporary extraction from `b7c0775bc` for showcase + benchmarks.
  - **Reconciliation note:** completed out-of-band on GitHub; the showcase/benchmark trees were materialized into their sibling remotes from `b7c0775bc`. Verified read-only (`gh repo view`, `gh api .../contents`); no local extraction needed.
- [x] Create the local repo layout without overwriting existing work.
  - **Reconciliation note:** chosen layout is the single-checkout option (no local sibling clones), so no local repo creation/move was required. The three independent remotes exist with `origin` configured authoritatively on GitHub.
- [x] Normalize repo roots after extraction.
  - **Reconciliation note:** verified remotely — showcase has the Next.js app at repo root (`package.json`, `pnpm-lock.yaml`, `app/`, `src/`, `next.config.mjs`); benchmarks has the harness at root (`benchmark/`, `data/`, `tests/`, `scripts/`, `specs/`, `package.json`).
- [x] Verify each repo.
  - **Reconciliation note:** verified read-only via `gh repo view` (default branch `master`, ~30 commits each) and `gh api .../contents` (root path classes as expected).
- [x] Commit and push intended changes in each repo after verification, then update this repo's task docs with results.
  - **Reconciliation note:** each remote is already populated and pushed (benchmarks received catalog-pin fix `dca929b` this session). This step is the task-doc reconciliation closing out the split.

### Acceptance Criteria (reconciled — all met)

- [x] Three independent repos exist for skills, showcase, and benchmarks — GitHub is authoritative and all three are populated. Skills is worked from this single local checkout; showcase/benchmarks are remote-only by choice (no accidental nested local repos).
- [x] The skills repo preserves the current `agentic-skills` history and remote.
- [x] The Showcase repo contains the app at its repo root and points to `GeorgeQLe/agentic-skills-showcase`.
- [x] The benchmark repo contains the benchmark harness/results at its repo root and points to `GeorgeQLe/agentic-skills-benchmarks`.
- [x] No nested git repos are accidentally tracked by another repo (no local sibling clones created).
- [x] No unrelated files are removed from the current checkout.
- [x] Each repo is populated and pushed on `master`.

### Test Plan

- `git -C <repo> status --short --branch`
- `git -C <repo> remote -v`
- `git -C <repo> fsck --no-reflogs` after initializing/copying history when practical.
- `git -C <repo> ls-files | rg '<expected boundary checks>'`
- Showcase: `pnpm install --frozen-lockfile` and existing `pnpm test` / `pnpm build` only if dependency install is already available or explicitly approved.
- Benchmarks: package/harness focused tests after dependency state is established.
- Skills: existing catalog/export validation is not expected to change unless task-doc metadata is committed here.
