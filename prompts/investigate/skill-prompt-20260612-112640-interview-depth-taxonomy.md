---
skill: investigate
agent: codex
captured_at: 2026-06-12T11:26:40-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

Recommendation

  Do not add type: interview, and do not rename the public convention to interrogation.

  Make the existing interview_depth: full | light | none convention first-class and enforce it. type is already used as an activity/output category: planning, research, analysis, execution, etc.
  Full-interview skills cross those categories, so changing them to type: interview would lose useful routing/display meaning.

  Evidence

  - Existing active type: inventory: research 184, analysis 86, planning 71, plus execution/review/debugging/shipping/ops/router variants.
  - Existing interview_depth: inventory: none 83, light 77, full 41.
  - Full interview skills span planning, research, and analysis, including ui-interview, skill-interview, user-flow-map, enterprise-icp, customer-discovery, gtm, and lifecycle maps.
  - docs/interview-convention.md:3 already defines interview depth and says terminal interview happens before alignment review.
  - scripts/upgrade-alignment-page.mjs:139 still uses hardcoded full/light skill sets instead of actually consuming interview_depth, and that is drift-prone.
  - docs/skill-anatomy.md:42 does not list interview_depth among optional frontmatter fields, despite the convention using it.

  Regression Assessment

  Your regression claim is supported, but the root cause is not “missing skill type.” It is enforcement drift around ui-interview --requirements-only and downstream handoff behavior. The current
  working tree already contains in-progress guards requiring ui-interview provenance and preventing user-flow-map approval from counting as a completed UI interview.

  What To Do

  1. Keep type as broad activity category.
  2. Promote interview_depth in docs/skill-anatomy.md.
  3. Update scripts/upgrade-alignment-page.mjs and catalog generation to read interview_depth from frontmatter.
  4. Add tests that full-interview skills require:
      - evidence/context gathering first
      - visible assumptions manifest
      - one material decision per turn
      - coverage checkpoint before alignment page
      - explicit provenance for evidence-only synthesis

  5. Use “interview” publicly. Use “interrogate assumptions” or “relentless interview protocol” in prose if needed. Do not use interrogation as a frontmatter type or command label.

  I recorded the audit notes in tasks/todo.md and captured the prompt under prompts/investigate/. I did not commit because the repo already has a large unrelated staged/in-progress change set;
  committing this would mix scopes. Verification run: git diff --check -- tasks/roadmap.md tasks/todo.md passed. I want to evaluate the above recommendation because I feel like we should split it between interview and interrogation where interrogation is full while interview is light. Why would we have a none? That defeats the purpose of interview and in any case, there is always some questioning because the assumption manifest should always be asked of the user. So there is never a case of no questions
