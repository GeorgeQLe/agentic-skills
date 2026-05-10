---
name: full-sweep
description: Run verify (layer1+2) then bench for an agentic-skill, producing a dated report with pass rate, latency, cost, and consistency metrics
type: execution
version: 1.0.0
---

# Full Sweep

Run the agentic-skills test harness verification gate followed by the benchmark extension for a single skill. This skill exists to benchmark-test skills defined in this repo (`tools/agentic-skills`).

## Input

The user provides a skill name as the trailing argument (e.g. `/full-sweep design-system`).

If no skill name is provided, ask the user which skill to sweep.

## Execution

Run from `/Users/georgele/projects/tools/agentic-skills/tests`.

### Step 1 — Verify

```bash
pnpm verify --skill <SKILL>
```

- Expect layer1 + layer2 PASS with no birpc false-failure exit codes.
- Record pass/fail and wall time per layer.
- If verify fails, stop and report the failure. Do not run bench.

### Step 2 — Bench (only if verify passes)

```bash
pnpm bench --skill <SKILL> --runs 3 --chunk-size 3 --pause 0
```

- 3 iterations, ~$1/run, 180s timeout each.
- The bench system persists raw data to `tests/benchmarks/runs/<skill>-<sessionId>/` and generates `report.json`.

### Step 3 — Report

Write results to `benchmark/test-<SKILL>-<YYYY-MM-DD>.md` at the repo root (`tools/agentic-skills/benchmark/`). Use today's date.

Structure:

```markdown
# <Skill Name> — Test Report (<date>)

## Summary
- **Skill:** <skill>
- **Date:** <date>
- **Birpc fix validated:** yes/no

## Verification (layer1 + layer2)
| Layer  | Status | Wall Time | Notes |
|--------|--------|-----------|-------|
| layer1 | ...    | ...       |       |
| layer2 | ...    | ...       |       |

## Benchmark (N runs)
### Correctness
- Pass rate: X% (N/N passed)
- Wilson 95% CI: [X%, X%]
- Failed assertions (if any): ...

### Performance
| Metric | Value |
|--------|-------|
| p50    | Xs    |
| p95    | Xs    |
| p99    | Xs    |

### Cost
- Per run: ~$X.XX
- Total: $X.XX

### Consistency
- Mean pairwise similarity: X.XXX
- Outliers: N

## Raw Data
Session: `tests/benchmarks/runs/<skill>-<sessionId>/`
```

Populate from `report.json` and verify output.

## Output

Print a one-line summary (pass/fail, pass rate, p50 latency, total cost) and confirm the report path.
