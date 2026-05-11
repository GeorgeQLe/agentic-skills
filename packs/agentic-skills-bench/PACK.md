# Agentic Skills Bench Pack

Project-local workflows for verifying, benchmark-testing, and reviewing skill benchmark outputs in this repository with the agentic-skills test harness.

Install this pack when working on `tools/agentic-skills` skill quality, benchmark reports, harness fixtures, regression measurements, or subjective agent review of benchmark artifacts. It is not for benchmarking an app, website, or product surface; the target argument is always a skill name or a persisted benchmark run path.

**Primary role:** Skill quality measurement — run verify first, then repeated benchmark runs with pass-rate, latency, cost, and consistency reporting. Use `benchmark-agent-review` only after benchmark artifacts exist, when subjective ergonomic review should be reported separately from hard assertions and deterministic output-quality scores.
