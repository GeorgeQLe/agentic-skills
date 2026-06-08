# Devtool Docs Audit - Documentation Freshness And Cleanup (2026-06-08)

Scope: current repository documentation for the `agentic-skills` shared skill library, with emphasis on whether live docs still match the current install model, pack model, AFPS routing, generated-data contract, and historical/archive boundaries.

This audit treats tracked skill contracts, prompt logs, benchmark reports, generated data, and historical archives as documentation-like files, but it prioritizes surfaces a maintainer or adopter is likely to trust as current: root Markdown, `docs/`, active `research/`, active `specs/`, `PACK.md`, active `SKILL.md`, and generated showcase assets.

## Executive Verdict

P0: none. The core skill catalog is structurally healthy: dependency, routing, version, benchmark-coverage, and alignment-stub checks passed.

P1: public setup docs still mix the old symlink/install model with the current managed-copy/init model. This is the highest-impact freshness issue because it changes how users reason about refresh, checkout moves, pinned installs, and stale skills.

P1: several live workflow docs still route to the retired executable `icp` command. Active skill contracts and newer canonical docs use `customer-discovery`.

P1: `docs/` mixes current reference material with old reports/proposals that should either be marked historical or moved under `docs/history/archive/`.

P1: this workspace has ignored local residue under `packs/poketowork-kanban/` that makes `scripts/pack.sh list` expose a hibernated pack. Clean checkouts should not have this, but the local residue is misleading and should be removed.

P2: the script reference claims to be an all-script index but omits root scripts and points at a missing root `scripts/init-agentic-skills.sh` path.

P2: active packs `devtool` and `game` lack `PACK.md`, while most newer packs have one. They remain installable, but their pack-level metadata is weaker than the rest of the repo.

P2: generated Skills Showcase proof data was stale at audit time; the validator regenerated proof-data source fingerprints. After rerunning the two generators, validation passed.

## Findings

### P1 - Setup Docs Teach The Old Install Model

Claim: the public docs still describe global and project-local installs as symlinks in several places, but the current implementation installs track-latest skills as managed directories with a `.agentic-skills-managed` marker. Pinned archive installs are the symlink case.

Evidence:

- `scripts/skill-links.sh` writes `.agentic-skills-managed`, records `source`, `source_version`, and `source_sha`, and copies active skill source files with `cp -R`.
- `scripts/skill-links.sh` only uses `ln -sfn` through `sync_skill_link`, which is used for archive/pinned installs.
- `global/{claude,codex}/init-agentic-skills/SKILL.md` correctly says active installs are repo-managed directories and pinned installs intentionally point at `archive/<version>`.
- `docs/QUICKSTART.md:20` says `init.sh` symlinks global core skills.
- `docs/troubleshooting.md:18` and `docs/troubleshooting.md:73` describe `./init.sh` as re-symlinking global skills.
- `docs/scripts-reference.md:10` says `./init.sh --uninstall` removes global symlinks.
- Active devtool research files still contain older `install.sh` and symlink claims, even though most include a terminology note.

Inference: a user can still install successfully, but the mental model is stale. Managed copies make stale detection and `refresh` meaningful; symlink wording implies checkout moves should immediately affect consumers, which is no longer true for track-latest installs.

Decision impact: update live setup/troubleshooting docs to say "repo-managed skill roots" or "managed copies" by default, and reserve "symlink" for pinned archive installs. Treat older devtool research artifacts as historical unless reconciled.

Recommended cleanup:

- Update `docs/QUICKSTART.md`, `docs/troubleshooting.md`, `docs/scripts-reference.md`, and any README wording that implies active installs are symlinks.
- Reconcile or archive stale devtool research chain files before presenting them as examples.
- Keep `docs/packs.md` as the canonical detailed install-drift model because it already describes managed copies correctly in the drift section.

### P1 - Global Init Helper Path Is Documented As A Missing Root Script

Claim: live docs refer to `scripts/init-agentic-skills.sh`, but no such root script exists.

Evidence:

- `test -f scripts/init-agentic-skills.sh` returned missing.
- Actual helper scripts live at:
  - `global/claude/init-agentic-skills/scripts/init-agentic-skills.sh`
  - `global/codex/init-agentic-skills/scripts/init-agentic-skills.sh`
- `docs/scripts-reference.md:55-59` lists `scripts/init-agentic-skills.sh doctor|hook|set-pref|show-prefs`.
- `docs/packs.md:243-245` and `docs/operating-modes.md:45` also refer to `scripts/init-agentic-skills.sh`.
- The user-facing skill commands `/init-agentic-skills` and `$init-agentic-skills` delegate to the bundled helper correctly.

Inference: the skill works, but the CLI-external path in public docs is broken. This is a direct copy-paste failure.

Decision impact: choose one of two fixes:

1. Add a root wrapper `scripts/init-agentic-skills.sh` that delegates to the managed helper, then keep current docs.
2. Update docs to prefer `/init-agentic-skills` / `$init-agentic-skills` and, where a direct path is needed, name the bundled helper path explicitly.

The simpler user experience is the root wrapper, but that is implementation work, not part of this audit.

### P1 - Live AFPS Docs Still Reference Retired `icp` Command

Claim: active skill contracts and canonical docs have moved the executable route to `customer-discovery`, but multiple live docs still present `icp` as the route.

Evidence:

- Active source roots exist at `packs/business-discovery/{claude,codex}/customer-discovery`; no active `packs/business-discovery/*/icp` roots exist.
- `packs/business-discovery/PACK.md` and `docs/skills-reference.md` correctly list `customer-discovery`.
- `docs/skill-next-step-contracts.md` correctly defines the default AFPS route starting with `customer-discovery`.
- `README.md:191` still lists `business-discovery: icp, enterprise-icp, ...`.
- `docs/pack-workflow-matrix.md:45` still says `Default business-product route: icp -> competitive-analysis -> ...`.
- `docs/codex-workflow.md:285` and `docs/codex-workflow.md:311` still show `$icp` in the workflow sequence.
- `docs/skill-routing-map.html` still uses `icp` as a graph node and route target.
- `docs/workflow-refactor-proposal.html` contains many `/icp` references and appears to be an old proposal rather than current reference documentation.

Inference: the source contracts are healthier than the live docs. The stale references are likely remnants after the customer-discovery rename cleanup.

Decision impact: update the current workflow docs, and archive old proposal/map files if they are not actively maintained.

Recommended cleanup:

- Update `README.md`, `docs/pack-workflow-matrix.md`, and `docs/codex-workflow.md` from `icp` command routes to `customer-discovery`.
- Regenerate or hand-update `docs/skill-routing-map.html`; if it is no longer maintained, move it to `docs/history/archive/`.
- Move `docs/workflow-refactor-proposal.html` to `docs/history/archive/` unless it is explicitly revalidated as current.
- Preserve `enterprise-icp` and `research/icp.md` references when they name the active enterprise skill or the canonical customer-discovery output artifact.

### P1 - Historical Reports Sit Beside Current Reference Docs

Claim: the top-level `docs/` directory mixes current reference docs with old reports, validation logs, and proposals.

Evidence:

- `docs/` root has 23 files.
- Current-looking reference docs include `QUICKSTART.md`, `packs.md`, `skills-reference.md`, `operating-modes.md`, `troubleshooting.md`, `skill-next-step-contracts.md`, `orchestrator-convention.md`, `alignment-page-convention.md`, and `quality-gate-contract.md`.
- Historical/report-like files in the same root include:
  - `docs/kanban-test-results.md`: dated 2026-03-27, references production Neon/Poketo board verification for hibernated kanban workflows.
  - `docs/workflow-refactor-proposal.html`: old AFPS proposal with stale `/icp` routes.
  - `docs/skill-routing-map.html`: current-looking route visualization, but stale for `customer-discovery`.
- `docs/phases/` stores early phase records, while `tasks/phases/` stores later phase archives, including another `phase-9.md`.
- Root files `design-system-interview.md`, `ui-consolidate-skills-showcase-interview.md`, and `sync.md` are completed session artifacts, not durable entry points.
- `specs/drift-report.md` is active under `specs/`, but the latest top section is from 2026-05-11 and predates later hibernation/routing work.

Inference: the repo already has an archive convention, but not every completed report has been moved there. The risk is that maintainers treat historical outputs as current contracts.

Decision impact: create a clear doc taxonomy and move dated/completed reports out of active reference paths.

Recommended cleanup:

- Keep current references in `docs/` root.
- Move old reports/proposals to `docs/history/archive/YYYY-MM-DD/HHMMSS/`.
- Move root session artifacts into `docs/history/archive/` or a narrower `docs/history/session-artifacts/` location.
- Regenerate `specs/drift-report.md` or move the old report under history and create a fresh report.

### P1 - Local Hibernated Kanban Residue Misleads Pack Listing

Claim: this workspace has ignored local residue under `packs/poketowork-kanban/` that makes pack discovery look stale even though tracked docs say the pack is hibernated.

Evidence:

- `scripts/pack.sh install poketowork-kanban` correctly failed with the hibernation error and pointed to `archive/hibernated-packs/2026-06-poketowork-rebuild/poketowork-kanban`.
- `scripts/pack.sh which poketo-kanban` reported `poketo-kanban` as provided by pack `poketowork-kanban`.
- Because ignored local files existed under `packs/poketowork-kanban/`, `scripts/pack.sh install poketo-kanban` found an apparent active skill source and installed it. That accidental install was removed during the audit with `scripts/pack.sh remove poketo-kanban`; `.agents/project.json` returned to its prior diff-free state.
- `git ls-files packs/poketowork-kanban` returned no tracked files.
- `git status --short --ignored packs/poketowork-kanban` showed the path as ignored.
- `git clean -ndX packs/poketowork-kanban` reported `Would remove packs/poketowork-kanban/`.

Inference: this is not a tracked-doc contradiction; it is local ignored residue that changes command behavior in this workspace. It also exposes a robustness gap in pack discovery: an ignored directory without `PACK.md` can still affect `list` and skill-name install resolution.

Decision impact: clean the local ignored directory and consider hardening `pack.sh` to ignore pack dirs without `PACK.md` or to apply the hibernated-skill guard before active-source lookup.

Recommended cleanup:

- Remove ignored local residue: `git clean -fdX packs/poketowork-kanban` after explicit approval.
- Add a pack discovery guard so hibernated skill names cannot be installed by stale local residue.

### P2 - Script Reference Is Not A Complete Script Index

Claim: `docs/scripts-reference.md` calls itself a compact command index for all scripts, but it omits several root scripts and includes the missing `scripts/init-agentic-skills.sh` path.

Evidence:

- Root `scripts/` currently includes files such as `detect-secrets.sh`, `save-conversation.sh`, `ship-quality-gate.sh`, `skill-links.sh`, `skill-next-step-routing.sh`, `alignment-chart-snippets.js`, and `generate-skills-showcase-*`.
- `docs/scripts-reference.md` covers common install, pack, hygiene, testing, showcase, and alignment commands.
- It does not include every root script and does not label internal helper scripts separately.

Inference: the page is useful, but its title and missing direct paths create avoidable confusion.

Decision impact: either rename it to "Common Scripts Reference" or expand it into a true all-script table with `public`, `maintenance`, `internal helper`, and `generated asset` categories.

### P2 - Active Packs `devtool` And `game` Lack `PACK.md`

Claim: most active packs now carry `PACK.md`, but `devtool` and `game` do not.

Evidence:

- `for d in packs/*; do [ -f "$d/PACK.md" ] || echo "$d"; done` reported `packs/devtool`, `packs/game`, and local ignored `packs/poketowork-kanban`.
- `devtool` and `game` both contain active mirrored `SKILL.md` files.
- `README.md`, `docs/packs.md`, and `docs/skills-reference.md` document both packs.

Inference: this is not a command failure, but it leaves two major active packs without pack-local documentation.

Decision impact: add `PACK.md` for `devtool` and `game`, using `docs/skills-reference.md` as the source of truth.

### P2 - Skills Showcase Generated Proof Data Was Stale

Claim: the Skills Showcase generated proof data was stale at audit time, then refreshed successfully.

Evidence:

- The first `scripts/validate-skills-showcase-data.sh` run regenerated assets and then failed with `Skills Showcase generated data is stale`.
- The only tracked generated diffs were one-line `sourceFingerprint` updates in:
  - `docs/skills-showcase/assets/github-proof-data.js`
  - `apps/skills-showcase/public/assets/github-proof-data.js`
- After running `node scripts/generate-skills-showcase-data.mjs` and `node scripts/generate-skills-showcase-github-data.mjs`, `scripts/validate-skills-showcase-data.sh` passed with `Skills Showcase generated data is fresh`.
- `pnpm --dir tests bench:coverage` passed with `Benchmark coverage matrix valid (185 skills)`.

Inference: generated catalog content appears structurally healthy. The final audit boundary includes the regenerated proof-data fingerprint updates.

Decision impact: commit the refreshed generated proof data with this audit boundary if the audit artifacts are shipped.

## Current / Needs Update / Archive Matrix

| Surface | Classification | Action |
| --- | --- | --- |
| `README.md` | Needs update | Fix `icp` route and active install wording. |
| `docs/QUICKSTART.md` | Needs update | Replace symlink wording with managed-copy wording. |
| `docs/packs.md` | Mostly current | Fix missing root `scripts/init-agentic-skills.sh` references; keep drift model. |
| `docs/skills-reference.md` | Mostly current | Keep; use as source for `devtool` and `game` `PACK.md`. |
| `docs/canonical-workflow-report.md` | Current | Keep as canonical AFPS route reference. |
| `docs/skill-next-step-contracts.md` | Current | Keep as routing contract reference. |
| `docs/codex-workflow.md` | Needs update | Replace `$icp` route examples with `$customer-discovery`. |
| `docs/pack-workflow-matrix.md` | Needs update | Replace default `icp` route with `customer-discovery`. |
| `docs/skill-routing-map.html` | Needs update or archive | Regenerate with `customer-discovery`, or archive if not maintained. |
| `docs/workflow-refactor-proposal.html` | Archive candidate | Move under `docs/history/archive/` as old proposal. |
| `docs/kanban-test-results.md` | Archive candidate | Move under history; hibernated workflow proof is no longer active reference. |
| `docs/phases/*` | Archive/rationalize candidate | Merge with or move under phase-history convention; avoid overlap with `tasks/phases/`. |
| `docs/scripts-reference.md` | Needs update | Fix root init path and either cover all scripts or rename scope. |
| `docs/troubleshooting.md` | Needs update | Fix managed-copy wording and global drift helper path. |
| `docs/test-harness.md` | Needs update | Prefer `pnpm --dir tests ...` commands in copy-paste examples. |
| `research/devtool-*.md` | Historical or needs reconciliation | Several contain dated `install.sh` notes and stale symlink facts. |
| `research/devtool-docs-audit-2026-06-04.md` | Archive candidate | Older dated audit can move under `docs/history/archive/`. |
| `specs/drift-report.md` | Needs regenerate or archive | Latest active report predates later hibernation and routing cleanup. |
| Root interview/session files | Archive candidate | Move `design-system-interview.md`, `ui-consolidate-skills-showcase-interview.md`, and `sync.md` out of repo root. |
| `packs/devtool/PACK.md` | Missing | Add pack-level docs. |
| `packs/game/PACK.md` | Missing | Add pack-level docs. |
| Ignored `packs/poketowork-kanban/` | Local cleanup | Remove ignored residue after approval. |

## Recommended Cleanup Order

1. Fix live copy-paste blockers:
   - `scripts/init-agentic-skills.sh` path issue.
   - managed-copy vs symlink wording.
   - `$icp` / `/icp` route examples in active docs.
2. Commit the regenerated Skills Showcase proof-data updates produced during this audit.
3. Archive or relabel historical docs in active-looking locations:
   - `docs/workflow-refactor-proposal.html`
   - `docs/kanban-test-results.md`
   - `docs/phases/*`
   - root session artifacts
   - older dated `research/devtool-docs-audit-2026-06-04.md`
4. Add missing `PACK.md` files for `devtool` and `game`.
5. Regenerate `specs/drift-report.md` with current repo evidence or move the old report to history.
6. Harden `scripts/pack.sh` against ignored hibernated-pack residue.

## Verification

| Check | Result |
| --- | --- |
| `git ls-files '*.md' '*.html' '*.mdx' '*.rst' '*.txt' \| wc -l` | 2,972 tracked documentation-like files. |
| `git ls-files '*.md' '*.html' '*.mdx' '*.rst' '*.txt' \| awk ...` | Largest groups: `packs` 1902, `prompts` 239, `benchmark` 170, `archive` 166, `conversations` 143, `global` 131, `docs` 59, `tasks` 56, `alignment` 36, `specs` 28, `research` 10. |
| `scripts/skill-deps.sh --broken` | Passed: no broken references found. |
| `scripts/skill-pack-routing-audit.sh` | Passed: no cross-pack recommendation gaps found. |
| `scripts/skill-versions.sh --missing` | Passed: all 405 skills have a version field. |
| `node scripts/upgrade-alignment-page.mjs --dry-run` | Passed: `Updated: 0`, `Bundled files written: 0`. |
| `pnpm --dir tests bench:coverage` | Passed: benchmark coverage matrix valid for 185 skills. |
| First `scripts/validate-skills-showcase-data.sh` run | Failed after regenerating stale proof-data fingerprints. |
| Final `scripts/validate-skills-showcase-data.sh` run after the two generator commands | Passed: `Skills Showcase generated data is fresh`. |
| `scripts/pack.sh install poketowork-kanban` | Correctly blocked as hibernated. |
| `scripts/pack.sh install poketo-kanban` | Unexpectedly succeeded due local ignored residue; removed with `scripts/pack.sh remove poketo-kanban`. |
| `git clean -ndX packs/poketowork-kanban` | Dry-run reported it would remove the ignored local residue. |

Full test suite was not run. The audit produced documentation/report artifacts and used targeted repo integrity checks instead.

## Source Coverage Gaps

- No web research was performed; this was a repo-internal documentation audit.
- The audit did not read every one of the 2,972 documentation-like files. It sampled and scanned by doc surface, command names, route names, installer terms, archive boundaries, and validation scripts.
- It did not mutate cleanup candidates beyond writing this report, the prompt history, task tracking, the alignment page, and regenerated proof-data assets required by validation.

## Recommended Next Skill

Recommended next skill: `$exec` to implement the first cleanup slice after approving the cleanup order above.
