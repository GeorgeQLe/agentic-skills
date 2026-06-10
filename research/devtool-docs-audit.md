# Devtool Docs Audit - Repo Documentation Alignment (2026-06-10)

Scope: active repository documentation for `agentic-skills`, including root docs, `docs/`, active `research/` and `specs/`, active alignment pages, package/generated documentation, task tracking docs, and current skill contracts where they define public behavior.

This audit treats archived skill versions, dated task manifests, prompt logs, and conversation logs as historical evidence unless an active index or current document points readers to them as current guidance.

## Executive Verdict

P0: none. The structural documentation gates passed: active alignment pages pass the repo audit, generated alignment bundles are exact, and the current `skillpacks` package walkthrough is structurally valid.

P1: public setup docs still mix the old symlink install model with the current managed-copy model. This affects how users understand refresh, drift, pinned installs, and checkout moves.

P1: several current docs and indexed alignment pages still route users to the retired `icp` executable instead of `customer-discovery`.

P1: docs reference a root helper at `scripts/init-agentic-skills.sh`, but that file does not exist. The real helper is bundled under each `init-agentic-skills` skill mirror.

P1: the old npm strategy alignment page is still indexed as a normal product-design page even though the current walkthrough explicitly says it is historical. That page still contains stale `agentic-skills` / `@agentic-skills/*` npm examples.

P2: public npm docs still contain future-facing or release-candidate wording after `skillpacks@0.1.0` was published.

P2: Skills Showcase inventory counts are stale across planning docs and alignment pages. Current generated data reports 373 platform entries, 190 unique mirrored skills, 179 unique pack skills, 11 unique global skills, and 41 packs; older docs still say 157 skills or 156 pack skills.

## Findings

### P1 - Setup Docs Mix Symlink And Managed-Copy Install Models

Claim: current install code copies active skills into managed directories and reserves symlinks for pinned archive installs, but public docs still describe active installs as symlinks.

Evidence:

- `scripts/skill-links.sh:119-156` routes active installs through `sync_skill_install`, copies files with `cp -R`, skips `archive/`, and writes managed marker data.
- `scripts/skill-links.sh:123-125` uses `sync_skill_link` only when the source is under `archive/`, which is the pinned case.
- `init.sh:146-150` installs active global skills through `sync_skill_install`.
- `docs/QUICKSTART.md:25` says `init.sh` symlinks global core skills.
- `docs/troubleshooting.md:18` says `./init.sh` re-symlinks global skills.
- `docs/troubleshooting.md:73` says to run `./init.sh` to re-symlink global skills.
- `docs/scripts-reference.md:9-10` says `./init.sh` symlinks globals and `--uninstall` removes global symlinks.
- Active research docs such as `research/devtool-user-map.md` and `research/devtool-integration-map.md` still describe the install system as symlink-based.

Impact: users may misunderstand drift detection and refresh behavior. Managed copies can go stale and need `refresh`; pinned symlinks are intentionally frozen. Symlink-first wording implies checkout moves immediately affect active installs, which is no longer true.

Recommended cleanup:

- Update `docs/QUICKSTART.md`, `docs/troubleshooting.md`, and `docs/scripts-reference.md` to say active installs are repo-managed copies/directories.
- Reserve "symlink" for pinned archive installs and explicitly call out that pinned installs are frozen.
- Add a brief note to old devtool research files that their install-model observations are historical, or archive them.

### P1 - Documented Root Init Helper Path Is Missing

Claim: multiple docs recommend `scripts/init-agentic-skills.sh`, but the repository has no root script at that path.

Evidence:

- `test -f scripts/init-agentic-skills.sh` exits `1`.
- Existing helpers are:
  - `global/claude/init-agentic-skills/scripts/init-agentic-skills.sh`
  - `global/codex/init-agentic-skills/scripts/init-agentic-skills.sh`
- `docs/scripts-reference.md:55-59` lists `scripts/init-agentic-skills.sh doctor|hook|set-pref|show-prefs`.
- `docs/troubleshooting.md:72` says to run `scripts/init-agentic-skills.sh doctor`.
- `docs/packs.md:266-268` recommends `scripts/init-agentic-skills.sh hook`, `set-pref`, `show-prefs`, and `doctor`.
- `docs/operating-modes.md:45` says drift is surfaced by `scripts/init-agentic-skills.sh doctor`.
- The active `init-agentic-skills` skill contracts delegate to `scripts/init-agentic-skills.sh`, so the mismatch exists in skill docs too unless the launcher resolves the bundled script at runtime.

Impact: copy-paste commands in current docs fail from the repo root.

Recommended cleanup:

- Choose one canonical path strategy:
  - add a root wrapper `scripts/init-agentic-skills.sh`, or
  - update docs to prefer `/init-agentic-skills` and `$init-agentic-skills`, with the bundled helper path only for maintainers.
- If the root wrapper is added, keep `docs/scripts-reference.md` as-is after updating install-model wording.

### P1 - Retired `icp` Executable Still Appears In Current Guidance

Claim: active source contracts and newer routing docs use `customer-discovery`, but several current docs and indexed alignment pages still tell users to run `icp`.

Evidence:

- Active source roots exist at `packs/business-discovery/{claude,codex}/customer-discovery`; there are no active `packs/business-discovery/*/icp` roots.
- `docs/skill-next-step-contracts.md:75` routes concept-validation proceed states to `customer-discovery`.
- `README.md:236` lists `business-discovery: icp, enterprise-icp, ...`.
- `docs/codex-workflow.md:285` and `docs/codex-workflow.md:311` include `$icp` in the product workflow sequence.
- `docs/pack-workflow-matrix.md:47` says the default business-product route starts with `icp`.
- `alignment/canonical-workflow-report.html:320` includes `$icp`; `alignment/canonical-workflow-report.html:487` says `business-discovery: icp -> competitive-analysis`. This page is indexed in `alignment/index.html`.
- `research/skills-showcase/idea-brief.md:117` and `research/skills-showcase/idea-brief.md:122` recommend `/icp`.
- `specs/skills-showcase/user-flow-deck-creation.md:14` and `:322` carry `next_skill: /icp` and `/icp -> positioning`.
- `alignment/user-flow-map-deck-creation.html:142` and `:619` repeat the same `/icp` route, and that page is indexed as a current confirmed flow.

Impact: users following current workflow docs can invoke a retired command or build new specs against a stale route.

Recommended cleanup:

- Replace executable-route examples with `/customer-discovery` or `$customer-discovery`.
- Preserve `enterprise-icp` and `research/icp.md` only where they name the active enterprise skill or canonical evidence artifact.
- Update indexed alignment pages or mark old pages as historical if the route should not be treated as current.

### P1 - Old npm Strategy Page Is Still Presented Like Current Guidance

Claim: `alignment/skillpacks-npm-package-walkthrough.html` is the current package reference, but `alignment/idea-scope-brief-npm-distribution.html` remains indexed as a normal product-design page and still contains stale package names and commands.

Evidence:

- `alignment/skillpacks-npm-package-walkthrough.html:220-226` says it is the current reference for the published `skillpacks` npm package and that the older npm distribution alignment page is historical strategy context.
- `alignment/index.html:37-40` indexes the current walkthrough, but `alignment/index.html:57-60` also indexes `Multi-Surface npm Distribution Strategy` without a historical label.
- `alignment/idea-scope-brief-npm-distribution.html:68-71` has status `amended review`; the amendment only mentions the Game AFPS deck model, not that the page is superseded for package usage.
- `alignment/idea-scope-brief-npm-distribution.html:230-251` still uses `npx agentic-skills`, `npm install -g agentic-skills`, and `npx agentic-skills` delegation examples.
- `alignment/idea-scope-brief-npm-distribution.html:585-618` still uses `npx agentic-skills install-deck ...`, `@agentic-skills/*`, and `agentic-skills install --deck ...`.
- `docs/skillpacks-npm-distribution.md:5-13` still names the old page as the source alignment page while approving `skillpacks` as the public package name.

Impact: two indexed pages make conflicting currentness claims. A reader can land on the old page and copy commands for the wrong package name.

Recommended cleanup:

- Add a prominent historical/superseded warning to the old page and update its index card text.
- Or archive the old page and leave only the walkthrough as the active usage reference.
- Keep `docs/skillpacks-npm-distribution.md` as the implementation record, but make clear which parts are historical decision evidence versus current usage.

### P2 - npm Publication Docs Still Use Future/Release-Candidate Wording

Claim: some public docs still read as pre-publication even though `skillpacks@0.1.0` is now published.

Evidence:

- `docs/skillpacks-npm-distribution.md:21-26` says `skillpacks@0.1.0` is published publicly and `latest` points to `0.1.0`.
- `README.md:45` says "After the first public package is published" before showing current npm commands.
- `README.md:105` says npm supports equivalent installs "after publication".
- `docs/QUICKSTART.md:17` says source checkout is for use before the public package is published.
- `docs/QUICKSTART.md:29`, `:50`, and `:83` still frame npm usage as "after publication".
- `docs/decks.md:18` says "After the first public npm package is published".
- `docs/decks.md:29` says "In the current release candidate".
- `docs/skillpacks-npm-distribution.md:372` still calls the shell-backed deck path "this release candidate".

Impact: users can read the npm package as not yet public or as still in a release-candidate phase, while current docs and verification say it is published.

Recommended cleanup:

- Update public docs to "With the published npm package" or "For npm users".
- Replace "release candidate" with "current `skillpacks@0.1.0` release" when describing `install-deck` still requiring `bash` and `jq`.

### P2 - Skills Showcase Counts Are Stale Or Ambiguous

Claim: planning and alignment docs use old display-card counts, while generated data has moved to a larger mirrored inventory.

Evidence:

- `apps/skills-showcase/public/assets/skills-data.js:5-7` reports `sourceCount: 545`, `skillCount: 373`, and `packCount: 41`.
- Parsing the generated data yields 373 platform entries, 190 unique mirrored skills, 179 unique pack skills, 11 unique global skills, 41 packs, 188 Claude entries, and 185 Codex entries.
- `tasks/pack-card-hierarchy.md:5-7` says 157 unique skills across 38 packs and 157 display cards.
- `tasks/pack-card-hierarchy.md:232-236` says 157 skills and 38 packs are accounted for.
- `alignment/skillmap.html:58`, `:82`, and `:119` say 41 packs, 156 pack skills, and 11 global skills.
- `apps/skills-showcase/docs/deck-builder-ux.md:103` says the SEO detail surface is for all 157 skills.
- `research/skills-showcase/idea-brief.md:44`, `research/skills-showcase/idea-brief-interview.md:9`, and `alignment/idea-scope-brief-skills-showcase.html:234-238` repeat the 157-skills claim.

Impact: implementers cannot tell whether counts refer to mirrored platform entries, unique skill names, display cards, pack skills, or global skills. This is likely to break deck-builder copy, SEO claims, and QA expectations.

Recommended cleanup:

- Define canonical count terms: platform entries, unique mirrored skills, unique pack skills, unique global skills, active packs, display cards.
- Regenerate or amend Skills Showcase planning docs to use the selected count.
- If 157 was an earlier prototype-card scope, label it historical.

### P3 - Historical Docs Are Preserved But Not Always Labeled As Historical

Claim: the repo intentionally keeps historical alignment and task artifacts, but some are discoverable through active indexes without enough status context.

Evidence:

- `alignment/index.html` still indexes older workflow analysis pages such as `canonical-workflow-report.html` and the old npm strategy page.
- `docs/workflow-refactor-proposal.html` remains in `docs/` root and contains old `/icp` examples.
- `docs/skill-routing-map.html` remains a current-looking HTML doc in `docs/`, though its maintenance status is unclear.

Impact: preserving history is fine; presenting history as current guidance creates false inconsistencies.

Recommended cleanup:

- Keep historical content intact, but label it as historical in the page header and index card.
- Move old proposals and non-current maps under `docs/history/archive/` when they are no longer maintained.

## Current / Needs Update / Archive Matrix

| Surface | Classification | Action |
| --- | --- | --- |
| `README.md` | Needs update | Replace retired `icp` in business-discovery list; refresh npm publication wording. |
| `docs/QUICKSTART.md` | Needs update | Replace symlink and future-publication wording. |
| `docs/troubleshooting.md` | Needs update | Replace re-symlink wording and fix missing init helper path. |
| `docs/scripts-reference.md` | Needs update | Fix managed-copy wording and missing root init helper path, or add the wrapper. |
| `docs/packs.md` | Mostly current | Fix root init helper path references. |
| `docs/operating-modes.md` | Needs update | Fix root init helper path reference. |
| `docs/decks.md` | Needs update | Replace future npm and release-candidate wording. |
| `docs/codex-workflow.md` | Needs update | Replace `$icp` examples with `$customer-discovery`. |
| `docs/pack-workflow-matrix.md` | Needs update | Replace default `icp` route with `customer-discovery`. |
| `docs/skill-next-step-contracts.md` | Current | Keep as routing source of truth. |
| `docs/skillpacks-npm-distribution.md` | Mostly current | Keep publication evidence; clarify source page is historical and replace release-candidate wording. |
| `alignment/skillpacks-npm-package-walkthrough.html` | Current | Keep as active usage reference. |
| `alignment/idea-scope-brief-npm-distribution.html` | Historical or needs amendment | Add superseded warning/index text or archive. |
| `alignment/canonical-workflow-report.html` | Needs update or historical label | Contains stale `icp` route but remains indexed. |
| `alignment/user-flow-map-deck-creation.html` | Needs update | Replace `/icp` handoff with `/customer-discovery`. |
| `specs/skills-showcase/*` | Needs update | Replace `/icp` route handoffs and stale count references. |
| `tasks/pack-card-hierarchy.md` | Historical or needs update | Reconcile 157/38 counts against generated data. |
| `alignment/skillmap.html` | Needs regenerate or source clarification | Reconcile 156 pack skills against generated 179 unique pack skills. |
| Old research chain docs | Historical or needs note | Add historical status for symlink-era integration observations. |

## Verification

| Check | Result |
| --- | --- |
| `node scripts/audit-alignment-pages.mjs` | Passed before new page creation: 44 active pages, exact TTS include, page metadata, viewport, embed prohibition, and index integrity. |
| `node scripts/upgrade-alignment-page.mjs --check` | Passed: `Updated: 0`, `Bundled files written: 0`, `Output paths: 284 bundles, exact`, `Generated bundles: 284 ownable, exact`. |
| `test -f scripts/init-agentic-skills.sh` | Failed with exit `1`, confirming missing root helper. |
| `ls global/{claude,codex}/init-agentic-skills/scripts` | Confirmed both bundled helper scripts exist. |
| Generated Skills Showcase data parse | Confirmed 373 entries, 190 unique mirrored skills, 179 unique pack skills, 11 unique global skills, 41 packs. |
| Targeted `rg` scans | Found active drift for symlink wording, missing helper path, retired `icp` routes, future npm wording, and stale counts. |

Final validation for the new audit artifacts is recorded in `tasks/todo.md` after the report and alignment page are written.

## Source Coverage Gaps

- No web research was performed; this is a repo-internal documentation alignment audit.
- I did not read every historical prompt, conversation, archived skill version, or task manifest. Those are treated as historical unless active docs point to them.
- This audit reports inconsistencies and recommended cleanup; it does not mutate the underlying public docs beyond replacing the audit report and adding the review page.

## Recommended Next Skill

Recommended next skill: `$exec` with a scoped remediation phase that fixes the P1 public-doc issues first: managed-copy wording, root init helper path, retired `icp` routes, and npm strategy current/historical labeling.
