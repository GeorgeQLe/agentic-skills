---
skill: youtube-derivative-cuts
agent: codex
captured_at: 2026-06-15T10:08:05-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Add `youtube-derivative-cuts` Skill

## Summary
Create a mirrored `youtube-ops` pack skill named `youtube-derivative-cuts` for programming a derivative content slate from one long YouTube source video. The skill will inspect source metadata, transcript/chapters, existing audits, portfolio evidence, and metrics artifacts, then produce a prioritized cut plan. It will not perform editing, thumbnail design, upload actions, or full metadata optimization.

## Key Changes
- Add `packs/youtube-ops/{codex,claude}/youtube-derivative-cuts/SKILL.md` with:
  - `type: research`, `version: v0.0`, `context_intake: artifact_only`.
  - Codex invocation: `$youtube-derivative-cuts`.
  - Inputs: `<video URL | video ID | source audit path>` plus optional evidence paths for audit, portfolio, metrics, transcript, chapters, and max Shorts count.
  - Existing staged research/alignment workflow copied from adjacent YouTube research skills.
- Define canonical output:
  - Markdown: `research/youtube/derivative-cuts-<video-id>-YYYY-MM-DD.md`.
  - Alignment page: `alignment/youtube-derivative-cuts-{topic}.html`.
  - Required sections: source intake, evidence coverage, cut candidates, priority order, packaging notes, publish sequence, checkpoint review, measurement plan, and handoffs.
- Add cut-selection rules:
  - Separate companion clips from Shorts.
  - Prefer clean thought boundaries, defensible context, trim-only feasibility, and source-video linkage.
  - Include handles: timestamp start/end, estimated duration, quote/topic boundary, rationale, expected audience job, risk, and required human check.
  - Default release plan: companion clip first, then 3-5 Shorts, then checkpoint review.
- Add packaging scope:
  - Draft standalone title options, first-line hooks, short descriptions, and source-video links.
  - Hand off thumbnail design to `youtube-title-thumbnail-audit` and upload-ready description optimization to `youtube-description-optimizer`.
- Add measurement scope:
  - Track views, subs gained/lost, comments, returning viewers, audience retention where available, long-form spillover, source-video traffic, and series-level learning.
  - Explicitly state that Shorts views alone are insufficient success evidence.

## Integration
- Update `packs/youtube-ops/PACK.md`, `README.md`, and `docs/skills-reference.md` to list the new skill.
- Update `packs/youtube-ops/{codex,claude}/youtube/SKILL.md` routing:
  - Add intent signals like “clips,” “Shorts from this video,” “derivative cuts,” “repurpose long video,” and “publish sequence.”
  - Route derivative slate planning to `youtube-derivative-cuts`.
- Add benchmark coverage:
  - Register `youtube-derivative-cuts` in `tests/harness/bench-coverage.ts`.
  - Add a pack workflow fixture in `tests/layer4/setups/packs/pack-workflows.setup.ts` checking for candidate timestamps, companion/Shorts distinction, publish sequence, and measurement beyond views.
- During execution, capture the visible prompt under `prompts/youtube-derivative-cuts/` per repo prompt-history rules, then update `tasks/roadmap.md` and `tasks/todo.md` before implementation.

## Test Plan
- Readback both new `SKILL.md` files and verify `version: v0.0`, mirrored content, and Codex `Invoke as` line.
- Run targeted checks:
  - `rg -n "youtube-derivative-cuts" packs README.md docs tests`
  - `pnpm --dir tests bench:coverage`
  - `./scripts/skill-mirror-parity-audit.sh`
  - `./scripts/skill-pack-routing-audit.sh`
- Refresh and validate Skills Showcase data:
  - `node apps/skills-showcase/scripts/generate-skills-showcase-data.mjs`
  - `node apps/skills-showcase/scripts/generate-skills-showcase-github-data.mjs`
  - `apps/skills-showcase/scripts/validate-skills-showcase-data.sh`
- Review `git status --short`, stage only intended files, commit on primary branch, and push.

## Assumptions
- The skill belongs in `youtube-ops`, not `creator-foundation` or `remotion`.
- The chosen command name is `youtube-derivative-cuts`.
- The output is a programming artifact, not an editing plan or upload automation artifact.
- Missing analytics, transcripts, chapters, or audits should be recorded as evidence gaps, not invented or worked around with unsupported claims.
