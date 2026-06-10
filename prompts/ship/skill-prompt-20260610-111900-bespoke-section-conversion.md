---
skill: ship
agent: claude
captured_at: 2026-06-10T15:19:00Z
source: plan-handoff-contract
prompt_scope: visible-user-invocation
---

/ship was invoked per the ship-one-step handoff contract embedded in the visible user invocation below (a clear-context plan-implementation message, not a typed /ship command).

Implement the following plan:

# Next step: Bespoke Alignment Section Conversion/Testing (Drift Plan Phase 2 Step 5)

## Ship summary (just completed)

- Shipped Drift Plan Phase 2 Step 4: `scripts/upgrade-alignment-page.mjs --check` is now a no-write repo-state gate that exits 1 with named per-skill diagnostics (`Stale generated bundle`, `Missing generated bundle`, `Stale SKILL.md stub`) when an ownable skill's `ALIGNMENT-PAGE.md` drifts from expected renderer output, plus a `Generated bundles: N ownable, exact|DRIFT` summary line. Plain `--dry-run` keeps exit 0 (preview workflow preserved). Current repo: 270 ownable, exact. 6 new layer1 tests (17 in file).
- **Boundary anomaly:** a concurrent session shipping the `env-setup` skill committed and pushed this session's source changes inside its grouped commits (`8534bf21` mixes alignment + env-setup files; `8e78309b` env-setup showcase/docs). Work is correct and pushed; no history rewrite on pushed master. Documented in `tasks/ship-manifest-2026-06-10-generated-bundle-drift-check.md`. Task docs/manifest/prompt history shipped separately as `8f94e12f`.
- Tests: full layer1 suite passes — 55 files / 2188 tests / 0 failed (includes the concurrent env-setup test file). No failing tests, expected or otherwise.
- Deploy skipped for this boundary: no Skills Showcase changes in the Step 4 work (`tasks/deploy.md` covers only the showcase). Note: the concurrent `8e78309b` did touch showcase data; that deploy belongs to the env-setup session's boundary.
- Manual tasks: 4 pending in `tasks/manual-todo.md` (non-blocking). Advisory: 2 recurring items pending, not selectable as next work.
- Settings note: `defaultMode: acceptEdits` addition to `.claude/settings.local.json` was denied by the permission classifier; `showClearContextOnPlanAccept` is already `true`.

## Next step (full plan in `tasks/todo.md`, top section "Bespoke Alignment Section Conversion/Testing")

Resolve the 7 allowlisted bespoke skills (`consolidate-variations`, `prototype`, `spec-interview`, `ui-interview`, `ux-variations`, `uat`, `research-roadmap` — 14 mirror sections, no bundles today, all already in the generator's gate map):

- Per skill, diff the bespoke `## Alignment Page` section against the generated render (`bundledContentFor`) and record a convert/keep verdict.
- Convert where subsumed: stub paragraph in both mirrors + allowlist entry removed + write-mode bundle generation in the same commit (check the `customer-discovery` precedent `8c655082` for version/archive handling).
- Keep where genuinely custom: add layer1 contract tests pinning section invariants (own output path, gate language, mirror symmetry).
- Validate: `--check` exit 0 with reduced allowlist, full layer1 0 failed, `git diff --check` clean.
- Files: 14 `SKILL.md` mirrors, `scripts/alignment-bespoke-list.txt`, `tests/layer1/upgrade-alignment-page-bespoke.test.ts`, new `ALIGNMENT-PAGE.md` bundles for conversions, `tasks/todo.md`.
- Execution profile: serial.

**Ship-one-step handoff contract:** implement only this step, validate it, then run `/ship` when done.

**Next work:** Bespoke Alignment Section Conversion/Testing (Drift Plan Phase 2 Step 5)
**Recommended next command:** /exec
