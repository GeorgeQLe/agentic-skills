---
name: benchmark-test-skill
description: Run verify and benchmark tests for one agentic-skills skill, producing pass-rate, latency, cost, and consistency metrics
type: execution
version: 1.0.0
argument-hint: "<skill name>"
---

# Benchmark Test Skill

Invoke as `$benchmark-test-skill <skill>`.

Use this skill when the user wants to benchmark-test a skill defined in this repository. The trailing argument is the skill under test, not a mode for that skill. For example, `$benchmark-test-skill design-system` tests the `design-system` skill with the harness; it does not run `design-system` against the current app or website.

This skill runs the agentic-skills test harness verification gate followed by the benchmark extension for a single skill.

## Input

- Required: one skill name, such as `design-system`.
- If no skill name is provided, ask the user which skill to benchmark-test.

## Execution

Run commands from `/Users/georgele/projects/tools/agentic-skills/tests`.

### Step 1 - Verify

```bash
pnpm verify --skill <SKILL>
```

- Expect layer1 and layer2 to pass with no birpc false-failure exit codes.
- Record pass/fail and wall time per layer.
- If verify fails, stop and report the failure. Do not run the benchmark step.

### Step 2 - Bench

Run only if verify passes:

```bash
pnpm bench --skill <SKILL> --runs 3 --chunk-size 3 --pause 0
```

- Use 3 iterations by default.
- The expected budget is about $1 per run for the current design-system variant; report actual cost from the benchmark output when available.
- The bench system persists raw data to `tests/benchmarks/runs/<skill>-<sessionId>/` and generates `report.json`.

### Step 3 - Report

Write results to `benchmark/test-<SKILL>-<YYYY-MM-DD>.md` at the repository root. Use the current date.

Populate the report from `report.json` and verify the output includes:

- verify table with layer status and wall time
- pass rate and Wilson 95% confidence interval
- failed assertions, if any
- latency p50, p95, and p99
- cost per run and total cost
- mean pairwise similarity and outlier count
- raw session path

## Output

Print a concise benchmark summary:

- verify pass/fail
- benchmark pass rate
- p50 latency
- total cost
- report path

## Constraints

- Do not audit or benchmark the app, website, docs, or product surface unless the user explicitly asks for a separate website/product benchmark workflow.
- Do not run `pnpm bench` when `pnpm verify` fails.
- Do not fabricate benchmark metrics. Use the command output and `report.json`.
- Do not create or modify GitHub Actions workflows.

## Next-Step Routing

If the skill fails verification or benchmark assertions, recommend `$session-triage <skill> benchmark failure`.

If the skill passes and the report is written, recommend `$ship`.
