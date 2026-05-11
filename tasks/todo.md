# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Phase 36 planned; ready for implementation planning.
**Last completed phase:** Phase 35 — Repository-Wide Custom Benchmark Coverage
**Current phase:** Phase 36 — Benchmark Output Quality Evaluation

## Priority Documentation Todo

- [x] Documentation is current; no missing or stale research, spec, roadmap, or task artifacts found.

## Current State

- Phase 35 is complete and archived at `tasks/phases/phase-35.md`.
- `tasks/roadmap.md` marks Phase 35 acceptance criteria complete.
- Repository benchmark coverage now has custom or explicitly blocked coverage rows for every current repository skill, with future skill creation/update workflows required to handle coverage.
- Phase 36 is now planned in `tasks/roadmap.md` to add rubric-based output-quality evaluation on top of existing benchmark contract assertions.
- Manual launch tasks from Phase 34 remain pending in `tasks/manual-todo.md`; they are non-blocking `after:` tasks, not current phase blockers.

## Next Work

- [ ] Run `$plan-phase 36` to turn the quality-evaluation roadmap into an implementation-ready task plan.

## Recommended Command

`$plan-phase 36`

## Review

- Phase 35 final validation passed with focused layer1 regression tests, full layer1, benchmark coverage validation, benchmark list output, standard skill audits, Skills Showcase generated-data freshness validation, and representative one-run Codex benchmarks for `run`, `plan-phase`, `benchmark-test-skill`, and `youtube-video-audit`.
- See `tasks/phases/phase-35.md` for full evidence, quality-gate manifest, and rollback notes.
- Phase 36 roadmap entry added on 2026-05-11 from user request to work through output-quality tests for benchmarked skills.
