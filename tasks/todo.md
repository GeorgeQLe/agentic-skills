# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Phase 38 planned and ready for execution.
**Current phase:** Phase 38 of 39 — First-Party Newsletter Capture And Admin
**Last completed phase:** Phase 37 — Skills Showcase Next.js Preservation Refactor

## Current Benchmark Rerun: benchmark-test-skill Fresh Validation

**Goal:** Rerun `$benchmark-test-skill benchmark-test-skill` after the latest targeted fix, using fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-12.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Preflight:** `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`.

**Result:** Fresh benchmark validation completed on 2026-05-12. Verify passed with layer1 in 9.1s across 1,302 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude passed 1/3 hard assertions and failed two runs because the output recommended `/ship`; Claude output quality averaged 80.0%, with 2 threshold failures and 2 critical failures. Codex passed 2/3 hard assertions and failed one run because it created `benchmark/test-run-2026-05-11.md` instead of the expected benchmark-test-skill report path; Codex output quality averaged 85.7%, with 1 threshold failure and 1 critical failure. Report: `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$session-triage benchmark-test-skill benchmark failure`.

## Previous Benchmark Rerun: benchmark-test-skill

**Goal:** Rerun `$benchmark-test-skill benchmark-test-skill` after the benchmark harness routing fix, using fresh eligibility, verify, and both-agent benchmark evidence on 2026-05-12.

**Acceptance Criteria:**
- [x] `pnpm bench --list-skills` confirms `benchmark-test-skill` is known and reports its coverage status.
- [x] `pnpm verify --skill benchmark-test-skill` passes or blocks benchmark execution with a recorded failure.
- [x] `pnpm bench --skill benchmark-test-skill --agent both --runs 3 --chunk-size 3 --pause 0` runs only after verify passes.
- [x] `benchmark/test-benchmark-test-skill-2026-05-12.md` records fresh verify, benchmark, latency, cost, consistency, and raw session evidence.
- [x] Results are recorded in `tasks/todo.md`, then committed and pushed on `master`.

**Preflight:** `benchmark-test-skill` is known with `coverage=custom` using `tests/layer4/setups/tier1-workflows.setup.ts`.

**Result:** Benchmark rerun completed on 2026-05-12. Verify passed with layer1 in 8.5s across 1,256 tests; layer2 was skipped because no target-specific layer2 tests matched `benchmark-test-skill`. The both-agent benchmark completed with no infrastructure-blocked runs. Claude failed 0/3 hard assertions because all three runs omitted the required next-command handoff, and run #1 also exited with code 143; Claude output quality averaged 89.8%, with no threshold or critical failures. Codex passed 3/3 hard assertions; Codex output quality averaged 85.8%, with 1 threshold failure and 2 critical failures. Report: `benchmark/test-benchmark-test-skill-2026-05-12.md`. Recommended next command: `$session-triage benchmark-test-skill benchmark failure`.

**Triage Result:** Completed `$session-triage benchmark-test-skill benchmark failure`. The failure is verified as Claude output noncompliance with the benchmark fixture's route-label requirement: Claude generated the report and recommended `$ship`, but did not include a literal next-route label in the generated report file, while Codex did. The durable gap is the fixture/contract alignment around artifact-level route labels, not a new skill or broad recurrence issue. Report: `benchmark/triage-benchmark-test-skill-rerun-2026-05-12.md`. Recommended next command: `$targeted-skill-builder benchmark-test-skill benchmark failure`.

**Targeted Fix Result:** Completed `$targeted-skill-builder benchmark-test-skill benchmark failure`. Mirrored benchmark-test-skill contracts now require a report-level literal next-route label, and the tier1 fixture prompts for `Recommended next command:` with Claude `/ship` and Codex `$ship` route expectations. Added layer1 coverage for the mirrored contract wording, fixture prompt, hard assertions, and next-route quality scoring. Validation passed with install/dependency/version/routing checks, focused layer1 tests, benchmark coverage, `pnpm --dir tests verify --skill benchmark-test-skill`, Claude smoke `benchmark-test-skill-claude-d6496431` (1/1 hard pass, 94.3% quality), and Codex smoke `benchmark-test-skill-codex-159870b2` (1/1 hard pass, 100.0% quality). Recommended next command: `$benchmark-test-skill benchmark-test-skill`.

## Phase 38: First-Party Newsletter Capture And Admin

**Goal:** Add first-party newsletter capture to the app-enabled Skills Showcase using Neon persistence, tRPC contracts, TanStack Query client state, and a protected admin export page.

**Source:** `specs/first-party-skills-showcase-newsletter-capture.md` and `specs/first-party-skills-showcase-newsletter-capture-interview.md`.

**Scope:**
- Add Neon schema and database access for newsletter subscribers.
- Add tRPC contracts for subscribing, admin login/session validation, subscriber listing, and subscriber export.
- Use TanStack Query for public subscribe mutation state and admin list/export state.
- Update `/follow` so the newsletter form submits to first-party capture instead of static/provider-backed capture.
- Add `/admin/newsletter` protected by a Vercel-configured shared admin secret.
- Support subscriber search, copy-all active emails, and CSV download for use in an external newsletter app or email client.
- Preserve privacy posture by storing email, status, source page, consent text version, and timestamps only.

**Non-Goals:**
- Do not implement newsletter sending.
- Do not add a full auth provider or user accounts.
- Do not store raw IP addresses, raw user-agent strings, or visitor-tracking analytics.
- Do not add admin edit/delete/status-management unless a narrow implementation need appears.
- Do not create or modify GitHub Actions.

**Acceptance Criteria:**
- [ ] `/follow` submits valid email addresses through a first-party tRPC mutation.
- [ ] Neon stores subscriber records with `email`, `status`, `source_page`, `consent_text_version`, `created_at`, and `updated_at`.
- [ ] Duplicate signup behavior is idempotent.
- [ ] Invalid emails and database failures produce appropriate public UI states without leaking internals.
- [ ] `/admin/newsletter` requires the configured admin secret.
- [ ] Admin can list, search, copy active emails, and download CSV.
- [ ] Subscriber data is never exposed in generated public assets or committed files.
- [ ] Local app validation, database-contract checks, admin access checks, and whitespace checks pass.
- [ ] No GitHub Actions are created, modified, or recommended.

**Parallelization:** serial
**Coordination Notes:** This phase crosses database schema, API contracts, client mutation state, admin access, and privacy behavior. Keep serial until the app/data contract is stable; review security/privacy before shipping.

> Test strategy: tests-after

### Execution Profile
**Parallel mode:** serial
**Integration owner:** main agent
**Conflict risk:** high
**Review gates:** correctness, tests, security, docs/API conformance

**Subagent lanes:** none

### Implementation
- [x] Step 38.1: Add Phase 38 dependencies and configure environment
  - Files: modify `apps/skills-showcase/package.json`, create `apps/skills-showcase/.env.example`, modify `apps/skills-showcase/next.config.mjs`
  - Add `@trpc/server`, `@trpc/client`, `@trpc/react-query` (11.17.0), `@tanstack/react-query` (5.x), `@neondatabase/serverless` (1.x), `zod` (4.x). Update `next.config.mjs` to remove any static export assumption. Create `.env.example` with `DATABASE_URL` and `NEWSLETTER_ADMIN_SECRET` placeholders.
- [x] Step 38.2: Create database schema, connection module, and migration SQL
  - Files: create `apps/skills-showcase/src/db/index.ts`, create `apps/skills-showcase/src/db/schema.ts`, create `apps/skills-showcase/src/db/migrate.sql`
  - Use `@neondatabase/serverless` with `DATABASE_URL` from env. Define `newsletter_subscribers` table with `id` (serial PK), `email` (unique, not null), `status` (default `active`), `source_page`, `consent_text_version`, `created_at`, `updated_at`. Create idempotent migration SQL. Export typed query helpers.
- [x] Step 38.3: Set up tRPC server with newsletter router
  - Files: create `apps/skills-showcase/src/trpc/init.ts`, create `apps/skills-showcase/src/trpc/router.ts`, create `apps/skills-showcase/src/trpc/newsletter.ts`, create `apps/skills-showcase/app/api/trpc/[trpc]/route.ts`
  - Create tRPC context (with admin secret check), base router, and newsletter sub-router. Procedures: `subscribe` (public mutation — validate email with Zod, upsert into Neon, idempotent), `adminLogin` (mutation — verify secret, set session cookie), `adminList` (protected query — list/search subscribers), `adminExport` (protected query — CSV-formatted subscriber dump). Wire to Next.js App Router catch-all API route.
- [x] Step 38.4: Set up tRPC client, TanStack Query provider, and layout integration
  - Files: create `apps/skills-showcase/src/trpc/client.ts`, create `apps/skills-showcase/src/trpc/provider.tsx`, modify `apps/skills-showcase/app/layout.tsx`
  - Create tRPC-React client binding with TanStack Query. Create a `"use client"` provider component wrapping `QueryClientProvider` and `trpc.Provider`. Add to root layout around `{children}`.
- [x] Step 38.5: Refactor newsletter form to use tRPC subscribe mutation
  - Files: modify `apps/skills-showcase/src/showcase/newsletter-form.tsx`, modify `apps/skills-showcase/app/follow/page.tsx`
  - Replace the imperative `fetch` + `data-provider-endpoint` logic with a tRPC `newsletter.subscribe` mutation via TanStack Query. Preserve the state machine (ready, invalid-email, pending, success, error), ARIA attributes, and visual states. Remove the `provider-missing` state since the endpoint is now first-party. Remove the `data-provider-endpoint` attribute and related HTML notes from the follow page. Add `source_page` and `consent_text_version` to the mutation payload.
- [ ] Step 38.6: Create admin newsletter page with secret-based auth gate
  - Files: create `apps/skills-showcase/app/admin/newsletter/page.tsx`, create `apps/skills-showcase/src/showcase/admin-newsletter.tsx`
  - Build `/admin/newsletter` with a login gate (prompt for admin secret, call `adminLogin` mutation). After auth: subscriber list table with search input, copy-all-active-emails button, CSV download button. Use tRPC `adminList` and `adminExport` queries. Style consistently with the showcase blueprint system.
- [ ] Step 38.7: Update deploy contract, routes, and documentation
  - Files: modify `tasks/deploy.md`, modify `apps/skills-showcase/src/showcase/routes.ts`, modify `apps/skills-showcase/README.md`
  - Update deploy contract: remove "static export" / "no runtime API" / "no database" language, add Neon `DATABASE_URL` and `NEWSLETTER_ADMIN_SECRET` env var requirements, note server-side deployment. Add `/admin/newsletter` to routes.ts. Update README with new local dev setup (env vars, database).

### Green
- [ ] Step 38.8: Write regression tests covering newsletter capture and admin behavior
  - Files: create or modify test files under `apps/skills-showcase/src/`
  - Cover: subscribe mutation validation (valid email, invalid email, idempotent duplicate), newsletter form UI states (ready, invalid-email, pending, success, error — no more provider-missing), admin auth gate (reject without secret, accept with correct secret), admin list/search/export rendering, privacy (no subscriber data in generated assets).
- [ ] Step 38.9: Run local app validation, database-contract checks, and whitespace checks; fix only concrete issues found by validation
  - Files: modify only files implicated by failing validation
  - Run typecheck, build, tests, showcase data validation, `git diff --check`.

### Milestone: Phase 38 First-Party Newsletter Capture And Admin
**Acceptance Criteria:**
- [ ] `/follow` submits valid email addresses through a first-party tRPC mutation.
- [ ] Neon stores subscriber records with `email`, `status`, `source_page`, `consent_text_version`, `created_at`, and `updated_at`.
- [ ] Duplicate signup behavior is idempotent.
- [ ] Invalid emails and database failures produce appropriate public UI states without leaking internals.
- [ ] `/admin/newsletter` requires the configured admin secret.
- [ ] Admin can list, search, copy active emails, and download CSV.
- [ ] Subscriber data is never exposed in generated public assets or committed files.
- [ ] Local app validation, database-contract checks, admin access checks, and whitespace checks pass.
- [ ] No GitHub Actions are created, modified, or recommended.
- [ ] All phase tests pass.
- [ ] No regressions in previous phase tests.

**On Completion**
- Deviations from plan: [fill when phase is done]
- Tech debt / follow-ups: [fill when phase is done]
- Ready for next phase: no

## Ship Summary

Step 38.5 complete — refactored `newsletter-form.tsx` from imperative DOM manipulation (`useEffect` + `querySelector` + `fetch`) to a proper React component using `useState`, `trpc.newsletter.subscribe.useMutation()`, and controlled inputs. Removed `provider-missing` state. Updated `app/follow/page.tsx` to render `<NewsletterFormClient />` directly instead of static form markup + `data-provider-endpoint`. Updated smoke tests and newsletter-form tests. 52/52 tests green, typecheck and build passing.

Deploy skipped (manual Vercel, not yet configured). No failing tests expected.

## What needs to be built

Create the admin newsletter page with secret-based auth gate.

### Files to create/modify

- `apps/skills-showcase/app/admin/newsletter/page.tsx` — Create the admin newsletter route page (server component shell with metadata).
- `apps/skills-showcase/src/showcase/admin-newsletter.tsx` — Create `"use client"` admin newsletter component with:
  - Login gate: text input for admin secret, calls `trpc.newsletter.adminLogin.useMutation()`
  - After auth: subscriber list table using `trpc.newsletter.adminList.useQuery()`
  - Search input that filters the list via the `search` query param
  - "Copy all active emails" button — copies active subscriber emails to clipboard
  - "Download CSV" button — calls `trpc.newsletter.adminExport.useQuery()` and triggers file download
  - Style consistently with showcase blueprint system (use existing `form-panel`, `button`, `tag`, `eyebrow`, `coordinate` classes)

### Technical approach

**Auth gate:**
- Component state: `authenticated` boolean, stored in React state (not persisted — relies on the HTTP-only session cookie set by `adminLogin`)
- On page load: attempt an `adminList` query — if it succeeds, user is authenticated (cookie present); if 401, show login form
- Login form: single input for secret, submit calls `adminLogin` mutation, on success set `authenticated = true`

**Subscriber list:**
- Use `trpc.newsletter.adminList.useQuery({ search, limit: 100, offset })` with refetch on search change
- Render as a simple `<table>` with columns: email, status, source page, created at
- Search input above the table with debounced refetch

**Export actions:**
- "Copy active emails": filter displayed data for `status === 'active'`, join with `, `, copy to clipboard
- "Download CSV": call `adminExport` query, create Blob, trigger download

### Execution Profile
- **Parallel mode:** serial
- **Integration owner:** main agent
- **Test strategy:** tests-after

### Verification
- `pnpm --dir apps/skills-showcase typecheck` passes
- `pnpm --dir apps/skills-showcase build` passes
- `pnpm --dir apps/skills-showcase test` passes (52+ tests green)
- `git diff --check` clean
- Admin page renders login gate without errors
- After login, list/search/copy/download all functional

**Ship-one-step handoff:** implement only Step 38.6, validate it, then run `/ship` when done.

## Routing

- **Next work:** Step 38.6 — Create admin newsletter page with secret-based auth gate
- **Recommended next command:** `/run`

## Review

### Ad-Hoc: YouTube Concept Research Skill

**Goal:** Add a mirrored `youtube-concept-research` skill to the `youtube-ops` pack for concept-first YouTube research before scripting or production.

**Plan:**
- [x] Add Codex `packs/youtube-ops/codex/youtube-concept-research/SKILL.md`.
- [x] Add Claude mirror `packs/youtube-ops/claude/youtube-concept-research/SKILL.md`.
- [x] Update `packs/youtube-ops/PACK.md` to include the new skill in the flow and skill list.
- [x] Update relevant next-skill routing lists so the concept-first lane is discoverable.
- [x] Verify frontmatter, routing references, whitespace, and git diff.

**Review:** Complete. Both Claude and Codex mirrors exist, `PACK.md` is updated, routing references are updated across relevant pack skills, and benchmark coverage includes the new skill. Validation passed with `./scripts/skill-deps.sh --broken`, `./scripts/skill-versions.sh --missing`, `./scripts/skill-next-step-routing.sh --missing`, `./scripts/skill-pack-routing-audit.sh`, `git diff --check`, and `pnpm --dir tests test`.
