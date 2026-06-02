# Ship Manifest: Skills Showcase Source Documentation Pass

## User Goal

Ship the already-finished Skills Showcase app-source documentation pass, including the validation fixes required to prove the app still typechecks, tests, and builds.

## Changed Files

- `alignment/skills-showcase-documentation.html`
- `apps/skills-showcase/app/globals.css`
- `apps/skills-showcase/app/layout.tsx`
- `apps/skills-showcase/app/page.tsx`
- `apps/skills-showcase/app/prototype/page.tsx`
- `apps/skills-showcase/app/prototype/prototype.css`
- `apps/skills-showcase/package.json`
- `apps/skills-showcase/pnpm-lock.yaml`
- `apps/skills-showcase/src/components/BottomSheet.tsx`
- `apps/skills-showcase/src/components/CardFace.tsx`
- `apps/skills-showcase/src/components/PackOpener.tsx`
- `apps/skills-showcase/src/components/debug/AnimationMachineGraph.tsx`
- `apps/skills-showcase/src/components/debug/DebugController.tsx`
- `apps/skills-showcase/src/components/debug/DebugPanel.tsx`
- `apps/skills-showcase/src/components/debug/animationMachine.ts`
- `apps/skills-showcase/src/components/debug/animationMachineStaticPage.ts`
- `apps/skills-showcase/src/db/index.ts`
- `apps/skills-showcase/src/hooks/useSkillsData.ts`
- `apps/skills-showcase/src/showcase/ShowcaseShell.tsx`
- `apps/skills-showcase/src/showcase/benchmarks.tsx`
- `apps/skills-showcase/src/showcase/catalog.tsx`
- `apps/skills-showcase/src/showcase/newsletter-form.tsx`
- `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`
- `apps/skills-showcase/src/showcase/tui/shared/useTypewriter.ts`
- `apps/skills-showcase/src/showcase/tui/shared/useWorkflowPlayer.ts`
- `apps/skills-showcase/src/showcase/tui/workflow-data.ts`
- `apps/skills-showcase/src/showcase/tui/workflow.css`
- `apps/skills-showcase/src/showcase/workflows.tsx`
- `apps/skills-showcase/src/trpc/init.ts`
- `apps/skills-showcase/src/trpc/newsletter.ts`
- `apps/skills-showcase/src/trpc/provider.tsx`
- `apps/skills-showcase/vitest.config.mts`
- `prompts/ship/skill-prompt-20260602-005529-ship-showcase-app-edits.md`
- `tasks/history.md`
- `tasks/ship-manifest-2026-06-02-skills-showcase-documentation.md`

Removed:

- `apps/skills-showcase/vitest.config.ts`

Untouched:

- `tasks/todo.md` currently tracks the separate completed Codex mirror task and is intentionally left unchanged for this app-source ship.

## Per-File Purpose

- `alignment/skills-showcase-documentation.html`: Preserve the review/alignment page that documents the proposed comment pass, evidence matrix, confidence register, approval gates, and compile controls.
- `apps/skills-showcase/app/globals.css`: Add section comments for reset, theme tokens, typography, app chrome, prototype chrome, motion, accessibility, and responsive layers.
- `apps/skills-showcase/app/layout.tsx`: Document the shared root layout role.
- `apps/skills-showcase/app/page.tsx`: Document the default app route handoff into the showcase shell.
- `apps/skills-showcase/app/prototype/page.tsx`: Document prototype state wiring, debug reporting, and pack/drawer orchestration.
- `apps/skills-showcase/app/prototype/prototype.css`: Add comments around prototype layout and layering styles.
- `apps/skills-showcase/package.json`: Pin `jsdom` to `26.1.0` so Vitest runs under the local Node 20.17.0 runtime.
- `apps/skills-showcase/pnpm-lock.yaml`: Record the resolved dependency graph for `jsdom@26.1.0`.
- `apps/skills-showcase/src/components/BottomSheet.tsx`: Document sheet elevation and close/open sequencing responsibilities.
- `apps/skills-showcase/src/components/CardFace.tsx`: Document card face presentation boundaries.
- `apps/skills-showcase/src/components/PackOpener.tsx`: Document tear/open timing and debug-state reporting.
- `apps/skills-showcase/src/components/debug/AnimationMachineGraph.tsx`: Document graph layout, selection, and edge rendering behavior.
- `apps/skills-showcase/src/components/debug/DebugController.tsx`: Document debug controls and route-state coupling.
- `apps/skills-showcase/src/components/debug/DebugPanel.tsx`: Document panel sections and runtime snapshot display.
- `apps/skills-showcase/src/components/debug/animationMachine.ts`: Document the canonical animation state-machine model and snapshot helpers.
- `apps/skills-showcase/src/components/debug/animationMachineStaticPage.ts`: Document the generated static reference page structure.
- `apps/skills-showcase/src/db/index.ts`: Add comments around newsletter query/table responsibilities.
- `apps/skills-showcase/src/hooks/useSkillsData.ts`: Document bundled data loading and failure fallback behavior.
- `apps/skills-showcase/src/showcase/ShowcaseShell.tsx`: Document shell composition and routing between showcase views.
- `apps/skills-showcase/src/showcase/benchmarks.tsx`: Document benchmark view data shaping.
- `apps/skills-showcase/src/showcase/catalog.tsx`: Document catalog grouping/filtering behavior.
- `apps/skills-showcase/src/showcase/newsletter-form.tsx`: Document subscription form state and TRPC mutation flow.
- `apps/skills-showcase/src/showcase/tui/TuiWorkflow.tsx`: Document workflow player rendering and terminal-style output sequencing.
- `apps/skills-showcase/src/showcase/tui/shared/useTypewriter.ts`: Document typewriter timing and cleanup behavior.
- `apps/skills-showcase/src/showcase/tui/shared/useWorkflowPlayer.ts`: Document workflow playback state transitions.
- `apps/skills-showcase/src/showcase/tui/workflow-data.ts`: Document static workflow copy/data responsibilities.
- `apps/skills-showcase/src/showcase/tui/workflow.css`: Normalize section comments to ASCII and clarify terminal/workflow style layers.
- `apps/skills-showcase/src/showcase/workflows.tsx`: Document workflow route composition.
- `apps/skills-showcase/src/trpc/init.ts`: Document TRPC context and protected procedure responsibilities.
- `apps/skills-showcase/src/trpc/newsletter.ts`: Document newsletter router validation, auth, and data-access boundaries.
- `apps/skills-showcase/src/trpc/provider.tsx`: Document browser TRPC provider setup.
- `apps/skills-showcase/vitest.config.mts`: Replace the TypeScript config with an ESM-native Vitest config compatible with Vitest 4/Vite.
- `apps/skills-showcase/vitest.config.ts`: Removed because the `.ts` config loaded through a CommonJS path and failed against ESM-only Vite/Vitest dependencies.
- `prompts/ship/skill-prompt-20260602-005529-ship-showcase-app-edits.md`: Record the visible `$ship` invocation per project prompt-history policy.
- `tasks/history.md`: Record the shipment, validation, and deploy decision.
- `tasks/ship-manifest-2026-06-02-skills-showcase-documentation.md`: Record the quality gate and shipping boundary before commit.

## User-Goal Mapping

- The comment-only app-source changes satisfy the documentation pass by making the app shell, prototype animation system, showcase screens, TUI workflow, TRPC layer, and newsletter data path easier to maintain.
- The alignment page preserves the review artifact for the documentation pass and keeps the evidence/gate context alongside the shipped source changes.
- The Vitest config rename and `jsdom` pin are included because they were required to produce clean executable validation for this shipping boundary on the local runtime.
- Prompt history, history notes, and this manifest satisfy the repository's `$ship` and quality-gate contracts.

## Tests Run

- `pnpm --dir apps/skills-showcase typecheck` passed.
- `pnpm --dir apps/skills-showcase test` passed: 12 test files, 129 tests.
- `pnpm --dir apps/skills-showcase build` first failed in the sandbox because Turbopack could not bind a local helper-process port while processing CSS. The same command was rerun outside the sandbox and passed.
- `git diff --check` passed.
- Alignment artifact content inspection confirmed the expected overview, phase sections, evidence matrix, approval gates, compile controls, and `alignment/skills-showcase-documentation.html` path binding.

## Skipped Tests

- Full repository layer1 tests were not run because the shipped executable changes are isolated to `apps/skills-showcase`; app-level typecheck, test, and production build directly cover the affected package.
- Browser/manual visual testing of the production app was not run because the app changes are comments plus test-runtime configuration. No rendered app markup, component logic, CSS declarations, animation constants, or user-facing copy changed. The alignment page was command-line inspected rather than browser-opened.
- Deployment was skipped because `tasks/deploy.md` targets the live Vercel production app and the user did not explicitly confirm a production deploy.

## Adversarial Review

Method: changed-file self-review plus targeted validation of the failure modes surfaced during shipping.

Findings and fixes:

- Vitest failed to load `vitest.config.ts` through a CommonJS path against ESM-only dependencies. Fixed by replacing it with `vitest.config.mts`.
- After the config fix, `jsdom@29.1.1` still failed under local Node 20.17.0 because its dependency graph requires newer ESM/runtime behavior. Fixed by pinning `jsdom` to `26.1.0`, which supports Node >=18 and passes the suite.
- `next build` generated a tracked `next-env.d.ts` import change from dev to build route types. That was verification churn, not source work, and was restored before staging.
- Final status review found `alignment/skills-showcase-documentation.html` was related to the documentation pass, not unrelated. The manifest was corrected and the artifact is included in the follow-up ship commit.

No remaining review findings block shipping.

## Residual Risk

- `jsdom@26.1.0` is older than the latest available jsdom. This is intentionally limited to dev/test runtime compatibility; production app code does not depend on jsdom. Future upgrades should move the local runtime to Node >=20.19 or Node 22/24 before restoring a newer jsdom.
- Comments can become stale if future code changes do not keep them aligned. The current diff was reviewed against the surrounding code and app validation passed.
- The alignment page was not browser-opened in this correction pass. Command-line inspection covered required content and compile-path binding, but visual layout was not manually inspected.

## Rollback Note

Revert this commit to remove the documentation pass and restore the previous test runtime state. If only the validation fix needs rollback, restore `apps/skills-showcase/vitest.config.ts`, remove `apps/skills-showcase/vitest.config.mts`, and revert the `jsdom` entries in `apps/skills-showcase/package.json` and `apps/skills-showcase/pnpm-lock.yaml`.

## Next Command

`$exec`
