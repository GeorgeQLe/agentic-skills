# Create Remotion skill for launch video generation

| Field | Value |
|-------|-------|
| **Date** | 2026-05-03 23:26:25 UTC |
| **Agent** | claude |
| **Model** | claude-opus-4-6 |
| **Branch** | master |
| **Session** | `5d741321-8973-440e-86e1-74d877c154da` |
| **Entrypoint** | cli |
| **Version** | 2.1.126 |

---

## User _23:26:25_

can you create a remotion related skill in order to determine how we can go from the customer journey and path to the aha moment documentation into a polished and converting launch video and promotional videos?

## User _23:26:51_

can you design and present to me a few options for how to tackle a remotion related skill in order to determine how we can go from the customer journey and path to the aha moment documentation into a polished and converting launch video and promotional videos?

## Assistant _23:26:56_

Let me look at the existing skill structure and any relevant context to give you well-grounded options.

## Assistant _23:27:02_

<details><summary>Tool calls</summary>

- Agent: Explore skill structure and context

</details>

## Assistant _23:28:20_

Good context. Here are three options for a Remotion skill that bridges customer journey/aha moment docs into polished launch and promo videos:

---

## Option A: Single Monolithic Skill — `/launch-video`

**How it works:** One skill that reads `research/journey-map.md`, `research/gtm.md`, and product specs, then outputs a complete Remotion project (script, scene graph, component code, asset manifest) in a single pass.

**Flow:** `/journey-map` → `/gtm` → **`/launch-video`** → manual render + publish

**Pros:** Simple to invoke, one command gets you from docs to video source. Fits the existing "one skill, one deliverable" pattern.

**Cons:** Monolithic skills are brittle for creative work — if you want to iterate on the script without regenerating the entire Remotion component tree, you're stuck. Also bundles two very different concerns (narrative writing and code generation) into one skill.

---

## Option B: Two-Phase Pipeline — `/video-script` + `/video-build`

**How it works:** Phase 1 (`/video-script`) reads journey maps, aha moments, GTM positioning, and creator presence docs to produce a structured video script (scenes, narration, timing, visual direction, CTA placement). Phase 2 (`/video-build`) takes that script and generates the Remotion project — components, compositions, asset references, and a render config.

**Flow:** `/journey-map` → `/gtm` → **`/video-script`** → user approval → **`/video-build`** → render + publish

**Pros:** Natural approval gate between narrative and code. You can iterate on the script (tone, pacing, which aha moment to lead with) before any Remotion code is written. Each skill stays focused. The script becomes a reusable artifact you can hand to a human editor too.

**Cons:** Two invocations instead of one. Slightly more ceremony.

---

## Option C: Interview-Driven Pipeline — `/video-interview` + `/video-script` + `/video-build`

**How it works:** Adds a front-end interview skill (like the existing `/spec-interview` and `/ui-interview` patterns) that asks targeted questions: target audience for this video, key differentiator to emphasize, desired tone, video length, platform constraints (YouTube vs Twitter vs landing page), whether to use screen recordings or motion graphics, etc. Then feeds structured answers into the script and build phases.

**Flow:** **`/video-interview`** → `/video-script` → approval → `/video-build` → render + publish

**Pros:** Captures intent that can't be derived from docs alone (platform, tone, length). Mirrors the proven `spec-interview` → `journey-map` pattern you already have. Best output quality because it fills gaps in the source material.

**Cons:** Most ceremony. Three skills to build and maintain. Might be overkill if the journey map and GTM docs are already rich enough.

---

## My recommendation

**Option B** hits the best tradeoff. The script-vs-code split is a natural seam — you'll always want to review narrative before generating Remotion components. And you avoid the interview overhead since your journey map and GTM docs already capture most of the strategic intent. You could always bolt on the interview later if you find yourself repeatedly correcting the same gaps.

The skills would live in `packs/creator-media/` alongside the YouTube audit skills, with the video script reading from the same `research/` artifacts that `/gtm` and `/journey-map` already produce.

Want me to flesh out any of these options, or should I start planning Option B?

## User _23:30:58_

I like option B and yes, they should live in the creator media pack

## Assistant _23:31:03_

Let me enter plan mode to design these two skills properly before implementing.

## Assistant _23:31:03_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _23:31:06_

Let me explore the existing patterns in the creator-media pack and related skills to design these properly.

## Assistant _23:31:12_

<details><summary>Tool calls</summary>

- Agent: Explore creator-media pack structure

</details>

## Assistant _23:33:07_

Good, I have a thorough picture of the pack patterns. Let me design the implementation plan.

## Assistant _23:33:27_

<details><summary>Tool calls</summary>

- Agent: Design video-script and video-build skills

</details>

## Assistant _23:37:10_

I have a thorough design. Let me read a couple of critical files to verify details before finalizing the plan.

## Assistant _23:37:11_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/packs/creator-media/PACK.md`

</details>

## Assistant _23:37:12_

<details><summary>Tool calls</summary>

- Bash: List all creator-media skill directories

</details>

## Assistant _23:37:13_

<details><summary>Tool calls</summary>

- Bash: List docs directory contents

</details>

## Assistant _23:37:18_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skill-next-step-contracts.md`

</details>

## Assistant _23:37:18_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-reference.md`

</details>

## Assistant _23:37:24_

<details><summary>Tool calls</summary>

- Read `/Users/georgele/projects/tools/agentic-skills/docs/skills-reference.md`

</details>

## Assistant _23:37:27_

Good, I have all the context I need. Let me write the final plan.

## Assistant _23:38:33_

<details><summary>Tool calls</summary>

- Write `/Users/georgele/.claude/plans/indexed-stirring-karp.md`

</details>

## Assistant _23:38:36_

<details><summary>Tool calls</summary>

- ToolSearch

</details>

## Assistant _23:38:44_

The plan covers 4 new files (claude + codex SKILL.md for each skill) and updates to 33 existing files (PACK.md, skills-reference, next-step-contracts, and all 30 existing creator-media routing chains). The two skills chain as `/video-script` → user approval gate → `/video-build` → render + publish tasks.

Key design decisions in the plan:
- **Enhancement tiers** in video-script so it degrades gracefully when not all upstream artifacts exist
- **Four video types** (launch, explainer, demo, testimonial) via `--type` flag — same pipeline, different narrative arc templates
- **Dual output from video-build** — both a reviewable spec doc and a scaffolded Remotion project directory
- **Post-build task routing** — render commands to todo.md, human actions (footage, upload) to manual-todo.md, performance reviews to recurring-todo.md

## Assistant _23:38:44_

<details><summary>Tool calls</summary>

- ExitPlanMode

</details>

## User _23:39:09_

[Request interrupted by user for tool use]
