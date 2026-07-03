---
skill: investigate
agent: claude
captured_at: 2026-07-03T16:57:00-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

investigate and verify this, but do not implement: Roadmap: same disease, agent said it out loud

The smoking-gun verdict lines from the 6 precise roadmap-benchmark sessions (all 2026-05-17):

▎ "Verdict: verified benchmark harness false negative, not a verified roadmap skill contract failure. Codex passed 3/3 hard assertions, but run 0 failed the critical evidence-linked quality check because the rubric required [an exact phrase]."

▎ "The failure is narrowing to the quality rubric rather than the roadmap skill contract… the quality scorer required the exact fixture fact phrase."

▎ "The rubric now accepts the broader benchmark coverage concept instead of requiring the exact phrase benchmark coverage reporting."

That's identical to update-packages: compliant output, hard assertions passing, but a rubric demanding an exact string flips it to failure. Same root cause.

Roadmap adds a second harness-defect class: brittle hardcoded fixtures

▎ "The root cause is a brittle layer1 harness test: tests/layer1/benchmark-results-matrix.test.ts hard-codes the older ship-codex-a2685d9f latest raw [session id]… the durable fix is to stop pinning a volatile latest-run session id in the benchmark test."

▎ "The failure is a stale benchmark-results matrix assertion in the harness, not an evaluated roadmap skill failure."

And the runner-budget noise I predicted — confirmed, repeatedly

▎ "Claude was entirely infrastructure-blocked by runner budget… 0 evaluated runs, $0.75." (recurs across nearly every roadmap run)

(One genuinely real finding did exist: failed 'Output recommends $run' in all runs — worth checking whether roadmap's contract truly requires recommending $run, or whether that assertion is also over-narrow.)

[Unified verdict table across both skills: (1) exact-phrase/negation-blind rubrics, (2) brittle hardcoded fixtures, (3) infra outcomes counted as failures. Recommended next command: /targeted-skill-builder harden benchmark-test-skill.]
