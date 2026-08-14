---
skill: expert-review
agent: codex
captured_at: 2026-08-13T21:49:03-04:00
source: sol-delegation
prompt_scope: delegated-read-only-review
---

Invoke `expert-review --adversarial-diff --read-only` against the final integrated diff for PR #16 (`origin/master...HEAD`). Review the AFPS 2.0 foundation and YouTube launch trio against the accepted reconciliation plan, repository conventions, task records, surrounding code, and supplied verification evidence. Do not modify files, the index, branches, commits, refs, task documents, prompt history, or external state. Report only findings that survive a second-read false-positive check. Give every non-stylistic finding a stable ID, severity, file and line evidence, impact/failure mode, recommended remediation, verification method, and confidence. Explicitly report `no findings` if none survive. Pay special attention to accidental reversion of PR #18, stale generated catalog/package outputs, unexpected alignment/interrogation producers, scope leakage into Stable 1.0 retirement work, and mismatch between the reviewed SHA and PR head.
