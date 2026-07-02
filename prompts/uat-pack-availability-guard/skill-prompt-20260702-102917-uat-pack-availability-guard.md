---
skill: uat-pack-availability-guard
agent: codex
captured_at: 2026-07-02T10:29:17-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# UAT Pack Availability Guard Handoff

## Summary

Update the product-design UAT handoff so any route to `$uat --variant-evaluation` / `/uat --variant-evaluation` gives plain human instructions when `uat` may be unavailable: install `product-testing` with `npx skillpacks install product-testing`, then run the UAT skill command, with the Codex fresh-session fallback.

## Key Changes

- Archive and bump changed skills per repo policy:
  - `logic-wiring`: `v0.22 -> v0.23`
  - `consolidate-prototypes`: `v0.19 -> v0.20`
  - Apply to both `packs/product-design/codex/...` and `packs/product-design/claude/...`.
  - Add matching `CHANGELOG.md` entries and archive current `SKILL.md` via `scripts/skill-archive.sh <skill-dir>` before edits.
- Add an explicit `## Pack Availability Guard` or equivalent UAT-specific handoff rule to `logic-wiring` and `consolidate-prototypes`:
  - First check whether `uat` is directly available in the active skill list/session.
  - If not, identify `uat` as provided by `product-testing`.
  - Tell users exactly:
    - `npx skillpacks install product-testing`
    - then `$uat --variant-evaluation` for Codex or `/uat --variant-evaluation` for Claude.
  - For Codex text, include: if `$uat` remains unavailable after install, start a fresh Codex CLI session and retry.
  - Do not use `npx skillpacks install uat`.
- Replace bare UAT terminal handoffs in `logic-wiring`:
  - `Recommended next command` must not be only `$uat --variant-evaluation` / `/uat --variant-evaluation`.
  - `## Invoke With YAML` may still emit `agent_routing`, but the surrounding human-facing `## Next Work` must include the install command and follow-up skill command.
- Strengthen `consolidate-prototypes` evidence-gate routing:
  - When UAT evidence is missing or branches are unreviewed, the stop message must use the same plain install-then-run guidance rather than only inline parenthetical availability wording.
- Update canonical design-tree loop guidance in `docs/design-tree-loop-convention.md` to state that UAT routing must use this Pack Availability Guard and that `agent_routing` YAML cannot be the only human-facing command.
- Regenerate generated `DESIGN-TREE-LOOP.md` bundles with `node scripts/upgrade-design-tree-loop.mjs`.

## Tests

- Add focused assertions in `tests/layer1/product-design-flow-tree.test.ts` for both mirrors:
  - `logic-wiring` contains `npx skillpacks install product-testing`.
  - `logic-wiring` contains the correct agent command (`$uat --variant-evaluation` or `/uat --variant-evaluation`) as the follow-up.
  - Codex `logic-wiring` contains `fresh Codex CLI session`.
  - `logic-wiring` does not contain `npx skillpacks install uat`.
  - `logic-wiring` does not leave `agent_routing` as the only UAT handoff by requiring nearby plain install/run wording.
  - `consolidate-prototypes` has the same install/run guidance for missing UAT evidence.
- Run verification:
  - `pnpm test -- tests/layer1/product-design-flow-tree.test.ts`
  - `pnpm test -- tests/layer1/skill-install-routing-audit.test.ts`
  - `node scripts/upgrade-design-tree-loop.mjs --check`
  - Targeted `rg` checks for vague wording and bad installs: `install it`, `install product-testing if unavailable`, `npx skillpacks install uat`, and bare UAT-only handoff blocks.

## Assumptions

- Claude mirror should use `/uat --variant-evaluation`; Codex mirror should use `$uat --variant-evaluation`.
- The exact proposed wording should be used for Codex where possible; Claude should mirror the same shell install command with slash-style skill invocation.
- Prompt-history capture required by local AGENTS.md will be written during implementation before substantive file edits, because Plan Mode forbids tracked-file mutations.
