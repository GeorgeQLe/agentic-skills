---
name: research-bootstrap
description: Create the standard creator-media research directory structure in the current project, with platform directories, data roots, archive paths, and README index files
type: execution
version: v0.0
argument-hint: "[--platforms youtube,tiktok,...] [--handle <slug>]"
---

# Research Bootstrap

Invoke as `$research-bootstrap`.

Scaffold the standard creator-media research directory structure in the current working directory.

## Inputs

- `--platforms`: comma-separated platforms (default: `youtube`).
- `--handle`: creator slug to pre-create under each platform's data directory.

## Execution

1. Verify `.git` exists in working directory.
2. Create directories:
   - `research/<platform>/` and `research/<platform>/data/` for each platform.
   - `research/<platform>/data/<handle>/` (and `transcripts/` for youtube) if handle provided.
   - `research/creator-platforms/` and `research/creator-platforms/data/`.
   - `research/creator-presence/`.
   - `specs/<platform>/` for each platform.
   - `docs/history/archive/`.
3. Write `README.md` in each platform research directory and `research/README.md` as root index.
4. Add `.gitkeep` in empty leaf directories.
5. Never overwrite existing files or directories.
6. Report created paths.

## Validation

After execution, verify:
- All requested platform directories exist under `research/`.
- `research/creator-platforms/` and `research/creator-presence/` exist.
- `specs/<platform>/` exists for each platform.
- `docs/history/archive/` exists.
- Each platform directory has a `README.md`.
- `research/README.md` indexes all platforms.

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

When this skill produces durable deliverables (research, specs, plans, reports, prototypes, or any document output), build a full-depth HTML alignment page at `alignment/research-bootstrap-{topic}.html`. Use a normalized topic slug derived from the app, feature, research subject, report subject, or output filename.

**Full content requirement.** The alignment page must contain the complete content of every proposed markdown deliverable -- every section, every finding, every detail, every list item. It is a thorough interactive review document, not a summary. Render the full deliverable content in clean, readable HTML with appropriate hierarchy, styling, and navigation. If the skill writes multiple scoped deliverables in one run, build one alignment page that contains all deliverables with anchor-linked navigation.

**Interactive Q&A section.** At the bottom of the page, add a "Decisions & Clarifications" section containing multiple-choice questions for every decision, ambiguity, or clarification the agent needs from the user before finalizing. Each question must use radio-button inputs. Generate questions based on what genuinely needs user input -- do not add filler questions.

**Answer compilation.** Include a "Compile Answers" button that: remains disabled until every question is answered and shows a count of remaining unanswered questions; when clicked while questions remain unanswered, scrolls the viewport to the first unanswered question instead of compiling; when all questions are answered, generates a structured YAML block of all Q&A pairs and displays it in a read-only, click-to-copy textarea.

**Diff highlighting on updates.** When the agent updates an existing alignment page after receiving compiled answers, highlight what changed since the previous version. The agent chooses inline annotation or side-by-side layout per situation.

**Archiving.** Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/research-bootstrap-{topic}.html`.

**Browser open.** Attempt to open the resulting HTML page in the browser and report whether the open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

