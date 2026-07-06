---
name: brainstorm
description: Evaluate the codebase and suggest ideas to explore with /feature-interview
type: planning
version: v0.8
required_conventions: [alignment-page, briefing-slides, interrogation-page]
argument-hint: "[optional: focus area] [--dump] [--quick]"
context_intake: scoped
visual_tier: prototype
---

# Brainstorm

Evaluate the current codebase and generate actionable suggestions that the user can take into `/feature-interview` for human/agent alignment, planning-destination triage, and follow-up specification or roadmap work.

This skill runs a three-stage flow by default: a **stage-zero HTML interrogation loop** elicits the ideation frame, then the agent generates the idea set, then an **always-on HTML alignment page** presents that idea set as a review/approval hub with a copyable `/feature-interview` handoff per idea. Writing the legacy `tasks/ideas.md` dump is opt-in (`--dump` flag plus the alignment page's artifact-destination gate).

Pass `--quick` to skip the interrogation loop and the alignment page entirely and run the legacy lightweight path: light terminal scoping, inline suggestions grouped by effort, and a direct append to `tasks/ideas.md`. See `## Quick Mode (--quick)`.

## Follow-up Skill Availability Gate

Before listing any `/feature-interview` prompts, verify that `feature-interview` is available through at least one of these signals:

- `.agents/project.json` has `enabled_skills.feature-interview`.
- `.agents/project.json` has an enabled pack that provides `feature-interview`; use `scripts/pack.sh which feature-interview` when available to identify the provider.
- A local or global skill file exists, such as `.claude/skills/feature-interview/SKILL.md`, `.codex/skills/feature-interview/SKILL.md`, `~/.claude/skills/feature-interview/SKILL.md`, or `~/.codex/skills/feature-interview/SKILL.md`.

If `feature-interview` is unavailable, the first line of the displayed output and the first line appended for this run in `tasks/ideas.md` must be:

```bash
npx skillpacks install feature-interview
```

Then tell Claude users to run `/reload-skills`, then `/clear` or restart if `/feature-interview` remains invisible after install. Put this prerequisite before any brainstorm suggestion or `/feature-interview <topic>` prompt.

## Process

### 0. Product-Path Scope Resolution

Resolve research scope by product path before using code or app structure as a hint:

1. If `$ARGUMENTS` names a non-archived `research/{slug}/` directory or a product-path ID whose `scope_path` points there, use that path. Treat `{slug}` as the product/app name, not the ICP, audience, or segment label.
2. If `$ARGUMENTS` names only `research/_archive/{slug}/` or a manifest entry with `status: archived` or legacy `status: abandoned`, stop and warn that the path is archived; do not write or update scoped outputs there.
3. Read `research/.progress.yaml` when present. Normalize legacy `active_path` to `active_paths` on read and write back `active_paths` on manifest updates. Treat legacy `abandoned` as `archived`; exclude `archived`, `abandoned`, `deferred`, `revisit_candidate`, `promoted`, and any `scope_path` under `research/_archive/` from active target selection.
4. If active product paths exist in the manifest, use those paths. If multiple active paths exist, ask which one to target unless this skill explicitly supports cross-path output.
5. If no active manifest target exists, list non-archived product directories under `research/`, excluding `research/_archive/` and dot directories. Auto-select only when exactly one exists; ask when multiple exist.
6. If no product directories exist, use flat `research/` single-product mode.
7. Detect monorepo/app/package structure only as a secondary hint. Suggest creating a missing `research/{slug}/` product path when code clearly exposes an app, but do not require code or monorepo detection before using `research/{slug}/`.

When product path `{slug}` is active, read and write research under `research/{slug}/`, specs under `specs/{slug}/`, and treat top-level `research/*.md` files as flat-mode documents or cross-path summaries.

1. **Understand the project**: Read CLAUDE.md, README, package config, and key source files to understand what the project does, its architecture, tech stack, and current state.
2. **Check existing plans and research**: Read `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md` (when they exist), and specs from `specs/` (or `spec.md`) if they exist to understand work already planned, in progress, or deferred as advisory records — avoid suggesting things already covered. Read `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) if it exists — competitor gaps, market white space, and positioning weaknesses are high-signal inputs for ideation. Read `research/customer-feedback.md` (or `research/{slug}/customer-feedback.md`) if it exists — "Wrong" and "New" findings are highest-signal ideation input (real user feedback that contradicts assumptions or reveals unmet needs). Read `research/metrics.md` (or `research/{slug}/metrics.md`) if it exists — instrumentation gaps can generate ideas for tooling or observability improvements.

### 2. Stage-zero interrogation loop

Unless `--quick` is set (see `## Quick Mode (--quick)`), run this loop. This skill **cannot generate the idea set until the confidence gate passes.** Before brainstorming, elicit the ideation frame in HTML interrogation rounds (see `## Interrogation Page` / `INTERROGATION-PAGE.md` in this skill's directory). Terminal questioning is the degraded fallback only when an HTML page cannot be opened.

1. **Surface an Ideation Frame Manifest (interrogation round 1).** Present what you think the project is and how you intend to brainstorm it, as confirm/correct/flag controls in `interrogation/brainstorm-r1-{branch}.html`, alongside the first genuinely open questions (each marked `data-open-input`) placed only where no assumption is derivable. Tag each assumption `[from prompt]`, `[from repo]`, `[from research]`, `[from codebase]`, or `[inferred]`. Cover:
   - project identity and current state
   - the ideation focus and which dimensions are in or out of scope (strategic/product, improvement, hygiene, market-fit)
   - effort and risk appetite (quick wins vs. larger bets) and any horizon constraints
   - areas explicitly off-limits and hard non-goals
   - what counts as a high-value idea for this project (success criteria for the brainstorm)
   - the target audience or product-path scope the ideas should serve
   - the riskiest assumptions about where the real opportunity lies

   Set `data-interrogation-round="1"`, `data-interrogation-gate="continue"`, and the answer sidecar `research/_working/interrogation-brainstorm-r1.yaml` (or `research/{slug}/_working/interrogation-brainstorm-r1.yaml` in product-path mode), open the page, and stop for the compiled round YAML.
2. **Adaptive follow-ups (rounds 2..N).** Seed each round from the prior round's compiled answers: drill into corrections, resolve contradictions, and cover any frame area still open. Do not re-ask what a prior round already settled.
3. **Confidence gate / coverage checkpoint.** When every frame area is covered or explicitly waived, set `data-interrogation-gate="coverage-checkpoint"`, render the coverage checkpoint, and advance to idea generation. If the user flags a gap, raise the round number and continue the loop.

### 3. Generate the idea set

Only after the confidence gate passes, analyse the codebase across these dimensions, scoped by the elicited ideation frame:

   **Strategic / Product**
   - **New features**: Capabilities that would make the project significantly more useful or valuable to its users — think beyond what exists today
   - **New workflows**: End-to-end flows or automation that the project could enable but doesn't yet
   - **Product line expansion**: If the project's core could serve adjacent use cases, new audiences, or spin off complementary products — suggest them
   - **Integration opportunities**: External tools, services, platforms, or APIs that would multiply the project's value

   **Improvement**
   - **Missing capabilities**: Features the project's architecture is set up for but doesn't yet offer
   - **Pain points**: Rough edges, inconsistencies, or manual steps that could be automated
   - **Performance opportunities**: Obvious bottlenecks or low-hanging optimisations
   - **Developer experience**: Build times, debugging ergonomics, onboarding friction

   **Hygiene**
   - **Technical debt**: Areas where the code has outgrown its original design
   - **Testing gaps**: Untested critical paths or missing test infrastructure
   - **Security hardening**: Areas where security posture could be improved

   **Market Fit** (only when `research/icp.md` (or `research/{slug}/icp.md`), `research/mvp-gap.md` (or `research/{slug}/mvp-gap.md`), or `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) exist)
   - **ICP alignment**: Features that directly address ICP pain points but are missing or incomplete
   - **Journey gaps**: Steps in the user or customer journey where the product loses them
   - **Unaddressed MVP gaps**: Gaps from `research/mvp-gap.md` (or `research/{slug}/mvp-gap.md`) not yet tracked in roadmap or todo
   - **Competitive white space**: Features or capabilities that no competitor offers well — opportunities from `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) market gaps
   - **Competitor leapfrog**: Specific competitor weaknesses you could exploit, or table-stakes features competitors have that you lack
   - **Positioning plays**: Ideas that would sharpen differentiation against the competitive landscape
A focus area in `$ARGUMENTS` (anything other than the `--dump` flag and a product-path slug) narrows the dimensions to that area; otherwise cover all dimensions. The elicited frame from step 2 always takes precedence over the raw argument.

### 4. Build the alignment page

Unless `--quick` is set (see `## Quick Mode (--quick)`), this step is **always-on**: after the idea set is generated, present it in the alignment page at `alignment/brainstorm-{topic}.html`, following `ALIGNMENT-PAGE.md` in this skill's directory. The page is the durable hub; do not treat a chat dump as the primary surface.

The page is structured as a review/approval hub:

- **Idea cards grouped by effort** (hours / days / weeks). Each card carries a specific actionable title, a one-line description with the concrete codebase signal (file, pattern, or metric) that motivates it, and a copyable per-idea handoff: the `/feature-interview <topic>` prompt plus a separate copy button for the additional context to paste alongside it.
- **Review gates** for the idea set: per-idea approve/reject/flag controls so the user can curate which ideas survive, plus a coverage checkpoint confirming the brainstorm covered the elicited frame.
- **Artifact-destination gate.** Confirm whether the approved ideas are also appended to `tasks/ideas.md`. `--dump` in `$ARGUMENTS` pre-sets the intent; the gate is the final confirmation. Default is no dump.
- **On approval (confirmed-page write step).** Persist the curated idea set into the page. Only when `--dump` is set and the destination gate approves (or the user selects the dump option at the gate) append the approved ideas to `tasks/ideas.md` — do not overwrite existing content. When product-path scope is active, prefix each suggestion with the app name. Keep the page open afterward as a working hub: the user copies each idea's `/feature-interview <topic>` prompt and its additional context into `/feature-interview` one at a time.

## Output

The **alignment page** (`alignment/brainstorm-{topic}.html`) is the primary, durable artifact — the idea set, its motivating evidence, the review gates, and the per-idea `/feature-interview` handoffs all live there. Keep it open after confirmation as a working hub: copy each idea's `/feature-interview <topic>` prompt and its additional context into `/feature-interview` one at a time.

Writing the legacy `tasks/ideas.md` dump is **opt-in**, controlled in two layers that must agree before the file is written:
- **Flag:** `--dump` in `$ARGUMENTS` pre-sets the intent to also append the approved ideas to `tasks/ideas.md`.
- **Gate:** the alignment page's artifact-destination gate confirms the `tasks/ideas.md` write at approval time. Default is no dump.

Only when `--dump` is set and the destination gate approves it (or the user selects the dump option at that gate) append the approved idea set to `tasks/ideas.md` during the confirmed-page write step — do not overwrite existing content. When product-path scope is active, prefix each suggestion with the app name.

Each idea — rendered on the page and in any dump — is grouped by effort level (hours / days / weeks) and includes:
- A specific, actionable title
- A one-line description with the concrete codebase signal (file, pattern, or metric) that motivates it
- The `/feature-interview <topic>` prompt plus the additional context to paste alongside it

## Constraints
- Each suggestion must be specific and actionable — not vague aspirations like "improve testing."
- Include the concrete signal from the codebase that motivates each suggestion (file, pattern, or metric).
- Provide the `/feature-interview <topic>` prompt the user can copy-paste to kick off planning.
- Limit to 3–5 suggestions per effort level to avoid overwhelming the user.
- Do not suggest changes that conflict with patterns established in CLAUDE.md.
- Do not repeat work already tracked in `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, or `specs/` (or `specs/{slug}/`).


## Briefing Slides Review Surface

Follow the shared briefing-slides convention via the packaged convention resolver. When this skill creates or amends a dense review artifact, keep building and updating the dense `alignment/*.html` and/or `interrogation/*.html` pages exactly as this skill already requires. Also build or update `briefing-slides/brainstorm-{topic}.html` as the primary human review UI.

Treat the briefing slide deck as the artifact to open for review. Link the dense pages, source documents, and any other context artifacts from slide reference chips or other clickable slide elements so reviewers can drill into detail without losing the slide-first review flow.

The compiled deck YAML must route back to `/brainstorm`. Include the dense review pages and source artifacts in `reference_pages` / `source_artifacts`, preserve unanswered gates and slide feedback, and only mark the deck ready when the slide gates are approved.

After artifact creation or amendment, attempt to open only the briefing slide deck. Do not auto-open the linked dense pages.
## Interrogation Page

Follow the shared interrogation-page convention via the packaged convention resolver; output path is `interrogation/brainstorm-r{N}-{branch}.html`. Before producing research, run the stage-zero interrogation loop, starting with the assumptions manifest as round 1, and loop until the confidence gate passes. This skill **cannot advance to stage one until** the confidence gate passes with at least one completed interrogation round and every interview area covered or waived. Each round page must contain at least one genuinely open input (`data-open-input`).

## Quick Mode (--quick)

When `--quick` is present in `$ARGUMENTS`, skip the stage-zero interrogation loop and the alignment page entirely and run the legacy lightweight path:

1. **Light scoping.** If a focus area is already supplied in `$ARGUMENTS`, skip straight to analysis. Otherwise optionally ask 1–3 light scoping questions with `AskUserQuestion` (ideation focus, effort/risk appetite, off-limits areas) — no HTML, no confidence gate.
2. **Analyse the same dimensions** as `### 3. Generate the idea set`, scoped by the focus area or the light answers.
3. **Output suggestions inline**, grouped by effort level (hours / days / weeks). Each suggestion carries its specific actionable title, the concrete codebase signal (file, pattern, or metric) that motivates it, and the `/feature-interview <topic>` prompt to copy.
4. **Append directly to `tasks/ideas.md`** — do not overwrite existing content. When product-path scope is active, prefix each suggestion with the app name. There is no artifact-destination gate in quick mode; `--dump` is implied and redundant.

Still honor the `## Follow-up Skill Availability Gate`: if `feature-interview` is unavailable, the install prerequisite leads both the inline output and the `tasks/ideas.md` append.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
