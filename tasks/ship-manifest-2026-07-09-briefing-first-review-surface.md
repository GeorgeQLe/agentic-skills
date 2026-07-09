# Ship Manifest - Briefing-First Review Surface Convention

## User Goal

Implement briefing slides as the primary review surface whenever the `briefing-slides` convention is installed, while always creating dense `interrogation/*.html` and `alignment/*.html` pages first as canonical backup/reference surfaces. Implement this at the shared convention layer, not by editing every research/design skill.

## Changed Files

Source commit: `dc8fc4e76 Implement briefing-first review conventions`

- `docs/briefing-slides-convention.md`
- `docs/alignment-page-convention.md`
- `docs/interrogation-page-convention.md`
- `scripts/skill-convention-bundle-audit.mjs`
- `packages/skillpacks/package.json`
- `packages/skillpacks/dist/skillpacks-manifest.json`
- `prompts/skill-creator/skill-prompt-20260709-103149-briefing-first-review-surface.md`
- `tasks/roadmap.md`
- `tasks/todo.md`

Closeout boundary:

- `prompts/investigate/skill-prompt-20260709-102338-briefing-slides-canary.md`
- `prompts/ship-end/skill-prompt-20260709-104516-wrap-briefing-first.md`
- `tasks/history.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-07-09-briefing-first-review-surface.md`

## Per-File Purpose

- `docs/briefing-slides-convention.md`: made the dense-page-first and deck-open-first workflow explicit, with dense pages as canonical backup/reference surfaces and YAML routing back to the producing skill.
- `docs/alignment-page-convention.md`: replaced vague briefing delegation with a concrete briefing-first open branch and dense-page fallback when the briefing convention asset is absent.
- `docs/interrogation-page-convention.md`: applied the same briefing-first/dense-fallback open contract to stage-zero interrogation pages.
- `scripts/skill-convention-bundle-audit.mjs`: added canary text checks so future convention edits cannot remove the briefing-first dense-backup contract silently.
- `packages/skillpacks/package.json`: preserved the pre-existing canary package source state at `0.1.22-experimental.3`.
- `packages/skillpacks/dist/skillpacks-manifest.json`: restored the final canary manifest with the updated source fingerprint after stable/canary verification.
- `prompts/*`: captured visible skill invocations as tracked prompt-history artifacts.
- `tasks/roadmap.md`: recorded the completed plan and demoted the shipped work to historical status during closeout.
- `tasks/todo.md`: recorded verification, then reset current executable work to no active task during closeout.
- `tasks/history.md`: added the durable session history record.
- `tasks/ship-manifest-2026-07-09-briefing-first-review-surface.md`: records this quality gate and shipping boundary.

## User-Goal Mapping

- The briefing convention change implements the "briefing slides first as primary review surface" behavior while preserving dense pages.
- The alignment/interrogation convention changes make producer skills inherit the behavior through shared docs instead of broad `required_conventions` churn.
- The audit canaries enforce the behavior for future convention and package checks.
- Package checks and content scans prove canary packages keep shipping the briefing convention asset and the updated alignment/interrogation convention assets.

## Tests Run

- `node scripts/skill-convention-bundle-audit.mjs` — passed.
- `node scripts/audit-briefing-slides.mjs` — passed; 47 active decks exact across audited groups.
- `npm --workspace packages/skillpacks run build:check` — passed after temporarily generating a stable-lane manifest for the check.
- `SKILLPACKS_PACKAGE_LANE=canary npm --workspace packages/skillpacks run build:check` — passed after restoring the final canary manifest.
- Package content checks — confirmed `packages/skillpacks/build/assets/briefing-slides-convention.md` exists and built alignment/interrogation assets contain the briefing-first fallback language.
- Spot checks — confirmed `porter-five-forces` and `idea-scope-brief` still inherit through `alignment-page` and `interrogation-page` only.
- `node scripts/audit-task-docs.mjs` — passed during source ship and again during closeout.
- `git diff --check` and `git diff --cached --check` — passed.

## Skipped Tests

- Full package `test:node` was not rerun for this convention-wording change because the changed executable surface was the convention bundle audit script and package staging boundary, both covered by `build:check` in stable and canary lanes.
- Browser-opening behavior was not manually opened because this change updates shared convention instructions and package assets, not a generated review page instance. The relevant opener commands are documented in the convention text and copied into package assets.

## Adversarial Review

Review method: changed-file self-review plus targeted negative checks, treated as equivalent to a focused quality sweep for a shared convention-policy change.

Failure modes checked:

- Dense pages might be skipped: briefing convention now says dense pages are written first and never skipped; alignment/interrogation explicitly call them canonical backup/reference surfaces.
- Agents might open both dense page and deck: briefing convention and alignment/interrogation open steps say to open only the deck when the briefing asset exists.
- Stable installs might lose dense-page behavior: alignment/interrogation preserve the dense-page open path when the briefing-slides asset is absent.
- YAML could route to `create-briefing-slides`: briefing, alignment, and interrogation wording now route to the producing skill's continuation command.
- Future edits could remove the contract silently: `skill-convention-bundle-audit` now fails if canary language disappears.
- Direct metadata churn could touch many producer skills: spot checks confirmed representative research and product-design skills keep only shared alignment/interrogation conventions.

Findings: no unresolved findings after the audit canaries and convention wording updates.

## Residual Risk

The remaining risk is behavioral compliance by future agents: the convention can require a briefing deck, but a producing skill execution could still fail to author one unless it reads and follows the packaged convention. The new audit canaries protect the shared contract text and package build surfaces; runtime compliance still depends on agents following required conventions.

## Rollback Note

Revert `dc8fc4e76` and the closeout commit that references this manifest. If only the new behavior needs to be disabled without reverting all docs, remove the `briefing-slides` convention asset from the package lane or restore the prior alignment/interrogation browser-open paragraphs.

## Next Command

Recommended next command: none
