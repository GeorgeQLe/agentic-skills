---
skill: ui-interview
agent: claude
captured_at: 2026-06-10T21:46:20-04:00
source: approved-plan-routing
prompt_scope: visible-user-invocation
---

but ui-interview is one of the few which does this error in not putting the text inline before the ask user question tool is invoked. Also it does not follow the 3 phase research structure: preliminary research doc, then alignment page, then approve and finalize the research.

Routed by the user-approved follow-up plan "ui-interview alignment: inline-first manifest visibility (fleet-wide) + 3-phase research lifecycle": the v0.13 guaranteed-visible-channel fix defaulted to AskUserQuestion option previews, but the user corrected that manifests must render inline in the conversation as turn-final text (previews demoted to supplementary mirror, never sole channel), propagated to docs/interview-convention.md and all interview skills; and ui-interview must adopt the repo's 3-phase research lifecycle (preliminary working packet → review alignment page → final compiled YAML approval → finalize canonical specs) in both full and requirements-only modes, governing the in-flight deck-creation interview.
