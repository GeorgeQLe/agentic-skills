# Briefing Slides Convention

This file is the **single authoring source** for the briefing-slides convention. Source checkouts load it from `docs/briefing-slides-convention.md`; packaged installs load the same content from `assets/briefing-slides-convention.md`. Briefing slides are the slide-first review surface for dense alignment pages, interrogation pages, research findings, framework/workshop artifacts, specs, reports, and documentation plans.

Briefing slides do **not** replace dense artifacts. They make review more visual and navigable while preserving dense `alignment/*.html`, `interrogation/*.html`, markdown reports, specs, research notes, and source documents as linked references.

## Output Path

Write decks under `briefing-slides/`.

- Default path: `briefing-slides/<owner-or-topic>.html`.
- User-provided output paths must be repo-relative, directly under `briefing-slides/`, and end in `.html`.
- Before replacing an existing deck, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/briefing-slides/<filename>.html`.
- When amending after feedback, visibly mark what changed in the new deck.

## Source And Reference Handling

Identify source artifacts, dense review pages, owning skill or workflow, topic slug, and output path before authoring the deck.

- If a dense `alignment/*.html` or `interrogation/*.html` page exists, read it and use it as a linked reference source.
- If a dense review page is expected but missing, create or ask the owning producing skill to create the dense page first according to its normal convention. Do not replace dense pages with slides.
- Keep dense pages and source documents canonical. Link them from the deck using relative links such as `../alignment/<page>.html`, `../interrogation/<page>.html`, or `../research/<file>.md`.
- Do not embed dense pages with `<iframe>`, `<object>`, or `<embed>`.
- Do not auto-open linked references. After writing or amending artifacts, agents attempt to open only the slide deck.

## Presentation Experience

Build a self-contained HTML slideshow that works from `file://` with no external runtime dependency.

Required presentation controls:

- Full-screen slide-by-slide layout.
- One primary idea per slide.
- Each slide root must carry `data-briefing-slide`.
- Strong visual hierarchy with concise slide notes instead of wall-of-text prose.
- Authored slide content must intentionally fit within the visible slide area at normal desktop and mobile-sized review viewports.
- Do not use hidden overflow, clipped containers, tiny text, or scroll traps as a substitute for making slide content fit.
- Use compact visual structures, short labels, and per-element reference links or chips so slides summarize decisions while dense artifacts carry the detail.
- Previous/next buttons.
- Previous and next controls should expose `data-slide-prev` and `data-slide-next` for static auditing.
- Keyboard navigation: `ArrowLeft`, `ArrowRight`, `A`, `D`, `Home`, `End`, and `Space`.
- Empty-stage click navigation: clicking the deck stage around the visible slide advances to the next slide.
- Stage-click navigation must not hijack clicks inside the slide, links, buttons, form controls, filmstrip controls, topbar, footer, or review inputs.
- Persistent slide counter and progress track.
- The counter and progress track should expose `data-slide-counter` and `data-slide-progress`.
- Hash or local browser state so the current slide can be resumed or linked.
- Agenda or filmstrip navigation when the deck has more than five slides.
- A references slide and per-slide reference chips.
- Reference chips should expose `data-reference-chip`; a references slide should expose `data-references-slide`.
- Print CSS that produces one slide per page.

Use purpose-built visual structures where they clarify the material: decision cards, evidence matrices, comparison tables, canvases, workshop boards, scored options, risk/assumption registers, and compact charts. Avoid using the deck as a raw markdown dump.

## Fit-To-Slide Content

Slides are briefing surfaces, not dense artifacts. Author each slide so the content can be read without scrolling the slide body or discovering hidden overflow.

- Keep headings short, labels compact, and body copy selective.
- Prefer matrices, cards, chips, badges, charts, and concise lists over paragraphs of explanation.
- Link relevant slide elements to `SKILL.md`, convention docs, source markdown, dense review pages, reports, specs, or metadata files for deeper detail.
- Move dense rationale, evidence, edge cases, and procedural detail into linked artifacts instead of stuffing them into the slide.
- A bounded code, YAML, or copy-fallback area may scroll internally only when it is the explicit tool surface for that slide and does not force the slide layout itself to overflow.
- If a slide cannot fit without hiding content, split it into multiple slides or link the detail out.

## Deck Patterns

Choose the pattern that matches the source material.

**Alignment briefing:** problem frame, source/evidence summary, findings, decision options, recommendation, risks/assumptions, proposed artifacts/file changes, gates, references, final response compiler.

**Interrogation briefing:** context, what is being tested, question groups, why each question matters, answer fields, open-question markers, evidence gaps, next-step gates, references, final response compiler.

**Framework/workshop briefing:** framework lens, canvas or matrix, scored options, tradeoffs, implications, workshop decisions, unresolved prompts, references, final response compiler.

**Documentation briefing:** intended audience, source inputs, document structure, claims/evidence map, proposed outline, unresolved decisions, destination paths, references, final response compiler.

## Review Controls

Every deck must support review and feedback directly on the relevant slide.

- Every slide must expose a slide-scoped feedback trigger, such as a Feedback button or chip, marked `data-feedback-trigger`.
- Gate questions must be answerable inline with radio, select, or freeform controls.
- Slide feedback controls must support at least `emphasize`, `revise`, `needs-clarification`, and freeform notes.
- Marking controls must support per-slide statuses such as `important`, `question`, `approved`, or `skip`, stored in local browser state.
- Annotation controls must allow per-slide notes that are included in compiled YAML.
- Selecting any feedback, mark, annotation, or clarification action must open a slide-scoped sidebar or drawer for the active slide, marked `data-slide-feedback-panel`.
- The sidebar or drawer must update when the active slide changes, preserve inline gate questions on their original slides, and provide the active slide's feedback controls, marks, note field, local slide-feedback YAML, and copy controls.
- The persistent footer or bottom bar may show navigation, progress, slide count, and a compact feedback status or trigger affordance only. When present, mark it `data-briefing-footer`. It must not contain required feedback controls, required gate answers, final approval controls, or compiled YAML output.
- Copy controls must support copying the slide title, selected text where possible, references, and compiled YAML.
- Clipboard writes must use the Clipboard API when available and fall back to selecting a read-only textarea.

Do not use sticky or fixed compile banners. Put compile controls in normal slide flow.

## YAML Contract

Compiled YAML is produced only by local slide-feedback YAML controls in the slide sidebar or near-slide feedback surface, marked `data-slide-feedback-yaml`, and by the final full-deck compiler on the response or final slide, marked `data-full-deck-yaml`. The final full-deck compiler remains in normal slide flow on the last slide or an explicit response slide.

Do not render prior compiled YAML sidecars, answer sidecars, or generated review YAML files as primary slide cards, action chips, or navigation links. If they are needed as provenance, include them in compiled `source_artifacts` and optionally in a dedicated References slide with non-action wording.

Every compiled YAML payload begins with:

```yaml
# Invoke with: <owning-command>
command: "<owning-command>"
briefing_slides: briefing-slides/<name>.html
```

Include:

- `reference_pages`: every dense page or source artifact path linked by the deck.
- `source_artifacts`: source artifact paths or identifiers used to build the deck.
- `gate_answers`: answered gate questions.
- `slide_feedback`: per-slide feedback entries.
- `annotations`: per-slide notes.
- `marked_slides`: per-slide status marks.
- `unanswered_required_questions`: required questions still unanswered.
- `approval_status`: `not-approved` or `ready-for-agent-review`.

Route review YAML to the owning producing workflow when one exists. Use the briefing-slides skill command only for ad hoc decks that the briefing-slides skill owns.

Set `approval_status: ready-for-agent-review` only when every required gate has an approving answer and there is no unresolved revise, down, or clarification feedback.

## Verification And Opening

Before handoff:

- Run the static convention audit with `npx skillpacks briefing slides audit` from the repository root when the packaged CLI is available. In this source checkout, `node scripts/audit-briefing-slides.mjs` is the direct fallback.
- Re-open the written deck textually and confirm it contains navigation controls, gate controls, feedback controls, YAML compiler, reference links, and print CSS.
- Verify every slide has a feedback trigger and that activating it opens the slide-scoped sidebar or drawer.
- Verify footer or bottom-bar markup does not contain required feedback inputs, required gate inputs, or YAML output textareas.
- Verify prior YAML sidecars are not promoted as primary reference or action links outside a dedicated references or provenance area.
- Confirm every linked dense reference path exists when it is repo-local, or mark missing references visibly in the deck.
- Verify authored slide content fits without incoherent overlap, clipped text, hidden overflow, or slide-body scrolling at a normal desktop viewport and a mobile-sized viewport. Internal scrolling is allowed only for explicit bounded tool surfaces such as YAML output or copy fallback controls.
- Attempt to open only the deck with `npx skillpacks alignment pages open briefing-slides/<name>.html --browser auto`.
- In this source checkout only, if the packaged CLI is unavailable, fall back to `node scripts/open-html-page.mjs briefing-slides/<name>.html --browser auto`.
- Report opener status exactly as `focused`, `opened`, `fallback-opened`, `blocked`, or `failed`.

The opener may use the existing alignment page open helper because it is the repository's generic HTML opener; this does not make the deck an alignment page and does not authorize opening dense reference pages.
