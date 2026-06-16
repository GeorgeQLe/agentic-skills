---
skill: skills
agent: codex
captured_at: 2026-06-16T10:46:08-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Remove Global/Base Skill Availability Assumptions

## Summary

Update active skill contracts so agents never assume global skills or base skills are available. A command is recommendable only when it is the currently running skill, verified in the active session/project-local install state, or paired with the correct install/init guidance.

## Key Changes

- Replace the stale cross-pack guard sentence `Global skills are always valid.` in all active non-archive `SKILL.md` files with: only the current skill and verified installed/project-local skills are directly recommendable; otherwise recommend `npx skillpacks install <pack-or-skill>` for pack skills or `npx skillpacks init` for missing base skills.
- Update base routing contracts that currently imply base availability:
  - `afps-status`: remove “base pack — no install hint needed”; for base-skill recommendations, verify base skills are visible/installed or recommend `npx skillpacks init` first.
  - `skills`: describe source `base/` scanning as available source inventory, not proof that base skills are installed in the target project/session.
  - `pack` and `provision-agentic-config`: missing-skill fallback should not suggest `$skills`/`/skills` unless that command is available; otherwise suggest `npx skillpacks init` or direct `npx skillpacks which <skill>`.
- Keep legitimate `~/.claude/skills` / `~/.codex/skills` references for explicit user-local skill creation and legacy `uninstall-global` cleanup.
- Add a `tasks/lessons.md` entry for this correction: do not assume base skills are installed just because they exist in the package/source checkout.

## Test Plan

- Run `rg -n "Global skills are always valid|global/default route|base pack.*no install hint|installed base skills" base packs --glob 'SKILL.md' --glob '!**/archive/**' --glob '!archive/**'` and require zero stale active-contract hits.
- Run existing routing tests that cover pack install guards and missing-skill fallback.
- Add or update fixture tests so recommendations for unavailable pack skills require `npx skillpacks install <pack-or-skill>`, and recommendations for unavailable base skills require `npx skillpacks init`.
- Run the repo’s relevant skill contract validation if available, especially install-routing and active `SKILL.md` audits.

## Assumptions

- Scope is active behavior only: active `SKILL.md` contracts, generated provisioning blocks, and tests. Archives, conversation logs, prompt history, and historical changelog wording are out of scope.
- `npx skillpacks init` is the canonical way to make base skills project-local when they are not installed.
- `npx skillpacks install <pack-or-skill>` remains the canonical route for pack-provided skills.

<skill>
<name>skills</name>
<path>/Users/georgele/.codex/skills/skills/SKILL.md</path>
---
name: skills
description: Browse and search all available skills, grouped by workflow stage or activity type
type: ops
version: v0.4
argument-hint: "[list | types | search <keyword>]"
---

# Skills

Discover and search installed global skills plus enabled project-local pack skills, grouped by workflow stage or activity type.

## Process

1. **Parse arguments:**
   - If `$ARGUMENTS` is empty or `list` → **list mode** (show all skills grouped by workflow stage).
   - If `$ARGUMENTS` is `types` → **type mode** (show all skills grouped by activity type).
   - If `$ARGUMENTS` starts with `search ` → **search mode** (filter by keyword after `search`).

2. **Discover skills:**
   - Always scan global Codex skills in `global/codex/*/SKILL.md`.
   - If `.agents/project.json` exists, read `enabled_packs` and scan `packs/<pack>/codex/*/SKILL.md` for each enabled pack. Also scan sub-directories like `packs/<pack>/codex/<skill>/frameworks/*/SKILL.md` for sub-skills.
   - Also scan all packs in `packs/*/codex/*/SKILL.md` (and `frameworks/*/SKILL.md` children) to discover available-but-not-installed skills.
   - If `.codex/skills/*/SKILL.md` exists in the current project, include those local skills too.
   - Read the first 10 lines of each file to extract YAML frontmatter fields: `name`, `description`, `type`, `invocation`, `parent`.
   - Track which pack each skill belongs to (if any).
   - Default `invocation` to `primary` when the field is absent.

3. **Group skills by workflow stage** using this static mapping:

   The mapping includes global skills and pack-provided skills. Only skills
   discovered in step 2 should be printed, so domain and kanban entries appear
   only when the corresponding project-local pack is enabled or linked.
   PoketoWork kanban skills are intentionally absent while the kanban packs are hibernated.

   | Stage | Skills |
   |-------|--------|
   | Pack Management | `pack`, `pack list`, `pack status`, `pack recommend`, `pack install <pack-or-skill>`, `pack remove <pack-or-skill>`, `pack which <skill>` |
   | Discovery & Market Fit | `icp`, `enterprise-icp` |
   | Game Development | `game-workflow`, `game-audience`, `game-fantasy`, `game-genre-map`, `game-comparables`, `game-core-loop`, `game-prototype-test`, `game-store-page-test`, `game-playtest-metrics`, `game-roadmap`, `game-launch` |
   | Devtool Development | `devtool-workflow`, `devtool-user-map`, `devtool-integration-map`, `devtool-dx-journey`, `devtool-adoption`, `devtool-positioning`, `devtool-monetization`, `devtool-docs-audit` |
   | Planning | `brainstorm`, `idea-scope-brief`, `feature-interview`, `spec-interview`, `spec-interview --ideas`, `ui-interview`, `ux-variations`, `consolidate-variations`, `experiment`, `clone-spec-store` (project-fleet pack) |
   | Mapping | `journey-map`, `metrics` |
   | Strategize | `roadmap`, `competitive-analysis`, `platform-strategy`, `gtm`, `landing-copy`, `monetization`, `positioning`, `runway-model` |
   | Evaluate | `dogfood`, `mvp-gap`, `scale-audit`, `customer-feedback`, `assumption-tracker`, `cohort-review`, `retro` |
   | Research Health | `research-roadmap`, `reconcile-research`, `reconcile-dev-docs` |
   | Detail | `plan-phase` |
   | Execution | `exec` |
   | Shipping | `ship`, `ship-end` |
   | Code Quality | `expert-review`, `regression-check`, `dead-code` |
   | Debugging | `investigate`, `debug`, `trace`, `session-triage` |
   | Refactoring & Migration | `migrate`, `decommission`, `scaffold` |
   | Monorepo | `affected` |
   | Release & Deploy | `release`, `deploy` |
   | Context & Session | `afps-status`, `codebase-status`, `analyze-sessions`, `handoff`, `sync`, `investor-update` |
   | Git Workflow | `branch-lifecycle` |
   | Utility | `commit-and-push-by-feature`, `init-agentic-skills`, `targeted-skill-builder`, `provision-agentic-config`, `skills`, `risk-register` |

   Skills not found in the mapping go into an **Other** group at the end.

4. **Group skills by activity type** (type mode only) using the `type` field from frontmatter:

   | Type | Description |
   |------|-------------|
   | `research` | Web search + analysis → produces documents |
   | `analysis` | Reads codebase/docs → produces assessments |
   | `planning` | Interactive → produces specs/plans |
   | `execution` | Writes/modifies code |
   | `review` | Reads code → reports issues (no changes) |
   | `debugging` | Investigates + fixes problems |
   | `shipping` | Commits, deploys, session management |
   | `ops` | Manages boards, branches, meta-tooling |

   Display order: research → analysis → planning → execution → review → debugging → shipping → ops.
   Skills with no `type` field go into an **Other** group at the end.

5. **Apply filter (search mode only):**
   - Match the keyword case-insensitively against each skill's `name`, `description`, and `type`.
   - Keep only matching skills. Remove empty groups.

6. **Output results:**
   - Print each non-empty group as a `## Group Name` heading.
   - Under each heading, list installed/global primary and chained skills as `$<name> — <description>  [type]`.
   - Show orchestrator skills with an `⚙` prefix: `⚙ $<name> — <description>  [type]`.
   - Show sub-skills indented under their parent skill (identified by the `parent:` frontmatter field or by living under a `frameworks/` directory). Format: `  ↳ $<name> — <description>  [sub-skill]`. If the parent is not in the same group, place sub-skills in a "Sub-skills" subsection at the end of the parent's group.
   - For available-but-not-installed pack skills, list as `$<name> — <description>  [type]  ⚠ requires \`$pack install <skill>\` or \`$pack install <pack>\``.
   - Omit groups that have no skills (after filtering in search mode).
   - At the bottom, print a total count: `**N skills** installed (M sub-skills), **P skills** available via packs` (or `**N skills** matching "<keyword>"`).

## Output

### List mode (default — grouped by workflow stage)
```
## Discovery & Market Fit
$icp — Customer discovery interview...  [research]
$enterprise-icp — Enterprise multi-stakeholder discovery...  [research]

## Strategize
⚙ $positioning — Parent router — detect market vs product mode...  [research]
  ↳ $category-design — Play Bigger category design framework  [sub-skill]
  ↳ $jtbd-positioning — Jobs to Be Done positioning framework  [sub-skill]
  ↳ $moore-positioning — Geoffrey Moore positioning framework  [sub-skill]
  ↳ $obviously-awesome — Obviously Awesome positioning framework  [sub-skill]
  ↳ $strategic-canvas — Strategic Canvas positioning framework  [sub-skill]
$competitive-analysis — Research competitors...  [research]
...

## Execution
⚙ $exec — Execute next plan step...  [execution]
...

**N skills** installed (M sub-skills), **P skills** available via packs
```

### Type mode (`$skills types`)
```
## Research
$icp — Customer discovery interview...
$competitive-analysis — Research competitors...
...

## Analysis
$mvp-gap — Evaluate codebase against ICP...
...

**N skills** found
```

## Constraints

- This is a read-only scan — never modify any files.
- Always read the live frontmatter from SKILL.md files; do not hardcode descriptions.
- Use the static stage mapping for stage grouping; use the `type` frontmatter field for type grouping.
- Keep output compact — one line per skill, no extra detail beyond name, description, and type tag.
- In search mode, if no skills match the keyword, print: `No skills matching "<keyword>"`.


## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.

</skill>
