---
skill: autoresearch
agent: claude
captured_at: 2026-06-09T12:00:00
source: user-invocation
prompt_scope: visible-user-invocation
---

Implement the following plan:

# Autoresearch Skill Design

## Context

Andrej Karpathy released "autoresearch" (March 2026) — an autonomous experiment loop where an AI agent iteratively mutates ML training code, measures a metric, and keeps only improvements (a ratchet). It gained 21k+ GitHub stars and is described as "hill climbing with an LLM as the mutation function."

The user wants this concept adapted as a Claude Code skill for **general software engineering** — not just ML training, but any measurable codebase improvement target (benchmarks, bundle size, test coverage, load time, memory usage, build speed, etc.).

## Design Overview

**Core concept:** A self-contained autonomous loop that reads human research directions from a `program.md` file, proposes hypotheses, implements changes within a declared sandbox, measures a metric, and keeps only improvements. Git branches isolate experiments; a TSV log tracks all results.

**Skill type:** `orchestrator` — it runs an autonomous loop coordinating multiple phases (hypothesize → implement → test → measure → decide).

**Key Karpathy principles preserved:**
- One hypothesis per iteration (no bundling)
- One metric, one direction (higher/lower is better)
- Ratchet mechanism — only keeps improvements
- Git as research memory
- Fixed sandbox boundary (agent can't modify eval harness)
- Simplicity preference
- `program.md` as the human steering interface

**Key adaptations for general SWE:**
- Metric is any shell command that prints a number (not just val_bpb)
- Sandbox is file-glob-based (not a single file)
- Uses git branches per experiment (not commits on a single branch)
- Iteration count budget instead of wall-clock time
- Stop file (`.autoresearch/stop`) for graceful termination
- Results in `.autoresearch/results.tsv` (not project `research/` which is for product research)
