# Devtool Docs Audit — agentic-skills (2026-06-04 Refresh)

Scope: third-pass audit of developer-facing documentation for the `agentic-skills` shared skill library for Claude Code and OpenAI Codex. Grounded in README.md, docs/, init.sh, scripts/pack.sh, and the prior audit from 2026-06-02.

Continuity: builds on the 2026-06-02 refresh (archived to `docs/history/archive/2026-06-04/120000/research/devtool-docs-audit.md`). The prior audit identified five backlog items. This refresh validates progress, deepens the analysis with new findings, and adds severity grading.

## Executive Verdict

**P0: none.** No critical documentation blockers that prevent installation or basic use by an experienced shell user.

**P1 (3 findings):**
1. First-success route is still implicit — no named quickstart section in README
2. Troubleshooting remains fragmented — no symptom-led recovery page
3. Prerequisites undocumented — jq is a hard dependency never listed upfront

**P2 (4 findings):**
4. No skill authoring template — anatomy docs describe format but provide no copyable skeleton
5. Script reference scattered across 5+ docs — no command index
6. Team adoption checklist absent — mechanics documented but not packaged
7. Stale `install.sh` references in devtool research chain

**P3 (2 findings):**
8. No visual proof artifacts — HTML alignment pages exist but no screenshots/recordings
9. Benchmark cost trends are static — no time-series analysis across versions

## Findings

### P1-1: First-Success Route Still Implicit

**Claim:** README explains the pieces but does not package a fastest proof path from clone to visible working skill.

**Evidence:**
- README.md opens with `./init.sh` then lists 15+ pack install commands without guidance on which to pick first
- `rg "First successful|quickstart|getting started" README.md docs/*.md` returns no results
- The prior 2026-06-02 audit recommended a 6-step first-success section; it has not been added
- docs/codex-workflow.md explains `$exec` as the Codex execution loop but is not linked from README onboarding

**Inference:** A motivated developer can assemble the path from reading 3+ docs, but the docs require synthesis rather than providing a guided path. This is the #1 adoption friction for a developer tool.

**Decision impact:** Create `docs/QUICKSTART.md` with AFPS workflow lead-in and link from README.

**Resolution:** Created `docs/QUICKSTART.md` and linked from README.

### P1-2: Troubleshooting Fragmented

**Claim:** Recovery information exists across 5+ docs but no symptom-led support path exists.

**Evidence:**
- No `docs/troubleshooting.md` file exists
- Restart/refresh guidance: README.md lines 63-65
- Drift detection: docs/packs.md (doctor subcommand)
- Approval-packet failure: docs/operating-modes.md
- Validation commands: README.md lines 382-399

**Decision impact:** Create `docs/troubleshooting.md` with symptom-led table plus add troubleshooting section to README.

**Resolution:** Created `docs/troubleshooting.md` and added summary troubleshooting section to README.

### P1-3: Prerequisites Undocumented

**Claim:** Hard system dependencies are never listed before the user hits a failure.

**Evidence:**
- `jq` is required for pack write operations — pack.sh line 49 dies with "jq required for write operations"
- `pnpm` is required for tests — README.md line 385
- Claude Code or Codex must be installed — implied but never stated
- No "Prerequisites" section exists in README.md

**Decision impact:** Add Prerequisites section to README.md.

**Resolution:** Added Prerequisites section to README.md before Initialization.

### P2-4: No Skill Authoring Template

**Claim:** A first-time skill author has no copyable starting point.

**Evidence:**
- docs/skill-anatomy.md describes frontmatter fields and conventions thoroughly
- No minimal template or skeleton exists
- 1,349 SKILL.md files exist but all are full production skills
- `/skill-interview` and `/create-agentic-skill` are undiscoverable as onboarding paths

**Resolution:** Added minimal SKILL.md template and "First Time?" callout to docs/skill-anatomy.md.

### P2-5: Script Reference Scattered

**Claim:** Script commands are documented but spread across 5+ docs with no compact index.

**Resolution:** Created `docs/scripts-reference.md` with grouped command index.

### P2-6: Team Adoption Checklist Absent

**Claim:** Mechanics for team use are documented but no actionable checklist exists.

**Resolution:** Added "Team Setup Checklist" section to docs/packs.md.

### P2-7: Stale install.sh References in Research

**Claim:** Six active devtool research artifacts still reference `install.sh` (renamed to `init.sh`).

**Resolution:** Reconciled stale references across research/devtool-*.md with dated note.

## Evidence Matrix

| Claim | Evidence | Inference | Confidence | Decision Impact |
| --- | --- | --- | --- | --- |
| No P0 blocker | README covers init, pack install, restart, mode | Experienced users can install | High | No emergency rewrite |
| First-success implicit | No quickstart section; workflow split across 3+ docs | Activation requires synthesis | High | Created docs/QUICKSTART.md |
| Troubleshooting fragmented | Recovery across 5 docs; no symptom table | Support is slower than needed | High | Created docs/troubleshooting.md |
| Prerequisites undocumented | jq hard-required; not in README | Users hit errors mid-workflow | High | Added Prerequisites to README |
| No skill template | anatomy docs thorough; no skeleton | New authors must synthesize | Medium-high | Added template to skill-anatomy.md |
| Script reference scattered | Commands in 5+ docs | Index would reduce friction | Medium-high | Created docs/scripts-reference.md |
| Team checklist absent | Mechanics documented; checklist missing | Onboarding needs tacit knowledge | Medium-high | Added checklist to docs/packs.md |
| Stale installer refs | install.sh absent; research uses it | Could confuse readers | High | Reconciled references |

## Assumptions and Confidence

- **High confidence:** all P1 and P2 items have been addressed with concrete documentation changes
- **High confidence:** jq is a hard dependency for pack operations and is now listed upfront
- **Medium-high confidence:** the skill template and script reference will meaningfully reduce onboarding friction
- **Medium confidence:** team adoption checklist may need revision as team usage patterns emerge

## P3 Items (Not Addressed)

- **P3-8: No visual proof artifacts** — deferred; HTML alignment pages serve current needs
- **P3-9: Benchmark trends static** — deferred; current snapshot is sufficient
