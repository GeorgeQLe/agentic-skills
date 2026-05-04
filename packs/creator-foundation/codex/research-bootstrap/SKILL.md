---
name: research-bootstrap
description: Create the standard creator-media research directory structure in the current project, with platform directories, data roots, archive paths, and README index files
type: execution
version: 1.0.0
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
