# Changelog

## v0.12 - 2026-07-02

- Moved the enabled Build-In-Public wrap-up page to `alignment/bip/ship-end.html` and required fresh-audience context, jargon expansion, and public-facing significance fields for every candidate so posts are understandable without prior project context.

## v0.11 - 2026-06-29

- Routed the enabled Build-In-Public wrap-up batch to the single HTML BIP page `alignment/bip-ship-end.html` (post-confirmation page shape: stable BIP metadata, every bundled channel, recommendation/source-basis/claim-safety/risk/publish-precheck/loaded-convention fields, TTS include, viewport, no embeds/gates) — archived before replacement, included in `alignment/index.html`, and opened after wrap-up — instead of dumping candidates inline. The terminal now prints a one-line pointer to the file.

## v0.10 - 2026-06-29

- Changed enabled Build-In-Public wrap-up suggestions to generate exhaustive source-safe candidates for every bundled text/community and video channel, using `alignment.bip_platforms` only as optional priority/ranking metadata. Removed the project-platform setup prompt from the enabled path and clarified that social-ledger writes still require later explicit approval.

## v0.9 - 2026-06-29

- Changed enabled Build-In-Public wrap-up suggestions to use saved project platforms from `alignment.bip_platforms`, persist a one-time platform setup with `set-bip-platforms` when missing, infer `bip_phase`, and generate exhaustive phase-aware candidate batches per platform instead of only `2-4` suggestions.

## v0.8 - 2026-06-29

- Changed the BIP wrap-up behavior so projects with `alignment.build_in_public: true` skip only the enablement question, then draft source-safe Build-In-Public post suggestions or explain why no safe public angle exists. The enabled path must not report only that the BIP gate was skipped.

## v0.7 - 2026-06-26

- Added the **BIP Suggestion Gate** as a new step after the session summary. At session wrap, if Build-In-Public is off and the user has not been asked before (`alignment.bip_prompt_dismissed` unset), the skill offers to enable BIP exactly once; on yes it runs `set-bip on` + `set-bip-prompt dismiss` and then offers to draft a Build-In-Public post about what just shipped (per `docs/social-ledger-convention.md`), on no it records `set-bip-prompt dismiss` so it never asks again. Advisory — never blocks wrap-up. See the BIP Suggestion Gate convention in CLAUDE.md.

## v0.6 - 2026-06-23

- Added task-doc audit gating and current-only next-work routing so stale roadmap/advisory unchecked items are not recommended as executable session follow-up unless promoted into `tasks/todo.md`.

## v0.5 - 2026-06-17

- Added owning-route precedence for research, alignment, design, UI, UX, prototype-test, and copy-audit review artifacts so `/ship-end` does not route those workflows through `/exec` when a narrower skill, review, or compiled-YAML route owns the next action.

## v0.4 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.3 - 2026-06-11

- Added npm CLI install alternatives to cross-pack wrap-up routing fallback wording while preserving Claude `/pack install` recommendations.

## v0.0

- Archived previous skill contract.

# ship-end changelog (claude)

## v0.2 - 2026-05-30

- Added the pack install artifact boundary: ship `.agents/project.json` when pack configuration changes, but leave generated `.claude/skills/**` and `.codex/skills/**` roots uncommitted.

## v0.1 - 2026-05-26

- Gate cross-pack routing recommendations with formal inline pack-availability conditionals instead of informal parenthetical pack mentions
