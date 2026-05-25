---
name: youtube-concept-research
description: Research a proposed YouTube video concept against successful direct and adjacent content, then extract evidence-backed lessons, concept variants, packaging directions, and differentiated execution guidance
type: research
version: v0.1
argument-hint: "\"<video concept>\" [--channel <slug>] [--comparables N] [--angle search|browse|packaging|retention|format|all]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# YouTube Concept Research

Invoke as `/youtube-concept-research`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Research a proposed YouTube video concept before scripting or production. Start from the user's idea, find successful direct and adjacent videos, explain what likely worked from public evidence, and translate the lessons into differentiated concept directions. Use `/youtube-competitive-research` when the user already has specific reference videos and wants to know why they worked. Use `/youtube-search-positioning` when the task is only keyword/search opportunity research.

## Inputs

- Required: a video concept, rough title, thesis, audience question, or topic idea.
- Optional `--channel <slug>`: compare the concept against existing channel evidence under `research/youtube/data/<slug>/` and strategy artifacts such as channel audit, portfolio, peer benchmark, positioning, or programming.
- Optional `--comparables N`: target number of comparable videos to inspect. Default 8, max 20.
- Optional `--angle search|browse|packaging|retention|format|all`: default `all`.

## Workflow

1. Parse the concept into:
   - audience job: problem, desire, identity, fear, curiosity, or aspiration served.
   - content promise: what the viewer expects to learn, feel, decide, or see resolved.
   - likely discovery mode: search, browse/home, suggested, Shorts, or community/fandom.
   - adjacent spaces: same topic, same audience job, same format, and counter-positioned angles.
   - constraints: creator fit, product/brand fit, production feasibility, and claims needing external verification.
2. Build a query set. Include direct topic queries, problem/search-intent queries, browse-curiosity phrasings, adjacent-category analogs, and same-format/different-niche examples.
3. Find public comparable videos through YouTube search, available local tooling, or supplied URLs. Include:
   - direct comparables on the same topic.
   - audience-job comparables serving the same viewer need.
   - format comparables with a transferable structure.
   - counter-position comparables that prove a different angle can work.
4. Require `yt-dlp` for public metadata when video URLs are selected:

   ```bash
   command -v yt-dlp
   ```

5. Select a transcript Python interpreter. Prefer a workspace-local `.venv`; create it if missing. Install `youtube-transcript-api` into `.venv` only when the import check fails and network access is available.
6. Persist raw evidence under `research/youtube/data/<video-id>/`:
   - `metadata-YYYY-MM-DD.json`: raw `yt-dlp --dump-json "VIDEO_URL"` output.
   - `transcript/<video-id>.json`: raw transcript JSON when available.
   - `transcript/transcript-summary.json`: transcript text or failure reason.
   - `api/comment-threads-YYYY-MM-DD.json`: optional public comments when an already-authorized API path is available.
7. Score each comparable for usefulness, not just raw popularity:
   - views/day or recent momentum.
   - apparent outlier status relative to the channel when public channel evidence is available.
   - title/thumbnail promise clarity.
   - transcript/structure evidence availability.
   - audience overlap with the concept.
   - discovery-mode fit.
   - production feasibility for the user's channel.
8. Analyze market lessons:
   - Packaging: title pattern, thumbnail promise, specificity, stakes, novelty, expectation match, and avoidable clickbait.
   - Search/browse fit: whether the concept should lean toward query satisfaction, curiosity, identity, trend, story, or suggested-video adjacency.
   - Hook and retention: first 30-60 seconds, setup length, proof, tension loops, examples, pattern changes, payoff, and CTA.
   - Format: essay, tutorial, teardown, case study, build-in-public, experiment, challenge, reaction, documentary, interview, Shorts, or hybrid.
   - Audience signal: comment themes only when comments were captured; separate praise, objections, confusion, requests, and noise.
9. Produce 3-5 concept variants. At minimum include the best search-led, browse-led, and differentiated/counter-positioned variants when evidence supports them.
10. Recommend one primary direction and explain what to adapt, avoid, or counter-position. If the evidence is weak, recommend the minimum follow-up research rather than over-committing.

## Output

Write:

```text
research/youtube/concept-research-<slug>-YYYY-MM-DD.md
```

Use this structure:

```markdown
# YouTube Concept Research - [Concept]

> Concept: [user concept]
> Channel: [slug or not provided]
> Date captured: YYYY-MM-DD
> Evidence: [raw paths and search notes used]
> Angle: search / browse / packaging / retention / format / all

## Evidence Coverage

| Comparable | Type | Metadata | Transcript | Comments | Notes |
|---|---|---|---|---|---|
| [Title](URL) | Direct / audience-job / format / counter-position | Available / Missing | Available / Missing | Available / Missing / Not requested | ... |

## Concept Brief

[Audience job, promise, likely discovery mode, constraints, and claims needing verification.]

## Search And Discovery Map

| Query / surface | Intent | Evidence | Opportunity | Caveat |
|---|---|---|---|---|
| ... | Search / browse / suggested / Shorts / community | ... | ... | ... |

## Comparable Performance Snapshot

| Video | Published | Duration | Views | Likes | Comments | Views/day | Comparable value |
|---|---|---:|---:|---:|---:|---:|---|
| ... | ... | ... | ... | ... | ... | ... | Direct / audience-job / format / counter-position |

## Why These Videos Likely Worked

1. [Hypothesis] - [public evidence]
2. [Hypothesis] - [public evidence]
3. [Hypothesis] - [public evidence]

## Audience Jobs And Market Pattern

[What viewers repeatedly respond to, what category promises are common, and what gaps remain.]

## Packaging Lessons

- **Title patterns**: ...
- **Thumbnail promises**: ...
- **Specificity and stakes**: ...
- **Expectation match risks**: ...

## Hook, Structure, And Retention Lessons

- **Opening 30-60 seconds**: ...
- **Proof and examples**: ...
- **Tension / payoff**: ...
- **CTA / ending**: ...

## Concept Variants

| Variant | Discovery mode | Core promise | Evidence | Risk | Recommendation |
|---|---|---|---|---|---|
| ... | Search / browse / suggested / Shorts / community | ... | ... | ... | ... |

## Recommended Direction

[Primary concept direction, why it is strongest, what to adapt, what to avoid, and how to differentiate.]

## Title And Thumbnail Territories

| Territory | Example title pattern | Thumbnail direction | Evidence | Risk |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

## Draft Video Architecture

[High-level outline only: hook, setup, proof/examples, turn, payoff, CTA. Do not write a full script unless explicitly asked.]

## Risks Of Copying

[What would be derivative, off-brand, unsupported by evidence, or risky to imitate.]

## Open Questions And Evidence Gaps

[Missing transcript, missing comments, uncertain search demand, absent owner analytics, private metrics unavailable, or factual claims needing independent verification.]
```

## Constraints

- Separate observed public evidence from performance hypotheses and recommendations.
- Do not treat public views as proof of CTR, retention, satisfaction, revenue, subscriber conversion, or profitability.
- Do not infer private YouTube Studio metrics unless the user provides them.
- Do not optimize only for clicks; evaluate title/thumbnail promise against likely watch-time and expectation match.
- Do not invent metrics, transcripts, comments, thumbnail details, rankings, or distribution causes.
- Do not recommend copying another creator's title, thumbnail, hook, format identity, or brand. Translate lessons into differentiated execution.
- Date every search/ranking observation and state personalization, geography, and account caveats.
- When the concept relies on factual, legal, medical, financial, political, or current-event claims, recommend independent source verification outside YouTube.
- Do not bypass login walls, bot protections, access controls, or private YouTube Studio data.
- Archive existing canonical artifacts before replacing them under `docs/history/archive/YYYY-MM-DD/HHMMSS/<original-relative-path>`.

## Approved Artifact Handoff

After an approved synthesized write, explicit write/update mode, or any direct artifact mutation:

- List every created or updated synthesized artifact path in the final response.
- State the verification performed, such as readback, schema/check command, or why no executable verification applies for a Markdown-only strategy artifact.
- Check and report the relevant git status for intended artifacts when the project is a git repository. If intended artifacts are modified or untracked, make the next action shipping, committing, or an explicit dirty-artifact handoff before recommending downstream strategy work.
- Do not imply the research workflow is complete while approved artifacts remain untracked or uncommitted unless the user explicitly asked not to ship.
- If stopping for approval before writing, the approval request remains the next action; do not include downstream routing.

## Intent-Aware Routing

Before applying the default `## Next-Skill Routing` sequence, classify the user's immediate intent and route to the missing action that best serves that intent:

- Strategy refresh: recommend the missing or stale positioning, programming, portfolio, metrics, or product-media artifact.
- Recording prep: recommend the missing series spec, script, build proof, walkthrough guide, or validation artifact needed before recording.
- Upload prep: recommend packaging, title/thumbnail, description, chapters, or final metadata work before broader strategy work.
- Performance review: recommend metrics, cadence, portfolio, peer benchmark, or owner-analytics export work before new content planning.
- Owner analytics or private/manual platform evidence: route to an explicit manual/guide handoff instead of inventing unavailable metrics.
- Dirty intended artifacts: route to shipping/commit/handoff first, not another creator strategy skill.

Use the default next-skill sequence only when no stronger user intent, missing artifact, manual blocker, or dirty-artifact handoff applies.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/youtube-concept-research-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Research quality contract.** For research-producing outputs, build the research before polishing the page. Separate and label `claims` (what the report concludes), `evidence` (source, repo artifact or file path, quote or observation, date, and confidence), `inference` (why that evidence supports the claim), `assumptions` (what remains unproven), and `decision impact` (what the user should approve, reject, or correct). Do not collapse evidence and inference into unsupported summary prose.

**No context loss rule.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item -- plus the decision-relevant substance from search logs, interview logs, source notes, repo scans, and approval notes. If a fact, source, caveat, uncertainty, alternative, rejected or lower-confidence finding, or decision rationale appears in a proposed deliverable or research log, it must either appear in the HTML page or be explicitly linked from the exact section that depends on it. The page is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Research translation requirements.** For research outputs, the HTML page must include an evidence matrix, confidence/assumption register, alternatives considered, rejected or lower-confidence findings, source coverage gaps, and downstream implications. The evidence matrix must map each major claim to source or repo evidence, inference, confidence, assumption status, and decision impact. The confidence/assumption register must show which conclusions are evidence-backed, which are provisional, and what evidence would change them.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Research completeness gate.** For research outputs, include a research completeness gate with inline questions asking whether the evidence is sufficient for the recommendation, which claims need more support, and whether missing context could change the recommendation. Place these questions directly under the evidence matrix or recommendation section they govern.

**Source coverage expectations.** For web research, organize source coverage by category rather than citation list alone; use categories such as competitors, pricing, user sentiment, positioning, integrations, and recent activity when relevant to the topic. For repo or codebase research, include file/path evidence and clearly distinguish observed code facts from inferred product, workflow, or user conclusions.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.

**Research-pack translation.** For business, devtool, game, creator, and media research packs, render the claim/evidence/inference/assumption/decision-impact structure, source coverage categories appropriate to the domain, lower-confidence findings, and downstream implications before asking for approval or routing to the next skill.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/youtube-concept-research-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default recommendation: `/youtube-search-positioning` when the selected direction is search-led; `/youtube-format-research` from the `remotion` pack when the winning lesson is structure, editing, pacing, or visual format; `/content-programming` when the concept changes channel strategy or topic pillars; `/video-script` when the concept direction is ready for scripting.

If the default successor already exists and is current, recommend the first missing or stale downstream creator-media artifact in this order:

`/youtube-channel-audit` -> `/youtube-video-audit` -> `/youtube-vid-research` -> `/youtube-concept-research` -> `/youtube-competitive-research` -> `/youtube-title-thumbnail-audit` -> `/youtube-description-optimizer` -> `/youtube-portfolio` -> `/youtube-peer-benchmark` -> `/youtube-search-positioning` -> `/youtube-cadence-diagnosis` -> `/creator-positioning` -> `/content-programming` -> `/series-spec` -> `/product-led-media-map` -> `/creator-metrics-review`

If the sequence is ambiguous, recommend `/creator-positioning` when differentiation is unresolved, `/content-programming` when the issue is future topics, or `/youtube-competitive-research` when the user selected specific competitor videos for deeper analysis.
