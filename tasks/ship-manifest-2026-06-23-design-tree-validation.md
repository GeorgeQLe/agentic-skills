# Ship Manifest - Design-Tree Step 1.9 Validation

## User goal

Run `$exec` for the next incomplete task, which resolved to Step 1.9: focused and repository contract validation for the Design-Tree Branch Prioritization And UI Experiment Split phase.

## Changed files

- `apps/skills-showcase/public/assets/github-proof-data.js`
- `docs/skills-showcase/assets/github-proof-data.js`
- `prompts/exec/skill-prompt-20260623-195520-exec.md`
- `tasks/todo.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-23-design-tree-validation.md`

## Per-file purpose

- `apps/skills-showcase/public/assets/github-proof-data.js`: refreshed the generated GitHub proof `sourceFingerprint` after the validator detected stale generated data.
- `docs/skills-showcase/assets/github-proof-data.js`: kept the docs mirror of the generated GitHub proof data in sync with the app copy.
- `prompts/exec/skill-prompt-20260623-195520-exec.md`: captured the visible `$exec` invocation and pasted skill context required by the repository prompt-history contract.
- `tasks/todo.md`: marked Step 1.9 complete, recorded validation results, accepted residuals, and the next-step plan for Step 1.10.
- `tasks/history.md`: added a concise project history entry for the validation closeout.
- `tasks/ship-manifest-2026-06-23-design-tree-validation.md`: records this exact shipping boundary and quality evidence.

## User-goal mapping

- Step 1.9 required validation, not product-design source edits. The validation commands passed or produced one concrete generated-data drift, which was fixed through the owning showcase generators.
- The generated proof data changes satisfy the stale-data finding from `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`.
- The task and history updates preserve the execution evidence and prepare the next `$exec` step.

## Tests run

- `pnpm --dir tests exec vitest run --project layer1 layer1/product-design-flow-tree.test.ts` — passed, 1 file and 14 tests.
- `node scripts/upgrade-design-tree-loop.mjs --check` — passed, 20 skills checked, 0 reference updates, 0 bundle writes.
- `node scripts/upgrade-alignment-page.mjs --check` — passed, 0 updates and 0 bundled file writes.
- `scripts/skill-archive-audit.sh --strict` — passed, 400 skills checked, 0 violations.
- `scripts/skill-mirror-parity-audit.sh --verbose` — exited non-zero only for the known unrelated `session-analytics/session-triage` `Pack Availability Guard` drift; accepted residual.
- `apps/skills-showcase/scripts/validate-skills-showcase-data.sh` — initially failed with stale GitHub proof data, then passed after regeneration.
- `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs` — passed.
- `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs` — passed.
- `npm run skillpacks:verify` — passed.
- `node scripts/audit-task-docs.mjs` — passed with informational advisory counts only.
- `git diff --check` — passed.

## Skipped tests

- `node scripts/upgrade-interrogation-page.mjs --check` was skipped because Step 1.7 did not register `create-ui-experiment` in `INTERROGATION_SKILLS`; no interrogation bundle is expected for this phase.
- A full Skills Showcase app build was not run because this step changed only generated proof-data fingerprints, not app source, dependencies, or route behavior. The owning showcase data validator covered the changed generated assets.

## Adversarial review

Changed-file self-review plus targeted validation:

- Verified the only generated runtime asset diff is the matching `sourceFingerprint` update in the app and docs GitHub proof data files.
- Re-ran the showcase validator after generator remediation to prove the generated-data set is fresh.
- Confirmed no product-design source files changed during the validation remediation.
- Confirmed the mirror-parity failure is the same unrelated `session-analytics/session-triage` shared-section drift documented in prior review notes.

Findings fixed: stale GitHub proof-data fingerprint generated assets.

Accepted residual: unrelated `session-analytics/session-triage` mirror parity drift remains outside this phase's product-design scope.

## Residual risk

The remaining risk is limited to the known unrelated mirror-parity failure. Product-design branch routing behavior is covered by the focused layer1 test and generator checks. The proof-data asset change is fingerprint-only and was produced by the owning generator, so the user-visible Skills Showcase data shape should not change.

## Rollback note

Revert this commit to restore the previous proof-data fingerprints and task evidence. If only the generated proof-data refresh caused trouble, rerun `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs` from the desired source state and commit the regenerated app/docs copies together.

## Next command

`$exec`
