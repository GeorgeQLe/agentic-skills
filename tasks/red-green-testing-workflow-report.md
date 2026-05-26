# Red/Green Testing Workflow Report

Date: 2026-05-15

## Question

Evaluate whether the repository should keep the red/green TDD and benchmark workflow, reform how tests are built, or try a different validation approach.

## Scope And Method

I scanned the full available local histories and repository evidence for this checkout:

- `~/.claude/history.jsonl`
- `~/.codex/history.jsonl`
- `~/.codex/sessions/**/*.jsonl`
- repository benchmark, triage, review, roadmap, todo, and lesson documents

The full prompt-history scan found 122 repository-relevant testing prompts from 2026-04-07 through 2026-05-14:

| Source | Matching prompts |
| --- | ---: |
| Codex | 104 |
| Claude | 18 |

The repository evidence contained 26 benchmark/test/triage/review reports with red/green signals. Keyword totals across task and benchmark documents were useful for discovery but not treated as final incident counts because one incident can mention "harness", "infrastructure", and "hard assertion" many times.

## Incident-Level Findings

| Category | Count | What It Means |
| --- | ---: | --- |
| Legitimate detections | 8 | Tests or benchmarks caught real behavior gaps, missing handoffs, missing files, skipped validation, or output-quality issues that needed follow-up. |
| False positives / harness noise | 7 | The red/green result was misleading because the harness, prompt, route convention, fixture, rubric, or failure classification was wrong or brittle. |
| Missed issues that later required work | 5 | Tests passed or were too broad, but later review/session evidence found gaps the test suite should have made visible earlier. |
| Infrastructure/tooling blocks | 4 | Runs did not evaluate the skill because of runner budget, API image-processing errors, or evidence-persistence limitations. |

These counts intentionally classify root causes, not every downstream commit. For example, `content-programming` produced several benchmark reruns, but they trace to two distinct false-positive harness issues and one later coverage gap.

## False Positives And Noisy Detections

False positives were not rare enough to ignore. The clearest cases:

| Evidence | False-Positive Cause | Follow-Up |
| --- | --- | --- |
| `benchmark/test-ship-2026-05-11.md` | The `ship` setup expected `$exec` for both runners even though Claude uses slash commands and Codex uses dollar commands. | Runner-specific route assertions were added. |
| `benchmark/triage-benchmark-test-skill-2026-05-12.md` | `assertNextCommand` rejected contract-valid labels such as `Recommended next skill` and the quality target could penalize chat summaries instead of generated artifacts. | Route assertion and quality-output targeting needed reform. |
| `benchmark/triage-benchmark-test-skill-2026-05-13.md` | The assertion required exact metric table rows that the prompt did not explicitly require. | Prompt specificity needed to match assertion strictness. |
| `benchmark/triage-content-programming-2026-05-14.md` | The prompt asked for "a Next command line" while the assertion accepted only stricter labels; the generic pack rubric expected `$exec` even though `content-programming` routes to `series-spec`. | Pack benchmark next-route coverage was repaired. |
| `benchmark/triage-content-programming-2026-05-14-quality.md` | The quality rubric required the exact token `local-fixture` even when the output cited the actual fixture files and facts. | Rubric changed toward concrete fixture references instead of marker tokens. |
| `benchmark/triage-icon-handler-2026-05-13.md` | The fixture used invalid `.png` bytes, triggering image-processing failure before the skill could run. | Fixture was changed away from invalid image placeholder behavior. |
| `benchmark/triage-icon-handler-2026-05-14-image.md` | A runner/API image-processing error was counted as an evaluated skill failure. | Runner classification was updated to mark it infrastructure-blocked. |

Pattern: most false positives came from the test harness becoming more precise than the prompt/contract, or from runner-specific conventions not being encoded in the fixture. This is a test-design problem, not evidence that testing is useless.

## Missed Issues That Tests Should Have Caught Earlier

The miss pattern is mostly coverage granularity and artifact-retention, not absent testing.

| Evidence | Missed Issue | Why It Should Have Been Caught |
| --- | --- | --- |
| `benchmark/review-content-programming-2026-05-14.md` before the full-contract fix | Earlier benchmark coverage only exercised a calendar smoke path and did not prove pillars, formats, portfolio balance, measurement, cleanup/refactor, or next-series candidates. | The custom setup should have represented the full skill contract before subjective review had to identify the coverage gap. |
| `benchmark/review-icon-handler-2026-05-14.md` | Passing outputs still varied on manifest target path, exact icon sizes/formats, public install/touch surfaces, and verification specificity. | Deterministic scoring surfaced generic actionability but did not pinpoint icon-specific missing details. |
| `benchmark/review-session-triage-2026-05-13.md` | Claude generated report text was not retained in `run-*.json`, limiting review fidelity despite hard assertions and quality scoring passing. | Artifact retention is part of benchmark observability and should have been tested as harness behavior. |
| `tasks/lessons.md` 2026-05-14 icon-handler entry | Benchmark evidence changed but generated Skills Showcase data stayed stale. | Public-data freshness checks should include curated benchmark/review evidence changes, not only skill contract changes. |
| `tasks/lessons.md` 2026-05-03 verification gate entry | Clean validation was split into a later no-op plan handoff, creating unnecessary workflow churn. | The workflow tests/rules should distinguish no-op verification from remediation work. |

Pattern: passing tests often proved "the output has a handoff and required sections" but did not prove "the output covers the whole contract at the specificity a next operator needs." Subjective review has been doing too much of the work that deterministic setup design should do.

## Legitimate Detections

The red/green system also caught real issues. Examples:

- `benchmark/test-spec-interview-2026-05-12.md`: Codex omitted the expected `$plan-phase` recommendation in 3/3 evaluated runs, while Claude was infrastructure-blocked.
- `benchmark/test-icon-handler-2026-05-13.md`: passing/failing split exposed a fixture and runner interaction that made benchmark results misleading.
- `benchmark/test-content-programming-2026-05-14.md`: failures exposed route-label and route-target mismatches in pack workflow coverage.
- `benchmark/test-benchmark-test-skill-2026-05-12.md` and `benchmark/test-benchmark-test-skill-2026-05-13.md`: repeated failures exposed assertion/prompt/rubric drift in the benchmarking skill itself.
- Session-triage benchmark evidence surfaced whether the workflow correctly distinguishes one-off agent noncompliance from skill-contract remediation.

The important point is that the workflow generates useful red signals. The problem is classification quality: red often means "investigate," not "the target skill is broken."

## Recommendation

Reform the red/green workflow. Do not abandon it.

The current workflow is valuable because it:

- catches recurring route, handoff, artifact, and validation regressions;
- creates persisted evidence that can be triaged later;
- supports both deterministic checks and subjective review;
- has already produced durable fixes to benchmark coverage, fixture design, and runner classification.

But it should be reformed because false positives and missed coverage gaps are high enough to waste operator time and distort confidence. In this sample, false-positive/noise incidents (7) were close to the legitimate detection count (8), and missed issues (5) were material.

## Reform Plan

1. Make every benchmark setup declare its oracle type:
   - contract coverage;
   - route convention;
   - artifact creation;
   - output-quality rubric;
   - infrastructure classification.

2. Require prompt/assertion/rubric alignment tests for every custom benchmark:
   - one passing fixture that satisfies the prompt;
   - one failing fixture that violates the target behavior;
   - one "contract-valid alternative wording" fixture where flexible output labels are allowed.

3. Separate result categories in every report:
   - target skill failure;
   - harness/setup false positive;
   - infrastructure block;
   - output-quality warning;
   - retained-evidence gap.

4. Treat subjective review findings as coverage debt:
   - if review finds a repeated contract-specific omission, add deterministic rubric coverage;
   - if review finds only acceptable quality variance, do not create new rules.

5. Persist generated artifacts for all runners when a benchmark judges artifact quality.

6. Add freshness checks for generated product surfaces that depend on benchmark/review reports.

7. Keep red/green TDD for narrow contracts, but do not use hard assertions for taste or broad usefulness unless the rubric can name the exact expected behavior.

## Decision

Keep red/green as the backbone, reform the benchmark design rules, and continue pairing deterministic tests with subjective review for high-level output quality.

Trying something else entirely would discard useful signal. Keeping the current process unchanged would keep producing avoidable false positives and late-discovered coverage gaps.

Recommended next skill: `$targeted-skill-builder benchmark oracle classification`
