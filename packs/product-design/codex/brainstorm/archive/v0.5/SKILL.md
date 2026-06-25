---
name: brainstorm
description: Evaluate the codebase and suggest ideas to explore with $feature-interview
type: planning
version: v0.5
required_conventions: [alignment-page, interrogation-page]
argument-hint: "[optional focus area] [--dump]"
context_intake: scoped
visual_tier: prototype
---

# Brainstorm

Invoke as `$brainstorm`.

Evaluate the current codebase and generate actionable suggestions that the user can take into `$feature-interview` for human/agent alignment, planning-destination triage, and follow-up specification or roadmap work.

This skill runs a three-stage flow by default: a **stage-zero HTML interrogation loop** elicits the ideation frame, then the agent generates the idea set, then an **always-on HTML alignment page** presents that idea set as a review/approval hub with a copyable `$feature-interview` handoff per idea. Writing the legacy `tasks/ideas.md` dump is opt-in (`--dump` flag plus the alignment page's artifact-destination gate).

## Follow-up Skill Availability Gate

Before listing any `$feature-interview` prompts, verify that `feature-interview` is available through at least one of these signals:

- `.agents/project.json` has `enabled_skills.feature-interview`.
- `.agents/project.json` has an enabled pack that provides `feature-interview`; use `scripts/pack.sh which feature-interview` when available to identify the provider.
- A local or global skill file exists, such as `.codex/skills/feature-interview/SKILL.md`, `.claude/skills/feature-interview/SKILL.md`, `~/.codex/skills/feature-interview/SKILL.md`, or `~/.claude/skills/feature-interview/SKILL.md`.

If `feature-interview` is unavailable, the first line of the displayed output and the first line appended for this run in `tasks/ideas.md` must be:

```bash
npx skillpacks install feature-interview
```

Then tell Codex users to start a fresh Codex CLI session if `$feature-interview` remains unavailable after install. Put this prerequisite before any brainstorm suggestion or `$feature-interview <topic>` prompt.

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

1. Read CLAUDE.md, README, package config, and key source files to understand the project.
2. Check `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md` (when they exist), and specs from `specs/` (or `spec.md`) if they exist — avoid suggesting things already planned or deferred as advisory records. Read `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) if it exists — competitor gaps, market white space, and positioning weaknesses are high-signal inputs for ideation. Read `research/customer-feedback.md` (or `research/{slug}/customer-feedback.md`) if it exists — "Wrong" and "New" findings are highest-signal ideation input. Read `research/metrics.md` (or `research/{slug}/metrics.md`) if it exists — instrumentation gaps can generate ideas.

### Stage-zero interrogation loop

This skill **cannot generate the idea set until the confidence gate passes.** Before brainstorming, elicit the ideation frame in HTML interrogation rounds (see `## Interrogation Page` / `INTERROGATION-PAGE.md` in this skill's directory). Terminal questioning is the degraded fallback only when an HTML page cannot be opened.

- **Round 1 — Ideation Frame Manifest.** Present what you think the project is and how you intend to brainstorm it, as confirm/correct/flag controls in `interrogation/brainstorm-r1-{branch}.html`, alongside the first genuinely open questions (each marked `data-open-input`) placed only where no assumption is derivable. Tag each assumption `[from prompt]`, `[from repo]`, `[from research]`, `[from codebase]`, or `[inferred]`. Cover: project identity and current state; the ideation focus and which dimensions are in or out of scope (strategic/product, improvement, hygiene, market-fit); effort and risk appetite and horizon constraints; areas explicitly off-limits and hard non-goals; what counts as a high-value idea for this project; the target audience or product-path scope; and the riskiest assumptions about where the opportunity lies. Set `data-interrogation-round="1"`, `data-interrogation-gate="continue"`, and the answer sidecar `research/_working/interrogation-brainstorm-r1.yaml` (or `research/{slug}/_working/interrogation-brainstorm-r1.yaml` in product-path mode), open the page, and stop for the compiled round YAML.
- **Rounds 2..N — adaptive follow-ups.** Seed each round from the prior round's compiled answers: drill into corrections, resolve contradictions, and cover any frame area still open. Do not re-ask settled items.
- **Confidence gate / coverage checkpoint.** When every frame area is covered or explicitly waived, set `data-interrogation-gate="coverage-checkpoint"`, render the coverage checkpoint, and advance to idea generation. If the user flags a gap, raise the round number and continue.

Only after the confidence gate passes, analyse the codebase across these dimensions, scoped by the elicited ideation frame:

   **Strategic / Product**
   - New features that would make the project significantly more useful or valuable
   - New workflows or end-to-end automation the project could enable
   - Product line expansion — adjacent use cases, new audiences, or complementary products the core could serve
   - Integration opportunities with external tools, platforms, or APIs that multiply value

   **Improvement**
   - Missing capabilities the architecture is set up for
   - Pain points, rough edges, or manual steps that could be automated
   - Performance bottlenecks or low-hanging optimisations
   - Developer experience friction

   **Hygiene**
   - Technical debt where code has outgrown its design
   - Testing gaps in critical paths
   - Security hardening opportunities

   **Market Fit** (only when `research/icp.md` (or `research/{slug}/icp.md`), `research/mvp-gap.md` (or `research/{slug}/mvp-gap.md`), or `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) exist)
   - ICP alignment — features addressing ICP pain points that are missing or incomplete
   - Journey gaps — steps where the product loses the user or customer
   - Unaddressed MVP gaps from `research/mvp-gap.md` (or `research/{slug}/mvp-gap.md`) not yet in roadmap
   - Competitive white space — features or capabilities no competitor offers well, from `research/competitive-analysis.md` (or `research/{slug}/competitive-analysis.md`) market gaps
   - Competitor leapfrog — specific competitor weaknesses to exploit, or table-stakes features competitors have that you lack
   - Positioning plays — ideas that sharpen differentiation against the competitive landscape
A focus area in `$ARGUMENTS` (anything other than the `--dump` flag and a product-path slug) narrows the dimensions to that area; otherwise cover all dimensions. The elicited frame from the interrogation loop always takes precedence over the raw argument.

After the idea set is generated, present it in the always-on alignment page (see `## Alignment Page`). The page is the durable hub; do not treat a chat dump as the primary surface.

## Output

The **alignment page** (`alignment/brainstorm-{topic}.html`) is the primary, durable artifact — the idea set, its motivating evidence, the review gates, and the per-idea `$feature-interview` handoffs all live there. Keep it open after confirmation as a working hub: copy each idea's `$feature-interview <topic>` prompt and its additional context into `$feature-interview` one at a time.

Writing the legacy `tasks/ideas.md` dump is **opt-in**, controlled in two layers that must agree before the file is written:
- **Flag:** `--dump` in `$ARGUMENTS` pre-sets the intent to also append the approved ideas to `tasks/ideas.md`.
- **Gate:** the alignment page's artifact-destination gate confirms the `tasks/ideas.md` write at approval time. Default is no dump.

Only when `--dump` is set and the destination gate approves it (or the user selects the dump option at that gate) append the approved idea set to `tasks/ideas.md` during the confirmed-page write step — do not overwrite existing content. When product-path scope is active, prefix each suggestion with the app name.

Each idea — rendered on the page and in any dump — is grouped by effort level (hours / days / weeks) and includes:
- A specific, actionable title
- A one-line description with the concrete codebase signal that motivates it
- The `$feature-interview <topic>` prompt plus the additional context to paste alongside it

## Constraints

- Be specific and actionable — no vague aspirations.
- Limit to 3–5 suggestions per effort level.
- Do not suggest changes that conflict with CLAUDE.md conventions.
- Do not repeat work already in `tasks/roadmap.md`, `tasks/todo.md`, `tasks/manual-todo.md`, `tasks/record-todo.md`, `tasks/recurring-todo.md`, or `specs/` (or `specs/{slug}/`).

## Interrogation Page

Before producing research, run the stage-zero interrogation loop following `INTERROGATION-PAGE.md` in this skill's directory. Build one HTML page per round at `interrogation/brainstorm-r{N}-{branch}.html`, starting with the assumptions manifest as round 1, and loop until the confidence gate passes. This skill **cannot advance to stage one** (the framework/scope alignment page) **until** the confidence gate passes with at least one completed interrogation round and every interview area covered or waived. Each round page must contain at least one genuinely open input (`data-open-input`).

## Alignment Page

By default, this skill reports results inline and writes only its normal durable artifacts (for example `tasks/*.md`, reports, queues, benchmark notes, status docs, or other skill-specific files). Do not build an alignment page automatically. Create `alignment/brainstorm-{topic}.html` only when the user explicitly requests an alignment page or when you explicitly identify a concrete clarification/review need that cannot be handled cleanly inline; when you create one, follow `ALIGNMENT-PAGE.md` in this skill's directory.

## Default Shipping Contract

Follow the shared shipping contract convention in CLAUDE.md.
