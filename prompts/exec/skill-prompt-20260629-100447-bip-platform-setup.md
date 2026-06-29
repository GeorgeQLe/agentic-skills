---
skill: exec
agent: codex
captured_at: 2026-06-29T10:04:47-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Simplify BIP Into Project Platform Setup + Exhaustive Phase Drafts

## Summary
- Change BIP from granular per-page approval gates to a lower-friction workflow:
  1. Select target platforms once per project.
  2. On each BIP-producing skill invocation, classify the work phase as `research`, `prototyping`, or `implementation`.
  3. Generate an exhaustive, source-safe list of platform-specific proposed posts, rank the top options, and let the user downselect in bulk.
- Default when no platforms are saved: the BIP page includes one required project-platform setup gate and the exhaustive draft list in the same artifact, so the user does not need a separate stop/resume cycle.

## Key Changes
- Add project-level BIP platform config under `.agents/project.json`, using `alignment.bip_platforms` as the selected platform list.
- Add CLI support:
  - `set-bip-platforms <platform...>` writes `alignment.bip_platforms`.
  - `set-bip-platforms unset` clears only the platform list.
  - Preserve sibling `alignment` fields and normalize `.agents/project.json` like existing `set-bip`.
- Update the canonical alignment convention so BIP uses saved platforms instead of per-page target-channel selection by default.
  - If `alignment.bip_platforms` exists, load only those channel conventions.
  - If missing, render one setup gate that records selected platforms and instructs the agent to persist them with the writer command.
  - Replace separate drafting-mode, angle, tone, and per-post gates with one bulk downselect gate over generated draft options.
- Redefine per-invocation BIP content:
  - Infer or label phase as `research`, `prototyping`, or `implementation`.
  - Research popular social-media angles for the selected platforms using the platform convention docs and visible project/work context.
  - Generate a long list of candidate posts per selected platform, with top-ranked options clearly marked.
  - Keep source-safety fields: source basis, claim-safety notes, risk level, publish precheck, and loaded convention path.
- Update `ship-end` BIP suggestions to use saved platforms and generate richer phase-aware batches instead of only `2-4` suggestions.
- Regenerate bundled `ALIGNMENT-PAGE.md` files and packaged convention assets from canonical sources.

## Public Interfaces
- New command:
  - `npx skillpacks set-bip-platforms <platform...>`
  - `npx skillpacks set-bip-platforms unset`
- New project config field:
  - `alignment.bip_platforms: string[]`
- BIP YAML should preserve:
  - `bip_platforms`
  - `bip_phase`
  - ranked draft decisions per platform
  - rejected/not-now options
  - user edits
  - loaded convention paths
  - claim-safety and publish-readiness decisions

## Test Plan
- Add project-config tests for `set-bip-platforms`, including preserve-sibling behavior, unset behavior, no-project-file normalization, invalid/empty input, and CLI help text.
- Update BIP convention tests to assert:
  - project platform selection is persistent.
  - BIP pages no longer require separate drafting-mode/content-angle/sample-post gates.
  - bulk downselect is the required review surface.
  - generated bundles match the canonical convention.
- Update `ship-end` BIP tests so enabled BIP uses saved platforms and produces exhaustive phase-aware post candidates.
- Run:
  - `node scripts/upgrade-alignment-page.mjs --check`
  - `node scripts/skill-convention-bundle-audit.mjs`
  - focused BIP/project-config tests
  - package manifest/build checks used by this repo

## Assumptions
- Platform selection should be across BIP broadly, not limited to one skill or pack.
- The initial platform setup may appear in the first BIP artifact if no saved platforms exist, but later invocations must not re-ask.
- No external publishing is added; BIP remains draft/review only.
- Social ledger behavior remains private by default and is used for dedupe/history when configured.
