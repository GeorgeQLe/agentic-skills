---
skill: investigate
agent: codex
captured_at: 2026-07-05T00:11:47-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Fix Idea-Scope-Brief Deck Post-Install Routing

## Summary

- Root cause: `idea-scope-brief` currently makes high-confidence deck install the only primary command and only asks for the likely first post-install skill as secondary context. The `install-deck` CLI also does not print deck-specific next-step guidance.
- Yes: for `business-afps`, customer discovery is the next default command after installation: `$customer-discovery research/vectorfit` in Codex, `/customer-discovery research/vectorfit` in Claude, assuming the VectorFit product path exists.
- Note: the reported `research/vectorfit/*` files are not present in this checkout, so implementation should not edit those artifacts unless they appear after sync or are recreated.

## Key Changes

- Update both mirrors of `packs/base/*/idea-scope-brief/SKILL.md` to require a copy-pasteable post-install line whenever a high-confidence Deck Fit Handoff is primary:
  - Codex: `After install, start with: $customer-discovery [research/{slug}]`
  - Claude: `After install, start with: /customer-discovery [research/{slug}]`
- Keep `npx skillpacks install-deck <deck>` as the single primary command in `## Next Steps`; the post-install command is explicitly labeled secondary and not a competing primary command.
- Clarify `## Customer Discovery Readiness` and `## Deck Fit Handoff` so generated briefs must name the exact first post-install skill plus the scoped product path argument when available.
- Update `docs/decks.md` Business AFPS section to state that the default first workflow after install is customer discovery.
- Because this is a substantive skill behavior change, archive current Codex and Claude `idea-scope-brief` skills with `scripts/skill-archive.sh`, bump `version: v0.22` to `v0.23`, and update both changelogs.
- Add prompt history for this investigation under `prompts/investigate/` before implementation, because Plan Mode prevented writing it during investigation.

## Tests

- Add a focused layer1 test that checks both `idea-scope-brief` mirrors require:
  - high-confidence deck install remains primary,
  - a post-install command is required,
  - Codex uses `$customer-discovery`,
  - Claude uses `/customer-discovery`.
- Run targeted tests:
  - `npm test -- tests/layer1/idea-scope-brief-approval-ordering.test.ts`
  - new layer1 routing test
  - any existing global customer-discovery routing test touched by wording.
- Run `scripts/pack.sh refresh` after source edits, then verify no generated bundle drift remains.

## Assumptions

- Do not change `install-deck` CLI output in this fix; the immediate bug is the `idea-scope-brief` handoff contract.
- Do not recommend `npx skillpacks install` inside this repo as an implementation step; use in-tree source and `scripts/pack.sh refresh`.
- If VectorFit artifacts become available before implementation, only inspect them to confirm the scoped command argument, not to rewrite the already approved brief.
