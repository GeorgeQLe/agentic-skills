# Ship Manifest - VARD/ORD Staged Scan Workflow

Date: 2026-06-11

## User Goal

Implement the supplied plan to upgrade the four active VARD/ORD scan research skills to a strict scope-first staged research workflow, verify the active research audit reaches 0 non-compliant skills, then commit and push on `master`.

## Changed Files

- `prompts/create-agentic-skill/skill-prompt-20260610-201912-vard-ord-staged-scan.md`
- `prompts/exec/skill-prompt-20260610-202327-exec.md`
- `packs/vard/codex/vard-scan/SKILL.md`
- `packs/vard/codex/vard-scan/CHANGELOG.md`
- `packs/vard/codex/vard-scan/ALIGNMENT-PAGE.md`
- `packs/vard/codex/vard-scan/archive/v0.0/SKILL.md`
- `packs/vard/claude/vard-scan/SKILL.md`
- `packs/vard/claude/vard-scan/CHANGELOG.md`
- `packs/vard/claude/vard-scan/ALIGNMENT-PAGE.md`
- `packs/vard/claude/vard-scan/archive/v0.0/SKILL.md`
- `packs/ord/codex/ord-scan/SKILL.md`
- `packs/ord/codex/ord-scan/CHANGELOG.md`
- `packs/ord/codex/ord-scan/ALIGNMENT-PAGE.md`
- `packs/ord/codex/ord-scan/archive/v0.0/SKILL.md`
- `packs/ord/claude/ord-scan/SKILL.md`
- `packs/ord/claude/ord-scan/CHANGELOG.md`
- `packs/ord/claude/ord-scan/ALIGNMENT-PAGE.md`
- `packs/ord/claude/ord-scan/archive/v0.0/SKILL.md`
- `docs/skills-showcase/assets/skills-data.js`
- `apps/skills-showcase/public/assets/skills-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/benchmark-results-matrix.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-11-vard-ord-staged-scan.md`

## Per-File Purpose

- Prompt history: captures the visible user invocations that triggered the repo-managed skill update and this `$exec` validation/shipping pass.
- Active VARD/ORD scan `SKILL.md` files: bump to v0.1 and add report-first approval, staged research, evidence/feedback handling, explicit preliminary packet paths, canonical artifact paths, and alignment-page stubs.
- Changelogs and archives: satisfy skill versioning by preserving v0.0 and documenting v0.1 behavior.
- Generated `ALIGNMENT-PAGE.md` bundles: provide the standard alignment-page instructions beside each scan skill.
- Skills Showcase generated assets and benchmark matrix: refresh public generated data after active skill metadata changed.
- Task/history/manifest files: record the plan, review notes, validation, and shipping boundary.

## User-Goal Mapping

- Stage 1 now forbids synthesized research, candidate ranking, recommendations, working packets, and canonical writes before final compiled YAML approves scope.
- Stage 2 now writes only `research/_working/preliminary-vard-scan-research.md` or `research/_working/preliminary-ord-scan-research.md`, with product-path equivalents under `research/{slug}/_working/`.
- Stage 3 now archives the working packet, removes the active working packet, writes `research/vard-scan.md` or `research/ord-scan.md` with product-path equivalents, and confirms the alignment page.
- `vard-align` and `ord-align` routing remains the next command only after approved canonical artifact write.

## Tests Run

- `node scripts/upgrade-alignment-page.mjs` - wrote 4 generated bundles.
- `node scripts/upgrade-alignment-page.mjs --check` - passed with 0 updates, 288 ownable bundles exact.
- `node scripts/upgrade-alignment-page.mjs --dry-run` - passed with 0 updates and 288 ownable bundles exact.
- Active staged research audit - passed: 138 active `type: research` skills, 0 non-compliant.
- Targeted marker, artifact, and runner-command scans for report-first gate, staged workflow, explicit VARD/ORD preliminary packet paths, changelogs, archives, generated bundles, and Claude/Codex route syntax - passed.
- `bash scripts/skill-versions.sh --missing` - passed, all 423 skills have a version field.
- `bash scripts/skill-archive-audit.sh --strict` - passed, 383 skills checked, 0 violations.
- `bash scripts/skill-deps.sh --broken` - passed, no broken references.
- `bash scripts/skill-pack-routing-audit.sh` - passed, no cross-pack recommendation gaps.
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs` - generated 373 skills and 41 packs.
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs` - generated proof assets.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` - passed.
- `pnpm --dir apps/skills-showcase build` - passed; Next.js built 15 static pages and the dynamic tRPC route.
- `pnpm --dir tests exec vitest run --project layer1 layer1/alignment-gates.test.ts` - passed, 26 tests.
- `git diff --check` - passed.

## Skipped Tests

- Full test suite was skipped because the active research compliance scan, target-specific marker/artifact/runner scans, focused alignment-gates layer1 test, skill hygiene checks, generated-data validator, and Skills Showcase build cover the changed skill contracts and generated app data without expanding into unrelated packages.
- Deploy was skipped. The task is a repo skill-contract update with generated static data refresh; production deployment is outside the user request and requires explicit deploy confirmation.

## Adversarial Review

- Checked that Stage 1 cannot leak candidate rankings, recommendations, or working packets before scope approval.
- Checked that Stage 2 contains both the generic `preliminary-<skill>-research.md` contract required by shared tests and the explicit VARD/ORD packet names required by the user plan.
- Checked that Stage 3 removes active `_working` packets and writes canonical scan artifacts only after clean final artifact approval.
- Checked generated showcase data: public command syntax now shows `$vard-scan` and `$ord-scan` for Codex, while Claude keeps slash commands.
- Checked curated Skills Showcase copy, catalog grouping, workflow animation text, and proof receipt copy; no manual copy edits were needed because titles, descriptions, grouping, and proof copy did not change apart from generated versions/fingerprints.
- Exploratory `bash scripts/skill-mirror-parity-audit.sh` failed on 28 unrelated pre-existing heading-drift pairs and did not name VARD/ORD. The script has no scoped mode, so target-specific marker, artifact, and runner-command scans were used as the boundary review.

## Residual Risk

- The broad mirror parity audit remains red on 28 unrelated pre-existing heading-drift pairs outside the VARD/ORD scan skills. Future mirror-parity remediation should either update the allowlist or fix those pairs directly; this boundary did not broaden into that repo-wide cleanup.
- Full layer1/full test-suite coverage was not run; the risk is an unrelated test catching generated data or alignment convention drift outside the targeted VARD/ORD path. The focused checks above cover the changed skill contracts and generated showcase assets.

## Rollback Note

Revert this commit to restore the four scan skills to v0.0 behavior and remove the generated bundles/changelogs/archives introduced for this staged workflow. Regenerate Skills Showcase data after rollback if the revert does not include generated assets.

## Next Command

`$exec`
