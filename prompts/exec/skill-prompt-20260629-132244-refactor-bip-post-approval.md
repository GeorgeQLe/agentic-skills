---
skill: exec
agent: codex
captured_at: 2026-06-29T13:22:44-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Refactor BIP To Post-Approval HTML Output

## Summary
- Move BIP from a pre-final “Stage 2 halfway” alignment gate to a post-approval artifact generated after a skill writes approved canonical markdown.
- Use `alignment/bip-{skill-name}.html` as the BIP page path, archive before replacing, include it in `alignment/index.html`, and open it after the skill concludes.
- Treat `set-bip on` as automatic BIP generation with no additional approval; otherwise `idea-scope-brief` asks once through the existing BIP suggestion gate.

## Key Changes
- Update [docs/alignment-page-convention.md](/Users/georgele/projects/tools/agentic-skills/docs/alignment-page-convention.md:29):
  - Replace the current `alignment/{skill-name}-{topic}-bip.html` pre-final approval flow.
  - Define post-confirmation behavior: after final compiled YAML is consumed, canonical markdown is written, and the alignment page is confirmed, write `alignment/bip-{skill-name}.html`.
  - The BIP page lists exhaustive post candidates for every bundled channel, with recommendation notes, source basis, claim-safety notes, risk, publish precheck, and recommended/not-now/rejected status.
- Update social routing docs:
  - Change [docs/social-post-convention.md](/Users/georgele/projects/tools/agentic-skills/docs/social-post-convention.md:11) and [docs/social-video-content-convention.md](/Users/georgele/projects/tools/agentic-skills/docs/social-video-content-convention.md:9) so BIP mode loads every bundled channel convention when `set-bip on` is active.
  - Keep `alignment.bip_platforms` as optional prioritization metadata only, not a filter.
- Update `idea-scope-brief` in both Codex and Claude:
  - Keep the one-time BIP enablement prompt.
  - On yes, run `set-bip on` and `set-bip-prompt dismiss`.
  - After canonical `idea-brief.md` writes, generate/open `alignment/bip-idea-scope-brief.html`.
- Update audit/package expectations:
  - Revise [scripts/audit-alignment-pages.mjs](/Users/georgele/projects/tools/agentic-skills/scripts/audit-alignment-pages.mjs:70) to validate the new post-confirmation BIP page shape instead of requiring Stage 2 BIP checkpoints.
  - Update package boundary tests that currently expect `alignment.bip_platforms` target-platform behavior.

## Test Plan
- Run `node scripts/upgrade-alignment-page.mjs --check` before generation changes, then run the generator after edits and re-check.
- Run `node scripts/audit-alignment-pages.mjs`.
- Run `node --test packages/skillpacks/test/project-config.test.mjs packages/skillpacks/test/package-boundary.test.mjs`.
- Run the focused alignment verification command if available: `npx skillpacks alignment verify`.

## Assumptions
- “Step 2 approval” means final compiled YAML approval of the canonical markdown, not a separate new BIP approval gate.
- `set-bip on` means exhaustive built-in channel generation automatically.
- `alignment.bip_platforms` remains supported, but only for ranking/prioritization notes.
- The BIP page is review/help content only; it does not publish posts or write social-ledger records without later explicit approval.
