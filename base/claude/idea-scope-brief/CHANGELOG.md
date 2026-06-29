# idea-scope-brief Changelog

## v0.20 - 2026-06-29

- Refactored enabled Build-In-Public behavior from a pre-final alignment checkpoint into a post-confirmation output: after approved `idea-brief.md` artifacts are written and the alignment page is confirmed, the skill generates and opens `alignment/bip-idea-scope-brief.html`.
- Kept the one-time BIP Suggestion Gate; a yes-response still runs `set-bip on` and `set-bip-prompt dismiss`, but it now schedules post-confirmation BIP output instead of introducing a separate kickoff approval page.

## v0.19 - 2026-06-26

- Added the **BIP Suggestion Gate** as a sub-step of step 1 "Resolve context" (after the `.agents/project.json` read). At kickoff, if Build-In-Public is off and the user has not been asked before (`alignment.bip_prompt_dismissed` unset), the skill offers to enable BIP exactly once; on yes it runs `set-bip on` + `set-bip-prompt dismiss` and flows into existing alignment-page BIP behavior, on no it records `set-bip-prompt dismiss` so it never asks again. Advisory — never blocks the skill's primary work. See the BIP Suggestion Gate convention in CLAUDE.md.

## v0.18 - 2026-06-18

- Routed concept elicitation (steps 3–5) through the stage-zero **interrogation page** loop (`docs/interrogation-page-convention.md`): the Idea Assumptions Manifest is interrogation round 1, the interview becomes adaptive rounds 2..N, and the coverage checkpoint is the confidence-gate exit. The skill cannot advance to the alignment preview (step 6) until the confidence gate passes; each round page carries ≥1 open input. Terminal questioning is the degraded fallback. Added the `## Interrogation Page` bundle stub (`INTERROGATION-PAGE.md`). Primary dogfood vehicle for the archetype.

## v0.17 - 2026-06-17

- Caught Claude up to the Codex mirror with Deck Fit Handoff routing for saved and canonical workflow decks, preserving Claude `/...` route syntax.

## v0.16 - 2026-06-12

- Standardized active pack and skill install guidance on `npx skillpacks install <pack-or-skill>` instead of agent-native `/pack install` or `$pack install` recommendations.

## v0.15 - 2026-06-11

- Updated downstream business research pack checks from `business-discovery` to `business-research` after the pack rename.

## v0.14 - 2026-06-10

- Idea Assumptions Manifest now renders inline as the final message text of its own turn, with the confirmation question asked in the following turn; AskUserQuestion option previews are a supplementary mirror only, never the sole channel. Applies the Manifest Visibility Rule in docs/interview-convention.md.

## v0.13 - 2026-06-11

- Added npm-aware install-route alternatives to downstream pack recommendations while preserving Claude `/pack install` routes.

## v0.12 - 2026-06-06

- Updated downstream discovery routing from the retired short-form command to `/customer-discovery`, including readiness wording, product-path next-skill hints, and business-discovery fallback text.

## v0.11 - 2026-06-05

- Added review-only product path approval rule: when a user approves a product-path fork at the alignment page level but withholds canonical-write approval, keep canonical files unchanged, render fully in the alignment page, and set `approval_status: review-only-approved`. Downstream skills treat review-only-approved paths as provisional until a subsequent alignment cycle grants manifest approval.

## v0.10 - 2026-06-04

- Added Market Structure Handoff guidance so marketplace/platform/B2B2C/multi-sided concepts pass apparent sides and value exchange to `/icp` as hypotheses for validation, not preselected ICPs.

## v0.9 - 2026-06-04

- Added explicit `business-discovery` and `business-ops` pack-install fallback wording at `/icp` and `/product-line` recommendation sites so the routing audit can verify cross-pack guards.

## v0.8 - 2026-05-31

- Require a pre-approval HTML alignment preview after the coverage checkpoint and before canonical `idea-brief`, interview-log, or `research/.progress.yaml` writes. Coverage-checkpoint confirmation is non-final; only final compiled YAML approval authorizes canonical writes or downstream routing. This applies the `tasks/lessons.md` lesson "Approval-gated research needs alignment preview before approval."

## v0.7 - 2026-05-30

- Rename the producer artifact from `concept-brief` to `idea-brief` across all output paths (`research/idea-brief.md`, `research/idea-brief-interview.md`, slugged `research/{slug}/idea-brief*.md`, and legacy `research/idea-brief-{slug}.md`) so the artifact is named after the skill's subject like every sibling skill. Hard rename with no legacy fallback: the skill now writes only the `idea-brief` names and no longer recognizes `concept-brief` filenames. Added a migration note to `## Constraints` instructing existing projects to rename prior `concept-brief*` files before re-running. The word "concept" is preserved everywhere it denotes the product concept itself (concept identity, concept slug, concept summary). Supersedes the v0.6 "filename unchanged" note, which stays as historical record.

## v0.6 - 2026-05-30

- Rename "Concept Assumptions Manifest" to "Idea Assumptions Manifest" so the manifest is named after the skill's subject, matching the convention used by `ui-interview` (UI Assumptions Manifest), `ux-variations` (UX Variation Assumptions Manifest), and `feature-interview`. The `concept-brief.md` output filename is unchanged.

## v0.5 - 2026-05-30

- Added product-path scope resolution before code/app structure hints, archived-path exclusion, `active_paths` normalization, and scoped `research/{slug}/concept-brief.md` output guidance.

## v0.4 - 2026-05-27

- Handle plural `active_paths` manifest field with backward compatibility for singular `active_path`
- Write `pipeline_stage: idea-scope-brief` on product-path entries
- Recommend `/product-line review` when 3+ product paths exist

## v0.3 - 2026-05-27

- Added `research/.progress.yaml` product-path manifest handling for related concepts, app paths, product lines, and pivots.
- Clarified that product-path divergence is tracked with `product_paths`, not git branch terminology.

## v0.1

- Remove bootstrap-repo from next-step routing — bootstrapping a repo is premature before research (no tech stack, no firm product decision)
- Make `/pack install business-discovery` the primary recommendation for business/product concepts
- Reorder routing: business-discovery install → ICP → customer-lifecycle → pack recommend

## v0.0

- Initial version

## v0.2 - 2026-05-25

- Added research-quality alignment requirements covering claim/evidence/inference separation, no-context-loss HTML translation, evidence matrices, confidence/assumption registers, source coverage, and research completeness gates.
