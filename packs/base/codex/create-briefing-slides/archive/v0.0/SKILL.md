---
name: create-briefing-slides
description: Create or amend a self-contained PowerPoint-like HTML briefing slide deck for alignment pages, interrogation questions, research findings, framework/workshop artifacts, specs, reports, or documentation plans. Use when Codex should make review material more visual and navigable while preserving dense alignment/interrogation pages and source documents as linked references instead of auto-opening them.
type: ops
version: v0.0
release_lane: canary
required_conventions: [briefing-slides]
argument-hint: "<topic-or-artifact> [--from alignment/page.html|interrogation/page.html|path] [--out briefing-slides/name.html]"
---

# Create Briefing Slides

Invoke as `$create-briefing-slides`.

Create a self-contained HTML slide deck that becomes the primary opened review surface for dense research, interrogation, alignment, framework, workshop, spec, report, or documentation-creation artifacts. Follow the shared briefing-slides convention via the packaged convention resolver: source checkouts load `docs/briefing-slides-convention.md`, and packaged installs load `assets/briefing-slides-convention.md`.

## Workflow

1. Resolve scope:
   - Default to the current repository.
   - Identify the source artifact(s), owning skill or workflow, topic slug, dense reference pages, and output path.
   - Use `briefing-slides/<owner-or-topic>.html` by default unless the user provides a valid `briefing-slides/*.html` output path.
   - If a dense `alignment/*.html` or `interrogation/*.html` page exists, read it and use it as a linked reference source. If a dense page is expected but missing, create or ask the owning producing skill to create it first.

2. Preserve dense references:
   - Keep traditional dense pages, markdown reports, specs, research notes, framework outputs, and source documents as canonical references.
   - Link references from the deck with relative links.
   - Do not embed dense pages and do not auto-open linked references.

3. Design the deck:
   - Load `docs/briefing-slides-convention.md` or `assets/briefing-slides-convention.md` before authoring the HTML.
   - Choose the relevant deck pattern: alignment briefing, interrogation briefing, framework/workshop briefing, or documentation briefing.
   - Build the required presentation navigation, reference chips, review controls, marking/annotation controls, copy fallback, print CSS, and YAML compiler from the convention.

4. Archive before replacement:
   - Before replacing an existing deck, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/briefing-slides/<filename>.html`.
   - Highlight what changed in the updated deck when amending after feedback.

5. Verify and open:
   - Run the convention's verification checklist.
   - Attempt to open only the deck, using the packaged HTML opener command specified by the convention.
   - Report opener status exactly as `focused`, `opened`, `fallback-opened`, `blocked`, or `failed`.

## Output

Report:

- Slide deck path.
- Dense reference paths.
- Owning command used in compiled YAML.
- Archive path when a deck was replaced.
- Verification performed.
- Browser-open status for the slide deck.
- Next review action.

## Constraints

- Do not open dense alignment pages, interrogation pages, markdown reports, specs, or references automatically.
- Do not delete or replace dense pages with the slide deck.
- Do not create or modify GitHub Actions workflows.
- Do not write outside the target repository.

## Briefing Slides Convention

Follow the shared briefing-slides convention via the packaged convention resolver. Source checkouts load `docs/briefing-slides-convention.md`; packaged installs load `assets/briefing-slides-convention.md`.

## Default Shipping Contract

- Generated decks, archive copies, and source artifacts are normal repo artifacts. Follow the target repo's shipping rules after verification.
- When operating in this `agentic-skills` repository, commit and push intended tracked changes on the primary branch before stopping unless the user explicitly says not to ship.
