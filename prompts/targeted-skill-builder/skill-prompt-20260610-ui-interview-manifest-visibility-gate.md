---
skill: targeted-skill-builder
agent: claude
captured_at: 2026-06-10T20:00:00-04:00
source: approved-plan-routing
prompt_scope: visible-user-invocation
---

/targeted-skill-builder Update existing skill ui-interview (packs/product-design/{claude,codex}/ui-interview) v0.12 → v0.13: confirmation gates must deliver manifests through a guaranteed-visible channel (AskUserQuestion option previews or turn-final text), never mid-turn text before a tool call. Verified by session-triage in this session; fix plan already approved.

Routed by the user-approved session-triage fix plan (step 2) for the 2026-06-10 incident: `/ui-interview --requirements-only deck-creation` emitted the UI Assumptions Manifest only as mid-turn text (in fact only inside thinking blocks) before an AskUserQuestion call, so the user was asked to confirm "the manifest above" without ever seeing it.
