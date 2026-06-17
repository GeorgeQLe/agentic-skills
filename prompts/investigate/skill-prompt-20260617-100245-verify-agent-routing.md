---
skill: investigate
agent: codex
captured_at: 2026-06-17T10:02:45-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

Can you verify this change: Strategy Used
  General investigation. No pivot.

  User Claims Validated
  Confirmed. The repo said bare YAML is data and should not be relied on for auto-calling the skill, while Pattern A handoff relied on explicit parent re-invocation. The missing piece was routing
  metadata inside the compiled YAML.

  Root Cause
  The recent terminal-handoff contract standardized parent re-invocation, but compiled YAML still lacked enough context to identify the parent orchestrator, gate, inline framework, run manifest, and
  parent-owned resolution rule.

  Fix Applied
  Added agent_routing as self-routing metadata while preserving parent ownership:

  - Shared convention: docs/research-session-loop-convention.md:149
  - Active Pattern A contracts, mirrored across Codex/Claude parents and framework subskills, e.g. packs/business-research/codex/competitive-analysis/SKILL.md:81
  - Audit coverage: scripts/skill-research-loop-handoff-audit.sh:58
  - Fixed archive audit semantics discovered during verification: scripts/skill-archive-audit.sh:98 And update the documentation as necessary
