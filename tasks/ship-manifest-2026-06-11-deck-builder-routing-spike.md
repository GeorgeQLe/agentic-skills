# Ship Manifest - Deck-Builder Animation Approval And Routing Spike

## User Goal

Finalize the approved `animation-design-planner` alignment page for deck-builder transitions and hand off to `/exec` for the first deck-builder implementation spike.

## Changed Files

- `alignment/animation-design-planner-deck-builder-transitions.html`
- `alignment/index.html`
- `apps/skills-showcase/app/deck/[slug]/page.tsx`
- `apps/skills-showcase/app/globals.css`
- `apps/skills-showcase/app/prototype/deck-routing-spike/page.tsx`
- `apps/skills-showcase/docs/animation-plan-deck-builder.md`
- `apps/skills-showcase/e2e/deck-routing-spike.spec.ts`
- `apps/skills-showcase/package.json`
- `apps/skills-showcase/playwright.config.ts`
- `apps/skills-showcase/pnpm-lock.yaml`
- `apps/skills-showcase/src/deck-builder/DeckRoutingSpikeShell.tsx`
- `docs/history/archive/2026-06-11/142531/alignment/animation-design-planner-deck-builder-transitions.html`
- `docs/history/archive/2026-06-11/142531/research/skills-showcase/_working/preliminary-animation-design-planner-research.md`
- `prompts/animation-design-planner/skill-prompt-20260611-142531-deck-builder-approval.md`
- `prompts/exec/skill-prompt-20260611-142531-deck-builder-implementation.md`
- `tasks/history.md`
- `tasks/roadmap.md`
- `tasks/todo.md`
- `tasks/ship-manifest-2026-06-11-deck-builder-routing-spike.md`

## Per-File Purpose

- `alignment/animation-design-planner-deck-builder-transitions.html`: converts the active review page to confirmed, replaces answer controls with read-only decision records, and preserves the final approval YAML.
- `alignment/index.html`: marks the deck-builder animation page as confirmed.
- `apps/skills-showcase/docs/animation-plan-deck-builder.md`: stores the canonical approved animation plan for implementation.
- `docs/history/archive/2026-06-11/142531/...`: preserves the prior review page and non-canonical working packet outside the active research tree.
- `apps/skills-showcase/app/prototype/deck-routing-spike/page.tsx`, `apps/skills-showcase/app/deck/[slug]/page.tsx`, and `apps/skills-showcase/src/deck-builder/DeckRoutingSpikeShell.tsx`: add the hidden routing spike and dynamic hard-load route.
- `apps/skills-showcase/app/globals.css`: styles the hidden spike surface.
- `apps/skills-showcase/e2e/deck-routing-spike.spec.ts`, `apps/skills-showcase/playwright.config.ts`, `apps/skills-showcase/package.json`, and `apps/skills-showcase/pnpm-lock.yaml`: add local Playwright proof tooling for the spike.
- `prompts/**`: records the visible invoked skill prompt content.
- `tasks/**`: records plan completion, validation, history, and this shipping boundary.

## User-Goal Mapping

- The final compiled YAML had all 9 gates answered, `approval_status: ready-for-agent-review`, and `section_feedback: []`; the confirmed page and canonical Markdown plan preserve that approval state.
- The approved destination was `apps/skills-showcase/docs/animation-plan-deck-builder.md`; this file now contains the accepted motion contracts, lifecycle ownership map, proof gate, risks, and `/exec` handoff.
- The post-approval route requested `/exec` for deck-builder implementation with a spike first; this boundary implements only the minimal pushState routing spike and leaves full deck-builder UI, card-flight, pack-opening retrofit, homepage replacement, and deploy work out of scope.

## Tests Run

- `pnpm --dir apps/skills-showcase typecheck`
- `pnpm --dir apps/skills-showcase build`
- `pnpm --dir apps/skills-showcase test` (13 files, 136 tests passed)
- `pnpm --dir apps/skills-showcase test:e2e` (2 Playwright tests passed)
- `node scripts/audit-alignment-pages.mjs` (48 active pages; TTS include, page metadata, viewport meta, embed prohibition, and index integrity exact)
- `git diff --check`

## Failed-Then-Fixed Validation

- Initial `pnpm --dir apps/skills-showcase test:e2e` failed because the spike generated a random mount id in the server-rendered client tree, producing a hydration mismatch.
- The first test also assumed a dev Strict Mode mount count of `1`; in practice the counter can read `2` before user interaction.
- Fix: assign the spike mount id after hydration and assert that the observed mount id stays stable across native `pushState` and browser Back.

## Skipped Tests

- Production deploy checks from `tasks/deploy.md` were not run because production deploy was explicitly out of scope for the approved implementation spike.
- Browser plugin spot-check was not run because tool discovery returned no callable Browser tools. The Playwright run covered the hidden local browser route directly.

## Adversarial Review

- Failure mode checked: the approved alignment page could remain an active review surface after final YAML approval. It now uses confirmed status, read-only decision records, and an archived prior review page.
- Failure mode checked: non-canonical research could remain in active `_working/` after a canonical plan exists. The working packet was moved to `docs/history/archive/2026-06-11/142531/`.
- Failure mode checked: Next `pushState` could update the URL without updating `usePathname`, or could remount the shell. The Playwright proof asserts `usePathname`, route deck state, active deck state, browser Back, `popstate`, and stable mount identity.
- Failure mode checked: browser-only proof tooling could drift into GitHub Actions. This boundary adds only local Playwright config and package scripts.

## Residual Risk

- The spike proves the routing assumption on the hidden prototype route only; the real deck-builder still needs implementation against the approved animation plan.
- The full `blueprint-morph` and `card-flight` animations are intentionally not implemented in this boundary.
- Production deploy remains a later shipping step governed by `tasks/deploy.md`.

## Rollback Note

Revert the shipped commit to remove the confirmed-plan conversion, archived packet, hidden routing spike, and local Playwright proof tooling. If only the spike must be removed, delete the `/prototype/deck-routing-spike`, `/deck/[slug]`, `src/deck-builder`, Playwright config/test, and related CSS/script additions, then rerun the Skills Showcase validation commands.

## Next Command

`$exec`
