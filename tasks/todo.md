# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Phase 39 planned and ready for execution.
**Current phase:** Phase 39 of 39 — Benchmark Results Visibility And Safe Git Fixtures
**Last completed phase:** Phase 38 — First-Party Newsletter Capture And Admin

## Phase 39: Benchmark Results Visibility And Safe Git Fixtures

**Goal:** Make already-benchmarked skills visible as a durable results matrix and unblock safe integration benchmark setups for git-mutating workflows that can run against disposable test repositories.

**Source:** User request on 2026-05-11 and `docs/benchmark-results-matrix.md`.

**Scope:**
- Promote `docs/benchmark-results-matrix.md` into a generated or validated source of truth for persisted benchmark run data and grades.
- Add a Skills Showcase surface for benchmark results that distinguishes setup coverage from completed benchmark evidence and grades.
- Design permission-gated, disposable GitHub test-repository fixtures for `commit-and-push-by-feature` and `sync`.
- Require explicit user approval before any `gh` operation that creates, mutates, or deletes a live GitHub test repository.
- Treat test-repo cleanup failures as infrastructure-blocked evidence, not skill failures.

**Non-Goals:**
- Do not run live GitHub repository creation without explicit user permission.
- Do not run git-mutating benchmarks against the primary `agentic-skills` repository.
- Do not create, modify, or recommend GitHub Actions.

**Acceptance Criteria:**
- [ ] A clean benchmark-results matrix lists skills with persisted evaluated benchmark data, hard pass rates, quality scores, subjective review grades when present, and raw report paths.
- [ ] Skills Showcase exposes benchmark results or links to the generated matrix without confusing coverage status with completed graded runs.
- [ ] `commit-and-push-by-feature` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [ ] `sync` has a safe fixture plan using an explicit-permission disposable GitHub test repository.
- [ ] The benchmark coverage registry reflects any newly unblocked setup status only after the safe fixture is implemented and validated.
- [ ] Cleanup and infrastructure-block handling are documented for the disposable repository workflow.
- [ ] No GitHub Actions are created, modified, or recommended.

**Parallelization:** serial for live-GitHub fixture design and validation.
**Coordination Notes:** Keep this work serial because it touches benchmark evidence semantics, website presentation, and live external repository safety. Treat any `gh`-backed execution as an explicit operator-approved integration test.

> Test strategy: tests-after

### Implementation
- [ ] Step 39.1: [to be planned with `/run`]

## Routing

- **Next work:** Phase 39 step planning — decompose into implementation steps
- **Recommended next command:** `/run`
