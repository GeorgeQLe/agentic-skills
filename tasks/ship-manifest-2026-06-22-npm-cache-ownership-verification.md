# Ship Manifest - npm Cache Ownership Verification

## User goal

Wrap up the npm cache ownership verification session with task/history records, prompt history, validation evidence, and a clean commit on the primary branch.

## Changed files

- `prompts/ship-end/skill-prompt-20260622-001159-wrap-up.md`
- `tasks/history.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-22-npm-cache-ownership-verification.md`

## Per-file purpose

- `prompts/ship-end/skill-prompt-20260622-001159-wrap-up.md`: captures the visible `$ship-end` invocation and pasted skill context required by the project prompt-history rule.
- `tasks/history.md`: records the npm cache verification outcome and remaining npm-auth blocker.
- `tasks/todo.md`: updates the current release-readiness review with the follow-up cache ownership result.
- `tasks/ship-manifest-2026-06-22-npm-cache-ownership-verification.md`: records the shipping boundary and quality-gate evidence.

## User-goal mapping

- The cache verification plan asked to repair only if ownership drift returned; the recorded results show no drift and no repair.
- The release-readiness follow-up asked to check npm auth after the package dry run succeeded; the docs now preserve the continuing npm `E401 Unauthorized` blocker.
- The `$ship-end` contract requires prompt history, task/history records, validation, commit/push, deploy decision, and next-step routing.

## Tests run

- `npm config get cache`: `/Users/georgele/.npm`.
- `id -u`: `501`.
- `id -g`: `20`.
- `ls -ld /Users/georgele/.npm`: owner/group `georgele staff`.
- `find /Users/georgele/.npm \( ! -user 501 -o ! -group 20 \) -print`: no output.
- `npm cache verify`: exited 0.
- `npm pack ./packages/skillpacks/build --dry-run --json --silent`: exited 0 using the normal cache and produced `skillpacks@0.1.8` pack metadata.
- `npm whoami --registry https://registry.npmjs.org/`: exited 1 with npm `E401 Unauthorized`.
- `git diff --check`: exited 0.
- Targeted documentation scan: `rg -n "npm cache ownership|E401 Unauthorized|skill-prompt-20260622-001159" tasks/todo.md tasks/history.md prompts/ship-end/skill-prompt-20260622-001159-wrap-up.md` confirmed the new records and blocker wording.

## Skipped tests

- Full package, app, lint, typecheck, and build suites were skipped because the shipping boundary only changes prompt-history and task documentation. The package-facing cache/package proof was already covered by `npm cache verify` and the exact `npm pack` dry run that previously failed.
- Skills Showcase deploy validation was skipped because `tasks/deploy.md` classifies `tasks/**` and `prompts/**` changes as non-deploying evidence.

## Adversarial review

Method: changed-file self-review plus targeted scans, which is the smallest review method allowed by `docs/quality-gate-contract.md` for small documentation boundaries.

Findings:

- The initial prompt-history file compressed one line from the pasted skill context. Fixed before validation so the prompt log preserves the visible invocation context exactly.
- No source, script, configuration, generated runtime asset, package metadata, or deploy behavior changes are included.
- The remaining npm blocker is correctly classified as authentication, not cache ownership.

## Residual risk

The only meaningful remaining risk is external npm authentication state. A user with the `glexcorp` account or another authorized publisher still needs to run `npm login --registry https://registry.npmjs.org/` and confirm `npm whoami --registry https://registry.npmjs.org/` before any dry-run publish can proceed.

## Rollback note

Revert the wrap-up commit to remove the prompt-history capture, task/history notes, and this manifest. No runtime state or cache contents were modified.

## Next command

`$guide npm registry login for skillpacks 0.1.9 publish readiness`
