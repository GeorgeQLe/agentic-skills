---
name: workflow-backfill
description: Scan and approval-gate safe canary artifact backfill after a skillpacks canary refresh. Use when Codex needs to inspect a target repo for stale installed skill copies, missing canary briefing-slide review decks, missing dependency helpers, or pending canonical research/prototype gates, then plan and execute only approved non-canonical backfill such as briefing decks, review indexes, and audits.
type: ops
version: v0.0
release_lane: canary
required_conventions: [briefing-slides]
argument-hint: "[target-repo] [--scan-only|--execute-approved]"
---

# Workflow Backfill

Invoke as `$workflow-backfill`.

Run deterministic artifact backfill after a canary skill refresh. This skill is an orchestrator: scan first, present an approval-gated plan, then mutate only approved safe review artifacts. Do not write canonical research, design, specs, or prototype implementation artifacts.

## Workflow

1. Resolve the target:
   - Default to the current repository unless the user provides a target path.
   - Confirm the target has `.agents/project.json`, `.claude/skills`, `.codex/skills`, `alignment`, `interrogation`, or `briefing-slides` before treating it as a skillpacks-managed repo.
   - Record the starting `git status --short --branch` in the target repo when it is a git checkout.

2. Scan local state:
   - Run `node <this-skill>/scripts/scan.mjs <target-repo> --json`.
   - Inspect installed `.agentic-skills-managed` markers for `source`, `source_version`, `source_sha`, and `source_package` when present.
   - Report missing marker fields explicitly. Current managed skill markers may not include `source_package`; convention-doc metadata may.
   - Check `.agents/project.json` `enabled_skill_dependencies` and installed helper skills. If any installed or enabled skill requires `briefing-slides`, require same-platform `create-briefing-slides`.

3. Verify canary lane freshness:
   - If network/package access is available and the user has not asked for offline scan only, check the relevant canary tag, for example `npm view skillpacks dist-tags.experimental`.
   - From the target repo, run the canary refresh dry-run appropriate to the install lane, usually `npx skillpacks@experimental refresh --all --dry-run`.
   - Compare the dry-run plan and marker versions against installed `source_version` values. Report stale `source_package`, stale or missing `source_version`, stale or missing `source_sha`, and missing dependency helpers.

4. Classify artifact work:
   - Treat `alignment/*.html` and `interrogation/*.html` whose owner skill requires `briefing-slides` and whose matching `briefing-slides/<owner-topic>.html` is missing as deck backfill candidates.
   - Treat review-state alignment/interrogation pages with unresolved gates as routing work, not canonical-write work.
   - If a page asks for canonical `research/*.md`, `design/*.md`, `specs/*.md`, prototype files, or production app edits, route back to the owning skill, `$research-amend`, or `$reconcile-research`. Do not create those files from this skill.
   - If an existing deck must change, plan an archive to `docs/history/archive/YYYY-MM-DD/HHMMSS/briefing-slides/<filename>.html` before replacement.

5. Present the approval-gated plan:
   - Separate the plan into `refresh`, `safe_backfill`, `audit_fixes`, and `route_to_owner` sections.
   - Include exact commands and exact files that would be created, archived, or modified.
   - Stop before mutation unless the user already supplied an explicit approved execution packet or used `--execute-approved`.

6. Execute only approved safe work:
   - Run the approved refresh command only if it was part of the approved plan.
   - For each approved missing deck, invoke `$create-briefing-slides --from alignment/<page>.html --out briefing-slides/<owner-topic>.html` or the matching interrogation path.
   - Update alignment, interrogation, or briefing indexes only when the target repo already has an index convention requiring it.
   - Apply only audit fixes to review artifacts; keep dense pages and source artifacts intact.

7. Verify:
   - Run `node scripts/audit-briefing-slides.mjs briefing-slides/<deck>.html` for every created or changed deck when the audit exists in the target.
   - Run `node scripts/audit-alignment-pages.mjs` or `node scripts/audit-interrogation-pages.mjs` only for pages/indexes changed by the approved plan.
   - Re-run `node <this-skill>/scripts/scan.mjs <target-repo> --json` and report remaining candidates.
   - Report exact pass/fail status for every command. Do not collapse blocked package/network checks into success.

## Output

Report:

- Target repo and install lane evidence.
- Installed marker summary, including stale or missing `source_package`, `source_version`, and dependency helpers.
- Missing deck candidates and existing deck conflicts.
- Canonical artifact gates routed back to owning skills.
- Approved mutations performed, archive paths, and verification status.
- Next command for any remaining owner-routed work.

## Constraints

- Do not write canonical `research/*.md`, `design/*.md`, `specs/*.md`, prototype, or production implementation files.
- Do not bypass alignment/interrogation review-state gates.
- Do not replace an existing deck without an archive path and explicit approval.
- Do not install stable packages to satisfy canary-only briefing-slide behavior.
- Do not run `npx skillpacks install`, `init`, or `which` inside the `agentic-skills` source repo.
- Do not create or modify GitHub Actions workflows.

## Briefing Slides Convention

Follow the shared briefing-slides convention via the packaged convention resolver. Source checkouts load `docs/briefing-slides-convention.md`; packaged installs load `assets/briefing-slides-convention.md`.

## Default Shipping Contract

- Backfilled decks, archive copies, index changes, and scan reports are normal target-repo artifacts. Follow the target repo's shipping rules after verification.
- When operating in this `agentic-skills` repository, commit and push intended tracked changes on the primary branch before stopping unless the user explicitly says not to ship.
