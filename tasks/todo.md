## Current Implementation - VARD/ORD Scan Staged Research Contract

### Goal

Make `$vard-scan` / `/vard-scan` and `$ord-scan` / `/ord-scan` scope-first research skills: scope review page first, preliminary working packet after scope approval, approval page for the candidate artifact, then canonical write after approval.

### Execution Profile

- Parallel mode: parallel reads and independent verification scans; serial writes for skill files, generated bundles, changelogs, and task docs.
- Rationale: four mirrored skill contracts need consistent language and archive/version handling, and generated alignment bundles must come from the canonical generator.

### Steps

- [x] Capture the visible user invocation in prompt history.
- [x] Write active roadmap/todo plan from the supplied implementation plan.
- [x] Inspect the four target scan skills and staged research reference language.
- [x] Archive the four v0.0 scan skills with `scripts/skill-archive.sh`.
- [x] Update the four active scan skills to v0.1 with strict staged research, evidence/feedback, and alignment-page stub sections.
- [x] Add or update `CHANGELOG.md` for each scan skill.
- [x] Generate sibling `ALIGNMENT-PAGE.md` bundles with `node scripts/upgrade-alignment-page.mjs`.
- [x] Run generated-bundle drift, active research compliance, targeted marker, archive/changelog, showcase, and whitespace checks.
- [x] Commit and push the intended boundary on `master`.

### Acceptance Criteria

- [x] All four active scan skills contain `## Report-First Approval Gate`, `## Staged Research Workflow`, `Stage 1 - Scope discovery and approval`, and the appropriate `preliminary-*-scan-research.md` path.
- [x] Active `type: research` audit reports 138 active research skills and 0 non-compliant skills.
- [x] Generated `ALIGNMENT-PAGE.md` bundles exist beside all four active scan skills and pass exact drift check.
- [x] Archive snapshots and `CHANGELOG.md` files exist for all four v0.1 skill bumps.
- [x] `git diff --check` passes.

### Review Notes

- Archived v0.0 snapshots for all four scan skill directories before editing active contracts.
- Bumped VARD/ORD scan contracts to v0.1 and added strict staged research: Stage 1 scope-review page only, Stage 2 preliminary `_working` packet, Stage 3 archive working packet plus approved canonical scan artifact.
- Preserved lightweight VARD/ORD scan criteria while moving candidate ranking and top-pick recommendations behind artifact approval.
- Generated four sibling `ALIGNMENT-PAGE.md` bundles from `node scripts/upgrade-alignment-page.mjs`; no generated bundle was hand-edited.
- Refreshed Skills Showcase generated data and proof assets after active skill metadata changed. Curated showcase copy, grouping, workflow animation text, and proof receipt copy needed no manual edits because titles, descriptions, pack grouping, and public proof copy are unchanged apart from generated versions/fingerprints.
- Captured the current `$exec` invocation and visible pasted skill context in `prompts/exec/skill-prompt-20260610-202327-exec.md`.
- Verification passed:
  - `node scripts/upgrade-alignment-page.mjs --check`
  - `node scripts/upgrade-alignment-page.mjs --dry-run`
  - Active staged research audit: 138 active `type: research` skills, 0 non-compliant
  - Targeted marker, artifact, and runner-command scans for report-first, staged workflow, explicit VARD/ORD preliminary packet paths, changelogs, archives, generated bundles, and Claude/Codex route syntax
  - `bash scripts/skill-versions.sh --missing`
  - `bash scripts/skill-archive-audit.sh --strict`
  - `bash scripts/skill-deps.sh --broken`
  - `bash scripts/skill-pack-routing-audit.sh`
  - `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`
  - `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`
  - `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
  - `pnpm --dir apps/skills-showcase build`
  - `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts` (26 passed)
  - `git diff --check`
- A broader exploratory `bash scripts/skill-mirror-parity-audit.sh` run found 28 unrelated pre-existing heading-drift failures and did not name the VARD/ORD scan skills. The script has no scoped mode, so target-specific marker, artifact, and runner-command scans were used as the adversarial review for this boundary.

---

## Current Implementation - Skillpacks CLI Routing Remediation: Canonical Wording And Validation

### Goal

Define the canonical npm-aware install-route wording and add the first regression check before touching the 220 active `SKILL.md` remediation candidates from `research/skillpack-cli-routing-audit.md`.

### Execution Profile

- Parallel mode: serial writes, parallel reads allowed.
- Rationale: the wording contract must be settled before large mirrored skill edits begin, and the validation rule should prevent broad remediation from drifting back to `/pack`, `$pack`, or `scripts/pack.sh` only.

### Source Context

- Audit report: `research/skillpack-cli-routing-audit.md`.
- Audit inventory: 383 active skill files scanned; 220 active skills need npm-aware routing wording; 14 global routing/install skills are P1.
- Current install-route contract:
  - Claude in-agent route: `/pack install <pack-or-skill>`.
  - Codex in-agent route: `$pack install <pack-or-skill>`.
  - Project shell route: `npx skillpacks install <pack-or-skill>`.
  - Deck shell route: `npx skillpacks install-deck <deck>`.
  - Source-checkout route: `scripts/pack.sh install <pack-or-skill>`.

### Steps

- [x] Define the canonical wording matrix:
  - Claude pack install: keep `/pack install <pack>` and add `npx skillpacks install <pack>`.
  - Codex pack install: keep `$pack install <pack>` and add `npx skillpacks install <pack>`.
  - Individual skill install: keep `/pack install <skill>` or `$pack install <skill>` and add `npx skillpacks install <skill>`.
  - Source-checkout maintenance: keep `scripts/pack.sh install <pack-or-skill>` and add the npm route only when the target reader may be outside this checkout.
  - Deck install: use `npx skillpacks install-deck <deck>` and do not phrase deck installs as pack or individual skill installs.
  - Durable contract: `docs/skillpacks-install-routing-contract.md`.
- [x] Decide the validation shape:
  - Read `docs/skillpacks-install-routing-contract.md`, `research/skillpack-cli-routing-audit.md`, `scripts/skill-pack-routing-audit.sh`, and existing layer1 routing-test patterns.
  - Decide whether the npm-route guard should be a dedicated script, a layer1 test, or both; prefer a dedicated active-skill scan script if it keeps failure output actionable for broad remediation batches.
  - Define the allowlist shape for source-checkout-only/internal text before implementation so exceptions are explicit and reviewable.
  - Prefer a focused script or layer1 test that scans active `SKILL.md` files, excludes `archive/**`, and reports install-route text that lacks the required `npx skillpacks` alternative.
  - Allowlist truly internal/source-checkout-only maintenance text with comments or structured fixtures so exceptions are auditable.
  - Keep `scripts/skill-pack-routing-audit.sh` as the cross-pack guard correctness check unless the new npm-route assertion fits cleanly without weakening that script's scope.
  - Decision: add a dedicated focused script, tentatively `scripts/skill-install-routing-audit.sh`, implemented as a Bash wrapper around an embedded Node scanner like `scripts/skill-pack-routing-audit.sh`.
  - Decision: keep `scripts/skill-pack-routing-audit.sh` unchanged and scoped to cross-pack recommendation guard correctness. The new script owns npm-aware install-route wording.
  - Decision: add a layer1 wrapper test only for the fixture/contract behavior at first, not as a repository-wide active strict gate until the staged remediation has removed the known 220 active failures.
  - Required script modes:
    - `--active` scans active `SKILL.md` files under `global/` and `packs/`, excluding every `archive/**` path, and exits non-zero for install-route text missing the required npm route unless allowlisted.
    - `--report` prints the same active findings but exits zero so broad remediation batches can inspect current debt without blocking a pre-remediation ship.
    - `--fixtures <dir>` scans fixture cases and exits non-zero when valid examples fail, invalid examples pass, deck installs are treated as ordinary pack installs, or source-checkout-only exceptions lack explicit allowlist evidence.
  - Required allowlist shape: a structured JSON file or embedded fixture object with one entry per exception: `path`, `reason`, `scope` (`source-checkout-only`, `internal-maintenance`, or `fixture`), `evidence`, and optional `expires_after`. The scanner must fail on stale allowlist entries that no longer match active text.
  - Required distinction: `npx skillpacks install-deck <deck>` satisfies only deck-route guidance; it must not satisfy pack or individual skill install guidance that needs `npx skillpacks install <pack-or-skill>`.
- [x] Implement the validation rule and initial fixtures:
  - Create `scripts/skill-install-routing-audit.sh` using the decision above.
  - Build the scanner around active `SKILL.md` files in `global/` and `packs/`; exclude `archive/**` and do not scan generated package build output under `packages/skillpacks/build`.
  - Include the 14 P1 global files from `research/skillpack-cli-routing-audit.md` as a required coverage list, and fail if any are missing from the active scan inventory.
  - Trigger on install-route wording including `/pack install`, `$pack install`, generic `pack install`, `scripts/pack.sh install`, `Pack Availability Guard`, `Missing Skill Fallback`, and `install-deck`.
  - Require `npx skillpacks install` for pack or individual skill install guidance, and require `npx skillpacks install-deck` for deck guidance.
  - Add fixtures under `tests/fixtures/skill-install-routing/` for:
    - Claude and Codex valid dual-route `Pack Availability Guard` boilerplate.
    - Missing-skill fallback text with `/pack` or `$pack` plus `npx skillpacks install <pack-or-skill>`.
    - Source-checkout-only `scripts/pack.sh install` text that passes only with an explicit allowlist entry.
    - Invalid pack/skill install text that mentions only `/pack`, `$pack`, or `scripts/pack.sh`.
    - Invalid deck text where `npx skillpacks install <deck>` is used instead of `npx skillpacks install-deck <deck>`.
  - Add a focused layer1 test, for example `tests/layer1/skill-install-routing-audit.test.ts`, that runs fixture mode and pins the P1 coverage inventory without making the known active 220-file debt fail the whole layer1 suite yet.
  - Do not edit active `SKILL.md` files, archives, changelogs, Skills Showcase data, or generated package build output in this step.
- [x] Verify this slice:
  - Run `bash -n scripts/skill-install-routing-audit.sh`.
  - Run the new fixture validation and confirm it passes.
  - Run active report mode and confirm it reports the known pre-remediation debt without failing the command.
  - Optionally run active strict mode and record the expected pre-remediation failure count, but do not treat that expected red output as a regression until the remediation phases remove the debt.
  - Run `bash scripts/skill-pack-routing-audit.sh`.
  - Run the focused layer1 test for `skill-install-routing-audit`.
  - Run `git diff --check`.
- [ ] Prepare the next remediation slice:
  - Update `tasks/todo.md` with the P1 global skill edit batch after canonical wording and validation are in place.
  - Carry forward the skill-versioning requirement for every changed `SKILL.md`: `scripts/skill-archive.sh <skill-dir>`, frontmatter `version` bump, and `CHANGELOG.md` update where applicable.
  - Include the 14 P1 targets explicitly:
    - `global/claude/afps-status/SKILL.md`
    - `global/claude/codebase-status/SKILL.md`
    - `global/claude/idea-scope-brief/SKILL.md`
    - `global/claude/init-agentic-skills/SKILL.md`
    - `global/claude/pack/SKILL.md`
    - `global/claude/provision-agentic-config/SKILL.md`
    - `global/claude/skills/SKILL.md`
    - `global/codex/afps-status/SKILL.md`
    - `global/codex/codebase-status/SKILL.md`
    - `global/codex/idea-scope-brief/SKILL.md`
    - `global/codex/init-agentic-skills/SKILL.md`
    - `global/codex/pack/SKILL.md`
    - `global/codex/provision-agentic-config/SKILL.md`
    - `global/codex/skills/SKILL.md`
  - Plan the P1 edit batch as its own next `$exec` step; do not edit active `SKILL.md` files during this planning-only step.
  - The P1 implementation plan must include a targeted post-edit check that no P1 file remains in `scripts/skill-install-routing-audit.sh --report`, while full `--active` may still fail until P2/P3 are remediated.

### Acceptance Criteria

- The canonical wording explicitly preserves `/pack`, `$pack`, and `scripts/pack.sh` where they are still valid while adding npm CLI alternatives.
- The validation distinguishes pack or individual skill installs from deck installs.
- P1, P2, and P3 remediation remains sequenced from `research/skillpack-cli-routing-audit.md`; this slice does not attempt the whole 220-skill migration.
- No active `SKILL.md` remediation begins until the wording contract and regression check are in place.
- Review notes state whether Skills Showcase refresh is unnecessary for this slice or required by any later `SKILL.md` metadata/content changes.

### Planning Update Review

- Reframed the active todo from a P1 source-edit batch to the smaller first remediation slice requested by the roadmap plan.
- No active `SKILL.md` files, generated Skills Showcase assets, or source tests are changed by this planning update.

### Review Notes

- Captured the visible `$exec` invocation in `prompts/exec/skill-prompt-20260610-201246-exec.md`.
- Captured the visible `$exec` invocation and pasted skill context in `prompts/exec/skill-prompt-20260610-201743-exec.md`.
- Added `docs/skillpacks-install-routing-contract.md` as the canonical wording matrix for the npm-aware install-route remediation.
- The contract preserves runner-specific in-agent routes (`/pack` for Claude and `$pack` for Codex), keeps `scripts/pack.sh` for source-checkout maintenance, adds `npx skillpacks install <pack-or-skill>` for package consumers, and reserves `npx skillpacks install-deck <deck>` for curated decks.
- Decided the validation shape: add a dedicated active-skill scanner plus fixture-backed layer1 coverage, keep the existing cross-pack routing audit unchanged, and use a structured allowlist only for explicit source-checkout-only/internal exceptions.
- Added `scripts/skill-install-routing-audit.sh` with `--active`, `--report`, and `--fixtures <dir>` modes.
- The scanner reads active `SKILL.md` files under `global/` and `packs/`, excludes `archive/**`, pins the 14 P1 global files as required coverage, strips YAML frontmatter before matching install-route wording, distinguishes pack/skill installs from deck installs, and validates structured allowlist entries for source-checkout-only/internal exceptions.
- Added fixture coverage under `tests/fixtures/skill-install-routing/` for valid Claude/Codex pack guards, missing-skill fallbacks, source-checkout-only allowlisting, valid deck install wording, invalid in-agent-only routes, invalid source-checkout-only text without allowlist evidence, invalid generic `pack install`, and invalid deck routing through `npx skillpacks install <deck>`.
- Added `tests/layer1/skill-install-routing-audit.test.ts` to run fixture mode and confirm the P1 coverage inventory through `--report` without making the known active debt fail layer1 yet.
- Verification passed:
  - `bash -n scripts/skill-install-routing-audit.sh`
  - `scripts/skill-install-routing-audit.sh --fixtures tests/fixtures/skill-install-routing` (11 fixture `SKILL.md` files, 6 expected invalid findings, exit 0)
  - `scripts/skill-install-routing-audit.sh --report` (383 active `SKILL.md` files, 14/14 P1 coverage, 220 findings, exit 0)
  - `scripts/skill-install-routing-audit.sh --active` (expected pre-remediation failure: 220 findings)
  - `bash scripts/skill-pack-routing-audit.sh`
  - `pnpm --dir tests exec vitest run --project layer1 layer1/skill-install-routing-audit.test.ts` (2 passed)
  - `git diff --check`
- No active `SKILL.md` or `PACK.md` content changed in this step, so skill versioning, changelog updates, and Skills Showcase refresh are not required until the later remediation batches.

---

## Current Implementation - Skillpacks CLI Routing Audit

### Goal

Audit all active repo skills for install-routing text that needs to reflect the published `skillpacks` npm CLI install path.

### Execution Profile

- Parallel mode: parallel reads for inventory and evidence, serial report/task writes.
- Rationale: this is an audit-only pass across many active skill files; source remediation should be a separate, staged mutation after the install wording is accepted.

### Steps

- [x] Capture the visible `pack`-skill invocation in prompt history.
- [x] Enumerate active `SKILL.md` files under `global/` and `packs/`, excluding archives.
- [x] Confirm the current npm install contract from repo docs and package metadata.
- [x] Scan active skills for old install-route text and missing npm `skillpacks` alternatives.
- [x] Write the audit inventory and remediation order to `research/skillpack-cli-routing-audit.md`.
- [x] Run targeted scans and the existing cross-pack routing audit.

### Acceptance Criteria

- [x] Findings identify which skills need npm CLI install-routing updates.
- [x] Core routing skills are separated from repeated pack-availability guard updates.
- [x] Verification distinguishes npm CLI wording drift from existing cross-pack guard correctness.

### Review Notes

- Scanned 383 active `SKILL.md` files under `global/` and `packs/`, excluding `archive/**`.
- Found 220 active skills with install-routing or pack-availability guard language that does not mention `npx skillpacks install` or `skillpacks install-deck`.
- Found 0 active skill files already mentioning `npx skillpacks` or `skillpacks install`.
- Existing `scripts/skill-pack-routing-audit.sh` passed, confirming the drift is not missing cross-pack guards; it is stale install-route wording inside active skills.
- Wrote the full grouped inventory and remediation order to `research/skillpack-cli-routing-audit.md`.

---

## Current Implementation - Prompt History Artifact Reconciliation

### Goal

Confirm the pack routing-audit prompt-history artifact is already tracked, then capture the current `$ship` invocation so the repository has no orphaned prompt files.

### Execution Profile

- Parallel mode: serial task/prompt bookkeeping.
- Rationale: this boundary is prompt-history and task-history only; no source, generated runtime asset, package metadata, or deploy surface should change.

### Steps

- [x] Inspect `prompts/pack/skill-prompt-20260610-195858-skillpack-routing-audit.md` for scope and obvious secret risk.
- [x] Confirm the pack prompt artifact is already tracked in `7ac9ebc3 docs: audit skillpacks cli routing gaps`.
- [x] Capture the visible `$ship` invocation in `prompts/ship/`.
- [x] Record the prompt-history reconciliation in task docs, history, and a ship manifest.
- [x] Run whitespace/staged-boundary checks, commit, and push the prompt-history boundary.

### Acceptance Criteria

- [x] The pack prompt-history file is tracked, and the `$ship` prompt-history file is pushed with this boundary.
- [x] No source, generated runtime, skill metadata, package, or deploy files are included.
- [x] Validation and deploy decisions are explicit.

### Review Notes

- The pack prompt contains only the visible request to audit skill routing for the new npm package `skillpack` CLI installs; no secrets or credentials were present. It is already tracked in `7ac9ebc3`.
- The shipping boundary is limited to `prompts/ship/skill-prompt-20260610-200044-ship-pack-prompt.md`, `tasks/todo.md`, `tasks/roadmap.md`, `tasks/history.md`, and `tasks/ship-manifest-2026-06-10-prompt-history-reconciliation.md`.
- Validation passed: `git diff --check`; staged diff/name review; `git diff --cached --check`.
- Deploy skipped: `tasks/deploy.md` targets the Skills Showcase production app, while this boundary changes only prompt/task/history artifacts and no deploy-relevant runtime surface.

---

## Current Implementation - P1/P2 Verification Rerun

### Goal

Rerun the already-shipped P1 docs remediation and P2 Skills Showcase count reconciliation checks from 2026-06-10, fixing only confirmed drift if the rerun finds it.

### Execution Profile

- Parallel mode: serial verification and task-meta writes.
- Rationale: P1/P2 share documentation and alignment-page surfaces; this rerun should not touch unrelated active work or advance to a new backlog item.

### Steps

- [x] Capture the visible `$exec p1 and p2 again` invocation in prompt history.
- [x] Re-run P1 wrapper, route, install-wording, publication-wording, historical-label, alignment-page, generated-bundle, focused layer1, and whitespace checks.
- [x] Re-run P2 skill-map generator, stale-count scan, retired-route scan, alignment-page, generated-bundle, focused layer1, and whitespace checks.
- [x] Record the rerun result, manifest, deploy decision, and next route.

### Acceptance Criteria

- [x] P1 scoped scans remain clean, and the historical npm page/index labels are still present.
- [x] P2 generated count terms still match current generated data, and scoped stale-count/retired-route scans remain clean.
- [x] No P1/P2 remediation source or documentation drift is introduced by the rerun.

### Review Notes

- Rerun found no P1/P2 drift to fix.
- `node scripts/generate-skillmap-excalidraw.mjs` regenerated `docs/skillmap.excalidraw` and `alignment/skillmap.html` without leaving a diff, reporting 373 platform entries, 190 unique mirrored skills, 179 unique pack skills, 11 unique global skills, 41 active packs, 157 Claude pack roots, and 11 global Claude roots.
- Validation passed: scoped P1 stale-route, active-install wording, post-publication wording, and historical-label scans; `bash -n scripts/init-agentic-skills.sh`; `scripts/init-agentic-skills.sh status`; isolated-home `scripts/init-agentic-skills.sh doctor`; `node --check scripts/generate-skillmap-excalidraw.mjs`; skill-map regeneration; scoped P2 stale-count and retired-route scans; `node scripts/audit-alignment-pages.mjs`; `node scripts/upgrade-alignment-page.mjs --check`; `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts` (14/14); and `git diff --check`.
- Deploy skipped: `tasks/deploy.md` targets the Skills Showcase production app, but this rerun changed only task/prompt verification artifacts and no deploy-relevant app/runtime surface; production deploys also require explicit confirmation.

---

## Current Implementation - P1 Docs Remediation Pass

### Goal

Fix the P1 public documentation issues reported by the 2026-06-10 repo documentation alignment audit: managed-copy install wording, the missing root init helper path, retired `icp` executable routes in current guidance, and the old npm strategy page being indexed like current usage guidance.

### Execution Profile

- Parallel mode: serial writes after parallel read inventory.
- Rationale: the pass touches cross-linked docs, alignment pages, a root launcher, task history, and validation notes; edits should land as one coherent remediation boundary.

### Steps

- [x] Add active task tracking and capture the visible `exec` invocation in prompt history.
- [x] Remediate P1 docs and indexed pages:
  - Replace active install wording that says global/project track-latest installs are symlinks with managed-copy/directory wording, while preserving symlink wording for pinned archive installs.
  - Add the documented root `scripts/init-agentic-skills.sh` launcher wrapper so copy-paste helper commands work from the repo root.
  - Replace retired executable `icp` handoffs in current docs, specs, and indexed alignment pages with `customer-discovery`, preserving `enterprise-icp` and `research/icp.md` artifact references.
  - Mark `alignment/idea-scope-brief-npm-distribution.html` and its index card as historical/superseded for package usage, pointing readers to `alignment/skillpacks-npm-package-walkthrough.html`.
- [x] Run targeted scans, alignment-page validation, wrapper smoke checks, and whitespace checks.
- [x] Record review notes, update history, commit, and push intended remediation artifacts only.

### Acceptance Criteria

- [x] Root `scripts/init-agentic-skills.sh doctor` resolves and runs far enough to prove the documented path exists.
- [x] Targeted scans find no stale executable `/icp` or `$icp` route in the edited current docs/pages, excluding intentional `enterprise-icp` and `research/icp.md` evidence references.
- [x] Targeted scans find no active public-doc wording that says track-latest/global installs are symlinked or re-symlinked.
- [x] The old npm strategy alignment page and index card visibly label the page as historical/superseded for package usage.
- [x] `node scripts/audit-alignment-pages.mjs` and `git diff --check` pass.

### Review Notes

- Captured the visible `$exec` prompt in `prompts/exec/skill-prompt-20260610-193906-remediation-p1-docs.md`.
- Added `scripts/init-agentic-skills.sh` as the documented root wrapper, delegating to the bundled init-agentic-skills launcher.
- Updated public setup docs so active global installs are described as managed copies/directories with drift metadata; symlink wording is now reserved for pinned archive installs.
- Replaced retired executable `/icp` and `$icp` routes in the scoped current docs, specs, and indexed alignment pages with `/customer-discovery` or `$customer-discovery`, while preserving `enterprise-icp` and `research/icp.md` evidence references.
- Marked `alignment/idea-scope-brief-npm-distribution.html` and its index card as historical/superseded for current npm package usage, pointing readers to `alignment/skillpacks-npm-package-walkthrough.html`.
- Folded in adjacent publication-wording cleanup for README, Quickstart, decks, and npm-distribution docs while the same current npm surfaces were open.
- Added visible 2026-06-10 amendment markers to edited active alignment-page content.
- Validation passed: targeted stale-route scan returned no scoped matches; targeted active-install wording scan returned no stale global/track-latest symlink wording; targeted future/release-candidate npm wording scan returned no matches; historical page label scan found the expected page/index labels; `bash -n scripts/init-agentic-skills.sh` passed; `scripts/init-agentic-skills.sh status` passed; `HOME=/tmp/agentic-skills-init-smoke scripts/init-agentic-skills.sh doctor` passed; `node scripts/audit-alignment-pages.mjs` passed; `node scripts/upgrade-alignment-page.mjs --check` passed; `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts` passed 14/14; `git diff --check` passed.
- Real-home `scripts/init-agentic-skills.sh doctor` resolved through the new wrapper and reported pre-existing stale global installs, exiting 1 as expected for this machine state; the isolated-home smoke proves the wrapper command path itself is clean.

---

## Current Implementation - P2 Skills Showcase Count Reconciliation

### Goal

Resolve the remaining P2 documentation drift from the 2026-06-10 docs audit: Skills Showcase planning docs and alignment pages still mix old 157/156/38 display-card counts with current generated inventory counts.

### Execution Profile

- Parallel mode: serial writes after targeted read inventory.
- Rationale: count terms and count-bearing docs must be updated together so generated data, planning docs, and alignment pages agree.

### Steps

- [x] Reconcile remaining P2 Skills Showcase count docs:
  - Define count terms from generated data: platform entries, unique mirrored skills, unique pack skills, unique global skills, active packs, and display cards.
  - Update stale count references in current Skills Showcase docs and indexed alignment pages, including `tasks/pack-card-hierarchy.md`, `alignment/skillmap.html`, `apps/skills-showcase/docs/deck-builder-ux.md`, `research/skills-showcase/idea-brief.md`, `research/skills-showcase/idea-brief-interview.md`, and `alignment/idea-scope-brief-skills-showcase.html` as confirmed by fresh scans.
  - Preserve historical counts only when explicitly labeled historical/prototype scope.
  - Run generated-data parsing, alignment-page audit, targeted count scans, and whitespace checks.
  - Record review notes, update history, commit, and push intended changes only.

### Acceptance Criteria

- [x] Current count-bearing docs distinguish generated platform entries from unique mirrored skills, unique pack skills, unique global skills, packs, and any historical display-card scope.
- [x] Targeted scans no longer find unlabeled stale `157`, `156 pack skills`, or `38 packs` claims in current Skills Showcase docs/pages.
- [x] Alignment-page validation and whitespace checks pass.

### Review Notes

- Captured the visible `$exec` invocation in `prompts/exec/skill-prompt-20260610-194752-exec.md`.
- Parsed current generated Skills Showcase data from `apps/skills-showcase/public/assets/skills-data.js`: 373 platform entries, 190 unique mirrored skills, 179 unique pack skills, 11 unique global skills, 41 active packs, 39 skill-bearing packs, 354 pack platform entries, and 19 global platform entries.
- Updated `scripts/generate-skillmap-excalidraw.mjs` so regenerated skill-map artifacts report generated inventory counts separately from the structural Claude-root map scope.
- Regenerated `docs/skillmap.excalidraw` and `alignment/skillmap.html`, including current count summaries and explicit map-scope wording for the 157 repo-managed Claude pack roots.
- Updated scoped Skills Showcase planning docs and indexed alignment pages so current generated counts are not mixed with the historical seven-set prototype display-card counts.
- Replaced the lingering retired `/icp` handoff in the scoped Skills Showcase idea-brief page with `/customer-discovery` while the page was open for P2 count reconciliation.
- Validation passed: `node --check scripts/generate-skillmap-excalidraw.mjs`; `node scripts/generate-skillmap-excalidraw.mjs`; targeted stale-count scan; targeted retired-route scan; `node scripts/audit-alignment-pages.mjs`; `node scripts/upgrade-alignment-page.mjs --check`; `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts` (14/14); and `git diff --check`.
- Adversarial review found and fixed the initial stale `totalPacks` generator reference and a lingering unlabeled count phrase before final validation. Remaining dirty `skill-interview`, `ui-interview`, generated Skills Showcase data, and benchmark-matrix worktree changes are outside this `$exec` boundary and were left untouched.

---

## Current Implementation - Repo Documentation Alignment Audit

### Goal

Audit all active repository documentation for alignment and report inconsistencies, evidence, confidence, and recommended remediation.

### Execution Profile

- Parallel mode: parallel reads for inventory and evidence gathering; serial writes for audit artifacts and verification.
- Rationale: the audit touches many docs, but the final report, alignment page, index, and task notes should be updated as one coherent review artifact.

### Steps

- [x] Capture the visible `devtool-docs-audit` invocation in prompt history.
- [x] Add active task tracking to `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inventory active documentation and distinguish canonical, generated, package-included, alignment, historical, and working artifacts.
- [x] Cross-check consistency across commands, paths, terminology, versions, deck/pack counts, workflow rules, alignment conventions, and generated outputs.
- [x] Write the audit report and review alignment page, then update `alignment/index.html`.
- [x] Run validators, whitespace checks, and targeted scans.
- [x] Record review notes, commit, and push intended audit artifacts only.

### Acceptance Criteria

- [x] Findings are backed by file/path evidence and distinguish confirmed issues from assumptions or coverage gaps.
- [x] The audit covers root docs, package docs, skill docs, alignment pages, task docs, and generated docs where relevant.
- [x] The alignment page contains the full audit content, evidence matrix, confidence register, source gaps, and review gates.
- [x] Verification includes the active alignment-page audit and targeted consistency scans.

### Review Notes

- Wrote the current findings-first audit to `research/devtool-docs-audit.md`.
- Added `alignment/devtool-docs-audit-documentation-alignment.html` with required viewport metadata, QA/meta category, document visual tier, evidence matrix, confidence register, source gaps, review gates, compile controls, and TTS include.
- Updated `alignment/index.html` from 44 to 45 active pages and QA & Meta-Skill Improvement from 6 to 7 entries.
- Confirmed P1 inconsistencies: public setup docs still use symlink/re-symlink wording for active installs; `scripts/init-agentic-skills.sh` is documented but missing at the repo root; active docs and indexed alignment pages still route to retired `icp`; the old npm strategy page remains indexed as current-looking despite stale `agentic-skills` package examples.
- Confirmed P2 inconsistencies: some npm docs still use future/release-candidate wording after `skillpacks@0.1.0` publication; Skills Showcase counts still cite 157 or 156 while generated data reports 373 platform entries, 190 unique mirrored skills, 179 unique pack skills, 11 global unique skills, and 41 packs.
- Validation passed: `node scripts/audit-alignment-pages.mjs` reported 45 active pages with exact TTS, metadata, viewport, embed, and index integrity; `node scripts/upgrade-alignment-page.mjs --check` reported generated bundles exact; `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts` passed 14/14 tests; `git diff --check` passed.
- Targeted scans reconfirmed the reported drift rather than silently clearing it: retired `icp` routes remain in current docs/pages, and generated Skills Showcase data reports 373 entries / 190 unique mirrored skills / 179 unique pack skills / 11 unique global skills / 41 packs.
- Optional browser-open check returned `blocked` from `node scripts/open-html-page.mjs alignment/devtool-docs-audit-documentation-alignment.html --browser auto`; file validation remained clean.
- Shipped in commit `73c828b6` on `master`, followed by a task-state cleanup commit to mark this checklist complete after the push.

---

## Current Implementation - Skillpacks npm Package Walkthrough Alignment Page

### Goal

Create a current, confirmed document-tier alignment page for using the published `skillpacks` npm package, without changing the existing historical strategy page.

### Execution Profile

- Parallel mode: serial for file edits and validation.
- Rationale: the new page, index, and task docs share one alignment-page integrity boundary.

### Steps

- [x] Add active task tracking to `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Create `alignment/skillpacks-npm-package-walkthrough.html` with required metadata, status, TTS include, and walkthrough content.
- [x] Update `alignment/index.html` with one dated Product Design & Spec card.
- [x] Run alignment audit, focused layer1 audit test, whitespace check, and content spot checks.
- [x] Record review notes, commit, and push intended changes.

### Acceptance Criteria

- [x] The new page is indexed exactly once and passes active alignment-page audit.
- [x] The page uses `npx skillpacks` or `npx --package skillpacks@latest -- skillpacks` examples, with no stale `agentic-skills` npm examples.
- [x] Package-version wording explicitly says npm currently has `skillpacks@0.1.0` and `latest` points to `0.1.0`, without claiming multiple published versions.
- [x] Troubleshooting covers stale CLI skill registry, missing `jq` for deck installs, unsupported `install skill@version`, and pinned archive availability.

### Review Notes

- Added `alignment/skillpacks-npm-package-walkthrough.html` as a confirmed, document-tier Product Design alignment page with required viewport metadata, `data-alignment-category="product-design"`, `data-visual-tier="document"`, and the Brief Me TTS include.
- The walkthrough covers prerequisites, first-use commands, generated project files, removal/update commands, npm package semver versus skill-level pins, the published-package verification script, and troubleshooting. It links to `README.md`, `docs/QUICKSTART.md`, `docs/packs.md`, `docs/decks.md`, `docs/skillpacks-npm-distribution.md`, and `packages/skillpacks/scripts/verify-published-package.sh`.
- Updated `alignment/index.html` with one dated Product Design & Spec card, raised the active page count to 44, raised Product Design & Spec to 8, and moved the `new` marker to the walkthrough entry.
- Registry spot-check before authoring: `npm view skillpacks version versions dist-tags.latest --json --cache /tmp/skillpacks-npm-cache` returned `version: 0.1.0`, `versions: ["0.1.0"]`, and `dist-tags.latest: 0.1.0`.
- Validation passed: `node scripts/audit-alignment-pages.mjs` reported 44 active pages with exact TTS, metadata, viewport, embed, and index integrity; `pnpm --dir tests exec vitest run --project layer1 layer1/audit-alignment-pages.test.ts` passed 14/14 tests; `git diff --check` passed.
- Content spot checks passed: no stale `agentic-skills` npm command examples, no disallowed `npx skillpacks@latest` or `npx --package skillpacks@0.1.0` command examples, explicit `skillpacks@0.1.0` / `latest` status wording, unsupported `quality-sweep@v0.0` documented only as a rejected syntax, and no raw Markdown backticks left in the HTML.
- Optional browser-open check returned `blocked` from `node scripts/open-html-page.mjs alignment/skillpacks-npm-package-walkthrough.html --browser auto`; validation remained clean.

---

## Current Implementation - Published Skillpacks npm Smoke Script

### Goal

Create a repeatable package-owned test script for the published `skillpacks` npm package that compiles the manual `/tmp` `npx` checks for installs, removals, doctor, and skill pin/unpin behavior.

### Execution Profile

- Parallel mode: serial
- Rationale: the script creates and mutates isolated temp projects; individual CLI calls must run in sequence inside each project to preserve expected state.

### Steps

- [x] Add `packages/skillpacks/scripts/verify-published-package.sh` with metadata, install, removal, doctor, pin/unpin, and unsupported-version-syntax assertions.
- [x] Add npm entry points so the script can run as a package or root verification command.
- [x] Run the new script against `skillpacks@latest` from npm.
- [x] Run focused package tests and `git diff --check`.
- [x] Record review notes, commit, and push intended changes only.

### Acceptance Criteria

- [x] `skillpacks@latest` metadata matches the local package name/version and MIT license.
- [x] Published `list`, pack install, individual skill install, deck install, and `doctor` checks pass from `/tmp`.
- [x] Published `remove` clears pack, individual-skill, and deck-backed installs.
- [x] Published skill pin to `v0.0` and unpin back to latest pass, while direct `install skill@version` remains rejected.
- [x] Repo working tree contains only intended tracked changes before commit.

### Review Notes

- Added `packages/skillpacks/scripts/verify-published-package.sh`, a package-owned published npm smoke script that resolves `skillpacks@latest` through `npx --package`, uses `/tmp/skillpacks-npm-cache`, and creates isolated temp projects for install, remove, pin/update, and unsupported syntax checks.
- Added `npm --workspace skillpacks run verify:published` and root `npm run skillpacks:verify-published` entry points.
- Published-package validation passed on 2026-06-10 with `skillpacks@latest=0.1.0`, `license=MIT`, and one published package version. The script verified `list`, `install code-quality`, `install quality-sweep`, `install-deck game-afps`, `doctor`, pack removal, individual skill removal, deck-backed `game` removal, `pin quality-sweep v0.0`, `unpin quality-sweep` back to `v0.1`, rejection of `install quality-sweep@v0.0`, and rejection of `pin` without a project config.
- Final successful script run kept these temp projects for inspection: `/tmp/skillpacks-pack-install-3w1FJ4`, `/tmp/skillpacks-skill-install-EIUUqW`, `/tmp/skillpacks-deck-install-1jWFpk`, `/tmp/skillpacks-remove-pack-ZpwFZR`, `/tmp/skillpacks-remove-skill-SMDoUW`, `/tmp/skillpacks-remove-deck-nrsfzW`, `/tmp/skillpacks-pin-update-T77fjv`, and `/tmp/skillpacks-version-syntax-cxKixP`.
- Additional validation passed: `bash -n packages/skillpacks/scripts/verify-published-package.sh`, `npm --workspace skillpacks run test:node` (38/38), and `git diff --check`.

## Current Implementation - Skillpacks npm Distribution Phase 5

### Goal

Publish the first stable public `skillpacks` npm package after release validation, then verify the published package can be used from a fresh project without cloning this repository.

### Execution Profile

- Parallel mode: serial
- Rationale: release validation, npm publication, external registry verification, task docs, and ship manifest updates share one release boundary and must be sequenced.

### Context

- Source design: `docs/skillpacks-npm-distribution.md` `### Phase 5 - First Publish`.
- Phase 4 is complete: package docs, staging, tarball dry-run, and `npm publish --dry-run` all passed locally without publishing.
- Current package identity: `packages/skillpacks/package.json` should publish `skillpacks@0.1.0` with MIT license metadata and npm links back to `https://github.com/GeorgeQLe/agentic-skills`.
- Real publication is an external registry action and remains gated by explicit user confirmation before `npm publish --access public` runs.
- Existing unrelated local work: `apps/skills-showcase/next-env.d.ts`; leave it outside this release boundary.

### Steps

- [x] Step 5.1: Run release preflight: package tests, package staging, tarball inspection, registry state check, and whitespace checks.
- [x] Step 5.1b: Fix publish metadata before release: root MIT `LICENSE`, package MIT metadata, npm repository/bugs/homepage links, staged package allowlist, and package metadata coverage.
- [x] Step 5.2: Confirm the external publish boundary, including `skillpacks@0.1.0`, public access, MIT license metadata, npm links, and `packages/skillpacks/build` as the publish root.
- [x] Step 5.3: Run `npm publish --access public` from the staged package build only after explicit confirmation.
- [x] Step 5.4: Verify the published package with `npx skillpacks@latest list` and fresh temp-project installs for one pack, one individual skill, and one deck.
- [x] Step 5.5: Record release evidence in the ship manifest, update history/review notes, commit, and push intended Phase 5 changes only.

### Acceptance Criteria

- [x] `skillpacks@0.1.0` is installable from npm.
- [x] A fresh project can install packs without cloning this repository.
- [x] The git-checkout install path remains functional.
- [x] Validation output is recorded with warnings fixed, explicitly accepted, or unresolved.
- [x] Unrelated local work is not included in the shipping commit.

### Review Notes (2026-06-10)

- Step 5.1 release preflight passed for local/package checks: `npm --workspace skillpacks run test:node` passed 37/37 tests; `npm --workspace skillpacks run build:check` passed with manifest exact and staged 373 skills / 41 packs; tarball dry-run from `packages/skillpacks/` produced `skillpacks@0.1.0`, `skillpacks-0.1.0.tgz`, 2,348 entries, 5,270,913 bytes packed, 31,322,110 bytes unpacked, shasum `0c54b994a536ab81e81d15280828be83accd4299`, integrity `sha512-VAG945mrth32cVtbElFKvaG2mOKPAFUi1y/H0BwK30G6uyrQhTV23i5dH44Oaa2wuNpHD2VR79tcFVrjo4Amzg==`.
- Denied-path tarball audit found zero entries under `alignment/`, `tasks/`, `prompts/`, `apps/`, `tests/`, or `docs/history/`.
- Registry state check: `npm view skillpacks version --json --cache /tmp/skillpacks-npm-cache` returned `E404`, so `skillpacks@*` is still unpublished from this machine's registry view.
- Git-checkout path smoke passed: `scripts/pack.sh list` returned the active pack list. `git diff --check` passed.
- Publish gate is blocked: sandboxed `npm whoami --registry https://registry.npmjs.org/ --cache /tmp/skillpacks-npm-cache` first failed with `EAI_AGAIN`; escalated rerun reached the registry and returned `E401 Unauthorized`. No `npm publish`, tag, package access change, `npx` published-package verification, or temp-project install verification was run.
- Next required action: fix the npm metadata to MIT, authenticate npm for the account that should own `skillpacks`, then publish `skillpacks@0.1.0` from `packages/skillpacks/build` with public access.

### Review Notes - MIT Metadata Prepublish Fix (2026-06-10)

- Added root `LICENSE` with MIT terms, changed `packages/skillpacks/package.json` to `license: "MIT"`, and added `repository`, `bugs`, and `homepage` metadata pointing to `https://github.com/GeorgeQLe/agentic-skills`.
- Updated package staging so `packages/skillpacks/build` includes `LICENSE`, keeps the npm metadata links in staged `package.json`, and checks `LICENSE` as a required build file. Added package-owned metadata coverage in `packages/skillpacks/test/compatibility.test.mjs`.
- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json` because package metadata contributes to the manifest source fingerprint.
- Validation passed: `npm whoami --registry https://registry.npmjs.org/ --cache /tmp/skillpacks-npm-cache` returned `glexcorp`; `npm --workspace skillpacks run test:node` passed 38/38 tests; `npm --workspace skillpacks run build:check` passed with manifest exact, 373 skills, 41 packs, and package staging boundary clean.
- Tarball dry-run passed from `packages/skillpacks/`: `skillpacks@0.1.0`, `skillpacks-0.1.0.tgz`, 2,349 files, 5,272,075 bytes packed, 31,323,992 bytes unpacked, shasum `9ab8925b5f8d3dc39f1caa9c50609fb8df6df1f2`, integrity `sha512-TyZFnm9HjaV8E0yTN1EPRuh1BZDWt/Hcn316omlXvAVhLFpWkP191BaKzw/wmCjRkEm14RF2WkWJ6XSlusDKHg==`; denied-path audit found zero entries under `alignment/`, `tasks/`, `prompts/`, `apps/`, `tests/`, or `docs/history/`, and `LICENSE` was present.
- Registry state check before publish still returned expected `E404` for `npm view skillpacks version --json --cache /tmp/skillpacks-npm-cache`. `git diff --check` passed.

### Review Notes - Published Package Verification (2026-06-10)

- Registry verification passed: `npm view skillpacks version --json --cache /tmp/skillpacks-npm-cache` returned `"0.1.0"`, and `dist-tags.latest` is `0.1.0`.
- Published metadata verification passed: npm reports `license: MIT`, `repository.url: git+https://github.com/GeorgeQLe/agentic-skills.git`, `repository.directory: packages/skillpacks`, bugs URL `https://github.com/GeorgeQLe/agentic-skills/issues`, and homepage `https://github.com/GeorgeQLe/agentic-skills#readme`.
- Registry dist evidence matches the prepublish dry-run: shasum `9ab8925b5f8d3dc39f1caa9c50609fb8df6df1f2`, integrity `sha512-TyZFnm9HjaV8E0yTN1EPRuh1BZDWt/Hcn316omlXvAVhLFpWkP191BaKzw/wmCjRkEm14RF2WkWJ6XSlusDKHg==`, 2,349 files, 31,323,992 bytes unpacked.
- `npx -y --package skillpacks@latest -- skillpacks list` passed from `/tmp` and printed the active pack list.
- Fresh temp-project npm installs passed: `install code-quality` wrote `.agents/project.json` with `enabled_packs: ["code-quality"]` and installed Claude/Codex skill roots; `install quality-sweep` wrote `enabled_skills: {"quality-sweep":"code-quality"}` and installed both roots; `install-deck game-afps` wrote `enabled_packs: ["game"]` and installed 11 Codex game skills including `game-workflow` and `game-audience`.
- Published `doctor` passed in the code-quality temp project with four managed installs marked `ok`. Git-checkout smoke still passed: `scripts/pack.sh list` printed the active pack list.
- Publish execution note: an agent-run `npm publish` from `packages/skillpacks/build` reached npm but returned `EOTP`; a later user-run publish completed the release after the root-cwd npm error was diagnosed as a wrong-directory command. No evidence shows any root package was published.
- Final post-publish docs validation passed: `npm --workspace skillpacks run test:node` 38/38, `npm --workspace skillpacks run build:check`, and `git diff --check`.

---

## Current Implementation - Alignment Diff Highlighting Convention

### Goal

Clarify the alignment-page convention so updates to existing HTML alignment pages use visible diff/change highlighting in the rendered page, rather than relying only on prose that says a change happened.

### Execution Profile

- Parallel mode: serial
- Rationale: one canonical convention paragraph fans out through generated per-skill `ALIGNMENT-PAGE.md` files, and the generated output should be reviewed as one boundary.

### Context

- Canonical source: `docs/alignment-page-convention.md` between the `alignment-convention` markers.
- Generated bundles: per-skill `ALIGNMENT-PAGE.md` files rendered by `scripts/upgrade-alignment-page.mjs`.
- Current convention already has a short `Diff highlighting on updates` clause, but it does not explicitly require a rendered visual marker in the HTML.
- Existing unrelated local work: `apps/skills-showcase/next-env.d.ts`; leave it outside this change.

### Steps

- [x] Tighten the canonical `Diff highlighting on updates` clause so changed HTML content must be visually marked.
- [x] Preview and regenerate bundled `ALIGNMENT-PAGE.md` files.
- [x] Run generator checks and whitespace checks; review the generated diff.
- [x] Record review notes, then commit and push intended changes only.

### Acceptance Criteria

- [x] The convention requires visible rendered change indicators in updated alignment HTML pages.
- [x] Generated bundles are exact after regeneration.
- [x] `git diff --check` is clean.
- [x] Unrelated local work is not included in the commit.

### Review Notes (2026-06-10)

- Updated `docs/alignment-page-convention.md` inside the generated convention block: existing alignment-page updates must visibly mark changed content in the rendered HTML, using in-place badges, borders/backgrounds, `<ins>`/`<del>` markup, or side-by-side before/after comparisons as appropriate.
- Clarified that a top-level change summary alone is not enough unless the changed content is also marked where the reader reviews it, and that stale change markers should be removed or refreshed on later updates.
- Regenerated 284 generated per-skill `ALIGNMENT-PAGE.md` bundles from the canonical source. A sampled generated diff (`global/codex/idea-scope-brief/ALIGNMENT-PAGE.md`) matches the canonical paragraph with the expected skill-specific output path substitutions.
- Validation passed: `node scripts/upgrade-alignment-page.mjs --dry-run` previewed 284 writes with exact output paths, `node scripts/upgrade-alignment-page.mjs` regenerated them, `node scripts/upgrade-alignment-page.mjs --check` reported 284 ownable bundles exact, and `git diff --check` was clean.
- Targeted propagation scan found the new rendered-HTML requirement in the canonical convention and generated bundles. Existing unrelated local work in `apps/skills-showcase/next-env.d.ts` was left unstaged and outside the commit boundary.

---

## Current Implementation - Skillpacks npm Distribution Phase 4

### Goal

Prepare the `skillpacks` npm package for a dry-run release by tightening package-included documentation and verification without publishing to npm or changing the existing git-checkout setup path.

### Execution Profile

- Parallel mode: serial
- Rationale: package-included docs, package tests, task docs, and release dry-run notes share one package boundary.

### Context

- Source design: `docs/skillpacks-npm-distribution.md` `### Phase 4 - Documentation And Dry Run Release`.
- Phase 3 is complete: Node-owned project-local commands no longer require `bash` or `jq`; `list`, `recommend`, and `which` remain shell-backed; `install-deck` remains hybrid shell materialization requiring `bash` and `jq`; `init-global` remains external script-backed.
- Real `npm publish` is Phase 5 and requires explicit approval. Phase 4 may run `npm publish --dry-run` only; do not publish, tag, or change package access in this phase.
- Package-included docs are staged by `packages/skillpacks/scripts/build-package.mjs`: `README.md`, `docs/QUICKSTART.md`, `docs/packs.md`, `docs/decks.md`, and `docs/skillpacks-npm-distribution.md`.
- Unrelated local work exists in `apps/skills-showcase/next-env.d.ts` and `apps/skills-showcase/src/components/pack-opener-collapse-target.test.tsx`; leave it out of this shipping boundary unless it is proven necessary.

### Steps

- [x] Step 4.1: Update package-included docs with npm usage, git-checkout usage, migration guidance, and package-version vs skill-version pinning troubleshooting.
- [x] Step 4.2: Add or extend package-owned documentation contract tests for the Phase 4 release-readiness language.
- [x] Step 4.3: Run package staging, tarball dry-run inspection, and `npm publish --dry-run` locally without publishing.
- [x] Step 4.4: Record tarball/publish dry-run output in the ship manifest, update review notes, history, and ship intended Phase 4 changes only.

### Step 4.1 Implementation Plan

- Files expected: `README.md`, `docs/QUICKSTART.md`, `docs/packs.md`, `docs/decks.md`, `docs/skillpacks-npm-distribution.md`, `packages/skillpacks/test/compatibility.test.mjs`, `tasks/todo.md`, `tasks/roadmap.md`, `tasks/history.md`, and a ship manifest.
- Add a root README section that separates "source checkout today" from "npm CLI after publication" and shows `npx skillpacks` usage without implying that Phase 4 publishes the package.
- Update Quickstart to present both setup paths, verify with either `scripts/pack.sh status` or `npx skillpacks status`, and explain reload behavior is the same after local skill roots are written.
- Update packs/decks docs with npm CLI equivalents for pack and deck installation while preserving `scripts/pack.sh` as the checkout path.
- Add migration and troubleshooting language in `docs/skillpacks-npm-distribution.md`: package semver selects the transport snapshot, skill `version:` remains the pin target, archive availability depends on the installed package version, and `install-deck` still requires `bash`/`jq` in this release candidate.
- Add or extend a package-owned docs test only if it helps keep this release language from drifting; otherwise record why docs-only review suffices.

### Step 4.1 Verification Plan

- Run package-owned docs/compatibility tests after edits.
- Run `npm --workspace skillpacks run build:check` to ensure package-included docs stage cleanly and do not mutate website-owned assets.
- Run `npm --workspace skillpacks run pack:dry-run` for a tarball boundary smoke if the package build remains current.
- Run `git diff --check`.

### Acceptance Criteria

- [x] Package-included docs show both npm and git-checkout setup paths and do not claim a real publish happened.
- [x] Migration/troubleshooting language explains npm package semver vs skill-level version pinning.
- [x] Package docs contract tests and package staging checks pass.
- No GitHub Actions workflow is introduced.

### Review Notes (2026-06-10)

- Added Phase 4 release-readiness docs across package-included surfaces: `README.md`, `docs/QUICKSTART.md`, `docs/packs.md`, `docs/decks.md`, and `docs/skillpacks-npm-distribution.md`.
- Documentation now separates the source-checkout path available today from the npm path after first public publish; it shows `npx skillpacks` examples without claiming Phase 4 publishes the package.
- Added migration and troubleshooting language: keep `.agents/project.json`, run `npx skillpacks refresh`/`doctor`, do not commit generated local skill roots, package semver selects the transport snapshot, and skill pins continue to use skill frontmatter `version:` / `archive/<version>/SKILL.md`.
- Extended `packages/skillpacks/test/compatibility.test.mjs` with Phase 4 documentation contract tests for npm + checkout usage, migration language, package semver, skill-version pinning, and no-publish release-prep wording.
- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json` because package build validation requires the package manifest to match current package-included docs and current repo skill metadata.
- Validation passed: `npm --workspace skillpacks run test:node` (37/37), `npm --workspace skillpacks run build:check`, `npm --workspace skillpacks run pack:dry-run` (serial rerun; `skillpacks@0.1.0`, 2,348 entries, 5,220,684 bytes packed, 31,205,670 bytes unpacked), and `git diff --check`.
- Adversarial review: targeted diff review plus scans for false publish claims, missing checkout path coverage, dependency claims, no-GitHub-Actions language, and package semver / skill-version pinning. One readability issue was fixed by splitting Quickstart checkout and npm verification commands into separate blocks.
- Noted validation nuance: package staging and `npm pack` both touch `packages/skillpacks/build`, so dry-run package checks must run serially after `build:check`, not in parallel.

### Step 4.3 Implementation Plan

- Files expected: `tasks/todo.md`, `tasks/history.md`, a new or updated `tasks/ship-manifest-2026-06-10-skillpacks-phase4-docs.md`, and possibly `packages/skillpacks/dist/skillpacks-manifest.json` only if package metadata is stale again.
- Run package staging first: `npm --workspace skillpacks run build:check`.
- Run tarball inspection with the `/tmp` npm cache to avoid home-cache write failures in restricted environments: `npm_config_cache=/tmp/skillpacks-npm-cache npm pack ./build --dry-run --json --silent` from `packages/skillpacks/`.
- Parse or inspect the JSON output to record package id, filename, packed/unpacked size, entry count, and denied-path absence (`alignment/`, `tasks/`, `prompts/`, `apps/`, `tests/`, `docs/history/`).
- Run `npm publish --dry-run` against `packages/skillpacks/build` without changing package access, creating tags, or publishing. If npm auth or registry access blocks the dry-run, stop and record the exact blocker; do not run real publish.
- Run `git diff --check` and update review notes with dry-run evidence.

### Step 4.3/4.4 Review Notes (2026-06-10)

- Package staging passed: `npm --workspace skillpacks run build:check` reported `packages/skillpacks/dist/skillpacks-manifest.json` exact, staged 373 skills and 41 packs into `packages/skillpacks/build`, and passed the package staging boundary check. No package source or generated package artifacts changed.
- Tarball dry-run inspection passed from `packages/skillpacks/` with a writable tmp cache: `npm_config_cache=/tmp/skillpacks-npm-cache npm pack ./build --dry-run --json --silent`. Parsed output: `skillpacks@0.1.0`, `skillpacks-0.1.0.tgz`, 2,348 entries, 5,220,684 bytes packed, 31,205,670 bytes unpacked.
- Denied-path inspection of the tarball file list found no `alignment/`, `tasks/`, `prompts/`, `apps/`, `tests/`, or `docs/history/` entries. Package-included docs present in the tarball: `README.md`, `docs/QUICKSTART.md`, `docs/decks.md`, `docs/packs.md`, and `docs/skillpacks-npm-distribution.md`.
- Publish dry run passed from `packages/skillpacks/build`: `npm_config_cache=/tmp/skillpacks-npm-cache npm publish --dry-run --json`. npm printed `Publishing to https://registry.npmjs.org/ with tag latest and default access (dry-run)` and exited 0. Parsed output matched the tarball facts and included `shasum` `3c9748ca0b947cbd58a31e00e5e3f425e07ed076` and integrity `sha512-8rjxURX7+NKjo/BUV0BviODqq2XJusAb4oljpgqobG6ZxMJlJcfp/x0jcSKPzVX9077Lgp8CW8KnUe20v/V2vA==`.
- No intended real publish was run. During a targeted review scan, an unsafe double-quoted `rg` pattern containing a Markdown command literal accidentally command-substituted `npm publish` from the repo root; that unintended command failed with `EROFS` before publication. A follow-up read-only registry check, `npm view skillpacks version --json --cache /tmp/skillpacks-npm-cache`, returned `E404` after sandbox escalation, confirming `skillpacks@*` is still absent from the registry. No tag, package access, or external release state was changed. Phase 5 still requires explicit user approval before any real publication.
- Added a shell-safety lesson to `tasks/lessons.md`: do not put Markdown command literals with backticks inside double-quoted shell search patterns; use single quotes, escaping, or a pattern file.
- Step 4.4 is marked complete in the same `$exec` run because it is the task-doc/history/manifest/ship work required by the `$exec` shipping contract after Step 4.3 completed cleanly; no separate source implementation remains.

---

## Current Implementation - Benchmark Harness Code Review Fixes (Expert-Review High Items)

### Goal

Resolve the 3 open High items from the 2026-05-29 `/expert-review` (the `## Code Review Fixes` section below). With ALIGNMENT-PAGE Bundling Drift Plan Phase 2 complete, these are the oldest unchecked substantive items in the pipeline, and one is a destructive-command safety issue.

### Execution Profile

- Parallel mode: serial
- Rationale: three small fixes in two benchmark-harness files plus their setup caller share one test-infrastructure boundary.

### Context

- The findings are 2026-05-29 review output; line numbers have drifted but all three issues were re-verified present on 2026-06-10:
  1. **Unsafe repo deletion** — `tests/layer4/helpers/disposable-repo.ts` (`cleanupRepo`, `gh repo delete ${repoSlug} --yes` now at line ~149) runs with auto-confirm and no `repoSlug` validation; if `getGhUser()` falls back to `"unknown"` it targets `unknown/<name>`. Fix: assert `repoSlug` matches `^[\w.-]+\/agentic-skills-bench-[\w.-]+$`, refuse when the user segment is `"unknown"`, and switch to `execFileSync` (no shell interpolation). Also check `tests/layer4/setups/git-fixture-sync.setup.ts` (the caller) for the same slug assumptions.
  2. **Temp-dir leak** — `createDisposableRepo` (`mkdtempSync` at line ~70) and the sync setup's `sync-upstream-` clone create temp dirs never removed; `cleanup()` only deletes the GitHub repo. Fix: have `cleanup()` also `rmSync` the mkdtemp parent and the upstream clone dir.
  3. **Wrong resume-session ordering** — `tests/harness/bench-persistence.ts` `findResumeableSession` (line ~97) sorts session dirs (`${skill}-${agent}-${randomUUID8}`) by the random id, not time, so `--resume` can attach to an arbitrary older session and miscount cost/runs. Fix: sort by manifest `createdAt`/`updatedAt` (preferred over renaming dirs, which would break existing persisted sessions).
- These are layer4/harness files: layer4 tests hit real GitHub via `gh` and are NOT part of routine validation. Do not run live layer4 benchmarks to validate; use unit-style tests or dry assertions. Check `tests/` for existing coverage of these helpers (e.g. `runner.test.ts`, any persistence tests) and extend where natural.
- Layer1 must stay green: full `pnpm --dir tests exec vitest run --project layer1` is currently 56 files / 2202 tests / 0 failed.
- These are test-infrastructure files — no SKILL.md/PACK.md changes, so no showcase regeneration and no skill version bumps.
- After fixing, check off the three items under `## Code Review Fixes` → `### High (open)` below.

### Steps

- [x] Harden `cleanupRepo` in `tests/layer4/helpers/disposable-repo.ts`: validate `repoSlug` against the bench-repo pattern, refuse `"unknown"` user, use `execFileSync` without a shell; align `tests/layer4/setups/git-fixture-sync.setup.ts` if it shares the deletion path. (Already shipped 2026-05-30 in `f7eb21cf`; verified present 2026-06-10.)
- [x] Make `cleanup()` remove the `mkdtempSync` work dirs and the sync setup's upstream clone dir. (Already shipped 2026-05-30 in `f7eb21cf`; verified present 2026-06-10.)
- [x] Sort resumeable sessions by manifest timestamp in `tests/harness/bench-persistence.ts` instead of directory-name order. (Already shipped 2026-05-30 in `f7eb21cf` as `pickResumeableManifest`; verified present 2026-06-10.)
- [x] Add or extend focused tests for the three behaviors (no live GitHub calls); run full layer1; check off the three High items in `## Code Review Fixes`; record review notes. (Extended `tests/layer1/code-review-test-infra-fixes.test.ts` with gh-free `cleanupRepo` temp-dir reclaim tests; layer1 56 files / 2205 tests / 0 failed.)

### Review Notes — Benchmark Harness Code Review Fixes

- Finding: all three High items were already fixed on 2026-05-30 by commit `f7eb21cf` ("fix(bench-tests): guard destructive repo delete, stop temp-dir leaks, sort resume by time"), which landed `isSafeBenchRepoSlug` + `execFileSync` deletion in `tests/layer4/helpers/disposable-repo.ts`, `removeLocalDir` work-dir reclaim in `cleanupRepo` plus the inline `rmSync` of the `sync-upstream-` clone in `tests/layer4/setups/git-fixture-sync.setup.ts`, and timestamp-sorted `pickResumeableManifest` in `tests/harness/bench-persistence.ts` — with unit coverage in `tests/layer1/code-review-test-infra-fixes.test.ts`. The plan's "re-verified present on 2026-06-10" claim was wrong; only the `## Code Review Fixes` checkboxes were stale.
- This step's delta: verified each fix against the acceptance criteria in source; extended `tests/layer1/code-review-test-infra-fixes.test.ts` with a `cleanupRepo` temp-dir reclaim describe block (unsafe-slug refusal and denied-confirm paths both remove the work dir before any `gh` call; missing dir tolerated) — closing the one coverage gap (item #5 had no direct test); reconciled the three High checkboxes and these plan steps.
- Validation: focused test file 11/11 passed; full `pnpm --dir tests exec vitest run --project layer1` 56 files / 2205 tests / 0 failed (up from 2202 with the 3 new tests); no live layer4/GitHub calls made.
- No SKILL.md/PACK.md changes — no showcase regeneration, no version bumps.

### Acceptance Criteria

- `cleanupRepo` cannot delete a repo outside the `agentic-skills-bench-*` namespace and never targets an `unknown/...` slug; deletion no longer goes through a shell string.
- A completed disposable-repo lifecycle leaves no `bench-*`/`sync-upstream-*` temp dirs behind.
- `findResumeableSession` picks the most recently updated session deterministically.
- Full `pnpm --dir tests exec vitest run --project layer1` stays at 0 failed; `git diff --check` clean.

### Handoff

Ship-one-step contract: the next clear-context session must implement only this step, validate it, then run `/ship` when done.

---

## Current Implementation - Root Instructions for Direct Alignment Edits (Drift Plan Phase 2 Step 7)

### Goal

Update root alignment-page instructions so any direct edit to active `alignment/*.html` files (made without invoking a skill) is required to pass `node scripts/audit-alignment-pages.mjs` before shipping. This is ALIGNMENT-PAGE Bundling Drift Plan Phase 2 Step 7 — the final Phase 2 item. The audit itself shipped in Step 6; this step only wires the requirement into the root instruction surfaces.

### Execution Profile

- Parallel mode: serial
- Rationale: two root instruction files, an optional layer1 contract test, and the drift-plan checklist share one small documentation boundary.

### Context

- The audit (`scripts/audit-alignment-pages.mjs`, Step 6) is read-only: five checks (TTS include, `data-alignment-category`/`data-visual-tier` on `<html>`, viewport meta, embed prohibition, index integrity), named per-page diagnostics, `exact|DRIFT` summaries, exit 1 on drift, `--root` fixture support. It exits 0 on the current repo (41 active pages). Documented as the **Active-page audit** paragraph in `docs/alignment-page-convention.md`.
- Root instruction surfaces: `CLAUDE.md` `### Alignment Page Template` (under `## Shared Skill Conventions`, line ~122) and `AGENTS.md` `### Alignment Page Convention` (line ~72). Both sections are below the provisioned `workflow.md` block marker ("Provisioned artifact: ... Verification: block appears exactly once."), i.e. in the hand-maintained shared-conventions region — confirm the edit lands outside any provisioned/generated block before writing.
- Suggested wording (adapt per file's existing tone): after the existing convention pointer, add a sentence/short paragraph: direct edits to active `alignment/*.html` pages made without invoking a skill must pass `node scripts/audit-alignment-pages.mjs` (exit 0) before commit; TTS diagnostics route to `node scripts/inject-tts.mjs`, other diagnostics are manual fixes; archived pages under `docs/history/archive/` are out of scope.
- Keep both mirrors consistent in substance (CLAUDE.md and AGENTS.md phrase conventions slightly differently — match each file's surrounding style rather than byte-duplicating).
- Optional but recommended: a small layer1 contract test pinning the requirement language in both root files (e.g. extend an existing root-instruction test file or add a focused test asserting both files mention `audit-alignment-pages.mjs` in their alignment sections), so the instruction cannot silently regress. Check for an existing root-instruction contract test before creating a new file.
- Gotcha: `CLAUDE.md`/`AGENTS.md` edits change agent-facing instructions only — no SKILL.md/PACK.md changes, so no Skills Showcase regeneration and no skill version bumps apply.
- This completes Phase 2 of the drift plan; after checking off Step 7 there are no remaining Phase 2 items, so the ship that follows should note Phase 2 completion in the drift-plan section.

### Steps

- [x] Add the direct-edit audit requirement to `CLAUDE.md` `### Alignment Page Template`, outside any provisioned block.
- [x] Add the equivalent requirement to `AGENTS.md` `### Alignment Page Convention`.
- [x] Add or extend a layer1 contract test pinning the requirement language in both root files (or record why existing coverage suffices).
- [x] Check off Phase 2 Step 7 in the ALIGNMENT-PAGE Bundling Drift Plan checklist, note Phase 2 completion, and record review notes.

### Review Notes (2026-06-10)

- **CLAUDE.md:** added a **Direct-edit audit.** paragraph to `### Alignment Page Template` (between the convention pointer and **Visual rendering tiers.**, matching the section's bolded-lead paragraph style): direct edits to active `alignment/*.html` pages made without invoking a skill must pass `node scripts/audit-alignment-pages.mjs` (exit 0) before commit; TTS-include diagnostics route to `node scripts/inject-tts.mjs`, all other diagnostics are manual fixes; archived pages under `docs/history/archive/` are out of scope.
- **AGENTS.md:** added the equivalent requirement as a new bullet at the end of `### Alignment Page Convention`, matching that file's bullet style. Placement check: the section is a hand-maintained addition — its text does not appear in the `provision-agentic-config` AGENTS block (the provisioned block content ends before it per the skill's block definition), so the edit is outside provisioned content in both files. CLAUDE.md's section sits below the line-118 provisioned marker under `## Shared Skill Conventions`.
- **Contract test:** no existing root-instruction contract test covered the alignment sections, so extended `tests/layer1/audit-alignment-pages.test.ts` (the audit's own test file) with a `root instruction contract for direct alignment edits` describe block: extracts each root file's alignment section (heading to next `##`/`###`) and pins `without invoking a skill`, `node scripts/audit-alignment-pages.mjs`, `(exit 0) before commit`, `node scripts/inject-tts.mjs`, and the `docs/history/archive/` exemption in both files. File now 14 tests.
- This completes Drift Plan Phase 2 (Steps 1-7 all shipped); the drift-plan checklist below is updated and Phase 2 marked complete.
- Validation: focused vitest 14/14; full layer1 56 files / 2202 tests / 0 failed; `node scripts/audit-alignment-pages.mjs` exit 0 (41 active pages, all checks exact); `node scripts/upgrade-alignment-page.mjs --check` exit 0 (284 ownable, exact); `git diff --check` clean.

### Acceptance Criteria

- [x] Both root instruction files require `node scripts/audit-alignment-pages.mjs` for direct `alignment/*.html` edits, in their alignment sections.
- [x] `node scripts/audit-alignment-pages.mjs` and `node scripts/upgrade-alignment-page.mjs --check` still exit 0; full `pnpm --dir tests exec vitest run --project layer1` stays at 0 failed (56 files / 2202 tests).
- [x] `git diff --check` clean.

### Handoff

Ship-one-step contract: the next clear-context session must implement only this step, validate it, then run `/ship` when done. This is the last Phase 2 drift-plan item.

---

## Current Implementation - Direct Alignment HTML Edit Audit (Drift Plan Phase 2 Step 6)

### Goal

Add a scriptable audit for active `alignment/*.html` pages so direct edits made without invoking a skill can be checked against the alignment-page convention. Today the convention is only enforced when a skill or the generator runs; nothing validates a hand-edited page. This is ALIGNMENT-PAGE Bundling Drift Plan Phase 2 Step 6. Step 7 (wiring the audit into root alignment-page instructions) is a separate, queued step — do not implement it here.

### Execution Profile

- Parallel mode: serial
- Rationale: one new audit script, its layer1 tests, and a convention-doc paragraph share the Step 2-5 diagnostic/test conventions.

### Context

- Active pages live at repo-root `alignment/*.html` with the central index at `alignment/index.html`; archived pages live under `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/` and are out of scope.
- Follow the established generator diagnostic pattern from `scripts/upgrade-alignment-page.mjs` (Steps 2-4): collect named per-page diagnostics, print failing blocks to stderr, summary lines like `<Check>: N pages, exact|DRIFT`, single shared exit 1, and a `--root <path>` flag so layer1 can run fixture trees (mirror `tests/layer1/upgrade-alignment-page-bespoke.test.ts` helpers: fixture root + `runScript`).
- Scriptable convention checks to consider (decide the exact set during implementation; the audit must exit 0 on the current repo, or surfaced violations must be fixed in the same boundary): (1) Brief Me TTS include — a `<script src="...scripts/alignment-tts-kokoro.js"></script>` tag before `</body>`, not inline, not `type="module"` (`scripts/inject-tts.mjs` is the idempotent fixer); (2) `data-alignment-category` (one of `research|product-design|utility|qa-meta|ops-analysis`) and `data-visual-tier` (one of `document|visual|prototype`) on the `<html>` element; (3) `<meta name="viewport" ...>` present; (4) index integrity — `alignment/index.html` exists, links every active `alignment/*.html` page except itself, has no duplicate entries for the same path, and every entry carries a `<span class="meta">` date (`YYYY-MM-DD`, optionally `new · YYYY-MM-DD`); (5) embed prohibition — no `<object>`, `<iframe>`, or `<embed>` elements.
- Suggested shape: new `scripts/audit-alignment-pages.mjs` (read-only; no write/fix mode in this step — point diagnostics at `scripts/inject-tts.mjs` or manual fixes).
- The convention text for each rule is in `docs/alignment-page-convention.md` (TTS/Brief Me, category/tier data attributes, responsive layout, central index dated entries, embed prohibition). Document the audit there outside the generated-marker block, like the Step 3/4 paragraphs.
- Gotcha from Step 5: `tests/layer1/alignment-gates.test.ts` and `afps-alignment-preview-gates.test.ts` read bundles for convention phrases — unrelated here, but full layer1 must stay at 0 failed (currently 55 files / 2188 tests).

### Steps

- [x] Inventory current active `alignment/*.html` pages and measure each candidate check against them; pick the check set that is genuinely scriptable and either passes today or is worth fixing in this boundary.
- [x] Implement `scripts/audit-alignment-pages.mjs` with named per-page diagnostics, summary lines, shared exit 1, and `--root` fixture support.
- [x] Fix any current-page violations the audit surfaces (e.g. run `node scripts/inject-tts.mjs` for missing TTS includes) or explicitly exempt-and-document them.
- [x] Add layer1 coverage in a new `tests/layer1/audit-alignment-pages.test.ts`: repo-state run (exit 0) plus `--root` fixture tests for each diagnostic class and a clean tree.
- [x] Document the audit in `docs/alignment-page-convention.md` outside the generated-marker block; check off Phase 2 Step 6 in the drift-plan checklist and record review notes.

### Review Notes (2026-06-10)

- **Check set (all five candidates kept, all scriptable):** (1) TTS include — the `alignment-tts-kokoro.js` src tag must be present, not `type="module"`, with no inline/leftover `alignTTS` block (diagnostics route to `node scripts/inject-tts.mjs` / `--force`); (2) page metadata — `data-alignment-category` (research|product-design|utility|qa-meta|ops-analysis) and `data-visual-tier` (document|visual|prototype) on `<html>`, missing and invalid values both diagnosed; (3) viewport meta; (4) embed prohibition (`<object>`/`<iframe>`/`<embed>`); (5) index integrity — `alignment/index.html` exists, links every active page exactly once (duplicate and dangling entries diagnosed), every entry carries a `YYYY-MM-DD` date searched between the entry's anchor and its boundary (closing `</article>` for the card layout, else the next anchor, so a neighbor's date cannot mask an undated entry). `index.html` is exempt from the per-page TTS/metadata checks but held to viewport/embed rules.
- **Script shape:** `scripts/audit-alignment-pages.mjs` is read-only (no fix mode), follows the Step 2-5 pattern — named per-page diagnostics grouped per check on stderr, summary lines `TTS include|Page metadata|Viewport meta|Embed prohibition|Index integrity: N, exact|DRIFT`, single shared exit 1, `--root <path>` for fixture trees. An empty/missing alignment dir exits 0; a missing index with active pages present is drift.
- **In-boundary fixes (the audit surfaced real violations):** injected the TTS tag into `analyze-sessions-skill-gaps-manual-asks.html` via `inject-tts.mjs`; added `data-alignment-category` + `data-visual-tier="document"` to 36 pages per the convention's prefix rule (17 ops-analysis, 9 utility, 6 qa-meta, 2 research incl. `workflow-design-three-pipelines` matching its index grouping, 2 product-design — none have charts, so all document tier); added the missing `data-visual-tier` to the 2 pages that already had a category; added the 2 unindexed pages to `alignment/index.html` (`skillmap.html` product-design 2026-06-10, `devtool-docs-audit-docs-freshness.html` qa-meta 2026-06-08, dates from page-internal/git dates) and corrected the header/section counts (38→41). Attribute/index additions are minor metadata amendments, not page replacements, so no archive-first ceremony applied (the convention itself says to add missing attributes "on the next update").
- **Tests:** new `tests/layer1/audit-alignment-pages.test.ts` (13 tests) — repo-state exit-0 run with exact summaries, clean fixture tree, empty tree, and a failing fixture per diagnostic class (missing/module/inline TTS, missing+invalid category/tier, missing viewport, iframe embed, missing index, unlinked page, duplicate+dangling entries, undated entry with a dated neighbor).
- Documented the audit as an **Active-page audit** paragraph in `docs/alignment-page-convention.md` beside the Step 3/4 paragraphs, outside the generated-marker block; generator dry-run confirmed no bundle regeneration.
- Validation: `node --check scripts/audit-alignment-pages.mjs`; `node scripts/audit-alignment-pages.mjs` exit 0 (41 active pages, all five checks exact, 41 index entries); focused vitest 13/13; full layer1 56 files / 2201 tests / 0 failed; `node scripts/upgrade-alignment-page.mjs --check` exit 0 (284 ownable, exact) and `--dry-run` exit 0; `git diff --check` clean.

### Acceptance Criteria

- [x] `node scripts/audit-alignment-pages.mjs` exits 0 on the current repo with per-check summary lines.
- [x] Each diagnostic class has a failing fixture test and the repo-state test passes; full `pnpm --dir tests exec vitest run --project layer1` stays at 0 failed (56 files / 2201 tests).
- [x] `node scripts/upgrade-alignment-page.mjs --check` still exits 0; `git diff --check` clean.

### Handoff

Ship-one-step contract: the next clear-context session must implement only this step, validate it, then run `/ship` when done. Phase 2 Step 7 (require the audit/convention check in root alignment-page instructions for direct HTML edits) is queued after this step.

---

## Current Implementation - Bespoke Alignment Section Conversion/Testing (Drift Plan Phase 2 Step 5)

### Goal

Resolve the remaining hand-authored `## Alignment Page` sections: for each of the 7 allowlisted bespoke skills, either convert both mirrors to the generated stub + bundled `ALIGNMENT-PAGE.md`, or keep them bespoke with explicit layer1 contract tests that pin their required convention invariants. This is ALIGNMENT-PAGE Bundling Drift Plan Phase 2 Step 5 (the checklist item's "15 bespoke alignment sections" count is stale — current state is 7 skills / 14 mirror sections after the Step 1 `customer-discovery` conversion).

### Execution Profile

- Parallel mode: serial
- Rationale: per-skill convert/keep decisions share `scripts/alignment-bespoke-list.txt`, the generator, and the Step 2-4 test conventions in `tests/layer1/upgrade-alignment-page-bespoke.test.ts`.

### Context

- The 7 bespoke skills (from `scripts/alignment-bespoke-list.txt`): `consolidate-variations`, `prototype`, `spec-interview`, `ui-interview`, `ux-variations` (product-design pack), `uat` (product-testing), `research-roadmap` (research-admin). Each is bespoke in both claude and codex mirrors.
- None of the 7 has any `ALIGNMENT-PAGE.md` bundle today — their alignment behavior lives entirely in the SKILL.md sections. All 7 already have skill-specific gate entries in the generator's gate map (`skillSpecificGates` in `scripts/upgrade-alignment-page.mjs`), so a generated render would carry their custom gates; conversion may be near content-equivalent. Compare each bespoke section against `bundledContentFor(name, file)` output before deciding.
- Decision rule per skill: **convert** when the bespoke section's content is subsumed by the generated stub + gate-map render (replace the section body's prose with the stub paragraph in BOTH mirrors, remove the allowlist entry, run the generator in write mode to emit bundles — all in the same commit, per the allowlist policy in `docs/alignment-page-convention.md`); **keep bespoke** when the section encodes genuinely custom behavior (condensed gates, custom timing) the gate map cannot express — then add a layer1 contract test pinning its invariants (own output path, gate/approval language, both-mirror symmetry).
- Check the Step 1 `customer-discovery` conversion (commit `8c655082`) for the conversion mechanics and whether a skill version bump + archive applied (CLAUDE.md skill-versioning rules: behavioral changes bump the decimal and archive via `scripts/skill-archive.sh`; pure section-to-stub conversion that preserves behavior may not). Decide and apply consistently.
- After any conversion, the Step 4 `--check` gate and the repo-state allowlist tests auto-adapt (they re-derive bespoke classification from the repo); `node scripts/upgrade-alignment-page.mjs --check` must stay exit 0 and `Bespoke allowlist: N skills, exact` must reflect the reduced list.
- If SKILL.md behavior/metadata changes, the Skills Showcase freshness rule applies at ship time (regenerate showcase data); pure stub swaps still change tracked SKILL.md files, so expect the showcase generators to run during `/ship`.
- Boundary hygiene: a concurrent session shipped commits during the Step 4 session (see `tasks/ship-manifest-2026-06-10-generated-bundle-drift-check.md`, "Boundary anomaly"). Start by confirming `git status` is clean and `git log -3 --oneline` matches expectations before editing.

### Steps

- [x] For each of the 7 bespoke skills, diff the bespoke `## Alignment Page` section (both mirrors) against the generated render (`bundledContentFor`) and record a convert/keep verdict with rationale.
- [x] Convert the "convert" set: stub paragraph in both mirrors, allowlist entries removed, generator write-mode run emitting bundles, version/archive handling per the `customer-discovery` precedent — one commit per the allowlist same-commit policy.
- [x] For the "keep" set: add layer1 contract tests pinning each bespoke section's invariants (own `alignment/{skill-name}-{topic}.html` path, gate language, mirror symmetry) in `tests/layer1/upgrade-alignment-page-bespoke.test.ts` or a sibling test file. (Keep set is empty — all 7 converted; the one genuinely custom behavior, prototype's timing rule, is retained as hybrid bespoke prose and pinned by `afps-alignment-preview-gates.test.ts` in both mirrors.)
- [x] Run the generator (`--check`, `--dry-run`) and the full layer1 suite; update `docs/alignment-page-convention.md` only if the bespoke policy wording changes. (No policy wording change needed — allowlist mechanism unchanged, list is now empty.)
- [x] Check off Phase 2 Step 5 in the ALIGNMENT-PAGE Bundling Drift Plan section and record review notes.

### Review Notes (2026-06-10)

- **Verdict: convert all 7.** Every bespoke section (mirror-identical in each pair) was a leading timing sentence plus stale, condensed copies of convention paragraphs (page layout, alignment gates, required questions, section feedback, feedback-only YAML, gate YAML, pre-approval stop) — older snapshots missing large parts of the current convention (lifecycle states, central alignment index, dark-mode/responsive contracts, TTS/Brief Me, browser open, staged research workflow, confirmed-page contract). The skill-specific render lists and question lists are subsumed by each skill's generator gate-map entry plus the convention's no-context-loss and required-inline-questions rules; `research-roadmap`'s extra research paragraphs are near-verbatim copies of the convention's report-only/research-quality/completeness/source-coverage paragraphs plus its gate-map translation entry.
- **Hybrid for `prototype`.** Its custom timing rule ("Prototype files may be created before the alignment page… before downstream routing, UAT handoff, consolidation, spec updates, research updates, or task/roadmap changes") is genuinely custom behavior the gate map does not express; kept verbatim as bespoke prose beside the stub (journey-map hybrid precedent — generator preserves surrounding prose and still owns the bundle). Pinned in both mirrors by the updated `afps-alignment-preview-gates.test.ts`.
- **Version handling.** The precedent conversions rode along behavioral bumps (`customer-discovery` v1.0/v1.1), so for consistency and because conversion materially extends each skill's alignment contract (full convention incl. TTS, index, lifecycle; `uat` additionally gains the glossary gate via `type: analysis`), all 7 got a decimal bump + `scripts/skill-archive.sh` archive + CHANGELOG entry in both mirrors: consolidate-variations v0.10, prototype v0.11, spec-interview v0.10, ui-interview v0.12, ux-variations v0.14, uat v0.10, research-roadmap v0.16.
- **Allowlist + bundles.** All 7 entries removed from `scripts/alignment-bespoke-list.txt` (file kept with an explanatory comment, now empty); write-mode generator run emitted 14 new bundles. Repo now: `Bespoke allowlist: 0 skills, exact`, `Output paths: 284 bundles, exact`, `Generated bundles: 284 ownable, exact`.
- **Test adaptations.** `afps-alignment-preview-gates.test.ts`: the locally-gated and prototype tests now assert the stub in SKILL.md and read the gate contract (plus each skill's named skill-specific gates) from the bundled `ALIGNMENT-PAGE.md`. `alignment-gates.test.ts`: one stale assertion updated from the bespoke phrasing "recommended path" to the convention's canonical "recommended output path" (conventionText already reads bundles). Repo-state allowlist tests auto-adapted to the empty list.
- Validation: `node scripts/upgrade-alignment-page.mjs --check` exit 0; `--dry-run` exit 0 (`Updated: 0`); focused alignment vitest 53/53; full layer1 55 files / 2188 tests / 0 failed; `scripts/skill-versions.sh --missing` clean; `scripts/skill-archive-audit.sh --strict` clean; `git diff --check` clean.

### Acceptance Criteria

- [x] Every remaining allowlist entry has a recorded keep rationale and explicit test coverage; every converted skill has generated bundles in both mirrors and no allowlist entry. (Allowlist is empty; 14 bundles emitted.)
- [x] `node scripts/upgrade-alignment-page.mjs --check` exits 0 (`Bespoke allowlist: 0 skills, exact`, `Generated bundles: 284 ownable, exact`).
- [x] Full `pnpm --dir tests exec vitest run --project layer1` stays at 0 failed; `git diff --check` clean.

### Handoff

Ship-one-step contract: the next clear-context session must implement only this step, validate it, then run `/ship` when done. Phase 2 Step 6 (scriptable audit for direct `alignment/*.html` edits) is queued after this step.

---

## Current Implementation - Generated-Bundle Drift Validation (Drift Plan Phase 2 Step 4)

### Goal

Add generated-bundle drift validation to `scripts/upgrade-alignment-page.mjs` so a generator-owned (ownable) skill's on-disk `ALIGNMENT-PAGE.md` that does not byte-equal the renderer's expected output (`bundledContentFor(skillName, skillPath)`) can fail loudly, instead of only appearing as a pending `Updated`/`Bundled files written` count that exits 0. This is ALIGNMENT-PAGE Bundling Drift Plan Phase 2 Step 4.

### Execution Profile

- Parallel mode: serial
- Rationale: generator flag/diagnostics, fixture tests, and docs share `scripts/upgrade-alignment-page.mjs` and the Step 2/3 test conventions in `tests/layer1/upgrade-alignment-page-bespoke.test.ts`.

### Context

- Today, a hand-edited or stale generated bundle shows up only as `bundleChanged` (a dry-run "write …" line and nonzero `Updated`/`Bundled files written` counts) and dry-run still exits 0; write mode silently overwrites it. Nothing fails on a committed stale bundle. `tests/layer1/upgrade-alignment-pages.test.ts` covers the `upgrade-alignment-pages` *skill* contract, not a repo-state regeneration gate — no existing test asserts `Updated: 0`.
- Key design constraint: the legitimate workflow is edit `docs/alignment-page-convention.md` → `--dry-run` to preview the fan-out → write mode. Plain `--dry-run` previewing pending updates must keep exiting 0, or the preview step breaks. Recommended shape: add a `--check` flag (dry-run semantics, no writes) that exits 1 with a named diagnostic when any ownable skill's bundle differs from expected renderer output (or its SKILL.md stub needs replacing), plus a summary line mirroring Step 2/3 (e.g. `Generated bundles: N stale of M, exact|DRIFT`). The repo-state drift gate then lives in layer1 by running `--check` against the repo, exactly like the Step 3 path-consistency repo-state test.
- Step 3 (this session) added the output-path validation pass and `Output paths: N bundles, exact|DRIFT`; Step 2 added the bespoke allowlist diagnostics and `--root <path>` for fixture trees. Follow the same pattern: collect diagnostics, print a failing block to stderr, share the single exit-1 at the end.
- Fixture conventions to reuse (module-scope helpers in `tests/layer1/upgrade-alignment-page-bespoke.test.ts` after Step 3): `makeFixtureRoot`, `writeSkill`, `writeBundle`, `stubBody`, `writeAllowlist`, `runScript(root, mode)` — extend `runScript` for `--check` or add a variant.
- Variant-count reduction is NOT in scope: the 133 normalized variants observed in Phase 1 are expected under per-skill gates/tiers/glossary tokens. The gate validates each generated bundle against its own expected render; bespoke bundles (allowlisted, no expected render) are exempt from this check.
- Bundles for skip-listed or out-of-scope skills have no expected render either; decide explicitly (and document) whether `--check` ignores them or reports them — recommendation: ignore, since Step 3 already validates their path consistency and Step 6 (direct-edit audit) covers unmanaged drift.

### Steps

- [x] Add a `--check` mode (or equivalent explicit flag) to `scripts/upgrade-alignment-page.mjs`: no writes; exit 1 with a named per-skill diagnostic when an ownable skill's `ALIGNMENT-PAGE.md` differs from `bundledContentFor(...)` or its SKILL.md stub paragraph needs replacing; plain `--dry-run` behavior unchanged (preview, exit 0 on pending updates).
- [x] Add a summary line for generated-bundle drift mirroring the Step 2/3 `exact|DRIFT` pattern.
- [x] Extend layer1 coverage in `tests/layer1/upgrade-alignment-page-bespoke.test.ts`: repo-state `--check` run against the repo (exit 0), fixture tests for a hand-edited generated bundle (`--check` exit 1, named diagnostic), a missing bundle for an ownable skill (`--check` exit 1), and a clean generated tree (`--check` exit 0); confirm plain `--dry-run` still exits 0 on a stale fixture bundle.
- [x] Document `--check` and the drift gate in `docs/alignment-page-convention.md` outside the generated-marker block.
- [x] Check off Phase 2 Step 4 in the ALIGNMENT-PAGE Bundling Drift Plan section and record review notes.

### Review Notes

- Added `--check` to `scripts/upgrade-alignment-page.mjs`: no writes (shares the `noWrites` path with `--dry-run`, preview lines prefixed `[check]`), and a generated-bundle drift pass that runs after the write loop over all ownable skills. Three named per-skill diagnostics: `Stale generated bundle` (on-disk `ALIGNMENT-PAGE.md` differs from `bundledContentFor(...)`), `Missing generated bundle` (no bundle file for an ownable skill), and `Stale SKILL.md stub` (`replaceOrInsert(...)` would change the file, i.e. a pointer/old-stub paragraph needs replacing).
- Bespoke (allowlisted) skills are exempt — no expected render; mixed sibling pairs already fail via the Step 2 diagnostics, so the drift pass skips any skill with a bespoke mirror. Skip-listed and out-of-scope skills are ignored as decided in the plan: Step 3 already validates their bundles' path consistency and Step 6 (direct-edit audit) covers unmanaged drift.
- Summary line `Generated bundles: N ownable, exact|DRIFT` prints in every mode and reflects on-disk state after any writes (write mode is therefore always `exact` post-write). Only `--check` escalates drift to stderr diagnostics and exit 1; plain `--dry-run` keeps exit 0 so the edit-convention → preview → write workflow is preserved.
- Layer1 coverage added in `tests/layer1/upgrade-alignment-page-bespoke.test.ts` (6 new tests, 17 total in file): repo-state `--check` exit 0; hand-edited bundle → `--check` exit 1 with named diagnostic; missing bundle → exit 1 (both mirrors named); stale pointer paragraph → exit 1 (`Stale SKILL.md stub`); clean generated tree with an exempt bespoke pair → exit 0; stale fixture under plain `--dry-run` → exit 0 with preview line and `DRIFT` summary.
- Documented the drift check in `docs/alignment-page-convention.md` outside the generated-marker block; the dry-run after the doc edit confirmed no bundle regeneration was triggered.
- Validation: `node --check scripts/upgrade-alignment-page.mjs`; `node scripts/upgrade-alignment-page.mjs --check` exit 0 on the repo (`Generated bundles: 270 ownable, exact`); `--dry-run` unchanged (exit 0); focused vitest 17/17; full layer1 suite 0 failed; `git diff --check` clean.

### Acceptance Criteria

- `node --check scripts/upgrade-alignment-page.mjs` passes.
- `node scripts/upgrade-alignment-page.mjs --check` exits 0 on the current repo; `--dry-run` behavior is unchanged (exit 0 with pending-update preview on stale fixtures).
- Focused layer1 vitest run for the alignment-page test files passes; full `pnpm --dir tests exec vitest run --project layer1` stays at 0 failed.
- `git diff --check` clean.

### Handoff

Ship-one-step contract: the next clear-context session must implement only this step, validate it, then run `/ship` when done. Phase 2 Step 5 (convert or explicitly test the bespoke alignment sections) is queued after this step.

---

## Current Implementation - Alignment Pages Game AFPS Refresh

### Goal

Replace active alignment pages that still present the old four-pipeline/four-deck model with Game AFPS-aware pages, while preserving stable links, review gates, metadata, and TTS behavior.

### Current Phase

- [x] Inspect current active pages, index metadata, and task context.
- [x] Archive original active pages to `docs/history/archive/2026-06-10/014646/alignment/`.
- [x] Amend `alignment/workflow-design-three-pipelines.html` to the five-deck model.
- [x] Amend `alignment/idea-scope-brief-npm-distribution.html` deck-installation content and gate for Game AFPS.
- [x] Amend `alignment/idea-scope-brief-skills-showcase.html` deck-builder assumptions for five canonical decks.
- [x] Refresh `alignment/index.html` metadata for the amended active pages.
- [x] Add review notes and verify the replacement boundary.
- [x] Commit and push intended changes only.

### Verification Plan

- [x] Confirm each changed active page has an archived original under `docs/history/archive/2026-06-10/014646/alignment/`.
- [x] Confirm changed pages preserve core context, decisions, gates, assumptions, proposed file changes, and the TTS script include.
- [x] Run stale wording scans for old four-deck/four-pipeline model text across active docs/research/scripts/package metadata/alignment pages.
- [x] Run `git diff --check`.

### Review Notes

- Archived the three stale active pages before replacement at `docs/history/archive/2026-06-10/014646/alignment/`.
- Updated the workflow-design active page from the obsolete matrix framing to the five-deck model: VARD, ORD, Business AFPS, Devtool AFPS, and Game AFPS. The page preserves the original VARD/ORD/devtool COAs, gates, assumptions, and TTS include while adding a Game AFPS deck section and amendment note.
- Updated the npm-distribution active page's deck-installation section and approval gate so monolith presets, package-list examples, and registry-tag examples all include `game-afps`.
- Updated the Skills Showcase active page's deck-builder assumptions from the old deck count to five canonical decks and added Game AFPS to the visible deck cards.
- Refreshed `alignment/index.html` so the workflow page appears as "Five-Deck Workflow Model" and the amended Skills Showcase page is linked from Product Design.
- Verification passed: archive hashes match the original tracked files; changed-page content checks found required titles/context, Game AFPS content, gates, proposed file changes where present, alignmentPage constants, and TTS includes; exact stale wording scan passed for the requested old deck-model phrases; `git diff --check` passed.

---

## Current Implementation - Alignment Bundle Path-Consistency Validation (Drift Plan Phase 2 Step 3)

### Goal

Add path-consistency validation to `scripts/upgrade-alignment-page.mjs` so every generated `ALIGNMENT-PAGE.md` bundle references only its owning skill's output path `alignment/{skill-name}-{topic}.html`, with failing diagnostics in both dry-run and write mode. This is ALIGNMENT-PAGE Bundling Drift Plan Phase 2 Step 3 (see that section's Phase 2 checklist below).

### Execution Profile

- Parallel mode: serial
- Rationale: generator changes, diagnostics, fixture tests, and docs share `scripts/upgrade-alignment-page.mjs` and the Step 2 test/allowlist conventions.

### Context

- The renderer substitutes `{skill-name}` into the bundled convention body (`scripts/upgrade-alignment-page.mjs` line ~74 `.replaceAll("{skill-name}", skillName)`) and into the SKILL.md stub Output line (`alignment/${skillName}-{topic}.html`). A generated bundle whose body mentions a different skill's `alignment/<other>-{topic}.html` path indicates a stale, hand-edited, or mis-rendered bundle.
- Step 2 (shipped `120c731c`) established the diagnostic pattern to follow: collect violations, print failing diagnostics, exit 1 in both dry-run and write mode, and a summary line; plus `--root <path>` so layer1 tests can run the script against fixture trees.
- Existing tests to extend, not duplicate: `tests/layer1/upgrade-alignment-page-bespoke.test.ts` (behavioral fixture tests via `--root`) and `tests/layer1/upgrade-alignment-pages.test.ts`. Bespoke-allowlisted skills (7, in `scripts/alignment-bespoke-list.txt`) own bespoke `ALIGNMENT-PAGE.md` files — decide explicitly whether path validation applies to bespoke bundles too (they still name their own skill's output path) or only generator-owned bundles; default recommendation: validate every active `ALIGNMENT-PAGE.md`'s `alignment/...-{topic}.html` references against the owning skill directory name, bespoke included, since the path contract is universal.
- Known benign variation to handle: pages also reference archive paths like `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/{skill-name}-{topic}.html` — the validation should check the `{skill-name}` segment of `alignment/<name>-{topic}.html` occurrences (including inside archive paths), not require a fixed prefix.
- Validation must compare against the skill directory name (the `name:` in SKILL.md frontmatter equals the directory name for active skills).

### Steps

- [x] Add path-consistency validation to `scripts/upgrade-alignment-page.mjs`: scan each active `ALIGNMENT-PAGE.md` for `alignment/<name>-{topic}.html` occurrences and fail (exit 1, named diagnostic) when `<name>` does not match the owning skill, in dry-run and write mode.
- [x] Add a summary line reporting path-consistency status (mirroring the `Bespoke allowlist: N skills, exact|DRIFT` pattern).
- [x] Extend layer1 coverage: repo-state assertion (all active bundles consistent) plus `--root` fixture tests for a mismatched bundle (exit 1) and a clean tree (exit 0); decide placement in `upgrade-alignment-page-bespoke.test.ts` or a sibling test file.
- [x] Document the validation in `docs/alignment-page-convention.md` outside the generated-marker block.
- [x] Check off Phase 2 Step 3 in the ALIGNMENT-PAGE Bundling Drift Plan section and record review notes.

### Acceptance Criteria

- [x] `node --check scripts/upgrade-alignment-page.mjs` passes.
- [x] `node scripts/upgrade-alignment-page.mjs --dry-run` exits 0 on the current repo (or surfaced violations are fixed/explained in the same boundary).
- [x] Focused layer1 vitest run for the alignment-page test files passes; full `pnpm --dir tests exec vitest run --project layer1` stays at 0 failed.
- [x] `git diff --check` clean.

### Review Notes (2026-06-10)

- Added an output-path validation pass to `scripts/upgrade-alignment-page.mjs` that runs after the write loop (so write mode validates final on-disk state): every `ALIGNMENT-PAGE.md` beside an active claude/codex `SKILL.md` is scanned for `alignment/<name>-{topic}.html` occurrences, and any `<name>` not equal to the owning skill directory name produces a `Foreign output path in <bundle>` diagnostic and exit 1 in both dry-run and write mode. Bespoke and skip-listed skills' bundles are validated too — the path contract is universal, per the plan's default recommendation. Archive-path references match the same trailing segment, so no fixed prefix is required.
- Summary output gained an `Output paths: N bundles, exact|DRIFT` line mirroring the Step 2 `Bespoke allowlist` pattern; both diagnostic blocks now print before a single shared exit-1.
- Extended `tests/layer1/upgrade-alignment-page-bespoke.test.ts` (no sibling file needed): hoisted the Step 2 fixture helpers to module scope, added a repo-state assertion (every active bundle references only its own output path, 270 bundles), and three `--root` fixture tests — foreign-path bundle in dry-run → exit 1 with named diagnostic and `DRIFT` summary; bespoke allowlisted bundle with a foreign path in write mode → exit 1 (write mode cannot regenerate bespoke bundles, so the diagnostic is the only guard); clean tree → write mode exit 0 (`Output paths: 2 bundles, exact`, validating self-written bundles) then dry-run exit 0. The fixture convention body now carries an `Output: alignment/{skill-name}-{topic}.html` line so generated fixture bundles exercise the check.
- Documented the rule as an **Output path consistency** paragraph in `docs/alignment-page-convention.md`, beside the bespoke-allowlist paragraph and outside the generated-marker block; no bundle regeneration triggered.
- Validation passed: `node --check scripts/upgrade-alignment-page.mjs`; `node scripts/upgrade-alignment-page.mjs --dry-run` exit 0 (`Output paths: 270 bundles, exact`); focused alignment-page vitest run (17 tests across both files); full layer1 suite 0 failed; `git diff --check` clean.

### Handoff

Ship-one-step contract: the next clear-context session must implement only this step, validate it, then run `/ship` when done. Phase 2 Step 4 (generated-bundle variant/drift validation against expected renderer output) is queued after this step.

---

## Current Implementation - Layer1 Contract Test Reconciliation

### Goal

Reconcile the 18 pre-existing failing layer1 contract tests (11 files) against current repo reality so the full layer1 suite passes again. Surfaced by the 2026-06-10 alignment-bespoke-allowlist ship; all 18 reproduce at clean HEAD `ea2e3291` (verified via stash comparison), so they pre-date that boundary.

### Execution Profile

- Parallel mode: serial
- Rationale: per-test verdicts about stale pins vs regressed skill contracts share the same skill files and the versioning/archive/changelog convention.

### Context

- Reproduce with: `pnpm --dir tests exec vitest run --project layer1` → 18 failed / 2147 passed.
- Failing files (all under `tests/layer1/`): `afps-alignment-preview-gates` (1), `benchmark-results-matrix` (1), `compile-central-alignment` (1), `marketplace-side-handoff` (3), `pack-reload-contract` (1), `pack-shipping-boundary` (1), `pack-skill-mirror-parity` (1), `product-path-manifest` (5), `prompt-history-backfill` (2), `skill-reload-language` (1), `skills-showcase-benchmark-demo` (1).
- Two failure classes observed:
  1. **Stale version pins** — tests assert exact old `version:` values: `pack` pinned v0.4 vs current v0.6, `uat-guide` v0.2 vs v0.3, `prompt-history-backfill` v0.0 vs v0.1, `compile-central-alignment` v0.1 vs current, `targeted-skill-builder` v0.2 vs current. Mechanical fix: update the pin, or relax to `/^version: v0\.\d+$/m` where the exact pin adds no contract value (`upgrade-alignment-pages.test.ts` already uses the relaxed pattern).
  2. **Content assertions** — e.g. `idea-scope-brief` missing 'hypotheses, not validated ICPs'; `feature-pricing-matrix` missing product-path manifest scope language; `prompt-history-backfill` missing the `--apply` path-constraint sentence; `benchmark-results-matrix` expecting a `Generated by scripts/generate-skills…` header (generators moved to `apps/skills-showcase/scripts/` in the workspace split, so that test is likely stale); `skills-showcase-benchmark-demo` hitting an undefined data shape. Each needs a verdict: stale test (update the assertion) vs regressed skill contract (restore the language to the skill with archive + version bump + changelog per CLAUDE.md Skill Versioning).
- Decision rule: git-blame the assertion and the corresponding skill text. If the skill text changed in a deliberately shipped session (review notes in `tasks/todo.md`/`tasks/history.md` reference the change), the test is stale — update it. If the language vanished in a refactor or regeneration with no review-note trail, treat it as a regressed contract — restore it in the skill.
- Skill edits (if any) trigger the versioning convention: archive via `scripts/skill-archive.sh <skill-dir>`, bump the decimal, update the skill `CHANGELOG.md`, mirror claude/codex, and refresh Skills Showcase generated data (`apps/skills-showcase/scripts/` generators + validator).

### Steps

- [x] Categorize each of the 18 failures as stale-pin, stale-assertion, or regressed-skill using git history and session review notes.
- [x] Fix stale version pins (prefer the relaxed `v0\.\d+` pattern where exactness adds no contract value).
- [x] Update stale wording/path assertions to current repo reality (e.g. `apps/skills-showcase/scripts/` generator paths).
- [x] Restore any genuinely regressed skill contract language with archive + version bump + changelog, mirrored in both tools. (Not needed — zero regressed contracts found.)
- [x] Run the full layer1 suite to zero failures and record per-test verdicts in review notes.

### Acceptance Criteria

- [x] `pnpm --dir tests exec vitest run --project layer1` → 0 failed (54 files, 2166 tests; one new sub-skill contract test added).
- [x] Any skill edits pass `scripts/skill-versions.sh --missing` and `scripts/skill-archive-audit.sh --strict`; Skills Showcase data revalidated if SKILL.md files changed. (No skill files edited, so these were not required.)
- [x] `git diff --check` clean.

### Review Notes (2026-06-10)

All 18 failures were stale tests; none were regressed skill contracts, so no skill edits, archives, version bumps, or Skills Showcase data refreshes were needed. Boundary: the 11 `tests/layer1/*.test.ts` files only. Per-test verdicts:

- **Stale version pins (relaxed to version-format/bumped-version patterns):** `pack-reload-contract` and `pack-shipping-boundary` pinned `pack` v0.4 (now v0.6 via deliberate changelog'd bumps); `pack-skill-mirror-parity` pinned `uat-guide` v0.2 (now v0.3 with archives v0.0–v0.2) — rewritten to assert both mirrors share one well-formed version instead of exact pins; `skill-reload-language` pinned `targeted-skill-builder` v0.2 (now v0.3); `prompt-history-backfill` pinned v0.0 (now v0.1, deliberate 2026-06-04 legacy-routing changelog) and its `--apply` path-constraint assertions updated to the current legacy-aware sentences; `compile-central-alignment` pinned v0.1 (now v0.2, deliberate 2026-06-06 category-grouping changelog) — v0.0 archive and v0.1 changelog assertions kept.
- **Stale paths from the `icp` → `customer-discovery` rename (`ed1eba82`/`ebfc6438`, deliberate v1.0 orchestrator rewrite with archives + changelogs):** `afps-alignment-preview-gates`, `marketplace-side-handoff` (3 tests), and `product-path-manifest` ENOENT'd on `packs/business-discovery/*/icp/SKILL.md` — repointed to `customer-discovery` paths and `/customer-discovery`/`$customer-discovery` commands. The "hypotheses, not validated ICPs" wording became "hypotheses, not validated customer segments" in the same ship.
- **Stale gate content from the 2026-06-09 scope-first approval rewrite (`8c655082`):** `afps-alignment-preview-gates` report-first assertions updated from the old preview-page gate ("build and attempt to open the alignment preview page first", "evidence coverage", "proposed file changes") to the current scope-first contract ("Default to scope-first approval", "final compiled YAML approves the research scope", "Stage 1 - Scope discovery and approval", "proposed canonical file changes"), verified present in all 8 mirrored skills.
- **Stale mirror byte-equality:** the customer-discovery Codex mirror is a deliberately condensed orchestrator (v1.0 rewrite), so `marketplace-side-handoff` no longer asserts byte-equal preflight sections; it asserts the shared preflight core phrases in both mirrors plus byte-equality for the still-identical idea-scope-brief handoff section.
- **Stale sweep contract vs the sub-skill pattern (`c691484b` orchestrator refactor):** `product-path-manifest` sweeps now exclude `invocation: sub-skill` framework files (competitive-analysis/customer-discovery/journey-map frameworks defer full scope resolution to their orchestrator parent) and a new test asserts every research sub-skill still carries a `Product-Path Scope Resolution` section. The monorepo-secondary assertion uses the common "Detect monorepo/app/package structure only as a secondary hint" phrasing (the Codex orchestrator condensed the longer clause). The schema-fields contract dropped customer-discovery (the orchestrator no longer enumerates the full manifest schema; the contract lives in the remaining pairs), and the flat-to-product-path icp migration test was rewritten to the current output contract (`research/{slug}/icp.md`, `research/icp.md`, `research/icp-search-log.md`, `research/.progress.yaml`). The git-branch disambiguation heuristic now exempts the screen-flow phrase "screen flow, decisions, branches, states" from the deliberate user-flow-map routing language in `ux-variations`.
- **Stale generator path:** `benchmark-results-matrix` expected `Generated by `scripts/generate-skills-showcase-data.mjs``; the workspace split moved the generator to `apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`.
- **Stale demo example:** `skills-showcase-benchmark-demo` pinned the `pack` Codex demo, but benchmark run dirs are gitignored/machine-local and the `pack-codex-*` runs no longer exist locally, so regenerated committed showcase data has no pack demo. Repointed to the `skills` Codex demo, which exists in committed data and has local run artifacts.

Validation: full layer1 run 54 files / 2166 tests / 0 failed; `git diff --check` clean. An untracked `prompts/analyze-sessions/` file from a concurrent session was left outside this boundary.

### Handoff

Ship-one-step contract: the next clear-context session must implement only this step, validate it, then run `/ship` when done. The ALIGNMENT-PAGE Bundling Drift Plan Phase 2 Step 3 (path-consistency validation for `alignment/{skill-name}-{topic}.html` inside generated bundles) is queued immediately after this reconciliation.

---

## Current Implementation - Game AFPS Deck Model

### Goal

Add `game-afps` as a first-class deliberate deck backed by the existing `game` pack.

### Current Phase

- [x] Update `docs/decks.md`, `docs/skillpacks-npm-distribution.md`, and live Skills Showcase research references.
- [x] Add `game-afps` to the skillpacks manifest generator and cover it with a package test.
- [x] Split the skill-map generator so `game` appears under Game AFPS instead of Business AFPS.
- [x] Regenerate package manifest/build and skill-map artifacts.
- [x] Run verification and record review notes.

### Verification Plan

- [x] `npm --workspace skillpacks run test:node`
- [x] `npm --workspace skillpacks run build:check`
- [x] `node scripts/generate-skillmap-excalidraw.mjs`
- [x] `npm --workspace skillpacks run pack:dry-run`
- [x] Temp-project smoke: `skillpacks install-deck game-afps` then `skillpacks list-packs`
- [x] Stale deck-model scan for old four-deck wording
- [x] `git diff --check`

### Review Notes

- Added `game-afps` as a deliberate game deck backed by the existing `game` pack.
- Updated package-included docs and current Skills Showcase research references from four canonical decks to five.
- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json`; all `game` pack skills now carry `deck_memberships: ["game-afps"]`.
- Regenerated `docs/skillmap.excalidraw` and `alignment/skillmap.html`; `game` now appears under its own Game AFPS row instead of Business AFPS.
- Added `packages/skillpacks/test/manifest.test.mjs` to assert Game AFPS deck metadata and membership.
- Validation passed: package node tests, manifest/build check, tarball dry-run, temp `install-deck game-afps` smoke, stale wording scan, and whitespace check.

---

## Current Implementation - Skillpacks npm Distribution Phase 3

### Goal

Start the Phase 3 Node Port Parity work by moving deterministic `.agents/project.json` reads and simple writes into the package-owned Node CLI while preserving `scripts/pack.sh` as the fallback for install/link/drift operations.

### Execution Profile

- Parallel mode: serial
- Rationale: CLI routing, project config writes, tests, package staging, and task docs share one package boundary and should be integrated in one lane.

### Step 3.1: Node Project Config Parity

- [x] Add a package-owned Node project-config helper for reading, validating, writing, and formatting `.agents/project.json`.
- [x] Route `skillpacks list-packs`, `skillpacks status`, `skillpacks set-mode`, and `skillpacks set-update-mode` through Node without requiring `bash` or `jq`.
- [x] Preserve existing project config fields when Node writes `agent_mode` or `skill_updates.mode`.
- [x] Keep install/remove/refresh/pin/unpin/prune/doctor on the existing `pack.sh` compatibility path for this step.
- [x] Add package-owned executable tests proving the Node-owned commands work without `bash` or `jq` on `PATH`.

### Verification

- [x] Run Node syntax checks for changed package CLI files.
- [x] Run the package-owned Node tests.
- [x] Run a focused existing `pack.sh` install regression to prove compatibility path behavior is unchanged.
- [x] Run package build/check and npm dry-run boundary checks.
- [x] Run `git diff --check`.

### Review Notes

- Added `packages/skillpacks/src/cli/project-config.mjs` with JSON parsing, atomic writes, Node-owned lock handling for the newly ported write commands, project-type inference for new `set-mode` files, and status/list output parity for simple project-config reads.
- Routed `list-packs`, `status`, `set-mode`, and `set-update-mode` through Node before the bash dependency check. Install/remove/refresh/pin/unpin/prune/doctor and `install-deck` still use the tested `pack.sh` backend.
- Added package-owned Node tests that temporarily empty `PATH` and prove the Node-owned commands do not require `bash` or `jq`. The tests cover enabled-pack listing, status output, agent-mode writes, new-file `set-mode`, `skill_updates.mode` writes, field preservation, and lock cleanup.
- Validation caught an existing package dry-run bug: `npm pack build` resolved the registry package named `build`. Updated package scripts to use `npm pack ./build`, then verified the dry-run package is `skillpacks@0.1.0`.
- Regenerated `packages/skillpacks/dist/skillpacks-manifest.json` because `build:check` required the manifest to match current package metadata and current repo skill metadata.
- Validation passed: `node --check packages/skillpacks/src/cli/project-config.mjs`; `node --check packages/skillpacks/src/cli/run-pack-script.mjs`; `node --check packages/skillpacks/test/project-config.test.mjs`; `npm --workspace skillpacks run test:node` (6 tests); `pnpm --dir tests exec vitest run --project layer1 layer1/install.test.ts` (5 tests); `node packages/skillpacks/bin/skillpacks.mjs list`; `npm --workspace skillpacks run build:check`; `npm_config_cache=/tmp/skillpacks-npm-cache npm pack packages/skillpacks/build --dry-run --json --silent` plus parsed boundary assertion; and `git diff --check`.
- Unrelated local modifications in `scripts/alignment-tts-kokoro.js` and `tests/layer1/alignment-tts-kokoro.test.ts` were left outside this ship boundary.

### Step 3.2: Pack Normalization And Alias Parity

- [x] Port pack alias normalization from `scripts/pack.sh` into package-owned Node code.
- [x] Include hibernated PoketoWork kanban pack and skill diagnostics with the same user-facing safety language.
- [x] Add CLI resolution coverage for direct pack names, aliases, comma-separated arguments, `pack:` prefixes, empty `pack`/`packs` tokens, unknown names, and hibernated aliases.
- [x] Keep lifecycle mutations on `pack.sh` after Node resolves and validates names unless the install/remove port is explicitly in scope for the next step.
- [x] Compare representative Node and `pack.sh` resolution behavior before changing install/remove execution.

#### Step 3.2 Verification Plan

- [x] Run Node syntax checks for changed package CLI files.
- [x] Run package-owned normalization tests.
- [x] Run representative `skillpacks install`/unknown-name smoke checks against temp projects if CLI routing changes.
- [x] Run `npm --workspace skillpacks run build:check`.
- [x] Run npm dry-run package boundary assertion with `/tmp/skillpacks-npm-cache`.
- [x] Run `git diff --check`.

#### Step 3.2 Review Notes

- Added `packages/skillpacks/src/cli/pack-normalization.mjs` with the `pack.sh` pack alias table, command-token splitting, active pack/skill lookup from the packaged manifest, enabled-skill lookup for `remove`, and PoketoWork kanban hibernation diagnostics.
- Routed `skillpacks install` and `skillpacks remove` through Node normalization before requiring `bash`/`jq`, then continued to execute lifecycle mutations through `scripts/pack.sh` with canonical pack/skill arguments.
- Preserved the command-specific hibernation behavior: `install` blocks hibernated pack/skill names with safety language, while `remove` resolves hibernated names for stale project cleanup.
- Added package-owned Node tests covering direct names, aliases, comma-separated arguments, `pack:` prefixes, empty `pack`/`packs` tokens, active skill fallback, unknown names, hibernated pack aliases, hibernated skill aliases, and early CLI diagnostics without `bash`/`jq` on `PATH`.
- Baseline and smoke behavior matched the representative `pack.sh` cases checked before the route change: `business` expands to the four business packs; `pack:code-quality,docs` installs `code-quality` and `docs-health`; unknown names report available packs; hibernated aliases report the PoketoWork rebuild safety language; and normalized `remove quality` cleaned up `code-quality` while preserving `docs-health`.
- Validation passed: `node --check packages/skillpacks/src/cli/pack-normalization.mjs`; `node --check packages/skillpacks/src/cli/run-pack-script.mjs`; `node --check packages/skillpacks/test/pack-normalization.test.mjs`; `npm --workspace skillpacks run test:node` (18 tests); temp-project CLI smokes for `install pack:code-quality,docs`, `install business`, unknown install, hibernated install, `remove quality`, and project-config inspection; `npm --workspace skillpacks run build:check`; `npm_config_cache=/tmp/skillpacks-npm-cache npm pack packages/skillpacks/build --dry-run --json --silent` plus parsed boundary assertion; and `git diff --check`.
- Adversarial review checked command ordering, manifest dependence, hibernated cleanup parity, unknown-name output, token splitting, skill-vs-pack fallback order, and install/remove mutation boundaries. No source changes were needed after review.

### Step 3.3: Install/Remove/Refresh Parity

- [x] Port package-owned Node install logic for active packs while preserving `.claude/skills`, `.codex/skills`, `.agentic-skills-managed`, and content hash behavior from `scripts/pack.sh`.
- [x] Port package-owned Node install logic for individual skills, including active skill lookup, pinned-version source selection, and `enabled_skills` project-config updates.
- [x] Port package-owned Node remove logic for active packs, hibernated stale pack cleanup, and individual skills without removing unmanaged local skill directories.
- [x] Port package-owned Node refresh logic from `.agents/project.json`, including enabled packs and individually enabled skills.
- [x] Keep `pin`, `unpin`, `prune`, `doctor`, and any unresolved drift/lock commands on `pack.sh` unless this step's implementation proves the required helper can be safely shared.
- [x] Preserve `pack.sh` as a fallback or comparison oracle while implementing Node parity; do not remove the backend in this step.

#### Step 3.3 Implementation Plan

- Files expected: modify `packages/skillpacks/src/cli/run-pack-script.mjs`; add or modify package-owned install/link helpers under `packages/skillpacks/src/cli/`; add package-owned tests under `packages/skillpacks/test/`; update `tasks/todo.md`, `tasks/roadmap.md`, `tasks/history.md`, and a ship manifest.
- Start by reading `scripts/pack.sh` helpers for `sync_skill_install`, managed marker files, content hashing, pinned archive resolution, `install_pack`, `install_single_skill`, `remove_pack`, `remove_single_skill`, and `refresh`.
- Build the Node helper around structured filesystem operations and the existing project-config helper rather than shelling out from helper internals.
- Compare Node behavior against `pack.sh` in temp projects for one pack install, one individual skill install, one pack remove, one individual skill remove, one hibernated stale remove, and refresh from a project config before switching the CLI route.
- Route only the commands implemented by this step through Node; keep unported lifecycle/drift commands on `pack.sh`.

#### Step 3.3 Verification Plan

- [x] Run Node syntax checks for changed package CLI files.
- [x] Run package-owned Node tests.
- [x] Run temp-project parity checks comparing Node and `pack.sh` behavior for install/remove/refresh surfaces.
- [x] Run a focused existing `pack.sh` install/remove regression if fallback behavior remains in the command path.
- [x] Run `npm --workspace skillpacks run build:check`.
- [x] Run npm dry-run package boundary assertion with `/tmp/skillpacks-npm-cache`.
- [x] Run `git diff --check`.

#### Step 3.3 Review Notes

- Added `packages/skillpacks/src/cli/lifecycle.mjs` with package-owned Node install/remove/refresh operations for active packs and individual skills. It resolves sources from the packaged manifest, works from both source checkout and staged package roots, copies latest skills into `.claude/skills` and `.codex/skills`, symlinks pinned archive versions, writes `.agentic-skills-managed`, and preserves the `scripts/skill-links.sh` content-hash contract.
- Routed `skillpacks install`, `remove`, and `refresh` through Node after the existing normalization step. `pin`, `unpin`, `prune`, `doctor`, `recommend`, `which`, and `install-deck` remain on the `pack.sh` compatibility path.
- Reused the existing Node project lock/write helpers from `project-config.mjs`; install/remove/refresh now run without requiring `bash` or `jq`, while unported commands still enforce their existing dependencies.
- Added package-owned lifecycle tests with `PATH` emptied. Coverage includes active pack install, individual pinned skill install, unmanaged local directory preservation on remove, individual skill removal, hibernated stale pack cleanup, refresh from `.agents/project.json`, and hibernated refresh diagnostics.
- Temp-project parity checks passed for six Node-vs-`pack.sh` surfaces: pack install, individual pinned install, pack remove, individual remove, hibernated stale remove, and refresh. The comparison verifies parsed project config, installed file trees, symlinks, and marker hashes.
- Adversarial review used changed-file self-review plus direct oracle parity against `pack.sh`, which is the targeted quality-sweep equivalent for this command-porting step. It found and fixed two issues before shipping: Node content hashing initially sorted paths with locale-sensitive ordering instead of the `LC_ALL=C sort` behavior from `skill-links.sh`; and `refresh` with a hibernated enabled pack initially had weaker diagnostics than `pack.sh`.
- Validation passed: `node --check` for `lifecycle.mjs`, `run-pack-script.mjs`, `project-config.mjs`, `pack-normalization.mjs`, and `lifecycle.test.mjs`; `npm --workspace skillpacks run test:node` (25 tests); temp-project parity checks for the six install/remove/refresh surfaces; direct `pack.sh` install/remove coverage inside those parity checks; `npm --workspace skillpacks run build:check`; streaming npm dry-run boundary assertion with `/tmp/skillpacks-npm-cache` (2315 files, denied repo paths absent); and `git diff --check`.
- The first npm dry-run parser attempt used a wrapper that could not handle the large npm JSON payload; validation was rerun through a streaming pipe and passed. No source change was needed for that harness issue.

### Step 3.4: Locking And Drift Parity

- [x] Confirm the Node project lock behavior now used by install/remove/refresh covers stale lock cleanup, lock release on errors, and command labeling for lifecycle mutations.
- [x] Port `skillpacks doctor` drift reporting to Node using the managed marker `source`, `source_version`, `source_sha`, pinned symlink behavior, and missing-source states from `scripts/skill-links.sh`.
- [x] Port `skillpacks pin` and `skillpacks unpin` to Node, preserving archive-version validation, `pinned_versions` project-config updates, relinking behavior, and existing error messages where practical.
- [x] Port `skillpacks prune` to Node, preserving `--dry-run`, orphan detection, unmanaged-directory safety, enabled-pack and individually enabled-skill awareness, and project-config cleanup behavior.
- [x] Keep `pack.sh` as the comparison oracle and fallback for any unported or ambiguous drift/lock behavior during this step.

#### Step 3.4 Implementation Plan

- Files expected: modify `packages/skillpacks/src/cli/lifecycle.mjs`, `packages/skillpacks/src/cli/run-pack-script.mjs`, and package-owned tests under `packages/skillpacks/test/`; update task docs, history, and a ship manifest.
- Start by reading `scripts/pack.sh` sections for `doctor`, `prune`, `pin_skill`, `unpin_skill`, and `skill_install_status` in `scripts/skill-links.sh`. Reuse the Node content-hash and managed-install helpers from Step 3.3 rather than duplicating behavior.
- Add tests with `PATH` emptied for Node-owned `doctor`, `pin`, `unpin`, and `prune`, plus temp-project parity checks against direct `pack.sh` for ok/stale/unknown/missing-source/pinned states and prune dry-run vs mutation paths.
- Keep `recommend`, `which`, `install-deck`, and any behavior not explicitly ported in Step 3.4 on the existing compatibility path.

#### Step 3.4 Verification Plan

- [x] Run Node syntax checks for changed package CLI files.
- [x] Run package-owned Node tests.
- [x] Run temp-project parity checks comparing Node and `pack.sh` behavior for doctor, pin, unpin, and prune surfaces.
- [x] Run `npm --workspace skillpacks run build:check`.
- [x] Run npm dry-run package boundary assertion with `/tmp/skillpacks-npm-cache`.
- [x] Run `git diff --check`.

#### Step 3.4 Review Notes

- Added Node-owned drift reporting, pin, unpin, and prune logic to `packages/skillpacks/src/cli/lifecycle.mjs`, reusing the Step 3.3 managed-install helpers for content hashes, archive symlinks, marker ownership, and unmanaged-directory safety.
- Routed `skillpacks doctor`, `pin`, `unpin`, and `prune` through Node in `run-pack-script.mjs`; `recommend`, `which`, and `install-deck` remain on the `pack.sh` compatibility path.
- Preserved shell-visible behavior for drift states: `ok`, `STALE`, `unknown`, `missing`, and `pinned`, including `doctor` returning non-zero only for stale installs and printing the existing `scripts/pack.sh refresh` fix hint.
- Added package-owned tests that run with `PATH` emptied for stale lock cleanup, lock command labels, lock release on errors, doctor drift states, pin/unpin config preservation and relinking, prune dry-run/mutation behavior, unmanaged directory safety, and pack.sh-compatible ignored extra args for `doctor`/`pin`/`unpin`.
- Temp-project oracle parity passed for direct Node CLI vs direct `scripts/pack.sh` on `doctor`, `pin`, `unpin`, `prune --dry-run`, and `prune`, including JSON config comparison and normalized doctor drift output.
- Adversarial review found one compatibility drift: the first Node route rejected extra args for `doctor`, `pin`, and `unpin` while `pack.sh` ignored them. The route was patched back to shell-compatible behavior and covered by a regression test.
- Validation passed: `node --check packages/skillpacks/src/cli/lifecycle.mjs`; `node --check packages/skillpacks/src/cli/run-pack-script.mjs`; `node --check packages/skillpacks/test/lifecycle.test.mjs`; `npm --workspace skillpacks run test:node` (31 tests); temp-project Node-vs-`pack.sh` parity harness; `npm --workspace skillpacks run build:check`; streaming npm dry-run boundary assertion with `/tmp/skillpacks-npm-cache` (2315 files, denied repo paths absent); and `git diff --check`.

### Step 3.5: Compatibility Closure

- [x] Decide whether `scripts/pack.sh` should remain the canonical compatibility wrapper indefinitely or become a thin wrapper over the Node CLI for ported commands.
- [x] Route or document any remaining `pack.sh`-only commands: `recommend`, `which`, `install-deck`, and global init behavior.
- [x] Add a package-level compatibility matrix that states which commands are Node-owned, which are shell-backed, and which dependencies each path requires.
- [x] Run staged-package CLI parity from `packages/skillpacks/build` as well as source-checkout CLI parity before considering fallback dependency removal.
- [x] Keep real npm publish out of scope unless the user explicitly approves publication and npm auth is configured.

#### Step 3.5 Implementation Plan

- Files expected: modify `packages/skillpacks/src/cli/run-pack-script.mjs` only if command routing changes; otherwise update package docs such as `packages/skillpacks/README.md`, `packages/skillpacks/docs/QUICKSTART.md`, or the relevant package docs included in `packages/skillpacks/package.json`; add focused tests under `packages/skillpacks/test/` only for new routing or matrix-generation behavior; update task docs, history, and ship manifest.
- Start by listing all current `skillpacks` commands from `run-pack-script.mjs` and classifying each as Node-owned, shell-backed, or external script-backed.
- Compare that classification against `scripts/pack.sh` usage text and package docs so user-facing dependency claims are accurate.
- If retaining shell fallback, make that explicit as a supported compatibility mode and avoid removing packaged `scripts/pack.sh` or `scripts/skill-links.sh`.
- If routing additional commands through Node, add PATH-empty tests and direct shell oracle parity before switching the route.

#### Step 3.5 Verification Plan

- [x] Run Node syntax checks for changed package CLI/test files.
- [x] Run package-owned Node tests.
- [x] Run source-checkout command classification/parity checks for all documented commands.
- [x] Run staged-package command checks from `packages/skillpacks/build`.
- [x] Run `npm --workspace skillpacks run build:check`.
- [x] Run npm dry-run package boundary assertion with `/tmp/skillpacks-npm-cache`.
- [x] Run `git diff --check`.

#### Step 3.5 Review Notes

- Chose to keep `scripts/pack.sh` as the canonical git-checkout compatibility wrapper and as the packaged shell fallback instead of turning it into a thin wrapper over the Node CLI. This preserves the long-lived checkout path while the npm package owns deterministic project-local lifecycle behavior.
- Added a package-included compatibility matrix to `docs/skillpacks-npm-distribution.md` that classifies every `skillpacks` command as Node-owned, shell-backed, hybrid shell materialization, or external script-backed, with explicit `bash` and `jq` requirements.
- Documented the remaining shell surfaces: `list`, `recommend`, and `which` still use packaged `scripts/pack.sh`; `install-deck` resolves deck metadata in Node but materializes through `pack.sh install`; `init-global` invokes packaged `init.sh`.
- Updated package-included user docs (`README.md`, `docs/QUICKSTART.md`, `docs/packs.md`) so npm users see that Node-owned project commands no longer require `jq`, while git-checkout `pack.sh` write commands and `install-deck` materialization still do.
- Added `packages/skillpacks/test/compatibility.test.mjs` to parse the compatibility matrix and compare command ownership/dependencies against the CLI help and route structure.
- Source-checkout and staged-package command smokes passed for documented Node-owned commands under an empty `PATH`, shell-backed `list`/`recommend`/`which`, hybrid `install-deck vard`, and `init-global --help`.
- Adversarial review found one incomplete package-included dependency claim in `docs/packs.md`; it was patched to mention the npm Node-owned no-`jq` path. No CLI routing changes were needed.
- Validation passed: `node --check packages/skillpacks/test/compatibility.test.mjs`; `node --check packages/skillpacks/src/cli/run-pack-script.mjs`; `npm --workspace skillpacks run test:node` (33 tests); final source/staged compatibility smoke harness; `npm --workspace skillpacks run build:check`; npm dry-run boundary assertion with `/tmp/skillpacks-npm-cache` (2315 files, denied repo paths absent); targeted stale dependency scan over package-included docs; and `git diff --check`.
- Real `npm publish` was not run because publication remains out of scope without explicit user approval and npm auth confirmation.

#### Next Work

- Phase 3 is complete. The next npm-distribution work should either scope Phase 4 documentation/dry-run release prep from `docs/skillpacks-npm-distribution.md` or explicitly park the npm release track until publication is approved.

---

## Dated Alignment Index Entries

### Phase 1: Convention Update
- [x] Update the central alignment-index paragraph in `docs/alignment-page-convention.md`.
- [x] Require dated index entries with `<span class="meta">YYYY-MM-DD</span>`.
- [x] Document date sourcing, preservation, missing-date derivation, and `new · YYYY-MM-DD` marker behavior.

### Phase 2: Regeneration And Shipping
- [x] Run `node scripts/upgrade-alignment-page.mjs --dry-run`.
- [x] Run `node scripts/upgrade-alignment-page.mjs`.
- [x] Re-run `node scripts/upgrade-alignment-page.mjs --dry-run` and confirm zero pending updates.
- [x] Run `git diff --check`.
- [x] Commit the doc and regenerated files together.

### Review Notes
- Updated the central alignment-index convention so entries require `YYYY-MM-DD` meta spans after links, preserve existing dates, derive missing dates from page internals or file history, and combine active `new` markers as `new · YYYY-MM-DD`.
- Regenerated bundled `ALIGNMENT-PAGE.md` files from the canonical convention after previewing the 270-file fan-out.
- Final generator verification passed: `node scripts/upgrade-alignment-page.mjs --dry-run` reported `Updated: 0` and `Bundled files written: 0`.
- Whitespace verification passed with `git diff --check`.

---

## Research Scope Approval Before Alignment Research

### Phase 1: Audit And Contract Update
- [x] Capture prompt history for `create-agentic-skill`.
- [x] Confirm repo context and preserve unrelated dirty files.
- [x] Audit active `global/` and `packs/` source counts and old research-before-alignment wording.
- [x] Rewrite the shared staged research workflow so minimal discovery produces the review alignment page before synthesized research.
- [x] Regenerate bundled `ALIGNMENT-PAGE.md` files.
- [x] Patch active `SKILL.md` report-first and staged workflow sections.

### Phase 2: Versioning, Tests, And Shipping
- [x] Archive and bump changed active skill versions.
- [x] Update skill changelogs.
- [x] Add the correction lesson.
- [x] Update focused layer1 tests for the new approval gate.
- [x] Refresh Skills Showcase generated data if required.
- [x] Run required verification.
- [x] Add review notes, commit, and push intended changes only.

### Review Notes
- Updated the canonical alignment-page convention and regenerated 270 bundled `ALIGNMENT-PAGE.md` files so Stage 1 is minimal scope discovery only, followed by final compiled YAML approval of research scope before synthesized findings or working packets.
- Archived, bumped, and added changelog entries for active research-producing skills with hard-coded report-first/staged workflow text, including the bespoke `research-roadmap` inline contract.
- Added the correction lesson in `tasks/lessons.md` and tightened layer1 coverage for scope approval before synthesis, old research-first wording, journey-map behavior, and unresolved generated-convention tokens.
- Validation passed: `node scripts/upgrade-alignment-page.mjs --dry-run`, focused layer1 Vitest run (3 files / 304 tests), `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`, active old-phrase audit, and `git diff --check`.

---

## YouTube Prelaunch Audit Skill

### Phase 1: Scope And Implementation
- [x] Capture prompt history for `targeted-skill-builder`, `create-agentic-skill`, and `skill-creator`.
- [x] Confirm `$youtube-video-audit` belongs to the uninstalled `youtube-ops` pack.
- [x] Read the current mirrored post-release `youtube-video-audit` contract.
- [x] Inspect nearby YouTube pack routing and benchmark fixtures for minimal integration points.
- [x] Add mirrored `youtube-video-prelaunch-audit` skill contracts.
- [x] Update pack docs/router/coverage fixtures as needed.

### Phase 2: Validation And Shipping
- [x] Run focused metadata/version/invocation checks.
- [x] Run `pnpm --dir tests bench:coverage`.
- [x] Run focused layer1 benchmark setup tests if fixture definitions change.
- [x] Refresh and validate Skills Showcase data for skill metadata changes.
- [x] Run `git diff --check`.
- [x] Add review notes, commit, and push intended changes only.

### Review Notes
- Added mirrored Codex and Claude `youtube-video-prelaunch-audit` skills under `packs/youtube-ops/` for unlisted/scheduled video readiness review.
- Updated the `youtube` router `--launch` mode to prefer prelaunch review before public performance audit, with archive/changelog coverage for the v0.1 router behavior change.
- Refreshed pack docs, skill references, generated Skills Showcase/catalog data, and benchmark coverage fixtures.
- Validation passed: manifest check, benchmark coverage, focused layer1 benchmark setup tests, Skills Showcase data validation, version-field audit, and `git diff --check`.
- Repo-wide dependency/routing audits still report pre-existing broad stale references outside this change; the new YouTube router no longer contributes the previous `youtube -> skill-name` false dependency.

---

## ALIGNMENT-PAGE Bundling Drift Plan

### Phase 1: Investigation
- [x] Capture prompt history for the `investigate` invocation.
- [x] Map the shared convention source and generation/sync tooling.
- [x] Audit current generated bundle drift and unique variants.
- [x] Check positioning-specific template history and current divergence.
- [x] Assess the direct-edit/no-skill enforcement gap.
- [x] Record the approval-ready plan before source implementation.

### Phase 2: Fix Implementation - Complete (2026-06-10)
- [x] Make `packs/business-discovery/codex/customer-discovery/SKILL.md` generator-ownable and regenerate its stale `ALIGNMENT-PAGE.md`.
- [x] Harden `scripts/upgrade-alignment-page.mjs` so sibling bundles cannot be skipped as bespoke without a failing diagnostic or explicit allowlist.
- [x] Add path consistency validation for `alignment/{skill-name}-{topic}.html` inside generated bundles.
- [x] Add generated-bundle variant/drift validation against expected renderer output.
- [x] Convert or explicitly test the remaining bespoke alignment sections (7 skills / 14 mirrors after the Step 1 `customer-discovery` conversion).
- [x] Add or expose a scriptable audit for direct `alignment/*.html` edits where no skill is invoked.
- [x] Update root alignment-page instructions to require the audit/convention check for direct HTML edits.

### Review Notes
- Source of truth: `docs/alignment-page-convention.md`; renderer/sync tool: `scripts/upgrade-alignment-page.mjs`.
- Current dry-run reports `Updated: 0` and `Bundled files written: 0`, but it misses one stale bundle because the Codex `customer-discovery` section is classified as bespoke.
- Active bundle audit found 260 active `ALIGNMENT-PAGE.md` files and 133 normalized variants. The variant count is expected under today's generated skill-specific gates, but it contradicts the target model where only path substitution differs.
- Current local feedback control phrases are present across active bundles, so the remaining drift is structural and enforcement-related rather than a broad missing-phrase recurrence.
- Positioning currently has generated skill-specific gates; repo history did not confirm a separate pre-standard positioning template for local compile controls.
- `upgrade-alignment-pages` is useful when invoked, but no current hook enforces the convention for direct manual edits of `alignment/*.html`.

### Phase 2 Review Notes (Steps 1-2, 2026-06-10)
- Step 1 was completed incidentally by commit `8c655082` (2026-06-09 research scope approval session): the Codex `customer-discovery` alignment section now starts with the generator-owned stub paragraph, its `ALIGNMENT-PAGE.md` is byte-identical to the Claude sibling, and `node scripts/upgrade-alignment-page.mjs --dry-run` reports `Updated: 0` / `Bundled files written: 0` with bespoke count down from 15 to 14. Checked off as a stale checkbox, not new work.
- Step 2 hardened `scripts/upgrade-alignment-page.mjs`: bespoke classification is now tracked per skill name across mirrors and validated against a new exact allowlist, `scripts/alignment-bespoke-list.txt` (seeded with the 7 currently-bespoke skills: `consolidate-variations`, `prototype`, `spec-interview`, `ui-interview`, `ux-variations`, `uat`, `research-roadmap`).
- Failing diagnostics (exit 1 in both dry-run and write mode): unlisted bespoke section (the exact `customer-discovery` failure mode), mixed generated/bespoke sibling pair even when allowlisted, and stale allowlist entry with no bespoke section remaining. Summary output gained a `Bespoke allowlist: N skills, exact|DRIFT` line.
- Added `--root <path>` so tests can run the script against fixture trees; only `repoRoot` derivation changes.
- Added `tests/layer1/upgrade-alignment-page-bespoke.test.ts`: repo-state assertions (allowlist exists, matches bespoke set computed directly from active `SKILL.md` files, every entry bespoke in both mirrors) plus five behavioral fixture tests via `--root` (unlisted bespoke → exit 1, mixed pair → exit 1, allowlisted symmetric pair → exit 0, stale entry → exit 1, clean stub-only repo → exit 0).
- Documented the bespoke allowlist and diagnostics in `docs/alignment-page-convention.md` outside the generated-marker block; no bundle regeneration triggered.
- Validation passed: `node --check scripts/upgrade-alignment-page.mjs`; `node scripts/upgrade-alignment-page.mjs --dry-run` (exit 0, `Bespoke allowlist: 7 skills, exact`); write-mode run with no tracked diff; focused layer1 vitest (13 tests across the new and existing alignment-page test files); `git diff --check`.

### Phase 2 Review Notes (Step 3, 2026-06-10)

- Step 3 shipped: `scripts/upgrade-alignment-page.mjs` now validates that every active `ALIGNMENT-PAGE.md` (generated, bespoke, and skip-listed alike) references only its owning skill's `alignment/{skill-name}-{topic}.html` output path, exiting 1 with `Foreign output path` diagnostics in both dry-run and write mode, plus an `Output paths: N bundles, exact|DRIFT` summary line. Coverage and full details in the "Alignment Bundle Path-Consistency Validation (Drift Plan Phase 2 Step 3)" section above. Current repo: 270 bundles, exact.

### Phase 2 Review Notes (Step 4, 2026-06-10)

- Step 4 shipped: `scripts/upgrade-alignment-page.mjs --check` is the no-write repo-state gate for generated-bundle drift — exit 1 with named per-skill diagnostics (`Stale generated bundle`, `Missing generated bundle`, `Stale SKILL.md stub`) when an ownable skill's on-disk `ALIGNMENT-PAGE.md` differs from `bundledContentFor(...)` or its stub paragraph needs replacing, plus a `Generated bundles: N ownable, exact|DRIFT` summary line in every mode. Plain `--dry-run` still exits 0 on pending updates (preview workflow preserved); bespoke and skip-listed skills are exempt. Layer1 enforces the gate via a repo-state `--check` run and five `--root` fixture tests. Full details in the "Generated-Bundle Drift Validation (Drift Plan Phase 2 Step 4)" section above. Current repo: 270 ownable, exact.

### Phase 2 Review Notes (Step 5, 2026-06-10)

- Step 5 shipped: all 7 allowlisted bespoke skills (`consolidate-variations`, `prototype`, `spec-interview`, `ui-interview`, `ux-variations`, `uat`, `research-roadmap`) converted to the generated stub + bundled `ALIGNMENT-PAGE.md` in both mirrors, with version bumps, archives, and changelog entries. `prototype` keeps its custom prototype-first timing rule as hybrid bespoke prose beside the stub, pinned by layer1. The bespoke allowlist is now empty (mechanism and diagnostics unchanged). Repo: `Bespoke allowlist: 0 skills, exact`, `Generated bundles: 284 ownable, exact`. Full verdicts and validation in the "Bespoke Alignment Section Conversion/Testing (Drift Plan Phase 2 Step 5)" section above.

### Phase 2 Review Notes (Step 6, 2026-06-10)

- Step 6 shipped: `scripts/audit-alignment-pages.mjs` is the read-only convention gate for direct edits to active `alignment/*.html` pages — five checks (TTS include, category/tier data attributes, viewport meta, embed prohibition, index integrity) with named per-page diagnostics, `exact|DRIFT` summary lines, shared exit 1, and `--root` fixture support; enforced by `tests/layer1/audit-alignment-pages.test.ts` (repo-state run + 12 fixture tests). The audit surfaced and this boundary fixed: 1 missing TTS include, 36 pages missing both data attributes (+2 missing only the tier), and 2 pages absent from `alignment/index.html`. Current repo: 41 active pages, all checks exact. Full details in the "Direct Alignment HTML Edit Audit (Drift Plan Phase 2 Step 6)" section above. Step 7 (require the audit in root alignment-page instructions for direct HTML edits) remains queued.

### Phase 2 Review Notes (Step 7, 2026-06-10) — Phase 2 Complete

- Step 7 shipped: both root instruction surfaces now require direct edits to active `alignment/*.html` pages made without invoking a skill to pass `node scripts/audit-alignment-pages.mjs` (exit 0) before commit, with TTS-include diagnostics routed to `node scripts/inject-tts.mjs` and archived pages exempt — a **Direct-edit audit.** paragraph in CLAUDE.md `### Alignment Page Template` and a matching bullet in AGENTS.md `### Alignment Page Convention`, both outside provisioned blocks. The requirement language is pinned in both files by a new root-instruction contract test in `tests/layer1/audit-alignment-pages.test.ts`. Full details in the "Root Instructions for Direct Alignment Edits (Drift Plan Phase 2 Step 7)" section above.
- **Phase 2 is complete.** All seven steps shipped: generator-ownable Codex `customer-discovery` (1), bespoke allowlist hardening (2), output-path consistency validation (3), generated-bundle drift `--check` gate (4), bespoke section conversion to generated bundles (5), the read-only direct-edit audit (6), and root-instruction wiring of that audit (7). The convention is now enforced at every surface: generator runs, repo-state layer1 gates, and direct no-skill HTML edits.

---

## Separate Skills Showcase From Skillpacks Package

### Execution Profile
- Parallel mode: serial
- Rationale: workspace metadata, package relocation, generator paths, and boundary validation share repository-level files and generated outputs.

### Phase 1: Workspace And Package Boundary
- [x] Rewrite root `package.json` as private `agentic-skills` workspace metadata.
- [x] Add workspace recognition for `apps/skills-showcase` and `packages/skillpacks`.
- [x] Move `bin/skillpacks.mjs` and `src/cli/run-pack-script.mjs` into `packages/skillpacks/`.
- [x] Add `packages/skillpacks/package.json`.
- [x] Add `packages/skillpacks/scripts/build-package.mjs`.
- [x] Ensure package staging excludes `apps/`, `tasks/`, `prompts/`, `alignment/`, `tests/`, and `docs/history/`.

### Phase 2: Website Generators And Shared Catalog
- [x] Move Skills Showcase generator and validator scripts into `apps/skills-showcase/scripts/`.
- [x] Add a read-only shared catalog layer under `scripts/catalog/`.
- [x] Update generators to read catalog helpers and continue writing website-owned generated outputs.
- [x] Update docs and app copy to point at the app-owned generator commands.

### Verification And Shipping
- [x] Run `node packages/skillpacks/bin/skillpacks.mjs --version`.
- [x] Run `node packages/skillpacks/bin/skillpacks.mjs list`.
- [x] Run `node packages/skillpacks/scripts/build-package.mjs --check`.
- [x] Run `npm pack packages/skillpacks/build --dry-run --json --silent`.
- [x] Install the staged tarball in a temp consumer and run `skillpacks install quality-sweep` plus `skillpacks doctor`.
- [x] Run `pnpm --dir apps/skills-showcase test`.
- [x] Run `pnpm --dir apps/skills-showcase build`.
- [x] Run `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`.
- [x] Run `scripts/skill-pack-routing-audit.sh`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, and `git diff --check`.
- [x] Verify package checks leave `apps/skills-showcase/`, `docs/skills-showcase/`, and `docs/benchmark-results-matrix.md` unchanged.
- [x] Verify website validation leaves package staging and metadata unchanged.
- [x] Confirm npm dry-run excludes `apps/`, `tasks/`, `prompts/`, `alignment/`, `tests/`, and `docs/history/`.
- [x] Update review notes, history, ship manifest, commit, and push intended changes.

### Review Notes
- Implementation started from the approved separation plan: one repo, independent monorepo consumers, shared internal catalog, and no npm publish.
- `node packages/skillpacks/bin/skillpacks.mjs --version`, `node packages/skillpacks/bin/skillpacks.mjs list`, and `node packages/skillpacks/scripts/build-package.mjs --check` passed during implementation.
- Package staging uses tracked `global/` and `packs/` files only, selected repo install scripts/docs, and package-owned `bin/` and `src/`.
- `npm pack packages/skillpacks/build --dry-run --json --silent` passed and reported no `apps/`, `tasks/`, `prompts/`, `alignment/`, `tests/`, or `docs/history/` entries.
- Temp consumer package install passed from `/tmp`: installed `quality-sweep` from the staged `skillpacks-0.1.0.tgz`, and `doctor` reported `.claude/skills/quality-sweep` and `.codex/skills/quality-sweep` as `ok`.
- `pnpm --dir apps/skills-showcase build` passed. The first app test run found a stale generated `apps/skills-showcase/alignment/animation-state-machine.html`; regenerated it with `pnpm --dir apps/skills-showcase exec jiti scripts/render-animation-state-machine-page.ts`, then `pnpm --dir apps/skills-showcase test` passed 12 files / 132 tests.
- Made the GitHub proof generator deterministic by default: committed proof data uses local git evidence unless `SKILLS_SHOWCASE_REFRESH_GITHUB=1` is set for an ad hoc refresh. This fixed validator flakiness caused by public GitHub metadata availability changing between runs.
- `pnpm --dir apps/skills-showcase validate:data` and root `npm run skills-showcase:validate-data` both passed with fresh generated data.
- Boundary checks passed: package verification left website-owned generated assets unchanged, and website validation left package staging/metadata unchanged.
- Integrity checks passed: `scripts/skill-pack-routing-audit.sh`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, script `node --check` commands, and `git diff --check`.
- A CLI smoke run rewrote `.agents/project.json`; that project-designation churn was restored because it is not part of this migration.
- Unrelated pre-existing local changes remain in `alignment/skillmap.html`, `docs/skillmap.excalidraw`, and `scripts/generate-skillmap-excalidraw.mjs`; do not touch them unless the user redirects.

---

## Skillpacks npm Distribution Phase 2

### Execution Profile
- Parallel mode: serial
- Rationale: manifest generation, CLI behavior, and package boundary validation share the same files and should be integrated in one lane.

### Phase 2: Deck Metadata And Manifest
- [x] Add `packages/skillpacks/scripts/build-skillpacks-manifest.mjs`.
- [x] Generate `packages/skillpacks/dist/skillpacks-manifest.json` from repository skill and pack sources.
- [x] Include pack names, skill names, tools, versions, content hashes, archive versions, source paths, and status.
- [x] Include deck metadata for `vard`, `ord`, `business-afps`, and `devtool-afps`.
- [x] Include COA B package-list fields and COA C registry-tag fields for every deck.
- [x] Include `packages/skillpacks/dist/skillpacks-manifest.json` in the npm package allowlist.
- [x] Add `skillpacks list --json` using the manifest.
- [x] Add `skillpacks install-deck <deck>` and `skillpacks install-deck business-afps --full`.
- [x] Preserve `pack.sh` forwarding for all existing commands.

### Verification And Shipping
- [x] Run `node packages/skillpacks/scripts/build-skillpacks-manifest.mjs --check`.
- [x] Verify `node packages/skillpacks/bin/skillpacks.mjs list --json`.
- [x] Verify temp consumer repo `install-deck vard`.
- [x] Verify temp consumer repo `install-deck business-afps` and `install-deck business-afps --full`.
- [x] Run `npm_config_cache=/tmp/skillpacks-npm-cache npm pack packages/skillpacks/build --dry-run --json --silent` and confirm manifest inclusion plus task/prompt/alignment/test exclusions.
- [x] Run targeted package, routing, and generated-data checks as required by changed files.
- [x] Update review notes, history, and ship manifest.
- [x] Commit and push intended changes.

### Review Notes
- Prepared after Phase 0/1 shipped in `b9b78312`.
- Real `npm publish` remains out of scope for this phase unless the user explicitly changes the scope and confirms the external publish action.
- 2026-06-09 split re-audit corrected stale Phase 2 manifest paths to the package workspace (`packages/skillpacks/scripts/` and `packages/skillpacks/dist/`); manifest/deck implementation remains unstarted.
- 2026-06-09 split re-audit found active `exec`, `ship`, `create-agentic-skill`, and `targeted-skill-builder` contracts still referenced removed root Skills Showcase scripts; archived/bumped those skill mirrors and rewrote refresh commands to `apps/skills-showcase/scripts/...`.
- Implemented package-owned manifest generation at `packages/skillpacks/scripts/build-skillpacks-manifest.mjs` and generated `packages/skillpacks/dist/skillpacks-manifest.json` with 41 packs, 367 active skill records, and 4 deck records.
- Manifest validation covers missing active skill paths, missing active skill versions, deck references to missing active pack directories, and missing package-list / registry-tag metadata. `devtool` and `game` are represented as active pack directories with null `PACK.md` metadata.
- Added `skillpacks list --json` as a manifest read path while keeping `skillpacks list` forwarded to `pack.sh list`.
- Added `skillpacks install-deck <deck> [--full]` as a manifest resolver over `bash scripts/pack.sh install ...`; `business-afps --full` selects `business-discovery`, `customer-lifecycle`, `business-growth`, and `business-ops`.
- Temp consumer checks passed from `/tmp`: `install-deck vard`, `install-deck business-afps`, `install-deck business-afps --full`, and `doctor` after each install. Negative checks for unknown deck and unsupported flag returned clear errors.
- Package checks passed: `npm --workspace skillpacks run build:check`; parsed `npm pack packages/skillpacks/build --dry-run --json --silent` confirmed `dist/skillpacks-manifest.json` is included and `apps/`, `tasks/`, `prompts/`, `alignment/`, `tests/`, and `docs/history/` are excluded.
- Repository integrity passed: manifest shape assertion, `node --check` for changed package/catalog scripts, `scripts/skill-pack-routing-audit.sh`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`, and `git diff --check`.
- Skills Showcase validation refreshed GitHub proof data because `tasks/history.md` is one of its source inputs. Skill/pack catalog generated data and the benchmark matrix were rewritten by the validator but ended with no tracked diff.
- Unrelated pre-existing local changes remain in `alignment/skillmap.html`, `docs/skillmap.excalidraw`, and `scripts/generate-skillmap-excalidraw.mjs`; do not touch them unless the user redirects.

---

## Skillpacks npm Distribution Phase 0/1

### Execution Profile
- Parallel mode: serial
- Rationale: package metadata, CLI wrapper, task docs, and verification all share the same shipping boundary.

### Phase 0: Reservation And Preflight
- [x] Capture prompt history for the `exec` invocation.
- [x] Inspect approved npm distribution design and existing script contracts.
- [x] Re-check safe npm registry/account information for `skillpacks` without publishing.
- [x] Confirm package license metadata from current repository files.
- [x] Document that real `npm publish` is out of scope for this pass.

### Phase 1: Monolith Package And Thin CLI
- [x] Add root `package.json` for `skillpacks`.
- [x] Add `bin/skillpacks.mjs`.
- [x] Add `src/cli/run-pack-script.mjs` or equivalent dispatcher.
- [x] Forward current `pack.sh` commands while preserving consumer project `cwd`.
- [x] Implement `init-global` by invoking packaged `init.sh`.
- [x] Add dependency checks for `bash` and write-command `jq`.

### Verification And Shipping
- [x] Verify `node bin/skillpacks.mjs list`.
- [x] Verify temp consumer repo install/status/doctor behavior.
- [x] Run `npm pack --dry-run`.
- [x] Run targeted existing repository checks appropriate for package metadata.
- [x] Update review notes, history, commit, and push intended changes.

### Review Notes
- Added a root `skillpacks@0.1.0` npm package boundary with `bin/skillpacks.mjs`, `src/cli/run-pack-script.mjs`, and a narrow `files` allowlist.
- The CLI delegates existing project-local commands to packaged `scripts/pack.sh` while preserving the consumer project's current working directory. `init-global` delegates to packaged `init.sh`.
- Package metadata uses `license: UNLICENSED` because no repository `LICENSE` file exists. Real `npm publish` is intentionally out of scope until explicit publish approval, account readiness, and final package metadata are confirmed.
- Safe npm preflight: `npm view skillpacks`, `npm view @skillpacks/cli`, and `npm view @skillpacks/core` returned `E404`; `npm whoami` returned `ENEEDAUTH`.
- Local npm cache note: default `npm pack` hit root-owned files in `~/.npm`; validation used `npm_config_cache=/tmp/skillpacks-npm-cache` without changing home-directory ownership.
- Package dry-run: 5,508 files, 9.24 MB package size, 53.33 MB unpacked size, zero denied files from `alignment/`, `prompts/`, `tasks/`, `apps/`, `tests/`, or `docs/history/`.
- Packaged tarball install passed from `/tmp`: installed `quality-sweep` from `node_modules/skillpacks`, and `doctor` reported the installed Claude/Codex skill roots as `ok`.
- Validation exposed and fixed packaged content gaps: `ord-ship` now recommends installing the `devtool` pack before graduating to `devtool-adoption`; ORD/VARD rapid deck skills now have benchmark coverage metadata.
- Verification passed: CLI smoke, tarball install, `npm pack --dry-run`, Node syntax checks, routing audit, skill version audit, archive audit, dependency audit, benchmark coverage, focused `bench-coverage` layer1 tests, generated showcase validation, and `git diff --check`.
- Unrelated pre-existing local changes are present in `alignment/skillmap.html`, `docs/skillmap.excalidraw`, and `scripts/generate-skillmap-excalidraw.mjs`; this phase will not touch them.

---

## Skillpacks Deck Metadata Approval Revision

### Phase 1: Design Revision
- [x] Capture prompt history for the revised `idea-scope-brief` approval YAML.
- [x] Compare the revised deck gate against the previously shipped npm roadmap.
- [x] Update `docs/skillpacks-npm-distribution.md` so deck installation uses COA B/C-shaped package-list and registry-tag metadata.
- [x] Update `docs/decks.md` so npm deck distribution no longer says decks simply map to install presets.

### Phase 2: Verification And Shipping
- [x] Verify revised deck wording and roadmap phase names with targeted searches.
- [x] Run `git diff --check`.
- [x] Commit and push intended changes.

### Review Notes
- New approval differs from the previously shipped roadmap: the overall route still starts with COA A, but the deck-installation gate now says `Other / None of the above` with notes `COA B and C`.
- Updated `docs/skillpacks-npm-distribution.md` so deck installation is modeled as COA B/C-shaped package-list and registry-tag metadata that the first monolith CLI materializes through a manifest resolver.
- Updated `docs/decks.md` so npm deck distribution no longer describes decks as simple install presets.
- Scope control: no package implementation, no root `package.json`, no CLI code, and no GitHub Actions were added.
- Verification passed: targeted `rg` scan for revised deck terms, roadmap phase naming, stale preset wording, and `git diff --check`.

---

## Skillpacks npm Distribution Design

### Phase 1: Approved Design Handoff
- [x] Capture prompt history for the `idea-scope-brief` approval YAML.
- [x] Read `alignment/idea-scope-brief-npm-distribution.html` and approved gate answers.
- [x] Inspect existing deck, pack, install, and versioning docs.
- [x] Check current npm registry status for `skillpacks`, `@skillpacks/cli`, `@skillpacks/core`, and `agentic-skills`.
- [x] Write `docs/skillpacks-npm-distribution.md`.

### Phase 2: Verification And Shipping
- [x] Verify the design doc preserves the approved decisions and includes a detailed implementation roadmap.
- [x] Run `git diff --check`.
- [x] Commit and push intended changes.

### Review Notes
- Approved path at original shipment: use `skillpacks` as the public npm/CLI name, start with one monolith package, keep skill-level pinning, and preserve a migration path toward scoped packages or registry tags. Revised by the later deck metadata approval above: deck installation should now be modeled as COA B/C package-list and registry-tag metadata that the monolith CLI materializes.
- Current registry preflight: `npm view skillpacks`, `npm view @skillpacks/cli`, and `npm view @skillpacks/core` returned `E404`; `npm view agentic-skills` returned an existing external package at `2.5.1`, so the old repo name should not be the npm package name.
- Design artifact: `docs/skillpacks-npm-distribution.md`.
- Scope control: no package implementation, no root `package.json`, no CLI code, and no GitHub Actions were added in this pass.
- Verification passed: targeted key-string scan for approved decisions and all roadmap phases; ASCII scan confirmed the new design doc is ASCII-only; `git diff --check` passed.
- Unrelated worktree item left untouched: `apps/skills-showcase/next-env.d.ts`.

---

## npm Distribution Deck Installation Gate

### Phase 1: Investigation And Fix
- [x] Capture prompt history for the `investigate` invocation.
- [x] Confirm the npm distribution alignment page has deck-installation content but no corresponding review gate.
- [x] Move deck-based installation above the review gates.
- [x] Add a required deck-installation gate.
- [x] Update correction lesson.

### Phase 2: Verification And Shipping
- [x] Run targeted page/gate checks and `git diff --check`.
- [x] Add review notes with root cause, fix, and verification results.
- [x] Commit and push the intended changes.

### Review Notes
- User claim validated: confirmed. `alignment/idea-scope-brief-npm-distribution.html` had deck-based installation content, but it was appended after the review gates and compile controls, so final YAML could omit the deck-install decision entirely.
- Root cause: the 2026-06-07 deck addendum added substantive COA-specific installation behavior without adding a matching `.gate` question block or moving the section into the pre-gate review body.
- Fix: moved `Deck-Based Installation` before `Review Gates`, added it to the TOC, added local section feedback controls, and added a required `Deck-Based Installation` gate with COA A/B/C/hybrid/other/clarification choices.
- Archive: saved the pre-revision page at `docs/history/archive/2026-06-08/145626/alignment/idea-scope-brief-npm-distribution.html`.
- Prevention: added a lesson requiring substantive alignment-page addenda to include matching gates before compile controls.
- Verification passed: structure/order check (`deck-based-installation` before `review-gates` before `compile`), single deck heading check, TOC/feedback/gate presence check, inline JavaScript syntax check, extracted gate list containing `deck-based-installation`, archive existence check, targeted string scan, and `git diff --check`.
- Unrelated worktree item left untouched: `apps/skills-showcase/next-env.d.ts`.

---

## Workflow Design Alignment Chart Clipping

### Phase 1: Investigation And Fix
- [x] Capture prompt history for `investigate`, Browser verification, and Computer Use verification.
- [x] Record the plan in `tasks/roadmap.md` and `tasks/todo.md`.
- [x] Inspect the Graduation Path routing chart markup and styles.
- [x] Reproduce or confirm the right-edge clipping.
- [x] Patch the layout so the rapid pipeline chart remains fully visible.
- [x] Update `tasks/lessons.md` with the correction pattern.

### Phase 2: Verification And Shipping
- [x] Run static validation and `git diff --check`.
- [x] Verify the fixed page visually in the browser.
- [x] Add review notes with root cause, fix, and verification results.
- [x] Commit and push the intended changes.

### Review Notes
- User claim validated: confirmed. The previous Graduation Path flow chart placed every node label to the right of its node, so final-layer destination labels extended beyond the SVG viewBox and were clipped on the right edge.
- Root cause: `alignChart.flow()` did not account for edge-layer label placement. The current `HEAD` alignment page now anchors final-layer labels inward with `text-anchor="end"` and includes a visible revision note in the Graduation Path section.
- Archive: saved the pre-revision page state to `docs/history/archive/2026-06-08/105036/alignment/workflow-design-three-pipelines.html`; that snapshot shows the old outward-label flow helper and `alignment_status: approved`.
- Index maintenance: updated tracked `alignment/index.html` so the entry matches the revised Four-Pipeline page title and 2026-06-08 refresh date.
- Verification passed: `git diff --check`; targeted status/helper/index string scans; archive existence check; focused node-position calculation showing all Graduation Routing labels inside bounds; Quick Look render; and Safari visual inspection of the Graduation Path section showing the right-side Business AFPS and Devtool AFPS labels visible.
- Tooling note: Browser plugin control was unavailable because the required Node REPL browser tool was not exposed in this session, so the visual check used Safari through Computer Use. `node scripts/upgrade-alignment-page.mjs --dry-run` exited successfully but reports broader pre-existing generated `ALIGNMENT-PAGE.md` drift outside this page revision; those 267 generated writes were not applied.

---

## Documentation Freshness And Cleanup Audit

### Phase 1: Plan And Inventory
- [x] Capture prompt history for the `devtool-docs-audit` invocation.
- [x] Record full plan in `tasks/roadmap.md`.
- [x] Inventory tracked documentation surfaces and classify active vs generated vs historical docs.

### Phase 2: Freshness Checks
- [x] Compare top-level/setup docs against current scripts and repository layout.
- [x] Compare workflow/routing docs against active skill contracts.
- [x] Scan docs for stale command names, moved paths, missing scripts, and archive-worthy historical artifacts.

### Phase 3: Report And Verify
- [x] Write `research/devtool-docs-audit.md`.
- [x] Build `alignment/devtool-docs-audit-docs-freshness.html`.
- [x] Add review notes with cleanup/archive recommendations.
- [x] Run targeted verification and `git diff --check`.

### Review Notes
- Current docs audit report: `research/devtool-docs-audit.md`.
- Alignment review page: `alignment/devtool-docs-audit-docs-freshness.html`; browser open fallback via `open` succeeded.
- Previous live docs-audit report archived to `docs/history/archive/2026-06-08/040539/research/devtool-docs-audit.md`.
- Highest-priority fixes: correct managed-copy vs symlink wording, repair missing `scripts/init-agentic-skills.sh` references, replace retired `icp` command routes with `customer-discovery`, and archive or relabel historical docs in active-looking locations.
- Cleanup candidates: `docs/workflow-refactor-proposal.html`, `docs/kanban-test-results.md`, `docs/phases/*`, root session artifacts, older dated devtool audit research, and stale `specs/drift-report.md`.
- Pack-doc gaps: add `PACK.md` for active `devtool` and `game` packs; remove ignored local `packs/poketowork-kanban/` residue only after explicit cleanup approval.
- Validation passed: `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `scripts/skill-versions.sh --missing`, `node scripts/upgrade-alignment-page.mjs --dry-run`, `pnpm --dir tests bench:coverage`, `scripts/validate-skills-showcase-data.sh`, key-string scans, and `git diff --check`.

---

## Add Scriptability Findings To Alignment Pages

### Phase 1: Plan And Archive
- [x] Inspect current target alignment pages and task notes.
- [x] Confirm `alignment/index.html` is untracked.
- [x] Archive target HTML pages to `docs/history/archive/2026-06-07/180623/alignment/`.

### Phase 2: Amend Existing Pages
- [x] Update `alignment/analyze-sessions-pack-install-issues.html` with the dated script surface follow-up.
- [x] Update `alignment/analyze-sessions-downstream-skill-inventory.html` with the dated portability addendum.
- [x] Update `alignment/analyze-sessions-plain-text-skill-opportunities.html` with the dated script extraction clarification.
- [x] Keep `alignment/skills-inventory.html` unchanged because it is a generated/static catalog.

### Phase 3: Verification
- [x] Refresh or verify local `alignment/index.html`.
- [x] Run `git diff --check`.
- [x] Verify required key strings and archive snapshots.
- [x] Run `node scripts/upgrade-alignment-page.mjs --dry-run`.

### Review Notes
- Scope is amendment-only: no new alignment page, no script extraction implementation, and no generated `ALIGNMENT-PAGE.md` hand edits.
- `alignment/index.html` is not tracked by `git ls-files`; treat central index maintenance as local verification unless later evidence shows it should be committed.
- Local central index was regenerated with 36 pages and includes the three amended alignment pages; it remains untracked by design.
- Verification passed: `git diff --check`; key-string scan for dated addenda, `pack.sh`, `Bash 3.2`, `compile-central-alignment`, and `scripts/init-agentic-skills.sh`; archive snapshot listing; and `node scripts/upgrade-alignment-page.mjs --dry-run` with `Updated: 0` and `Bundled files written: 0`.

---

## Skills That Should Be Scripts Research Validation

### Phase 1: Evidence Capture
- [x] Capture prompt history for the `investigate` invocation.
- [x] Inventory repository scripts and validate reported script counts/line counts.
- [x] Inspect named skills and classify the LLM role.
- [x] Validate the `pack` skill/pass-through claim in detail.
- [x] Record review results and final recommendation.

### Review Notes
- `scripts/` contains 22 files, or 21 code/script files excluding `alignment-skip-list.txt`; 16 files currently have executable bits.
- Confirmed: `scripts/pack.sh` is a 1164-line full pack lifecycle CLI, and explicit `$pack` subcommands are mostly delegation plus reporting/reload guidance.
- Confirmed with caveats: `mono-detect` and `skill-inventory` are script-fronted workflows, but their skills still own summary/routing/report/alignment behavior.
- Confirmed: `provision-agentic-config` is static block insertion/replacement with collision/version handling.
- Not supported: `upgrade-alignment-pages` does not delegate to `scripts/upgrade-alignment-page.mjs`; that script regenerates bundled `ALIGNMENT-PAGE.md` files from the canonical convention.
- Not supported: `compile-central-alignment` does not delegate index generation to `scripts/open-html-page.mjs`; the script is only the browser opener after index generation.
- Overstated: `sync`, `release`, `deploy`, `update-packages`, and `create-local-skill` have deterministic substeps, but the current contracts encode safety policy, confirmation gates, compatibility judgment, or report/alignment obligations that should not be collapsed blindly into shell scripts.
- Active catalog count: 357 active `SKILL.md` files across mirrors and 181 unique active skill names; the broad "vast majority are LLM-dependent" conclusion remains directionally correct.
- Recommendation: extract deterministic primitives into scripts, but keep skills as policy/judgment orchestrators unless the skill is true pass-through.

### 2026-06-06 Follow-up Verification Notes
- Prompt history captured for the Codex `investigate` invocation at `prompts/investigate/skill-prompt-20260606-183821-scriptable-skills.md`.
- Reconfirmed source catalog counts: 357 active source `SKILL.md` files under `global/` and `packs/`, 181 unique active skill names, and 22 files under root `scripts/`.
- Reconfirmed `pack.sh` is the strongest script-first precedent: it owns pack/skill install, remove, refresh, doctor, prune, pin/unpin, project-mode writes, locking, drift markers, and reload notice behavior.
- New finding: downstream/manual script readiness needs a portability standard. On this macOS host, `bash --version` is GNU Bash 3.2.57; `skill-inventory.sh`, `skill-deps.sh`, `skill-versions.sh`, and `skill-next-step-routing.sh` fail with Bash 4-only constructs such as `declare -A` or `mapfile`.
- New finding: `docs/scripts-reference.md` and `docs/packs.md` reference `scripts/init-agentic-skills.sh`, but no root `scripts/init-agentic-skills.sh` exists; the actual launchers live under `global/{claude,codex}/init-agentic-skills/scripts/`.
- New finding: `compile-central-alignment` is the best near-term extraction candidate because the index-generation algorithm is fully specified in the skill and only the opener is scripted today.
- Verification: `node scripts/upgrade-alignment-page.mjs --dry-run` passed with `Updated: 0` and `Bundled files written: 0`.
- Verification: `bash scripts/pack.sh which compile-central-alignment` and `bash scripts/pack.sh which skill-inventory` correctly locate the providing packs and install commands.
- Verification: targeted layer1 Vitest run passed 24/27 assertions; failures were existing script/contract issues relevant to this investigation: stale `compile-central-alignment` test expectation (`v0.1` expected, active contract is `v0.2`) and Bash 3.2 failures in `skill-inventory.sh`.

---

## Current State

- Tree is clean after ship-end wrap-up, master — `user-flow-map` product-design skill and AFPS routing refactor shipped in commit `276f595f`.
- Preserved existing customer-discovery orchestrator notes below; do not overwrite unrelated in-progress items.

---

## user-flow-map Skill And AFPS Routing Refactor (shipped)

### Phase 1: Inspect And Plan
- [x] Capture prompt history for the targeted skill invocation.
- [x] Read relevant lessons for routing and validation pitfalls.
- [x] Search for existing user-flow mapping ownership and routing references.
- [x] Read product-design skill conventions and affected skill contracts.

### Phase 2: Create New Skill
- [x] Add Codex `packs/product-design/codex/user-flow-map/`.
- [x] Add Claude `packs/product-design/claude/user-flow-map/`.
- [x] Add `SKILL.md`, `CHANGELOG.md`, and `agents/openai.yaml` mirrors.
- [x] Generate `ALIGNMENT-PAGE.md` mirrors through `scripts/upgrade-alignment-page.mjs`.

### Phase 3: Refactor Routing
- [x] Archive and bump existing `SKILL.md` mirrors before edits.
- [x] Update `positioning` to route completed product synthesis to `user-flow-map`.
- [x] Update `ui-interview`, `ux-variations`, `prototype`, and `spec-interview` contracts.
- [x] Update `research-roadmap` stale rules, artifact tracking, priority order, and dependency tree.
- [x] Update AFPS docs and global skill browser references.

### Phase 4: Generated Assets And Coverage
- [x] Update alignment generator gates for `user-flow-map`.
- [x] Refresh Skills Showcase data and validate it.
- [x] Update benchmark coverage for `user-flow-map`.

### Phase 5: Verification And Shipping
- [x] `scripts/skill-versions.sh --missing`
- [x] `scripts/skill-archive-audit.sh --strict`
- [x] `scripts/skill-deps.sh --broken`
- [x] `scripts/skill-pack-routing-audit.sh`
- [x] `node scripts/upgrade-alignment-page.mjs --dry-run`
- [x] `scripts/validate-skills-showcase-data.sh`
- [x] `pnpm --dir tests bench:coverage`
- [x] Targeted route tests: `competitive-analysis-routing.test.ts` and `journey-map-routing.test.ts`
- [x] Targeted route `rg` spot checks.
- [x] `git diff --check`
- [x] `pnpm --dir tests test` — ran; still fails on existing unrelated layer1 repo issues listed below. (Reconciled 2026-06-10: the unrelated layer1 failures have since been fixed; full layer1 now passes — 56 files / 2205 tests / 0 failed.)
- [x] Commit and push intended changes.

### Review Notes
- Skill integrity checks passed: version fields, archive audit, dependency scan, and pack routing audit.
- Generated alignment dry-run reported no drift; Skills Showcase generated data is fresh.
- Benchmark coverage matrix is valid at 180 skills; `user-flow-map` has custom pack workflow coverage.
- Targeted AFPS route tests pass for competitive-analysis and journey-map.
- Full `pnpm --dir tests test` still fails with 46 layer1 failures unrelated to the new flow route: stale `icp` test paths after the customer-discovery rename, staged-research contract gaps for customer-discovery/journey framework skills, unrelated YouTube handoff tests, existing alignment/index wording drift, a stale `poketowork-kanban` symlink under `node_modules`, and pre-existing benchmark/demo contract drift.
- Ship-end prompt/history wrap-up only changed documentation artifacts; no app deploy was run.

---

## Current State

- customer-discovery orchestrator refactor in progress on master.
- Recent work: icp → customer-discovery rename + orchestrator refactor (Phase 1-2 complete), all six Phase 3 framework subskills now have mirrored contracts.
- Active: Phase 4 documentation updates for the icp → customer-discovery rename.

---

## customer-discovery Orchestrator Refactor (in progress)

### Completed
- [x] Archive icp v0.11 (claude + codex)
- [x] Rename icp/ → customer-discovery/ (claude + codex)
- [x] Create framework scaffold directories (w3-hypothesis, jtbd-needs, four-forces, five-rings, seven-dimensions, pmf-engine)
- [x] Write orchestrator SKILL.md v1.0 (claude)
- [x] Write orchestrator SKILL.md v1.0 (codex)
- [x] Update CHANGELOGs
- [x] Update orchestrator-convention.md reference implementations

### Phase 3: Write subskill SKILL.md files
- [x] `w3-hypothesis` — Schwartzfarb W3 (WHO/WHAT/WHY) hypothesis generation + disproval
- [x] `jtbd-needs` — Ulwick/Christensen JTBD needs-based segmentation
- [x] `four-forces` — Moesta Four Forces (Push/Pull/Anxiety/Habit) switching analysis
- [x] `five-rings` — Revella Five Rings of Buying Insight (decision psychology)
- [x] `seven-dimensions` — Lincoln Murphy 7 Dimensions ICP scoring
- [x] `pmf-engine` — Vohra/Supan PMF Engine + High-Expectation Customer
- Each needs: SKILL.md, CHANGELOG.md, ALIGNMENT-PAGE.md (claude first, then codex mirror)

### Phase 3 Review Notes
- Added Claude and Codex `pmf-engine` framework mirrors with `SKILL.md`, `CHANGELOG.md`, and generated `ALIGNMENT-PAGE.md`.
- PMF Engine is constrained to product-exists contexts with real user/customer evidence, Sean Ellis PMF signal handling, very-disappointed segmentation, behavioral evidence checks, and High-Expectation Customer synthesis.
- Added `pmf-engine` to the benchmark coverage registry as blocked because it requires real product/user evidence and lacks a deterministic pack workflow fixture.
- Validation completed: skill versions, dependency scan, pack routing audit, alignment dry-run, Skills Showcase freshness, benchmark coverage, staged-research string check, targeted mirror scans, and `git diff --check`.
- Broad `pnpm --dir tests verify` still fails on 46 known layer1 failures unrelated to `pmf-engine` (stale `icp` paths, existing alignment wording drift, mirror parity drift, and benchmark/demo contract drift); final failure summary does not list `pmf-engine`.

### Phase 4: Documentation Updates (icp → customer-discovery rename)
- [x] Update AFPS flow docs (canonical-workflow-report.md, skill-next-step-contracts.md, skills-reference.md, skill-anatomy.md, skill-invocation-types.md)

#### Phase 4 Review Notes
- Phase 4.1 updated the canonical AFPS docs to use `customer-discovery` for executable discovery routes and skill classification.
- Preserved `enterprise-icp` as a separate skill and `research/icp.md` as the canonical customer-discovery output artifact because the active `customer-discovery` contract still writes it.
- Also aligned the canonical product path to the current post-positioning sequence: `user-flow-map` → `ui-interview --requirements-only` → `ux-variations --layout-mode`.
- Validation completed: targeted `rg -n "icp|/icp|\\$icp|icp-needed"` over the five edited docs reported only intentional `enterprise-icp` and `research/icp.md` references; `git diff --check` passed; `pnpm --dir tests exec vitest run --project layer1 layer1/competitive-analysis-routing.test.ts layer1/journey-map-routing.test.ts layer1/codebase-status-routing.test.ts` passed with 3 files and 14 tests.

- [x] Update PACK.md for business-discovery

#### Phase 4.2 Review Notes
- Updated `packs/business-discovery/PACK.md` to describe `customer-discovery` as the default discovery skill while preserving `enterprise-icp` as a separate skill.
- Confirmed both pack mirrors have `customer-discovery` roots and no active `icp` roots: `packs/business-discovery/{codex,claude}/customer-discovery`.
- Targeted legacy scan over `PACK.md` now reports only the intentional `enterprise-icp` skill-list entry.
- Refreshed Skills Showcase data because a tracked `PACK.md` changed.
- Validation passed: targeted `rg -n "icp|/icp|\\$icp|icp-needed" packs/business-discovery/PACK.md`, `node scripts/generate-skills-showcase-data.mjs`, `node scripts/generate-skills-showcase-github-data.mjs`, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.
- Production deploy not run because it requires explicit confirmation; local build and deploy-contract prechecks passed.

- [x] Update global skills that route to /icp (idea-scope-brief, afps-status, codebase-status, skills, pack)

#### Phase 4.3 Review Notes
- Updated mirrored global contracts for `idea-scope-brief`, `afps-status`, `codebase-status`, `skills`, and `pack` so executable discovery routes now point to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Renamed the `afps-status` workflow stage from `icp-needed` to `discovery-needed`; active global files now retain `icp` only in intentional `enterprise-icp` skill names or `research/icp.md` artifact references.
- Archived and bumped all affected mirrored global `SKILL.md` files: `idea-scope-brief` v0.12, `afps-status` v0.1, `codebase-status` v0.5, `skills` v0.5, and `pack` v0.6.
- Added `tests/layer1/global-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, or `icp-needed` in active global routing contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed.
- Validation passed: targeted legacy-route scan over the edited active global `SKILL.md` files, `pnpm --dir tests exec vitest run --project layer1 layer1/global-customer-discovery-routing.test.ts layer1/afps-status-global-mirror.test.ts layer1/codebase-status-routing.test.ts layer1/idea-scope-brief-approval-ordering.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, `node scripts/generate-skills-showcase-data.mjs`, `node scripts/generate-skills-showcase-github-data.mjs`, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.
- Adversarial review: changed-file self-review plus targeted route/mirror scans found no current-diff issue. `scripts/skill-mirror-parity-audit.sh` still fails on known pack-level heading drift outside this global-skill boundary; no failures referenced the edited global skill files.

#### Completed Plan — Phase 4.3 Global Skill Routing
- Scope: update global skills that still route users to the legacy executable `icp` command so they route to `customer-discovery` instead, and rename the AFPS status stage `icp-needed` to `discovery-needed`.
- Files to inspect/edit first: `global/{codex,claude}/idea-scope-brief/SKILL.md`, `global/{codex,claude}/afps-status/SKILL.md`, `global/{codex,claude}/codebase-status/SKILL.md`, `global/{codex,claude}/skills/SKILL.md`, and `global/{codex,claude}/pack/SKILL.md`.
- Versioning: before changing any active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>` for each affected Codex and Claude skill directory, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace route examples and recommendations from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` using the correct agent syntax; preserve `enterprise-icp` as a distinct skill and preserve `research/icp.md` only when referring to the canonical customer-discovery output artifact.
- Validation: run targeted active-file scans over the edited global skill roots for `/icp`, `$icp`, `icp-needed`, and standalone `icp`; allow only intentional `enterprise-icp` and `research/icp.md` artifact references. Then run skill integrity checks (`scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`), refresh Skills Showcase data, run `scripts/validate-skills-showcase-data.sh`, run relevant targeted layer1 routing tests if present, and finish with `git diff --check`.

- [x] Update business-discovery pack skills (competitive-analysis, customer-feedback, enterprise-icp, lean-canvas, value-prop-canvas, positioning + 5 frameworks)

#### Phase 4.4 Review Notes
- Updated active business-discovery pack contracts so retired executable discovery routes now point to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Changed route-bearing mirrors for `competitive-analysis`, `customer-feedback`, `lean-canvas`, `value-prop-canvas`, `positioning`, and the five positioning framework subskills. `enterprise-icp` was inspected and left unchanged because its active references are intentional skill/artifact names, not retired executable routes.
- Preserved `research/icp.md`, `research/{slug}/icp.md`, and `enterprise-icp` as intentional artifacts/skill names.
- Archived and bumped affected mirrored active `SKILL.md` files: `competitive-analysis` v0.14, `customer-feedback` v0.5, `lean-canvas` v0.7, `value-prop-canvas` v0.7, `positioning` v0.12, and positioning framework subskills v0.4.
- Added `tests/layer1/business-discovery-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active business-discovery routing contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed. The first validation pass exposed generator ordering sensitivity because the two showcase generators both touch shared generated assets; rerunning them sequentially made `scripts/validate-skills-showcase-data.sh` pass.
- Validation passed: `pnpm --dir tests exec vitest run --project layer1 layer1/business-discovery-customer-discovery-routing.test.ts`, `pnpm --dir tests exec vitest run --project layer1 layer1/business-discovery-customer-discovery-routing.test.ts layer1/competitive-analysis-routing.test.ts layer1/routing-graph.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, sequential `node scripts/generate-skills-showcase-data.mjs` then `node scripts/generate-skills-showcase-github-data.mjs`, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, targeted active-file scan for retired executable routes, and `git diff --check`.
- Adversarial review: changed-file diff scan verified route changes stayed limited to command handoffs and version/changelog updates; no diff renamed the `research/icp.md` artifact or `enterprise-icp` skill.

#### Completed Plan — Phase 4.4 Business-Discovery Pack Routing
- Scope: update active business-discovery pack skills that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `enterprise-icp` as a separate skill and preserve `research/icp.md` only as the customer-discovery output artifact.
- Files to inspect/edit first: `packs/business-discovery/{codex,claude}/competitive-analysis/SKILL.md`, `customer-feedback/SKILL.md`, `enterprise-icp/SKILL.md`, `lean-canvas/SKILL.md`, `value-prop-canvas/SKILL.md`, `positioning/SKILL.md`, and positioning framework subskills under `packs/business-discovery/{codex,claude}/positioning/frameworks/*/SKILL.md`.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update the skill's `CHANGELOG.md`. If a framework subskill lacks a changelog, add one only if the local pattern for that framework directory expects it.
- Approach: replace command examples and next-step routes from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` using the correct runner syntax. Keep conceptual customer/profile language clear and avoid broad renames of the `research/icp.md` artifact until a separate artifact-rename decision exists.
- Validation: run targeted active-file scans over the edited business-discovery pack roots for `/icp`, `$icp`, `icp-needed`, and standalone `icp`; allow only intentional `enterprise-icp` and `research/icp.md` artifact references. Then run skill integrity checks (`scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`), refresh and validate Skills Showcase data, run relevant layer1 routing tests (`competitive-analysis-routing.test.ts`, `routing-graph.test.ts`, and any business-discovery-specific tests found by `rg`), and finish with `git diff --check`.

- [x] Update customer-lifecycle pack skills (journey-map orchestrator + 5 frameworks)

#### Phase 4.5 Review Notes
- Updated active customer-lifecycle `journey-map` contracts so missing customer-discovery prerequisites now route to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Changed the mirrored `journey-map` orchestrator and five journey-map framework subskills: `experience-map`, `jtbd-timeline`, `service-blueprint`, `user-story-map`, and `customer-journey-canvas`.
- Preserved `research/icp.md` and `research/{slug}/icp.md` as evidence artifact names; no artifact rename was performed.
- Archived and bumped affected mirrored active `SKILL.md` files: `journey-map` v0.10 and all five framework subskills v0.1.
- Added `tests/layer1/customer-lifecycle-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active journey-map contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed. The GitHub proof generator refreshed public repository metadata from fallback to current public metadata.
- Validation passed: `pnpm --dir tests exec vitest run --project layer1 layer1/customer-lifecycle-customer-discovery-routing.test.ts layer1/journey-map-routing.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, sequential `node scripts/generate-skills-showcase-data.mjs` then `node scripts/generate-skills-showcase-github-data.mjs`, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, corrected `rg --pcre2` active-file scan for retired executable routes, and `git diff --check`.
- Adversarial review: changed-file self-review plus targeted active-route scans verified the diff stayed limited to command handoffs, version/changelog/archive updates, generated showcase data, prompt history, task tracking, and the regression test; no diff renamed ICP artifacts.

#### Completed Plan — Phase 4.5 Customer-Lifecycle Journey-Map Routing
- Scope: update active customer-lifecycle journey-map contracts that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `research/icp.md` and `research/{slug}/icp.md` as the customer-discovery output artifacts.
- Files to inspect/edit first: `packs/customer-lifecycle/{codex,claude}/journey-map/SKILL.md` plus framework subskills under `packs/customer-lifecycle/{codex,claude}/journey-map/frameworks/{experience-map,jtbd-timeline,service-blueprint,user-story-map,customer-journey-canvas}/SKILL.md`.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace missing-discovery command examples and prerequisite routes from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` with correct runner syntax. Keep ICP terminology when it names the evidence artifact or customer-profile concept rather than the executable command.
- Validation: run targeted active-file scans over edited customer-lifecycle roots for backticked `$icp`, backticked `/icp`, `icp-needed`, and `Proceed to ICP`; allow only `research/icp.md` and `research/{slug}/icp.md` artifact references. Then run skill integrity checks, refresh and validate Skills Showcase data, run targeted layer1 journey/customer-discovery routing tests (`journey-map-routing.test.ts`, the business-discovery routing test if shared route text is touched, and any customer-lifecycle-specific tests found by `rg`), run `pnpm --dir apps/skills-showcase build`, and finish with `git diff --check`.
- [x] Update business-growth pack skills (experiment, gtm, hook-model, landing-copy, metrics, monetization, pmf-assessment)

#### Next Step Plan — Phase 4.6 Business-Growth Pack Routing
- Scope: update active business-growth pack skills that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `research/icp.md` and `research/{slug}/icp.md` only as customer-discovery output artifacts.
- Files to inspect/edit first: `packs/business-growth/{codex,claude}/experiment/SKILL.md`, `gtm/SKILL.md`, `hook-model/SKILL.md`, `landing-copy/SKILL.md`, `metrics/SKILL.md`, `monetization/SKILL.md`, and `pmf-assessment/SKILL.md`; if targeted scans find framework subskills under those roots with retired executable routes, include those subskills in the same routing pass.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace command examples, prerequisite guidance, and next-step routes from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` with correct runner syntax. Keep ICP terminology only where it names customer-profile concepts, `enterprise-icp`, or the `research/icp.md` evidence artifact.
- Validation: run targeted active-file scans over edited business-growth roots for backticked `$icp`, backticked `/icp`, `icp-needed`, `Proceed to ICP`, and standalone executable-route uses of `icp`; allow only intentional `research/icp.md`, `research/{slug}/icp.md`, and `enterprise-icp` references. Add or update a layer1 routing regression test for business-growth customer-discovery routing, then run relevant existing business-growth/routing tests found by `rg`, skill integrity checks, generated showcase refresh and validation, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.

#### Phase 4.6 Review Notes
- Updated active business-growth route-bearing contracts so retired executable discovery handoffs now route to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Changed mirrored `experiment`, `gtm`, `monetization`, and `pmf-assessment` active `SKILL.md` files. Inspected `hook-model`, `landing-copy`, and `metrics`; their active `icp` references are evidence-artifact or concept references, not retired executable route handoffs.
- Preserved `research/icp.md` and `research/{slug}/icp.md` as evidence artifact names; no artifact rename was performed.
- Archived and bumped affected mirrored active `SKILL.md` files: `experiment` v0.4, `gtm` v0.8, `monetization` v0.8, and `pmf-assessment` v0.6.
- Added `tests/layer1/business-growth-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active business-growth contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed.
- Validation passed: targeted `rg --pcre2` active-file scan for retired executable routes, `pnpm --dir tests exec vitest run --project layer1 layer1/business-growth-customer-discovery-routing.test.ts layer1/journey-map-routing.test.ts layer1/codex-interview-cadence.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, sequential Skills Showcase data generation, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build` after sandbox escalation, and `git diff --check`.
- Accepted pre-existing validation gap: an attempted broader targeted run including `layer1/product-path-manifest.test.ts` failed on already stale customer-discovery rename drift (`packs/business-discovery/{codex,claude}/icp/SKILL.md` paths are absent at `HEAD`, and `five-rings` lacks the product-path wording expected by that test). No current diff file is in that failing test's ownership path.
- Adversarial review: changed-file self-review plus targeted active-route scans verified the diff stayed limited to command handoffs, version/changelog/archive updates, generated showcase data, prompt history, task tracking, and the regression test; no diff renamed ICP artifacts or changed non-route business-growth behavior.

- [x] Update business-ops pack skills (assumption-tracker, burn-rate, cohort-review, mvp-gap, platform-strategy, product-line, reconcile-research, retro, risk-register, scale-audit)

#### Next Step Plan — Phase 4.7 Business-Ops Pack Routing
- Scope: update active business-ops pack skills that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `research/icp.md` and `research/{slug}/icp.md` only as customer-discovery output artifacts.
- Files to inspect/edit first: `packs/business-ops/{codex,claude}/assumption-tracker/SKILL.md`, `burn-rate/SKILL.md`, `cohort-review/SKILL.md`, `mvp-gap/SKILL.md`, `platform-strategy/SKILL.md`, `product-line/SKILL.md`, `reconcile-research/SKILL.md`, `retro/SKILL.md`, `risk-register/SKILL.md`, and `scale-audit/SKILL.md`; if targeted scans find framework subskills under those roots with retired executable routes, include those subskills in the same routing pass.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace command examples, prerequisite guidance, verdict labels, and next-step routes from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` with correct runner syntax. Keep ICP terminology only where it names customer-profile concepts, `enterprise-icp`, or the `research/icp.md` evidence artifact.
- Validation: run targeted active-file scans over edited business-ops roots for backticked `$icp`, backticked `/icp`, `icp-needed`, `Proceed to ICP`, and standalone executable-route uses of `icp`; allow only intentional `research/icp.md`, `research/{slug}/icp.md`, and `enterprise-icp` references. Add or update a layer1 routing regression test for business-ops customer-discovery routing, then run relevant existing business-ops/routing tests found by `rg`, skill integrity checks, generated showcase refresh and validation, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.

#### Phase 4.7 Review Notes
- Updated active business-ops route-bearing contracts so retired executable discovery handoffs now route to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Changed mirrored `mvp-gap`, `platform-strategy`, `product-line`, and `retro` active `SKILL.md` files. Inspected `assumption-tracker`, `burn-rate`, `cohort-review`, `reconcile-research`, `risk-register`, and `scale-audit`; their active `icp` references are evidence-artifact, enterprise-ICP, or concept references, not retired executable route handoffs.
- Preserved `research/icp.md`, `research/{slug}/icp.md`, `enterprise-icp`, and ICP concept language; no artifact rename or manifest schema rename was performed.
- Archived and bumped affected mirrored active `SKILL.md` files: `mvp-gap` v0.6, `platform-strategy` v0.7, `product-line` v0.3, and `retro` v0.3.
- Added `tests/layer1/business-ops-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active business-ops contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed. The GitHub proof generator refreshed public repository metadata from fallback to current public metadata.
- Validation passed: targeted `rg --pcre2` active-file scan for retired executable routes, `pnpm --dir tests exec vitest run --project layer1 layer1/business-ops-customer-discovery-routing.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, sequential Skills Showcase data generation, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.
- Accepted pre-existing validation gap: `tests/layer1/product-path-manifest.test.ts` also references business-ops `platform-strategy` and `product-line`, but current task notes already document that broader test as failing on stale customer-discovery rename drift outside this step. No current diff file is in the known absent `packs/business-discovery/{codex,claude}/icp/SKILL.md` ownership path.
- Adversarial review: changed-file self-review plus targeted active-route scans verified the diff stayed limited to command handoffs, version/changelog/archive updates, generated showcase data, prompt history, task tracking, and the regression test; no diff renamed ICP artifacts or changed non-route business-ops behavior.
- [x] Update product-design pack skills (brainstorm, prototype, spec-interview)

#### Next Step Plan — Phase 4.8 Product-Design Pack Routing
- Scope: update active product-design pack skills that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `research/icp.md` and `research/{slug}/icp.md` only as customer-discovery output artifacts.
- Files to inspect/edit first: `packs/product-design/{codex,claude}/brainstorm/SKILL.md`, `prototype/SKILL.md`, and `spec-interview/SKILL.md`; if targeted scans find framework subskills or adjacent product-design skills with retired executable routes, include only those route-bearing active `SKILL.md` files in the same pass.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace command examples, prerequisite guidance, verdict labels, and next-step routes from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` with correct runner syntax. Keep ICP terminology only where it names customer-profile concepts, `enterprise-icp`, or the `research/icp.md` evidence artifact.
- Validation: run targeted active-file scans over edited product-design roots for backticked `$icp`, backticked `/icp`, `icp-needed`, `Proceed to ICP`, and standalone executable-route uses of `icp`; allow only intentional `research/icp.md`, `research/{slug}/icp.md`, and `enterprise-icp` references. Add or update a layer1 routing regression test for product-design customer-discovery routing, then run relevant existing product-design/routing tests found by `rg`, skill integrity checks, generated showcase refresh and validation, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.

#### Phase 4.8 Review Notes
- Inspected active product-design `brainstorm`, `prototype`, and `spec-interview` mirrors plus adjacent active product-design skills; no active `SKILL.md` recommended the retired `$icp` or `/icp` executable, used `icp-needed`, or kept `Proceed to ICP`.
- Left active product-design `SKILL.md` files unchanged because their remaining ICP references are evidence-artifact or customer-profile concept references such as `research/icp.md`.
- Added `tests/layer1/product-design-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active product-design contracts.
- Refreshed Skills Showcase GitHub proof data after validation detected stale generated fingerprints.
- Validation passed: targeted active-file retired-route scan returned no matches, `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-customer-discovery-routing.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, sequential Skills Showcase data generation, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.
- Adversarial review: changed-file self-review plus targeted active-route scans verified the diff adds coverage and generated proof freshness only; no diff changed product-design runtime behavior, renamed ICP artifacts, or touched active skill metadata.
- [x] Update product-testing pack skills (dogfood, uat)

#### Next Step Plan — Phase 4.9 Product-Testing Pack Routing
- Scope: update active product-testing pack skills that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `research/icp.md` and `research/{slug}/icp.md` only as customer-discovery output artifacts.
- Files to inspect/edit first: `packs/product-testing/{codex,claude}/dogfood/SKILL.md` and `uat/SKILL.md`. Current scan shows retired executable handoffs in both dogfood and UAT mirrors, including follow-up routing lists and no-credible-user-journey prerequisite guidance.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace route examples and prerequisite recommendations from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` with correct runner syntax. Keep `research/icp.md` as an evidence artifact and keep ICP concept language only when it is not an executable route. Preserve existing `$journey-map`/`/journey-map`, `$guide`/`/guide`, and pack availability guard behavior.
- Validation: run targeted active-file scans over edited product-testing roots for backticked `$icp`, backticked `/icp`, `icp-needed`, `Proceed to ICP`, and standalone executable-route uses of `icp`; allow only intentional `research/icp.md`, `research/{slug}/icp.md`, and customer-profile concept references. Add or update a layer1 routing regression test for product-testing customer-discovery routing, then run relevant existing product-testing/routing tests found by `rg`, skill integrity checks, generated showcase refresh and validation, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.

#### Phase 4.9 Review Notes
- Updated active product-testing route-bearing contracts so retired executable discovery handoffs now route to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Changed mirrored `dogfood` and `uat` active `SKILL.md` files. Preserved `research/icp.md` as an evidence artifact and did not rename ICP concept language.
- Archived and bumped affected mirrored active `SKILL.md` files: `dogfood` v0.3 and `uat` v0.9.
- Added `tests/layer1/product-testing-customer-discovery-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active product-testing contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed.
- Validation passed: boundary-aware active-file retired-route scan, `pnpm --dir tests exec vitest run --project layer1 layer1/product-testing-customer-discovery-routing.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, sequential Skills Showcase data generation, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.
- Accepted pre-existing validation gap: a broader targeted run including `layer1/afps-alignment-preview-gates.test.ts` and `layer1/alignment-gates.test.ts` failed on stale customer-discovery rename drift (`packs/business-discovery/claude/icp/SKILL.md` absent at `HEAD`) and global `afps-status` alignment wording drift. No current diff file is in those failure ownership paths.
- Adversarial review: changed-file self-review plus targeted active-route scans verified the diff stayed limited to command handoffs, version/changelog/archive updates, generated showcase data, prompt history, task tracking, and the regression test; no diff renamed ICP artifacts or changed non-route product-testing behavior.
- [x] Update research-admin, repo-maintenance, docs-health, teardown, monorepo pack skills

#### Next Step Plan — Phase 4.10 Remaining Pack Routing
- Scope: update active research-admin, repo-maintenance, docs-health, teardown, and monorepo pack skills that still recommend or describe the retired executable `icp` command so they route to `customer-discovery`; preserve `research/icp.md` and `research/{slug}/icp.md` only as customer-discovery output artifacts.
- Files to inspect first: active `SKILL.md` files under `packs/research-admin/{codex,claude}/`, `packs/repo-maintenance/{codex,claude}/`, `packs/docs-health/{codex,claude}/`, `packs/teardown/{codex,claude}/`, and `packs/monorepo/{codex,claude}/`. Use targeted scans to identify only route-bearing contracts before editing.
- Versioning: before changing each active `SKILL.md`, run `scripts/skill-archive.sh <skill-dir>`, bump the decimal `version:` field, and update each skill's `CHANGELOG.md`.
- Approach: replace command examples, prerequisite guidance, verdict labels, and next-step routes from `$icp`/`/icp` to `$customer-discovery`/`/customer-discovery` with correct runner syntax. Keep ICP terminology only where it names customer-profile concepts, `enterprise-icp`, or the `research/icp.md` evidence artifact.
- Validation: run targeted active-file scans over edited roots for backticked `$icp`, backticked `/icp`, `icp-needed`, `Proceed to ICP`, and standalone executable-route uses of `icp`; allow only intentional `research/icp.md`, `research/{slug}/icp.md`, and `enterprise-icp` references. Add or update a layer1 routing regression test for the remaining packs, then run relevant existing routing tests found by `rg`, skill integrity checks, generated showcase refresh and validation, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.

#### Phase 4.10 Review Notes
- Updated active remaining-pack route-bearing contracts so retired executable discovery handoffs now route to `customer-discovery` with correct Codex `$...` and Claude `/...` syntax.
- Changed mirrored `research-roadmap`, `bootstrap-repo`, `desk-flip`, and `scaffold` active `SKILL.md` files. Inspected `docs-health` active skill files; their remaining `icp` references are evidence-artifact references such as `research/icp.md`, not retired executable handoffs.
- Preserved `research/icp.md`, `research/{slug}/icp.md`, and ICP concept language; no artifact rename was performed.
- Archived and bumped affected mirrored active `SKILL.md` files: `research-roadmap` v0.14, `bootstrap-repo` v0.2, `desk-flip` v0.3, and `scaffold` v0.1.
- Added `tests/layer1/remaining-packs-customer-discovery-routing.test.ts` and updated `tests/layer1/research-roadmap-routing.test.ts` to prevent regression to `$icp`, `/icp`, `icp-needed`, or `Proceed to ICP` in active remaining-pack contracts.
- Refreshed Skills Showcase generated data after tracked `SKILL.md` metadata changed. The successful Next.js build updated `apps/skills-showcase/next-env.d.ts` from dev route types to build route types.
- Validation passed: boundary-aware active-file retired-route scan, `pnpm --dir tests exec vitest run --project layer1 layer1/remaining-packs-customer-discovery-routing.test.ts layer1/research-roadmap-routing.test.ts`, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, sequential Skills Showcase data generation, `scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.
- Adversarial review: changed-file self-review plus targeted active-route scans verified the diff stayed limited to command handoffs, version/changelog/archive updates, generated showcase data, build-generated type metadata, prompt history, task tracking, and regression tests; no diff renamed ICP artifacts or changed non-route remaining-pack behavior.
- [x] Rename afps-status stage `icp-needed` → `discovery-needed`

## Future Work

- [x] Refactor competitive-analysis to orchestrator pattern (Porter's Five Forces, SWOT, etc. as framework subskills)

### Completed Plan — Competitive-Analysis Orchestrator Refactor
- Scope: convert mirrored `competitive-analysis` from a single primary research skill into a Pattern A framework-decomposition orchestrator while preserving the canonical output paths `research/competitive-analysis.md`, `research/{slug}/competitive-analysis.md`, and the existing staged research/report-first approval contract.
- Files to inspect/edit first: `packs/business-discovery/{codex,claude}/competitive-analysis/SKILL.md`, `CHANGELOG.md`, `ALIGNMENT-PAGE.md`, related archives, `docs/orchestrator-convention.md`, `docs/skill-invocation-types.md`, `docs/skills-reference.md`, `tests/layer1/competitive-analysis-routing.test.ts`, `tests/layer1/business-discovery-customer-discovery-routing.test.ts`, and benchmark coverage fixtures that mention `competitive-analysis`.
- Candidate framework subskills: create mirrored `frameworks/porter-five-forces`, `frameworks/swot`, `frameworks/strategic-group-map`, and `frameworks/feature-pricing-matrix` unless a tighter scan finds an existing local taxonomy that should be reused. New framework subskills start at `version: v0.0`, use `invocation: sub-skill`, declare `parent: competitive-analysis`, and write intermediate artifacts such as `research/competitive-analysis-porter-five-forces.md` or product-path equivalents.
- Parent contract changes: archive and bump active `competitive-analysis` mirrors; add `invocation: orchestrator`; define framework-selection mode, synthesis mode (`--synthesize`), any shortcut modes, framework queue writing to `tasks/todo.md`, synthesis requirements, and no-next-step-routing behavior before approval. Preserve web-search/source-citation requirements and the current concept-validation gap-assessment behavior.
- Tests first: add or update layer1 tests proving the parent is an orchestrator, framework subskills exist in both mirrors, subskills avoid downstream routing, canonical output paths remain stable, and current customer-discovery/AFPS routing still passes.
- Validation: run targeted competitive-analysis tests, related business-discovery/customer-discovery routing tests, `scripts/skill-versions.sh --missing`, `scripts/skill-archive-audit.sh --strict`, `scripts/skill-deps.sh --broken`, `scripts/skill-pack-routing-audit.sh`, `node scripts/upgrade-alignment-page.mjs --dry-run`, Skills Showcase data refresh/validation, `pnpm --dir apps/skills-showcase build`, and `git diff --check`.

#### Phase Review Notes
- Converted active Codex and Claude `competitive-analysis` parents to `invocation: orchestrator` at v0.15, with Mode A framework selection and Mode B `--synthesize` while preserving canonical `research/competitive-analysis.md`, `research/{slug}/competitive-analysis.md`, search-log paths, staged research, report-first approval, and post-synthesis AFPS routing.
- Added mirrored framework subskills for `porter-five-forces`, `swot`, `strategic-group-map`, and `feature-pricing-matrix`; each starts at v0.0, declares `parent: competitive-analysis`, writes an intermediate `research/competitive-analysis-*.md` artifact, has generated `ALIGNMENT-PAGE.md`, and explicitly avoids downstream routing.
- Updated invocation taxonomy, orchestrator convention docs, benchmark coverage metadata, and layer1 routing coverage for the new orchestrator/subskill contract.
- Refreshed Skills Showcase generated data for 315 skills and 37 packs. No curated website copy changed because the public catalog is generated from skill metadata and the existing copy surfaces do not have bespoke `competitive-analysis` framework descriptions.
- Validation passed: `pnpm --dir tests exec vitest run --project layer1 layer1/competitive-analysis-routing.test.ts layer1/business-discovery-customer-discovery-routing.test.ts`; `pnpm --dir tests exec vitest run --project layer1 layer1/bench-coverage.test.ts layer1/bench-setups.test.ts`; `scripts/skill-versions.sh --missing`; `scripts/skill-archive-audit.sh --strict`; `scripts/skill-deps.sh --broken`; `scripts/skill-pack-routing-audit.sh`; `node scripts/upgrade-alignment-page.mjs --dry-run`; sequential Skills Showcase generation plus `scripts/validate-skills-showcase-data.sh`; `pnpm --dir tests bench:coverage`; active-file retired-route scan; `pnpm --dir apps/skills-showcase build`; and `git diff --check`.
- Benchmark harness cleanup: the broader benchmark layer1 run initially exposed stale harness issues in `benchmark-test-skill` deterministic wording and missing `repo-glossary` setup registration. Both were fixed in the same boundary, and the rerun passed 92/92 tests.
- Adversarial review: changed-file self-review plus targeted scans verified the parent owns synthesis/routing, subskills are route-free, active files do not reintroduce `$icp`/`/icp`/`icp-needed`/`Proceed to ICP`, and generated assets only reflect the new skill metadata.

## Backlog

- [x] Update the skills showcase pack list with the correct number of skills per pack and ensure all packs are represented

### Next Step Plan — Skills Showcase Pack List Coverage
- Scope: audit the Skills Showcase pack list/count presentation so every active pack is represented and counts match generated source data after the new competitive-analysis framework subskills increased the catalog size.
- Files to inspect first: `apps/skills-showcase/app/packs`, `apps/skills-showcase/components`, `docs/skills-showcase/assets/skills-data.js`, `apps/skills-showcase/public/assets/skills-data.js`, `apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`, and any tests that reference pack counts or pack-card rendering.
- Approach: identify whether the incorrect counts are generated-data, UI grouping, static copy, or filtering issues; prefer deriving displayed counts directly from generated pack/skill data rather than maintaining parallel static numbers. Keep unrelated visual redesign backlog items out of scope.
- Validation: run the relevant Skills Showcase unit/route tests if present, `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`, `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`, `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`, `pnpm --dir apps/skills-showcase build`, targeted `rg` checks for stale hard-coded pack counts, and `git diff --check`.

#### Review Notes — Skills Showcase Pack List Coverage
- Updated `scripts/generate-skills-showcase-data.mjs` so active nested pack skills such as framework subskills are included while archive snapshots remain excluded.
- Generated pack rows now include every active `PACK.md` metadata row plus compatibility aliases with active skill roots. Current generated data reports 355 skill rows and 39 pack rows.
- The `/packs` UI now renders generated skill counts on pack nodes and detail panels, and labels `business-app` and `creator-media` as compatibility aliases with zero direct skills.
- Added `tests/layer1/skills-showcase-pack-coverage.test.ts` to guard active pack metadata coverage and nested framework skill counts.
- Updated the stale benchmark-demo fixture in `tests/layer1/skills-showcase-benchmark-demo.test.ts` to target the demo-backed Codex `pack` benchmark row.
- Validation passed: focused pack coverage layer1 test, focused catalog UI test, combined generated-data layer1 tests, sequential Skills Showcase data/proof generation, generated-data freshness validation, local `/packs` HTTP 200 check, production app build, adversarial invariant scans, and `git diff --check`.
- Quality-gate manifest: `tasks/ship-manifest-2026-06-08-skills-showcase-pack-counts.md`.

- [x] On drawer close, collapse all cards onto the single visible top-left-most card (reverse of the fan-out animation on open) before animating the card back into the card pack. Use the visible top-left-most card rather than the absolute first card in the list because the user may have scrolled down before closing the drawer

### Next Step Plan — Drawer Close Visible Top-Left Collapse
- Execution profile: serial; review-first (verify-and-reconcile before any source change). Rationale: one component boundary in the Skills Showcase prototype route; the backlog item may already be implemented (lesson from the bench-harness High items, where the plan assumed open issues that `f7eb21cf` had already fixed — verify against source and git history before writing new code).
- Scope: verify and reconcile the drawer-close backlog item for the prototype pack animation. Current code already contains visible top-left target selection logic in `apps/skills-showcase/src/components/PackOpener.tsx`; the next pass should determine whether the backlog item is stale, partially implemented, or still missing proof.
- Files to inspect first: `apps/skills-showcase/src/components/PackOpener.tsx`, `apps/skills-showcase/src/components/SealedPack.tsx`, `apps/skills-showcase/app/prototype/page.tsx`, `apps/skills-showcase/src/components/prototype-close-sequence.test.tsx`, and any debug/alignment artifacts under `apps/skills-showcase/alignment/` that describe the close sequence.
- Approach: read the existing close phase chain (`closing-collapse` → `closing-apex` → `sheet-exiting` → `card-settling`), verify whether `PackOpener` already collapses to the visible top-left card after scroll, and add or update focused tests only if proof is missing. Keep the scope to close-collapse behavior; do not redesign the full pack drawer.
- Validation: run focused prototype close-sequence tests, app typecheck/build if source changes, a local `/prototype` route check, and `git diff --check`. If the item is already implemented with sufficient tests, mark it complete with review notes instead of changing source.
- Acceptance criteria: the backlog checkbox is either checked with proof (existing or new focused tests covering scroll-then-close picking the visible top-left card) or remains open with a concrete gap statement; layer1 stays at 0 failed; no unrelated drawer redesign.
- Ship-one-step handoff contract: the next clear-context implementation session must implement only this step, validate it, then run `/ship` when done.

#### Review Notes — Drawer Close Visible Top-Left Collapse

- Verified the implementation already exists in `apps/skills-showcase/src/components/PackOpener.tsx`: on close it finds the scrollable drawer viewport, ignores cards fully outside that viewport, chooses the top-most visible row with a 10px tolerance, then chooses the left-most card in that row as `targetIndex`.
- Git history confirms this was not new implementation work in this session: the visible target-selection logic dates to `fcc302a5e` and row-buffered collapse behavior dates to `37c22b11`.
- Added the previously untracked focused proof file `apps/skills-showcase/src/components/pack-opener-collapse-target.test.tsx` to the shipping boundary. It covers unscrolled collapse to card 0, scrolled collapse to the visible top-left card, left-most selection inside the visible row, and partially visible top-row behavior.
- Validation passed: `pnpm --dir apps/skills-showcase exec vitest run src/components/pack-opener-collapse-target.test.tsx` (1 file / 4 tests) and `pnpm --dir apps/skills-showcase exec vitest run src/components/prototype-close-sequence.test.tsx` (1 file / 7 tests).
- Root cause of the stale next-work route: `tasks/todo.md` had an unchecked backlog item even though source already implemented the behavior and a matching proof file was present locally but untracked. The task is now checked off with evidence.

## Code Review Fixes
> Generated by `/expert-review` on 2026-05-29. Critical and high-priority items resolved 2026-05-29–2026-05-30; the three High items below were verified resolved and their checkboxes reconciled on 2026-06-10.

### High (resolved 2026-05-30 in `f7eb21cf`; verified + coverage extended 2026-06-10)
- [x] [tests/layer4/helpers/disposable-repo.ts:107-126; git-fixture-sync.setup.ts:54-56] `cleanupRepo` runs `gh repo delete ${repoSlug} --yes` with `autoConfirm` hardwired to true and no validation of `repoSlug`; if `getGhUser()` falls back to `"unknown"` it targets `unknown/<name>`. Fix: assert `repoSlug` matches `^[\w.-]+/agentic-skills-bench-[\w.-]+$` and refuse when the user is `"unknown"`; switch to `execFileSync` (no shell). — Fixed in `f7eb21cf` (`isSafeBenchRepoSlug` guard + `execFileSync`); covered by `tests/layer1/code-review-test-infra-fixes.test.ts`.
- [x] [tests/layer4/helpers/disposable-repo.ts:49-75, 82] `createDisposableRepo` (and the sync setup's `sync-upstream-` clone) create temp dirs via `mkdtempSync` that are never removed — `cleanup()` only deletes the GitHub repo. A 100-run benchmark leaks 100+ cloned repos to disk. Fix: have `cleanup()` also `rmSync` the mkdtemp parent and the upstream clone dir. — Fixed in `f7eb21cf` (`removeLocalDir` in `cleanupRepo`, inline `rmSync` of the upstream clone in the sync setup); gh-free cleanup-path tests added 2026-06-10 in `tests/layer1/code-review-test-infra-fixes.test.ts`.
- [x] [tests/harness/bench-persistence.ts:84-101] `findResumeableSession` sorts session dirs (`${skill}-${agent}-${randomUUID8}`) by the random id, not by time, so `--resume` can attach to an arbitrary older session and miscount cost/runs. Fix: sort by manifest `createdAt`/`updatedAt`, or timestamp-prefix the dir names. — Fixed in `f7eb21cf` (`pickResumeableManifest` sorts by manifest `updatedAt`/`createdAt`); covered by `tests/layer1/code-review-test-infra-fixes.test.ts`.

## Active — Claude Last-24h Usage Feedback

- [x] Capture `$analyze-sessions` invocation prompt history.
- [x] Parse full available Claude history for the last 24 hours.
- [x] Inspect available Claude metadata for subagent, parallel-session, context, skill, and usage signals.
- [x] Produce `alignment/analyze-sessions-claude-usage-feedback.html`.
- [x] Record validation and final recommendation notes.

### Add-On Plan — Claude Usage Cost Translation

- [x] Verify whether local Claude logs expose direct billed or estimated cost fields for the report window.
- [x] Verify a current provider pricing table before estimating cost from tokens.
- [x] Update `alignment/analyze-sessions-claude-usage-feedback.html` with actual-cost availability, estimated API-equivalent cost, formula assumptions, and cost breakdowns.
- [x] Validate the edited HTML and record review notes.

#### Review Notes — Claude Usage Cost Translation

- Local Claude logs for the report window reproduced the original report totals exactly: 4,490 usage records and 206,983,852 raw transcript tokens.
- No direct local invoice, subscription, credit, CCU, or dashboard dollar fields were found for the report window, so the HTML now labels actual billed cost as unavailable.
- Added an estimated API-equivalent cost of $517.90 using Anthropic Claude API pricing verified on 2026-06-10: $477.21 for `claude-fable-5` and $40.68 for `claude-opus-4-6`.
- Added model, token-class, and top-project cost breakdowns, plus caveats excluding managed-agent runtime, subscription-plan effects, private discounts, dashboard weighting, and provider-side adjustments.
- Validation passed: structural HTML smoke for required cost text, feedback controls, review gates, compile section, table count, and no embeds; targeted `rg` checks for cost/source language; and `git diff --check` on the touched files.

### Review Notes — Claude Last-24h Usage Feedback
- Confirmed the pasted Claude usage panel directionally from local logs, with an explicit caveat that provider-side dashboard weighting is not available locally.
- Parsed `~/.claude/history.jsonl`, `~/.claude/projects/**/*.jsonl`, `~/.claude/projects/**/subagents/**/*.meta.json`, workflow journals, and `~/.claude/sessions/*.json`.
- Key local findings: sessions with any subagent account for 67.6% raw token volume and 75.0% with a 0.1 cache-read weight; workflow-subagent is 14.3% raw; `Explore` is 4.4%, `general-purpose` 2.8%, and `Plan` 1.9%; high-context usage is 35.7% raw and 22.7% with a 0.1 cache-read weight.
- Highest-impact recommendation: tighten workflow/deep-research fan-out with explicit depth modes, source/extractor/verifier caps, and a preview before spawning broad subagent sets.
- Best new-skill candidate: a personal `project-portfolio-status` / GitHub portfolio status skill, kept out of general shared skills because the last-24h prompt explicitly framed it as personal to this user.
- Produced and indexed the review page at `alignment/analyze-sessions-claude-usage-feedback.html`.
- Validation passed: HTML parser smoke for the new page and `alignment/index.html`; targeted `rg` checks for category, alignment status, compile controls, and index link; structural count check for gates/feedback/tables/no embeds/viewport; `git diff --check`.
- Browser open status: `node scripts/open-html-page.mjs alignment/analyze-sessions-claude-usage-feedback.html --browser auto` returned `blocked`; artifact verification still passed.

### Review Notes — ui-interview manifest visibility fix (2026-06-10)

- Routed via `/targeted-skill-builder` per the approved session-triage fix plan: existing-skill update, ui-interview v0.12 → v0.13 (Claude + Codex pack mirrors), archives created with `scripts/skill-archive.sh`, CHANGELOGs updated, installed copies synced via `scripts/pack.sh refresh` (doctor: ok).
- New contract: confirmation manifests/checklists (UI Assumptions Manifest, Content Requirements Manifest, coverage checkpoint) must use a guaranteed-visible channel — AskUserQuestion option previews or turn-final text (Claude); manifest as the final output of its own turn with next-turn confirmation (Codex).
- Validation: `skill-deps.sh --broken` clean; `skill-versions.sh --missing` clean (423 skills); `git diff --check` clean; showcase data regenerated (`apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`, ui-interview v0.13 present in `skills-data.js`). `skill-next-step-routing.sh --missing` reports a pre-existing ~120-file backlog untouched by this change. Bench coverage row for ui-interview already exists; no new layer4 setup — the change is a presentation-channel constraint not deterministically scoreable in layer1, recorded here as the deferred-quality rationale.
- Follow-up flagged (not fixed): the same confirm-without-visible-manifest pattern exists in `packs/product-design/{claude,codex}/ux-variations` and `feature-interview`.
