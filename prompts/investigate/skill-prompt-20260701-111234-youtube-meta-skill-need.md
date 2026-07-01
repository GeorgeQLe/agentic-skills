---
skill: investigate
agent: codex
captured_at: 2026-07-01T11:12:34-04:00
source: user-invocation
prompt_scope: visible-user-invocation
---

A previous agent produced the plan below to accomplish the user's task. Implement the plan in a fresh context. Treat the plan as the source of user intent, re-read files as needed, and carry the work through implementation and verification.

# Investigate YouTube Meta Skill Need

## Summary

Investigate whether a new `youtube-ops` skill should be created for “current YouTube meta for @channel” research, or whether the capability should be implemented as an update to existing skills such as `$youtube`, `$youtube-peer-benchmark`, `$youtube-search-positioning`, `$youtube-concept-research`, and `$youtube-competitive-research`.

No skill implementation will happen until the investigation findings are reviewed and approved.

## Investigation Steps

- Inventory all current non-archived project skills across `.codex/skills`, `.claude/skills`, `base/*`, and `packs/*`, with special focus on `youtube-ops`, `creator-foundation`, `business-research`, `remotion`, and any research-orchestrator patterns.
- Compare the requested workflow against existing YouTube skills:
  - input shape: `@channel`
  - automatic peer discovery
  - relevant search-term discovery
  - breakout/outlier video detection
  - topic, packaging, and format pattern extraction
  - actionable “exploit/avoid/counter-position” recommendations
- Determine whether the best fit is:
  - a new skill, likely `youtube-meta-research`
  - a new `$youtube --meta <channel>` play
  - an extension to `$youtube-peer-benchmark` or `$youtube-search-positioning`
  - no new skill, only improved routing/documentation
- Review staged research, alignment-page, evidence, versioning, prompt-history, and shipping conventions that any future skill change must follow.
- Check feasible public evidence sources and tooling:
  - `yt-dlp` public channel/video metadata
  - transcripts via `youtube-transcript-api`
  - dated YouTube search observations
  - public peer channel metadata
  - user-provided owner analytics only when explicitly supplied
  - no bypassing login walls or private YouTube Studio data

## Decision Criteria

Recommend creating a new skill only if the requested workflow is materially different from existing skills by requiring channel-led meta discovery, automatic peer/search surface construction, and a synthesized opportunity map.

Recommend updating existing skills instead if the gap is mainly routing, sequencing, or output framing.

The investigation report should explicitly answer:

- What existing skill coverage already satisfies the request?
- What gaps remain?
- What artifacts and outputs would the new or updated skill produce?
- What reusable scripts/references, if any, are justified?
- What exact files would need edits if implementation is approved?
- What tests or validation commands would prove the change works?

## Expected Investigation Output

Produce a concise investigation report with:

- Skill inventory findings.
- Gap analysis.
- Recommendation: create, extend, route, or do nothing.
- Proposed skill name, trigger description, argument hint, staged workflow, output structure, and handoff behavior if creation is recommended.
- Implementation plan held for user approval.

If implementation is later approved, first capture the visible prompt history, update `tasks/roadmap.md` and `tasks/todo.md`, then make the approved changes with version/archive/changelog handling where required.

## Verification

- Confirm the inventory covers all active non-archived `SKILL.md` files.
- Confirm no duplicate or overlapping skill already owns the exact workflow.
- Validate any proposed new skill against `skill-creator` guidance and repo conventions.
- If implementation is approved later, run the repo’s relevant skill validation scripts after edits.

## Assumptions

- “All existing skills” means active, non-archived skills in this repository and installed project-local skill directories; archives are consulted only when needed for versioning or convention history.
- The target skill belongs in `packs/youtube-ops` unless investigation shows it should be a router update or cross-pack orchestrator.
- The investigation may recommend a plan, but will not implement or mutate skill files without user approval.
