---
name: creator-evidence-schema
description: Define normalized creator evidence records, raw evidence paths, confidence fields, privacy notes, and collection constraints for multi-platform audits
type: research
version: v0.0
argument-hint: "[creator or project slug]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Creator Evidence Schema

Invoke as `/creator-evidence-schema`.

## Report-First Approval Gate

Default to report-only: present findings, evidence coverage, assumptions, recommended artifact path, and proposed file changes in a pre-approval alignment page plus a concise conversation summary for user approval before creating or updating canonical research, spec, or task files.

Do not write or overwrite synthesized deliverables until the user explicitly approves, unless the user invoked an explicit write/update/fix mode or clearly asked to write files upfront. Raw evidence capture may be persisted before analysis when reproducibility requires it; report those raw paths separately and still gate synthesized research/report writes.

When stopping for approval, build and attempt to open the alignment preview page first, then ask the user to review it and approve, question, or request adjustments. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language. The approval request itself is the next action. Only emit next-skill routing after the approved artifact has been written or updated.

Define the shared evidence contract for non-YouTube or mixed-platform creator-media work before platform-specific audits or strategy synthesis.

## Workflow

1. Identify the creator, project, platforms, and evidence already present in repo context.
2. Read `research/creator-platforms/capability-matrix.md` if it exists. If it is missing, recommend `/creator-platform-capability-matrix` before collection.
3. Write `research/creator-platforms/evidence-schema.md`.
4. Define raw evidence folders under `research/creator-platforms/data/<platform>/<slug>/`.
5. Define normalized records that future audits can store as JSONL when machine-generated or Markdown tables when manually curated.
6. Record missing metrics, missing bodies, private fields, stale captures, and unavailable transcripts as explicit evidence gaps.

## Collection Methods

Every normalized record must declare exactly one `capture_method` from this vocabulary:

- `export`: owner-provided platform export, CSV, ZIP, or analytics download.
- `manual_snapshot`: user-saved page, screenshot, CSV, Markdown note, copied post text, or manually captured URL list.
- `rss_feed`: RSS, Atom, JSON feed, podcast feed, sitemap, or newsletter feed.
- `public_page_capture`: public unauthenticated page capture with polite retrieval.
- `open_source_tool`: OSS tooling such as feed parsers, Playwright screenshots, `trafilatura`, `yt-dlp`, or allowed public-media tools.
- `free_api`: official free API or public protocol with no paid dependency.

## Raw Evidence Layout

Use this root for source artifacts:

```text
research/creator-platforms/data/<platform>/<slug>/
```

Recommended subpaths:

- `raw/` for original exports, saved HTML, screenshots, copied text, feed payloads, and media metadata.
- `text/` for extracted body text, transcripts, descriptions, and manually cleaned readable content.
- `normalized/` for JSONL or Markdown evidence registers.
- `notes/` for collection notes, privacy redactions, and reviewer observations.

Raw files must be cited by local repo path. Do not summarize private or sensitive raw material into public-facing artifacts unless the user explicitly authorizes it.

## LinkedIn Evidence Baseline

For LinkedIn evidence, allow only these baseline capture paths unless the user has already provided explicit authorization and credentials for a later API lane:

- owner exports or admin exports supplied by the user;
- manual snapshots, screenshots, copied post/article text, or manually captured URL lists;
- public unauthenticated page captures with polite retrieval;
- redacted user-provided files.

LinkedIn personal analytics, company/page analytics, private contacts, private messages, relationship data, sensitive account data, and API-only fields are unavailable unless owner-provided, admin-provided, already authorized, and redacted where needed. Do not use logged-in scraping, bot-protection bypass, paywall access, access-control circumvention, paid API dependency, or private-data collection as a baseline collection path.

Before normalizing LinkedIn records, require `privacy_notes` to state whether private contacts, messages, relationship data, sensitive account data, unrelated personal information, and confidential employer/customer material were redacted, excluded, or absent.

## Normalized Record Fields

Each evidence record must define these fields or record why the field is unavailable:

- `evidence_id`: stable local ID.
- `platform`: source platform.
- `source_type`: post, article, video, podcast, talk, repo, profile, comment, newsletter, press, milestone, or other documented source type.
- `source_url`: canonical URL when available.
- `raw_path`: local raw evidence path.
- `captured_at`: capture date/time.
- `capture_method`: one collection method from this skill.
- `auth_context`: public, owner_export, admin_export, manual, or unknown.
- `terms_risk`: low, medium, or high.
- `title`: title or short label.
- `body_text_path`: path to extracted text if present.
- `published_at`: publication date when available.
- `creator_role`: author, speaker, host, guest, founder, maintainer, commenter, curator, or other documented role.
- `media_type`: text, image, video, audio, code, slide, mixed, or other documented media type.
- `topic_tags`: curated topic tags.
- `content_role`: acquisition, trust-building, proof, education, launch support, community, career signal, or other documented role.
- `metrics`: platform-specific metrics object.
- `metric_confidence`: observed, owner-provided, estimated, or unavailable.
- `evidence_confidence`: high, medium, or low.
- `privacy_notes`: redactions, sensitive fields excluded, private context boundaries, or sharing restrictions.
- `review_notes`: human review notes, conflicts, stale evidence, and quality caveats.

LinkedIn records must use `auth_context` values conservatively: `public` for public unauthenticated captures, `owner_export` for personal exports, `admin_export` for company/page exports or analytics supplied by an authorized admin, and `manual` for user-saved snapshots or notes. Do not normalize private LinkedIn contacts, messages, relationship data, or sensitive account fields unless the user explicitly supplies redacted evidence for that purpose.

## Metrics Object

Metrics are optional and must not be invented. Include only metrics that are directly observed, owner-provided, or clearly marked as estimated.

Allowed metric keys include:

- views
- impressions
- reads
- listens
- likes
- reactions
- comments
- replies
- reposts
- shares
- saves
- clicks
- subscribers
- followers
- engagement_rate

If metrics are unavailable, set `metric_confidence` to `unavailable` and record the gap. If metrics exist but body text is missing, do not infer content-quality causes from performance alone.

## Confidence Guidance

Use `evidence_confidence` consistently:

- `high`: owner export, public repo/API/protocol record, preserved raw artifact, or source URL plus captured raw copy.
- `medium`: manual snapshot, copied text, public page capture, feed item, or evidence with partial raw support.
- `low`: stale snapshot, missing source URL, incomplete raw evidence, conflicting platform fields, or unverifiable manual note.

Use `terms_risk` consistently:

- `low`: export, user-supplied file, RSS/feed, public protocol/API, or public repo evidence.
- `medium`: public page capture or OSS tooling where platform limits, robots rules, or stale snapshots need care.
- `high`: access-controlled, bot-protected, logged-in, paywalled, private, or ToS-sensitive surfaces.

High-risk evidence must recommend manual snapshots, owner exports, or stopping for user-provided files instead of automated capture.

## Output Requirements

`research/creator-platforms/evidence-schema.md` must contain:

- Scope and capture date.
- Source assumptions and exclusions.
- Raw evidence root and recommended subpaths.
- Collection method vocabulary.
- Normalized record schema.
- Metrics object schema.
- Metric confidence and evidence confidence rules.
- Privacy and redaction notes.
- Evidence gap rules for missing metrics, bodies, media, and transcripts.
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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/creator-evidence-schema-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/creator-evidence-schema-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Next-Skill Routing

After writing the artifact, recommend the next contextual creator-media skill in the final response as `Recommended next skill: <command>`.

Default final-response line when no better route is available: `Recommended next skill: /creator-positioning`.

Routing rules:

- If a `/creator-presence-dossier` skill is present or available in the project, emit `Recommended next skill: /creator-presence-dossier` after schema creation for mixed-platform, LinkedIn-first, career signal, career-signal, owned presence, owned-presence, personal website, GitHub-profile, podcast, talk, newsletter, or professional bio work.
- If `/creator-presence-dossier` is absent and strong platform-specific evidence is available, emit the best matching available platform-specific audit skill.
- Preserve the existing YouTube workflow: YouTube-only work with channel evidence may route to `/youtube-channel-audit` or the next YouTube audit; non-YouTube or mixed-platform work should use this foundation before platform-specific audits.
- If `/creator-presence-dossier` is absent and no platform-specific audit fits the available evidence, emit `Recommended next skill: /creator-positioning`.

## Constraints

- Do not mutate external accounts or collect private data.
- Do not bypass bot protections, rate limits, paywalls, login walls, or access controls.
- Do not require paid APIs, privileged platform programs, or logged-in scraping.
- Do not use logged-in LinkedIn scraping, bot-protection bypass, paid API dependency, access-control circumvention, or private-data collection as a baseline path.
- Do not invent optional metrics, bodies, media assets, or transcripts.
- Do not treat missing metrics or missing bodies as failures; record them as evidence gaps.
- Ask the user to redact or exclude private contacts, private messages, sensitive account data, and unrelated personal data before analysis.
- For LinkedIn, also ask the user to redact or exclude relationship data and confidential employer/customer material before analysis.
- Cite raw repo paths and source URLs when available.
