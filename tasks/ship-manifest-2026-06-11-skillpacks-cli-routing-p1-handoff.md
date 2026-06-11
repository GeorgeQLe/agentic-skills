# Ship Manifest - Skillpacks CLI Routing P1 Handoff

## User Goal

Run `$exec` for the next incomplete task in the Skillpacks CLI routing remediation queue, completing the planning-only step that prepares the P1 global skill edit batch.

## Changed Files

- `prompts/exec/skill-prompt-20260610-203845-exec.md`
- `tasks/todo.md`
- `tasks/roadmap.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-11-skillpacks-cli-routing-p1-handoff.md`

## Per-File Purpose

- `prompts/exec/skill-prompt-20260610-203845-exec.md`: captures the visible `$exec` invocation and pasted skill context.
- `tasks/todo.md`: marks the Skillpacks routing planning step complete, adds the self-contained P1 follow-up implementation plan, and preserves the concurrent Research-ish Skill Lifecycle Audit queue item now present at the top of the file.
- `tasks/roadmap.md`: preserves the concurrent Research-ish Skill Lifecycle Audit roadmap plan that appeared during this run.
- `tasks/history.md`: records the planning-only Skillpacks routing handoff and notes the concurrent task-plan change.
- `tasks/ship-manifest-2026-06-11-skillpacks-cli-routing-p1-handoff.md`: documents this exact shipping boundary.

## User-Goal Mapping

- The Skillpacks routing queue now has a concrete P1 follow-up `$exec` step covering the 14 global Claude/Codex status, installer, discovery, and provisioning skills from `research/skillpack-cli-routing-audit.md`.
- The P1 handoff carries forward skill archive/version/changelog requirements, generated Skills Showcase refresh, targeted P1 audit filtering, and regression checks.
- The planning-only boundary intentionally does not edit active `SKILL.md`, `PACK.md`, changelog, archive, generated Skills Showcase, package, script, or test files.
- The concurrent Research-ish task-doc additions are included so the repository is not left with unexplained tracked task drift.

## Tests Run

- `scripts/skill-install-routing-audit.sh --report > /tmp/skill-install-routing-report.txt` - passed; report mode exits 0 with current active install-routing debt.
- `rg -c 'global/(claude|codex)/(afps-status|codebase-status|idea-scope-brief|init-agentic-skills|pack|provision-agentic-config|skills)/SKILL.md' /tmp/skill-install-routing-report.txt` - returned `14`, confirming the P1 handoff targets match current report findings before implementation.
- `git diff --check` - passed with no whitespace errors.
- Diff inspection - confirmed the boundary is limited to prompt/task/history/manifest docs plus the concurrent Research-ish task-plan additions.

## Skipped Tests

- Layer1, package, and app builds were skipped because this boundary changes only prompt and task documentation, with no executable source, active skill contract, package metadata, generated runtime asset, or application surface.
- Skills Showcase generation was skipped because no active `SKILL.md` or `PACK.md` file changed in this planning-only step.
- `scripts/skill-install-routing-audit.sh --active` was skipped because strict active mode is still expected to fail until P1/P2/P3 remediation is performed; report mode and the targeted P1 count are the relevant checks for this handoff.
- Deploy was skipped because this boundary has no deployable runtime surface and production deploys require explicit confirmation.

## Adversarial Review

- Checked the current P1 report output after writing the handoff plan; all 14 P1 global paths still appear, as expected before the implementation step.
- Confirmed the P1 plan scopes only the 14 global targets and explicitly defers P2/P3 pack-wide remediation.
- Confirmed the P1 plan includes version bump expectations, `scripts/skill-archive.sh <skill-dir>`, `CHANGELOG.md` updates, Skills Showcase refresh, and a no-P1-path report filter.
- Detected a concurrent Research-ish task-doc plan in `tasks/todo.md` and `tasks/roadmap.md`; left it intact, documented it in this manifest, and avoided claiming the P1 handoff is the globally first unchecked task.

## Residual Risk

The task queue now has a concurrent Research-ish Skill Lifecycle Audit item above the Skillpacks routing section, so the next plain `$exec` will likely select that globally first unchecked task unless the queue is reordered or the user specifically routes back to the P1 Skillpacks remediation.

## Rollback Note

Revert this commit to remove the P1 handoff notes, prompt capture, history entry, ship manifest, and concurrent task-plan additions if they should not be part of the active task queue. No source or generated runtime files require rollback.

## Next Command

`$exec`
