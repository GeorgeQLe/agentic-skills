# Test Harness

## Terminology

| Term | Meaning | Command |
|------|---------|---------|
| **verify** | Layer 1+2 gate (unit + integration). Binary pass/fail. | `pnpm verify --skill <SKILL>` |
| **bench** | Repeated runs for metrics (pass rate, latency, cost, consistency). | `pnpm bench --skill <SKILL> --runs N` |
| **full sweep** | Verify first, then bench if it passes. | verify → bench sequentially |

- **test harness** — the infrastructure under `tests/harness/` (runner, persistence, reporting).
- **benchmark extension** — the bench runner (`bench.ts`) built on top of the harness.

## Layers

| Layer | Purpose | Speed | Cost |
|-------|---------|-------|------|
| 1 | Unit tests (frontmatter, routing, paths) | <10s | $0 |
| 2 | Integration (runs skill against fixture spec) | 80–180s | ~$1/test |
| 3 | Live agent tests | minutes | varies |
| 4 | Bench via vitest (`bench:quick`) | minutes | ~$1/run |

## Full Sweep Prompt

Paste into Claude Code and append the skill name at the end:

```
Run a full sweep of the agentic-skills test harness from /Users/georgele/projects/tools/agentic-skills/tests.

1. Verify: `pnpm verify --skill <SKILL>` — expect layer1 + layer2 PASS with no birpc false-failure exit codes. Record pass/fail and wall time per layer.
2. Bench (only if verify passes): `pnpm bench --skill <SKILL> --runs 3 --chunk-size 3 --pause 0` — 3 iterations, ~$1/run, 180s timeout each.
3. Report: Write results to `benchmark/test-<SKILL>-2026-MM-DD.md` (use today's date) at the repo root (`tools/agentic-skills/benchmark/`). Include: verify table, pass rate + Wilson CI, latency p50/p95/p99, cost, consistency, session path. Use the report.json from the bench session for exact numbers.

If verify fails, stop and report the failure — don't run bench. Skill:
```

## Bench Defaults

- **Runs:** 3 (baseline), 10+ (confidence), 100 (full statistical power)
- **Chunk size:** equal to runs for small N, 25 for large N
- **Pause:** 0 for small N, 1800s for large N (rate limit safety)
- **Budget:** ~$1/run for design-system variant

## Report Location

Reports go to `tools/agentic-skills/benchmark/test-<skill>-<date>.md`. Raw session data persists in `tests/benchmarks/runs/<skill>-<sessionId>/`.
