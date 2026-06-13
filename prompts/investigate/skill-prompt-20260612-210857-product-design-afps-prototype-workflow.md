---
skill: investigate
agent: codex
captured_at: 2026-06-12T21:08:57-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

can you investigate and evaluate this workflow: Implemented and shipped the product-design flow routing update.

  Changed the default contract to:

  user-flow-map -> ux-variations [specific-user-flow] -> ui-interview [specific-ux-variation]

  Key updates:

  - user-flow-map is now the root of the wireframe tree.
  - ux-variations expands one selected user flow into alternate progression branches.
  - ui-interview now follows the four-step branch loop: investigate coordination, render an HTML visual mockup, interview/retry for alignment, then approve/reject/route onward.
  - --requirements-only and --layout-mode remain available, but are no longer the default path.
  - Added required version archives, changelogs, prompt captures, task notes, and a lesson.

  Verification passed:

  - git diff --check
  - stale active-route scans
  - bash scripts/skill-archive-audit.sh --strict
  - /opt/homebrew/bin/bash scripts/skill-versions.sh --missing
  - /opt/homebrew/bin/bash scripts/skill-next-step-routing.sh --missing

can you determine if that's the best way for us to accomplish the prototype phase of AFPS?
