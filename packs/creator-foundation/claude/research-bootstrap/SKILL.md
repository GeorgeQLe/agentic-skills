---
name: research-bootstrap
description: Create the standard creator-media research directory structure in the current project, with platform directories, data roots, archive paths, and README index files
type: execution
version: v0.0
argument-hint: "[--platforms youtube,tiktok,...] [--handle <slug>]"
---

## Pack Availability Guard

Before telling the user to run a skill from another project-local pack, check `.agents/project.json.enabled_packs`. If the target pack is not enabled, recommend `/pack install <pack>` instead of the target skill. Global skills are always valid. Skills from this same pack are valid because the current skill is already running from that pack.

# Research Bootstrap

Invoke as `/research-bootstrap`.

Scaffold the standard creator-media research directory structure in the current working directory so all downstream creator-media skills have a consistent place to write artifacts.

## When to use

- First time setting up a creator-media research project.
- Adding a new platform to an existing research workspace.
- Onboarding a new creator handle into an existing platform research tree.

## Inputs

- `--platforms`: comma-separated list of platforms to scaffold (default: `youtube`). Valid values: `youtube`, `tiktok`, `linkedin`, `twitter`, `podcast`, `newsletter`, `blog`, or any kebab-case platform name.
- `--handle`: creator handle or slug to pre-create under each platform's data directory (e.g., `georgele`). Optional — if omitted, only the structural directories are created.

## Process

1. Confirm the current working directory is appropriate (has a `.git` directory or the user confirms this is the right location).

2. Create the research directory tree for each requested platform:

   ```text
   research/<platform>/
   research/<platform>/data/
   ```

   If `--handle` is provided, also create:

   ```text
   research/<platform>/data/<handle>/
   research/<platform>/data/<handle>/transcripts/   # youtube only
   ```

3. Create the multi-platform evidence directories (always, regardless of platform list):

   ```text
   research/creator-platforms/
   research/creator-platforms/data/
   research/creator-presence/
   ```

4. Create the specs tree for each platform:

   ```text
   specs/<platform>/
   ```

5. Create the archive tree:

   ```text
   docs/history/archive/
   ```

6. Write a `README.md` in each platform research directory:

   ```markdown
   # <Platform> Research

   Research artifacts and raw evidence for <platform> creator-media work.

   ## Structure

   - Reports: `research/<platform>/<report-type>-<slug>.md`
   - Raw data: `research/<platform>/data/<handle>/`
   - Specs: `specs/<platform>/`
   - Archive: `docs/history/archive/`

   ## Current state

   No audits yet. Run `/youtube-channel-audit` (or the platform-equivalent) to begin.
   ```

7. Write a root `research/README.md` that indexes all platforms:

   ```markdown
   # Creator Media Research

   This directory contains research artifacts organized by the creator-media research directory conventions.

   ## Platforms

   - [<platform>](./<platform>/README.md)

   ## Cross-platform

   - [Creator platforms](./creator-platforms/) — capability matrix, evidence schema, raw multi-platform data
   - [Creator presence](./creator-presence/) — cross-platform dossiers

   ## Conventions

   See `/research-directory-conventions` for the full directory standard.
   ```

8. Add `.gitkeep` files in empty leaf directories so git tracks the structure.

9. Report what was created, listing every directory and file, and suggest the logical next skill to run.

## Alignment Page

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/research-bootstrap-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation. Durable tracker artifacts, such as `research/assumption-tracker.md`, remain canonical markdown outputs but must also be fully rendered into the alignment page before approval.

**Dark-mode styling.** Use a dark color scheme by default. Base CSS variables: `--bg: #0d1117; --surface: #161b22; --border: #30363d; --text: #c9d1d9; --text-muted: #8b949e; --accent: #58a6ff; --green: #3fb950; --red: #f85149; --orange: #d29922; --purple: #bc8cff;`. Apply `background: var(--bg); color: var(--text);` on body. Use `--surface` for cards, nav, and table headers. Use `--border` for all borders. Use `--purple` for question blocks and gate headings. Use `--accent` for links and section headings. Keep headings `color: #fff` or `var(--accent)` for hierarchy. Question block backgrounds should use `#1c2333`.

**Alignment gates.** Treat gates as explicit review sections inside the HTML page. A gate blocks finalization until its required inline questions are answered and compiled into YAML. Include every gate that applies to the skill output, and include these gate types whenever relevant: evidence coverage, assumptions/confidence, scope/non-goals, candidate/verdict decisions, artifact destination, proposed file changes, coverage checkpoint, and post-approval route.

**Report-only research gates.** For report-only or pre-approval research skills, the alignment page must explicitly contain evidence coverage, assumptions/confidence, recommended path, proposed file changes, and approval gates before any canonical research, spec, or task file is created or updated.


**Required inline questions.** Each gate must contain at least one required inline question placed directly under the content it governs, inside a visually distinct question block. Each question must use radio-button inputs and include two standing options after the skill-generated choices: "Other / None of the above" backed by a multi-line text box for free-form input, and "Need clarification" backed by an optional notes box where the user can explain what is unclear. When any radio option other than "Other" or "Need clarification" is selected, show an optional "Additional notes" text box beneath it so the user can qualify their choice. Generate questions based on what genuinely needs user input -- do not add filler questions. Do not create a separate bottom "Decisions & Clarifications" section.

**Gate YAML contract.** At the bottom of the page, include a "Compile Answers" button that aggregates answers from all inline gate questions throughout the page, including free-text notes. The button remains disabled until every required question has a selection, shows a count of remaining unanswered questions, and scrolls to the first unanswered question if clicked early. When every question is answered, generate a structured YAML block with one item per gate answer using this stable shape: `section`, `gate_type`, `status` (`answered`, `other`, or `needs-clarification`), `answer`, optional `notes`, and optional `target_artifact` or `target_path` when the gate controls file output. Display the YAML in a read-only, click-to-copy textarea.

**Pre-approval stop.** Before user approval, the next action is review of the HTML alignment page, not downstream routing. Ask the user to review the page and provide the compiled YAML answers. Do not include `Recommended next skill`, `Recommended next command`, or downstream routing language until after compiled YAML has been provided and the approved artifacts have been written or updated.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/research-bootstrap-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

## Constraints

- Never overwrite existing files. If a README already exists, skip it and note that it was preserved.
- Never overwrite existing directories or their contents.
- If the project already has a `research/` tree with content, report what already exists and only create missing structure.
- Do not create platform directories that weren't requested — the creator can re-run with additional `--platforms` later.

## Output

A summary of created directories and files, plus a recommended next step:

- For YouTube-first creators: `Recommended next skill: /youtube-channel-audit`
- For multi-platform creators: `Recommended next skill: /creator-platform-capability-matrix`
- If a handle was provided: `Recommended next skill: /youtube-channel-audit <handle>`

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
