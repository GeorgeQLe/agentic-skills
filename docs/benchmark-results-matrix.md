# Benchmark Results Matrix

> Last updated: 2026-05-11

This matrix tracks skills that already have persisted benchmark run data and grades. It is separate from the benchmark coverage registry in `tests/harness/bench-coverage.ts`, which tracks whether a skill has custom, generic, or blocked setup coverage.

## Status Definitions

| Status | Meaning |
|---|---|
| `graded` | Persisted benchmark data exists with evaluated runs and either hard assertion grades, output-quality grades, or both. |
| `partially graded` | Persisted evaluated runs exist, but quality scoring or subjective review is missing. |
| `blocked/incomplete` | Persisted report exists, but no evaluated skill run was completed. |

## Current Graded Skills

| Skill | Agent | Latest Raw Report | Runs | Hard Pass Rate | Output Quality | Subjective Review | Status | Notes |
|---|---|---:|---:|---:|---:|---|---|---|
| `benchmark-agent-review` | Codex | `tests/benchmarks/runs/benchmark-agent-review-codex-1d9a5c8b/report.json` | 1 | 100% | 100% | none | graded | One evaluated persisted run with deterministic quality scoring. |
| `benchmark-test-skill` | Codex | `tests/benchmarks/runs/benchmark-test-skill-codex-8a1dccd0/report.json` | 1 | 100% | not scored | none | partially graded | Hard assertion evidence exists; no quality score in the latest persisted evaluated report. |
| `design-system` | Claude | `tests/benchmarks/runs/design-system-claude-d263df0d/report.json` | 3 | 100% | not scored | none | partially graded | Curated report: `benchmark/test-design-system-2026-05-10.md`. |
| `design-system` | Codex | `tests/benchmarks/runs/design-system-codex-7fba9da2/report.json` | 1 | 100% | 90.9% | none | graded | Later raw report supersedes the earlier curated Codex failure in `benchmark/test-design-system-2026-05-10.md`. |
| `investigate` | Codex | `tests/benchmarks/runs/investigate-codex-701bd642/report.json` | 1 | 100% | 100% | none | graded | Representative Phase 36 quality-scored run. |
| `plan-phase` | Codex | `tests/benchmarks/runs/plan-phase-codex-5b50adee/report.json` | 1 | 100% | not scored | none | partially graded | Hard assertion evidence exists; no quality score in the latest persisted evaluated report. |
| `run` | Claude | `tests/benchmarks/runs/run-claude-2e876403/report.json` | 3 | 100% | 100% | none | graded | Curated report: `benchmark/test-run-2026-05-11.md`. |
| `run` | Codex | `tests/benchmarks/runs/run-codex-47e0dd54/report.json` | 3 | 100% | 100% | none | graded | Curated report: `benchmark/test-run-2026-05-11.md`. |
| `run-kanban` | Codex | `tests/benchmarks/runs/run-kanban-codex-776ecf18/report.json` | 1 | 100% | 82.5% | none | graded | Representative pack-skill quality-scored run. |
| `ship` | Claude | `tests/benchmarks/runs/ship-claude-726530ae/report.json` | 3 | 100% | 78.6% | `benchmark/review-ship-2026-05-11.md` | graded | Curated report: `benchmark/test-ship-2026-05-11.md`; subjective review median score was 79. |
| `ship` | Codex | `tests/benchmarks/runs/ship-codex-b69cb187/report.json` | 3 | 100% | 78.6% | `benchmark/review-ship-2026-05-11.md` | graded | Curated report: `benchmark/test-ship-2026-05-11.md`; subjective review median score was 79. |
| `youtube-video-audit` | Codex | `tests/benchmarks/runs/youtube-video-audit-codex-674c4a5c/report.json` | 1 | 100% | not scored | none | partially graded | Hard assertion evidence exists; no quality score in the latest persisted evaluated report. |

## Incomplete Persisted Reports

| Skill | Agent | Raw Report | Status | Notes |
|---|---|---|---|---|
| `affected` | Codex | `tests/benchmarks/runs/affected-codex-3c36c9a8/report.json` | blocked/incomplete | Report exists with zero total and evaluated runs. Do not count as benchmarked. |
| `benchmark-test-skill` | Codex | `tests/benchmarks/runs/benchmark-test-skill-codex-7f77992e/report.json` | blocked/incomplete | Persisted report exists but the run was infrastructure-blocked. Prefer the later evaluated report listed above. |

## Coverage Gaps

- Most repository skills have custom benchmark setup coverage but do not yet have persisted evaluated benchmark data and grades.
- The website currently has no public benchmark-results surface. A follow-up should expose this matrix or generated data derived from it in the Skills Showcase.
- `commit-and-push-by-feature` and `sync` are currently blocked in the coverage registry, but they are plausible candidates for safe benchmark fixtures when a user explicitly permits creation of a temporary GitHub test repository through `gh`.

## Safe Git-Fixture Candidate

For `commit-and-push-by-feature` and `sync`, a safe setup can be designed around an ephemeral test repository instead of the primary repository:

- Require explicit user permission before any live GitHub operation.
- Create a temporary private GitHub repository with `gh repo create`.
- Seed it with a minimal fixture project and a default branch.
- Run the skill against only that temporary repository.
- Assert expected git/remote behavior from the temporary repo state and persisted benchmark output.
- Delete or archive the temporary repository at the end of the run, with cleanup failure reported as infrastructure-blocked.

This would convert those two skills from blocked coverage candidates into live, permission-gated integration benchmark targets without risking the main `agentic-skills` repository.
