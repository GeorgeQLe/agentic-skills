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

When this skill prepares approval-gated durable planning, research, spec, task, prototype, report, or document deliverables, build a custom HTML alignment preview page at `alignment/research-bootstrap-{topic}.html` before asking the user to approve the canonical write; treat the HTML page as a review preview, not the canonical synthesized deliverable. Point the user to the page, summarize the recommended output and file changes, ask what questions or adjustments they have, and write or update the canonical files only after approval. For non-approval durable output writes, also build the custom HTML alignment page at `alignment/research-bootstrap-{topic}.html`. Use a normalized topic slug from the app, feature, research subject, report subject, or output filename. If the skill writes multiple scoped deliverables in one run, either write one alignment page per scope or one overview page that links each scope. Before replacing an existing alignment page, archive it to `docs/history/archive/YYYY-MM-DD/HHMMSS/alignment/research-bootstrap-{topic}.html`. Attempt to open the resulting HTML page in the browser and report whether the browser open succeeded or was blocked. A blocked browser-open attempt does not make the skill fail when the files were written correctly.

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
