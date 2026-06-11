---
skill: create-agentic-skill
agent: codex
captured_at: 2026-06-10T20:19:12-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Fix VARD/ORD Scan Research Workflow

## Summary
Upgrade the 4 non-compliant active research skills to the same strict scope-first staged research structure used by business-discovery:
1. scope alignment page before synthesized research,
2. preliminary `_working` research packet after scope approval,
3. artifact approval page,
4. finalize/confirm approved output.

## 4 Implementation Steps

1. **Archive And Version The Four Skills**
   - Run `scripts/skill-archive.sh` for:
     - `packs/vard/codex/vard-scan`
     - `packs/vard/claude/vard-scan`
     - `packs/ord/codex/ord-scan`
     - `packs/ord/claude/ord-scan`
   - Bump each `SKILL.md` from `version: v0.0` to `version: v0.1`.
   - Add `CHANGELOG.md` in each scan skill directory noting the staged research workflow addition.

2. **Add Strict Staged Research Contract**
   - Add `Report-First Approval Gate`, `Staged Research Workflow`, and `Evidence And Feedback Handling` sections to each scan skill.
   - Preserve the rapid-scan intent, but require:
     - Stage 1: only minimal scope discovery and `review` alignment page.
     - Stage 2: write `research/_working/preliminary-vard-scan-research.md` or `research/_working/preliminary-ord-scan-research.md`.
     - Stage 3: archive the working packet, write the approved canonical scan artifact, and confirm the page.
   - Use product-path variants when applicable: `research/{slug}/_working/...`.

3. **Wire Alignment Page Bundles**
   - Add the standard generated `## Alignment Page` stub to each `SKILL.md`.
   - Run `node scripts/upgrade-alignment-page.mjs` to generate the four sibling `ALIGNMENT-PAGE.md` files.
   - Do not hand-edit generated `ALIGNMENT-PAGE.md` files.

4. **Verify And Ship**
   - Run `node scripts/upgrade-alignment-page.mjs --check`.
   - Re-run the audit query to confirm `type: research` non-compliant count is `0`.
   - Run targeted `rg` checks for missing staged markers in active `type: research` skills.
   - Run `git diff --check`.
   - Commit and push the intended changes on `master`.

## Public Behavior Changes
- `$vard-scan` / `/vard-scan` and `$ord-scan` / `/ord-scan` no longer immediately synthesize and recommend candidates.
- They first create a scope-review alignment page and stop for final compiled YAML.
- Candidate ranking becomes a preliminary working packet first, then a finalized artifact after approval.
- Recommended next command remains `vard-align` or `ord-align`, but only after final approval and canonical artifact write.

## Test Plan
- Verify all 4 active scan skills contain:
  - `## Report-First Approval Gate`
  - `## Staged Research Workflow`
  - `Stage 1 - Scope discovery and approval`
  - `preliminary-<skill>-research.md`
- Verify generated bundles exist and pass exact drift check.
- Verify the audit reports `138` active `type: research` skills and `0` non-compliant.
- Verify archives and changelogs exist for each bumped skill.

## Assumptions
- Use the strict staged workflow selected by the user.
- Keep the lightweight VARD/ORD candidate criteria intact; only change approval and artifact lifecycle.
- Do not broaden this pass to non-`type: research` skills that write `research/*.md`; that should be a separate audit/remediation pass.
