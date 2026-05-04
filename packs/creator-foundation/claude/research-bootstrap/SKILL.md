---
name: research-bootstrap
description: Create the standard creator-media research directory structure in the current project, with platform directories, data roots, archive paths, and README index files
type: execution
version: 1.0.0
argument-hint: "[--platforms youtube,tiktok,...] [--handle <slug>]"
---

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
