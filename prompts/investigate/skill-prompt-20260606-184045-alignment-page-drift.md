---
skill: investigate
agent: codex
captured_at: 2026-06-06T18:40:45-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

Investigate and fix: per-skill ALIGNMENT-PAGE.md bundling creates sync drift and silent non-conformance

  Context

  A retrospective in the gblock-party-redux repo (tasks/analysis-alignment-page-compile-buttons.md) found that 9 of 10 alignment pages missed required local per-section "Compile Feedback
  YAML" controls. Three root causes were identified, all traceable to how ALIGNMENT-PAGE.md is managed in this repo:

  1. Per-skill bundling creates drift windows. Each skill gets its own copy of ALIGNMENT-PAGE.md with skill-specific path substitutions (e.g., alignment/positioning-{topic}.html). When the
  shared convention is updated, per-skill copies are stale until the next pack refresh. A May 30 upgrade pass ran 4 hours before the local compile requirement landed in 7d042fbe — every
  page upgraded in that window got the old standard.
  2. The positioning skill's own template diverged from the engine file. The positioning skill had local compile requirements in its embedded template before the shared ALIGNMENT-PAGE.md
  did, creating an inconsistency where positioning-generated pages conformed but others didn't. Only one page (positioning-gblock-party) conformed, and it was because of this
  skill-specific template — not because the standard pipeline worked.
  3. No enforcement when skills aren't invoked. When users give direct edit plans or pre-built revision instructions, no skill is invoked, so no ALIGNMENT-PAGE.md is loaded. Two pages
  (positioning-jtbd, moore-positioning) were created/revised this way and never saw the standard.

  Key commits in this repo

  - 38186e59 (May 28): ALIGNMENT-PAGE.md first bundled per-skill
  - 7484e664 (May 28): Per-section feedback controls added
  - 001a8c3b (May 29): Feedback-only YAML bottom compile added
  - 7d042fbe (May 30): LOCAL per-section compile controls introduced
  - aad354c0 (May 30): "Two places" (local + bottom) finalized

  Investigation tasks

  1. Map the current bundling mechanism. How are per-skill ALIGNMENT-PAGE.md files generated from the shared convention? Is it a script, manual copy, or template expansion? Where is the
  shared source of truth? Find the generation/sync tooling.
  2. Audit current drift. Diff the per-skill copies against the shared convention. Are any currently out of sync? How many unique variants exist vs how many should be identical except for
  path substitution?
  3. Evaluate consolidation options. Can per-skill copies be eliminated in favor of a single shared ALIGNMENT-PAGE.md with runtime path substitution? What would break? The only per-skill
  difference should be the alignment/{skill-name}-{topic}.html path pattern.
  4. Check the positioning skill template divergence. Where did the positioning skill get local compile requirements before the shared convention? Is this a separate template file, or was
  SKILL.md modified independently? Is this still diverged?
  5. Assess the "no skill invoked" gap. When a user edits an alignment page without invoking a skill, what mechanism (if any) could ensure the ALIGNMENT-PAGE.md standard is consulted? Is
  this a CLAUDE.md instruction, a hook, or something the upgrade-alignment-pages skill should catch?

  Deliverable

  A plan (enter plan mode) with:
  - Findings from the investigation
  - Recommended approach for consolidation (single source of truth vs improved sync)
  - Steps to implement the fix
  - How to prevent future drift

  Don't implement yet — plan first and wait for approval.
