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

This skill runs the agentic-skills test harness verification gate followed by the benchmark extension for a single skill. By default, benchmark both Claude and Codex runners and report them separately.

## Input

- Required: one skill name, such as `design-system`.
- If no skill name is provided, ask the user which skill to benchmark-test.

## Execution

Run commands from `/Users/georgele/projects/tools/agentic-skills/tests`.

### Step 1 - Eligibility Preflight

Before running verify, check whether the requested skill is a repository skill known to the benchmark harness:

```bash
pnpm bench --list-skills
```

- If `<SKILL>` is not listed, stop immediately and report `unknown skill: <SKILL>`.
- List the known repository skills from the command output.
- Do not run `pnpm verify` or `pnpm bench` for unknown skills.
- Read and report the listed coverage status for `<SKILL>`: `custom`, `generic`, or `blocked`.
- Skills with custom layer4 setups use skill-specific fixtures and assertions.
- Skills without custom layer4 setups use the harness generic smoke benchmark. Treat that as invocation/compliance evidence, not deep domain-quality evidence.
- If the row is `blocked`, stop before verify and bench. Report the blocked reason and next command from the list output.
- If the row is `generic`, continue only as generic smoke evidence and route missing custom coverage to `$targeted-skill-builder <SKILL> benchmark coverage`.

### Step 2 - Verify

```bash
pnpm verify --skill <SKILL>
```

- Expect layer1 to pass and layer2 to pass when target-specific tests exist.
- If layer2 reports no tests matched `<SKILL>`, treat that layer as skipped and continue to the benchmark step. Record the skip clearly because generic benchmark coverage is weaker than target-specific layer2 verification.
- Record pass/fail and wall time per layer.
- If verify fails, stop and report the failure. Do not run the benchmark step.

### Step 3 - Bench

Run only if verify passes:

```bash
pnpm bench --skill <SKILL> --agent both --runs 3 --chunk-size 3 --pause 0
```

- Use 3 iterations by default.
- Use `--agent both` by default. Only use `--agent claude` or `--agent codex` when the user explicitly asks to isolate one runner.
- The expected budget is about $1 per run for the current design-system variant; report actual cost from the benchmark output when available.
- The bench system persists raw data to `tests/benchmarks/runs/<skill>-<agent>-<sessionId>/` and generates `report.json`.
- Treat rate limits, quota exhaustion, and similar runner-capacity errors as infrastructure-blocked runs, not skill failures. Report them separately from evaluated pass rate.

### Step 4 - Report

Write results to `benchmark/test-<SKILL>-<YYYY-MM-DD>.md` at the repository root. Use the current date.

Populate the report from `report.json` and verify the output includes:

- verify table with layer status and wall time
- agent name, evaluated pass rate, blocked-run count, and Wilson 95% confidence interval
- failed assertions, if any
- infrastructure-blocked runs, if any
- latency p50, p95, and p99
- cost per run and total cost
- mean pairwise similarity and outlier count
- raw session path

## Output

Print a concise benchmark summary:

- verify pass/fail
- benchmark pass rate
- infrastructure-blocked count, if any
- p50 latency
- total cost
- report path

## Constraints

- Do not audit or benchmark the app, website, docs, or product surface unless the user explicitly asks for a separate website/product benchmark workflow.
- Do not run `pnpm bench` when `pnpm verify` fails.
- Do not fabricate benchmark metrics. Use the command output and `report.json`.
- Do not create or modify GitHub Actions workflows.

## Next-Step Routing

If the skill is unknown to the repository, recommend checking the skill name or creating the skill first with `$create-agentic-skill`.

If the skill has blocked benchmark coverage, recommend the row's `next_command`.

If the skill only has generic smoke benchmark coverage or otherwise lacks custom domain-quality assertions, recommend `$targeted-skill-builder <skill> benchmark coverage`.

If the skill fails verification or benchmark assertions, recommend `$session-triage <skill> benchmark failure`.

If benchmark runs are blocked only by rate limits or quota exhaustion, recommend re-running `$benchmark-test-skill <skill>` after the reset instead of treating the skill as failed.

If the skill passes and the report is written, recommend `$ship`.
