# Ship Manifest - Skillpacks Install-Route Contract

Date: 2026-06-10

## User Goal

Execute the next `$exec` step: define the canonical npm-aware install-route wording matrix before broad remediation of active `SKILL.md` files.

## Changed Files

- `docs/skillpacks-install-routing-contract.md`
- `prompts/exec/skill-prompt-20260610-201246-exec.md`
- `tasks/history.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-10-skillpacks-install-route-contract.md`

## Per-File Purpose

- `docs/skillpacks-install-routing-contract.md`: Adds the canonical wording matrix for Claude, Codex, individual skill installs, source-checkout maintenance, and deck installs.
- `prompts/exec/skill-prompt-20260610-201246-exec.md`: Captures the visible `$exec` invocation and pasted exec skill context.
- `tasks/history.md`: Records the completed wording-contract step.
- `tasks/todo.md`: Checks off the wording-matrix step, links the durable contract, and expands the next validation-shape plan.
- `tasks/ship-manifest-2026-06-10-skillpacks-install-route-contract.md`: Records the shipping boundary and verification.

## User-Goal Mapping

- The contract doc satisfies the requested current step by turning the audit's upgrade pattern into reusable canonical wording.
- The task updates preserve the one-step `$exec` flow and prepare the next incomplete validation decision step.
- No active `SKILL.md` remediation was started, preserving the phase acceptance criterion that validation planning precedes broad edits.

## Tests Run

- `rg -n 'npx skillpacks install|npx skillpacks install-deck|/pack install|\$pack install|scripts/pack\.sh install|archive/\*\*' docs/skillpacks-install-routing-contract.md` - passed; confirmed required route phrases and active/archive scope language appear in the contract.
- `bash scripts/skill-pack-routing-audit.sh` - passed; output: `No cross-pack recommendation gaps found.`
- `git diff --check` - passed; no whitespace errors.

## Skipped Tests

- Full package, app, and layer1 suites were skipped because this boundary is documentation/task/prompt metadata only and changes no executable code, generated runtime asset, active `SKILL.md`, `PACK.md`, package manifest, or app surface.
- Skills Showcase refresh was skipped because no active `SKILL.md` or `PACK.md` file changed.

## Adversarial Review

- Reviewed the contract for the main failure modes: accidentally replacing valid `/pack`, `$pack`, or `scripts/pack.sh` routes; treating deck installs as ordinary pack installs; omitting reload/restart guidance; and failing to exclude `archive/**`.
- Fixed one consistency issue before final validation: the missing-skill fallback placeholder now uses `<pack-or-skill>` consistently with the project shell route.
- Accepted residual concern: the follow-up validation script/test still needs to encode the deck-vs-pack distinction so `npx skillpacks install-deck` is not accidentally accepted as evidence for ordinary pack or skill install wording.

## Residual Risk

The contract is textual and not yet enforced. A future remediation batch could still drift unless the next step adds the focused validation rule and allowlist shape described in `tasks/todo.md`.

## Rollback Note

Revert this commit to remove the contract doc and task/history/prompt/manifest artifacts. No generated assets or installed skill roots need cleanup.

## Deploy

Deploy skipped: `tasks/deploy.md` targets the Skills Showcase production app, while this boundary changes only docs, tasks, history, and prompt-history artifacts. No deploy-relevant runtime surface changed, and production deploys require explicit confirmation.

## Next Command

`$exec`
