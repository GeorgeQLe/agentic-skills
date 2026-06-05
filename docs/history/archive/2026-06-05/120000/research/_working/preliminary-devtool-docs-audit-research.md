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

**Decision impact:** Add a README "First Successful Cycle" section before the Repository Structure heading. Command-first, ending in visible artifacts (a commit, a tasks/history.md entry, or a status confirmation).

### P1-2: Troubleshooting Fragmented

**Claim:** Recovery information exists across 5+ docs but no symptom-led support path exists.

**Evidence:**
- No `docs/troubleshooting.md` file exists
- Restart/refresh guidance: README.md lines 63-65
- Drift detection: docs/packs.md (doctor subcommand)
- Approval-packet failure: docs/operating-modes.md
- Validation commands: README.md lines 382-399
- Skill deps/versions: scattered across README and docs/skills-reference.md

**Inference:** A user hitting their first error must search across 5 files to find the recovery path. This is acceptable for maintainers but poor for adopters.

**Decision impact:** Create `docs/troubleshooting.md` with symptom-led table: symptom → likely cause → command → expected result → next fix.

### P1-3: Prerequisites Undocumented

**Claim:** Hard system dependencies are never listed before the user hits a failure.

**Evidence:**
- `jq` is required for pack write operations — pack.sh line 49 dies with "jq required for write operations. Install with: brew install jq"
- `pnpm` is required for tests — README.md line 385
- Claude Code or Codex must be installed — implied but never stated
- Bash environment required — implied
- No "Prerequisites" section exists in README.md

**Inference:** Users will discover dependencies through error messages rather than upfront documentation. The jq error message is good, but the gap should be closed at the docs level.

**Decision impact:** Add a "Prerequisites" section to README.md before "Initialization".

### P2-4: No Skill Authoring Template

**Claim:** A first-time skill author has no copyable starting point.

**Evidence:**
- docs/skill-anatomy.md describes frontmatter fields, directory structure, and versioning convention thoroughly
- No `docs/skill-template.md` or example skeleton exists
- 1,349 SKILL.md files exist across global/ and packs/ but all are full production skills, not minimal examples
- `/create-agentic-skill`, `/skill-interview`, and `/targeted-skill-builder` are mentioned but not explained as onboarding paths
- Required vs optional SKILL.md sections are not explicitly listed

**Inference:** Documentation is complete at reference level but lacks scaffolding. A new contributor must read 5+ docs and mentally synthesize the format. The `/skill-interview` flow is the intended onboarding path but this is not surfaced.

**Decision impact:** Add a minimal SKILL.md template to docs/skill-anatomy.md with inline annotations of required vs optional fields.

### P2-5: Script Reference Scattered

**Claim:** Script commands are documented but spread across README, packs, skills reference, operating modes, and test harness docs.

**Evidence:**
- README.md: init.sh, pack.sh install/remove/status/which, version pinning, validation
- docs/packs.md: drift, doctor, pin/unpin, update mode
- docs/operating-modes.md: agent-mode.sh, approved-plan.sh
- docs/test-harness.md: pnpm verify, pnpm bench
- docs/skills-reference.md: catalog maintenance commands

**Decision impact:** Add a compact command index (docs/scripts-reference.md or section in skills-reference.md).

### P2-6: Team Adoption Checklist Absent

**Claim:** Mechanics for team use are documented across docs/packs.md and operating-modes.md, but no actionable checklist exists.

**Evidence:**
- docs/packs.md explains commit policy for .agents/project.json and generated roots
- docs/operating-modes.md covers mode declaration and checkout-path coupling
- research/devtool-dx-journey.md identifies team friction points
- No "Team Setup" or "Team Adoption" section in README or docs

**Decision impact:** Add a concise team checklist to docs/packs.md covering: checkout path, init, commit policy, refresh after pull, CLI restart, and shipping workflow policy.

### P2-7: Stale install.sh References in Research

**Claim:** Active devtool research artifacts still reference `install.sh` (renamed to `init.sh`).

**Evidence:**
- `install.sh` does not exist in the repo
- README.md and docs/skills-reference.md correctly use `./init.sh`
- research/devtool-user-map.md, devtool-positioning.md, devtool-monetization.md, devtool-integration-map.md, devtool-dx-journey.md, and devtool-adoption.md still reference `install.sh`

**Decision impact:** Reconcile with a small sed pass or add dated historical-context notes.

### P3-8: No Visual Proof Artifacts

**Claim:** The repo has 29 HTML alignment pages and generated proof data but no screenshots, diagrams, or recordings.

**Evidence:**
- alignment/ contains 29 HTML files (skills-inventory, session analyses, etc.)
- docs/skills-showcase/assets/ has generated JS proof data (685KB)
- apps/skills-showcase/ is a Next.js app
- No PNG, SVG, GIF, or video files in docs/ or alignment/
- README.md has no images

**Decision impact:** Low priority. HTML alignment pages serve as proof for power users. Screenshots could improve README but are not blocking.

### P3-9: Benchmark Trends Static

**Claim:** Benchmark data is current but point-in-time only.

**Evidence:**
- docs/benchmark-results-matrix.md (34KB) tracks 115+ skills with pass rates, latency, cost
- 115 individual benchmark reports exist in benchmark/
- No time-series or trend analysis across versions
- No automated benchmark regression tracking

**Decision impact:** Nice-to-have. The current snapshot is sufficient for adoption decisions.

## Progress Since 2026-06-02 Audit

| Prior Backlog Item | Status |
| --- | --- |
| 1. Add README first-success and proof sections | Not started |
| 2. Add docs/troubleshooting.md | Not started |
| 3. Add script reference | Not started |
| 4. Add team adoption checklist | Not started |
| 5. Reconcile stale install.sh references | Not started |

All five prior P1/P2 items remain open. This refresh deepens them with additional evidence (prerequisites gap, skill template gap) and adds P3 findings.

## Evidence Matrix

| Claim | Evidence | Inference | Confidence | Decision Impact |
| --- | --- | --- | --- | --- |
| No P0 blocker | README covers init, pack install, restart, mode | Experienced users can install | High | No emergency rewrite |
| First-success implicit | No quickstart section; workflow split across 3+ docs | Activation requires synthesis | High | Add first-success route |
| Troubleshooting fragmented | Recovery across 5 docs; no symptom table | Support is slower than needed | High | Add troubleshooting page |
| Prerequisites undocumented | jq hard-required; not listed in README | Users hit errors mid-workflow | High | Add prerequisites section |
| No skill template | anatomy docs thorough; no skeleton | New authors must synthesize | Medium-high | Add minimal template |
| Script reference scattered | Commands in 5+ docs | Index would reduce friction | Medium-high | Add command index |
| Team checklist absent | Mechanics documented; checklist missing | Team onboarding needs tacit knowledge | Medium-high | Add checklist |
| Stale installer references | install.sh absent; research still uses it | Could confuse readers | High | Reconcile or caveat |
| No visual proof | 29 HTML pages; no images | Power users served; casual adopters not | Medium | Low priority |

## Assumptions and Confidence

- **High:** no first-success, troubleshooting, or prerequisites section exists in README or docs
- **High:** jq is a hard dependency for pack operations and is not listed upfront
- **High:** prior audit's 5 backlog items remain unaddressed
- **Medium-high:** a skill template would meaningfully help new contributors; the `/skill-interview` skill partially serves this role but is undiscoverable
- **Medium:** stale research references should be reconciled rather than caveated; caveating is an acceptable alternative if research artifacts are treated as historical snapshots

## Recommended Backlog (Prioritized)

1. **P1** Add README "Prerequisites" section listing jq, Claude Code/Codex, and bash
2. **P1** Add README "First Successful Cycle" section with 6-step guided path
3. **P1** Create `docs/troubleshooting.md` with symptom-led recovery table
4. **P2** Add minimal SKILL.md template to docs/skill-anatomy.md
5. **P2** Add compact command index to docs/scripts-reference.md
6. **P2** Add team adoption checklist to docs/packs.md
7. **P2** Reconcile stale install.sh references in research/devtool-*.md
8. **P3** Consider adding README screenshot or architecture diagram
