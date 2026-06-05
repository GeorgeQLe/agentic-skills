---
skill: exec
agent: codex
captured_at: 2026-06-04T18:32:22-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Claude/Codex Parity Remediation

## Summary

Git history shows parity was not lost in the original pack split. It was restored at least once, then broken by one-sided semantic fixes.

- On **May 25, 2026**, `8f386368` reorganized skills into packs with the checked pairs version-aligned.
- On **May 26, 2026**, `e223f3f1` updated only Claude copies for `icp`, `monetization`, and `ux-variations`.
- On **May 27, 2026**, `4dfe7069` updated Codex counterparts and restored version parity for the checked set.
- Later on **May 27, 2026**, `c6c37826` touched both Claude and Codex versions and again kept them aligned.
- The current gap starts at **May 27, 2026**, commit `6c89a792` (`fix: resolve 20 semantic contradictions and script safety issues`): it updated Claude-only `icp`, `gtm`, `monetization`, and Codex-only `ux-variations`.
- On **June 2, 2026**, `fc1360ba` added staged alignment workflow to both sides, but because the inputs were already offset, it preserved the version mismatch instead of repairing it.

Current known version mismatches:

- `business-discovery/icp`: Claude `v0.10`, Codex `v0.9`
- `business-growth/gtm`: Claude `v0.7`, Codex `v0.6`
- `business-growth/monetization`: Claude `v0.7`, Codex `v0.6`
- `product-design/ux-variations`: Claude `v0.10`, Codex `v0.11`

## Key Changes

- Add a repo-wide parity audit script, modeled on `packs/monorepo/scripts/monorepo-validate.sh`, that checks all mirrored `packs/*/{claude,codex}/*/SKILL.md` pairs.
- The audit should report:
  - missing mirror files, except known intentional one-sided skills
  - frontmatter mismatches for `name`, `type`, `version`, and `argument-hint`
  - required shared-section mismatches, especially `## Pack Availability Guard`, `## Report-First Approval Gate`, `## Staged Research Workflow`, and `## Alignment Page`
  - command-syntax-normalized heading drift, allowing `/skill` vs `$skill`
- Repair the four current mismatches by reviewing the one-sided changes from `6c89a792`, applying the intended behavior to the opposite side where still missing, and then normalizing version/changelog/archive state according to the repo’s versioning policy.
- Add the new parity audit to the normal validation path, likely alongside `scripts/skill-versions.sh`, `scripts/skill-archive-audit.sh`, and `scripts/skill-pack-routing-audit.sh`.

## Test Plan

- Run the new parity audit and verify it fails before the repairs on the four known mismatches.
- Run it after repairs and verify no unapproved version or required-section mismatches remain.
- Run:
  - `scripts/skill-versions.sh --missing`
  - `scripts/skill-archive-audit.sh --strict`
  - `scripts/skill-pack-routing-audit.sh`
  - `scripts/skill-deps.sh --broken`
- For noisy existing dependency results, do not require `skill-deps.sh --broken` to be clean unless its false-positive parser is fixed in the same change.

## Assumptions

- Claude/Codex mirrored skills are expected to stay semantically aligned unless explicitly documented as one-sided or platform-specific.
- Version parity should hold for mirrored skills when the behavioral contract is equivalent.
- Platform syntax differences (`/skill` vs `$skill`, Claude reload guidance vs Codex fresh-session guidance) are allowed and should be normalized or allowlisted by the audit.
