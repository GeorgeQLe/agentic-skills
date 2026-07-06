---
name: create-briefing-slides
description: Create or amend a self-contained PowerPoint-like HTML briefing slide deck for alignment pages, interrogation questions, research findings, framework/workshop artifacts, specs, reports, or documentation plans. Use when Claude should make review material more visual and navigable while preserving dense alignment/interrogation pages and source documents as linked references instead of auto-opening them.
type: ops
version: v0.0
argument-hint: "<topic-or-artifact> [--from alignment/page.html|interrogation/page.html|path] [--out briefing-slides/name.html]"
---

# Create Briefing Slides

Invoke as `/create-briefing-slides`.

Create a self-contained HTML slide deck that becomes the primary opened review surface for dense research, interrogation, alignment, framework, workshop, spec, report, or documentation-creation artifacts.

## Workflow

1. Resolve scope:
   - Default to the current repository.
   - Identify the source artifact(s), owning skill or workflow, topic slug, dense reference pages, and output path.
   - Use `briefing-slides/<owner-or-topic>.html` by default.
   - If the user provides `--out`, require a repo-relative path under `briefing-slides/` ending in `.html`.
   - If a dense `alignment/*.html` or `interrogation/*.html` page exists, read it and use it as a linked reference source.
   - If the dense review page is expected but missing, create or ask the owning producing skill to create the dense page first according to its normal convention. Do not replace dense pages with slides.

2. Preserve dense references:
   - Keep traditional dense pages, markdown reports, specs, research notes, framework outputs, and source documents as canonical references.
   - Link references from the deck using relative links such as `../alignment/<page>.html`, `../interrogation/<page>.html`, or `../research/<file>.md`.
   - Do not embed dense pages with iframes or object tags.
   - Do not auto-open linked references. After writing or amending artifacts, agents attempt to open only the slide deck.

3. Design the deck:
   - Build a full-screen, slide-by-slide HTML experience that works from `file://` with no external runtime dependency.
   - Use a presentation layout: one idea per slide, strong hierarchy, charts/tables/decision cards where useful, and concise slide notes for context that would otherwise become wall-of-text prose.
   - Include a persistent slide counter, progress track, previous/next buttons, keyboard navigation (`ArrowLeft`, `ArrowRight`, `Home`, `End`, `Space`), and hash or local state so the current slide can be resumed or linked.
   - Include an agenda or filmstrip navigation for non-linear jumps when the deck has more than five slides.
   - Include a references slide and per-slide reference chips that open dense artifacts only when the human chooses them.
   - Include print CSS that produces one slide per page.

4. Use the correct slide pattern:
   - **Alignment briefing:** problem frame, source/evidence summary, findings, decision options, recommendation, risks/assumptions, proposed artifacts/file changes, gates, references, final response compiler.
   - **Interrogation briefing:** context, what is being tested, question groups, why each question matters, answer fields, open-question markers, evidence gaps, next-step gates, references, final response compiler.
   - **Framework/workshop briefing:** framework lens, canvas or matrix, scored options, tradeoffs, implications, workshop decisions, unresolved prompts, references, response compiler.
   - **Documentation briefing:** intended audience, source inputs, document structure, claims/evidence map, proposed outline, unresolved decisions, destination paths, references, response compiler.

5. Add review controls:
   - Gate questions must be answerable inline on the relevant slide with radio/select/freeform controls.
   - Section or slide feedback controls must support at least: `emphasize`, `revise`, `needs-clarification`, and freeform notes.
   - Marking controls must support per-slide status such as `important`, `question`, `approved`, or `skip`, stored in local browser state.
   - Annotation controls must allow the reviewer to write per-slide notes that are included in compiled YAML.
   - Copy controls must support copying the slide title, selected text where possible, references, and compiled YAML.
   - Clipboard writes must use the Clipboard API when available and fall back to selecting a read-only textarea.

6. Compile YAML:
   - Provide local slide-feedback YAML near each slide's feedback controls.
   - Provide a final in-flow compile section on the last slide or an explicit response slide.
   - Begin compiled YAML with `# Invoke with: <owning-command>` followed by `command: "<owning-command>"` as the first real YAML key.
   - Include `briefing_slides: briefing-slides/<name>.html`.
   - Include `reference_pages` with every dense page or source artifact path linked by the deck.
   - Include `source_artifacts`, `gate_answers`, `slide_feedback`, `annotations`, `marked_slides`, `unanswered_required_questions`, and `approval_status`.
   - Route review YAML to the owning producing workflow when one exists. Use `/create-briefing-slides ...` only for ad hoc decks that this skill owns.
   - Set `approval_status: ready-for-agent-review` only when every required gate has an approving answer and there is no unresolved revise/clarification feedback.

7. Archive before replacement:
   - Before replacing an existing deck, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/briefing-slides/<filename>.html`.
   - Highlight what changed in the updated deck when amending after feedback.

8. Verify and open:
   - Re-open the written deck textually and confirm it contains navigation controls, gate controls, feedback controls, YAML compiler, reference links, and print CSS.
   - Confirm every linked dense reference path exists when it is repo-local, or mark missing references visibly in the deck.
   - Attempt to open only the deck with `npx skillpacks alignment pages open briefing-slides/<name>.html --browser auto`.
   - In this source checkout only, if the packaged CLI is unavailable, fall back to `node scripts/open-html-page.mjs briefing-slides/<name>.html --browser auto`.
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
- Do not make a landing page; make the usable slide experience the first screen.
- Do not rely on a dev server, external CDN, remote fonts, or external JavaScript.
- Do not create or modify GitHub Actions workflows.
- Do not write outside the target repository.

## Default Shipping Contract

- Generated decks, archive copies, and source artifacts are normal repo artifacts. Follow the target repo's shipping rules after verification.
- When operating in this `agentic-skills` repository, commit and push intended tracked changes on the primary branch before stopping unless the user explicitly says not to ship.
