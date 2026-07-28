---
skill: skill-creator
agent: codex
captured_at: 2026-07-27T20:09:07-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Add Stage 2.5 Thumbnail Generation to YouTube Prelaunch Audit

## Summary

Upgrade `youtube-video-prelaunch-audit` from three thumbnail concepts to three actual, upload-ready title/thumbnail pairs. Stage 2.5 will run after concept and asset-selection approval, embed the generated images in the HTML review page, and require a second approval before Stage 3 confirmation.

## Implementation Changes

- Create/reuse a GitHub Issue, move to an issue-backed non-primary branch, and record the invocation in `prompts/skill-creator/` plus the implementation plan in `tasks/roadmap.md` and `tasks/todo.md`.
- Archive both Claude and Codex `v0.4` skill files, bump the active mirrors to `v0.5`, and update both changelogs.
- Extend inputs with repeatable `--thumbnail-asset <path-or-url>` support while retaining `--thumbnail` compatibility. Also accept explicitly identified attachments and directories.
- Require the agent to inspect every user-pointed asset, limit discovery to those locations, and record whether each asset was used or rejected with a reason.
- Add **Stage 2.5 — Generate Test and Compare Assets**:
  - Stage 2 proposes exactly three distinct titles, thumbnail concepts, and asset allocations.
  - Concept approval triggers Stage 2.5.
  - Use an available image-generation/editing capability to create exactly three upload-ready 1280×720 thumbnails using the approved assets.
  - If that capability is unavailable or a required asset cannot be accessed, stop and request an image-capable session or corrected asset access; never fall back to concepts.
  - Save each generation under `research/youtube/data/<video-id>/prelaunch/test-and-compare/<generation-id>/` with `variant-a`, `variant-b`, `variant-c`, and a manifest containing titles, image paths, source assets, hypotheses, dimensions, and generation provenance.
- Update the existing HTML alignment page after generation to embed all three thumbnails beside their paired titles, source-asset references, hypotheses, and download/open links.
- Keep the page in `review` after Stage 2.5. Only a new compiled approval covering the generated images and titles may enter Stage 3; revision feedback regenerates a new generation directory and preserves prior candidates as evidence.
- Update report, evidence, decision-checklist, final-handoff, and constraint language so successful runs must reference three real thumbnail files rather than concepts.

## Verification and Delivery

- Verify normalized Claude/Codex mirror parity and identical changelogs.
- Run strict version/archive, dependency, next-step-routing, package, task-document, and whitespace audits.
- Add focused readback assertions for Stage 2.5 ordering, asset accounting, exactly-three output enforcement, HTML embedding, capability-stop behavior, and the second approval gate.
- Run `scripts/pack.sh refresh`, regenerate required catalog/showcase artifacts, and verify no unintended runtime-source edits.
- Record results in task history and a ship manifest, commit and push all intended changes, and open/update one ready pull request without merging it.

## Assumptions

- Explicitly pointed assets include CLI paths/URLs, attachments, or natural-language references to specific files or directories.
- All relevant usable pointed assets must be incorporated across the three variants; exclusions must be visible to the user.
- Image generation is mandatory for Stage 2.5 completion.
- YouTube Studio upload and Test and Compare configuration remain manual; the skill produces the files and setup guidance but does not claim to upload them.
