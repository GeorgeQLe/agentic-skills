---
name: creator-platform-capability-matrix
description: Map creator platforms to free/manual evidence sources, available fields, audit depth, operational risk, and recommended next skill
type: research
version: v0.0
argument-hint: "[creator or project slug]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `$pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Creator Platform Capability Matrix

Invoke as `$creator-platform-capability-matrix`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Build the platform evidence foundation for non-YouTube or mixed-platform creator-media work before platform-specific audits.

## Workflow

1. Identify the creator, project, and platforms in scope from the user request and repo context.
2. Prefer free, open-source, owner-provided, and manual evidence paths. Do not require paid APIs, privileged platform programs, logged-in scraping, or access-control bypasses.
3. Write `research/creator-platforms/capability-matrix.md`.
4. Include a row for every platform in the baseline matrix, even when no evidence is currently available.
5. Add extra platform rows only when the repo or user request gives a concrete reason.

## Baseline Platforms

Include these rows:

- LinkedIn personal profile
- LinkedIn company page
- Personal website/blog
- Newsletter
- Podcast
- GitHub
- X/Threads/Instagram/TikTok
- Bluesky/Mastodon

## Collection Methods

Classify every evidence source with one or more of these collection methods:

- `export`: owner-provided platform export, CSV, ZIP, or analytics download.
- `manual_snapshot`: user-saved page, screenshot, CSV, Markdown note, copied post text, or manually captured URL list.
- `rss_feed`: RSS, Atom, JSON feed, podcast feed, sitemap, or newsletter feed.
- `public_page_capture`: public unauthenticated page capture with polite retrieval.
- `open_source_tool`: OSS tooling such as feed parsers, Playwright screenshots, `trafilatura`, or allowed public-media tools.
- `free_api`: official free API or public protocol with no paid dependency.

## Matrix Columns

The matrix must include these columns:

- Platform
- Content types
- Evidence sources
- Collection methods
- Likely fields
- Missing fields
- Metric availability
- Body availability
- Media availability
- Transcript availability
- Peer benchmarking practicality
- Operational risk
- Audit depth
- Recommended next skill

## Platform Guidance

- LinkedIn personal profile: start with owner export plus manual snapshots, public unauthenticated page captures, and user-provided files. Treat profile analytics, search appearances, connection data, private messages, private contacts, relationship data, and sensitive account fields as unavailable unless the owner provides already-redacted evidence.
- LinkedIn company page: start with owner/admin export plus manual snapshots and public unauthenticated page captures. Treat company/page analytics and API fields as unavailable unless owner-provided or already authorized. Treat official LinkedIn API use as a later authorized lane only when credentials, permissions, and scope are already in place.
- Personal website/blog: prefer RSS, sitemap, and public page capture for body text and metadata.
- Newsletter: prefer export, RSS, and public archives. Treat subscribers and private analytics as owner-only.
- Podcast: prefer RSS, public show pages, and manual transcripts. Do not invent transcripts.
- GitHub: use public API, public repo evidence, and manual repo notes for projects and proof assets.
- X/Threads/Instagram/TikTok: prefer manual snapshots and exports. Treat metrics as owner-only unless public counters are visible.
- Bluesky/Mastodon: use public protocol/API where available and respect instance or service limits.

## LinkedIn Baseline

For LinkedIn rows, the default collection lane is owner exports, manual snapshots, public unauthenticated page captures, and user-provided files. Do not attempt logged-in scraping, bot-protection bypass, paywall access, access-control circumvention, or private-data collection.

Before any LinkedIn analysis, require redaction or exclusion of private contacts, private messages, relationship data, sensitive account data, unrelated personal information, and any employer/customer confidential material. If the only available LinkedIn source is high-risk, stop and ask for an owner export, manual snapshot, public unauthenticated capture, or redacted user-provided file.

## Operational Risk

Classify each row as:

- `low`: export, user-supplied files, RSS/feed, public protocol/API, or public repo evidence.
- `medium`: public page capture or OSS tooling where platform limits, robots rules, or stale snapshots need care.
- `high`: access-controlled, bot-protected, logged-in, paywalled, private, or ToS-sensitive surfaces.

High-risk rows must recommend manual snapshots, owner exports, or stopping for user-provided evidence instead of automated capture.

## Output Requirements

`research/creator-platforms/capability-matrix.md` must contain:

- Scope and capture date.
- Source assumptions and exclusions.
- The full capability matrix.
- Evidence gaps by platform.
- Recommended collection order.
- Recommended next skill.

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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/creator-platform-capability-matrix-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. After successful compilation, automatically attempt to copy the YAML to the clipboard with the Clipboard API, display copy status, and display the YAML in a read-only textarea with an explicit "Copy YAML" button. The copy button must retry clipboard copy when supported and fall back to selecting the textarea contents when clipboard access is unavailable or blocked.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/creator-platform-capability-matrix-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default final-response line: `Recommended next skill: $creator-evidence-schema`.

Routing rules:

- If `research/creator-platforms/evidence-schema.md` is missing or stale, emit `Recommended next skill: $creator-evidence-schema`.
- If the evidence schema is current and a `$creator-presence-dossier` skill is present in the project, emit `Recommended next skill: $creator-presence-dossier` for mixed-platform, LinkedIn-first, career-signal, or owned-presence work.
- If the evidence schema is current and strong platform-specific evidence exists, emit the best matching available platform-specific audit skill.
- Preserve the existing YouTube workflow: YouTube-only work with channel evidence may route to `$youtube-channel-audit` or the next YouTube audit; non-YouTube or mixed-platform work must not skip `$creator-evidence-schema`.
- If no platform-specific audit fits the available evidence, emit `Recommended next skill: $creator-positioning`.

## Constraints

- Do not mutate external accounts or collect private data.
- Do not bypass bot protections, rate limits, paywalls, login walls, or access controls.
- Do not use logged-in LinkedIn scraping, paid API dependency, bot-protection bypass, access-control circumvention, or private-data collection as a baseline path.
- Do not imply YouTube-equivalent metrics, transcripts, thumbnails, or benchmarking are available for every platform.
- Record missing metrics, missing bodies, and missing transcripts as evidence gaps.
- Require LinkedIn private contacts, messages, relationship data, sensitive account data, and unrelated personal information to be redacted or excluded before analysis.
- Cite repo paths and source URLs when available.
