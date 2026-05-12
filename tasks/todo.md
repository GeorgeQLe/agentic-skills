# Active Phase

**Project:** Claude Skills / agentic-skills
**Status:** Phase 38 ready for planning.
**Current phase:** Phase 38 of 39 — First-Party Newsletter Capture And Admin
**Last completed phase:** Phase 37 — Skills Showcase Next.js Preservation Refactor

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

**On Completion**
- Deviations from plan: [fill when phase is done]
- Tech debt / follow-ups: [fill when phase is done]
- Ready for next phase: no

## Review
