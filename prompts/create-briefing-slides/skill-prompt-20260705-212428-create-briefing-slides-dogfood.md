---
skill: create-briefing-slides
agent: codex
captured_at: 2026-07-05T21:24:28-0400
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Dogfood `create-briefing-slides` On Itself

## Summary
Generate one self-contained briefing deck that explains the `create-briefing-slides` skill and its shared convention, using the skill exactly as intended: slide-first review surface, dense source artifacts linked as references, and only the deck opened automatically.

## Key Changes
- Create `briefing-slides/create-briefing-slides.html`.
- Use these dense references, linked from the deck but not auto-opened:
  - `packs/base/codex/create-briefing-slides/SKILL.md`
  - `docs/briefing-slides-convention.md`
  - `packs/base/codex/create-briefing-slides/agents/openai.yaml`
- Capture the visible invocation under `prompts/create-briefing-slides/`.
- Record the work in `tasks/roadmap.md` and `tasks/todo.md`, then close it with a review entry.
- Commit and push the deck, prompt log, and task-doc updates.

## Deck Content
- Title: `Create Briefing Slides`
- Slides:
  - What problem the skill solves: dense review pages become visual briefing decks.
  - How the artifact model works: deck first, dense pages as references.
  - Source and output rules: `briefing-slides/*.html`, archive-before-replace, linked references.
  - Required presentation behavior: navigation, keyboard controls, progress, print CSS.
  - Review controls: gates, slide feedback, annotations, marking, copy fallback.
  - YAML handoff contract: `briefing_slides`, `reference_pages`, `gate_answers`, `slide_feedback`, `approval_status`.
  - Dogfood findings: what the skill/convention made clear and what may need future tightening.
  - References and final review compiler.
- The deck should include at least one example gate question and one slide-feedback control so the dogfood run exercises the review mechanics.

## Test Plan
- Textually inspect the generated HTML for:
  - previous/next controls
  - keyboard navigation script
  - slide counter/progress indicator
  - reference links
  - gate controls
  - feedback/annotation/marking controls
  - YAML compiler and copy fallback
  - print CSS
- Confirm all repo-local reference links exist.
- Run `git diff --check`.
- Attempt to open only `briefing-slides/create-briefing-slides.html` with the repo HTML opener.
- Do not open referenced dense files automatically.

## Assumptions
- Dogfood scope is deck-only.
- The deck is a tracked repo artifact and should be committed/pushed.
- No full `$dogfood` audit docs or manual task artifacts are needed for this run.
