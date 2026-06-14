---
skill: provision-agentic-config
agent: codex
captured_at: 2026-06-14T15:41:28-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

The pattern is best called overcorrection with negative instruction anchoring. In plain terms: the agent treats feedback as a signal to add a warning about the unwanted behavior, which repeats and preserves
  the unwanted frame instead of editing toward the desired final state. Adjacent terms are negative priming, instruction overfitting, and rejected-frame retention.

  I found explicit local evidence for this in the repo history, including your June 14 prompt: “why are we mentioning exec at all? We don't need an agent to have negative reinforcement to not use exec right?”
  The broader pattern also shows up around research feedback, anti-sycophancy, and alignment-page revision flows.

  Prevention rule:

  - Classify feedback as add, remove, replace, reweight, or verify.
  - For remove, replace, or reweight, make the artifact match the desired final state.
  - Do not preserve the rejected concept as a new warning, caveat, or future-agent instruction unless explicitly requested.
  - In research docs, keep corrected/rejected claims out of the canonical narrative; if provenance matters, put it in a short revision note or archive record. Best placement:

  1. Root AGENTS.md / CLAUDE.md
     Put the general behavior rule there because it should apply to every edit:
     When applying user revision feedback, do not preserve rejected framing as warnings, caveats, or negative reinforcement. Edit toward the desired final artifact unless the user explicitly asks to document
     the rejected case.

  2. Research/alignment conventions
     Also put a narrower version in the research docs/alignment-page convention because that is where the damage is highest. Future agents read research artifacts as context, so rejected ideas should not be
     reintroduced into canonical findings.

  3. Skill-specific instructions only where needed
     Add it to research-producing skills or feedback-handling skills if they already have an Evidence And Feedback Handling section. Avoid copying a long clause everywhere unless the shared convention can’t
     reliably reach those skills.

  I would phrase it as a revision hygiene rule, not a “don’t do bad thing” warning. Something like:

  ### Revision Hygiene

  When the user asks to remove, replace, or reduce emphasis on content, update the artifact toward the requested final state. Do not add new warnings, caveats, labels, or future-agent instructions that repeat
  the rejected framing unless the user explicitly asks to preserve that context.

  For research artifacts, keep corrected or rejected claims out of the canonical narrative. If provenance is needed, put it in a concise revision note or archive record, not in findings, recommendations, or
  forward-looking instructions.
