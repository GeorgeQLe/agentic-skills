# Benchmark Improvement Loop

This repo runs a **human-approved, git-tracked** version of a self-improving skill loop.
The benchmark harness already grades every skill; this doc describes how a *regression*
in that grade is detected and routed back into a fix, so the loop **closes** (a regression
is caught) and **compounds** (each graded run is recorded and compared to the last).

Every step is advisory: the tooling only **detects** and **routes** (`Recommended next skill:`).
It never bumps a version or edits a skill autonomously — a human approves each transition.

## The five artifacts

| Arm | Artifact |
| --- | --- |
| Reward signal | `pnpm bench` → `tests/benchmarks/runs/**/report.json` (gitignored run evidence) |
| Grade history | `benchmark/grade-history.json` (tracked, append-only, keyed `"<skill>\|<agent>"`) |
| Regression detector | `scripts/benchmark-regression-check.mjs` |
| Reflect / curate | `/session-triage <skill> benchmark regression` |
| Apply fix | `/targeted-skill-builder <skill> benchmark regression` + `scripts/skill-archive.sh` + CHANGELOG |

## The cycle

```
/benchmark-test-skill <skill>
        │  pnpm bench → report.json (passRate, wilsonLower, qualitySummary)
        ▼
node scripts/benchmark-regression-check.mjs <skill>
        │  compares fresh grade vs prior grade in grade-history.json
        │  appends the new grade row (always)
        ├── improvement / stable ──► report the grade, done
        └── regression (exit 1) ──► Recommended next skill: /session-triage <skill> benchmark regression
                                          │  carries the prior-vs-new delta
                                          ▼
                               /session-triage <skill> benchmark regression
                                          │  confirm real vs thin-sample artifact, then classify:
                                          ├── harness / rubric drift ──► fix the setup/fixture/evaluator
                                          │                              (false-negative-family logic)
                                          └── real behavioral regression
                                                     ▼
                                          /targeted-skill-builder <skill> benchmark regression
                                                     │  narrow contract fix
                                                     ▼
                                          scripts/skill-archive.sh + version bump + CHANGELOG
                                                     ▼
                                          /benchmark-test-skill <skill>   (re-run)
                                                     │
                                                     ▼
                                          grade recovers in grade-history.json → loop closed
```

## Regression thresholds

`scripts/benchmark-regression-check.mjs` emits `regression` when, relative to the prior
graded run for that `skill|agent`, **any** of:

- `passRate` drops by ≥ 10 percentage points
- `wilsonLower` (Wilson 95% lower bound) drops by ≥ 10 percentage points
- `averageScore` (output-quality) drops by ≥ 10 percentage points
- the status badge is demoted: `graded` → `partially graded` → `blocked`

It emits `improvement` when no regression fired and any metric rose ≥ 10pp or the badge was
promoted; otherwise `stable`. A first-seen `skill|agent` only seeds a baseline (exit 0).
Thresholds live in the script header (`THRESHOLD`) — keep them in sync with the two SKILL.md
contracts that reference this doc.

A regression is **distinct from an absolute benchmark failure**: a skill can still pass its
thresholds yet score materially worse than its last graded run. That relative drop is what this
loop catches.

## Important: confirm before fixing

Small evaluated-run counts (the default is 3 runs) produce wide Wilson intervals, so a single
run can move ≥ 10pp by chance. `/session-triage` must confirm the regression is real before
recommending a fix — when the sample is thin, the right next step is a confirming re-run of
`/benchmark-test-skill <skill>`, not a contract change.

## Why grade-history is tracked but session-insights is not

`benchmark/grade-history.json` is shared, auditable benchmark evidence — it belongs in git and
follows the index-generated build discipline in `CLAUDE.md` ("Skillpacks Manifest Is
Index-Generated"): `git add` the source edits **and** the regenerated `grade-history.json`
together in one commit.

The companion `analyze-sessions` memory (`.session-insights/`) is **gitignored** because it
derives from one developer's private `~/.claude` / `~/.codex` history.

## Out of scope

The autonomous-swarm engine that would run verifiable decks unattended (shaped separately via
`/idea-scope-brief`) is **not** part of this loop. It consumes this repo's deck/skill manifest;
it must not fork the skill library.
