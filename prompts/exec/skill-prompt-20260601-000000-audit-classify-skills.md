---
skill: exec
agent: claude
captured_at: 2026-06-01T00:00:00Z
source: user-invocation
prompt_scope: visible-user-invocation
---

Implement the following plan:

# Plan: Audit & Classify Skills — Primary vs Sub-Skills + Delegation Architecture

## Context

The repo has ~205 unique skills across 43 packs but **no formal distinction between user-invocable primary skills and agent-invoked sub-skills**. The only existing hierarchy is the `positioning/frameworks/` pattern we just built — everything else is implicit through next-step contracts, auto-invocation prose, and file location. The user wants:

1. A classification of every skill as "primary" (user invokes directly) or "sub-skill" (agent invokes as a sub-step, or only reachable via another skill)
2. An architectural convention: **when should a skill delegate to sub-skills vs. stay monolithic?**

[Full plan included in conversation context]
