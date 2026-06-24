# Interrogation Page Convention

This file is the **single authoring source** for the interrogation-page convention. It is bundled per-skill as `INTERROGATION-PAGE.md` (load-on-demand) inside every **participating** skill directory; `scripts/upgrade-interrogation-page.mjs` reads the marked block below and propagates it. **Edit the convention here only** — never hand-edit a generated `INTERROGATION-PAGE.md`; re-run the generator instead. Replace `{skill-name}` with the skill's name. The `{{SKILL_INTERROGATION_AREAS}}` and `{{SKILL_VISUAL_TIER}}` tokens are filled per skill by the generator.

The interrogation page is the **stage zero** elicitation surface. It is the inverse of the alignment page: where the alignment page reviews and approves deliverables *after* research (stage two), the interrogation page elicits the unknowns the agent cannot infer *before* research (stage zero), and the framework/scope alignment page is stage one in between. Interrogation moved out of the terminal and into HTML so that questioning is adaptive, durable, and round-by-round diffable. Terminal `AskUserQuestion`/`request_user_input` survives only as a degraded fallback when an HTML page cannot be opened.

**Participating-skill registry.** Only skills listed in `INTERROGATION_SKILLS` in `scripts/upgrade-interrogation-page.mjs` receive a bundled `INTERROGATION-PAGE.md`. Rollout is additive: adding a skill name to that registry (and giving it an `## Interrogation Page` stub section) is all that is needed to bring it into the archetype. `scripts/interrogation-skip-list.txt` excludes a registered skill from the policy; `scripts/interrogation-bespoke-list.txt` marks a skill whose `## Interrogation Page` section is intentionally hand-authored in both mirrors. Both lists are exact, mirroring the alignment generator's contracts.

**Output path consistency.** Every active `INTERROGATION-PAGE.md` — generated or bespoke — must reference only its owning skill's output path: each `interrogation/<name>-r{N}-{branch}.html` occurrence in the bundle must have `<name>` equal to the skill directory name. The generator validates this after its write pass and exits non-zero (in dry-run and write mode) on any foreign-skill reference.

**Generated-bundle drift check.** `scripts/upgrade-interrogation-page.mjs --check` validates, without writing, that every participating skill's on-disk `INTERROGATION-PAGE.md` byte-equals the renderer's expected output and that its SKILL.md stub paragraph is current, exiting non-zero with named per-skill diagnostics. Plain `--dry-run` keeps exiting 0 on pending updates so the edit-convention → preview → write workflow is preserved (`--dry-run` reports `Updated: 0` only when everything is in sync); `--check` is the repo-state gate enforced by layer1 tests.

**Active-page audit.** `node scripts/audit-interrogation-pages.mjs` is the read-only convention gate for active `interrogation/*.html` pages. Direct edits made without invoking a skill are still checked (archived pages under `docs/history/archive/` are out of scope). It validates the scriptable subset of this convention: the Brief Me TTS include (the `scripts/alignment-tts-kokoro.js` src tag before `</body>` — not inlined, not `type="module"`), the `data-visual-tier` and `data-interrogation-status` attributes on `<html>` with valid slugs, the `data-interrogation-round` attribute matching the round number in the filename, the responsive viewport meta, the embed prohibition (`<object>`/`<iframe>`/`<embed>`), the **≥1 open input per round** rule (at least one `data-open-input` control), the **open-question markers** (at least one `data-open-question` block, with `data-recommended-answer`, `data-agent-confidence` in `{high, medium, low}`, and a `data-clarify-copy` button each occurring at least as many times as `data-open-question`), the presence of the confidence/coverage exit gate (`data-interrogation-gate` with a valid value), the round-file naming pattern (`{skill}-r{N}-{branch}.html`), and the answer-sidecar reference (`data-answer-sidecar` pointing at the round's `interrogation-{skill}-r{N}.yaml` capture file). It exits non-zero with named per-page diagnostics grouped per check and prints `exact|DRIFT` summary lines; it has no fix mode — TTS diagnostics route to `node scripts/inject-tts.mjs --dir interrogation`, the rest are manual fixes. Layer1 enforces this source repo state via `tests/layer1/audit-interrogation-pages.test.ts`, and the auditor supports `--root <path>` for fixture trees.

<!-- interrogation-convention:start -->
When this skill needs to elicit user context before producing research or other durable output, run the **stage-zero interrogation loop** in HTML before building the stage-one framework/scope alignment page. Build one interrogation page per round at `interrogation/{skill-name}-r{N}-{branch}.html`, where `{N}` is the 1-based round number and `{branch}` is the research fork or product-path slug (in the flat single-product case `{branch}` is the normalized topic slug, matching the alignment page's `{topic}`).

**Stage model.** Interrogation is stage zero. It does not replace the framework/scope page (stage one) or the alignment review page (stage two); it precedes them, so that framework options and scope are informed by elicited answers rather than pre-authored blind.

```
stage 0  →  interrogation/{skill-name}-r1..rN.html   ELICITATION: open input drives research
            loop until the confidence gate passes
stage 1  →  alignment framework/scope page            SELECTION: options informed by stage 0
            research runs
stage 2  →  alignment/{skill-name}-{topic}.html        REVIEW/APPROVAL of deliverables
```

**The round loop.** Each round is one heavy phase of the Research Session Loop: the agent builds an interrogation page, stops, the user answers and compiles the captured-answers YAML, and a fresh session reads those answers, runs the confidence gate, and either emits the next round or writes the coverage checkpoint and advances to stage one.

```
round = 1
build interrogation/{skill-name}-r{round}-{branch}.html   (manifest if round==1, else follow-ups)
STOP → user answers → compiled answers YAML
agent reads answers, runs the CONFIDENCE GATE:
    confident enough to produce useful research?
        NO  → round += 1; build the next round of deeper/follow-up questions; repeat
        YES → set data-interrogation-gate="coverage-checkpoint"; render the coverage
              checkpoint; advance to stage one
```

**Round 1 is the assumptions manifest.** The first round renders the skill's assumptions manifest — 3–7 source-tagged assumptions (`[from prompt]`, `[from repo]`, `[from research]`, `[from spec]`, `[from codebase]`, `[from git]`, `[inferred]`) — as interactive **confirm / correct / flag** controls, plus the first batch of genuinely open questions placed only where no assumption is derivable. The assumptions manifest is not a separate concern from interrogation; it is its disciplined first round, the guard against lazy "tell me about…" prompts. Every correction the user makes to an assumption seeds the next round's follow-ups — that adaptivity is the mechanism that makes the loop feel like a real interview. Deliver each round page, not a terminal manifest, as the confirmation surface.

**Subsequent rounds are adaptive follow-ups.** Rounds 2..N are seeded by the prior round's compiled answers: drill into corrections, resolve contradictions, and cover any interview area still open. Do not re-ask what a prior round already settled. Recommend-and-override is preferred over bare open prompts: present a researched default and let the user accept or override it in free text.

**Open-answer evidence validation.** Treat user open-question responses as intake evidence and hypotheses, not automatically validated facts. Validation happens during compiled-answer consumption, before answers are used to satisfy the confidence gate or shape downstream research. During interrogation, keep validation lightweight and limited to available evidence checks: repo context, prior research, code/git evidence, supplied sources, and already-approved external research. Do not require full synthesized research during stage-zero interrogation; default to validating and classifying during interrogation, then defer deeper research as an explicit research question or source-plan item unless the claim is contradicted or blocks confidence-gate completeness.

Preserve subjective preferences as preferences, but label claim-like factual, evidentiary, market, technical, customer-language, buyer-language, pricing, channel, competitor, or behavior answers as `supported`, `partially-supported`, `unsupported`, `contradicted`, `hunch/inferred`, or `needs-research` in the sidecar or handoff notes. Use this decision rule: `supported` and `partially-supported` claims may inform the confidence gate with confidence labeling; `hunch/inferred` and `needs-research` claims may be carried forward as research questions or source-plan items, but must not be treated as proven evidence; `unsupported` and `contradicted` claims require clear pushback in the next round or coverage checkpoint when they affect confidence-gate completeness, candidate selection, buyer language, or downstream scope. For "real buyer/user/customer language" answers, require provenance such as verbatim quotes, interview notes, sales/support text, reviews, search snippets, or other sourceable evidence. Founder-supplied phrasing without provenance is hunch language: label it as such, convert it into a research target, and do not count it as real buyer/user/customer language.

**The confidence gate (loop exit).** The gate is a contract, not a fixed round count, and the skill **cannot advance to stage one until** it passes. The gate passes only when (a) at least one interrogation round has been completed and its answers consumed, and (b) every interview area defined by this skill is covered by an answer or explicitly waived by the user. The agent runs the gate by judgment and renders a **coverage checkpoint** as the final round's exit gate — "here is everything we established; confirm completeness or flag gaps." Mechanical enforcement is limited to artifact existence (≥1 completed round on disk) and the ≥1-open-input rule below; coverage itself is semantic and is confirmed or waived by the user at the checkpoint. If the user flags a gap, treat the checkpoint round as not-final, raise the round number, and continue the loop.

{{SKILL_INTERROGATION_AREAS}}

**The ≥1-open-input rule (hard).** Each round page **must contain at least one genuinely open input** — a free-text `<textarea>` or text `<input>`, or a recommend-and-override control — that shapes downstream research, marked with the `data-open-input` attribute. A round that offers only approve/reject or pre-authored multiple-choice controls is invalid: it collapses the archetype back into the rubber-stamp problem it exists to fix. Each open input lives inside a **well-formed open-question block** marked with `data-open-question`, and the page must contain **at least one** such block. Every `data-open-question` block must carry all four markers: the `data-open-input` control, a `data-recommended-answer` element, a `data-agent-confidence="high|medium|low"` badge, and a `data-clarify-copy` button (defined under "Required inline questions" and "Need clarification (copy)" below). The audit enforces this mechanically.

**Page metadata.** Set these attributes on the `<html>` element of every round page:
- `data-visual-tier` — the rendering tier (`document`, `visual`, or `prototype`), same semantics as the alignment page.
- `data-interrogation-status` — `review` while the page awaits answers, `confirmed` once its answers have been compiled and consumed by a later session.
- `data-interrogation-round` — the 1-based round number, which must match the `r{N}` segment of the filename.
- `data-interrogation-gate` — `continue` when more rounds are expected, or `coverage-checkpoint` when this round is the loop's exit gate.

**Answer capture (the sidecar).** Each round page ends with a bottom compile section — the same "Compile Responses" / "Copy YAML" mechanism the alignment page uses — that aggregates the round's assumption decisions, open answers, and gate answers into YAML. The page must name its capture sidecar via a `data-answer-sidecar` attribute on the compile section, pointing at `research/_working/interrogation-{skill-name}-r{N}.yaml` (flat) or `research/{slug}/_working/interrogation-{skill-name}-r{N}.yaml` (product-path). The agent writes the compiled answers to that sidecar when it consumes the round, preserving the round-by-round audit trail. The compiled YAML carries `interrogation_page`, `round`, `round_status` (`partial` or `complete`), `gate_state` (`continue` or `coverage-checkpoint`), an `assumptions` list (each with `source`, `decision` of `confirm`/`correct`/`flag`, and optional `correction`), an `open_answers` list, and a `gate_answers` list. Each `open_answers` entry should also carry the agent-authored `recommended_answer` and `agent_confidence` (`high`/`medium`/`low`) shown for that question, so the round-by-round audit trail records what the agent recommended and how strongly. These two fields are a small, optional schema addition; the "Need clarification" mechanism stays clipboard-only and is not captured in the sidecar. Populate `interrogation_page` and the sidecar path from the known repo-relative paths, not from the page title or window location.

**Self-routing continuation payload.** Like a Pattern A review page, every interrogation round page's compiled YAML includes an `agent_routing` mapping so a fresh agent can route back to the parent orchestrator that owns the loop:

```yaml
agent_routing:
  workflow: interrogation-loop
  parent_skill: {skill-name}
  command: "/{skill-name}"
  gate_owner: parent-orchestrator
  gate_type: interrogation-round
  round: 1
  answer_sidecar: research/_working/interrogation-{skill-name}-r1.yaml
  next_resolution: parent-resolves-from-yaml-and-filesystem
```

The parent still owns interpretation: it validates the answers, writes the sidecar, runs the confidence gate, and decides whether to emit the next round or advance to stage one. Include the product/research path argument in `command` when a product path is active. `agent_routing.command` must name the parent orchestrator, never a child framework path command.

**Required round structure.** After the page title and a one-line summary, include a top-of-page table of contents (in normal document flow — no sidebar, drawer, or sticky navigation), then the round's content sections, then the bottom compile section. For round 1: the assumptions manifest (confirm/correct/flag) followed by the first open questions. For rounds 2..N: the adaptive follow-up questions. For the coverage-checkpoint round: the full coverage summary of everything established across all rounds, with a final confirm-or-flag-gaps gate. Do not place compile, copy, or answer controls in a sticky or fixed banner; the bottom compile section is ordinary in-flow content.

**Required inline questions.** Each open question lives in a visually distinct question block, marked with `data-open-question`, placed directly under the context it governs. Assumption rows use confirm/correct/flag radio controls with a correction text box revealed on "correct" or "flag". Open questions use a free-text answer field (or a recommend-and-override radio set whose final option is a free-text override), and must include the standing "Other / None of the above" and "Need clarification" options when rendered as radios. Generate questions based on what genuinely needs user input — do not pad with filler.

Every open question — both the free-text and the recommend-and-override forms — must include, inside its `data-open-question` block:

- a **`data-recommended-answer`** element holding a recommended/example answer that illustrates what the question is actually asking and the shape of a good response. This is the agent's best inferred answer, written so the user understands the question even when the phrasing alone is unclear.
- a **`data-agent-confidence="high|medium|low"`** badge rendered next to the question, signalling how much the agent trusts that recommended answer so the user knows how hard to scrutinize or override it. The visible label renders the value (e.g. "Agent confidence: medium"). Use `high` when the recommendation is well-grounded in repo/research evidence, `medium` when it is a reasonable inference, and `low` when it is a guess the user should correct.
- a **`data-clarify-copy`** `<button>` (see "Need clarification (copy)" below) that copies a clarification-request payload to the clipboard.

The recommended answer and confidence badge make the question self-explanatory; the clarify-copy button is the escape hatch when it still is not. The active-page audit and a layer1 test enforce all four markers mechanically: every `data-open-question` block must carry `data-open-input`, `data-recommended-answer`, `data-agent-confidence` (with a value in `{high, medium, low}`), and `data-clarify-copy`.

**Need clarification (copy).** Each open question's `data-clarify-copy` button is the open-question clarification mechanism: a clipboard action, not a YAML flag. When clicked it copies a payload of exactly this form to the clipboard so the user can paste it straight back to the agent and get a clearer question in the next round (the same round-loop paste model the page already uses):

```
Question: "<question text>"
I need clarification on what this is asking before I can answer.
```

Use the Clipboard API with a textarea-selection fallback when clipboard access is blocked — the same fallback idiom as the alignment page's "Copy YAML" control (canonical reference: `copyText` in `scripts/generate-skillmap-excalidraw.mjs`): `try { await navigator.clipboard.writeText(text); status = 'Copied' } catch { textarea.focus(); textarea.select(); status = 'Select text to copy' }`. Show a copy-status line beside the button so the result is visible. This is distinct from the radio "Need clarification" option (which records `needs-clarification` in the compiled YAML); the clarify-copy button is a clipboard-only escape hatch for open questions and is not captured in the sidecar.

{{SKILL_VISUAL_TIER}}

**Dark-mode styling.** Use the alignment page's dark color scheme. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body, `--surface` for cards and the table of contents, `--purple` for question/gate headings, `--accent` for links and section headings. Question block backgrounds use `#1c2333`.

**Responsive layout.** Include `<meta name="viewport" content="width=device-width, initial-scale=1">` in the head. Use at most two breakpoints (`@media (max-width: 860px)` and `@media (max-width: 560px)`). Wrap every `<table>` in a `<div style="overflow-x: auto">`. All interactive elements have a minimum 44px touch target and at least `10px 16px` padding. Use `rem` for font sizes; do not set a fixed `font-size` on `html`/`body`. Set `max-width: 100%; overflow-wrap: break-word;` on `main` so nothing forces a horizontal scrollbar.

**Bar and meter sizing.** CSS-rendered bars, meters, and coverage/progress fills (a container element plus a percentage-sized fill child) are a common idiom on interrogation pages — coverage summaries, confidence meters — and they collapse silently when sized wrong. Any element given a percentage `height` (e.g. a fill at `height: 100%`) must sit inside a container with an **explicit, definite `height`** — never `min-height` alone. A percentage height resolves against the parent's definite height; a `min-height`-only parent has none, so the fill computes to zero and paints empty even at `width: 100%`. Prefer the native `<progress>`/`<meter>` element where it fits; otherwise give the container an explicit `height` (or give the fill its own `min-height` so it paints regardless of the parent). Always render the value as text beside the bar (e.g. `100% — Covered`) so the meaning survives even if the fill fails to paint. The active-page audit (`node scripts/audit-interrogation-pages.mjs`) flags the `min-height`-only container plus percentage-fill collapse mechanically.

**Embed prohibition.** Do not use `<object>`, `<iframe>`, or `<embed>`, or "open working packet" / "view full document" links as the primary rendering of any content. The interrogation page HTML must contain its content directly. Self-contained inline `<canvas>` and `<svg>` charts are permitted (visual/prototype tiers).

**Brief Me (text-to-speech).** Every interrogation page must include a `<script src="../scripts/alignment-tts-kokoro.js"></script>` tag before `</body>` — the same shared TTS asset the alignment page uses (interrogation/ is a sibling of alignment/, so `../scripts/` resolves identically). Do not inline the TTS script and do not use `type="module"`. To inject TTS into existing pages, run `node scripts/inject-tts.mjs --dir interrogation interrogation/<page>.html` (idempotent; `--force` to replace an existing block).

**Browser open.** After writing a round page, attempt to open it from the repository root with `node scripts/open-html-page.mjs interrogation/{skill-name}-r{N}-{branch}.html --browser auto`. Report the final status (`focused`, `opened`, `fallback-opened`, `blocked`, or `failed`) in the handoff, with the absolute path when `blocked` or `failed`. A blocked browser open does not fail the round if the file was written and verified.

**Terminal fallback.** Build and open the HTML interrogation page by default. Only when an HTML page genuinely cannot be opened (no browser available and the user cannot open a file path) fall back to terminal `AskUserQuestion`/`request_user_input`, following the Manifest Visibility Rule in `docs/interview-convention.md`. The fallback is degraded, not co-equal: do not interrogate in the terminal when the HTML surface is available.

**Archiving.** Round pages are durable artifacts; do not overwrite a prior round. Each round gets its own `r{N}` file. If a round page must be rebuilt before its answers are consumed (e.g. the user asks for a different question set), archive the prior copy to `docs/history/archive/YYYY-MM-DD/HHMMSS/interrogation/{skill-name}-r{N}-{branch}.html` before replacing it.
<!-- interrogation-convention:end -->
