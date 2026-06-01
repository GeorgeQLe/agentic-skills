# remove-research-bootstrap-skill

| Field | Value |
|-------|-------|
| **Date** | 2026-05-27 18:32:16 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `27ddec76-cd11-43fc-8f7d-f03fc7488b52` |
| **Entrypoint** | cli |
| **Version** | 2.1.152 |

---

## User _18:32:16_

Implement the following plan:

# Remove research-bootstrap and patch creator-media skills

## Context

The `research-bootstrap` skill exists only to scaffold a directory tree (`research/youtube/`, `research/creator-platforms/`, etc.) before other skills run. Business-discovery skills (icp, competitive-analysis, metrics) already self-create `research/` when it's missing. Customer-lifecycle skills are gated behind ICP which creates the directory. The only skills that lack self-creation instructions are creator-media skills (youtube-ops, creator-foundation, remotion packs). Rather than keeping a dedicated bootstrapping skill, we'll add a one-liner to each creator-media skill so they self-create their output directories.

## Changes

### 1. Delete research-bootstrap skill (3 locations)

- `global/claude/research-bootstrap/SKILL.md` (+ archive/)
- `global/codex/research-bootstrap/SKILL.md` (+ archive/) if exists
- `packs/creator-foundation/claude/research-bootstrap/SKILL.md` (+ archive/)
- `packs/creator-foundation/codex/research-bootstrap/SKILL.md` (+ archive/) if exists

Also remove the global symlink at `~/.claude/skills/research-bootstrap` and `~/.codex/skills/research-bootstrap` if present.

### 2. Patch youtube-ops skills (11 skills)

Add to the output/artifact section of each: "Create the output directory path if it does not exist."

Skills to patch (all under `packs/youtube-ops/claude/`):
- youtube-channel-audit
- youtube-competitive-research
- youtube-concept-research
- youtube-description-optimizer
- youtube-peer-benchmark
- youtube-search-positioning
- youtube-title-thumbnail-audit
- youtube-video-audit
- youtube-vid-research
- youtube-cadence-diagnosis
- youtube-portfolio

Note: `youtube-audit` already has this instruction — no patch needed.

### 3. Patch creator-foundation skills (7 skills)

Same one-liner addition. All under `packs/creator-foundation/claude/`:
- creator-platform-capability-matrix
- creator-metrics-review
- creator-evidence-schema
- content-programming
- product-led-media-map
- creator-presence-dossier
- creator-positioning
- series-spec (writes to `specs/youtube/` — same pattern)

### 4. Patch remotion skills (3 skills)

All under `packs/remotion/claude/`:
- youtube-format-research
- video-script (specs/youtube/)
- video-build (specs/youtube/, src/videos/)

### 5. Mirror to codex

For each patched claude SKILL.md, apply the same change to the corresponding codex SKILL.md if it exists.

### 6. Update references

- Remove `research-bootstrap` from the global skills manifest if one exists
- Remove any "Recommended next skill: /research-bootstrap" references in other skills
- Update `packs/creator-foundation/PACK.md` to remove research-bootstrap from the skill list
- Remove the `research-directory-conventions` skill too? (It references the bootstrap pattern — but it's a conventions reference doc, not an action skill. Keep it but remove any "run /research-bootstrap first" language.)

## Patch pattern

For each skill, find the output/artifact section and add a line like:

> Create the `research/youtube/` directory (and any `data/<slug>/` subdirectories) if they do not exist.

Exact directory path varies per skill — match the skill's output paths.

## Verification

1. `grep -r "research-bootstrap" global/ packs/` returns no hits after cleanup
2. Every patched skill has the directory-creation instruction
3. No broken cross-references remain


If you need specific details from before exiting plan mode (like exact code snippets, error messages, or content you generated), read the full transcript at: /Users/georgele/.claude/projects/-Users-georgele-projects-tools-agentic-skills/b58bd5ad-2837-45ba-b383-8a9119c7d6ea.jsonl

## Assistant _18:32:20_

I'll start by exploring the current state of the research-bootstrap skill and the skills that need patching.

## Assistant _18:32:22_

<details><summary>Tool calls</summary>

- Agent: Explore research-bootstrap locations

</details>

## Assistant _18:33:14_

Good, research-bootstrap only exists in the creator-foundation pack (not in global/). Let me now explore the skills that need patching and delete research-bootstrap in parallel.

## Assistant _18:33:15_

<details><summary>Tool calls</summary>

- Bash: List research-bootstrap files to delete

</details>

## Assistant _18:33:17_

<details><summary>Tool calls</summary>

- Bash: List codex research-bootstrap files

</details>

## Assistant _18:33:20_

<details><summary>Tool calls</summary>

- Bash: Check for global symlinks

</details>

## Assistant _18:33:23_

Now let me explore the youtube-ops and creator-foundation skills to understand their output section patterns. I'll launch parallel agents to read representative samples.

## Assistant _18:33:30_

<details><summary>Tool calls</summary>

- Agent: Read youtube-ops skills

</details>

## Assistant _18:34:09_

<details><summary>Tool calls</summary>

- Agent: Read creator-foundation skills

</details>

## Assistant _18:34:33_

<details><summary>Tool calls</summary>

- Agent: Read remotion skills

</details>

## Assistant _18:34:57_

Good, I have the full picture. Let me read the youtube-audit pattern and a few representative skills to nail the exact insertion points, then execute all changes.

## Assistant _18:34:58_

<details><summary>Tool calls</summary>

- Bash: Find directory creation pattern in youtube-audit

</details>

## Assistant _18:35:00_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/youtube-ops/claude/youtube-audit/SKILL.md`

</details>

## Assistant _18:35:02_

Now let me read the output sections of a few representative skills to understand exactly where to insert. I'll read them in parallel.

## Assistant _18:35:07_

<details><summary>Tool calls</summary>

- Bash: Find output sections in all youtube-ops skills

</details>

## Assistant _18:35:12_

Now I have enough context. Let me read a few key files to make precise edits, then execute all changes. I'll use multiple agents to parallelize the work.

## Assistant _18:35:29_

<details><summary>Tool calls</summary>

- Agent: Patch youtube-ops claude skills

</details>

## Assistant _18:36:22_

<details><summary>Tool calls</summary>

- Agent: Patch creator-foundation skills

</details>

## Assistant _18:36:56_

<details><summary>Tool calls</summary>

- Agent: Patch remotion skills

</details>

## Assistant _18:37:23_

All claude skills patched. Now let me mirror changes to codex versions and handle deletions/reference cleanup in parallel.

## Assistant _18:37:35_

<details><summary>Tool calls</summary>

- Agent: Mirror patches to codex skills

</details>

## Assistant _18:38:56_

All 44 skills patched (22 claude + 22 codex). Now let me delete research-bootstrap and clean up references.

## Assistant _18:38:57_

<details><summary>Tool calls</summary>

- Bash: Delete research-bootstrap skill directories

</details>

## Assistant _18:39:00_

<details><summary>Tool calls</summary>

- Bash: Remove global symlinks for research-bootstrap

</details>

## Assistant _18:39:34_

<details><summary>Tool calls</summary>

- Bash: Find remaining research-bootstrap references

</details>

## Assistant _18:39:38_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/creator-foundation/PACK.md`

</details>

## Assistant _18:39:40_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/packs/creator-foundation/PACK.md`

</details>

## Assistant _18:39:43_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/packs/creator-foundation/PACK.md`

</details>

## Assistant _18:39:45_

Now fix the README reference.

## Assistant _18:39:46_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/README.md`

</details>

## Assistant _18:39:48_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/README.md`

</details>

## Assistant _18:39:51_

Now let me check research-directory-conventions for any "run /research-bootstrap first" language.

## Assistant _18:39:52_

<details><summary>Tool calls</summary>

- Bash: Check research-directory-conventions for bootstrap references

</details>

## Assistant _18:39:54_

<details><summary>Tool calls</summary>

- Bash: Check codex version for bootstrap references

</details>

## Assistant _18:39:57_

Good — no bootstrap references in research-directory-conventions. Let me also check for any "Recommended next skill: /research-bootstrap" across all skills and do a broad grep for any remaining references.

## Assistant _18:39:59_

<details><summary>Tool calls</summary>

- Bash: Final grep for any remaining research-bootstrap references

</details>

## Assistant _18:40:03_

The remaining references are in `tasks/pack-context-audit.md` (a task file) and the skills-data JS files (which are generated). Let me check and fix the task file, and also look at the skills-data files.

## Assistant _18:40:04_

<details><summary>Tool calls</summary>

- Bash: Check task file reference

</details>

## Assistant _18:40:07_

<details><summary>Tool calls</summary>

- Bash: Check apps/docs for references

</details>

## Assistant _18:40:13_

I need to fix: `docs/skills-reference.md`, `tasks/pack-context-audit.md`, and the two `skills-data.js` files (which are generated but should be cleaned up). Let me also check if there's a generation script.

## Assistant _18:40:14_

<details><summary>Tool calls</summary>

- Bash: Check skills-reference.md

</details>

## Assistant _18:40:18_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-reference.md`

</details>

## Assistant _18:40:21_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/skills-reference.md`

</details>

## Assistant _18:40:23_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/tasks/pack-context-audit.md`

</details>

## Assistant _18:40:26_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/tasks/pack-context-audit.md`

</details>

## Assistant _18:40:29_

Now let me handle the skills-data.js files. These are generated assets — let me remove the research-bootstrap entries from both.

## Assistant _18:40:29_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/public/assets/skills-data.js`

</details>

## Assistant _18:40:33_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/public/assets/skills-data.js`

</details>

## Assistant _18:40:37_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/public/assets/skills-data.js`

</details>

## Assistant _18:40:40_

Now find and remove the codex entry in the same file.

## Assistant _18:40:40_

<details><summary>Tool calls</summary>

- Bash: Find remaining bootstrap entries in skills-data.js

</details>

## Assistant _18:40:43_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/public/assets/skills-data.js`

</details>

## Assistant _18:40:45_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/public/assets/skills-data.js`

</details>

## Assistant _18:40:49_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/apps/skills-showcase/public/assets/skills-data.js`

</details>

## Assistant _18:40:53_

Now do the same for the docs copy of skills-data.js.

## Assistant _18:40:54_

<details><summary>Tool calls</summary>

- Bash: Find bootstrap entries in docs skills-data.js

</details>

## Assistant _18:40:57_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-showcase/assets/skills-data.js`

</details>

## Assistant _18:41:01_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/skills-showcase/assets/skills-data.js`

</details>

## Assistant _18:41:06_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-showcase/assets/skills-data.js`

</details>

## Assistant _18:41:09_

Good — the codex bootstrap entry was already removed from the docs copy (the line numbers shifted). Let me verify:

## Assistant _18:41:10_

<details><summary>Tool calls</summary>

- Bash: Verify no remaining bootstrap in docs skills-data

</details>

## Assistant _18:41:12_

Still has the codex entry. Let me read and remove it.

## Assistant _18:41:12_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-showcase/assets/skills-data.js`

</details>

## Assistant _18:41:15_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-showcase/assets/skills-data.js`

</details>

## Assistant _18:41:20_

<details><summary>Tool calls</summary>

- Edit `/Users/georgele/projects/tools/agentic-skills/docs/skills-showcase/assets/skills-data.js`

</details>

## Assistant _18:41:22_

Now let me also check the github-proof-data.js files and run verification.

## Assistant _18:41:24_

<details><summary>Tool calls</summary>

- Bash: Check github-proof-data for references

</details>

## Assistant _18:41:26_

Good. Now run the final verification.

## Assistant _18:41:31_

<details><summary>Tool calls</summary>

- Bash: Run verification checks

</details>

## Assistant _18:41:45_

<details><summary>Tool calls</summary>

- Bash: Verify all patched skills have directory-creation instruction

</details>

## Assistant _18:41:54_

<details><summary>Tool calls</summary>

- Bash: Final comprehensive grep for remaining references

</details>

## Assistant _18:41:57_

All verifications pass. Let me commit and push per the shipping contract.

## Assistant _18:41:58_

<details><summary>Tool calls</summary>

- Bash: Show working tree status

</details>

## Assistant _18:42:00_

<details><summary>Tool calls</summary>

- Bash: Check recent commit style

</details>

## Assistant _18:42:03_

<details><summary>Tool calls</summary>

- Bash: Stage all changes for this commit

</details>

## Assistant _18:42:11_

<details><summary>Tool calls</summary>

- Bash: Commit all changes

</details>

## Assistant _18:42:13_

<details><summary>Tool calls</summary>

- Bash: Push to remote

</details>

## Assistant _18:42:25_

Done. Deleted research-bootstrap (6 files across claude/codex + archives), patched 44 SKILL.md files (22 skills x 2 platforms) with directory-creation instructions, and cleaned up all references in PACK.md, README, skills-reference, skills-data.js, and task files. Pushed to master.

## User _18:57:22_

can you reinstall the global skills?

## Assistant _18:57:24_

<details><summary>Tool calls</summary>

- Bash: Check for install script

</details>

## Assistant _18:57:27_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/init.sh`

</details>

## Assistant _18:57:29_

<details><summary>Tool calls</summary>

- Bash: Reinstall global skills

</details>

## Assistant _18:57:33_

Global skills reinstalled — 6 Claude + 6 Codex core skills. The stale `install-agentic-skills` symlinks (from the earlier rename) were cleaned up automatically. `research-bootstrap` is no longer present.
