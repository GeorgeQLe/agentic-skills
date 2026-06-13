---
skill: investigate
agent: claude
captured_at: 2026-06-13T11:34:01
source: user-invocation
prompt_scope: visible-user-invocation
---

Implement the following plan:

# Migration: "global skills" → "base skills"

## Context

With the npm package distribution, the canonical install path is now `npx skillpacks init`, which already installs a core skill set **project-locally** and records `base_skills: true` in `.agents/project.json`. That "base skills" concept is **already half-implemented in the CLI** — but the rest of the repo still calls the same skills "global." The terminology is split, which is confusing and inconsistent:

- **CLI/config layer already says "base"**: `gskp init` → `installBaseSkills` → `base_skills: true`.
- **Everything else still says "global"**: the physical `global/{claude,codex}` source directories, the manifest `scope: "global"` field (which the CLI selector filters on), the machine-wide `init.sh` installer, the `init-agentic-skills`/`skills`/`pack` SKILL.md prose, and ~15 docs.

This migration finishes the rename so the whole repo uses one word: **base**. Decisions confirmed with the user:

1. **Full rename** — rename the physical `global/` directory → `base/` AND the manifest `scope: "global"` → `"base"`.
2. **Keep the machine-wide installer** (`init.sh` / `--global` / `init-global`) but rebrand its wording to "base". The `--global`/`init-global` **flag names stay** — they denote install *location* (user-home `~/.claude/skills`), which is orthogonal to *which* skills (base vs pack). Renaming them would break backward-compat for no gain.
3. **Leave history untouched** — do not rewrite `tasks/history.md`, `tasks/roadmap.md`, `tasks/ship-manifest-*.md`, `docs/history/archive/**`, per-skill `archive/<version>/` snapshots, or `tests/benchmarks/runs/**` (frozen recordings).

(Full plan as provided in the implementation request — Phases 0-7 plus verification and shipping. See conversation transcript for complete text.)
