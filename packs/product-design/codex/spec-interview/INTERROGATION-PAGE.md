# Interrogation Page — spec-interview

When this skill needs to elicit user context before producing research or other durable output, run the **stage-zero interrogation loop** in HTML before building the stage-one framework/scope alignment page. Build one interrogation page per round at `interrogation/spec-interview-r{N}-{branch}.html`, where `{N}` is the 1-based round number and `{branch}` is the research fork or product-path slug (in the flat single-product case `{branch}` is the normalized topic slug, matching the alignment page's `{topic}`).

**Stage model.** Interrogation is stage zero. It does not replace the framework/scope page (stage one) or the alignment review page (stage two); it precedes them, so that framework options and scope are informed by elicited answers rather than pre-authored blind.

```
stage 0  →  interrogation/spec-interview-r1..rN.html   ELICITATION: open input drives research
            loop until the confidence gate passes
stage 1  →  alignment framework/scope page            SELECTION: options informed by stage 0
            research runs
stage 2  →  alignment/spec-interview-{topic}.html        REVIEW/APPROVAL of deliverables
```

**The round loop.** Each round is one heavy phase of the Research Session Loop: the agent builds an interrogation page, stops, the user answers and compiles the captured-answers YAML, and a fresh session reads those answers, runs the confidence gate, and either emits the next round or writes the coverage checkpoint and advances to stage one.

```
round = 1
build interrogation/spec-interview-r{round}-{branch}.html   (manifest if round==1, else follow-ups)
STOP → user answers → compiled answers YAML
agent reads answers, runs the CONFIDENCE GATE:
    confident enough to produce useful research?
        NO  → round += 1; build the next round of deeper/follow-up questions; repeat
        YES → set data-interrogation-gate="coverage-checkpoint"; render the coverage
              checkpoint; advance to stage one
```

**Round 1 is the assumptions manifest.** The first round renders the skill's assumptions manifest — 3–7 source-tagged assumptions (`[from prompt]`, `[from repo]`, `[from research]`, `[from spec]`, `[from codebase]`, `[from git]`, `[inferred]`) — as interactive **confirm / correct / flag** controls, plus the first batch of genuinely open questions placed only where no assumption is derivable. The assumptions manifest is not a separate concern from interrogation; it is its disciplined first round, the guard against lazy "tell me about…" prompts. Every correction the user makes to an assumption seeds the next round's follow-ups — that adaptivity is the mechanism that makes the loop feel like a real interview. Deliver each round page, not a terminal manifest, as the confirmation surface.

**Subsequent rounds are adaptive follow-ups.** Rounds 2..N are seeded by the prior round's compiled answers: drill into corrections, resolve contradictions, and cover any interview area still open. Do not re-ask what a prior round already settled. Recommend-and-override is preferred over bare open prompts: present a researched default and let the user accept or override it in free text.

**Open-answer evidence validation.** Treat user open-question responses as intake evidence and hypotheses, not automatically validated facts. When consuming compiled answers, validate factual, evidentiary, market, technical, customer-language, buyer-language, pricing, channel, competitor, or behavior claims against the available repo context, prior research, code/git evidence, and approved external research where needed before using them to satisfy the confidence gate or shape downstream research. Preserve subjective preferences as preferences, but label claim-like answers as `supported`, `partially-supported`, `unsupported`, `contradicted`, `hunch/inferred`, or `needs-research` in the sidecar or handoff notes. If evidence is missing or contrary, push back clearly in the next round or coverage checkpoint instead of laundering the answer into a finding. For "real buyer/user/customer language" answers, require provenance such as verbatim quotes, interview notes, sales/support text, reviews, search snippets, or other sourceable evidence; otherwise treat the phrasing as founder/user hunch language that needs research.

**The confidence gate (loop exit).** The gate is a contract, not a fixed round count, and the skill **cannot advance to stage one until** it passes. The gate passes only when (a) at least one interrogation round has been completed and its answers consumed, and (b) every interview area defined by this skill is covered by an answer or explicitly waived by the user. The agent runs the gate by judgment and renders a **coverage checkpoint** as the final round's exit gate — "here is everything we established; confirm completeness or flag gaps." Mechanical enforcement is limited to artifact existence (≥1 completed round on disk) and the ≥1-open-input rule below; coverage itself is semantic and is confirmed or waived by the user at the checkpoint. If the user flags a gap, treat the checkpoint round as not-final, raise the round number, and continue the loop.

**Interview areas the confidence gate covers.** Before advancing to stage one, cover: the consolidated prototype and research frame in scope; whether unchecked post-prototype items remain that must complete first; the concept constraints, ICP, and journey evidence the spec must fit; the screens/pages to walk through and their production behaviors; the riskiest solution-design decisions and their acceptance criteria; and explicit non-goals and deferred work. Open inputs must let the user supply proprietary technical constraints, correct solution decisions, and name acceptance criteria the agent cannot infer.

**The ≥1-open-input rule (hard).** Each round page **must contain at least one genuinely open input** — a free-text `<textarea>` or text `<input>`, or a recommend-and-override control — that shapes downstream research, marked with the `data-open-input` attribute. A round that offers only approve/reject or pre-authored multiple-choice controls is invalid: it collapses the archetype back into the rubber-stamp problem it exists to fix. The audit enforces this mechanically.

**Page metadata.** Set these attributes on the `<html>` element of every round page:
- `data-visual-tier` — the rendering tier (`document`, `visual`, or `prototype`), same semantics as the alignment page.
- `data-interrogation-status` — `review` while the page awaits answers, `confirmed` once its answers have been compiled and consumed by a later session.
- `data-interrogation-round` — the 1-based round number, which must match the `r{N}` segment of the filename.
- `data-interrogation-gate` — `continue` when more rounds are expected, or `coverage-checkpoint` when this round is the loop's exit gate.

**Answer capture (the sidecar).** Each round page ends with a bottom compile section — the same "Compile Responses" / "Copy YAML" mechanism the alignment page uses — that aggregates the round's assumption decisions, open answers, and gate answers into YAML. The page must name its capture sidecar via a `data-answer-sidecar` attribute on the compile section, pointing at `research/_working/interrogation-spec-interview-r{N}.yaml` (flat) or `research/{slug}/_working/interrogation-spec-interview-r{N}.yaml` (product-path). The agent writes the compiled answers to that sidecar when it consumes the round, preserving the round-by-round audit trail. The compiled YAML carries `interrogation_page`, `round`, `round_status` (`partial` or `complete`), `gate_state` (`continue` or `coverage-checkpoint`), an `assumptions` list (each with `source`, `decision` of `confirm`/`correct`/`flag`, and optional `correction`), an `open_answers` list, and a `gate_answers` list. Populate `interrogation_page` and the sidecar path from the known repo-relative paths, not from the page title or window location.

**Self-routing continuation payload.** Like a Pattern A review page, every interrogation round page's compiled YAML includes an `agent_routing` mapping so a fresh agent can route back to the parent orchestrator that owns the loop:

```yaml
agent_routing:
  workflow: interrogation-loop
  parent_skill: spec-interview
  command: "/spec-interview"
  gate_owner: parent-orchestrator
  gate_type: interrogation-round
  round: 1
  answer_sidecar: research/_working/interrogation-spec-interview-r1.yaml
  next_resolution: parent-resolves-from-yaml-and-filesystem
```

The parent still owns interpretation: it validates the answers, writes the sidecar, runs the confidence gate, and decides whether to emit the next round or advance to stage one. Include the product/research path argument in `command` when a product path is active. `agent_routing.command` must name the parent orchestrator, never a child framework path command.

**Required round structure.** After the page title and a one-line summary, include a top-of-page table of contents (in normal document flow — no sidebar, drawer, or sticky navigation), then the round's content sections, then the bottom compile section. For round 1: the assumptions manifest (confirm/correct/flag) followed by the first open questions. For rounds 2..N: the adaptive follow-up questions. For the coverage-checkpoint round: the full coverage summary of everything established across all rounds, with a final confirm-or-flag-gaps gate. Do not place compile, copy, or answer controls in a sticky or fixed banner; the bottom compile section is ordinary in-flow content.

**Required inline questions.** Each open question lives in a visually distinct question block placed directly under the context it governs. Assumption rows use confirm/correct/flag radio controls with a correction text box revealed on "correct" or "flag". Open questions use a free-text answer field (or a recommend-and-override radio set whose final option is a free-text override), and must include the standing "Other / None of the above" and "Need clarification" options when rendered as radios. Generate questions based on what genuinely needs user input — do not pad with filler.

**Dark-mode styling.** Use the alignment page's dark color scheme. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body, `--surface` for cards and the table of contents, `--purple` for question/gate headings, `--accent` for links and section headings. Question block backgrounds use `#1c2333`.

**Responsive layout.** Include `<meta name="viewport" content="width=device-width, initial-scale=1">` in the head. Use at most two breakpoints (`@media (max-width: 860px)` and `@media (max-width: 560px)`). Wrap every `<table>` in a `<div style="overflow-x: auto">`. All interactive elements have a minimum 44px touch target and at least `10px 16px` padding. Use `rem` for font sizes; do not set a fixed `font-size` on `html`/`body`. Set `max-width: 100%; overflow-wrap: break-word;` on `main` so nothing forces a horizontal scrollbar.

**Bar and meter sizing.** CSS-rendered bars, meters, and coverage/progress fills (a container element plus a percentage-sized fill child) are a common idiom on interrogation pages — coverage summaries, confidence meters — and they collapse silently when sized wrong. Any element given a percentage `height` (e.g. a fill at `height: 100%`) must sit inside a container with an **explicit, definite `height`** — never `min-height` alone. A percentage height resolves against the parent's definite height; a `min-height`-only parent has none, so the fill computes to zero and paints empty even at `width: 100%`. Prefer the native `<progress>`/`<meter>` element where it fits; otherwise give the container an explicit `height` (or give the fill its own `min-height` so it paints regardless of the parent). Always render the value as text beside the bar (e.g. `100% — Covered`) so the meaning survives even if the fill fails to paint. The active-page audit (`node scripts/audit-interrogation-pages.mjs`) flags the `min-height`-only container plus percentage-fill collapse mechanically.

**Embed prohibition.** Do not use `<object>`, `<iframe>`, or `<embed>`, or "open working packet" / "view full document" links as the primary rendering of any content. The interrogation page HTML must contain its content directly. Self-contained inline `<canvas>` and `<svg>` charts are permitted (visual/prototype tiers).

**Brief Me (text-to-speech).** Every interrogation page must include a `<script src="../scripts/alignment-tts-kokoro.js"></script>` tag before `</body>` — the same shared TTS asset the alignment page uses (interrogation/ is a sibling of alignment/, so `../scripts/` resolves identically). Do not inline the TTS script and do not use `type="module"`. To inject TTS into existing pages, run `node scripts/inject-tts.mjs --dir interrogation interrogation/<page>.html` (idempotent; `--force` to replace an existing block).

**Browser open.** After writing a round page, attempt to open it from the repository root with `node scripts/open-html-page.mjs interrogation/spec-interview-r{N}-{branch}.html --browser auto`. Report the final status (`focused`, `opened`, `fallback-opened`, `blocked`, or `failed`) in the handoff, with the absolute path when `blocked` or `failed`. A blocked browser open does not fail the round if the file was written and verified.

**Terminal fallback.** Build and open the HTML interrogation page by default. Only when an HTML page genuinely cannot be opened (no browser available and the user cannot open a file path) fall back to terminal `AskUserQuestion`/`request_user_input`, following the Manifest Visibility Rule in `docs/interview-convention.md`. The fallback is degraded, not co-equal: do not interrogate in the terminal when the HTML surface is available.

**Archiving.** Round pages are durable artifacts; do not overwrite a prior round. Each round gets its own `r{N}` file. If a round page must be rebuilt before its answers are consumed (e.g. the user asks for a different question set), archive the prior copy to `docs/history/archive/YYYY-MM-DD/HHMMSS/interrogation/spec-interview-r{N}-{branch}.html` before replacing it.
